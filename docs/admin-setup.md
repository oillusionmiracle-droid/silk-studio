# Silk Studio — Admin Setup Guide

This guide details how to assign and verify administrator privileges for Silk Studio.

## 1. Initial Admin Role Assignment

Administrators have access to:
- `/admin` — Revenue analytics, order volumes, conversion rates
- `/admin/orders` — Live order management, order status pipeline progression
- `/admin/orders/[id]` — Detailed breakdown, production logs, custom design files
- `/admin/customers` — Customer database, lifetime spend, order history

### 1. Database Schema Setup & Admin Promotion

Before updating user roles, the database schema (profiles, wishlists, order columns, and RLS policies) must be set up. 

A complete, consolidated script is available at:
`supabase/migrations/full_schema_setup.sql`

#### In your Supabase Dashboard:
1. Navigate to **SQL Editor** in the left sidebar.
2. Click **New Query** (or paste into your existing query tab).
3. Copy the entire content from `supabase/migrations/full_schema_setup.sql` (or from below) into the editor.
4. Replace `'016d24f7-1dd4-4aae-94ad-ca67c6282a4a'` in line 282 with your User ID if creating another admin.
5. Click **Run** (or press `Ctrl+Enter`).
6. Refresh Silk Studio. You will now see the **Admin** link in your account menu and have full access to `/admin`.

---

## 2. Deploying Edge Functions to Supabase [COMPLETED & VERIFIED]

All 6 Edge Functions and environment secrets are successfully deployed to project `juhzkmdxytakdrzgtdzr`:

- [x] `create-order` (deployed, JWT verification off for public checkout)
- [x] `verify-order` (deployed, verifies Paystack transaction and creates invoice)
- [x] `sign-upload` (deployed, signs direct Cloudinary client uploads)
- [x] `paystack-webhook` (deployed, handles live asynchronous payment notifications)
- [x] `update-order-status` (deployed, admin protected order state pipeline)
- [x] `subscribe-newsletter` (deployed, records subscribers & syncs to Resend)

---

## 3. Configuring Paystack Webhook

To receive automated payment confirmations even if the customer closes their browser before returning:

1. Open your [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer).
2. Under **API Configuration & Webhooks**, locate **Live Webhook URL** (and **Test Webhook URL** if testing).
3. Set your Webhook URL to:
   ```
   https://juhzkmdxytakdrzgtdzr.supabase.co/functions/v1/paystack-webhook
   ```
4. Click **Save Changes**.
