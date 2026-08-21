'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export default function VideoAdSection({
  videoSrc = '/videos/ad-video.mp4',
  poster,
}: {
  videoSrc?: string;
  poster?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(() => { });
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <section
      ref={containerRef}
      style={{
        backgroundColor: '#f5f5f3',
        padding: 'clamp(64px, 10vw, 110px) var(--section-px, 24px) clamp(80px, 12vw, 130px)',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Bottom wave — convex dome curving DOWN into the dark section below */}
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          bottom: -2,
          left: 0,
          width: '100%',
          height: 'clamp(36px, 7vw, 90px)',
          zIndex: 2,
          display: 'block',
          pointerEvents: 'none',
        }}
      >
        <path d="M0,0 C360,90 1080,90 1440,0 L1440,90 L0,90 Z" fill="#0D0D0D" />
      </svg>
      {/* Soft noise texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Subtle warm gradient blob */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '55%',
          height: '140%',
          background: 'radial-gradient(ellipse at center, rgba(198,255,51,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '45%',
          height: '120%',
          background: 'radial-gradient(ellipse at center, rgba(180,220,255,0.07) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: 1060, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Eyebrow label — floating pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 3.5,
              color: '#1a1a1a',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 100,
              backgroundColor: 'rgba(255,255,255,0.65)',
              border: '1px solid rgba(0,0,0,0.1)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ color: '#C6FF33', fontSize: 14, lineHeight: 1 }}>✦</span>
            Featured
          </span>
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: 'var(--font-jakarta)',
            fontSize: 'clamp(30px, 5vw, 52px)',
            fontWeight: 800,
            color: '#111111',
            letterSpacing: '-1.2px',
            lineHeight: 1.1,
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          Crafting Excellence,<br />
          <span style={{ color: '#3d3d3d', fontWeight: 600 }}>One Print at a Time.</span>
        </h2>

        {/* ── VIDEO CARD ── */}
        <div
          style={{
            position: 'relative',
            borderRadius: 32,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow:
              '0 2px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.06) inset, 0 32px 80px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)',
            padding: 10,
          }}
        >
          {/* Inner video container */}
          <div
            onClick={togglePlay}
            style={{
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              aspectRatio: '16 / 9',
              backgroundColor: '#1a1a1a',
              cursor: 'pointer',
            }}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              poster={poster}
              playsInline
              loop
              muted={isMuted}
              preload="metadata"
              onError={() => setHasError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: hasError ? 'none' : 'block',
              }}
            />

            {/* Fallback */}
            {hasError && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: 320,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #111 0%, #1e1e1e 100%)',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-jakarta)',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(198,255,51,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C6FF33',
                    fontSize: 18,
                  }}
                >
                  ▶
                </div>
                <span style={{ fontSize: 13 }}>
                  Place <code style={{ color: '#C6FF33', fontSize: 12 }}>public/videos/ad-video.mp4</code> to activate
                </span>
              </div>
            )}

            {/* Top → bottom gradient vignette */}
            {!hasError && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 20%, transparent 72%, rgba(0,0,0,0.55) 100%)',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Play / Pause center indicator */}
            {!isPlaying && !hasError && (
              <motion.div
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                style={{
                  position: 'absolute',
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: 20,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3,
                }}
              >
                ▶
              </motion.div>
            )}

            {/* Bottom controls */}
            {!hasError && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 14,
                  right: 14,
                  zIndex: 4,
                }}
              >
                <button
                  onClick={toggleMute}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    color: '#ffffff',
                    borderRadius: 100,
                    padding: '7px 14px',
                    fontSize: 11,
                    fontFamily: 'var(--font-jakarta)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    letterSpacing: '0.5px',
                    transition: 'background 0.2s ease',
                  }}
                >
                  {isMuted ? (
                    <>
                      <VolumeX size={14} strokeWidth={2.2} />
                      Tap for Sound
                    </>
                  ) : (
                    <>
                      <Volume2 size={14} strokeWidth={2.2} />
                      Sound On
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Glass card footer strip */}
          {!hasError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px 6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C6FF33, #8fdb00)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <img src="/logo-black.svg" alt="" style={{ width: 16, height: 16, objectFit: 'contain' }} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-jakarta)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#111',
                  }}
                >
                  Silk Studio
                </span>
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: 2,
                  color: 'rgba(0,0,0,0.35)',
                  textTransform: 'uppercase',
                }}
              >
                ✦ Behind the scenes
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
