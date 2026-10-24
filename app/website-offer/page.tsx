import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { naira, offerPrice, websiteClaimLink, websitePackages } from '@/lib/websitePackages';
import './offer.css';

export const metadata: Metadata = {
  title: '40% Off Website Packages | Silk Studio',
  description: 'Explore Silk Studio website packages, standard fees, 40% offer prices and clear deliverables. Landing pages from ₦90,000 and business websites from ₦150,000.',
  alternates: { canonical: '/website-offer' },
  openGraph: { title: 'Your business deserves its own address. | Silk Studio', description: '40% off selected website design and build packages. See prices, deliverables and how to claim.', url: '/website-offer' },
};

export default function WebsiteOfferPage() {
  return <main className="studio-page web-offer-page" id="top">
    <a href="#packages" className="studio-skip">Skip to website packages</a>
    <section className="web-offer-hero studio-section">
      <div className="web-offer-hero-grid">
        <div><h1>Your business is<br /><em>bigger than your bio.</em></h1><p>Give it a website. Let it breathe. Get 40% off landing pages, business websites and online stores.</p><div className="web-offer-actions"><a href="#packages" className="studio-button studio-lime">See prices & claim <span aria-hidden="true">↓</span></a></div><small>Landing pages from ₦90,000 · Business websites from ₦150,000</small></div>
        <a className="web-offer-flyer" href="#packages" aria-label="See the 40% website offer packages"><Image src="/images/website-offer-flyer.png" alt="Silk Studio: Your business is bigger than your bio. Give it a website. 40% off selected website packages." width={1229} height={1536} priority sizes="(max-width: 700px) 90vw, 45vw" /></a>
      </div>
    </section>
    <div className="web-offer-strip">Design + development <span>✳</span> Mobile ready <span>✳</span> Yours to grow</div>
    <section className="studio-section web-offer-packages" id="packages">
      <div className="studio-section-line"><span>01 / Pick your starting point</span><span>Prices in Nigerian naira</span></div>
      <div className="studio-section-heading"><h2>A clear scope.<br /><em>A better starting price.</em></h2><p>Choose the package closest to your idea. We’ll confirm the details with you before work begins.</p></div>
      <p className="web-offer-price-note">Standard package fees and current offer prices are shown below. These are design-and-build fees; ongoing service costs are separate.</p>
      <div className="web-offer-grid">{websitePackages.map(item => <article key={item.id} className={`web-offer-card ${'featured' in item && item.featured ? 'web-offer-card-featured' : ''}`} id={item.id}>
        <div className="web-offer-card-top"><span>{'featured' in item && item.featured ? 'A great place to start' : 'Design + build'}</span><b>40% OFF</b></div>
        <h3>{item.name}</h3><p>{item.description}</p>
        <div className="web-offer-price"><small>Standard package fee: <s>{naira(item.standard)}</s></small><strong>{naira(offerPrice(item.standard))}</strong><span>Offer price · save {naira(item.standard - offerPrice(item.standard))}</span></div>
        <ul>{item.features.map(feature => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
        <a href={websiteClaimLink(item.name, item.standard)} className="studio-button" target="_blank" rel="noopener noreferrer" aria-label={`Claim ${item.name} for ${naira(offerPrice(item.standard))} on WhatsApp`}>Claim this package <span aria-hidden="true">↗</span></a>
      </article>)}
      <article className="web-offer-card web-offer-custom"><span className="studio-eyebrow">Something more involved?</span><h3>Custom web apps & portals</h3><p>Dashboards, memberships, marketplaces and custom business workflows.</p><div className="web-offer-price"><small>Individually scoped</small><strong>From ₦1,200,000</strong><span>Quoted separately · outside the 40% offer</span></div><Link href="/?brief=Custom%20software%20%26%20automation#brief" className="studio-button">Let’s scope your idea <span aria-hidden="true">↗</span></Link></article>
      </div>
    </section>
    <section className="studio-section web-offer-included" id="included"><div className="studio-section-line"><span>02 / The useful details</span><span>Know what you’re getting</span></div><div className="web-offer-details-grid"><div><h2>Good foundations.<br /><em>In every package.</em></h2><ul><li>Responsive design for mobile, tablet and desktop</li><li>Basic on-page SEO and metadata setup</li><li>Motion where it helps the experience</li><li>Two consolidated revision rounds</li><li>Deployment and project handover</li><li>30 days of bug fixes within the agreed scope</li></ul></div><div><h3>Budget separately for</h3><p>Domain registration, hosting, business email, paid plugins or platforms, third-party subscriptions and payment-processing fees.</p><h3>What we’ll need from you</h3><p>Your logo, approved text, photos and product information. Copywriting, photography, branding, extra pages and additional product uploads can be quoted separately.</p><h3>Scope stays clear</h3><p>Booking packages use an existing booking service. Custom scheduling, complex shipping, subscriptions and specialist integrations need a separate quote.</p></div></div></section>
    <section className="studio-section web-offer-claim" id="claim"><div className="studio-section-line"><span>03 / Make it yours</span><span>No checkout surprises</span></div><div className="studio-section-heading"><h2>Three steps.<br /><em>Then we make a plan.</em></h2></div><ol><li><span>01</span><h3>Pick a package</h3><p>Tap “Claim this package” to open WhatsApp with the package and offer price already filled in.</p></li><li><span>02</span><h3>Tell us your idea</h3><p>Add your business name, what the website needs to do and your preferred timeline, then send your enquiry.</p></li><li><span>03</span><h3>Agree the details</h3><p>We confirm scope, availability, total costs, delivery schedule and payment terms before work starts.</p></li></ol><p className="web-offer-terms">The 40% reduction applies to the listed design-and-build packages. Additional work and third-party costs are excluded. Sending an enquiry does not take payment or reserve a production slot; your written project agreement confirms the booking.</p><a className="studio-text-link" href={`mailto:thesilkstudiong@gmail.com?subject=${encodeURIComponent('Silk Studio — 40% website offer')}`}>Prefer email? Ask about the offer ↗</a></section>
  </main>;
}
