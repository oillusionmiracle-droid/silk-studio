'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContactInfo, OrderSpecs } from '@/lib/order/types';
import { X, ArrowRight } from 'lucide-react';

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
  theme?: 'dark' | 'light';
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
  theme = 'dark',
  setSummaryOpen,
  setPayFull,
  onSubmit,
}: PricingSummaryProps) {
  if (!subService) return null;

  const isDark = theme === 'dark';
  const isFormComplete = Boolean(contact.firstName?.trim() && contact.whatsapp?.trim());

  const getQuantityText = () => {
    if (['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers', 'Hoodies'].includes(subService)) {
      return `${totalApparelQty} pcs`;
    }
    if (subService === 'Banners') {
      return `${specs.quantity} unit(s) • ${(specs.width * specs.height).toFixed(1)} sq ft`;
    }
    return `${specs.quantity.toLocaleString()} units`;
  };

  return (
    <>
      {/* MOBILE FLOATING CTA BAR - WHITE CLEAN BUTTON */}
      {isMobile && (
        <>
          <div
            style={{
              position: 'fixed',
              bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 8001,
              width: 'calc(100% - 32px)',
              maxWidth: 400,
            }}
          >
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSummaryOpen(true)}
              style={{
                width: '100%',
                padding: '16px 22px',
                backgroundColor: isDark ? '#ffffff' : '#000000',
                color: isDark ? '#000000' : '#ffffff',
                border: 'none',
                borderRadius: 100,
                fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: isDark
                  ? '0 12px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3)'
                  : '0 12px 32px rgba(0,0,0,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ letterSpacing: '-0.3px', fontWeight: 800 }}>
                  {isCustomQuote ? 'Order Summary' : `Deposit: ₦${deposit.toLocaleString()}`}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 13,
                  fontWeight: 600,
                  opacity: 0.8,
                }}
              >
                <span>Details</span>
                <ArrowRight size={14} strokeWidth={2.5} />
              </div>
            </motion.button>
          </div>

          {/* MOBILE BOTTOM SHEET MODAL */}
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
                    zIndex: 9000,
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(8px)',
                  }}
                />

                {/* Sheet Content */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                  style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9001,
                    backgroundColor: isDark ? '#141416' : '#ffffff',
                    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: '24px 24px 0 0',
                    padding: '20px 20px calc(30px + env(safe-area-inset-bottom, 0px))',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Handle bar & Close */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 4,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        borderRadius: 4,
                        margin: '0 auto',
                        transform: 'translateX(16px)',
                      }}
                    />
                    <button
                      type="button"
                      aria-label="Close summary"
                      onClick={() => setSummaryOpen(false)}
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                        border: 'none',
                        cursor: 'pointer',
                        color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <p
                      style={{
                        fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                        fontWeight: 700,
                        fontSize: 18,
                        color: isDark ? '#ffffff' : '#000000',
                        margin: 0,
                      }}
                    >
                      {subService}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  {!isCustomQuote ? (
                    <div
                      style={{
                        backgroundColor: isDark ? '#1a1a1e' : '#f9fafb',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                        borderRadius: 18,
                        padding: 18,
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 12,
                          paddingBottom: 12,
                          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                            fontSize: 13,
                            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                          }}
                        >
                          Quantity
                        </span>
                        <span
                          style={{
                            fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                            fontSize: 13,
                            fontWeight: 700,
                            color: isDark ? '#ffffff' : '#000000',
                          }}
                        >
                          {getQuantityText()}
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                            fontSize: 13,
                            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                          }}
                        >
                          Total
                        </span>
                        <span
                          style={{
                            fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                            fontWeight: 800,
                            fontSize: 20,
                            color: isDark ? '#ffffff' : '#000000',
                          }}
                        >
                          ₦{total.toLocaleString()}
                        </span>
                      </div>

                      {/* Deposit Box */}
                      <div
                        style={{
                          marginTop: 12,
                          padding: '14px 16px',
                          borderRadius: 14,
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                              fontSize: 11,
                              fontWeight: 600,
                              letterSpacing: 1,
                              textTransform: 'uppercase',
                              color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                              margin: '0 0 2px',
                            }}
                          >
                            Due Today (75% Deposit)
                          </p>
                          <p
                            style={{
                              fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                              fontWeight: 900,
                              fontSize: 24,
                              color: isDark
                                ? payFull
                                  ? 'rgba(255,255,255,0.3)'
                                  : '#ffffff'
                                : payFull
                                ? 'rgba(0,0,0,0.3)'
                                : '#000000',
                              textDecoration: payFull ? 'line-through' : 'none',
                              margin: 0,
                            }}
                          >
                            ₦{deposit.toLocaleString()}
                          </p>
                        </div>

                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            cursor: 'pointer',
                            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                            padding: '6px 12px',
                            borderRadius: 100,
                            fontSize: 12,
                            fontWeight: 600,
                            color: isDark ? '#ffffff' : '#000000',
                            fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={payFull}
                            onChange={(e) => setPayFull(e.target.checked)}
                          />
                          Pay 100%
                        </label>
                      </div>
                    </div>
                  ) : null}

                  {/* Action CTA */}
                  {isFormComplete ? (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSummaryOpen(false);
                        onSubmit();
                      }}
                      style={{
                        width: '100%',
                        padding: '16px 24px',
                        backgroundColor: isDark ? '#ffffff' : '#000000',
                        color: isDark ? '#000000' : '#ffffff',
                        border: 'none',
                        borderRadius: 14,
                        fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                        fontWeight: 800,
                        fontSize: 15,
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span>
                        {isCustomQuote
                          ? 'Send Brief to Studio'
                          : payFull
                          ? `Pay Full ₦${total.toLocaleString()}`
                          : `Pay Deposit ₦${deposit.toLocaleString()}`}
                      </span>
                    </motion.button>
                  ) : (
                    <div
                      style={{
                        backgroundColor: isDark ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 193, 7, 0.15)',
                        border: '1px solid rgba(255, 193, 7, 0.3)',
                        borderRadius: 12,
                        padding: '12px 16px',
                        textAlign: 'center',
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                          fontSize: 13,
                          color: '#d97706',
                          margin: 0,
                          fontWeight: 600,
                        }}
                      >
                        Please enter your Name and WhatsApp to continue
                      </p>
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}

      {/* DESKTOP FLOATING DOCK */}
      {!isMobile && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: 0,
            right: 0,
            zIndex: 40,
            padding: '0 24px',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              maxWidth: 1000,
              margin: '0 auto',
              backgroundColor: isDark ? 'rgba(20, 20, 24, 0.94)' : 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: 20,
              padding: '14px 24px',
              boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.7)' : '0 20px 50px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              pointerEvents: 'auto',
            }}
          >
            {/* Left: Service pill */}
            <div>
              <p
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: isDark ? '#ffffff' : '#000000',
                  margin: '0 0 2px',
                }}
              >
                {subService}
              </p>
              <p
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                  fontSize: 12,
                  color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  margin: 0,
                }}
              >
                {getQuantityText()}
              </p>
            </div>

            {/* Middle: Pricing Breakdown */}
            {!isCustomQuote ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div>
                  <p
                    style={{
                      fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                      fontSize: 11,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                      margin: '0 0 2px',
                    }}
                  >
                    Total
                  </p>
                  <p
                    style={{
                      fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: isDark ? '#ffffff' : '#000000',
                      margin: 0,
                    }}
                  >
                    ₦{total.toLocaleString()}
                  </p>
                </div>

                <div
                  style={{
                    width: 1,
                    height: 28,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  }}
                />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <p
                      style={{
                        fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                        fontSize: 11,
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                        color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                        margin: 0,
                        fontWeight: 600,
                      }}
                    >
                      {payFull ? 'Full Payment' : '75% Deposit'}
                    </p>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        cursor: 'pointer',
                        fontSize: 11,
                        color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                        fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={payFull}
                        onChange={(e) => setPayFull(e.target.checked)}
                      />
                      100%
                    </label>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                      fontWeight: 800,
                      fontSize: 20,
                      color: isDark ? '#ffffff' : '#000000',
                      margin: 0,
                    }}
                  >
                    ₦{(payFull ? total : deposit).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Right: Submit Button */}
            {isFormComplete ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onSubmit}
                style={{
                  padding: '12px 28px',
                  backgroundColor: isDark ? '#ffffff' : '#000000',
                  color: isDark ? '#000000' : '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)',
                  whiteSpace: 'nowrap',
                }}
              >
                {isCustomQuote
                  ? 'Submit Brief'
                  : payFull
                  ? `Pay Full ₦${total.toLocaleString()}`
                  : `Pay Deposit ₦${deposit.toLocaleString()}`}
              </motion.button>
            ) : (
              <span
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                  fontSize: 12,
                  color: '#d97706',
                  backgroundColor: isDark ? 'rgba(255, 193, 7, 0.08)' : 'rgba(255, 193, 7, 0.12)',
                  padding: '8px 16px',
                  borderRadius: 10,
                  whiteSpace: 'nowrap',
                }}
              >
                Enter Name & WhatsApp to submit
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
