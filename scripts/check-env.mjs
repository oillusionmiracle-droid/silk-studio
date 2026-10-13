const required = ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY','SUPABASE_SERVICE_ROLE_KEY','NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET','NEXT_PUBLIC_TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY','RESEND_API_KEY','GEMINI_API_KEY'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) { console.error('Missing runtime configuration: '+missing.join(', ')); process.exit(1); }
if (!/^https:\/\/[a-z0-9.-]+$/.test(process.env.NEXT_PUBLIC_SUPABASE_URL)) { console.error('Invalid Supabase URL.'); process.exit(1); }
console.log('Required runtime configuration is present.');
