'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const clauses = [
  {
    id: 'acceptance',
    number: '01',
    title: 'Acceptance of Terms',
    content: 'By accessing and using Silk Studio\'s platform, website, apparel shop, and services (collectively, the "Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, do not use our Service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of the updated terms.',
  },
  {
    id: 'services',
    number: '02',
    title: 'Services Offered',
    bullets: [
      { label: 'Platform Services', detail: 'Connects clients with vetted professional printers across Lagos for custom print and design work.' },
      { label: 'Design Services', detail: 'Logo design, custom templates, and branding, with promotional discounts for first-time customers as advertised from time to time.' },
      { label: 'Print Products', detail: 'Business cards, flyers, banners, custom apparel (bulk/custom orders), wedding souvenirs, billboards, and event packages, quoted individually.' },
      { label: 'Apparel Shop ("Wears")', detail: 'Direct-to-consumer print-on-demand apparel — t-shirts, hoodies, and caps — sold at fixed, listed prices through our online shop, separate from our custom quote-based services.' },
      { label: '48-Hour Guarantee (Custom Orders)', detail: 'Turnaround from order confirmation to ready-for-pickup/delivery status for standard custom print and design orders. This guarantee applies to custom quote-based orders and does not apply to apparel shop purchases, which follow production timelines described in Section 7.' },
      { label: 'Logistics Management', detail: 'Real-time order dispatch, quality assurance, and delivery coordination for both custom orders and apparel shop purchases.' },
    ],
  },
  {
    id: 'eligibility',
    number: '03',
    title: 'Eligibility',
    content: 'You represent and warrant that you are at least 18 years old with legal capacity to enter binding agreements. You are not prohibited by law from using our Service. All information you provide is accurate, complete, and truthful. You will not use the Service for unlawful, fraudulent, or harmful purposes. We reserve the right to suspend or terminate your account or refuse an order if these requirements are breached.',
  },
  {
    id: 'account',
    number: '04',
    title: 'Account Registration & Responsibilities',
    bullets: [
      { label: 'Confidentiality', detail: 'You are responsible for maintaining confidentiality of your account credentials (password, email), where an account is required.' },
      { label: 'Guest Purchases', detail: 'Our apparel shop may permit guest checkout without a full account. In this case, you remain responsible for the accuracy of the contact and delivery information provided at checkout.' },
      { label: 'Account Activity', detail: 'You are solely responsible for all activities under your account.' },
      { label: 'Security Notification', detail: 'Notify us immediately of any unauthorized access or use of your account.' },
      { label: 'Account Violations', detail: 'We reserve the right to suspend or terminate accounts used in violation of these terms.' },
    ],
  },
  {
    id: 'ordering',
    number: '05',
    title: 'Ordering & Payment',
    content: 'All orders placed through Silk Studio — whether a custom print/design commission or an apparel shop purchase — are binding agreements once payment is confirmed. You must provide accurate project specifications, sizing, and delivery details.\n\nPricing is displayed in Nigerian Naira (₦) and includes applicable taxes. For visitors browsing our apparel shop from outside Nigeria, an approximate conversion (e.g. to USD) may be displayed for convenience — however, all charges are processed and billed exclusively in Nigerian Naira through Paystack, regardless of the currency displayed.\n\nPayment must be completed before order confirmation. We accept Paystack payments exclusively — we do not store card or bank details.\n\nFor custom print/design orders: A non-refundable 75% deposit is required at order confirmation; the remaining 25% is due before final delivery.\n\nFor apparel shop purchases: Full payment is required at checkout to confirm your order, as items are produced to order.\n\nIf we fail to meet a guaranteed turnaround due to our error, you are entitled to a full refund or a discount on a future order, as outlined in Section 7.',
  },
  {
    id: 'deposits',
    number: '06',
    title: 'Deposits, Cancellations & Refunds',
    bullets: [
      { label: 'Custom 75% Deposit', detail: 'Non-refundable once design work or printing has commenced.' },
      { label: 'Custom Order Cancellation', detail: 'Before design approval: forfeit deposit. After design approval: forfeit 50% of total order value. Post-printing: no refunds.' },
      { label: 'Apparel Shop Purchases', detail: 'Because every item is produced to order through our print-on-demand process, apparel purchases cannot be cancelled once production has started. If you need to cancel, contact us via WhatsApp immediately after ordering.' },
      { label: 'Exchange & Return Policies', detail: 'Size exchanges for apparel are governed by our separate Exchange Policy. Refunds for damaged, defective, or incorrect apparel items are governed by our separate Return Policy.' },
      { label: 'Design Service Discounts', detail: 'Any advertised discount for design services applies to one order per customer and is non-transferable, unless otherwise stated.' },
    ],
  },
  {
    id: 'fulfillment',
    number: '07',
    title: 'Order Fulfillment & Turnaround Time',
    bullets: [
      { label: 'Custom Print/Design Orders', detail: 'Silk Studio guarantees 48-hour turnaround from order confirmation (after design approval and full payment) to ready-for-collection/delivery, for standard orders. Bulk or high-volume orders (10+ pieces) may require extended timelines.' },
      { label: 'Apparel Shop Orders', detail: 'Apparel shop purchases are produced to order and are not held in pre-made stock. Standard production and delivery timelines will be communicated at checkout or via order confirmation. Delivery is currently available within Lagos only.' },
      { label: 'Quality Assurance', detail: 'All printed materials and apparel items undergo quality checks before delivery. Defective items due to our error will be reprinted/reproduced and redelivered at no cost.' },
      { label: 'Delays', detail: 'We are not liable for delays caused by incomplete briefs, late approvals, payment delays, power outages, logistics delays, or third-party capacity issues. If custom order delays exceed 72 hours due to our error, you are entitled to a 25% refund or credit toward a future order.' },
    ],
  },
  {
    id: 'intellectual-property',
    number: '08',
    title: 'Intellectual Property & Content',
    bullets: [
      { label: 'Your Content', detail: 'You retain full ownership of designs, briefs, and assets you upload for custom orders. You grant us license to use content solely for fulfilling your order. You warrant you own the content and it does not infringe third-party rights.' },
      { label: 'Our Content', detail: 'Silk Studio branding, logos, website design, apparel designs, platform code, and product photography are our exclusive intellectual property. Reproduction without written permission is prohibited.' },
      { label: 'Third-Party Content', detail: 'Some custom designs may be licensed from third parties. Use is restricted to your specific order.' },
    ],
  },
  {
    id: 'printer-network',
    number: '09',
    title: 'Printer Network, Fulfillment Partners & Liability',
    content: 'Silk Studio operates a network of vetted professional printers across Lagos for custom orders, and works with print-on-demand fulfillment partner(s) for apparel shop production. While we conduct quality screening of our partners, each operates independently. Silk Studio is responsible for quality assurance, delivery coordination, and customer service across both. Our total liability for any order shall not exceed the amount you paid for that specific order. We are not liable for indirect, incidental, special, or consequential damages, or for issues arising from incomplete briefs, third-party service failures, or unlawful use of materials or apparel.',
  },
  {
    id: 'indemnification',
    number: '10',
    title: 'Indemnification',
    content: 'You agree to indemnify, defend, and hold harmless Silk Studio from any claims, damages, or losses arising from: your use of the Service in violation of these terms, your content infringing third-party intellectual property rights, or your use of printed materials or apparel in violation of applicable law.',
  },
  {
    id: 'acceptable-use',
    number: '11',
    title: 'Acceptable Use Policy',
    content: 'Do not upload malware, attempt unauthorized access to our systems, engage in harassment, submit defamatory or unlawful content, use our Service for fraud, reverse-engineer our platform, scrape data from our site (including our apparel shop\'s product catalog or pricing), or resell our services or products without authorization. Violations result in immediate account suspension, order cancellation, and potential legal action.',
  },
  {
    id: 'disputes',
    number: '12',
    title: 'Disputes & Resolution',
    bullets: [
      { label: 'Informal Resolution', detail: 'Email thesilkstudiong@gmail.com within 7 days of the issue arising. We respond within 48 hours.' },
      { label: 'Mediation', detail: 'If informal resolution fails, both parties agree to attempt mediation in Lagos, Nigeria, under Nigerian law before pursuing formal legal action.' },
      { label: 'Jurisdiction', detail: 'These Terms are governed by the laws of the Federal Republic of Nigeria. Legal proceedings shall be brought exclusively in Lagos State courts.' },
    ],
  },
  {
    id: 'termination',
    number: '13',
    title: 'Termination of Service',
    content: 'Silk Studio reserves the right to terminate or suspend your account or refuse to fulfill an order immediately, without notice, if you violate these Terms, engage in fraudulent activity, abuse the Service, or fail to complete payment. Upon termination, you lose all account access and any active orders may be cancelled. Non-refundable deposits, where applicable, are forfeited.',
  },
  {
    id: 'confidentiality',
    number: '14',
    title: 'Confidentiality',
    content: 'We treat all project briefs, designs, and business information as confidential. Our team and fulfillment partners are bound by confidentiality obligations. We will not disclose your information to third parties except as outlined in our Privacy Policy or as required by law.',
  },
  {
    id: 'warranties',
    number: '15',
    title: 'Limitation of Warranties',
    content: 'Silk Studio provides its Service, platform, and apparel shop on an "AS IS" and "AS AVAILABLE" basis. We make no warranties regarding continuous availability, accuracy of product or pricing information, fitness for a particular purpose, or quality, except as expressly guaranteed in Section 7.',
  },
  {
    id: 'changes',
    number: '16',
    title: 'Changes to Terms',
    content: 'We may update these Terms and Conditions at any time, including to reflect new services such as our apparel shop. Material changes will be communicated via email or a notice on our website. Your continued use of the Service constitutes acceptance of updated terms. We recommend reviewing these terms periodically.',
  },
  {
    id: 'contact',
    number: '17',
    title: 'Contact & Support',
    bullets: [
      { label: 'Email', detail: 'thesilkstudiong@gmail.com' },
      { label: 'Website', detail: 'silkstudio.ng' },
      { label: 'WhatsApp', detail: '+2347064829776' },
      { label: 'Location', detail: 'Lagos, Nigeria' },
    ],
  },
];

