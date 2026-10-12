// Supabase Edge Function: paystack-webhook
// Securely receives asynchronous payment notifications from Paystack,
// validates HMAC SHA-512 signature, and marks pending orders as 'paid'.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { finalizePayment } from '../_shared/payment.ts';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not set');
      return new Response('Configuration error', { status: 500 });
    }

    const signature = req.headers.get('x-paystack-signature');
    if (!signature) {
      return new Response('Missing signature header', { status: 401 });
    }

    const rawBody = await req.text();

    // Verify HMAC-SHA512 signature
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(paystackSecretKey),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign', 'verify']
    );

    const sigBuffer = new Uint8Array(
      signature.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBuffer,
      new TextEncoder().encode(rawBody)
    );

    if (!isValid) {
      console.warn('Invalid Paystack webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const data = event.data;
      const paystackRef = data.reference;
      
      const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
      await finalizePayment(supabase, data, paystackRef);
    }

    return new Response('OK', { status: 200 });
  } catch (err: any) {
    console.error('Webhook processing exception:', err);
    return new Response('Internal error', { status: 500 });
  }
});

