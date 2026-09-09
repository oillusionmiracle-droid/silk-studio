export const runtime = 'nodejs';

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'image/vnd.adobe.photoshop',
  'application/postscript',
  'application/illustrator',
];

async function uploadBuffer(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'order-references', resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed'));
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

// Verifies the request is coming from a logged-in Supabase user.
// Supports both:
//  1. Bearer access token (client keeps its session in localStorage, so it
//     sends the JWT explicitly in the Authorization header), and
//  2. Session cookie (SSR browser clients).
// Returns the user id if valid, or null.
async function getAuthenticatedUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('authorization') ?? '';
  const bearerToken = /^Bearer\s+(.+)$/i.exec(authHeader)?.[1]?.trim();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // --- Path 1: explicit Bearer token from the client ---
  if (bearerToken) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase.auth.getUser(bearerToken);
      if (!error && data.user) return data.user.id;
    } catch {
      // Fall through to the cookie check below.
    }
  }

  // --- Path 2: session cookie ---
  const cookieStore = await cookies();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // No-op: this is a read-only check, we're not refreshing the session here.
        },
      },
    });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.id;
}

export async function POST(req: Request) {
  try {
    // --- AUTH CHECK: reject the request before touching Cloudinary at all ---
    const userId = await getAuthenticatedUserId(req);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'You must be signed in to upload files.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // --------------------------------------------------------------------

    const formData = await req.formData();
    const file = formData.get('file') as Blob | null;

    if (!file || !(file instanceof Blob)) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return new Response(
        JSON.stringify({ error: 'File exceeds maximum size limit of 20MB.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (file.type && !ALLOWED_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      return new Response(
        JSON.stringify({ error: 'File type not supported. Please upload JPG, PNG, WEBP, PDF, or PSD.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadBuffer(buffer);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
