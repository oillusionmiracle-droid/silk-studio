'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import FinalCTA from '@/components/FinalCTA';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */

const servicesData = [
  {
    category: 'Print',
    title: 'Flyers & Handbills',
    image: '/images/services/flyers.jpg',
    icon: '/icons/print.svg',
    tag: 'PRINT',
    body: 'A5, A4, A3 sizes. Single or double-sided. Sharp colour, consistent output.',
    price: 'A5 ₦25,800/100 · A4 ₦50,000/100 · A3 ₦80,000/100',
    turnaround: '48hrs',
  },
  {
    category: 'Print',
    title: 'Banners',
    image: '/images/services/banners.jpg',
    icon: '/icons/print.svg',
    tag: 'PRINT',
    body: 'Custom dimensions. Priced at ₦1,000 per square foot. Eyelets available on request.',
    price: '₦1,000 per sq ft (e.g. 7×3ft = ₦21,000)',
    turnaround: '48hrs',
  },
  {
    category: 'Print',
    title: 'Billboards & Flex',
    image: '/images/services/billboards.jpg',
    icon: '/icons/print.svg',
    tag: 'PRINT',
    body: 'Large-format outdoor printing. Specifications on request.',
    price: 'Custom quote',
    turnaround: '1 week',
  },
  {
    category: 'Print',
    title: 'Jotters & Notepads',
    image: '/images/services/jotters.jpg',
    icon: '/icons/print.svg',
    tag: 'PRINT',
    body: 'Plain or ruled. Matte or gloss. Spiral or perfect binding (+₦3,000). Soft or hard cover (+₦2,000).',
    price: 'From ₦46,900 per 50',
    turnaround: '48hrs',
  },
  {
    category: 'Print',
    title: 'ID Cards & Passes',
    image: '/images/services/id-cards.jpg',
    icon: '/icons/print.svg',
    tag: 'PRINT',
    body: 'Standard, with lanyard+holder, or badge reel+holder.',
    price: 'Standard ₦4,500 · With lanyard ₦7,500 · Badge reel ₦7,500',
    turnaround: '48hrs',
  },
  {
    category: 'Print',
    title: 'Business Cards',
    image: '/images/services/business-cards.jpg',
    icon: '/icons/print.svg',
    tag: 'PRINT',
    body: '300gsm. Matte or gloss. Square or rounded (+₦2,000). Super thick 600gsm (+₦2,000).',
    price: 'From ₦11,000 per 100',
    turnaround: '48hrs',
  },
  {
    category: 'Print',
    title: 'Letterheads',
    image: '/images/services/letterheads.jpg',
    icon: '/icons/print.svg',
    tag: 'PRINT',
    body: 'Print-ready letterheads for professional correspondence.',
    price: 'Custom quote',
    turnaround: '48hrs',
  },
  {
    category: 'Apparel',
    title: 'Custom T-Shirts',
    image: '/images/services/tshirts.jpg',
    icon: '/icons/apparel.svg',
    tag: 'APPAREL',
    body: 'Off-white or black 100% cotton. Sublimation and screen print available.',
    price: 'From ₦8,000 per piece',
    turnaround: '48hrs',
  },
  {
    category: 'Apparel',
    title: 'Sweatshirts',
    image: '/images/services/sweatshirts.jpg',
    icon: '/icons/apparel.svg',
    tag: 'APPAREL',
    body: 'Premium heavyweight. Custom graphics, brand logos, event designs.',
    price: 'From ₦17,300 per piece',
    turnaround: '48hrs',
  },
  {
    category: 'Apparel',
    title: 'Grey Joggers',
    image: '/images/services/joggers.jpg',
    icon: '/icons/apparel.svg',
    tag: 'APPAREL',
    body: 'Custom printed or embroidered. Ideal for brand merch and uniforms.',
    price: 'From ₦25,000 per piece',
    turnaround: '48hrs',
  },
  {
    category: 'Apparel',
    title: 'Hoodies',
    image: '/images/services/hoodies.jpg',
    icon: '/icons/apparel.svg',
    tag: 'APPAREL',
    body: 'Specs and pricing on request. Minimum order applies.',
    price: 'Custom quote',
    turnaround: 'Custom',
  },
  {
    category: 'Apparel',
    title: 'Event Merch Sets',
    image: '/images/services/merch-sets.jpg',
    icon: '/icons/apparel.svg',
    tag: 'APPAREL',
    body: 'Coordinated merch packages for events, launches, and team days.',
    price: 'Custom quote',
    turnaround: 'Custom',
  },
  {
    category: 'Apparel',
    title: 'Corporate Uniforms',
    image: '/images/services/uniforms.jpg',
    icon: '/icons/apparel.svg',
    tag: 'APPAREL',
    body: 'Bulk orders with consistent branding across your team.',
    price: 'Custom quote',
    turnaround: '5–7 days',
  },
  {
    category: 'Design',
    title: 'Logo & Brand Identity',
    image: '/images/services/logo-design.jpg',
    icon: '/icons/design.svg',
    tag: 'DESIGN',
    body: 'Mark, wordmark, colour palette, typography, usage guide.',
    price: 'From ₦50,000',
    turnaround: '48hrs',
  },
  {
    category: 'Design',
    title: 'Event Branding Kit',
    image: '/images/services/event-branding.jpg',
    icon: '/icons/design.svg',
    tag: 'DESIGN',
    body: 'Full visual package — invites, banners, social graphics.',
    price: 'Custom quote',
    turnaround: '4 days',
  },
  {
    category: 'Design',
    title: 'Social Media Templates',
    image: '/images/services/social-templates.jpg',
    icon: '/icons/design.svg',
    tag: 'DESIGN',
    body: 'Editable Canva or Figma templates. Posts, stories, highlights.',
    price: 'Custom quote',
    turnaround: '48hrs',
  },
  {
    category: 'Design',
    title: 'Print-Ready Artwork',
    image: '/images/services/print-artwork.jpg',
    icon: '/icons/design.svg',
    tag: 'DESIGN',
    body: 'Design work prepared to exact print specs and bleed settings.',
    price: 'Custom quote',
    turnaround: '48hrs',
  },
  {
    category: 'Web',
    title: 'Landing Page',
    image: '/images/services/landing-page.jpg',
    icon: '/icons/web.svg',
    tag: 'WEB',
    body: 'Wireframe, responsive build, copy, contact form, SEO, analytics.',
    price: '₦80,000 – ₦210,000',
    turnaround: '4 days',
  },
  {
    category: 'Web',
    title: 'Business Website',
    image: '/images/services/business-website.jpg',
    icon: '/icons/web.svg',
    tag: 'WEB',
    body: '10–20 pages. Full build, copy, forms, page templates, SEO.',
    price: '₦200,000 – ₦500,000',
    turnaround: '2 weeks',
  },
  {
    category: 'Web',
    title: 'E-commerce',
    image: '/images/services/ecommerce.jpg',
    icon: '/icons/web.svg',
    tag: 'WEB',
    body: 'Catalogue, cart, payments, shipping, transactional emails, security.',
    price: '₦1,000,000 – ₦5,000,000',
    turnaround: 'Custom',
  },
  {
    category: 'Web',
    title: 'Event Page',
    image: '/images/services/event-page.jpg',
    icon: '/icons/web.svg',
    tag: 'WEB',
    body: 'Single-page event site. RSVP, countdown, schedule, map.',
    price: 'From ₦80,000',
    turnaround: '4 days',
  },
];

