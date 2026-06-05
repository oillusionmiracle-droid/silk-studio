'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '@/components/ScrollReveal';
import FinalCTA from '@/components/FinalCTA';
import GSAPHeroHeadline from '@/components/GSAPHeroHeadline';
import GSAPTitle from '@/components/GSAPTitle';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────
   SECTION DATA
───────────────────────────────────────── */

const clientLogos = [1, 2, 3, 4, 5, 6, 7];

const testimonials = [
  {
    text: "Capturing a brand's essence in a single mark is no easy feat, but Silk Studio exceeded our expectations.",
    author: 'Brand client',
  },
  {
    text: 'The print quality is exceptional. Vibrant, perfectly aligned, consistent every time.',
    author: 'Marketing client',
  },
  {
    text: 'Quick turnaround on emergency edits. Real life savers. Silk Studio always stays on top 🙌',
    author: 'Event client',
  },
  {
    text: 'We came with a vague concept and got a high-fidelity reality. Exceptional skill level.',
    author: 'Startup client',
  },
];

const services = [
  {
    num: '01.',
    tag: 'PRINT',
    title: 'Print Production',
    body: 'Flyers, banners, billboards, jotters, ID cards — produced fast through our Lagos-wide production network.',
    price: 'From ₦4,500',
    image: '/images/services/print-bg.jpg', 
  },
  {
    num: '02.',
    tag: 'DESIGN',
    title: 'Design & Branding',
    body: 'Logos, event kits, social templates, print-ready artwork. We make your brand look like it means business.',
    price: 'From ₦50,000',
    image: '/images/services/design-bg.jpg',
  },
  {
    num: '03.',
    tag: 'DIGITAL',
    title: 'Web & Digital',
    body: 'Landing pages, business websites, event pages. Fast, mobile-first, built to convert.',
    price: 'From ₦80,000',
    image: '/images/services/web-bg.jpg',
  },
];

const steps = [
  {
    icon: '/icons/brief.svg',
    num: '01',
    title: 'Send Your Brief',
    body: 'Tell us what you need — service, size, deadline.',
  },
  {
    icon: '/icons/proof.svg',
    num: '02',
    title: 'We Design & Proof',
    body: 'You approve the artwork before anything goes to print.',
  },
  {
    icon: '/icons/deliver.svg',
    num: '03',
    title: 'Print & Deliver',
    body: 'We handle production and get it to you on time.',
  },
];

const pillTags = ['Invite Design + Print', 'Event Banner', '10 Custom Shirts'];

function CyclingWord({
  words,
  color = '#ffffff',
  delayStart = 0,
}: {
  words: string[];
  color?: string;
  delayStart?: number;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'hold' | 'exit' | 'enter'>('hold');
  const started = useRef(false);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fixedWidth, setFixedWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!measureRef.current) return;
    const el = measureRef.current;
    let maxW = 0;
    const original = el.textContent;
    for (const w of words) {
      el.textContent = w;
      maxW = Math.max(maxW, el.getBoundingClientRect().width);
    }
    el.textContent = original;
    setFixedWidth(Math.ceil(maxW) + 4);
  }, [words]);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      started.current = true;
      const cycle = () => {
        setPhase('exit');
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % words.length);
          setPhase('enter');
          setTimeout(() => {
            setPhase('hold');
          }, 350);
        }, 350);
      };
      const interval = setInterval(cycle, 2200 + 350 + 350);
      return () => clearInterval(interval);
    }, delayStart);
    return () => clearTimeout(startDelay);
  }, [words, delayStart]);

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          font: 'inherit',
        }}
      >
        {words[0]}
      </span>
      <span
        style={{
          display: 'inline-flex',
          overflow: 'hidden',
          verticalAlign: 'bottom',
          width: fixedWidth ? fixedWidth : 'auto',
          justifyContent: 'center',
        }}
      >
        <motion.span
          key={index}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{
            y: { duration: 0.35, ease: phase === 'exit' ? 'easeIn' : 'easeOut' },
            opacity: { duration: 0.35 },
          }}
          style={{
            display: 'inline-block',
            color,
            whiteSpace: 'nowrap',
          }}
        >
          {words[index]}
        </motion.span>
      </span>
    </>
  );
}

