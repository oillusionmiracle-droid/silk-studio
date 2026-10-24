'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { SpeedInsights } from '@vercel/speed-insights/next';
import GoogleAnalytics from './GoogleAnalytics';
const KEY = 'silk_cookie_consent_v2';
export default function CookieBanner() {
  const [show, setShow] = useState(false), [analytics, setAnalytics] = useState(false);
  useEffect(() => {
    try { const choice = localStorage.getItem(KEY); setAnalytics(choice === 'analytics'); setShow(!choice); } catch { setShow(true); }
    const reopen = () => setShow(true); window.addEventListener('silk-cookie-settings', reopen); return () => window.removeEventListener('silk-cookie-settings', reopen);
  }, []);
  function choose(allow: boolean) {
    try { localStorage.setItem(KEY, allow ? 'analytics' : 'necessary'); } catch { /* Choice applies for this visit. */ }
    const wasAllowed = analytics; setAnalytics(allow); setShow(false);
    if (!allow && wasAllowed) {
      document.cookie.split(';').forEach(cookie => { const name = cookie.split('=')[0].trim(); if (/^(_ga|_gid|_gat|_gcl)/.test(name)) { for (const domain of ['', location.hostname, '.silkstudios.com.ng']) document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ''}`; } });
      location.reload();
    }
  }
  return <>{analytics && <><GoogleAnalytics /><Script id="consented-gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5X732MF6');`}</Script><SpeedInsights /></>}{show && <aside className="silk-cookie-banner" aria-label="Cookie preferences"><div><strong>A small note on cookies.</strong><p>We use essential cookies and browser storage for accounts and orders. Optional analytics help us understand what’s useful. Your choice.</p><Link href="/apparel/cookie-policy">Read about cookies ↗</Link></div><div className="silk-cookie-actions"><button onClick={() => choose(false)}>Only necessary</button><button onClick={() => choose(true)}>Allow analytics</button></div></aside>}</>;
}
