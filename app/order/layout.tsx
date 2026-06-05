import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Your Order — Silk Studio',
  description: 'Tell us what you need. Fill this in and we\'ll reach out within 2 hours. Deposit locks your slot.',
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
