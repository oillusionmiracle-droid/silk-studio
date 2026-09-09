// Business Logic & Dynamic Pricing Engine consuming Supabase products, variants, and configurations.

export interface DbProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  pricing_type: 'unit' | 'tier' | 'custom_quote' | 'package';
  config_schema?: Record<string, any>;
  display_order?: number;
  is_active?: boolean;
}

export interface DbVariant {
  id: string;
  product_id: string;
  name: string;
  sku?: string;
  price: number;
  stock?: number;
  options?: Record<string, any>;
  min_quantity?: number;
  max_quantity?: number;
}

const DEFAULT_PRODUCTS_MAP: Record<string, Partial<DbProduct>> = {
  'flyers & handbills': { title: 'Flyers & Handbills', slug: 'flyers', category: 'PRINT', price: 120, pricing_type: 'tier' },
  'banners': { title: 'Banners', slug: 'rollup-banners', category: 'PRINT', price: 15000, pricing_type: 'unit' },
  'billboards & flex': { title: 'Billboards & Flex', slug: 'flex-billboards', category: 'PRINT', price: 450, pricing_type: 'unit', config_schema: { has_dimensions: true } },
  'jotters & notepads': { title: 'Jotters & Notepads', slug: 'jotters', category: 'PRINT', price: 850, pricing_type: 'tier' },
  'id cards': { title: 'ID Cards', slug: 'id-cards', category: 'PRINT', price: 4500, pricing_type: 'tier' },
  'business cards': { title: 'Business Cards', slug: 'business-cards', category: 'PRINT', price: 85, pricing_type: 'tier' },
  'letterheads': { title: 'Letterheads', slug: 'letterheads', category: 'PRINT', price: 120, pricing_type: 'tier' },
  'custom t-shirts': { title: 'Custom T-Shirts', slug: 'custom-tshirts', category: 'APPAREL', price: 6500, pricing_type: 'tier' },
  'sweatshirts': { title: 'Sweatshirts', slug: 'custom-sweatshirts', category: 'APPAREL', price: 14000, pricing_type: 'tier' },
  'grey joggers': { title: 'Grey Joggers', slug: 'custom-joggers', category: 'APPAREL', price: 15000, pricing_type: 'tier' },
  'hoodies': { title: 'Hoodies', slug: 'custom-hoodies', category: 'APPAREL', price: 18000, pricing_type: 'tier' },
  'event merch set': { title: 'Event Merch Set', slug: 'event-merch', category: 'APPAREL', price: 4500, pricing_type: 'tier' },
  'corporate uniforms': { title: 'Corporate Uniforms', slug: 'corporate-uniforms', category: 'APPAREL', price: 9500, pricing_type: 'tier' },
  'logo & brand identity': { title: 'Logo & Brand Identity', slug: 'logo-brand-identity', category: 'DESIGN', price: 75000, pricing_type: 'package' },
  'event branding kit': { title: 'Event Branding Kit', slug: 'event-branding', category: 'DESIGN', price: 120000, pricing_type: 'package' },
  'social media templates': { title: 'Social Media Templates', slug: 'social-media-templates', category: 'DESIGN', price: 45000, pricing_type: 'package' },
  'print-ready artwork': { title: 'Print-Ready Artwork', slug: 'print-ready-artwork', category: 'DESIGN', price: 15000, pricing_type: 'unit' },
  'landing page': { title: 'Landing Page', slug: 'landing-page', category: 'WEB', price: 150000, pricing_type: 'package' },
  'business website': { title: 'Business Website', slug: 'business-website', category: 'WEB', price: 350000, pricing_type: 'package' },
  'e-commerce': { title: 'E-commerce', slug: 'ecommerce-website', category: 'WEB', price: 600000, pricing_type: 'package' },
  'event page': { title: 'Event Page', slug: 'event-website', category: 'WEB', price: 200000, pricing_type: 'package' },
  'event package': { title: 'Event Package', slug: 'event-branding-bundle', category: 'BUNDLES', price: 320000, pricing_type: 'package' },
  'business starter': { title: 'Business Starter', slug: 'startup-launch-pack', category: 'BUNDLES', price: 180000, pricing_type: 'package' },
};

/**
 * Matches a selected sub-service string against database products by exact title,
 * slug, keyword aliases, or fallback metadata.
 */
