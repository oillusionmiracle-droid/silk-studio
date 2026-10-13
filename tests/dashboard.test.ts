import assert from 'node:assert/strict';
import { test } from 'node:test';
import { dashboardMetrics, receivedPayment, statusLabel, type DashboardOrder } from '../lib/dashboard';
const order = (changes: Partial<DashboardOrder> = {}): DashboardOrder => ({ id: 'fixture', paystack_ref: 'SLK-fixture', type: 'custom', total: 12000, status: 'paid', created_at: '2026-10-13T10:00:00Z', payment_state: 'deposit_paid', paid_amount_kobo: 900000, inventory_state: 'not_required', ...changes });
test('dashboard cash received counts the paid deposit, not the full order price', () => {
  assert.equal(dashboardMetrics([order()]).received, 9000);
  assert.equal(dashboardMetrics([order({ payment_state: 'paid', paid_amount_kobo: 1200000 })]).received, 12000);
});
test('unpaid, legacy and invalid amounts are not reported as money received', () => {
  for (const row of [order({ payment_state: 'unpaid' }), order({ payment_state: 'legacy_paid' }), order({ paid_amount_kobo: null }), order({ paid_amount_kobo: -1 }), order({ paid_amount_kobo: 'not money' }), order({ paid_amount_kobo: 1.5 })]) assert.equal(receivedPayment(row), 0);
});
test('cancelled and delivered orders are not outstanding production or reviews', () => {
  const result = dashboardMetrics([order({ status: 'delivered', inventory_state: 'review' }), order({ status: 'cancelled', inventory_state: 'review' }), order({ status: 'pending', inventory_state: 'review' }), order({ status: 'in_production' })]);
  assert.equal(result.active, 1); assert.equal(result.review, 1); assert.equal(result.delivered, 1); assert.equal(result.production, 1);
});
test('quote requests and unpaid orders are distinguished from recorded payments', () => {
  const result = dashboardMetrics([order({ status: 'quote_requested', payment_state: 'unpaid', paid_amount_kobo: null }), order({ status: 'pending', payment_state: 'unpaid', paid_amount_kobo: null }), order({ status: 'pending', inventory_state: 'review' })]);
  assert.equal(result.awaiting, 2); assert.equal(result.review, 1);
});
test('ready orders are not presented as already dispatched', () => {
  assert.equal(statusLabel('ready'), 'Ready'); assert.equal(statusLabel('shipped'), 'Dispatched'); assert.equal(statusLabel('quote_requested'), 'Quote requested');
});
