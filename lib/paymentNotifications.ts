import { timingSafeEqual } from 'node:crypto';

export type PaymentReceiptOrder = {
  id: string;
  email: string | null;
  paid_amount_kobo: number | string | null;
  paystack_ref: string;
  payment_state: string;
  inventory_state: string;
};
type QueueUpdate = { sent_at?: string; claimed_until: null; last_error: string | null };
type Dependencies = {
  claimOrders: () => Promise<PaymentReceiptOrder[]>;
  updateQueue: (id: string, update: QueueUpdate) => Promise<void>;
  fetcher?: typeof fetch;
};
type Configuration = { serviceKey?: string; cronSecret?: string; resendKey?: string; from?: string };

export function paymentNotificationHandler(config: Configuration, deps: Dependencies) {
  return async (req: Request) => {
    const supplied = Buffer.from(req.headers.get('authorization') || '');
    const allowed = [config.serviceKey, config.cronSecret].filter(Boolean).some(key => {
      const expected = Buffer.from(`Bearer ${key}`);
      return supplied.length === expected.length && timingSafeEqual(supplied, expected);
    });
    if (!allowed) return Response.json({ error: 'Service authorization required.' }, { status: 401 });
    if (!config.resendKey) return Response.json({ error: 'Email configuration unavailable.' }, { status: 503 });
    let orders: PaymentReceiptOrder[];
    try { orders = await deps.claimOrders(); }
    catch { return Response.json({ error: 'Notification queue unavailable.' }, { status: 503 }); }

    let sent = 0;
    let failed = 0;
    const fetcher = deps.fetcher || fetch;
    // The queue claims at most 20 orders. Five parallel workers keep provider
    // timeouts inside the route's 60-second budget (four rounds of ten seconds).
    async function deliver(order: PaymentReceiptOrder) {
      try {
        const amountKobo = Number(order.paid_amount_kobo);
        if (!order.email || !Number.isSafeInteger(amountKobo) || amountKobo <= 0 ||
            !['deposit_paid', 'paid'].includes(order.payment_state)) {
          throw new Error('Receipt details require review.');
        }
        const amount = amountKobo / 100;
        const response = await fetcher('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.resendKey}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': `payment-${order.id}`,
          },
          signal: AbortSignal.timeout(10000),
          body: JSON.stringify({
            from: config.from || 'Silk Studio <orders@mail.silkstudios.com.ng>',
            to: [order.email],
            subject: `Payment received — ${order.paystack_ref}`,
            text: `Payment received: ₦${amount.toLocaleString('en-NG')}. Reference: ${order.paystack_ref}. ${order.payment_state === 'deposit_paid' ? 'This is your deposit; a balance remains.' : 'Payment has been recorded.'} ${order.inventory_state === 'review' ? 'The studio will contact you about stock availability or a refund.' : 'The studio will confirm production and delivery.'}`,
          }),
        });
        if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
        await response.body?.cancel();
        await deps.updateQueue(order.id, { sent_at: new Date().toISOString(), claimed_until: null, last_error: null });
        sent++;
      } catch (error) {
        failed++;
        try {
          await deps.updateQueue(order.id, { claimed_until: null, last_error: error instanceof Error ? error.message : 'Delivery failed' });
        } catch { /* The five-minute claim expires, allowing a later retry. */ }
      }
    }
    for (let i = 0; i < orders.length; i += 5) {
      await Promise.all(orders.slice(i, i + 5).map(deliver));
    }
    return Response.json({ sent, failed });
  };
}
