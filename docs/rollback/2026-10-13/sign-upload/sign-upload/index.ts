// Supabase Edge Function: sign-upload
// Generates secure signed parameters for client uploads to Cloudinary without exposing secrets.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { crypto } from 'https://deno.land/std@0.168.0/crypto/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'image/vnd.adobe.photoshop',
  'application/postscript',
];

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ error: 'Cloudinary configuration is missing on server.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { mimeType, fileSize, folder = 'order-references' } = await req.json();

    if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
      return new Response(
        JSON.stringify({ error: `File type ${mimeType} is not permitted. Only JPG, PNG, WEBP, PDF, and PSD are accepted.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (fileSize && fileSize > MAX_FILE_SIZE_BYTES) {
      return new Response(
        JSON.stringify({ error: 'File exceeds the 20MB size limit.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    // SHA-1 signature for Cloudinary
    const encoder = new TextEncoder();
    const data = encoder.encode(paramsToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return new Response(
      JSON.stringify({
        signature,
        timestamp,
        api_key: apiKey,
        cloud_name: cloudName,
        folder,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('sign-upload error:', err);
    return new Response(
      JSON.stringify({ error: err?.message || 'Server error signing upload' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
