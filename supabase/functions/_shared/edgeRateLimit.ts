// Shared Postgres-backed sliding-window rate limiter for Supabase Edge
// Functions (Deno). Edge Functions run as separate isolates with no shared
// memory, so the Next.js in-memory limiter cannot protect them — throttle
// here via the public.rate_limits table (see migration 009_rate_limits.sql).
// Requires a Supabase client created with the SERVICE_ROLE_KEY.

async function pruneAndCheck(
  supabase: any,
  key: string,
  limit: number,
  windowMs: number,
  now: number
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const cutoffIso = new Date(now - windowMs).toISOString();

  const { data: row } = await supabase
    .from('rate_limits')
    .select('hits')
    .eq('key', key)
    .maybeSingle();

  const hits: string[] = Array.isArray(row?.hits) ? row.hits : [];
  const fresh = hits.filter((t) => t > cutoffIso);

  if (fresh.length >= limit) {
    const oldest = new Date(fresh[0]).getTime();
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000)
    );
    return { allowed: false, retryAfterSeconds };
  }

  fresh.push(new Date(now).toISOString());
  // Keep the stored array bounded to the largest window we use.
  const trimmed = fresh.slice(-100);

  await supabase
    .from('rate_limits')
    .upsert({ key, hits: trimmed }, { onConflict: 'key' });

  return { allowed: true, retryAfterSeconds: 0 };
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 64);
  const realIp =
    req.headers.get('x-real-ip') ?? req.headers.get('cf-connecting-ip');
  if (realIp) return realIp.trim().slice(0, 64);
  return 'unknown';
}

export async function edgeRateLimit(
  supabase: any,
  req: Request,
  scope: string,
  limit: number,
  windowMs: number
): Promise<Response | null> {
  try {
    const key = `${scope}:${clientIp(req)}`;
    const res = await pruneAndCheck(supabase, key, limit, windowMs, Date.now());
    if (!res.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests. Please slow down and try again.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(res.retryAfterSeconds),
          },
        }
      );
    }
    return null;
  } catch (err) {
    // Fail open on limiter errors so a rate-table outage never blocks checkout;
    // the payment itself is still verified against Paystack server-side.
    console.warn(`edgeRateLimit(${scope}) bypassed on error:`, err);
    return null;
  }
}
