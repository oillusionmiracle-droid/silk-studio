'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { portfolioData, PortfolioItem } from '@/app/data/portfolio';

const CATEGORIES = new Set<PortfolioItem['category']>(['Print', 'Branding', 'Apparel', 'Web', 'Events']);

function mapPortfolioRow(row: Record<string, unknown>): PortfolioItem | null {
  const category = String(row.category || '');
  const imageUrls = Array.isArray(row.image_urls)
    ? row.image_urls.filter((value): value is string => typeof value === 'string' && value.length > 0)
    : [];

  if (!row.id || !row.project_name || !CATEGORIES.has(category as PortfolioItem['category']) || imageUrls.length === 0) {
    return null;
  }

  return {
    id: String(row.id),
    src: imageUrls[0],
    title: String(row.project_name),
    category: category as PortfolioItem['category'],
    clientType: '',
    description: String(row.description || ''),
    images: imageUrls,
  };
}

export function usePortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>(portfolioData);

  useEffect(() => {
    let cancelled = false;

    async function loadPortfolio() {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('id, project_name, category, description, image_urls, display_order, published, created_at')
        .eq('published', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (cancelled || error || !data || data.length === 0) return;

      const mappedItems = data
        .map((row) => mapPortfolioRow(row as Record<string, unknown>))
        .filter((item): item is PortfolioItem => item !== null);

      if (!cancelled && mappedItems.length > 0) setItems(mappedItems);
    }

    void loadPortfolio();
    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}
