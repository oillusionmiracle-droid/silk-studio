import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Silk Studio',
  description: 'Not just another print shop. We are a Lagos-based design and print brand built on speed, craft, and reliability.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
