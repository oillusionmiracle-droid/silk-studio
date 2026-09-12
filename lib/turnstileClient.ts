// Shared client-side Cloudflare Turnstile check.
// The widget itself lives in components/TurnstileWidget.tsx; the secret-key
// verification lives server-side in lib/turnstile.ts + /api/verify-turnstile.
// This helper is the single client entry point: hand it the widget token,
// it asks /api/verify-turnstile, and returns true only when verification passes.
// When no NEXT_PUBLIC_TURNSTILE_SITE_KEY is configured (local dev without a
// widget), it returns true so auth flows keep working — the server skips
// verification too unless TURNSTILE_ENFORCE=true.

export async function verifyBotToken(token: string | null): Promise<boolean> {
  // No widget configured (local dev) — skip server check.
  if (!token) {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) return true;
    return false;
  }
  try {
    const res = await fetch('/api/verify-turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}
