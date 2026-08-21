'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import {
  ArrowLeft, CheckCircle2, AlertCircle, ShoppingCart,
  Truck, MapPin, Phone, User, Loader2,
} from 'lucide-react';

/* ─────────────────────────────────────────
   DESIGN TOKENS (matching apparel page)
───────────────────────────────────────── */
const T = {
  bg: '#F8F5F1',
  accent: '#E85D8C',
  text: '#1A1A2E',
  textMuted: '#6B7280',
  white: '#FFFFFF',
  glass: 'rgba(255, 255, 255, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.7)',
  shadow: '0 8px 32px rgba(0,0,0,0.08)',
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(0,0,0,0.1)',
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
  'Lekki', 'Victoria Island', 'Yaba', 'Ajah', 'Gbagada',
  'Maryland', 'Ogba', 'Ogudu', 'Ojodu', 'Sangotedo',
];

/* ─────────────────────────────────────────
   FORM INPUT
───────────────────────────────────────── */
function FormField({
  label, icon: Icon, type = 'text', value, onChange, placeholder, required, error,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14, color: T.text, marginBottom: 6 }}>
        {label} {required && <span style={{ color: T.accent }}>*</span>}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px', borderRadius: 14,
        background: T.inputBg, border: `1px solid ${error ? T.error : T.inputBorder}`,
        transition: 'border-color 0.2s',
      }}>
        <Icon size={18} color={T.textMuted} strokeWidth={2} />
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font-general)', fontSize: 15, color: T.text,
          }}
        />
      </div>
      {error && (
        <p style={{ fontFamily: 'var(--font-general)', fontSize: 12, color: T.error, marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   CHECKOUT PAGE
───────────────────────────────────────── */
export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  // Delivery fee: free if 10+ items, otherwise placeholder fee
  // TODO: Set actual delivery fee for under 10 items
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
  const [orderRef, setOrderRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Empty cart guard
  if (items.length === 0 && status !== 'success') {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', maxWidth: 400 }}
        >
          <ShoppingCart size={56} color="#e0e0e0" strokeWidth={1.5} />
          <h2 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 24, color: T.text, marginTop: 20, marginBottom: 8 }}>
            Your bag is empty
          </h2>
          <p style={{ fontFamily: 'var(--font-general)', fontSize: 15, color: T.textMuted, marginBottom: 24 }}>
            Add some items to your bag before checking out.
          </p>
          <Link
            href="/apparel"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 100,
              background: T.accent, color: T.white,
              fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 15,
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} /> Browse Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!phone.trim() || phone.length < 10) errors.phone = 'Valid phone number is required';
    if (!address.trim()) errors.address = 'Delivery address is required';
    if (!area) errors.area = 'Please select your area';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ── Paystack integration ─────────────────────── */
  const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const loadPaystackScript = () => new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window is undefined.'));
    if ((window as any).PaystackPop) return resolve();
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script.'));
    document.body.appendChild(script);
  });

  const handleCheckout = async () => {
    if (!validate()) return;
    if (!PAYSTACK_PUBLIC_KEY) {
      setErrorMessage('Payment configuration is missing. Please contact support.');
      setStatus('error');
      return;
    }

    const ref = `SLK-APP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderRef(ref);

    try {
      await loadPaystackScript();
    } catch {
      setErrorMessage('Unable to load payment gateway. Please try again.');
      setStatus('error');
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email || `${phone.replace(/\D/g, '')}@silk.studio`,
      amount: grandTotal * 100, // Paystack expects amount in kobo
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
      onClose: () => {
        // User closed the Paystack modal without completing payment
      },
      callback: async (response: { reference: string; status: string }) => {
        if (response.status === 'success') {
          setStatus('processing');

          try {
            // Call verify-order Edge Function to:
            // 1. Verify payment with Paystack
            // 2. Insert order + order_items
            // 3. Decrement stock
            // 4. Send confirmation email
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const res = await fetch(`${supabaseUrl}/functions/v1/verify-order`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paystack_ref: response.reference,
                customer_name: name,
                phone,
                email: email || null,
                address,
                area,
                subtotal: totalPrice,
                delivery_fee: deliveryFee,
                total: grandTotal,
                items: items.map(item => ({
                  variant_id: item.variantId,
                  quantity: item.quantity,
                  price_at_purchase: item.price,
                })),
              }),
            });

            if (res.ok) {
              setStatus('success');
              clearCart();
            } else {
              const data = await res.json().catch(() => ({}));
              setErrorMessage(data.error || 'Order verification failed. Please contact support with your reference.');
              setStatus('error');
            }
          } catch {
            setErrorMessage('Network error during order verification. Your payment was received — please contact support with reference: ' + response.reference);
            setStatus('error');
          }
        } else {
          setErrorMessage('Payment was not completed. Please try again.');
          setStatus('error');
        }
      },
    });

    handler.openIframe();
  };

  /* ── SUCCESS STATE ─────────────────────── */
  if (status === 'success') {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ textAlign: 'center', maxWidth: 440 }}
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <CheckCircle2 size={72} color={T.success} strokeWidth={1.5} />
          </motion.div>
          <h2 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 28, color: T.text, marginTop: 24, marginBottom: 8 }}>
            Order Confirmed!
          </h2>
          <p style={{ fontFamily: 'var(--font-general)', fontSize: 16, color: T.textMuted, marginBottom: 8, lineHeight: 1.6 }}>
            Your order reference is:
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600, color: T.accent,
            padding: '10px 20px', borderRadius: 12, background: 'rgba(232,93,140,0.08)',
            display: 'inline-block', marginBottom: 16,
          }}>
            {orderRef}
          </p>
          <p style={{ fontFamily: 'var(--font-general)', fontSize: 15, color: T.textMuted, marginBottom: 32, lineHeight: 1.6 }}>
            A confirmation email has been sent. We will reach out on WhatsApp with delivery updates.
          </p>
          <Link
            href="/apparel"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 100,
              background: T.accent, color: T.white,
              fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 15,
              textDecoration: 'none',
            }}
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── ERROR STATE ─────────────────────── */
  if (status === 'error') {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', maxWidth: 440 }}
        >
          <AlertCircle size={56} color={T.error} strokeWidth={1.5} />
          <h2 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 24, color: T.text, marginTop: 20, marginBottom: 12 }}>
            Something went wrong
          </h2>
          <p style={{ fontFamily: 'var(--font-general)', fontSize: 15, color: T.textMuted, marginBottom: 24, lineHeight: 1.6 }}>
            {errorMessage}
          </p>
          {orderRef && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: T.textMuted, marginBottom: 16 }}>
              Reference: {orderRef}
            </p>
          )}
          <button
            onClick={() => { setStatus('form'); setErrorMessage(''); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 100,
              background: T.accent, color: T.white, border: 'none',
              fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 15,
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
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <Loader2 size={48} color={T.accent} strokeWidth={2} />
          </motion.div>
          <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 18, color: T.text, marginTop: 20 }}>
            Verifying your payment...
          </p>
        </motion.div>
      </div>
    );
  }

  /* ── FORM STATE ─────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 100, paddingBottom: 60 }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>

        {/* Back link */}
        <Link
          href="/apparel"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14,
            color: T.textMuted, textDecoration: 'none', marginBottom: 32,
            transition: 'color 0.2s',
          }}
        >
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <h1 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 800, fontSize: 'clamp(28px, 5vw, 36px)', color: T.text, marginBottom: 32 }}>
          Checkout
        </h1>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{
            background: T.white, borderRadius: 20, padding: 24,
            boxShadow: T.shadow, marginBottom: 24,
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, color: T.text, marginBottom: 16 }}>
            Order Summary
          </h3>
          {items.map(item => (
            <div key={item.variantId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>
                  {item.productName}
                </p>
                <p style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: T.textMuted, margin: 0 }}>
                  Size: {item.size} &middot; Qty: {item.quantity}
                </p>
              </div>
              <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: T.textMuted }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14, color: T.text }}>{formatPrice(totalPrice)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: T.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={14} /> Delivery (Lagos)
              </span>
              <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14, color: deliveryFee === 0 ? T.success : T.text }}>
                {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
              </span>
            </div>
            <div style={{ borderTop: `2px solid ${T.text}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, color: T.text }}>Total</span>
              <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 800, fontSize: 20, color: T.accent }}>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </motion.div>

        {/* Delivery Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
          style={{
            background: T.white, borderRadius: 20, padding: 24,
            boxShadow: T.shadow, marginBottom: 24,
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, color: T.text, marginBottom: 20 }}>
            Delivery Details
          </h3>
          <p style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: T.textMuted, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} /> Lagos delivery only
          </p>

          <FormField label="Full Name" icon={User} value={name} onChange={setName} placeholder="Your full name" required error={formErrors.name} />
          <FormField label="Phone Number" icon={Phone} type="tel" value={phone} onChange={setPhone} placeholder="+234 8012345678" required error={formErrors.phone} />
          <FormField label="Email (for receipt)" icon={({ size, color, strokeWidth }: { size?: number; color?: string; strokeWidth?: number }) => (
            <svg width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke={color || T.textMuted} strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          )} type="email" value={email} onChange={setEmail} placeholder="your@email.com" />
          <FormField label="Delivery Address" icon={MapPin} value={address} onChange={setAddress} placeholder="Full street address" required error={formErrors.address} />

          {/* Area selector */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 14, color: T.text, marginBottom: 6 }}>
              Area / LGA <span style={{ color: T.accent }}>*</span>
            </label>
            <select
              value={area}
              onChange={e => setArea(e.target.value)}
              style={{
                width: '100%', padding: '14px 14px', borderRadius: 14,
                background: T.inputBg,
                border: `1px solid ${formErrors.area ? T.error : T.inputBorder}`,
                fontFamily: 'var(--font-general)', fontSize: 15, color: area ? T.text : T.textMuted,
                outline: 'none', cursor: 'pointer', appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
              }}
            >
              <option value="">Select your area</option>
              {LAGOS_AREAS.sort().map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            {formErrors.area && (
              <p style={{ fontFamily: 'var(--font-general)', fontSize: 12, color: T.error, marginTop: 4 }}>{formErrors.area}</p>
            )}
          </div>
        </motion.div>

        {/* Pay button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCheckout}
          style={{
            width: '100%', padding: '18px 24px', borderRadius: 100, border: 'none',
            background: T.accent, color: T.white,
            fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 17,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(232,93,140,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          Pay {formatPrice(grandTotal)}
        </motion.button>

        <p style={{ fontFamily: 'var(--font-general)', fontSize: 12, color: T.textMuted, textAlign: 'center', marginTop: 12 }}>
          Secured by Paystack. Your payment information is encrypted.
        </p>
      </div>
    </div>
  );
}
