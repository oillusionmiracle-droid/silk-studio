'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice previously
    const consent = localStorage.getItem('silk_cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('silk_cookie_consent', accepted ? 'accepted' : 'declined');
    setShowBanner(false);
    // If accepted, you can initialize Google Analytics or Facebook Pixel scripts here
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md p-4 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 text-white flex flex-col gap-3">
      <div className="text-sm text-zinc-300">
        <p>
          Silk Studio uses essential cookies to process your orders and optimize your browsing experience. Read our{' '}
          <a href="/privacy" className="text-white underline hover:text-zinc-300">Privacy Policy</a> to learn more.
        </p>
      </div>
      <div className="flex gap-2 justify-end text-xs font-semibold">
        <button 
          onClick={() => handleConsent(false)} 
          className="px-3 py-2 text-zinc-400 hover:text-white transition"
        >
          Decline
        </button>
        <button 
          onClick={() => handleConsent(true)} 
          className="px-4 py-2 bg-white text-black rounded hover:bg-zinc-200 transition"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}