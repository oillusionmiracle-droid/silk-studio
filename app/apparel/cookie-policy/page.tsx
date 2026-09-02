'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div
      style={{
        maxWidth: 860,
        margin: '0 auto',
        padding: '48px 24px 96px',
        fontFamily: 'var(--font-apparel)',
        color: '#000000',
        lineHeight: 1.7,
      }}
    >
      <Link
        href="/apparel"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: '#000000',
          textDecoration: 'none',
          marginBottom: 32,
        }}
      >
        <ArrowLeft size={15} /> Return to Shop
      </Link>

      <h1
        style={{
          fontFamily: 'var(--font-apparel)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          letterSpacing: '-0.5px',
          textTransform: 'uppercase',
          marginBottom: 8,
          color: '#000000',
        }}
      >
        Cookie Policy
      </h1>

      <p
        style={{
          fontSize: 13,
          color: '#777777',
          marginBottom: 32,
          borderBottom: '1px solid #e5e5e5',
          paddingBottom: 16,
        }}
      >
        Last updated: 2nd September 2026
      </p>

      <div style={{ fontSize: 15, color: '#333333' }}>
        <p style={{ marginBottom: 24, fontSize: 16, color: '#000000', fontWeight: 500 }}>
          This Cookie Policy explains how Silk Studio (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) uses cookies and similar technologies on our apparel shop.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            1. What Are Cookies
          </h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help the site function properly and allow us to understand how visitors use our shop.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            2. How We Use Cookies
          </h2>
          <p style={{ marginBottom: 12 }}>We use cookies for the following purposes:</p>
          <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li>
              <strong>Essential cookies</strong>: Required for core site functionality, such as keeping items in your shopping cart and wishlist as you browse (stored locally in your browser)
            </li>
            <li>
              <strong>Preference cookies</strong>: Remember settings like your detected location, used to display prices in the appropriate currency (Naira or an approximate USD conversion)
            </li>
            <li>
              <strong>Analytics cookies</strong>: Help us understand how visitors interact with our site so we can improve the shopping experience (if analytics tools are added to the site)
            </li>
            <li>
              <strong>Payment processing</strong>: Our payment partner, Paystack, may set its own cookies during checkout to process your payment securely. These are governed by Paystack&apos;s own privacy and cookie practices, not ours.
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            3. Third-Party Services
          </h2>
          <p style={{ marginBottom: 12 }}>
            Our site relies on the following third-party services, which may set their own cookies or use similar tracking technologies:
          </p>
          <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><strong>Paystack</strong> — for secure payment processing</li>
            <li><strong>Supabase</strong> — for storing order and account data (no tracking cookies, used as our backend database)</li>
            <li><strong>Resend</strong> — for sending order confirmation and newsletter emails (does not set cookies on our site directly)</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            4. Managing Cookies
          </h2>
          <p>
            You can control or disable cookies through your browser settings at any time. Please note that disabling essential cookies may affect your ability to use features like the shopping cart, wishlist, or checkout process.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            5. Changes to This Policy
          </h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. Updates will be posted on this page with a revised &quot;Last updated&quot; date.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            6. Contact
          </h2>
          <p>
            If you have questions about this Cookie Policy, reach out via WhatsApp at <strong>+2347064829776</strong> or email <strong>thesilkstudiong@gmail.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
