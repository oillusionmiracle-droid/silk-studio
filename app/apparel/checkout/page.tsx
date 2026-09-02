'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import {
  ArrowLeft, CheckCircle2, AlertCircle, ShoppingCart,
  Truck, MapPin, Phone, User, Loader2, Mail, Lock, Check,
} from 'lucide-react';

/* ─────────────────────────────────────────
   DESIGN TOKENS — Ashluxe Minimalist Clean
───────────────────────────────────────── */
const T = {
  bg: '#FAFAF8',
  cardBg: '#FFFFFF',
  border: '#E5E5E5',
  borderDark: '#000000',
  text: '#000000',
  textSecondary: '#666666',
  textMuted: '#999999',
  accent: '#000000',
  error: '#EF4444',
  success: '#10B981',
};

const EASE = [0.16, 1, 0.3, 1] as const;
const formatPrice = (n: number) => `\u20A6${n.toLocaleString()}`;

/* Lagos LGAs / areas for the area selector */
const LAGOS_AREAS = [
  'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa',
  'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye',
  'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland',
  'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere',
  'Lekki Phase 1', 'Lekki Phase 2', 'Victoria Island', 'Ikoyi', 'Yaba', 'Ajah', 'Gbagada',
  'Maryland', 'Ogba', 'Ogudu', 'Ojodu', 'Sangotedo', 'Chevron', 'Oniru',
];

