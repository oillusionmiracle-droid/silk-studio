'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const clauses = [
  {
    id: 'acceptance',
    number: '01',
    title: 'Acceptance of Terms',
    content: 'By accessing and using Silk Studio\'s platform, website, and services (collectively, the "Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, do not use our Service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of the updated terms.',
  },
  {
    id: 'services',
    number: '02',
    title: 'Services Offered',
    bullets: [
      { label: 'Platform Services', detail: 'Connects clients with vetted professional printers across Lagos.' },
      { label: 'Design Services', detail: 'Logo design, custom templates, and branding at 70% discount for first-time customers.' },
      { label: 'Print Products', detail: 'Business cards, flyers, banners, custom apparel, wedding souvenirs, billboards, and event packages.' },
      { label: '48-Hour Guarantee', detail: 'Turnaround from order confirmation to ready-for-pickup/delivery status.' },
      { label: 'Logistics Management', detail: 'Real-time order dispatch, quality assurance, and delivery coordination.' },
    ],
  },
  {
    id: 'eligibility',
    number: '03',
    title: 'Eligibility',
    content: 'You represent and warrant that you are at least 18 years old with legal capacity to enter binding agreements. You are not prohibited by law from using our Service. All information you provide is accurate, complete, and truthful. You will not use the Service for unlawful, fraudulent, or harmful purposes. We reserve the right to suspend or terminate your account if these requirements are breached.',
  },
  {
    id: 'account',
    number: '04',
    title: 'Account Registration & Responsibilities',
    bullets: [
      { label: 'Confidentiality', detail: 'You are responsible for maintaining confidentiality of your account credentials (password, email).' },
      { label: 'Account Activity', detail: 'You are solely responsible for all activities under your account.' },
      { label: 'Security Notification', detail: 'Notify us immediately of any unauthorized access or use of your account.' },
      { label: 'Account Violations', detail: 'We reserve the right to suspend or terminate accounts used in violation of these terms.' },
    ],
  },
  {
    id: 'ordering',
    number: '05',
    title: 'Ordering & Payment',
    content: 'All orders placed through Silk Studio are binding agreements. You must provide accurate project specifications and delivery details. Pricing is in Nigerian Naira (₦) and includes applicable taxes. Payment must be completed before order confirmation. We accept Monnify payments exclusively — we do not store card or bank details. A non-refundable 75% deposit is required at order confirmation; the remaining 25% is due before final delivery. If we fail to meet the 48-hour turnaround due to our error, you are entitled to a full refund or discount on a future order.',
  },
  {
    id: 'deposits',
    number: '06',
    title: 'Deposits & Refunds',
    bullets: [
      { label: '75% Deposit', detail: 'Non-refundable once design work or printing has commenced.' },
      { label: 'Cancellation Before Design Approval', detail: 'You forfeit the entire deposit.' },
      { label: 'Cancellation After Design Approval', detail: 'You forfeit 50% of total order value.' },
      { label: 'Post-Printing Cancellation', detail: 'No refunds issued after printing has begun.' },
      { label: 'Design Service Discount', detail: 'First-time customers receive 70% off design services (one order per customer, non-transferable).' },
    ],
  },
  {
    id: 'fulfillment',
    number: '07',
    title: 'Order Fulfillment & Turnaround Time',
    content: 'Silk Studio guarantees 48-hour turnaround from order confirmation (after design approval and full payment) to ready-for-collection/delivery. The 48-hour clock begins after design approval and payment clearance. Custom orders (billboards, high-volume apparel) may require extended timelines discussed at quote stage. All printed materials undergo quality checks before delivery. If you receive defective materials due to our error, we will reprint and redeliver at no cost within 48 hours of complaint. We are not liable for delays caused by incomplete briefs, late approvals, payment delays, power outages, logistics delays, or third-party capacity issues. If delays exceed 72 hours due to our error, you are entitled to 25% refund or credit toward a future order.',
  },
  {
    id: 'intellectual',
    number: '08',
    title: 'Intellectual Property & Content',
    bullets: [
      { label: 'Your Content', detail: 'You retain full ownership of designs, briefs, and assets you upload. You grant us license to use content solely for fulfilling your order. You warrant you own the content and it does not infringe third-party rights.' },
      { label: 'Our Content', detail: 'Silk Studio branding, logos, website design, platform code are our exclusive intellectual property. Reproduction without written permission is prohibited.' },
      { label: 'Third-Party Content', detail: 'Some designs may be licensed from third parties. Use is restricted to your specific order.' },
    ],
  },
  {
    id: 'printer-liability',
    number: '09',
    title: 'Printer Network & Liability',
    content: 'Silk Studio operates a network of vetted professional printers across Lagos. While we conduct quality screening, each printer operates as an independent contractor. Silk Studio is responsible for quality assurance, delivery, and customer service coordination. Our total liability shall not exceed the amount you paid for the specific order. We are not liable for indirect, incidental, special, or consequential damages, issues from incomplete briefs, third-party service failures, or unlawful use of materials.',
  },
  {
    id: 'indemnification',
    number: '10',
    title: 'Indemnification',
    content: 'You agree to indemnify, defend, and hold harmless Silk Studio from any claims, damages, or losses arising from: your use of the Service in violation of these terms, your content infringing third-party intellectual property rights, or your use of printed materials in violation of applicable law.',
  },
  {
    id: 'acceptable-use',
    number: '11',
    title: 'Acceptable Use Policy',
    bullets: [
      { label: 'Prohibited Actions', detail: 'Do not upload malware, attempt unauthorized access, engage in harassment, submit defamatory content, use for fraud, reverse-engineer our platform, scrape data, or resell services.' },
      { label: 'Consequences', detail: 'Violations result in immediate account suspension and potential legal action.' },
    ],
  },
  {
    id: 'disputes',
    number: '12',
    title: 'Disputes & Resolution',
    bullets: [
      { label: 'Informal Resolution', detail: 'Email thesilkstudiong@gmail.com within 7 days. We respond within 48 hours.' },
      { label: 'Mediation', detail: 'If informal resolution fails, both parties attempt mediation in Lagos, Nigeria under Nigerian law.' },
      { label: 'Jurisdiction', detail: 'Governed by laws of the Federal Republic of Nigeria. Legal proceedings brought exclusively in Lagos State courts.' },
    ],
  },
  {
    id: 'termination',
    number: '13',
    title: 'Termination of Service',
    content: 'Silk Studio reserves the right to terminate or suspend your account immediately without notice if you violate these Terms, engage in fraudulent activity, abuse the Service, or fail to pay invoices. Upon termination, you lose all account access and active orders. Non-refundable deposits are forfeited.',
  },
  {
    id: 'confidentiality',
    number: '14',
    title: 'Confidentiality',
    content: 'We treat all project briefs, designs, and business information as confidential. Our team and printer partners are bound by confidentiality agreements. We will not disclose information to third parties except as outlined in our Privacy Policy or required by law.',
  },
  {
    id: 'warranties',
    number: '15',
    title: 'Limitation of Warranties',
    content: 'Silk Studio provides its Service on an "AS IS" and "AS AVAILABLE" basis. We make no warranties regarding continuous availability, accuracy of information, fitness for a particular purpose, or quality (except as guaranteed in Section 7).',
  },
  {
    id: 'changes',
    number: '16',
    title: 'Changes to Terms',
    content: 'We may update these Terms and Conditions at any time. Material changes will be communicated via email or dashboard notice. Your continued use constitutes acceptance of updated terms. We recommend reviewing these terms periodically.',
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

export default function TermsAndConditionsPage() {
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

        // Sections fade-in on scroll
        if (cardsRef.current) {
          gsap.fromTo(
            cardsRef.current.querySelectorAll('section'),
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.15,
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
        background: 'radial-gradient(circle at 20% 50%, rgba(198,255,51,0.05) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,150,150,0.03) 0%, transparent 40%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', padding: 'clamp(24px, 5vw, 120px) 24px' }}>

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
            Terms &amp;<br />Conditions.
          </h1>

          <h2 style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 600,
            fontSize: 'clamp(24px, 6vw, 48px)',
            color: '#FFFFFF',
            marginBottom: 32,
          }}>
            Let's be clear about how this works.
          </h2>

          <p style={{
            fontFamily: 'var(--font-general)', fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#A0A0A0',
            lineHeight: 1.7,
            maxWidth: 700,
            marginBottom: 48,
            margin: '0 0 48px 0',
          }}>
            When you order from Silk Studio, you're connecting with vetted printers across Lagos. Here's what both of us promise each other.
          </p>

          <div style={{ 
            height: 1, 
            background: 'linear-gradient(90deg, rgba(198,255,51,0.3) 0%, transparent 100%)', 
            marginBottom: 'clamp(48px, 8vw, 80px)',
          }} />
        </div>

        {/* SECTIONS */}
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
                    fontSize: 'clamp(12px, 1.5vw, 16px)',
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: '#555555',
                    textTransform: 'uppercase',
                  }}>
                    {clause.number}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontWeight: 700,
                  fontSize: 'clamp(24px, 5vw, 40px)',
                  color: '#FFFFFF',
                  marginBottom: 24,
                  margin: '0 0 24px 0',
                  lineHeight: 1.2,
                  letterSpacing: '-0.5px',
                }}>
                  {clause.title}
                </h3>
              </div>

              {clause.bullets ? (
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'clamp(20px, 3vw, 32px)' 
                }}>
                  {clause.bullets.map((b) => (
                    <li key={b.label} style={{ display: 'flex', gap: 16 }}>
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #C6FF33 0%, #00D4AA 100%)',
                        flexShrink: 0,
                        marginTop: 8,
                      }} />
                      <div>
                        <div style={{
                          fontFamily: 'var(--font-general)',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          fontSize: 'clamp(16px, 2vw, 18px)',
                          marginBottom: 4,
                        }}>
                          {b.label}
                        </div>
                        <p style={{
                          fontFamily: 'var(--font-general)',
                          fontSize: 'clamp(14px, 1.8vw, 18px)',
                          color: '#A0A0A0',
                          lineHeight: 1.7,
                          margin: 0,
                        }}>
                          {b.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{
                  fontFamily: 'var(--font-general)',
                  fontSize: 'clamp(16px, 2vw, 18px)',
                  color: '#A0A0A0',
                  lineHeight: 1.8,
                  margin: 0,
                  maxWidth: 700,
                }}>
                  {clause.content}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* CTA SECTION */}
        <div style={{
          marginTop: 'clamp(60px, 10vw, 120px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 32,
        }}>
          <button
            style={{
              width: 'clamp(200px, 90%, 500px)',
              padding: '20px 32px',
              borderRadius: 9999,
              border: 'none',
              background: '#FFFFFF',
              color: '#000000',
              fontFamily: 'var(--font-jakarta)',
              fontSize: 'clamp(16px, 2vw, 20px)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(198,255,51,0.2)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.transform = 'translateY(-4px)';
              el.style.boxShadow = '0 16px 48px rgba(198,255,51,0.3)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = '0 8px 32px rgba(198,255,51,0.2)';
            }}
          >
            I Agree to Terms
          </button>

          <p style={{
            fontFamily: 'var(--font-general)',
            fontSize: 'clamp(12px, 1.5vw, 14px)',
            color: '#555555',
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: 500,
          }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
            <br />
            Last updated: 30th August 2026
          </p>
        </div>

        {/* FOOTER */}
        <div style={{
          marginTop: 'clamp(60px, 10vw, 100px)',
          paddingTop: 'clamp(32px, 5vw, 60px)',
          borderTop: '1px solid rgba(198,255,51,0.1)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(11px, 1.2vw, 13px)',
            letterSpacing: 1,
            color: '#555555',
            textTransform: 'uppercase',
            marginBottom: 24,
            margin: '0 0 24px 0',
          }}>
            © Silk Studio 2026
          </p>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: '← Back home', href: '/' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Contact', href: '/#contact' },
            ].map(l => (
              <Link key={l.href} href={l.href}
                style={{
                  fontFamily: 'var(--font-general)',
                  fontSize: 'clamp(13px, 1.5vw, 16px)',
                  color: '#666666',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C6FF33'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#666666'; }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}