function KineticHeadline() {
  return (
    <>
      <span style={{ color: '#ffffff' }}>Design that</span>
      <br />
      <CyclingWord words={['moves.', 'speaks.', 'lands.', 'hits.']} color="#C6FF33" delayStart={1200} />
      <br />
      <span style={{ color: '#ffffff' }}>Print that</span>
      <br />
      <CyclingWord words={['delivers.', 'endures.', 'impresses.', 'converts.']} color="#ffffff" delayStart={2700} />
    </>
  );
}

/* ─────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────── */

function HeroSection({ loaded }: { loaded: boolean }) {
  const heroRef = useRef<HTMLElement>(null);
  const animStyle = (delay: number): React.CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
  });

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      <video
        autoPlay muted loop playsInline preload="auto"
        poster="/images/hero/hero-bg.jpg"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', objectFit: 'cover', zIndex: 0 }}
      >
        <source src="/images/hero/hero-bg.mp4" type="video/mp4" />
        <source src="/images/hero/hero-bg.webm" type="video/webm" />
      </video>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.65) 100%)' }} />
      <div style={{ maxWidth: 700, width: '100%', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={animStyle(200)}>
          <p className="label-mono" style={{ marginBottom: 24 }}>Design · Print · Digital</p>
        </div>
        <div style={animStyle(350)}>
          <GSAPHeroHeadline as="h1" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: 'clamp(48px, 7vw, 92px)', lineHeight: 0.95, letterSpacing: '-2px', color: '#ffffff', marginBottom: 28 }}>
            <KineticHeadline />
          </GSAPHeroHeadline>
        </div>
        <div style={animStyle(500)}>
          <p style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#888888', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 40px' }}>
            One brief. One contact. Everything printed, designed, and live — fast.
          </p>
        </div>
        <div style={{ ...animStyle(650), display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/order" className="btn-primary">Start Your Order →</Link>
          <Link href="/portfolio" className="btn-ghost">Check us out</Link>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 2, ...animStyle(900) }}>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, transparent, #2A2A2A)', animation: 'scrollHint 1.8s ease-in-out infinite' }} />
        <p className="label-mono" style={{ fontSize: 9 }}>scroll</p>
      </div>
    </section>
  );
}

