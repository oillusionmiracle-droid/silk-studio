-- Migration 009: Data Model Consistency & Authoritative Product Variants
-- Establishes database-backed variant pricing for ID cards, print configurations, and apparel

DO $$
DECLARE
  v_idcards_id UUID;
  v_bizcards_id UUID;
  v_jotters_id UUID;
BEGIN
  -- Retrieve product IDs
  SELECT id INTO v_idcards_id FROM public.products WHERE slug = 'id-cards' LIMIT 1;
  SELECT id INTO v_bizcards_id FROM public.products WHERE slug = 'business-cards' LIMIT 1;
  SELECT id INTO v_jotters_id FROM public.products WHERE slug = 'jotters' LIMIT 1;

  -- 1. ID Cards Variants (Authoritative prices in Supabase)
  IF v_idcards_id IS NOT NULL THEN
    -- Update base product price to reflect standard card unit price
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
END $$;

