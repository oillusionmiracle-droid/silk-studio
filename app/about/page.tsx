'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import FinalCTA from '@/components/FinalCTA';
import GSAPTitle from '@/components/GSAPTitle';

function ScrambleText({ finalNumber, suffix }: { finalNumber: number, suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      let iteration = 0;
      const maxIterations = 20;
      const interval = setInterval(() => {
        if (iteration >= maxIterations) {
          clearInterval(interval);
          setDisplay(finalNumber.toString());
        } else {
          const digits = finalNumber.toString().length;
          const randomStr = Array.from({length: digits}, () => Math.floor(Math.random() * 10)).join('');
          setDisplay(randomStr);
          iteration++;
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isInView, finalNumber]);

  return <span ref={ref}>{display}{suffix}</span>;
}

export default function AboutPage() {
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{ backgroundColor: '#0D0D0D', minHeight: '100vh', paddingBottom: 120 }}>
      
      {/* HEADER & STORY BLOCK */}
      <section style={{ paddingTop: 140, paddingBottom: 120, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: 64 }}
          >
            <p className="label-mono" style={{ marginBottom: 24 }}>WHO WE ARE</p>
            <GSAPTitle
              as="h1"
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 900,
                fontSize: 'clamp(40px, 6vw, 72px)',
                lineHeight: 1.05,
                letterSpacing: '-1px',
                color: '#ffffff',
                maxWidth: 800,
              }}
            >
              Not just another <span style={{ color: '#C6FF33' }}>print shop.</span>
            </GSAPTitle>
          </motion.div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'stretch' }}>
            {/* Left: Text (55% desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ flex: '1 1 55%', minWidth: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <p style={{ fontFamily: 'var(--font-general)', fontSize: 20, color: '#ffffff', lineHeight: 1.8, marginBottom: 24 }}>
                Silk Studio started from one belief: your brand deserves better than whoever is cheapest.
              </p>
              <p style={{ fontFamily: 'var(--font-general)', fontSize: 20, color: '#ffffff', lineHeight: 1.8, marginBottom: 24 }}>
                We&apos;re a Lagos-based design and print brand built on speed, craft, and the kind of attention that makes clients feel like they&apos;re in safe hands — not just another order in a queue.
              </p>
              <p style={{ fontFamily: 'var(--font-general)', fontSize: 20, color: '#ffffff', lineHeight: 1.8 }}>
                One contact. No runaround. Everything from your logo to your event shirts, handled the way it should be.
              </p>
            </motion.div>

            {/* Right: Image (45% desktop) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                flex: '1 1 40%',
                minWidth: 300,
                minHeight: 400,
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              {!imgError ? (
                <img
                  src="/images/about/founder.jpg"
                  alt="Silk Studio Founder"
                  onError={() => setImgError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1A1A' }}>
                  <p className="label-mono" style={{ color: '#555555' }}>Photo coming soon</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* THREE VALUES */}
      <section style={{ maxWidth: 1100, margin: '0 auto 120px', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="label-mono" style={{ marginBottom: 48 }}>WHAT DRIVES US</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {/* Speed */}
            <div style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 4, padding: 32 }}>
              <img src="/icons/speed.svg" alt="Speed" width={40} height={40} style={{ marginBottom: 24, filter: 'brightness(0) saturate(100%) invert(91%) sepia(41%) saturate(799%) hue-rotate(27deg) brightness(107%) contrast(103%)' }} />
              <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 24, color: '#ffffff', marginBottom: 16 }}>Speed</h3>
              <p style={{ fontFamily: 'var(--font-general)', fontSize: 16, color: '#888888', lineHeight: 1.7 }}>
                Fast doesn&apos;t mean rushed. We move fast because we respect your deadline — not because we&apos;re cutting corners.
              </p>
            </div>

            {/* Craft */}
            <div style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 4, padding: 32 }}>
              <img src="/icons/craft.svg" alt="Craft" width={40} height={40} style={{ marginBottom: 24, filter: 'brightness(0) saturate(100%) invert(91%) sepia(41%) saturate(799%) hue-rotate(27deg) brightness(107%) contrast(103%)' }} />
              <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 24, color: '#ffffff', marginBottom: 16 }}>Craft</h3>
              <p style={{ fontFamily: 'var(--font-general)', fontSize: 16, color: '#888888', lineHeight: 1.7 }}>
                Every job gets the same level of attention regardless of size or budget. The ₦4,500 ID card gets the same eye as the ₦300,000 event package.
              </p>
            </div>

            {/* Reliability */}
            <div style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 4, padding: 32 }}>
              <img src="/icons/reliability.svg" alt="Reliability" width={40} height={40} style={{ marginBottom: 24, filter: 'brightness(0) saturate(100%) invert(91%) sepia(41%) saturate(799%) hue-rotate(27deg) brightness(107%) contrast(103%)' }} />
              <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 24, color: '#ffffff', marginBottom: 16 }}>Reliability</h3>
              <p style={{ fontFamily: 'var(--font-general)', fontSize: 16, color: '#888888', lineHeight: 1.7 }}>
                We say 48hrs, we mean 48hrs. No excuses, no ghost, no almost ready. You&apos;ll always know where your order is.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* NETWORK ADVANTAGE */}
      <section style={{ maxWidth: 1100, margin: '0 auto 120px', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid #2A2A2A',
            borderRadius: 4,
            padding: '64px 48px',
            textAlign: 'center',
          }}
        >
          <p className="label-mono" style={{ color: '#C6FF33', marginBottom: 24 }}>HOW WE DELIVER</p>
          <GSAPTitle as="h2" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: 'clamp(28px, 4vw, 32px)', color: '#ffffff', marginBottom: 24 }}>
            You brief us. We handle the rest.
          </GSAPTitle>
          <p style={{ fontFamily: 'var(--font-general)', fontSize: 20, color: '#888888', lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>
            We&apos;ve spent years building relationships with the best production partners across Lagos. 
            That network means your job never waits on one machine, one vendor, or one location. 
            You see one contact. Behind it is an entire production system.
          </p>
        </motion.div>
      </section>

      {/* NUMBERS STRIP */}
      <section style={{ maxWidth: 1100, margin: '0 auto 120px', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            gap: 48,
            textAlign: 'center',
          }}
        >
          <div>
            <GSAPTitle as="h3" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 52px)', color: '#ffffff', lineHeight: 1, marginBottom: 12 }}>
              <ScrambleText finalNumber={300} suffix="+" />
            </GSAPTitle>
            <p className="label-mono" style={{ color: '#888888' }}>Jobs Done</p>
          </div>
          <div>
            <GSAPTitle as="h3" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 52px)', color: '#ffffff', lineHeight: 1, marginBottom: 12 }}>
              <ScrambleText finalNumber={10} suffix=" Years" />
            </GSAPTitle>
            <p className="label-mono" style={{ color: '#888888' }}>In the Industry</p>
          </div>
          <div>
            <GSAPTitle as="h3" style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 52px)', color: '#ffffff', lineHeight: 1, marginBottom: 12 }}>
              <ScrambleText finalNumber={48} suffix="hrs" />
            </GSAPTitle>
            <p className="label-mono" style={{ color: '#888888' }}>Avg Turnaround</p>
          </div>
        </motion.div>
      </section>

      {/* BOTTOM CTA */}
      <FinalCTA />

    </div>
  );
}
