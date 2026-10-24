'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
export default function StudioMotion() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const context = gsap.context(() => {
      document.querySelectorAll('.studio-page h1, .studio-page h2, .moremi-new h1, .moremi-new h2, .order-intro h1').forEach(el => {
        if (el.closest('.silk-review-hero')) return;
        SplitText.create(el as HTMLElement, { type: 'words', autoSplit: true, onSplit(self) {
          return gsap.from(self.words, { yPercent: 90, rotationX: -45, opacity: 0, duration: .85, stagger: .055, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
        }});
      });
    });
    return () => context.revert();
  }, [path]);
  return null;
}
