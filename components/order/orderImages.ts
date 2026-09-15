// Maps categories and subservices to candidate paths in /images/
// If a user drops a .png file into public/images/services/ or public/images/,
// OrderImage will attempt the png first, then fallback to jpg, then icon placeholder.

export const CATEGORY_IMAGE_MAP: Record<string, { primary: string; fallbacks: string[] }> = {
  Print: {
    primary: '/images/categories/print.png',
    fallbacks: ['/images/services/print-bg.jpg', '/images/categories/art.jpg', '/images/print.png'],
  },
  Apparel: {
    primary: '/images/categories/apparel.png',
    fallbacks: ['/images/services/tshirts.jpg', '/images/apparel.png'],
  },
  Design: {
    primary: '/images/categories/design.png',
    fallbacks: ['/images/services/design-bg.jpg', '/images/categories/logo.jpg', '/images/design.png'],
  },
  Web: {
    primary: '/images/categories/web.png',
    fallbacks: ['/images/services/web-bg.jpg', '/images/categories/web.jpg', '/images/web.png'],
  },
  Bundle: {
    primary: '/images/categories/bundle.png',
    fallbacks: ['/images/services/bundle-business.jpg', '/images/categories/business.jpg', '/images/bundle.png'],
  },
};

export const SERVICE_IMAGE_MAP: Record<string, { primary: string; fallbacks: string[]; subtitle?: string; startingPrice?: string }> = {
  'Flyers & Handbills': {
    primary: '/images/services/flyers.png',
    fallbacks: ['/images/services/flyers.jpg', '/images/flyers.png'],
    subtitle: 'Vibrant offset & digital flyers',
    startingPrice: 'From ₦25,000',
  },
  'Banners': {
    primary: '/images/services/banners.png',
    fallbacks: ['/images/services/banners.jpg', '/images/banners.png'],
    subtitle: 'Heavy-duty flex & roll-up banners',
    startingPrice: 'Custom Quote',
  },
  'Billboards & Flex': {
    primary: '/images/services/billboards.png',
    fallbacks: ['/images/services/billboards.jpg', '/images/billboards.png'],
    subtitle: 'Large format outdoor printing',
    startingPrice: 'Custom Quote',
  },
  'Jotters & Notepads': {
    primary: '/images/services/jotters.png',
    fallbacks: ['/images/services/jotters.jpg', '/images/jotters.png'],
    subtitle: 'Hardcover & spiral event jotters',
    startingPrice: 'From ₦45,000',
  },
  'ID Cards': {
    primary: '/images/services/id-cards.png',
    fallbacks: ['/images/services/id-cards.jpg', '/images/id-cards.png'],
    subtitle: 'Durable PVC & RFID corporate cards',
    startingPrice: 'From ₦4,500/pc',
  },
  'Business Cards': {
    primary: '/images/services/business-cards.png',
    fallbacks: ['/images/services/business-cards.jpg', '/images/business-cards.png'],
    subtitle: 'Premium matte, gloss & velvet touch',
    startingPrice: 'From ₦15,000',
  },
  'Letterheads': {
    primary: '/images/services/letterheads.png',
    fallbacks: ['/images/services/letterheads.jpg', '/images/letterheads.png'],
    subtitle: 'Executive stationery & conq sheets',
    startingPrice: 'From ₦20,000',
  },
  'Custom T-Shirts': {
    primary: '/images/services/tshirts.png',
    fallbacks: ['/images/services/tshirts.jpg', '/images/tshirts.png'],
    subtitle: '100% Cotton, screen & DTF prints',
    startingPrice: 'From ₦7,500/pc',
  },
  'Sweatshirts': {
    primary: '/images/services/sweatshirts.png',
    fallbacks: ['/images/services/sweatshirts.jpg', '/images/sweatshirts.png'],
    subtitle: 'Fleece lined heavyweight crewnecks',
    startingPrice: 'From ₦14,000/pc',
  },
  'Grey Joggers': {
    primary: '/images/services/joggers.png',
    fallbacks: ['/images/services/joggers.jpg', '/images/joggers.png'],
    subtitle: 'Custom tailored streetwear sweatpants',
    startingPrice: 'From ₦15,000/pc',
  },
  'Hoodies': {
    primary: '/images/services/hoodies.png',
    fallbacks: ['/images/services/hoodies.jpg', '/images/hoodies.png'],
    subtitle: 'Heavy 400gsm luxury streetwear hoodies',
    startingPrice: 'From ₦18,000/pc',
  },
  'Event Merch Set': {
    primary: '/images/services/merch-sets.png',
    fallbacks: ['/images/services/merch-sets.jpg', '/images/merch-sets.png'],
    subtitle: 'Curated apparel & accessory drops',
    startingPrice: 'Custom Quote',
  },
  'Corporate Uniforms': {
    primary: '/images/services/uniforms.png',
    fallbacks: ['/images/services/uniforms.jpg', '/images/uniforms.png'],
    subtitle: 'Branded polos, shirts & workwear',
    startingPrice: 'Custom Quote',
  },
  'Logo & Brand Identity': {
    primary: '/images/services/logo-design.png',
    fallbacks: ['/images/services/logo-design.jpg', '/images/logo-design.png'],
    subtitle: 'Comprehensive brand guide & vector logos',
    startingPrice: 'Custom Quote',
  },
  'Event Branding Kit': {
    primary: '/images/services/event-branding.png',
    fallbacks: ['/images/services/event-branding.jpg', '/images/event-branding.png'],
    subtitle: 'Stage design, digital passes & collateral',
    startingPrice: 'Custom Quote',
  },
  'Social Media Templates': {
    primary: '/images/services/social-templates.png',
    fallbacks: ['/images/services/social-templates.jpg', '/images/social-templates.png'],
    subtitle: 'Figma & PSD high-converting templates',
    startingPrice: 'Custom Quote',
  },
  'Print-Ready Artwork': {
    primary: '/images/services/print-artwork.png',
    fallbacks: ['/images/services/print-artwork.jpg', '/images/print-artwork.png'],
    subtitle: 'Color calibrated prepress graphics',
    startingPrice: 'Custom Quote',
  },
  'Landing Page': {
    primary: '/images/services/landing-page.png',
    fallbacks: ['/images/services/landing-page.jpg', '/images/landing-page.png'],
    subtitle: 'High speed, high converting Next.js pages',
    startingPrice: 'Custom Quote',
  },
  'Business Website': {
    primary: '/images/services/business-website.png',
    fallbacks: ['/images/services/business-website.jpg', '/images/business-website.png'],
    subtitle: 'Full enterprise CMS & brand experience',
    startingPrice: 'Custom Quote',
  },
  'E-commerce': {
    primary: '/images/services/ecommerce.png',
    fallbacks: ['/images/services/ecommerce.jpg', '/images/ecommerce.png'],
    subtitle: 'Online stores with payment & stock sync',
    startingPrice: 'Custom Quote',
  },
  'Event Page': {
    primary: '/images/services/event-page.png',
    fallbacks: ['/images/services/event-page.jpg', '/images/event-page.png'],
    subtitle: 'Ticket booking & schedule showcase',
    startingPrice: 'Custom Quote',
  },
  'Event Package': {
    primary: '/images/services/bundle-event.png',
    fallbacks: ['/images/services/bundle-event.jpg', '/images/bundle-event.png'],
    subtitle: 'Full event production print & brand bundle',
    startingPrice: 'Custom Quote',
  },
  'Business Starter': {
    primary: '/images/services/bundle-business.png',
    fallbacks: ['/images/services/bundle-business.jpg', '/images/bundle-business.png'],
    subtitle: 'Cards, letterheads, invoice & branding',
    startingPrice: 'Custom Quote',
  },
  'Custom Bundle': {
    primary: '/images/services/custom-bundle.png',
    fallbacks: ['/images/services/bundle-business.jpg', '/images/custom-bundle.png'],
    subtitle: 'Tailored hybrid packages for your vision',
    startingPrice: 'Custom Quote',
  },
};
