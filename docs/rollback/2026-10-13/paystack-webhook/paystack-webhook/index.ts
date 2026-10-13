// Supabase Edge Function: paystack-webhook
// Securely receives asynchronous payment notifications from Paystack,
// validates HMAC SHA-512 signature, and marks pending orders as 'paid'.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not set');
      return new Response('Configuration error', { status: 500 });
    }

    const signature = req.headers.get('x-paystack-signature');
    if (!signature) {
      return new Response('Missing signature header', { status: 401 });
    }

    const rawBody = await req.text();

    // Verify HMAC-SHA512 signature
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(paystackSecretKey),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign', 'verify']
    );

    const sigBuffer = new Uint8Array(
      signature.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBuffer,
      new TextEncoder().encode(rawBody)
    );

    if (!isValid) {
      console.warn('Invalid Paystack webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const data = event.data;
      const paystackRef = data.reference;
      const paidAmount = data.amount / 100; // kobo to naira

      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Find order
      const { data: order } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('paystack_ref', paystackRef)
        .maybeSingle();

      if (order && (order.status === 'pending' || order.status === 'quote_requested')) {
        const history = Array.isArray(order.status_history) ? order.status_history : [];
        history.push({
          status: 'paid',
          timestamp: new Date().toISOString(),
          note: `Paystack webhook charge.success (₦${paidAmount.toLocaleString()})`,
        });

        await supabase
          .from('orders')
          .update({
            status: 'paid',
            status_history: history,
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        // Decrement stock for apparel
        if (Array.isArray(order.order_items)) {
          for (const item of order.order_items) {
            if (item.variant_id && item.quantity) {
              await supabase.rpc('decrement_stock', {
                p_variant_id: item.variant_id,
                p_quantity: item.quantity,
              }).catch((e: any) => console.warn('Stock decrement failed in webhook:', e));
            }
          }
        }

        console.log(`Order ${order.id} marked paid via Paystack webhook.`);
      }
    }

    return new Response('OK', { status: 200 });
  } catch (err: any) {
    console.error('Webhook processing exception:', err);
    return new Response('Internal error', { status: 500 });
  }
});
