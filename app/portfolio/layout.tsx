import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio — Silk Studio',
  description: 'A selection of print, design, and digital work from Silk Studio. Every job done like it\'s the only one.',
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
