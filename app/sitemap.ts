import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

/**
 * Base URL for all sitemap entries.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://silkstudios.com.ng).
 */
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://silkstudios.com.ng';

/**
 * Apparel-storefront categories. Kept in sync with APPAREL_CATEGORIES in
 * lib/useProducts.ts (duplicated here to avoid importing a 'use client'
 * module into this server-only route).
 */
const APPAREL_CATEGORIES = ['tee', 'shirt', 'hoodie', 'cap'];

/**
 * Product detail URL builder.
 *
 * Currently NULL on purpose: apparel product detail is a client-side
 * full-screen modal on /apparel — there is NO crawlable detail route in
 * app/ (no app/apparel/products/[id] or [slug]). Emitting product URLs
 * without a matching route would put 404s in the sitemap, which hurts SEO.
 *
 * When a real detail route ships, set this to the actual pattern, e.g.
 *   (id: string) => `/apparel/products/${id}`,
 * and product entries will automatically be included below.
 */
const PRODUCT_DETAIL_PATH: ((id: string) => string) | null = null;

type ProductRow = {
  id: string;
  updated_at: string | null;
  created_at: string | null;
};

/**
 * Fetches published apparel products from Supabase for dynamic sitemap entries.
 * NEVER throws — on any failure it logs and returns [] so the static pages
 * are always included regardless.
 */
async function getProductEntries(): Promise<MetadataRoute.Sitemap> {
  // No crawlable detail route exists yet — skip the fetch entirely.
  if (!PRODUCT_DETAIL_PATH) return [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, updated_at, created_at')
      .eq('is_active', true)
      .in('category', APPAREL_CATEGORIES)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('[sitemap] Supabase product fetch failed:', error.message);
      return [];
    }

    if (!data || data.length === 0) return [];

    const buildPath = PRODUCT_DETAIL_PATH;

    return (data as ProductRow[]).map((product) => ({
      url: `${baseUrl}${buildPath(product.id)}`,
      lastModified: new Date(product.updated_at ?? product.created_at ?? new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error('[sitemap] Unexpected error fetching products:', err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    // Homepage
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },

    // High-traffic pages
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/apparel`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },

    // Key conversion page (not in the priority table — treated as high value)
    { url: `${baseUrl}/order`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },

    // Static content pages
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Functional checkout page (low SEO value, included for completeness)
    { url: `${baseUrl}/apparel/checkout`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },

    // Legal pages
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/apparel/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/apparel/exchange-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/apparel/return-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // NOTE: /admin/*, /account/* and /api/* are intentionally excluded —
  // admin/account require auth (Google can't and shouldn't crawl them).

  const productEntries = await getProductEntries();

  return [...staticRoutes, ...productEntries];
}
