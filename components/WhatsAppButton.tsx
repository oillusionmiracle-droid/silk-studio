'use client';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I%27d+like+to+place+an+order"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 999,
        width: 56,
        height: 56,
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
