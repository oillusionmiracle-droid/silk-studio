'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/CartContext';

export default function FloatingCheckout() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  // Do not show on the checkout page itself
  if (pathname === '/apparel/checkout') {
    return null;
  }

  return (
    <aside
      aria-label="Floating Checkout"
      className="fixed right-5 bottom-7 sm:right-8 sm:bottom-9 z-40 pointer-events-auto"
    >
      <Link
        href="/apparel/checkout"
        aria-label={`Checkout${totalItems > 0 ? ` with ${totalItems} items` : ''}`}
        className="group relative block focus:outline-none select-none"
      >
        <motion.div
          whileHover={{ scale: 1.15, rotate: -4 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
          className="relative flex items-center justify-center cursor-pointer"
        >
          {/* 
            ═════════════════════════════════════════════════════════
            USER SVG ICON SLOT (No surrounding box, completely naked)
            ═════════════════════════════════════════════════════════
            You can drop or replace your SVG directly below:
          */}
          <svg
            id="apparel-floating-checkout-icon"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-11 h-11 sm:w-12 sm:h-12 text-black transition-colors duration-200 drop-shadow-[0_6px_16px_rgba(0,0,0,0.22)] group-hover:text-[#111111]"
          >
            {/* Bag Body */}
            <path
              d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
              fill="#111111"
              stroke="#111111"
            />
            {/* Top divider */}
            <line x1="3" y1="6" x2="21" y2="6" stroke="#ffffff" strokeWidth="1.5" />
            {/* Bag Handle */}
            <path
              d="M16 10a4 4 0 0 1-8 0"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Subtle Checkout Arrow Accent inside handle */}
            <path
              d="M12 11v3m0 0l-1.5-1.5M12 14l1.5-1.5"
              stroke="#C6FF33"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Cart item count indicator pill if items are added */}
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-[#111111] text-white text-[11px] font-bold flex items-center justify-center shadow-lg font-mono ring-2 ring-white"
            >
              {totalItems}
            </motion.span>
          )}
        </motion.div>
      </Link>
    </aside>
  );
}