const bundlesData = [
  {
    title: 'Event Package',
    image: '/images/services/bundle-event.jpg',
    icon: '/icons/bundle.svg',
    tag: 'BUNDLE',
    pills: ['Invite Design + Print', 'Event Banner', '10 Custom Shirts'],
    body: 'Everything handled. One brief. One price. Customise inclusions on request.',
    price: 'From ₦300,000',
    ctaLink: '/order?package=event',
  },
  {
    title: 'Business Starter',
    image: '/images/services/bundle-business.jpg',
    icon: '/icons/bundle.svg',
    tag: 'BUNDLE',
    pills: ['Logo & Brand Identity', 'Business Cards', 'Letterhead', 'Social Templates'],
    body: 'Everything you need to launch looking like you mean it. Customise on request.',
    price: 'From ₦450,000',
    ctaLink: '/order?package=business',
  },
];

const faqsData = [
  { q: 'Do I need to send my own design?', a: 'No. We design everything from scratch. Just describe what you want and we handle the rest.' },
  { q: 'How do I pay?', a: '75% deposit before we start. Balance before or on delivery.' },
  { q: 'Can you deliver to me?', a: 'Yes. Across Lagos. Fee depends on location.' },
  { q: "What if I don't like the design?", a: 'One free revision included. Additional rounds billed separately.' },
  { q: 'How fast is fast?', a: '48hrs standard. Urgent (same-day/next-day) available at a premium.' },
];

