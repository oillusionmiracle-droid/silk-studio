'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import FinalCTA from '@/components/FinalCTA';
import GSAPTitle from '@/components/GSAPTitle';
import { usePageContent } from '@/lib/usePageContent';

function ScrambleText({ finalNumber, suffix }: { finalNumber: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState('0');

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
          const randomStr = Array.from({ length: digits }, () =>
            Math.floor(Math.random() * 10)
          ).join('');
          setDisplay(randomStr);
          iteration++;
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isInView, finalNumber]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const animationProps = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
};

const DEFAULT_GALLERY = {
  image_1: '/images/services/print-bg.jpg',
  image_2: '/images/services/web-bg.jpg',
  image_3: '/images/about/hero-bg.jpg',
};

// 3-Image Parallax Showcase that moves as the user scrolls down
function ScrollingGallery({
  images,
}: {
  images: { image_1: string; image_2: string; image_3: string };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-20, 30]);
  const y3 = useTransform(scrollYProgress, [0, 1], [60, -50]);

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: 1200,
        margin: '56px auto 100px auto',
        padding: '0 24px',
      }}
      className="about-gallery-container"
    >
      <div className="about-gallery-grid">
        {/* Image 1 */}
        <motion.div
          style={{
            y: y1,
          }}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="about-gallery-card card-1"
        >
          <img
            src={images.image_1}
            alt="Studio Showcase 1"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                '/images/services/print-bg.jpg';
            }}
          />
        </motion.div>

        {/* Image 2 */}
        <motion.div
          style={{
            y: y2,
          }}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="about-gallery-card card-2"
        >
          <img
            src={images.image_2}
            alt="Studio Showcase 2"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                '/images/services/web-bg.jpg';
            }}
          />
        </motion.div>

        {/* Image 3 */}
        <motion.div
          style={{
            y: y3,
          }}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="about-gallery-card card-3"
        >
          <img
            src={images.image_3}
            alt="Studio Showcase 3"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                '/images/services/print-bg.jpg';
            }}
          />
        </motion.div>
      </div>

      <style jsx>{`
        .about-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          align-items: center;
        }

        .about-gallery-card {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          background-color: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
        }

        .card-1, .card-3 {
          height: 380px;
        }

        .card-2 {
          height: 430px;
          border-color: rgba(255, 255, 255, 0.14);
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.9);
        }

        @media (max-width: 768px) {
          .about-gallery-container {
            padding: 0 !important;
            margin-bottom: 60px !important;
          }

          .about-gallery-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            gap: 16px !important;
            padding: 12px 20px 24px 20px !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }

          .about-gallery-grid::-webkit-scrollbar {
            display: none;
          }

          .about-gallery-card {
            flex: 0 0 84% !important;
            height: 320px !important;
            border-radius: 20px !important;
            scroll-snap-align: center;
            transform: none !important; /* Disable parallax y on mobile */
          }
        }
      `}</style>
    </div>
  );
}

