-- Silk Studio: Supabase RLS and Authorization Hardening Audit
-- Enforces zero-trust database-level authorization.

-- 1. Helper function to check if caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- 2. PRODUCTS TABLE RLS
-- Public can ONLY view active products. Admins can view and manage all.
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE TO authenticated
  USING (public.is_admin());

-- 3. VARIANTS TABLE RLS
-- Public can view variants of active products. Admins can view/manage all.
ALTER TABLE IF EXISTS public.variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view variants" ON public.variants;
CREATE POLICY "Public can view variants"
  ON public.variants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = variants.product_id
        AND (products.is_active = true OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Admins can insert variants" ON public.variants;
CREATE POLICY "Admins can insert variants"
  ON public.variants FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update variants" ON public.variants;
CREATE POLICY "Admins can update variants"
  ON public.variants FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete variants" ON public.variants;
CREATE POLICY "Admins can delete variants"
  ON public.variants FOR DELETE TO authenticated
  USING (public.is_admin());

-- 4. ORDERS TABLE RLS
-- Customers can view only their own orders. Admins can view all.
-- Browser cannot update order status (updates restricted to Admins and Service Role).
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders or admins all" ON public.orders;
CREATE POLICY "Users can view own orders or admins all"
  ON public.orders FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Allow inserting orders" ON public.orders;
CREATE POLICY "Allow inserting orders"
  ON public.orders FOR INSERT TO public
  WITH CHECK (true);

-- Browser cannot update order status or total arbitrary amounts
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. ORDER_ITEMS TABLE RLS
-- Customers can view only order items for orders they own. Admins can view all.
ALTER TABLE IF EXISTS public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Allow inserting order items" ON public.order_items;
CREATE POLICY "Allow inserting order items"
  ON public.order_items FOR INSERT TO public
  WITH CHECK (true);

-- 6. CUSTOMER PROFILES TABLE RLS
-- Users can only view and edit their own profile. Non-admins cannot alter their role.
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (
    (id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    OR public.is_admin()
  );

-- 7. CMS TABLES RLS (Testimonials, FAQs, Page Content, Site Banners)
-- Public can ONLY read published items. Admins can manage all.
ALTER TABLE IF EXISTS public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
CREATE POLICY "Public can view published testimonials"
  ON public.testimonials FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

ALTER TABLE IF EXISTS public.faq_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published FAQs" ON public.faq_items;
CREATE POLICY "Public can view published FAQs"
  ON public.faq_items FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage FAQs" ON public.faq_items;
CREATE POLICY "Admins can manage FAQs"
  ON public.faq_items FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

ALTER TABLE IF EXISTS public.page_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view page content" ON public.page_content;
CREATE POLICY "Public can view page content"
  ON public.page_content FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage page content" ON public.page_content;
CREATE POLICY "Admins can manage page content"
  ON public.page_content FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

ALTER TABLE IF EXISTS public.site_banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view visible banners" ON public.site_banners;
CREATE POLICY "Public can view visible banners"
  ON public.site_banners FOR SELECT TO anon, authenticated
  USING (is_visible = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage banners" ON public.site_banners;
CREATE POLICY "Admins can manage banners"
  ON public.site_banners FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. CONTACT MESSAGES & NEWSLETTER SUBSCRIBERS
ALTER TABLE IF EXISTS public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete contact messages" ON public.contact_messages;
CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages FOR DELETE TO authenticated
  USING (public.is_admin());

ALTER TABLE IF EXISTS public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view newsletter subscribers"
  ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (public.is_admin());

