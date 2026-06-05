import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Silk Studio',
  description: 'We\'re one message away. The fastest way to reach us is WhatsApp.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
