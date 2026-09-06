'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '@/components/ScrollReveal';
import FinalCTA from '@/components/FinalCTA';
import HeroOverlapCards from '@/components/HeroOverlapCards';
import { usePageContent } from '@/lib/usePageContent';


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */



const categories = [
  { label: 'Logo & branding', img: '/images/categories/logo.jpg', emoji: '✦' },
  { label: 'Website & app design', img: '/images/categories/web.jpg', emoji: '◈' },
  { label: 'Business & advertising', img: '/images/categories/business.jpg', emoji: '◎' },
  { label: 'Art & illustration', img: '/images/categories/art.jpg', emoji: '◇' },
  { label: 'Packaging & label', img: '/images/categories/packaging.jpg', emoji: '⬡' },
];

const portfolioItems = [
  { src: '/images/portfolio/work-1.mp4', tag: 'Branding', label: 'Identity System', isVideo: true },
  { src: '/images/portfolio/work-2.jpg', tag: 'Print', label: 'Print Campaign', isVideo: false },
  { src: '/images/portfolio/work-3.mp4', tag: 'Digital', label: 'Digital Assets', isVideo: true },
  { src: '/images/portfolio/work-4.jpg', tag: 'Identity', label: 'Brand Identity', isVideo: false },
  { src: '/images/portfolio/work-5.jpg', tag: 'Web', label: 'Web Design', isVideo: false },
];

const portfolioFallbacks = [
  'linear-gradient(135deg, #1a2a0a 0%, #2d4a10 100%)',
  'linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)',
  'linear-gradient(135deg, #1a0a0a 0%, #3a1010 100%)',
  'linear-gradient(135deg, #0a1a1a 0%, #103a3a 100%)',
  'linear-gradient(135deg, #1a1a0a 0%, #3a3a10 100%)',
];

const HOME_HERO_FALLBACK = {
  headline: 'Design. Print. Deliver.',
  highlight: 'Flawlessly fast!',
  subtext: '250+ expert printers & designers across Lagos. One brief, flawless delivery.',
  cta_text: 'START YOUR ORDER',
  cta_link: '/order',
  video_url: '/videos/hero-bg.mp4',
  image_url: '/images/hero-bg.jpg',
};

/* ─────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────── */

