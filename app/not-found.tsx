'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, ShoppingBag, LayoutGrid } from 'lucide-react';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function NotFound() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('/animations/404.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Failed to load 404 Lottie animation:', err));
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0D0D0D',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(600px, 90vw)',
          height: 'min(600px, 90vw)',
          background: 'radial-gradient(circle, rgba(198, 255, 51, 0.08) 0%, rgba(13, 13, 13, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 680,
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Lottie Animation Container — Place your DotLottie animation component/player here */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          id="lottie-404-container"
          style={{
            width: '100%',
            maxWidth: 360,
            height: 280,
            margin: '0 auto 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            /* Default fallback graphic / placeholder until DotLottie is loaded */
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(80px, 16vw, 120px)',
                fontWeight: 800,
                letterSpacing: '-4px',
                lineHeight: 1,
                color: '#C6FF33',
                textShadow: '0 0 40px rgba(198, 255, 51, 0.35)',
                userSelect: 'none',
              }}
            >
              404
            </div>
          )}
        </motion.div>

        {/* Heading & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#C6FF33',
              marginBottom: 12,
            }}
          >
            Page Not Found
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: 16,
            }}
          >
            Looks like you went off the grid.
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-general)',
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: '#888888',
              lineHeight: 1.6,
              maxWidth: 480,
              margin: '0 auto 40px',
            }}
          >
            The page you are looking for might have been moved, renamed, or doesn&apos;t exist.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              borderRadius: 100,
              background: '#C6FF33',
              color: '#0D0D0D',
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 0 28px rgba(198, 255, 51, 0.4)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <Home size={18} /> Back to Home
          </Link>

          <Link
            href="/services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              borderRadius: 100,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none',
              backdropFilter: 'blur(12px)',
              transition: 'border-color 0.2s ease, background 0.2s ease',
            }}
          >
            <LayoutGrid size={18} /> Services
          </Link>

          <Link
            href="/apparel"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              borderRadius: 100,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 600,
              fontSize: 15,
              textDecoration: 'none',
              backdropFilter: 'blur(12px)',
              transition: 'border-color 0.2s ease, background 0.2s ease',
            }}
          >
            <ShoppingBag size={18} /> Apparel
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
