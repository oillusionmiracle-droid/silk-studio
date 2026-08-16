'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

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
            src="/logo-white.svg"
            alt="Silk Studio"
            height={34}
            style={{ height: 34, width: 'auto', display: 'block', flexShrink: 0 }}
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
              padding: '10px 28px',
              fontSize: 13,
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 700,
              color: '#0D0D0D',
              background: 'linear-gradient(180deg, #D4FF4D 0%, #C6FF33 100%)',
              borderRadius: 100,
              textDecoration: 'none',
              border: 'none',
              transition: 'transform 0.2s ease, box-shadow 0.3s ease, background 0.2s ease',
              whiteSpace: 'nowrap',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'scale(1.05)';
              el.style.boxShadow = '0 8px 32px rgba(198,255,51,0.4)';
              el.style.background = 'linear-gradient(180deg, #E5FF80 0%, #D4FF4D 100%)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'scale(1)';
              el.style.boxShadow = 'none';
              el.style.background = 'linear-gradient(180deg, #D4FF4D 0%, #C6FF33 100%)';
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
            <span style={{ width: 22, height: 2, background: menuOpen ? '#C6FF33' : '#fff', display: 'block', transition: 'transform 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6)', transform: menuOpen ? 'translateY(3.5px) rotate(45deg)' : 'none' }} />
            <span style={{ width: 22, height: 2, background: menuOpen ? '#C6FF33' : '#fff', display: 'block', transition: 'transform 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6)', transform: menuOpen ? 'translateY(-3.5px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile glassmorphism drop-down menu */}
      <div
        style={{
          position: 'fixed',
          top: 80,
          right: 'clamp(20px, 5vw, 48px)',
          width: 'calc(100% - 40px)',
          maxWidth: 320,
          zIndex: 999,
          backgroundColor: 'rgba(20, 20, 20, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 32,
          padding: '32px 24px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          transition: 'all 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6)',
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          transform: menuOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-30px)',
          transformOrigin: 'top right',
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
              fontSize: 22,
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
            marginTop: 8,
            display: 'inline-flex',
            alignItems: 'center',
            padding: '12px 32px',
            background: 'linear-gradient(180deg, #D4FF4D 0%, #C6FF33 100%)',
            color: '#0D0D0D',
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 700,
            fontSize: 15,
            borderRadius: 100,
            textDecoration: 'none',
            animationDelay: menuOpen ? `${navLinks.length * 60}ms` : '0ms',
            opacity: menuOpen ? undefined : 0,
            letterSpacing: '0.3px',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = '0 8px 32px rgba(198,255,51,0.4)';
            el.style.background = 'linear-gradient(180deg, #E5FF80 0%, #D4FF4D 100%)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = 'none';
            el.style.background = 'linear-gradient(180deg, #D4FF4D 0%, #C6FF33 100%)';
          }}
        >
          Start Your Order
        </Link>

        {/* Social Links */}
        <div style={{
          display: 'flex',
          gap: 24,
          marginTop: 16,
          paddingBottom: 0,
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 0.4s',
          transitionDelay: menuOpen ? '0.3s' : '0s'
        }}>
          {[
            { name: 'Instagram', url: 'https://instagram.com/thesilkstudiong', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
            { name: 'TikTok', url: 'https://tiktok.com/@thesilkstudiong', icon: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
            { name: 'Facebook', url: 'https://facebook.com/thesilkstudiong', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' }
          ].map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#fff',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C6FF33')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d={social.icon} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}