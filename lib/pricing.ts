// All price calculations live here. Easy to edit in VSCode later.
// All add-ons are marked as placeholders — easy to adjust.

// FLYERS
// Base price per unit (linear scaling):
export const FLYER_RATES: Record<string, number> = {
  'A5-Single-sided': 258,     // ₦25,800 per 100 → ₦258 per unit
  'A4-Single-sided': 500,     // ₦50,000 per 100 → ₦500 per unit
  'A3-Single-sided': 800,     // ₦80,000 per 100 → ₦800 per unit
  'A5-Double-sided': 387,     // A5 single × 1.5 (PLACEHOLDER)
  'A4-Double-sided': 750,     // A4 single × 1.5 (PLACEHOLDER)
  'A3-Double-sided': 1200,    // A3 single × 1.5 (PLACEHOLDER)
};
// Lamination multiplier (PLACEHOLDER — adjust in VSCode):
export const LAMINATION_FLYER: Record<string, number> = { None: 1.0, Matte: 1.2, Gloss: 1.2 };

// BANNERS
// ₦1,000 per square foot
export const BANNER_RATE = 1000;
export const EYELET_FEE = 500;

// JOTTERS
// ₦938 per unit (₦46,900 per 50, linear)
export const JOTTER_RATE = 938;
// Add-ons (flat fees):
export const JOTTER_ADDONS = {
  perfect_binding: 3000,  // vs spiral (default)
  hard_cover: 2000,       // vs soft (default)
  lamination_matte: 0.1,  // +10% multiplier (PLACEHOLDER)
  lamination_gloss: 0.1,
};

// BUSINESS CARDS
// ₦110 per unit (₦11,000 per 100, linear)
export const BIZCARD_RATE = 110;
// Add-ons (flat fees):
export const BIZCARD_ADDONS = {
  super_thick: 2000,      // 600gsm upgrade
  rounded_corners: 2000,  // vs square (default)
};

// ID CARDS (fixed per unit, no scaling)
export const ID_CARD_RATES: Record<string, number> = {
  'Standard': 4500,
  'Lanyard + Holder': 7500,
  'Badge Reel + Holder': 7500,
};

// APPAREL (linear per unit)
export const APPAREL_RATES: Record<string, number> = {
  'Custom T-Shirts': 8000,
  'Sweatshirts': 17300,
  'Grey Joggers': 25000,
};

// CUSTOM QUOTE SERVICES
export const CUSTOM_QUOTE_SERVICES = [
  'Billboards & Flex',
  'Hoodies',
  'Event Merch Set',
  'Corporate Uniforms',
  'Logo & Brand Identity',
  'Event Branding Kit',
  'Social Media Templates',
  'Print-Ready Artwork',
  'Landing Page',
  'Business Website',
  'E-commerce',
  'Event Page',
  'Event Package',
  'Business Starter',
  'Custom Bundle',
  'Letterheads',
  'Other',
];