export default function AboutPage() {
  // Dynamically pulled from Admin CMS: page='about', section='gallery'
  const gallery = usePageContent('about', 'gallery', DEFAULT_GALLERY);

  return (
    <div
      style={{
        backgroundColor: '#000000',
        minHeight: '100vh',
        paddingBottom: 120,
        color: '#ffffff',
      }}
    >
      {/* SECTION 1: Pure Black Hero Header */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          backgroundColor: '#000000',
          padding: '160px 24px 20px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <motion.div {...animationProps}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                letterSpacing: '3px',
                color: '#888888',
                marginBottom: 24,
                textTransform: 'uppercase',
              }}
            >
              WHO WE ARE
            </p>
            <GSAPTitle
              as="h1"
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 900,
                fontSize: 'clamp(40px, 6.5vw, 76px)',
                lineHeight: 1.04,
                letterSpacing: '-1.5px',
                color: '#ffffff',
                maxWidth: 960,
                margin: '0 auto 32px',
              }}
            >
              Lagos has a fragmented print ecosystem. <br />
              <span style={{ color: '#C6FF33' }}>We are fixing it.</span>
            </GSAPTitle>
            <p
              style={{
                fontFamily: 'var(--font-general)',
                fontSize: 'clamp(18px, 2.2vw, 24px)',
                color: 'rgba(255, 255, 255, 0.72)',
                lineHeight: 1.62,
                maxWidth: 820,
                margin: '0 auto',
              }}
            >
              Silk Studio is a design, print, and digital commerce platform that goes
              beyond physical production to deliver AI automation, web design,
              software development, and everything in-between.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3 SCROLLING PLACEHOLDER IMAGES (Editable in Admin Portal) */}
      <ScrollingGallery images={gallery} />

      {/* SECTION 2: The Problem */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px 120px 24px',
        }}
      >
        <motion.div {...animationProps}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '3px',
              color: '#888888',
              marginBottom: 20,
              textTransform: 'uppercase',
            }}
          >
            THE PROBLEM
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 840 }}>
            <h2
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 800,
                fontSize: 'clamp(32px, 4.5vw, 50px)',
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-1px',
                margin: 0,
              }}
            >
              Scattered, underutilized, and hard to find.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-general)',
                fontSize: 'clamp(18px, 2vw, 21px)',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Lagos has hundreds of professional, high-quality printers—but they are
              scattered, underutilized, and hard to find. Small businesses, event
              planners, and startups waste valuable time hunting for reliable print
              shops, while printers sit idle between jobs.
            </p>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3: The Solution (Clean numbered indicators, NO emojis) */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 120px' }}>
        <motion.div {...animationProps} style={{ marginBottom: 48 }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '3px',
              color: '#888888',
              marginBottom: 20,
              textTransform: 'uppercase',
            }}
          >
            THE SOLUTION
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 800,
              fontSize: 'clamp(32px, 4.5vw, 50px)',
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              maxWidth: 820,
              margin: 0,
            }}
          >
            We operate as a marketplace designed to bridge this gap.
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}
        >
          {[
            {
              num: '01',
              title: 'Vetted Network',
              text: 'Real-time connection to vetted professional printers across Lagos.',
            },
            {
              num: '02',
              title: '48-Hour SLA',
              text: 'Premium quality work delivered in 48 hours instead of weeks.',
            },
            {
              num: '03',
              title: '70% Design Perk',
              text: 'Integrated design services at 70% off for first-time users.',
            },
            {
              num: '04',
              title: 'Smart Dispatch',
              text: 'Jobs routed to the first available printer based on capability and location.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              {...animationProps}
              transition={{ ...animationProps.transition, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 20,
                padding: '36px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#C6FF33',
                  letterSpacing: '2px',
                }}
              >
                {item.num}
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-general)',
                  fontSize: 16,
                  color: 'rgba(255, 255, 255, 0.68)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: What You Can Order (Category badges, NO emojis) */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 120px' }}>
        <motion.div {...animationProps} style={{ marginBottom: 48 }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '3px',
              color: '#888888',
              marginBottom: 20,
              textTransform: 'uppercase',
            }}
          >
            FULL RANGE
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 800,
              fontSize: 'clamp(32px, 4.5vw, 50px)',
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              margin: 0,
            }}
          >
            International quality at Lagos prices.
          </h2>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}
        >
          {[
            {
              tag: 'PRINT & PACKAGING',
              title: 'Business Stationery',
              desc: 'Business cards, flyers, brochures, and commercial banners.',
            },
            {
              tag: 'APPAREL & MERCH',
              title: 'Custom Wear',
              desc: 'Premium branded t-shirts, hoodies, caps, and workwear.',
            },
            {
              tag: 'EVENTS & SOUVENIRS',
              title: 'Complete Event Runs',
              desc: 'Wedding souvenirs, gift bags, billboards, and event packages.',
            },
            {
              tag: 'DIGITAL & SOFTWARE',
              title: 'Web & AI Automation',
              desc: 'Custom web design, software development, and AI solutions.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              {...animationProps}
              transition={{ ...animationProps.transition, delay: index * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 20,
                padding: '36px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '2px',
                  color: '#C6FF33',
                  textTransform: 'uppercase',
                }}
              >
                {item.tag}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontSize: 21,
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-general)',
                  fontSize: 15,
                  color: 'rgba(255, 255, 255, 0.65)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Our Technology & Standards */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 120px' }}>
        <motion.div {...animationProps} style={{ marginBottom: 48 }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '3px',
              color: '#888888',
              marginBottom: 20,
              textTransform: 'uppercase',
            }}
          >
            OUR TECHNOLOGY
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 800,
              fontSize: 'clamp(32px, 4.5vw, 50px)',
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              margin: 0,
            }}
          >
            Built with modern tools.
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            {
              title: 'Frontend & Architecture',
              desc: 'React and Next.js with custom order flows.',
            },
            {
              title: 'Operations',
              desc: 'Real-time printer dispatch system and dedicated mobile tools for printer management.',
            },
            {
              title: 'Service Metrics',
              desc: 'Standard 48-hour turnaround backed by a network of over 100 professional printers across Lagos.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              {...animationProps}
              transition={{ ...animationProps.transition, delay: index * 0.1 }}
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                padding: '32px 36px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#C6FF33',
                  margin: 0,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-general)',
                  fontSize: 17,
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 6: Numbers Strip */}
      <section style={{ maxWidth: 1100, margin: '0 auto 120px', padding: '0 24px' }}>
        <motion.div
          {...animationProps}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            gap: 48,
            textAlign: 'center',
            backgroundColor: '#0a0a0a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 20,
            padding: '64px 24px',
          }}
        >
          <div>
            <GSAPTitle
              as="h3"
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 900,
                fontSize: 'clamp(40px, 6vw, 56px)',
                color: '#ffffff',
                lineHeight: 1,
                marginBottom: 12,
              }}
            >
              <ScrambleText finalNumber={300} suffix="+" />
            </GSAPTitle>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: '#888888',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              Jobs Done
            </p>
          </div>
          <div>
            <GSAPTitle
              as="h3"
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 900,
                fontSize: 'clamp(40px, 6vw, 56px)',
                color: '#ffffff',
                lineHeight: 1,
                marginBottom: 12,
              }}
            >
              <ScrambleText finalNumber={10} suffix=" Years" />
            </GSAPTitle>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: '#888888',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              In the Industry
            </p>
          </div>
          <div>
            <GSAPTitle
              as="h3"
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 900,
                fontSize: 'clamp(40px, 6vw, 56px)',
                color: '#ffffff',
                lineHeight: 1,
                marginBottom: 12,
              }}
            >
              <ScrambleText finalNumber={48} suffix="hrs" />
            </GSAPTitle>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: '#888888',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}
            >
              Avg Turnaround
            </p>
          </div>
        </motion.div>
      </section>

      {/* SECTION 7: CTA */}
      <section
        style={{
          maxWidth: 800,
          margin: '0 auto 120px',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        <motion.div
          {...animationProps}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 48px)',
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              margin: 0,
            }}
          >
            Ready to start your project?
          </h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href="/order"
              style={{
                display: 'inline-block',
                backgroundColor: '#C6FF33',
                color: '#000000',
                padding: '16px 36px',
                borderRadius: 12,
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 800,
                fontSize: 16,
                textDecoration: 'none',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              Start Your Order
            </a>
            <a
              href="https://instagram.com/thesilkstudiong"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '16px 36px',
                borderRadius: 12,
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 700,
                fontSize: 16,
                textDecoration: 'none',
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              DM us on Instagram
            </a>
          </div>
        </motion.div>
      </section>

      <FinalCTA />
    </div>
  );
}
