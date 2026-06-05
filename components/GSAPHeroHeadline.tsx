'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';

interface GSAPHeroHeadlineProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  className?: string;
  style?: React.CSSProperties;
}

export default function GSAPHeroHeadline({ children, as: Tag = 'h1', className, style }: GSAPHeroHeadlineProps) {
  const heroHeadlineRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let split: SplitType | null = null;
    let tl: gsap.core.Timeline | null = null;

    const initAnimation = () => {
      if (!heroHeadlineRef.current) return;
      
      split = new SplitType(heroHeadlineRef.current, { types: 'chars' });
      const isMobile = window.innerWidth < 768;
      const initialScale = isMobile ? 4 : 8;

      // Initial state
      gsap.set(split.chars, {
        scale: initialScale,
        opacity: 0,
        transformOrigin: 'center center'
      });

      tl = gsap.timeline({ delay: 0.2 });
      tl.to(split.chars, {
        scale: 1,
        opacity: 1,
        duration: 0.55,
        stagger: 0.04,
        ease: 'back.out(1.4)',
        transformOrigin: 'center center',
      });
    };

    // Slight delay to ensure DOM is fully ready
    const timer = setTimeout(initAnimation, 50);

    return () => {
      clearTimeout(timer);
      if (tl) tl.kill();
      if (split) split.revert();
    };
  }, []);

  return (
    <Tag ref={heroHeadlineRef as any} className={className} style={style}>
      {children}
    </Tag>
  );
}
