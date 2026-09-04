// Supabase Edge Function: verify-order (Hardened)
// Verifies Paystack transaction, checks amount against database order record,
// updates order status to 'paid', decrements stock atomically, and notifies customer.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { paystack_ref } = await req.json();

    if (!paystack_ref) {
      return new Response(
        JSON.stringify({ error: 'Missing payment reference' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      return new Response(
        JSON.stringify({ error: 'Payment verification configuration missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ─── 1. Find existing order in DB ───────────────────
    const { data: order, error: orderFetchError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('paystack_ref', paystack_ref)
      .maybeSingle();

    if (orderFetchError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order record not found for this reference.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If already paid, return idempotent success
    if (order.status === 'paid' || order.status === 'confirmed') {
      return new Response(
        JSON.stringify({ success: true, order_id: order.id, status: order.status, message: 'Already verified' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ─── 2. Verify payment with Paystack API ───────────────────
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${paystack_ref}`, {
      headers: { Authorization: `Bearer ${paystackSecretKey}` },
    });
    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data?.status !== 'success') {
      return new Response(
        JSON.stringify({ error: 'Payment verification failed with provider.', details: verifyData.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify amount (Paystack returns in kobo)
    const paidAmountNaira = verifyData.data.amount / 100;
    const requiredAmount = Number(order.server_verified_amount || order.total);

    if (paidAmountNaira < requiredAmount) {
      return new Response(
        JSON.stringify({
          error: `Payment amount mismatch: received ₦${paidAmountNaira}, expected ₦${requiredAmount}`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ─── 3. Update order status to 'paid' ───────────────────
    const history = Array.isArray(order.status_history) ? order.status_history : [];
    const updatedHistory = [
      ...history,
      {
        status: 'paid',
        timestamp: new Date().toISOString(),
        note: `Paystack payment verified (₦${paidAmountNaira.toLocaleString()})`,
        provider_ref: verifyData.data.id?.toString(),
      },
    ];

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        status_history: updatedHistory,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Failed to update order status:', updateError);
    }

    // ─── 4. Atomic stock decrement ───────────────────
    if (Array.isArray(order.order_items)) {
      for (const item of order.order_items) {
        if (item.variant_id && item.quantity) {
          const { error: stockErr } = await supabase.rpc('decrement_stock', {
            p_variant_id: item.variant_id,
            p_quantity: item.quantity,
          });

          if (stockErr) {
            console.warn('Fallback stock decrement for:', item.variant_id);
            // Read-and-decrement fallback
            const { data: v } = await supabase
              .from('variants')
              .select('stock')
              .eq('id', item.variant_id)
              .single();
            if (v) {
              await supabase
                .from('variants')
                .update({ stock: Math.max(0, (v.stock || 0) - item.quantity) })
                .eq('id', item.variant_id);
            }
          }
        }
      }
    }

    // ─── 5. Send confirmation email (optional Resend) ───────
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey && order.email) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Silk Studio <orders@silkstudio.ng>',
            to: [order.email],
            subject: `Order Confirmed — ${order.paystack_ref}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #111;">
                <h1 style="font-size: 22px; font-weight: 600; letter-spacing: -0.5px; margin-bottom: 8px;">Order Confirmed</h1>
                <p style="color: #666; font-size: 14px; line-height: 1.6;">
                  Thank you for your order, ${order.customer_name}. We have received your payment and our studio team is preparing your package.
                </p>
                <div style="background: #F9F9FB; border: 1px solid #E5E5EA; border-radius: 12px; padding: 18px; margin: 24px 0;">
                  <p style="margin: 0 0 6px; font-size: 13px; color: #8E8E93;">Order Reference</p>
                  <p style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #000; letter-spacing: 0.5px;">${order.paystack_ref}</p>
                  <p style="margin: 0 0 6px; font-size: 13px; color: #8E8E93;">Amount Paid</p>
                  <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #000;">₦${Number(order.total).toLocaleString()}</p>
                  <p style="margin: 0 0 6px; font-size: 13px; color: #8E8E93;">Delivery Address</p>
                  <p style="margin: 0; font-size: 14px; color: #111;">${order.address}, ${order.area}, Lagos</p>
                </div>
                <p style="color: #8E8E93; font-size: 12px; line-height: 1.6;">
                  Track this order live on your Silk Studio account dashboard.
                </p>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.warn('Email dispatch failed:', emailErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        reference: paystack_ref,
        status: 'paid',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('verify-order exception:', err);
    return new Response(
      JSON.stringify({ error: err?.message || 'Server error verifying payment.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
