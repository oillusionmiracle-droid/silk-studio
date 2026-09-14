'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface OrderImageProps {
  src?: string;
  fallbackSources?: string[];
  alt: string;
  icon?: React.ReactNode;
  className?: string;
  aspectRatio?: string;
  fill?: boolean;
}

export default function OrderImage({
  src,
  fallbackSources = [],
  alt,
  icon,
  className = '',
  aspectRatio = '16/10',
  fill = false,
}: OrderImageProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  // All sources to try in order
  const sources = [src, ...fallbackSources].filter(Boolean) as string[];
  const currentSrc = sources[sourceIndex];

  const handleError = () => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const showImage = !hasError && Boolean(currentSrc);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: fill ? undefined : aspectRatio,
        height: fill ? '100%' : undefined,
        backgroundColor: '#161618',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className={className}
    >
      {showImage ? (
        <img
          src={currentSrc}
          alt={alt}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          loading="lazy"
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(20,20,22,0.95) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.6)',
            padding: 12,
            gap: 8,
          }}
        >
          {icon ? (
            <div style={{ opacity: 0.8, transform: 'scale(1.2)' }}>{icon}</div>
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
