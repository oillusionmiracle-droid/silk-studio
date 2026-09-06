'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePageContent } from '@/lib/usePageContent';

/* ─────────────────────────────────────────
   Hero Slideshow — 3-image, 10s rotation
   Ashluxe-inspired full-viewport hero with
   crossfade, gradient scrim, and overlay text.
───────────────────────────────────────── */

const HERO_IMAGES = [
  '/images/apparel/hero-1.jpg',
  '/images/apparel/hero-2.jpg',
  '/images/apparel/hero-3.jpg',
];

const APPAREL_HERO_FALLBACK = {
  headline: "SILK'S ALPHA",
  subhead: 'New Collection',
  cta_text: 'SHOP NOW',
  slide_1_url: HERO_IMAGES[0],
  slide_2_url: HERO_IMAGES[1],
  slide_3_url: HERO_IMAGES[2],
};

const ROTATION_MS = 10000;
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ApparelHeroProps {
  onShopNowClick: () => void;
}

export default function ApparelHero({ onShopNowClick }: ApparelHeroProps) {
  const [current, setCurrent] = useState(0);
  const prefersReduced = useReducedMotion();
  const content = usePageContent('apparel', 'hero', APPAREL_HERO_FALLBACK);
  const heroImages = [content.slide_1_url, content.slide_2_url, content.slide_3_url];

  // Auto-rotate slides
  useEffect(() => {
    if (prefersReduced) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, ROTATION_MS);
    return () => clearInterval(timer);
  }, [heroImages.length, prefersReduced]);

  const goToSlide = useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

  return (
    <section className="apparel-hero" aria-label="Hero slideshow">
      {/* Slideshow images with crossfade */}
      <AnimatePresence initial={false}>
        <motion.img
          key={current}
          src={HERO_IMAGES[current]}
          alt={`Silk Studio collection hero image ${current + 1}`}
          className="apparel-hero__slide-img"
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReduced ? {} : { opacity: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          draggable={false}
        />
      </AnimatePresence>

      {/* Gradient scrim for text legibility */}
      <div className="apparel-hero__scrim" aria-hidden="true" />

      {/* Overlay text block */}
      <div className="apparel-hero__content">
        <motion.h1
          className="apparel-hero__headline"
          key={`headline-${current}`}
          initial={prefersReduced ? {} : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {content.headline}
        </motion.h1>

        <motion.p
          className="apparel-hero__subhead"
          key={`subhead-${current}`}
          initial={prefersReduced ? {} : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        >
          {content.subhead}
        </motion.p>

        <motion.button
          className="apparel-hero__cta"
          onClick={onShopNowClick}
          initial={prefersReduced ? {} : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          aria-label="Shop now — scroll to New Arrivals"
        >
          {content.cta_text}
        </motion.button>
      </div>

      {/* Progress dots */}
      <div className="apparel-hero__dots" role="tablist" aria-label="Slideshow navigation">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            className={`apparel-hero__dot${idx === current ? ' apparel-hero__dot--active' : ''}`}
            onClick={() => goToSlide(idx)}
            role="tab"
            aria-selected={idx === current}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
