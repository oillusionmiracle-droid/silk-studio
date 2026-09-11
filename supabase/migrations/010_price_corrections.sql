-- Migration 010: Price & spec corrections (Banners, ID Cards, Letterheads, Event Merch)
--
-- ⚠️ SUPERSEDED — keep as a guaranteed no-op.
--
-- Same decision as migration 009: SERVICE pricing is source-controlled in
-- lib/pricing.ts (NOT the database). The live `products` table only holds
-- APPAREL catalog rows; service rows are not stored there. This migration's
-- original body UPDATEs product/service prices and INSERTs variants
-- (name, price, options) — none of which is possible or desired on the live
-- schema (no products.slug, no variants.name/price/options, no
-- variants_product_sku_unique constraint).
--
-- Safely guarded below: the original body only runs when that full schema
-- exists; on the production database it prints a NOTICE and no-ops forever.

DO $$
DECLARE
  v_banners_id UUID;
  v_idcards_id UUID;
  v_letterheads_id UUID;
  v_event_merch_id UUID;
  has_slug BOOLEAN;
  has_pricing_type BOOLEAN;
  has_config_schema BOOLEAN;
  has_custom_quote BOOLEAN;
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
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'pricing_type'
  ) INTO has_pricing_type;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'config_schema'
  ) INTO has_config_schema;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'is_custom_quote'
  ) INTO has_custom_quote;

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

  IF has_slug AND has_pricing_type AND has_config_schema AND has_custom_quote
     AND has_variant_name AND has_variant_price AND has_options AND has_sku_unique THEN
    -- ── Original body (only runs on a schema that actually supports it) ──
    SELECT id INTO v_banners_id FROM public.products WHERE slug IN ('banners', 'rollup-banners') LIMIT 1;
    SELECT id INTO v_idcards_id FROM public.products WHERE slug = 'id-cards' LIMIT 1;
    SELECT id INTO v_letterheads_id FROM public.products WHERE slug = 'letterheads' LIMIT 1;
    SELECT id INTO v_event_merch_id FROM public.products WHERE slug = 'event-merch' LIMIT 1;

    -- 1. Banners -> N700 per sqft with dimensions
    IF v_banners_id IS NOT NULL THEN
      UPDATE public.products
      SET price = 700,
          pricing_type = 'unit',
          config_schema = '{"pricing_unit": "sqft", "has_dimensions": true}'::jsonb
      WHERE id = v_banners_id;
    END IF;

    -- 2. ID Cards variants
    IF v_idcards_id IS NOT NULL THEN
      UPDATE public.products SET price = 4500 WHERE id = v_idcards_id;

      INSERT INTO public.variants (product_id, name, sku, price, stock, options)
      VALUES
        (v_idcards_id, 'Standard Plastic PVC Card', 'IDC-STD', 4500, 1000, '{"idType": "Standard"}'::jsonb),
        (v_idcards_id, 'ID Card with Custom Lanyard & Holder', 'IDC-LANYARD', 8000, 1000, '{"idType": "Lanyard + Holder"}'::jsonb),
        (v_idcards_id, 'ID Card with Badge Reel & Holder', 'IDC-REEL', 10000, 1000, '{"idType": "Badge Reel + Holder"}'::jsonb)
      ON CONFLICT (product_id, sku) DO UPDATE SET
        price = EXCLUDED.price,
        options = EXCLUDED.options;
    END IF;

    -- 3. Letterheads -> Standard 240 / Brown 360, min 50
    IF v_letterheads_id IS NOT NULL THEN
      UPDATE public.products
      SET price = 240,
          pricing_type = 'tier',
          config_schema = '{"paper_types": ["Standard", "Brown"], "quantity_tiers": [50, 100, 200, 500], "min_quantity": 50}'::jsonb
      WHERE id = v_letterheads_id;

      INSERT INTO public.variants (product_id, name, sku, price, stock, options)
      VALUES
        (v_letterheads_id, 'Standard Letterhead', 'LH-STD', 240, 5000, '{"paperType": "Standard"}'::jsonb),
        (v_letterheads_id, 'Brown Letterhead', 'LH-BROWN', 360, 5000, '{"paperType": "Brown"}'::jsonb)
      ON CONFLICT (product_id, sku) DO UPDATE SET
        price = EXCLUDED.price,
        options = EXCLUDED.options;
    END IF;

    -- 4. Event Merch Set -> custom brief
    IF v_event_merch_id IS NOT NULL THEN
      UPDATE public.products
      SET price = 0,
          pricing_type = 'custom_quote',
          is_custom_quote = true
      WHERE id = v_event_merch_id;
    END IF;
  ELSE
    RAISE NOTICE 'Migration 010 skipped: authoritative-pricing schema is not present. Service pricing is source-controlled in lib/pricing.ts.';
  END IF;
END $$;
