'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// --- Types & Fallbacks ---

interface Testimonial {
  id: string;
  customer_name: string;
  role?: string;
  brand?: string;
  testimonial: string;
  photo_url?: string;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'fallback-1',
    customer_name: 'Afolabi M.',
    role: 'Operations Lead',
    brand: 'VANTAGE',
    testimonial:
      'Finding a reliable print shop in Lagos used to be a gamble for our event planning business. Silk Studio delivered our entire batch of branded souvenirs and conference materials in under 48 hours, and the quality was top-tier.',
    photo_url:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'fallback-2',
    customer_name: 'Babajide O.',
    role: 'Head of Brand',
    brand: 'STUDIO TRACE',
    testimonial:
      'They handle our high-volume production with total precision. From large-format event billboards to corporate apparel, their 48-hour dispatch system is something Lagos commerce has needed for years.',
    photo_url:
      'https://res.cloudinary.com/dagqxe3fh/image/upload/v1788824778/510267066_1788823516534214_xexcun.jpg',
  },
  {
    id: 'fallback-3',
    customer_name: 'Chidinma E.',
    role: 'Founder',
    brand: 'LUMINA',
    testimonial:
      'Beyond the physical prints, having them handle our web design and automated customer workflows changed how our brand operates online. They bridge the gap between creative design and serious tech.',
    photo_url:
      'https://res.cloudinary.com/dagqxe3fh/image/upload/v1788824777/912323983_1788823117159588_e0cnx9.jpg',
  },
];

const LOGO_PATHS = [
  '/images/clients/client-logo-1.png',
  '/images/clients/client-logo-2.png',
  '/images/clients/client-logo-3.png',
  '/images/clients/client-logo-4.png',
  '/images/clients/client-logo-5.png',
  '/images/clients/client-logo-6.png',
];

const BRAND_NAMES = [
  'Vantage',
  'Lumina',
  'Studio Trace',
  'Pulse Africa',
  'Apex Lagos',
  'Nexus Labs',
];

// --- Logo Component with Monogram Fallback ---

const BrandLogo = ({ src, index }: { src: string; index: number }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        style={{
          padding: '12px 28px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontFamily: 'var(--font-jakarta)',
          fontWeight: 700,
          fontSize: '18px',
          letterSpacing: '-0.3px',
          color: 'rgba(255, 255, 255, 0.85)',
          whiteSpace: 'nowrap',
          transition: 'all 0.3s ease',
        }}
      >
        {BRAND_NAMES[index] || `Brand 0${index + 1}`}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
      }}
    >
      <img
        src={src}
        alt={BRAND_NAMES[index] || `Client Logo ${index + 1}`}
        onError={() => setHasError(true)}
        style={{
          height: 'clamp(44px, 5vw, 56px)',
          maxWidth: '180px',
          objectFit: 'contain',
          opacity: 0.88,
          filter: 'brightness(0) invert(1)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.88';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      />
    </div>
  );
};

