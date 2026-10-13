import assert from "node:assert/strict";
import { test } from "node:test";
import { createOrderHandler } from "../supabase/functions/_shared/createOrder.ts";
import {
  verifyOrderHandler,
  webhookHandler,
} from "../supabase/functions/_shared/payments.ts";
import {
  database,
  client,
  variantId,
  productId,
  customerId,
  otherId,
  adminId,
} from "./helpers/database";
import { detectReferenceFormat } from "../lib/uploadValidation";
const secret = "fixture-paystack-secret";
const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://fixture.test/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-real-ip": "127.0.0.1",
      ...headers,
    },
    body: JSON.stringify(body),
  });
const apparel = (extra = {}) => ({
  customer_name: "Test Customer",
  phone: "08000000000",
  email: "fixture@example.invalid",
  address: "Fixture only",
  area: "Lagos",
  type: "apparel",
  items: [{ variant_id: variantId, quantity: 2 }],
  ...extra,
});
async function signedEvent(data: any, event = "charge.success") {
  const raw = JSON.stringify({ event, data });
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(raw),
  );
  return new Request("https://fixture.test/", {
    method: "POST",
    headers: { "x-paystack-signature": Buffer.from(sig).toString("hex") },
    body: raw,
  });
}
test("real create → signed webhook → duplicate verification settles and deducts stock once", async () => {
  const db = await database();
  try {
    const api = client(db);
    const create = createOrderHandler(api);
    const response = await create(
      request(apparel(), { authorization: "Bearer customer-token" }),
    );
    assert.equal(response.status, 200);
    const order = await response.json();
    assert.equal(order.total, 42500);
    const transaction = {
      id: 101,
      status: "success",
      reference: order.paystack_ref,
      currency: "NGN",
      amount: 4250000,
    };
    const webhook = webhookHandler(api, secret);
    const first = await webhook(await signedEvent(transaction));
    assert.equal(first.status, 200);
    const verify = verifyOrderHandler(api, secret, async () =>
      Response.json({ status: true, data: transaction }),
    );
    const duplicates = await Promise.all([
      verify(request({ paystack_ref: order.paystack_ref })),
      webhook(await signedEvent(transaction)),
      verify(request({ paystack_ref: order.paystack_ref })),
    ]);
    for (const response of duplicates) assert.equal(response.status, 200);
    assert.equal(
      (await db.query<any>("select stock from variants")).rows[0].stock,
      18,
    );
    assert.equal(
      (await db.query<any>("select count(*)::int n from payment_notifications"))
        .rows[0].n,
      1,
    );
    await db.exec(
      `SET ROLE authenticated; SET request.jwt.claim.sub='${otherId}';`,
    );
    assert.equal((await db.query("select * from orders")).rows.length, 0);
    await db.exec(`SET request.jwt.claim.sub='${customerId}';`);
    assert.equal((await db.query("select * from orders")).rows.length, 1);
  } finally {
    await db.close();
  }
});
test("signed underpayment and missing/wrong currency are rejected without mutations", async () => {
  const db = await database();
  try {
    const api = client(db);
    const created = await (
      await createOrderHandler(api)(request(apparel()))
    ).json();
    const webhook = webhookHandler(api, secret);
    for (const tx of [
      {
        id: 102,
        status: "success",
        reference: created.paystack_ref,
        currency: "NGN",
        amount: 100,
      },
      {
        id: 102,
        status: "success",
        reference: created.paystack_ref,
        currency: "USD",
        amount: 4250000,
      },
      {
        id: 102,
        status: "success",
        reference: created.paystack_ref,
        amount: 4250000,
      },
    ])
      assert.equal((await webhook(await signedEvent(tx))).status, 400);
    assert.equal(
      (await db.query<any>("select status from orders")).rows[0].status,
      "pending",
    );
    assert.equal(
      (await db.query<any>("select stock from variants")).rows[0].stock,
      20,
    );
    assert.equal(
      (
        await webhook(
          new Request("https://fixture.test/", {
            method: "POST",
            headers: { "x-paystack-signature": "00".repeat(64) },
            body: "{}",
          }),
        )
      ).status,
      401,
    );
  } finally {
    await db.close();
  }
});
test("custom price ignores client total/quote flags and supports a verified 75% deposit", async () => {
  const db = await database();
  try {
    await db.exec(
      `INSERT INTO products(name,title,slug,category,price,pricing_type) VALUES('Flyers & Handbills','Flyers & Handbills','flyers','PRINT',120,'tier');`,
    );
    const api = client(db);
    const payload = apparel({
      type: "custom",
      client_total: 1,
      is_custom_quote: true,
      pay_full: false,
      specs: {
        service: "Flyers & Handbills",
        service_slug: "flyers",
        quantity: 100,
        options: { size: "A4", sides: "Double-sided", lamination: "None" },
        specs: "A4, double-sided",
      },
    });
    const response = await createOrderHandler(api)(request(payload));
    assert.equal(response.status, 200);
    const order = await response.json();
    assert.equal(order.total, 32400);
    assert.equal(order.amount, 24300);
    assert.equal(order.is_custom_quote, false);
    assert.equal(order.status, "pending");
    const tx = {
      id: 103,
      status: "success",
      reference: order.paystack_ref,
      currency: "NGN",
      amount: 2430000,
    };
    assert.equal(
      (await webhookHandler(api, secret)(await signedEvent(tx))).status,
      200,
    );
    assert.equal(
      (await db.query<any>("select payment_state from orders")).rows[0]
        .payment_state,
      "deposit_paid",
    );
  } finally {
    await db.close();
  }
});
test("invalid quantity, duplicate variant stock, and inactive products cannot reach checkout", async () => {
  const db = await database();
  try {
    const api = client(db),
      handler = createOrderHandler(api);
    for (const qty of [0, -1, 1.5, "2", 10001])
      assert.equal(
        (
          await handler(
            request(
              apparel({ items: [{ variant_id: variantId, quantity: qty }] }),
            ),
          )
        ).status,
        400,
      );
    assert.equal(
      (
        await handler(
          request(
            apparel({
              items: [
                { variant_id: variantId, quantity: 15 },
                { variant_id: variantId, quantity: 15 },
              ],
            }),
          ),
        )
      ).status,
      409,
    );
    await db.exec(
      `UPDATE products SET is_active=false WHERE id='${productId}'`,
    );
    assert.equal((await handler(request(apparel()))).status, 404);
    assert.equal((await db.query("select * from orders")).rows.length, 0);
  } finally {
    await db.close();
  }
});
test("stock shortage after checkout records payment for review without partially deducting", async () => {
  const db = await database();
  try {
    const api = client(db);
    const order = await (
      await createOrderHandler(api)(request(apparel()))
    ).json();
    await db.exec("UPDATE variants SET stock=1");
    const response = await webhookHandler(
      api,
      secret,
    )(
      await signedEvent({
        id: 104,
        status: "success",
        reference: order.paystack_ref,
        currency: "NGN",
        amount: 4250000,
      }),
    );
    assert.equal(response.status, 200);
    assert.equal((await response.json()).requires_review, true);
    const record = (await db.query<any>("select * from orders")).rows[0];
    assert.equal(record.payment_state, "paid");
    assert.equal(record.inventory_state, "review");
    assert.equal(record.status, "pending");
    assert.equal(
      (await db.query<any>("select stock from variants")).rows[0].stock,
      1,
    );
  } finally {
    await db.close();
  }
});
test("failed order-item insertion rolls back the entire order", async () => {
  const db = await database();
  try {
    await db.exec(
      `CREATE FUNCTION reject_fixture_item() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'fixture failure'; END $$; CREATE TRIGGER reject_item BEFORE INSERT ON order_items FOR EACH ROW EXECUTE FUNCTION reject_fixture_item();`,
    );
    assert.equal(
      (await createOrderHandler(client(db))(request(apparel()))).status,
      503,
    );
    assert.equal((await db.query("select * from orders")).rows.length, 0);
  } finally {
    await db.close();
  }
});
test("public callers cannot mutate stock/payment/order rows or self-promote; profiles do not recurse", async () => {
  const db = await database();
  try {
    await db.exec(`SET ROLE anon;`);
    await assert.rejects(
      db.query(`SELECT decrement_stock('${variantId}',-100)`),
      /permission denied/,
    );
    await assert.rejects(
      db.query(`SELECT consume_rate_limit('x',1,1000)`),
      /permission denied/,
    );
    await assert.rejects(
      db.query(`INSERT INTO orders(id) VALUES(gen_random_uuid())`),
      /permission denied/,
    );
    await db.exec(
      `RESET ROLE; SET ROLE authenticated; SET request.jwt.claim.sub='${customerId}';`,
    );
    await db.exec(
      `UPDATE profiles SET full_name='Updated Customer' WHERE id='${customerId}'`,
    );
    await assert.rejects(
      db.query(`UPDATE profiles SET role='admin' WHERE id='${customerId}'`),
      /managed by administrators/,
    );
    await assert.rejects(
      db.query(`SELECT settle_order_payment('ref','123',100,'NGN')`),
      /permission denied/,
    );
    await db.exec(`SET request.jwt.claim.sub='${adminId}';`);
    assert.equal((await db.query("select * from profiles")).rows.length, 3);
  } finally {
    await db.close();
  }
});
test("distributed limiter enforces a single atomic budget and fails closed on errors", async () => {
  const db = await database();
  try {
    const api = client(db);
    const hits = await Promise.all(
      Array.from({ length: 25 }, () =>
        api.rpc("consume_rate_limit", {
          p_key: "fixture",
          p_limit: 10,
          p_window_ms: 60000,
        }),
      ),
    );
    assert.equal(hits.filter((r) => r.data?.allowed).length, 10);
    const bad = {
      ...api,
      rpc: async () => ({ data: null, error: new Error("offline") }),
    };
    assert.equal(
      (await createOrderHandler(bad)(request(apparel()))).status,
      503,
    );
  } finally {
    await db.close();
  }
});
test("unverified provider success and database failure never produce success", async () => {
  const db = await database();
  try {
    const api = client(db);
    const order = await (
      await createOrderHandler(api)(request(apparel()))
    ).json();
    const tx = {
      id: 105,
      status: "success",
      reference: order.paystack_ref,
      currency: "NGN",
      amount: 4250000,
    };
    const mismatch = verifyOrderHandler(api, secret, async () =>
      Response.json({ status: true, data: { ...tx, reference: "SLK-wrong" } }),
    );
    assert.equal(
      (await mismatch(request({ paystack_ref: order.paystack_ref }))).status,
      400,
    );
    const failing = {
      ...api,
      rpc: async (name: string, args: any) =>
        name === "settle_order_payment"
          ? { data: null, error: new Error("database offline") }
          : api.rpc(name, args),
    };
    const handler = verifyOrderHandler(failing, secret, async () =>
      Response.json({ status: true, data: tx }),
    );
    assert.equal(
      (await handler(request({ paystack_ref: order.paystack_ref }))).status,
      503,
    );
    assert.equal(
      (await db.query<any>("select stock from variants")).rows[0].stock,
      20,
    );
  } finally {
    await db.close();
  }
});
test("upload signature validation rejects SVG/HTML masquerading as an image", () => {
  assert.equal(
    detectReferenceFormat(new TextEncoder().encode('<svg onload="alert(1)">')),
    null,
  );
  assert.equal(
    detectReferenceFormat(new TextEncoder().encode("<!doctype html>")),
    null,
  );
  assert.equal(
    detectReferenceFormat(
      new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    ),
    "png",
  );
  assert.equal(
    detectReferenceFormat(new TextEncoder().encode("%PDF-1.7")),
    "pdf",
  );
});

