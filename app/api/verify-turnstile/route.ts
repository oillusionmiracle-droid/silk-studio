import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  getClientIp,
  rateLimitedResponse,
} from '@/lib/rateLimit';
import {
  verifyTurnstileToken,
  turnstileFailedResponse,
} from '@/lib/turnstile';

// Verifying a Turnstile token costs nothing but protects Supabase Auth from
// bots mass-creating accounts / password-spraying: throttle verifiers per IP.
const VERIFY_LIMIT = 20; // checks
const VERIFY_WINDOW_MS = 60 * 1000; // per minute, per IP

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(`verify-turnstile:${ip}`, VERIFY_LIMIT, VERIFY_WINDOW_MS);
  if (!rl.allowed) {
    return rateLimitedResponse(
      rl.retryAfterSeconds,
      'Too many verification attempts. Please wait a moment and try again.'
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const token = (body as any)?.token;
  const result = await verifyTurnstileToken(token, ip);
  if (!result.ok) {
    return turnstileFailedResponse(result.errorCodes);
  }
  return NextResponse.json({ ok: true });
}
