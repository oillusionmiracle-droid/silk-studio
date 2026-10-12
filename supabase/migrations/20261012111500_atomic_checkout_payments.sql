-- Only trusted Edge Functions may call these transactional checkout RPCs.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS checkout_version integer,
  ADD COLUMN IF NOT EXISTS payment_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_provider_id text,
  ADD COLUMN IF NOT EXISTS amount_paid_kobo bigint;

CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_reference_unique
  ON public.orders (paystack_ref) WHERE paystack_ref IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_provider_unique
  ON public.orders (payment_provider_id) WHERE payment_provider_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.create_pending_order(p_order jsonb, p_items jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  saved public.orders%ROWTYPE;
  item record;
  variant public.variants%ROWTYPE;
  product public.products%ROWTYPE;
  item_price integer;
  subtotal bigint := 0;
  item_count bigint := 0;
  delivery integer := 0;
  priced_items jsonb := '[]'::jsonb;
BEGIN
  IF p_order->>'type' NOT IN ('apparel', 'custom')
     OR p_order->>'status' NOT IN ('pending', 'quote_requested')
     OR nullif(p_order->>'paystack_ref', '') IS NULL THEN
    RAISE EXCEPTION 'Invalid order';
  END IF;
  IF p_order->>'type' = 'apparel' THEN
    IF jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) NOT BETWEEN 1 AND 100 THEN
      RAISE EXCEPTION 'Apparel order requires items';
    END IF;
    -- Aggregate repeats before checking stock; deterministic locks avoid deadlocks.
    FOR item IN
      SELECT variant_id, sum(quantity)::bigint AS quantity
      FROM jsonb_to_recordset(p_items) AS i(variant_id uuid, quantity integer)
      GROUP BY variant_id ORDER BY variant_id
    LOOP
      IF item.variant_id IS NULL OR item.quantity IS NULL OR item.quantity NOT BETWEEN 1 AND 100000 THEN
        RAISE EXCEPTION 'Invalid item quantity or variant';
      END IF;
      SELECT * INTO STRICT variant FROM public.variants WHERE id = item.variant_id FOR UPDATE;
      SELECT * INTO STRICT product FROM public.products WHERE id = variant.product_id FOR SHARE;
      IF product.is_active IS NOT TRUE OR product.category NOT IN ('tee', 'shirt', 'hoodie', 'cap')
         OR product.price <= 0 OR variant.stock < item.quantity THEN
        RAISE EXCEPTION 'Product unavailable or insufficient stock';
      END IF;
      item_price := product.price;
      subtotal := subtotal + item_price::bigint * item.quantity;
      item_count := item_count + item.quantity;
      priced_items := priced_items || jsonb_build_array(jsonb_build_object(
        'variant_id', variant.id, 'quantity', item.quantity, 'price_at_purchase', item_price
      ));
    END LOOP;
    IF item_count < 10 THEN delivery := 2500; END IF;
    p_order := p_order || jsonb_build_object(
      'status', 'pending', 'total', subtotal + delivery,
      'server_verified_amount', subtotal + delivery
    );
  ELSE
    subtotal := (p_order->>'total')::bigint;
    IF subtotal IS NULL OR subtotal < 0
       OR (p_order->>'server_verified_amount')::numeric IS NULL
       OR (p_order->>'server_verified_amount')::numeric < 0
       OR (p_order->>'status' = 'pending' AND (p_order->>'server_verified_amount')::numeric <= 0)
       OR (p_order->>'status' = 'quote_requested' AND (subtotal <> 0 OR (p_order->>'server_verified_amount')::numeric <> 0)) THEN
      RAISE EXCEPTION 'Invalid server price';
    END IF;
  END IF;

  INSERT INTO public.orders (
    user_id, type, customer_name, email, phone, address, area, subtotal, delivery_fee,
    total, server_verified_amount, status, paystack_ref, specs, reference_files, status_history, checkout_version
  ) VALUES (
    (p_order->>'user_id')::uuid, p_order->>'type', p_order->>'customer_name',
    p_order->>'email', p_order->>'phone', p_order->>'address', p_order->>'area',
    subtotal, delivery, (p_order->>'total')::integer, (p_order->>'server_verified_amount')::numeric,
    p_order->>'status', p_order->>'paystack_ref', p_order->'specs',
    coalesce(p_order->'reference_files', '[]'::jsonb),
    jsonb_build_array(jsonb_build_object('status', p_order->>'status', 'timestamp', now(), 'note', 'Order created on server')), 1
  ) RETURNING * INTO saved;

  INSERT INTO public.order_items (order_id, variant_id, quantity, price_at_purchase)
  SELECT saved.id, i.variant_id, i.quantity, i.price_at_purchase
  FROM jsonb_to_recordset(priced_items) AS i(variant_id uuid, quantity integer, price_at_purchase integer);
  RETURN to_jsonb(saved);
