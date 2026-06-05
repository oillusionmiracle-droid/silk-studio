'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

gsap.registerPlugin(ScrollTrigger);

function ReferenceUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [fileName, setFileName] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    onUpload(file.name);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#888' }}>
        Upload a reference file (optional)
      </label>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleChange}
        style={{ padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.85)', color: '#0D0D0D', fontFamily: 'var(--font-general)', fontSize: 14, outline: 'none' }}
      />
      {fileName && (
        <p style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: '#555', margin: 0 }}>
          Selected file: {fileName}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   SERVICE IMAGES MAP
───────────────────────────────────────── */

const SERVICE_IMAGES: Record<string, string> = {
  'Flyers & Handbills': '/images/services/flyers.jpg',
  'Banners': '/images/services/banners.jpg',
  'Billboards & Flex': '/images/services/billboards.jpg',
  'Jotters & Notepads': '/images/services/jotters.jpg',
  'ID Cards': '/images/services/id-cards.jpg',
  'Business Cards': '/images/services/business-cards.jpg',
  'Letterheads': '/images/services/letterheads.jpg',
  'Custom T-Shirts': '/images/services/tshirts.jpg',
  'Sweatshirts': '/images/services/sweatshirts.jpg',
  'Grey Joggers': '/images/services/joggers.jpg',
  'Hoodies': '/images/services/hoodies.jpg',
  'Event Merch Set': '/images/services/merch-sets.jpg',
  'Corporate Uniforms': '/images/services/uniforms.jpg',
  'Logo & Brand Identity': '/images/services/logo-design.jpg',
  'Event Branding Kit': '/images/services/event-branding.jpg',
  'Social Media Templates': '/images/services/social-templates.jpg',
  'Print-Ready Artwork': '/images/services/print-artwork.jpg',
  'Landing Page': '/images/services/landing-page.jpg',
  'Business Website': '/images/services/business-website.jpg',
  'E-commerce': '/images/services/ecommerce.jpg',
  'Event Page': '/images/services/event-page.jpg',
  'Event Package': '/images/services/bundle-event.jpg',
  'Business Starter': '/images/services/bundle-business.jpg',
  'Custom Bundle': '/images/services/bundle-event.jpg',
};

const CATEGORY_IMAGES: Record<string, string> = {
  Print: '/images/services/flyers.jpg',
  Apparel: '/images/services/tshirts.jpg',
  Design: '/images/services/logo-design.jpg',
  Web: '/images/services/business-website.jpg',
  Bundle: '/images/services/bundle-event.jpg',
};

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */

const CATEGORIES = [
  { id: 'Print', icon: '/icons/print.svg', label: 'Print', desc: 'Flyers, banners, cards & more' },
  { id: 'Apparel', icon: '/icons/apparel.svg', label: 'Apparel', desc: 'Shirts, hoodies, uniforms' },
  { id: 'Design', icon: '/icons/design.svg', label: 'Design', desc: 'Logos, branding, artwork' },
  { id: 'Web', icon: '/icons/web.svg', label: 'Web', desc: 'Websites & landing pages' },
  { id: 'Bundle', icon: '/icons/bundle.svg', label: 'Bundle', desc: 'Full packages, best value' },
];

const SUB_SERVICES: Record<string, string[]> = {
  Print: ['Flyers & Handbills', 'Banners', 'Billboards & Flex', 'Jotters & Notepads', 'ID Cards', 'Business Cards', 'Letterheads', 'Other'],
  Apparel: ['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers', 'Hoodies', 'Event Merch Set', 'Corporate Uniforms', 'Other'],
  Design: ['Logo & Brand Identity', 'Event Branding Kit', 'Social Media Templates', 'Print-Ready Artwork', 'Other'],
  Web: ['Landing Page', 'Business Website', 'E-commerce', 'Event Page', 'Other'],
  Bundle: ['Event Package', 'Business Starter', 'Custom Bundle'],
};

/* ─────────────────────────────────────────
   GLASS CARD STYLES
───────────────────────────────────────── */

const glass = {
  backgroundColor: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.5)',
  borderRadius: 20,
  boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
};

const glassDark = {
  backgroundColor: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.45)',
  borderRadius: 16,
  boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */

