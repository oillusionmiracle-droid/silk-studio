'use client';

import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────
   Geolocation + Exchange Rate — shared singleton
   Fetched once per session, cached in sessionStorage.
───────────────────────────────────────── */

interface GeoData {
  isNigeria: boolean;
  usdRate: number | null; // NGN per 1 USD (e.g. 1500) — null if unavailable
}

const SESSION_KEY_GEO = 'silk-apparel-geo';
const SESSION_KEY_RATE = 'silk-apparel-usd-rate';

let geoPromise: Promise<GeoData> | null = null;

function getGeoData(): Promise<GeoData> {
  if (geoPromise) return geoPromise;

  geoPromise = (async (): Promise<GeoData> => {
    // 1. Check sessionStorage cache first
    if (typeof window !== 'undefined') {
      const cachedGeo = sessionStorage.getItem(SESSION_KEY_GEO);
      const cachedRate = sessionStorage.getItem(SESSION_KEY_RATE);
      if (cachedGeo !== null) {
        return {
          isNigeria: cachedGeo === 'NG',
          usdRate: cachedRate ? parseFloat(cachedRate) : null,
        };
      }
    }

    // 2. Detect country — browser locale first, then IP geolocation
    let isNigeria = true; // default to Nigeria (safe fallback = Naira only)

    // Check browser locale hint
    try {
      const locale =
        Intl.DateTimeFormat().resolvedOptions().locale ||
        navigator.language ||
        '';
      const locLower = locale.toLowerCase();
      if (locLower.includes('ng') || locLower === 'en-ng') {
        isNigeria = true;
      } else if (locLower.length > 0 && !locLower.includes('ng')) {
        // Browser locale suggests non-Nigeria — verify with IP
        isNigeria = false;
      }
    } catch {
      // Locale detection failed — continue to IP check
    }

    // IP geolocation for more accurate detection
    try {
      const geoRes = await fetch('https://ipapi.co/json/', {
        signal: AbortSignal.timeout(4000),
      });
      if (geoRes.ok) {
        const geoJson = await geoRes.json();
        isNigeria = geoJson.country_code === 'NG';
      }
    } catch {
      // IP geolocation failed — use locale-based guess
    }

    // 3. If not Nigeria, fetch exchange rate
    let usdRate: number | null = null;
    if (!isNigeria) {
      try {
        const rateRes = await fetch(
          'https://open.er-api.com/v6/latest/USD',
          { signal: AbortSignal.timeout(4000) }
        );
        if (rateRes.ok) {
          const rateJson = await rateRes.json();
          if (rateJson.rates?.NGN) {
            usdRate = rateJson.rates.NGN; // e.g. 1580.5 NGN per 1 USD
          }
        }
      } catch {
        // Exchange rate fetch failed — will show Naira only
      }
    }

    // 4. Cache in sessionStorage
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(SESSION_KEY_GEO, isNigeria ? 'NG' : 'OTHER');
        if (usdRate !== null) {
          sessionStorage.setItem(SESSION_KEY_RATE, usdRate.toString());
        }
      } catch {
        // sessionStorage unavailable
      }
    }

    return { isNigeria, usdRate };
  })();

  return geoPromise;
}

/* ─────────────────────────────────────────
   Format helpers
───────────────────────────────────────── */

function formatNaira(amount: number): string {
  return `\u20A6${amount.toLocaleString()}`;
}

function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)} USD`;
}

/* ─────────────────────────────────────────
   usePriceDisplay Hook
   
   Usage:
     const { primary, approximate } = usePriceDisplay(20000);
     // Nigerian visitor:  primary = "₦20,000", approximate = undefined
     // US visitor:        primary = "₦20,000", approximate = "≈ $12.65 USD"
───────────────────────────────────────── */

export interface PriceDisplay {
  primary: string;       // Always Naira formatted
  approximate?: string;  // "≈ $X.XX USD" — only for non-Nigerian visitors
  nairaAmount: number;   // Raw number for calculations
}

export function usePriceDisplay(nairaAmount: number): PriceDisplay {
  const [geoData, setGeoData] = useState<GeoData>({
    isNigeria: true,
    usdRate: null,
  });

  useEffect(() => {
    getGeoData().then(setGeoData);
  }, []);

  const primary = formatNaira(nairaAmount);

  let approximate: string | undefined;
  if (!geoData.isNigeria && geoData.usdRate && geoData.usdRate > 0) {
    const usdValue = nairaAmount / geoData.usdRate;
    approximate = `\u2248 ${formatUSD(usdValue)}`;
  }

  return { primary, approximate, nairaAmount };
}
