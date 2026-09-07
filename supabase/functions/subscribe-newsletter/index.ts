// Supabase Edge Function: subscribe-newsletter
// Inserts email into newsletter_subscribers table AND triggers Resend Automation + Audience.
// Deploy: supabase functions deploy subscribe-newsletter --no-verify-jwt

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'A valid email address is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const trimmedEmail = email.toLowerCase().trim();

    // ─── 1. Insert into Supabase newsletter_subscribers ───────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .upsert(
          { email: trimmedEmail, subscribed_at: new Date().toISOString() },
          { onConflict: 'email' }
        );

      if (insertError) {
        console.error('Newsletter insert error:', insertError);
      }
    }

    // ─── 2. Resend Integration ───────────────────
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const resendAudienceId = Deno.env.get('RESEND_AUDIENCE_ID');

    if (resendApiKey) {
      // 2a. Add Contact to Resend (if Audience ID is configured)
      if (resendAudienceId) {
        try {
          const resendRes = await fetch(`https://api.resend.com/audiences/${resendAudienceId}/contacts`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: trimmedEmail,
              unsubscribed: false,
            }),
          });

          if (!resendRes.ok) {
            const resendErr = await resendRes.text();
            console.error('Resend Audience contact error:', resendErr);
          }
        } catch (resendError) {
          console.error('Resend Audience API error:', resendError);
        }
      }

      // 2b. Trigger Resend Welcome Automation Event
      try {
        const eventRes = await fetch('https://api.resend.com/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'newsletter.subscribed',
            name: 'newsletter.subscribed',
            email: trimmedEmail,
            payload: { email: trimmedEmail },
          }),
        });

        if (!eventRes.ok) {
          const eventErr = await eventRes.text();
          console.error('Resend Automation event error:', eventErr);
        }
      } catch (eventError) {
        console.error('Resend event API error:', eventError);
      }
    } else {
      console.warn('RESEND_API_KEY not set. Skipping Resend automation.');
    }

    return new Response(
      JSON.stringify({ ok: true, message: "You're on the list!" }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
