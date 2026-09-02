'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import GSAPTitle from '@/components/GSAPTitle';
import { useProducts, useCategoryStats, Product, Variant } from '@/lib/useProducts';
import { useReviews, Review } from '@/lib/useReviews';
import { useCart } from '@/lib/CartContext';
import { useWishlist, WishlistItem } from '@/lib/WishlistContext';
import ApparelHero from '@/components/apparel/ApparelHero';
import NewArrivalsGrid from '@/components/apparel/NewArrivalsGrid';
import {
  ShoppingCart,
  Heart,
  X,
  Plus,
  Minus,
  Trash2,
  Star,
  Check,
  Truck,
  Ruler,
  Filter,
  Package,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Eye,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';

/* ─────────────────────────────────────────
   DESIGN TOKENS — Streetwear Editorial (Dark / Confident)
───────────────────────────────────────── */
const T = {
  bg: '#0A0A0A',
  bgSurface: '#121212',
  bgCard: '#161616',
  bgCardHover: '#1C1C1C',
  border: 'rgba(255, 255, 255, 0.08)',
  borderHover: 'rgba(255, 255, 255, 0.2)',
  accent: '#C6FF33', // Studio signature lime accent
  accentHover: '#D4FF66',
  accentSubtle: 'rgba(198, 255, 51, 0.12)',
  heartActive: '#FF385C',
  heartActiveBg: 'rgba(255, 56, 92, 0.15)',
  textPrimary: '#F5F5F5',
  textSecondary: '#A0A0A0',
  textMuted: '#666666',
  scrim: 'linear-gradient(180deg, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.6) 60%, rgba(10,10,10,0.95) 100%)',
  scrimCard: 'linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.85) 100%)',
  progressUnlocked: '#10B981',
};

const EASE = [0.16, 1, 0.3, 1] as const;
const springTransition = { type: 'spring' as const, stiffness: 400, damping: 28 };

const formatPrice = (n: number) => `\u20A6${n.toLocaleString()}`;

/* ─────────────────────────────────────────
   HERO CONFIGURATION (Easily add/remove slides)
───────────────────────────────────────── */
const HERO_SLIDES = [
  {
    image: '/images/apparel/hero-1.jpg',
    tag: 'DROP 001 // CORE COLLECTION',
    headline: 'Wears that speak for themselves.',
    subhead: 'Heavyweight 260gsm streetwear essentials designed in Lagos, engineered for everywhere.',
    ctaText: 'Explore Collection',
  },
  {
    image: '/images/apparel/hero-2.jpg',
    tag: 'LAGOS MINIMALIST SERIES',
    headline: 'Raw texture. Quiet confidence.',
    subhead: 'Unstructured low-profile caps and signature oversized tees. Zero filler, no restocks.',
    ctaText: 'Browse Catalog',
  },
  {
    image: '/images/hero/hero-img-1.jpg',
    tag: 'STUDIO CRAFT // SMALL BATCH',
    headline: 'Wearable artifacts from Lagos.',
    subhead: 'Every piece is printed and finished in our Lagos studio with uncompromised precision.',
    ctaText: 'View Drop',
  },
];

/* ─────────────────────────────────────────
   HERO SECTION — Full Viewport Auto-Rotating Carousel
───────────────────────────────────────── */
function ShopHero({ onExploreClick }: { onExploreClick: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 10000); // 10s auto-rotation

    return () => clearInterval(timer);
  }, [prefersReduced]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="full-bleed"
      style={{
        position: 'relative',
        width: '100%',
        height: '92vh',
        minHeight: 640,
        maxHeight: 960,
        overflow: 'hidden',
        background: '#0D0D0D',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Rotating Background Images with Framer Crossfade */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <img
            src={slide.image}
            alt={slide.headline}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Atmospheric Gradient Scrim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.5) 45%, rgba(10,10,10,0.92) 85%, #0A0A0A 100%)',
          zIndex: 1,
        }}
      />

      {/* Overlay Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 clamp(20px, 5vw, 60px) clamp(40px, 6vw, 70px)',
        }}
      >
        <div style={{ maxWidth: 860 }}>
          {/* Tag badge */}
          <motion.div
            key={`tag-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 100,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${T.border}`,
              marginBottom: 18,
            }}
          >
            <Sparkles size={13} color={T.accent} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: 2.5,
                color: T.textPrimary,
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              {slide.tag}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 800,
              fontSize: 'clamp(38px, 6.5vw, 76px)',
              lineHeight: 1.05,
              letterSpacing: '-1.5px',
              color: T.textPrimary,
              marginBottom: 16,
            }}
          >
            {slide.headline}
          </motion.h1>

          {/* Subhead */}
          <motion.p
            key={`sub-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            style={{
              fontFamily: 'var(--font-general)',
              fontSize: 'clamp(15px, 2vw, 19px)',
              color: T.textSecondary,
              lineHeight: 1.6,
              maxWidth: 580,
              marginBottom: 28,
            }}
          >
            {slide.subhead}
          </motion.p>

          {/* CTA Row & Carousel Indicators */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            <motion.button
              onClick={onExploreClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: T.accent,
                color: '#0D0D0D',
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 700,
                fontSize: 15,
                padding: '16px 36px',
                borderRadius: 100,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(198, 255, 51, 0.25)',
              }}
            >
              {slide.ctaText}
              <ArrowRight size={18} />
            </motion.button>

            {/* Custom Styled Carousel Progress Indicators */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {HERO_SLIDES.map((_, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: '8px 4px',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: isActive ? 36 : 14,
                        height: 3,
                        borderRadius: 2,
                        backgroundColor: isActive ? T.accent : 'rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.4s ease',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CATEGORY/BROWSE SECTION (With "Dropping Soon" Hoodies)
───────────────────────────────────────── */
const CATEGORIES_CONFIG = [
  {
    key: 'tee',
    title: 'T-Shirts',
    subtitle: 'Heavyweight Boxy Fits',
    isLive: true,
  },
  {
    key: 'cap',
    title: 'Caps',
    subtitle: 'Unstructured 5-Panel',
    isLive: true,
  },
  {
    key: 'hoodie',
    title: 'Hoodies',
    subtitle: '450gsm Loopback Fleece',
    isLive: false, // Purely visual display state — underlying category logic kept
  },
] as const;

function CategoryBrowse({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (cat: string | null) => void;
}) {
  const { stats, loading } = useCategoryStats();

  return (
    <section
      style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '60px clamp(20px, 5vw, 60px) 30px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: T.accent,
              marginBottom: 6,
            }}
          >
            Curated Categories
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 800,
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              color: T.textPrimary,
              letterSpacing: '-0.5px',
            }}
          >
            Explore By Silhouette
          </h2>
        </div>

        {selected && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onSelect(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 100,
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${T.border}`,
              color: T.textSecondary,
              fontFamily: 'var(--font-general)',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <X size={14} /> Clear Filter (Showing all)
          </motion.button>
        )}
      </div>

      {/* Category Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {CATEGORIES_CONFIG.map((cat, i) => {
          const isSelected = selected === cat.key;
          const stat = stats[cat.key];

          if (!cat.isLive) {
            // "Hoodies — Dropping Soon" Card
            return (
              <div
                key={cat.key}
                style={{
                  position: 'relative',
                  padding: '28px 24px',
                  borderRadius: 20,
                  backgroundColor: T.bgCard,
                  border: `1px dashed rgba(255, 255, 255, 0.12)`,
                  opacity: 0.75,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 140,
                  overflow: 'hidden',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 8,
                    }}
                  >
                    <Clock size={14} color={T.accent} />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        color: T.accent,
                        fontWeight: 600,
                      }}
                    >
                      Dropping Soon
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-jakarta)',
                      fontWeight: 700,
                      fontSize: 22,
                      color: T.textPrimary,
                      marginBottom: 4,
                    }}
                  >
                    {cat.title}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-general)',
                      fontSize: 13,
                      color: T.textMuted,
                      margin: 0,
                    }}
                  >
                    {cat.subtitle} &middot; In development
                  </p>
                </div>
              </div>
            );
          }

          // Live Category Cards (T-Shirts, Caps)
          return (
            <motion.button
              key={cat.key}
              whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.25)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(isSelected ? null : cat.key)}
              style={{
                position: 'relative',
                padding: '28px 24px',
                borderRadius: 20,
                backgroundColor: isSelected ? T.bgCardHover : T.bgCard,
                border: `1px solid ${isSelected ? T.accent : T.border}`,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 140,
                boxShadow: isSelected ? `0 0 24px rgba(198, 255, 51, 0.12)` : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      color: isSelected ? T.accent : T.textMuted,
                      fontWeight: 600,
                    }}
                  >
                    {cat.subtitle}
                  </span>
                  {isSelected && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: T.accent,
                      }}
                    />
                  )}
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-jakarta)',
                    fontWeight: 700,
                    fontSize: 24,
                    color: T.textPrimary,
                    marginBottom: 4,
                  }}
                >
                  {cat.title}
                </p>

                {loading ? (
                  <div
                    style={{
                      height: 14,
                      width: 100,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 4,
                    }}
                  />
                ) : stat ? (
                  <p
                    style={{
                      fontFamily: 'var(--font-general)',
                      fontSize: 13,
                      color: T.textSecondary,
                      margin: 0,
                    }}
                  >
                    {stat.count} {stat.count === 1 ? 'item' : 'items'} &middot; From{' '}
                    {formatPrice(stat.minPrice)}
                  </p>
                ) : (
                  <p
                    style={{
                      fontFamily: 'var(--font-general)',
                      fontSize: 13,
                      color: T.textMuted,
                      margin: 0,
                    }}
                  >
                    View products
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PRODUCT CARD — MKBHD / Streetwear Inspired with Wishlist Heart
───────────────────────────────────────── */
function ProductCard({
  product,
  index,
  onSelect,
}: {
  product: Product;
  index: number;
  onSelect: (p: Product) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { isInWishlist, toggleItem } = useWishlist();
  const prefersReduced = useReducedMotion();

  const wishlisted = isInWishlist(product.id);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      image: product.image_1_url,
      category: product.category,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
      whileHover={prefersReduced ? {} : { y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect(product)}
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image Container with 3:4 aspect ratio & crossfade */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '3/4',
          borderRadius: 18,
          overflow: 'hidden',
          backgroundColor: '#161616',
          border: `1px solid ${hovered ? T.borderHover : T.border}`,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.45)' : '0 4px 20px rgba(0,0,0,0.2)',
          marginBottom: 16,
        }}
      >
        {product.image_1_url && (
          <img
            src={product.image_1_url}
            alt={product.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: hovered && product.image_2_url ? 0 : 1,
              transform: hovered && !product.image_2_url ? 'scale(1.04)' : 'scale(1)',
              transition: 'opacity 0.5s ease, transform 0.6s ease',
            }}
          />
        )}
        {product.image_2_url && (
          <img
            src={product.image_2_url}
            alt={`${product.name} alternate view`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'opacity 0.5s ease, transform 0.6s ease',
            }}
          />
        )}

        {/* Wishlist Heart Icon (Top Right Corner with semi-transparent dark circle) */}
        <button
          onClick={handleHeartClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            zIndex: 5,
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: wishlisted ? T.heartActiveBg : 'rgba(15, 15, 15, 0.75)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${wishlisted ? T.heartActive : 'rgba(255, 255, 255, 0.12)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Heart
            size={18}
            color={wishlisted ? T.heartActive : '#FFFFFF'}
            fill={wishlisted ? T.heartActive : 'none'}
            strokeWidth={1.8}
          />
        </button>

        {/* Quick View Pill on Hover */}
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            right: 14,
            padding: '10px 16px',
            borderRadius: 100,
            backgroundColor: 'rgba(15, 15, 15, 0.85)',
            backdropFilter: 'blur(12px)',
            border: `1px solid rgba(255, 255, 255, 0.15)`,
            color: T.textPrimary,
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 600,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          <Eye size={14} /> Quick View & Order
        </div>
      </div>

      {/* Clean MKBHD-Style Typography Beneath Card */}
      <div style={{ padding: '0 4px' }}>
        <p
          style={{
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 600,
            fontSize: 16,
            color: T.textPrimary,
            marginBottom: 4,
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 15,
            color: T.accent,
            letterSpacing: 0.5,
            margin: 0,
          }}
        >
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   PRODUCT GRID SECTION
───────────────────────────────────────── */
function ProductGrid({
  category,
  onSelectProduct,
  gridRef,
}: {
  category: string | null;
  onSelectProduct: (p: Product) => void;
  gridRef: React.RefObject<HTMLDivElement>;
}) {
  const { products, loading, error } = useProducts(category);

  return (
    <section
      ref={gridRef}
      id="product-catalog"
      style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '20px clamp(20px, 5vw, 60px) 80px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
          borderBottom: `1px solid ${T.border}`,
          paddingBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Package size={20} color={T.accent} />
          <h3
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 700,
              fontSize: 20,
              color: T.textPrimary,
              margin: 0,
            }}
          >
            {category === 'tee'
              ? 'T-Shirts Collection'
              : category === 'cap'
              ? 'Caps & Headwear'
              : 'The Core Catalog'}
          </h3>
        </div>

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: T.textMuted,
          }}
        >
          {products.length} {products.length === 1 ? 'piece' : 'pieces'} available
        </span>
      </div>

      {error && (
        <div
          style={{
            textAlign: 'center',
            padding: 60,
            backgroundColor: T.bgCard,
            borderRadius: 20,
            border: `1px solid ${T.border}`,
          }}
        >
          <p style={{ fontFamily: 'var(--font-general)', color: T.textSecondary }}>
            Unable to connect to product catalog. Please try again.
          </p>
        </div>
      )}

      {loading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 28,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div
                style={{
                  aspectRatio: '3/4',
                  borderRadius: 18,
                  backgroundColor: T.bgCard,
                  marginBottom: 16,
                }}
              />
              <div
                style={{
                  height: 16,
                  width: '65%',
                  backgroundColor: T.bgCard,
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              />
              <div
                style={{
                  height: 14,
                  width: '35%',
                  backgroundColor: T.bgCard,
                  borderRadius: 4,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: 80,
            backgroundColor: T.bgCard,
            borderRadius: 20,
            border: `1px solid ${T.border}`,
          }}
        >
          <Filter size={36} color={T.textMuted} style={{ marginBottom: 12 }} />
          <p
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 700,
              fontSize: 20,
              color: T.textPrimary,
              marginBottom: 4,
            }}
          >
            No products found
          </p>
          <p style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: T.textMuted }}>
            More silhouettes dropping in the next release window.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '36px 24px',
          }}
        >
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────
   STORYTELLING SECTION — Inspired by MKBHD "Our Process"
