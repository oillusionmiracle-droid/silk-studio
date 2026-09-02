'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ReturnPolicyPage() {
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
        Return Policy
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
          Since our apparel is produced through print-on-demand, each piece is made specifically for your order. This means our return policy is more limited than a typical retail shop, but we stand behind the quality of what we make.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            1. Eligibility for Returns
          </h2>
          <p style={{ marginBottom: 10 }}>Returns are accepted only in the following situations:</p>
          <ul style={{ paddingLeft: 20, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>The item arrived <strong>damaged or defective</strong> (printing errors, fabric defects, stitching issues)</li>
            <li>You received the <strong>wrong item</strong> (incorrect product, size, or design from what you ordered)</li>
            <li>The item significantly differs from what was advertised</li>
          </ul>
          <p style={{ marginBottom: 10 }}>We are unable to accept returns for:</p>
          <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Change of mind</li>
            <li>Incorrect size selected at checkout (please see our Exchange Policy for size-related requests instead)</li>
            <li>Items that have been worn, washed, or altered in any way</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            2. Timeframe
          </h2>
          <p>
            You must report any issue within <strong>48 hours</strong> of receiving your order. Claims made after this window may not be eligible for a return or refund.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            3. How to Request a Return
          </h2>
          <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Message us on WhatsApp with your order reference number</li>
            <li>Include clear photos or video showing the issue (damage, defect, or incorrect item)</li>
            <li>Our team will review your claim and respond within 24 hours with next steps</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            4. Refund Method
          </h2>
          <p>
            Approved returns are refunded via the original Paystack payment method used at checkout. Refunds are typically processed within <strong>5–7 business days</strong> after the returned item is received and inspected (for damaged/incorrect items, we may not require the item to be sent back, at our discretion, depending on the nature of the issue).
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            5. Non-Returnable Items
          </h2>
          <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Caps and made-to-order custom prints, once confirmed correct and undamaged, cannot be returned for reasons outside the eligibility criteria above</li>
            <li>Items purchased as part of a bulk/custom order (10+ pieces) follow the terms agreed upon at the time of the custom quote, which may differ from this standard policy</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            6. Contact
          </h2>
          <p>
            All return requests must go through WhatsApp at <strong>+2347064829776</strong> or email <strong>thesilkstudiong@gmail.com</strong>. We do not accept in-person returns without prior confirmation of eligibility.
          </p>
        </section>
      </div>
    </div>
  );
}
