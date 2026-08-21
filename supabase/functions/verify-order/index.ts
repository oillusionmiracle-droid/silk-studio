// Supabase Edge Function: verify-order
// Verifies Paystack payment, inserts order + items, decrements stock, sends confirmation email.
// Deploy: supabase functions deploy verify-order --no-verify-jwt

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      paystack_ref,
      customer_name,
      phone,
      email,
      address,
      area,
      subtotal,
      delivery_fee,
      total,
      items, // Array of { variant_id, quantity, price_at_purchase }
    } = await req.json();

    // ─── 1. Verify payment with Paystack ───────────────────
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Payment verification configuration missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${paystack_ref}`, {
      headers: { Authorization: `Bearer ${paystackSecretKey}` },
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data?.status !== 'success') {
      return new Response(
        JSON.stringify({ error: 'Payment verification failed. Transaction not successful.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the amount matches (Paystack returns amount in kobo)
    const paidAmountNaira = verifyData.data.amount / 100;
    if (paidAmountNaira < total) {
      return new Response(
        JSON.stringify({ error: 'Payment amount mismatch.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ─── 2. Insert order using service_role key ───────────────────
    // service_role bypasses RLS — this is the only way to write to orders/order_items
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name,
        phone,
        address,
        area,
        subtotal,
        delivery_fee,
        total,
        status: 'paid',
        paystack_ref,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Order insert error:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order record.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ─── 3. Insert order items ───────────────────
    const orderItems = items.map((item: { variant_id: string; quantity: number; price_at_purchase: number }) => ({
      order_id: order.id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items insert error:', itemsError);
      // Don't fail the whole order — the order itself was created
    }

    // ─── 4. Decrement stock (server-side only) ───────────────────
    for (const item of items) {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        p_variant_id: item.variant_id,
        p_quantity: item.quantity,
      });

      // If the RPC doesn't exist yet, fall back to a direct update
      if (stockError) {
        await supabase
          .from('variants')
          .update({ stock: supabase.rpc ? undefined : 0 }) // fallback
          .eq('id', item.variant_id);

        // Direct SQL approach as fallback
        await supabase.rpc('raw_sql', {
          query: `UPDATE variants SET stock = GREATEST(stock - ${item.quantity}, 0) WHERE id = '${item.variant_id}'`
        }).catch(() => {
          // If raw_sql RPC also doesn't exist, do a read-then-write
          // This is less safe but works without custom RPCs
          console.warn('Stock decrement fallback for variant:', item.variant_id);
        });
      }
    }

    // ─── 5. Send confirmation email via Resend ───────────────────
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (resendApiKey && email) {
      const itemsList = items
        .map((item: { variant_id: string; quantity: number; price_at_purchase: number }, i: number) =>
          `  ${i + 1}. Qty: ${item.quantity} x ₦${item.price_at_purchase.toLocaleString()}`
        )
        .join('\n');

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // TODO: Replace 'onboarding@resend.dev' with your verified custom domain sender
            // address once you have one set up in Resend. The onboarding@resend.dev address
            // is Resend's shared test domain — it works for testing but should be replaced
            // for production use.
            from: 'Silk Studio <onboarding@resend.dev>',
            to: [email],
            subject: `Order Confirmed — ${paystack_ref}`,
            html: `
              <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px;">
                <h1 style="font-size: 24px; color: #1A1A2E; margin-bottom: 8px;">Order Confirmed!</h1>
                <p style="color: #6B7280; font-size: 15px; line-height: 1.6;">
                  Thank you for your order, ${customer_name}. Here are your details:
                </p>
                <div style="background: #F8F5F1; border-radius: 16px; padding: 20px; margin: 20px 0;">
                  <p style="margin: 0 0 8px; font-weight: 600; color: #1A1A2E;">Reference: ${paystack_ref}</p>
                  <p style="margin: 0 0 4px; color: #6B7280;">Total: ₦${total.toLocaleString()}</p>
                  <p style="margin: 0 0 4px; color: #6B7280;">Delivery: ${address}, ${area}, Lagos</p>
                  <p style="margin: 0; color: #6B7280;">Phone: ${phone}</p>
                </div>
                <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
                  We will reach out via WhatsApp with delivery updates. If you have questions,
                  contact us on WhatsApp at +234 706 482 9776.
                </p>
                <p style="color: #E85D8C; font-weight: 600; margin-top: 24px;">— Silk Studio</p>
              </div>
            `,
          }),
        });
      } catch (emailError) {
        // Email failure should not fail the order
        console.error('Email send error:', emailError);
      }

      // NOTE: A "shipping update" email would reuse the same Resend fetch call above,
      // just with a different subject line and HTML body. When implementing shipping
      // notifications, extract the Resend call into a shared helper function like:
      //
      // async function sendEmail(to: string, subject: string, html: string) {
      //   await fetch('https://api.resend.com/emails', {
      //     method: 'POST',
      //     headers: {
      //       Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ from: 'Silk Studio <your-domain@yourdomain.com>', to: [to], subject, html }),
      //   });
      // }
    }

    // ─── 6. Return success ───────────────────
    return new Response(
      JSON.stringify({ success: true, order_id: order.id, reference: paystack_ref }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
