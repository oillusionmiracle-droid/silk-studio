# Security verification — 13 October 2026

## Results

| Check | Result | Scope |
|---|---|---|
| Existing and new tests | 41 passed, 0 failed | 27 existing tests + 14 integration/security tests |
| PostgreSQL migration | Passed | Actual SQL executed in isolated PGlite with production-shaped tables, including variants without price/name |
| TypeScript | Passed | `tsc --noEmit`; includes actual shared Edge handlers imported by integration tests |
| Production build | Passed | Next.js production build, static page generation, and traces |
| Lint | Passed with warnings | Existing image optimization and order-page memo dependency warnings remain |
| Edge runtime typecheck | Passed with local SDK imports | Deno checked all seven entry points using installed locked SDK dependencies; network restrictions prevented Deno's direct npm metadata fetch. The standard Deno command is also added to CI |
| Browser page smoke | Passed | `/order`, `/apparel/checkout`, `/account`, `/admin` returned 200; no page JavaScript exceptions |
| Browser checkout/recovery | Passed | Real client UI → actual create/verify handlers → actual SQL in isolated database; Paystack script/API responses substituted with fixtures |
| Production schema read | Completed | Confirmed public stock RPC grant, recursive profile policy, deployed function settings, variant schema, and zero duplicate reference groups |
| Vercel configuration read | Completed | Production-only variables present; no server `SUPABASE_SERVICE_ROLE_KEY` listed |

The browser checkout fixture selected Flyers & Handbills, entered fixture contact information, and submitted through the mobile checkout summary. The actual create-order handler returned total ₦12,000 and a 75% deposit of ₦9,000. The fixture Paystack popup received 900,000 kobo. Verification was deliberately unavailable, the client displayed a pending confirmation, and a page reload preserved the reference. A retry then ran the actual verification/settlement code, recorded `deposit_paid`, and showed the confirmation screen. The pending reference was cleared. No production order, real card charge, customer message, or uploaded cloud asset was created.

## Important remaining checks

The payment provider and Auth token boundary are fixtures in integration tests. PGlite serializes statements on one connection, so independent database-session race testing remains a staging requirement. The browser smoke used an unauthenticated local build; it does not establish live Google OAuth or CAPTCHA behavior.

Before production promotion, verify actual Supabase CAPTCHA enforcement and redirects, a Paystack test transaction plus duplicate webhook delivery, a real private Cloudinary upload/owner/admin download, and scheduled Resend outbox delivery. Configure the missing server key first. Follow [the rollout and rollback guide](security-rollout.md).

## Reproducible repository checks

```sh
npm ci
npm run test
npx tsc --noEmit
npm run lint
npm run build
npm run check:edge
```

`npm run check:env` checks presence of production runtime variables without printing values. Load those variables securely before running it; ordinary CI builds intentionally have no real credentials.
