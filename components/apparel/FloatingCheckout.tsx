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
        aria-label={`Checkout${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
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
            USER GREEN CHECKOUT BAG ICON (No surrounding box / border)
            ═════════════════════════════════════════════════════════
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/checkout-bag.png"
            alt="Checkout"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-[0_8px_20px_rgba(22,163,74,0.35)] transition-transform duration-200"
            draggable={false}
          />

          {/* Cart item count indicator pill if items are added */}
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-bold flex items-center justify-center shadow-lg font-mono ring-2 ring-white"
            >
              {totalItems}
            </motion.span>
          )}
        </motion.div>
      </Link>
    </aside>
  );
}
