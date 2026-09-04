'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const sections = [
  {
    id: 'who-we-are',
    number: '01',
    title: 'Who We Are',
    content: 'Silk Studio is a product of Silk Studio Nigeria Limited, a technology, design, and apparel company based in Lagos, Nigeria. When we say "we," "us," or "our," we mean Silk Studio Nigeria Limited. When we say "you" or "your," we mean the person or business using Silk Studio\'s platform, services, or apparel shop. Contact us at thesilkstudiong@gmail.com or visit silkstudio.ng.\n\nThis policy covers our entire platform, including our design and print services, our custom order tool, and our apparel ("wears") shop.',
  },
  {
    id: 'information-collect',
    number: '02',
    title: 'Information We Collect',
    bullets: [
      { label: 'Account Information', detail: 'Name, email address, phone number, and password when you register for an order or account.' },
      { label: 'Project Information', detail: 'Design briefs, layout mockups, brand assets, design references, and project specifications, securely processed and stored through Cloudinary.' },
      { label: 'Business Information', detail: 'Business name, logo, service preferences, and delivery location details, for clients ordering print, design, or branding services.' },
      { label: 'Apparel Order Information', detail: 'For wears purchases: item selections, sizes, quantities, delivery address (Lagos-based delivery), and order status, stored securely in our Supabase database.' },
      { label: 'Payment Information', detail: 'Billing details processed securely by Paystack. We do not store card numbers, bank credentials, or any sensitive payment information on our own servers — Paystack\'s PCI-compliant systems handle this directly.' },
      { label: 'Order Information', detail: 'Orders placed, recipient details, delivery addresses, and project or delivery timelines, across both custom print/design orders and apparel purchases.' },
      { label: 'Wishlist & Cart Data', detail: 'For the apparel shop, items you save to your wishlist or add to your cart are stored locally in your browser to improve your shopping experience. This data is not transmitted to our servers unless you complete a purchase.' },
      { label: 'Communication Data', detail: 'Messages, emails, and inquiries sent through contact forms, WhatsApp, or DM channels.' },
      { label: 'Newsletter & Marketing Data', detail: 'If you subscribe to our mailing list, your email address is stored and managed through our email service provider, Resend, to send you order updates, shipping notifications, and occasional promotional content.' },
      { label: 'Usage Data', detail: 'Pages visited, features used, device type, browser type, IP address, general location (used to determine currency display in our apparel shop), and interaction patterns.' },
    ],
  },
  {
    id: 'usage',
    number: '03',
    title: 'How We Use Your Information',
    bullets: [
      { label: 'Account Management', detail: 'Create, manage, and maintain your Silk Studio account.' },
      { label: 'Order Fulfillment', detail: 'Process payments, manage custom print/design order fulfillment, and manage apparel order production, packaging, and delivery.' },
      { label: 'Routing & Tracking', detail: 'Route custom print/design jobs to our printer network and provide real-time production status reports; track apparel orders from confirmation through delivery.' },
      { label: 'Communications', detail: 'Send transactional communications (order confirmations, payment receipts, shipping updates, design approvals).' },
      { label: 'Localization', detail: 'Use your general location to determine appropriate currency display in our apparel shop (Naira for Nigeria-based visitors, an approximate USD conversion for visitors elsewhere — note that all apparel purchases are billed and charged in Nigerian Naira regardless of displayed currency).' },
      { label: 'Support & Improvements', detail: 'Provide customer support, validate payments, identify anomalies, optimize fulfillment, and improve platform and shop features.' },
      { label: 'Marketing (With Consent)', detail: 'Send newsletter updates about new arrivals, drops, and promotions if you\'ve subscribed. You may opt out at any time.' },
      { label: 'Compliance', detail: 'Comply with legal and regulatory obligations in Nigeria.' },
    ],
  },
  {
    id: 'sharing',
    number: '04',
    title: 'Sharing Your Information',
    bullets: [
      { label: 'Printer Network', detail: 'We share custom project details with vetted professional printers in our Lagos network for print and design orders. All printers are contractually bound to protect your data.' },
      { label: 'Print-on-Demand Fulfillment', detail: 'For apparel orders, relevant order details (item, size, quantity, delivery address) are shared with our print-on-demand fulfillment partner(s) solely for the purpose of producing and delivering your order.' },
      { label: 'Service Providers', detail: 'Trusted third-party providers are contractually required to protect your data, including Paystack (payment processing), Cloudinary (file and image storage), Supabase (order, product, and account data storage), and Resend (transactional and newsletter email delivery).' },
      { label: 'Legal Requirements', detail: 'We may disclose data if required by law, court order, or government authority.' },
      { label: 'Business Transfers', detail: 'If Silk Studio is acquired or undergoes restructuring, your data may transfer as part of that transaction.' },
    ],
  },
  {
    id: 'security',
    number: '05',
    title: 'Data Security',
    content: 'Silk Studio enforces rigorous technical safeguards to protect your information. Your personal data, project files, and order records are stored in separate, access-controlled environments (Cloudinary for files, Supabase for structured order/product data). All data is transmitted over HTTPS encryption. Passwords are hashed using industry-standard algorithms and never stored in plain text. Payment transactions are processed through Paystack\'s PCI-compliant secure channels — card credentials never pass through our servers. Order-writing operations (such as recording a completed apparel purchase) are handled through access-restricted server-side functions, not directly from your browser, to prevent unauthorized data manipulation. We implement regular security reviews and maintain secure coding practices. Despite these safeguards, no system is completely secure.',
  },
  {
    id: 'cookies',
    number: '06',
    title: 'Cookies & Tracking Technologies',
    bullets: [
      { label: 'Session Management', detail: 'Keep you logged into your account where applicable.' },
      { label: 'Cart & Wishlist Persistence', detail: 'Remember items in your apparel shopping cart and wishlist between visits, stored locally in your browser.' },
      { label: 'Preferences', detail: 'Remember your currency display preference and general location for the apparel shop.' },
      { label: 'Analytics', detail: 'Understand how our platform and shop are used and improve functionality.' },
      { label: 'Optimization', detail: 'Analyze usage patterns to optimize the user experience across both our services platform and apparel shop.' },
    ],
  },
  {
    id: 'retention',
    number: '07',
    title: 'Data Retention',
    bullets: [
      { label: 'Active Accounts', detail: 'Personal data retained for as long as your account is active or as needed to provide services.' },
      { label: 'Transaction Records', detail: 'Retained for at least 7 years to comply with Nigerian tax and financial regulations.' },
      { label: 'Account Deletion', detail: 'Personal data deleted within 30 days of account deletion request, except where retention is required by law.' },
      { label: 'Archive Files', detail: 'Project files and order records may be retained longer for quality assurance, fulfillment tracking, and dispute resolution.' },
      { label: 'Newsletter Data', detail: 'Your email remains in our mailing list until you unsubscribe or request deletion.' },
    ],
  },
  {
    id: 'rights',
    number: '08',
    title: 'Your Rights',
    bullets: [
      { label: 'Access', detail: 'Request a copy of the personal data we hold about you.' },
      { label: 'Correction', detail: 'Request correction of inaccurate or incomplete data.' },
      { label: 'Deletion', detail: 'Request deletion of your account and associated personal data (subject to legal retention requirements, such as transaction records).' },
      { label: 'Opt-Out', detail: 'Opt out of marketing communications, promotional emails, and non-essential notifications at any time — every newsletter email includes an unsubscribe option.' },
      { label: 'Data Portability', detail: 'Request your data in a portable, machine-readable format.' },
      { label: 'Withdraw Consent', detail: 'Withdraw consent for data processing at any time (does not affect the legality of prior processing).' },
    ],
  },
  {
    id: 'children',
    number: '09',
    title: 'Children',
    content: 'Silk Studio, including our apparel shop, is not intended for use by anyone under 18 years old. We do not knowingly collect personal data from minors. If you believe a minor has provided us with personal data, please contact us immediately at thesilkstudiong@gmail.com and we will delete it within 48 hours.',
  },
  {
    id: 'third-party',
    number: '10',
    title: 'Third-Party Links',
    content: 'Our platform may contain links to third-party websites and services (Cloudinary, Paystack, Supabase, Resend, social media). We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing personal information.',
  },
  {
    id: 'changes',
    number: '11',
    title: 'Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, services (including our apparel shop), or legal requirements. We will notify you of material changes by email or through a notice on our website. Your continued use of Silk Studio after changes take effect constitutes your acceptance of the updated policy.',
  },
  {
    id: 'contact',
    number: '12',
    title: 'Contact Us',
    bullets: [
      { label: 'Email', detail: 'thesilkstudiong@gmail.com' },
      { label: 'Website', detail: 'silkstudio.ng' },
      { label: 'WhatsApp', detail: '+2347064829776' },
      { label: 'Location', detail: 'Lagos, Nigeria' },
    ],
  },
];

