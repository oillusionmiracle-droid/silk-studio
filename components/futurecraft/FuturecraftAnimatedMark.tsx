'use client';

import { useLayoutEffect, useRef, type CSSProperties, type PointerEvent } from 'react';
import { gsap } from 'gsap';

type Props = {
  className?: string;
  color?: string;
  width?: number | string;
  height?: number | string;
  autoPlay?: boolean;
  hoverReplay?: boolean;
};

/**
 * Exact Futurecraft mark.svg paths, rendered inline so GSAP can animate each piece.
 * The finished state is identical to the static SVG (no shape morphing).
 */
export default function FuturecraftAnimatedMark({
  className,
  color = '#0565FF',
  width = 33,
  height = 33,
  autoPlay = true,
  hoverReplay = true,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let disabled = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      disabled ||= localStorage.getItem('futurecraft-motion') === 'reduced';
    } catch {
      // Storage restrictions should never hide the static brand mark.
    }
    disabled ||= document.documentElement.dataset.fcMotion === 'reduced';
    if (disabled) return;

    const ctx = gsap.context(() => {
      const parts = Array.from(svg.querySelectorAll<SVGPathElement>('[data-fc-piece]'));
      gsap.set(parts, { transformBox: 'fill-box', transformOrigin: '50% 50%' });
      gsap.set(svg, { transformOrigin: '50% 50%' });

      const tl = gsap.timeline({ paused: true });
      // Pieces separate from the final logo, then assemble on their exact original coordinates.
      tl.from(parts[0], { x: -110, y: -75, rotation: -12, opacity: 0, duration: 0.78, ease: 'power3.out' }, 0)
        .from(parts[1], { x: 100, y: -24, rotation: 11, opacity: 0, duration: 0.73, ease: 'power3.out' }, 0.12)
        .from(parts[2], { x: -44, y: 125, rotation: -9, opacity: 0, duration: 0.73, ease: 'power3.out' }, 0.23)
        .to(svg, { scale: 1.045, duration: 0.12, ease: 'power1.out' }, 0.79)
        .to(svg, { scale: 1, duration: 0.48, ease: 'elastic.out(1,0.65)' }, 0.91);
      timelineRef.current = tl;
      if (autoPlay) tl.play();
    }, svg);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, [autoPlay]);

  const onPointerEnter = (event: PointerEvent<SVGSVGElement>) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    if (!hoverReplay) return;
    // The timeline only exists if the visitor has enabled motion.
    timelineRef.current?.restart();
  };

  return (
    <svg
      ref={svgRef}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 860 800"
      width={width}
      height={height}
      style={{ color, display: 'block', overflow: 'visible' } as CSSProperties}
      aria-hidden="true"
      focusable="false"
      onPointerEnter={onPointerEnter}
    >
      <g fill="currentColor">
        <path data-fc-piece="top" d="M25 400 L250 199 L276 182 L300 176 L675 176 L705 161 L838 23 L278 22 L248 31 L32 209 L24 233 Z" />
        <path data-fc-piece="middle" d="M186 298 L200 325 L292 415 L313 427 L532 429 L562 414 L718 260 L277 257 L228 269 Z" />
        <path data-fc-piece="lower" d="M164 315 L145 347 L138 377 L140 601 L156 631 L285 760 L285 475 L271 451 L194 370 Z" />
      </g>
    </svg>
  );
}
