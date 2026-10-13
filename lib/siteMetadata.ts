import type { Metadata } from 'next';
export const SITE_URL = 'https://www.silkstudios.com.ng';
export const SERVICE_DESCRIPTION = 'Branding and graphic design, websites and apps, custom software and automation, UGC and AI video ads, print, packaging and custom apparel. Silk Studio works with businesses in Nigeria and worldwide.';
export const studioServices = [
  { name: 'Branding & graphic design', description: 'Brand identities, logos, packaging, campaign artwork and print-ready design.', url: '/?brief=Branding%20%26%20design#brief' },
  { name: 'Websites & apps', description: 'Business websites, landing pages, web apps and useful digital products.', url: '/?brief=Website%20or%20app#brief' },
  { name: 'Custom software & automation', description: 'Internal business tools, reusable software, integrations and workflow automation.', url: '/?brief=Custom%20software%20%26%20automation#brief' },
  { name: 'UGC & AI advertising', description: 'Creator-style product ads, AI video campaigns, product films and generated imagery.', url: '/?brief=AI%20UGC%20%26%20advertising#brief' },
  { name: 'Print & packaging', description: 'Business cards, flyers, banners, stationery, packaging and event materials.', url: '/order?category=Print' },
  { name: 'Apparel & merchandise', description: 'Custom clothing, printed apparel and branded merchandise.', url: '/apparel' },
];
export function pageMetadata(title: string, description: string, path: string, image: string): Metadata {
  return { title, description, alternates: { canonical: path }, openGraph: { title, description, url: `${SITE_URL}${path}`, siteName: 'Silk Studio', locale: 'en_NG', type: 'website', images: [{ url: image, alt: title }] }, twitter: { card: 'summary_large_image', title, description, images: [image], creator: '@silkstudiong' } };
}
export const studioStructuredData = {
  '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE_URL}/#studio`,
  name: 'Silk Studio', url: SITE_URL, logo: `${SITE_URL}/logo.svg`, description: SERVICE_DESCRIPTION,
  telephone: '+2347064829776', email: 'thesilkstudiong@gmail.com',
  sameAs: ['https://instagram.com/thesilkstudiong', 'https://tiktok.com/@thesilkstudiong'],
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Silk Studio services', itemListElement: studioServices.map(service => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service.name, description: service.description, provider: { '@id': `${SITE_URL}/#studio` }, url: `${SITE_URL}${service.url}` } })) },
};
