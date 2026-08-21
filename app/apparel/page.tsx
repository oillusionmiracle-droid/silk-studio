'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import GSAPTitle from '@/components/GSAPTitle';
import { useProducts, useCategoryStats, Product, Variant } from '@/lib/useProducts';
import { useReviews, Review } from '@/lib/useReviews';
import { useCart } from '@/lib/CartContext';
import {
  ShoppingCart, X, Plus, Minus, Trash2, Star, Check, Truck,
  ChevronDown, ChevronUp, Ruler, Filter, Package, ArrowRight,
  CheckCircle2, MessageCircle,
} from 'lucide-react';

/* ─────────────────────────────────────────
   DESIGN TOKENS — derived from reference screenshots
───────────────────────────────────────── */
const T = {
  bg: '#F8F5F1',
  card: 'rgba(255, 230, 240, 0.45)',
  cardHover: 'rgba(255, 220, 235, 0.65)',
  cardBorder: 'rgba(255, 255, 255, 0.6)',
  accent: '#E85D8C',
  accent2: '#B088F9',
  text: '#1A1A2E',
  textMuted: '#6B7280',
  white: '#FFFFFF',
  gradient: 'linear-gradient(135deg, #FFE6F0 0%, #E8D5F5 50%, #D5E8F5 100%)',
  gradientCard: 'linear-gradient(135deg, rgba(255,230,240,0.55) 0%, rgba(232,213,245,0.45) 50%, rgba(213,232,245,0.4) 100%)',
  glass: 'rgba(255, 255, 255, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.7)',
  shadow: '0 8px 32px rgba(0,0,0,0.08)',
  shadowHover: '0 16px 48px rgba(0,0,0,0.14)',
  progressBg: 'rgba(0,0,0,0.06)',
  progressFill: '#E85D8C',
  progressUnlocked: '#10B981',
};

const EASE = [0.16, 1, 0.3, 1] as const;
const springTransition = { type: 'spring' as const, stiffness: 400, damping: 28 };

const formatPrice = (n: number) => `\u20A6${n.toLocaleString()}`;

