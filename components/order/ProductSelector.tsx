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
  Check,
  RotateCcw,
} from 'lucide-react';
import { OrderCategoryItem } from '@/lib/order/types';
import OrderImage from './OrderImage';
import { CATEGORY_IMAGE_MAP, SERVICE_IMAGE_MAP } from './orderImages';

export const DEFAULT_CATEGORIES: OrderCategoryItem[] = [
  { id: 'Print', label: 'Print', icon: <Printer size={22} /> },
  { id: 'Apparel', label: 'Apparel', icon: <Shirt size={22} /> },
  { id: 'Design', label: 'Design', icon: <Palette size={22} /> },
  { id: 'Web', label: 'Web', icon: <Globe size={22} /> },
  { id: 'Bundle', label: 'Bundle', icon: <Package size={22} /> },
];

export const DEFAULT_SUB_SERVICES: Record<string, string[]> = {
  Print: [
    'Flyers & Handbills',
    'Banners',
    'Billboards & Flex',
    'Jotters & Notepads',
    'ID Cards',
    'Business Cards',
    'Letterheads',
    'Other',
  ],
  Apparel: [
    'Custom T-Shirts',
    'Sweatshirts',
    'Grey Joggers',
    'Hoodies',
    'Event Merch Set',
    'Corporate Uniforms',
    'Other',
  ],
  Design: [
    'Logo & Brand Identity',
    'Event Branding Kit',
    'Social Media Templates',
    'Print-Ready Artwork',
    'Other',
  ],
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
  theme?: 'dark' | 'light';
  onSelectCategory: (catId: string) => void;
  onSelectSubService: (sub: string) => void;
}

export default function ProductSelector({
  categories,
  subServices,
  category,
  subService,
  isMobile,
  theme = 'dark',
  onSelectCategory,
  onSelectSubService,
}: ProductSelectorProps) {
  const isDark = theme === 'dark';
  const subServiceContainerRef = React.useRef<HTMLDivElement>(null);

  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    if (catId) {
      setTimeout(() => {
        subServiceContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  return (
    <div
      style={{
        backgroundColor: isDark ? '#111113' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 24,
        padding: isMobile ? 16 : 24,
        boxShadow: isDark
          ? '0 16px 40px rgba(0,0,0,0.45)'
          : '0 10px 30px rgba(0,0,0,0.06)',
        marginBottom: 24,
        position: 'relative',
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
    >
      {/* HEADER / RESET CONTROL */}
      {category && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 12,
          }}
        >
          <button
            type="button"
            aria-label="Reset selection"
            onClick={() => onSelectCategory('')}
            style={{
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      )}

      {/* CATEGORY PORTRAIT RECTANGLE CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
          gap: isMobile ? 12 : 16,
          marginBottom: category ? 24 : 0,
        }}
      >
        {categories.map((cat) => {
          const isSelected = category === cat.id;
          const imgConfig = CATEGORY_IMAGE_MAP[cat.id];

          return (
            <motion.button
              key={cat.id}
              type="button"
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={() => handleCategoryClick(cat.id)}
              style={{
                position: 'relative',
                padding: 0,
                borderRadius: 20,
                border: isSelected
                  ? `2px solid ${isDark ? '#ffffff' : '#000000'}`
                  : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                backgroundColor: isDark ? '#17171a' : '#f9fafb',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                outline: 'none',
                boxShadow: isSelected
                  ? isDark
                    ? '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px #ffffff'
                    : '0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px #000000'
                  : isDark
                  ? '0 12px 28px rgba(0,0,0,0.35)'
                  : '0 8px 20px rgba(0,0,0,0.04)',
                height: isMobile ? 190 : 230,
              }}
            >
              {/* Image Box - Tall Portrait Area */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden',
                  backgroundColor: isDark ? '#141416' : '#e5e7eb',
                }}
              >
                <OrderImage
                  src={imgConfig?.primary}
                  fallbackSources={imgConfig?.fallbacks}
                  alt={cat.label}
                  icon={cat.icon}
                  fill
                />

                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      backgroundColor: isDark ? '#ffffff' : '#000000',
                      color: isDark ? '#000000' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                      zIndex: 3,
                    }}
                  >
                    <Check size={13} strokeWidth={3} />
                  </div>
                )}
              </div>

              {/* Card Label Bottom - Clean Helvetica Font with subtle shadow */}
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: isDark ? '#17171a' : '#ffffff',
                  borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                    fontWeight: isSelected ? 700 : 600,
                    fontSize: 15,
                    color: isDark
                      ? isSelected
                        ? '#ffffff'
                        : 'rgba(255,255,255,0.9)'
                      : isSelected
                      ? '#000000'
                      : 'rgba(0,0,0,0.85)',
                    letterSpacing: '-0.2px',
                  }}
                >
                  {cat.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* SUB-SERVICES EXPANDABLE GALLERY */}
      <AnimatePresence mode="wait">
        {category && subServices[category] && (
          <motion.div
            key={category}
            ref={subServiceContainerRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              paddingTop: 20,
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile
                  ? 'repeat(2, 1fr)'
                  : 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: isMobile ? 12 : 16,
              }}
            >
              {subServices[category].map((sub) => {
                const isSelected = subService === sub;
                const srvConfig = SERVICE_IMAGE_MAP[sub];

                return (
                  <motion.button
                    key={sub}
                    type="button"
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={() => onSelectSubService(sub)}
                    style={{
                      position: 'relative',
                      padding: 0,
                      borderRadius: 18,
                      border: isSelected
                        ? `2px solid ${isDark ? '#ffffff' : '#000000'}`
                        : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                      backgroundColor: isDark ? '#17171a' : '#f9fafb',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      outline: 'none',
                      boxShadow: isSelected
                        ? isDark
                          ? '0 18px 36px rgba(0,0,0,0.6), 0 0 0 1px #ffffff'
                          : '0 18px 36px rgba(0,0,0,0.12), 0 0 0 1px #000000'
                        : isDark
                        ? '0 10px 24px rgba(0,0,0,0.35)'
                        : '0 6px 16px rgba(0,0,0,0.04)',
                      height: isMobile ? 190 : 220,
                    }}
                  >
                    {/* Media Thumbnail - Tall portrait box */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        flex: 1,
                        minHeight: 0,
                        overflow: 'hidden',
                        backgroundColor: isDark ? '#141416' : '#e5e7eb',
                      }}
                    >
                      <OrderImage
                        src={srvConfig?.primary}
                        fallbackSources={srvConfig?.fallbacks}
                        alt={sub}
                        icon={SERVICE_ICONS[sub]}
                        fill
                      />
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: isDark ? '#ffffff' : '#000000',
                            color: isDark ? '#000000' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                            zIndex: 3,
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Metadata Details in clean Helvetica */}
                    <div
                      style={{
                        padding: '10px 12px',
                        backgroundColor: isDark ? '#17171a' : '#ffffff',
                        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                          fontWeight: isSelected ? 700 : 600,
                          fontSize: 13,
                          color: isDark
                            ? isSelected
                              ? '#ffffff'
                              : 'rgba(255,255,255,0.9)'
                            : isSelected
                            ? '#000000'
                            : 'rgba(0,0,0,0.85)',
                          margin: 0,
                          lineHeight: 1.25,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {sub}
                      </p>
                      {srvConfig?.startingPrice && !srvConfig.startingPrice.toLowerCase().includes('custom quote') && (
                        <p
                          style={{
                            fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                            fontSize: 11,
                            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                            margin: '3px 0 0 0',
                          }}
                        >
                          {srvConfig.startingPrice}
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
