'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/app/website-offer/offer.css';

export default function WebsiteOfferBanner() {
  const path = usePathname();
  if (['/account', '/admin', '/auth', '/moremi', '/privacy', '/terms', '/apparel/checkout', '/apparel/cookie-policy', '/apparel/return-policy', '/apparel/exchange-policy'].some(prefix => path.startsWith(prefix))) return null;
  return <aside className={`silk-promo ${path === '/apparel' ? 'silk-promo-apparel' : ''}`} aria-label="Website offer">
    <Link href="/website-offer" className="silk-promo-link" aria-label="40% off selected websites. Business websites from ₦150,000. View packages and claim.">
      <span className="silk-promo-track" aria-hidden="true">{[0, 1].map(copy => <span className="silk-promo-copy" key={copy}><strong>40% OFF WEBSITES</strong><span>YOUR BUSINESS IS BIGGER THAN YOUR BIO</span><b>↗</b><strong>40% OFF WEBSITES</strong><span>BUSINESS WEBSITES FROM ₦150,000</span><b>↗</b></span>)}</span>
    </Link>
  </aside>;
}
