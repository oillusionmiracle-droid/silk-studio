import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://silkstudios.com.ng';

const APPAREL_CATEGORIES = ['tee', 'shirt', 'hoodie', 'cap'];
const PRODUCT_DETAIL_PATH: ((id: string) => string) | null = null;

type ProductRow = {
  id: string;
  updated_at: string | null;
  created_at: string | null;
};

async function getProductEntries() {
  if (!PRODUCT_DETAIL_PATH) return [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, updated_at, created_at')
      .eq('is_active', true)
      .in('category', APPAREL_CATEGORIES)
      .order('updated_at', { ascending: false });

    if (error || !data) return [];

    const buildPath = PRODUCT_DETAIL_PATH;
    return (data as ProductRow[]).map((product) => ({
      url: `${baseUrl}${buildPath(product.id)}`,
      lastModified: new Date(product.updated_at ?? product.created_at ?? new Date()).toISOString(),
      changeFrequency: 'weekly',
      priority: '0.8',
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  const now = new Date().toISOString();

  const staticRoutes = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: '1.0' },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: '0.9' },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: '0.9' },
    { url: `${baseUrl}/apparel`, lastModified: now, changeFrequency: 'weekly', priority: '0.9' },
    { url: `${baseUrl}/order`, lastModified: now, changeFrequency: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/apparel/checkout`, lastModified: now, changeFrequency: 'monthly', priority: '0.5' },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: '0.3' },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: '0.3' },
    { url: `${baseUrl}/apparel/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: '0.3' },
    { url: `${baseUrl}/apparel/exchange-policy`, lastModified: now, changeFrequency: 'yearly', priority: '0.3' },
    { url: `${baseUrl}/apparel/return-policy`, lastModified: now, changeFrequency: 'yearly', priority: '0.3' },
  ];

  const productEntries = await getProductEntries();
  const allRoutes = [...staticRoutes, ...productEntries];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
