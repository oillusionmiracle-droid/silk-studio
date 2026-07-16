'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ─────────────────────────────────────────
    FOOTER DATA
───────────────────────────────────────── */

const primaryNavLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const secondaryNavLinks = [
  { label: 'Apparel', href: '/apparel' },
  { label: 'Shop', href: '/order' },
];

const connectLinks = [
  { label: 'Instagram', href: 'https://instagram.com/thesilkstudiong' },
  { label: 'TikTok', href: 'https://tiktok.com/@thesilkstudiong' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/thesilkstudiong' },
];

const legalLinks = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
];

const NEWSLETTER_ENDPOINT = '/api/subscribe';

async function subscribeEmail(email: string): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(NEWSLETTER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Request failed');
    return { ok: true, message: "You're on the list! 🎉" };
  } catch {
    return { ok: false, message: 'Something went wrong. Try again.' };
  }
}

export default function Footer() {
  const colsRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let ctx: any;
    const load = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        if (!colsRef.current) return;
        gsap.fromTo(
          colsRef.current.querySelectorAll<HTMLElement>('.footer-col'),
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: colsRef.current, start: 'top 90%', once: true },
          }
        );
      });
    };
    load();
    return () => ctx?.revert();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    const result = await subscribeEmail(email);
    setStatus(result.ok ? 'success' : 'error');
    setMessage(result.message);
    if (result.ok) setEmail('');
  };

  const fontSans = 'var(--font-jakarta, "Plus Jakarta Sans", "DM Sans", sans-serif)';
  const fontMono = '"SF Mono", "JetBrains Mono", monospace';
  const accent = '#C6FF33';
  const dimText = 'rgba(255,255,255,0.42)';
  const midText = 'rgba(255,255,255,0.65)';

  return (
    <footer style={{ background: '#0a0a0a', color: '#fff', overflow: 'hidden', position: 'relative' }}>

      {/* ── TOP: Logo + Brand name ── */}
      <div style={{
        maxWidth: 1160, margin: '0 auto',
        padding: 'clamp(36px, 6vw, 52px) clamp(20px, 5vw, 40px) 0',
        display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 'clamp(28px, 5vw, 36px)',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'transparent', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <img
            src="/logo.svg"
            alt="Silk Studio"
            style={{ width: 32, height: 32, objectFit: 'contain' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <span style={{
          fontFamily: fontSans, fontSize: 'clamp(16px, 3vw, 20px)', fontWeight: 800,
          color: '#fff', letterSpacing: '-0.03em',
        }}>
          Silk Studio
        </span>
      </div>

      {/* ── MAIN 3-COLUMN GRID ── */}
      <div ref={colsRef} style={{
        maxWidth: 1160, margin: '0 auto',
        padding: 'clamp(40px, 7vw, 64px) clamp(20px, 5vw, 40px) clamp(40px, 7vw, 56px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: 'clamp(36px, 8vw, 64px)',
      }}>

        {/* ── COL 1: Navigation ── */}
        <div className="footer-col" style={{ display: 'flex', flexDirection: 'column' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 1.5vw, 8px)' }}>
            {primaryNavLinks.map(link => (
              <Link key={link.href} href={link.href}
                style={{
                  fontFamily: fontSans,
                  fontSize: 'clamp(26px, 5.5vw, 44px)',
                  fontWeight: 700, letterSpacing: '-0.025em',
                  color: '#fff', textDecoration: 'none', lineHeight: 1.2,
                  transition: 'color 0.18s', display: 'inline-block',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = accent; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}>
                {link.label}
              </Link>
            ))}
          </nav>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'clamp(18px, 4vw, 24px)' }}>
            {secondaryNavLinks.map(link => (
              <Link key={link.href} href={link.href}
                style={{
                  fontFamily: fontSans, fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 500,
                  color: midText, textDecoration: 'none', transition: 'color 0.18s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = midText; }}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── COL 2: Business Info ── */}
        <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 5vw, 32px)', paddingTop: 6 }}>
          <div>
            <p style={{ fontFamily: fontSans, fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Studio</p>
            <p style={{ fontFamily: fontSans, fontSize: 14, color: dimText, lineHeight: 1.75, margin: 0 }}>
              Ahmadu Bello Way,<br />Victoria Island, Lagos
            </p>
          </div>
          <div>
            <p style={{ fontFamily: fontSans, fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 8 }}>New business</p>
            <a href="mailto:thesilkstudiong@gmail.com"
              style={{ fontFamily: fontSans, fontSize: 14, color: dimText, textDecoration: 'none', transition: 'color 0.18s', wordBreak: 'break-word' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = accent; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = dimText; }}>
              thesilkstudiong@gmail.com
            </a>
          </div>
          <div>
            <p style={{ fontFamily: fontSans, fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 10 }}>Connect</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {connectLinks.map(link => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: fontSans, fontSize: 14, color: dimText, textDecoration: 'none', transition: 'color 0.18s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = dimText; }}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── COL 3: Newsletter Card ── */}
        <div className="footer-col" style={{ position: 'relative', paddingTop: 6 }}>
          <div style={{
            background: 'rgba(28,28,30,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: '28px 28px 140px', 
            position: 'relative',
            overflow: 'hidden',
            minHeight: 340,
          }}>
            <p style={{
              fontFamily: fontSans, fontSize: 15, fontWeight: 600, color: '#fff',
              margin: '0 0 24px',
            }}>
              Subscribe to The Silk Letter
            </p>

            <form onSubmit={handleSubscribe} style={{ position: 'relative', zIndex: 5 }}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: fontSans,
                  fontSize: '16px', 
                  fontWeight: 400,
                  color: '#fff', 
                  caretColor: accent,
                  padding: '12px 0 12px',
                  borderBottom: `1px solid ${status === 'error' ? 'rgba(255,80,80,0.6)' : 'rgba(255,255,255,0.25)'}`,
                  marginBottom: 16,
                  transition: 'border-color 0.2s',
                  display: 'block',
                }}
              />

              {/* Submit arrow button */}
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                style={{
                  background: status === 'success' ? 'rgba(198,255,51,0.12)' : accent,
                  border: 'none', cursor: 'pointer',
                  width: 42, height: 42, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#000', fontSize: 16, fontWeight: 700,
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'scale(1.05)';
                  el.style.boxShadow = `0 0 20px rgba(198,255,51,0.4)`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'scale(1)';
                  el.style.boxShadow = 'none';
                }}
              >
                {status === 'loading' ? '·' : status === 'success' ? '✓' : '→'}
              </button>

              {message && (
                <p style={{
                  fontFamily: fontMono, fontSize: 12,
                  color: status === 'success' ? accent : '#ff5555',
                  marginTop: 12, letterSpacing: 0.3,
                  fontWeight: 500,
                }}>
                  {message}
                </p>
              )}
            </form>

            {/* Description */}
            <p style={{
              position: 'absolute',
              bottom: 24, right: 24,
              maxWidth: 160,
              textAlign: 'right',
              fontFamily: fontSans, fontSize: 12, color: dimText,
              lineHeight: 1.5, margin: 0,
              zIndex: 3,
            }}>
              Digestible selection of inspiring finds. Sent monthly.
            </p>

            {/* Mascot */}
            <img
              src="/images/newsletter-mascot.png"
              alt=""
              aria-hidden
              style={{
                position: 'absolute',
                bottom: -8,
                left: -8,
                width: 130,
                height: 'auto',
                pointerEvents: 'none',
                zIndex: 2,
                maxWidth: 'clamp(90px, 20vw, 140px)',
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        maxWidth: 1160, margin: '0 auto',
        padding: 'clamp(16px, 3vw, 20px) clamp(20px, 5vw, 40px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontFamily: fontMono, fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: 0.3 }}>
          © 2026 Silk Studio. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {legalLinks.map(link => (
            <Link key={link.href} href={link.href}
              style={{
                fontFamily: fontMono, fontSize: 11, color: 'rgba(255,255,255,0.25)',
                textDecoration: 'none', letterSpacing: 0.3, transition: 'color 0.18s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'; }}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

    </footer>
  );
}