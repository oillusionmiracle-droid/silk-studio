# Security and payment rollout — 13 October 2026

## Preserved version

The unchanged main revision is `444271b8224cf6d80a2575d1c6d42d01768fa7b2`.
GitHub branch: `backup/before-security-fixes-2026-10-13`.
The fixes are isolated in `fix/security-payments-2026-10-13`. Production database and Edge Functions were inspected read-only; this work does not automatically apply migrations or change the live site.

## What this branch changes

- One pricing engine shared by browser and Edge Functions. Custom prices, quote status, and deposits are derived from trusted service rows; browser totals are ignored.
- Real atomic database RPCs for order creation and payment settlement. Payment amount/currency, unique provider transaction, line items, and stock changes are checked in one transaction.
- Duplicate events do not decrement stock again. Late stock shortages and legacy custom pending orders enter explicit review after recording the money received.
- New reference assets use authenticated Cloudinary delivery, owner/admin authorization, and one-minute download links. Existing public asset links remain compatible; restrict/migrate those separately after reviewing their usage.
- The order form supports a single reference file per submission, max 3MB, within Vercel request limits. File signatures are checked; SVG/HTML are rejected.
- Customer role insertion/promotion, profile recursion, direct order inserts, and public stock RPC execution are blocked.
- Admin status changes append history while holding a row lock. Browser users cannot directly change order status or payment fields.
- CAPTCHA is supplied directly to Supabase Auth once. Email substring admin promotion is removed. Enable CAPTCHA in Supabase before releasing.
- Distributed rate limits fail closed in production; paid chat output is capped.
- Alternative unprotected signing/newsletter endpoints are retired (410). Current clients already use the Next.js routes.
- Payment email delivery is queued transactionally and uses retry leases and Resend idempotency keys. Schedule the worker before releasing.

## Deployment prerequisites — confirmed gaps

Vercel environment metadata currently lists production-only variables and no `SUPABASE_SERVICE_ROLE_KEY`.

1. In Vercel, add the **server-only** `SUPABASE_SERVICE_ROLE_KEY` for the Silk Studio Supabase project `juhzkmdxytakdrzgtdzr`. Never use a `NEXT_PUBLIC_` name. Provide public Supabase/Paystack settings and server API settings for an isolated preview environment if testing there. Do not point write tests at production.
2. Enable Turnstile CAPTCHA in Supabase Auth using the matching existing widget secret. Verify Google OAuth and email/reset redirect allowlists for production and preview. The previous separate verification endpoint did not enforce this at Supabase Auth.
3. Confirm `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, and `TURNSTILE_ALLOWED_HOSTNAMES` for the newsletter/API verifier. Production fails closed on missing secret or unexpected hostname. Preview must have its own allowed hostname/widget settings.
4. Confirm matching Paystack live/public and secret keys; the webhook must point to the Silk Studio project, not SplitHouse. Use a dedicated test project and test keys for actual card-payment testing.
5. Confirm Cloudinary allows authenticated uploads and downloads for the supported file types. Review unsigned presets and existing public customer reference files.
6. Verify the Resend sender domain `mail.silkstudios.com.ng` (or set `ORDER_EMAIL_FROM`). Schedule `send-payment-notifications` with service-role authorization, e.g. Supabase Cron/Vault. Never put its service key in browser code or an unencrypted schedule. Monitor unsent notifications and retries.
7. Require the CI validation job before merging. GitHub branch protection and payment/Cloudinary/email account settings were not changed by this branch.

## Safe deployment order

Temporarily prevent new checkouts during the backend cutover. Existing clients send the old custom-order payload, so backend/frontend cutover must be coordinated.

1. Save the current Vercel deployment ID and export the currently deployed Edge Function sources/secrets configuration through the authorized dashboard. Keep a database backup; never put keys in Git.
2. Check for duplicate existing references before applying the unique index:
   `select paystack_ref,count(*) from public.orders where paystack_ref is not null group by paystack_ref having count(*)>1;`
3. Apply only `supabase/migrations/20261013061419_security_payment_transactions.sql` after reconciling the target project's migration history. The read-only preflight found zero duplicate reference groups on 13 October 2026; recheck immediately before applying. Historical numeric scripts assume a pre-existing schema; do not blindly replay all of them or the retired catch-all setup file.
4. Deploy create-order, verify-order, paystack-webhook, update-order-status, sign-upload, subscribe-newsletter, and send-payment-notifications from this branch. Guest checkout/verify/webhook and retired endpoints use gateway JWT verification off; update-order-status validates the user token inside its handler, and the notification worker validates the service-role token inside its handler. Use `--no-verify-jwt` if JWT gateway verification cannot accept the project's signing keys. Application authorization remains mandatory.
5. Configure the environment and scheduled notification worker, then run `npm run check:env` with runtime variables loaded securely. This prints missing names only.
6. Deploy the matching Next.js branch to an isolated preview/test backend; verify test payments, customer/admin access, and private upload/download.
7. Merge/promote only after those external tests pass; reopen checkout. Verify a production smoke flow without charging a customer accidentally.

The repository's standard CI builds without real credentials. A green build proves compilation, not external configuration.

## Rollback without losing orders

Before this rollout is applied: main and the live site remain unchanged. Delete/close the fix PR or keep using the backup branch to abandon the changes.

After a coordinated rollout:

1. Pause new checkouts and preserve payment/reference evidence for in-flight orders.
2. Restore the previously exported Edge Function versions and the prior Vercel deployment together; do not mix old custom-order clients with the new payload contract.
3. Keep the additive payment columns, outbox, assets, and payment records. Do not drop them, restore an old database backup over new orders, or reset stock: doing so can erase real payments or deduct stock twice.
4. The old admin screens directly UPDATE order status/history. If restoring those screens is essential, use an administrator-reviewed rollback migration to restore those UPDATE column grants while retaining the admin RLS policy. The new restricted stock RPC is compatible with the old service-role payment handlers; do not reopen public stock execution.
5. New private assets require the new authenticated download route. Retain/backport that route and ReferenceFileLink when reverting the rest of the frontend, or migrate those assets through an authorized server process. Do not make private assets public just to restore previews.
6. Reconcile any payment that arrived during the switch before resuming checkout. The old payment handlers reintroduce the original underpayment/idempotency risks; restoring only presentation changes while retaining the fixes is safer.

## Verification scope

The integration suite executes the actual create/verify/webhook handler code and the actual migration SQL against isolated PGlite PostgreSQL with the observed production schema, including variants without a price column. It checks signed webhook events, underpayment/currency mismatch, duplicate processing, server pricing/deposits, order-item rollback, stock review, public/customer/admin permissions, and rate-limit budgets.

Supabase Auth tokens and Paystack HTTP responses in that suite are fixtures. PGlite serializes operations on one connection, so independent production database sessions and live provider delivery remain staging checks. No real card payment, customer email, or production order was created by the tests.
