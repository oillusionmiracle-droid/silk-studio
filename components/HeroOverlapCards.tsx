'use client';

import { useState, useEffect, useRef } from 'react';

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

function MediaCard({ item, isCenter, onInteract }: { item: typeof placeholders[0]; isCenter: boolean; onInteract: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handleClick = () => {
    onInteract();
    if (item.type === 'video') {
      if (!videoRef.current) return;
      if (videoRef.current.paused) {
        videoRef.current.play();
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
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
            autoPlay={isCenter}
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src={item.src} />
          </video>
          {/* Play/Pause overlay */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.15)',
            opacity: playing ? 0 : 1,
            transition: 'opacity 0.3s',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
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
            <MediaCard item={placeholders[order[0]]} isCenter={false} onInteract={() => setIsPaused(true)} />
          </div>
          <div className="hc-center">
            <MediaCard item={placeholders[order[1]]} isCenter={true} onInteract={() => setIsPaused(true)} />
          </div>
          <div className="hc-right">
            <MediaCard item={placeholders[order[2]]} isCenter={false} onInteract={() => setIsPaused(true)} />
          </div>
        </div>

        {/* Mobile horizontal scroll */}
        <div className="hero-cards-mobile">
          {placeholders.map((item) => (
            <div key={item.id} className="hc-mobile-card">
              <MediaCard item={item} isCenter={false} onInteract={() => setIsPaused(true)} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
