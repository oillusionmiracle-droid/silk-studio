'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GSAPTitleProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  className?: string;
  style?: React.CSSProperties;
}

export default function GSAPTitle({ children, as: Tag = 'h2', className, style }: GSAPTitleProps) {
  const headlineRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!headlineRef.current) return;

    const isMobile = window.innerWidth < 768;
    const initialScale = isMobile ? 1.3 : 1.8;
    
    // Set initial state for the from() animation to avoid flash
    gsap.set(headlineRef.current, {
      scale: initialScale,
      opacity: 0,
      filter: 'blur(8px)'
    });

    const animation = gsap.to(headlineRef.current, {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: headlineRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    return () => {
      if (animation.scrollTrigger) {
        animation.scrollTrigger.kill();
      }
      animation.kill();
      ScrollTrigger.getAll().forEach(t => t.kill()); // As requested by user
    };
  }, []);

  return (
    <Tag ref={headlineRef as any} className={className} style={style}>
      {children}
    </Tag>
  );
}
