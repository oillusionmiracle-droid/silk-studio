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
  onUpdateSpec: <K extends keyof OrderSpecs>(key: K, value: OrderSpecs[K]) => void;
  onUpdateApparelSize: (size: string, value: number) => void;
}

export default function ProductConfiguration({
  subService,
  specs,
  isMobile,
  totalApparelQty,
  onUpdateSpec,
  onUpdateApparelSize,
}: ProductConfigurationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
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
            02
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
          Specs
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* FLYERS & HANDBILLS */}
        {subService === 'Flyers & Handbills' && (
          <>
            <SpecField label="Size">
              {['A5', 'A4', 'A3'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  isActive={specs.size === opt}
                  onClick={() => onUpdateSpec('size', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Sides">
              {['Single-sided', 'Double-sided'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  isActive={specs.sides === opt}
                  onClick={() => onUpdateSpec('sides', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Lamination">
              {['None', 'Matte', 'Gloss'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  isActive={specs.lamination === opt}
                  onClick={() => onUpdateSpec('lamination', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Quantity">
              <QtyInput
                value={specs.quantity}
                min={100}
                step={100}
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
              <SpecField label="Width (ft)" flex>
                <QtyInput
                  value={specs.width}
                  min={1}
                  step={0.5}
                  onChange={(v) => onUpdateSpec('width', v)}
                />
              </SpecField>
              <SpecField label="Height (ft)" flex>
                <QtyInput
                  value={specs.height}
                  min={1}
                  step={0.5}
                  onChange={(v) => onUpdateSpec('height', v)}
                />
              </SpecField>
            </div>
            <div
              style={{
                backgroundColor: '#f5f5f5',
                padding: '12px 16px',
                borderRadius: 10,
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-jakarta)',
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#0D0D0D',
                }}
              >
                {specs.width} × {specs.height} = {(specs.width * specs.height).toFixed(1)} sq ft
              </span>
            </div>
            <SpecField label="Eyelets">
              {['Yes', 'No'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  isActive={specs.eyelets === opt}
                  onClick={() => onUpdateSpec('eyelets', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Quantity">
              <QtyInput
                value={specs.quantity}
                min={1}
                step={1}
                onChange={(v) => onUpdateSpec('quantity', v)}
              />
            </SpecField>
          </>
        )}

        {/* JOTTERS & NOTEPADS */}
        {subService === 'Jotters & Notepads' && (
          <>
            <SpecField label="Inner Sheets">
              {['Plain', 'Ruled'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  isActive={specs.innerSheets === opt}
                  onClick={() => onUpdateSpec('innerSheets', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Lamination">
              {['None', 'Matte', 'Gloss'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  isActive={specs.lamination === opt}
                  onClick={() => onUpdateSpec('lamination', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Binding">
              {['Spiral', 'Perfect Binding'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  isActive={specs.binding === opt}
                  onClick={() => onUpdateSpec('binding', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Cover">
              {['Soft Cover', 'Hard Cover'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  isActive={specs.cover === opt}
                  onClick={() => onUpdateSpec('cover', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Quantity">
              <QtyInput
                value={specs.quantity}
                min={50}
                step={50}
                onChange={(v) => onUpdateSpec('quantity', v)}
                quickVals={[50, 100, 200, 500]}
              />
            </SpecField>
          </>
        )}

        {/* ID CARDS */}
        {subService === 'ID Cards' && (
          <>
            <SpecField label="Card Type">
              {[
                { label: 'Standard', hint: '₦4,500 / card' },
                { label: 'Lanyard + Holder', hint: '₦8,000 / card' },
                { label: 'Badge Reel + Holder', hint: '₦10,000 / card' },
              ].map((opt) => (
                <Pill
                  key={opt.label}
                  label={`${opt.label} (${opt.hint})`}
                  isActive={specs.idType === opt.label}
                  onClick={() => onUpdateSpec('idType', opt.label)}
                />
              ))}
            </SpecField>
            <SpecField label="Quantity">
              <QtyInput
                value={specs.quantity}
                min={1}
                step={1}
                onChange={(v) => onUpdateSpec('quantity', v)}
              />
            </SpecField>
          </>
        )}

        {/* BUSINESS CARDS */}
        {subService === 'Business Cards' && (
          <>
            <SpecField label="Stock">
              {['Standard 300gsm', 'Super Thick 600gsm'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  isActive={specs.stock === opt}
                  onClick={() => onUpdateSpec('stock', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Lamination">
              {['Matte', 'Gloss'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  isActive={specs.lamination === opt}
                  onClick={() => onUpdateSpec('lamination', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Corners">
              {['Square', 'Rounded'].map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  isActive={specs.corners === opt}
                  onClick={() => onUpdateSpec('corners', opt)}
                />
              ))}
            </SpecField>
            <SpecField label="Quantity">
              <QtyInput
                value={specs.quantity}
                min={100}
                step={100}
                onChange={(v) => onUpdateSpec('quantity', v)}
                quickVals={[100, 250, 500, 1000]}
              />
            </SpecField>
          </>
        )}

        {/* LETTERHEADS */}
        {subService === 'Letterheads' && (
          <>
            <SpecField label="Paper Type">
              {[
                { label: 'Standard', hint: '₦12,000 / 50' },
                { label: 'Brown', hint: '₦18,000 / 50' },
              ].map((opt) => (
                <Pill
                  key={opt.label}
                  label={`${opt.label} (${opt.hint})`}
                  isActive={specs.paperType === opt.label}
                  onClick={() => onUpdateSpec('paperType', opt.label)}
                />
              ))}
            </SpecField>
            <SpecField label="Quantity (min 50)">
              <QtyInput
                value={Math.max(50, specs.quantity)}
                min={50}
                step={50}
                onChange={(v) => onUpdateSpec('quantity', Math.max(50, v))}
                quickVals={[50, 100, 200, 500]}
              />
            </SpecField>
          </>
        )}

        {/* EVENT MERCH SET — custom brief, no priced specs */}
        {subService === 'Event Merch Set' && (
          <div
            style={{
              backgroundColor: 'rgba(198,255,51,0.08)',
              border: '1px solid rgba(198,255,51,0.25)',
              borderRadius: 12,
              padding: '14px 16px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-jakarta)',
                fontWeight: 700,
                fontSize: 14,
                color: '#C6FF33',
                margin: '0 0 6px',
              }}
            >
              Custom brief — no fixed price
            </p>
            <p
              style={{
                fontFamily: 'var(--font-general)',
                fontSize: 13,
                color: 'rgba(255,255,255,0.7)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Tell us items, sizes and quantities in Details below and we&apos;ll send a quote within 2 hours.
            </p>
          </div>
        )}

        {/* APPAREL */}
        {['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers', 'Hoodies'].includes(subService) && (
          <SpecField label="Size Breakdown">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%' }}>
              {(Object.keys(specs.apparelSizes) as Array<keyof typeof specs.apparelSizes>).map((size) => (
                <div
                  key={size}
                  style={{
                    flex: '1 1 60px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      letterSpacing: 2,
                      color: '#666',
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    {size}
                  </p>
                  <input
                    type="number"
                    min="0"
                    value={specs.apparelSizes[size]}
                    onChange={(e) => onUpdateApparelSize(size, parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 8,
                      color: '#ffffff',
                      padding: '8px 4px',
                      fontFamily: 'var(--font-jakarta)',
                      fontWeight: 700,
                      fontSize: 16,
                      outline: 'none',
                    }}
                  />
                </div>
              ))}
            </div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: '#999',
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginTop: 12,
                margin: 0,
              }}
            >
              Total: {totalApparelQty} pieces
            </p>
          </SpecField>
        )}
      </div>
    </motion.div>
  );
}
