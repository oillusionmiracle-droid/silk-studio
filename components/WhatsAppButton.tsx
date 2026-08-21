'use client';

import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();

  // Hide on apparel section per user request
  if (pathname?.startsWith('/apparel')) {
    return null;
  }

  return (
    <a
      href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I%27d+like+to+place+an+order"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        // On mobile: sit above the bottom nav (80px) + some gap
        // On desktop: just sit at bottom-right corner
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)',
        right: 20,
        zIndex: 9500, // always visible — above bottom nav (8000), below AI chat bubble (9999)
        width: 52,
        height: 52,
        borderRadius: '50%',
        backgroundColor: '#C6FF33',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(198,255,51,0.35)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(198,255,51,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(198,255,51,0.35)';
      }}
    >
      <img src="/icons/whatsapp.svg" alt="WhatsApp" width={26} height={26} style={{ filter: 'brightness(0)' }} />
    </a>
  );
}
