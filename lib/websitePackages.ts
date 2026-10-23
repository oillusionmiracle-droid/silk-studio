export const WEBSITE_DISCOUNT = 40;
export const websitePackages = [
  { id: 'landing-page', name: 'Landing page', standard: 150000, description: 'One focused page. One clear next step.', features: ['1 page with up to 7 sections', 'Enquiry form and WhatsApp link', 'One campaign, product or service'] },
  { id: 'portfolio', name: 'Portfolio / personal brand', standard: 200000, description: 'Give your work a home of its own.', features: ['Up to 4 pages', 'Project gallery and contact form', 'Your biography, work and services'] },
  { id: 'business', name: 'Starter business', standard: 250000, description: 'A proper introduction to your business.', featured: true, features: ['Up to 5 pages', 'Home, about, services, work and contact', 'Enquiry form and WhatsApp link'] },
  { id: 'business-cms', name: 'Business + CMS', standard: 400000, description: 'A website you can keep growing.', features: ['Up to 8 pages', 'Editable blog or project collection', 'Newsletter service integration'] },
  { id: 'booking', name: 'Booking website', standard: 450000, description: 'Turn interest into an appointment.', features: ['Up to 6 pages', 'One existing booking service integration', 'One payment gateway setup'] },
  { id: 'ecommerce-starter', name: 'E-commerce starter', standard: 600000, description: 'Take your products beyond the DMs.', features: ['Up to 20 products uploaded', 'Cart, checkout and one payment gateway', 'Basic delivery settings and store handover'] },
  { id: 'ecommerce-growth', name: 'E-commerce growth', standard: 900000, description: 'More products. More room to sell.', features: ['Up to 50 products uploaded', 'Categories and customer accounts', 'Cart, checkout, one payment gateway and delivery zones'] },
] as const;

export const offerPrice = (standard: number) => Math.round(standard * (100 - WEBSITE_DISCOUNT) / 100);
export const naira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

export function websiteClaimLink(name: string, standard: number) {
  const message = `Hello Silk Studio! I'd like to claim the 40% website offer.\n\nPackage: ${name}\nStandard package fee: ${naira(standard)}\nOffer price: ${naira(offerPrice(standard))}\n\nMy business name:\nWhat I need the website to do:\nMy preferred timeline:\n\nPlease confirm the scope, availability and next steps. I understand domain, hosting and paid third-party services are separate.`;
  return `https://wa.me/2347064829776?text=${encodeURIComponent(message)}`;
}
