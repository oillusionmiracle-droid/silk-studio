'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    icon: 'https://res.cloudinary.com/dagqxe3fh/image/upload/silk-studio/icons/instagram.png',
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@thesilkstudiong',
    icon: 'https://res.cloudinary.com/dagqxe3fh/image/upload/silk-studio/icons/tiktok.png',
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/thesilkstudiong',
    icon: 'https://res.cloudinary.com/dagqxe3fh/image/upload/silk-studio/icons/facebook.png',
  },
];

const legalLinks = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
];

const NEWSLETTER_ENDPOINT = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/subscribe-newsletter`;

async function subscribeEmail(email: string): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(NEWSLETTER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return { ok: true, message: data.message || "You're on the list!" };
  } catch {
    return { ok: false, message: 'Something went wrong. Try again.' };
  }
}

export default function Footer() {
  const pathname = usePathname();
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

  // Hide main footer on apparel routes — apparel has its own footer
  if (pathname?.startsWith('/apparel')) return null;

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
        src="https://res.cloudinary.com/dagqxe3fh/image/upload/silk-studio/images/hero-bg.jpg"
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
              <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                {connectLinks.map(link => (
                  <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                    aria-label={link.name}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    }}>
                    <img 
                      src={link.icon} 
                      alt={link.name} 
                      style={{ width: 28, height: 28 }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── COL: Connect — only shown on mobile in the 2nd column ── */}
          <div className="footer-col footer-col-connect" style={{ paddingTop: 4 }}>
            <p style={{ fontFamily: fontSans, fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 12, letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.5 }}>Connect</p>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 14, alignItems: 'center' }}>
              {connectLinks.map(link => (
                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                  aria-label={link.name}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                  }}>
                  <img 
                    src={link.icon} 
                    alt={link.name} 
                    style={{ width: 30, height: 30 }}
                  />
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
                src="https://res.cloudinary.com/dagqxe3fh/image/upload/silk-studio/images/newsletter-mascot.png"
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