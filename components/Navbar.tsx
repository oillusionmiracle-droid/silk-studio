'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
          backgroundColor: scrolled ? 'rgba(13, 13, 13, 0.85)' : 'transparent',
          borderBottom: scrolled ? '1px solid #2A2A2A' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
          display: 'flex',
          alignItems: 'center',
          padding: '0 40px',
        }}
      >
        {/* Logo and Studio Name Wrapper */}
        <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img 
            src="/logo-white.png" 
            alt="Silk Studio" 
            height={36} 
            style={{ height: 36, width: 'auto' }} 
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo-white.svg'; }} 
          />
          <span style={{
            fontFamily: 'var(--font-jakarta)',
            fontSize: 18,
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
            gap: 32,
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
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 14,
                fontWeight: 500,
                color: '#888888',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                letterSpacing: '0.2px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right CTA */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/order" className="btn-primary hidden md:inline-flex" style={{ padding: '10px 24px', fontSize: 14 }}>
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
            <span style={{ width: 22, height: 2, background: menuOpen ? '#C6FF33' : '#fff', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
            <span style={{ width: 22, height: 2, background: menuOpen ? '#C6FF33' : '#fff', display: 'block', transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: 22, height: 2, background: menuOpen ? '#C6FF33' : '#fff', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
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
          gap: 40,
          transition: 'opacity 0.3s ease, pointer-events 0.3s',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'all' : 'none',
        }}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontSize: 32,
              fontWeight: 700,
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              transitionDelay: `${i * 40}ms`,
              transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C6FF33')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/order" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ marginTop: 16 }}>
          Start Your Order
        </Link>
      </div>
    </>
  );
}