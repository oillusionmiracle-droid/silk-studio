import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { calculateDynamicPricing, type DbProduct, type DbVariant } from '../lib/pricing';

describe('PHASE 12 — PRICING BUSINESS LOGIC TESTS', () => {
  const sampleProduct: DbProduct = {
    id: 'prod-flyer-001',
    title: 'Flyers & Handbills',
    slug: 'flyers',
    category: 'PRINT',
    description: 'Marketing flyers',
    price: 100, // ₦100 base
    pricing_type: 'tier',
    config_schema: {},
    is_active: true,
  };

  const sampleInactiveProduct: DbProduct = {
    ...sampleProduct,
    id: 'prod-inactive-002',
    is_active: false,
  };

  const sampleVariants: DbVariant[] = [
    {
      id: 'var-xl-001',
      product_id: 'prod-tshirt-002',
      name: 'Black XL',
      price: 8500,
      stock: 25,
      options: { size: 'XL', color: 'Black' },
    },
  ];

  test('normal price calculation with base rate and standard specs', () => {
    const result = calculateDynamicPricing({
      product: sampleProduct,
      quantity: 100,
      specs: { size: 'A5', sides: 'Single-sided', lamination: 'None' },
    });

    assert.equal(result.isCustomQuote, false);
    assert.equal(result.unitPrice, 100);
    assert.equal(result.subtotal, 10000);
  });

  test('price calculation handles quantity multiplier correctly', () => {
    const result = calculateDynamicPricing({
      product: sampleProduct,
      quantity: 500,
      specs: { size: 'A5', sides: 'Single-sided', lamination: 'None' },
    });

    assert.equal(result.subtotal, 50000);
  });

  test('calculates formula adjustments: A4 size (1.8x) and Double-sided (1.5x)', () => {
    const result = calculateDynamicPricing({
      product: sampleProduct,
      quantity: 100,
      specs: { size: 'A4', sides: 'Double-sided', lamination: 'None' },
    });

    // 100 * 1.8 = 180 * 1.5 = 270 unitPrice
    assert.equal(result.unitPrice, 270);
    assert.equal(result.subtotal, 27000);
  });

  test('calculates variant-based price when matching variant exists', () => {
    const apparelProduct: DbProduct = {
      id: 'prod-tshirt-002',
      title: 'Custom T-Shirts',
      slug: 'custom-tshirts',
      category: 'APPAREL',
      description: 'Cotton T-Shirt',
      price: 6500,
      pricing_type: 'tier',
      is_active: true,
    };

    const result = calculateDynamicPricing({
      product: apparelProduct,
      variants: sampleVariants,
      quantity: 10,
      specs: { size: 'XL', color: 'Black' },
    });

    assert.equal(result.unitPrice, 8500);
    assert.equal(result.subtotal, 85000);
  });

  test('treats invalid quantity (zero or negative) safely with minimum 1 unit', () => {
    const resultZero = calculateDynamicPricing({
      product: sampleProduct,
      quantity: 0,
      specs: { size: 'A5', sides: 'Single-sided', lamination: 'None' },
    });
    assert.equal(resultZero.subtotal, 100);

    const resultNegative = calculateDynamicPricing({
      product: sampleProduct,
      quantity: -5,
      specs: { size: 'A5', sides: 'Single-sided', lamination: 'None' },
    });
    assert.equal(resultNegative.subtotal, 100);
  });

  test('flags inactive product as custom quote / non-purchasable', () => {
    const result = calculateDynamicPricing({
      product: sampleInactiveProduct,
      quantity: 100,
      specs: { size: 'A5' },
    });

    assert.equal(result.isCustomQuote, true);
    assert.equal(result.subtotal, 0);
  });

  test('flags null or undefined product gracefully without crashing', () => {
    const result = calculateDynamicPricing({
      product: null,
      quantity: 100,
      specs: {},
    });

    assert.equal(result.isCustomQuote, true);
    assert.equal(result.subtotal, 0);
  });

  test('flex / billboard sqft calculations dynamically calculate width * height * rate', () => {
    const flexProduct: DbProduct = {
      id: 'prod-flex-003',
      title: 'Billboards & Flex',
      slug: 'flex-billboards',
      category: 'PRINT',
      description: 'Outdoor prints',
      price: 450, // ₦450 per sqft
      pricing_type: 'unit',
      config_schema: { has_dimensions: true },
      is_active: true,
    };

    // 10ft * 5ft = 50 sqft * 450 = 22,500 + 500 (eyelets) = 23,000 * 2 banners = 46,000
    const result = calculateDynamicPricing({
      product: flexProduct,
      quantity: 2,
      specs: { width: 10, height: 5, eyelets: 'Yes' },
    });

    assert.equal(result.unitPrice, 23000);
    assert.equal(result.subtotal, 46000);
  });

  test('banners charge N700 per sqft: 1x1 = 700', () => {
    const bannerProduct: DbProduct = {
      id: 'prod-banner-002',
      title: 'Banners',
      slug: 'rollup-banners',
      category: 'PRINT',
      description: 'Banners',
      price: 700,
      pricing_type: 'unit',
      config_schema: { has_dimensions: true, pricing_unit: 'sqft' },
      is_active: true,
    };

    const oneByOne = calculateDynamicPricing({
      product: bannerProduct,
      quantity: 1,
      specs: { width: 1, height: 1, eyelets: 'No' },
    });
    assert.equal(oneByOne.unitPrice, 700);
    assert.equal(oneByOne.subtotal, 700);

    const sevenByThree = calculateDynamicPricing({
      product: bannerProduct,
      quantity: 1,
      specs: { width: 7, height: 3, eyelets: 'No' },
    });
    assert.equal(sevenByThree.unitPrice, 14700);
    assert.equal(sevenByThree.subtotal, 14700);
  });

  test('letterheads: standard 50 = 12000, brown 50 = 18000, min 50', () => {
    const letterProduct: DbProduct = {
      id: 'prod-letter-007',
      title: 'Letterheads',
      slug: 'letterheads',
      category: 'PRINT',
      description: 'Letterheads',
      price: 240,
      pricing_type: 'tier',
      config_schema: { min_quantity: 50 },
      is_active: true,
    };

    const standard50 = calculateDynamicPricing({
      product: letterProduct,
      quantity: 50,
      specs: { paperType: 'Standard' },
    });
    assert.equal(standard50.unitPrice, 240);
    assert.equal(standard50.subtotal, 12000);

    const brown50 = calculateDynamicPricing({
      product: letterProduct,
      quantity: 50,
      specs: { paperType: 'Brown' },
    });
    assert.equal(brown50.unitPrice, 360);
    assert.equal(brown50.subtotal, 18000);

    const belowMin = calculateDynamicPricing({
      product: letterProduct,
      quantity: 1,
      specs: { paperType: 'Standard' },
    });
    assert.equal(belowMin.subtotal, 12000);
  });

  test('event merch set is custom quote (brief only)', () => {
    const merchProduct: DbProduct = {
      id: 'prod-merch-005',
      title: 'Event Merch Set',
      slug: 'event-merch',
      category: 'APPAREL',
      description: 'Merch',
      price: 0,
      pricing_type: 'custom_quote',
      is_active: true,
    };

    const result = calculateDynamicPricing({
      product: merchProduct,
      quantity: 10,
      specs: {},
    });
    assert.equal(result.isCustomQuote, true);
    assert.equal(result.subtotal, 0);
  });
});

