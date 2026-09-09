'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface OrderConfirmationProps {
  submittedRef: string;
  hasUser: boolean;
  onOpenAuthModal: (view: 'sign_up' | 'sign_in') => void;
}

export default function OrderConfirmation({
  submittedRef,
  hasUser,
  onOpenAuthModal,
}: OrderConfirmationProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0e0e10 0%, #17171c 50%, #0d0d0f 100%)',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(25,25,25,0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 28,
            padding: '48px 36px',
            textAlign: 'center',
            maxWidth: 480,
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              backgroundColor: '#C6FF33',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0D0D0D"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <h1
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 800,
              fontSize: 32,
              color: '#ffffff',
              marginBottom: 12,
              lineHeight: 1.1,
            }}
          >
            Brief Confirmed
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-general)',
              fontSize: 14,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            We&apos;ve received your specifications. Your studio reference is:
          </p>
          <p
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 15,
              fontWeight: 700,
              color: '#C6FF33',
              letterSpacing: '0.8px',
              padding: '10px 18px',
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              display: 'inline-block',
              marginBottom: 28,
            }}
          >
            {submittedRef}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-general)',
              fontSize: 13,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            Our design team is reviewing your project. You can inspect your live milestone timeline
            in your customer dashboard.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {hasUser ? (
              <Link
                href="/account/orders"
                style={{
                  backgroundColor: '#C6FF33',
                  borderRadius: 12,
                  padding: '14px 28px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-jakarta)',
                  fontWeight: 700,
                  fontSize: 13,
                  color: '#0D0D0D',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Track in Dashboard →
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuthModal('sign_up')}
                style={{
                  backgroundColor: '#C6FF33',
                  borderRadius: 12,
                  padding: '14px 28px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-jakarta)',
                  fontWeight: 700,
                  fontSize: 13,
                  color: '#0D0D0D',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Create Silk Studio ID to Track →
              </button>
            )}
            <Link
              href="/"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '12px 28px',
                textDecoration: 'none',
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 600,
                fontSize: 13,
                color: '#fff',
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
