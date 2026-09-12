'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { calculateDynamicPricing, matchProductForSubService, type DbProduct, type DbVariant } from '@/lib/pricing';
import { OrderSpecs, ContactInfo, OrderCategoryItem } from '@/lib/order/types';
import { validateOrderSubmission } from '@/lib/validation/orderValidation';
import {
  formatSpecsText,
  formatOrderMessage,
  launchPaystackPayment,
  submitServerOrder,
} from '@/lib/order/orderService';

import ProductSelector, {
  DEFAULT_CATEGORIES,
  DEFAULT_SUB_SERVICES,
} from '@/components/order/ProductSelector';
import ProductConfiguration from '@/components/order/ProductConfiguration';
import OrderDetailsForm from '@/components/order/OrderDetailsForm';
import PricingSummary from '@/components/order/PricingSummary';
import OrderConfirmation from '@/components/order/OrderConfirmation';
import { Package } from 'lucide-react';

const INITIAL_SPECS: OrderSpecs = {
  size: 'A5',
  sides: 'Single-sided',
  lamination: 'None',
  quantity: 100,
  width: 7,
  height: 3,
  eyelets: 'No',
  innerSheets: 'Plain',
  binding: 'Spiral',
  cover: 'Soft Cover',
  idType: 'Standard',
  stock: 'Standard 300gsm',
  corners: 'Square',
  paperType: 'Standard',
  apparelSizes: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
  deadline: '',
  description: '',
};

const INITIAL_CONTACT: ContactInfo = {
  firstName: '',
  lastName: '',
  whatsapp: '+234',
  email: '',
  source: '',
};