const tabs = ['All', 'Print', 'Apparel', 'Design', 'Web', 'Bundles'];

/* ─────────────────────────────────────────
   SERVICE CARD
───────────────────────────────────────── */

function ServiceCard({ item, index }: { item: typeof servicesData[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!expanded) {
      setExpanded(true);
      setTimeout(() => {
        if (detailRef.current) {
          gsap.fromTo(detailRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
          );
        }
      }, 10);
    } else {
      if (detailRef.current) {
        gsap.to(detailRef.current, {
          opacity: 0, y: 8, duration: 0.25, ease: 'power2.in',
          onComplete: () => setExpanded(false),
        });
      } else {
        setExpanded(false);
      }
    }
  };

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        delay: (index % 3) * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [index]);

  return (
    <div
      ref={cardRef}
      onClick={toggle}
      style={{
        position: 'relative',
        borderRadius: 6,
        overflow: 'hidden',
        cursor: 'pointer',
        border: `1px solid ${expanded ? '#C6FF33' : '#2A2A2A'}`,
        transition: 'border-color 0.3s ease, transform 0.3s ease',
        transform: expanded ? 'scale(1.01)' : 'scale(1)',
        backgroundColor: '#111',
        aspectRatio: expanded ? 'auto' : '4/3',
        minHeight: expanded ? 'auto' : undefined,
      }}
    >
      {/* BG IMAGE — zoomed in, darkened */}
      <div style={{
        position: expanded ? 'relative' : 'absolute',
        inset: 0,
        height: expanded ? 200 : '100%',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <img
          src={item.image}
          alt={item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: 'scale(1.08)',
            transition: 'transform 0.6s ease',
            display: 'block',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.14)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.08)'; }}
        />
        {/* Dark overlay — heavier at bottom */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: expanded
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 100%)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.82) 70%, rgba(0,0,0,0.95) 100%)',
          transition: 'background 0.4s ease',
        }} />

        {/* Tag — always visible */}
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: '#C6FF33',
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: '4px 10px',
          borderRadius: 2,
          backdropFilter: 'blur(4px)',
        }}>
          {item.tag}
        </div>

        {/* Expand indicator */}
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          transition: 'transform 0.3s ease, background 0.3s ease',
          transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          <span style={{ color: expanded ? '#C6FF33' : '#ffffff', fontSize: 16, lineHeight: 1, marginTop: -1 }}>+</span>
        </div>

        {/* Title always on image */}
        {!expanded && (
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
          }}>
            <h3 style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 700,
              fontSize: 20,
              color: '#ffffff',
              lineHeight: 1.2,
              margin: 0,
            }}>
              {item.title}
            </h3>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 6,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}>
              Tap to explore →
            </p>
          </div>
        )}
      </div>

      {/* EXPANDED DETAIL PANEL */}
      {expanded && (
        <div
          ref={detailRef}
          style={{
            padding: '24px 24px 28px',
            backgroundColor: '#0f0f0f',
          }}
        >
          <h3 style={{
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 700,
            fontSize: 22,
            color: '#ffffff',
            marginBottom: 12,
            lineHeight: 1.2,
          }}>
            {item.title}
          </h3>

          {item.body && (
            <p style={{
              fontFamily: 'var(--font-general)',
              fontSize: 15,
              color: '#888888',
              lineHeight: 1.7,
              marginBottom: 20,
            }}>
              {item.body}
            </p>
          )}

          <div style={{
            borderTop: '1px solid #2A2A2A',
            paddingTop: 20,
            marginBottom: 20,
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: '#C6FF33',
              letterSpacing: 1,
              marginBottom: 6,
            }}>
              {item.price}
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: '#888888',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}>
              Turnaround: <span style={{ color: '#ffffff' }}>{item.turnaround}</span>
            </p>
          </div>

          <Link
            href={`/order?service=${encodeURIComponent(item.title)}`}
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#C6FF33',
              color: '#0D0D0D',
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 700,
              fontSize: 14,
              padding: '12px 24px',
              borderRadius: 3,
              textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#d4ff66'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#C6FF33'; }}
          >
            Order This →
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   BUNDLE CARD
───────────────────────────────────────── */

function BundleCard({ item, index }: { item: typeof bundlesData[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (!expanded) {
      setExpanded(true);
      setTimeout(() => {
        if (detailRef.current) {
          gsap.fromTo(detailRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
          );
        }
      }, 10);
    } else {
      if (detailRef.current) {
        gsap.to(detailRef.current, {
          opacity: 0, y: 8, duration: 0.25, ease: 'power2.in',
          onComplete: () => setExpanded(false),
        });
      } else {
        setExpanded(false);
      }
    }
  };

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        delay: index * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      onClick={toggle}
      style={{
        position: 'relative',
        borderRadius: 6,
        overflow: 'hidden',
        cursor: 'pointer',
        border: `1px solid ${expanded ? '#C6FF33' : '#2A2A2A'}`,
        transition: 'border-color 0.3s ease',
        backgroundColor: '#111',
        aspectRatio: expanded ? 'auto' : '16/9',
      }}
    >
      {/* Image */}
      <div style={{
        position: expanded ? 'relative' : 'absolute',
        inset: 0,
        height: expanded ? 220 : '100%',
        overflow: 'hidden',
      }}>
        <img
          src={item.image}
          alt={item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.08)',
            display: 'block',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.88) 100%)',
        }} />

        {/* BEST VALUE badge */}
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: '#0D0D0D',
          backgroundColor: '#C6FF33',
          padding: '4px 10px',
          borderRadius: 2,
          fontWeight: 700,
        }}>
          BEST VALUE
        </div>

        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease',
          transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          <span style={{ color: expanded ? '#C6FF33' : '#ffffff', fontSize: 16, lineHeight: 1, marginTop: -1 }}>+</span>
        </div>

        {!expanded && (
          <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
            <h3 style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 700,
              fontSize: 24,
              color: '#ffffff',
              lineHeight: 1.2,
              margin: 0,
            }}>
              {item.title}
            </h3>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
              marginTop: 6,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}>
              Tap to explore →
            </p>
          </div>
        )}
      </div>

      {/* Expanded */}
      {expanded && (
        <div ref={detailRef} style={{ padding: '24px 24px 28px', backgroundColor: '#0f0f0f' }}>
          <h3 style={{
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 700,
            fontSize: 24,
            color: '#ffffff',
            marginBottom: 16,
          }}>
            {item.title}
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {item.pills.map(pill => (
              <span key={pill} style={{
                border: '1px solid #2A2A2A',
                borderRadius: 100,
                padding: '5px 12px',
                fontFamily: 'var(--font-general)',
                fontSize: 12,
                color: '#888888',
                backgroundColor: '#111',
              }}>
                {pill}
              </span>
            ))}
          </div>

          <p style={{
            fontFamily: 'var(--font-general)',
            fontSize: 15,
            color: '#888888',
            lineHeight: 1.7,
            marginBottom: 20,
          }}>
            {item.body}
          </p>

          <div style={{ borderTop: '1px solid #2A2A2A', paddingTop: 20, marginBottom: 24 }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: '#C6FF33',
              letterSpacing: 1,
            }}>
              {item.price}
            </p>
          </div>

          <Link
            href={item.ctaLink}
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#C6FF33',
              color: '#0D0D0D',
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 700,
              fontSize: 14,
              padding: '12px 24px',
              borderRadius: 3,
              textDecoration: 'none',
            }}
          >
            Book This Package →
          </Link>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ
