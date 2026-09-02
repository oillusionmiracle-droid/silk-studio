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

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Stadium T-Shirt Cream',
    category: 'tee',
    price: 20000,
    image_1_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    image_2_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
    description: 'Heavyweight 260gsm combed cotton boxy tee in vintage cream with signature studio chest print.',
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v-1', product_id: 'prod-1', sku: 'STAD-CRM-S', size: 'S', color: 'Cream', stock: 25 },
      { id: 'v-2', product_id: 'prod-1', sku: 'STAD-CRM-M', size: 'M', color: 'Cream', stock: 25 },
      { id: 'v-3', product_id: 'prod-1', sku: 'STAD-CRM-L', size: 'L', color: 'Cream', stock: 25 },
      { id: 'v-4', product_id: 'prod-1', sku: 'STAD-CRM-XL', size: 'XL', color: 'Cream', stock: 25 },
      { id: 'v-5', product_id: 'prod-1', sku: 'STAD-CRM-XXL', size: 'XXL', color: 'Cream', stock: 25 },
    ],
  },
  {
    id: 'prod-2',
    name: 'Mask Graphic T-Shirt Black',
    category: 'tee',
    price: 20000,
    image_1_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
    image_2_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    description: 'Oversized luxury streetwear silhouette in vintage washed black with high-density screenprint.',
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v-6', product_id: 'prod-2', sku: 'MASK-BLK-S', size: 'S', color: 'Black', stock: 20 },
      { id: 'v-7', product_id: 'prod-2', sku: 'MASK-BLK-M', size: 'M', color: 'Black', stock: 20 },
      { id: 'v-8', product_id: 'prod-2', sku: 'MASK-BLK-L', size: 'L', color: 'Black', stock: 20 },
      { id: 'v-9', product_id: 'prod-2', sku: 'MASK-BLK-XL', size: 'XL', color: 'Black', stock: 20 },
    ],
  },
  {
    id: 'prod-3',
    name: 'Celebration Bowling Shirt',
    category: 'shirt',
    price: 47000,
    image_1_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
    image_2_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
    description: 'Silky woven resort-fit button down with all-over studio artwork and custom horn buttons.',
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v-10', product_id: 'prod-3', sku: 'BOWL-S', size: 'S', color: 'Multi', stock: 15 },
      { id: 'v-11', product_id: 'prod-3', sku: 'BOWL-M', size: 'M', color: 'Multi', stock: 15 },
      { id: 'v-12', product_id: 'prod-3', sku: 'BOWL-L', size: 'L', color: 'Multi', stock: 15 },
      { id: 'v-13', product_id: 'prod-3', sku: 'BOWL-XL', size: 'XL', color: 'Multi', stock: 15 },
    ],
  },
  {
    id: 'prod-4',
    name: 'Titan Heavyweight Fleece Hoodie',
    category: 'hoodie',
    price: 65000,
    image_1_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
    image_2_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800',
    description: '450gsm dense loopback cotton fleece hoodie with double-layer crossover hood and drop shoulders.',
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v-14', product_id: 'prod-4', sku: 'HOOD-BLK-S', size: 'S', color: 'Black', stock: 20 },
      { id: 'v-15', product_id: 'prod-4', sku: 'HOOD-BLK-M', size: 'M', color: 'Black', stock: 20 },
      { id: 'v-16', product_id: 'prod-4', sku: 'HOOD-BLK-L', size: 'L', color: 'Black', stock: 20 },
      { id: 'v-17', product_id: 'prod-4', sku: 'HOOD-BLK-XL', size: 'XL', color: 'Black', stock: 20 },
    ],
  },
  {
    id: 'prod-5',
    name: 'Face Cap (Brand Logo)',
    category: 'cap',
    price: 14500,
    image_1_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
    image_2_url: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800',
    description: 'Unstructured low-profile 5-panel cap with direct 3D embroidery and antique brass rear closure.',
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v-18', product_id: 'prod-5', sku: 'CAP-STD', size: 'Standard', color: 'Black', stock: 50 },
    ],
  },
  {
    id: 'prod-6',
    name: 'Silk Monogram Boxy Tee',
    category: 'tee',
    price: 22000,
    image_1_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
    image_2_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    description: 'Relaxed streetwear drop tee with tonal Silk Studio monogram embroidery at the nape.',
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v-19', product_id: 'prod-6', sku: 'MONO-S', size: 'S', color: 'Vintage White', stock: 20 },
      { id: 'v-20', product_id: 'prod-6', sku: 'MONO-M', size: 'M', color: 'Vintage White', stock: 20 },
      { id: 'v-21', product_id: 'prod-6', sku: 'MONO-L', size: 'L', color: 'Vintage White', stock: 20 },
      { id: 'v-22', product_id: 'prod-6', sku: 'MONO-XL', size: 'XL', color: 'Vintage White', stock: 20 },
    ],
  },
  {
    id: 'prod-7',
    name: 'Roots Archive Zip Hoodie Cream',
    category: 'hoodie',
    price: 68000,
    image_1_url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800',
    image_2_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
    description: 'Full-zip luxury fleece jacket with double-ended custom zipper and embroidered studio crest.',
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v-23', product_id: 'prod-7', sku: 'ZIP-CRM-S', size: 'S', color: 'Cream', stock: 15 },
      { id: 'v-24', product_id: 'prod-7', sku: 'ZIP-CRM-M', size: 'M', color: 'Cream', stock: 15 },
      { id: 'v-25', product_id: 'prod-7', sku: 'ZIP-CRM-L', size: 'L', color: 'Cream', stock: 15 },
      { id: 'v-26', product_id: 'prod-7', sku: 'ZIP-CRM-XL', size: 'XL', color: 'Cream', stock: 15 },
    ],
  },
  {
    id: 'prod-8',
    name: 'Silk Studio Trucker Cap Black/White',
    category: 'cap',
    price: 15500,
    image_1_url: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800',
    image_2_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
    description: 'Two-tone foam mesh trucker cap with puff printed front panel and snapback closure.',
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v-27', product_id: 'prod-8', sku: 'TRUCK-STD', size: 'Standard', color: 'Black/White', stock: 30 },
    ],
  },
  {
    id: 'prod-9',
    name: 'Lagos Minimalist Oversized Tee',
    category: 'tee',
    price: 20000,
    image_1_url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800',
    image_2_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
    description: 'Clean silhouette 260gsm jersey tee with subtle rubberized studio logo at chest.',
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v-28', product_id: 'prod-9', sku: 'MINI-S', size: 'S', color: 'Charcoal', stock: 20 },
      { id: 'v-29', product_id: 'prod-9', sku: 'MINI-M', size: 'M', color: 'Charcoal', stock: 20 },
      { id: 'v-30', product_id: 'prod-9', sku: 'MINI-L', size: 'L', color: 'Charcoal', stock: 20 },
      { id: 'v-31', product_id: 'prod-9', sku: 'MINI-XL', size: 'XL', color: 'Charcoal', stock: 20 },
    ],
  },
  {
    id: 'prod-10',
    name: 'Studio Resort Silk-Blend Shirt',
    category: 'shirt',
    price: 49000,
    image_1_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
    image_2_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
    description: 'Camp collar breathable silk-cotton blend shirt featuring engineered gradient artwork.',
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v-32', product_id: 'prod-10', sku: 'RESORT-S', size: 'S', color: 'Cream/Black', stock: 15 },
      { id: 'v-33', product_id: 'prod-10', sku: 'RESORT-M', size: 'M', color: 'Cream/Black', stock: 15 },
      { id: 'v-34', product_id: 'prod-10', sku: 'RESORT-L', size: 'L', color: 'Cream/Black', stock: 15 },
      { id: 'v-35', product_id: 'prod-10', sku: 'RESORT-XL', size: 'XL', color: 'Cream/Black', stock: 15 },
    ],
  },
];

export function useProducts(category?: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('products')
          .select('*, variants(*)');

        if (category) {
          query = query.eq('category', category);
        }

        query = query.order('created_at', { ascending: false });

        const { data, error: queryError } = await query;

        if (cancelled) return;

        if (queryError || !data || data.length === 0) {
          // If query fails or no data yet, use the catalog fallback
          const filtered = category
            ? FALLBACK_PRODUCTS.filter((p) => p.category === category)
            : FALLBACK_PRODUCTS;
          setProducts(filtered);
        } else {
          setProducts(data as Product[]);
        }
      } catch {
        const filtered = category
          ? FALLBACK_PRODUCTS.filter((p) => p.category === category)
          : FALLBACK_PRODUCTS;
        setProducts(filtered);
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
