import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

const welcomeEmailHTML = `[your HTML here]`;

export async function POST(req: NextRequest) {
  try {
    console.log('📧 Newsletter request received');
    
    const { email } = await req.json();
    console.log('Email from body:', email);

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.log('❌ Invalid email format');
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();
    console.log('✅ Email validated:', trimmedEmail);

    // 1. Save to Supabase
    console.log('💾 Saving to Supabase...');
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
      console.error('❌ Supabase error:', supabaseError);
    } else {
      console.log('✅ Saved to Supabase');
    }

    // 2. Send email
    console.log('📨 Sending email via Resend...');
    console.log('From:', 'hello@mail.silkstudios.com.ng');
    console.log('To:', trimmedEmail);
    console.log('API Key exists:', !!process.env.RESEND_API_KEY);

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'hello@mail.silkstudios.com.ng',
      to: trimmedEmail,
      subject: '🖤 Welcome to Silk Studios',
      html: welcomeEmailHTML,
    });

    if (emailError) {
      console.error('❌ RESEND ERROR:', emailError);
      console.error('Error code:', emailError.message);
      return NextResponse.json(
        { error: 'Email failed: ' + emailError.message },
        { status: 500 }
      );
    }

    console.log('✅ Email sent successfully:', emailData);

    return NextResponse.json({
      ok: true,
      message: "You're on the list! Check your email.",
      emailId: emailData.id,
    });
  } catch (error) {
    console.error('❌ FATAL ERROR:', error);
    return NextResponse.json(
      { error: 'Something went wrong: ' + String(error) },
      { status: 500 }
    );
  }
}