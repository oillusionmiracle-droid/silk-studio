'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

const clauses = [
  {
    id: 'intellectual-property',
    number: '01',
    title: 'Intellectual Property & Deliverables',
    content: 'All design elements, functional application builds, typography design hierarchies, and source assets deployed onto this domain remain the protected property of Silk Studio. Upon final payment reconciliation, absolute ownership rights of commissioned custom brand items transfer to the client. Silk Studio preserves non-exclusive license permissions to display completed works inside our interactive visual grid for promotional reference.',
  },
  {
    id: 'client-assets',
    number: '02',
    title: 'Client Sourced Materials',
    content: 'By uploading graphics, logos, imagery, or reference typography via the Cloudinary asset upload module, you certify that you retain authentic ownership titles or authorised licensing rights for those files. Silk Studio acts strictly as a fulfillment partner and holds zero liability regarding third-party copyright claims brought against client-provided content.',
  },
  {
    id: 'turnaround-variations',
    number: '03',
    title: 'Timelines & Production Bounds',
    content: 'Turnaround parameters advertised within our active portfolio (e.g., 24hrs, 48hrs) are calculated under ideal operating parameters. Project timelines initiate only after confirmation of creative scope and payment verification. For tangible print configurations — Apparel, Large Format, Stationery — minimal colour variations can occasionally manifest between digital display layouts and finished print outputs.',
  },
  {
    id: 'liability',
    number: '04',
    title: 'Limitation of Liability',
    content: 'Silk Studio and its operational team shall not be held financially or legally responsible for indirect disruptions, delivery delays outside of direct control, platform server outages, or unexpected business impacts stemming from the implementation or utilisation of our digital structures or printed physical deliverables.',
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
        // Enforce visible limits via fromTo to counter layout component bugs
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
            cardsRef.current.querySelectorAll('.clause-card'),
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
      {/* Global Style Injection block to override light theme inheritance variables */}
      <style dangerouslySetInnerHTML={{__html: `
        .terms-dark-text, .terms-dark-text * {
          color: #1D1D1F !important;
        }
        .terms-muted-text, .terms-muted-text * {
          color: #424245 !important;
        }
        .clause-card p, .clause-card span {
          color: #424245 !important;
        }
      `}} />

      {/* Ambient gradient asset blur */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 400,
        background: 'linear-gradient(180deg, rgba(198,255,51,0.08) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Subtle grid texture */}
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
              Legal Contract
            </span>
          </div>

          <h1 className="terms-dark-text" style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 900,
            fontSize: 'clamp(52px, 8vw, 96px)',
            letterSpacing: '-3px',
            lineHeight: 0.95,
            color: '#1D1D1F',
            marginBottom: 28,
          }}>
            Terms &amp;<br />Conditions.
          </h1>

          <p className="terms-muted-text" style={{
            fontFamily: 'var(--font-general)', fontSize: 20,
            color: '#424245',
            lineHeight: 1.6, maxWidth: 560,
            marginBottom: 28,
          }}>
            By using Silk Studio's services, you agree to the following terms. We've kept it plain and readable.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 1, color: '#86868B', textTransform: 'uppercase' }}>
              Effective June 2026
            </p>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#D2D2D7' }} />
            <Link href="/privacy" style={{
              fontFamily: 'var(--font-general)', fontSize: 16, fontWeight: 500,
              color: '#424245', textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1D1D1F'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#424245'; }}
            >
              Privacy Policy ↗
            </Link>
          </div>

          <div style={{ height: 1, background: 'rgba(0,0,0,0.1)', marginTop: 48 }} />
        </div>

        {/* DETAILS CONTAINER CARDS */}
        <div ref={cardsRef} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {clauses.map((clause, i) => (
            <div
              key={clause.id}
              id={clause.id}
              className="clause-card"
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
                    {clause.number}
                  </span>
                </div>
                {i < clauses.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: 'rgba(0,0,0,0.06)', minHeight: 20 }} />
                )}
              </div>

              {/* Right Column Body */}
              <div>
                <h2 className="terms-dark-text" style={{
                  fontFamily: 'var(--font-jakarta)', fontWeight: 700,
                  fontSize: 24, color: '#1D1D1F',
                  marginBottom: 18, letterSpacing: '-0.5px', lineHeight: 1.2,
                }}>
                  {clause.title}
                </h2>
                <p style={{
                  fontFamily: 'var(--font-general)', fontSize: 17,
                  color: '#424245', lineHeight: 1.7, margin: 0,
                }}>
                  {clause.content}
                </p>
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
            {[{ label: '← Back home', href: '/' }, { label: 'Privacy Policy ↗', href: '/privacy' }].map(l => (
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