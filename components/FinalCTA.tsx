'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/*
  ── WAVING HAND PNG ──
  📁 FILE: publichttps://res.cloudinary.com/dagqxe3fh/image/upload/silk-studio/images/waving-hand.png
  Drop your PNG there. Recommended size: 80–100px, transparent background.
  The component references it via <img src="https://res.cloudinary.com/dagqxe3fh/image/upload/silk-studio/images/waving-hand.png" ... />
  The waving animation is CSS keyframes — it works on any <img> or emoji.
*/

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const decoLineRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let ctx: any;

    const init = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {

        /* ── Slot-machine char drop — no SplitText license needed ── */
        const animateSlot = (container: HTMLElement | null, delayOffset = 0) => {
          if (!container) return;
          const chars = Array.from(container.querySelectorAll<HTMLElement>('.slot-char'));
          gsap.fromTo(
            chars,
            { yPercent: -500, opacity: 0 },
            {
              yPercent: 0, opacity: 1,
              duration: 0.6, ease: 'power4.out',
              stagger: { each: 0.05, from: 'start' },
              delay: delayOffset,
              scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
            }
          );
        };

        /* ── Plain fade — used on mobile instead of the per-character split,
           since splitting into individual letters is what caused the
           headline to wrap mid-word on narrow screens ── */
        const animateFade = (el: HTMLElement | null, delayOffset = 0) => {
          if (!el) return;
          gsap.fromTo(
            el,
            { y: 24, opacity: 0 },
            {
              y: 0, opacity: 1,
              duration: 0.7, ease: 'power3.out',
              delay: delayOffset,
              scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
            }
          );
        };

        if (isMobile) {
          animateFade(line1Ref.current, 0);
          animateFade(line2Ref.current, 0.1);
        } else {
          animateSlot(line1Ref.current, 0);
          animateSlot(line2Ref.current, 0.15);
        }

        /* Decorative Line Expand */
        if (decoLineRef.current) {
          gsap.fromTo(decoLineRef.current,
            { scaleX: 0 },
            {
              scaleX: 1, duration: 0.8, ease: 'power3.out', delay: 0.4,
              scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true }
            }
          );
        }

        /* Buttons fade up */
        gsap.fromTo('.cta-button-container',
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 76%', once: true } }
        );

        /* Hand entrance */
        gsap.fromTo('.cta-hand-wrap',
          { opacity: 0, y: 16, scale: 0.85 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9, delay: 0.1, ease: 'back.out(1.5)', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
        );
      });
    };

    init();
    return () => ctx?.revert();
  }, [isMobile]);

  /* Helper: wrap each char in a span for slot-machine anim (desktop only —
     on mobile we render plain text so words can wrap normally) */
  const slotChars = (text: string) =>
    text.split('').map((ch, i) => (
      <span
        key={i}
        className="slot-char"
        style={{ display: 'inline-block', overflow: 'hidden', whiteSpace: ch === ' ' ? 'pre' : 'normal' }}
      >
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ));

  const fontSans = 'var(--font-jakarta, "Plus Jakarta Sans", "DM Sans", sans-serif)';
  const accent = '#C6FF33';

  return (
    <>
      {/* CSS keyframe for waving hand */}
      <style>{`
        @keyframes wave {
          0%   { transform: rotate(0deg); }
          15%  { transform: rotate(18deg); }
          30%  { transform: rotate(-8deg); }
          45%  { transform: rotate(16deg); }
          60%  { transform: rotate(-4deg); }
          75%  { transform: rotate(10deg); }
          100% { transform: rotate(0deg); }
        }
        .waving-hand {
          display: inline-block;
          transform-origin: 70% 80%;
          animation: wave 2.2s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{
          padding: 'clamp(120px, 20vw, 200px) 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0D0D0D',
        }}
      >
        {/* ── Ambient background — same footage as the hero, heavily dimmed so it reads
            as texture, not a competing visual. This ties the closing CTA back to the
            hero visually. Tune the video opacity / gradient stops below if you want it
            more or less present — 0.32 + this gradient keeps large white text legible. ── */}
        <video
          autoPlay muted loop playsInline
          className="hero-bg-video"
          poster="https://res.cloudinary.com/dagqxe3fh/image/upload/silk-studio/images/hero-bg.jpg"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
            opacity: 0.32,
          }}
        >
          <source src="https://res.cloudinary.com/dagqxe3fh/video/upload/silk-studio/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'linear-gradient(180deg, rgba(13,13,13,0.86) 0%, rgba(13,13,13,0.9) 45%, #0D0D0D 100%)',
        }} />

        {/* Ambient warm white glow */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800, height: 600,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 68%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* Ambient lime glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900, height: 900,
          background: 'radial-gradient(ellipse, rgba(198,255,51,0.06) 0%, transparent 68%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1000, margin: '0 auto' }}>

          {/* ── Decorative Line ── */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div
              ref={decoLineRef}
              style={{
                width: 60,
                height: 1,
                background: accent,
                transformOrigin: 'center',
              }}
            />
          </div>

          {/* ── Waving Hand ── */}
          <div className="cta-hand-wrap" style={{ marginBottom: 'clamp(24px, 5vw, 40px)', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <img
              src="https://res.cloudinary.com/dagqxe3fh/image/upload/silk-studio/images/waving-hand.png"
              alt=""
              aria-hidden
              className="waving-hand"
              style={{ width: 'clamp(64px, 10vw, 90px)', height: 'auto', display: 'block' }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {/* ── Headline line 1 ── */}
          <div
            ref={line1Ref}
            style={{
              fontFamily: fontSans, fontWeight: 800,
              fontSize: 'clamp(36px, 7vw, 86px)',
              lineHeight: 1.08, letterSpacing: '-0.03em',
              color: '#fff', userSelect: 'none', willChange: 'transform',
              marginBottom: 'clamp(2px, 1vw, 6px)',
              overflow: isMobile ? 'visible' : 'hidden',
            }}
          >
            {isMobile ? 'Ready to stand out?' : slotChars('Ready to stand out?')}
          </div>

          {/* ── Headline line 2 ── */}
          <div
            ref={line2Ref}
            style={{
              fontFamily: fontSans, fontWeight: 800,
              fontSize: 'clamp(36px, 7vw, 86px)',
              lineHeight: 1.08, letterSpacing: '-0.03em',
              color: '#fff', userSelect: 'none', willChange: 'transform',
              marginBottom: 'clamp(48px, 9vw, 72px)',
              overflow: isMobile ? 'visible' : 'hidden',
            }}
          >
            {isMobile ? "Let's work together!" : slotChars("Let's work together!")}
          </div>

          {/* ── CTA Buttons ── */}
          <div
            className="cta-button-container"
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {/* Primary: lime green pill */}
            <a
              href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I%27d+like+to+enquire"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: 'clamp(16px, 3vw, 20px) clamp(32px, 5vw, 48px)',
                background: accent, borderRadius: 100,
                fontFamily: fontSans, fontWeight: 700,
                fontSize: 'clamp(15px, 2.5vw, 17px)',
                color: '#0D0D0D', textDecoration: 'none',
                letterSpacing: '-0.01em',
                boxShadow: '0 0 30px rgba(198,255,51,0.2)',
                transition: 'transform 0.25s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'scale(1.03)';
                el.style.boxShadow = '0 0 48px rgba(198,255,51,0.4)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'scale(1)';
                el.style.boxShadow = '0 0 30px rgba(198,255,51,0.2)';
              }}
            >
              Contact us
            </a>

            {/* Secondary: ghost pill */}
            <Link
              href="/order"
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: 'clamp(16px, 3vw, 20px) clamp(32px, 5vw, 48px)',
                background: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.2)',
                borderRadius: 100,
                fontFamily: fontSans, fontWeight: 600,
                fontSize: 'clamp(15px, 2.5vw, 17px)',
                color: '#ffffff', textDecoration: 'none',
                letterSpacing: '-0.01em',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.25s ease, background 0.25s ease, border-color 0.25s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'scale(1.03)';
                el.style.borderColor = '#C6FF33';
                el.style.background = 'rgba(198,255,51,0.06)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'scale(1)';
                el.style.borderColor = 'rgba(255,255,255,0.2)';
                el.style.background = 'transparent';
              }}
            >
              Start Your Order →
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}