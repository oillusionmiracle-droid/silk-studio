// Shared Cloudflare Turnstile verification for Next.js API routes.
// Canonical server-side validation per
// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ :
//   POST https://challenges.cloudflare.com/turnstile/v0/siteverify
//   body: secret, response (= token), remoteip (optional)
//   → { success: boolean, error-codes?: string[], ... }
// Setup:
//   1. Widget already exists in dash.cloudflare.com → Turnstile. Set:
//        TURNSTILE_SECRET_KEY=... (server only — never expose)
//        NEXT_PUBLIC_TURNSTILE_SITE_KEY=... (public, used by the client widget)
//   2. Verify each token server-side with verifyTurnstileToken() before
//      performing the protected action. Tokens are single-use: consume once
//      per verification, then reset the widget for a fresh token.
// When the secret key is NOT configured, verification is skipped (returns
// { ok: true, skipped: true }) so local dev keeps working without a widget.
// Set TURNSTILE_ENFORCE=true in production to fail closed instead.

interface TurnstileVerifyResult {
  ok: boolean;
  skipped?: boolean;
  errorCodes?: string[];
  hostname?: string;
  action?: string;
}

/** Error codes that mean "user didn't complete / token stale" → retryable. */
const RETRYABLE_CODES = new Set([
  'timeout-or-duplicate', // token already consumed or expired — reset widget, retry
  'invalid-input-response', // missing/expired token — reset widget, retry
]);

export function isRetryableTurnstileError(codes?: string[]): boolean {
  return !!codes?.some((c) => RETRYABLE_CODES.has(c));
}

export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string | null
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const enforce = process.env.TURNSTILE_ENFORCE === 'true';

  if (!secret) {
    // Not configured: open in dev, closed in production when enforced.
    return enforce ? { ok: false } : { ok: true, skipped: true };
  }

  if (!token || typeof token !== 'string') {
    return { ok: false };
  }

  try {
    const body = new URLSearchParams();
    body.set('secret', secret);
    body.set('response', token);
    if (remoteIp) body.set('remoteip', remoteIp);

    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body }
    );
    const data = (await res.json()) as {
      success?: boolean;
      'error-codes'?: string[];
      hostname?: string;
      action?: string;
    };
    if (data.success) {
      return { ok: true, hostname: data.hostname, action: data.action };
    }
    return { ok: false, errorCodes: data['error-codes'] ?? [] };
  } catch (err) {
    console.error('Turnstile verification error:', err);
    // Fail open only when not enforcing; production with ENFORCE=true fails closed.
    return enforce ? { ok: false } : { ok: true, skipped: true };
  }
}

export function turnstileFailedResponse(errorCodes?: string[]) {
  // Distinguish "complete the checkbox / token expired" (retryable) from
  // hard failures so the UI can tell the user to retry vs. contact support.
  if (isRetryableTurnstileError(errorCodes)) {
    return Response.json(
      {
        error: 'Bot verification expired. Please complete the check again.',
        retryable: true,
      },
      { status: 403 }
    );
  }
  return Response.json(
    { error: 'Bot verification failed. Please try again.' },
    { status: 403 }
  );
}