function HeroSection({ loaded, content }: { loaded: boolean; content: typeof HOME_HERO_FALLBACK }) {
  const heroRef = useRef<HTMLElement>(null);
  const [bgMode, setBgMode] = useState<'video' | 'image'>('image');
  const [videoEnabled, setVideoEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const connection = (navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    }).connection;
    const slowConnection = ['slow-2g', '2g', '3g'].includes(connection?.effectiveType || '');
    if (connection?.saveData || slowConnection) return;

    const enableVideo = () => {
      setVideoEnabled(true);
      setBgMode('video');
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(enableVideo, { timeout: 1800 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timer = globalThis.setTimeout(enableVideo, 1200);
    return () => globalThis.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const els = heroRef.current?.querySelectorAll('.hero-anim') || [];
      gsap.fromTo(
        els,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.15,
        }
      );
    });

    return () => ctx.revert();
  }, [loaded]);

  return (
    <section ref={heroRef} className="hero-section-v2">
      {/* Full-bleed background */}
      <div className="hero-bg-container">
        {/* Video background */}
        {videoEnabled && <video
          autoPlay muted loop playsInline
          className="hero-bg-video"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 1,
            opacity: bgMode === 'video' ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
          preload="none"
          poster={content.image_url}
        >
          <source src={content.video_url} type="video/mp4" />
        </video>}

        {/* Image background */}
        <img
          src={content.image_url}
          alt=""
          className="hero-bg-img"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
            opacity: bgMode === 'image' ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 2,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
          }}
        />

      </div>

      {/* Centered content */}
      <div className="hero-content-v2">
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, maxWidth: 940, margin: '0 auto' }}>
          {/* Line 1 */}
          <div
            className="hero-anim"
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontSize: 'clamp(48px, 8vw, 84px)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              marginBottom: 40,
            }}
          >
            {content.headline}<br />
            <span style={{ color: '#C6FF33' }}>{content.highlight}</span>
          </div>

          {/* CTA buttons */}
          <div className="hero-anim" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <Link
              href={content.cta_link}
              className="hero-btn-solid"
              style={{ fontSize: 13, padding: '12px 28px', boxShadow: '0 0 32px rgba(198,255,51,0.55), 0 0 80px rgba(198,255,51,0.2)' }}
            >
              {content.cta_text}
            </Link>
          </div>

          {/* Subtext */}
          <div className="hero-anim">
            <p style={{
              fontFamily: 'var(--font-general)',
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 auto',
            }}>
              {content.subtext}
            </p>
          </div>
        </div>
      </div>

      {/* Background toggle pill */}
      <div className="hero-bg-toggle">
        <button
          onClick={() => setBgMode('video')}
          style={{
            background: bgMode === 'video' ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: bgMode === 'video' ? '#fff' : 'rgba(255,255,255,0.45)',
            border: 'none',
            padding: '6px 14px',
            borderRadius: 100,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase' as const,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          Video
        </button>
        <button
          onClick={() => setBgMode('image')}
          style={{
            background: bgMode === 'image' ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: bgMode === 'image' ? '#fff' : 'rgba(255,255,255,0.45)',
            border: 'none',
            padding: '6px 14px',
            borderRadius: 100,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: 'uppercase' as const,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          Photo
        </button>
      </div>

      {/* Scroll chevron */}
      <div className="hero-scroll-chevron" style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>↓</span>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CATEGORIES
───────────────────────────────────────── */

function CategoryCard({ label, img, emoji, index }: { label: string; img: string; emoji: string; index: number }) {
  const [hov, setHov] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0,
          duration: 0.7, ease: 'power3.out',
          delay: index * 0.1,
          scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <Link href="/portfolio" style={{ textDecoration: 'none' }}>
      <div
        ref={cardRef}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          cursor: 'pointer',
          transition: 'transform 0.35s cubic-bezier(0.25,1,0.5,1), box-shadow 0.35s ease',
          transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        }}
      >
        <div style={{
          borderRadius: 8, overflow: 'hidden', // less rounded for a more modern squared look
          transition: 'box-shadow 0.35s ease',
          marginBottom: 14,
          aspectRatio: '1 / 1', backgroundColor: '#111', position: 'relative',
          boxShadow: hov ? '0 20px 48px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.2)',
        }}>
          {!imgFailed ? (
            <img src={img} alt={label}
              style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                transition: 'transform 0.5s cubic-bezier(0.25,1,0.5,1)',
                transform: hov ? 'scale(1.04)' : 'scale(1)',
              }}
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: hov ? 'linear-gradient(135deg, #1a2a0a, #2d4a10)' : 'linear-gradient(135deg, #141414, #1e1e1e)',
              transition: 'background 0.3s',
            }}>
              <span style={{ fontSize: 28, color: hov ? '#ffffff' : '#333' }}>{emoji}</span>
            </div>
          )}
          {/* Hover overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: hov ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0)',
            transition: 'background 0.3s ease',
          }} />
        </div>
        <p style={{
          fontFamily: 'var(--font-jakarta)', fontSize: 15, fontWeight: 600,
          color: hov ? '#ffffff' : 'rgba(255,255,255,0.7)',
          transition: 'color 0.25s ease', lineHeight: 1.3,
        }}>{label}</p>
      </div>
    </Link>
  );
}

function CategoriesSection() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section style={{
      backgroundColor: '#0D0D0D',
      padding: 'clamp(80px, 14vw, 120px) 0',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: 'clamp(48px, 8vw, 72px)', padding: '0 var(--section-px)' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3,
            color: '#C6FF33', marginBottom: 16, textTransform: 'uppercase',
          }}>WHAT WE DO</p>
          <h2 style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 800,
            fontSize: 'clamp(44px, 7vw, 72px)', color: '#ffffff',
            letterSpacing: '-2px', marginBottom: 16,
          }}>
            Design.
          </h2>
          <p style={{
            fontFamily: 'var(--font-general)', fontSize: 16,
            color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto',
          }}>
            From logos to print, web to packaging — we deliver excellence across every creative discipline.
          </p>
        </div>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.label} {...cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SERVICE BLOCKS
───────────────────────────────────────── */

function AnimatedCta({ label, href, dark }: { label: string; href: string; dark?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15,
        color: dark ? (hov ? '#C6FF33' : '#ffffff') : (hov ? '#C6FF33' : '#111111'),
        textDecoration: 'none',
        borderBottom: `2px solid ${hov ? '#C6FF33' : (dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)')}`,
        paddingBottom: 3, transition: 'color 0.25s ease, border-color 0.25s ease',
      }}
    >
      {label}
      <motion.span animate={{ x: hov ? 5 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} style={{ display: 'inline-block' }}>→</motion.span>
    </Link>
  );
}

