export type DashboardOrder = {
  id: string; paystack_ref: string | null; customer_name?: string; type: string;
  total: number | string; status: string; created_at: string;
  payment_state: string; paid_amount_kobo: number | string | null; inventory_state: string;
};
const workStates = ['paid', 'confirmed', 'in_production', 'ready', 'shipped'];
export function receivedPayment(order: Pick<DashboardOrder, 'payment_state' | 'paid_amount_kobo'>): number {
  const kobo = Number(order.paid_amount_kobo);
  return ['paid', 'deposit_paid'].includes(order.payment_state) && Number.isSafeInteger(kobo) && kobo > 0 ? kobo / 100 : 0;
}
export function dashboardMetrics(orders: DashboardOrder[]) {
  return {
    total: orders.length,
    received: orders.reduce((sum, order) => sum + receivedPayment(order), 0),
    active: orders.filter(order => workStates.includes(order.status)).length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    awaiting: orders.filter(order => ['pending', 'quote_requested'].includes(order.status) && receivedPayment(order) === 0).length,
    review: orders.filter(order => order.inventory_state === 'review' && !['cancelled', 'delivered'].includes(order.status)).length,
    production: orders.filter(order => order.status === 'in_production').length,
  };
}
export function statusLabel(status: string): string {
  const labels: Record<string, string> = { pending: 'Awaiting payment', quote_requested: 'Quote requested', paid: 'Payment received', confirmed: 'Confirmed', in_production: 'In production', ready: 'Ready', shipped: 'Dispatched', delivered: 'Delivered', cancelled: 'Cancelled' };
  return labels[status] || status.replace(/_/g, ' ');
}
export function money(value: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
}
export function dateLabel(value: string): string {
  return new Date(value).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}
export function initials(name: string): string { return name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase() || 'S'; }