function ClientLogosStrip() {
  return (
    <section style={{ backgroundColor: 'transparent', borderTop: '1px solid #2A2A2A', borderBottom: '1px solid #2A2A2A', padding: '32px 0' }}>
      <p className="label-mono" style={{ textAlign: 'center', color: '#555555', marginBottom: 24 }}>Trusted By</p>
      <div className="marquee-outer">
        <div className="marquee-track">
          {[...clientLogos, ...clientLogos].map((n, i) => (
            <div key={i} style={{ padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img
                src={`/images/clients/client-logo-${n}.png`}
                alt={`Client ${n}`}
                style={{ height: 32, objectFit: 'contain', opacity: 0.5, transition: 'opacity 0.2s ease', maxWidth: 120 }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProofStrip() {
  return (
    <section style={{ backgroundColor: 'transparent', borderBottom: '1px solid #2A2A2A', padding: '20px 0', overflow: 'hidden' }}>
      <div className="marquee-outer">
        <div className="marquee-track-slow">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '0 32px', flexShrink: 0, whiteSpace: 'nowrap' }}>
              <p style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: '#ffffff' }}>
                &ldquo;{t.text}&rdquo; <span style={{ color: '#888888' }}>— {t.author}</span>
              </p>
              <span style={{ color: '#C6FF33', fontSize: 16, flexShrink: 0 }}>✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SERVICES SECTION
───────────────────────────────────────── */

function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".unfold-3d", 
        { rotationY: -80, rotationX: 35, opacity: 0, scale: 0.75 },
        {
          rotationY: 0, rotationX: 0, opacity: 1, scale: 1,
          transformPerspective: 1000,
          transformOrigin: "center top",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom", 
            end: "top 25%",     
            scrub: 1            
          }
        }
      );

      gsap.fromTo(bgVideoRef.current,
        { scale: 1.2, opacity: 0.15 },
        {
          scale: 1.0,
          opacity: 0.45,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      style={{ 
        padding: '140px 24px 120px', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: 'transparent' 
      }}
    >
      <video
        ref={bgVideoRef}
        autoPlay muted loop playsInline preload="auto"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <source src="/images/bg/services-bg.webm" type="video/webm" />
        <source src="/images/bg/services-bg.mp4" type="video/mp4" />
      </video>

      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.4) 95%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1150, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <ScrollReveal>
            <p className="label-mono" style={{ marginBottom: 20, letterSpacing: '2px', color: '#888888' }}>Our Services</p>
          </ScrollReveal>
          
          <GSAPTitle as="h2" className="unfold-3d" style={{ 
            fontFamily: 'var(--font-jakarta)', 
            fontWeight: 800, 
            fontSize: 'clamp(36px, 5.5vw, 64px)', 
            color: '#ffffff', 
            lineHeight: 1.1,
            maxWidth: 850,
            margin: '0 auto',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden'
          }}>
            Everything your brand needs to show up right.
          </GSAPTitle>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 32, 
          marginBottom: 64 
        }}>
          {services.map((svc) => (
            <ServiceCard key={svc.tag} {...svc} />
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/services" className="btn-ghost">View All Services →</Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ num, tag, title, body, price, image }: { num: string; tag: string; title: string; body: string; price: string; image: string }) {
  const [hovered, setHovered] = useState(false);
  const isPrint = tag === 'PRINT';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        position: 'relative',
        borderRadius: '8px', 
        overflow: 'hidden',
        cursor: 'pointer', 
        aspectRatio: '4/5', 
        border: `1px solid ${hovered ? '#C6FF33' : isPrint ? 'rgba(198,255,51,0.35)' : '#1A1A1A'}`,
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.7)' : 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: hovered ? 'scale(1.08)' : 'scale(1)', 
          transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: hovered 
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.95) 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.9) 100%)',
          transition: 'background 0.4s ease',
        }}
      />

      <div style={{
        position: 'relative',
        zIndex: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 32px',
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: '#ffffff', opacity: 0.9 }}>
            {num}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1.5px',
            color: '#C6FF33',
            border: '1px solid rgba(198,255,51,0.3)',
            padding: '4px 10px',
            borderRadius: '4px',
            backgroundColor: 'rgba(0,0,0,0.4)'
          }}>
            {tag}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: '26px', color: '#ffffff', lineHeight: 1.2, margin: 0 }}>
            {title}
          </h3>
          
          <p style={{ 
            fontFamily: 'var(--font-general)', 
            fontSize: '15px', 
            color: '#CCCCCC', 
            lineHeight: 1.6,
            margin: 0,
            opacity: hovered ? 1 : 0.85,
            transition: 'opacity 0.3s ease'
          }}>
            {body}
          </p>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 600, color: '#C6FF33', marginTop: '8px', display: 'inline-block' }}>
            {price}
          </span>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   HOW IT WORKS 
───────────────────────────────────────── */