export default function PrivacyPolicyPage() {
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
            Privacy Policy.
          </h1>

          <h2 style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 600,
            fontSize: 'clamp(24px, 6vw, 48px)',
            color: '#FFFFFF',
            marginBottom: 32,
          }}>
            Your data is yours.
          </h2>

          <p style={{
            fontFamily: 'var(--font-general)', fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#A0A0A0',
            lineHeight: 1.7,
            maxWidth: 700,
            marginBottom: 48,
            margin: '0 0 48px 0',
          }}>
            We keep your project and order information safe and separate from everything else. You own your designs. Your apparel purchases are handled with the same care as our print and design work — we&apos;re just the bridge between you, Lagos&apos;s best printers, and the wears you buy from us directly.
          </p>

          <div style={{ 
            height: 1, 
            background: 'linear-gradient(90deg, rgba(198,255,51,0.3) 0%, transparent 100%)', 
            marginBottom: 'clamp(48px, 8vw, 80px)',
          }} />
        </div>

        {/* SECTIONS */}
        <div ref={cardsRef} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(60px, 8vw, 100px)' }}>
          {sections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
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
                    {sec.number}
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--font-jakarta)',
                    fontSize: 'clamp(24px, 4vw, 36px)',
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    color: '#FFFFFF',
                    margin: 0,
                  }}>
                    {sec.title}
                  </h3>
                </div>
              </div>

              {sec.content && (
                <p style={{
                  fontFamily: 'var(--font-general)',
                  fontSize: 'clamp(15px, 2vw, 17px)',
                  lineHeight: 1.8,
                  color: '#CCCCCC',
                  margin: 0,
                  whiteSpace: 'pre-line',
                }}>
                  {sec.content}
                </p>
              )}

              {sec.bullets && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {sec.bullets.map((b, i) => (
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
            I Accept
          </h4>
          <p style={{
            fontFamily: 'var(--font-general)',
            fontSize: 15,
            color: '#A0A0A0',
            maxWidth: 500,
            margin: '0 auto 28px auto',
            lineHeight: 1.6,
          }}>
            By continuing to use Silk Studio, you agree to our Privacy Policy and Terms and Conditions.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/terms"
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
              View Terms &amp; Conditions
            </Link>
            <Link
              href="/apparel/cookie-policy"
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
              View Cookie Policy
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