test("admin status mutations require verified payment and preserve payment history", async () => {
  const db = await database();
  try {
    const api = client(db);
    const order = await (
      await createOrderHandler(api)(request(apparel()))
    ).json();
    const denied = await api.rpc("admin_update_order", {
      p_admin_id: customerId,
      p_order_id: order.order_id,
      p_status: "paid",
    });
    assert.match(String(denied.error), /ADMIN_REQUIRED/);
    const unpaid = await api.rpc("admin_update_order", {
      p_admin_id: adminId,
      p_order_id: order.order_id,
      p_status: "paid",
    });
    assert.match(String(unpaid.error), /PAYMENT_REQUIRED/);
    await webhookHandler(
      api,
      secret,
    )(
      await signedEvent({
        id: 106,
        status: "success",
        reference: order.paystack_ref,
        currency: "NGN",
        amount: 4250000,
      }),
    );
    const updated = await api.rpc("admin_update_order", {
      p_admin_id: adminId,
      p_order_id: order.order_id,
      p_status: "confirmed",
    });
    assert.equal(updated.error, null);
    assert.equal(updated.data.status, "confirmed");
    assert.equal(updated.data.status_history.length, 3);
    await db.exec(
      `SET ROLE authenticated; SET request.jwt.claim.sub='${adminId}';`,
    );
    await assert.rejects(
      db.query(`UPDATE orders SET status='paid' WHERE id='${order.order_id}'`),
      /permission denied/,
    );
    await db.exec(
      `UPDATE orders SET admin_notes='Checked' WHERE id='${order.order_id}'`,
    );
  } finally {
    await db.close();
  }
});
test("legacy custom pending orders record payment for pricing review", async () => {
  const db = await database();
  try {
    await db.exec(
      `INSERT INTO orders(type,status,total,server_verified_amount,paystack_ref) VALUES('custom','pending',1,1,'SLK-legacy-fixture')`,
    );
    const response = await webhookHandler(
      client(db),
      secret,
    )(
      await signedEvent({
        id: 107,
        status: "success",
        reference: "SLK-legacy-fixture",
        currency: "NGN",
        amount: 100,
      }),
    );
    assert.equal(response.status, 200);
    assert.equal((await response.json()).requires_review, true);
    assert.equal(
      (await db.query<any>("select inventory_state from orders")).rows[0]
        .inventory_state,
      "review",
    );
  } finally {
    await db.close();
  }
});
test("missing-profile INSERT cannot select admin role, even when the owner ID matches", async () => {
  const db = await database();
  try {
    await db.exec(
      `DELETE FROM profiles WHERE id='${otherId}'; SET ROLE authenticated; SET request.jwt.claim.sub='${otherId}';`,
    );
    await assert.rejects(
      db.query(`INSERT INTO profiles(id,role) VALUES('${otherId}','admin')`),
      /managed by administrators|row-level security/,
    );
    await db.exec(
      `INSERT INTO profiles(id,role) VALUES('${otherId}','customer')`,
    );
    assert.equal(
      (await db.query<any>("select role from profiles")).rows[0].role,
      "customer",
    );
  } finally {
    await db.close();
  }
});
test("notification queue leases a payment once and private assets are owner/admin only", async () => {
  const db = await database();
  try {
    const api = client(db);
    const order = await (
      await createOrderHandler(api)(request(apparel()))
    ).json();
    await webhookHandler(
      api,
      secret,
    )(
      await signedEvent({
        id: 108,
        status: "success",
        reference: order.paystack_ref,
        currency: "NGN",
        amount: 4250000,
      }),
    );
    const first = await api.rpc("claim_payment_notifications", {});
    assert.equal(first.data.length, 1);
    const second = await api.rpc("claim_payment_notifications", {});
    assert.equal(second.data.length, 0);
    await db.exec(
      `INSERT INTO reference_assets(id,user_id,public_id,resource_type,format,original_name) VALUES(gen_random_uuid(),'${customerId}','fixture','raw','pdf','fixture.pdf'); SET ROLE authenticated; SET request.jwt.claim.sub='${otherId}';`,
    );
    assert.equal(
      (await db.query("select * from reference_assets")).rows.length,
      0,
    );
    await db.exec(`SET request.jwt.claim.sub='${customerId}';`);
    assert.equal(
      (await db.query("select * from reference_assets")).rows.length,
      1,
    );
    await db.exec(`SET request.jwt.claim.sub='${adminId}';`);
    assert.equal(
      (await db.query("select * from reference_assets")).rows.length,
      1,
    );
  } finally {
    await db.close();
  }
});
