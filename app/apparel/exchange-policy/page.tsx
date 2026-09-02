'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ExchangePolicyPage() {
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
        Exchange Policy
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
          Because every piece in the Silk Studio wears collection is made to order through our print-on-demand process, we handle exchanges a little differently than a standard retail store. Please read this policy carefully before placing your order.
        </p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            1. Size Exchanges
          </h2>
          <p style={{ marginBottom: 12 }}>
            If your item arrives and doesn&apos;t fit as expected, we&apos;re happy to exchange it for a different size in the same product, subject to availability.
          </p>
          <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>You must request an exchange within <strong>48 hours</strong> of receiving your order</li>
            <li>The item must be unworn, unwashed, and in its original condition, with no signs of use</li>
            <li>Exchanges are only available for <strong>size</strong>, not for a different design, color, or product</li>
            <li>Reach out to us via WhatsApp with your order reference number and the size you need</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            2. Exchange Process
          </h2>
          <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Contact us on WhatsApp with proof of purchase (order number or Paystack reference) and a photo of the item</li>
            <li>Once approved, you&apos;ll be responsible for returning the original item to our Lagos location before the replacement is dispatched</li>
            <li>A replacement will be printed and shipped once the returned item is received and confirmed in acceptable condition</li>
            <li>Because items are made on demand, exchange turnaround may take longer than a standard in-stock exchange — expect <strong>7–10 business days</strong> from the time we receive your returned item</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            3. What Cannot Be Exchanged
          </h2>
          <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Items damaged through wear, washing, or misuse</li>
            <li>Items without their original tags or packaging</li>
            <li>Caps (due to hygiene considerations, caps are not eligible for exchange unless defective — see our Return Policy for defective item handling)</li>
            <li>Sale or clearance items marked as final sale, if applicable</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            4. Exchange Costs
          </h2>
          <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>If the exchange is due to a sizing issue on your end, delivery costs for sending the item back and receiving the replacement are covered by the customer</li>
            <li>If the exchange is due to an error on our part (wrong size sent, wrong item sent), we cover all delivery costs both ways</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000000', marginBottom: 12 }}>
            5. Contact
          </h2>
          <p>
            For all exchange requests, message us on WhatsApp at <strong>+2347064829776</strong> or email <strong>thesilkstudiong@gmail.com</strong> with your order details. We aim to respond within 24 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
