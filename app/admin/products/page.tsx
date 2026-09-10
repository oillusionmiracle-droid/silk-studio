'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
  AlertTriangle,
  ImagePlus,
  Info,
  Loader2,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
} from 'lucide-react';
import AdminProductEditor, {
  ProductRecord,
  ProductForm,
  ProductVariant,
} from '@/components/admin/AdminProductEditor';
import AdminServiceEditor, {
  ServiceRecord,
  ServiceForm,
  ALWAYS_CUSTOM_QUOTE_CATEGORIES,
} from '@/components/admin/AdminServiceEditor';

// ─── Apparel shop item categories (lowercase single-word) ─────────────────────
const APPAREL_CATEGORIES = ['tee', 'shirt', 'hoodie', 'cap'];

// ─── Order service categories (uppercase, from migration seed) ─────────────────
const SERVICE_CATEGORIES = ['PRINT', 'APPAREL', 'DESIGN', 'WEB', 'BUNDLES'];
const SERVICE_CATEGORY_LABELS: Record<string, string> = {
  PRINT: 'Print',
  APPAREL: 'Apparel (Custom Orders)',
  DESIGN: 'Design',
  WEB: 'Web',
  BUNDLES: 'Bundles',
};
const SERVICE_CATEGORY_COLORS: Record<string, string> = {
  PRINT: 'bg-blue-50 text-blue-700',
  APPAREL: 'bg-violet-50 text-violet-700',
  DESIGN: 'bg-amber-50 text-amber-700',
  WEB: 'bg-emerald-50 text-emerald-700',
  BUNDLES: 'bg-rose-50 text-rose-700',
};

// ─── Apparel tab empty form ────────────────────────────────────────────────────
const EMPTY_APPAREL_FORM: ProductForm = {
  name: '',
  category: 'tee',
  price: '',
  description: '',
  image_1_url: '',
  image_2_url: '',
  is_featured: false,
  is_new_arrival: false,
  variants: [{ sku: '', size: 'M', color: '', stock: 0 }],
};

function stockTotal(product: ProductRecord) {
  return product.variants.reduce((total, variant) => total + (Number(variant.stock) || 0), 0);
}