function ServiceImageBox({ image, dark }: { image: string; dark?: boolean }) {
  const [hov, setHov] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', borderRadius: 28, overflow: 'hidden',
        aspectRatio: '5/4',
        maxWidth: 560,
        margin: '0 auto',
        background: imgFailed
          ? (dark ? 'linear-gradient(135deg, #181818, #242424)' : 'linear-gradient(135deg, #e0e0e0, #f0f0f0)')
          : (dark ? '#141414' : '#e8e8e8'),
        boxShadow: hov ? '0 40px 80px rgba(0,0,0,0.5)' : '0 12px 40px rgba(0,0,0,0.25)',
        transition: 'transform 0.45s cubic-bezier(0.25,1,0.5,1), box-shadow 0.45s ease',
        transform: hov ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        cursor: 'pointer',
      }}
    >
      {!imgFailed && (
        <img src={image} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transition: 'transform 0.55s cubic-bezier(0.25,1,0.5,1)',
          transform: hov ? 'scale(1.06)' : 'scale(1)',
        }}
          onError={() => setImgFailed(true)} />
      )}
      {imgFailed && (
        <div style={{
          width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: dark ? 'rgba(198,214,42,0.15)' : 'rgba(0,0,0,0.08)', fontSize: 56,
        }}>✦</div>
      )}
    </div>
  );
}

type ServiceFeatureProps = {
  tag: string; headline: string; body: string;
  price: string; ctaHref: string; image: string;
  imgLeft?: boolean; dark?: boolean;
};

function ServiceFeatureBlock({ tag, headline, body, price, ctaHref, image, imgLeft = false, dark = false }: ServiceFeatureProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [priceHov, setPriceHov] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, x: imgLeft ? 50 : -50 },
        {
          opacity: 1, x: 0,
          duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      );
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: imgLeft ? -50 : 50 },
        {
          opacity: 1, x: 0,
          duration: 0.9, ease: 'power3.out',
          delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, [imgLeft]);

  return (
    <section ref={sectionRef} className={`service-section ${dark ? 'service-dark' : 'service-light'}`}>
      <div className={`service-inner ${imgLeft ? 'service-reverse' : ''}`}>
        <div ref={textRef} className="service-text">
          {tag && <span className="service-tag">{tag}</span>}
          <h2 className="service-headline" style={{ color: dark ? '#ffffff' : '#111111' }}>{headline}</h2>
          <p style={{
            fontFamily: 'var(--font-general)', fontSize: 16,
            color: dark ? 'rgba(255,255,255,0.5)' : '#555555',
            lineHeight: 1.8, marginBottom: 32, maxWidth: 460,
          }}>{body}</p>
          <Link
            href={ctaHref}
            onMouseEnter={() => setPriceHov(true)}
            onMouseLeave={() => setPriceHov(false)}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-jakarta)',
              fontSize: 'clamp(22px, 3.5vw, 40px)',
              fontWeight: 800,
              color: priceHov ? '#C6FF33' : (dark ? '#ffffff' : '#111111'),
              letterSpacing: '-0.5px',
              textDecoration: 'none',
              transition: 'color 0.25s ease, transform 0.25s ease',
              transform: priceHov ? 'translateX(6px)' : 'none',
              borderBottom: `2px solid ${priceHov ? '#C6FF33' : (dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)')}`,
              paddingBottom: 4,
            }}
          >
            {price} →
          </Link>
        </div>
        <div ref={imageRef} className="service-image">
          <Link href={ctaHref} style={{ display: 'block', textDecoration: 'none' }}>
            <ServiceImageBox image={image} dark={dark} />
          </Link>
        </div>
      </div>
    </section>
  );
}



