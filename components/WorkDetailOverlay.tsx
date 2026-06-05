'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { PortfolioItem } from '@/app/data/portfolio';
import GSAPTitle from '@/components/GSAPTitle';

interface Props {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkDetailOverlay({ item, isOpen, onClose }: Props) {
  const [activeImage, setActiveImage] = useState<string>('');

  // Reset to first image (from images[] array) whenever a new item opens
  useEffect(() => {
    if (item) {
      const firstImage = item.images?.[0] ?? item.src;
      setActiveImage(firstImage);
    }
  }, [item]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // All gallery images — falls back to just src if images[] isn't populated
  const galleryImages = item?.images?.length ? item.images : item ? [item.src] : [];

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: 32,
              cursor: 'pointer',
              zIndex: 101,
            }}
          >
            &times;
          </button>

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              maxWidth: 1200,
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              overflowY: 'auto',
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Image + thumbnail strip */}
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ flex: '1 1 60%', minWidth: 300, paddingRight: 24 }}
            >
              {/* Main active image — crossfades on switch */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={item.title}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '60vh',
                    objectFit: 'cover',
                    borderRadius: 12,
                    backgroundColor: '#111',
                    display: 'block',
                  }}
                />
              </AnimatePresence>

              {/* Thumbnail strip — ALL images from item.images[] */}
              {galleryImages.length > 1 && (
                <div style={{
                  display: 'flex',
                  gap: 10,
                  marginTop: 14,
                  flexWrap: 'wrap',
                }}>
                  {galleryImages.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(thumb)}
                      style={{
                        width: 64,
                        height: 64,
                        padding: 0,
                        border: activeImage === thumb
                          ? '2px solid #C6FF33'
                          : '2px solid rgba(255,255,255,0.12)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        transition: 'border-color 0.2s ease',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={thumb}
                        alt={`View ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image counter */}
              {galleryImages.length > 1 && (
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  marginTop: 10,
                }}>
                  {galleryImages.indexOf(activeImage) + 1} / {galleryImages.length}
                </p>
              )}
            </motion.div>

            {/* Right: Details */}
            <div style={{ flex: '1 1 40%', minWidth: 300, paddingTop: 24, paddingLeft: 24 }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: 4,
                  color: '#C6FF33',
                  marginBottom: 16,
                }}
              >
                {item.category}
              </p>
              <GSAPTitle
                as="h2"
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontWeight: 700,
                  fontSize: 28,
                  color: '#ffffff',
                  marginBottom: 32,
                  lineHeight: 1.2,
                }}
              >
                {item.title}
              </GSAPTitle>

              <p className="label-mono" style={{ marginBottom: 12, color: '#888' }}>
                What we did:
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-general)',
                  fontSize: 16,
                  color: '#ccc',
                  lineHeight: 1.7,
                  marginBottom: 48,
                }}
              >
                {item.description}
              </p>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                  {item.tags!.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.45)',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        padding: '4px 12px',
                        borderRadius: 100,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Turnaround badge */}
              {item.turnaround && (
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: '#C6FF33',
                  marginBottom: 40,
                }}>
                  ⚡ Turnaround: {item.turnaround}
                </p>
              )}

              <Link
                href="/order"
                className="btn-primary"
                onClick={onClose}
              >
                Order Similar →
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}