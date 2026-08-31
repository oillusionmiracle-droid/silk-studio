'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/', icon: '/icons/home.png' },
  { label: 'Services', href: '/services', icon: '/icons/services.png' },
  { label: 'Order', href: '/order', icon: '/icons/order.png' },
  { label: 'Portfolio', href: '/portfolio', icon: '/icons/portfolio.png' },
];

export default function MobileBottomNav() {
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  
  // Detect if on apparel page for light mode
  const isApparelPage = pathname.includes('/apparel');

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

  const bgColor = isApparelPage ? 'rgba(255, 255, 255, 0.8)' : 'rgba(13, 13, 13, 0.7)';
  const borderColor = isApparelPage ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255,255,255,0.15)';

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: bgColor,
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      borderTop: `1px solid ${borderColor}`,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '12px 0 calc(12px + env(safe-area-inset-bottom, 0px))',
      zIndex: 8000,
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
    }}>
      {navItems.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s ease',
            }}
          >
            <img
              src={icon}
              alt={label}
              style={{
                width: 48,
                height: 48,
                opacity: isActive ? 1 : 0.6,
                transition: 'opacity 0.2s ease',
              }}
            />
          </Link>
        );
      })}
    </div>
  );
}
