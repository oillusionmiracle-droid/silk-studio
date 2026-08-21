'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Home, LayoutGrid, ShoppingBag, Layers } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '/', Icon: Home },
  { label: 'Services', href: '/services', Icon: LayoutGrid },
  { label: 'Order', href: '/order', Icon: ShoppingBag },
  { label: 'Portfolio', href: '/portfolio', Icon: Layers },
];

export default function MobileBottomNav() {
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current + 10) {
        // Scrolling down
        setVisible(false);
      } else if (currentY < lastScrollY.current - 5) {
        // Scrolling up
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!isMobile) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'rgba(13, 13, 13, 0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '10px 0 calc(10px + env(safe-area-inset-bottom, 0px))',
      zIndex: 8000, // Below WhatsApp (9000) and AI chat (9999)
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
    }}>
      {navItems.map(({ label, href, Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '4px 16px',
              gap: 4,
            }}
          >
            <Icon size={20} color={isActive ? '#C6FF33' : 'rgba(255,255,255,0.5)'} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{
              fontFamily: 'var(--font-jakarta)',
              fontSize: 10,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#C6FF33' : 'rgba(255,255,255,0.5)',
            }}>
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
