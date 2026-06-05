'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [animData, setAnimData] = useState<object | null>(null);

  useEffect(() => {
    // Only show once per session
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('silk-loading-seen');
      if (seen) {
        setVisible(false);
        return;
      }
      sessionStorage.setItem('silk-loading-seen', 'true');
    }

    // Fetch the Lottie JSON client-side
    fetch('/loading.json')
      .then((r) => r.json())
      .then((data) => setAnimData(data))
      .catch(() => {
        // If no loading.json, skip loading screen
        setVisible(false);
      });
  }, []);

  const handleComplete = () => {
    setExiting(true);
    setTimeout(() => setVisible(false), 450);
  };

  if (!visible) return null;

  // If anim data not yet loaded, show bg only briefly
  if (!animData) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: '#0D0D0D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Minimal spinner while Lottie JSON loads */}
        <div
          style={{
            width: 48,
            height: 48,
            border: '3px solid #2A2A2A',
            borderTopColor: '#C6FF33',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#0D0D0D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.4s ease',
        opacity: exiting ? 0 : 1,
        pointerEvents: exiting ? 'none' : 'all',
      }}
    >
      <div style={{ width: 180, height: 180 }}>
        <Lottie
          animationData={animData}
          loop={false}
          autoplay={true}
          onComplete={handleComplete}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Silk Studio wordmark below spinner */}
      <div
        style={{
          position: 'absolute',
          bottom: '50%',
          marginBottom: -130,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'serif',
            fontWeight: 900,
            fontSize: 18,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#ffffff',
          }}
        >
          Silk <span style={{ color: '#C6FF33' }}>Studio</span>
        </p>
      </div>
    </div>
  );
}
