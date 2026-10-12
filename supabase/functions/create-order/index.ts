import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { edgeRateLimit } from '../_shared/edgeRateLimit.ts';
import { positiveQuantity, priceCustomOrder } from '../_shared/orderPricing.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const limited = await edgeRateLimit(supabase, req, 'create-order', 20, 60 * 60 * 1000);
    if (limited) return limited;
    let userId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id || null;
    }
    const body = await req.json();
    const { customer_name, phone, email, address, area, type = 'apparel', items, specs, reference_files = [], pay_full = true } = body;
    for (const value of [customer_name, phone, address, area]) {
      if (typeof value !== 'string' || !value.trim() || value.length > 1000) return json({ error: 'Missing or invalid customer information.' }, 400);
    }
    if (!['apparel', 'custom'].includes(type)) return json({ error: 'Invalid order type.' }, 400);
    if (!Array.isArray(reference_files) || reference_files.length > 10 || reference_files.some((v: unknown) => typeof v !== 'string')) {
      return json({ error: 'Invalid reference files.' }, 400);
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 100) return json({ error: 'Order must contain 1 to 100 items.' }, 400);
    let total = 0;
    let requiredAmount = 0;
    let isQuote = false;
    let orderSpecs = specs || null;
    const validatedItems: { variant_id: string; quantity: number }[] = [];
    try {
      if (type === 'custom') {
        if (specs?.service === 'Other' || specs?.service === 'Custom Bundle') {
          // Free-form briefs are always quotes, never payable catalog orders.
          isQuote = true;
          orderSpecs = { service: specs.service, options: specs.options, deadline: specs.deadline, description: specs.description };
        } else {
          if (items.length !== 1 || !items[0]?.product_id) throw new Error('Select one valid order service.');
          const { data: product, error: productError } = await supabase.from('products').select('*').eq('id', items[0].product_id).single();
          if (productError || !product) throw new Error('Order service was not found.');
          const { data: variants, error: variantError } = await supabase.from('variants').select('*').eq('product_id', product.id);
          if (variantError) throw new Error('Unable to load service pricing.');
          const price = priceCustomOrder(product, variants || [], items[0].quantity, specs?.options, pay_full);
          total = price.total;
          requiredAmount = price.requiredAmount;
          isQuote = price.isCustomQuote;
          // Bind the fulfilment brief to the same catalog item and options we priced.
          orderSpecs = {
            product_id: product.id, service: product.title || product.name,
            quantity: items[0].quantity, options: specs.options,
            specs: JSON.stringify(specs.options),
            deadline: specs.deadline, description: specs.description,
          };
        }
      } else {
        for (const item of items) {
          if (!item || typeof item.variant_id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.variant_id)) {
            throw new Error('Each apparel item must specify a valid variant ID.');
          }
          validatedItems.push({ variant_id: item.variant_id, quantity: positiveQuantity(item.quantity) });
        }
      }
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : 'Invalid order.' }, 400);
    }
    const reference = `SLK-${type === 'custom' ? 'CUST-' : ''}${crypto.randomUUID()}`;
    const { data: order, error } = await supabase.rpc('create_pending_order', {
      p_order: {
        user_id: userId, type, customer_name, phone, email: email || null, address, area,
        total, server_verified_amount: requiredAmount,
        status: isQuote ? 'quote_requested' : 'pending', paystack_ref: reference,
        specs: orderSpecs, reference_files,
      },
      p_items: validatedItems,
    });
    if (error || !order) {
      console.error('Atomic order creation failed:', error);
      return json({ error: 'Could not save your order. Check availability and try again.' }, 400);
    }
    return json({
      success: true, order_id: order.id, paystack_ref: order.paystack_ref,
      total: order.total, subtotal: order.subtotal, delivery_fee: order.delivery_fee,
      required_amount: order.server_verified_amount, is_custom_quote: isQuote, status: order.status,
    });
  } catch (error) {
    console.error('create-order error:', error);
    return json({ error: 'Server error creating order.' }, 500);
  }
});
