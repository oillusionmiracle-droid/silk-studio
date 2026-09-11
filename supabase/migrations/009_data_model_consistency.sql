-- Migration 009: Data Model Consistency & Authoritative Product Variants
--
-- ⚠️ SUPERSEDED — keep as a guaranteed no-op.
--
-- Product decision (studio):
--   * APPAREL store pricing lives in Supabase (products.price + variants
--     sku/size/color/stock). These are the ONLY rows in the live `products`
--     table and they are managed via /admin/products. Working — do not touch.
--   * ALL SERVICE pricing (PRINT, DESIGN, WEB, BUNDLES) is source-controlled
--     in lib/pricing.ts (DEFAULT_PRODUCTS_MAP + formula layer + the fallback
--     branches for ID cards, letterheads, banners, etc.). Editing service
--     prices in the Supabase dashboard does nothing — the code never consults
--     them. These are the prices the studio wants.
--
-- The original body of this migration tried to seed authoritative SERVICE
-- variant pricing into Supabase (INSERT INTO variants (name, sku, price,
-- options) ... ON CONFLICT (product_id, sku)). That fails on this project's
-- live schema, which has no products.slug, no variants.name/price/options,
-- and no variants_product_sku_unique constraint.
--
-- This file is now a strict guard: its original body only runs if that full
-- schema is actually present (fresh-clone edge case with a matching schema).
-- On the production database it prints a NOTICE and no-ops. It can never
-- error and never touches apparel pricing.

DO $$
DECLARE
  v_idcards_id UUID;
  v_bizcards_id UUID;
  v_jotters_id UUID;
  has_slug BOOLEAN;
  has_variant_name BOOLEAN;
  has_variant_price BOOLEAN;
  has_options BOOLEAN;
  has_sku_unique BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'slug'
  ) INTO has_slug;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'variants' AND column_name = 'name'
  ) INTO has_variant_name;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'variants' AND column_name = 'price'
  ) INTO has_variant_price;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'variants' AND column_name = 'options'
  ) INTO has_options;

  SELECT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.variants'::regclass AND conname = 'variants_product_sku_unique'
  ) INTO has_sku_unique;

  IF has_slug AND has_variant_name AND has_variant_price AND has_options AND has_sku_unique THEN
    -- ── Original body (only runs on a schema that actually supports it) ──
    SELECT id INTO v_idcards_id FROM public.products WHERE slug = 'id-cards' LIMIT 1;
    SELECT id INTO v_bizcards_id FROM public.products WHERE slug = 'business-cards' LIMIT 1;
    SELECT id INTO v_jotters_id FROM public.products WHERE slug = 'jotters' LIMIT 1;

    -- 1. ID Cards Variants
    IF v_idcards_id IS NOT NULL THEN
      UPDATE public.products SET price = 4500 WHERE id = v_idcards_id;

      INSERT INTO public.variants (product_id, name, sku, price, stock, options)
      VALUES
        (v_idcards_id, 'Standard Plastic PVC Card', 'IDC-STD', 4500, 1000, '{"idType": "Standard"}'::jsonb),
        (v_idcards_id, 'ID Card with Custom Lanyard & Holder', 'IDC-LANYARD', 7500, 1000, '{"idType": "Lanyard + Holder"}'::jsonb),
        (v_idcards_id, 'ID Card with Badge Reel & Holder', 'IDC-REEL', 7500, 1000, '{"idType": "Badge Reel + Holder"}'::jsonb)
      ON CONFLICT (product_id, sku) DO UPDATE SET
        price = EXCLUDED.price,
        options = EXCLUDED.options;
    END IF;

    -- 2. Business Cards Options
    IF v_bizcards_id IS NOT NULL THEN
      INSERT INTO public.variants (product_id, name, sku, price, stock, options)
      VALUES
        (v_bizcards_id, 'Standard 300gsm Matte Business Cards', 'BC-300-MATTE', 85, 5000, '{"stock": "Standard 300gsm", "lamination": "Matte"}'::jsonb),
        (v_bizcards_id, 'Super Thick 600gsm Velvet Business Cards', 'BC-600-VELVET', 105, 5000, '{"stock": "Super Thick 600gsm", "lamination": "Matte"}'::jsonb)
      ON CONFLICT (product_id, sku) DO UPDATE SET
        price = EXCLUDED.price,
        options = EXCLUDED.options;
    END IF;

    -- 3. Jotters & Notebooks Options
    IF v_jotters_id IS NOT NULL THEN
      INSERT INTO public.variants (product_id, name, sku, price, stock, options)
      VALUES
        (v_jotters_id, 'Soft Cover Spiral Jotters', 'JOT-SOFT-SPIRAL', 850, 2000, '{"cover": "Soft Cover", "binding": "Spiral"}'::jsonb),
        (v_jotters_id, 'Hard Cover Perfect Bound Jotters', 'JOT-HARD-PERFECT', 1650, 2000, '{"cover": "Hard Cover", "binding": "Perfect Binding"}'::jsonb)
      ON CONFLICT (product_id, sku) DO UPDATE SET
        price = EXCLUDED.price,
        options = EXCLUDED.options;
    END IF;
  ELSE
    RAISE NOTICE 'Migration 009 skipped: authoritative-variants schema is not present. Service pricing is source-controlled in lib/pricing.ts.';
  END IF;
END $$;

