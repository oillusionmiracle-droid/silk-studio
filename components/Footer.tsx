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
  {
    name: 'Instagram',
    url: 'https://instagram.com/thesilkstudiong',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@thesilkstudiong',
    icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/thesilkstudiong',
    icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
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
    <footer style={{ background: '#0a0a0a', color: '#fff', overflow: 'hidden', position: 'relative', zIndex: 10 }}>

      {/* ── Ambient background — the hero photo, kept almost entirely to a dark scrim.
          Deliberately using the still image here, not the video: this section is
          dense with nav links, addresses and a form, so anything that moves or shows
          detail behind that text will hurt legibility and cost bandwidth for no real
          payoff. If you actually want motion here too, swap the <img> below for the
          same <video autoPlay muted loop playsInline> block used in the hero/FinalCTA,
          but I'd push back on that for this section specifically. ── */}
      <img
        src="/images/hero-bg.jpg"
        alt=""
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0,
          opacity: 0.16,
        }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(180deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.96) 100%)',
      }} />

      {/* ── TOP: Logo + Brand name ── */}
      <div style={{
        position: 'relative', zIndex: 1,
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

      {/* ── MAIN GRID ── */}
      <div ref={colsRef} style={{
        position: 'relative', zIndex: 1,
        maxWidth: 1160, margin: '0 auto',
        padding: 'clamp(40px, 7vw, 64px) clamp(20px, 5vw, 40px) clamp(40px, 7vw, 56px)',
      }}>

        {/* Mobile: nav links top, then 2-col row (info + connect), then newsletter */}
        {/* Desktop: 3 equal columns */}
        <style>{`
          .footer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: clamp(32px, 6vw, 64px) clamp(20px, 4vw, 48px);
          }
          .footer-col-nav { grid-column: 1 / -1; }
          .footer-col-info { grid-column: 1; }
          .footer-col-connect { grid-column: 2; }
          .footer-col-newsletter { grid-column: 1 / -1; }

          @media (min-width: 900px) {
            .footer-grid {
              grid-template-columns: 1.3fr 1fr 1.2fr;
            }
            .footer-col-nav { grid-column: auto; }
            .footer-col-info { grid-column: auto; }
            .footer-col-connect { display: none; } /* merged into info col on desktop */
            .desktop-connect { display: block !important; }
            .footer-col-newsletter { grid-column: auto; }
          }
        `}</style>

        <div className="footer-grid">

          {/* ── COL: Navigation (full width on mobile, col 1 on desktop) ── */}
          <div className="footer-col footer-col-nav" style={{ display: 'flex', flexDirection: 'column' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(2px, 1vw, 6px)' }}>
              {primaryNavLinks.map(link => (
                <Link key={link.href} href={link.href}
                  style={{
                    fontFamily: fontSans,
                    fontSize: 'clamp(28px, 6vw, 44px)',
                    fontWeight: 700, letterSpacing: '-0.03em',
                    color: '#fff', textDecoration: 'none', lineHeight: 1.15,
                    transition: 'color 0.18s', display: 'inline-block',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = accent; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <nav style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px 20px', marginTop: 'clamp(16px, 3vw, 24px)' }}>
              {secondaryNavLinks.map(link => (
                <Link key={link.href} href={link.href}
                  style={{
                    fontFamily: fontSans, fontSize: 'clamp(14px, 3vw, 15px)', fontWeight: 500,
                    color: midText, textDecoration: 'none', transition: 'color 0.18s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = midText; }}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── COL: Business Info (col 1 of 2-col row on mobile, col 2 on desktop) ── */}
          <div className="footer-col footer-col-info" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 4vw, 32px)', paddingTop: 4 }}>
            <div>
              <p style={{ fontFamily: fontSans, fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.5 }}>Studio</p>
              <p style={{ fontFamily: fontSans, fontSize: 15, color: dimText, lineHeight: 1.7, margin: 0 }}>
                Ahmadu Bello Way,<br />Victoria Island, Lagos
              </p>
            </div>
            <div>
              <p style={{ fontFamily: fontSans, fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.5 }}>Email</p>
              <a href="mailto:thesilkstudiong@gmail.com"
                style={{ fontFamily: fontSans, fontSize: 14, color: dimText, textDecoration: 'none', transition: 'color 0.18s', wordBreak: 'break-all' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = accent; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = dimText; }}>
                thesilkstudiong@gmail.com
              </a>
            </div>
            {/* Connect — shown in this col on desktop only (hidden on mobile via separate col) */}
            <div style={{ display: 'none' }} className="desktop-connect">
              <p style={{ fontFamily: fontSans, fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 12, letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.5 }}>Connect</p>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                {connectLinks.map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                    aria-label={link.name}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 36, height: 36, borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: dimText, transition: 'all 0.2s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = '#0D0D0D';
                      (e.currentTarget as HTMLElement).style.backgroundColor = accent;
                      (e.currentTarget as HTMLElement).style.borderColor = accent;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = dimText;
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                    }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d={link.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── COL: Connect — only shown on mobile in the 2nd column ── */}
          <div className="footer-col footer-col-connect" style={{ paddingTop: 4 }}>
            <p style={{ fontFamily: fontSans, fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 12, letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.5 }}>Connect</p>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              {connectLinks.map(link => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                  aria-label={link.name}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 38, height: 38, borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: dimText, transition: 'all 0.2s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = '#0D0D0D';
                    (e.currentTarget as HTMLElement).style.backgroundColor = accent;
                    (e.currentTarget as HTMLElement).style.borderColor = accent;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = dimText;
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d={link.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* ── COL: Newsletter Card (full width on mobile, col 3 on desktop) ── */}
          <div className="footer-col footer-col-newsletter" style={{ position: 'relative', paddingTop: 4 }}>
            <div style={{
              background: '#151515',
              borderRadius: 20,
              padding: 'clamp(28px, 5vw, 40px) clamp(20px, 4vw, 32px) 32px',
              position: 'relative',
              overflow: 'visible',
            }}>
              <img
                src="/images/newsletter-mascot.png"
                alt=""
                style={{
                  position: 'absolute',
                  top: -60,
                  right: 20,
                  width: 140,
                  height: 'auto',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />

              <h3 style={{ fontFamily: fontSans, fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px', paddingRight: 80 }}>
                Subscribe to Silk Studio
              </h3>

              <form onSubmit={handleSubscribe} style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                    fontSize: '22px',
                    fontWeight: 400,
                    color: '#fff',
                    padding: '0',
                  }}
                />

                <p style={{
                  fontFamily: fontSans, fontSize: 15, color: '#aaa',
                  lineHeight: 1.5, margin: 0,
                }}>
                  Digestible selection of inspiring finds. Sent monthly, from our screen to yours.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    style={{
                      background: '#00bcd4',
                      border: 'none', cursor: 'pointer',
                      padding: '14px 28px', borderRadius: 100,
                      color: '#fff', fontSize: 16, fontWeight: 700,
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  >
                    {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
                  </button>

                  <Link href="/privacy" style={{ fontFamily: fontSans, fontSize: 14, color: '#aaa', textDecoration: 'underline' }}>
                    Privacy
                  </Link>
                </div>

                {message && (
                  <p style={{
                    fontFamily: fontMono, fontSize: 12,
                    color: status === 'success' ? '#00bcd4' : '#ff5555',
                    marginTop: 8, letterSpacing: 0.3,
                    fontWeight: 500,
                  }}>
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        position: 'relative', zIndex: 1,
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