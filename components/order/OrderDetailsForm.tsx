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
  theme?: 'dark' | 'light';
  onUpdateSpec: <K extends keyof OrderSpecs>(key: K, value: OrderSpecs[K]) => void;
  onUpdateContact: <K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) => void;
  onUploadReference: (url: string) => void;
}

export default function OrderDetailsForm({
  specs,
  contact,
  isMobile,
  theme = 'dark',
  onUpdateSpec,
  onUpdateContact,
  onUploadReference,
}: OrderDetailsFormProps) {
  const isDark = theme === 'dark';

  return (
    <>
      {/* TIMELINE & DESCRIPTION */}
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
            Timeline & Instructions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                display: 'block',
                marginBottom: 8,
              }}
            >
              Target Deadline (Optional)
            </label>
            <input
              type="date"
              value={specs.deadline}
              onChange={(e) => onUpdateSpec('deadline', e.target.value)}
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: isDark ? '#17171a' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                borderRadius: 12,
                color: isDark ? '#ffffff' : '#000000',
                fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
                colorScheme: isDark ? 'dark' : 'light',
              }}
            />
          </div>

          <div>
            <label
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                display: 'block',
                marginBottom: 8,
              }}
            >
              Project Details & Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={specs.description}
              onChange={(e) => onUpdateSpec('description', e.target.value)}
              placeholder="Tell us what this is for, colors, dimensions, or specific design instructions..."
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: isDark ? '#17171a' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                borderRadius: 12,
                color: isDark ? '#ffffff' : '#000000',
                fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                fontSize: 14,
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                lineHeight: 1.5,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* CONTACT & REFERENCE FILES */}
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
          marginBottom: 100,
          transition: 'background-color 0.2s, border-color 0.2s',
        }}
      >
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
            Contact Information
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <FormInput
              label="First Name"
              value={contact.firstName}
              placeholder="e.g. Silk"
              onChange={(v) => onUpdateContact('firstName', v)}
              theme={theme}
              flex
            />
            <FormInput
              label="Last Name"
              value={contact.lastName}
              placeholder="e.g. Studio"
              onChange={(v) => onUpdateContact('lastName', v)}
              theme={theme}
              flex
            />
          </div>

          <FormInput
            label="WhatsApp Number (With Country Code)"
            value={contact.whatsapp}
            placeholder="+2348000000000"
            onChange={(v) => onUpdateContact('whatsapp', v)}
            type="tel"
            theme={theme}
          />

          <FormInput
            label="Email Address (Optional)"
            value={contact.email}
            placeholder="you@company.com"
            onChange={(e) => onUpdateContact('email', e)}
            type="email"
            theme={theme}
          />

          <div>
            <label
              style={{
                fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                display: 'block',
                marginBottom: 8,
              }}
            >
              How did you hear about us?
            </label>
            <select
              value={contact.source}
              onChange={(e) => onUpdateContact('source', e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: isDark ? '#17171a' : '#ffffff',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                borderRadius: 12,
                color: isDark ? '#ffffff' : '#000000',
                fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                fontSize: 14,
                outline: 'none',
              }}
            >
              <option value="">Select an option...</option>
              {['Instagram', 'TikTok', 'WhatsApp', 'Referral', 'Google', 'Other'].map((s) => (
                <option
                  key={s}
                  value={s}
                  style={{
                    backgroundColor: isDark ? '#17171a' : '#ffffff',
                    color: isDark ? '#ffffff' : '#000000',
                  }}
                >
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* REFERENCE UPLOAD - Clean without unnecessary verbose text */}
          <div
            style={{
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              paddingTop: 20,
              marginTop: 6,
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <p
                style={{
                  fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                  margin: 0,
                }}
              >
                Artwork & Reference Files (Optional)
              </p>
            </div>
            <ReferenceUpload onUpload={onUploadReference} />
          </div>
        </div>
      </motion.div>
    </>
  );
}
