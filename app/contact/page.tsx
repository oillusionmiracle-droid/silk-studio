'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FinalCTA from '@/components/FinalCTA';
import GSAPTitle from '@/components/GSAPTitle';
import { MessageCircle, Mail, Clock, MapPin, ChevronDown, ArrowRight } from 'lucide-react';

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
          src="https://res.cloudinary.com/dagqxe3fh/image/upload/silk-studio/images/hero-bg.jpg"
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
            style={{ marginBottom: 20, color: '#C6FF33' }}
          >
            LET&apos;S TALK
          </motion.p>
          <GSAPTitle
            as="h1"
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 800,
              fontSize: 'clamp(40px, 7vw, 72px)',
              lineHeight: 1.05,
              color: '#ffffff',
              marginBottom: 24,
              letterSpacing: '-1.5px',
            }}
          >
            Get in touch.
          </GSAPTitle>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-general)',
              fontSize: 20,
              color: '#888888',
              maxWidth: 540,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Have a question, a big idea, or a project that needs to start yesterday? We&apos;re here.
          </motion.p>
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
              backgroundColor: 'rgba(26,26,26,0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid #2A2A2A',
              borderRadius: 20,
              padding: 'clamp(32px, 5vw, 48px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <p className="label-mono" style={{ color: '#C6FF33', marginBottom: 24 }}>WHATSAPP — FASTEST</p>
            <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'rgba(198,255,51,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <MessageCircle size={30} color="#C6FF33" />
            </div>
            <GSAPTitle as="h2" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 32, color: '#ffffff', marginBottom: 16 }}>
              WhatsApp
            </GSAPTitle>
            <p style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#888888', lineHeight: 1.7, marginBottom: 40 }}>
              The fastest way to reach us. Brief us, ask questions, get quotes — all here.
            </p>
            <a
              href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I%27d+like+to+get+in+touch"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ marginTop: 'auto', alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              Chat on WhatsApp <ArrowRight size={16} />
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
              <div className="card-hover" style={{ backgroundColor: 'rgba(26,26,26,0.8)', backdropFilter: 'blur(12px)', border: '1px solid #2A2A2A', borderRadius: 20, padding: 32, display: 'flex', alignItems: 'center', gap: 20 }}>
                <img src="/icons/instagram.svg" alt="Instagram" width={28} height={28} style={{ filter: 'brightness(0) invert(1)' }} />
                <div>
                  <p className="label-mono" style={{ marginBottom: 4 }}>INSTAGRAM</p>
                  <p style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#ffffff', margin: 0 }}>@thesilkstudiong</p>
                </div>
              </div>
            </a>

            {/* TikTok */}
            <a href="https://tiktok.com/@thesilkstudiong" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{ backgroundColor: 'rgba(26,26,26,0.8)', backdropFilter: 'blur(12px)', border: '1px solid #2A2A2A', borderRadius: 20, padding: 32, display: 'flex', alignItems: 'center', gap: 20 }}>
                <img src="/icons/tiktok.svg" alt="TikTok" width={28} height={28} style={{ filter: 'brightness(0) invert(1)' }} />
                <div>
                  <p className="label-mono" style={{ marginBottom: 4 }}>TIKTOK</p>
                  <p style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#ffffff', margin: 0 }}>@thesilkstudiong</p>
                </div>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:thesilkstudiong@gmail.com" style={{ textDecoration: 'none' }}>
              <div className="card-hover" style={{ backgroundColor: 'rgba(26,26,26,0.8)', backdropFilter: 'blur(12px)', border: '1px solid #2A2A2A', borderRadius: 20, padding: 32, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={22} color="#ffffff" />
                </div>
                <div>
                  <p className="label-mono" style={{ marginBottom: 4 }}>EMAIL</p>
                  <p style={{ fontFamily: 'var(--font-general)', fontSize: 18, color: '#ffffff', margin: 0 }}>thesilkstudiong@gmail.com</p>
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
            style={{ flex: '1 1 45%', minWidth: 320, backgroundColor: 'rgba(26,26,26,0.8)', backdropFilter: 'blur(12px)', border: '1px solid #2A2A2A', borderRadius: 20, padding: 40 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Clock size={16} color="#C6FF33" />
              <p className="label-mono" style={{ margin: 0 }}>WHEN WE&apos;RE ON</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 17, color: '#ffffff' }}>Monday – Friday</span>
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 17, color: '#888888' }}>9:00am – 6:00pm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 17, color: '#ffffff' }}>Saturday</span>
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 17, color: '#888888' }}>12:00pm – 6:00pm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 17, color: '#ffffff' }}>Sunday</span>
                <span style={{ fontFamily: 'var(--font-general)', fontSize: 17, color: '#888888' }}>Closed</span>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-general)', fontSize: 14, color: '#888888', lineHeight: 1.6, margin: 0 }}>
              Urgent job outside these hours? WhatsApp us — we&apos;ll see what we can do.
            </p>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ flex: '1 1 45%', minWidth: 320, backgroundColor: 'rgba(26,26,26,0.8)', backdropFilter: 'blur(12px)', border: '1px solid #2A2A2A', borderRadius: 20, padding: 40 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <MapPin size={16} color="#C6FF33" />
              <p className="label-mono" style={{ margin: 0 }}>WHERE WE ARE</p>
            </div>
            <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 28, color: '#ffffff', marginBottom: 16 }}>
              Lagos, Nigeria
            </h3>
            <p style={{ fontFamily: 'var(--font-general)', fontSize: 17, color: '#888888', lineHeight: 1.7, margin: 0 }}>
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
                    <h4 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 20, color: isOpen ? '#C6FF33' : '#ffffff', transition: 'color 0.2s ease', paddingRight: 24, margin: 0 }}>
                      {faq.q}
                    </h4>
                    <ChevronDown
                      size={20}
                      color={isOpen ? '#C6FF33' : '#888888'}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s ease, color 0.2s ease',
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  <div style={{ maxHeight: isOpen ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                    <p style={{ fontFamily: 'var(--font-general)', fontSize: 16, color: '#888888', lineHeight: 1.7, paddingTop: 16, paddingBottom: 8, margin: 0 }}>
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
      <FinalCTA />

      </div>{/* end content wrapper */}
    </div>
  );
}