END;
$$;

CREATE OR REPLACE FUNCTION public.finalize_order_payment(
  p_reference text, p_amount_kobo bigint, p_currency text, p_provider_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  saved public.orders%ROWTYPE;
  required_kobo bigint;
  item record;
  history jsonb;
BEGIN
  IF p_currency IS DISTINCT FROM 'NGN' OR p_amount_kobo IS NULL OR p_amount_kobo <= 0
     OR nullif(p_provider_id, '') IS NULL THEN
    RAISE EXCEPTION 'Invalid payment currency, amount or transaction ID';
  END IF;
  SELECT * INTO STRICT saved FROM public.orders WHERE paystack_ref = p_reference FOR UPDATE;
  required_kobo := round(coalesce(saved.server_verified_amount, saved.total) * 100);
  IF required_kobo IS NULL OR required_kobo <= 0 OR p_amount_kobo < required_kobo THEN
    RAISE EXCEPTION 'Payment amount mismatch';
  END IF;

  -- The order lock serializes callbacks and webhook retries, including after fulfilment.
  IF saved.payment_verified_at IS NOT NULL
     OR saved.status IN ('paid', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered') THEN
    RETURN jsonb_build_object('order_id', saved.id, 'status', saved.status, 'already_processed', true);
  END IF;
  IF saved.status <> 'pending' THEN RAISE EXCEPTION 'Order is not awaiting payment'; END IF;
  IF saved.type = 'custom' AND saved.checkout_version IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'Legacy custom order requires server repricing before payment';
  END IF;

  IF saved.type = 'apparel' THEN
    IF NOT EXISTS (SELECT 1 FROM public.order_items WHERE order_id = saved.id) THEN
      RAISE EXCEPTION 'Order has no items';
    END IF;
    FOR item IN
      SELECT variant_id, sum(quantity)::bigint AS quantity
      FROM public.order_items WHERE order_id = saved.id
      GROUP BY variant_id ORDER BY variant_id
    LOOP
      IF item.quantity IS NULL OR item.quantity <= 0 THEN RAISE EXCEPTION 'Invalid order quantity'; END IF;
      UPDATE public.variants SET stock = stock - item.quantity
      WHERE id = item.variant_id AND stock >= item.quantity;
      IF NOT FOUND THEN RAISE EXCEPTION 'Insufficient stock to fulfil paid order'; END IF;
    END LOOP;
  END IF;
  history := CASE WHEN jsonb_typeof(saved.status_history) = 'array' THEN saved.status_history ELSE '[]'::jsonb END;
  UPDATE public.orders SET
    status = 'paid', updated_at = now(), payment_verified_at = now(),
    payment_provider_id = p_provider_id, amount_paid_kobo = p_amount_kobo,
    status_history = history || jsonb_build_array(jsonb_build_object(
      'status', 'paid', 'timestamp', now(), 'note', 'Paystack payment verified',
      'provider_ref', p_provider_id, 'amount_kobo', p_amount_kobo
    ))
  WHERE id = saved.id;
  RETURN jsonb_build_object('order_id', saved.id, 'status', 'paid', 'already_processed', false);
END;
$$;

REVOKE ALL ON FUNCTION public.create_pending_order(jsonb, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.finalize_order_payment(text, bigint, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_pending_order(jsonb, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.finalize_order_payment(text, bigint, text, text) TO service_role;
-- The old standalone inventory RPC must not be callable from the browser.
REVOKE ALL ON FUNCTION public.decrement_stock(uuid, integer) FROM PUBLIC, anon, authenticated;
