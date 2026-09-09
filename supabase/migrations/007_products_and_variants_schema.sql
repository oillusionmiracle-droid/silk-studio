-- Silk Studio: Products, Variants & Dynamic Pricing Schema Migration
-- Enhances existing products and variants tables to serve as the single source of truth for all products & configurations.

-- 1. Ensure baseline products table exists
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Add columns to products table if missing
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS pricing_type TEXT NOT NULL DEFAULT 'tier',
  ADD COLUMN IF NOT EXISTS config_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN NOT NULL DEFAULT false;

-- Sync title and name columns if one exists
UPDATE public.products SET title = name WHERE title IS NULL AND name IS NOT NULL;
UPDATE public.products SET name = title WHERE name IS NULL AND title IS NOT NULL;

-- Create unique constraint on slug for ON CONFLICT support
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_slug_unique;
ALTER TABLE public.products ADD CONSTRAINT products_slug_unique UNIQUE (slug);
CREATE INDEX IF NOT EXISTS products_category_order_idx ON public.products (category, display_order);

-- 3. Ensure baseline variants table exists
CREATE TABLE IF NOT EXISTS public.variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Add columns to variants table if missing
ALTER TABLE public.variants
  ADD COLUMN IF NOT EXISTS options JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS min_quantity INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS max_quantity INTEGER;

CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.variants (product_id);

-- 5. Row Level Security Policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view variants" ON public.variants;
CREATE POLICY "Public can view variants" ON public.variants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert variants" ON public.variants;
CREATE POLICY "Admins can insert variants" ON public.variants FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update variants" ON public.variants;
CREATE POLICY "Admins can update variants" ON public.variants FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete variants" ON public.variants;
CREATE POLICY "Admins can delete variants" ON public.variants FOR DELETE TO authenticated USING (public.is_admin());

-- 6. Seed Products & Configurations
DO $$
DECLARE
  p_flyers UUID := gen_random_uuid();
  p_banners UUID := gen_random_uuid();
  p_flex UUID := gen_random_uuid();
  p_jotters UUID := gen_random_uuid();
  p_idcards UUID := gen_random_uuid();
  p_bizcards UUID := gen_random_uuid();
  p_letterheads UUID := gen_random_uuid();

  p_tshirts UUID := gen_random_uuid();
  p_sweatshirts UUID := gen_random_uuid();
  p_joggers UUID := gen_random_uuid();
  p_hoodies UUID := gen_random_uuid();
  p_event_merch UUID := gen_random_uuid();
  p_corp_uniforms UUID := gen_random_uuid();

  p_logo UUID := gen_random_uuid();
  p_event_branding UUID := gen_random_uuid();
  p_social_templates UUID := gen_random_uuid();
  p_print_artwork UUID := gen_random_uuid();

  p_landing UUID := gen_random_uuid();
  p_biz_website UUID := gen_random_uuid();
  p_ecommerce UUID := gen_random_uuid();
  p_event_website UUID := gen_random_uuid();

  p_starter_bundle UUID := gen_random_uuid();
  p_event_bundle UUID := gen_random_uuid();
