import { SITE_URL } from './siteMetadata';
// Update a date only when that page's content or shared layout changes.
export const publicPages = [
  '/', '/website-offer', '/services', '/portfolio', '/studio', '/moremi', '/apparel', '/order',
  '/about', '/contact', '/privacy', '/terms', '/apparel/cookie-policy',
  '/apparel/exchange-policy', '/apparel/return-policy',
].map(path => ({ path, lastModified: ['/', '/website-offer'].includes(path) ? '2026-10-23' : '2026-10-13' }));
export function sitemapXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPages.map(page => `  <url><loc>${SITE_URL}${page.path}</loc><lastmod>${page.lastModified}</lastmod></url>`).join('\n')}\n</urlset>`;
}
export function robotsText() {
  return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /account\nDisallow: /api/\nDisallow: /auth/\nDisallow: /apparel/checkout\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}
