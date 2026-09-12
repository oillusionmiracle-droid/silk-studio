import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — How Silk Studio Handles Your Data | Lagos',
  description:
    'Read Silk Studio\'s Privacy Policy. We are committed to protecting your personal data. Learn what we collect, how we use it, and your rights as a customer.',
  keywords: [
    'Silk Studio privacy policy',
    'data protection Nigeria',
    'privacy Lagos design studio',
    'NDPR compliance Nigeria',
    'customer data policy Silk Studio',
  ],
  alternates: {
    canonical: '/privacy',
  },
  robots: {
    index: true,
    follow: false,
    googleBot: { index: true, follow: false, 'max-snippet': 160 },
  },
  openGraph: {
    title: 'Privacy Policy — Silk Studio',
    description:
      'How Silk Studio handles your personal data. Transparent, responsible, and NDPR-aware.',
    url: 'https://silkstudios.com.ng/privacy',
    siteName: 'Silk Studio',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
