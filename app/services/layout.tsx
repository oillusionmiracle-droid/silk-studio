import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services — Silk Studio',
  description: 'Everything your brand needs to show up right. Print. Design. Digital. Pick one or let us handle all three.',
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
