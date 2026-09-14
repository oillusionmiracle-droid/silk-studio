'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ThemeProps {
  theme?: 'dark' | 'light';
}

export function SpecField({
  label,
  children,
  flex,
  badge,
  theme = 'dark',
}: {
  label: string;
  children: React.ReactNode;
  flex?: boolean;
  badge?: string;
  theme?: 'dark' | 'light';
}) {
  const isDark = theme === 'dark';
  return (
    <div style={{ flex: flex ? '1 1 200px' : '1 1 100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <p
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            margin: 0,
          }}
        >
          {label}
        </p>
        {badge && (
          <span
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: isDark ? '#ffffff' : '#000000',
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
              padding: '2px 8px',
              borderRadius: 6,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{children}</div>
    </div>
  );
}

export function Pill({
  label,
  isActive,
  onClick,
  subtitle,
  theme = 'dark',
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  subtitle?: string;
  theme?: 'dark' | 'light';
}) {
  const isDark = theme === 'dark';

  let bg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  let border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
  let color = isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)';

  if (isActive) {
    bg = isDark ? '#ffffff' : '#000000';
    border = isDark ? '#ffffff' : '#000000';
    color = isDark ? '#000000' : '#ffffff';
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        padding: subtitle ? '8px 16px' : '10px 18px',
        borderRadius: 100,
        border: `1.5px solid ${border}`,
        backgroundColor: bg,
        color: color,
        fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
        fontSize: 13,
        fontWeight: isActive ? 700 : 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
      }}
    >
      <span>{label}</span>
      {subtitle && (
        <span
          style={{
            fontSize: 10,
            opacity: 0.75,
            marginTop: 2,
          }}
        >
          {subtitle}
        </span>
      )}
    </motion.button>
  );
}

export function QtyInput({
  value,
  min,
  step,
  onChange,
  quickVals,
  theme = 'dark',
}: {
  value: number;
  min: number;
  step: number;
  onChange: (v: number) => void;
  quickVals?: number[];
  theme?: 'dark' | 'light';
}) {
  const isDark = theme === 'dark';

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          width: 'fit-content',
          backgroundColor: isDark ? '#17171a' : '#ffffff',
          borderRadius: 12,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
          overflow: 'hidden',
          marginBottom: quickVals ? 10 : 0,
          boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          style={{
            width: 44,
            height: 44,
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: isDark ? '#ffffff' : '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          −
        </button>
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(min, parseInt(e.target.value, 10) || min))}
          style={{
            width: 90,
            textAlign: 'center',
            padding: '10px 8px',
            border: 'none',
            borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            backgroundColor: 'transparent',
            color: isDark ? '#ffffff' : '#000000',
            fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={() => onChange(value + step)}
          style={{
            width: 44,
            height: 44,
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: isDark ? '#ffffff' : '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          +
        </button>
      </div>

      {quickVals && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {quickVals.map((q) => {
            const isSelected = value === q;
            return (
              <button
                key={q}
                type="button"
                onClick={() => onChange(q)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 100,
                  border: `1px solid ${
                    isSelected
                      ? isDark
                        ? '#ffffff'
                        : '#000000'
                      : isDark
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.1)'
                  }`,
                  backgroundColor: isSelected
                    ? isDark
                      ? '#ffffff'
                      : '#000000'
                    : isDark
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(0,0,0,0.03)',
                  color: isSelected
                    ? isDark
                      ? '#000000'
                      : '#ffffff'
                    : isDark
                    ? 'rgba(255,255,255,0.7)'
                    : 'rgba(0,0,0,0.7)',
                  fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {q.toLocaleString()}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  flex,
  theme = 'dark',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  flex?: boolean;
  theme?: 'dark' | 'light';
}) {
  const isDark = theme === 'dark';

  return (
    <div style={{ flex: flex ? '1 1 200px' : '1 1 100%' }}>
      <label
        style={{
          fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 1,
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
          display: 'block',
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
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
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = isDark ? '#ffffff' : '#000000';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
        }}
      />
    </div>
  );
}
