'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
  AlertTriangle,
  ImagePlus,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import AdminProductEditor, {
  ProductRecord,
  ProductForm,
  ProductVariant,
} from '@/components/admin/AdminProductEditor';

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
        ? await supabase
            .from('products')
            .update(productPayload)
            .eq('id', editingProduct.id)
            .select('id')
            .single()
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
            <h2 className="text-[18px] font-bold text-neutral-900">
              Apparel Products ({filteredProducts.length})
            </h2>
            <p className="text-[13px] text-neutral-500 mt-0.5">
              Manage shop listings, variants, and available stock.
            </p>
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
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
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
                    {product.image_1_url ? (
                      <img
                        src={product.image_1_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImagePlus className="h-5 w-5 text-neutral-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-bold text-neutral-900 truncate">
                        {product.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase">
                        {product.category}
                      </span>
                      {product.is_featured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase">
                          Featured
                        </span>
                      )}
                      {product.is_new_arrival && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-neutral-500 mt-1 line-clamp-1">
                      {product.description || 'No description added.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-5 xl:gap-8 text-left xl:text-right shrink-0">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Price
                      </p>
                      <p className="text-[14px] font-bold text-neutral-900 mt-1">
                        ₦{Number(product.price).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Variants
                      </p>
                      <p className="text-[14px] font-bold text-neutral-900 mt-1">
                        {product.variants.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Stock
                      </p>
                      <p
                        className={`text-[14px] font-bold mt-1 ${
                          lowStock ? 'text-red-600' : 'text-neutral-900'
                        }`}
                      >
                        {stockTotal(product)}{' '}
                        {lowStock && <AlertTriangle className="inline h-3.5 w-3.5" />}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 xl:ml-2">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 text-[12px] font-bold text-neutral-700 hover:bg-neutral-50"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteProduct(product)}
                      disabled={deletingId === product.id}
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
        isOpen={isEditorOpen}
        isSaving={isSaving}
        editingProduct={editingProduct}
        form={form}
        categoryOptions={CATEGORY_OPTIONS}
        onClose={() => setIsEditorOpen(false)}
        onSubmit={saveProduct}
        onUpdateForm={updateForm}
        onUpdateVariant={updateVariant}
        onAddVariant={addVariant}
        onRemoveVariant={removeVariant}
      />
    </div>
  );
}
