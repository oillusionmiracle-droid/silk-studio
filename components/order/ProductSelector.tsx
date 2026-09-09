'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer,
  Shirt,
  Palette,
  Globe,
  Package,
  FileText,
  Flag,
  Tv,
  BookOpen,
  Contact,
  CreditCard,
  Mail,
  Gift,
  PenTool,
  Brush,
  Share2,
  Image as ImageIconLucide,
  Briefcase,
  ShoppingCart,
  Ticket,
  Rocket,
  HelpCircle,
} from 'lucide-react';
import { OrderCategoryItem } from '@/lib/order/types';

export const DEFAULT_CATEGORIES: OrderCategoryItem[] = [
  { id: 'Print', label: 'Print', icon: <Printer size={22} /> },
  { id: 'Apparel', label: 'Apparel', icon: <Shirt size={22} /> },
  { id: 'Design', label: 'Design', icon: <Palette size={22} /> },
  { id: 'Web', label: 'Web', icon: <Globe size={22} /> },
  { id: 'Bundle', label: 'Bundle', icon: <Package size={22} /> },
];

export const DEFAULT_SUB_SERVICES: Record<string, string[]> = {
  Print: ['Flyers & Handbills', 'Banners', 'Billboards & Flex', 'Jotters & Notepads', 'ID Cards', 'Business Cards', 'Letterheads', 'Other'],
  Apparel: ['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers', 'Hoodies', 'Event Merch Set', 'Corporate Uniforms', 'Other'],
  Design: ['Logo & Brand Identity', 'Event Branding Kit', 'Social Media Templates', 'Print-Ready Artwork', 'Other'],
  Web: ['Landing Page', 'Business Website', 'E-commerce', 'Event Page', 'Other'],
  Bundle: ['Event Package', 'Business Starter', 'Custom Bundle'],
};

export const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'Flyers & Handbills': <FileText size={18} />,
  'Banners': <Flag size={18} />,
  'Billboards & Flex': <Tv size={18} />,
  'Jotters & Notepads': <BookOpen size={18} />,
  'ID Cards': <Contact size={18} />,
  'Business Cards': <CreditCard size={18} />,
  'Letterheads': <Mail size={18} />,
  'Custom T-Shirts': <Shirt size={18} />,
  'Sweatshirts': <Shirt size={18} />,
  'Grey Joggers': <Shirt size={18} />,
  'Hoodies': <Shirt size={18} />,
  'Event Merch Set': <Gift size={18} />,
  'Corporate Uniforms': <Briefcase size={18} />,
  'Logo & Brand Identity': <PenTool size={18} />,
  'Event Branding Kit': <Brush size={18} />,
  'Social Media Templates': <Share2 size={18} />,
  'Print-Ready Artwork': <ImageIconLucide size={18} />,
  'Landing Page': <Globe size={18} />,
  'Business Website': <Briefcase size={18} />,
  'E-commerce': <ShoppingCart size={18} />,
  'Event Page': <Ticket size={18} />,
  'Event Package': <Package size={18} />,
  'Business Starter': <Rocket size={18} />,
  'Custom Bundle': <Gift size={18} />,
  'Other': <HelpCircle size={18} />,
};

interface ProductSelectorProps {
  categories: OrderCategoryItem[];
  subServices: Record<string, string[]>;
  category: string | null;
  subService: string | null;
  isMobile: boolean;
  onSelectCategory: (catId: string) => void;
  onSelectSubService: (sub: string) => void;
}

export default function ProductSelector({
  categories,
  subServices,
  category,
  subService,
  isMobile,
  onSelectCategory,
  onSelectSubService,
}: ProductSelectorProps) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(25,25,25,0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: isMobile ? 20 : 28,
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        marginBottom: 20,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: '#C6FF33',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 700,
              color: '#0D0D0D',
              letterSpacing: 1,
            }}
          >
            01
          </span>
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 700,
            fontSize: 18,
            color: '#ffffff',
            margin: 0,
          }}
        >
          What do you need?
        </h2>
      </div>

      {/* CATEGORY PILLS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
          gap: 10,
          marginBottom: 20,
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            style={{
              position: 'relative',
              padding: isMobile ? '12px 14px' : '14px 16px',
              borderRadius: 12,
              border: `1px solid ${category === cat.id ? '#C6FF33' : 'rgba(255,255,255,0.1)'}`,
              backgroundColor: category === cat.id ? 'rgba(198,255,51,0.1)' : 'rgba(255,255,255,0.05)',
              fontFamily: 'var(--font-jakarta)',
              fontWeight: category === cat.id ? 700 : 600,
              fontSize: 14,
              color: category === cat.id ? '#C6FF33' : 'rgba(255,255,255,0.7)',
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

      {/* SUB-SERVICES GRID - INLINE */}
      <AnimatePresence>
        {category && subServices[category] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingTop: 20, borderTop: '1px solid #e0e0e0' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: '#999',
                  marginBottom: 14,
                }}
              >
                Select service
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile
                    ? 'repeat(auto-fill, minmax(120px, 1fr))'
                    : 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: 10,
                }}
              >
                {subServices[category].map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => onSelectSubService(sub)}
                    style={{
                      position: 'relative',
                      padding: '14px 12px',
                      borderRadius: 12,
                      border: `1px solid ${subService === sub ? '#C6FF33' : 'rgba(255,255,255,0.1)'}`,
                      backgroundColor: subService === sub ? 'rgba(198,255,51,0.15)' : 'rgba(255,255,255,0.05)',
                      fontFamily: 'var(--font-general)',
                      fontWeight: subService === sub ? 600 : 400,
                      fontSize: 13,
                      color: subService === sub ? '#C6FF33' : 'rgba(255,255,255,0.7)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}
                  >
                    <span style={{ fontSize: 18, display: 'block', marginBottom: 4 }}>
                      {SERVICE_ICONS[sub] || '✨'}
                    </span>
                    {sub}
                    {subService === sub && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: '#C6FF33',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(198,255,51,0.3)',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <polyline
                            points="2 6 5 9 10 3"
                            stroke="#0D0D0D"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
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
  );
}
