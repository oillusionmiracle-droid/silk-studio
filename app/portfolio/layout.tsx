import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio — Real Work, Real Results | Silk Studio Lagos',
  description:
    'Browse Silk Studio\'s portfolio of design, print, and digital work. From event flyers to full brand identities, every job done like it\'s the only one. Lagos-based, Nigeria-wide.',
  keywords: [
    'design portfolio Lagos',
    'print portfolio Nigeria',
    'graphic design work Lagos',
    'branding portfolio Nigeria',
    'flyer design portfolio',
    'logo design portfolio Lagos',
    'event branding Nigeria',
    'Silk Studio portfolio',
    'creative work Lagos studio',
    'Nigerian design agency work',
  ],
  alternates: {
    canonical: '/portfolio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'Portfolio — Real Work, Real Results | Silk Studio Lagos',
    description:
      'Print, design, and digital work from Silk Studio. Flyers, brand identities, event packages, web. Every job done like it\'s the only one.',
    url: 'https://silkstudios.com.ng/portfolio',
    siteName: 'Silk Studio',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: '/og-portfolio.jpg',
        width: 1200,
        height: 630,
        alt: 'Silk Studio Portfolio — Lagos Design & Print Work',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio — Real Work, Real Results | Silk Studio Lagos',
    description:
      'See what we\'ve built. Design, print, and digital work from one of Lagos\' sharpest creative studios.',
    images: ['/og-portfolio.jpg'],
    creator: '@silkstudiong',
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
