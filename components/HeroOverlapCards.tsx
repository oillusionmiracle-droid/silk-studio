'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';

/* 
  Placeholder items — swap src with your own image or video paths.
  Change type to 'video' and update src for videos.
  Files go in: public/videos/ or public/images/
*/
const placeholders = [
  { id: 1, type: 'video' as const, src: '/videos/sample-video.mp4', label: 'PROJECT ONE' },
  { id: 2, type: 'image' as const, src: '/images/portfolio/work-4.jpg', label: 'PROJECT TWO' },
  { id: 3, type: 'image' as const, src: '/images/portfolio/work-5.jpg', label: 'PROJECT THREE' },
];

/* ─────────────────────────────────────────
   VIDEO FULLSCREEN MODAL
───────────────────────────────────────── */
function VideoModal({ src, onClose }: { src: string; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Play unmuted when modal opens
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay with sound may be blocked — fall back to muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, right: 20, zIndex: 10,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}
      >
        <X size={20} color="#ffffff" />
      </button>

      {/* Mute/Unmute button */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute', bottom: 20, right: 20, zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 100,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#ffffff',
          fontFamily: 'var(--font-jakarta)',
          fontSize: 12, fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        {isMuted ? 'Unmute' : 'Sound On'}
      </button>

      {/* Video */}
      <motion.video
        ref={videoRef}
        src={src}
        loop
        playsInline
        controls={false}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '92vw', maxHeight: '85vh',
          borderRadius: 16,
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          objectFit: 'contain',
          cursor: 'default',
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MEDIA CARD
───────────────────────────────────────── */
function MediaCard({ item, isCenter, onInteract, onVideoFullscreen }: {
  item: typeof placeholders[0];
  isCenter: boolean;
  onInteract: () => void;
  onVideoFullscreen: (src: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Always autoplay muted — not just when center
  useEffect(() => {
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [item.type]);

  const handleClick = () => {
    onInteract();
    if (item.type === 'video') {
      // Open fullscreen modal with sound on click
      onVideoFullscreen(item.src);
    }
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
      onClick={handleClick}
    >
      {item.type === 'image' ? (
        <img
          src={item.src}
          alt={item.label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          >
            <source src={item.src} />
          </video>
          {/* Tap to watch overlay hint */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'flex-end', justifyContent: 'center',
            background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)',
            padding: 16, pointerEvents: 'none',
          }}>
            <span style={{
              fontFamily: 'var(--font-jakarta)', fontSize: 11, fontWeight: 600,
              color: 'rgba(255,255,255,0.8)', letterSpacing: '0.5px',
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 100,
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
            }}>
              <Volume2 size={12} /> Tap to watch with sound
            </span>
          </div>
        </>
      )}
      {/* Dark fallback background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        zIndex: -1,
      }} />
    </div>
  );
}

export default function HeroOverlapCards() {
  const [order, setOrder] = useState([0, 1, 2]); // [left, center, right]
  const [isPaused, setIsPaused] = useState(false);
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setOrder(prev => [prev[2], prev[0], prev[1]]);
    }, 6000); // Slower rotation — 6 seconds
    return () => clearInterval(interval);
  }, [isPaused]);

  const css = `
    .hero-cards-container {
      width: 100%;
      margin-top: -120px;
      position: relative;
      z-index: 10;
      height: 700px;
    }

    .hero-cards-desktop {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
    }

    /* Card slot styles */
    .hc-left {
      position: absolute;
      left: -6%;
      top: 8%;
      width: 36%;
      height: 84%;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 16px 48px rgba(0,0,0,0.4);
      transform: rotate(-7deg);
      z-index: 2;
    }

    .hc-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%) rotate(0deg);
      top: 0;
      width: 44%;
      height: 100%;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 32px 80px rgba(0,0,0,0.6);
      z-index: 5;
    }

    .hc-right {
      position: absolute;
      right: -6%;
      top: 8%;
      width: 36%;
      height: 84%;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 16px 48px rgba(0,0,0,0.4);
      transform: rotate(7deg);
      z-index: 2;
    }

    /* Mobile horizontal scroll */
    .hero-cards-mobile {
      display: none;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      padding: 0 20px 24px;
      gap: 16px;
      scrollbar-width: none;
      margin-top: -60px;
    }
    .hero-cards-mobile::-webkit-scrollbar { display: none; }

    .hc-mobile-card {
      flex: 0 0 72%;
      aspect-ratio: 3/4;
      scroll-snap-align: center;
      position: relative;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 16px 32px rgba(0,0,0,0.3);
    }

    @media (max-width: 768px) {
      .hero-cards-desktop { display: none; }
      .hero-cards-mobile { display: flex; }
      .hero-cards-container {
        height: auto;
        overflow: visible;
        margin-bottom: 40px;
        margin-top: -50px;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="hero-cards-container">
        {/* Desktop */}
        <div className="hero-cards-desktop">
          <div className="hc-left">
            <MediaCard item={placeholders[order[0]]} isCenter={false} onInteract={() => setIsPaused(true)} onVideoFullscreen={setFullscreenVideo} />
          </div>
          <div className="hc-center">
            <MediaCard item={placeholders[order[1]]} isCenter={true} onInteract={() => setIsPaused(true)} onVideoFullscreen={setFullscreenVideo} />
          </div>
          <div className="hc-right">
            <MediaCard item={placeholders[order[2]]} isCenter={false} onInteract={() => setIsPaused(true)} onVideoFullscreen={setFullscreenVideo} />
          </div>
        </div>

        {/* Mobile horizontal scroll */}
        <div className="hero-cards-mobile">
          {placeholders.map((item) => (
            <div key={item.id} className="hc-mobile-card">
              <MediaCard item={item} isCenter={false} onInteract={() => setIsPaused(true)} onVideoFullscreen={setFullscreenVideo} />
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen video modal */}
      <AnimatePresence>
        {fullscreenVideo && (
          <VideoModal src={fullscreenVideo} onClose={() => setFullscreenVideo(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
