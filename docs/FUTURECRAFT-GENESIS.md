# Futurecraft Genesis — implementation and launch checks

This route is built in the existing Silk Studio Next.js app, as an independent academy experience.
The live Silk navbar/footer/promo bar are suppressed on /futurecraft.

## Assets
- /futurecraft/mascot.webp is the optimized user-approved Futurecraft mascot (head mark; black backdrop).
- Learning images reuse relevant project-approved images already shipped with Silk Studio at /images/blog/.
- Replace placeholder campaign photography with final original Futurecraft workshop photos before the public launch.

## Registration
POST /api/futurecraft/register
- Saves participants in public.futurecraft_genesis_registrations via the server-only service role.
- Uses the existing shared distributed rate limiting and a honeypot.
- Duplicate email submissions are acknowledged but do not send additional emails.
- Consent is required; only transactional Genesis messaging is sent.
- The submission confirmation page does not promise a seat, date, schedule, or guest who has not been confirmed.

## Required config
- NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY already used by Silk Studio.
- RESEND_API_KEY already used by Silk Studio.
- FUTURECRAFT_FROM_EMAIL must be a verified Resend sender, e.g. "Futurecraft <hello@your-verified-domain>".
- Until FUTURECRAFT_FROM_EMAIL is set, submissions are stored but emailsPending=true.
- Do not publicly publish the form until the database migration is applied and email sending is verified with a consented test address.

## Setup
1. Apply the additive SQL in supabase/migrations/20261028_futurecraft_genesis.sql to the website's database.
2. Set a verified FUTURECRAFT_FROM_EMAIL in Vercel Production and Preview environments, and ensure Preview has safe isolated Resend credentials.
3. Test registration once in a controlled preview; verify one DB row and two transactional emails.
4. Confirm dates, timezone, format, mentors and community onboarding before updating public claims.
5. Check reduced-motion, 390px phone viewport, form errors, keyboard access and no legacy Silk chrome.
6. Publish only after successful tests.

Emails:
- Registration received — acknowledgement and next steps.
- Welcome to Futurecraft — branded introduction for new Makers.

No imaginary countdown or fake limited seats are introduced.