function hasLowStock(product: ProductRecord) {
  return product.variants.some((variant) => Number(variant.stock) < 5);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState<'apparel' | 'services'>('apparel');

  // ── Apparel state ────────────────────────────────────────────────────────────
  const [apparelProducts, setApparelProducts] = useState<ProductRecord[]>([]);
  const [apparelLoading, setApparelLoading] = useState(true);
  const [apparelError, setApparelError] = useState<string | null>(null);
  const [apparelSearch, setApparelSearch] = useState('');
  const [apparelCategoryFilter, setApparelCategoryFilter] = useState('all');
  const [isApparelEditorOpen, setIsApparelEditorOpen] = useState(false);
  const [editingApparel, setEditingApparel] = useState<ProductRecord | null>(null);
  const [apparelForm, setApparelForm] = useState<ProductForm>(EMPTY_APPAREL_FORM);
  const [isApparelSaving, setIsApparelSaving] = useState(false);
  const [deletingApparelId, setDeletingApparelId] = useState<string | null>(null);

  // ── Order Services state ─────────────────────────────────────────────────────
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [servicesSearch, setServicesSearch] = useState('');
  const [servicesCategoryFilter, setServicesCategoryFilter] = useState('all');
  const [isServiceEditorOpen, setIsServiceEditorOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceForm>({
    price: '',
    pricing_type: 'tier',
    is_custom_quote: false,
  });
  const [isServiceSaving, setIsServiceSaving] = useState(false);

  // ── Load apparel products ────────────────────────────────────────────────────
  async function loadApparelProducts() {
    setApparelLoading(true);
    setApparelError(null);
    const { data, error } = await supabase
      .from('products')
      .select('*, variants(*)')
      .in('category', APPAREL_CATEGORIES)
      .order('created_at', { ascending: false });

    if (error) setApparelError(error.message);
    else setApparelProducts((data || []) as ProductRecord[]);
    setApparelLoading(false);
  }

  // ── Load order services ──────────────────────────────────────────────────────
  async function loadServices() {
    setServicesLoading(true);
    setServicesError(null);
    const { data, error } = await supabase
      .from('products')
      .select('id, title, name, slug, category, price, pricing_type, is_custom_quote, description')
      .in('category', SERVICE_CATEGORIES)
      .order('category', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) setServicesError(error.message);
    else setServices((data || []) as ServiceRecord[]);
    setServicesLoading(false);
  }

  useEffect(() => {
    void loadApparelProducts();
    void loadServices();
  }, []);

  // ── Filtered lists ───────────────────────────────────────────────────────────
  const filteredApparel = apparelProducts.filter((p) => {
    const matchesCat = apparelCategoryFilter === 'all' || p.category === apparelCategoryFilter;
    const q = apparelSearch.toLowerCase();
    return matchesCat && (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  });

  const filteredServices = services.filter((s) => {
    const matchesCat = servicesCategoryFilter === 'all' || s.category === servicesCategoryFilter;
    const q = servicesSearch.toLowerCase();
    const name = (s.title || s.name || '').toLowerCase();
    return matchesCat && (name.includes(q) || s.category.toLowerCase().includes(q));
  });

  // ── Apparel CRUD ─────────────────────────────────────────────────────────────
  function openApparelCreate() {
    setEditingApparel(null);
    setApparelForm(EMPTY_APPAREL_FORM);
    setIsApparelEditorOpen(true);
  }

  function openApparelEdit(product: ProductRecord) {
    setEditingApparel(product);
    setApparelForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      description: product.description || '',
      image_1_url: product.image_1_url || '',
      image_2_url: product.image_2_url || '',
      is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival,
      variants: product.variants.length
        ? product.variants.map((v) => ({ ...v, color: v.color || '' }))
        : [{ sku: '', size: 'M', color: '', stock: 0 }],
    });
    setIsApparelEditorOpen(true);
  }

  function updateApparelForm<K extends keyof ProductForm>(field: K, value: ProductForm[K]) {
    setApparelForm((cur) => ({ ...cur, [field]: value }));
  }

  function updateApparelVariant(index: number, field: keyof ProductVariant, value: string | number) {
    setApparelForm((cur) => ({
      ...cur,
      variants: cur.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }));
  }

  function addApparelVariant() {
    updateApparelForm('variants', [...apparelForm.variants, { sku: '', size: 'M', color: '', stock: 0 }]);
  }

  function removeApparelVariant(index: number) {
    if (apparelForm.variants.length === 1) return;
    updateApparelForm('variants', apparelForm.variants.filter((_, i) => i !== index));
  }

  async function saveApparelProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !apparelForm.name.trim() ||
      !apparelForm.price ||
      apparelForm.variants.some((v) => !v.sku.trim())
    ) {
      setApparelError('Product name, price, and a SKU for every variant are required.');
      return;
    }

    setIsApparelSaving(true);
    setApparelError(null);

    const payload = {
      name: apparelForm.name.trim(),
      category: apparelForm.category,
      price: Number(apparelForm.price),
      description: apparelForm.description.trim() || null,
      image_1_url: apparelForm.image_1_url.trim() || null,
      image_2_url: apparelForm.image_2_url.trim() || null,
      is_featured: apparelForm.is_featured,
      is_new_arrival: apparelForm.is_new_arrival,
    };

    try {
      let productId = editingApparel?.id;
      const q = editingApparel
        ? await supabase.from('products').update(payload).eq('id', editingApparel.id).select('id').single()
        : await supabase.from('products').insert(payload).select('id').single();

      if (q.error) throw q.error;
      productId = q.data.id;

      if (editingApparel) {
        const { error: delErr } = await supabase.from('variants').delete().eq('product_id', productId);
        if (delErr) throw delErr;
      }

      const { error: varErr } = await supabase.from('variants').insert(
        apparelForm.variants.map((v) => ({
          product_id: productId,
          sku: v.sku.trim(),
          size: v.size.trim(),
          color: v.color.trim() || null,
          stock: Math.max(0, Number(v.stock) || 0),
        }))
      );
      if (varErr) throw varErr;

      setIsApparelEditorOpen(false);
      await loadApparelProducts();
    } catch (err) {
      setApparelError(err instanceof Error ? err.message : 'Unable to save product.');
    } finally {
      setIsApparelSaving(false);
    }
  }

  async function deleteApparelProduct(product: ProductRecord) {
    if (!window.confirm(`Delete ${product.name}? This also removes its variants.`)) return;
    setDeletingApparelId(product.id);
    setApparelError(null);
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (error) setApparelError(error.message);
    else setApparelProducts((cur) => cur.filter((p) => p.id !== product.id));
    setDeletingApparelId(null);
  }

  // ── Service CRUD ─────────────────────────────────────────────────────────────
  function openServiceEdit(service: ServiceRecord) {
    setEditingService(service);
    setServiceForm({
      price: String(service.price),
      pricing_type: service.pricing_type || 'tier',
      is_custom_quote: service.is_custom_quote || ALWAYS_CUSTOM_QUOTE_CATEGORIES.includes(service.category),
    });
    setIsServiceEditorOpen(true);
  }

  function updateServiceForm<K extends keyof ServiceForm>(field: K, value: ServiceForm[K]) {
    setServiceForm((cur) => ({ ...cur, [field]: value }));
  }

  async function saveService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingService) return;

    setIsServiceSaving(true);
    setServicesError(null);

    const isAlwaysCustom = ALWAYS_CUSTOM_QUOTE_CATEGORIES.includes(editingService.category);

    const payload: Record<string, unknown> = {
      is_custom_quote: isAlwaysCustom ? true : serviceForm.is_custom_quote,
      pricing_type: isAlwaysCustom ? 'custom_quote' : serviceForm.pricing_type,
    };

    // Only update price if the service has a real price
    if (!isAlwaysCustom && !serviceForm.is_custom_quote && serviceForm.pricing_type !== 'custom_quote') {
      payload.price = Number(serviceForm.price) || 0;
    }

    try {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingService.id);

      if (error) throw error;
      setIsServiceEditorOpen(false);
      await loadServices();
    } catch (err) {
      setServicesError(err instanceof Error ? err.message : 'Unable to save service.');
    } finally {
      setIsServiceSaving(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 font-sans">
      {/* Tab switcher */}
      <div className="rounded-[24px] bg-white border border-neutral-200/80 p-2 shadow-xs flex gap-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('apparel')}
          className={`px-5 py-2.5 rounded-[18px] text-[13px] font-bold transition-all ${
            activeTab === 'apparel'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          👕 Apparel Shop
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`px-5 py-2.5 rounded-[18px] text-[13px] font-bold transition-all ${
            activeTab === 'services'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          🛠 Order Services
        </button>
      </div>

      {/* ── APPAREL TAB ───────────────────────────────────────────────────────── */}
      {activeTab === 'apparel' && (
        <>
          <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-bold text-neutral-900">
                  Apparel Products ({filteredApparel.length})
                </h2>
                <p className="text-[13px] text-neutral-500 mt-0.5">
                  Manage shop listings, variants, and available stock.
                </p>
              </div>
              <button
                type="button"
                onClick={openApparelCreate}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 focus-within:bg-white focus-within:border-neutral-900 transition-all flex-1">
                <Search className="h-4 w-4 text-neutral-400" />
                <input
                  value={apparelSearch}
                  onChange={(e) => setApparelSearch(e.target.value)}
                  placeholder="Search apparel..."
                  className="w-full bg-transparent text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </div>
              <select
                value={apparelCategoryFilter}
                onChange={(e) => setApparelCategoryFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-[13px] font-semibold text-neutral-800 outline-none focus:border-neutral-900 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {APPAREL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {apparelError && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{apparelError}</span>
            </div>
          )}

          {apparelLoading ? (
            <div className="rounded-[24px] bg-white border border-neutral-200/80 p-16 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mx-auto" />
              <p className="text-[13px] text-neutral-400 mt-2">Loading apparel...</p>
            </div>
          ) : filteredApparel.length === 0 ? (
            <div className="rounded-[24px] bg-white border border-neutral-200/80 p-16 text-center">
              <Package className="h-8 w-8 text-neutral-300 mx-auto" />
              <p className="text-[14px] font-semibold text-neutral-700 mt-3">No products found</p>
              <p className="text-[13px] text-neutral-400 mt-1">Add a product or adjust the filters.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredApparel.map((product, index) => {
                const lowStock = hasLowStock(product);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-[22px] bg-white border border-neutral-200/80 p-4 sm:p-5 shadow-xs"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-neutral-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {product.image_1_url ? (
                          <img src={product.image_1_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ImagePlus className="h-5 w-5 text-neutral-300" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-[15px] font-bold text-neutral-900 truncate">{product.name}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase">
                            {product.category}
                          </span>
                          {product.is_featured && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase">Featured</span>
                          )}
                          {product.is_new_arrival && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">New</span>
                          )}
                        </div>
                        <p className="text-[13px] text-neutral-500 mt-1 line-clamp-1">
                          {product.description || 'No description added.'}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-5 xl:gap-8 text-left xl:text-right shrink-0">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Price</p>
                          <p className="text-[14px] font-bold text-neutral-900 mt-1">
                            ₦{Number(product.price).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Variants</p>
                          <p className="text-[14px] font-bold text-neutral-900 mt-1">{product.variants.length}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Stock</p>
                          <p className={`text-[14px] font-bold mt-1 ${lowStock ? 'text-red-600' : 'text-neutral-900'}`}>
                            {stockTotal(product)}{' '}
                            {lowStock && <AlertTriangle className="inline h-3.5 w-3.5" />}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 xl:ml-2">
                        <button
                          type="button"
                          onClick={() => openApparelEdit(product)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 text-[12px] font-bold text-neutral-700 hover:bg-neutral-50"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteApparelProduct(product)}
                          disabled={deletingApparelId === product.id}
                          aria-label={`Delete ${product.name}`}
                          className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <AdminProductEditor
            isOpen={isApparelEditorOpen}
            isSaving={isApparelSaving}
            editingProduct={editingApparel}
            form={apparelForm}
            categoryOptions={APPAREL_CATEGORIES}
            onClose={() => setIsApparelEditorOpen(false)}
            onSubmit={saveApparelProduct}
            onUpdateForm={updateApparelForm}
            onUpdateVariant={updateApparelVariant}
            onAddVariant={addApparelVariant}
            onRemoveVariant={removeApparelVariant}
          />
        </>
      )}

      {/* ── ORDER SERVICES TAB ────────────────────────────────────────────────── */}
      {activeTab === 'services' && (
        <>
          <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-bold text-neutral-900">
                  Order Services ({filteredServices.length})
                </h2>
                <p className="text-[13px] text-neutral-500 mt-0.5">
                  Manage prices for Print &amp; Apparel order items. Design, Web &amp; Bundles are always custom quote.
                </p>
              </div>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-100 px-4 py-3">
              <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[12px] text-blue-700 leading-relaxed">
                Prices you set here appear live on the <strong>/order</strong> page. Design, Web &amp; Bundle
                services are locked to <strong>Custom Quote</strong> — customers are routed to WhatsApp to
                submit a brief. Only Print &amp; Apparel service prices are editable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 focus-within:bg-white focus-within:border-neutral-900 transition-all flex-1">
                <Search className="h-4 w-4 text-neutral-400" />
                <input
                  value={servicesSearch}
                  onChange={(e) => setServicesSearch(e.target.value)}
                  placeholder="Search services..."
                  className="w-full bg-transparent text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </div>
              <select
                value={servicesCategoryFilter}
                onChange={(e) => setServicesCategoryFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-[13px] font-semibold text-neutral-800 outline-none focus:border-neutral-900 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{SERVICE_CATEGORY_LABELS[cat] || cat}</option>
                ))}
              </select>
            </div>
          </div>

          {servicesError && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{servicesError}</span>
            </div>
          )}

          {servicesLoading ? (
            <div className="rounded-[24px] bg-white border border-neutral-200/80 p-16 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mx-auto" />
              <p className="text-[13px] text-neutral-400 mt-2">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="rounded-[24px] bg-white border border-neutral-200/80 p-16 text-center">
              <Package className="h-8 w-8 text-neutral-300 mx-auto" />
              <p className="text-[14px] font-semibold text-neutral-700 mt-3">No services found</p>
              <p className="text-[13px] text-neutral-400 mt-1">
                Make sure the Supabase migration has been run to seed order services.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredServices.map((service, index) => {
                const isAlwaysCustom = ALWAYS_CUSTOM_QUOTE_CATEGORIES.includes(service.category);
                const isCustomQuote = isAlwaysCustom || service.is_custom_quote || service.pricing_type === 'custom_quote';
                const displayName = service.title || service.name || '—';
                const catColor = SERVICE_CATEGORY_COLORS[service.category] || 'bg-neutral-100 text-neutral-600';

                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.025 }}
                    className="rounded-[22px] bg-white border border-neutral-200/80 p-4 sm:p-5 shadow-xs"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-[15px] font-bold text-neutral-900 truncate">{displayName}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${catColor}`}>
                            {SERVICE_CATEGORY_LABELS[service.category] || service.category}
                          </span>
                          {isCustomQuote && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase">
                              <MessageCircle className="h-2.5 w-2.5" /> Custom Quote
                            </span>
                          )}
                        </div>
                        {service.description && (
                          <p className="text-[12px] text-neutral-500 mt-1 line-clamp-1">{service.description}</p>
                        )}
                      </div>

                      {/* Price display */}
                      <div className="flex items-center gap-6 xl:gap-8 shrink-0">
                        <div className="text-left xl:text-right">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1 xl:justify-end">
                            <Tag className="h-2.5 w-2.5" /> Price
                          </p>
                          {isCustomQuote ? (
                            <p className="text-[13px] font-bold text-amber-600 mt-1">Submit Brief</p>
                          ) : (
                            <p className="text-[14px] font-bold text-neutral-900 mt-1">
                              ₦{Number(service.price).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="text-left xl:text-right">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Type</p>
                          <p className="text-[12px] font-semibold text-neutral-600 mt-1 capitalize">
                            {isCustomQuote ? '—' : service.pricing_type}
                          </p>
                        </div>
                      </div>

                      {/* Edit button */}
                      <div className="flex items-center gap-2 xl:ml-2">
                        <button
                          type="button"
                          onClick={() => openServiceEdit(service)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 text-[12px] font-bold text-neutral-700 hover:bg-neutral-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          {isAlwaysCustom ? 'View' : 'Edit'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <AdminServiceEditor
            isOpen={isServiceEditorOpen}
            isSaving={isServiceSaving}
            editingService={editingService}
            form={serviceForm}
            onClose={() => setIsServiceEditorOpen(false)}
            onSubmit={saveService}
            onUpdateForm={updateServiceForm}
          />
        </>
      )}
    </div>
  );
}