function HowItWorksSection() {
  const processRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const earthquakeTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".earthquake-text",
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
      for (let i = 0; i < 8; i++) {
        const intensity = 12 * (1 - i / 8);
        earthquakeTimeline.to(".earthquake-text", {
          x: gsap.utils.random(-intensity, intensity),
          y: gsap.utils.random(-intensity * 0.5, intensity * 0.5),
          rotation: gsap.utils.random(-3, 3),
          duration: 0.05
        });
      }
      earthquakeTimeline.to(".earthquake-text", { x: 0, y: 0, rotation: 0, duration: 0.3 });
    }, processRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={processRef} style={{ backgroundColor: 'transparent', borderTop: '1px solid #2A2A2A', borderBottom: '1px solid #2A2A2A', padding: '100px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <ScrollReveal style={{ display: 'block', marginBottom: 16 }}>
            <p className="label-mono">The Process</p>
          </ScrollReveal>
          <GSAPTitle as="h2" className="earthquake-text" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 48px)', color: '#ffffff', lineHeight: 1.15, display: 'inline-block' }}>
            Simple. Fast. Done.
          </GSAPTitle>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0, position: 'relative' }}>
          {steps.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 150}>
              <StepCard {...step} isLast={i === steps.length - 1} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ icon, num, title, body, isLast }: { icon: string; num: string; title: string; body: string; isLast: boolean }) {
  return (
    <div style={{ padding: '32px', borderRight: isLast ? 'none' : '1px dashed #2A2A2A', position: 'relative' }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#C6FF33', marginBottom: 24 }} />
      <img src={icon} alt={title} width={36} height={36} style={{ marginBottom: 20, filter: 'brightness(0) invert(1)', opacity: 0.6 }} />
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#C6FF33', letterSpacing: 3, marginBottom: 12 }}>{num}</p>
      <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 20, color: '#ffffff', marginBottom: 12 }}>{title}</h3>
      <p style={{ fontFamily: 'var(--font-general)', fontSize: 15, color: '#888888', lineHeight: 1.7 }}>{body}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   PORTFOLIO SECTION
───────────────────────────────────────── */

function PortfolioSection() {
  return (
    <section style={{ padding: '100px 24px', backgroundColor: 'transparent' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <ScrollReveal style={{ marginBottom: 48 }}>
          <p className="label-mono" style={{ marginBottom: 16 }}>Selected Work</p>
          <GSAPTitle as="h2" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 48px)', color: '#ffffff', lineHeight: 1.15 }}>
            Made with intent.
          </GSAPTitle>
        </ScrollReveal>
        <ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: 16, marginBottom: 48 }} className="portfolio-grid">
            <PortfolioCard src="/images/portfolio/work-1.mp4" tag="Branding" height={500} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PortfolioCard src="/images/portfolio/work-2.jpg" tag="Print" height={240} />
              <PortfolioCard src="/images/portfolio/work-3.mp4" tag="Digital" height={240} />
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal style={{ textAlign: 'center' }}>
          <Link href="/portfolio" className="btn-ghost">View Full Portfolio →</Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

function PortfolioCard({ src, tag, height }: { src: string; tag: string; height: number }) {
  const [hovered, setHovered] = useState(false);
  const isVideo = src.toLowerCase().endsWith('.mp4');

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        borderRadius: 4, 
        border: '1px solid #2A2A2A', 
        cursor: 'pointer', 
        height, 
        backgroundColor: 'rgba(13,13,13,0.6)' 
      }}
    >
      {isVideo ? (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease',
            transform: hovered ? 'scale(1.04)' : 'scale(1)'
          }}
        />
      ) : (
        <img 
          src={src} 
          alt={tag} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            display: 'block', 
            transition: 'transform 0.4s ease', 
            transform: hovered ? 'scale(1.04)' : 'scale(1)' 
          }} 
        />
      )}

      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        opacity: hovered ? 1 : 0, 
        transition: 'opacity 0.3s ease', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        padding: 20,
        zIndex: 1
      }}>
        <p className="label-mono" style={{ color: '#C6FF33' }}>{tag}</p>
        <div style={{ alignSelf: 'flex-end' }}>
          <span style={{ width: 36, height: 36, border: '1px solid #ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: 18 }}>→</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EVENT BUNDLE SECTION
───────────────────────────────────────── */

function EventBundleSection() {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <section style={{ backgroundColor: 'transparent', borderTop: '1px solid #2A2A2A', borderBottom: '1px solid #2A2A2A', padding: '80px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 360px' }}>
          <ScrollReveal>
            <p className="label-mono" style={{ color: '#C6FF33', marginBottom: 20 }}>Most Popular</p>
            <GSAPTitle as="h2" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 'clamp(36px, 4vw, 56px)', color: '#ffffff', lineHeight: 1.1, marginBottom: 20 }}>
              The Event Package.
            </GSAPTitle>
            <p style={{ fontFamily: 'var(--font-general)', fontSize: 17, color: '#888888', lineHeight: 1.75, marginBottom: 24, maxWidth: 440 }}>
              Invites. Banner. Shirts. All designed, printed, and delivered before your event.
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 16, color: '#ffffff', letterSpacing: 2, marginBottom: 32 }}>From ₦300,000</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              {pillTags.map((tag) => (
                <span key={tag} style={{ border: '1px solid #2A2A2A', borderRadius: 100, padding: '8px 18px', fontFamily: 'var(--font-general)', fontSize: 13, color: '#888888' }}>{tag}</span>
              ))}
            </div>
            <Link href="/order?package=event" className="btn-primary">Book This Package →</Link>
          </ScrollReveal>
        </div>
        
        {/* RIGHT SIDE CONTAINER BOX */}
        <div style={{ flex: '1 1 280px', position: 'relative', minHeight: 240 }}>
          <ScrollReveal>
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ 
                position: 'relative', 
                width: '100%', 
                aspectRatio: '4/3', 
                borderRadius: 6, 
                overflow: 'hidden', 
                border: isHovered ? '1px solid #C6FF33' : '1px solid #2A2A2A', 
                backgroundColor: '#000000',
                // Smooth transition property
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.5s ease',
                // Zoom out (scale down to 0.93) and skew slightly by -6 degrees when hovered
                transform: isHovered ? 'scale(0.93) skewX(-6deg)' : 'scale(1) skewX(0deg)',
                cursor: 'pointer'
              }}
            >
              <img 
                src="/images/drops/drop-001.jpg" 
                alt="Event package preview" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover'
                }} 
              />
              <div style={{ position: 'absolute', top: 16, right: 16, backgroundColor: '#C6FF33', color: '#0D0D0D', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 2 }}>
                Most Popular
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PAGE MAIN EXPORT WITH MASTER BACKDROP
───────────────────────────────────────── */

