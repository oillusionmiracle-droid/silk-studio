'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FinalCTA from '@/components/FinalCTA';
import GSAPTitle from '@/components/GSAPTitle';

const FAQ_DATA = [
  {
    q: 'How fast will you reply?',
    a: 'Within 2 hours on WhatsApp during business hours.',
  },
  {
    q: 'Do you work outside Lagos?',
    a: 'Design and web — yes, anywhere. Print delivery is Lagos only for now.',
  },
  {
    q: 'Can I visit in person?',
    a: 'Not yet — fully remote. Everything runs through WhatsApp and the order form.',
  },
];

export default function ContactPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ backgroundColor: '#0D0D0D', minHeight: '100vh', paddingBottom: 120 }}>
      
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
            GET IN TOUCH
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
            }}
          >
            We&apos;re one message <span style={{ color: '#C6FF33' }}>away.</span>
          </GSAPTitle>
        </div>
      </section>

      {/* CONTACT OPTIONS */}
      <section style={{ maxWidth: 1100, margin: '0 auto 64px', padding: '0 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          
          {/* Left: Primary WhatsApp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              flex: '1 1 50%',
              minWidth: 320,
              backgroundColor: '#1A1A1A',
              border: '1px solid #2A2A2A',
              borderRadius: 4,
              padding: 48,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <p className="label-mono" style={{ color: '#C6FF33', marginBottom: 32 }}>WHATSAPP — FASTEST</p>
            <img src="/icons/whatsapp.svg" alt="WhatsApp" width={48} height={48} style={{ marginBottom: 24, filter: 'brightness(0) invert(1)' }} />
            <GSAPTitle as="h2" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 32, color: '#ffffff', marginBottom: 16 }}>
              WhatsApp
            </GSAPTitle>
            <p style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#888888', lineHeight: 1.7, marginBottom: 48 }}>
              The fastest way to reach us. Brief us, ask questions, get quotes — all here.
            </p>
            <a
              href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I%27d+like+to+get+in+touch"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
            >
              Chat on WhatsApp →
            </a>
          </motion.div>

          {/* Right: Secondary Cards Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex: '1 1 40%', minWidth: 320, display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            {/* Instagram */}
            <a href="https://instagram.com/thesilkstudiong" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 4, padding: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
                <img src="/icons/instagram.svg" alt="Instagram" width={32} height={32} style={{ filter: 'brightness(0) invert(1)' }} />
                <div>
                  <p className="label-mono" style={{ marginBottom: 4 }}>INSTAGRAM</p>
                  <p style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#ffffff' }}>@thesilkstudiong</p>
                </div>
              </div>
            </a>

            {/* TikTok */}
            <a href="https://tiktok.com/@thesilkstudiong" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 4, padding: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
                <img src="/icons/tiktok.svg" alt="TikTok" width={32} height={32} style={{ filter: 'brightness(0) invert(1)' }} />
                <div>
                  <p className="label-mono" style={{ marginBottom: 4 }}>TIKTOK</p>
                  <p style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#ffffff' }}>@thesilkstudiong</p>
                </div>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:thesilkstudiong@gmail.com" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 4, padding: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
                <img src="/icons/email.svg" alt="Email" width={32} height={32} style={{ filter: 'brightness(0) invert(1)' }} />
                <div>
                  <p className="label-mono" style={{ marginBottom: 4 }}>EMAIL</p>
                  <p style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#ffffff' }}>thesilkstudiong@gmail.com</p>
                </div>
              </div>
            </a>
          </motion.div>

        </div>
      </section>

      {/* HOURS & LOCATION */}
      <section style={{ maxWidth: 1100, margin: '0 auto 120px', padding: '0 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          
          {/* Business Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex: '1 1 45%', minWidth: 320, backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 4, padding: 48 }}
          >
            <p className="label-mono" style={{ marginBottom: 32 }}>WHEN WE&apos;RE ON</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#ffffff' }}>Monday – Friday</span>
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#888888' }}>9:00am – 6:00pm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#ffffff' }}>Saturday</span>
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#888888' }}>12:00pm – 6:00pm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#ffffff' }}>Sunday</span>
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#888888' }}>Closed</span>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: '#888888', lineHeight: 1.6 }}>
              Urgent job outside these hours? WhatsApp us — we&apos;ll see what we can do.
            </p>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex: '1 1 45%', minWidth: 320, backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 4, padding: 48 }}
          >
            <p className="label-mono" style={{ marginBottom: 32 }}>WHERE WE ARE</p>
            <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 32, color: '#ffffff', marginBottom: 16 }}>
              Lagos, Nigeria
            </h3>
            <p style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#888888', lineHeight: 1.7 }}>
              We deliver across Lagos. Delivery fee depends on your location.
            </p>
          </motion.div>

        </div>
      </section>

      {/* QUICK FAQ */}
      <section style={{ maxWidth: 800, margin: '0 auto 120px', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="label-mono" style={{ marginBottom: 32, textAlign: 'center' }}>QUICK ANSWERS</p>
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
        </motion.div>
      </section>

      {/* BOTTOM CTA */}
      <FinalCTA title="Work with us." />

    </div>
  );
}