describe('PHASE 12 — ORDER VALIDATION & AUTHORITY LOGIC TESTS', () => {
  // Simulates server-side validateAndCalculateOrder logic
  function validateOrderPayload(orderData: {
    items: Array<{ product_id?: string; variant_id?: string; quantity: number; price?: number }>;
    dbProducts: Map<string, DbProduct>;
    dbVariants: Map<string, DbVariant>;
  }) {
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item.');
    }

    let subtotal = 0;
    for (const item of orderData.items) {
      if (item.quantity <= 0) {
        throw new Error(`Invalid item quantity: ${item.quantity}`);
      }

      if (item.variant_id) {
        const variant = orderData.dbVariants.get(item.variant_id);
        if (!variant) throw new Error(`Variant '${item.variant_id}' not found.`);
        if (variant.stock !== undefined && variant.stock < item.quantity) {
          throw new Error('Insufficient stock.');
        }
        subtotal += variant.price * item.quantity;
      } else if (item.product_id) {
        const product = orderData.dbProducts.get(item.product_id);
        if (!product) throw new Error(`Product '${item.product_id}' not found.`);
        if (!product.is_active) throw new Error(`Product '${product.title}' is inactive.`);
        subtotal += product.price * item.quantity;
      } else {
        throw new Error('Each item must specify a valid product or variant ID.');
      }
    }

    return { subtotal, verifiedTotal: subtotal };
  }

  const dbProducts = new Map<string, DbProduct>([
    ['p1', { id: 'p1', title: 'A5 Flyers', slug: 'flyers', category: 'PRINT', description: '', price: 15000, pricing_type: 'tier', is_active: true }],
    ['p2-inactive', { id: 'p2-inactive', title: 'Old Banner', slug: 'old', category: 'PRINT', description: '', price: 20000, pricing_type: 'unit', is_active: false }],
  ]);

  const dbVariants = new Map<string, DbVariant>([
    ['v1', { id: 'v1', product_id: 'p1', name: 'Standard', price: 15000, stock: 5 }],
  ]);

  test('valid order calculates authoritative total strictly from database', () => {
    const res = validateOrderPayload({
      items: [{ product_id: 'p1', quantity: 2, price: 500 }], // client attempts manipulated price: 500
      dbProducts,
      dbVariants,
    });

    assert.equal(res.subtotal, 30000); // 15000 * 2, ignoring client price 500
  });

  test('rejects order with zero or negative quantity', () => {
    assert.throws(() => {
      validateOrderPayload({
        items: [{ product_id: 'p1', quantity: 0 }],
        dbProducts,
        dbVariants,
      });
    }, /Invalid item quantity/);

    assert.throws(() => {
      validateOrderPayload({
        items: [{ product_id: 'p1', quantity: -3 }],
        dbProducts,
        dbVariants,
      });
    }, /Invalid item quantity/);
  });

  test('rejects order for non-existent product or variant', () => {
    assert.throws(() => {
      validateOrderPayload({
        items: [{ product_id: 'non-existent-999', quantity: 1 }],
        dbProducts,
        dbVariants,
      });
    }, /Product 'non-existent-999' not found/);
  });

  test('rejects order for inactive product', () => {
    assert.throws(() => {
      validateOrderPayload({
        items: [{ product_id: 'p2-inactive', quantity: 1 }],
        dbProducts,
        dbVariants,
      });
    }, /is inactive/);
  });
});