export default function EcosystemSocialProof() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);

  useEffect(() => {
    async function loadTestimonials() {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, customer_name, role, testimonial, photo_url')
        .eq('published', true)
        .order('display_order', { ascending: true })
        .limit(3);

      if (!error && data && data.length > 0) {
        // Map Supabase testimonials with fallback photos/brands
        const mapped = data.map((t, idx) => {
          const fallback = FALLBACK_TESTIMONIALS[idx % FALLBACK_TESTIMONIALS.length];
          // Extract brand if role contains "at <Brand>"
          let roleTitle = t.role || fallback.role || '';
          let brandName = fallback.brand || 'CLIENT';
          if (roleTitle.includes(' at ')) {
            const parts = roleTitle.split(' at ');
            roleTitle = parts[0];
            brandName = parts[1].toUpperCase();
          } else if (roleTitle.includes(' \u2013 ')) {
            const parts = roleTitle.split(' \u2013 ');
            roleTitle = parts[0];
            brandName = parts[1].toUpperCase();
          }

          return {
            id: t.id,
            customer_name: t.customer_name || fallback.customer_name,
            role: roleTitle,
            brand: brandName,
            testimonial: t.testimonial || fallback.testimonial,
            photo_url: t.photo_url || fallback.photo_url,
          };
        });
        setTestimonials(mapped);
      }
    }
    void loadTestimonials();
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      style={{
        backgroundColor: '#0D0D0D',
        padding: 'clamp(90px, 14vw, 150px) clamp(24px, 6vw, 48px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        {/* ─────────────────────────────────────────────────────────
            1. TRUSTED BY SECTION (Headline same size/color, 4 up 2 down)
           ───────────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeIn}
          style={{ textAlign: 'center', marginBottom: 'clamp(90px, 13vw, 140px)' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontSize: 'clamp(32px, 5.5vw, 64px)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-1.5px',
              lineHeight: 1.15,
              maxWidth: 960,
              margin: '0 auto clamp(40px, 6vw, 64px) auto',
            }}
          >
            Trusted by leading teams &amp; brands across Lagos
          </h2>

          {/* 4 UP */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'clamp(28px, 6vw, 72px)',
              marginBottom: 'clamp(28px, 4vw, 44px)',
            }}
          >
            {LOGO_PATHS.slice(0, 4).map((path, idx) => (
              <BrandLogo key={idx} src={path} index={idx} />
            ))}
          </div>

          {/* 2 DOWN */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'clamp(36px, 8vw, 84px)',
            }}
          >
            {LOGO_PATHS.slice(4, 6).map((path, idx) => (
              <BrandLogo key={idx + 4} src={path} index={idx + 4} />
            ))}
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────
            2. ECOSYSTEM STATEMENT (No black box, left text + right image)
           ───────────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeIn}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(36px, 7vw, 72px)',
            alignItems: 'center',
            marginBottom: 'clamp(100px, 14vw, 150px)',
          }}
        >
          {/* Left: Left-justified Big Headline & Copy */}
          <div style={{ maxWidth: 640 }}>
            <h2
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 'clamp(36px, 5.5vw, 64px)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.08,
                letterSpacing: '-1.5px',
                marginBottom: 28,
              }}
            >
              Lagos has a fragmented print ecosystem.{' '}
              <span style={{ color: '#C6FF33', display: 'inline' }}>
                We are fixing it.
              </span>
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-general)',
                fontSize: 'clamp(18px, 2.2vw, 22px)',
                color: 'rgba(255, 255, 255, 0.72)',
                lineHeight: 1.68,
                margin: 0,
              }}
            >
              Silk Studio is a design, print, and digital commerce platform that goes
              beyond physical production to deliver AI automation, web design,
              software development, and everything in-between.
            </p>
          </div>

          {/* Right: Placeholder Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 3',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#161616',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
            }}
          >
            <img
              src="/images/services/print-bg.jpg"
              alt="Lagos Print Network"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={(e) => {
                // Graceful fallback to hero-bg
                (e.currentTarget as HTMLImageElement).src = '/images/about/hero-bg.jpg';
              }}
            />
            {/* Subtle gloss overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(13,13,13,0.4) 0%, transparent 60%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────
            3. THE PROBLEM & THE SOLUTION (No boxes, big white titles, full width)
           ───────────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeIn}
          className="problem-solution-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(48px, 8vw, 96px)',
            marginBottom: 'clamp(110px, 15vw, 170px)',
          }}
        >
          {/* The Problem */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h3
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 'clamp(34px, 4.5vw, 52px)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-1px',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              The Problem
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-general)',
                fontSize: 'clamp(18px, 2vw, 21px)',
                color: 'rgba(255, 255, 255, 0.72)',
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Lagos has hundreds of professional, high-quality printers\u2014but they are
              scattered, underutilized, and hard to find. Small businesses, event
              planners, and startups waste valuable time hunting for reliable print
              shops, while printers sit idle between jobs.
            </p>
          </div>

          {/* The Solution */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h3
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 'clamp(34px, 4.5vw, 52px)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-1px',
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              The Solution
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-general)',
                fontSize: 'clamp(18px, 2vw, 21px)',
                color: 'rgba(255, 255, 255, 0.88)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              We operate as a marketplace designed to bridge this gap:
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
              }}
            >
              {[
                'Connects clients to vetted professional printers across Lagos in real-time.',
                'Delivers premium quality work in 48 hours instead of weeks.',
                'Offers integrated design services at 70% off for first-time users.',
                'Routes jobs directly to the first available printer based on exact capability and location.',
              ].map((point, idx) => (
                <li
                  key={idx}
                  style={{
                    fontFamily: 'var(--font-general)',
                    fontSize: 'clamp(16px, 1.8vw, 19px)',
                    color: 'rgba(255, 255, 255, 0.75)',
                    lineHeight: 1.65,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                  }}
                >
                  <span
                    style={{
                      color: '#C6FF33',
                      fontSize: 18,
                      lineHeight: 1.4,
                      flexShrink: 0,
                    }}
                  >
                    &#10086;
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────
            4. TESTIMONIALS (Exact ClickUp Portrait Cards Style)
           ───────────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeIn}
          style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}
        >
          {/* Centralized Header */}
          <div
            style={{
              textAlign: 'center',
              maxWidth: 900,
              margin: '0 auto',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontSize: 'clamp(34px, 5vw, 60px)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-1.5px',
                lineHeight: 1.12,
                margin: 0,
                textAlign: 'center',
              }}
            >
              See what our clients have to say
            </h2>
          </div>

          {/* 3-Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
            }}
          >
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="testimonial-card"
              >
                {/* Image Box */}
                <div className="testimonial-img-box">
                  <img
                    className="testimonial-photo"
                    src={
                      t.photo_url ||
                      FALLBACK_TESTIMONIALS[idx % FALLBACK_TESTIMONIALS.length].photo_url
                    }
                    alt={t.customer_name}
                    onError={(e) => {
                      const fallbacks = [
                        '/images/services/print-bg.jpg',
                        '/images/about/hero-bg.jpg',
                        '/images/services/web-bg.jpg',
                      ];
                      (e.currentTarget as HTMLImageElement).src =
                        fallbacks[idx % fallbacks.length];
                    }}
                  />

                  {/* Desktop Dark Gradient (fades out on hover) */}
                  <div className="testimonial-gradient-overlay" />

                  {/* Desktop Content overlay (pinned to bottom, fades out on hover) */}
                  <div className="testimonial-desktop-overlay">
                    <p className="testimonial-quote-desktop">
                      &ldquo;{t.testimonial}&rdquo;
                    </p>

                    <div className="testimonial-footer-desktop">
                      <div>
                        <p className="testimonial-name-desktop">
                          {t.customer_name}
                        </p>
                        <p className="testimonial-role-desktop">
                          {t.role || 'Verified Client'}
                        </p>
                      </div>

                      <div className="testimonial-brand-desktop">
                        {t.brand || 'SILK'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Content Underneath Image (only visible on mobile, smaller) */}
                <div className="testimonial-mobile-content">
                  <p className="testimonial-quote-mobile">
                    &ldquo;{t.testimonial}&rdquo;
                  </p>

                  <div className="testimonial-footer-mobile">
                    <div>
                      <p className="testimonial-name-mobile">
                        {t.customer_name}
                      </p>
                      <p className="testimonial-role-mobile">
                        {t.role || 'Verified Client'}
                      </p>
                    </div>

                    <div className="testimonial-brand-mobile">
                      {t.brand || 'SILK'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        /* -- Desktop & Base Card -- */
        .testimonial-card {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .testimonial-img-box {
          position: relative;
          width: 100%;
          overflow: hidden;
          background-color: #161616;
        }

        .testimonial-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* -- Desktop Overlays (min-width: 769px) -- */
        @media (min-width: 769px) {
          .testimonial-card {
            height: 560px;
            border-radius: 28px;
            overflow: hidden;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
            justify-content: flex-end;
          }

          .testimonial-img-box {
            position: absolute;
            inset: 0;
            height: 100%;
            border-radius: 28px;
          }

          .testimonial-photo {
            position: absolute;
            inset: 0;
            z-index: 0;
          }

          .testimonial-gradient-overlay {
            position: absolute;
            inset: 0;
            z-index: 1;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.94) 0%,
              rgba(0, 0, 0, 0.65) 45%,
              rgba(0, 0, 0, 0.15) 75%,
              transparent 100%
            );
            transition: opacity 0.35s ease;
            pointer-events: none;
          }

          .testimonial-desktop-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 2;
            padding: 36px 32px;
            display: flex;
            flex-direction: column;
            gap: 22px;
            transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                        transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
          }

          /* Hover: Text and gradient disappear completely! */
          .testimonial-card:hover .testimonial-desktop-overlay {
            opacity: 0;
            transform: translateY(12px);
          }

          .testimonial-card:hover .testimonial-gradient-overlay {
            opacity: 0;
          }

          .testimonial-card:hover .testimonial-photo {
            transform: scale(1.05);
          }

          .testimonial-quote-desktop {
            font-family: var(--font-jakarta);
            font-weight: 700;
            font-size: 17px;
            line-height: 1.48;
            color: #ffffff;
            margin: 0;
            letter-spacing: -0.2px;
          }

          .testimonial-footer-desktop {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.14);
            padding-top: 18px;
          }

          .testimonial-name-desktop {
            font-family: var(--font-jakarta);
            font-weight: 800;
            font-size: 15px;
            color: #ffffff;
            margin: 0 0 2px 0;
          }

          .testimonial-role-desktop {
            font-family: var(--font-general);
            font-size: 13px;
            color: rgba(255, 255, 255, 0.7);
            margin: 0;
          }

          .testimonial-brand-desktop {
            font-family: var(--font-jakarta);
            font-weight: 900;
            font-size: 18px;
            letter-spacing: 1px;
            color: #ffffff;
            text-transform: uppercase;
            opacity: 0.95;
          }

          /* Hide mobile content on desktop */
          .testimonial-mobile-content {
            display: none !important;
          }
        }

        /* -- Mobile View (max-width: 768px): Text under the image, smaller -- */
        @media (max-width: 768px) {
          .testimonial-card {
            height: auto;
            background-color: transparent;
            box-shadow: none;
            gap: 0;
            margin-bottom: 32px;
          }

          .testimonial-img-box {
            height: 320px;
            border-radius: 20px;
            box-shadow: 0 14px 32px rgba(0, 0, 0, 0.55);
            margin-bottom: 28px;
          }

          /* Hide desktop overlays on mobile */
          .testimonial-gradient-overlay,
          .testimonial-desktop-overlay {
            display: none !important;
          }

          /* Mobile text positioned underneath the image */
          .testimonial-mobile-content {
            display: flex;
            flex-direction: column;
            gap: 14px;
            padding: 0 6px;
          }

          .testimonial-quote-mobile {
            font-family: var(--font-general);
            font-weight: 500;
            font-size: 14px;
            line-height: 1.55;
            color: rgba(255, 255, 255, 0.85);
            margin: 0;
          }

          .testimonial-footer-mobile {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 12px;
          }

          .testimonial-name-mobile {
            font-family: var(--font-jakarta);
            font-weight: 700;
            font-size: 13px;
            color: #ffffff;
            margin: 0 0 2px 0;
          }

          .testimonial-role-mobile {
            font-family: var(--font-general);
            font-size: 11px;
            color: rgba(255, 255, 255, 0.5);
            margin: 0;
          }

          .testimonial-brand-mobile {
            font-family: var(--font-jakarta);
            font-weight: 800;
            font-size: 14px;
            letter-spacing: 0.8px;
            color: #ffffff;
            text-transform: uppercase;
            opacity: 0.9;
          }

          .problem-solution-grid {
            padding-left: 10px !important;
            padding-right: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}
