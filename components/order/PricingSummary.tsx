'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactInfo, OrderSpecs } from '@/lib/order/types';
import { SERVICE_ICONS } from './ProductSelector';

interface PricingSummaryProps {
  isMobile: boolean;
  subService: string | null;
  isCustomQuote: boolean;
  total: number;
  deposit: number;
  payFull: boolean;
  specs: OrderSpecs;
  totalApparelQty: number;
  contact: ContactInfo;
  summaryOpen: boolean;
  setSummaryOpen: (open: boolean) => void;
  setPayFull: (payFull: boolean) => void;
  onSubmit: () => void;
}

export default function PricingSummary({
  isMobile,
  subService,
  isCustomQuote,
  total,
  deposit,
  payFull,
  specs,
  totalApparelQty,
  contact,
  summaryOpen,
  setSummaryOpen,
  setPayFull,
  onSubmit,
}: PricingSummaryProps) {
  if (!subService) return null;

  return (
    <>
      {/* MOBILE SUMMARY SHEET */}
      {isMobile && (
        <>
          {/* Floating Button */}
          <div
            style={{
              position: 'fixed',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 50,
              width: 'calc(100% - 32px)',
              maxWidth: 320,
            }}
          >
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSummaryOpen(true)}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: '#0D0D0D',
                color: '#C6FF33',
                border: 'none',
                borderRadius: 100,
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}
            >
              View Order Summary
            </motion.button>
          </div>

          {/* Modal Sheet */}
          <AnimatePresence>
            {summaryOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSummaryOpen(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 55,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                  }}
                />

                {/* Sheet */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 56,
                    backgroundColor: '#111111',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px 20px 0 0',
                    padding: 24,
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
                  }}
                >
                  {/* Handle bar + Close button */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 4,
                        backgroundColor: '#e0e0e0',
                        borderRadius: 2,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setSummaryOpen(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 24,
                        color: '#999',
                        padding: '0 8px',
                        height: 32,
                        width: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: 3,
                      textTransform: 'uppercase',
                      color: '#999',
                      marginBottom: 18,
                      margin: 0,
                    }}
                  >
                    ORDER SUMMARY
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          letterSpacing: 2,
                          textTransform: 'uppercase',
                          color: '#aaa',
                          margin: 0,
                        }}
                      >
                        Service
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        <span style={{ fontSize: 20 }}>{SERVICE_ICONS[subService] || '✨'}</span>
                        <p
                          style={{
                            fontFamily: 'var(--font-general)',
                            fontSize: 15,
                            fontWeight: 600,
                            color: '#ffffff',
                            margin: 0,
                          }}
                        >
                          {subService}
                        </p>
                      </div>
                    </div>

                    {!isCustomQuote && (
                      <>
                        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 12 }}>
                          <p
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 9,
                              letterSpacing: 2,
                              textTransform: 'uppercase',
                              color: '#aaa',
                              margin: 0,
                            }}
                          >
                            Quantity
                          </p>
                          <p
                            style={{
                              fontFamily: 'var(--font-general)',
                              fontSize: 15,
                              color: '#333',
                              margin: '6px 0 0 0',
                            }}
                          >
                            {['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers', 'Hoodies'].includes(
                              subService
                            )
                              ? `${totalApparelQty} pcs`
                              : `${specs.quantity}`}
                          </p>
                        </div>

                        <div
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 12,
                            padding: '16px',
                            textAlign: 'center',
                          }}
                        >
                          <p
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10,
                              letterSpacing: 2,
                              textTransform: 'uppercase',
                              color: '#999',
                              margin: 0,
                            }}
                          >
                            Total
                          </p>
                          <p
                            style={{
                              fontFamily: 'var(--font-jakarta)',
                              fontWeight: 700,
                              fontSize: 28,
                              color: '#ffffff',
                              margin: '6px 0 0 0',
                            }}
                          >
                            ₦{total.toLocaleString()}
                          </p>
                        </div>

                        <div
                          style={{
                            backgroundColor: payFull ? 'rgba(255,255,255,0.05)' : '#C6FF33',
                            borderRadius: 12,
                            padding: '12px',
                            textAlign: 'center',
                            border: payFull ? '1px solid rgba(255,255,255,0.1)' : 'none',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 4,
                            }}
                          >
                            <p
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 10,
                                letterSpacing: 2,
                                textTransform: 'uppercase',
                                color: payFull ? '#aaa' : '#0D0D0D',
                                margin: 0,
                              }}
                            >
                              Deposit (75%)
                            </p>
                            <label
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                cursor: 'pointer',
                                fontFamily: 'var(--font-general)',
                                fontSize: 12,
                                color: payFull ? '#aaa' : '#0D0D0D',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={payFull}
                                onChange={(e) => setPayFull(e.target.checked)}
                                style={{ accentColor: payFull ? '#C6FF33' : '#000' }}
                              />{' '}
                              Pay full
                            </label>
                          </div>
                          <p
                            style={{
                              fontFamily: 'var(--font-jakarta)',
                              fontWeight: 900,
                              fontSize: 24,
                              color: payFull ? 'rgba(255,255,255,0.3)' : '#0D0D0D',
                              margin: 0,
                              textDecoration: payFull ? 'line-through' : 'none',
                              textAlign: 'left',
                            }}
                          >
                            ₦{deposit.toLocaleString()}
                          </p>
                        </div>
                      </>
                    )}

                    {isCustomQuote && (
                      <div
                        style={{
                          backgroundColor: '#f0f0f0',
                          borderRadius: 12,
                          padding: '12px',
                          textAlign: 'center',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'var(--font-general)',
                            fontSize: 13,
                            color: '#666',
                            lineHeight: 1.5,
                            margin: 0,
                          }}
                        >
                          Custom quote — we&apos;ll send pricing within 2hrs.
                        </p>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                      {[
                        '75% deposit required',
                        '1 free revision',
                        'WhatsApp updates',
                        'Within 2 hours',
                      ].map((line) => (
                        <div
                          key={line}
                          style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}
                        >
                          <div
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              backgroundColor: '#C6FF33',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                              <polyline
                                points="2 6 5 9 10 3"
                                stroke="#0D0D0D"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span
                            style={{
                              fontFamily: 'var(--font-general)',
                              fontSize: 13,
                              color: 'rgba(255,255,255,0.7)',
                            }}
                          >
                            {line}
                          </span>
                        </div>
                      ))}
                    </div>

                    {contact.firstName && contact.whatsapp && (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => {
                          onSubmit();
                          setSummaryOpen(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '16px 24px',
                          backgroundColor: '#0D0D0D',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 12,
                          fontFamily: 'var(--font-jakarta)',
                          fontWeight: 700,
                          fontSize: 15,
                          cursor: 'pointer',
                          marginTop: 12,
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.opacity = '0.9';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                        }}
                      >
                        {isCustomQuote
                          ? 'Submit Brief →'
                          : payFull
                          ? 'Pay Full Amount →'
                          : 'Pay Deposit →'}
                      </motion.button>
                    )}

                    {(!contact.firstName || !contact.whatsapp) && (
                      <div
                        style={{
                          backgroundColor: 'rgba(255, 193, 7, 0.1)',
                          borderRadius: 12,
                          padding: '12px',
                          textAlign: 'center',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'var(--font-general)',
                            fontSize: 12,
                            color: '#ffc107',
                            margin: 0,
                          }}
                        >
                          Complete your info to submit
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setSummaryOpen(false)}
                      style={{
                        width: '100%',
                        padding: '12px 24px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.7)',
                        border: 'none',
                        borderRadius: 12,
                        fontFamily: 'var(--font-jakarta)',
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: 'pointer',
                        marginTop: 8,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e0e0e0';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f5f5f5';
                      }}
                    >
                      ← Back to Edit
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}

      {/* DESKTOP STICKY SUMMARY */}
      {!isMobile && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            zIndex: 40,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(25,25,25,0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
              maxWidth: 1200,
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 24,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: '#aaa',
                    margin: 0,
                  }}
                >
                  Service
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <span style={{ fontSize: 20 }}>{SERVICE_ICONS[subService] || '✨'}</span>
                  <p
                    style={{
                      fontFamily: 'var(--font-general)',
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#ffffff',
                      margin: 0,
                    }}
                  >
                    {subService}
                  </p>
                </div>
              </div>

              {!isCustomQuote && (
                <>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        color: '#aaa',
                        margin: 0,
                      }}
                    >
                      Total
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-jakarta)',
                        fontWeight: 900,
                        fontSize: 20,
                        color: payFull ? '#C6FF33' : '#ffffff',
                        margin: '6px 0 0 0',
                      }}
                    >
                      ₦{total.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          letterSpacing: 2,
                          textTransform: 'uppercase',
                          color: '#aaa',
                          margin: 0,
                        }}
                      >
                        Deposit (75%)
                      </p>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-general)',
                          fontSize: 12,
                          color: '#aaa',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={payFull}
                          onChange={(e) => setPayFull(e.target.checked)}
                          style={{ accentColor: '#C6FF33' }}
                        />{' '}
                        Pay full
                      </label>
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-jakarta)',
                        fontWeight: 900,
                        fontSize: 20,
                        color: payFull ? '#aaa' : '#C6FF33',
                        margin: '0',
                        textDecoration: payFull ? 'line-through' : 'none',
                      }}
                    >
                      ₦{deposit.toLocaleString()}
                    </p>
                  </div>
                </>
              )}

              {isCustomQuote && (
                <p
                  style={{
                    fontFamily: 'var(--font-general)',
                    fontSize: 13,
                    color: '#666',
                    margin: 0,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  Custom quote incoming
                </p>
              )}

              {contact.firstName && contact.whatsapp && (
                <button
                  type="button"
                  onClick={onSubmit}
                  style={{
                    padding: '12px 28px',
                    backgroundColor: '#0D0D0D',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    fontFamily: 'var(--font-jakarta)',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                  }}
                >
                  {isCustomQuote
                    ? 'Submit Brief →'
                    : payFull
                    ? 'Pay Full Amount →'
                    : 'Pay Deposit →'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