export function matchProductForSubService(
  subService: string | null,
  dbProducts: DbProduct[]
): DbProduct | undefined {
  if (!subService) return undefined;
  const target = subService.toLowerCase().trim();

  // 1. Direct match in DB by title or slug
  if (dbProducts && dbProducts.length > 0) {
    const directMatch = dbProducts.find(
      (p) =>
        p.title.toLowerCase() === target ||
        p.slug === target.replace(/[^a-z0-9]+/g, '-')
    );
    if (directMatch) return directMatch;

    // 2. Fuzzy / keyword match in DB
    const fuzzyMatch = dbProducts.find((p) => {
      const pTitle = p.title.toLowerCase();
      const pSlug = p.slug.toLowerCase();
      if (target.includes('flyer') && (pSlug === 'flyers' || pTitle.includes('flyer'))) return true;
      if (target.includes('banner') && (pSlug === 'rollup-banners' || pTitle.includes('banner'))) return true;
      if ((target.includes('flex') || target.includes('billboard')) && (pSlug === 'flex-billboards' || pTitle.includes('flex') || pTitle.includes('billboard'))) return true;
      if ((target.includes('jotter') || target.includes('notepad')) && (pSlug === 'jotters' || pTitle.includes('jotter'))) return true;
      if (target.includes('id card') && (pSlug === 'id-cards' || pTitle.includes('id card'))) return true;
      if (target.includes('business card') && (pSlug === 'business-cards' || pTitle.includes('business card'))) return true;
      if (target.includes('letterhead') && (pSlug === 'letterheads' || pTitle.includes('letterhead'))) return true;
      if (target.includes('t-shirt') && (pSlug === 'custom-tshirts' || pTitle.includes('t-shirt'))) return true;
      if (target.includes('sweatshirt') && (pSlug === 'custom-sweatshirts' || pTitle.includes('sweatshirt'))) return true;
      if (target.includes('jogger') && (pSlug === 'custom-joggers' || pTitle.includes('jogger'))) return true;
      if (target.includes('hoodie') && (pSlug === 'custom-hoodies' || pTitle.includes('hoodie'))) return true;
      return false;
    });

    if (fuzzyMatch) return fuzzyMatch;
  }

  // 3. Application catalog fallback mapping if DB product is missing or not yet loaded
  const fallback = DEFAULT_PRODUCTS_MAP[target];
  if (fallback) {
    return {
      id: `fallback-${fallback.slug}`,
      title: fallback.title || subService,
      slug: fallback.slug || subService.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: fallback.category || 'PRINT',
      description: 'Standard product offering',
      price: fallback.price || 0,
      pricing_type: fallback.pricing_type || 'unit',
      config_schema: fallback.config_schema,
      is_active: true,
    };
  }

  if (target === 'other' || target === 'custom bundle') {
    return {
      id: 'custom-quote-prod',
      title: subService,
      slug: 'custom-quote',
      category: 'OTHER',
      description: 'Custom quote required',
      price: 0,
      pricing_type: 'custom_quote',
      is_active: true,
    };
  }

  return undefined;
}

/**
 * Calculates subtotal dynamically based on trusted database product records, variants,
 * user-selected quantity, and configurable spec options (size, sides, lamination, etc.).
 */
export function calculateDynamicPricing(params: {
  product?: DbProduct | null;
  variants?: DbVariant[];
  quantity: number;
  specs: Record<string, any>;
}): { unitPrice: number; subtotal: number; isCustomQuote: boolean } {
  const { product, variants = [], quantity, specs } = params;

  if (!product || product.is_active === false) {
    return { unitPrice: 0, subtotal: 0, isCustomQuote: true };
  }

  // 1. If product is set to custom_quote pricing type, require custom quote
  if (product.pricing_type === 'custom_quote') {
    return { unitPrice: 0, subtotal: 0, isCustomQuote: true };
  }

  // 2. Check if a matching variant exists in database variants table (e.g. for Apparel or specific Print variants)
  if (variants && variants.length > 0) {
    const matchedVariant = variants.find(v => {
      if (v.product_id !== product.id) return false;
      if (!v.options) return false;
      // Match all options in variant against user specs
      return Object.entries(v.options).every(([key, val]) => {
        const specVal = specs[key];
        if (!specVal) return false;
        return String(specVal).trim().toLowerCase() === String(val).trim().toLowerCase();
      });
    });

    if (matchedVariant && matchedVariant.price > 0) {
      const unitPrice = matchedVariant.price;
      const subtotal = unitPrice * Math.max(1, quantity);
      return { unitPrice, subtotal, isCustomQuote: false };
    }
  }

  // 3. Database product base rate as starting unit price
  let basePrice = Number(product.price) > 0 ? Number(product.price) : 0;

  if (basePrice === 0 && product.pricing_type !== 'package') {
    return { unitPrice: 0, subtotal: 0, isCustomQuote: true };
  }

  const schema = product.config_schema || {};

  // Flex/Billboard square footage calculation using database product.price as rate per sqft
  if (schema.has_dimensions || product.slug === 'flex-billboards') {
    const width = Number(specs.width) || 1;
    const height = Number(specs.height) || 1;
    const sqft = Math.max(1, width * height);
    const eyeletFee = specs.eyelets === 'Yes' ? 500 : 0;
    const unitPrice = (basePrice * sqft) + eyeletFee;
    const subtotal = unitPrice * Math.max(1, quantity);
    return { unitPrice: Math.round(unitPrice), subtotal: Math.round(subtotal), isCustomQuote: false };
  }

  // Configurable spec multipliers (Formula layer applied to DB base rate)
  // Size formula multiplier
  if (specs.size === 'A4') {
    basePrice = basePrice * 1.8;
  } else if (specs.size === 'A3') {
    basePrice = basePrice * 3.0;
  }

  // Sides multiplier
  if (specs.sides === 'Double-sided') {
    basePrice = basePrice * 1.5;
  }

  // Lamination multiplier
  if (specs.lamination === 'Matte' || specs.lamination === 'Gloss') {
    basePrice = basePrice * 1.2;
  }

  // Cover / Binding flat adjustments
  if (specs.cover === 'Hard Cover') {
    basePrice = basePrice + 500;
  }

  if (specs.binding === 'Perfect Binding') {
    basePrice = basePrice + 300;
  }

  // Stock / Corner adjustments
  if (specs.stock && specs.stock.includes('600gsm')) {
    basePrice = basePrice + 20;
  }
  if (specs.corners === 'Rounded') {
    basePrice = basePrice + 10;
  }

  const unitPrice = Math.round(basePrice);
  const subtotal = unitPrice * Math.max(1, quantity);

  return { unitPrice, subtotal, isCustomQuote: false };
}


