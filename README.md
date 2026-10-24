# Silk Studio

[Live website](https://www.silkstudios.com.ng) · [Blog](https://www.silkstudios.com.ng/blog) · [Website packages](https://www.silkstudios.com.ng/website-offer)

Silk Studio is a Lagos-based creative business working with customers in Nigeria and worldwide. This repository contains the studio website, portfolio, editorial blog, custom-order tools, apparel storefront, customer portal and administration interface.

The studio designs brands, builds websites and apps, creates UGC and AI advertising, produces print and merchandise, and develops custom software and automation.

## What’s built

| Area | Routes and behaviour |
| --- | --- |
| Studio website | Home, portfolio, studio, services, contact and project briefs. A featured studio film, dedicated case studies and searchable services/projects/articles. |
| Website offer | A compact scrolling, fully clickable 40% offer strip on main public pages. The offer page shows standard/discounted package fees, deliverables, exclusions and prefilled WhatsApp enquiries. |
| Blog | Five original stories on business, AI tools, creator culture, advertising and print. Topic filters, credited images, alt text, captions, source links, related reading and a saved light / true-black dark mode. |
| Custom orders | Service specifications and server-computed pricing, with reference-file uploads. Website/app enquiries use the project brief. |
| Apparel | Products, variants, cart and Paystack checkout. |
| Accounts and administration | Customer order history/status and administrative product/order management. |
| Gemini assistant | Real Gemini chat with current website-package context. The mobile launcher uses a smaller Gemini mark. |
| Newsletter | Signup records in Supabase, Resend contacts and a welcome-automation event. Broadcast creation/sending is managed separately in Resend. |
| Cookie choices | A compact, non-modal bottom bar: essential only, optional analytics, and an × dismiss control. Dismissal keeps optional analytics off. Reopen through **Cookie settings** in the footer. |
| Search discovery | Canonicals, social metadata, BlogPosting structured data, image entries in the sitemap, public crawl rules and an RSS feed. |

Features that depend on external services require valid runtime configuration. A successful build is not proof that payments, email delivery, Google reporting or every external integration is configured in a given deployment.

## Stack

- Next.js 14 App Router, React 18 and TypeScript.
- Tailwind CSS and scoped CSS; GSAP, Framer Motion and Lenis for motion.
- Supabase for Postgres, authentication, policies and Edge Functions.
- Paystack for payments; Cloudinary for uploaded media.
- Google Gemini through `@google/genai`; Resend for email.
- Vercel deployment from GitHub. PWA tooling is installed but currently disabled in `next.config.mjs`.

## Local setup

Use a current Node.js LTS release (Node 22 or newer recommended).

```bash
npm ci
npm run dev
```

Create a local `.env.local` file with the variables below before using connected features. Open **http://localhost:3000**. Never commit credentials.

### Next.js environment variables

| Browser-visible configuration | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client connection |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Uploaded-media delivery |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack checkout |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile where enabled |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional real GA4 web-stream ID, in `G-…` format |

Server-only configuration includes `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `GEMINI_API_KEY`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` and `TURNSTILE_ENFORCE` where applicable. Do not prefix secrets with `NEXT_PUBLIC_`.

Newsletter signup uses Resend; the welcome workflow listens for `newsletter.subscribed`. Verify that automation in the provider before relying on welcome delivery. The signup handler records automation-event errors in server logs.

### Database and Edge Functions

Review migrations and rollout notes before applying changes to an existing database.

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Edge Functions have their own environment/secrets, separate from Next.js. Depending on the function, these include Supabase credentials, `PAYSTACK_SECRET_KEY`, Cloudinary credentials and Resend configuration. Inspect each function’s requirements before deployment. Never use production payments for an unreviewed local test.

## Pricing: custom orders, apparel and website packages

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


### Website-package offer

`lib/websitePackages.ts` is the source of truth for the website offer’s standard prices, 40% calculation and WhatsApp claim links. These are separate from apparel prices and custom-print formulas. Keep the package page and Gemini context tied to this shared data.

The discount applies to the listed design-and-build packages. Domain, hosting, paid services and separately scoped custom applications are excluded. An enquiry does not take payment or reserve a production slot.

## Working on the blog

- Content: `lib/blogPosts.ts`.
- Listing / article routes: `app/blog/page.tsx` and `app/blog/[slug]/page.tsx`.
- Theme / category filters: `components/BlogShell.tsx` and `components/BlogListing.tsx`.
- Editorial styling and shared updates: `app/studio-updates.css`.
- Downloaded images: `public/images/blog/`; retain source credits, descriptive alt text and contextual captions.
- Design research: [Blog design notes](docs/BLOG-DESIGN.md).

Add the article’s slug, category, summary, date, reading time, image information and sections to the content array. Provide source links for reported platform changes. Distinguish illustrative examples and studio opinion from verified facts.

The blog index, related stories, sitemap entries and RSS feed derive from that data. Review the new page on a phone and desktop, in both themes, before publishing.

## Analytics and indexing

- `components/CookieBanner.tsx` controls the saved consent choice.
- Optional Google Tag Manager, GA4 and Speed Insights load only after analytics consent.
- `components/GoogleAnalytics.tsx` supports consented initial/client-route page views, article views and article-end reads.
- Set the owner’s actual `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the deployment environment and redeploy to activate direct GA4 reporting. **The last configuration check found no GA4 ID and an empty published GTM container; reporting must not be described as active until verified.**
- Revoking analytics clears known analytics cookies and reloads the page to stop previously loaded scripts.
- Blog light/dark preference is stored locally and is independent of analytics consent.

Public discovery endpoints:

| Endpoint | Purpose |
| --- | --- |
| `/sitemap.xml` | Public pages, all article URLs and article images |
| `/robots.txt` | Allows public crawling and points to the sitemap; excludes private/system routes |
| `/blog/feed.xml` | RSS feed |
| `/blog/[slug]` | Server-rendered article content, canonical URL, social previews and BlogPosting structured data |

Google Analytics measures visits; it does not submit pages for indexing. Search Console submission, indexing status, Google Ads configuration and live event reporting require their own account-side checks.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Additional scripts: `npm run check:env`, `npm run check:edge` (Deno required), and `npm run analyze`.

The test suite covers pricing and order behaviour, security boundaries, email handling, service search, deployable media and blog/sitemap integrity. Full live payment and third-party delivery testing is separate.

## Project map

```text
app/                  Pages, layouts and Next.js API handlers
  blog/               Blog index, articles and RSS
  website-offer/      Website-package offer
  apparel/            Storefront and checkout
  order/              Custom ordering
  account/, admin/    Customer and administration interfaces
components/           Shared navigation, footer, consent, assistant and UI
lib/                  Content, pricing, validation and server/client utilities
supabase/
  migrations/         Versioned schema and policies
  functions/          Order creation, verification, webhook and support functions
tests/                Node test runner + tsx tests
public/               Site assets and credited editorial images
docs/                 Implementation and design notes
```

## Order and payment boundaries

Orders are created through server-side validation and pricing. Paystack verification must confirm the transaction and expected amount server-side before marking an order paid. Do not trust a client-reported total or success message. Review the Edge Functions and database policies when changing payment or inventory behaviour.

Protect service-role and payment secrets. Review Row Level Security and administrative permissions before changing customer-data access. Report security issues privately to the studio rather than posting customer details or credentials in a public issue.

## Publishing

The connected GitHub repository deploys to Vercel. Confirm the deployment is **Ready**, then verify the changed public routes and relevant interactions. Preserve the configuration and delivery requirements of the external services; do not use a deployment success message as an integration-health check.

## Current follow-up work

- Configure the real GA4 measurement ID and verify live reporting after consent.
- Verify welcome-automation delivery in Resend.
- Run controlled end-to-end payment, inventory and email checks when those flows change.
- Continue improving case-study evidence and the path from service discovery to enquiry.

## License

No open-source license is declared here. Third-party packages and editorial images retain their respective licenses and credits.


## Homepage review branch

`preview/studio-clarity-case-studies` contains a proposed homepage update; review before merging to main.

- Replaces the desktop carousel with a 720p studio film (4.78 MB versus the original 87.9 MB; full duration and audio retained).
- Adds `/work/party-crashers` and `/work/rabbithole`, adapted from the separate Silk portfolio, with original screenshots, implementation notes and honest outcome limitations.
- Makes the hero heading immediately readable, adds direct routes to websites, campaign content and print, and removes repeated homepage calls to action.
- Includes the case studies in site search and the sitemap.

Validation: `npm test`, `npm run build`, and desktop/mobile layout checks.
