import assert from 'node:assert/strict';
import { test } from 'node:test';
import { positiveQuantity, priceCustomOrder } from '../supabase/functions/_shared/orderPricing';
import { finalizePayment, validatePayment } from '../supabase/functions/_shared/payment';
import type { DbProduct } from '../lib/pricing';

const product: DbProduct = {
  id: 'flyer', title: 'Flyers & Handbills', slug: 'flyers', category: 'PRINT',
  description: '', price: 120, pricing_type: 'tier', is_active: true,
};
const specs = { size: 'A4', sides: 'Double-sided', lamination: 'Matte' };

test('custom pricing uses database price and options despite injected client totals', () => {
  const result = priceCustomOrder(product, [], 100, { ...specs, client_total: 1, price: 1 }, false);
  assert.equal(result.total, 38900);
  assert.equal(result.requiredAmount, 29175);
  assert.equal(priceCustomOrder(product, [], 100, specs, true).requiredAmount, 38900);
  assert.equal(priceCustomOrder({ ...product, price: 200 }, [], 100, specs, true).total, 64800);
});

test('quote eligibility comes from the catalog, never a client flag', () => {
  assert.equal(priceCustomOrder(product, [], 100, { ...specs, is_custom_quote: true }, true).isCustomQuote, false);
  assert.deepEqual(priceCustomOrder({ ...product, is_custom_quote: true }, [], 100, specs, false), {
    total: 0, requiredAmount: 0, isCustomQuote: true,
  });
  assert.throws(() => priceCustomOrder({ ...product, is_active: false }, [], 100, specs, true), /unavailable/);
});

test('rejects invalid quantities, dimensions, unsupported options and missing structured specs', () => {
  for (const qty of [0, -1, 1.5, '2', NaN, Infinity]) assert.throws(() => positiveQuantity(qty));
  assert.throws(() => priceCustomOrder(product, [], 100, 'A4, Matte', true), /Structured/);
  assert.throws(() => priceCustomOrder(product, [], 100, { ...specs, size: 'cheap' }, true), /Invalid size/);
  assert.throws(() => priceCustomOrder(product, [], 100, {}, true), /Missing/);
  assert.throws(() => priceCustomOrder({ ...product, slug: 'banners' }, [], 1, { width: -1, height: -1, eyelets: 'No' }, true), /Invalid width/);
});

const payment = { reference: 'SLK-1', amount: 10000, currency: 'NGN', status: 'success', id: 123 };
test('provider payments require matching reference, success, currency and integer kobo', () => {
  validatePayment(payment, 'SLK-1');
  for (const invalid of [
    { ...payment, reference: 'OTHER' }, { ...payment, status: 'failed' },
    { ...payment, currency: 'USD' }, { ...payment, amount: 0 },
    { ...payment, amount: 1.5 }, { ...payment, id: '' },
  ]) assert.throws(() => validatePayment(invalid, 'SLK-1'));
});

test('database finalization failure is propagated instead of reporting success', async () => {
  await assert.rejects(() => finalizePayment({
    rpc: async () => ({ data: null, error: { message: 'Payment amount mismatch' } }),
  }, payment, 'SLK-1'), /Payment amount mismatch/);
});
