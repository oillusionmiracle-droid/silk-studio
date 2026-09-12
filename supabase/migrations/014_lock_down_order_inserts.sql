-- Migration 014: Close the public INSERT hole on orders / order_items
--
-- Previously, both tables had a permissive INSERT policy with
-- `WITH CHECK (true)`, meaning any anon/authenticated request could
-- create an order row directly, bypassing price validation entirely.
--
-- Order creation is meant to happen ONLY through the `create-order`
-- Edge Function, which uses the SUPABASE_SERVICE_ROLE_KEY. The service
-- role always bypasses RLS, so it is unaffected by this change — the
-- real checkout flow keeps working exactly as before.
--
-- This migration removes the open policy and replaces it with an
-- explicit "always false" policy for the public/authenticated roles,
-- so direct client inserts are rejected with a clear, intentional rule
-- instead of relying on an undocumented mechanism.

DROP POLICY IF EXISTS "Allow inserting orders" ON public.orders;
DROP POLICY IF EXISTS "Allow inserting order items" ON public.order_items;

CREATE POLICY "Block direct order inserts"
ON public.orders FOR INSERT
TO public
WITH CHECK (false);

CREATE POLICY "Block direct order item inserts"
ON public.order_items FOR INSERT
TO public
WITH CHECK (false);
