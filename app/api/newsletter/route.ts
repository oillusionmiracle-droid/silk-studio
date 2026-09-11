import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import {
  checkRateLimit,
  getClientIp,
  rateLimitedResponse,
} from '@/lib/rateLimit';
import {
  verifyTurnstileToken,
  turnstileFailedResponse,
} from '@/lib/turnstile';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Newsletter signups cost Resend quota per address: throttle per IP and
// per normalized email so one bot can't poison the list.
const NEWSLETTER_IP_LIMIT = 5; // signups
const NEWSLETTER_IP_WINDOW_MS = 60 * 60 * 1000; // per hour, per IP
const NEWSLETTER_EMAIL_LIMIT = 3; // attempts
const NEWSLETTER_EMAIL_WINDOW_MS = 24 * 60 * 60 * 1000; // per day, per email

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const { email, website_url, turnstile_token } = (body as any) ?? {};

    // Silent honeypot: bots fill hidden fields, humans never see them.
    if (typeof website_url === 'string' && website_url.trim().length > 0) {
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json({ ok: true, message: "You're on the list!" });
    }

    if (!email || typeof email !== 'string' || email.length > 254 || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();

    const ip = getClientIp(req);

    // Cloudflare Turnstile (skipped when no TURNSTILE_SECRET_KEY is set).
    const turnstile = await verifyTurnstileToken(turnstile_token, ip);
    if (!turnstile.ok) {
      return turnstileFailedResponse(turnstile.errorCodes);
    }
    const ipRl = checkRateLimit(
      `newsletter:${ip}`,
      NEWSLETTER_IP_LIMIT,
      NEWSLETTER_IP_WINDOW_MS
    );
    if (!ipRl.allowed) {
      return rateLimitedResponse(
        ipRl.retryAfterSeconds,
        'Too many signup attempts. Please try again later.'
      );
    }
    const emailRl = checkRateLimit(
      `newsletter-email:${trimmedEmail}`,
      NEWSLETTER_EMAIL_LIMIT,
      NEWSLETTER_EMAIL_WINDOW_MS
    );
    if (!emailRl.allowed) {
      return rateLimitedResponse(
        emailRl.retryAfterSeconds,
        'This email was already submitted recently. Please try again later.'
      );
    }

    // 1. Save subscriber in Supabase
    const { error: supabaseError } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email: trimmedEmail,
          subscribed_at: new Date().toISOString(),
        },
        {
          onConflict: 'email',
        }
      );

    if (supabaseError) {
      console.error('Supabase newsletter error:', supabaseError);
    }

    // 2. Add subscriber to Resend
    const { data: contact, error: resendError } =
      await resend.contacts.create({
        email: trimmedEmail,
        unsubscribed: false,
      });

    if (resendError) {
      console.error('Resend contact error:', resendError);

      return NextResponse.json(
        {
          error:
            'Your subscription could not be completed right now. Please try again.',
        },
        { status: 500 }
      );
    }

    console.log('Newsletter subscriber added to Resend:', contact);

    // 3. Trigger the Resend welcome automation
    const { error: eventError } = await resend.events.send({
      event: 'newsletter.subscribed',
      email: trimmedEmail,
      payload: {
        email: trimmedEmail,
      },
    });

    if (eventError) {
      console.error('Resend automation event error:', eventError);
    }

    return NextResponse.json({
      ok: true,
      message: "You're on the list!",
    });
  } catch (error) {
    console.error('Newsletter error:', error);

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}