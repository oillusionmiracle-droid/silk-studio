import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/* ─────────────────────────────────────────
   Newsletter Subscription API Route
   Connects to Mailchimp using existing .env.local keys
   and optionally logs to Supabase if configured.
───────────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();

    // 1. Mailchimp Integration (using keys in .env.local)
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const region = process.env.MAILCHIMP_API_REGION || 'us2';

    let mailchimpSuccess = false;

    if (apiKey && audienceId) {
      try {
        const url = `https://${region}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `apikey ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: trimmedEmail,
            status: 'subscribed',
          }),
        });

        const data = await res.json();

        // 200/201 is success; title: 'Member Exists' is also acceptable
        if (res.ok || data.title === 'Member Exists') {
          mailchimpSuccess = true;
        } else {
          console.warn('Mailchimp API notice:', data);
        }
      } catch (mcErr) {
        console.error('Mailchimp connection error:', mcErr);
      }
    }

    // 2. Supabase Integration (fallback / dual storage)
    try {
      await supabase
        .from('newsletter_subscribers')
        .upsert(
          { email: trimmedEmail, subscribed_at: new Date().toISOString() },
          { onConflict: 'email' }
        );
    } catch {
      // Ignore Supabase table errors if table isn't created yet
    }

    return NextResponse.json({
      ok: true,
      message: "You're on the list! Thank you for subscribing.",
    });
  } catch (error: any) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
