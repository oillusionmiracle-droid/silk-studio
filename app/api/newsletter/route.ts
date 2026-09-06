import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

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