───────────────────────────────────────── */
const STORY_BLOCKS = [
  {
    tag: 'THE 260GSM STANDARD',
    title: 'Engineered Weight & Drape',
    description:
      'We refuse thin, throwaway garments. Every Silk Studio tee is constructed from custom-knitted 260gsm combed cotton for a substantial boxy hang that holds its silhouette wash after wash.',
    image: '/images/apparel/process-tag.jpg',
  },
  {
    tag: 'ARTISANAL PRINTING',
    title: 'Screenprinted by Hand in Lagos',
    description:
      'No peeling heat transfers. Every artwork is burned to screens and pulled by hand using water-based inks that fuse into the garment fibers for a breathable, vintage soft-hand feel.',
    image: '/images/apparel/process-print.jpg',
  },
];

function StorytellingSection() {
  return (
    <section
      style={{
        maxWidth: 1400,
        margin: '0 auto 80px',
        padding: '0 clamp(20px, 5vw, 60px)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 50px' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: T.accent,
            marginBottom: 8,
          }}
        >
          Behind The Thread
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 44px)',
            color: T.textPrimary,
            letterSpacing: '-1px',
            marginBottom: 14,
          }}
        >
          How We Build Apparel
        </h2>
        <p style={{ fontFamily: 'var(--font-general)', fontSize: 16, color: T.textSecondary, lineHeight: 1.6 }}>
          We treat everyday streetwear pieces with the same design rigor and craft precision we bring to our studio brand identities.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {STORY_BLOCKS.map((block, idx) => {
          const isReversed = idx % 2 === 1;
          return (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: EASE }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(24px, 4vw, 48px)',
                alignItems: 'center',
                backgroundColor: T.bgCard,
                borderRadius: 24,
                border: `1px solid ${T.border}`,
                padding: 'clamp(24px, 4vw, 48px)',
                overflow: 'hidden',
              }}
            >
              <div style={{ order: isReversed ? 2 : 1 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: 2.5,
                    textTransform: 'uppercase',
                    color: T.accent,
                    display: 'block',
                    marginBottom: 10,
                  }}
                >
                  {block.tag}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-jakarta)',
                    fontWeight: 700,
                    fontSize: 'clamp(22px, 3vw, 32px)',
                    color: T.textPrimary,
                    marginBottom: 16,
                    lineHeight: 1.2,
                  }}
                >
                  {block.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-general)',
                    fontSize: 15,
                    color: T.textSecondary,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {block.description}
                </p>
              </div>

              <div
                style={{
                  order: isReversed ? 1 : 2,
                  aspectRatio: '4/3',
                  borderRadius: 18,
                  overflow: 'hidden',
                  backgroundColor: '#111',
                  border: `1px solid ${T.border}`,
                }}
              >
                <img
                  src={block.image}
                  alt={block.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   "MORE DROPPING SOON" CLOSING SECTION
───────────────────────────────────────── */
function MoreDroppingSoonSection() {
  return (
    <section
      style={{
        maxWidth: 1400,
        margin: '0 auto 60px',
        padding: '0 clamp(20px, 5vw, 60px)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        style={{
          backgroundColor: '#111111',
          borderRadius: 24,
          border: `1px solid ${T.border}`,
          padding: 'clamp(36px, 5vw, 56px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${T.border}`,
            marginBottom: 16,
          }}
        >
          <Sparkles size={13} color={T.accent} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 2.5,
              textTransform: 'uppercase',
              color: T.accent,
            }}
          >
            Future Releases
          </span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 800,
            fontSize: 'clamp(26px, 3.5vw, 40px)',
            color: T.textPrimary,
            letterSpacing: '-0.8px',
            marginBottom: 12,
          }}
        >
          More Pieces Dropping Soon
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-general)',
            fontSize: 16,
            color: T.textSecondary,
            maxWidth: 540,
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}
        >
          Heavyweight 450gsm hoodies, studio track bottoms, and limited-run collaborative artifacts are currently being sampled in our workshop.
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: T.textMuted,
              letterSpacing: 1,
            }}
          >
            &middot; 450gsm Hoodies
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: T.textMuted,
              letterSpacing: 1,
            }}
          >
            &middot; Studio Joggers
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: T.textMuted,
              letterSpacing: 1,
            }}
          >
            &middot; Embroidered Headwear
          </span>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   BULK ORDER WHATSAPP CTA
