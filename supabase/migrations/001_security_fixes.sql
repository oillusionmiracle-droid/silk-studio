-- Migration 001: Security Fixes, Status Flow, Order Types, and RLS Policies
-- Execute in Supabase SQL Editor or via Supabase CLI

-- 1. Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Alter or ensure orders table structure
DO $$ 
BEGIN
  -- Add user_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;

  -- Add type column ('apparel' | 'custom')
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'type'
  ) THEN
    ALTER TABLE orders ADD COLUMN type TEXT DEFAULT 'apparel' CHECK (type IN ('apparel', 'custom'));
  END IF;

  -- Add server_verified_amount column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'server_verified_amount'
  ) THEN
    ALTER TABLE orders ADD COLUMN server_verified_amount NUMERIC;
  END IF;

  -- Add status_history column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'status_history'
  ) THEN
    ALTER TABLE orders ADD COLUMN status_history JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add admin_notes column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE orders ADD COLUMN admin_notes TEXT;
  END IF;

  -- Add specs column (for custom orders)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'specs'
  ) THEN
    ALTER TABLE orders ADD COLUMN specs JSONB;
  END IF;

  -- Add reference_files column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'reference_files'
  ) THEN
    ALTER TABLE orders ADD COLUMN reference_files JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE orders ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Ensure status has correct default 'pending'
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';

-- 3. Atomic stock decrement RPC
CREATE OR REPLACE FUNCTION decrement_stock(p_variant_id UUID, p_quantity INT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE variants
  SET stock = GREATEST(stock - p_quantity, 0)
  WHERE id = p_variant_id;
END;
$$;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Products and Variants (public read)
DROP POLICY IF EXISTS "Public can view active products" ON products;
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public can view variants" ON variants;
CREATE POLICY "Public can view variants"
  ON variants FOR SELECT
  USING (true);

-- 6. Policies for Orders
-- Users can view their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Service role handles inserts and updates (Edge Functions)
-- But authenticated users / admins can update when permitted
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 7. Policies for Order Items
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND (
          orders.user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
          )
        )
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_paystack_ref ON orders(paystack_ref);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