describe('PHASE 12 — PAYMENT VERIFICATION & IDEMPOTENCY TESTS', () => {
  function verifyPayment(order: { id: string; status: string; total: number }, paystackResponse: { reference: string; amountInKobo: number; currency: string }) {
    if (order.status === 'paid' || order.status === 'confirmed') {
      return { status: 'already_paid', idempotent: true };
    }

    if (paystackResponse.currency !== 'NGN') {
      throw new Error(`Currency mismatch: ${paystackResponse.currency}`);
    }

    const paidNaira = paystackResponse.amountInKobo / 100;
    if (paidNaira < order.total) {
      throw new Error(`Payment mismatch: received ₦${paidNaira}, expected ₦${order.total}`);
    }

    return { status: 'paid', idempotent: false };
  }

  test('accepts payment when amount and currency match', () => {
    const order = { id: 'ord-101', status: 'pending', total: 25000 };
    const paystack = { reference: 'SLK-REF-1', amountInKobo: 2500000, currency: 'NGN' };

    const res = verifyPayment(order, paystack);
    assert.equal(res.status, 'paid');
  });

  test('rejects payment when currency is not NGN', () => {
    const order = { id: 'ord-102', status: 'pending', total: 25000 };
    const paystack = { reference: 'SLK-REF-2', amountInKobo: 2500000, currency: 'USD' };

    assert.throws(() => verifyPayment(order, paystack), /Currency mismatch/);
  });

  test('rejects payment when paid amount is less than order total', () => {
    const order = { id: 'ord-103', status: 'pending', total: 25000 };
    const paystack = { reference: 'SLK-REF-3', amountInKobo: 500000, currency: 'NGN' }; // only ₦5,000 paid

    assert.throws(() => verifyPayment(order, paystack), /Payment mismatch/);
  });

  test('verification is idempotent and skips duplicate processing for already-paid orders', () => {
    const order = { id: 'ord-104', status: 'paid', total: 25000 };
    const paystack = { reference: 'SLK-REF-4', amountInKobo: 2500000, currency: 'NGN' };

    const res = verifyPayment(order, paystack);
    assert.equal(res.status, 'already_paid');
    assert.equal(res.idempotent, true);
  });
});

