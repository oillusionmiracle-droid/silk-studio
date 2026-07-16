'use client';

import React, { CSSProperties } from 'react';

type IllustrationDecoProps = {
  name: string;                              // File name in /public/illustrations/
  size?: 'sm' | 'md' | 'lg';                // Responsive sizing
  position?: 'absolute' | 'relative' | 'fixed';
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  opacity?: number;
  zIndex?: number;
  animate?: boolean;                         // Enable hover scale effect
  className?: string;
  hideOnMobile?: boolean;                    // Default: true (desktop-only)
};

/**
 * IllustrationDeco Component
 *
 * Usage:
 *   <IllustrationDeco
 *     name="hero-deco"
 *     size="lg"
 *     position="absolute"
 *     top="40px"
 *     right="60px"
 *     animate
 *   />
 *
 * Props:
 *   - name: Illustration file name (without extension, from /public/illustrations/)
 *   - size: 'sm' (40–80px), 'md' (60–120px), 'lg' (80–160px)
 *   - position: CSS position value
 *   - top, left, right, bottom: Positioning
 *   - opacity: 0–1, default 1
 *   - zIndex: Stacking order
 *   - animate: Adds hover scale effect
 *   - hideOnMobile: Show only on desktop (768px+)
 */

export default function IllustrationDeco({
  name,
  size = 'md',
  position = 'absolute',
  top,
  left,
  right,
  bottom,
  opacity = 1,
  zIndex = 0,
  animate = false,
  className = '',
  hideOnMobile = true,
}: IllustrationDecoProps) {
  // Responsive size mappings
  const sizeMap = {
    sm: 'clamp(40px, 8vw, 80px)',
    md: 'clamp(60px, 12vw, 120px)',
    lg: 'clamp(80px, 15vw, 160px)',
  };

  const style: CSSProperties = {
    position: position as 'absolute' | 'relative' | 'fixed' | undefined,
    width: sizeMap[size],
    height: 'auto',
    opacity,
    zIndex,
    top: top || 'auto',
    left: left || 'auto',
    right: right || 'auto',
    bottom: bottom || 'auto',
    pointerEvents: 'none',
    userSelect: 'none',
  };

  // Mobile visibility
  const containerStyle: CSSProperties = hideOnMobile
    ? {
        display: 'none',
      }
    : {};

  return (
    <div style={containerStyle} className="illustration-container">
      <style>{`
        @media (min-width: 768px) {
          .illustration-container {
            display: block !important;
          }
        }

        ${animate ? `
          .illustration-hover {
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .illustration-hover:hover {
            transform: scale(1.1) rotate(2deg);
          }
        ` : ''}
      `}</style>

      <img
        src={`/illustrations/${name}.png`}
        alt=""
        aria-hidden="true"
        style={style}
        className={`${animate ? 'illustration-hover' : ''} ${className}`.trim()}
        onError={(e) => {
          // Silently hide if illustration not found
          const img = e.currentTarget as HTMLImageElement;
          img.style.display = 'none';
          console.warn(`Illustration not found: /illustrations/${name}.svg`);
        }}
      />
    </div>
  );
}