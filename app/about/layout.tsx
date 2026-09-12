import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Silk Studio — The Lagos Creative Studio Built on Speed & Craft',
  description:
    'We are not just another print shop. Silk Studio is a Lagos-based creative studio obsessed with speed, quality, and brand identity. Meet the team turning briefs into results.',
  keywords: [
    'about Silk Studio',
    'Lagos creative studio',
    'print and design team Lagos',
    'branding studio Nigeria',
    'who is Silk Studio',
    'design agency Lagos story',
    'Nigerian creative brand',
  ],
  alternates: {
    canonical: '/about',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'About Silk Studio — The Lagos Creative Studio Built on Speed & Craft',
    description:
      'Not just another print shop. A Lagos-based creative studio obsessed with fast turnarounds, precision, and designs that actually work for your brand.',
    url: 'https://silkstudios.com.ng/about',
    siteName: 'Silk Studio',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: '/og-about.jpg',
        width: 1200,
        height: 630,
        alt: 'Silk Studio team — Lagos Design & Print Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Silk Studio — Lagos Creative Studio',
    description:
      'Speed, craft, and reliability. The Lagos studio behind hundreds of brands that look the part.',
    images: ['/og-about.jpg'],
    creator: '@silkstudiong',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
