'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { gsap } from 'gsap';
import ReferenceUpload from '@/components/ReferenceUpload';
import {
  FLYER_RATES,
  LAMINATION_FLYER,
  BANNER_RATE,
  EYELET_FEE,
  JOTTER_RATE,
  JOTTER_ADDONS,
  BIZCARD_RATE,
  BIZCARD_ADDONS,
  ID_CARD_RATES,
  APPAREL_RATES,
  CUSTOM_QUOTE_SERVICES,
} from '@/lib/pricing';

const CATEGORIES = [
  { id: 'Print', label: 'Print', icon: '📄' },
  { id: 'Apparel', label: 'Apparel', icon: '👕' },
  { id: 'Design', label: 'Design', icon: '✨' },
  { id: 'Web', label: 'Web', icon: '🌐' },
  { id: 'Bundle', label: 'Bundle', icon: '📦' },
];

const SUB_SERVICES: Record<string, string[]> = {
  Print: ['Flyers & Handbills', 'Banners', 'Billboards & Flex', 'Jotters & Notepads', 'ID Cards', 'Business Cards', 'Letterheads', 'Other'],
  Apparel: ['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers', 'Hoodies', 'Event Merch Set', 'Corporate Uniforms', 'Other'],
  Design: ['Logo & Brand Identity', 'Event Branding Kit', 'Social Media Templates', 'Print-Ready Artwork', 'Other'],
  Web: ['Landing Page', 'Business Website', 'E-commerce', 'Event Page', 'Other'],
  Bundle: ['Event Package', 'Business Starter', 'Custom Bundle'],
};

const SERVICE_ICONS: Record<string, string> = {
  'Flyers & Handbills': '📄',
  'Banners': '🎯',
  'Billboards & Flex': '📻',
  'Jotters & Notepads': '📓',
  'ID Cards': '🆔',
  'Business Cards': '💳',
  'Letterheads': '📧',
  'Custom T-Shirts': '👕',
  'Sweatshirts': '🧥',
  'Grey Joggers': '👖',
  'Hoodies': '🧢',
  'Event Merch Set': '🎁',
  'Corporate Uniforms': '👔',
  'Logo & Brand Identity': '✨',
  'Event Branding Kit': '🎨',
  'Social Media Templates': '📱',
  'Print-Ready Artwork': '🖼️',
  'Landing Page': '🌐',
  'Business Website': '🏢',
  'E-commerce': '🛍️',
  'Event Page': '🎪',
  'Event Package': '📦',
  'Business Starter': '🚀',
  'Custom Bundle': '🎯',
};

