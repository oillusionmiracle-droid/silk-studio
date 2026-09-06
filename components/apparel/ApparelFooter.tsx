'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ─────────────────────────────────────────
   Apparel Footer
   White, minimal, Ashluxe-inspired.
   Mailing list wired to /api/newsletter (Mailchimp + Supabase),
   PNG social icons, full policies, and larger logo.
───────────────────────────────────────── */

const POLICY_LINKS = [
  { label: 'Exchange Policy', href: '/apparel/exchange-policy' },
  { label: 'Return Policy', href: '/apparel/return-policy' },
  { label: 'Cookie Policy', href: '/apparel/cookie-policy' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact', href: '/contact' },
];

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/thesilkstudiong',
    icon: '/icons/instagram.png',
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@thesilkstudiong',
    icon: '/icons/tiktok.png',
  },
  {
    name: 'Facebook',
    url: 'https://facebook.com/thesilkstudiong',
    icon: '/icons/facebook.png',
  },
];

export default function ApparelFooter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setStatus('success');
      setMessage(data.message || "You're on the list!");
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Try again.');
    }
  };

  return (
    <footer className="apparel-footer" role="contentinfo">
      {/* ─── Newsletter Section ─── */}
      <div className="apparel-footer__newsletter">
        <div>
          <h3 className="apparel-footer__newsletter-heading">
            Join Our Mailing List
          </h3>
          <p className="apparel-footer__newsletter-sub">
            Receive updates on our latest apparel drops, private releases and studio events.
          </p>
        </div>

        <div>
          <form
            className="apparel-footer__newsletter-form"
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              className="apparel-footer__newsletter-input"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'idle' && status !== 'loading') setStatus('idle');
              }}
              required
              aria-label="Email address for newsletter"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className="apparel-footer__newsletter-btn"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? '...' : 'SUBSCRIBE'}
            </button>
          </form>

          {status === 'success' && (
            <p className="apparel-footer__newsletter-status apparel-footer__newsletter-status--success">
              {message}
            </p>
          )}
          {status === 'error' && (
            <p className="apparel-footer__newsletter-status apparel-footer__newsletter-status--error">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* ─── Social & Location Middle Row ─── */}
      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 16px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
        className="apparel-footer__social-row"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            paddingTop: 24,
            borderTop: '1px solid #f0f0f0',
          }}
        >
          {/* Social PNG Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#666666',
              }}
            >
              Follow Us:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.12)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.icon}
                    alt={s.name}
                    style={{
                      width: 28,
                      height: 28,
                      objectFit: 'contain',
                    }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Contact Email & Location */}
          <div style={{ fontSize: 13, color: '#666666' }}>
            <span>Victoria Island, Lagos &middot; </span>
            <Link
              href="/contact"
              style={{ color: '#000000', textDecoration: 'underline', fontWeight: 600 }}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="apparel-footer__bottom">
        {/* Brand Emblem Logo */}
        <Link
          href="/apparel"
          aria-label="Silk Studio Apparel — Home"
          style={{ display: 'block', textDecoration: 'none' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/apparel-logo.svg"
            alt="Silk Studio"
            className="apparel-footer__logo"
            draggable={false}
          />
        </Link>

        {/* Full Policy & Legal links */}
        <nav className="apparel-footer__links" aria-label="Policies and Legal">
          {POLICY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="apparel-footer__link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="apparel-footer__copyright">
          &copy; {new Date().getFullYear()} Silk Studio. All rights reserved.
        </p>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .apparel-footer__social-row {
            padding: 0 32px 32px !important;
          }
        }
        @media (min-width: 1200px) {
          .apparel-footer__social-row {
            padding: 0 48px 32px !important;
          }
        }
      `}</style>
    </footer>
  );
}
