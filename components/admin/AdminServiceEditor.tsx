'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Info, Loader2, X } from 'lucide-react';

// Categories that are ALWAYS custom quote — no price editing allowed.
// WEB rows are seeded as brief (is_custom_quote = true) but can be priced later
// from this editor, so WEB is intentionally not in this list.
export const ALWAYS_CUSTOM_QUOTE_CATEGORIES = ['DESIGN', 'BUNDLES'];

export interface ServiceRecord {
  id: string;
  title: string;
  name?: string;
  category: string;
  price: number;
  pricing_type: string;
  is_custom_quote: boolean;
  description: string | null;
  slug: string;
}

export interface ServiceForm {
  price: string;
  pricing_type: string;
  is_custom_quote: boolean;
}

interface AdminServiceEditorProps {
  isOpen: boolean;
  isSaving: boolean;
  editingService: ServiceRecord | null;
  form: ServiceForm;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onUpdateForm: <K extends keyof ServiceForm>(field: K, value: ServiceForm[K]) => void;
}

const PRICING_TYPE_OPTIONS: { value: string; label: string; description: string }[] = [
  { value: 'tier', label: 'Tiered', description: 'Price scales with quantity (e.g. per 100 flyers)' },
  { value: 'unit', label: 'Per Unit', description: 'Fixed price per single item or piece' },
  { value: 'package', label: 'Package', description: 'Fixed flat-rate package price' },
  { value: 'custom_quote', label: 'Custom Quote', description: 'Customer submits brief via WhatsApp' },
];

const CATEGORY_LABELS: Record<string, string> = {
  PRINT: 'Print',
  APPAREL: 'Apparel (Order Service)',
  DESIGN: 'Design',
  WEB: 'Web',
  BUNDLES: 'Bundles',
};

export default function AdminServiceEditor({
  isOpen,
  isSaving,
  editingService,
  form,
  onClose,
  onSubmit,
  onUpdateForm,
}: AdminServiceEditorProps) {
  if (!isOpen || !editingService) return null;

  const isAlwaysCustomQuote = ALWAYS_CUSTOM_QUOTE_CATEGORIES.includes(editingService.category);
  const showPrice = !isAlwaysCustomQuote && form.pricing_type !== 'custom_quote' && !form.is_custom_quote;
  const serviceName = editingService.title || editingService.name || 'Service';
  const categoryLabel = CATEGORY_LABELS[editingService.category] || editingService.category;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/30 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto">
      <div className="min-h-full flex items-start justify-center py-4 sm:py-8">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={onSubmit}
          className="w-full max-w-xl rounded-[24px] bg-white border border-neutral-200 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
            <div>
              <h2 className="text-[18px] font-bold text-neutral-900">Edit Service Price</h2>
              <p className="text-[13px] text-neutral-500 mt-0.5">
                Changes apply immediately to the order page.
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
            {/* Service identity — read-only */}
            <div className="flex items-start gap-3 rounded-2xl bg-neutral-50 border border-neutral-100 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                  Service
                </p>
                <p className="text-[15px] font-bold text-neutral-900 truncate">{serviceName}</p>
                {editingService.description && (
                  <p className="text-[12px] text-neutral-500 mt-0.5 line-clamp-2">
                    {editingService.description}
                  </p>
                )}
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-bold uppercase">
                {categoryLabel}
              </span>
            </div>

            {/* Always-custom-quote notice for DESIGN/WEB/BUNDLES */}
            {isAlwaysCustomQuote && (
              <div className="flex items-start gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3.5">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-bold text-amber-900">
                    This service always requires a custom brief
                  </p>
                  <p className="text-[12px] text-amber-700 mt-0.5">
                    {editingService.category === 'BUNDLES'
                      ? 'Bundle packages are quoted on a case-by-case basis. Customers will be directed to submit a brief via WhatsApp.'
                      : 'Design & Web services are project-based. Customers are directed to submit a brief so you can provide a custom quote.'}
                  </p>
                  <p className="text-[12px] text-amber-700 mt-1.5 font-semibold">
                    No price field is needed. This is set automatically.
                  </p>
                </div>
              </div>
            )}

            {/* Pricing controls — only for PRINT and APPAREL service items */}
            {!isAlwaysCustomQuote && (
              <>
                {/* Custom Quote toggle */}
                <div className="rounded-2xl border border-neutral-100 px-4 py-4 space-y-1">
                  <label className="flex items-center justify-between cursor-pointer gap-4">
                    <div>
                      <p className="text-[13px] font-bold text-neutral-900">Custom Quote Mode</p>
                      <p className="text-[12px] text-neutral-500 mt-0.5">
                        When on, the order page routes the customer to WhatsApp instead of showing a price.
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form.is_custom_quote}
                      onClick={() => onUpdateForm('is_custom_quote', !form.is_custom_quote)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                        form.is_custom_quote ? 'bg-neutral-900' : 'bg-neutral-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          form.is_custom_quote ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>

                {/* Pricing type */}
                {!form.is_custom_quote && (
                  <div>
                    <label className="text-[12px] font-bold text-neutral-700">
                      Pricing Type
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {PRICING_TYPE_OPTIONS.filter(o => o.value !== 'custom_quote').map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onUpdateForm('pricing_type', opt.value)}
                          className={`text-left px-3 py-2.5 rounded-xl border text-[12px] transition-all ${
                            form.pricing_type === opt.value
                              ? 'border-neutral-900 bg-neutral-900 text-white'
                              : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                          }`}
                        >
                          <span className="font-bold block">{opt.label}</span>
                          <span className={`text-[11px] mt-0.5 block leading-tight ${form.pricing_type === opt.value ? 'text-neutral-300' : 'text-neutral-400'}`}>
                            {opt.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price input */}
                {showPrice && (
                  <div>
                    <label className="text-[12px] font-bold text-neutral-700">
                      {form.pricing_type === 'tier'
                        ? 'Base Price (₦) — per unit at minimum quantity'
                        : form.pricing_type === 'unit'
                        ? 'Unit Price (₦)'
                        : 'Package Price (₦)'}
                      <div className="relative mt-1.5">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] font-bold text-neutral-400">
                          ₦
                        </span>
                        <input
                          required
                          min="0"
                          type="number"
                          value={form.price}
                          onChange={(e) => onUpdateForm('price', e.target.value)}
                          className="w-full pl-8 pr-4 py-3 border border-neutral-200 rounded-xl text-[14px] font-semibold text-neutral-900 outline-none focus:border-neutral-900 transition-colors"
                          placeholder="e.g. 6500"
                        />
                      </div>
                    </label>
                    <p className="text-[11px] text-neutral-400 mt-1.5">
                      {form.pricing_type === 'tier'
                        ? 'The pricing engine applies quantity multipliers on top of this base rate.'
                        : 'This exact amount is used in price calculations on the order page.'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-[13px] font-bold hover:bg-neutral-800 disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