export default function OrderPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [subService, setSubService] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [referenceFileUrl, setReferenceFileUrl] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const [specs, setSpecs] = useState({
    size: 'A5',
    sides: 'Single-sided',
    lamination: 'None',
    quantity: 100,
    width: 7,
    height: 3,
    eyelets: 'No',
    innerSheets: 'Plain',
    binding: 'Spiral',
    cover: 'Soft Cover',
    idType: 'Standard',
    stock: 'Standard 300gsm',
    corners: 'Square',
    apparelSizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    deadline: '',
    description: '',
  });

  const [contact, setContact] = useState({
    firstName: '', lastName: '', whatsapp: '+234', email: '', source: '',
  });

  const [total, setTotal] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [isCustomQuote, setIsCustomQuote] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateSpec = (key: keyof typeof specs, value: any) =>
    setSpecs(prev => ({ ...prev, [key]: value }));

  const updateApparelSize = (size: string, value: number) =>
    setSpecs(prev => ({ ...prev, apparelSizes: { ...prev.apparelSizes, [size]: Math.max(0, value) } }));

  const totalApparelQty = Object.values(specs.apparelSizes).reduce((a, b) => a + b, 0);

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

  const launchPaystack = async (orderRef: string, orderMessage: string) => {
    if (!PAYSTACK_PUBLIC_KEY) {
      alert('Paystack public key is missing.');
      return;
    }
    try {
      await loadPaystackScript();
    } catch (error) {
      console.error(error);
      alert('Unable to load Paystack. Please try again later.');
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: contact.email || `${contact.whatsapp.replace(/\D/g, '')}@silk.studio`,
      amount: deposit * 100,
      currency: 'NGN',
      ref: orderRef,
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'customer_name', value: `${contact.firstName} ${contact.lastName}` },
          { display_name: 'WhatsApp', variable_name: 'whatsapp', value: contact.whatsapp },
        ],
      },
      onClose: () => {
        alert('Payment was cancelled. Your order was not submitted.');
      },
      callback: (response: { reference: string; status: string }) => {
        if (response.status === 'success') {
          const paidMessage = orderMessage.replace('Price:* Total: ₦', `Price:* Paid deposit via Paystack (Ref: ${response.reference})\nTotal: ₦`);
          window.open(`https://wa.me/2347064829776?text=${encodeURIComponent(paidMessage)}`, '_blank');
          setIsSubmitted(true);
        } else {
          alert('Payment was not completed. Please try again.');
        }
      },
    });

    handler.openIframe();
  };

  useEffect(() => {
    if (!subService || CUSTOM_QUOTE_SERVICES.includes(subService)) {
      setIsCustomQuote(true); setTotal(0); setDeposit(0); return;
    }
    setIsCustomQuote(false);
    let t = 0;
    switch (subService) {
      case 'Flyers & Handbills': {
        const rk = `${specs.size}-${specs.sides}`;
        t = (FLYER_RATES[rk] || 0) * specs.quantity * (LAMINATION_FLYER[specs.lamination] || 1);
        break;
      }
      case 'Banners': {
        t = specs.width * specs.height * BANNER_RATE + (specs.eyelets === 'Yes' ? EYELET_FEE : 0);
        break;
      }
      case 'Jotters & Notepads': {
        const la = specs.lamination === 'Matte' ? JOTTER_ADDONS.lamination_matte : specs.lamination === 'Gloss' ? JOTTER_ADDONS.lamination_gloss : 0;
        t = JOTTER_RATE * specs.quantity * (1 + la) + (specs.binding === 'Perfect Binding' ? JOTTER_ADDONS.perfect_binding : 0) + (specs.cover === 'Hard Cover' ? JOTTER_ADDONS.hard_cover : 0);
        break;
      }
      case 'ID Cards': t = (ID_CARD_RATES[specs.idType] || 0) * specs.quantity; break;
      case 'Business Cards': {
        t = BIZCARD_RATE * specs.quantity + (specs.stock.includes('600gsm') ? BIZCARD_ADDONS.super_thick : 0) + (specs.corners === 'Rounded' ? BIZCARD_ADDONS.rounded_corners : 0);
        break;
      }
      case 'Custom T-Shirts': case 'Sweatshirts': case 'Grey Joggers': {
        t = (APPAREL_RATES[subService] || 0) * totalApparelQty;
        break;
      }
    }
    setTotal(Math.round(t));
    setDeposit(Math.round(t * 0.75));
  }, [subService, specs, totalApparelQty]);

  const handleSubmit = async () => {
    if (!contact.firstName || !contact.whatsapp || !subService) {
      alert('Please fill in your name, WhatsApp number, and select a service.');
      return;
    }
    const orderRef = `SLK-${Math.floor(1000 + Math.random() * 9000)}`;
    let specsText = 'Custom Specifications';
    if (subService === 'Flyers & Handbills') specsText = `${specs.size}, ${specs.sides}, ${specs.lamination} Lamination`;
    else if (subService === 'Banners') specsText = `${specs.width}ft × ${specs.height}ft, Eyelets: ${specs.eyelets}`;
    else if (subService === 'Jotters & Notepads') specsText = `${specs.innerSheets}, ${specs.lamination}, ${specs.binding}, ${specs.cover}`;
    else if (subService === 'ID Cards') specsText = specs.idType;
    else if (subService === 'Business Cards') specsText = `${specs.stock}, ${specs.lamination}, ${specs.corners} Corners`;
    else if (['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers'].includes(subService)) {
      const s = specs.apparelSizes;
      specsText = `S(${s.S}) M(${s.M}) L(${s.L}) XL(${s.XL}) XXL(${s.XXL})`;
    }
    const msg = `*NEW ORDER BRIEF [${orderRef}]*\n------------------------------\n*Service:* ${subService}\n*Specs:* ${specsText}\n*Quantity:* ${['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers'].includes(subService) ? totalApparelQty : specs.quantity}\n*Deadline:* ${specs.deadline || 'Flexible'}\n\n*Description:*\n${specs.description || 'No description'}\n\n*Reference File:* ${referenceFileUrl || 'None'}\n\n*Customer:*\n- Name: ${contact.firstName} ${contact.lastName}\n- WhatsApp: ${contact.whatsapp}\n- Email: ${contact.email || 'N/A'}\n- Via: ${contact.source || 'N/A'}\n\n*Price:* ${isCustomQuote ? 'Quote Requested' : `Total: ₦${total.toLocaleString()} | Deposit: ₦${deposit.toLocaleString()}`}\n------------------------------`.trim();

    if (isCustomQuote) {
      window.open(`https://wa.me/2347064829776?text=${encodeURIComponent(msg)}`, '_blank');
      setIsSubmitted(true);
      return;
    }

    if (!contact.email) {
      alert('Please provide an email address to proceed with Paystack payment.');
      return;
    }

    await launchPaystack(orderRef, msg);
  };

  if (isSubmitted) {
    return (
      <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f0fe 25%, #fce4ec 50%, #f3e5f5 75%, #e8f5e9 100%)' }}>
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ backgroundColor: 'white', borderRadius: 24, padding: '60px 48px', textAlign: 'center', maxWidth: 520, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#C6FF33', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
            <h1 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: 48, color: '#0D0D0D', marginBottom: 16, lineHeight: 1.1 }}>
              You&apos;re booked.
            </h1>
            <p style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#555', lineHeight: 1.6, marginBottom: 32 }}>
              We&apos;ve received your brief. Expect a WhatsApp message within 2 hours to confirm details.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/portfolio" style={{ backgroundColor: '#f5f5f5', borderRadius: 12, padding: '14px 28px', textDecoration: 'none', fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 15, color: '#333' }}>
                View Portfolio
              </Link>
              <Link href="/" style={{ backgroundColor: '#0D0D0D', borderRadius: 12, padding: '14px 28px', textDecoration: 'none', fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 15, color: '#fff' }}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f0fe 25%, #fce4ec 50%, #f3e5f5 75%, #e8f5e9 100%)' }}>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: isMobile ? '100%' : 1200, margin: '0 auto', padding: isMobile ? '20px 16px 120px' : '60px 24px' }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: isMobile ? 32 : 60, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#666', marginBottom: 16 }}>LET&apos;S WORK</p>
          <h1 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: isMobile ? 36 : 56, lineHeight: 1.1, letterSpacing: '-1px', color: '#0D0D0D', marginBottom: 16 }}>
            Tell us what you need.
          </h1>
          <p style={{ fontFamily: 'var(--font-general)', fontSize: 16, color: '#666', lineHeight: 1.6, maxWidth: 600, margin: '0 auto' }}>
            Fill this in and we&apos;ll reach out within 2 hours. Deposit locks your slot.
          </p>
        </div>

        {/* TWO-COLUMN LAYOUT: FORM + STICKY SUMMARY */}
        <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '1fr 380px', gap: isMobile ? 24 : 32, alignItems: isMobile ? undefined : 'start' }}>
          
          {/* MAIN FORM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* STEP 1: CATEGORY SELECTION WITH INLINE SUB-SERVICES */}
            <div style={{ backgroundColor: 'white', borderRadius: 20, padding: isMobile ? 20 : 28, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#C6FF33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#0D0D0D', letterSpacing: 1 }}>01</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, color: '#0D0D0D', margin: 0 }}>What do you need?</h2>
              </div>

              {/* CATEGORY PILLS */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id);
                      setSubService(null);
                      setExpandedCategory(expandedCategory === cat.id ? null : cat.id);
                    }}
                    style={{
                      position: 'relative',
                      padding: isMobile ? '12px 14px' : '14px 16px',
                      borderRadius: 12,
                      border: `2px solid ${category === cat.id ? '#C6FF33' : '#e0e0e0'}`,
                      backgroundColor: category === cat.id ? 'rgba(198,255,51,0.1)' : '#f9f9f9',
                      fontFamily: 'var(--font-jakarta)',
                      fontWeight: category === cat.id ? 700 : 600,
                      fontSize: 14,
                      color: category === cat.id ? '#3a5a00' : '#444',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* SUB-SERVICES GRID - INLINE, NO EXPANSION NEEDED */}
              <AnimatePresence>
                {category && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingTop: 20, borderTop: '1px solid #e0e0e0' }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 14 }}>Select service</p>
                      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(120px, 1fr))' : 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                        {SUB_SERVICES[category].map(sub => (
                          <button
                            key={sub}
                            onClick={() => setSubService(sub)}
                            style={{
                              position: 'relative',
                              padding: '14px 12px',
                              borderRadius: 12,
                              border: `2px solid ${subService === sub ? '#C6FF33' : '#e0e0e0'}`,
                              backgroundColor: subService === sub ? 'rgba(198,255,51,0.15)' : '#f9f9f9',
                              fontFamily: 'var(--font-general)',
                              fontWeight: subService === sub ? 600 : 400,
                              fontSize: 13,
                              color: subService === sub ? '#3a5a00' : '#444',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              textAlign: 'center',
                              lineHeight: 1.3,
                            }}
                          >
                            <span style={{ fontSize: 18, display: 'block', marginBottom: 4 }}>{SERVICE_ICONS[sub] || '✨'}</span>
                            {sub}
                            {subService === sub && (
                              <div style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', backgroundColor: '#C6FF33', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(198,255,51,0.3)' }}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <polyline points="2 6 5 9 10 3" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* STEP 2: SPECS - ONLY SHOW IF SUB-SERVICE SELECTED */}
            <AnimatePresence>
              {subService && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ backgroundColor: 'white', borderRadius: 20, padding: isMobile ? 20 : 28, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#C6FF33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#0D0D0D', letterSpacing: 1 }}>02</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, color: '#0D0D0D', margin: 0 }}>Specs</h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {subService === 'Flyers & Handbills' && <>
                      <SpecField label="Size">
                        {['A5', 'A4', 'A3'].map(opt => <Pill key={opt} label={opt} isActive={specs.size === opt} onClick={() => updateSpec('size', opt)} />)}
                      </SpecField>
                      <SpecField label="Sides">
                        {['Single-sided', 'Double-sided'].map(opt => <Pill key={opt} label={opt} isActive={specs.sides === opt} onClick={() => updateSpec('sides', opt)} />)}
                      </SpecField>
                      <SpecField label="Lamination">
                        {['None', 'Matte', 'Gloss'].map(opt => <Pill key={opt} label={opt} isActive={specs.lamination === opt} onClick={() => updateSpec('lamination', opt)} />)}
                      </SpecField>
                      <SpecField label="Quantity">
                        <QtyInput value={specs.quantity} min={100} step={100} onChange={v => updateSpec('quantity', v)} quickVals={[100, 250, 500, 1000]} />
                      </SpecField>
                    </>}

                    {subService === 'Banners' && <>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <SpecField label="Width (ft)" flex>
                          <QtyInput value={specs.width} min={1} step={0.5} onChange={v => updateSpec('width', v)} />
                        </SpecField>
                        <SpecField label="Height (ft)" flex>
                          <QtyInput value={specs.height} min={1} step={0.5} onChange={v => updateSpec('height', v)} />
                        </SpecField>
                      </div>
                      <div style={{ backgroundColor: '#f5f5f5', padding: '12px 16px', borderRadius: 10, textAlign: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15, color: '#0D0D0D' }}>{specs.width} × {specs.height} = {(specs.width * specs.height).toFixed(1)} sq ft</span>
                      </div>
                      <SpecField label="Eyelets">
                        {['Yes', 'No'].map(opt => <Pill key={opt} label={opt} isActive={specs.eyelets === opt} onClick={() => updateSpec('eyelets', opt)} />)}
                      </SpecField>
                      <SpecField label="Quantity">
                        <QtyInput value={specs.quantity} min={1} step={1} onChange={v => updateSpec('quantity', v)} />
                      </SpecField>
                    </>}

                    {subService === 'Jotters & Notepads' && <>
                      <SpecField label="Inner Sheets">
                        {['Plain', 'Ruled'].map(opt => <Pill key={opt} label={opt} isActive={specs.innerSheets === opt} onClick={() => updateSpec('innerSheets', opt)} />)}
                      </SpecField>
                      <SpecField label="Lamination">
                        {['None', 'Matte', 'Gloss'].map(opt => <Pill key={opt} label={opt} isActive={specs.lamination === opt} onClick={() => updateSpec('lamination', opt)} />)}
                      </SpecField>
                      <SpecField label="Binding">
                        {['Spiral', 'Perfect Binding'].map(opt => <Pill key={opt} label={opt + (opt === 'Perfect Binding' ? ' +₦3,000' : '')} isActive={specs.binding === opt} onClick={() => updateSpec('binding', opt)} />)}
                      </SpecField>
                      <SpecField label="Cover">
                        {['Soft Cover', 'Hard Cover'].map(opt => <Pill key={opt} label={opt + (opt === 'Hard Cover' ? ' +₦2,000' : '')} isActive={specs.cover === opt} onClick={() => updateSpec('cover', opt)} />)}
                      </SpecField>
                      <SpecField label="Quantity">
                        <QtyInput value={specs.quantity} min={50} step={50} onChange={v => updateSpec('quantity', v)} quickVals={[50, 100, 200, 500]} />
                      </SpecField>
                    </>}

                    {subService === 'ID Cards' && <>
                      <SpecField label="Card Type">
                        {['Standard', 'Lanyard + Holder', 'Badge Reel + Holder'].map(opt => {
                          const price = opt === 'Standard' ? '₦4,500' : '₦7,500';
                          return <Pill key={opt} label={`${opt} — ${price}`} isActive={specs.idType === opt} onClick={() => updateSpec('idType', opt)} />;
                        })}
                      </SpecField>
                      <SpecField label="Quantity">
                        <QtyInput value={specs.quantity} min={1} step={1} onChange={v => updateSpec('quantity', v)} />
                      </SpecField>
                    </>}

                    {subService === 'Business Cards' && <>
                      <SpecField label="Stock">
                        {['Standard 300gsm', 'Super Thick 600gsm'].map(opt => <Pill key={opt} label={opt + (opt.includes('600') ? ' +₦2,000' : '')} isActive={specs.stock === opt} onClick={() => updateSpec('stock', opt)} />)}
                      </SpecField>
                      <SpecField label="Lamination">
                        {['Matte', 'Gloss'].map(opt => <Pill key={opt} label={opt} isActive={specs.lamination === opt} onClick={() => updateSpec('lamination', opt)} />)}
                      </SpecField>
                      <SpecField label="Corners">
                        {['Square', 'Rounded'].map(opt => <Pill key={opt} label={opt + (opt === 'Rounded' ? ' +₦2,000' : '')} isActive={specs.corners === opt} onClick={() => updateSpec('corners', opt)} />)}
                      </SpecField>
                      <SpecField label="Quantity">
                        <QtyInput value={specs.quantity} min={100} step={100} onChange={v => updateSpec('quantity', v)} quickVals={[100, 250, 500, 1000]} />
                      </SpecField>
                    </>}

                    {subService && ['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers'].includes(subService) && (
                      <SpecField label="Size Breakdown">
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%' }}>
                          {Object.keys(specs.apparelSizes).map(size => (
                            <div key={size} style={{ flex: '1 1 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: '#666', textTransform: 'uppercase', margin: 0 }}>{size}</p>
                              <input
                                type="number" min="0"
                                value={specs.apparelSizes[size as keyof typeof specs.apparelSizes]}
                                onChange={e => updateApparelSize(size, parseInt(e.target.value) || 0)}
                                style={{ width: '100%', textAlign: 'center', backgroundColor: '#f5f5f5', border: '2px solid #e0e0e0', borderRadius: 8, color: '#0D0D0D', padding: '8px 4px', fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16, outline: 'none' }}
                              />
                            </div>
                          ))}
                        </div>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#999', letterSpacing: 1, textTransform: 'uppercase', marginTop: 12, margin: 0 }}>Total: {totalApparelQty} pieces</p>
                      </SpecField>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP 3: DEADLINE & DESCRIPTION */}
            <AnimatePresence>
              {subService && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ backgroundColor: 'white', borderRadius: 20, padding: isMobile ? 20 : 28, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#C6FF33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#0D0D0D', letterSpacing: 1 }}>03</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, color: '#0D0D0D', margin: 0 }}>Details</h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 10 }}>Deadline (Optional)</label>
                      <input
                        type="date"
                        value={specs.deadline}
                        onChange={e => updateSpec('deadline', e.target.value)}
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        style={{ width: '100%', padding: '12px 14px', backgroundColor: '#f5f5f5', border: '2px solid #e0e0e0', borderRadius: 10, color: '#0D0D0D', fontFamily: 'var(--font-general)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 10 }}>Description (Optional)</label>
                      <textarea
                        rows={3}
                        value={specs.description}
                        onChange={e => updateSpec('description', e.target.value)}
                        placeholder="Tell us what this is for, colours, anything important."
                        style={{ width: '100%', padding: '12px 14px', backgroundColor: '#f5f5f5', border: '2px solid #e0e0e0', borderRadius: 10, color: '#0D0D0D', fontFamily: 'var(--font-general)', fontSize: 14, resize: 'vertical', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP 4: FILES & CONTACT */}
            <AnimatePresence>
              {subService && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{ backgroundColor: 'white', borderRadius: 20, padding: isMobile ? 20 : 28, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#C6FF33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#0D0D0D', letterSpacing: 1 }}>04</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, color: '#0D0D0D', margin: 0 }}>Your Info</h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <FormInput label="First Name" value={contact.firstName} onChange={v => setContact(c => ({ ...c, firstName: v }))} flex />
                      <FormInput label="Last Name" value={contact.lastName} onChange={v => setContact(c => ({ ...c, lastName: v }))} flex />
                    </div>
                    <FormInput label="WhatsApp Number" value={contact.whatsapp} onChange={v => setContact(c => ({ ...c, whatsapp: v }))} type="tel" />
                    <FormInput label="Email (Optional)" value={contact.email} onChange={v => setContact(c => ({ ...c, email: v }))} type="email" />
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 10 }}>How did you hear about us?</label>
                      <select
                        value={contact.source}
                        onChange={e => setContact(c => ({ ...c, source: e.target.value }))}
                        style={{ width: '100%', padding: '12px 14px', backgroundColor: '#f5f5f5', border: '2px solid #e0e0e0', borderRadius: 10, color: contact.source ? '#0D0D0D' : '#999', fontFamily: 'var(--font-general)', fontSize: 14, outline: 'none' }}
                      >
                        <option value="">Select...</option>
                        {['Instagram', 'TikTok', 'WhatsApp', 'Referral', 'Google', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 16, marginTop: 16 }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 10 }}>Reference Files (Optional)</p>
                      <ReferenceUpload onUpload={(url: string) => setReferenceFileUrl(url)} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* STICKY SUMMARY CARD - ALWAYS VISIBLE */}
          <div style={{ position: isMobile ? 'fixed' : 'sticky', bottom: isMobile ? 0 : 'auto', top: isMobile ? undefined : 100, left: 0, right: 0, width: '100%', zIndex: isMobile ? 40 : 1, padding: isMobile ? '16px' : '0' }}>
            <div style={{ backgroundColor: 'white', borderRadius: isMobile ? '20px 20px 0 0' : 20, padding: 24, boxShadow: isMobile ? '0 -4px 24px rgba(0,0,0,0.08)' : '0 4px 16px rgba(0,0,0,0.05)' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 18, margin: 0 }}>ORDER</p>

              {!subService ? (
                <div style={{ textAlign: 'center', color: '#999' }}>
                  <p style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: '#999' }}>Select a service to see pricing and summary.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#aaa', margin: 0 }}>Service</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                      <span style={{ fontSize: 20 }}>{SERVICE_ICONS[subService] || '✨'}</span>
                      <p style={{ fontFamily: 'var(--font-general)', fontSize: 15, fontWeight: 600, color: '#0D0D0D', margin: 0 }}>{subService}</p>
                    </div>
                  </div>

                  {!isCustomQuote && (
                    <>
                      <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 12 }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#aaa', margin: 0 }}>Quantity</p>
                        <p style={{ fontFamily: 'var(--font-general)', fontSize: 15, color: '#333', margin: '6px 0 0 0' }}>
                          {['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers'].includes(subService) ? `${totalApparelQty} pcs` : `${specs.quantity}`}
                        </p>
                      </div>

                      <div style={{ backgroundColor: '#f5f5f5', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#999', margin: 0 }}>Total</p>
                        <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 28, color: '#0D0D0D', margin: '6px 0 0 0' }}>₦{total.toLocaleString()}</p>
                      </div>

                      <div style={{ backgroundColor: '#C6FF33', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#0D0D0D', margin: 0 }}>Deposit (75%)</p>
                        <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: 24, color: '#0D0D0D', margin: '4px 0 0 0' }}>₦{deposit.toLocaleString()}</p>
                      </div>
                    </>
                  )}

                  {isCustomQuote && (
                    <div style={{ backgroundColor: '#f0f0f0', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
                      <p style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: '#666', lineHeight: 1.5, margin: 0 }}>Custom quote — we&apos;ll send pricing within 2hrs.</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                    {['75% deposit required', '1 free revision', 'WhatsApp updates', 'Within 2 hours'].map(line => (
                      <div key={line} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#C6FF33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                            <polyline points="2 6 5 9 10 3" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: '#555' }}>{line}</span>
                      </div>
                    ))}
                  </div>

                  {/* SUBMIT BUTTON */}
                  {contact.firstName && contact.whatsapp && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleSubmit}
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
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.9'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                    >
                      {isCustomQuote ? 'Submit Brief →' : 'Pay Deposit →'}
                    </motion.button>
                  )}

                  {(!contact.firstName || !contact.whatsapp) && subService && (
                    <div style={{ backgroundColor: '#fff3cd', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
                      <p style={{ fontFamily: 'var(--font-general)', fontSize: 12, color: '#856404', margin: 0 }}>Complete your info to proceed</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/* REUSABLE COMPONENTS */
/* ═══════════════════════════════════════════════════════════════ */

function SpecField({ label, children, flex }: { label: string; children: React.ReactNode; flex?: boolean }) {
  return (
    <div style={{ flex: flex ? '1' : 'auto' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#888', marginBottom: 10, margin: 0 }}>{label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>{children}</div>
    </div>
  );
}

function Pill({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 16px',
        borderRadius: 100,
        border: `2px solid ${isActive ? '#C6FF33' : '#e0e0e0'}`,
        backgroundColor: isActive ? 'rgba(198,255,51,0.12)' : '#f9f9f9',
        color: isActive ? '#3a5a00' : '#444',
        fontFamily: 'var(--font-general)',
        fontSize: 13,
        fontWeight: isActive ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
}

function QtyInput({ value, min, step, onChange, quickVals }: {
  value: number; min: number; step: number;
  onChange: (v: number) => void;
  quickVals?: number[];
}) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'fit-content', marginBottom: quickVals ? 12 : 0 }}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          style={{ width: 38, height: 38, borderRadius: '8px 0 0 8px', border: '2px solid #e0e0e0', borderRight: 'none', backgroundColor: '#f9f9f9', cursor: 'pointer', fontFamily: 'var(--font-jakarta)', fontSize: 18, color: '#333' }}
        >−</button>
        <input
          type="number" min={min} step={step} value={value}
          onChange={e => onChange(Math.max(min, parseInt(e.target.value) || min))}
          style={{ width: 80, textAlign: 'center', padding: '8px 6px', border: '2px solid #e0e0e0', borderLeft: 'none', borderRight: 'none', backgroundColor: '#f9f9f9', color: '#0D0D0D', fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15, outline: 'none' }}
        />
        <button
          type="button"
          onClick={() => onChange(value + step)}
          style={{ width: 38, height: 38, borderRadius: '0 8px 8px 0', border: '2px solid #e0e0e0', borderLeft: 'none', backgroundColor: '#f9f9f9', cursor: 'pointer', fontFamily: 'var(--font-jakarta)', fontSize: 18, color: '#333' }}
        >+</button>
      </div>
      {quickVals && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {quickVals.map(q => (
            <button
              key={q} type="button" onClick={() => onChange(q)}
              style={{ padding: '6px 12px', borderRadius: 100, border: `2px solid ${value === q ? '#C6FF33' : '#e0e0e0'}`, backgroundColor: value === q ? 'rgba(198,255,51,0.12)' : '#f9f9f9', color: value === q ? '#3a5a00' : '#666', fontFamily: 'var(--font-general)', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
            >
              {q.toLocaleString()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FormInput({ label, value, onChange, type = 'text', flex }: { label: string; value: string; onChange: (v: string) => void; type?: string; flex?: boolean }) {
  return (
    <div style={{ flex: flex ? '1 1 160px' : '1 1 100%' }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 10 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 14px',
          backgroundColor: '#f5f5f5',
          border: '2px solid #e0e0e0',
          borderRadius: 10,
          color: '#0D0D0D',
          fontFamily: 'var(--font-general)',
          fontSize: 14,
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        } as React.CSSProperties}
        onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = '#C6FF33'; }}
        onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = '#e0e0e0'; }}
      />
    </div>
  );
}