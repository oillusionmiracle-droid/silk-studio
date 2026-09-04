'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

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
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const WISHLIST_STORAGE_KEY = 'silk-apparel-wishlist';

function loadLocalWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalWishlist(items: WishlistItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore local storage quota issues
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const prevUserId = useRef<string | null>(null);

  // Initial load from localStorage
  useEffect(() => {
    setItems(loadLocalWishlist());
    setHydrated(true);
  }, []);

  // Sync with Supabase on user sign-in
  useEffect(() => {
    if (!hydrated) return;

    if (user && user.id !== prevUserId.current) {
      prevUserId.current = user.id;
      setIsLoading(true);

      const syncWithSupabase = async () => {
        try {
          const { data: dbRows, error } = await supabase
            .from('wishlists')
            .select('*')
            .eq('user_id', user.id);

          if (error) {
            console.warn('Could not fetch wishlist from Supabase:', error.message);
            setIsLoading(false);
            return;
          }

          const dbItems: WishlistItem[] = (dbRows || []).map((row: any) => ({
            productId: row.product_id,
            productName: row.product_name || '',
            price: Number(row.price) || 0,
            image: row.image || null,
            category: row.category || '',
          }));

          const localItems = loadLocalWishlist();

          // Merge local and remote
          const mergedMap = new Map<string, WishlistItem>();
          for (const item of dbItems) {
            mergedMap.set(item.productId, item);
          }
          for (const item of localItems) {
            if (!mergedMap.has(item.productId)) {
              mergedMap.set(item.productId, item);
              // Save to Supabase for newly signed in user
              void supabase.from('wishlists').insert({
                user_id: user.id,
                product_id: item.productId,
                product_name: item.productName,
                price: item.price,
                image: item.image,
                category: item.category,
              });
            }
          }

          const finalItems = Array.from(mergedMap.values());
          setItems(finalItems);
          saveLocalWishlist(finalItems);
        } catch (err) {
          console.warn('Wishlist sync error:', err);
        } finally {
          setIsLoading(false);
        }
      };

      void syncWithSupabase();
    } else if (!user && prevUserId.current) {
      prevUserId.current = null;
      // User signed out, keep local copy
    }
  }, [user, hydrated]);

  // Persist to local storage
  useEffect(() => {
    if (hydrated) {
      saveLocalWishlist(items);
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: WishlistItem) => {
      setItems((prev) => {
        if (prev.some((i) => i.productId === item.productId)) return prev;
        const updated = [...prev, item];

        if (user) {
          void supabase.from('wishlists').insert({
            user_id: user.id,
            product_id: item.productId,
            product_name: item.productName,
            price: item.price,
            image: item.image,
            category: item.category,
          });
        }
        return updated;
      });
    },
    [user]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const updated = prev.filter((i) => i.productId !== productId);
        if (user) {
          void supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', productId);
        }
        return updated;
      });
    },
    [user]
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return items.some((i) => i.productId === productId);
    },
    [items]
  );

  const toggleItem = useCallback(
    (item: WishlistItem) => {
      setItems((prev) => {
        const exists = prev.some((i) => i.productId === item.productId);
        if (exists) {
          if (user) {
            void supabase
              .from('wishlists')
              .delete()
              .eq('user_id', user.id)
              .eq('product_id', item.productId);
          }
          return prev.filter((i) => i.productId !== item.productId);
        } else {
          if (user) {
            void supabase.from('wishlists').insert({
              user_id: user.id,
              product_id: item.productId,
              product_name: item.productName,
              price: item.price,
              image: item.image,
              category: item.category,
            });
          }
          return [...prev, item];
        }
      });
    },
    [user]
  );

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        toggleItem,
        totalItems,
        isOpen,
        setIsOpen,
        isLoading,
      }}
    >
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
