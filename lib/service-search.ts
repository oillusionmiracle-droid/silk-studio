import projects from '@/app/data/studio-projects.json';
import { blogPosts } from './blogPosts';
export type SearchEntry = { title: string; kind: string; keywords: string; href: string };
const order = (category: string, service?: string) => `/order?category=${encodeURIComponent(category)}${service ? `&service=${encodeURIComponent(service)}` : ''}`;
export const searchEntries: SearchEntry[] = [
  { title: 'Silk Notes — Blog', kind: 'Useful reads', keywords: 'blog newsletter business creative advice useful reads', href: '/blog' },
  ...blogPosts.map(post => ({ title: post.title, kind: post.category, keywords: `${post.category} ${post.summary} blog notes`, href: `/blog/${post.slug}` })),
  ...Object.entries({ Print: ['Flyers & Handbills','Banners','Billboards & Flex','Jotters & Notepads','ID Cards','Business Cards','Letterheads'], Apparel: ['Custom T-Shirts','Sweatshirts','Hoodies','Corporate Uniforms','Event Merch Set'], Design: ['Logo & Brand Identity','Social Media Templates','Print-Ready Artwork','Event Branding Kit'], Web: ['Landing Page','Business Website','E-commerce','Event Page'], Bundle: ['Event Package','Business Starter','Custom Bundle'] }).flatMap(([category, names]) => names.map(title => ({ title, kind: `${category} / ${category === 'Web' ? 'Free brief' : 'Order'}`, keywords: `${category} ${title} ${category === 'Print' ? 'printing paper packaging wedding invitation souvenir' : ''}`, href: category === 'Web' ? '/?brief=Website%20or%20app#brief' : order(category, title) }))),
  { title: 'AI UGC & product ads', kind: 'Creative / Free brief', keywords: 'ai ugc ads video advertising content creator product film campaign', href: '/?brief=AI%20UGC%20%26%20advertising#brief' },
  { title: 'Custom software & automation', kind: 'Digital / Free brief', keywords: 'software automation ai integration internal tool app development', href: '/?brief=Custom%20software%20%26%20automation#brief' },
  ...projects.map(p => ({ title: p.title, kind: `${p.category} / Project`, keywords: `${p.title} ${p.summary}`, href: p.id === 'moremi' ? '/moremi' : `/portfolio?project=${p.id}` })),
  { title: 'Meet the studio', kind: 'About', keywords: 'studio miracle team about contact designer lagos', href: '/studio' },
  { title: 'Moremi playground', kind: 'Kids / Waitlist', keywords: 'moremi children kids school games stories ai', href: '/moremi' },
  { title: 'Apparel shop', kind: 'Shop', keywords: 'shop apparel clothing collection fashion', href: '/apparel' },
];
export function searchSite(query: string) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return words.length ? searchEntries.filter(e => words.every(w => `${e.title} ${e.keywords}`.toLowerCase().includes(w))).slice(0, 12) : searchEntries.filter(e => ['Business Cards','Custom T-Shirts','Landing Page','AI UGC & product ads','Moremi playground'].includes(e.title));
}
