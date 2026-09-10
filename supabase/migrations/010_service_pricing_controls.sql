-- Silk Studio: Service Pricing Controls Migration
-- Adds is_custom_quote flag so admin can toggle whether a service shows a price
-- or routes the customer directly to "Submit Brief" via WhatsApp.

-- 1. Add is_custom_quote column to products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS is_custom_quote BOOLEAN NOT NULL DEFAULT false;

-- 2. Force DESIGN, WEB, and BUNDLES categories to always be custom quote
--    (user confirmed: no pricing for these — always "submit brief")
UPDATE public.products
  SET is_custom_quote = true
  WHERE category IN ('DESIGN', 'WEB', 'BUNDLES');

-- 3. Index for fast filtering in admin
CREATE INDEX IF NOT EXISTS idx_products_is_custom_quote ON public.products (is_custom_quote);

-- Done. PRINT and APPAREL (order-service type) keep is_custom_quote = false
-- and their prices remain editable from the admin Order Services panel.
