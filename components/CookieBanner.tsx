'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import FuturecraftCommunityPrompt from './futurecraft/FuturecraftCommunityPrompt';
import './futurecraft/futurecraft-prompts.css';
import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { SpeedInsights } from '@vercel/speed-insights/next';
import GoogleAnalytics from './GoogleAnalytics';
const KEY = 'silk_cookie_consent_v2';
export default function CookieBanner() {
  const [show, setShow] = useState(false), [analytics, setAnalytics] = useState(false), [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isFuturecraft = pathname?.startsWith('/futurecraft') || false;
  useEffect(() => {
    setMounted(true);
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
  return <>{analytics && <><GoogleAnalytics /><Script id="consented-gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5X732MF6');`}</Script><SpeedInsights /></>}{mounted && show && (isFuturecraft ? createPortal(<aside className="fc-cookie-bar" aria-labelledby="fc-cookie-title"><button type="button" className="fc-cookie-close" aria-label="Dismiss cookie notice and keep optional analytics off" onClick={() => choose(false)}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg></button><span className="fc-prompt-kicker">A LITTLE HOUSEKEEPING</span><h2 id="fc-cookie-title">Your visit. Your choice.</h2><p>Essential cookies keep things working. Optional analytics help us improve Futurecraft.</p><Link className="fc-cookie-details" href="/futurecraft/privacy">Read our privacy note</Link><div className="fc-cookie-actions"><button type="button" onClick={() => choose(false)}>Essential only</button><button type="button" onClick={() => choose(true)}>Allow analytics</button></div></aside>,document.body) : <aside className="silk-cookie-bar" aria-label="Cookie preferences"><div className="silk-cookie-bar-inner"><p>Cookies keep things working. Analytics are optional. <Link href="/apparel/cookie-policy">Details</Link></p><div className="silk-cookie-bar-actions"><button onClick={() => choose(false)}>Essential only</button><button onClick={() => choose(true)}>Allow analytics</button></div><button className="silk-cookie-close" onClick={() => choose(false)} aria-label="Dismiss cookie notice and keep optional analytics off"><svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg></button></div></aside>)}{mounted && isFuturecraft && <FuturecraftCommunityPrompt blocked={show}/>}</>;
}
