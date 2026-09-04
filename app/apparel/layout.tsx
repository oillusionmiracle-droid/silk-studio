import type { Metadata } from 'next';
import '@/app/apparel/apparel.css';
import ApparelNavbar from '@/components/apparel/ApparelNavbar';
import ApparelFooter from '@/components/apparel/ApparelFooter';
import FloatingCheckout from '@/components/apparel/FloatingCheckout';

export const metadata: Metadata = {
  title: 'Apparel — Silk Studio',
  description: 'Limited monthly drops. Pre-order only. Once the window closes, it\'s gone.',
};

export default function ApparelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="apparel-root" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <ApparelNavbar />
      <main>{children}</main>
      <FloatingCheckout />
      <ApparelFooter />
    </div>
  );
}