export default function HomePage() {
  const [heroActive, setHeroActive] = useState(false);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const curtainWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openerTimeline = gsap.timeline({
      onComplete: () => {
        if (curtainWrapperRef.current) {
          curtainWrapperRef.current.style.display = 'none';
        }
        setHeroActive(true);
      }
    });
    openerTimeline.to([leftCurtainRef.current, rightCurtainRef.current], {
      xPercent: (index) => (index === 0 ? -100 : 100),
      duration: 1.1,
      ease: 'power4.inOut',
      delay: 0.3,
    });
  }, []);

  return (
    <>
      <div
        ref={curtainWrapperRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', pointerEvents: 'none' }}
      >
        <div ref={leftCurtainRef} style={{ flex: 1, height: '100%', backgroundColor: '#000000', borderRight: '1px solid #2A2A2A', pointerEvents: 'auto' }} />
        <div ref={rightCurtainRef} style={{ flex: 1, height: '100%', backgroundColor: '#000000', borderLeft: '1px solid #2A2A2A', pointerEvents: 'auto' }} />
      </div>

      <main 
        style={{ 
          backgroundColor: '#000000', 
          minHeight: '100vh',
          backgroundImage: "url('/images/global-bg.jpg')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'fixed', 
          backgroundRepeat: 'no-repeat'
        }}
      >
        <HeroSection loaded={heroActive} />
        <ClientLogosStrip />
        <SocialProofStrip />
        <ServicesSection />
        <HowItWorksSection />
        <PortfolioSection />
        <EventBundleSection />
        <FinalCTA />
      </main>
    </>
  );
}