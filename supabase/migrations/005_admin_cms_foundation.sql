-- Silk Studio CMS foundation
-- Additive migration for admin-managed content and apparel inventory.

ALTER TABLE IF EXISTS public.products
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  field TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  value_type TEXT NOT NULL DEFAULT 'text' CHECK (value_type IN ('text', 'url', 'image', 'json')),
  published BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (page, section, field)
);

ALTER TABLE public.page_content
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  description TEXT NOT NULL DEFAULT '',
  image_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  testimonial TEXT NOT NULL,
  photo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot TEXT NOT NULL UNIQUE,
  message TEXT NOT NULL DEFAULT '',
  link_label TEXT,
  link_url TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  message_type TEXT NOT NULL DEFAULT 'general',
  subject TEXT,
  message TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS portfolio_items_order_idx ON public.portfolio_items (display_order, created_at);
CREATE INDEX IF NOT EXISTS testimonials_order_idx ON public.testimonials (display_order, created_at);
CREATE INDEX IF NOT EXISTS faq_items_order_idx ON public.faq_items (display_order, created_at);
CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON public.contact_messages (is_resolved, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products (category);
CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products (is_featured);
CREATE INDEX IF NOT EXISTS products_new_arrival_idx ON public.products (is_new_arrival);
CREATE INDEX IF NOT EXISTS variants_product_id_idx ON public.variants (product_id);
CREATE INDEX IF NOT EXISTS page_content_lookup_idx ON public.page_content (page, section, published);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published portfolio" ON public.portfolio_items;
CREATE POLICY "Public can view published portfolio"
  ON public.portfolio_items FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage portfolio" ON public.portfolio_items;
CREATE POLICY "Admins can manage portfolio"
  ON public.portfolio_items FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view published testimonials" ON public.testimonials;
CREATE POLICY "Public can view published testimonials"
  ON public.testimonials FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view published FAQs" ON public.faq_items;
CREATE POLICY "Public can view published FAQs"
  ON public.faq_items FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage FAQs" ON public.faq_items;
CREATE POLICY "Admins can manage FAQs"
  ON public.faq_items FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view page content" ON public.page_content;
CREATE POLICY "Public can view page content"
  ON public.page_content FOR SELECT TO anon, authenticated
  USING (published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage page content" ON public.page_content;
CREATE POLICY "Admins can manage page content"
  ON public.page_content FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.page_content (page, section, field, value, value_type, published)
VALUES
  ('home', 'hero', 'headline', 'Design. Print. Deliver.', 'text', true),
  ('home', 'hero', 'highlight', 'Flawlessly fast!', 'text', true),
  ('home', 'hero', 'subtext', '250+ expert printers & designers across Lagos. One brief, flawless delivery.', 'text', true),
  ('home', 'hero', 'cta_text', 'START YOUR ORDER', 'text', true),
  ('home', 'hero', 'cta_link', '/order', 'url', true),
  ('home', 'hero', 'video_url', '/videos/hero-bg.mp4', 'url', true),
  ('home', 'hero', 'image_url', '/images/hero-bg.jpg', 'image', true),
  ('apparel', 'hero', 'headline', 'SILK''S ALPHA', 'text', true),
  ('apparel', 'hero', 'subhead', 'New Collection', 'text', true),
  ('apparel', 'hero', 'cta_text', 'SHOP NOW', 'text', true),
  ('apparel', 'hero', 'slide_1_url', '/images/apparel/hero-1.jpg', 'image', true),
  ('apparel', 'hero', 'slide_2_url', '/images/apparel/hero-2.jpg', 'image', true),
  ('apparel', 'hero', 'slide_3_url', '/images/apparel/hero-3.jpg', 'image', true)
ON CONFLICT (page, section, field) DO UPDATE
SET value = EXCLUDED.value, value_type = EXCLUDED.value_type, published = EXCLUDED.published;

DROP POLICY IF EXISTS "Public can view visible banners" ON public.site_banners;
CREATE POLICY "Public can view visible banners"
  ON public.site_banners FOR SELECT TO anon, authenticated
  USING (is_visible = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage banners" ON public.site_banners;
CREATE POLICY "Admins can manage banners"
  ON public.site_banners FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete contact messages" ON public.contact_messages;
CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages FOR DELETE TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view newsletter subscribers"
  ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert variants" ON public.variants;
CREATE POLICY "Admins can insert variants"
  ON public.variants FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update variants" ON public.variants;
CREATE POLICY "Admins can update variants"
  ON public.variants FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete variants" ON public.variants;
CREATE POLICY "Admins can delete variants"
  ON public.variants FOR DELETE TO authenticated
  USING (public.is_admin());