/* ─────────────────────────────────────────
   AMBIENT GRADIENT ORBS
───────────────────────────────────────── */
function AmbientOrbs() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes orbDrift1 { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(120px,80px) scale(1.1)} 66%{transform:translate(-60px,140px) scale(0.95)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes orbDrift2 { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(-100px,60px) scale(1.08)} 66%{transform:translate(80px,-40px) scale(0.92)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes orbDrift3 { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-100px) scale(1.05)} 66%{transform:translate(-80px,60px) scale(1.1)} 100%{transform:translate(0,0) scale(1)} }
        @media (prefers-reduced-motion: reduce) { .ambient-orb { animation: none !important; } }
      `}</style>
      <div className="ambient-orb" style={{
        position: 'absolute', top: '-15%', left: '-10%', width: '50vw', height: '50vw',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,93,140,0.12) 0%, transparent 70%)',
        animation: 'orbDrift1 25s ease-in-out infinite', filter: 'blur(60px)',
      }} />
      <div className="ambient-orb" style={{
        position: 'absolute', top: '30%', right: '-15%', width: '45vw', height: '45vw',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(176,136,249,0.1) 0%, transparent 70%)',
        animation: 'orbDrift2 30s ease-in-out infinite', filter: 'blur(60px)',
      }} />
      <div className="ambient-orb" style={{
        position: 'absolute', bottom: '-10%', left: '20%', width: '40vw', height: '40vw',
        borderRadius: '50%', background: 'radial-gradient(circle, rgba(213,232,245,0.15) 0%, transparent 70%)',
        animation: 'orbDrift3 20s ease-in-out infinite', filter: 'blur(60px)',
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   STAR RATING (lucide)
───────────────────────────────────────── */
function StarRating({ rating, size = 16, color = '#F59E0B' }: { rating: number; size?: number; color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(rating) ? color : 'none'}
          color={i <= Math.round(rating) ? color : '#D1D5DB'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   SKELETON LOADER
───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        borderRadius: 20, overflow: 'hidden',
        background: T.glass, backdropFilter: 'blur(16px)',
        border: `1px solid ${T.glassBorder}`,
      }}
    >
      <div style={{ aspectRatio: '3/4', background: 'linear-gradient(110deg, #f0f0f0 8%, #e8e8e8 18%, #f0f0f0 33%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      <div style={{ padding: 16 }}>
        <div style={{ height: 16, width: '70%', background: '#e5e5e5', borderRadius: 8, marginBottom: 8 }} />
        <div style={{ height: 14, width: '40%', background: '#e5e5e5', borderRadius: 8 }} />
      </div>
      <style>{`@keyframes shimmer { to { background-position-x: -200%; } }`}</style>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────── */
function ShopHero() {
  return (
    <section style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: 24, paddingRight: 24, textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            background: T.glass, backdropFilter: 'blur(12px)',
            border: `1px solid ${T.glassBorder}`,
            marginBottom: 24,
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3,
            color: T.textMuted, textTransform: 'uppercase' as const,
          }}
        >
          <Package size={14} strokeWidth={2} color={T.accent} />
          Silk Apparel
        </motion.div>
        <GSAPTitle
          as="h1"
          style={{
            fontFamily: 'var(--font-jakarta)', fontWeight: 900,
            fontSize: 'clamp(36px, 6vw, 68px)', lineHeight: 1.05,
            letterSpacing: '-1px', color: T.text, marginBottom: 20,
          }}
        >
          Wears that speak <span style={{ color: T.accent }}>for themselves.</span>
        </GSAPTitle>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: T.textMuted, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}
        >
          Premium print-on-demand tees, hoodies and caps. Designed in Lagos, made for everywhere.
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CATEGORY BROWSE
───────────────────────────────────────── */
const CATEGORIES = [
  { key: 'tee', label: 'T-Shirts', icon: '1' },
  { key: 'hoodie', label: 'Hoodies', icon: '2' },
  { key: 'cap', label: 'Caps', icon: '3' },
] as const;

function CategoryBrowse({ selected, onSelect }: { selected: string | null; onSelect: (cat: string | null) => void }) {
  const { stats, loading } = useCategoryStats();

  return (
    <section style={{ maxWidth: 900, margin: '0 auto 48px', padding: '0 24px', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {CATEGORIES.map((cat, i) => {
          const isSelected = selected === cat.key;
          const stat = stats[cat.key];
          return (
            <motion.button
              key={cat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(isSelected ? null : cat.key)}
              style={{
                cursor: 'pointer', border: 'none', textAlign: 'left',
                padding: 'clamp(16px, 3vw, 24px)',
                borderRadius: 20,
                background: isSelected ? T.gradientCard : T.glass,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: isSelected ? T.shadowHover : T.shadow,
                outline: isSelected ? `2px solid ${T.accent}` : `1px solid ${T.glassBorder}`,
                transition: 'box-shadow 0.3s ease, outline 0.3s ease, background 0.3s ease',
              }}
            >
              <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 'clamp(16px, 2.5vw, 20px)', color: T.text, marginBottom: 4 }}>
                {cat.label}
              </p>
              {loading ? (
                <div style={{ height: 14, width: 80, background: '#e5e5e5', borderRadius: 7 }} />
              ) : stat ? (
                <p style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: T.textMuted, margin: 0 }}>
                  {stat.count} items &middot; From {formatPrice(stat.minPrice)}
                </p>
              ) : (
                <p style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: T.textMuted, margin: 0 }}>
                  Coming soon
                </p>
              )}
              {isSelected && (
                <motion.div
                  layoutId="categoryIndicator"
                  style={{ width: 24, height: 3, borderRadius: 2, background: T.accent, marginTop: 8 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────── */
function ProductCard({ product, index, onSelect }: { product: Product; index: number; onSelect: (p: Product) => void }) {
  const [hovered, setHovered] = useState(false);
  const prefersReduced = useReducedMotion();
  const avgRating = product.variants?.length ? 0 : 0; // Rating computed in detail view

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      whileHover={prefersReduced ? {} : { y: -6, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect(product)}
      style={{
        cursor: 'pointer', borderRadius: 20, overflow: 'hidden',
        background: T.glass, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${T.glassBorder}`,
        boxShadow: hovered ? T.shadowHover : T.shadow,
        transition: 'box-shadow 0.35s ease',
      }}
    >
      {/* Image with crossfade */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#f0f0f0' }}>
        {product.image_1_url && (
          <img
            src={product.image_1_url}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              opacity: hovered && product.image_2_url ? 0 : 1,
              transition: 'opacity 0.5s ease',
            }}
          />
        )}
        {product.image_2_url && (
          <img
            src={product.image_2_url}
            alt={`${product.name} alternate`}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />
        )}
      </div>
      {/* Info */}
      <div style={{ padding: '14px 16px 16px' }}>
        <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 15, color: T.text, marginBottom: 4, lineHeight: 1.3 }}>
          {product.name}
        </p>
        <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16, color: T.accent, margin: 0 }}>
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   PRODUCT GRID
───────────────────────────────────────── */
function ProductGrid({ category, onSelectProduct }: { category: string | null; onSelectProduct: (p: Product) => void }) {
  const { products, loading, error } = useProducts(category);

  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px', position: 'relative', zIndex: 1 }}>
      {error && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: 48, background: T.glass, borderRadius: 20, border: `1px solid ${T.glassBorder}` }}
        >
          <p style={{ fontFamily: 'var(--font-general)', color: T.textMuted }}>Unable to load products. Please try again.</p>
        </motion.div>
      )}

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: 64, background: T.glass, borderRadius: 20, border: `1px solid ${T.glassBorder}` }}
        >
          <Filter size={32} color={T.textMuted} style={{ marginBottom: 12 }} />
          <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 18, color: T.text, marginBottom: 4 }}>No products found</p>
          <p style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: T.textMuted }}>Try a different category or check back soon.</p>
        </motion.div>
      )}

      {!loading && !error && products.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} onSelect={onSelectProduct} />
          ))}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────
   SIZE & FIT GUIDE PANEL
