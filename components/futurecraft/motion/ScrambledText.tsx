'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

// Cursor-distance interaction inspired by Tom Miller's GSAP community example:
// https://codepen.io/creativeocean/pen/NPWLwJM
type Props = {
  children: string;
  className?: string;
  effect?: 'scramble';
  radius?: number;
  strength?: number;
  trail?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  clickBurst?: boolean;
  intro?: boolean;
};

export default function ScrambledText({ children, className = '', radius = 100, strength = 1, trail = .6, duration = 1.2, speed = .5, scrambleChars = '.:', clickBurst = true, intro = true }: Props) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    try { if(localStorage.getItem('futurecraft-motion')==='reduced') return; } catch {}
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrambleTextPlugin);
    let disposed = false;
    const media = gsap.matchMedia();
    void document.fonts.ready.then(() => {
      if (disposed) return;
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const chars = Array.from(element.querySelectorAll<HTMLElement>('.scramble-char'));
        const originals = chars.map(char => char.textContent || '');
        const lastRun = chars.map(() => 0);
        const measure = () => {
          chars.forEach((char, i) => { gsap.killTweensOf(char); char.textContent = originals[i]; char.style.width = ''; });
          const widths = chars.map(char => char.getBoundingClientRect().width);
          chars.forEach((char, i) => { char.style.width = `${widths[i]}px`; });
        };
        measure();
        const scramble = (index: number, distance: number, delay = 0) => {
          gsap.to(chars[index], {
            duration: duration * (.5 + .5 * Math.max(0, 1 - distance / radius)) * strength,
            delay, overwrite: true, ease: 'none',
            scrambleText: { text: originals[index], chars: scrambleChars, speed, revealDelay: trail * .15 },
          });
        };
        const move = (event: PointerEvent) => {
          const now = performance.now();
          chars.forEach((char, index) => {
            const rect = char.getBoundingClientRect();
            const distance = Math.hypot(event.clientX - rect.left - rect.width / 2, event.clientY - rect.top - rect.height / 2);
            if (distance < radius && now - lastRun[index] > 160) { lastRun[index] = now; scramble(index, distance); }
          });
        };
        const burst = () => chars.forEach((_, index) => scramble(index, 0, index * .012));
        if (intro) chars.forEach((_, index) => scramble(index, 0, index * .015));
        element.addEventListener('pointermove', move, { passive: true });
        if (clickBurst) element.addEventListener('pointerdown', burst);
        window.addEventListener('resize', measure, { passive: true });
        return () => {
          element.removeEventListener('pointermove', move);
          element.removeEventListener('pointerdown', burst);
          window.removeEventListener('resize', measure);
          gsap.killTweensOf(chars);
          chars.forEach((char, index) => { char.textContent = originals[index]; char.style.width = ''; });
        };
      });
    });
    return () => { disposed = true; media.revert(); };
  }, [children, radius, strength, trail, duration, speed, scrambleChars, clickBurst, intro]);

  return <span ref={root} className={`scrambled-text ${className}`}>
    <span className="fc-sr-only">{children}</span>
    <span aria-hidden="true">{children.split(/(\s+)/).map((word, index) => /^\s+$/.test(word)
      ? <span key={index}>{word}</span>
      : <span className="scramble-word" key={index}>{Array.from(word).map((char, j) => <span className="scramble-char" key={j}>{char}</span>)}</span>)}</span>
  </span>;
}
