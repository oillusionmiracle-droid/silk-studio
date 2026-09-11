// Supabase Edge Function: create-order
// Recalculates price on server from database, creates 'pending' order,
// and returns verified amount and reference for Paystack checkout.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { edgeRateLimit } from '../_shared/edgeRateLimit.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Postgres-backed per-IP throttle: guest checkout is public, so cap
    // mass-creation of pending orders (20/hr/IP). Fails open on limiter error.
    const limited = await edgeRateLimit(supabase, req, 'create-order', 20, 60 * 60 * 1000);
    if (limited) return limited;

    // Optional user authentication via bearer token
    let userId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userId = user.id;
      }
    }

    const {
      items = [], // Array<{ variant_id: string, quantity: number }>
      customer_name,
      phone,
      email,
      address,
      area,
      type = 'apparel',
      specs = null,
      reference_files = [],
    } = await req.json();

    if (!customer_name || !phone || !address || !area) {
      return new Response(
        JSON.stringify({ error: 'Missing required customer delivery information.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let calculatedSubtotal = 0;
    let validatedItems: Array<{ variant_id: string; quantity: number; price_at_purchase: number }> = [];

    if (type === 'apparel') {
      if (!Array.isArray(items) || items.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Order must contain at least one item.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const variantIds = items.map((i: any) => i.variant_id).filter(Boolean);
      const { data: variants, error: variantError } = await supabase
        .from('variants')
        .select(`
          id,
          stock,
          product_id,
          products (
            id,
            name,
            price
          )
        `)
        .in('id', variantIds);

      const variantMap = new Map<string, any>();
      if (variants && variants.length > 0) {
        for (const v of variants) {
          variantMap.set(v.id, v);
        }
      }

      let totalQuantity = 0;
      for (const item of items) {
        if (!item || (!item.variant_id && !item.product_id)) {
          return new Response(
            JSON.stringify({ error: 'Each item must specify a valid product or variant ID.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const variant = item.variant_id ? variantMap.get(item.variant_id) : null;
        if (!variant && !item.product_id) {
          return new Response(
            JSON.stringify({ error: `Product or variant with ID '${item.variant_id || item.product_id}' was not found.` }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const qty = Math.max(1, parseInt(item.quantity, 10) || 1);

        if (variant) {
          if (variant.stock !== undefined && variant.stock < qty) {
            return new Response(
              JSON.stringify({ error: `Insufficient stock for selected variant '${variant.id}'.` }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          const unitPrice = Number(variant.price > 0 ? variant.price : variant.products?.price);
          if (!unitPrice || unitPrice <= 0) {
            return new Response(
              JSON.stringify({ error: `Item '${variant.id}' does not have a valid price set in the database.` }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          calculatedSubtotal += unitPrice * qty;
          totalQuantity += qty;
          validatedItems.push({
            variant_id: item.variant_id,
            quantity: qty,
            price_at_purchase: unitPrice,
          });
        } else {
          // If no variant ID, query product by product_id
          const { data: dbProd } = await supabase
            .from('products')
            .select('id, price, is_active')
            .eq('id', item.product_id)
            .single();

          if (!dbProd || dbProd.is_active === false) {
            return new Response(
              JSON.stringify({ error: `Product '${item.product_id}' was not found or is currently inactive.` }),
              { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          const unitPrice = Number(dbProd.price);
          if (!unitPrice || unitPrice <= 0) {
            return new Response(
              JSON.stringify({ error: `Product '${dbProd.id}' does not have a valid price set.` }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          calculatedSubtotal += unitPrice * qty;
          totalQuantity += qty;
          validatedItems.push({
            variant_id: dbProd.id,
            quantity: qty,
            price_at_purchase: unitPrice,
          });
        }
      }
      // Delivery rule: free if 10+ items, else 2500
      const deliveryFee = totalQuantity >= 10 ? 0 : 2500;
      const calculatedTotal = calculatedSubtotal + deliveryFee;

      // Unique reference
      const paystackRef = `SLK-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // Insert pending order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          type: 'apparel',
          customer_name,
          email: email || null,
          phone,
          address,
          area,
          subtotal: calculatedSubtotal,
          delivery_fee: deliveryFee,
          total: calculatedTotal,
          server_verified_amount: calculatedTotal,
          status: 'pending',
          paystack_ref: paystackRef,
          specs: specs || null,
          reference_files: reference_files || [],
          status_history: [
            {
              status: 'pending',
              timestamp: new Date().toISOString(),
              note: 'Order initiated at checkout',
            },
          ],
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error('Failed to create pending order:', orderError);
        return new Response(
          JSON.stringify({ error: 'Database order creation failed.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Insert order items
      const orderItems = validatedItems.map((item) => ({
        order_id: order.id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items insertion error:', itemsError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          order_id: order.id,
          paystack_ref: paystackRef,
          total: calculatedTotal,
          subtotal: calculatedSubtotal,
          delivery_fee: deliveryFee,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Custom order flow
      const paystackRef = `SLK-CUST-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          type: 'custom',
          customer_name,
          email: email || null,
          phone,
          address,
          area,
          subtotal: 0,
          delivery_fee: 0,
          total: 0,
          status: 'quote_requested',
          paystack_ref: paystackRef,
          specs: specs || null,
          reference_files: reference_files || [],
          status_history: [
            {
              status: 'quote_requested',
              timestamp: new Date().toISOString(),
              note: 'Custom design quote requested',
            },
          ],
        })
        .select()
        .single();

      if (orderError || !order) {
        return new Response(
          JSON.stringify({ error: 'Failed to record custom order.' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          order_id: order.id,
          paystack_ref: paystackRef,
          status: 'quote_requested',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (err: any) {
    console.error('create-order error:', err);
    return new Response(
      JSON.stringify({ error: err?.message || 'Server error creating order.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
