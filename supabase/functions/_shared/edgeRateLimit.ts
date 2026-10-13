import { json } from "./http.ts";
export function clientIp(req: Request): string {
  // Use only behind the platform ingress, which must overwrite these headers.
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown"
  )
    .trim()
    .slice(0, 64);
}
export async function edgeRateLimit(
  supabase: any,
  req: Request,
  scope: string,
  limit: number,
  windowMs: number,
): Promise<Response | null> {
  const { data, error } = await supabase.rpc("consume_rate_limit", {
    p_key: `${scope}:${clientIp(req)}`,
    p_limit: limit,
    p_window_ms: windowMs,
  });
  if (error || !data)
    return json(
      { error: "Service temporarily unavailable. Please try again." },
      503,
    );
  if (data.allowed) return null;
  const response = json(
    { error: "Too many requests. Please try again later." },
    429,
  );
  response.headers.set("Retry-After", String(data.retry_after_seconds));
  return response;
}