describe('PHASE 12 — AUTHORIZATION AUDIT LOGIC TESTS', () => {
  function checkOrderAccess(currentUser: { id: string; role: string }, order: { user_id: string | null }) {
    if (currentUser.role === 'admin') return true;
    if (order.user_id && order.user_id === currentUser.id) return true;
    return false;
  }

  function checkAdminMutation(currentUser: { id: string; role: string }) {
    if (currentUser.role !== 'admin') {
      throw new Error('403 Forbidden: Administrator privileges required.');
    }
    return true;
  }

  test('customer can access their own order', () => {
    const customer = { id: 'user-alice', role: 'customer' };
    const order = { user_id: 'user-alice' };

    assert.equal(checkOrderAccess(customer, order), true);
  });

  test('customer is blocked from accessing another customer order', () => {
    const customer = { id: 'user-alice', role: 'customer' };
    const orderOfBob = { user_id: 'user-bob' };

    assert.equal(checkOrderAccess(customer, orderOfBob), false);
  });

  test('admin can access any order', () => {
    const admin = { id: 'user-admin', role: 'admin' };
    const orderOfBob = { user_id: 'user-bob' };

    assert.equal(checkOrderAccess(admin, orderOfBob), true);
  });

  test('non-admin is rejected when attempting administrative mutations', () => {
    const customer = { id: 'user-alice', role: 'customer' };

    assert.throws(() => checkAdminMutation(customer), /403 Forbidden/);
  });

  test('admin is allowed to perform administrative mutations', () => {
    const admin = { id: 'user-admin', role: 'admin' };

    assert.equal(checkAdminMutation(admin), true);
  });
});

describe('PHASE 15 — DATA MODEL CONSISTENCY TESTS', () => {
  const dbIdCardProduct: DbProduct = {
    id: 'prod-idcard-01',
    title: 'Plastic ID Cards & Lanyards',
    slug: 'id-cards',
    category: 'PRINT',
    description: 'ID cards',
    price: 4500,
    pricing_type: 'tier',
    config_schema: {},
    is_active: true,
  };

  const dbIdCardVariants: DbVariant[] = [
    {
      id: 'var-idc-std',
      product_id: 'prod-idcard-01',
      name: 'Standard Plastic PVC Card',
      sku: 'IDC-STD',
      price: 4500,
      options: { idType: 'Standard' },
    },
    {
      id: 'var-idc-lanyard',
      product_id: 'prod-idcard-01',
      name: 'ID Card with Custom Lanyard & Holder',
      sku: 'IDC-LANYARD',
      price: 8000,
      options: { idType: 'Lanyard + Holder' },
    },
    {
      id: 'var-idc-reel',
      product_id: 'prod-idcard-01',
      name: 'ID Card with Badge Reel & Holder',
      sku: 'IDC-REEL',
      price: 10000,
      options: { idType: 'Badge Reel + Holder' },
    },
  ];

  test('single source of truth: DB variant price authoritatively determines price', () => {
    const resultStandard = calculateDynamicPricing({
      product: dbIdCardProduct,
      variants: dbIdCardVariants,
      quantity: 1,
      specs: { idType: 'Standard' },
    });
    assert.equal(resultStandard.unitPrice, 4500);

    const resultLanyard = calculateDynamicPricing({
      product: dbIdCardProduct,
      variants: dbIdCardVariants,
      quantity: 10,
      specs: { idType: 'Lanyard + Holder' },
    });
    assert.equal(resultLanyard.unitPrice, 8000);
    assert.equal(resultLanyard.subtotal, 80000);

    const resultReel = calculateDynamicPricing({
      product: dbIdCardProduct,
      variants: dbIdCardVariants,
      quantity: 2,
      specs: { idType: 'Badge Reel + Holder' },
    });
    assert.equal(resultReel.unitPrice, 10000);
    assert.equal(resultReel.subtotal, 20000);
  });

  test('id card fallback pricing without variants: standard 4500 / lanyard 8000 / reel 10000', () => {
    const lanyard = calculateDynamicPricing({
      product: dbIdCardProduct,
      variants: [],
      quantity: 1,
      specs: { idType: 'Lanyard + Holder' },
    });
    assert.equal(lanyard.unitPrice, 8000);

    const reel = calculateDynamicPricing({
      product: dbIdCardProduct,
      variants: [],
      quantity: 1,
      specs: { idType: 'Badge Reel + Holder' },
    });
    assert.equal(reel.unitPrice, 10000);
  });

  test('formula engine reliably computes base price when variant is absent', () => {
    const resultGeneric = calculateDynamicPricing({
      product: dbIdCardProduct,
      variants: [],
      quantity: 2,
      specs: { idType: 'Standard' },
    });
    // Base price is 4500
    assert.equal(resultGeneric.unitPrice, 4500);
    assert.equal(resultGeneric.subtotal, 9000);
  });
});


