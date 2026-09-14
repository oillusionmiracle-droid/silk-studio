'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, ArrowRight, MessageSquare, PackageCheck, ShieldCheck } from 'lucide-react';

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
        backgroundColor: '#0a0a0c',
        backgroundImage:
          'radial-gradient(circle at 50% 10%, rgba(198, 255, 51, 0.08) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.02) 0%, transparent 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 60px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{
          backgroundColor: '#121215',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 28,
          padding: '44px 32px',
          textAlign: 'center',
          maxWidth: 500,
          width: '100%',
          boxShadow: '0 24px 70px rgba(0,0,0,0.6), 0 0 40px rgba(198,255,51,0.06)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Animated Checkmark Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.15 }}
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C6FF33 0%, #A3E635 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 12px 30px rgba(198,255,51,0.35)',
            color: '#0D0D0D',
          }}
        >
          <Check size={36} strokeWidth={3} />
        </motion.div>

        <h1
          style={{
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 900,
            fontSize: 32,
            color: '#ffffff',
            marginBottom: 10,
            lineHeight: 1.15,
            letterSpacing: '-0.5px',
          }}
        >
          Brief Received!
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-general)',
            fontSize: 14,
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.6,
            marginBottom: 20,
          }}
        >
          Your project brief has been logged into our studio queue.
        </p>

        {/* Reference Code Box */}
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            ORDER REFERENCE
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 18,
              fontWeight: 800,
              color: '#C6FF33',
              letterSpacing: '1px',
            }}
          >
            {submittedRef}
          </span>
        </div>

        {/* Service Perks */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            marginBottom: 28,
            textAlign: 'left',
          }}
        >
          <div
            style={{
              backgroundColor: '#17171a',
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <ShieldCheck size={16} color="#C6FF33" />
            <span>2hr Studio Response</span>
          </div>
          <div
            style={{
              backgroundColor: '#17171a',
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <MessageSquare size={16} color="#C6FF33" />
            <span>WhatsApp Sync</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {hasUser ? (
            <Link
              href="/account/orders"
              style={{
                background: 'linear-gradient(135deg, #C6FF33 0%, #A3E635 100%)',
                borderRadius: 14,
                padding: '16px 24px',
                textDecoration: 'none',
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 800,
                fontSize: 14,
                color: '#0D0D0D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(198, 255, 51, 0.3)',
              }}
            >
              <span>Track in Dashboard</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuthModal('sign_up')}
              style={{
                background: 'linear-gradient(135deg, #C6FF33 0%, #A3E635 100%)',
                borderRadius: 14,
                padding: '16px 24px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 800,
                fontSize: 14,
                color: '#0D0D0D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(198, 255, 51, 0.3)',
              }}
            >
              <span>Create Silk ID to Track Live</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          )}

          <Link
            href="/"
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14,
              padding: '14px 24px',
              textDecoration: 'none',
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 600,
              fontSize: 13,
              color: '#ffffff',
              transition: 'background-color 0.2s',
            }}
          >
            Return to Studio Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
