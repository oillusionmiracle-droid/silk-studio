'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '@/lib/WishlistContext';
import { useCart } from '@/lib/CartContext';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function AccountWishlistPage() {
  const { items, removeItem, totalItems } = useWishlist();
  const { addItem: addToCart, setIsOpen: openCart } = useCart();

  const handleMoveToCart = (item: any) => {
    // Add default variant format to cart
    addToCart({
      variantId: `${item.productId}-M`,
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      size: 'M',
      image: item.image,
    }, 1);
    removeItem(item.productId);
    openCart(true);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium tracking-tight text-neutral-950 dark:text-white">
            Saved Pieces ({totalItems})
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Your curated wishlist, synced across all your devices via Silk Studio ID.
          </p>
        </div>

        <Link
          href="/apparel"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider hover:opacity-90 shadow-xs self-start sm:self-auto"
        >
          <span>Explore Drops</span>
          <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-4 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-white/20 transition-all"
              >
                <div>
                  <div className="aspect-[4/5] rounded-2xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden mb-3.5 relative border border-neutral-200/40 dark:border-white/5">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-neutral-400">
                        <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md flex items-center justify-center text-neutral-400 hover:text-red-600 transition-colors shadow-xs"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5 stroke-[1.75]" />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                      {item.category || 'Apparel'}
                    </span>
                    <h3 className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-white truncate">
                      {item.productName}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-950 dark:text-white mt-1">
                      ₦{Number(item.price).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => handleMoveToCart(item)}
                    className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 stroke-[2]" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-16 text-center">
          <Heart className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3 stroke-[1.5]" />
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Your wishlist is empty
          </p>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Save items from the apparel boutique to easily track restocks and order later.
          </p>
          <div className="mt-5">
            <Link
              href="/apparel"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider hover:opacity-90 shadow-xs"
            >
              Browse Apparel Drops
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
