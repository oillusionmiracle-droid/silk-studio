import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Your Order — Custom Design & Print | Silk Studio Lagos',
  description:
    'Place your order with Silk Studio in minutes. Select your service, fill in your specs, and lock your slot with a deposit. Flyers, banners, apparel, logos, and more — fast Lagos delivery.',
  keywords: [
    'order design Lagos',
    'order print Lagos',
    'place print order Nigeria',
    'custom flyer order Lagos',
    'order banner printing Lagos',
    'order logo design Nigeria',
    'Silk Studio order',
    'book design job Lagos',
    'fast print order Lagos',
    'custom apparel order Nigeria',
  ],
  alternates: {
    canonical: '/order',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'Start Your Order — Silk Studio Lagos',
    description:
      'Select your service, fill in your specs, and lock your slot with a deposit. Design and print orders fulfilled within 24–48 hours in Lagos.',
    url: 'https://silkstudios.com.ng/order',
    siteName: 'Silk Studio',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: '/og-order.jpg',
        width: 1200,
        height: 630,
        alt: 'Order from Silk Studio — Lagos Design & Print',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start Your Order — Silk Studio Lagos',
    description:
      'Fill in your brief, lock your slot. Design and print delivered fast in Lagos.',
    images: ['/og-order.jpg'],
    creator: '@silkstudiong',
  },
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
