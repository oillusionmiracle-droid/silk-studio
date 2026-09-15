'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  theme?: 'dark' | 'light';
  isDark?: boolean;
}

export default function LiquidGlassButton({
  children,
  onClick,
  className = '',
  style = {},
  theme = 'dark',
  isDark = true,
}: LiquidGlassButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [filterId] = useState(() => `liquid-filter-${Math.random().toString(36).substr(2, 9)}`);

  // Mouse position normalized (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Exact pixel mouse coordinates for light highlight
  const [pos, setPos] = useState({ x: 50, y: 50 });

  // Spring physics for buttery smooth tilt and fluid response
  const springConfig = { damping: 20, stiffness: 260, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const scale = useSpring(isHovered ? 1.025 : 1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    mouseX.set(x - 0.5);
    mouseY.set(y - 0.5);
    setPos({ x: Math.round(x * 100), y: Math.round(y * 100) });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    setPos({ x: 50, y: 50 });
  };

  return (
    <>
      {/* SVG Liquid Distortion Filter Definition */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={isHovered ? '0.04 0.06' : '0.02 0.03'}
              numOctaves="3"
              result="noise"
              seed="5"
            >
              <animate
                attributeName="baseFrequency"
                dur="6s"
                values="0.03 0.04; 0.06 0.08; 0.03 0.04"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={isHovered ? '7' : '3'}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" opacity="0.92" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <motion.button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.96 }}
        style={{
          perspective: 800,
          rotateX,
          rotateY,
          scale,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '16px 24px',
          borderRadius: 100,
          cursor: 'pointer',
          outline: 'none',
          border: isDark
            ? '1px solid rgba(255, 255, 255, 0.45)'
            : '1px solid rgba(0, 0, 0, 0.25)',
          background: isDark
            ? `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.14) 45%, rgba(255,255,255,0.06) 100%)`
            : `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.95) 0%, rgba(240,240,245,0.85) 55%, rgba(225,225,235,0.7) 100%)`,
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          color: isDark ? '#ffffff' : '#000000',
          boxShadow: isDark
            ? `0 20px 45px rgba(0,0,0,0.65), 0 4px 15px rgba(0,0,0,0.4), inset 0 1.5px 3px rgba(255,255,255,0.7), inset 0 -1.5px 3px rgba(0,0,0,0.3)`
            : `0 16px 36px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08), inset 0 1.5px 3px rgba(255,255,255,0.9), inset 0 -1.5px 3px rgba(0,0,0,0.08)`,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          overflow: 'hidden',
          transformStyle: 'preserve-3d',
          ...style,
        }}
        className={className}
      >
        {/* Dynamic Liquid Specular Light Sheen Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 100,
            background: `radial-gradient(circle 90px at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.55), transparent 75%)`,
            pointerEvents: 'none',
            mixBlendMode: isDark ? 'screen' : 'overlay',
            opacity: isHovered ? 0.9 : 0.45,
            transition: 'opacity 0.25s ease',
          }}
        />

        {/* Dynamic Edge Prism / Dispersion Glow */}
        <div
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: 100,
            background: isDark
              ? `linear-gradient(${pos.x * 3.6}deg, rgba(163,230,53,0.35) 0%, rgba(255,255,255,0.2) 30%, rgba(56,189,248,0.25) 70%, rgba(236,72,153,0.25) 100%)`
              : `linear-gradient(${pos.x * 3.6}deg, rgba(163,230,53,0.2) 0%, rgba(255,255,255,0.4) 40%, rgba(56,189,248,0.2) 100%)`,
            opacity: isHovered ? 0.65 : 0.25,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            filter: `url(#${filterId})`,
          }}
        />

        {/* Content Container */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {children}
        </div>
      </motion.button>
    </>
  );
}