BEGIN
  -- PRINT PRODUCTS
  INSERT INTO public.products (id, name, title, slug, category, description, price, pricing_type, display_order, config_schema)
  VALUES
    (p_flyers, 'Flyers & Handbills', 'Flyers & Handbills', 'flyers', 'PRINT', 'High quality marketing flyers on premium paper stock.', 65, 'tier', 1,
     '{"sizes": ["A6", "A5", "A4"], "paper_types": ["135gsm Gloss", "150gsm Matte", "300gsm Card"], "sides": ["Single-sided", "Double-sided"], "quantity_tiers": [100, 250, 500, 1000, 2500, 5000]}'::jsonb),
    (p_banners, 'Roll-up Banners', 'Roll-up Banners', 'banners', 'PRINT', 'Retractable banner stands with vibrant HD printing.', 38000, 'unit', 2,
     '{"sizes": ["Standard (3x6 ft)", "Big (4x7 ft)"], "quantity_tiers": [1, 2, 5, 10]}'::jsonb),
    (p_flex, 'Billboards & Flex Banners', 'Billboards & Flex Banners', 'flex-billboards', 'PRINT', 'Durable outdoor flex banners and billboard prints.', 450, 'unit', 3,
     '{"pricing_unit": "sqft", "has_dimensions": true}'::jsonb),
    (p_jotters, 'Custom Jotters & Notebooks', 'Custom Jotters & Notebooks', 'jotters', 'PRINT', 'Branded notebooks and souvenir jotters.', 850, 'tier', 4,
     '{"sizes": ["A5", "A4"], "cover_types": ["Soft Cover (300gsm)", "Hard Cover"], "quantity_tiers": [50, 100, 200, 500]}'::jsonb),
    (p_idcards, 'Plastic ID Cards & Lanyards', 'Plastic ID Cards & Lanyards', 'id-cards', 'PRINT', 'PVC plastic identity cards with custom branded lanyards.', 1500, 'tier', 5,
     '{"types": ["Plastic PVC Card", "Plastic Card + Custom Lanyard"], "quantity_tiers": [10, 50, 100, 500]}'::jsonb),
    (p_bizcards, 'Business Cards', 'Business Cards', 'business-cards', 'PRINT', 'Premium corporate business cards with matte or glossy finish.', 85, 'tier', 6,
     '{"paper_types": ["350gsm Matte", "350gsm Gloss", "Velvet Laminated"], "sides": ["Single-sided", "Double-sided"], "quantity_tiers": [100, 200, 500, 1000]}'::jsonb),
    (p_letterheads, 'Corporate Letterheads', 'Corporate Letterheads', 'letterheads', 'PRINT', 'Official letterheads printed on high grade bond paper.', 120, 'tier', 7,
     '{"paper_types": ["100gsm Bond", "120gsm Executive"], "quantity_tiers": [100, 250, 500, 1000]}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  -- APPAREL PRODUCTS
  INSERT INTO public.products (id, name, title, slug, category, description, price, pricing_type, display_order, config_schema)
  VALUES
    (p_tshirts, 'Custom T-Shirts', 'Custom T-Shirts', 'custom-tshirts', 'APPAREL', 'Premium 100% cotton custom printed t-shirts.', 6500, 'tier', 1,
     '{"sizes": ["S", "M", "L", "XL", "XXL"], "print_positions": ["Front Only", "Front & Back"], "quantity_tiers": [1, 5, 10, 25, 50, 100]}'::jsonb),
    (p_sweatshirts, 'Custom Sweatshirts', 'Custom Sweatshirts', 'custom-sweatshirts', 'APPAREL', 'Heavyweight fleece custom sweatshirts.', 14000, 'tier', 2,
     '{"sizes": ["S", "M", "L", "XL", "XXL"], "quantity_tiers": [1, 5, 10, 25, 50]}'::jsonb),
    (p_joggers, 'Custom Joggers', 'Custom Joggers', 'custom-joggers', 'APPAREL', 'Tailored fleece joggers with custom embroidery or screen print.', 15000, 'tier', 3,
     '{"sizes": ["S", "M", "L", "XL"], "quantity_tiers": [1, 5, 10, 25]}'::jsonb),
    (p_hoodies, 'Custom Hoodies', 'Custom Hoodies', 'custom-hoodies', 'APPAREL', 'Premium fleece hoodies with pouch pocket and custom artwork.', 18000, 'tier', 4,
     '{"sizes": ["S", "M", "L", "XL", "XXL"], "quantity_tiers": [1, 5, 10, 25, 50]}'::jsonb),
    (p_event_merch, 'Event Merchandise Pack', 'Event Merchandise Pack', 'event-merch', 'APPAREL', 'Branded caps, totes, and t-shirts for events.', 4500, 'tier', 5,
     '{"items": ["T-Shirt", "Tote Bag", "Dad Cap", "Wristband"], "quantity_tiers": [10, 25, 50, 100, 250]}'::jsonb),
    (p_corp_uniforms, 'Corporate Uniforms & Polo Shirts', 'Corporate Uniforms & Polo Shirts', 'corporate-uniforms', 'APPAREL', 'Embroidered corporate polo shirts and staff uniforms.', 9500, 'tier', 6,
     '{"sizes": ["S", "M", "L", "XL", "XXL"], "quantity_tiers": [10, 25, 50, 100]}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  -- DESIGN SERVICES
  INSERT INTO public.products (id, name, title, slug, category, description, price, pricing_type, display_order, config_schema)
  VALUES
    (p_logo, 'Logo & Brand Identity', 'Logo & Brand Identity', 'logo-brand-identity', 'DESIGN', 'Professional logo design, color palette, and brand guidelines package.', 75000, 'package', 1,
     '{"deliverables": ["3 Logo Concepts", "Vector Files (AI, SVG, PDF)", "Color Palette", "Typography System", "Brand Guide"]}'::jsonb),
    (p_event_branding, 'Event Branding Package', 'Event Branding Package', 'event-branding', 'DESIGN', 'Complete visual branding for corporate events, weddings, and concerts.', 120000, 'package', 2,
     '{"deliverables": ["Event Logo", "Banner Designs", "Program/Menu Artwork", "Social Media Banners"]}'::jsonb),
    (p_social_templates, 'Social Media Design Templates', 'Social Media Design Templates', 'social-media-templates', 'DESIGN', 'Editable Canva and Figma templates custom made for your brand.', 45000, 'package', 3,
     '{"deliverables": ["10 Feed Post Templates", "5 Story Templates", "Figma Source File"]}'::jsonb),
    (p_print_artwork, 'Print-Ready Artwork Design', 'Print-Ready Artwork Design', 'print-ready-artwork', 'DESIGN', 'Single design brief transformed into production-ready print artwork.', 15000, 'unit', 4,
     '{"deliverables": ["High-Res Print PDF", "3D Mockup", "Source File"]}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  -- WEB SERVICES
  INSERT INTO public.products (id, name, title, slug, category, description, price, pricing_type, display_order, config_schema)
  VALUES
    (p_landing, 'Landing Page Development', 'Landing Page Development', 'landing-page', 'WEB', 'High-converting responsive single-page website.', 150000, 'package', 1,
     '{"tech": ["Next.js / React", "Tailwind CSS", "Framer Motion"], "timeline": "5-7 Business Days"}'::jsonb),
    (p_biz_website, 'Business Website', 'Business Website', 'business-website', 'WEB', 'Multi-page corporate website with CMS and booking capabilities.', 350000, 'package', 2,
     '{"tech": ["Next.js", "Supabase CMS", "SEO Optimization"], "timeline": "2 Weeks"}'::jsonb),
    (p_ecommerce, 'E-commerce Website', 'E-commerce Website', 'ecommerce-website', 'WEB', 'Full-stack online store with Paystack payment integration and admin inventory.', 600000, 'package', 3,
     '{"tech": ["Next.js", "Supabase", "Paystack", "Admin Dashboard"], "timeline": "3-4 Weeks"}'::jsonb),
    (p_event_website, 'Event Website & Ticketing', 'Event Website & Ticketing', 'event-website', 'WEB', 'Interactive event website with RSVP, ticket sales, and schedule.', 200000, 'package', 4,
     '{"tech": ["Next.js", "Paystack RSVP", "QR Code Tickets"], "timeline": "1-2 Weeks"}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  -- BUNDLES
  INSERT INTO public.products (id, name, title, slug, category, description, price, pricing_type, display_order, config_schema)
  VALUES
    (p_starter_bundle, 'Startup Launch Pack', 'Startup Launch Pack', 'startup-launch-pack', 'BUNDLES', 'Complete launch pack: Brand identity + 500 Business Cards + 2 Roll-up Banners + 100 Flyers.', 180000, 'package', 1,
     '{"included_items": ["Logo & Brand Package", "500 Business Cards", "2 Roll-up Banners", "100 A5 Flyers"]}'::jsonb),
    (p_event_bundle, 'Event Souvenir & Branding Bundle', 'Event Souvenir & Branding Bundle', 'event-branding-bundle', 'BUNDLES', 'Full event package: Event Logo + 100 Custom Jotters + 2 Roll-up Banners + 50 Custom T-Shirts.', 320000, 'package', 2,
     '{"included_items": ["Event Branding Design", "100 Hardcover Jotters", "2 Roll-up Banners", "50 Custom T-Shirts"]}'::jsonb)
  ON CONFLICT (slug) DO NOTHING;
END $$;

