# Silk Studio

A design, print, and apparel commerce platform — public marketing site, custom order + pricing engine, apparel storefront with Paystack checkout, customer account portal, admin dashboard, and an AI chat assistant.

> **Status: Work in progress.** Core flows (ordering, payments, auth) are functional; hardening, tests, and CI are still being built out. See [Known Issues](#known-issues--in-progress) below before using this in production.

---

## What's in here

| Area | What it does |
|---|---|
| **Public site** | Home, About, Portfolio, Services, Order, Apparel, Contact, Privacy/Terms |
| **Custom orders** | Dynamic spec forms per service (flyers, banners, ID cards, business cards, etc.) with server-computed pricing |
| **Apparel store** | Product catalog, sizes/variants, cart, Paystack checkout |
| **Customer account** | Order history, order detail/status, uploaded reference files |
| **Admin dashboard** | Customer list, order list/detail, order status management |
| **AI assistant** | Chat widget backed by Google Gemini with Silk Studio–specific context |
| **File uploads** | Cloudinary-backed reference file uploads for custom orders (images, PDF, PSD, AI/EPS) |

---

## Tech stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Styling/animation:** Tailwind CSS, Framer Motion, GSAP + ScrollTrigger, Lenis (smooth scroll), Lottie
- **Backend/data:** Supabase (Postgres, Auth, Edge Functions, Row Level Security)
- **Payments:** Paystack
- **Media:** Cloudinary
- **AI:** Google Gemini (`@google/genai`)
- **Email/marketing:** Mailchimp / Resend (order confirmations, newsletter)
- **PWA:** `@ducanh2912/next-pwa`

---

## ⚠️ Pricing — services vs apparel (READ THIS BEFORE EDITING PRICES)

Two pricing surfaces. They are intentionally separate.

| Surface | Where the price lives | How to change it |
|---|---|---|
| **Order page services** (`/order` — flyers, banners, ID cards, business cards, letterheads, jotters, custom T-shirts, hoodies, DESIGN/WEB/BUNDLES) | Supabase `products` rows seeded by `supabase/migrations/013_seed_order_services.sql` (`PRINT`/`APPAREL`/`DESIGN`/`WEB`/`BUNDLES` categories) | Edit in the admin dashboard (`/admin/products` → **Order Services** tab). Price changes apply immediately — no redeploy. `lib/pricing.ts` supplies the **formula layer** on top (A4/A3 ×1.8/×3.0, double-sided ×1.5, lamination ×1.2, ID-card Lanyard ₦8,000 / Badge ₦10,000, banner ₦700/sqft, cover/binding/stock adjustments). `DEFAULT_PRODUCTS_MAP` is only a fallback when a row is missing |
| **Apparel store** (`/apparel`, cart, Paystack checkout) | Supabase: `products.price` + `variants (sku/size/color/stock)` | Edit in the admin dashboard (`/admin/products` → Apparel) or directly in Supabase |

Notes:
- Migration `013` is **insert-only**: it only adds rows that don't already exist (matched by `lower(name)`), never overwrites, and never touches the lowercase apparel shop rows (`tee/shirt/hoodie/cap`) — those belong to `/apparel` only.
- DESIGN, WEB and BUNDLES rows are seeded as custom-quote (`is_custom_quote = true`). WEB rows use `pricing_type = 'package'` so you can later untoggle **Custom Quote** in the admin and set a flat package price (Landing Page, Business Website, E-commerce, Event Page). DESIGN and BUNDLES are hard-locked in code (`ALWAYS_CUSTOM_QUOTE_CATEGORIES = ['DESIGN', 'BUNDLES']`) — brief-only, on purpose.
- The live `variants` table is apparel-shaped (`sku/size/color/stock`) — it has no `name`/`price`/`options`, so old `009`/`010` migrations that target those columns are **guarded no-ops**. Keep them that way.
- Migrations `001`–`012` (RLS, profiles, admin, schema guards) are applied with `supabase db push`. `009`/`010` are safe to run (they no-op).

---

## Getting started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Cloudinary](https://cloudinary.com) account
- A [Paystack](https://paystack.com) account (test keys for local dev)
- A Google AI Studio API key for Gemini

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env.local` and fill in real values:
```bash
cp .env.example .env.local
```

**Client-side (exposed to the browser — must be prefixed `NEXT_PUBLIC_`):**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
# Cloudflare Turnstile widget (bot protection on auth + newsletter).
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAEwCPPZFRXnUwIOx
```

> Widget already created in dash.cloudflare.com → Turnstile. The site key is
> public by design (it ships in client HTML). If you rotate the widget later,
> update the key here, in `.env.local`, and in your hosting provider env vars.

**Server-side only (Next.js API routes — never expose these):**
```
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GEMINI_API_KEY=
MAILCHIMP_API_KEY=
MAILCHIMP_API_REGION=
MAILCHIMP_AUDIENCE_ID=
# Turnstile server secret from the same widget (dash.cloudflare.com → Turnstile
# → Settings). Required for siteverify — without it, verification is skipped
# unless TURNSTILE_ENFORCE=true (recommended in production to fail closed).
TURNSTILE_SECRET_KEY=
TURNSTILE_ENFORCE=
```

**Supabase Edge Functions** (set these via `supabase secrets set`, not in `.env.local` — they run on Supabase's servers, not Next.js):
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
PAYSTACK_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
```

### 3. Set up the database
Run the migrations against your Supabase project in order:
```bash
supabase link --project-ref <your-project-ref>
supabase db push
```
Migrations live in `supabase/migrations/` and include schema, RLS policies, and the admin-role protection trigger. Read them in numeric order if you want to understand the auth/authorization model.

### 4. Deploy the Edge Functions
```bash
supabase functions deploy create-order
supabase functions deploy verify-order
```

### 5. Run the dev server
```bash
npm run dev
```
Visit http://silkstudios.com.ng

---

## Available scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production build locally
npm run lint     # ESLint
```

> No `test` or `typecheck` script exists yet — see Known Issues below.

---

## Project structure

```
app/                  Next.js App Router pages & API routes
  |- admin/            Admin dashboard (customers, orders)
  |- account/          Customer account, order history, uploaded files
  |- apparel/          Storefront + checkout
  |- order/            Custom order form + pricing
  |- api/              Route handlers (chat, cloudinary-sign, newsletter)
components/           Shared UI + feature components (apparel/, auth/)
lib/                  Client utilities, pricing logic, Supabase client
supabase/
  |- migrations/       Versioned SQL schema + RLS policies
  |- functions/        Edge Functions (create-order, verify-order)
public/               Static assets - being migrated to Cloudinary
```

---

## Order & payment flow

1. Customer configures a custom order or adds apparel to cart.
2. Order is created via the `create-order` Edge Function, which validates product/variant data and computes the price **server-side**.
3. Paystack checkout is initiated with the server-computed amount.
4. On payment, the `verify-order` Edge Function re-verifies the transaction directly against Paystack's API, checks the paid amount against the order total, and updates order status.
5. Confirmation email is sent; inventory is decremented.

> The custom-order form (`app/order/page.tsx`) currently writes directly to Supabase from the client instead of going through `create-order`. This is a known gap — see below.

---

## Known issues / in progress

This project is **not production-hardened yet**. Current priorities, roughly in order:

- [ ] Route the custom-order flow through `create-order` instead of a direct client-side insert
- [ ] Remove the client-price fallback in `create-order` when a variant isn't found (currently defaults to a hardcoded price — should reject instead)
- [ ] Add auth check + rate limiting to the Cloudinary upload signing route
- [ ] Remove the hardcoded Paystack public key fallback in the apparel checkout
- [ ] Set up a Supabase custom domain so Google OAuth doesn't expose the raw `*.supabase.co` project URL to users
- [ ] Move remaining local media in `public/` to Cloudinary and clean git history of large binaries
- [ ] Add tests (unit tests for pricing logic and auth, E2E for the full order-to-payment-to-verification flow)
- [ ] Add CI (lint, typecheck, build on every push)
- [ ] Remove the dead admin self-escalation UI (DB-side RLS already blocks it, but the button still exists)

---

## Security notes

- Row Level Security is enabled on all customer-data tables; policies are defined in `supabase/migrations/`.
- Admin role changes are protected by a `BEFORE UPDATE` trigger that silently reverts unauthorized role modifications — admin roles should only be granted manually via the Supabase dashboard.
- Payment verification happens server-side in `verify-order`, never trusting client-reported payment status.
- If you find a security issue, please don't open a public GitHub issue — contact [add your contact here] instead.

---

## License

