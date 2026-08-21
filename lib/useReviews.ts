'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Review {
  id: string;
  product_id: string;
  reviewer_name: string;
  rating: number;
  size_purchased: string | null;
  body: string | null;
  created_at: string;
}

export function useReviews(productId: string | null) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setReviews([]);
      return;
    }

    let cancelled = false;

    async function fetchReviews() {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      if (queryError) {
        setError(queryError.message);
        setReviews([]);
      } else {
        setReviews((data as Review[]) || []);
      }
      setLoading(false);
    }

    fetchReviews();
    return () => { cancelled = true; };
  }, [productId]);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return { reviews, loading, error, averageRating };
}