/* ─────────────────────────────────────────
   FORM INPUT (Ashluxe Clean Box)
───────────────────────────────────────── */
function FormField({
  label, icon: Icon, type = 'text', value, onChange, placeholder, required, error,
}: {
  label: string;
  icon: React.ComponentType<any>;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: 'block',
          fontFamily: 'var(--font-apparel)',
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          color: '#000000',
          marginBottom: 6,
        }}
      >
        {label} {required && <span style={{ color: '#000000' }}>*</span>}
      </label>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 14px',
          backgroundColor: '#FFFFFF',
          border: `1px solid ${error ? T.error : '#D4D4D4'}`,
          transition: 'border-color 0.2s ease',
        }}
      >
        <Icon size={16} color="#777777" strokeWidth={1.75} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-apparel)',
            fontSize: 14,
            color: '#000000',
          }}
        />
      </div>
      {error && (
        <p
          style={{
            fontFamily: 'var(--font-apparel)',
            fontSize: 11,
            color: T.error,
            marginTop: 4,
            margin: '4px 0 0',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   CHECKOUT PAGE
───────────────────────────────────────── */
export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  // Delivery fee: free if 10+ items, otherwise ₦2,500
  const deliveryFee = totalItems >= 10 ? 0 : 2500;
  const grandTotal = totalPrice + deliveryFee;

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+234');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');

  // Flow state
  const [status, setStatus] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [isInitializing, setIsInitializing] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Empty cart guard
  if (items.length === 0 && status !== 'success') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: 'var(--font-apparel)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', maxWidth: 440 }}
        >
          <ShoppingCart size={48} color="#cccccc" strokeWidth={1.5} style={{ margin: '0 auto' }} />
          <h2
            style={{
              fontFamily: 'var(--font-apparel)',
              fontWeight: 400,
              fontSize: 24,
              color: '#000000',
              marginTop: 20,
              marginBottom: 8,
              letterSpacing: '-0.3px',
              textTransform: 'uppercase',
            }}
          >
            Your bag is empty
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-apparel)',
              fontSize: 14,
              color: '#777777',
              marginBottom: 28,
              lineHeight: 1.6,
            }}
          >
            Please add items from the Silk Studio collection before proceeding to checkout.
          </p>
          <Link
            href="/apparel"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 32px',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: 'var(--font-apparel)',
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} /> Explore Collection
          </Link>
        </motion.div>
      </div>
    );
  }

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) errors.phone = 'Valid phone number is required';
    if (!address.trim()) errors.address = 'Delivery address is required';
    if (!area) errors.area = 'Please select your delivery area';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ── Paystack integration ─────────────────────── */
  const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_a4cf9b4cda87a899feda2500447f63082be444d3';

  const loadPaystackScript = () => new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window is undefined.'));
    if ((window as any).PaystackPop) return resolve();
    
    const existing = document.querySelector('script[src*="paystack"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Paystack script.')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script.'));
    document.body.appendChild(script);
  });

  const handleCheckout = async () => {
    if (!validate()) {
      return;
    }

    setIsInitializing(true);

    const ref = `SLK-APP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderRef(ref);

    try {
      await loadPaystackScript();
    } catch (err) {
      console.error('Paystack load error:', err);
      setIsInitializing(false);
      setErrorMessage('Unable to load payment gateway. Please check your internet connection and try again.');
      setStatus('error');
      return;
    }

    const customerEmail = email.trim() || `${phone.replace(/\D/g, '') || Date.now()}@orders.silkstudio.ng`;

    const verifyPayment = async (paymentRef: string) => {
      setStatus('processing');

      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl) {
          const res = await fetch(`${supabaseUrl}/functions/v1/verify-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paystack_ref: paymentRef,
              customer_name: name,
              phone,
              email: email || null,
              address,
              area,
              subtotal: totalPrice,
              delivery_fee: deliveryFee,
              total: grandTotal,
              items: items.map((item: any) => ({
                variant_id: item.variantId,
                quantity: item.quantity,
                price_at_purchase: item.price,
              })),
            }),
          });

          if (res.ok) {
            setStatus('success');
            clearCart();
            return;
          }
        }

        setStatus('success');
        clearCart();
      } catch (verifyErr) {
        console.warn('Verify warning:', verifyErr);
        setStatus('success');
        clearCart();
      }
    };

    try {
      const paystackPop = (window as any).PaystackPop;
      if (!paystackPop) {
        throw new Error('Paystack is unavailable');
      }

      if (typeof paystackPop.setup === 'function') {
        const handler = paystackPop.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: customerEmail,
          amount: Math.round(grandTotal * 100),
          currency: 'NGN',
          ref,
          metadata: {
            custom_fields: [
              { display_name: 'Customer Name', variable_name: 'customer_name', value: name },
              { display_name: 'Phone', variable_name: 'phone', value: phone },
              { display_name: 'Address', variable_name: 'address', value: address },
              { display_name: 'Area', variable_name: 'area', value: area },
            ],
          },
          onClose: function () {
            setIsInitializing(false);
          },
          callback: function (response: { reference?: string; status?: string }) {
            setIsInitializing(false);

            if (response?.status === 'success' || response?.reference) {
              void verifyPayment(response.reference || ref);
              return;
            }

            setErrorMessage('Payment was not completed. Please try again.');
            setStatus('error');
          },
        });

        handler.openIframe();
        return;
      }

      const paystackInstance = new paystackPop();
      paystackInstance.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: customerEmail,
        amount: Math.round(grandTotal * 100),
        currency: 'NGN',
        reference: ref,
        onSuccess: async (transaction: any) => {
          setIsInitializing(false);
          setStatus('success');
          clearCart();
        },
        onCancel: () => {
          setIsInitializing(false);
        },
      });
    } catch (err: any) {
      console.error('Paystack initialization error:', err);
      setIsInitializing(false);
      setErrorMessage(err?.message || 'Payment initialization failed. Please try again.');
      setStatus('error');
    }
  };

  /* ── SUCCESS STATE (Ashluxe Monochrome Clean) ─────────────────────── */
  if (status === 'success') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: 'var(--font-apparel)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ textAlign: 'center', maxWidth: 480 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <Check size={32} strokeWidth={2.5} />
          </motion.div>
          <h2
            style={{
              fontFamily: 'var(--font-apparel)',
              fontWeight: 400,
              fontSize: 28,
              letterSpacing: '-0.5px',
              color: '#000000',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Order Confirmed
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-apparel)',
              fontSize: 14,
              color: '#666666',
              marginBottom: 8,
              lineHeight: 1.6,
            }}
          >
            Thank you for your order. Your studio reference is:
          </p>
          <p
            style={{
              fontFamily: 'var(--font-apparel)',
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '1px',
              color: '#000000',
              padding: '12px 20px',
              backgroundColor: '#FAFAF8',
              border: '1px solid #e5e5e5',
              display: 'inline-block',
              marginBottom: 20,
            }}
          >
            {orderRef}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-apparel)',
              fontSize: 13,
              color: '#777777',
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            Our dispatch team will prepare your pieces for delivery and provide dispatch updates via WhatsApp & Email.
          </p>
          <Link
            href="/apparel"
            style={{
              display: 'inline-block',
              padding: '14px 36px',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              fontFamily: 'var(--font-apparel)',
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Return to Collection
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── ERROR STATE ─────────────────────── */
  if (status === 'error') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: 'var(--font-apparel)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', maxWidth: 440 }}
        >
          <AlertCircle size={48} color={T.error} strokeWidth={1.5} style={{ margin: '0 auto' }} />
          <h2
            style={{
              fontFamily: 'var(--font-apparel)',
              fontWeight: 600,
              fontSize: 22,
              color: '#000000',
              marginTop: 20,
              marginBottom: 12,
              textTransform: 'uppercase',
            }}
          >
            Payment Incomplete
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-apparel)',
              fontSize: 14,
              color: '#666666',
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            {errorMessage}
          </p>
          {orderRef && (
            <p
              style={{
                fontFamily: 'var(--font-apparel)',
                fontSize: 12,
                color: '#999999',
                marginBottom: 20,
              }}
            >
              Ref: {orderRef}
            </p>
          )}
          <button
            onClick={() => {
              setStatus('form');
              setErrorMessage('');
            }}
            style={{
              padding: '14px 32px',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              border: 'none',
              fontFamily: 'var(--font-apparel)',
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── PROCESSING STATE ─────────────────────── */
  if (status === 'processing') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: 'var(--font-apparel)',
        }}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <Loader2 size={44} color="#000000" strokeWidth={2} style={{ margin: '0 auto' }} />
          </motion.div>
          <p
            style={{
              fontFamily: 'var(--font-apparel)',
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#000000',
              marginTop: 20,
            }}
          >
            Verifying Transaction...
          </p>
        </motion.div>
      </div>
    );
  }

  /* ── FORM STATE (Ashluxe 2-Column Checkout) ─────────────────────── */
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAF8',
        paddingTop: 36,
        paddingBottom: 80,
        fontFamily: 'var(--font-apparel)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
        {/* Top Header Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
            paddingBottom: 16,
            borderBottom: '1px solid #e5e5e5',
          }}
        >
          <Link
            href="/apparel"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-apparel)',
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#000000',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} /> Back to Shop
          </Link>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/apparel-logo.svg"
            alt="Silk Studio"
            style={{ height: 24, width: 'auto' }}
          />

          <div style={{ width: 90 }} />
        </div>

        {/* Page Title */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: 'var(--font-apparel)',
              fontWeight: 400,
              fontSize: 'clamp(24px, 4vw, 32px)',
              letterSpacing: '-0.5px',
              textTransform: 'uppercase',
              color: '#000000',
              margin: '0 0 6px',
            }}
          >
            Checkout
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: '#666666' }}>
            Complete your shipping details to receive your Silk Studio pieces.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
            alignItems: 'start',
          }}
        >
          {/* Left Column: Delivery Form */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #e5e5e5',
              padding: 'clamp(20px, 3vw, 32px)',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-apparel)',
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#000000',
                margin: '0 0 20px',
                paddingBottom: 12,
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              Delivery Information
            </h2>

            <FormField
              label="Full Name"
              icon={User}
              value={name}
              onChange={setName}
              placeholder="e.g. Tunde Balogun"
              required
              error={formErrors.name}
            />

            <FormField
              label="Phone Number (WhatsApp updates)"
              icon={Phone}
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="+234 801 234 5678"
              required
              error={formErrors.phone}
            />

            <FormField
              label="Email Address (Receipt & tracking)"
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="tunde@example.com"
            />

            <FormField
              label="Street Address"
              icon={MapPin}
              value={address}
              onChange={setAddress}
              placeholder="House number, street name, apartment/unit"
              required
              error={formErrors.address}
            />

            {/* Area Selector */}
            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-apparel)',
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  color: '#000000',
                  marginBottom: 6,
                }}
              >
                Area / LGA (Lagos) <span style={{ color: '#000000' }}>*</span>
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${formErrors.area ? T.error : '#D4D4D4'}`,
                  fontFamily: 'var(--font-apparel)',
                  fontSize: 14,
                  color: area ? '#000000' : '#888888',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                }}
              >
                <option value="">Select Delivery Area</option>
                {LAGOS_AREAS.sort().map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              {formErrors.area && (
                <p
                  style={{
                    fontFamily: 'var(--font-apparel)',
                    fontSize: 11,
                    color: T.error,
                    marginTop: 4,
                    margin: '4px 0 0',
                  }}
                >
                  {formErrors.area}
                </p>
              )}
            </div>

            {/* Validation Notice */}
            {Object.keys(formErrors).length > 0 && (
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#B91C1C',
                  marginBottom: 16,
                  fontFamily: 'var(--font-apparel)',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertCircle size={15} />
                <span>Please complete all required fields marked with *</span>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Pay CTA */}
          <div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #e5e5e5',
                padding: 'clamp(20px, 3vw, 28px)',
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-apparel)',
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#000000',
                  margin: '0 0 16px',
                  paddingBottom: 12,
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                Order Summary ({totalItems})
              </h2>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                {items.map((item) => (
                  <div
                    key={item.variantId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      paddingBottom: 12,
                      borderBottom: '1px solid #f5f5f5',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      {item.image && (
                        <div
                          style={{
                            width: 48,
                            height: 60,
                            backgroundColor: '#FAFAF8',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.productName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontFamily: 'var(--font-apparel)',
                            fontWeight: 600,
                            fontSize: 13,
                            color: '#000000',
                            margin: '0 0 2px',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.productName}
                        </p>
                        <p
                          style={{
                            fontFamily: 'var(--font-apparel)',
                            fontSize: 12,
                            color: '#777777',
                            margin: 0,
                          }}
                        >
                          Size: {item.size} &middot; Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        fontFamily: 'var(--font-apparel)',
                        fontWeight: 600,
                        fontSize: 13,
                        color: '#000000',
                        flexShrink: 0,
                      }}
                    >
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666666' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600, color: '#000000' }}>{formatPrice(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#666666' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Truck size={14} /> Lagos Express Delivery
                  </span>
                  <span style={{ fontWeight: 600, color: deliveryFee === 0 ? '#10B981' : '#000000' }}>
                    {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                  </span>
                </div>
              </div>

              {/* Total Row */}
              <div
                style={{
                  borderTop: '2px solid #000000',
                  paddingTop: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-apparel)',
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: '#000000',
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-apparel)',
                    fontWeight: 700,
                    fontSize: 22,
                    color: '#000000',
                  }}
                >
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            {/* Pay Button (Ashluxe Solid Black Block) */}
            <motion.button
              whileTap={!isInitializing ? { scale: 0.99 } : {}}
              onClick={handleCheckout}
              disabled={isInitializing}
              style={{
                width: '100%',
                height: 54,
                backgroundColor: isInitializing ? '#333333' : '#000000',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: 'var(--font-apparel)',
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: isInitializing ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'background-color 0.2s ease',
              }}
            >
              {isInitializing ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Loader2 size={18} />
                  </motion.div>
                  <span>Connecting to Paystack...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Pay {formatPrice(grandTotal)}</span>
                </>
              )}
            </motion.button>

            <p
              style={{
                fontFamily: 'var(--font-apparel)',
                fontSize: 11,
                color: '#888888',
                textAlign: 'center',
                marginTop: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Lock size={12} />
              <span>Encrypted 256-bit checkout via Paystack</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
