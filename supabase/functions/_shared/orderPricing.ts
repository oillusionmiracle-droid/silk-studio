import { calculateDynamicPricing, type DbProduct, type DbVariant } from './pricing.ts';

export function positiveQuantity(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1 || value > 100000) {
    throw new Error('Quantity must be a positive integer no greater than 100000.');
  }
  return value;
}

export function priceCustomOrder(product: DbProduct, variants: DbVariant[], quantity: unknown, options: unknown, payFull: unknown) {
  if (!product || product.is_active === false) throw new Error('Product is unavailable.');
  if (!['PRINT', 'APPAREL', 'DESIGN', 'WEB', 'BUNDLES'].includes(product.category)) {
    throw new Error('Select an order service, not a shop product.');
  }
  const qty = positiveQuantity(quantity);
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new Error('Structured order options are required.');
  const specs = options as Record<string, unknown>;
  const choices: Record<string, string[]> = {
    size: ['A5', 'A4', 'A3'], sides: ['Single-sided', 'Double-sided'],
    lamination: ['None', 'Matte', 'Gloss'], eyelets: ['Yes', 'No'],
    innerSheets: ['Plain', 'Ruled'], binding: ['Spiral', 'Perfect Binding'],
    cover: ['Soft Cover', 'Hard Cover'], idType: ['Standard', 'Lanyard + Holder', 'Badge Reel + Holder'],
    stock: ['Standard 300gsm', 'Super Thick 600gsm'], corners: ['Square', 'Rounded'],
    paperType: ['Standard', 'Brown'],
  };
  for (const [key, values] of Object.entries(choices)) {
    if (specs[key] !== undefined && (typeof specs[key] !== 'string' || !values.includes(specs[key] as string))) {
      throw new Error(`Invalid ${key} option.`);
    }
  }
  for (const key of ['width', 'height']) {
    if (specs[key] !== undefined && (typeof specs[key] !== 'number' || !Number.isFinite(specs[key]) || (specs[key] as number) < 1 || (specs[key] as number) > 1000)) {
      throw new Error(`Invalid ${key}.`);
    }
  }
  const slug = product.slug || '';
  const required: Record<string, string[]> = {
    flyers: ['size', 'sides', 'lamination'],
    'business-cards': ['stock', 'lamination', 'corners'],
    jotters: ['innerSheets', 'lamination', 'binding', 'cover'],
    'id-cards': ['idType'], letterheads: ['paperType'],
  };
  const keys = product.config_schema?.has_dimensions || ['banners', 'rollup-banners', 'flex-billboards'].includes(slug)
    ? ['width', 'height', 'eyelets'] : required[slug] || [];
  for (const key of keys) if (specs[key] === undefined) throw new Error(`Missing ${key} option.`);
  if (['custom-tshirts', 'custom-sweatshirts', 'custom-joggers', 'custom-hoodies'].includes(slug)) {
    const sizes = specs.apparelSizes as Record<string, unknown> | undefined;
    if (!sizes || typeof sizes !== 'object' || Array.isArray(sizes)) throw new Error('Apparel sizes are required.');
    let count = 0;
    for (const key of ['S', 'M', 'L', 'XL', 'XXL']) {
      const value = sizes[key];
      if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw new Error('Invalid apparel size quantity.');
      count += value;
    }
    if (count !== qty) throw new Error('Size quantities must match the order quantity.');
  }
  if (payFull !== undefined && typeof payFull !== 'boolean') throw new Error('Invalid payment choice.');
  const result = calculateDynamicPricing({ product, variants, quantity: qty, specs });
  if (!Number.isSafeInteger(result.subtotal) || result.subtotal < 0 || (!result.isCustomQuote && result.subtotal === 0)) {
    throw new Error('Product does not have a valid price.');
  }
  return {
    total: result.subtotal,
    isCustomQuote: result.isCustomQuote,
    requiredAmount: result.isCustomQuote ? 0 : Math.round(payFull === false ? result.subtotal * 0.75 : result.subtotal),
  };
}
