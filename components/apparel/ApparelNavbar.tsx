'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import { useWishlist } from '@/lib/WishlistContext';
import AccountMenu from '@/components/auth/AccountMenu';

/* ─────────────────────────────────────────
   Apparel-Only Navbar
   White background, non-sticky, Ashluxe aesthetic.
   2-bar menu icon + slide-out navigation drawer.
───────────────────────────────────────── */

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Apparel', href: '/apparel' },
  { label: 'Order', href: '/order' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function ApparelNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { setIsOpen: setWishlistOpen } = useWishlist();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="apparel-navbar" role="navigation" aria-label="Apparel navigation">
        {/* Left: 2-line Hamburger Menu icon */}
        <div className="apparel-navbar__left">
          <button
            className="apparel-navbar__icon-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ padding: '8px 6px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 22 }}>
              <span
                style={{
                  width: 22,
                  height: 1.75,
                  backgroundColor: '#000000',
                  display: 'block',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: menuOpen ? 'translateY(4px) rotate(45deg)' : 'none',
                }}
              />
              <span
                style={{
                  width: 22,
                  height: 1.75,
                  backgroundColor: '#000000',
                  display: 'block',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: menuOpen ? 'translateY(-3.75px) rotate(-45deg)' : 'none',
                }}
              />
            </div>
          </button>

          <button
            className="apparel-navbar__icon-btn"
            aria-label="Search products"
            style={{ display: 'none' }}
          >
            <Search size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Center: Logo */}
        <div className="apparel-navbar__center">
          <Link href="/apparel" aria-label="Silk Studio Apparel — Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/apparel-logo.svg"
              alt="Silk Studio"
              className="apparel-navbar__logo"
              draggable={false}
            />
          </Link>
        </div>

        {/* Right: Search (desktop), Wishlist, Cart */}
        <div className="apparel-navbar__right flex items-center gap-2">
          <AccountMenu />

          <button
            className="apparel-navbar__icon-btn"
            aria-label="View wishlist"
            onClick={() => setWishlistOpen(true)}
          >
            <Heart size={20} strokeWidth={1.5} />
          </button>

          <button
            className="apparel-navbar__icon-btn"
            aria-label={`Shopping bag${totalItems > 0 ? `, ${totalItems} items` : ''}`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="apparel-navbar__badge" aria-hidden="true">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ─── Ashluxe-styled Slide-Out Navigation Drawer ─── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex: 2000,
              }}
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '100%',
                maxWidth: 380,
                backgroundColor: '#ffffff',
                zIndex: 2001,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px 32px 36px',
                boxShadow: '10px 0 40px rgba(0, 0, 0, 0.12)',
                fontFamily: 'var(--font-apparel)',
              }}
            >
              {/* Drawer Header */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 24,
                    borderBottom: '1px solid #f0f0f0',
                    marginBottom: 32,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/apparel-logo.svg"
                      alt="Silk Studio"
                      style={{ height: 22, width: 'auto' }}
                    />
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 6,
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={22} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Nav Links */}
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {navLinks.map((link, idx) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        fontFamily: 'var(--font-apparel)',
                        fontSize: 20,
                        fontWeight: 600,
                        color: link.href === '/apparel' ? '#000000' : '#444444',
                        textDecoration: 'none',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 0',
                        transition: 'color 0.15s ease, transform 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = '#000000';
                        (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          link.href === '/apparel' ? '#000000' : '#444444';
                        (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                      }}
                    >
                      <span>{link.label}</span>
                      {link.href === '/apparel' && (
                        <span
                          style={{
                            fontSize: 10,
                            letterSpacing: '1px',
                            fontWeight: 700,
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            padding: '3px 8px',
                            borderRadius: 100,
                          }}
                        >
                          STORE
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div
                style={{
                  paddingTop: 24,
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <Link
                  href="/order"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '14px',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontFamily: 'var(--font-apparel)',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#333333';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#000000';
                  }}
                >
                  Start Custom Order
                </Link>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    color: '#888888',
                  }}
                >
                  <span>Lagos, Nigeria</span>
                  <a
                    href="mailto:thesilkstudiong@gmail.com"
                    style={{ color: '#888888', textDecoration: 'none' }}
                  >
                    thesilkstudiong@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
