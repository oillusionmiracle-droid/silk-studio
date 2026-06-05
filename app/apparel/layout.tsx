import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apparel — Silk Studio',
  description: 'Limited monthly drops. Pre-order only. Once the window closes, it\'s gone.',
};

export default function ApparelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
