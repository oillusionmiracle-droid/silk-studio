'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/app/website-offer/offer.css';

export default function WebsiteOfferBanner() {
  const path = usePathname();
  if (['/account', '/admin', '/auth', '/moremi', '/futurecraft', '/privacy', '/terms', '/apparel/checkout', '/apparel/cookie-policy', '/apparel/return-policy', '/apparel/exchange-policy'].some(prefix => path.startsWith(prefix))) return null;
  return <aside className={`silk-promo ${path === '/apparel' ? 'silk-promo-apparel' : ''}`} aria-label="Website offer">
    <Link href="/website-offer" className="silk-promo-link" aria-label="Get 40% off website packages. View the offer.">
      <span className="silk-promo-track" aria-hidden="true">{[0, 1].map(copy => <span className="silk-promo-copy" key={copy}>{[0,1,2,3].map(i => <strong key={i}>GET 40% OFF WEBSITES <span>•</span></strong>)}</span>)}</span>
    </Link>
  </aside>;
}
