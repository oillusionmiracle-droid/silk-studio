'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import GSAPTitle from '@/components/GSAPTitle';

/* ─────────────────────────────────────────
   DATA & CONSTANTS
───────────────────────────────────────── */

const IS_DROP_ACTIVE = false; // Start with isDropActive = false as requested

// We simulate a target date 7 days from now for the active drop
const DROP_END_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime();

const FAQ_DATA = [
  {
    q: 'What is a pre-order drop?',
    a: 'We open orders for a limited window. After it closes, we print exactly what was ordered. No extras, no restock.',
  },
  {
    q: 'When will I receive my order?',
    a: 'Production begins after the window closes. Delivery within 7–10 days after that.',
  },
  {
    q: 'What sizes are available?',
    a: 'S, M, L, XL, XXL. Size guide on request via WhatsApp.',
  },
  {
    q: 'How do I pay?',
    a: 'Full payment upfront via Paystack.',
  },
  {
    q: 'Can I cancel?',
    a: 'Orders cannot be cancelled once production begins.',
  },
];

const PAST_DROPS: { name: string; month: string; img: string }[] = [
  // Start empty as requested
];

/* ─────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────── */

function DropCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = DROP_END_DATE - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, mins: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ marginBottom: 32 }}>
      <p className="label-mono" style={{ color: '#C6FF33', marginBottom: 12 }}>PRE-ORDER CLOSES IN</p>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: 36, color: '#ffffff', lineHeight: 1 }}>
            {String(timeLeft.days).padStart(2, '0')}
          </p>
          <p className="label-mono" style={{ color: '#888', marginTop: 4 }}>DAYS</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: 36, color: '#ffffff', lineHeight: 1 }}>
            {String(timeLeft.hours).padStart(2, '0')}
          </p>
          <p className="label-mono" style={{ color: '#888', marginTop: 4 }}>HRS</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: 36, color: '#ffffff', lineHeight: 1 }}>
            {String(timeLeft.mins).padStart(2, '0')}
          </p>
          <p className="label-mono" style={{ color: '#888', marginTop: 4 }}>MINS</p>
        </div>
      </div>
    </div>
  );
}

function DropFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: 800, margin: '120px auto 0', padding: '0 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', marginBottom: 48 }}
      >
        <p className="label-mono" style={{ marginBottom: 16 }}>FAQ</p>
        <GSAPTitle as="h2" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 40px)', color: '#ffffff', lineHeight: 1.15 }}>
          Pre-order Rules.
        </GSAPTitle>
      </motion.div>

      <div>
        {FAQ_DATA.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} style={{ borderBottom: '1px solid #2A2A2A', padding: '24px 0' }}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                  padding: 0, textAlign: 'left',
                }}
              >
                <h4 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 20, color: isOpen ? '#C6FF33' : '#ffffff', transition: 'color 0.2s ease', paddingRight: 24 }}>
                  {faq.q}
                </h4>
                <span style={{ color: isOpen ? '#C6FF33' : '#888888', fontSize: 24, lineHeight: 1, transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease, color 0.2s ease' }}>
                  +
                </span>
              </button>
              <div style={{ maxHeight: isOpen ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                <p style={{ fontFamily: 'var(--font-general)', fontSize: 16, color: '#888888', lineHeight: 1.7, paddingTop: 16, paddingBottom: 8 }}>
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */

export default function ApparelPage() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Notify form state
  const [notifyWhatsApp, setNotifyWhatsApp] = useState('+234');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifySuccess(true);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 120 }}>
      
      {/* ── FIXED HERO BACKGROUND ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        <img
          src="/images/hero-bg.jpg"
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,13,13,0.85) 0%, rgba(13,13,13,0.80) 50%, rgba(13,13,13,0.92) 100%)',
        }} />
      </div>

      {/* ── CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
      
      {/* HEADER */}
      <section style={{ paddingTop: 140, paddingBottom: 80, paddingLeft: 24, paddingRight: 24, textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="label-mono"
            style={{ marginBottom: 24 }}
          >
            SILK APPAREL
          </motion.p>
          <GSAPTitle
            as="h1"
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 900,
              fontSize: 'clamp(40px, 6vw, 72px)',
              lineHeight: 1.05,
              letterSpacing: '-1px',
              color: '#ffffff',
              marginBottom: 24,
            }}
          >
            Wear something worth <span style={{ color: '#C6FF33' }}>talking about.</span>
          </GSAPTitle>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: 'var(--font-general)', fontSize: 20, color: '#888888', lineHeight: 1.7 }}
          >
            Limited monthly drops. Pre-order only. Once the window closes, it&apos;s gone.
          </motion.p>
        </div>
      </section>

      {/* DROP STATE */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <AnimatePresence mode="wait">
          {IS_DROP_ACTIVE ? (
            /* ACTIVE DROP HERO */
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: 'rgba(26,26,26,0.8)',
                backdropFilter: 'blur(12px)',
                borderRadius: 4,
                border: '1px solid #2A2A2A',
                padding: '48px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 48,
              }}
            >
              {/* Left: Image */}
              <div style={{ flex: '1 1 50%', minWidth: 300, display: 'flex', flexDirection: 'column' }}>
                <p className="label-mono" style={{ color: '#C6FF33', marginBottom: 24 }}>DROP 001 · NOV 2025</p>
                <div style={{ width: '100%', minHeight: 400, backgroundColor: '#111', borderRadius: 4, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src="/images/drops/drop-001.jpg"
                    alt="Drop 001"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              </div>

              {/* Right: Details & Configurator */}
              <div style={{ flex: '1 1 40%', minWidth: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <GSAPTitle as="h2" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 36, color: '#ffffff', marginBottom: 12 }}>
                  The Anime Heavyweight Tee
                </GSAPTitle>
                <p style={{ fontFamily: 'var(--font-general)', fontSize: 16, color: '#888', marginBottom: 24 }}>
                  100% cotton. Heavyweight. Unisex sizing S–XXL.
                </p>
                <hr style={{ border: 'none', borderTop: '1px solid #2A2A2A', marginBottom: 24 }} />
                <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 28, color: '#ffffff', marginBottom: 32 }}>
                  ₦50,000 <span style={{ fontSize: 16, color: '#888', fontWeight: 400, fontFamily: 'var(--font-general)' }}>per piece</span>
                </p>
                
                <DropCountdown />

                <div style={{ marginBottom: 32 }}>
                  <p className="label-mono" style={{ marginBottom: 12 }}>Select Size</p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          width: 48, height: 48,
                          border: `1px solid ${selectedSize === size ? '#C6FF33' : '#2A2A2A'}`,
                          backgroundColor: selectedSize === size ? 'rgba(198,255,51,0.1)' : '#111',
                          color: selectedSize === size ? '#C6FF33' : '#fff',
                          fontFamily: 'var(--font-mono)', fontSize: 14, cursor: 'pointer', borderRadius: 4,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 40 }}>
                  <p className="label-mono" style={{ marginBottom: 12 }}>Quantity</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ width: 40, height: 40, border: '1px solid #2A2A2A', backgroundColor: '#111', color: '#fff', fontSize: 20, cursor: 'pointer', borderRadius: 4 }}
                    >
                      -
                    </button>
                    <span style={{ fontFamily: 'var(--font-jakarta)', fontSize: 18, color: '#fff', width: 24, textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      style={{ width: 40, height: 40, border: '1px solid #2A2A2A', backgroundColor: '#111', color: '#fff', fontSize: 20, cursor: 'pointer', borderRadius: 4 }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
                  Pre-order Now →
                </button>
                <p className="label-mono" style={{ color: '#888', fontSize: 11, textAlign: 'center' }}>
                  ⚠ Pre-orders close in 7 days. No restock after window closes.
                </p>
              </div>
            </motion.div>
          ) : (
            /* NEXT DROP LOADING STATE */
            <motion.div
              key="inactive"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: 'rgba(26,26,26,0.8)',
                backdropFilter: 'blur(12px)',
                borderRadius: 4,
                border: '1px solid #2A2A2A',
                padding: '64px 24px',
                textAlign: 'center',
                maxWidth: 600,
                margin: '0 auto',
              }}
            >
              <p className="label-mono" style={{ color: '#C6FF33', marginBottom: 24 }}>NEXT DROP LOADING</p>
              <GSAPTitle as="h2" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 28, color: '#ffffff', marginBottom: 16, lineHeight: 1.2 }}>
                The next Silk drop is coming soon.
              </GSAPTitle>
              <p style={{ fontFamily: 'var(--font-general)', fontSize: 16, color: '#888', marginBottom: 40, lineHeight: 1.6 }}>
                Leave your details and we&apos;ll notify you the moment it goes live.
              </p>

              {notifySuccess ? (
                <div style={{ border: '1px solid #C6FF33', backgroundColor: 'rgba(198,255,51,0.05)', padding: '24px', borderRadius: 4 }}>
                  <p style={{ fontFamily: 'var(--font-general)', color: '#C6FF33', fontWeight: 500 }}>
                    You&apos;re on the list. Keep an eye on your WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNotifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
                  <div>
                    <p className="label-mono" style={{ marginBottom: 8 }}>WhatsApp Number</p>
                    <input
                      type="text"
                      value={notifyWhatsApp}
                      onChange={(e) => setNotifyWhatsApp(e.target.value)}
                      required
                      style={{ width: '100%', padding: '12px 16px', backgroundColor: '#111', border: '1px solid #2A2A2A', color: '#fff', borderRadius: 4, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <p className="label-mono" style={{ marginBottom: 8 }}>Email (Optional)</p>
                    <input
                      type="email"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', backgroundColor: '#111', border: '1px solid #2A2A2A', color: '#fff', borderRadius: 4, outline: 'none' }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                    Notify Me →
                  </button>
                  <p className="label-mono" style={{ color: '#555', textAlign: 'center', marginTop: 8 }}>
                    One message when it drops. No spam. Ever.
                  </p>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* FAQ */}
      <DropFAQ />

      {/* PAST DROPS ARCHIVE */}
      <section style={{ maxWidth: 1100, margin: '120px auto 0', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="label-mono" style={{ marginBottom: 32 }}>PREVIOUS DROPS</p>
          {PAST_DROPS.length === 0 ? (
            <div style={{ border: '1px dashed #2A2A2A', borderRadius: 4, padding: '64px 24px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-general)', color: '#555' }}>No past drops yet. Archive is empty.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {PAST_DROPS.map((drop, i) => (
                <div key={i} style={{ border: '1px solid #2A2A2A', borderRadius: 4, overflow: 'hidden', backgroundColor: 'rgba(26,26,26,0.8)', backdropFilter: 'blur(12px)' }}>
                  <img src={drop.img} alt={drop.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                  <div style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, color: '#fff' }}>{drop.name}</h4>
                      <p className="label-mono" style={{ color: '#888', marginTop: 4 }}>{drop.month}</p>
                    </div>
                    <span className="label-mono" style={{ border: '1px solid #333', padding: '4px 8px', color: '#888' }}>SOLD OUT</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* CUSTOM APPAREL CTA */}
      <section style={{ maxWidth: 1100, margin: '120px auto 0', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ backgroundColor: 'rgba(26,26,26,0.8)', backdropFilter: 'blur(12px)', border: '1px solid #2A2A2A', borderRadius: 4, padding: 48, textAlign: 'center' }}
        >
          <GSAPTitle as="h2" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 'clamp(24px, 4vw, 36px)', color: '#ffffff', marginBottom: 16 }}>
            Need shirts for your event or brand?
          </GSAPTitle>
          <p style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#888', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
            Custom bulk orders — your design, your colours, your deadline. Minimum 10 pieces.
          </p>
          <a
            href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I+need+a+custom+apparel+quote"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Get a Custom Quote →
          </a>
        </motion.div>
      </section>

      </div>{/* end content wrapper */}
    </div>
  );
}
