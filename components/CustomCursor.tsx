'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState<'default' | 'project' | 'button' | 'image'>('default');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    // Check if it's a touch device
    if (window.matchMedia('(pointer: coarse)').matches) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('[data-cursor="project"]')) {
        setCursorState('project');
      } else if (target.closest('a') || target.closest('button') || target.closest('[data-cursor="button"]')) {
        setCursorState('button');
      } else if (target.tagName.toLowerCase() === 'img' || target.closest('[data-cursor="image"]')) {
        setCursorState('image');
      } else {
        setCursorState('default');
      }
    };

    // Hide default cursor on body when custom cursor is active
    document.body.style.cursor = 'none';

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  const variants = {
    default: {
      width: 16,
      height: 16,
      backgroundColor: 'rgba(198, 255, 51, 1)',
      mixBlendMode: 'normal' as any,
    },
    button: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      mixBlendMode: 'difference' as any,
    },
    project: {
      width: 80,
      height: 80,
      backgroundColor: 'rgba(198, 255, 51, 1)',
      mixBlendMode: 'normal' as any,
    },
    image: {
      width: 60,
      height: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(4px)',
      mixBlendMode: 'normal' as any,
    }
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 9999,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-jakarta)',
        fontWeight: 700,
        fontSize: 14,
        color: '#0D0D0D',
        letterSpacing: 0,
      }}
      variants={variants}
      animate={cursorState}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: cursorState === 'project' ? 1 : 0 }}
        style={{ position: 'absolute' }}
      >
        View
      </motion.span>
    </motion.div>
  );
}
