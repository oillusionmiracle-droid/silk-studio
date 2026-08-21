'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Variant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string | null;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_1_url: string | null;
  image_2_url: string | null;
  description: string | null;
  created_at: string;
  variants: Variant[];
}

export function useProducts(category?: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select('*, variants(*)');

      if (category) {
        query = query.eq('category', category);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error: queryError } = await query;

      if (cancelled) return;

      if (queryError) {
        setError(queryError.message);
        setProducts([]);
      } else {
        setProducts((data as Product[]) || []);
      }
      setLoading(false);
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [category]);

  return { products, loading, error };
}

/** Get category stats: count of products and minimum price */
export function useCategoryStats() {
  const [stats, setStats] = useState<Record<string, { count: number; minPrice: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      const { data, error } = await supabase
        .from('products')
        .select('category, price');

      if (cancelled) return;

      if (!error && data) {
        const result: Record<string, { count: number; minPrice: number }> = {};
        for (const row of data) {
          if (!result[row.category]) {
            result[row.category] = { count: 0, minPrice: Infinity };
          }
          result[row.category].count++;
          result[row.category].minPrice = Math.min(result[row.category].minPrice, row.price);
        }
        setStats(result);
      }
      setLoading(false);
    }

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  return { stats, loading };
}
