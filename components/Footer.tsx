'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

/* ─────────────────────────────────────────
   FOOTER DATA
───────────────────────────────────────── */

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Apparel', href: '/apparel' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

const socials = [
  { icon: '/icons/instagram.svg', href: 'https://instagram.com/thesilkstudiong', label: 'Instagram' },
  { icon: '/icons/tiktok.svg', href: 'https://tiktok.com/@thesilkstudiong', label: 'TikTok' },
  { icon: '/icons/whatsapp.svg', href: 'https://wa.me/2347064829776', label: 'WhatsApp' },
  { icon: '/icons/email.svg', href: 'mailto:thesilkstudiong@gmail.com', label: 'Email' },
];

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */

export default function Footer() {
  const colsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;
    const loadGSAP = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (colsRef.current) {
          gsap.fromTo(
            colsRef.current.querySelectorAll<HTMLElement>('.footer-col'),
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: { trigger: colsRef.current, start: 'top 90%', once: true },
            }
          );
        }
      });
    };
    loadGSAP();
    return () => ctx?.revert();
  }, []);

  return (
    <footer style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
      {/* Background media */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <video autoPlay muted loop playsInline preload="none"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}>
          <source src="/videos/footer-bg.webm" type="video/webm" />
          <source src="/videos/footer-bg.mp4" type="video/mp4" />
        </video>
        <img src="/images/footer-bg.jpg" alt="" aria-hidden
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }} />
      </div>

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.60) 40%, rgba(0,0,0,0.92) 100%)',
      }} />

      {/* Green glow */}
      <div style={{
        position: 'absolute', bottom: 0, left: '10%',
        width: 480, height: 280,
        background: 'radial-gradient(ellipse, rgba(198,255,51,0.06) 0%, transparent 70%)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Three-column grid */}
        <div ref={colsRef} style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '56px 40px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}>

          {/* Col 1 — Brand */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ height: 42, display: 'flex', alignItems: 'center' }}>
              <img src="/logo-white.png" alt="Silk Studio"
                style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                onError={e => { (e.target as HTMLImageElement).src = '/logo-white.svg'; }} />
            </div>
            <p style={{
              fontFamily: 'var(--font-general)', fontSize: 14,
              color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 240, margin: 0,
            }}>
              Lagos-based creative studio delivering print, branding, apparel & web — fast.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
              {socials.map((s) => (
                <a key={s.href} href={s.href}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer" aria-label={s.label}
                  style={{
                    width: 40, height: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 10,
                    transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = '#C6FF33';
                    el.style.background = 'rgba(198,255,51,0.1)';
                    el.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,0.09)';
                    el.style.background = 'rgba(255,255,255,0.05)';
                    el.style.transform = 'translateY(0)';
                  }}>
                  <img src={s.icon} alt={s.label} width={18} height={18} style={{ opacity: 0.8 }} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2.5,
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 4,
            }}>Navigate</p>
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}
                style={{
                  fontFamily: 'var(--font-general)', fontSize: 15, fontWeight: 500,
                  color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                  transition: 'color 0.2s, padding-left 0.2s', display: 'inline-block',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = '#C6FF33'; el.style.paddingLeft = '4px';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = 'rgba(255,255,255,0.6)'; el.style.paddingLeft = '0';
                }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Contact */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2.5,
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 4,
            }}>Get in Touch</p>

            <div style={{
              background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '18px 20px',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <a href="https://wa.me/2347064829776" target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-general)', fontSize: 15, fontWeight: 600,
                  color: '#fff', textDecoration: 'none', transition: 'color 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C6FF33'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'rgba(198,255,51,0.12)',
                  border: '1px solid rgba(198,255,51,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0,
                }}>📞</span>
                +234 706 482 9776
              </a>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <a href="mailto:thesilkstudiong@gmail.com"
                style={{
                  fontFamily: 'var(--font-general)', fontSize: 14, fontWeight: 500,
                  color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                  transition: 'color 0.2s', display: 'flex', alignItems: 'center',
                  gap: 8, wordBreak: 'break-all',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C6FF33'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)'; }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0,
                }}>✉</span>
                thesilkstudiong@gmail.com
              </a>
            </div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>
              📍 Lagos, Nigeria
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          padding: '20px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
          maxWidth: 1100, margin: '0 auto',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'rgba(255,255,255,0.28)', letterSpacing: 0.8, margin: 0,
          }}>
            © Silk Studio 2026 · Lagos, Nigeria
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'rgba(255,255,255,0.28)', textDecoration: 'none',
                  letterSpacing: 0.5, transition: 'color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.28)'; }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}