import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services — Design, Print, Apparel & Web | Silk Studio Lagos',
  description:
    'Explore everything Silk Studio offers: professional graphic design, fast-turnaround printing, custom apparel, website design, and full event creative packages in Lagos, Nigeria.',
  keywords: [
    'graphic design services Lagos',
    'printing services Lagos Nigeria',
    'custom apparel printing Lagos',
    'website design Nigeria',
    'event branding Lagos',
    'flyer design Lagos',
    'banner printing Lagos',
    'business card printing Nigeria',
    'logo design Lagos',
    'full-service creative studio Nigeria',
    'branding services Nigeria',
    'Silk Studio services',
  ],
  alternates: {
    canonical: '/services',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'Services — Design, Print, Apparel & Web | Silk Studio Lagos',
    description:
      'Everything your brand needs to show up right. Graphic design, fast printing, custom apparel, web design, and event packages — all under one Lagos studio.',
    url: 'https://silkstudios.com.ng/services',
    siteName: 'Silk Studio',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: '/og-services.jpg',
        width: 1200,
        height: 630,
        alt: 'Silk Studio Services — Design, Print, Apparel & Web in Lagos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services — Design, Print, Apparel & Web | Silk Studio Lagos',
    description:
      'Everything your brand needs to show up right. One studio. Print, design, apparel, and web \u2014 fast.',
    images: ['/og-services.jpg'],
    creator: '@silkstudiong',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
