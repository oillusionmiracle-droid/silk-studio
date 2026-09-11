-- Silk Studio: distributed rate-limit buckets for Edge Functions.
-- The Next.js in-memory limiter (lib/rateLimit.ts) is per-instance; Supabase
-- Edge Functions are Deno isolates that cannot share memory, so throttle
-- create-order / verify-order here with Postgres-backed sliding windows.

CREATE TABLE IF NOT EXISTS public.rate_limits (
  key TEXT PRIMARY KEY,
  hits TIMESTAMPTZ[] NOT NULL DEFAULT '{}'
);

-- Service-role only: Edge Functions use SERVICE_ROLE_KEY and bypass RLS,
-- but keep RLS on so anon/authenticated clients cannot read or forge buckets.
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No client access to rate_limits" ON public.rate_limits;
CREATE POLICY "No client access to rate_limits"
  ON public.rate_limits FOR ALL
  USING (false)
  WITH CHECK (false);
