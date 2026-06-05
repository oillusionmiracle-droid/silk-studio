'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const sections = [
  {
    id: 'collection',
    number: '01',
    title: 'Information We Collect',
    bullets: [
      { label: 'Personal Identity Data', detail: 'Names, phone numbers, and active email addresses provided via contact points or custom quote configurations.' },
      { label: 'Project Reference Files', detail: 'Layout mockups, assets, and design references securely processed through our integrated Cloudinary pipeline.' },
      { label: 'Transaction Logs', detail: 'Secure token exchanges and reference parameters generated through our integrated local processing channels. No card or bank credentials pass through our servers.' },
    ],
  },
  {
    id: 'usage',
    number: '02',
    title: 'How We Use Your Information',
    content: 'The processing of your data is strictly targeted at optimising project fulfillment loops. This covers validating payment requests, providing real-time production status reports for your print or digital assets, identifying technical system anomalies, and ensuring your client portal works reliably across modern devices.',
  },
  {
    id: 'protection',
    number: '03',
    title: 'Data Rights & Security',
    content: 'Silk Studio enforces rigorous technical safeguards. Your code data structures are completely separate from asset streams, inherently protecting your data against breach attempts. At any point, you retain full autonomous rights to request absolute erasure of your personal data and uploaded project references from our live environment.',
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
        // Force fully explicit visibility limits via fromTo arrays
        if (heroRef.current) {
          gsap.fromTo(
            Array.from(heroRef.current.children),
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power3.out',
              delay: 0.1,
            }
          );
        }

        if (cardsRef.current) {
          gsap.fromTo(
            cardsRef.current.querySelectorAll('.privacy-card'),
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 85%',
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
      backgroundColor: '#F5F5F7',
      color: '#1D1D1F',
      position: 'relative',
    }}>
      {/* Dynamic Style Injection to kill any layout-level gray color inherits */}
      <style dangerouslySetInnerHTML={{__html: `
        .privacy-dark-text, .privacy-dark-text * {
          color: #1D1D1F !important;
        }
        .privacy-muted-text, .privacy-muted-text * {
          color: #424245 !important;
        }
        .privacy-card span, .privacy-card li {
          color: #424245 !important;
        }
      `}} />

      {/* Ambient gradient asset blur */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 400,
        background: 'linear-gradient(180deg, rgba(198,255,51,0.08) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Subtle background dot texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none',
        opacity: 0.6,
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', padding: '140px 24px 120px' }}>

        {/* HERO BLOCK */}
        <div ref={heroRef} style={{ marginBottom: 80 }}>
          {/* Pill Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 100, padding: '7px 20px', marginBottom: 36,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#C6FF33', border: '1px solid rgba(0,0,0,0.2)' }} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              letterSpacing: 3, textTransform: 'uppercase', color: '#515154',
            }}>
              Legal Documentation
            </span>
          </div>

          <h1 className="privacy-dark-text" style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 900,
            fontSize: 'clamp(52px, 8vw, 96px)',
            letterSpacing: '-3px',
            lineHeight: 0.95,
            color: '#1D1D1F',
            marginBottom: 28,
          }}>
            Privacy<br />Policy.
          </h1>

          <p className="privacy-muted-text" style={{
            fontFamily: 'var(--font-general)', fontSize: 20,
            color: '#424245',
            lineHeight: 1.6, maxWidth: 560,
            marginBottom: 28,
          }}>
            We take your privacy seriously. Here's exactly what we collect, why we collect it, and how it's protected.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 1, color: '#86868B', textTransform: 'uppercase' }}>
              Effective June 2026
            </p>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#D2D2D7' }} />
            <Link href="/terms" style={{
              fontFamily: 'var(--font-general)', fontSize: 16, fontWeight: 500,
              color: '#424245', textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1D1D1F'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#424245'; }}
            >
              Terms & Conditions ↗
            </Link>
          </div>

          <div style={{ height: 1, background: 'rgba(0,0,0,0.1)', marginTop: 48 }} />
        </div>

        {/* DETAILS CONTAINER CARDS */}
        <div ref={cardsRef} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {sections.map((sec, i) => (
            <div
              key={sec.id}
              id={sec.id}
              className="privacy-card"
              style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: 24,
                padding: '44px 48px',
                display: 'grid',
                gridTemplateColumns: '64px 1fr',
                gap: '0 28px',
                transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
                scrollMarginTop: 120,
                boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(198,255,51,0.5)';
                el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.04), 0 4px 12px rgba(198,255,51,0.05)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(0,0,0,0.06)';
                el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.02)';
                el.style.transform = 'translateY(0)';
              }}
            >
              {/* Left Column Badge counter */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 4 }}>
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  background: '#1D1D1F',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 13,
                    fontWeight: 700, letterSpacing: 1, color: '#C6FF33',
                  }}>
                    {sec.number}
                  </span>
                </div>
                {i < sections.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: 'rgba(0,0,0,0.06)', minHeight: 20 }} />
                )}
              </div>

              {/* Right Column Body */}
              <div>
                <h2 className="privacy-dark-text" style={{
                  fontFamily: 'var(--font-jakarta)', fontWeight: 700,
                  fontSize: 24, color: '#1D1D1F',
                  marginBottom: 20, letterSpacing: '-0.5px', lineHeight: 1.2,
                }}>
                  {sec.title}
                </h2>

                {sec.bullets ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {sec.bullets.map((b) => (
                      <li key={b.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: '#C6FF33', border: '1.5px solid rgba(0,0,0,0.15)',
                          flexShrink: 0, marginTop: 10,
                        }} />
                        <span style={{ fontFamily: 'var(--font-general)', fontSize: 17, color: '#424245', lineHeight: 1.7 }}>
                          <strong className="privacy-dark-text" style={{ color: '#1D1D1F', fontWeight: 600 }}>{b.label}:</strong>{' '}
                          {b.detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{
                    fontFamily: 'var(--font-general)', fontSize: 17,
                    color: '#424245', lineHeight: 1.7, margin: 0,
                  }}>
                    {sec.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER STRIP */}
        <div style={{
          marginTop: 80, paddingTop: 32,
          borderTop: '1px solid rgba(0,0,0,0.08)',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 1, color: '#86868B', textTransform: 'uppercase' }}>
            © Silk Studio 2026
          </p>
          <div style={{ display: 'flex', gap: 28 }}>
            {[{ label: '← Back home', href: '/' }, { label: 'Terms & Conditions ↗', href: '/terms' }].map(l => (
              <Link key={l.href} href={l.href}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#86868B', textDecoration: 'none', transition: 'color 0.2s', letterSpacing: 0.5 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1D1D1F'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#86868B'; }}
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