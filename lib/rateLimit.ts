// Shared zero-dependency IP rate limiter for Next.js API routes.
// In-memory sliding-window counters. Good enough as a first bot/abuse
// barrier on a single server instance; for multi-instance / serverless
// production use, swap the Map for Upstash Redis or a Supabase table.

type Bucket = {
  hits: number[];
};

const buckets = new Map<string, Bucket>();

function prune(now: number, bucket: Bucket, windowMs: number) {
  const cutoff = now - windowMs;
  // hits is append-only in time order, so drop from the front.
  let drop = 0;
  for (let i = 0; i < bucket.hits.length; i++) {
    if (bucket.hits[i] <= cutoff) drop = i + 1;
    else break;
  }
  if (drop > 0) bucket.hits.splice(0, drop);
}

// Persist across Next.js HMR in dev.
const store: Map<string, Bucket> =
  (globalThis as any).__silkRateLimitStore ?? buckets;
if (!(globalThis as any).__silkRateLimitStore) {
  (globalThis as any).__silkRateLimitStore = store;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 64);
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim().slice(0, 64);
  return 'unknown';
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Sliding-window check. Returns allowed=false when `limit` hits were
 * already recorded inside the trailing `windowMs`.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  let bucket = store.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    store.set(key, bucket);
  }
  prune(now, bucket, windowMs);

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000)
    );
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  bucket.hits.push(now);
  return { allowed: true, remaining: limit - bucket.hits.length, retryAfterSeconds: 0 };
}

export function rateLimitedResponse(retryAfterSeconds: number, message?: string) {
  return Response.json(
    { error: message || 'Too many requests. Please slow down and try again.' },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSeconds) },
    }
  );
}
