import type { Metadata } from 'next';
import '@/app/apparel/apparel.css';
import ApparelNavbar from '@/components/apparel/ApparelNavbar';
import ApparelFooter from '@/components/apparel/ApparelFooter';
import FloatingCheckout from '@/components/apparel/FloatingCheckout';

export const metadata: Metadata = {
  title: 'Silk Apparel — Limited Drop Custom Streetwear | Lagos',
  description:
    'Pre-order only. Each month, one exclusive drop of premium custom streetwear — tees, hoodies, caps & more. Once the window closes, it\'s gone. Shop Silk Apparel.',
  keywords: [
    'custom streetwear Lagos',
    'limited drop apparel Nigeria',
    'pre-order custom tees Lagos',
    'Silk Apparel',
    'custom hoodies Nigeria',
    'Lagos fashion brand',
    'exclusive drops Nigeria',
    'premium custom clothing Lagos',
    'silk studio apparel',
    'screen print clothing Lagos',
  ],
  alternates: {
    canonical: '/apparel',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'Silk Apparel — Limited Drop Custom Streetwear | Lagos',
    description:
      'Pre-order only. Each month, one exclusive drop of premium custom streetwear. Tees, hoodies, caps. Once the window closes, it\'s gone.',
    url: 'https://silkstudios.com.ng/apparel',
    siteName: 'Silk Studio',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: '/og-apparel.jpg',
        width: 1200,
        height: 630,
        alt: 'Silk Apparel — Limited Drop Custom Streetwear from Lagos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silk Apparel — Limited Drop Custom Streetwear | Lagos',
    description:
      'Pre-order only. Exclusive monthly drops of premium custom streetwear. Miss it and wait till next time.',
    images: ['/og-apparel.jpg'],
    creator: '@silkstudiong',
  },
};

export default function ApparelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="apparel-root" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <ApparelNavbar />
      <main>{children}</main>
      <FloatingCheckout />
      <ApparelFooter />
    </div>
  );
}
