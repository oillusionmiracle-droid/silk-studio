'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2, Plus, Trash2, X } from 'lucide-react';

export interface ProductVariant {
  id?: string;
  product_id?: string;
  sku: string;
  size: string;
  color: string;
  price?: number;
  stock: number;
}

export interface ProductRecord {
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

export interface ProductForm {
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

interface AdminProductEditorProps {
  isOpen: boolean;
  isSaving: boolean;
  editingProduct: ProductRecord | null;
  form: ProductForm;
  categoryOptions: string[];
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onUpdateForm: <K extends keyof ProductForm>(field: K, value: ProductForm[K]) => void;
  onUpdateVariant: (index: number, field: keyof ProductVariant, value: string | number) => void;
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
}

export default function AdminProductEditor({
  isOpen,
  isSaving,
  editingProduct,
  form,
  categoryOptions,
  onClose,
  onSubmit,
  onUpdateForm,
  onUpdateVariant,
  onAddVariant,
  onRemoveVariant,
}: AdminProductEditorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/30 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center py-4 sm:py-8">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="w-full max-w-3xl rounded-[24px] bg-white border border-neutral-200 shadow-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
            <div>
              <h2 className="text-[18px] font-bold text-neutral-900">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <p className="text-[13px] text-neutral-500 mt-0.5">
                Keep listing details and stock in one place.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close editor"
              className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="text-[12px] font-bold text-neutral-700">
                Product name
                <input
                  required
                  value={form.name}
                  onChange={(e) => onUpdateForm('name', e.target.value)}
                  className="admin-input"
                  placeholder="e.g. Studio Boxy Tee"
                />
              </label>
              <label className="text-[12px] font-bold text-neutral-700">
                Category
                <select
                  value={form.category}
                  onChange={(e) => onUpdateForm('category', e.target.value)}
                  className="admin-input"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-[12px] font-bold text-neutral-700">
                Price (NGN)
                <input
                  required
                  min="0"
                  type="number"
                  value={form.price}
                  onChange={(e) => onUpdateForm('price', e.target.value)}
                  className="admin-input"
                  placeholder="20000"
                />
              </label>
              <label className="text-[12px] font-bold text-neutral-700">
                Primary image URL
                <input
                  type="url"
                  value={form.image_1_url}
                  onChange={(e) => onUpdateForm('image_1_url', e.target.value)}
                  className="admin-input"
                  placeholder="https://..."
                />
              </label>
              <label className="text-[12px] font-bold text-neutral-700 sm:col-span-2">
                Secondary image URL
                <input
                  type="url"
                  value={form.image_2_url}
                  onChange={(e) => onUpdateForm('image_2_url', e.target.value)}
                  className="admin-input"
                  placeholder="https://..."
                />
              </label>
              <label className="text-[12px] font-bold text-neutral-700 sm:col-span-2">
                Description
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => onUpdateForm('description', e.target.value)}
                  className="admin-input resize-y"
                  placeholder="Product description"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 text-[13px] font-semibold text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => onUpdateForm('is_featured', e.target.checked)}
                  className="accent-neutral-900"
                />{' '}
                Featured product
              </label>
              <label className="inline-flex items-center gap-2 text-[13px] font-semibold text-neutral-700">
                <input
                  type="checkbox"
                  checked={form.is_new_arrival}
                  onChange={(e) => onUpdateForm('is_new_arrival', e.target.checked)}
                  className="accent-neutral-900"
                />{' '}
                New arrival
              </label>
            </div>

            <div className="border-t border-neutral-100 pt-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-[14px] font-bold text-neutral-900">Variants & Stock</h3>
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    Each SKU represents one purchasable size and color.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onAddVariant}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 text-[12px] font-bold text-neutral-700 hover:bg-neutral-50"
                >
                  <Plus className="h-3.5 w-3.5" /> Add variant
                </button>
              </div>

              <div className="space-y-2">
                {form.variants.map((variant, index) => (
                  <div
                    key={`${variant.id || 'new'}-${index}`}
                    className="grid grid-cols-2 sm:grid-cols-[1fr_0.7fr_0.8fr_0.8fr_0.6fr_auto] gap-2 items-end p-3 rounded-2xl bg-neutral-50 border border-neutral-100"
                  >
                    <label className="text-[11px] font-bold text-neutral-500 col-span-2 sm:col-span-1">
                      SKU
                      <input
                        required
                        value={variant.sku}
                        onChange={(e) => onUpdateVariant(index, 'sku', e.target.value)}
                        className="admin-input compact"
                      />
                    </label>
                    <label className="text-[11px] font-bold text-neutral-500">
                      Size
                      <input
                        value={variant.size}
                        onChange={(e) => onUpdateVariant(index, 'size', e.target.value)}
                        className="admin-input compact"
                      />
                    </label>
                    <label className="text-[11px] font-bold text-neutral-500">
                      Color
                      <input
                        value={variant.color}
                        onChange={(e) => onUpdateVariant(index, 'color', e.target.value)}
                        className="admin-input compact"
                      />
                    </label>
                    <label className="text-[11px] font-bold text-neutral-500">
                      Price (NGN)
                      <input
                        min="0"
                        type="number"
                        placeholder="Optional"
                        value={variant.price || ''}
                        onChange={(e) =>
                          onUpdateVariant(index, 'price', Number(e.target.value) || 0)
                        }
                        className="admin-input compact"
                      />
                    </label>
                    <label className="text-[11px] font-bold text-neutral-500">
                      Stock
                      <input
                        min="0"
                        type="number"
                        value={variant.stock}
                        onChange={(e) =>
                          onUpdateVariant(index, 'stock', Number(e.target.value))
                        }
                        className="admin-input compact"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => onRemoveVariant(index)}
                      disabled={form.variants.length === 1}
                      aria-label="Remove variant"
                      className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-100 bg-neutral-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-neutral-600 hover:bg-white"
            >
              Cancel
            </button>
            <button
              disabled={isSaving}
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-[13px] font-bold hover:bg-neutral-800 disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {isSaving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </motion.form>
      </div>

      <style jsx>{`
        .admin-input {
          display: block;
          width: 100%;
          margin-top: 0.4rem;
          padding: 0.65rem 0.8rem;
          border: 1px solid rgb(229 229 229);
          border-radius: 0.75rem;
          background: white;
          color: rgb(23 23 23);
          font-size: 0.8rem;
          font-weight: 500;
          outline: none;
        }
        .admin-input:focus {
          border-color: rgb(23 23 23);
        }
        .admin-input.compact {
          margin-top: 0.3rem;
          padding: 0.5rem 0.6rem;
          border-radius: 0.65rem;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
