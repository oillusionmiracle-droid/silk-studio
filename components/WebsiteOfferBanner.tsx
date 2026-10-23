import Link from 'next/link';
import { naira, offerPrice, websitePackages } from '@/lib/websitePackages';
import '@/app/website-offer/offer.css';

export default function WebsiteOfferBanner() {
  const business = websitePackages.find(item => item.id === 'business')!;
  return <aside className="website-offer-banner" aria-label="Website package offer">
    <span className="website-offer-stamp">40% OFF</span>
    <p>Your business deserves its own address. <span>Business websites from {naira(offerPrice(business.standard))}.</span></p>
    <Link href="/website-offer">Explore website packages <span aria-hidden="true">↗</span></Link>
  </aside>;
}