───────────────────────────────────────── */
function SizeGuidePanel({ isOpen, onClose, category }: { isOpen: boolean; onClose: () => void; category: string }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10005, backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ ...springTransition, stiffness: 300 }}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10006,
              background: T.white, borderRadius: '24px 24px 0 0',
              padding: '32px 24px', maxHeight: '75vh', overflowY: 'auto',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 20, color: T.text }}>Size & Fit Guide</h3>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={24} color={T.textMuted} />
              </button>
            </div>

            {/* TODO: Replace with real measurements once confirmed */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-general)', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${T.text}` }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: T.text }}>Size</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', color: T.text }}>Chest (in)</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', color: T.text }}>Length (in)</th>
                </tr>
              </thead>
              <tbody>
                {(category === 'cap'
                  ? [{ size: 'One Size', chest: '--', length: '--' }]
                  : [
                    { size: 'S', chest: '36-38', length: '27' },
                    { size: 'M', chest: '38-40', length: '28' },
                    { size: 'L', chest: '40-42', length: '29' },
                    { size: 'XL', chest: '42-44', length: '30' },
                    { size: 'XXL', chest: '44-46', length: '31' },
                  ]
                ).map(row => (
                  <tr key={row.size} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: T.text }}>{row.size}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: T.textMuted }}>{row.chest}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: T.textMuted }}>{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: T.textMuted, marginTop: 16, lineHeight: 1.6 }}>
              {category === 'hoodie'
                ? 'Hoodies have an oversized, relaxed fit. If you prefer a fitted look, size down.'
                : category === 'cap'
                  ? 'One size fits most. Adjustable closure at the back.'
                  : 'Tees have a relaxed, unisex fit. True to size for most. If between sizes, go up.'}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   REVIEW CARD
