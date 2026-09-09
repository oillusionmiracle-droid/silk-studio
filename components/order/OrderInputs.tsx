'use client';

import React from 'react';

export function SpecField({
  label,
  children,
  flex,
}: {
  label: string;
  children: React.ReactNode;
  flex?: boolean;
}) {
  return (
    <div style={{ flex: flex ? '1' : 'auto' }}>
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: '#888',
          marginBottom: 10,
          margin: 0,
        }}
      >
        {label}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
        {children}
      </div>
    </div>
  );
}

export function Pill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '10px 16px',
        borderRadius: 100,
        border: `1px solid ${isActive ? '#C6FF33' : 'rgba(255,255,255,0.15)'}`,
        backgroundColor: isActive ? 'rgba(198,255,51,0.12)' : 'rgba(255,255,255,0.05)',
        color: isActive ? '#C6FF33' : 'rgba(255,255,255,0.7)',
        fontFamily: 'var(--font-general)',
        fontSize: 13,
        fontWeight: isActive ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {label}
    </button>
  );
}

export function QtyInput({
  value,
  min,
  step,
  onChange,
  quickVals,
}: {
  value: number;
  min: number;
  step: number;
  onChange: (v: number) => void;
  quickVals?: number[];
}) {
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          width: 'fit-content',
          marginBottom: quickVals ? 12 : 0,
        }}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          style={{
            width: 38,
            height: 38,
            borderRadius: '8px 0 0 8px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRight: 'none',
            backgroundColor: 'rgba(255,255,255,0.05)',
            cursor: 'pointer',
            fontFamily: 'var(--font-jakarta)',
            fontSize: 18,
            color: '#fff',
          }}
        >
          −
        </button>
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(min, parseInt(e.target.value) || min))}
          style={{
            width: 80,
            textAlign: 'center',
            padding: '8px 6px',
            border: '1px solid rgba(255,255,255,0.15)',
            borderLeft: 'none',
            borderRight: 'none',
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: '#ffffff',
            fontFamily: 'var(--font-jakarta)',
            fontWeight: 700,
            fontSize: 15,
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={() => onChange(value + step)}
          style={{
            width: 38,
            height: 38,
            borderRadius: '0 8px 8px 0',
            border: '1px solid rgba(255,255,255,0.15)',
            borderLeft: 'none',
            backgroundColor: 'rgba(255,255,255,0.05)',
            cursor: 'pointer',
            fontFamily: 'var(--font-jakarta)',
            fontSize: 18,
            color: '#fff',
          }}
        >
          +
        </button>
      </div>
      {quickVals && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {quickVals.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onChange(q)}
              style={{
                padding: '6px 12px',
                borderRadius: 100,
                border: `1px solid ${value === q ? '#C6FF33' : 'rgba(255,255,255,0.15)'}`,
                backgroundColor: value === q ? 'rgba(198,255,51,0.12)' : 'rgba(255,255,255,0.05)',
                color: value === q ? '#C6FF33' : 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-general)',
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {q.toLocaleString()}
            </button>
          ))}
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
  flex,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  flex?: boolean;
}) {
  return (
    <div style={{ flex: flex ? '1 1 160px' : '1 1 100%' }}>
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
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          } as React.CSSProperties
        }
        onFocus={(e) => {
          (e.currentTarget as HTMLInputElement).style.borderColor = '#C6FF33';
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.15)';
        }}
      />
    </div>
  );
}