export default function TermsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;

    const loadAnimations = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Hero fade-in
        if (heroRef.current) {
          gsap.fromTo(
            heroRef.current.children,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out',
              delay: 0.15,
            }
          );
        }

        // Clauses fade-in on scroll
        if (cardsRef.current) {
          gsap.fromTo(
            cardsRef.current.querySelectorAll('section'),
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }
      });
    };

    loadAnimations();
    return () => ctx?.revert();
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle radial gradient background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 80% 30%, rgba(198,255,51,0.05) 0%, transparent 40%), radial-gradient(circle at 20% 70%, rgba(232,93,140,0.03) 0%, transparent 40%)',
        pointerEvents: 'none',
      }} />

      <div className="relative z-[2] max-w-[900px] mx-auto px-6 pt-28 md:pt-[clamp(24px,5vw,120px)] pb-16 md:pb-24">

        {/* HERO BLOCK */}
        <div ref={heroRef} style={{ marginBottom: 'clamp(60px, 10vw, 100px)' }}>
          <h1 style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 900,
            fontSize: 'clamp(48px, 12vw, 120px)',
            letterSpacing: '-2px',
            lineHeight: 0.95,
            color: '#FFFFFF',
            marginBottom: 16,
            margin: '0 0 16px 0',
          }}>
            Terms &amp; Conditions.
          </h1>

          <h2 style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 600,
            fontSize: 'clamp(24px, 6vw, 48px)',
            color: '#FFFFFF',
            marginBottom: 32,
          }}>
            Let&apos;s be clear about how this works.
          </h2>

          <p style={{
            fontFamily: 'var(--font-general)', fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#A0A0A0',
            lineHeight: 1.7,
            maxWidth: 700,
            marginBottom: 48,
            margin: '0 0 48px 0',
          }}>
            When you order from Silk Studio, you&apos;re either commissioning custom print and design work through our vetted Lagos printer network, or purchasing apparel directly from our own print-on-demand wears shop. Here&apos;s what both of us promise each other, across both.
          </p>

          <div style={{ 
            height: 1, 
            background: 'linear-gradient(90deg, rgba(198,255,51,0.3) 0%, transparent 100%)', 
            marginBottom: 'clamp(48px, 8vw, 80px)',
          }} />
        </div>

        {/* CLAUSES LIST */}
        <div ref={cardsRef} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(60px, 8vw, 100px)' }}>
          {clauses.map((clause) => (
            <section
              key={clause.id}
              id={clause.id}
              style={{
                scrollMarginTop: 120,
              }}
            >
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 16,
                  marginBottom: 16,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(14px, 2vw, 18px)',
                    color: '#C6FF33',
                    fontWeight: 700,
                  }}>
                    {clause.number}
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--font-jakarta)',
                    fontSize: 'clamp(24px, 4vw, 36px)',
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    color: '#FFFFFF',
                    margin: 0,
                  }}>
                    {clause.title}
                  </h3>
                </div>
              </div>

              {clause.content && (
                <p style={{
                  fontFamily: 'var(--font-general)',
                  fontSize: 'clamp(15px, 2vw, 17px)',
                  lineHeight: 1.8,
                  color: '#CCCCCC',
                  margin: 0,
                  whiteSpace: 'pre-line',
                }}>
                  {clause.content}
                </p>
              )}

              {clause.bullets && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {clause.bullets.map((b, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '16px 20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: 12,
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-jakarta)',
                        fontWeight: 600,
                        fontSize: 15,
                        color: '#FFFFFF',
                        display: 'block',
                        marginBottom: 4,
                      }}>
                        {b.label}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-general)',
                        fontSize: 14,
                        color: '#999999',
                        lineHeight: 1.6,
                      }}>
                        {b.detail}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* BOTTOM CONFIRMATION / ACCEPTANCE */}
        <div style={{
          marginTop: 'clamp(80px, 12vw, 140px)',
          padding: 'clamp(32px, 6vw, 48px)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 24,
          textAlign: 'center',
        }}>
          <h4 style={{
            fontFamily: 'var(--font-jakarta)',
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: 12,
          }}>
            I Agree to Terms
          </h4>
          <p style={{
            fontFamily: 'var(--font-general)',
            fontSize: 15,
            color: '#A0A0A0',
            maxWidth: 500,
            margin: '0 auto 28px auto',
            lineHeight: 1.6,
          }}>
            By continuing, you agree to our Terms and Conditions, Privacy Policy, and Exchange/Return Policies.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/privacy"
              style={{
                padding: '12px 24px',
                borderRadius: 100,
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontFamily: 'var(--font-jakarta)',
                fontSize: 14,
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              View Privacy Policy
            </Link>
            <Link
              href="/apparel/exchange-policy"
              style={{
                padding: '12px 24px',
                borderRadius: 100,
                backgroundColor: '#C6FF33',
                color: '#000000',
                textDecoration: 'none',
                fontFamily: 'var(--font-jakarta)',
                fontSize: 14,
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
            >
              View Exchange Policy
            </Link>
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: '#666666',
            marginTop: 28,
            marginBottom: 0,
          }}>
            Last updated: 2nd September 2026
          </p>
        </div>

      </div>
    </main>
  );
}