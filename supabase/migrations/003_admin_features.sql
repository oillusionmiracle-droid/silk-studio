-- Migration 003: Admin analytics view and admin order status helper

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Secure function to get admin overview statistics
CREATE OR REPLACE FUNCTION get_admin_metrics()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  total_rev NUMERIC;
  order_count INT;
  pending_count INT;
  in_production_count INT;
  delivered_count INT;
  recent_customers INT;
BEGIN
  -- Require admin
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT COALESCE(SUM(total), 0) INTO total_rev FROM orders WHERE status IN ('paid', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered');
  SELECT COUNT(*) INTO order_count FROM orders;
  SELECT COUNT(*) INTO pending_count FROM orders WHERE status = 'pending';
  SELECT COUNT(*) INTO in_production_count FROM orders WHERE status = 'in_production';
  SELECT COUNT(*) INTO delivered_count FROM orders WHERE status = 'delivered';
  SELECT COUNT(*) INTO recent_customers FROM profiles WHERE role = 'customer';

  result := jsonb_build_object(
    'total_revenue', total_rev,
    'total_orders', order_count,
    'pending_orders', pending_count,
    'in_production', in_production_count,
    'delivered', delivered_count,
    'total_customers', recent_customers
  );

  RETURN result;
END;
$$;
