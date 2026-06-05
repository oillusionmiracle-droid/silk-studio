'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let ctx: any;

    const initScrollAnimation = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Line 1 moves slightly left-to-right as you scroll down
        gsap.fromTo(
          line1Ref.current,
          { x: -60, opacity: 0.8 },
          {
            x: 40,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom', // starts when the top of section hits bottom of screen
              end: 'bottom top',   // ends when bottom of section leaves top of screen
              scrub: 1,            // tracks the scrollbar smoothly
            },
          }
        );

        // Line 2 moves cleanly right-to-left as you scroll down
        gsap.fromTo(
          line2Ref.current,
          { x: 60, opacity: 0.8 },
          {
            x: -40,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }
        );

        // Quick fade up for the buttons when the section scrolls into view
        gsap.fromTo(
          '.cta-button-container',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      });
    };

    initScrollAnimation();
    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '140px 24px 120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto' }}>
        <p 
          style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '11px', 
            letterSpacing: '3px', 
            textTransform: 'uppercase', 
            color: 'rgba(255, 255, 255, 0.35)', 
            marginBottom: 32 
          }}
        >
          Ready to create?
        </p>

        {/* First Line - Brief us today. */}
        <h2
          ref={line1Ref}
          style={{
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 900,
            fontSize: 'clamp(44px, 7.5vw, 92px)',
            lineHeight: 0.95,
            letterSpacing: '-2px',
            color: '#ffffff',
            marginBottom: 12,
            cursor: 'default',
            userSelect: 'none',
            willChange: 'transform',
          }}
        >
          Brief us today.
        </h2>

        {/* Second Line - Collect fast! */}
        <h2
          ref={line2Ref}
          style={{
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 900,
            fontSize: 'clamp(44px, 7.5vw, 92px)',
            lineHeight: 0.95,
            letterSpacing: '-2px',
            color: '#C6FF33',
            marginBottom: 56,
            cursor: 'default',
            userSelect: 'none',
            willChange: 'transform',
          }}
        >
          Collect fast!
        </h2>

        {/* Action Buttons Container with Pill Shapes */}
        <div 
          className="cta-button-container"
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link 
            href="/order" 
            className="btn-primary" 
            style={{ 
              padding: '16px 36px', 
              fontSize: '16px',
              borderRadius: '9999px', // Fully rounded pill shape to match layout
            }}
          >
            Start Your Order →
          </Link>
          <a
            href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I%27d+like+to+place+an+order"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ 
              padding: '16px 36px', 
              fontSize: '16px',
              borderRadius: '9999px', // Fully rounded pill shape to match layout
            }}
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}