───────────────────────────────────────── */
function ReviewCard({ review }: { review: Review }) {
  const relativeDate = useMemo(() => {
    const diff = Date.now() - new Date(review.created_at).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  }, [review.created_at]);

  return (
    <div style={{
      padding: 16, borderRadius: 16,
      background: 'rgba(255,255,255,0.6)',
      border: '1px solid rgba(255,255,255,0.8)',
      marginBottom: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>
            {review.reviewer_name}
          </p>
          {review.size_purchased && (
            <p style={{ fontFamily: 'var(--font-general)', fontSize: 12, color: T.textMuted, margin: 0 }}>
              Size: {review.size_purchased}
            </p>
          )}
        </div>
        <p style={{ fontFamily: 'var(--font-general)', fontSize: 12, color: T.textMuted, margin: 0 }}>{relativeDate}</p>
      </div>
      <StarRating rating={review.rating} size={14} />
      {review.body && (
        <p style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: T.text, lineHeight: 1.6, marginTop: 8, margin: '8px 0 0' }}>
          {review.body}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   ANIMATED QUANTITY STEPPER
───────────────────────────────────────── */
function QuantityStepper({ value, onChange, min = 1, max = 99 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 0,
      background: 'rgba(0,0,0,0.04)', borderRadius: 100,
      border: '1px solid rgba(0,0,0,0.08)',
    }}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        style={{
          width: 36, height: 36, borderRadius: '50%', border: 'none',
          background: 'transparent', cursor: value <= min ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: value <= min ? 0.3 : 1, transition: 'opacity 0.2s',
        }}
      >
        <Minus size={16} color={T.text} strokeWidth={2} />
      </button>
      <div style={{ width: 32, textAlign: 'center', position: 'relative', overflow: 'hidden', height: 24 }}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.15, ease: EASE }}
            style={{
              fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 15,
              color: T.text, display: 'block', lineHeight: '24px',
            }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        style={{
          width: 36, height: 36, borderRadius: '50%', border: 'none',
          background: 'transparent', cursor: value >= max ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: value >= max ? 0.3 : 1, transition: 'opacity 0.2s',
        }}
      >
        <Plus size={16} color={T.text} strokeWidth={2} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   PRODUCT DETAIL MODAL
───────────────────────────────────────── */
function ProductDetail({ product, onClose }: { product: Product; onClose: () => void }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();
  const { reviews, averageRating } = useReviews(product.id);
  const [currentImage, setCurrentImage] = useState(1);

  const selectedVariant = product.variants?.find(v => v.size === selectedSize);
  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      size: selectedVariant.size,
      price: product.price,
      image: product.image_1_url,
    }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4, ease: EASE }}
        style={{
          position: 'fixed', inset: 0, zIndex: 10001,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'clamp(8px, 2.5vw, 24px)', pointerEvents: 'none',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          className="product-detail-card"
          style={{
            pointerEvents: 'auto',
            width: '100%', maxWidth: 860, maxHeight: '90vh', overflowY: 'auto',
            background: T.white, borderRadius: 24,
            boxShadow: '0 24px 70px rgba(0,0,0,0.3)',
            display: 'flex', flexWrap: 'wrap',
            position: 'relative',
          }}
        >
          {/* Images */}
          <div style={{ flex: '1 1 320px', minWidth: 260, position: 'relative', aspectRatio: '3/4', minHeight: 340, overflow: 'hidden', borderRadius: '24px 24px 0 0', background: '#f5f5f5' }}>
            <button onClick={onClose} aria-label="Close modal" style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <X size={20} color={T.text} />
            </button>
            {product.image_1_url && (
              <img src={product.image_1_url} alt={product.name} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: currentImage === 1 ? 1 : 0, transition: 'opacity 0.4s ease',
              }} />
            )}
            {product.image_2_url && (
              <img src={product.image_2_url} alt={`${product.name} back`} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: currentImage === 2 ? 1 : 0, transition: 'opacity 0.4s ease',
              }} />
            )}
            {product.image_2_url && (
              <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 3 }}>
                {[1, 2].map(n => (
                  <button key={n} onClick={() => setCurrentImage(n)} style={{
                    width: currentImage === n ? 24 : 8, height: 8, borderRadius: 4, border: 'none',
                    background: currentImage === n ? T.accent : 'rgba(255,255,255,0.6)',
                    cursor: 'pointer', transition: 'all 0.3s ease',
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ flex: '1 1 320px', minWidth: 260, padding: 'clamp(20px, 4vw, 32px)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 'clamp(22px, 3vw, 28px)', color: T.text, marginBottom: 8 }}>
              {product.name}
            </h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <StarRating rating={averageRating} size={16} />
              <span style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: T.textMuted }}>
                {averageRating > 0 ? `${averageRating.toFixed(1)} (${reviews.length})` : 'No reviews yet'}
              </span>
            </div>

            <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 800, fontSize: 28, color: T.accent, marginBottom: 16 }}>
              {formatPrice(product.price)}
            </p>

            {product.description && (
              <p style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: T.textMuted, lineHeight: 1.7, marginBottom: 20 }}>
                {product.description}
              </p>
            )}

            {/* Size selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>Select Size</p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-general)', fontSize: 13, color: T.accent }}
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.variants?.map(variant => {
                  const isSelected = selectedSize === variant.size;
                  const outOfStock = variant.stock <= 0;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => !outOfStock && setSelectedSize(variant.size)}
                      disabled={outOfStock}
                      style={{
                        minWidth: 48, height: 44, padding: '0 14px',
                        borderRadius: 12,
                        border: isSelected ? `2px solid ${T.accent}` : '1px solid rgba(0,0,0,0.1)',
                        background: isSelected ? 'rgba(232,93,140,0.08)' : outOfStock ? '#f3f3f3' : T.white,
                        color: outOfStock ? '#ccc' : isSelected ? T.accent : T.text,
                        fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14,
                        cursor: outOfStock ? 'not-allowed' : 'pointer',
                        textDecoration: outOfStock ? 'line-through' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14, color: T.text, marginBottom: 10 }}>Quantity</p>
              <QuantityStepper value={quantity} onChange={setQuantity} max={selectedVariant ? selectedVariant.stock : 99} />
            </div>

            {/* Add to cart button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={!selectedSize || isOutOfStock}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', padding: '16px 24px', borderRadius: 100, border: 'none',
                background: !selectedSize || isOutOfStock ? '#e5e5e5' : addedToCart ? '#10B981' : T.accent,
                color: T.white,
                fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16,
                cursor: !selectedSize || isOutOfStock ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.3s ease',
                marginBottom: 16,
              }}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={20} strokeWidth={2.5} /> Added to Cart
                  </motion.span>
                ) : (
                  <motion.span key="cart" initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShoppingCart size={20} /> {!selectedSize ? 'Select a Size' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Reviews section */}
            {reviews.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <StarRating rating={averageRating} size={14} />
                  <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14, color: T.text }}>
                    {averageRating.toFixed(1)} out of 5
                  </span>
                  <span style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: T.textMuted }}>
                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <SizeGuidePanel isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} category={product.category} />
    </>
  );
}