export default function OrderPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [subService, setSubService] = useState<string | null>(null);
  const [referenceFileUrl, setReferenceFileUrl] = useState('');
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

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
      alert('Paystack public key is missing. Please set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.');
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

  /* ── Pricing calc ── */
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

  /* ── GSAP page load ── */
  useEffect(() => {
    if (!headerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from('.text', {
      scale: 3,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out',
    });
    gsap.from(headerRef.current.querySelectorAll('.header-fade'), {
      opacity: 0, y: 20, duration: 0.6, stagger: 0.1, delay: 0.2, ease: 'power3.out',
    });
    return undefined;
  }, []);

  /* ── GSAP form section reveal ── */
  useEffect(() => {
    if (!formRef.current) return;
    const sections = formRef.current.querySelectorAll('.form-section');
    sections.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        }
      );
    });
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

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

  /* ── Submitted screen ── */
  if (isSubmitted) {
    return (
      <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <BgLayer />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ ...glass, padding: '60px 48px', textAlign: 'center', maxWidth: 520, width: '100%' }}>
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
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: 48, color: '#0D0D0D', marginBottom: 16, lineHeight: 1.1 }}
            >
              You&apos;re booked.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#555', lineHeight: 1.6, marginBottom: 32 }}
            >
              We&apos;ve received your brief. Expect a WhatsApp message within 2 hours to confirm details.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 48 }}
            >
              Order ref: SLK-{Math.floor(1000 + Math.random() * 9000)}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link href="/portfolio" style={{ ...glassDark, padding: '14px 28px', textDecoration: 'none', fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 15, color: '#333' }}>
                View Portfolio
              </Link>
              <Link href="/" style={{ backgroundColor: '#0D0D0D', borderRadius: 16, padding: '14px 28px', textDecoration: 'none', fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 15, color: '#fff' }}>
                Back to Home
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = subService && SERVICE_IMAGES[subService]
    ? SERVICE_IMAGES[subService]
    : category ? CATEGORY_IMAGES[category] : null;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <BgLayer />

      <div style={{ position: 'relative', zIndex: 1, paddingBottom: 120 }}>

        {/* HEADER */}
        <section ref={headerRef} style={{ paddingTop: 140, paddingBottom: 80, paddingLeft: 24, paddingRight: 24, textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <p className="header-fade label-mono" style={{ marginBottom: 24, color: '#666' }}>LET&apos;S WORK</p>
            <h1 className="text" style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 900,
              fontSize: 'clamp(44px, 7vw, 88px)',
              lineHeight: 1.0,
              letterSpacing: '-2px',
              color: '#0D0D0D',
              marginBottom: 24,
            }}>
              Tell us what you{' '}
              <span style={{ color: '#0D0D0D' }}>need.</span>
            </h1>
            <p className="header-fade" style={{ fontFamily: 'var(--font-general)', fontSize: 20, color: '#666', lineHeight: 1.7 }}>
              Fill this in and we&apos;ll reach out within 2 hours. Deposit locks your slot.
            </p>
          </div>
        </section>

        {/* MAIN LAYOUT */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 32, alignItems: 'start' }}
          className="order-grid"
        >
          {/* LEFT: FORM */}
          <div ref={formRef} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* STEP 1 — CATEGORY */}
            <div className="form-section" style={{ ...glass, padding: 32 }}>
              <StepLabel num="01" label="What do you need?" />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 8 }}>
                {CATEGORIES.map(cat => (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    isActive={category === cat.id}
                    image={CATEGORY_IMAGES[cat.id]}
                    onClick={() => { setCategory(cat.id); setSubService(null); }}
                  />
                ))}
              </div>

              <AnimatePresence>
                {category && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ paddingTop: 24, borderTop: '1px solid rgba(0,0,0,0.08)', marginTop: 16 }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 14 }}>Select a service</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                        {SUB_SERVICES[category].map(sub => (
                          <SubServiceCard
                            key={sub}
                            label={sub}
                            image={SERVICE_IMAGES[sub]}
                            isActive={subService === sub}
                            onClick={() => setSubService(sub)}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* STEP 2 — SPECS */}
            <AnimatePresence>
              {subService && (
                <motion.div
                  className="form-section"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{ ...glass, padding: 32 }}
                >
                  <StepLabel num="02" label="Job details" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

                    {subService === 'Flyers & Handbills' && <>
                      <AppleFieldGroup label="Size">
                        {['A5', 'A4', 'A3'].map(opt => <ApplePill key={opt} label={opt} isActive={specs.size === opt} onClick={() => updateSpec('size', opt)} />)}
                      </AppleFieldGroup>
                      <AppleFieldGroup label="Sides">
                        {['Single-sided', 'Double-sided'].map(opt => <ApplePill key={opt} label={opt} isActive={specs.sides === opt} onClick={() => updateSpec('sides', opt)} />)}
                      </AppleFieldGroup>
                      <AppleFieldGroup label="Lamination">
                        {['None', 'Matte', 'Gloss'].map(opt => <ApplePill key={opt} label={opt} isActive={specs.lamination === opt} onClick={() => updateSpec('lamination', opt)} />)}
                      </AppleFieldGroup>
                      <AppleFieldGroup label="Quantity">
                        <AppleQtyInput value={specs.quantity} min={100} step={100} onChange={v => updateSpec('quantity', v)} quickVals={[100, 250, 500, 1000, 2000]} note="Minimum 100 copies" />
                      </AppleFieldGroup>
                    </>}

                    {subService === 'Banners' && <>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <AppleFieldGroup label="Width (ft)">
                          <AppleQtyInput value={specs.width} min={1} step={0.5} onChange={v => updateSpec('width', v)} />
                        </AppleFieldGroup>
                        <AppleFieldGroup label="Height (ft)">
                          <AppleQtyInput value={specs.height} min={1} step={0.5} onChange={v => updateSpec('height', v)} />
                        </AppleFieldGroup>
                      </div>
                      <div style={{ ...glassDark, padding: '12px 20px', display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#666', letterSpacing: 1 }}>AREA</span>
                        <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16, color: '#0D0D0D' }}>{specs.width} × {specs.height} = {(specs.width * specs.height).toFixed(1)} sq ft</span>
                      </div>
                      <AppleFieldGroup label="Eyelets">
                        {['Yes', 'No'].map(opt => <ApplePill key={opt} label={opt} isActive={specs.eyelets === opt} onClick={() => updateSpec('eyelets', opt)} />)}
                      </AppleFieldGroup>
                      <AppleFieldGroup label="Quantity">
                        <AppleQtyInput value={specs.quantity} min={1} step={1} onChange={v => updateSpec('quantity', v)} />
                      </AppleFieldGroup>
                    </>}

                    {subService === 'Jotters & Notepads' && <>
                      <AppleFieldGroup label="Inner Sheets">
                        {['Plain', 'Ruled'].map(opt => <ApplePill key={opt} label={opt} isActive={specs.innerSheets === opt} onClick={() => updateSpec('innerSheets', opt)} />)}
                      </AppleFieldGroup>
                      <AppleFieldGroup label="Lamination">
                        {['None', 'Matte', 'Gloss'].map(opt => <ApplePill key={opt} label={opt} isActive={specs.lamination === opt} onClick={() => updateSpec('lamination', opt)} />)}
                      </AppleFieldGroup>
                      <AppleFieldGroup label="Binding">
                        {['Spiral', 'Perfect Binding'].map(opt => <ApplePill key={opt} label={opt + (opt === 'Perfect Binding' ? ' +₦3,000' : '')} isActive={specs.binding === opt} onClick={() => updateSpec('binding', opt)} />)}
                      </AppleFieldGroup>
                      <AppleFieldGroup label="Cover">
                        {['Soft Cover', 'Hard Cover'].map(opt => <ApplePill key={opt} label={opt + (opt === 'Hard Cover' ? ' +₦2,000' : '')} isActive={specs.cover === opt} onClick={() => updateSpec('cover', opt)} />)}
                      </AppleFieldGroup>
                      <AppleFieldGroup label="Quantity">
                        <AppleQtyInput value={specs.quantity} min={50} step={50} onChange={v => updateSpec('quantity', v)} quickVals={[50, 100, 200, 500]} />
                      </AppleFieldGroup>
                    </>}

                    {subService === 'ID Cards' && <>
                      <AppleFieldGroup label="Card Type">
                        {['Standard', 'Lanyard + Holder', 'Badge Reel + Holder'].map(opt => {
                          const price = opt === 'Standard' ? '₦4,500' : '₦7,500';
                          return <ApplePill key={opt} label={`${opt} — ${price}`} isActive={specs.idType === opt} onClick={() => updateSpec('idType', opt)} />;
                        })}
                      </AppleFieldGroup>
                      <AppleFieldGroup label="Quantity">
                        <AppleQtyInput value={specs.quantity} min={1} step={1} onChange={v => updateSpec('quantity', v)} />
                      </AppleFieldGroup>
                    </>}

                    {subService === 'Business Cards' && <>
                      <AppleFieldGroup label="Stock">
                        {['Standard 300gsm', 'Super Thick 600gsm'].map(opt => <ApplePill key={opt} label={opt + (opt.includes('600') ? ' +₦2,000' : '')} isActive={specs.stock === opt} onClick={() => updateSpec('stock', opt)} />)}
                      </AppleFieldGroup>
                      <AppleFieldGroup label="Lamination">
                        {['Matte', 'Gloss'].map(opt => <ApplePill key={opt} label={opt} isActive={specs.lamination === opt} onClick={() => updateSpec('lamination', opt)} />)}
                      </AppleFieldGroup>
                      <AppleFieldGroup label="Corners">
                        {['Square', 'Rounded'].map(opt => <ApplePill key={opt} label={opt + (opt === 'Rounded' ? ' +₦2,000' : '')} isActive={specs.corners === opt} onClick={() => updateSpec('corners', opt)} />)}
                      </AppleFieldGroup>
                      <AppleFieldGroup label="Quantity">
                        <AppleQtyInput value={specs.quantity} min={100} step={100} onChange={v => updateSpec('quantity', v)} quickVals={[100, 250, 500, 1000]} />
                      </AppleFieldGroup>
                    </>}

                    {['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers'].includes(subService) && (
                      <AppleFieldGroup label="Size Breakdown">
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', width: '100%' }}>
                          {Object.keys(specs.apparelSizes).map(size => (
                            <div key={size} style={{ ...glassDark, padding: '12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 64 }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2, color: '#666', textTransform: 'uppercase' }}>{size}</span>
                              <input
                                type="number" min="0"
                                value={specs.apparelSizes[size as keyof typeof specs.apparelSizes]}
                                onChange={e => updateApparelSize(size, parseInt(e.target.value) || 0)}
                                style={{ width: 52, textAlign: 'center', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid #C6FF33', color: '#0D0D0D', padding: '4px 0', fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, outline: 'none' }}
                              />
                            </div>
                          ))}
                        </div>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#999', letterSpacing: 2, textTransform: 'uppercase', marginTop: 12 }}>
                          Total: {totalApparelQty} pieces
                        </p>
                      </AppleFieldGroup>
                    )}

                    {isCustomQuote && (
                      <div style={{ ...glassDark, padding: '20px 24px', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-general)', fontSize: 15, color: '#666' }}>
                          We&apos;ll send you a custom quote within 2 hours of receiving your brief.
                        </p>
                      </div>
                    )}

                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
                      <div>
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 10 }}>Deadline</label>
                        <input
                          type="date"
                          value={specs.deadline}
                          onChange={e => updateSpec('deadline', e.target.value)}
                          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                          style={{ ...glassDark, padding: '14px 18px', border: '1px solid rgba(0,0,0,0.1)', color: '#0D0D0D', fontFamily: 'var(--font-general)', fontSize: 15, outline: 'none', width: '100%', maxWidth: 320, boxSizing: 'border-box', display: 'block' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 10 }}>Job Description</label>
                        <textarea
                          rows={4}
                          value={specs.description}
                          onChange={e => updateSpec('description', e.target.value)}
                          placeholder="Tell us what this is for, colours, anything important."
                          style={{ ...glassDark, width: '100%', padding: '14px 18px', border: '1px solid rgba(0,0,0,0.1)', color: '#0D0D0D', fontFamily: 'var(--font-general)', fontSize: 15, resize: 'vertical', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP 3 — FILES */}
            <AnimatePresence>
              {subService && (
                <motion.div
                  className="form-section"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  style={{ ...glass, padding: 32 }}
                >
                  <StepLabel num="03" label="Reference Files (Optional)" />
                  <ReferenceUpload onUpload={(url: string) => setReferenceFileUrl(url)} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP 4 — CONTACT */}
            <AnimatePresence>
              {subService && (
                <motion.div
                  className="form-section"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ ...glass, padding: 32 }}
                >
                  <StepLabel num="04" label="Your Details" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <AppleInput label="First Name" value={contact.firstName} onChange={v => setContact(c => ({ ...c, firstName: v }))} flex="1 1 180px" />
                      <AppleInput label="Last Name" value={contact.lastName} onChange={v => setContact(c => ({ ...c, lastName: v }))} flex="1 1 180px" />
                    </div>
                    <AppleInput label="WhatsApp Number" value={contact.whatsapp} onChange={v => setContact(c => ({ ...c, whatsapp: v }))} type="tel" />
                    <AppleInput label="Email (Optional)" value={contact.email} onChange={v => setContact(c => ({ ...c, email: v }))} type="email" />
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 10 }}>How did you hear about us?</label>
                      <select
                        value={contact.source}
                        onChange={e => setContact(c => ({ ...c, source: e.target.value }))}
                        style={{ width: '100%', padding: '14px 18px', backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12, color: contact.source ? '#0D0D0D' : '#999', fontFamily: 'var(--font-general)', fontSize: 15, outline: 'none', appearance: 'none' }}
                      >
                        <option value="">Select...</option>
                        {['Instagram', 'TikTok', 'WhatsApp', 'Referral', 'Google', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP 5 — PAYMENT */}
            <AnimatePresence>
              {subService && (
                <motion.div
                  className="form-section"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{ ...glass, padding: 32 }}
                >
                  <StepLabel num="05" label="Secure Your Slot" />
                  {isCustomQuote ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ ...glassDark, padding: '28px 24px', marginBottom: 24, textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-general)', fontSize: 17, color: '#444', lineHeight: 1.6 }}>
                          Submit your brief. We&apos;ll send a quote within 2 hours then confirm your deposit.
                        </p>
                      </div>
                      <button
                        onClick={handleSubmit}
                        style={{ width: '100%', padding: '18px 32px', backgroundColor: '#0D0D0D', color: '#fff', border: 'none', borderRadius: 14, fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'transform 0.15s, opacity 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                      >
                        Submit Brief — No Payment Yet →
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ ...glassDark, padding: '24px', marginBottom: 24 }}>
                        <p style={{ fontFamily: 'var(--font-general)', fontSize: 15, color: '#666', marginBottom: 20 }}>75% deposit required to confirm your order and begin work.</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                          <div>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#999', marginBottom: 4 }}>Total</p>
                            <p style={{ fontFamily: 'var(--font-jakarta)', fontSize: 22, color: '#444', fontWeight: 600 }}>₦{total.toLocaleString()}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#999', marginBottom: 4 }}>Deposit (75%)</p>
                            <p style={{ fontFamily: 'var(--font-jakarta)', fontSize: 36, color: '#0D0D0D', fontWeight: 900, lineHeight: 1 }}>₦{deposit.toLocaleString()}</p>
                          </div>
                        </div>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, color: '#aaa', marginTop: 12, textTransform: 'uppercase' }}>Balance due before or on delivery</p>
                      </div>
                      <button
                        onClick={handleSubmit}
                        style={{ width: '100%', padding: '18px 32px', backgroundColor: '#C6FF33', color: '#0D0D0D', border: 'none', borderRadius: 14, fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: 16, cursor: 'pointer', marginBottom: 12, transition: 'transform 0.15s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.01)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                      >
                        Pay with Paystack →
                      </button>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#aaa', textAlign: 'center' }}>🔒 Secured by Paystack</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: STICKY SUMMARY */}
          <div style={{ position: 'sticky', top: 100 }}>
            <AnimatePresence mode="wait">
              {(category || subService) && (
                <motion.div
                  key={subService || category}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ ...glass, overflow: 'hidden' }}
                >
                  {/* Service image */}
                  {currentImage && (
                    <div style={{ width: '100%', height: 200, overflow: 'hidden', borderRadius: '20px 20px 0 0', position: 'relative' }}>
                      <img
                        src={currentImage}
                        alt={subService || category || ''}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', transform: 'scale(1.05)' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.9) 100%)' }} />
                      {subService && (
                        <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#666' }}>Selected</p>
                          <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 18, color: '#0D0D0D' }}>{subService}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ padding: '24px 28px 32px' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 20 }}>ORDER SUMMARY</p>

                    {subService && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                        <SummaryRow label="Service" value={subService} />
                        {!isCustomQuote && (
                          <>
                            <SummaryRow label="Quantity" value={['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers'].includes(subService) ? `${totalApparelQty} pcs` : `${specs.quantity}`} />
                            {specs.deadline && <SummaryRow label="Deadline" value={specs.deadline} />}
                          </>
                        )}
                        {referenceFileUrl && (
                          <SummaryRow label="Reference" value="File attached ✓" />
                        )}
                      </div>
                    )}

                    {subService && !isCustomQuote && total > 0 && (
                      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 20, marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#999' }}>Total</span>
                          <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 16, color: '#444' }}>₦{total.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#999' }}>Deposit 75%</span>
                          <span style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: 22, color: '#0D0D0D' }}>₦{deposit.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {subService && isCustomQuote && (
                      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 20, marginBottom: 24 }}>
                        <p style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: '#888', lineHeight: 1.5 }}>Custom quote — we&apos;ll calculate your total and send it within 2hrs.</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {['75% deposit required', '1 free revision included', 'WhatsApp updates throughout', 'Response within 2 hours'].map(line => (
                        <div key={line} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#C6FF33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <polyline points="2 6 5 9 10 3" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <span style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: '#555', lineHeight: 1.5 }}>{line}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
                      <p style={{ fontFamily: 'var(--font-general)', fontSize: 13, color: '#888' }}>
                        Need help?{' '}
                        <a href="https://wa.me/2347064829776" target="_blank" rel="noopener noreferrer" style={{ color: '#0D0D0D', fontWeight: 600, textDecoration: 'none' }}>
                          WhatsApp us →
                        </a>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!category && !subService && (
              <div style={{ ...glass, padding: '40px 32px', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(198,255,51,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5a7a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 17, color: '#333', marginBottom: 8 }}>Select a service</p>
                <p style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: '#999', lineHeight: 1.6 }}>Pick a category on the left to see your order summary here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RESPONSIVE GRID */}
      <style>{`
        .order-grid {
          grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
        }
        @media (max-width: 860px) {
          .order-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   BACKGROUND LAYER
───────────────────────────────────────── */

function BgLayer() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <img
        src="/images/order-bg.jpg"
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e8f0fe 25%, #fce4ec 50%, #f3e5f5 75%, #e8f5e9 100%)',
      }} />
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.45)' }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   CATEGORY CARD
───────────────────────────────────────── */

function CategoryCard({ cat, isActive, image, onClick }: { cat: { id: string; icon: string; label: string; desc: string }; isActive: boolean; image: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        border: `2px solid ${isActive ? '#C6FF33' : 'rgba(0,0,0,0.06)'}`,
        backgroundColor: isActive ? 'rgba(198,255,51,0.08)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(12px)',
        padding: 0,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        transform: isActive || hovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isActive ? '0 0 0 4px rgba(198,255,51,0.25)' : 'none',
        aspectRatio: '4/3',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        textAlign: 'center',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <img
          src={image}
          alt={cat.label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isActive ? 0.3 : hovered ? 0.25 : 0.15, transition: 'opacity 0.25s' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 1, padding: '12px 10px 14px' }}>
        <img
          src={cat.icon}
          alt={cat.label}
          width={24} height={24}
          style={{
            filter: isActive ? 'brightness(0) saturate(100%) invert(42%) sepia(90%) saturate(600%) hue-rotate(35deg) brightness(100%)' : 'brightness(0) opacity(0.5)',
            marginBottom: 6, display: 'block', margin: '0 auto 6px',
          }}
        />
        <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 15, color: isActive ? '#3a5a00' : '#222', marginBottom: 2 }}>{cat.label}</p>
        <p style={{ fontFamily: 'var(--font-general)', fontSize: 11, color: '#888', lineHeight: 1.3 }}>{cat.desc}</p>
      </div>
    </button>
  );
}

/* ─────────────────────────────────────────
   SUB SERVICE CARD
───────────────────────────────────────── */

function SubServiceCard({ label, image, isActive, onClick }: { label: string; image?: string; isActive: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 14,
        border: `2px solid ${isActive ? '#C6FF33' : 'rgba(0,0,0,0.06)'}`,
        backgroundColor: isActive ? 'rgba(198,255,51,0.1)' : 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isActive || hovered ? 'scale(1.02)' : 'scale(1)',
        padding: 0,
        textAlign: 'left',
        aspectRatio: '3/2',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        boxShadow: isActive ? '0 0 0 3px rgba(198,255,51,0.3)' : 'none',
      }}
    >
      {image && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src={image}
            alt={label}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isActive ? 0.4 : hovered ? 0.3 : 0.18, transition: 'opacity 0.2s' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 1, padding: '10px 12px 12px' }}>
        <p style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 13, color: isActive ? '#3a5a00' : '#222', lineHeight: 1.3 }}>{label}</p>
      </div>
      {isActive && (
        <div style={{ position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#C6FF33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <polyline points="2 6 5 9 10 3" stroke="#0D0D0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
}

/* ─────────────────────────────────────────
   SMALL REUSABLE COMPONENTS
───────────────────────────────────────── */

function StepLabel({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#C6FF33', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#0D0D0D', letterSpacing: 1 }}>{num}</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 20, color: '#0D0D0D', margin: 0 }}>{label}</h3>
    </div>
  );
}

function AppleFieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#888', marginBottom: 12 }}>{label}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>{children}</div>
    </div>
  );
}

function ApplePill({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 18px',
        borderRadius: 100,
        border: `1.5px solid ${isActive ? '#C6FF33' : 'rgba(0,0,0,0.1)'}`,
        backgroundColor: isActive ? 'rgba(198,255,51,0.12)' : 'rgba(255,255,255,0.6)',
        color: isActive ? '#3a5a00' : '#444',
        fontFamily: 'var(--font-general)',
        fontSize: 14,
        fontWeight: isActive ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        backdropFilter: 'blur(8px)',
        boxShadow: isActive ? '0 0 0 3px rgba(198,255,51,0.2)' : 'none',
      }}
    >
      {label}
    </button>
  );
}

function AppleQtyInput({ value, min, step, onChange, quickVals, note }: {
  value: number; min: number; step: number;
  onChange: (v: number) => void;
  quickVals?: number[];
  note?: string;
}) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: 'fit-content' }}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          style={{ width: 40, height: 40, borderRadius: '12px 0 0 12px', border: '1.5px solid rgba(0,0,0,0.1)', borderRight: 'none', backgroundColor: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: 'var(--font-jakarta)', fontSize: 18, color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >−</button>
        <input
          type="number" min={min} step={step} value={value}
          onChange={e => onChange(Math.max(min, parseInt(e.target.value) || min))}
          style={{ width: 90, textAlign: 'center', padding: '10px 8px', border: '1.5px solid rgba(0,0,0,0.1)', borderLeft: 'none', borderRight: 'none', backgroundColor: 'rgba(255,255,255,0.7)', color: '#0D0D0D', fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 16, outline: 'none' }}
        />
        <button
          type="button"
          onClick={() => onChange(value + step)}
          style={{ width: 40, height: 40, borderRadius: '0 12px 12px 0', border: '1.5px solid rgba(0,0,0,0.1)', borderLeft: 'none', backgroundColor: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontFamily: 'var(--font-jakarta)', fontSize: 18, color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >+</button>
      </div>
      {quickVals && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {quickVals.map(q => (
            <button
              key={q} type="button" onClick={() => onChange(q)}
              style={{ padding: '6px 14px', borderRadius: 100, border: `1.5px solid ${value === q ? '#C6FF33' : 'rgba(0,0,0,0.1)'}`, backgroundColor: value === q ? 'rgba(198,255,51,0.12)' : 'rgba(255,255,255,0.6)', color: value === q ? '#3a5a00' : '#666', fontFamily: 'var(--font-general)', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}
            >
              {q.toLocaleString()}
            </button>
          ))}
        </div>
      )}
      {note && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#aaa', marginTop: 10 }}>{note}</p>}
    </div>
  );
}

function AppleInput({ label, value, onChange, type = 'text', flex }: { label: string; value: string; onChange: (v: string) => void; type?: string; flex?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ flex: flex || '1 1 auto' }}>
      <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: 10 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '14px 18px',
          backgroundColor: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(12px)',
          border: `1.5px solid ${focused ? '#C6FF33' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: 12,
          color: '#0D0D0D',
          fontFamily: 'var(--font-general)',
          fontSize: 15,
          outline: 'none',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box',
        } as React.CSSProperties}
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#aaa', flexShrink: 0, paddingTop: 2 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: '#333', textAlign: 'right', lineHeight: 1.4 }}>{value}</span>
    </div>
  );
}