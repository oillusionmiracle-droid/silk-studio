-- Additive migration. Apply before deploying the matching Edge Functions.
-- No existing order/product/profile rows are deleted or repriced.
BEGIN;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_state text NOT NULL DEFAULT 'unpaid';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at timestamptz;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_transaction_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_amount_kobo bigint;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pricing_version integer NOT NULL DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS inventory_state text NOT NULL DEFAULT 'unprocessed';
-- Fail before making changes if historical duplicates need manual reconciliation.
CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_reference_unique ON public.orders(paystack_ref) WHERE paystack_ref IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_transaction_unique ON public.orders(payment_transaction_id) WHERE payment_transaction_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
 SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;
CREATE OR REPLACE FUNCTION public.protect_profile_role() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
 IF ((TG_OP = 'INSERT' AND NEW.role <> 'customer') OR
     (TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role))
    AND current_user NOT IN ('postgres','service_role') AND NOT public.is_admin() THEN
   RAISE EXCEPTION 'Profile role is managed by administrators' USING ERRCODE = '42501';
 END IF;
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS tr_protect_profile_role ON public.profiles;
CREATE TRIGGER tr_protect_profile_role BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 INSERT INTO public.profiles(id,full_name,avatar_url,role)
 VALUES(NEW.id,COALESCE(NEW.raw_user_meta_data->>'full_name',NEW.raw_user_meta_data->>'name',''),COALESCE(NEW.raw_user_meta_data->>'avatar_url',NEW.raw_user_meta_data->>'picture',''),'customer')
 ON CONFLICT(id) DO NOTHING;
 RETURN NEW;
END;
$$;
-- Remove every existing policy on these critical tables, including stale permissive policies.
DO $$ DECLARE item record; BEGIN
 FOR item IN SELECT tablename,policyname FROM pg_policies WHERE schemaname='public' AND tablename IN ('profiles','orders','order_items') LOOP
  EXECUTE format('DROP POLICY %I ON public.%I',item.policyname,item.tablename);
 END LOOP;
END $$;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_select_policy ON public.profiles FOR SELECT TO authenticated USING(id=auth.uid() OR public.is_admin());
CREATE POLICY profiles_update_policy ON public.profiles FOR UPDATE TO authenticated USING(id=auth.uid() OR public.is_admin()) WITH CHECK(id=auth.uid() OR public.is_admin());
CREATE POLICY profiles_insert_policy ON public.profiles FOR INSERT TO authenticated WITH CHECK((id=auth.uid() AND role='customer') OR public.is_admin());
CREATE POLICY "Users can view own orders or admins all" ON public.orders FOR SELECT TO authenticated USING(user_id=auth.uid() OR public.is_admin());
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.orders WHERE orders.id=order_items.order_id AND (orders.user_id=auth.uid() OR public.is_admin())));
REVOKE INSERT ON public.orders,public.order_items FROM anon,authenticated;
REVOKE ALL ON public.orders,public.order_items,public.profiles FROM anon;
GRANT SELECT,UPDATE,INSERT ON public.profiles TO authenticated;
GRANT SELECT,UPDATE ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.orders,public.order_items,public.profiles TO service_role;

CREATE OR REPLACE FUNCTION public.decrement_stock(p_variant_id uuid,p_quantity integer) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF p_quantity IS NULL OR p_quantity<=0 THEN RAISE EXCEPTION 'Invalid stock quantity'; END IF;
 UPDATE public.variants SET stock=stock-p_quantity WHERE id=p_variant_id AND stock>=p_quantity;
 IF NOT FOUND THEN RAISE EXCEPTION 'Insufficient stock or variant unavailable'; END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.decrement_stock(uuid,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_stock(uuid,integer) TO service_role;

CREATE TABLE IF NOT EXISTS public.rate_limits(key text PRIMARY KEY,hits timestamptz[] NOT NULL DEFAULT '{}');
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.rate_limits FROM anon,authenticated;
GRANT ALL ON public.rate_limits TO service_role;
CREATE OR REPLACE FUNCTION public.consume_rate_limit(p_key text,p_limit integer,p_window_ms integer) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE times timestamptz[]; moment timestamptz:=clock_timestamp(); retry integer;
BEGIN
 IF length(p_key)>300 OR p_limit<1 OR p_limit>1000 OR p_window_ms<1000 OR p_window_ms>86400000 THEN RAISE EXCEPTION 'Invalid rate limit parameters'; END IF;
 INSERT INTO public.rate_limits(key) VALUES(p_key) ON CONFLICT DO NOTHING;
 SELECT hits INTO times FROM public.rate_limits WHERE key=p_key FOR UPDATE;
 SELECT COALESCE(array_agg(t ORDER BY t),'{}'::timestamptz[]) INTO times FROM unnest(times) t WHERE t>moment-(p_window_ms*interval '1 millisecond');
 IF cardinality(times)>=p_limit THEN
  retry:=greatest(1,ceil(extract(epoch FROM times[1]+p_window_ms*interval '1 millisecond'-moment))::integer);
  RETURN jsonb_build_object('allowed',false,'retry_after_seconds',retry,'remaining',0);
 END IF;
 UPDATE public.rate_limits SET hits=array_append(times,moment) WHERE key=p_key;
 -- Bound abandoned bucket accumulation; cleanup is safe under concurrent usage.
 IF random()<0.01 THEN DELETE FROM public.rate_limits WHERE key<>p_key AND (cardinality(hits)=0 OR hits[cardinality(hits)]<moment-interval '2 days'); END IF;
 RETURN jsonb_build_object('allowed',true,'retry_after_seconds',0,'remaining',p_limit-cardinality(times)-1);
END;
$$;
REVOKE ALL ON FUNCTION public.consume_rate_limit(text,integer,integer) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text,integer,integer) TO service_role;

