'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import LenisScroll from '@/components/LenisScroll';
import FinalCTA from '@/components/FinalCTA';
import WorkDetailOverlay from '@/components/WorkDetailOverlay';
import { portfolioData, PortfolioItem } from '@/app/data/portfolio';

// ─── Tabs: "All" removed ───────────────────────────────────────────
const TABS = ['Print', 'Branding', 'Apparel', 'Web', 'Events'];

/* ─────────────────────────────────────────────
   SPLIT REVEAL — SplitType + GSAP 3D unfold
   Replaces the old word-by-word framer reveal.
   Usage is a drop-in swap for <SplitReveal />.
───────────────────────────────────────────── */
function SplitReveal({
  text,
  delay = 0,
  highlight = false,
  className = '',
  style = {},
}: {
  text: string;
  delay?: number;
  highlight?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<{ revert: () => void } | null>(null);

  useEffect(() => {
    // Dynamically import GSAP + SplitType so they only run client-side
    let ctx: { revert?: () => void } = {};

    (async () => {
      const [{ gsap }, { default: SplitType }] = await Promise.all([
        import('gsap'),
        import('split-type'),
      ]);

      const el = containerRef.current;
      if (!el) return;

      // Split into individual characters
      const split = new SplitType(el, { types: 'chars' });
      splitRef.current = split;

      const chars = split.chars ?? [];

      // Apply highlight color to chars in the last word if highlight=true
      if (highlight) {
        const words = text.split(' ');
        const lastWordLength = words[words.length - 1].length;
        const start = chars.length - lastWordLength;
        chars.slice(start).forEach((c) => {
          (c as HTMLElement).style.color = '#C6FF33';
        });
      }

      // Initial hidden state
      gsap.set(chars, {
        opacity: 0,
        rotationY: -90,
        rotationX: 45,
        scale: 0.5,
        transformPerspective: 800,
        transformOrigin: '50% 50% -20px',
      });

      // Staggered 3D unfold animation
      ctx = gsap.context(() => {
        gsap.to(chars, {
          rotationY: 0,
          rotationX: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.045,
          delay,
        });
      }, el);
    })();

    return () => {
      // Cleanup: revert SplitType and kill GSAP context
      splitRef.current?.revert();
      (ctx as { revert?: () => void }).revert?.();
    };
  }, [text, delay, highlight]);

  return (
    <span
      ref={containerRef}
      className={className}
      style={{ display: 'inline', ...style }}
    >
      {text}
    </span>
  );
}

/* ─────────────────────────────────────────────
   3D TILT CARD — unchanged logic, rounder edges
───────────────────────────────────────────── */
function TiltCard({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.02,1.02,1.02)`;
    });
  }, []);

  const onLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const el = ref.current;
    if (!el) return;
    el.style.transform =
      'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
    el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => {
      if (el) el.style.transition = '';
    }, 600);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ willChange: 'transform', ...style }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PARALLAX IMAGE
───────────────────────────────────────────── */
function ParallaxImage({
  src,
  alt,
  style = {},
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    const img = imgRef.current;
    if (!el || !img) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const ratio = center / window.innerHeight;
      img.style.transform = `translateY(${ratio * 28}px) scale(1.1)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        overflow: 'hidden',
        borderRadius: 'inherit',
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '110%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.05s linear',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   PORTFOLIO CARD
   — rounder corners: 28px card, 18px inner bar
   — GSAP SplitType title animation on hover
───────────────────────────────────────────── */
function PortfolioCard({
  item,
  onClick,
}: {
  item: PortfolioItem;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<{ revert: () => void } | null>(null);
  const gsapCtxRef = useRef<{ revert?: () => void } | null>(null);

  // Animate title on hover with GSAP SplitType 3D unfold
  useEffect(() => {
    if (!titleRef.current) return;

    (async () => {
      const [{ gsap }, { default: SplitType }] = await Promise.all([
        import('gsap'),
        import('split-type'),
      ]);

      const el = titleRef.current;
      if (!el) return;

      // Revert previous split
      splitRef.current?.revert();
      gsapCtxRef.current?.revert?.();

      if (hovered) {
        const split = new SplitType(el, { types: 'chars' });
        splitRef.current = split;
        const chars = split.chars ?? [];

        gsap.set(chars, {
          opacity: 0,
          rotationY: -90,
          rotationX: 45,
          scale: 0.5,
          transformPerspective: 800,
          transformOrigin: '50% 50% -10px',
        });

        const ctx = gsap.context(() => {
          gsap.to(chars, {
            rotationY: 0,
            rotationX: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.03,
          });
        }, el);

        gsapCtxRef.current = ctx;
      }
    })();
  }, [hovered]);

  return (
    <TiltCard style={{ breakInside: 'avoid', marginBottom: 18, cursor: 'pointer' }}>
      <motion.div
        onClick={onClick}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          position: 'relative',
          width: '100%',
          // ── Extra rounded corners ──
          borderRadius: 28,
          overflow: 'hidden',
          backgroundColor: '#1C1C1E',
          boxShadow: hovered
            ? '0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.10)'
            : '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* Parallax image */}
        <div style={{ height: 'auto', minHeight: 200 }}>
          <ParallaxImage src={item.src} alt={item.title} />
        </div>

        {/* Glass overlay on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.78) 100%)',
            backdropFilter: 'blur(0px)',
            pointerEvents: 'none',
          }}
        />

        {/* Category pill */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -6 }}
          transition={{ duration: 0.3, delay: 0.04 }}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'rgba(198,255,51,0.92)',
            backdropFilter: 'blur(12px)',
            color: '#0D0D0D',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: 2,
            padding: '4px 12px',
            borderRadius: 100,
            fontWeight: 700,
            pointerEvents: 'none',
          }}
        >
          {item.category}
        </motion.div>

        {/* Bottom info bar (glass) — rounder: 18px */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            right: 14,
            background: 'rgba(255,255,255,0.09)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.13)',
            // ── Extra rounded corners ──
            borderRadius: 18,
            padding: '11px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
        >
          {/* SplitType animated title */}
          <span
            ref={titleRef}
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 600,
              fontSize: 13,
              color: '#ffffff',
              display: 'inline-block',
              minHeight: 18,
            }}
          >
            {item.title}
          </span>

          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            →
          </span>
        </motion.div>
      </motion.div>
    </TiltCard>
  );
}

