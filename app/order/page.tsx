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
import { Package, Sun, Moon } from 'lucide-react';

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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
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

  // Shop-apparel categories belong ONLY to /apparel
  const SHOP_ONLY_CATEGORIES = ['tee', 'shirt', 'hoodie', 'cap'];

  const DB_CATEGORY_TO_TILE: Record<string, string> = {
    PRINT: 'Print',
    APPAREL: 'Apparel',
    DESIGN: 'Design',
    WEB: 'Web',
    BUNDLES: 'Bundle',
  };
  const mapCategoryToTile = (cat: string) =>
    DB_CATEGORY_TO_TILE[cat.toUpperCase()] ||
    cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();

  // Dynamically map categories
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

  // Dynamically map sub-services
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

      const authoritativeRef = await submitServerOrder({
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
      });

      if (!authoritativeRef) {
        alert('We could not create your order on the server. Please check your connection and try again.');
        setIsSubmitting(false);
        return;
      }

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

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#09090b' : '#f4f4f6',
        color: isDark ? '#ffffff' : '#111827',
        position: 'relative',
        transition: 'background-color 0.25s ease, color 0.25s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: '0 auto',
          padding: isMobile ? '80px 16px 140px' : '110px 24px 120px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* TOP HEADER - CLEAN "What do you need?" & THEME TOGGLE */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isMobile ? 24 : 36,
          }}
        >
          <h1
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, -apple-system, Arial, sans-serif",
              fontWeight: 800,
              fontSize: isMobile ? 28 : 42,
              letterSpacing: '-1.5px',
              color: isDark ? '#ffffff' : '#000000',
              margin: 0,
            }}
          >
            What do you need?
          </h1>

          {/* Theme Toggle Button */}
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
              color: isDark ? '#ffffff' : '#000000',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* ORDER BUILDER FORM */}
        <div>
          <ProductSelector
            categories={activeCategories}
            subServices={activeSubServices}
            category={category}
            subService={subService}
            isMobile={isMobile}
            theme={theme}
            onSelectCategory={(catId) => {
              setCategory(catId);
              setSubService(null);
            }}
            onSelectSubService={(sub) => {
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
                theme={theme}
                totalApparelQty={totalApparelQty}
                onUpdateSpec={updateSpec}
                onUpdateApparelSize={updateApparelSize}
              />

              <OrderDetailsForm
                specs={specs}
                contact={contact}
                isMobile={isMobile}
                theme={theme}
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
        theme={theme}
        setSummaryOpen={setSummaryOpen}
        setPayFull={setPayFull}
        onSubmit={handleSubmit}
      />
    </div>
  );
}