export default function OrderPage() {
  const { user, profile, openAuthModal } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [subService, setSubService] = useState<string | null>(null);
  const [referenceFileUrl, setReferenceFileUrl] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [specs, setSpecs] = useState<OrderSpecs>(INITIAL_SPECS);
  const [contact, setContact] = useState<ContactInfo>(INITIAL_CONTACT);

  const [total, setTotal] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [isCustomQuote, setIsCustomQuote] = useState(true);
  const [payFull, setPayFull] = useState(false);

  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);
  const [dbVariants, setDbVariants] = useState<DbVariant[]>([]);

  // Autofill contact info from user profile
  useEffect(() => {
    if (profile) {
      const parts = (profile.full_name || '').split(' ');
      const fName = parts[0] || '';
      const lName = parts.slice(1).join(' ') || '';
      setContact((prev) => ({
        ...prev,
        firstName: prev.firstName || fName,
        lastName: prev.lastName || lName,
        whatsapp: prev.whatsapp === '+234' && profile.phone ? profile.phone : prev.whatsapp,
        email: prev.email || user?.email || '',
      }));
    }
  }, [profile, user]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch active database catalog
  useEffect(() => {
    async function loadDbCatalog() {
      // NOTE: Using .neq('is_active', false) instead of .eq('is_active', true)
      // because the is_active column may be NULL on many products (it was added
      // via CREATE TABLE but the table already existed, so the column defaulted
      // to NULL rather than true for existing rows).
      // neq(false) matches both TRUE and NULL — so all real products are included.
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .neq('is_active', false)
        .order('display_order', { ascending: true });

      if (productsData && productsData.length > 0) {
        setDbProducts(productsData as DbProduct[]);
      }

      const { data: variantsData } = await supabase.from('variants').select('*');
      if (variantsData && variantsData.length > 0) {
        setDbVariants(variantsData as DbVariant[]);
      }
    }
    void loadDbCatalog();
  }, []);

  // Shop-apparel categories (lowercase single-word) belong ONLY to the /apparel
  // store. They must never appear as tiles or sub-services on the /order page.
  const SHOP_ONLY_CATEGORIES = ['tee', 'shirt', 'hoodie', 'cap'];

  // Map uppercase DB service categories onto the canonical default tiles so the
  // seeded order-service rows (PRINT/APPAREL/DESIGN/WEB/BUNDLES) fold into the
  // existing Print/Apparel/Design/Web/Bundle tiles instead of creating duplicates.
  const DB_CATEGORY_TO_TILE: Record<string, string> = {
    PRINT: 'Print',
    APPAREL: 'Apparel',
    DESIGN: 'Design',
    WEB: 'Web',
    BUNDLES: 'Bundle',
  };
  const mapCategoryToTile = (category: string) =>
    DB_CATEGORY_TO_TILE[category.toUpperCase()] ||
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  // Dynamically map categories: start from the static catalog, overlay DB rows.
  const activeCategories = useMemo(() => {
    const catMap = new Map<string, OrderCategoryItem>();
    DEFAULT_CATEGORIES.forEach((c) => catMap.set(c.id, c));
    dbProducts.forEach((p) => {
      const cat = (p.category || '').trim();
      if (!cat || SHOP_ONLY_CATEGORIES.includes(cat.toLowerCase())) return;
      const formattedCat = mapCategoryToTile(cat);
      if (!catMap.has(formattedCat)) {
        const foundBase = DEFAULT_CATEGORIES.find(
          (c) => c.id.toLowerCase() === formattedCat.toLowerCase()
        );
        catMap.set(formattedCat, {
          id: formattedCat,
          label: formattedCat,
          icon: foundBase ? foundBase.icon : <Package size={22} />,
        });
      }
    });
    return Array.from(catMap.values());
  }, [dbProducts]);

  // Dynamically map sub-services: start from the static catalog, overlay DB rows.
  const activeSubServices = useMemo(() => {
    const map: Record<string, string[]> = {};
    Object.keys(DEFAULT_SUB_SERVICES).forEach((cat) => {
      map[cat] = [...DEFAULT_SUB_SERVICES[cat]];
    });
    dbProducts.forEach((p) => {
      const cat = (p.category || '').trim();
      if (!cat || SHOP_ONLY_CATEGORIES.includes(cat.toLowerCase())) return;
      const formattedCat = mapCategoryToTile(cat);
      if (!map[formattedCat]) map[formattedCat] = [];
      // Use title or name — some products only have one of the two
      const productName = p.title || (p as any).name || '';
      if (productName && !map[formattedCat].includes(productName)) {
        map[formattedCat].push(productName);
      }
    });
    return map;
  }, [dbProducts]);

  const updateSpec = <K extends keyof OrderSpecs>(key: K, value: OrderSpecs[K]) =>
    setSpecs((prev) => ({ ...prev, [key]: value }));

  const updateApparelSize = (size: string, value: number) =>
    setSpecs((prev) => ({
      ...prev,
      apparelSizes: { ...prev.apparelSizes, [size]: Math.max(0, value) },
    }));

  const updateContact = <K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) =>
    setContact((prev) => ({ ...prev, [key]: value }));

  const totalApparelQty = Object.values(specs.apparelSizes).reduce((a, b) => a + b, 0);

  // Dynamic pricing calculation
  useEffect(() => {
    if (!subService) {
      setIsCustomQuote(true);
      setTotal(0);
      setDeposit(0);
      return;
    }

    const currentDbProd = matchProductForSubService(subService, dbProducts);

    if (currentDbProd) {
      const prodVariants = dbVariants.filter((v) => v.product_id === currentDbProd.id);
      const isApparel =
        subService.toLowerCase().includes('t-shirt') ||
        subService.toLowerCase().includes('sweatshirt') ||
        subService.toLowerCase().includes('jogger') ||
        subService.toLowerCase().includes('hoodie');

      const qty = isApparel ? totalApparelQty : specs.quantity;

      const { subtotal, isCustomQuote: isQuote } = calculateDynamicPricing({
        product: currentDbProd,
        variants: prodVariants,
        quantity: qty,
        specs,
      });

      setIsCustomQuote(isQuote);
      setTotal(subtotal);
      setDeposit(Math.round(subtotal * 0.75));
      return;
    }

    setIsCustomQuote(true);
    setTotal(0);
    setDeposit(0);
  }, [subService, specs, totalApparelQty, dbProducts, dbVariants]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Order submission
  const handleSubmit = async () => {
    if (isSubmitting) return;

    const validation = validateOrderSubmission(contact, subService, isCustomQuote);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setIsSubmitting(true);

    try {
      const fallbackOrderRef = `SLK-CUST-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(fallbackOrderRef);

      const specsText = formatSpecsText(subService!, specs);
      const isApparel = ['Custom T-Shirts', 'Sweatshirts', 'Grey Joggers', 'Hoodies'].includes(
        subService!
      );
      const orderQty = isApparel ? totalApparelQty : specs.quantity;

      const currentProduct = matchProductForSubService(subService, dbProducts);

      const authoritativeRef = (await submitServerOrder({
        userId: user?.id,
        contact,
        subService: subService!,
        specsText,
        quantity: orderQty,
        specs,
        referenceFileUrl,
        currentProduct,
        isCustomQuote,
        total,
        deposit,
        payFull,
        fallbackOrderRef,
      })) || fallbackOrderRef;

      setSubmittedRef(authoritativeRef);

      const msg = formatOrderMessage({
        orderRef: authoritativeRef,
        subService: subService!,
        specsText,
        quantity: orderQty,
        specs,
        referenceFileUrl,
        contact,
        isCustomQuote,
        total,
        deposit,
      });

      if (isCustomQuote) {
        window.open(`https://wa.me/2347064829776?text=${encodeURIComponent(msg)}`, '_blank');
        setIsSubmitted(true);
        setIsSubmitting(false);
        return;
      }

      await launchPaystackPayment({
        orderRef: authoritativeRef,
        orderMessage: msg,
        contact,
        amount: payFull ? total : deposit,
        onSuccess: (paystackRef) => {
          const paidMsg = msg.replace(
            'Price:* Total: ₦',
            `Price:* Paid deposit via Paystack (Ref: ${paystackRef})\nTotal: ₦`
          );
          window.open(`https://wa.me/2347064829776?text=${encodeURIComponent(paidMsg)}`, '_blank');
          setIsSubmitted(true);
          setIsSubmitting(false);
        },
        onCancel: () => {
          setIsSubmitting(false);
        },
      });
    } catch (err) {
      console.error('Error submitting order:', err);
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <OrderConfirmation
        submittedRef={submittedRef}
        hasUser={Boolean(user)}
        onOpenAuthModal={openAuthModal}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        background: 'url(/images/order-bg.jpg) center/cover no-repeat',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(13,13,13,0.85)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: isMobile ? '100%' : 1200,
          margin: '0 auto',
          padding: isMobile ? '100px 16px 80px' : '140px 24px 60px',
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: isMobile ? 32 : 60, textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'var(--font-jakarta)',
              fontWeight: 900,
              fontSize: isMobile ? 36 : 56,
              lineHeight: 1.1,
              letterSpacing: '-1px',
              color: '#ffffff',
              marginBottom: 16,
            }}
          >
            Tell us what you need.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-general)',
              fontSize: 16,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Fill this in and we&apos;ll reach out within 2 hours. Deposit locks your slot.
          </p>
        </div>

        {/* MAIN FORM */}
        <div style={{ maxWidth: isMobile ? '100%' : 800, margin: isMobile ? '0' : '0 auto' }}>
          <ProductSelector
            categories={activeCategories}
            subServices={activeSubServices}
            category={category}
            subService={subService}
            isMobile={isMobile}
            onSelectCategory={(catId) => {
              setCategory(catId);
              setSubService(null);
            }}
            onSelectSubService={(sub) => {
              // Letterheads start at 50 units minimum.
              if (sub === 'Letterheads') {
                setSpecs((prev) => ({
                  ...prev,
                  paperType: prev.paperType || 'Standard',
                  quantity: Math.max(50, prev.quantity || 0),
                }));
              }
              setSubService(sub);
            }}
          />

          {subService && (
            <>
              <ProductConfiguration
                subService={subService}
                specs={specs}
                isMobile={isMobile}
                totalApparelQty={totalApparelQty}
                onUpdateSpec={updateSpec}
                onUpdateApparelSize={updateApparelSize}
              />

              <OrderDetailsForm
                specs={specs}
                contact={contact}
                isMobile={isMobile}
                onUpdateSpec={updateSpec}
                onUpdateContact={updateContact}
                onUploadReference={(url) => setReferenceFileUrl(url)}
              />
            </>
          )}
        </div>
      </div>

      <PricingSummary
        isMobile={isMobile}
        subService={subService}
        isCustomQuote={isCustomQuote}
        total={total}
        deposit={deposit}
        payFull={payFull}
        specs={specs}
        totalApparelQty={totalApparelQty}
        contact={contact}
        summaryOpen={summaryOpen}
        setSummaryOpen={setSummaryOpen}
        setPayFull={setPayFull}
        onSubmit={handleSubmit}
      />
    </div>
  );
}