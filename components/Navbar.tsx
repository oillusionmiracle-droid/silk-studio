'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Apparel', href: '/apparel' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 64,
          backgroundColor: scrolled ? 'rgba(13, 13, 13, 0.92)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'background-color 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease',
          display: 'flex',
          alignItems: 'center',
          padding: '0 clamp(20px, 5vw, 48px)',
        }}
      >
        {/* Logo and Studio Name */}
        <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img
            src="/logo-white.png"
            alt="Silk Studio"
            height={34}
            style={{ height: 34, width: 'auto' }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo-white.svg'; }}
          />
          <span style={{
            fontFamily: 'var(--font-jakarta)',
            fontSize: 17,
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.3px',
          }}>
            Silk Studio
          </span>
        </Link>

        {/* Center nav links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 36,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link-sqsp"
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                letterSpacing: '0.2px',
                transition: 'color 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right CTA */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            href="/order"
            className="hidden md:inline-flex"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '9px 24px',
              fontSize: 13,
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 600,
              color: '#0D0D0D',
              background: '#ffffff',
              borderRadius: 100,
              textDecoration: 'none',
              border: 'none',
              transition: 'transform 0.2s ease, box-shadow 0.3s ease, background 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'scale(1.04)';
              el.style.boxShadow = '0 0 24px rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'scale(1)';
              el.style.boxShadow = 'none';
            }}
          >
            Start Your Order
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}
            aria-label="Toggle menu"
          >
            <span style={{ width: 22, height: 2, background: menuOpen ? '#C6FF33' : '#fff', display: 'block', transition: 'all 0.3s cubic-bezier(0.25,1,0.5,1)', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <span style={{ width: 22, height: 2, background: menuOpen ? '#C6FF33' : '#fff', display: 'block', transition: 'all 0.3s cubic-bezier(0.25,1,0.5,1)', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 22, height: 2, background: menuOpen ? '#C6FF33' : '#fff', display: 'block', transition: 'all 0.3s cubic-bezier(0.25,1,0.5,1)', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          backgroundColor: '#0D0D0D',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
          transition: 'opacity 0.4s cubic-bezier(0.25,1,0.5,1), visibility 0.4s',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          pointerEvents: menuOpen ? 'all' : 'none',
        }}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={menuOpen ? 'mobile-menu-link' : ''}
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontSize: 28,
              fontWeight: 700,
              color: '#ffffff',
              textDecoration: 'none',
              letterSpacing: '-0.5px',
              animationDelay: menuOpen ? `${i * 60}ms` : '0ms',
              opacity: menuOpen ? undefined : 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C6FF33')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/order"
          onClick={() => setMenuOpen(false)}
          className={menuOpen ? 'mobile-menu-link' : ''}
          style={{
            marginTop: 12,
            display: 'inline-flex',
            alignItems: 'center',
            padding: '14px 36px',
            background: '#C6FF33',
            color: '#0D0D0D',
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 700,
            fontSize: 15,
            borderRadius: 100,
            textDecoration: 'none',
            animationDelay: menuOpen ? `${navLinks.length * 60}ms` : '0ms',
            opacity: menuOpen ? undefined : 0,
          }}
        >
          Start Your Order
        </Link>
      </div>
    </>
  );
}