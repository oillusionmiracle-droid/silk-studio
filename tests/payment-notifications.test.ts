import assert from 'node:assert/strict';
import { test } from 'node:test';
import { paymentNotificationHandler, type PaymentReceiptOrder } from '../lib/paymentNotifications';
const order: PaymentReceiptOrder = { id: 'fixture-order', email: 'fixture@example.invalid', paid_amount_kobo: 900000, paystack_ref: 'SLK-fixture', payment_state: 'deposit_paid', inventory_state: 'not_required' };
const config = { serviceKey: 'fixture-service', cronSecret: 'fixture-cron', resendKey: 'fixture-resend' };
const request = (key?: string) => new Request('https://fixture.test/api/payment-notifications', { headers: key ? { authorization: `Bearer ${key}` } : {} });
test('receipt worker rejects public access before reading the queue', async () => {
 let claimed = false;
 const handler = paymentNotificationHandler(config, { claimOrders: async () => { claimed = true; return [order]; }, updateQueue: async () => {} });
 for (const key of [undefined, 'wrong-key']) assert.equal((await handler(request(key))).status, 401);
 assert.equal(claimed, false);
});
test('missing email configuration leaves the outbox untouched', async () => {
 let claimed = false;
 const handler = paymentNotificationHandler({ serviceKey: config.serviceKey }, { claimOrders: async () => { claimed = true; return []; }, updateQueue: async () => {} });
 assert.equal((await handler(request(config.serviceKey))).status, 503);
 assert.equal(claimed, false);
});
test('provider success sends the verified deposit with a stable idempotency key', async () => {
 const updates: any[] = [];
 const handler = paymentNotificationHandler(config, {
  claimOrders: async () => [order], updateQueue: async (id, update) => { updates.push({ id, ...update }); },
  fetcher: async (_url, init) => {
   assert.equal(new Headers(init?.headers).get('Idempotency-Key'), 'payment-fixture-order');
   const body = JSON.parse(String(init?.body));
   assert.deepEqual(body.to, [order.email]); assert.match(body.text, /₦9,000/); assert.match(body.text, /deposit; a balance remains/);
   return Response.json({ id: 'fixture-email' });
  },
 });
 assert.deepEqual(await (await handler(request(config.cronSecret))).json(), { sent: 1, failed: 0 });
 assert.equal(updates.length, 1); assert.ok(updates[0].sent_at); assert.equal(updates[0].last_error, null);
});
test('failed delivery releases the claim and never marks the receipt sent', async () => {
 const updates: any[] = [];
 const handler = paymentNotificationHandler(config, { claimOrders: async () => [order], updateQueue: async (_id, update) => { updates.push(update); }, fetcher: async () => Response.json({ error: 'fixture' }, { status: 503 }) });
 assert.deepEqual(await (await handler(request(config.serviceKey))).json(), { sent: 0, failed: 1 });
 assert.equal(updates[0].sent_at, undefined); assert.equal(updates[0].claimed_until, null); assert.match(updates[0].last_error, /503/);
});
test('unpaid orders and missing recipients cannot produce payment emails', async () => {
 let contacted = false;
 const handler = paymentNotificationHandler(config, { claimOrders: async () => [{ ...order, payment_state: 'unpaid' }, { ...order, email: null }], updateQueue: async () => {}, fetcher: async () => { contacted = true; return Response.json({}); } });
 assert.deepEqual(await (await handler(request(config.serviceKey))).json(), { sent: 0, failed: 2 });
 assert.equal(contacted, false);
});
test('queue failures return a retryable service error', async () => {
 const handler = paymentNotificationHandler(config, { claimOrders: async () => { throw new Error('fixture'); }, updateQueue: async () => {} });
 assert.equal((await handler(request(config.serviceKey))).status, 503);
});