───────────────────────────────────────── */

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px' }}>
      <ScrollReveal style={{ textAlign: 'center', marginBottom: 64 }}>
        <p className="label-mono" style={{ marginBottom: 16 }}>FAQ</p>
        <h2 style={{
          fontFamily: 'var(--font-jakarta)',
          fontWeight: 700,
          fontSize: 'clamp(32px, 4vw, 48px)',
          color: '#ffffff',
          lineHeight: 1.15,
        }}>
          Common Questions.
        </h2>
      </ScrollReveal>
      {faqsData.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} style={{ borderBottom: '1px solid #2A2A2A', padding: '24px 0' }}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              style={{
                width: '100%', background: 'none', border: 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', padding: 0, textAlign: 'left',
              }}
            >
              <h4 style={{
                fontFamily: 'var(--font-jakarta)', fontWeight: 600, fontSize: 20,
                color: isOpen ? '#C6FF33' : '#ffffff',
                transition: 'color 0.2s ease', paddingRight: 24,
              }}>
                {faq.q}
              </h4>
              <span style={{
                color: isOpen ? '#C6FF33' : '#888888', fontSize: 24, lineHeight: 1,
                transform: isOpen ? 'rotate(45deg)' : 'none',
                transition: 'transform 0.3s ease, color 0.2s ease',
              }}>
                +
              </span>
            </button>
            <div style={{
              maxHeight: isOpen ? 200 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.35s ease',
            }}>
              <p style={{
                fontFamily: 'var(--font-general)', fontSize: 16,
                color: '#888888', lineHeight: 1.7,
                paddingTop: 16, paddingBottom: 8,
              }}>
                {faq.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('All');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const filteredServices = servicesData.filter(
    s => activeTab === 'All' || activeTab === s.category
  );
  const showBundles = activeTab === 'All' || activeTab === 'Bundles';
  const showServices = activeTab !== 'Bundles';

  /* ── Page title GSAP zoom-out ── */
  useEffect(() => {
    if (!titleRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const split = new SplitType(titleRef.current, { types: 'chars' });
    const isMobile = window.innerWidth < 768;
    gsap.from(split.chars, {
      scale: isMobile ? 4 : 8,
      opacity: 0,
      duration: 0.55,
      stagger: 0.03,
      ease: 'back.out(1.4)',
      transformOrigin: 'center center',
      delay: 0.1,
    });
    return () => { split.revert(); };
  }, []);

  /* ── Tab filter fade transition ── */
  useEffect(() => {
    const cards = document.querySelectorAll('.service-card-wrapper');
    gsap.fromTo(cards,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
    );
  }, [activeTab]);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>

      {/* ── CINEMATIC BACKGROUND (hero-bg image) ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        {/* Hero background image */}
        <img
          src="/images/hero-bg.jpg"
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
          }}
        />

        {/* Heavy dark overlay so content reads clearly */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,13,13,0.88) 0%, rgba(13,13,13,0.82) 50%, rgba(13,13,13,0.92) 100%)',
        }} />

        {/* Animated mesh blobs */}
        <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'screen', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute',
            top: '-10%', left: '20%',
            width: 600, height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(198,255,51,0.04) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'blob1 18s ease-in-out infinite alternate',
          }} />
          <div style={{
            position: 'absolute',
            top: '30%', right: '-10%',
            width: 800, height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'blob2 24s ease-in-out infinite alternate-reverse',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-5%', left: '-5%',
            width: 500, height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(198,255,51,0.025) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'blob3 20s ease-in-out infinite alternate',
          }} />
        </div>
      </div>

      {/* ── CONTENT (above background) ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* PAGE HEADER */}
        <section style={{
          paddingTop: 160, paddingBottom: 80,
          paddingLeft: 24, paddingRight: 24,
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p className="label-mono" style={{ marginBottom: 24 }}>WHAT WE OFFER</p>
            <h1
              ref={titleRef}
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 900,
                fontSize: 'clamp(40px, 6vw, 80px)',
                lineHeight: 1.05,
                letterSpacing: '-2px',
                color: '#ffffff',
                marginBottom: 24,
              }}
            >
              Everything your brand needs to show up{' '}
              <span style={{ color: '#C6FF33' }}>right.</span>
            </h1>
            <p style={{
              fontFamily: 'var(--font-general)',
              fontSize: 20,
              color: '#888888',
              lineHeight: 1.7,
            }}>
              Print. Design. Digital. Pick one or let us handle all three.
            </p>
          </div>
        </section>

        {/* FILTER TABS */}
        <div
          ref={tabsRef}
          style={{
            position: 'sticky',
            top: 64,
            zIndex: 40,
            backgroundColor: 'rgba(13,13,13,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid #2A2A2A',
            borderTop: '1px solid #2A2A2A',
            padding: '0 24px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          <div style={{
            display: 'flex',
            gap: 0,
            maxWidth: 1100,
            margin: '0 auto',
            minWidth: 'max-content',
          }}>
            {tabs.map(tab => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '22px 28px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-jakarta)',
                    fontWeight: 600,
                    fontSize: 15,
                    color: isActive ? '#C6FF33' : '#888888',
                    position: 'relative',
                    transition: 'color 0.2s ease',
                    letterSpacing: 0.3,
                  }}
                >
                  {tab}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      bottom: -1, left: 0, right: 0,
                      height: 2,
                      backgroundColor: '#C6FF33',
                      borderRadius: 1,
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CARDS GRID */}
        <section style={{ padding: '64px 24px 80px', minHeight: '50vh' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            {showServices && filteredServices.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 20,
                  marginBottom: showBundles ? 80 : 0,
                }}
              >
                {filteredServices.map((svc, i) => (
                  <div key={svc.title} className="service-card-wrapper">
                    <ServiceCard item={svc} index={i} />
                  </div>
                ))}
              </div>
            )}

            {showBundles && (
              <>
                {activeTab === 'All' && (
                  <div style={{ marginBottom: 40 }}>
                    <div style={{ borderTop: '1px solid #2A2A2A', marginBottom: 40 }} />
                    <p className="label-mono" style={{ marginBottom: 8 }}>Featured Bundles</p>
                    <p style={{
                      fontFamily: 'var(--font-general)',
                      fontSize: 16,
                      color: '#888888',
                    }}>
                      Everything handled. One brief.
                    </p>
                  </div>
                )}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                  gap: 20,
                }}>
                  {bundlesData.map((bundle, i) => (
                    <div key={bundle.title} className="service-card-wrapper">
                      <BundleCard item={bundle} index={i} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <FAQAccordion />
        <FinalCTA />
      </div>

      {/* BLOB KEYFRAMES */}
      <style>{`
        @keyframes blob1 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(60px, 40px) scale(1.1); }
        }
        @keyframes blob2 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-80px, 30px) scale(1.05); }
        }
        @keyframes blob3 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, -60px) scale(1.08); }
        }
        .service-card-wrapper { height: 100%; }
        @media (max-width: 768px) {
          .service-card-wrapper { height: auto; }
        }
      `}</style>
    </div>
  );
}