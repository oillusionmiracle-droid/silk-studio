import { createClient } from 'npm:@supabase/supabase-js@2.115.0';
import { json } from '../_shared/http.ts';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey, { auth: { persistSession: false } });
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (req.headers.get('authorization') !== `Bearer ${serviceKey}`) return json({ error: 'Service authorization required.' }, 401);
  const resendKey = Deno.env.get('RESEND_API_KEY');
  if (!resendKey) return json({ error: 'Email configuration unavailable.' }, 503);
  const { data: orders, error } = await supabase.rpc('claim_payment_notifications');
  if (error) return json({ error: 'Notification queue unavailable.' }, 503);
  let sent = 0;
  for (const order of orders || []) {
    try {
      if (order.email) {
        const amount = Number(order.paid_amount_kobo)/100;
        const review = order.inventory_state === 'review';
        const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `payment-${order.id}` }, signal: AbortSignal.timeout(15000), body: JSON.stringify({ from: Deno.env.get('ORDER_EMAIL_FROM') || 'Silk Studio <orders@mail.silkstudios.com.ng>', to: [order.email], subject: `Payment received — ${order.paystack_ref}`, text: `Payment received: ₦${amount.toLocaleString()}. Reference: ${order.paystack_ref}. ${order.payment_state === 'deposit_paid' ? 'This is your deposit; a balance remains.' : 'Payment has been recorded.'} ${review ? 'The studio will contact you about stock availability or a refund.' : 'The studio will confirm production and delivery.'}` }) });
        if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
      }
      const { error: updateError } = await supabase.from('payment_notifications').update({ sent_at: new Date().toISOString(), claimed_until: null, last_error: null }).eq('order_id', order.id);
      if (updateError) throw new Error('Notification receipt could not be saved.');
      sent++;
    } catch (error) {
      await supabase.from('payment_notifications').update({ claimed_until: null, last_error: error instanceof Error ? error.message : 'Delivery failed' }).eq('order_id', order.id);
    }
  }
  return json({ sent });
});
