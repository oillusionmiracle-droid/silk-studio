import { edgeRateLimit } from "./edgeRateLimit.ts";
import {
  boundedText,
  failure,
  HttpError,
  json,
  methodCheck,
  readJson,
  textField,
} from "./http.ts";

export function validateTransaction(data: any, reference: string) {
  if (
    !data ||
    data.status !== "success" ||
    data.reference !== reference ||
    data.currency !== "NGN" ||
    !Number.isSafeInteger(data.amount) ||
    data.amount <= 0 ||
    !(
      typeof data.id === "number" &&
      Number.isSafeInteger(data.id) &&
      data.id > 0
    )
  )
    throw new HttpError(400, "Payment details could not be verified.");
}
async function settle(supabase: any, transaction: any) {
  validateTransaction(transaction, transaction.reference);
  const { data, error } = await supabase.rpc("settle_order_payment", {
    p_reference: transaction.reference,
    p_transaction_id: String(transaction.id),
    p_amount_kobo: transaction.amount,
    p_currency: transaction.currency,
  });
  if (error) {
    if (error.message?.includes("PAYMENT_REJECTED"))
      throw new HttpError(400, "Payment amount or order state does not match.");
    if (error.message?.includes("ORDER_NOT_FOUND"))
      throw new HttpError(404, "Order reference was not found.");
    throw new Error("Payment could not be recorded.");
  }
  if (!data) throw new Error("Payment service returned no confirmation.");
  return data;
}
export function verifyOrderHandler(
  supabase: any,
  secret: string | undefined,
  fetcher: typeof fetch = fetch,
) {
  return async (req: Request) => {
    const method = methodCheck(req);
    if (method) return method;
    try {
      if (!secret) throw new Error("Payment configuration is missing.");
      const limited = await edgeRateLimit(
        supabase,
        req,
        "verify-order",
        30,
        60000,
      );
      if (limited) return limited;
      const body = await readJson(req);
      const reference = textField(body.paystack_ref, "payment reference", 150);
      if (!/^SLK-[A-Za-z0-9-]+$/.test(reference))
        throw new HttpError(400, "Invalid payment reference.");
      const response = await fetcher(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: { Authorization: `Bearer ${secret}` },
          signal: AbortSignal.timeout(15000),
        },
      );
      if (!response.ok) throw new Error("Payment provider is unavailable.");
      const provider = await response.json();
      if (!provider.status)
        throw new HttpError(400, "Payment is awaiting provider confirmation.");
      validateTransaction(provider.data, reference);
      const result = await settle(supabase, provider.data);
      return json({ success: true, reference, ...result });
    } catch (error) {
      return failure(error);
    }
  };
}
export function webhookHandler(supabase: any, secret: string | undefined) {
  return async (req: Request) => {
    if (req.method !== "POST")
      return json({ error: "Method not allowed." }, 405);
    try {
      if (!secret) throw new Error("Payment configuration is missing.");
      const signature = req.headers.get("x-paystack-signature") ?? "";
      if (!/^[a-f0-9]{128}$/i.test(signature))
        throw new HttpError(401, "Invalid signature.");
      const raw = await boundedText(req, 262144);
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-512" },
        false,
        ["verify"],
      );
      const bytes = Uint8Array.from(signature.match(/../g)!, (v) =>
        parseInt(v, 16),
      );
      if (
        !(await crypto.subtle.verify(
          "HMAC",
          key,
          bytes,
          new TextEncoder().encode(raw),
        ))
      )
        throw new HttpError(401, "Invalid signature.");
      let event: any;
      try {
        event = JSON.parse(raw);
      } catch {
        throw new HttpError(400, "Invalid event.");
      }
      if (event.event !== "charge.success") return json({ received: true });
      const result = await settle(supabase, event.data);
      return json({ received: true, ...result });
    } catch (error) {
      return failure(error);
    }
  };
}
