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
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)',
        right: 20,
        zIndex: 9500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
      }}
    >
      <img src="https://res.cloudinary.com/dagqxe3fh/image/upload/silk-studio/icons/whatsapp.png" alt="WhatsApp" width={52} height={52} style={{ objectFit: 'contain' }} />
    </a>
  );
}