/* ─────────────────────────────────────────
   DELIVERY PROGRESS BANNER
───────────────────────────────────────── */
function DeliveryProgress({ totalItems }: { totalItems: number }) {
  const threshold = 10;
  const unlocked = totalItems >= threshold;
  const progress = Math.min(totalItems / threshold, 1);

  return (
    <div style={{
      padding: '14px 16px', borderRadius: 16, marginBottom: 16,
      background: unlocked ? 'rgba(16,185,129,0.08)' : 'rgba(0,0,0,0.03)',
      border: `1px solid ${unlocked ? 'rgba(16,185,129,0.2)' : 'rgba(0,0,0,0.06)'}`,
      transition: 'all 0.4s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <AnimatePresence mode="wait">
          {unlocked ? (
            <motion.div key="unlocked" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springTransition}>
              <CheckCircle2 size={20} color={T.progressUnlocked} strokeWidth={2} />
            </motion.div>
          ) : (
            <motion.div key="truck" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <Truck size={20} color={T.textMuted} strokeWidth={2} />
            </motion.div>
          )}
        </AnimatePresence>
        <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 13, color: unlocked ? T.progressUnlocked : T.text, margin: 0, transition: 'color 0.4s' }}>
          {unlocked
            ? 'Free delivery unlocked!'
            : `Add ${threshold - totalItems} more item${threshold - totalItems === 1 ? '' : 's'} for free delivery`}
        </p>
      </div>
      <div style={{ width: '100%', height: 6, borderRadius: 3, background: T.progressBg, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            height: '100%', borderRadius: 3,
            background: unlocked
              ? `linear-gradient(90deg, ${T.progressUnlocked}, #34D399)`
              : `linear-gradient(90deg, ${T.accent}, ${T.accent2})`,
            transition: 'background 0.4s ease',
          }}
        />
      </div>
      {/* TODO: delivery fee logic — placeholder fee for under 10 items, ₦0 at 10+ */}
    </div>
  );
}

