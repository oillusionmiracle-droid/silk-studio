// Supabase Edge Function: subscribe-newsletter
// Inserts email into newsletter_subscribers table AND adds to Resend Audience.
// Deploy: supabase functions deploy subscribe-newsletter --no-verify-jwt

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'A valid email is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ─── 1. Insert into Supabase newsletter_subscribers ───────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { email: email.toLowerCase().trim(), subscribed_at: new Date().toISOString() },
        { onConflict: 'email' }
      );

    if (insertError) {
      console.error('Newsletter insert error:', insertError);
      // Don't fail — the Resend Audience add may still succeed
    }

    // ─── 2. Add to Resend Audience ───────────────────
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    // TODO: Replace with your actual Resend Audience ID.
    // Find it at https://resend.com/audiences → select your audience → copy the ID from the URL.
    const resendAudienceId = Deno.env.get('RESEND_AUDIENCE_ID');

    if (resendApiKey && resendAudienceId) {
      try {
        const resendRes = await fetch(`https://api.resend.com/audiences/${resendAudienceId}/contacts`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            unsubscribed: false,
          }),
        });

        if (!resendRes.ok) {
          const resendErr = await resendRes.text();
          console.error('Resend Audience add error:', resendErr);
        }
      } catch (resendError) {
        console.error('Resend API error:', resendError);
        // Don't fail the response — the Supabase insert may have succeeded
      }
    } else {
      console.warn('RESEND_API_KEY or RESEND_AUDIENCE_ID not set. Skipping Resend Audience add.');
    }

    return new Response(
      JSON.stringify({ message: "You're on the list!" }),
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
