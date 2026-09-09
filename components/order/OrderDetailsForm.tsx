'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ContactInfo, OrderSpecs } from '@/lib/order/types';
import ReferenceUpload from '@/components/ReferenceUpload';
import { FormInput } from './OrderInputs';

interface OrderDetailsFormProps {
  specs: OrderSpecs;
  contact: ContactInfo;
  isMobile: boolean;
  onUpdateSpec: <K extends keyof OrderSpecs>(key: K, value: OrderSpecs[K]) => void;
  onUpdateContact: <K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) => void;
  onUploadReference: (url: string) => void;
}

export default function OrderDetailsForm({
  specs,
  contact,
  isMobile,
  onUpdateSpec,
  onUpdateContact,
  onUploadReference,
}: OrderDetailsFormProps) {
  return (
    <>
      {/* STEP 3: DEADLINE & DESCRIPTION */}
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
              03
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
            Details
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: '#888',
                display: 'block',
                marginBottom: 10,
              }}
            >
              Deadline (Optional)
            </label>
            <input
              type="date"
              value={specs.deadline}
              onChange={(e) => onUpdateSpec('deadline', e.target.value)}
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 10,
                color: '#ffffff',
                fontFamily: 'var(--font-general)',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: '#888',
                display: 'block',
                marginBottom: 10,
              }}
            >
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={specs.description}
              onChange={(e) => onUpdateSpec('description', e.target.value)}
              placeholder="Tell us what this is for, colours, anything important."
              style={
                {
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 10,
                  color: '#ffffff',
                  fontFamily: 'var(--font-general)',
                  fontSize: 14,
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                } as React.CSSProperties
              }
            />
          </div>
        </div>
      </motion.div>

      {/* STEP 4: FILES & CONTACT */}
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
              04
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
            Your Info
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <FormInput
              label="First Name"
              value={contact.firstName}
              onChange={(v) => onUpdateContact('firstName', v)}
              flex
            />
            <FormInput
              label="Last Name"
              value={contact.lastName}
              onChange={(v) => onUpdateContact('lastName', v)}
              flex
            />
          </div>
          <FormInput
            label="WhatsApp Number"
            value={contact.whatsapp}
            onChange={(v) => onUpdateContact('whatsapp', v)}
            type="tel"
          />
          <FormInput
            label="Email (Optional)"
            value={contact.email}
            onChange={(v) => onUpdateContact('email', v)}
            type="email"
          />
          <div>
            <label
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: '#888',
                display: 'block',
                marginBottom: 10,
              }}
            >
              How did you hear about us?
            </label>
            <select
              value={contact.source}
              onChange={(e) => onUpdateContact('source', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: '#f5f5f5',
                border: '2px solid #e0e0e0',
                borderRadius: 10,
                color: contact.source ? '#ffffff' : '#999',
                fontFamily: 'var(--font-general)',
                fontSize: 14,
                outline: 'none',
              }}
            >
              <option value="">Select...</option>
              {['Instagram', 'TikTok', 'WhatsApp', 'Referral', 'Google', 'Other'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 16, marginTop: 16 }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: '#888',
                display: 'block',
                marginBottom: 10,
              }}
            >
              Reference Files (Optional)
            </p>
            <ReferenceUpload onUpload={onUploadReference} />
          </div>
        </div>
      </motion.div>
    </>
  );
}
