import { SITE_URL } from './siteMetadata';
import { blogPosts } from './blogPosts';
import { caseStudies } from './caseStudies';
// Update a date only when that page's content or shared layout changes.
export const publicPages = [
  '/', '/website-offer', '/blog', ...blogPosts.map(post => `/blog/${post.slug}`), ...caseStudies.map(study => `/work/${study.id}`), '/services', '/portfolio', '/studio', '/moremi', '/apparel', '/order',
  '/about', '/contact', '/privacy', '/terms', '/apparel/cookie-policy',
  '/apparel/exchange-policy', '/apparel/return-policy',
].map(path => ({ path, lastModified: path.startsWith('/blog') || !path.startsWith('/moremi') ? '2026-10-24' : '2026-10-13' }));
export function sitemapXml() {
  const xml=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${publicPages.map(page => {const post=blogPosts.find(p=>page.path===`/blog/${p.slug}`);return `  <url><loc>${SITE_URL}${page.path}</loc><lastmod>${page.lastModified}</lastmod>${post?`<image:image><image:loc>${SITE_URL}${post.image.src}</image:loc><image:caption>${xml(post.image.caption)}</image:caption></image:image>`:''}</url>`;}).join('\n')}\n</urlset>`;
}
export function robotsText() {
  return `User-agent: *\nAllow: /\nAllow: /blog/\nDisallow: /admin\nDisallow: /account\nDisallow: /api/\nDisallow: /auth/\nDisallow: /apparel/checkout\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}