/* ─────────────────────────────────────────
   CART DRAWER
───────────────────────────────────────── */
function CartDrawer() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isOpen, setIsOpen } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10005, backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ...springTransition, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 10006,
              width: '100%', maxWidth: 420,
              background: T.white,
              boxShadow: '-8px 0 40px rgba(0,0,0,0.25)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 20, color: T.text, margin: 0 }}>
                Your Bag ({totalItems})
              </h3>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={24} color={T.textMuted} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 80 }}>
                  <ShoppingCart size={48} color="#e0e0e0" strokeWidth={1.5} />
                  <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 16, color: T.textMuted, marginTop: 16 }}>
                    Your bag is empty
                  </p>
                </div>
              ) : (
                <>
                  <DeliveryProgress totalItems={totalItems} />
                  <AnimatePresence>
                    {items.map(item => (
                      <motion.div
                        key={item.variantId}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #f5f5f5', overflow: 'hidden' }}
                      >
                        {item.image && (
                          <div style={{ width: 64, height: 80, borderRadius: 12, overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                            <img src={item.image} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14, color: T.text, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.productName}
                          </p>
                          <p style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: T.textMuted, margin: '0 0 10px' }}>
                            Size: {item.size}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <button onClick={() => removeItem(item.variantId)} aria-label="Remove item" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                                <Trash2 size={16} color={T.textMuted} />
                              </button>
                              <QuantityStepper value={item.quantity} onChange={v => updateQuantity(item.variantId, v)} />
                            </div>
                            <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15, color: T.text, margin: 0 }}>
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Add more items */}
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      width: '100%', padding: '12px', marginTop: 16, borderRadius: 100,
                      border: `1px solid rgba(0,0,0,0.1)`, background: 'transparent',
                      fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14, color: T.text,
                      cursor: 'pointer', transition: 'background 0.2s',
                    }}
                  >
                    <Plus size={16} /> Add more items
                  </button>
                </>
              )}
            </div>

            {/* Footer with checkout */}
            {items.length > 0 && (
              <div style={{ padding: '16px 24px 24px', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 16, color: T.text }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 800, fontSize: 20, color: T.text }}>{formatPrice(totalPrice)}</span>
                </div>
                <a
                  href="/apparel/checkout"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    width: '100%', padding: '16px 24px', borderRadius: 100, border: 'none',
                    background: T.accent, color: T.white,
                    fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16,
                    cursor: 'pointer', textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Checkout <ArrowRight size={18} />
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
   FLOATING CART BUTTON
───────────────────────────────────────── */
function FloatingCartButton() {
  const { totalItems, setIsOpen } = useCart();

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, ...springTransition }}
      onClick={() => setIsOpen(true)}
      style={{
        position: 'fixed', bottom: 90, right: 24, zIndex: 50,
        width: 56, height: 56, borderRadius: '50%',
        background: T.accent, border: 'none',
        boxShadow: '0 8px 24px rgba(232,93,140,0.35)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <ShoppingCart size={22} color={T.white} strokeWidth={2} />
      {totalItems > 0 && (
        <motion.span
          key={totalItems}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={springTransition}
          style={{
            position: 'absolute', top: -4, right: -4,
            minWidth: 22, height: 22, borderRadius: 11,
            background: T.text, color: T.white,
            fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 6px',
          }}
        >
          {totalItems}
        </motion.span>
      )}
    </motion.button>
  );
}

/* ─────────────────────────────────────────
   BULK ORDER CTA
───────────────────────────────────────── */
function BulkOrderCTA() {
  return (
    <section style={{ maxWidth: 900, margin: '0 auto 80px', padding: '0 24px', position: 'relative', zIndex: 1 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{
          background: T.gradientCard,
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 24, border: `1px solid ${T.glassBorder}`,
          padding: 'clamp(32px, 5vw, 48px)', textAlign: 'center',
          boxShadow: T.shadow,
        }}
      >
        <MessageCircle size={36} color={T.accent} strokeWidth={1.5} style={{ marginBottom: 16 }} />
        <GSAPTitle
          as="h2"
          style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 'clamp(22px, 4vw, 32px)', color: T.text, marginBottom: 12 }}
        >
          Need shirts for your event or brand?
        </GSAPTitle>
        <p style={{ fontFamily: 'var(--font-general)', fontSize: 16, color: T.textMuted, marginBottom: 28, maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.6 }}>
          Custom bulk orders — your design, your colours, your deadline. Minimum 10 pieces.
        </p>
        <a
          href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I+need+a+custom+apparel+quote"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 100,
            background: T.accent, color: T.white,
            fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 15,
            textDecoration: 'none', transition: 'opacity 0.2s, transform 0.2s',
            boxShadow: '0 4px 16px rgba(232,93,140,0.25)',
          }}
        >
          Get a Custom Quote <ArrowRight size={16} />
        </a>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PAGE ASSEMBLY
───────────────────────────────────────── */
export default function ApparelPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: T.bg, paddingBottom: 60 }}>
      <AmbientOrbs />

      <style>{`
        /* Override dark global body styles for this page */
        .apparel-page-scope { background: ${T.bg} !important; }
        /* Responsive product grid */
        @media (max-width: 640px) {
          .apparel-page-scope section { padding-left: 16px !important; padding-right: 16px !important; }
        }
        /* Ensure text contrast on light background */
        .apparel-page-scope ::selection { background: ${T.accent}; color: #fff; }
      `}</style>

      <div className="apparel-page-scope" style={{ position: 'relative', zIndex: 1 }}>
        <ShopHero />
        <CategoryBrowse selected={selectedCategory} onSelect={setSelectedCategory} />
        <ProductGrid category={selectedCategory} onSelectProduct={setSelectedProduct} />
        <BulkOrderCTA />
      </div>

      {/* Product detail modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* Cart */}
      <FloatingCartButton />
      <CartDrawer />
    </div>
  );
}
