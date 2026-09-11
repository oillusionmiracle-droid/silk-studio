-- Silk Studio: Seed Order Services (DB-driven service pricing)
-- ─────────────────────────────────────────────────────────────────────
-- Inserts the order-page service catalog (PRINT / APPAREL / DESIGN / WEB / BUNDLES)
-- so prices can be edited from the admin "Order Services" panel instead of code.
-- lib/pricing.ts remains the formula layer (A4/A3/sides/lamination multipliers,
-- ID-card 8,000/10,000 add-ons, letterhead Brown +360, banner N700/sqft) and the
-- offline fallback when a row is missing.
--
-- INSERT-ONLY & idempotent: a row is added only when no product with the same
-- lower(name) exists. It never UPDATEs existing rows and never touches apparel
-- shop items (lowercase tee/shirt/hoodie/cap).

-- ── 1. Column guards (no-op if 007/008/012 already ran) ─────────────
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS pricing_type TEXT NOT NULL DEFAULT 'unit';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS config_schema JSONB;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS display_order INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_custom_quote BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_products_lower_name ON public.products (lower(name));

-- ── 2. PRINT (6 priced + 1 brief) ───────────────────────────────────
INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Flyers & Handbills', 'Flyers & Handbills', 'flyers', 'PRINT', 120, 'tier', false,
       'Custom printed flyers and handbills. Size, sides and lamination options.',
       '{}'::jsonb, 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'flyers & handbills');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Banners', 'Banners', 'rollup-banners', 'PRINT', 700, 'unit', false,
       'Square-footage priced banners and flex with optional eyelets.',
       '{"has_dimensions": true, "pricing_unit": "sqft"}'::jsonb, 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'banners');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Billboards & Flex', 'Billboards & Flex', 'flex-billboards', 'PRINT', 0, 'custom_quote', true,
       'Large-format billboards and flex. Submit a brief for a quote.',
       '{}'::jsonb, 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'billboards & flex');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Jotters & Notepads', 'Jotters & Notepads', 'jotters', 'PRINT', 850, 'tier', false,
       'Custom jotters and notepads. Cover and binding options available.',
       '{}'::jsonb, 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'jotters & notepads');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'ID Cards', 'ID Cards', 'id-cards', 'PRINT', 4500, 'tier', false,
       'Standard PVC ID cards. Lanyard and badge-reel options available.',
       '{}'::jsonb, 50, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'id cards');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Business Cards', 'Business Cards', 'business-cards', 'PRINT', 85, 'tier', false,
       'Business cards with stock, lamination and corner options.',
       '{}'::jsonb, 60, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'business cards');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Letterheads', 'Letterheads', 'letterheads', 'PRINT', 240, 'tier', false,
       'Letterheads, 50 unit minimum. Standard and brown paper options.',
       '{"min_quantity": 50, "paper_types": ["Standard", "Brown"]}'::jsonb, 70, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'letterheads');

-- ── 3. APPAREL (4 priced + 2 brief) ─────────────────────────────────
INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Custom T-Shirts', 'Custom T-Shirts', 'custom-tshirts', 'APPAREL', 9000, 'tier', false,
       'Custom printed t-shirts by size and quantity.',
       '{}'::jsonb, 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'custom t-shirts');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Sweatshirts', 'Sweatshirts', 'custom-sweatshirts', 'APPAREL', 14000, 'tier', false,
       'Custom sweatshirts by size and quantity.',
       '{}'::jsonb, 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'sweatshirts');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Grey Joggers', 'Grey Joggers', 'custom-joggers', 'APPAREL', 15000, 'tier', false,
       'Custom grey joggers by size and quantity.',
       '{}'::jsonb, 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'grey joggers');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Hoodies', 'Hoodies', 'custom-hoodies', 'APPAREL', 18000, 'tier', false,
       'Custom hoodies by size and quantity.',
       '{}'::jsonb, 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'hoodies');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Event Merch Set', 'Event Merch Set', 'event-merch', 'APPAREL', 0, 'custom_quote', true,
       'Event merchandise sets. Submit a brief for a quote.',
       '{}'::jsonb, 50, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'event merch set');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Corporate Uniforms', 'Corporate Uniforms', 'corporate-uniforms', 'APPAREL', 0, 'custom_quote', true,
       'Corporate uniforms and staffwear. Submit a brief for a quote.',
       '{}'::jsonb, 60, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'corporate uniforms');

-- ── 4. DESIGN (4 brief-only, hard-locked in code) ───────────────────
INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Logo & Brand Identity', 'Logo & Brand Identity', 'logo-brand-identity', 'DESIGN', 0, 'custom_quote', true,
       'Logo design and full brand identity. Submit a brief.',
       '{}'::jsonb, 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'logo & brand identity');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Event Branding Kit', 'Event Branding Kit', 'event-branding', 'DESIGN', 0, 'custom_quote', true,
       'Event branding kits. Submit a brief for a quote.',
       '{}'::jsonb, 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'event branding kit');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Social Media Templates', 'Social Media Templates', 'social-media-templates', 'DESIGN', 0, 'custom_quote', true,
       'Social media template packs. Submit a brief for a quote.',
       '{}'::jsonb, 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'social media templates');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Print-Ready Artwork', 'Print-Ready Artwork', 'print-ready-artwork', 'DESIGN', 0, 'custom_quote', true,
       'Print-ready artwork production. Submit a brief for a quote.',
       '{}'::jsonb, 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'print-ready artwork');

-- ── 5. WEB (4 brief today, package-priced when enabled in admin) ────
INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Landing Page', 'Landing Page', 'landing-page', 'WEB', 0, 'package', true,
       'Single-page landing websites. Brief today, flat package price when enabled in admin.',
       '{}'::jsonb, 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'landing page');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Business Website', 'Business Website', 'business-website', 'WEB', 0, 'package', true,
       'Multi-page business websites. Brief today, flat package price when enabled in admin.',
       '{}'::jsonb, 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'business website');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'E-commerce', 'E-commerce', 'ecommerce-website', 'WEB', 0, 'package', true,
       'Online store builds. Brief today, flat package price when enabled in admin.',
       '{}'::jsonb, 30, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'e-commerce');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Event Page', 'Event Page', 'event-website', 'WEB', 0, 'package', true,
       'Event websites. Brief today, flat package price when enabled in admin.',
       '{}'::jsonb, 40, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'event page');

-- ── 6. BUNDLES (2 brief-only, hard-locked in code) ──────────────────
INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Event Package', 'Event Package', 'event-branding-bundle', 'BUNDLES', 0, 'custom_quote', true,
       'Full event design and print package. Submit a brief for a quote.',
       '{}'::jsonb, 10, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'event package');

INSERT INTO public.products
  (name, title, slug, category, price, pricing_type, is_custom_quote, description, config_schema, display_order, is_active)
SELECT 'Business Starter', 'Business Starter', 'startup-launch-pack', 'BUNDLES', 0, 'custom_quote', true,
       'Business starter branding and print package. Submit a brief for a quote.',
       '{}'::jsonb, 20, true
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE lower(name) = 'business starter');