───────────────────────────────────────── */
function BulkOrderCTA() {
  return (
    <section
      style={{
        maxWidth: 1400,
        margin: '0 auto 80px',
        padding: '0 clamp(20px, 5vw, 60px)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{
          background: 'linear-gradient(135deg, #181818 0%, #111111 100%)',
          borderRadius: 24,
          border: `1px solid rgba(198, 255, 51, 0.2)`,
          padding: 'clamp(36px, 5vw, 56px)',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <MessageCircle size={38} color={T.accent} strokeWidth={1.5} style={{ marginBottom: 16 }} />
        <h2
          style={{
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 800,
            fontSize: 'clamp(24px, 4vw, 36px)',
            color: T.textPrimary,
            marginBottom: 12,
            letterSpacing: '-0.5px',
          }}
        >
          Need custom shirts or merch for your brand?
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-general)',
            fontSize: 16,
            color: T.textSecondary,
            maxWidth: 480,
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}
        >
          Custom bulk orders for corporate teams, events, and indie streetwear labels. Your designs, premium blanks, 10-piece minimum.
        </p>
        <a
          href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I+need+a+custom+apparel+quote"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '16px 36px',
            borderRadius: 100,
            backgroundColor: T.accent,
            color: '#0D0D0D',
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(198, 255, 51, 0.25)',
            transition: 'transform 0.2s ease',
          }}
        >
          Request Custom Quote <ArrowRight size={16} />
        </a>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────
   WISHLIST DRAWER
