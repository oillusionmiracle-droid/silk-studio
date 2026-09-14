'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { OrderSpecs } from '@/lib/order/types';
import { SpecField, Pill, QtyInput } from './OrderInputs';

interface ProductConfigurationProps {
  subService: string;
  specs: OrderSpecs;
  isMobile: boolean;
  totalApparelQty: number;
  theme?: 'dark' | 'light';
  onUpdateSpec: <K extends keyof OrderSpecs>(key: K, value: OrderSpecs[K]) => void;
  onUpdateApparelSize: (size: string, value: number) => void;
}

export default function ProductConfiguration({
  subService,
  specs,
  isMobile,
  totalApparelQty,
  theme = 'dark',
  onUpdateSpec,
  onUpdateApparelSize,
}: ProductConfigurationProps) {
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        backgroundColor: isDark ? '#111113' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: 24,
        padding: isMobile ? 18 : 28,
        boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.45)' : '0 10px 30px rgba(0,0,0,0.06)',
        marginBottom: 24,
        transition: 'background-color 0.2s, border-color 0.2s',
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <h2
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
            fontWeight: 700,
            fontSize: isMobile ? 18 : 20,
            color: isDark ? '#ffffff' : '#000000',
            margin: 0,
            letterSpacing: '-0.3px',
          }}
        >
          {subService} Specifications
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* FLYERS & HANDBILLS */}
        {subService === 'Flyers & Handbills' && (
          <>
            <SpecField label="Size" theme={theme}>
              {['A5', 'A4', 'A3'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  theme={theme}
                  isActive={specs.size === opt}
                  onClick={() => onUpdateSpec('size', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Sides" theme={theme}>
              {['Single-sided', 'Double-sided'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  theme={theme}
                  isActive={specs.sides === opt}
                  onClick={() => onUpdateSpec('sides', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Lamination" theme={theme}>
              {['None', 'Matte', 'Gloss'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  theme={theme}
                  isActive={specs.lamination === opt}
                  onClick={() => onUpdateSpec('lamination', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Quantity" theme={theme}>
              <QtyInput
                value={specs.quantity}
                min={100}
                step={100}
                theme={theme}
                onChange={(v) => onUpdateSpec('quantity', v)}
                quickVals={[100, 250, 500, 1000]}
              />
            </SpecField>
          </>
        )}

        {/* BANNERS */}
        {subService === 'Banners' && (
          <>
            <div style={{ display: 'flex', gap: 16, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              <SpecField label="Width (ft)" flex theme={theme}>
                <QtyInput
                  value={specs.width}
                  min={1}
                  step={0.5}
                  theme={theme}
                  onChange={(v) => onUpdateSpec('width', v)}
                />
              </SpecField>
              <SpecField label="Height (ft)" flex theme={theme}>
                <QtyInput
                  value={specs.height}
                  min={1}
                  step={0.5}
                  theme={theme}
                  onChange={(v) => onUpdateSpec('height', v)}
                />
              </SpecField>
            </div>
            <div
              style={{
                backgroundColor: isDark ? '#17171a' : '#f9fafb',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                padding: '12px 16px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                  fontSize: 13,
                  color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                }}
              >
                Calculated Dimensions:
              </span>
              <span
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: isDark ? '#ffffff' : '#000000',
                }}
              >
                {specs.width} × {specs.height} = {(specs.width * specs.height).toFixed(1)} sq ft
              </span>
            </div>
            <SpecField label="Eyelets" theme={theme}>
              {['Yes', 'No'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  theme={theme}
                  isActive={specs.eyelets === opt}
                  onClick={() => onUpdateSpec('eyelets', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Quantity" theme={theme}>
              <QtyInput
                value={specs.quantity}
                min={1}
                step={1}
                theme={theme}
                onChange={(v) => onUpdateSpec('quantity', v)}
              />
            </SpecField>
          </>
        )}

        {/* JOTTERS & NOTEPADS */}
        {subService === 'Jotters & Notepads' && (
          <>
            <SpecField label="Inner Sheets" theme={theme}>
              {['Plain', 'Ruled'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  theme={theme}
                  isActive={specs.innerSheets === opt}
                  onClick={() => onUpdateSpec('innerSheets', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Lamination" theme={theme}>
              {['None', 'Matte', 'Gloss'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  theme={theme}
                  isActive={specs.lamination === opt}
                  onClick={() => onUpdateSpec('lamination', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Binding" theme={theme}>
              {['Spiral', 'Perfect Binding'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  theme={theme}
                  isActive={specs.binding === opt}
                  onClick={() => onUpdateSpec('binding', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Cover" theme={theme}>
              {['Soft Cover', 'Hard Cover'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  theme={theme}
                  isActive={specs.cover === opt}
                  onClick={() => onUpdateSpec('cover', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Quantity" theme={theme}>
              <QtyInput
                value={specs.quantity}
                min={50}
                step={50}
                theme={theme}
                onChange={(v) => onUpdateSpec('quantity', v)}
                quickVals={[50, 100, 200, 500]}
              />
            </SpecField>
          </>
        )}

        {/* ID CARDS */}
        {subService === 'ID Cards' && (
          <>
            <SpecField label="Card Type" theme={theme}>
              {[
                { label: 'Standard', hint: '₦4,500 / card' },
                { label: 'Lanyard + Holder', hint: '₦8,000 / card' },
                { label: 'Badge Reel + Holder', hint: '₦10,000 / card' },
              ].map((opt) => (
                <Pill
                  key={opt.label}
                  label={opt.label}
                  subtitle={opt.hint}
                  theme={theme}
                  isActive={specs.idType === opt.label}
                  onClick={() => onUpdateSpec('idType', opt.label)}
                />
              ))}
            </SpecField>
            <SpecField label="Quantity" theme={theme}>
              <QtyInput
                value={specs.quantity}
                min={1}
                step={1}
                theme={theme}
                onChange={(v) => onUpdateSpec('quantity', v)}
              />
            </SpecField>
          </>
        )}

        {/* BUSINESS CARDS */}
        {subService === 'Business Cards' && (
          <>
            <SpecField label="Stock" theme={theme}>
              {['Standard 300gsm', 'Super Thick 600gsm'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  theme={theme}
                  isActive={specs.stock === opt}
                  onClick={() => onUpdateSpec('stock', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Lamination" theme={theme}>
              {['Matte', 'Gloss'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  theme={theme}
                  isActive={specs.lamination === opt}
                  onClick={() => onUpdateSpec('lamination', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Corners" theme={theme}>
              {['Square', 'Rounded'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  theme={theme}
                  isActive={specs.corners === opt}
                  onClick={() => onUpdateSpec('corners', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Quantity" theme={theme}>
              <QtyInput
                value={specs.quantity}
                min={100}
                step={100}
                theme={theme}
                onChange={(v) => onUpdateSpec('quantity', v)}
                quickVals={[100, 250, 500, 1000]}
              />
            </SpecField>
          </>
        )}

        {/* LETTERHEADS */}
        {subService === 'Letterheads' && (
          <>
            <SpecField label="Paper Type" theme={theme}>
              {[
                { label: 'Standard', hint: '₦12,000 / 50' },
                { label: 'Brown', hint: '₦18,000 / 50' },
              ].map((opt) => (
                <Pill
                  key={opt.label}
                  label={opt.label}
                  subtitle={opt.hint}
                  theme={theme}
                  isActive={specs.paperType === opt.label}
                  onClick={() => onUpdateSpec('paperType', opt.label)}
                />
              ))}
            </SpecField>
            <SpecField label="Quantity (min 50)" theme={theme}>
              <QtyInput
                value={Math.max(50, specs.quantity)}
                min={50}
                step={50}
                theme={theme}
                onChange={(v) => onUpdateSpec('quantity', Math.max(50, v))}
                quickVals={[50, 100, 200, 500]}
              />
            </SpecField>
          </>
        )}

        {/* EVENT MERCH SET */}
        {subService === 'Event Merch Set' && (
          <div
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: 16,
              padding: '16px 20px',
            }}
          >
            <p
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                fontSize: 13,
                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              List your required items, size breakdowns, and quantities in the project details below. Our production team will return a customized breakdown within 2 hours.
            </p>
          </div>
        )}

        {/* APPAREL SIZES GRID */}
        {['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers', 'Hoodies'].includes(subService) && (
          <SpecField label="Apparel Size Distribution" badge={`${totalApparelQty} pcs total`} theme={theme}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
                gap: 10,
                width: '100%',
              }}
            >
              {(Object.keys(specs.apparelSizes) as Array<keyof typeof specs.apparelSizes>).map((size) => (
                <div
                  key={size}
                  style={{
                    backgroundColor: isDark ? '#17171a' : '#f9fafb',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 12,
                    padding: '10px 8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                      letterSpacing: 1,
                    }}
                  >
                    SIZE {size}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={specs.apparelSizes[size]}
                    onChange={(e) => onUpdateApparelSize(size, parseInt(e.target.value, 10) || 0)}
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      borderRadius: 8,
                      color: isDark ? '#ffffff' : '#000000',
                      padding: '8px 4px',
                      fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      outline: 'none',
                    }}
                  />
                </div>
              ))}
            </div>
          </SpecField>
        )}
      </div>
    </motion.div>
  );
}
