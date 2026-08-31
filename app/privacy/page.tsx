'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const sections = [
  {
    id: 'who-we-are',
    number: '01',
    title: 'Who We Are',
    content: 'Silk Studio is a product of Silk Studio Nigeria Limited, a technology and design company based in Lagos, Nigeria. When we say "we", "us", or "our", we mean Silk Studio Nigeria Limited. When we say "you" or "your", we mean the person or business using Silk Studio\'s platform and services. Contact us at thesilkstudiong@gmail.com or visit silkstudio.ng.',
  },
  {
    id: 'information-collect',
    number: '02',
    title: 'Information We Collect',
    bullets: [
      { label: 'Account Information', detail: 'Name, email address, phone number, and password when you register for an order or account.' },
      { label: 'Project Information', detail: 'Design briefs, layout mockups, brand assets, design references, and project specifications securely processed through Cloudinary.' },
      { label: 'Business Information', detail: 'Business name, logo, service preferences, and delivery location details.' },
      { label: 'Payment Information', detail: 'Billing details processed securely by Monnify. We do not store card numbers or bank credentials.' },
      { label: 'Order Information', detail: 'Orders placed, recipient details, delivery addresses, and project timelines.' },
      { label: 'Communication Data', detail: 'Messages, emails, and inquiries sent through contact forms or DM channels.' },
      { label: 'Usage Data', detail: 'Pages visited, features used, device type, browser type, IP address, and interaction patterns.' },
    ],
  },
  {
    id: 'usage',
    number: '03',
    title: 'How We Use Your Information',
    bullets: [
      { label: 'Account Management', detail: 'Create, manage, and maintain your Silk Studio account.' },
      { label: 'Order Fulfillment', detail: 'Process payments and manage subscription/order fulfillment.' },
      { label: 'Routing & Tracking', detail: 'Route jobs to printer network and provide real-time production status reports.' },
      { label: 'Communications', detail: 'Send transactional communications (confirmations, approvals, updates, receipts).' },
      { label: 'Support & Improvements', detail: 'Provide customer support, validate payments, identify anomalies, optimize fulfillment, and improve features.' },
      { label: 'Compliance', detail: 'Comply with legal and regulatory obligations in Nigeria.' },
    ],
  },
  {
    id: 'sharing',
    number: '04',
    title: 'Sharing Your Information',
    bullets: [
      { label: 'Printer Network', detail: 'We share project details with vetted professional printers in our Lagos network. All printers are contractually bound to protect your data.' },
      { label: 'Service Providers', detail: 'Trusted third-party providers (Monnify for payments, Cloudinary for storage) are contractually required to protect your data.' },
      { label: 'Legal Requirements', detail: 'We may disclose data if required by law, court order, or government authority.' },
      { label: 'Business Transfers', detail: 'If Silk Studio is acquired or undergoes restructuring, your data may transfer as part of that transaction.' },
    ],
  },
  {
    id: 'security',
    number: '05',
    title: 'Data Security',
    content: 'Silk Studio enforces rigorous technical safeguards to protect your information. Your personal data and project files are stored in separate, isolated environments. All data is transmitted over HTTPS encryption. Passwords are hashed using industry-standard algorithms and never stored in plain text. Payment transactions are processed through Monnify\'s PCI-compliant secure channels — card credentials never pass through our servers. We implement regular security audits and maintain secure coding practices. Despite these safeguards, no system is completely secure.',
  },
  {
    id: 'cookies',
    number: '06',
    title: 'Cookies & Tracking Technologies',
    bullets: [
      { label: 'Session Management', detail: 'Keep you logged into your account.' },
      { label: 'Preferences', detail: 'Remember your preferences and order history.' },
      { label: 'Analytics', detail: 'Understand how our platform is used and improve functionality.' },
      { label: 'Optimization', detail: 'Analyze usage patterns to optimize the user experience.' },
    ],
  },
  {
    id: 'retention',
    number: '07',
    title: 'Data Retention',
    bullets: [
      { label: 'Active Accounts', detail: 'Personal data retained for as long as your account is active or as needed to provide services.' },
      { label: 'Transaction Records', detail: 'Retained for at least 7 years to comply with Nigerian tax and financial regulations.' },
      { label: 'Account Deletion', detail: 'Personal data deleted within 30 days of account deletion, except where retention is required by law.' },
      { label: 'Archive Files', detail: 'Project files may be retained longer for quality assurance and dispute resolution.' },
    ],
  },
  {
    id: 'rights',
    number: '08',
    title: 'Your Rights',
    bullets: [
      { label: 'Access', detail: 'Request a copy of the personal data we hold about you.' },
      { label: 'Correction', detail: 'Request correction of inaccurate or incomplete data.' },
      { label: 'Deletion', detail: 'Request deletion of your account and associated personal data (subject to legal retention).' },
      { label: 'Opt-Out', detail: 'Opt out of marketing communications, promotional emails, and non-essential notifications.' },
      { label: 'Data Portability', detail: 'Request your data in a portable, machine-readable format.' },
      { label: 'Withdraw Consent', detail: 'Withdraw consent for data processing at any time (does not affect legality of prior processing).' },
    ],
  },
  {
    id: 'children',
    number: '09',
    title: 'Children',
    content: 'Silk Studio is not intended for use by anyone under 18 years old. We do not knowingly collect personal data from minors. If you believe a minor has provided us with personal data, please contact us immediately at thesilkstudiong@gmail.com and we will delete it within 48 hours.',
  },
  {
    id: 'third-party',
    number: '10',
    title: 'Third-Party Links',
    content: 'Our platform may contain links to third-party websites and services (Cloudinary, Monnify, social media). We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing personal information.',
  },
  {
    id: 'changes',
    number: '11',
    title: 'Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of material changes by email or through a notice on our dashboard. Your continued use of Silk Studio after changes take effect constitutes your acceptance of the updated policy.',
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
            We keep your project information safe and separate from everything else. You own your designs. We're just the bridge between you and Lagos's best printers.
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
                    fontSize: 'clamp(12px, 1.5vw, 16px)',
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: '#555555',
                    textTransform: 'uppercase',
                  }}>
                    {sec.number}
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
                  {sec.title}
                </h3>
              </div>

              {sec.bullets ? (
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'clamp(20px, 3vw, 32px)' 
                }}>
                  {sec.bullets.map((b) => (
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
                  {sec.content}
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
            I Accept
          </button>

          <p style={{
            fontFamily: 'var(--font-general)',
            fontSize: 'clamp(12px, 1.5vw, 14px)',
            color: '#555555',
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: 500,
          }}>
            By continuing, you agree to our Privacy Policy and Terms of Service.
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
              { label: 'Terms & Conditions', href: '/terms' },
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