/* ─────────────────────────────────────────────
   STATS ROW
───────────────────────────────────────────── */
function StatsRow() {
  const stats = [
    { value: '48h', label: 'Avg. Turnaround' },
    { value: '200+', label: 'Projects Delivered' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '5★', label: 'Client Rating' },
  ];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 1,
        background: 'rgba(255,255,255,0.06)',
        // ── Extra rounded corners ──
        borderRadius: 24,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        marginBottom: 80,
      }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding: '32px 24px',
            background: 'rgba(255,255,255,0.03)',
            textAlign: 'center',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 42px)',
              color: '#C6FF33',
              letterSpacing: '-1px',
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-general)',
              fontSize: 13,
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: 0.3,
            }}
          >
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function PortfolioPage() {
  // Default to first real tab (Print) since All is removed
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredData = portfolioData.filter(
    (item) => item.category === activeTab
  );

  return (
    <LenisScroll>
      {/* Full-page background */}
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#000000',
          backgroundImage: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundAttachment: 'fixed',
          position: 'relative',
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.88) 60%, #000 100%)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>

          {/* ── PAGE HEADER ── */}
          <section
            style={{
              paddingTop: 160,
              paddingBottom: 80,
              paddingLeft: 24,
              paddingRight: 24,
              textAlign: 'center',
            }}
          >
            <div style={{ maxWidth: 860, margin: '0 auto' }}>

              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(198,255,51,0.12)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(198,255,51,0.22)',
                  borderRadius: 100,
                  padding: '6px 18px',
                  marginBottom: 32,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#C6FF33',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: 2.5,
                    textTransform: 'uppercase',
                    color: '#C6FF33',
                  }}
                >
                  Our Work
                </span>
              </motion.div>

              {/* Headline — GSAP SplitType 3D unfold */}
              <h1
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontWeight: 900,
                  fontSize: 'clamp(44px, 7vw, 88px)',
                  lineHeight: 1.02,
                  letterSpacing: '-2px',
                  color: '#ffffff',
                  marginBottom: 28,
                }}
              >
                <SplitReveal text="Every job done like" delay={0.15} />
                {' '}
                <SplitReveal text="it's the only one." delay={0.55} highlight />
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.7 }}
                style={{
                  fontFamily: 'var(--font-general)',
                  fontSize: 19,
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.75,
                  maxWidth: 520,
                  margin: '0 auto',
                }}
              >
                A curated selection of print, branding, apparel, and digital
                work from Silk Studio.
              </motion.p>
            </div>
          </section>

          {/* ── STATS ── */}
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 0' }}>
            <StatsRow />
          </div>

          {/* ── FILTER BAR (no All tab) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'sticky',
              top: 64,
              zIndex: 40,
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              padding: '0 24px',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 0,
                maxWidth: 1100,
                margin: '0 auto',
                minWidth: 'max-content',
              }}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '20px 24px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-jakarta)',
                      fontWeight: 600,
                      fontSize: 15,
                      color: isActive ? '#C6FF33' : 'rgba(255,255,255,0.45)',
                      position: 'relative',
                      transition: 'color 0.2s ease',
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {tab}
                    {isActive && (
                      <motion.div
                        layoutId="tab-indicator"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          backgroundColor: '#C6FF33',
                          borderRadius: 2,
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ── GRID ── */}
          <section style={{ padding: '60px 24px 80px', minHeight: '50vh' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

              {filteredData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '120px 0' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      // ── Rounder ──
                      borderRadius: 28,
                      padding: '48px 64px',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        letterSpacing: 3,
                        textTransform: 'uppercase',
                        color: '#C6FF33',
                        marginBottom: 16,
                      }}
                    >
                      Coming Soon
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-general)',
                        fontSize: 17,
                        color: 'rgba(255,255,255,0.45)',
                        marginBottom: 32,
                      }}
                    >
                      We're just getting started. Check back shortly.
                    </p>
                    <Link
                      href="/order"
                      style={{
                        display: 'inline-block',
                        background: '#C6FF33',
                        color: '#0D0D0D',
                        fontFamily: 'var(--font-jakarta)',
                        fontWeight: 700,
                        fontSize: 14,
                        padding: '12px 24px',
                        borderRadius: 100,
                        textDecoration: 'none',
                      }}
                    >
                      Start Your Order →
                    </Link>
                  </div>
                </div>
              ) : (
                <motion.div
                  layout
                  style={{ columns: '3 280px', columnGap: 18 }}
                  className="portfolio-masonry"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredData.map((item, i) => (
                      <motion.div
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{
                          opacity: 0,
                          scale: 0.94,
                          transition: { duration: 0.2 },
                        }}
                        transition={{
                          layout: { duration: 0.35, ease: 'easeOut' },
                          opacity: { duration: 0.55, delay: i * 0.06 },
                          y: {
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                            delay: i * 0.06,
                          },
                          scale: { duration: 0.35, delay: i * 0.05 },
                        }}
                        viewport={{ once: true, margin: '-60px' }}
                        whileInView={{ opacity: 1, y: 0 }}
                      >
                        <PortfolioCard
                          item={item}
                          onClick={() => setSelectedItem(item)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </section>

          {/* ── FINAL CTA ── */}
          <FinalCTA />

        </div>
      </div>

      {/* WORK DETAIL OVERLAY */}
      <WorkDetailOverlay
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Responsive masonry */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media (max-width: 1024px) {
            .portfolio-masonry { columns: 2 280px !important; }
          }
          @media (max-width: 640px) {
            .portfolio-masonry { columns: 1 !important; }
          }
        `,
        }}
      />
    </LenisScroll>
  );
}