/* ─────────────────────────────────────────
   BAY WINDOW PORTFOLIO
───────────────────────────────────────── */

function BayWindowPortfolio() {
  const [center, setCenter] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const total = portfolioItems.length;

  const goTo = useCallback((idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCenter(((idx % total) + total) % total);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating, total]);

  const next = useCallback(() => goTo(center + 1), [center, goTo]);
  const prev = useCallback(() => goTo(center - 1), [center, goTo]);

  useEffect(() => {
    autoRef.current = setInterval(next, 3500);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [next]);

  useEffect(() => {
    if (!headingRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(next, 3500);
  };

  const getRelPos = (i: number) => {
    let rel = i - center;
    if (rel > total / 2) rel -= total;
    if (rel < -total / 2) rel += total;
    return rel;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      next();
      resetAuto();
    } else if (diff < -50) {
      prev();
      resetAuto();
    }
    setTouchStart(null);
  };

  return (
    <section style={{
      backgroundColor: '#0D0D0D',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: 'var(--section-py) 0',
      position: 'relative',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 var(--section-px)', marginBottom: 48 }}>
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3,
            color: '#C6FF33', marginBottom: 12, textTransform: 'uppercase',
          }}>SELECTED WORK</p>
          <h2 style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 800,
            fontSize: 'clamp(32px, 5vw, 48px)', color: '#ffffff',
            lineHeight: 1.1, letterSpacing: '-0.5px',
          }}>
            Made with intent.
          </h2>
        </div>
      </div>

      <div 
        className="bay-stage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {portfolioItems.map((item, i) => {
          const rel = getRelPos(i);
          if (Math.abs(rel) > 1) return null;
          const isCenter = rel === 0;
          const isRight = rel === 1;

          return (
            <div
              key={i}
              className={`bay-panel ${isCenter ? 'bay-center' : isRight ? 'bay-right' : 'bay-left'}`}
              onClick={() => {
                if (isCenter) {
                  // Center panel is the "active" image — clicking it goes to the portfolio page.
                  router.push('/portfolio');
                } else {
                  // Side panels cycle the carousel to bring that item to center.
                  goTo(i);
                  resetAuto();
                }
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%', background: portfolioFallbacks[i] }}>
                {item.isVideo ? (
                  <video src={item.src} autoPlay muted loop playsInline preload="auto"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img src={item.src} alt={item.tag}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                )}
                {isCenter && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                    padding: '40px 24px 20px',
                  }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#C6FF33', letterSpacing: 3, marginBottom: 6 }}>{item.tag}</p>
                    <p style={{ fontFamily: 'var(--font-jakarta)', fontSize: 18, fontWeight: 700, color: '#ffffff' }}>{item.label}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <button className="bay-arrow bay-arrow-left" onClick={() => { prev(); resetAuto(); }} aria-label="Previous">←</button>
        <button className="bay-arrow bay-arrow-right" onClick={() => { next(); resetAuto(); }} aria-label="Next">→</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
        {portfolioItems.map((_, i) => (
          <button key={i} onClick={() => { goTo(i); resetAuto(); }} style={{
            width: i === center ? 32 : 8, height: 8, borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer',
            backgroundColor: i === center ? '#C6FF33' : 'rgba(255,255,255,0.15)', transition: 'all 0.4s cubic-bezier(0.25,1,0.5,1)',
          }} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PAGE ASSEMBLY
───────────────────────────────────────── */

export default function HomePage() {
  const [heroActive, setHeroActive] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const heroContent = usePageContent('home', 'hero', HOME_HERO_FALLBACK);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setHeroActive(true);
        if (mainRef.current) {
          gsap.set(mainRef.current, { clearProps: 'clipPath' });
        }
      }
    });
    
    tl.to(mainRef.current, {
      clipPath: 'circle(150% at 50% 50%)',
      duration: 1.5,
      ease: 'power3.inOut',
      delay: 0.2,
    });
  }, []);

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#000000', zIndex: -1 }} />
      <main ref={mainRef} style={{ backgroundColor: '#0D0D0D', minHeight: '100vh', clipPath: 'circle(0% at 50% 50%)' }}>
        <HeroSection loaded={heroActive} content={heroContent} />
        <HeroOverlapCards />
        <CategoriesSection />

        <ServiceFeatureBlock
          tag=""
          headline="Print Services"
          body="Fast. Flawless. Every time. Flyers, banners, billboards, jotters, ID cards — produced fast through our Lagos-wide production network. Zero compromise on quality."
          price="From ₦4,500" ctaHref="/order?service=print"
          image="/images/services/print-bg.jpg" imgLeft={false} dark={true}
        />
        <ServiceFeatureBlock
          tag=""
          headline="Web & Digital"
          body="Built to convert, built to last. Landing pages, business websites, AI-enhanced digital assets and event pages. Fast, mobile-first, built for real-world results."
          price="From ₦80,000" ctaHref="/order?service=web"
          image="/images/services/web-bg.jpg" imgLeft={true} dark={true}
        />

        <BayWindowPortfolio />
        <FinalCTA />
      </main>

      <style>{`
        :root {
          --section-py: 80px;
          --section-px: 40px;
          --panel-w: 360px;
          --panel-h: 460px;
          --bay-spread: 280px;
        }

        @media (max-width: 900px) {
          :root {
            --section-py: 56px;
            --section-px: 24px;
            --panel-w: 240px;
            --panel-h: 320px;
            --bay-spread: 190px;
          }
        }

        @media (max-width: 480px) {
          :root {
            --section-py: 44px;
            --section-px: 16px;
            --panel-w: 190px;
            --panel-h: 260px;
            --bay-spread: 145px;
          }
        }

        /* ── HERO V2 ── */
        .hero-section-v2 {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 20px 80px;
          overflow: hidden;
        }

        .hero-bg-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
        }

        .hero-content-v2 {
          position: relative;
          z-index: 3;
          max-width: 940px;
          width: 100%;
          padding: 0 20px;
        }

        .hero-anim { will-change: transform, opacity; }

        /* ── BG TOGGLE PILL ── */
        .hero-bg-toggle {
          position: absolute;
          bottom: 36px;
          right: clamp(20px, 5vw, 48px);
          z-index: 10;
          display: flex;
          gap: 4px;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 100px;
          padding: 3px;
          border: 1px solid rgba(255,255,255,0.08);
        }

        @media (max-width: 640px) {
          .hero-bg-toggle { display: none; }
        }

        /* ── CATEGORIES ── */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 24px;
        }

        @media (max-width: 1100px) {
          .categories-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
        }

        @media (max-width: 640px) {
          .categories-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 24px;
            margin-left: -var(--section-px);
            margin-right: -var(--section-px);
            padding-left: var(--section-px);
            padding-right: var(--section-px);
            scrollbar-width: none;
          }
          .categories-grid::-webkit-scrollbar {
            display: none;
          }
          .categories-grid > * {
            flex: 0 0 65%;
            min-width: 200px;
            scroll-snap-align: center;
          }
        }

        @media (max-width: 480px) {
          .categories-grid > * {
            flex: 0 0 75%;
          }
        }

        /* ── SERVICE BLOCKS ── */
        .service-section {
          padding: var(--section-py) 0;
          border-top: 1px solid transparent;
        }
        .service-dark {
          background-color: #0D0D0D;
          border-top-color: rgba(255,255,255,0.06);
        }
        .service-light {
          background-color: #f7f7f5;
          border-top-color: rgba(0,0,0,0.06);
        }

        .service-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 60px;
          padding: 0 var(--section-px);
        }
        .service-reverse { flex-direction: row-reverse; }

        .service-text { flex: 1 1 400px; min-width: 0; }
        .service-image { flex: 1 1 500px; min-width: 0; }
        
        .service-image > a > div {
           border-radius: 36px !important;
        }

        @media (max-width: 768px) {
          .service-inner { gap: 32px; flex-direction: column !important; }
          .service-text, .service-image { flex: 1 1 100%; max-width: none; }
        }

        .service-tag {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 10px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: #C6FF33;
          background-color: rgba(198,255,51,0.08);
          padding: 5px 14px; border-radius: 100px; margin-bottom: 20px;
        }

        .service-headline {
          font-family: var(--font-jakarta);
          font-weight: 800;
          font-size: clamp(28px, 4.5vw, 52px);
          line-height: 1.1; letter-spacing: -1px; margin-bottom: 16px;
        }

        /* ── BAY WINDOW ── */
        .bay-stage {
          position: relative;
          height: calc(var(--panel-h) + 60px);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .bay-panel {
          position: absolute;
          width: var(--panel-w);
          height: var(--panel-h);
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          transition: transform 0.7s cubic-bezier(0.33, 1, 0.68, 1),
                      opacity 0.7s ease, filter 0.7s ease, box-shadow 0.7s ease;
        }

        .bay-center {
          transform: translateX(0) rotate(0deg) scale(1);
          opacity: 1; filter: brightness(1); z-index: 5;
          box-shadow: 0 32px 64px rgba(0,0,0,0.7);
          cursor: pointer;
        }

        .bay-right {
          transform: translateX(var(--bay-spread)) rotate(15deg) scale(0.78);
          opacity: 0.55; filter: brightness(0.4); z-index: 3;
          cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }

        .bay-left {
          transform: translateX(calc(var(--bay-spread) * -1)) rotate(-15deg) scale(0.78);
          opacity: 0.55; filter: brightness(0.4); z-index: 3;
          cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }

        .bay-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 48px; height: 48px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1); background: rgba(13,13,13,0.85);
          color: #ffffff; font-size: 18px; cursor: pointer; z-index: 20;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.25s, color 0.25s, background 0.25s;
          backdrop-filter: blur(8px);
        }

        .bay-arrow:hover {
          border-color: #C6FF33;
          color: #C6FF33;
          background: rgba(198,255,51,0.08);
        }
        .bay-arrow-left  { left: var(--section-px); }
        .bay-arrow-right { right: var(--section-px); }

        /* ── MARQUEE ── */
        .marquee-outer { overflow: hidden; }

        .marquee-track {
          display: flex; width: max-content;
          animation: marquee 28s linear infinite;
        }

        .marquee-track-slow {
          display: flex; width: max-content;
          animation: marquee 55s linear infinite;
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        /* ── BUTTONS ── */
        .hero-btn-ghost {
          display: inline-flex;
          align-items: center;
          padding: 16px 32px;
          border-radius: 100px;
          border: 1.5px solid rgba(255,255,255,0.2);
          background: transparent;
          color: #ffffff;
          font-family: var(--font-jakarta);
          font-weight: 600;
          font-size: 15px;
          text-decoration: none;
          transition: border-color 0.25s, color 0.25s, background 0.25s;
          white-space: nowrap;
          backdrop-filter: blur(8px);
        }

        .hero-btn-ghost:hover {
          border-color: #C6FF33;
          color: #C6FF33;
          background: rgba(198,255,51,0.06);
        }

        .hero-btn-solid {
          display: inline-flex;
          align-items: center;
          padding: 16px 32px;
          border-radius: 100px;
          border: none;
          background: #C6FF33;
          color: #0D0D0D;
          font-family: var(--font-jakarta);
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          transition: background 0.25s, transform 0.25s, box-shadow 0.35s;
          white-space: nowrap;
          box-shadow: 0 0 32px rgba(198,255,51,0.55), 0 0 80px rgba(198,255,51,0.2), 0 4px 20px rgba(0,0,0,0.3);
        }

        .hero-btn-solid:hover {
          background: #d4ff66;
          transform: scale(1.04);
          box-shadow: 0 0 48px rgba(198,255,51,0.8), 0 0 120px rgba(198,255,51,0.3), 0 4px 24px rgba(0,0,0,0.4);
        }

        @media (max-width: 640px) {
          .hero-btn-ghost, .hero-btn-solid {
            padding: 14px 26px;
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}