CREATE OR REPLACE FUNCTION public.create_order_atomic(p_order jsonb,p_items jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE order_id uuid:=gen_random_uuid(); entry jsonb; variant public.variants%ROWTYPE; total_quantity integer:=0; computed_subtotal bigint:=0; price integer;
BEGIN
 IF p_order->>'type' NOT IN ('apparel','custom') OR p_order->>'status' NOT IN ('pending','quote_requested') OR (p_order->>'total')::numeric<0 OR (p_order->>'server_verified_amount')::numeric<0 THEN RAISE EXCEPTION 'Invalid order'; END IF;
 IF p_order->>'type'='apparel' THEN
  IF jsonb_array_length(p_items)=0 THEN RAISE EXCEPTION 'Order items required'; END IF;
  -- Ordered locks avoid deadlocks when overlapping carts use different item order.
  FOR entry IN SELECT value FROM jsonb_array_elements(p_items) ORDER BY value->>'variant_id' LOOP
   IF (entry->>'quantity')::integer<1 OR (entry->>'quantity')::integer>10000 THEN RAISE EXCEPTION 'Invalid quantity'; END IF;
   SELECT * INTO variant FROM public.variants WHERE id=(entry->>'variant_id')::uuid FOR UPDATE;
   IF NOT FOUND OR variant.stock<(entry->>'quantity')::integer THEN RAISE EXCEPTION 'Insufficient stock'; END IF;
   SELECT CASE WHEN COALESCE((to_jsonb(variant)->>'price')::integer,0)>0 THEN (to_jsonb(variant)->>'price')::integer ELSE p.price END INTO price FROM public.products p WHERE p.id=variant.product_id AND p.is_active=true;
   IF price IS NULL OR price<=0 OR price<>(entry->>'price_at_purchase')::integer THEN RAISE EXCEPTION 'Price changed. Please refresh checkout'; END IF;
   computed_subtotal:=computed_subtotal+price*(entry->>'quantity')::integer;
   total_quantity:=total_quantity+(entry->>'quantity')::integer;
  END LOOP;
  IF computed_subtotal<>(p_order->>'subtotal')::bigint OR computed_subtotal+(CASE WHEN total_quantity>=10 THEN 0 ELSE 2500 END)<>(p_order->>'total')::bigint THEN RAISE EXCEPTION 'Invalid apparel total'; END IF;
 END IF;
 INSERT INTO public.orders(id,pricing_version,user_id,type,customer_name,email,phone,address,area,subtotal,delivery_fee,total,server_verified_amount,status,paystack_ref,specs,reference_files,status_history)
 VALUES(order_id,1,(p_order->>'user_id')::uuid,p_order->>'type',p_order->>'customer_name',p_order->>'email',p_order->>'phone',p_order->>'address',p_order->>'area',(p_order->>'subtotal')::integer,(p_order->>'delivery_fee')::integer,(p_order->>'total')::integer,(p_order->>'server_verified_amount')::numeric,p_order->>'status',p_order->>'paystack_ref',p_order->'specs',COALESCE(p_order->'reference_files','[]'::jsonb),jsonb_build_array(jsonb_build_object('status',p_order->>'status','timestamp',now(),'note','Order recorded')));
 FOR entry IN SELECT value FROM jsonb_array_elements(p_items) LOOP
  INSERT INTO public.order_items(order_id,variant_id,quantity,price_at_purchase) VALUES(order_id,(entry->>'variant_id')::uuid,(entry->>'quantity')::integer,(entry->>'price_at_purchase')::integer);
 END LOOP;
 RETURN jsonb_build_object('id',order_id);
END;
$$;
REVOKE ALL ON FUNCTION public.create_order_atomic(jsonb,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.create_order_atomic(jsonb,jsonb) TO service_role;

-- Notification outbox records delivery work in the same transaction as payment.
CREATE TABLE IF NOT EXISTS public.payment_notifications(order_id uuid PRIMARY KEY REFERENCES public.orders(id), created_at timestamptz NOT NULL DEFAULT now(), sent_at timestamptz, attempts integer NOT NULL DEFAULT 0, last_error text);
ALTER TABLE public.payment_notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.payment_notifications FROM anon,authenticated;
GRANT ALL ON public.payment_notifications TO service_role;
CREATE OR REPLACE FUNCTION public.settle_order_payment(p_reference text,p_transaction_id text,p_amount_kobo bigint,p_currency text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE ord public.orders%ROWTYPE; entry record; sufficient boolean:=true; required_kobo bigint; final_state text;
BEGIN
 SELECT * INTO ord FROM public.orders WHERE paystack_ref=p_reference FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'ORDER_NOT_FOUND'; END IF;
 required_kobo:=round(COALESCE(ord.server_verified_amount,ord.total)*100)::bigint;
 IF p_currency IS DISTINCT FROM 'NGN' OR p_amount_kobo IS NULL OR p_amount_kobo<=0 OR required_kobo<=0 OR p_amount_kobo<required_kobo OR p_transaction_id IS NULL OR p_transaction_id!~'^[0-9]+$' THEN RAISE EXCEPTION 'PAYMENT_REJECTED'; END IF;
 IF ord.paid_at IS NOT NULL THEN
  IF ord.payment_transaction_id IS DISTINCT FROM p_transaction_id THEN RAISE EXCEPTION 'PAYMENT_REJECTED: different transaction'; END IF;
  RETURN jsonb_build_object('order_id',ord.id,'status',ord.status,'payment_state',ord.payment_state,'already_verified',true,'requires_review',ord.inventory_state='review');
 END IF;
 -- Existing paid/fulfilled orders predate paid_at: never decrement them again.
 IF ord.status IN ('paid','confirmed','processing','in_production','shipped','delivered','completed') THEN
  RETURN jsonb_build_object('order_id',ord.id,'status',ord.status,'payment_state','legacy_paid','already_verified',true,'requires_review',false);
 END IF;
 IF ord.status<>'pending' THEN RAISE EXCEPTION 'PAYMENT_REJECTED: order is not payable'; END IF;
 IF ord.type='custom' AND ord.pricing_version<1 THEN sufficient:=false; END IF;
 IF ord.type='apparel' THEN
  IF NOT EXISTS(SELECT 1 FROM public.order_items WHERE order_id=ord.id) THEN sufficient:=false; END IF;
  FOR entry IN SELECT variant_id,sum(quantity)::integer qty FROM public.order_items WHERE order_id=ord.id GROUP BY variant_id ORDER BY variant_id LOOP
   PERFORM 1 FROM public.variants WHERE id=entry.variant_id AND stock>=entry.qty FOR UPDATE;
   IF NOT FOUND THEN sufficient:=false; END IF;
  END LOOP;
  IF sufficient THEN
   FOR entry IN SELECT variant_id,sum(quantity)::integer qty FROM public.order_items WHERE order_id=ord.id GROUP BY variant_id LOOP
    PERFORM public.decrement_stock(entry.variant_id,entry.qty);
   END LOOP;
  END IF;
 END IF;
 final_state:=CASE WHEN p_amount_kobo<ord.total*100::bigint THEN 'deposit_paid' ELSE 'paid' END;
 UPDATE public.orders SET paid_at=now(),payment_transaction_id=p_transaction_id,paid_amount_kobo=p_amount_kobo,payment_state=final_state,
  inventory_state=CASE WHEN NOT sufficient THEN 'review' WHEN ord.type<>'apparel' THEN 'not_required' ELSE 'deducted' END,
  status=CASE WHEN sufficient THEN 'paid' ELSE 'pending' END,
  admin_notes=CASE WHEN sufficient THEN admin_notes ELSE concat_ws(E'\n',admin_notes,'PAYMENT RECEIVED: pricing or inventory review required; contact customer for fulfillment or refund.') END,
  status_history=COALESCE(status_history,'[]'::jsonb)||jsonb_build_array(jsonb_build_object('status',CASE WHEN sufficient THEN 'paid' ELSE 'pending' END,'payment_state',final_state,'timestamp',now(),'provider_ref',p_transaction_id,'note',CASE WHEN sufficient THEN 'Payment verified' ELSE 'Payment verified; pricing or inventory review required' END)),updated_at=now()
 WHERE id=ord.id;
 INSERT INTO public.payment_notifications(order_id) VALUES(ord.id) ON CONFLICT DO NOTHING;
 RETURN jsonb_build_object('order_id',ord.id,'status',CASE WHEN sufficient THEN 'paid' ELSE 'pending' END,'payment_state',final_state,'already_verified',false,'requires_review',NOT sufficient);
END;
$$;
REVOKE ALL ON FUNCTION public.settle_order_payment(text,text,bigint,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.settle_order_payment(text,text,bigint,text) TO service_role;
CREATE TABLE IF NOT EXISTS public.reference_assets(id uuid PRIMARY KEY,user_id uuid NOT NULL REFERENCES auth.users(id),public_id text NOT NULL,resource_type text NOT NULL,format text NOT NULL,original_name text NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE public.reference_assets ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.reference_assets FROM anon,authenticated;
GRANT SELECT ON public.reference_assets TO authenticated;
GRANT ALL ON public.reference_assets TO service_role;
CREATE POLICY reference_assets_owner ON public.reference_assets FOR SELECT TO authenticated USING(user_id=auth.uid() OR public.is_admin());
-- Status updates lock the row so payment history cannot be overwritten by a stale admin form.
REVOKE UPDATE ON public.orders FROM authenticated;
GRANT UPDATE(admin_notes,updated_at) ON public.orders TO authenticated;
CREATE OR REPLACE FUNCTION public.admin_update_order(p_admin_id uuid,p_order_id uuid,p_status text,p_note text DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE ord public.orders%ROWTYPE;
BEGIN
 IF NOT EXISTS(SELECT 1 FROM public.profiles WHERE id=p_admin_id AND role='admin') THEN RAISE EXCEPTION 'ADMIN_REQUIRED'; END IF;
 IF p_status NOT IN ('pending','paid','confirmed','in_production','ready','shipped','delivered','cancelled','quote_requested') OR length(COALESCE(p_note,''))>4000 THEN RAISE EXCEPTION 'INVALID_STATUS'; END IF;
 SELECT * INTO ord FROM public.orders WHERE id=p_order_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'ORDER_NOT_FOUND'; END IF;
 IF p_status IN ('paid','confirmed','in_production','ready','shipped','delivered') AND ord.paid_at IS NULL AND ord.status NOT IN ('paid','confirmed','in_production','ready','shipped','delivered') THEN RAISE EXCEPTION 'PAYMENT_REQUIRED'; END IF;
 UPDATE public.orders SET status=p_status,admin_notes=COALESCE(p_note,admin_notes),updated_at=now(),status_history=COALESCE(status_history,'[]'::jsonb)||jsonb_build_array(jsonb_build_object('status',p_status,'timestamp',now(),'changed_by',p_admin_id,'note',COALESCE(p_note,'Status updated by administrator'))) WHERE id=ord.id;
 RETURN (SELECT to_jsonb(o) FROM public.orders o WHERE id=ord.id);
END;
$$;
REVOKE ALL ON FUNCTION public.admin_update_order(uuid,uuid,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_order(uuid,uuid,text,text) TO service_role;

ALTER TABLE public.payment_notifications ADD COLUMN IF NOT EXISTS claimed_until timestamptz;
CREATE OR REPLACE FUNCTION public.claim_payment_notifications() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE output jsonb;
BEGIN
 WITH candidates AS (SELECT order_id FROM public.payment_notifications WHERE sent_at IS NULL AND (claimed_until IS NULL OR claimed_until<now()) AND attempts<10 ORDER BY created_at LIMIT 20 FOR UPDATE SKIP LOCKED), claimed AS (
 UPDATE public.payment_notifications n SET claimed_until=now()+interval '5 minutes',attempts=attempts+1 FROM candidates c WHERE n.order_id=c.order_id RETURNING n.order_id
 ) SELECT COALESCE(jsonb_agg(to_jsonb(o)),'[]'::jsonb) INTO output FROM public.orders o JOIN claimed c ON o.id=c.order_id;
 RETURN output;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_payment_notifications() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.claim_payment_notifications() TO service_role;
COMMIT;
