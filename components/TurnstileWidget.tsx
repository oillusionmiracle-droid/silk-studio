'use client';

import { useEffect, useRef, useState } from 'react';

interface TurnstileWidgetProps {
  onToken: (token: string | null) => void;
  appearance?: 'always' | 'execute' | 'interaction-only';
  language?: string;
  size?: 'normal' | 'compact' | 'flexible';
  resetKey?: number;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: Record<string, unknown>
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    __silkTurnstileLoading?: Promise<void>;
  }
}

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (window.__silkTurnstileLoading) return window.__silkTurnstileLoading;
  window.__silkTurnstileLoading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });
  return window.__silkTurnstileLoading;
}

/**
 * Cloudflare Turnstile managed widget, explicit render.
 * Per https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/ :
 * loads api.js?render=explicit once, renders with the site key, and emits the
 * token via onToken. Tokens are single-use — the parent must reset the widget
 * (via resetKey) after each verification attempt.
 */
export default function TurnstileWidget({
  onToken,
  appearance = 'always',
  language = 'auto',
  size = 'normal',
  resetKey = 0,
}: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    // Kick off script load on mount (client-only component).
    if (!siteKey) return;
    let cancelled = false;
    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        if (widgetIdRef.current) {
          window.turnstile.reset(widgetIdRef.current);
          return;
        }
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          appearance,
          language,
          size,
          'refresh-expired': 'auto',
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => onTokenRef.current(null),
        });
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [siteKey, appearance, language, size]);

  // Reset the widget after each verification attempt: Turnstile tokens are
  // single-use, so a fresh challenge is required for the next submit.
  useEffect(() => {
    if (resetKey === 0) return;
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        // Widget already torn down — safe to ignore.
      }
      onTokenRef.current(null);
    }
  }, [resetKey]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Widget already torn down with the page — safe to ignore.
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  if (!siteKey || loadFailed) return null;

  return (
    <div
      ref={containerRef}
      aria-label="Bot verification"
      style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}
    />
  );
}
