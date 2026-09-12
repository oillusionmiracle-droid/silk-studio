import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Silk Studio | Lagos Design & Print',
  description:
    'Read Silk Studio\'s Terms and Conditions. Understand your rights and obligations when placing orders, making payments, and using our creative services in Lagos, Nigeria.',
  keywords: [
    'Silk Studio terms and conditions',
    'print studio terms Lagos',
    'design studio policy Nigeria',
    'order terms Silk Studio',
    'payment policy Lagos studio',
  ],
  alternates: {
    canonical: '/terms',
  },
  robots: {
    index: true,
    follow: false,
    googleBot: { index: true, follow: false, 'max-snippet': 160 },
  },
  openGraph: {
    title: 'Terms & Conditions — Silk Studio',
    description:
      'The terms that govern your orders, payments, and use of Silk Studio\'s creative services.',
    url: 'https://silkstudios.com.ng/terms',
    siteName: 'Silk Studio',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
