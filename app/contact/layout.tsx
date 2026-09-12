import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Silk Studio — Reach Us on WhatsApp or Online | Lagos',
  description:
    'Got a brief? We\'re one message away. The fastest way to reach Silk Studio is via WhatsApp. Lagos-based, response within 2 hours. Let\'s make something great together.',
  keywords: [
    'contact Silk Studio',
    'Silk Studio WhatsApp',
    'reach design studio Lagos',
    'print shop contact Lagos',
    'hire designer Lagos',
    'get a quote Lagos design',
    'creative studio inquiry Nigeria',
    'design brief Lagos',
    'book print job Lagos',
  ],
  alternates: {
    canonical: '/contact',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'Contact Silk Studio — We\'re One Message Away | Lagos',
    description:
      'Got a brief? Reach out on WhatsApp. Lagos-based, we respond within 2 hours. Let\'s build something great together.',
    url: 'https://silkstudios.com.ng/contact',
    siteName: 'Silk Studio',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: '/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Silk Studio — Lagos Creative Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Silk Studio — We\'re One Message Away',
    description:
      'Got a brief? Hit us on WhatsApp. Lagos-based, responsive, and ready to build.',
    images: ['/og-contact.jpg'],
    creator: '@silkstudiong',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
