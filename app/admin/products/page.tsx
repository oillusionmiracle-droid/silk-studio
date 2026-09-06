'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';

interface ProductVariant {
  id?: string;
  product_id?: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
}

interface ProductRecord {
  id: string;
  name: string;
  category: string;
  price: number;
  image_1_url: string | null;
  image_2_url: string | null;
  description: string | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  created_at: string;
  variants: ProductVariant[];
}

interface ProductForm {
  name: string;
  category: string;
  price: string;
  description: string;
  image_1_url: string;
  image_2_url: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  variants: ProductVariant[];
}

const EMPTY_FORM: ProductForm = {
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

const CATEGORY_OPTIONS = ['tee', 'shirt', 'hoodie', 'cap'];

function stockTotal(product: ProductRecord) {
  return product.variants.reduce((total, variant) => total + (Number(variant.stock) || 0), 0);
}

function hasLowStock(product: ProductRecord) {
  return product.variants.some((variant) => Number(variant.stock) < 5);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadProducts() {
    setIsLoading(true);
    setError(null);
    const { data, error: queryError } = await supabase
      .from('products')
      .select('*, variants(*)')
      .order('created_at', { ascending: false });

    if (queryError) {
      setError(queryError.message);
    } else {
      setProducts((data || []) as ProductRecord[]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  function openCreate() {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setIsEditorOpen(true);
  }

  function openEdit(product: ProductRecord) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      description: product.description || '',
      image_1_url: product.image_1_url || '',
      image_2_url: product.image_2_url || '',
      is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival,
      variants: product.variants.length
        ? product.variants.map((variant) => ({ ...variant, color: variant.color || '' }))
        : [{ sku: '', size: 'M', color: '', stock: 0 }],
    });
    setIsEditorOpen(true);
  }

  function updateForm<K extends keyof ProductForm>(field: K, value: ProductForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateVariant(index: number, field: keyof ProductVariant, value: string | number) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [field]: value } : variant
      ),
    }));
  }

  function addVariant() {
    updateForm('variants', [...form.variants, { sku: '', size: 'M', color: '', stock: 0 }]);
  }

  function removeVariant(index: number) {
    if (form.variants.length === 1) return;
    updateForm('variants', form.variants.filter((_, variantIndex) => variantIndex !== index));
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.price || form.variants.some((variant) => !variant.sku.trim())) {
      setError('Product name, price, and a SKU for every variant are required.');
      return;
    }

    setIsSaving(true);
    setError(null);
    const productPayload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      description: form.description.trim() || null,
      image_1_url: form.image_1_url.trim() || null,
      image_2_url: form.image_2_url.trim() || null,
      is_featured: form.is_featured,
      is_new_arrival: form.is_new_arrival,
    };

    try {
      let productId = editingProduct?.id;
      const productQuery = editingProduct
        ? await supabase.from('products').update(productPayload).eq('id', editingProduct.id).select('id').single()
        : await supabase.from('products').insert(productPayload).select('id').single();

      if (productQuery.error) throw productQuery.error;
      productId = productQuery.data.id;

      if (editingProduct) {
        const { error: deleteVariantsError } = await supabase
          .from('variants')
          .delete()
          .eq('product_id', productId);
        if (deleteVariantsError) throw deleteVariantsError;
      }

      const { error: variantError } = await supabase.from('variants').insert(
        form.variants.map((variant) => ({
          product_id: productId,
          sku: variant.sku.trim(),
          size: variant.size.trim(),
          color: variant.color.trim() || null,
          stock: Math.max(0, Number(variant.stock) || 0),
        }))
      );
      if (variantError) throw variantError;

      setIsEditorOpen(false);
      await loadProducts();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save product.');
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProduct(product: ProductRecord) {
    if (!window.confirm(`Delete ${product.name}? This also removes its variants.`)) return;
    setDeletingId(product.id);
    setError(null);
    const { error: deleteError } = await supabase.from('products').delete().eq('id', product.id);
    if (deleteError) setError(deleteError.message);
    else setProducts((current) => current.filter((item) => item.id !== product.id));
    setDeletingId(null);
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-bold text-neutral-900">Apparel Products ({filteredProducts.length})</h2>
            <p className="text-[13px] text-neutral-500 mt-0.5">Manage shop listings, variants, and available stock.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
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
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-[13px] font-semibold text-neutral-800 outline-none focus:border-neutral-900 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-[24px] bg-white border border-neutral-200/80 p-16 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mx-auto" />
          <p className="text-[13px] text-neutral-400 mt-2">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-[24px] bg-white border border-neutral-200/80 p-16 text-center">
          <Package className="h-8 w-8 text-neutral-300 mx-auto" />
          <p className="text-[14px] font-semibold text-neutral-700 mt-3">No products found</p>
          <p className="text-[13px] text-neutral-400 mt-1">Add a product or adjust the filters.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredProducts.map((product, index) => {
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
                    {product.image_1_url ? <img src={product.image_1_url} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-5 w-5 text-neutral-300" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-bold text-neutral-900 truncate">{product.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase">{product.category}</span>
                      {product.is_featured && <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase">Featured</span>}
                      {product.is_new_arrival && <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">New</span>}
                    </div>
                    <p className="text-[13px] text-neutral-500 mt-1 line-clamp-1">{product.description || 'No description added.'}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-5 xl:gap-8 text-left xl:text-right shrink-0">
                    <div><p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Price</p><p className="text-[14px] font-bold text-neutral-900 mt-1">₦{Number(product.price).toLocaleString()}</p></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Variants</p><p className="text-[14px] font-bold text-neutral-900 mt-1">{product.variants.length}</p></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Stock</p><p className={`text-[14px] font-bold mt-1 ${lowStock ? 'text-red-600' : 'text-neutral-900'}`}>{stockTotal(product)} {lowStock && <AlertTriangle className="inline h-3.5 w-3.5" />}</p></div>
                  </div>
                  <div className="flex items-center gap-2 xl:ml-2">
                    <button type="button" onClick={() => openEdit(product)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 text-[12px] font-bold text-neutral-700 hover:bg-neutral-50"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                    <button type="button" onClick={() => void deleteProduct(product)} disabled={deletingId === product.id} aria-label={`Delete ${product.name}`} className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/30 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto">
          <div className="min-h-full flex items-start justify-center py-4 sm:py-8">
            <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={saveProduct} className="w-full max-w-3xl rounded-[24px] bg-white border border-neutral-200 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                <div><h2 className="text-[18px] font-bold text-neutral-900">{editingProduct ? 'Edit Product' : 'Add Product'}</h2><p className="text-[13px] text-neutral-500 mt-0.5">Keep listing details and stock in one place.</p></div>
                <button type="button" onClick={() => setIsEditorOpen(false)} aria-label="Close editor" className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 flex items-center justify-center"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="text-[12px] font-bold text-neutral-700">Product name<input required value={form.name} onChange={(event) => updateForm('name', event.target.value)} className="admin-input" placeholder="e.g. Studio Boxy Tee" /></label>
                  <label className="text-[12px] font-bold text-neutral-700">Category<select value={form.category} onChange={(event) => updateForm('category', event.target.value)} className="admin-input">{CATEGORY_OPTIONS.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
                  <label className="text-[12px] font-bold text-neutral-700">Price (NGN)<input required min="0" type="number" value={form.price} onChange={(event) => updateForm('price', event.target.value)} className="admin-input" placeholder="20000" /></label>
                  <label className="text-[12px] font-bold text-neutral-700">Primary image URL<input type="url" value={form.image_1_url} onChange={(event) => updateForm('image_1_url', event.target.value)} className="admin-input" placeholder="https://..." /></label>
                  <label className="text-[12px] font-bold text-neutral-700 sm:col-span-2">Secondary image URL<input type="url" value={form.image_2_url} onChange={(event) => updateForm('image_2_url', event.target.value)} className="admin-input" placeholder="https://..." /></label>
                  <label className="text-[12px] font-bold text-neutral-700 sm:col-span-2">Description<textarea rows={3} value={form.description} onChange={(event) => updateForm('description', event.target.value)} className="admin-input resize-y" placeholder="Product description" /></label>
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center gap-2 text-[13px] font-semibold text-neutral-700"><input type="checkbox" checked={form.is_featured} onChange={(event) => updateForm('is_featured', event.target.checked)} className="accent-neutral-900" /> Featured product</label>
                  <label className="inline-flex items-center gap-2 text-[13px] font-semibold text-neutral-700"><input type="checkbox" checked={form.is_new_arrival} onChange={(event) => updateForm('is_new_arrival', event.target.checked)} className="accent-neutral-900" /> New arrival</label>
                </div>
                <div className="border-t border-neutral-100 pt-5">
                  <div className="flex items-center justify-between mb-3"><div><h3 className="text-[14px] font-bold text-neutral-900">Variants & Stock</h3><p className="text-[12px] text-neutral-500 mt-0.5">Each SKU represents one purchasable size and color.</p></div><button type="button" onClick={addVariant} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 text-[12px] font-bold text-neutral-700 hover:bg-neutral-50"><Plus className="h-3.5 w-3.5" /> Add variant</button></div>
                  <div className="space-y-2">
                    {form.variants.map((variant, index) => <div key={`${variant.id || 'new'}-${index}`} className="grid grid-cols-2 sm:grid-cols-[1.2fr_0.8fr_1fr_0.7fr_auto] gap-2 items-end p-3 rounded-2xl bg-neutral-50 border border-neutral-100"><label className="text-[11px] font-bold text-neutral-500 col-span-2 sm:col-span-1">SKU<input required value={variant.sku} onChange={(event) => updateVariant(index, 'sku', event.target.value)} className="admin-input compact" /></label><label className="text-[11px] font-bold text-neutral-500">Size<input value={variant.size} onChange={(event) => updateVariant(index, 'size', event.target.value)} className="admin-input compact" /></label><label className="text-[11px] font-bold text-neutral-500">Color<input value={variant.color} onChange={(event) => updateVariant(index, 'color', event.target.value)} className="admin-input compact" /></label><label className="text-[11px] font-bold text-neutral-500">Stock<input min="0" type="number" value={variant.stock} onChange={(event) => updateVariant(index, 'stock', Number(event.target.value))} className="admin-input compact" /></label><button type="button" onClick={() => removeVariant(index)} disabled={form.variants.length === 1} aria-label="Remove variant" className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 flex items-center justify-center"><Trash2 className="h-4 w-4" /></button></div>)}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-100 bg-neutral-50"><button type="button" onClick={() => setIsEditorOpen(false)} className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-neutral-600 hover:bg-white">Cancel</button><button disabled={isSaving} type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-[13px] font-bold hover:bg-neutral-800 disabled:opacity-60">{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{isSaving ? 'Saving...' : 'Save Product'}</button></div>
            </motion.form>
          </div>
        </div>
      )}

      <style jsx>{`.admin-input { display:block; width:100%; margin-top:0.4rem; padding:0.65rem 0.8rem; border:1px solid rgb(229 229 229); border-radius:0.75rem; background:white; color:rgb(23 23 23); font-size:0.8rem; font-weight:500; outline:none; } .admin-input:focus { border-color:rgb(23 23 23); } .admin-input.compact { margin-top:0.3rem; padding:0.5rem 0.6rem; border-radius:0.65rem; font-size:0.75rem; }`}</style>
    </div>
  );
}
