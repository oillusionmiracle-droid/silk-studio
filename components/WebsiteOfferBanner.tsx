import Link from 'next/link';
import { naira, offerPrice, websitePackages } from '@/lib/websitePackages';
import '@/app/website-offer/offer.css';

export default function WebsiteOfferBanner() {
  const business = websitePackages.find(item => item.id === 'business')!;
  return <aside className="website-offer-banner" aria-label="Website package offer">
    <Link href="/website-offer" className="website-offer-stamp" aria-label="40% off websites — see prices and claim">40% OFF</Link>
    <p>Your business deserves its own address. <span>Business websites from {naira(offerPrice(business.standard))}.</span></p>
  </aside>;
}
