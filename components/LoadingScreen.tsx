'use client';

import { useEffect, useState } from 'react';


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

    // Set a timeout to finish loading animation since we are using a GIF now
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => setVisible(false), 450);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    setExiting(true);
    setTimeout(() => setVisible(false), 450);
  };

  if (!visible) return null;



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
      <div style={{ width: 100, height: 100 }}>
        <img
          src="https://res.cloudinary.com/dagqxe3fh/image/upload/silk-studio/images/loading-animation.gif"
          alt="Loading..."
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    </div>
  );
}
