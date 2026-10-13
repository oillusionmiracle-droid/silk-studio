import { calculateDynamicPricing } from "./pricing.ts";
import { edgeRateLimit } from "./edgeRateLimit.ts";
import {
  failure,
  HttpError,
  json,
  methodCheck,
  quantity,
  readJson,
  textField,
  UUID,
} from "./http.ts";

export function createOrderHandler(supabase: any) {
  return async (req: Request): Promise<Response> => {
    const method = methodCheck(req);
    if (method) return method;
    try {
      const limited = await edgeRateLimit(
        supabase,
        req,
        "create-order",
        20,
        3600000,
      );
      if (limited) return limited;
      const body = await readJson(req);
      const type = body.type ?? "apparel";
      if (!["apparel", "custom"].includes(type))
        throw new HttpError(400, "Invalid order type.");
      let userId: string | null = null;
      const auth = req.headers.get("authorization");
      if (auth) {
        const token = /^Bearer\s+(.+)$/i.exec(auth)?.[1];
        const { data, error } = token
          ? await supabase.auth.getUser(token)
          : { error: true, data: null };
        // Legacy anon JWT sent by supabase.functions.invoke is not a user session.
        if (!error && data?.user) userId = data.user.id;
      }
      const email = textField(body.email, "email", 254, false);
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new HttpError(400, "Invalid email.");
      const files = body.reference_files ?? [];
      if (
        !Array.isArray(files) ||
        files.length > 10 ||
        files.some(
          (f: unknown) =>
            typeof f !== "string" ||
            f.length > 2000 ||
            (!f.startsWith("https://") &&
              !/^\/api\/reference-files\/[0-9a-f-]{36}$/.test(f)),
        )
      )
        throw new HttpError(400, "Invalid reference files.");
      for (const file of files.filter((f: string) =>
        f.startsWith("/api/reference-files/"),
      )) {
        const { data: asset, error } = await supabase
          .from("reference_assets")
          .select("user_id")
          .eq("id", file.split("/").pop())
          .maybeSingle();
        if (error || !asset || !userId || asset.user_id !== userId)
          throw new HttpError(
            403,
            "Reference file does not belong to this account.",
          );
      }
      const order: any = {
        user_id: userId,
        type,
        customer_name: textField(body.customer_name, "customer name"),
        phone: textField(body.phone, "phone", 40),
        email: email || null,
        address: textField(body.address, "address", 1000),
        area: textField(body.area, "area", 100),
        reference_files: files,
        specs: null,
      };
      let items: any[] = [];
      let subtotal = 0;
      let deliveryFee = 0;
      let isQuote = false;
      if (type === "apparel") {
        if (
          !Array.isArray(body.items) ||
          !body.items.length ||
          body.items.length > 100
        )
          throw new HttpError(400, "Order must contain 1–100 variants.");
        const counts = new Map<string, number>();
        for (const item of body.items) {
          if (!item || !UUID.test(item.variant_id))
            throw new HttpError(
              400,
              "A valid variant is required for every item.",
            );
          counts.set(
            item.variant_id,
            quantity(
              (counts.get(item.variant_id) ?? 0) + quantity(item.quantity),
            ),
          );
        }
        // select * works on production variants that have no price/name column.
        const { data: variants, error } = await supabase
          .from("variants")
          .select("*, products(*)")
          .in("id", [...counts.keys()]);
        if (error) throw new Error("Unable to load variants.");
        let totalQuantity = 0;
        for (const [id, qty] of counts) {
          const variant = variants?.find((v: any) => v.id === id);
          const product = Array.isArray(variant?.products)
            ? variant.products[0]
            : variant?.products;
          if (
            !variant ||
            !product ||
            product.is_active === false ||
            ["PRINT", "DESIGN", "WEB", "BUNDLES", "APPAREL"].includes(
              product.category,
            )
          )
            throw new HttpError(404, "Product unavailable.");
          if (
            !Number.isFinite(Number(variant.stock)) ||
            Number(variant.stock) < qty
          )
            throw new HttpError(409, "Insufficient stock.");
          const price = Number(
            Number(variant.price) > 0 ? variant.price : product.price,
          );
          if (!Number.isSafeInteger(price) || price <= 0)
            throw new HttpError(400, "Product price is unavailable.");
          subtotal += price * qty;
          totalQuantity += qty;
          items.push({
            variant_id: id,
            quantity: qty,
            price_at_purchase: price,
          });
        }
        deliveryFee = totalQuantity >= 10 ? 0 : 2500;
      } else {
        const specs = body.specs;
        if (!specs || typeof specs !== "object" || Array.isArray(specs))
          throw new HttpError(
            400,
            "Structured service specifications are required.",
          );
        const service = textField(specs.service, "service", 100);
        const selected = specs.options;
        if (
          !selected ||
          typeof selected !== "object" ||
          Array.isArray(selected)
        )
          throw new HttpError(400, "Service options are required.");
        const qty = quantity(specs.quantity);
        for (const field of ["width", "height"]) {
          if (
            selected[field] !== undefined &&
            (!Number.isFinite(selected[field]) ||
              selected[field] <= 0 ||
              selected[field] > 1000)
          )
            throw new HttpError(400, `Invalid ${field}.`);
        }
        const choices: Record<string, string[]> = {
          size: ["A5", "A4", "A3"],
          sides: ["Single-sided", "Double-sided"],
          lamination: ["None", "Matte", "Gloss"],
          eyelets: ["Yes", "No"],
          innerSheets: ["Plain", "Ruled"],
          binding: ["Spiral", "Perfect Binding"],
          cover: ["Soft Cover", "Hard Cover"],
          idType: ["Standard", "Lanyard + Holder", "Badge Reel + Holder"],
          stock: ["Standard 300gsm", "Super Thick 600gsm"],
          corners: ["Square", "Rounded"],
          paperType: ["Standard", "Brown"],
        };
        for (const [key, values] of Object.entries(choices)) {
          if (selected[key] !== undefined && !values.includes(selected[key]))
            throw new HttpError(400, `Invalid ${key}.`);
        }
        if (
          [
            "custom-tshirts",
            "custom-sweatshirts",
            "custom-joggers",
            "custom-hoodies",
          ].includes(slugForValidation(specs.service_slug))
        ) {
          const sizes = selected.apparelSizes;
          if (
            !sizes ||
            typeof sizes !== "object" ||
            Object.keys(sizes).some(
              (key) => !["S", "M", "L", "XL", "XXL"].includes(key),
            ) ||
            Object.values(sizes).some(
              (v) => typeof v !== "number" || !Number.isSafeInteger(v) || v < 0,
            )
          )
            throw new HttpError(400, "Invalid apparel sizes.");
          const sizeQuantity = (Object.values(sizes) as number[]).reduce(
            (sum, v) => sum + v,
            0,
          );
          if (sizeQuantity !== qty)
            throw new HttpError(
              400,
              "Apparel size quantities must match the order quantity.",
            );
        }
        for (const [key, value] of Object.entries(selected)) {
          if (typeof value === "string" && value.length > 4000)
            throw new HttpError(400, `Invalid ${key}.`);
          if (
            typeof value === "number" &&
            (!Number.isFinite(value) || value < 0)
          )
            throw new HttpError(400, `Invalid ${key}.`);
        }
        const slug = textField(specs.service_slug, "service slug", 100);
        const { data: product, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw new Error("Unable to load service.");
        if (!product) {
          if (!["other", "custom bundle"].includes(service.toLowerCase()))
            throw new HttpError(
              404,
              "Service unavailable. Please contact the studio.",
            );
          isQuote = true;
        } else {
          if (
            !["PRINT", "DESIGN", "WEB", "BUNDLES", "APPAREL"].includes(
              product.category,
            ) ||
            product.is_active === false
          )
            throw new HttpError(404, "Service unavailable.");
          const { data: variants, error: variantError } = await supabase
            .from("variants")
            .select("*")
            .eq("product_id", product.id);
          if (variantError) throw new Error("Unable to load service options.");
          const result = calculateDynamicPricing({
            product,
            variants: variants ?? [],
            quantity: qty,
            specs: selected,
          });
          subtotal = result.subtotal;
          isQuote = result.isCustomQuote;
        }
        order.specs = {
          service,
          service_slug: slug,
          quantity: qty,
          options: selected,
          specs: textField(specs.specs, "specification summary", 2000, false),
          deadline: textField(specs.deadline, "deadline", 100, false),
          description: textField(specs.description, "description", 4000, false),
        };
      }
      if (
        !Number.isSafeInteger(subtotal) ||
        subtotal < 0 ||
        subtotal + deliveryFee > 100000000
      )
        throw new HttpError(400, "Invalid order total.");
      const total = subtotal + deliveryFee;
      const amount = isQuote
        ? 0
        : type === "custom" && body.pay_full === false
          ? Math.round(total * 0.75)
          : total;
      if (!isQuote && amount <= 0)
        throw new HttpError(
          400,
          "A payable order must have a positive amount.",
        );
      Object.assign(order, {
        subtotal,
        delivery_fee: deliveryFee,
        total,
        server_verified_amount: amount,
        status: isQuote ? "quote_requested" : "pending",
        paystack_ref: `SLK-${type === "custom" ? "CUST-" : ""}${crypto.randomUUID()}`,
      });
      const { data, error } = await supabase.rpc("create_order_atomic", {
        p_order: order,
        p_items: items,
      });
      if (error || !data) throw new Error("Order could not be recorded.");
      return json({
        success: true,
        order_id: data.id,
        paystack_ref: order.paystack_ref,
        status: order.status,
        total,
        subtotal,
        delivery_fee: deliveryFee,
        amount,
        is_custom_quote: isQuote,
      });
    } catch (error) {
      return failure(error);
    }
  };
}

function slugForValidation(value: unknown): string {
  return typeof value === "string" ? value : "";
}
