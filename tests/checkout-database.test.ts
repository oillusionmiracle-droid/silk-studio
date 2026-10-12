import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

const db = new PGlite();
const productId = '10000000-0000-0000-0000-000000000001';
const variantId = '20000000-0000-0000-0000-000000000001';
const secondVariant = '20000000-0000-0000-0000-000000000002';

before(async () => {
  // Match the relevant live schema; run the actual migration and RPCs.
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role;
    CREATE TABLE products (id uuid PRIMARY KEY, price integer NOT NULL, category text NOT NULL, is_active boolean NOT NULL DEFAULT true);
    CREATE TABLE variants (id uuid PRIMARY KEY, product_id uuid REFERENCES products, stock integer NOT NULL);
    CREATE TABLE orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, type text,
      customer_name text NOT NULL, phone text NOT NULL, address text NOT NULL, area text NOT NULL,
      subtotal integer NOT NULL, delivery_fee integer NOT NULL, total integer NOT NULL,
      server_verified_amount numeric, status text NOT NULL, paystack_ref text,
      specs jsonb, reference_files jsonb, status_history jsonb, updated_at timestamptz
    );
    CREATE TABLE order_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES orders,
      variant_id uuid NOT NULL REFERENCES variants, quantity integer NOT NULL, price_at_purchase integer NOT NULL
    );
    CREATE FUNCTION decrement_stock(uuid, integer) RETURNS void LANGUAGE sql AS 'SELECT';
    INSERT INTO products VALUES ('${productId}', 5000, 'tee', true);
    INSERT INTO variants VALUES ('${variantId}', '${productId}', 100), ('${secondVariant}', '${productId}', 100);
  `);
  await db.exec(await readFile(new URL('../supabase/migrations/20261012111500_atomic_checkout_payments.sql', import.meta.url), 'utf8'));
});
after(async () => { await db.close(); });

async function create(reference: string, items = [{ variant_id: variantId, quantity: 2 }]) {
  const order = {
    type: 'apparel', customer_name: 'Test', phone: '08000000000', address: 'Test address', area: 'Lagos',
    status: 'pending', paystack_ref: reference, total: 1, server_verified_amount: 1,
  };
  const result = await db.query<{ order: { id: string; total: number } }>(
    'select create_pending_order($1::jsonb, $2::jsonb) as "order"', [JSON.stringify(order), JSON.stringify(items)]
  );
  return result.rows[0].order;
}
async function finalize(reference: string, amount = 1250000, currency = 'NGN', provider = reference) {
  const result = await db.query<{ payment: { status: string; already_processed: boolean } }>(
    'select finalize_order_payment($1, $2, $3, $4) as payment', [reference, amount, currency, provider]
  );
  return result.rows[0].payment;
}
async function stock() {
  return (await db.query<{ stock: number }>('select stock from variants where id = $1', [variantId])).rows[0].stock;
}

test('apparel prices are database-derived, including delivery', async () => {
  const order = await create('price');
  assert.equal(order.total, 12500);
});
test('underpayment and wrong currency leave status and stock unchanged', async () => {
  await create('underpaid');
  const original = await stock();
  await assert.rejects(() => finalize('underpaid', 100), /amount mismatch/);
  await assert.rejects(() => finalize('underpaid', 1250000, 'USD'), /currency/);
  assert.equal(await stock(), original);
  assert.equal((await db.query<{ status: string }>("select status from orders where paystack_ref = 'underpaid'")).rows[0].status, 'pending');
});
test('duplicate notifications decrement stock once and preserve delivered status', async () => {
  await create('duplicate');
  const original = await stock();
  const results = await Promise.all([finalize('duplicate'), finalize('duplicate')]);
  assert.equal(results.filter(r => !r.already_processed).length, 1);
  assert.equal(await stock(), original - 2);
  await db.exec("update orders set status = 'delivered' where paystack_ref = 'duplicate'");
  assert.equal((await finalize('duplicate')).status, 'delivered');
  assert.equal(await stock(), original - 2);
});
test('deposit amount is enforced for custom orders', async () => {
  await db.query('select create_pending_order($1::jsonb, $2::jsonb)', [JSON.stringify({
    type: 'custom', customer_name: 'Test', phone: '08000000000', address: 'Test', area: 'Lagos',
    status: 'pending', paystack_ref: 'deposit', total: 10000, server_verified_amount: 7500,
  }), '[]']);
  await assert.rejects(() => finalize('deposit', 749999), /amount mismatch/);
  assert.equal((await finalize('deposit', 750000)).status, 'paid');
});
test('duplicate variant lines cannot bypass stock validation', async () => {
  await assert.rejects(() => create('oversell', [
    { variant_id: variantId, quantity: 60 }, { variant_id: variantId, quantity: 60 },
  ]), /insufficient stock/);
  assert.equal((await db.query<{ count: number }>("select count(*)::int as count from orders where paystack_ref = 'oversell'")).rows[0].count, 0);
});
test('legacy custom orders with untrusted prices cannot be verified', async () => {
  await db.exec(`INSERT INTO orders (type, customer_name, phone, address, area, subtotal, delivery_fee, total, server_verified_amount, status, paystack_ref)
    VALUES ('custom', 'Test', '08000000000', 'Test', 'Lagos', 1, 0, 1, 1, 'pending', 'legacy')`);
  await assert.rejects(() => finalize('legacy', 100), /Legacy custom order/);
});
test('stock failure on a later item rolls back earlier inventory changes', async () => {
  await create('stock-failure', [
    { variant_id: variantId, quantity: 2 }, { variant_id: secondVariant, quantity: 2 },
  ]);
  const original = await stock();
  await db.query('update variants set stock = 0 where id = $1', [secondVariant]);
  await assert.rejects(() => finalize('stock-failure', 2250000), /Insufficient stock/);
  assert.equal(await stock(), original);
  assert.equal((await db.query<{ status: string }>("select status from orders where paystack_ref = 'stock-failure'")).rows[0].status, 'pending');
});
test('item insert failure rolls back the parent order', async () => {
  await db.exec(`CREATE FUNCTION fail_item() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Injected item insert failure'; END $$;
    CREATE TRIGGER fail_item BEFORE INSERT ON order_items FOR EACH ROW EXECUTE FUNCTION fail_item();`);
  try {
    await assert.rejects(() => create('failed-items'), /Injected item insert failure/);
    assert.equal((await db.query<{ count: number }>("select count(*)::int as count from orders where paystack_ref = 'failed-items'")).rows[0].count, 0);
  } finally { await db.exec('DROP TRIGGER fail_item ON order_items'); }
});
test('payment update failure rolls back inventory and remains retryable', async () => {
  await create('failed-update');
  const original = await stock();
  await db.exec(`CREATE FUNCTION fail_payment() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Injected payment update failure'; END $$;
    CREATE TRIGGER fail_payment BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION fail_payment();`);
  try {
    await assert.rejects(() => finalize('failed-update'), /Injected payment update failure/);
    assert.equal(await stock(), original);
  } finally { await db.exec('DROP TRIGGER fail_payment ON orders'); }
  assert.equal((await finalize('failed-update')).already_processed, false);
  assert.equal(await stock(), original - 2);
});
test('public clients cannot execute checkout or legacy inventory RPCs', async () => {
  const result = await db.query<{ allowed: boolean }>(`
    select has_function_privilege(role, signature, 'execute') as allowed
    from (values ('anon'), ('authenticated')) roles(role)
    cross join (values
      ('public.create_pending_order(jsonb,jsonb)'),
      ('public.finalize_order_payment(text,bigint,text,text)'),
      ('public.decrement_stock(uuid,integer)')
    ) functions(signature)
  `);
  assert.ok(result.rows.every(row => !row.allowed));
});
