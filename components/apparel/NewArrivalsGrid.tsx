'use client';

import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import { useProducts, Product } from '@/lib/useProducts';
import { useWishlist } from '@/lib/WishlistContext';
import { useCart } from '@/lib/CartContext';
import { usePriceDisplay } from '@/lib/usePriceDisplay';

/* ─────────────────────────────────────────
   Design Constants
───────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────
   Price Display Component
   Uses the usePriceDisplay hook to show
   Naira primary + optional USD approximate.
───────────────────────────────────────── */
function PriceTag({ amount }: { amount: number }) {
  const { primary, approximate } = usePriceDisplay(amount);
  return (
    <div>
      <p className="product-card__price">{primary}</p>
      {approximate && (
        <p className="product-card__price-approx">{approximate}</p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Single Product Card
   Matches Ashluxe reference: image swap on
   hover, size selector reveal, wishlist heart,
   NEW badge, + icon.
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
  const [touched, setTouched] = useState(false);
  const { isInWishlist, toggleItem } = useWishlist();
  const { addItem } = useCart();
  const prefersReduced = useReducedMotion();

  const wishlisted = isInWishlist(product.id);

  // Determine if this is a "new" product (created within last 30 days)
  const isNew =
    product.created_at &&
    Date.now() - new Date(product.created_at).getTime() < 30 * 24 * 60 * 60 * 1000;

  // Extract primary color label from variants
  const colorLabel = product.variants?.find((v) => v.color)?.color || null;

  // Unique sizes from variants
  const sizes = product.variants
    ? Array.from(new Map(product.variants.map((v) => [v.size, v])).values())
    : [];

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

  const handleSizeClick = (e: React.MouseEvent, variant: typeof sizes[0]) => {
    e.stopPropagation();
    if (variant.stock <= 0) return;
    addItem({
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
      size: variant.size,
      price: product.price,
      image: product.image_1_url,
    });
  };

  const handleTouchToggle = useCallback(() => {
    setTouched((prev) => !prev);
  }, []);

  return (
    <motion.div
      className={`product-card${touched ? ' product-card--touched' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: prefersReduced ? 0 : 0.5,
        delay: prefersReduced ? 0 : index * 0.05,
        ease: EASE,
      }}
      onClick={() => onSelect(product)}
      onTouchStart={handleTouchToggle}
    >
      {/* Image container */}
      <div className="product-card__image-container">
        {/* Primary image */}
        {product.image_1_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_1_url}
            alt={product.name}
            className="product-card__image"
            loading={index < 4 ? 'eager' : 'lazy'}
            draggable={false}
          />
        )}

        {/* Alt image (shown on hover) */}
        {product.image_2_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_2_url}
            alt={`${product.name} alternate view`}
            className="product-card__image product-card__image--alt"
            loading="lazy"
            draggable={false}
          />
        )}

        {/* NEW badge */}
        {isNew && (
          <span className="product-card__badge" aria-label="New product">
            NEW
          </span>
        )}

        {/* Wishlist heart */}
        <button
          className={`product-card__heart${wishlisted ? ' product-card__heart--active' : ''}`}
          onClick={handleHeartClick}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart
            size={18}
            strokeWidth={1.5}
            fill={wishlisted ? '#000000' : 'none'}
          />
        </button>

        {/* Plus icon (Ashluxe style) */}
        <button
          className="product-card__plus"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          aria-label={`Quick view ${product.name}`}
        >
          <Plus size={20} strokeWidth={1.5} />
        </button>

        {/* Size selector overlay (hover/touch reveal) */}
        {sizes.length > 0 && (
          <div className="product-card__sizes" aria-label="Select size">
            {sizes.map((variant) => (
              <button
                key={variant.id}
                className={`product-card__size-btn${variant.stock <= 0 ? ' product-card__size-btn--oos' : ''}`}
                onClick={(e) => handleSizeClick(e, variant)}
                disabled={variant.stock <= 0}
                aria-label={`Size ${variant.size}${variant.stock <= 0 ? ' — out of stock' : ''}`}
              >
                {variant.size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card text */}
      <div>
        <p className="product-card__name">{product.name}</p>
        {colorLabel && <p className="product-card__color">{colorLabel}</p>}
        <PriceTag amount={product.price} />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Skeleton Card (loading state)
───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="product-card">
      <div
        className="product-card__image-container apparel-skeleton"
        style={{ marginBottom: 12 }}
      />
      <div
        className="apparel-skeleton"
        style={{ height: 14, width: '70%', borderRadius: 3, marginBottom: 6 }}
      />
      <div
        className="apparel-skeleton"
        style={{ height: 12, width: '40%', borderRadius: 3, marginBottom: 6 }}
      />
      <div
        className="apparel-skeleton"
        style={{ height: 14, width: '35%', borderRadius: 3 }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   NEW ARRIVALS GRID
   Matches Ashluxe reference: underlined heading,
   "VIEW ALL" link, 2-col mobile / 4-5 col desktop.
───────────────────────────────────────── */

interface NewArrivalsGridProps {
  sectionRef: React.RefObject<HTMLElement>;
  onSelectProduct: (p: Product) => void;
  showAll?: boolean;
  onViewAll?: () => void;
}

const CATEGORIES = [
  { label: 'ALL PIECES', value: 'all' },
  { label: 'TEES', value: 'tee' },
  { label: 'HOODIES', value: 'hoodie' },
  { label: 'SHIRTS', value: 'shirt' },
  { label: 'HEADWEAR', value: 'cap' },
];

export default function NewArrivalsGrid({
  sectionRef,
  onSelectProduct,
  showAll = false,
  onViewAll,
}: NewArrivalsGridProps) {
  const { products, loading, error } = useProducts();
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter products by selected category
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter((p) => p.category === activeCategory);

  // Show first 5 products as "New Arrivals" unless showAll is true or user filtered
  const displayProducts = showAll || activeCategory !== 'all'
    ? filteredProducts
    : filteredProducts.slice(0, 5);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      id="new-arrivals"
      className="new-arrivals"
      aria-label="New Arrivals"
    >
      {/* Header */}
      <div className="new-arrivals__header" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <h2 className="new-arrivals__title">
            {showAll ? 'ALL COLLECTION' : 'NEW ARRIVALS'}
          </h2>
          <span
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-apparel)',
              color: '#888888',
              letterSpacing: '0.5px',
            }}
          >
            ({displayProducts.length} {displayProducts.length === 1 ? 'Piece' : 'Pieces'})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Category Filter Pills when showAll is active */}
          {showAll && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  style={{
                    background: activeCategory === cat.value ? '#000000' : 'none',
                    color: activeCategory === cat.value ? '#ffffff' : '#666666',
                    border: '1px solid #e5e5e5',
                    padding: '4px 10px',
                    fontFamily: 'var(--font-apparel)',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {onViewAll && (
            <button
              className="new-arrivals__view-all"
              onClick={onViewAll}
              aria-label={showAll ? 'Show less products' : 'View all products'}
              style={{
                fontFamily: 'var(--font-apparel)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#000000',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              {showAll ? 'EXPANDED' : 'VIEW ALL'}
            </button>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            textAlign: 'center',
            padding: 60,
            color: '#999',
            fontFamily: 'var(--font-apparel)',
            fontSize: 15,
          }}
        >
          Unable to load products. Please try again.
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="new-arrivals__grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && displayProducts.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: 80,
            color: '#999',
            fontFamily: 'var(--font-apparel)',
            fontSize: 15,
          }}
        >
          No products available yet. Check back soon.
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && displayProducts.length > 0 && (
        <div className="new-arrivals__grid">
          {displayProducts.map((product, i) => (
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
