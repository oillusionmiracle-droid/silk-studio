'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface WishlistItem {
  productId: string;
  productName: string;
  price: number;
  image: string | null;
  category: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
  totalItems: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const WISHLIST_STORAGE_KEY = 'silk-apparel-wishlist';

function loadWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items: WishlistItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(loadWishlist());
    setHydrated(true);
  }, []);

  // Persist to localStorage on change (after hydration)
  useEffect(() => {
    if (hydrated) {
      saveWishlist(items);
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: WishlistItem) => {
    setItems(prev => {
      if (prev.some(i => i.productId === item.productId)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return items.some(i => i.productId === productId);
  }, [items]);

  const toggleItem = useCallback((item: WishlistItem) => {
    setItems(prev => {
      const exists = prev.some(i => i.productId === item.productId);
      if (exists) return prev.filter(i => i.productId !== item.productId);
      return [...prev, item];
    });
  }, []);

  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{
      items,
      addItem,
      removeItem,
      isInWishlist,
      toggleItem,
      totalItems,
      isOpen,
      setIsOpen,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

// Future enhancement: sync wishlist to Supabase user_wishlists table
// for cross-device persistence when user authentication is added.