───────────────────────────────────────── */
/* ─────────────────────────────────────────
   WISHLIST DRAWER (Ashluxe Minimalist White)
───────────────────────────────────────── */
function WishlistDrawer({
  onQuickViewProduct,
}: {
  onQuickViewProduct: (productId: string) => void;
}) {
  const { items, removeItem, totalItems, isOpen, setIsOpen } = useWishlist();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 10005,
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ...springTransition, stiffness: 320 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 10006,
              width: '100%',
              maxWidth: 420,
              backgroundColor: '#ffffff',
              borderLeft: '1px solid #e5e5e5',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'var(--font-apparel)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Heart size={18} color="#000000" fill="#000000" />
                <h3
                  style={{
                    fontFamily: 'var(--font-apparel)',
                    fontWeight: 700,
                    fontSize: 15,
                    color: '#000000',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  Wishlist ({totalItems})
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close wishlist"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#000000',
                  padding: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 90 }}>
                  <Heart size={44} color="#cccccc" strokeWidth={1.5} style={{ margin: '0 auto' }} />
                  <p
                    style={{
                      fontFamily: 'var(--font-apparel)',
                      fontWeight: 600,
                      fontSize: 16,
                      color: '#000000',
                      marginTop: 16,
                    }}
                  >
                    Your wishlist is empty
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-apparel)',
                      fontSize: 13,
                      color: '#777777',
                      lineHeight: 1.5,
                    }}
                  >
                    Save your favorite pieces here to easily view and order them later.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      style={{
                        display: 'flex',
                        gap: 14,
                        paddingBottom: 16,
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      {item.image && (
                        <div
                          style={{
                            width: 68,
                            height: 88,
                            overflow: 'hidden',
                            backgroundColor: '#f5f5f5',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.productName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}

                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <p
                            style={{
                              fontFamily: 'var(--font-apparel)',
                              fontWeight: 600,
                              fontSize: 14,
                              color: '#000000',
                              margin: '0 0 4px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {item.productName}
                          </p>
                          <p
                            style={{
                              fontFamily: 'var(--font-apparel)',
                              fontWeight: 700,
                              fontSize: 14,
                              color: '#000000',
                              margin: '0 0 10px',
                            }}
                          >
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              onQuickViewProduct(item.productId);
                            }}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              backgroundColor: '#000000',
                              color: '#ffffff',
                              border: 'none',
                              fontFamily: 'var(--font-apparel)',
                              fontWeight: 600,
                              fontSize: 11,
                              letterSpacing: '1px',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                              textAlign: 'center',
                            }}
                          >
                            View Piece
                          </button>
                          <button
                            onClick={() => removeItem(item.productId)}
                            aria-label="Remove item"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#999999',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              padding: 6,
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   SIZE & FIT GUIDE MODAL (Ashluxe Minimalist White)
───────────────────────────────────────── */
function SizeGuidePanel({
  isOpen,
  onClose,
  category,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 10020,
              backdropFilter: 'blur(4px)',
            }}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ ...springTransition, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10021,
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e5e5e5',
              padding: '32px 28px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
              maxWidth: 700,
              margin: '0 auto',
              fontFamily: 'var(--font-apparel)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Ruler size={20} color="#000000" />
                <h3
                  style={{
                    fontFamily: 'var(--font-apparel)',
                    fontWeight: 700,
                    fontSize: 17,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#000000',
                    margin: 0,
                  }}
                >
                  Size & Silhouette Guide
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close size guide"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#000000',
                  padding: 4,
                }}
              >
                <X size={20} />
              </button>
            </div>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontFamily: 'var(--font-apparel)',
                fontSize: 13,
                marginBottom: 20,
              }}
            >
              <thead>
                <tr style={{ borderBottom: '2px solid #000000' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Size
                  </th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Chest Width (in)
                  </th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Body Length (in)
                  </th>
                </tr>
              </thead>
              <tbody>
                {(category === 'cap'
                  ? [{ size: 'One Size (Adjustable)', chest: '—', length: '—' }]
                  : [
                      { size: 'S', chest: '38', length: '28' },
                      { size: 'M', chest: '40', length: '29' },
                      { size: 'L', chest: '43', length: '30' },
                      { size: 'XL', chest: '46', length: '31' },
                      { size: 'XXL', chest: '49', length: '32' },
                    ]
                ).map((row) => (
                  <tr key={row.size} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px', fontWeight: 600, color: '#000000' }}>
                      {row.size}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#555555' }}>
                      {row.chest}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#555555' }}>
                      {row.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p
              style={{
                fontFamily: 'var(--font-apparel)',
                fontSize: 13,
                color: '#666666',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {category === 'cap'
                ? 'One size fits all head profiles. Features an adjustable strap closure with custom metal buckle at the rear.'
                : 'All Silk Studio tees feature a modern, relaxed streetwear drape engineered from 260gsm heavyweight combed cotton. For a standard boxy fit, select your true size. For a dramatic oversized silhouette, size up one.'}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   PRODUCT DETAIL (Ashluxe Full-Screen White / Cream)
───────────────────────────────────────── */
function ProductDetail({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImage, setCurrentImage] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('desc');

  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  const wishlisted = isInWishlist(product.id);

  // Lock body scroll when full-screen product detail is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Auto-select single size (e.g. for Caps)
  useEffect(() => {
    if (product.variants?.length === 1) {
      setSelectedSize(product.variants[0].size);
    } else if (product.variants && product.variants.length > 0) {
      // Find first available size
      const firstInStock = product.variants.find((v) => v.stock > 0);
      if (firstInStock) {
        setSelectedSize(firstInStock.size);
      }
    }
  }, [product]);

  const selectedVariant = product.variants?.find((v) => v.size === selectedSize);
  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;
    addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        productName: product.name,
        size: selectedVariant.size,
        price: product.price,
        image: product.image_1_url,
      },
      quantity
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const images = [product.image_1_url, product.image_2_url].filter(Boolean) as string[];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 1 ? images.length : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === images.length ? 1 : prev + 1));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.3, ease: EASE }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          backgroundColor: '#ffffff',
          overflowY: 'auto',
          fontFamily: 'var(--font-apparel)',
        }}
      >
        {/* Sticky Top Header Bar */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            height: 64,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            zIndex: 20,
          }}
        >
          {/* Back button */}
          <button
            onClick={onClose}
            aria-label="Back to collection"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-apparel)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#000000',
              padding: '6px 0',
            }}
          >
            <ArrowLeft size={16} strokeWidth={1.75} />
            <span style={{ display: 'inline-block' }}>Back to Shop</span>
          </button>

          {/* Logo Center */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/apparel-logo.svg"
              alt="Silk Studio"
              style={{ height: 26, width: 'auto' }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close product view"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#000000',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </header>

        {/* Main Product View (Ashluxe 2-Column Layout) */}
        <div
          style={{
            maxWidth: 1320,
            margin: '0 auto',
            padding: '24px 20px 80px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(28px, 5vw, 64px)',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Product Imagery */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3/4',
                backgroundColor: '#FAFAF8', // Ashluxe cream background
                overflow: 'hidden',
                border: '1px solid #f0f0ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Product Images */}
              {images.map((imgUrl, index) => (
                <img
                  key={imgUrl}
                  src={imgUrl}
                  alt={`${product.name} view ${index + 1}`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: currentImage === index + 1 ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                  }}
                />
              ))}

              {/* Prev / Next Arrows (Ashluxe style < >) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #e5e5e5',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000000',
                      zIndex: 5,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <ChevronLeft size={20} strokeWidth={1.5} />
                  </button>

                  <button
                    onClick={handleNextImage}
                    aria-label="Next image"
                    style={{
                      position: 'absolute',
                      right: 14,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #e5e5e5',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000000',
                      zIndex: 5,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                  >
                    <ChevronRight size={20} strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Selectors / Indicators */}
            {images.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 10,
                  marginTop: 14,
                }}
              >
                {images.map((imgUrl, idx) => (
                  <button
                    key={imgUrl}
                    onClick={() => setCurrentImage(idx + 1)}
                    style={{
                      width: 60,
                      height: 72,
                      padding: 0,
                      border: currentImage === idx + 1 ? '1.5px solid #000000' : '1px solid #e5e5e5',
                      backgroundColor: '#FAFAF8',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      opacity: currentImage === idx + 1 ? 1 : 0.6,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Purchase Controls */}
          <div style={{ padding: '0 4px' }}>
            {/* Category / Sub-identifier */}
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#888888',
                marginBottom: 6,
              }}
            >
              {product.category === 'tee' ? 'Studio Apparel // Drop 001' : 'Headwear // Core Essentials'}
            </div>

            {/* Product Title (Helvetica, bold, clean) */}
            <h1
              style={{
                fontFamily: 'var(--font-apparel)',
                fontSize: 'clamp(24px, 3.5vw, 32px)',
                fontWeight: 400,
                color: '#000000',
                margin: '0 0 10px',
                letterSpacing: '-0.3px',
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h1>

            {/* Price (Medium weight Helvetica) */}
            <div
              style={{
                fontFamily: 'var(--font-apparel)',
                fontSize: 22,
                fontWeight: 600,
                color: '#000000',
                marginBottom: 24,
              }}
            >
              {formatPrice(product.price)}
            </div>

            {/* Color Indicator */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#777777',
                  marginBottom: 6,
                }}
              >
                COLOR
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#000000',
                }}
              >
                {product.category === 'cap' ? 'Vintage White' : 'Cream / Natural Cotton'}
              </div>
            </div>

            {/* Size Selector (Ashluxe Rectangular Grid) */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#777777',
                  }}
                >
                  SIZE
                </span>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-apparel)',
                    fontSize: 12,
                    color: '#000000',
                    textDecoration: 'underline',
                    padding: 0,
                  }}
                >
                  Size & Fit Guide
                </button>
              </div>

              {/* Size grid boxes */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.max(product.variants?.length || 4, 4)}, 1fr)`,
                  border: '1px solid #000000',
                  gap: 0,
                }}
              >
                {product.variants?.map((variant, index) => {
                  const isSelected = selectedSize === variant.size;
                  const outOfStock = variant.stock <= 0;

                  return (
                    <button
                      key={variant.id}
                      onClick={() => !outOfStock && setSelectedSize(variant.size)}
                      disabled={outOfStock}
                      style={{
                        height: 48,
                        backgroundColor: isSelected
                          ? '#000000'
                          : outOfStock
                          ? '#F7F7F7'
                          : '#ffffff',
                        color: isSelected
                          ? '#ffffff'
                          : outOfStock
                          ? '#bbbbbb'
                          : '#000000',
                        border: 'none',
                        borderLeft: index > 0 ? '1px solid #000000' : 'none',
                        fontFamily: 'var(--font-apparel)',
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        cursor: outOfStock ? 'not-allowed' : 'pointer',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.15s ease, color 0.15s ease',
                      }}
                    >
                      <span>{variant.size}</span>
                      {outOfStock && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                          }}
                        >
                          <div
                            style={{
                              width: '80%',
                              height: 1,
                              backgroundColor: '#cccccc',
                              transform: 'rotate(-25deg)',
                            }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#777777',
                }}
              >
                QTY
              </span>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid #000000',
                  height: 40,
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  style={{
                    width: 38,
                    height: '100%',
                    border: 'none',
                    background: 'none',
                    color: quantity <= 1 ? '#cccccc' : '#000000',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Minus size={14} />
                </button>
                <span
                  style={{
                    width: 34,
                    textAlign: 'center',
                    fontFamily: 'var(--font-apparel)',
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#000000',
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(
                      Math.min(selectedVariant ? selectedVariant.stock : 99, quantity + 1)
                    )
                  }
                  aria-label="Increase quantity"
                  style={{
                    width: 38,
                    height: '100%',
                    border: 'none',
                    background: 'none',
                    color: '#000000',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons (Ashluxe Style) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
              {/* ADD TO BAG Button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || isOutOfStock}
                style={{
                  width: '100%',
                  height: 52,
                  backgroundColor: !selectedSize || isOutOfStock ? '#666666' : addedToCart ? '#10B981' : '#000000',
                  color: '#ffffff',
                  border: 'none',
                  fontFamily: 'var(--font-apparel)',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: !selectedSize || isOutOfStock ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  transition: 'background-color 0.2s ease',
                }}
              >
                {addedToCart ? (
                  <>
                    <Check size={18} strokeWidth={2.5} />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>
                    {!selectedSize
                      ? 'Select Size'
                      : isOutOfStock
                      ? 'Out of Stock'
                      : `Add to Bag`}
                  </span>
                )}
              </button>

              {/* ADD TO WISHLIST Button */}
              <button
                onClick={() =>
                  toggleItem({
                    productId: product.id,
                    productName: product.name,
                    price: product.price,
                    image: product.image_1_url,
                    category: product.category,
                  })
                }
                style={{
                  width: '100%',
                  height: 48,
                  backgroundColor: '#ffffff',
                  color: wishlisted ? '#FF385C' : '#000000',
                  border: '1px solid #000000',
                  fontFamily: 'var(--font-apparel)',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background-color 0.2s ease',
                }}
              >
                <Heart
                  size={16}
                  fill={wishlisted ? '#FF385C' : 'none'}
                  color={wishlisted ? '#FF385C' : '#000000'}
                />
                <span>{wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Expandable Accordion Sections (Ashluxe Style) */}
            <div style={{ borderTop: '1px solid #e5e5e5' }}>
              {/* Product Description Accordion */}
              <div style={{ borderBottom: '1px solid #e5e5e5' }}>
                <button
                  onClick={() =>
                    setActiveAccordion(activeAccordion === 'desc' ? null : 'desc')
                  }
                  style={{
                    width: '100%',
                    padding: '18px 0',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-apparel)',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#000000',
                  }}
                >
                  <span>Product Description</span>
                  <span style={{ fontSize: 18, fontWeight: 300 }}>
                    {activeAccordion === 'desc' ? '−' : '+'}
                  </span>
                </button>
                {activeAccordion === 'desc' && (
                  <div
                    style={{
                      paddingBottom: 20,
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: '#666666',
                    }}
                  >
                    <p style={{ margin: '0 0 12px' }}>
                      {product.description ||
                        'Crafted from luxury 260gsm heavyweight combed cotton, cut in a modern boxy silhouette with reinforced ribbing and high-density studio graphic detailing.'}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <li>100% Heavyweight Combed Cotton</li>
                      <li>Pre-shrunk fabric with vintage enzyme wash</li>
                      <li>Custom Silk Studio neck label & hem tag</li>
                      <li>Designed & finished in Lagos, Nigeria</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Shipping & Returns Accordion */}
              <div style={{ borderBottom: '1px solid #e5e5e5' }}>
                <button
                  onClick={() =>
                    setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')
                  }
                  style={{
                    width: '100%',
                    padding: '18px 0',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-apparel)',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#000000',
                  }}
                >
                  <span>Shipping & Returns</span>
                  <span style={{ fontSize: 18, fontWeight: 300 }}>
                    {activeAccordion === 'shipping' ? '−' : '+'}
                  </span>
                </button>
                {activeAccordion === 'shipping' && (
                  <div
                    style={{
                      paddingBottom: 20,
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: '#666666',
                    }}
                  >
                    <p style={{ margin: '0 0 10px' }}>
                      <strong>Lagos Delivery:</strong> 24–48 hours direct courier.
                    </p>
                    <p style={{ margin: '0 0 10px' }}>
                      <strong>Nationwide Nigeria:</strong> 2–4 business days via express dispatch.
                    </p>
                    <p style={{ margin: 0 }}>
                      Exchanges accepted within 7 days of delivery for unworn items with original tags attached.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Size Guide Overlay */}
      <SizeGuidePanel
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        category={product.category}
      />
    </>
  );
}

/* ─────────────────────────────────────────
   CART DRAWER (Ashluxe Minimalist White)
───────────────────────────────────────── */
function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isOpen, setIsOpen } = useCart();
  const threshold = 10; // Free delivery threshold
  const unlocked = totalItems >= threshold;
  const progress = Math.min(totalItems / threshold, 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 10005,
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ...springTransition, stiffness: 320 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 10006,
              width: '100%',
              maxWidth: 420,
              backgroundColor: '#ffffff',
              borderLeft: '1px solid #e5e5e5',
              boxShadow: '-10px 0 40px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'var(--font-apparel)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-apparel)',
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: '#000000',
                  margin: 0,
                }}
              >
                Your Bag ({totalItems})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close bag"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#000000',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 90 }}>
                  <ShoppingBag size={44} color="#cccccc" strokeWidth={1.5} style={{ margin: '0 auto' }} />
                  <p
                    style={{
                      fontFamily: 'var(--font-apparel)',
                      fontWeight: 600,
                      fontSize: 16,
                      color: '#000000',
                      marginTop: 16,
                    }}
                  >
                    Your shopping bag is empty
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-apparel)',
                      fontSize: 13,
                      color: '#777777',
                    }}
                  >
                    Explore our collection and add pieces to your bag.
                  </p>
                </div>
              ) : (
                <>
                  {/* Delivery Progress Bar */}
                  <div
                    style={{
                      padding: '12px 14px',
                      backgroundColor: '#FAFAF8',
                      border: '1px solid #e5e5e5',
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <Truck size={14} color="#000000" />
                      <span
                        style={{
                          fontFamily: 'var(--font-apparel)',
                          fontWeight: 500,
                          fontSize: 12,
                          color: '#000000',
                        }}
                      >
                        {unlocked
                          ? 'Free nationwide delivery unlocked!'
                          : `Add ${threshold - totalItems} more piece${
                              threshold - totalItems === 1 ? '' : 's'
                            } for free delivery`}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 3,
                        backgroundColor: '#e5e5e5',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${progress * 100}%`,
                          backgroundColor: '#000000',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Items List */}
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.variantId}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          display: 'flex',
                          gap: 14,
                          padding: '14px 0',
                          borderBottom: '1px solid #f0f0f0',
                          overflow: 'hidden',
                        }}
                      >
                        {item.image && (
                          <div
                            style={{
                              width: 68,
                              height: 88,
                              overflow: 'hidden',
                              backgroundColor: '#FAFAF8',
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.productName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <p
                              style={{
                                fontFamily: 'var(--font-apparel)',
                                fontWeight: 600,
                                fontSize: 13,
                                color: '#000000',
                                margin: '0 0 2px',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.productName}
                            </p>
                            <p
                              style={{
                                fontFamily: 'var(--font-apparel)',
                                fontSize: 12,
                                color: '#777777',
                                margin: '0 0 6px',
                              }}
                            >
                              Size: {item.size}
                            </p>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <button
                                onClick={() => removeItem(item.variantId)}
                                aria-label="Remove item"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#999999',
                                  cursor: 'pointer',
                                  padding: 4,
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  border: '1px solid #000000',
                                }}
                              >
                                <button
                                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                  style={{
                                    width: 22,
                                    height: 22,
                                    border: 'none',
                                    background: 'none',
                                    color: '#000000',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Minus size={10} />
                                </button>
                                <span
                                  style={{
                                    fontFamily: 'var(--font-apparel)',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: '#000000',
                                    width: 20,
                                    textAlign: 'center',
                                  }}
                                >
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                  style={{
                                    width: 22,
                                    height: 22,
                                    border: 'none',
                                    background: 'none',
                                    color: '#000000',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            </div>

                            <p
                              style={{
                                fontFamily: 'var(--font-apparel)',
                                fontWeight: 700,
                                fontSize: 13,
                                color: '#000000',
                                margin: 0,
                              }}
                            >
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                style={{
                  padding: '20px 24px',
                  borderTop: '1px solid #f0f0f0',
                  backgroundColor: '#ffffff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-apparel)',
                      fontWeight: 600,
                      fontSize: 13,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: '#777777',
                    }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-apparel)',
                      fontWeight: 700,
                      fontSize: 18,
                      color: '#000000',
                    }}
                  >
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <a
                  href="/apparel/checkout"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    width: '100%',
                    height: 50,
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontFamily: 'var(--font-apparel)',
                    fontWeight: 600,
                    fontSize: 13,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   FLOATING ACTION BUTTONS (Cart & Wishlist)
───────────────────────────────────────── */
function FloatingShopBar() {
  const { totalItems: cartCount, setIsOpen: setCartOpen } = useCart();
  const { totalItems: wishlistCount, setIsOpen: setWishlistOpen } = useWishlist();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 30,
        right: 24,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Wishlist Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={springTransition}
        onClick={() => setWishlistOpen(true)}
        aria-label="Open wishlist"
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: '#161616',
          border: `1px solid ${T.border}`,
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Heart
          size={20}
          color={wishlistCount > 0 ? T.heartActive : T.textPrimary}
          fill={wishlistCount > 0 ? T.heartActive : 'none'}
        />
        {wishlistCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -3,
              right: -3,
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: T.heartActive,
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 5px',
            }}
          >
            {wishlistCount}
          </span>
        )}
      </motion.button>

      {/* Cart Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, ...springTransition }}
        onClick={() => setCartOpen(true)}
        aria-label="Open cart"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: T.accent,
          border: 'none',
          boxShadow: '0 8px 30px rgba(198, 255, 51, 0.35)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <ShoppingBag size={22} color="#0D0D0D" strokeWidth={2.2} />
        {cartCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              minWidth: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: '#0D0D0D',
              color: T.accent,
              border: `1px solid ${T.accent}`,
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 6px',
            }}
          >
            {cartCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN APPAREL PAGE
───────────────────────────────────────── */
export default function ApparelPage() {
  const [showAll, setShowAll] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const arrivalsRef = useRef<HTMLElement>(null);
  const { products } = useProducts();

  const handleShopNowClick = () => {
    if (arrivalsRef.current) {
      arrivalsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickViewFromWishlist = (productId: string) => {
    const p = products.find((item) => item.id === productId);
    if (p) setSelectedProduct(p);
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        overflowX: 'hidden',
      }}
    >
      {/* Hero Slideshow — Ashluxe-inspired */}
      <ApparelHero onShopNowClick={handleShopNowClick} />

      {/* New Arrivals Grid — Ashluxe-inspired */}
      <NewArrivalsGrid
        sectionRef={arrivalsRef}
        onSelectProduct={setSelectedProduct}
        showAll={showAll}
        onViewAll={() => setShowAll(true)}
      />

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* Drawers */}
      <WishlistDrawer onQuickViewProduct={handleQuickViewFromWishlist} />
      <CartDrawer />
    </div>
  );
}
