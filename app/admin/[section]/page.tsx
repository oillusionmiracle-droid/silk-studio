'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Check, Edit3, Inbox, Loader2, Plus, Search, Trash2, Users, X } from 'lucide-react';

type FieldType = 'text' | 'textarea' | 'number' | 'url' | 'checkbox';
type Field = { key: string; label: string; type: FieldType; required?: boolean };
type SectionConfig = { title: string; description: string; table: string; fields: Field[]; readOnly?: boolean; page?: string };
type Row = Record<string, unknown> & { id?: string; created_at?: string; updated_at?: string };

const PAGE_FIELDS: Field[] = [
  { key: 'page', label: 'Page', type: 'text', required: true },
  { key: 'section', label: 'Section', type: 'text', required: true },
  { key: 'field', label: 'Field', type: 'text', required: true },
  { key: 'value', label: 'Value', type: 'textarea' },
  { key: 'value_type', label: 'Value type', type: 'text' },
];

const SECTION_CONFIGS: Record<string, SectionConfig> = {
  home: { title: 'Homepage Content', description: 'Edit homepage copy and calls to action.', table: 'page_content', fields: PAGE_FIELDS, page: 'home' },
  services: { title: 'Services Page', description: 'Edit service names, descriptions, and supporting display copy.', table: 'page_content', fields: PAGE_FIELDS, page: 'services' },
  about: { title: 'About Page', description: 'Edit About page copy and image values.', table: 'page_content', fields: PAGE_FIELDS, page: 'about' },
  apparel: { title: 'Apparel Hero & Footer', description: 'Edit apparel hero slides, copy, and footer content.', table: 'page_content', fields: PAGE_FIELDS, page: 'apparel' },
  portfolio: { title: 'Portfolio', description: 'Manage published portfolio case studies and their order.', table: 'portfolio_items', fields: [
    { key: 'project_name', label: 'Project name', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'image_urls', label: 'Image URLs (JSON array)', type: 'textarea' },
    { key: 'display_order', label: 'Display order', type: 'number' },
    { key: 'published', label: 'Published', type: 'checkbox' },
  ] },
  testimonials: { title: 'Testimonials', description: 'Manage customer testimonials shown on public pages.', table: 'testimonials', fields: [
    { key: 'customer_name', label: 'Customer name', type: 'text', required: true },
    { key: 'role', label: 'Role / Company', type: 'text' },
    { key: 'testimonial', label: 'Testimonial', type: 'textarea', required: true },
    { key: 'photo_url', label: 'Photo URL', type: 'url' },
    { key: 'display_order', label: 'Display order', type: 'number' },
    { key: 'published', label: 'Published', type: 'checkbox' },
  ] },
  faq: { title: 'FAQ', description: 'Manage frequently asked questions and their order.', table: 'faq_items', fields: [
    { key: 'question', label: 'Question', type: 'text', required: true },
    { key: 'answer', label: 'Answer', type: 'textarea', required: true },
    { key: 'display_order', label: 'Display order', type: 'number' },
    { key: 'published', label: 'Published', type: 'checkbox' },
  ] },
  banners: { title: 'Homepage & Banners', description: 'Manage announcement banners and visibility.', table: 'site_banners', fields: [
    { key: 'slot', label: 'Slot', type: 'text', required: true },
    { key: 'message', label: 'Message', type: 'textarea', required: true },
    { key: 'link_label', label: 'Link label', type: 'text' },
    { key: 'link_url', label: 'Link URL', type: 'url' },
    { key: 'is_visible', label: 'Visible', type: 'checkbox' },
  ] },
  users: { title: 'Customer Users', description: 'View customer accounts and account metadata.', table: 'profiles', readOnly: true, fields: [
    { key: 'full_name', label: 'Name', type: 'text' },
    { key: 'id', label: 'User ID', type: 'text' },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'created_at', label: 'Joined', type: 'text' },
  ] },
  messages: { title: 'Reports & Messages', description: 'Review contact submissions and mark them resolved.', table: 'contact_messages', fields: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'message_type', label: 'Type', type: 'text' },
    { key: 'subject', label: 'Subject', type: 'text' },
    { key: 'message', label: 'Message', type: 'textarea' },
    { key: 'is_read', label: 'Read', type: 'checkbox' },
    { key: 'is_resolved', label: 'Resolved', type: 'checkbox' },
  ] },
  newsletter: { title: 'Newsletter Subscribers', description: 'View recent newsletter signups. Campaign sending remains in your email provider.', table: 'newsletter_subscribers', readOnly: true, fields: [
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'subscribed_at', label: 'Subscribed', type: 'text' },
  ] },
  'studio-products': { title: 'Studio Order Services', description: 'Manage print, design, web & bundle service prices and configurations for the Order page.', table: 'products', fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text' },
    { key: 'category', label: 'Category (PRINT | DESIGN | WEB | BUNDLES | APPAREL)', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'price', label: 'Base / Starting Price (₦)', type: 'number' },
    { key: 'pricing_type', label: 'Pricing type (unit | tier | custom_quote | package)', type: 'text' },
    { key: 'config_schema', label: 'Config Schema (JSON)', type: 'textarea' },
    { key: 'display_order', label: 'Display Order', type: 'number' },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ] },
  products: { title: 'Products & Offerings', description: 'Manage products, offerings, categories, pricing types, and config schemas.', table: 'products', fields: [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'slug', label: 'Slug', type: 'text' },
    { key: 'category', label: 'Category', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'price', label: 'Base / Starting Price (₦)', type: 'number' },
    { key: 'pricing_type', label: 'Pricing type (unit | tier | custom_quote | package)', type: 'text' },
    { key: 'config_schema', label: 'Config Schema (JSON)', type: 'textarea' },
    { key: 'display_order', label: 'Display Order', type: 'number' },
    { key: 'is_active', label: 'Active', type: 'checkbox' },
  ] },
  variants: { title: 'Product Variants', description: 'Manage product variants, custom rates, options, and stock.', table: 'variants', fields: [
    { key: 'product_id', label: 'Product UUID', type: 'text', required: true },
    { key: 'name', label: 'Variant Name', type: 'text', required: true },
    { key: 'sku', label: 'SKU', type: 'text' },
    { key: 'price', label: 'Price (₦)', type: 'number', required: true },
    { key: 'stock', label: 'Stock Quantity', type: 'number' },
    { key: 'options', label: 'Options (JSON)', type: 'textarea' },
    { key: 'min_quantity', label: 'Min Quantity', type: 'number' },
  ] },
};

const READ_ONLY_COLUMNS = new Set(['id', 'created_at', 'updated_at', 'subscribed_at']);

function displayValue(value: unknown) {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === null || value === undefined || value === '') return '—';
  const text = String(value);
  return text.length > 100 ? `${text.slice(0, 100)}...` : text;
}

export default function AdminSectionPage() {
  const params = useParams<{ section: string }>();
  const section = params.section;
  const config = SECTION_CONFIGS[section];
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Row | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config) return;
    async function loadRows() {
      setIsLoading(true);
      setError(null);
      const orderColumn = config.table === 'page_content'
        ? 'updated_at'
        : config.table === 'newsletter_subscribers'
          ? 'subscribed_at'
          : 'created_at';
      let request = supabase.from(config.table).select('*').order(orderColumn, { ascending: false });
      if (config.page) request = request.eq('page', config.page);
      const { data, error: queryError } = await request;
      if (queryError) setError(queryError.message);
      else setRows((data || []) as Row[]);
      setIsLoading(false);
    }
    void loadRows();
  }, [config]);

  const filteredRows = useMemo(() => {
    const normalized = query.toLowerCase();
    return rows.filter((row) => !normalized || Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(normalized)));
  }, [query, rows]);

  if (!config) return <div className="rounded-[24px] bg-white border border-neutral-200/80 p-8 text-[14px] text-neutral-600">This admin section is not available.</div>;

  function openCreate() {
    const initial: Row = {};
    config.fields.forEach((field) => { initial[field.key] = field.type === 'checkbox' ? false : field.type === 'number' ? 0 : ''; });
    if (config.page) initial.page = config.page;
    setEditing(initial);
  }

  async function loadStarterData() {
    setIsSaving(true);
    setError(null);
    try {
      if (section === 'testimonials') {
        const starters = [
          {
            customer_name: 'Afolabi M.',
            role: 'Operations Lead at Vantage Events',
            testimonial: 'Finding a reliable print shop in Lagos used to be a gamble for our event planning business. Silk Studio delivered our entire batch of branded souvenirs and conference materials in under 48 hours, and the quality was top-tier.',
            photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
            display_order: 1,
            published: true,
          },
          {
            customer_name: 'Babajide O.',
            role: 'Head of Brand at Studio Trace',
            testimonial: 'They handle our high-volume production with total precision. From large-format event billboards to corporate apparel, their 48-hour dispatch system is something Lagos commerce has needed for years.',
            photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
            display_order: 2,
            published: true,
          },
          {
            customer_name: 'Chidinma E.',
            role: 'Founder at Lumina Brands',
            testimonial: 'Beyond the physical prints, having them handle our web design and automated customer workflows changed how our brand operates online. They bridge the gap between creative design and serious tech.',
            photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80',
            display_order: 3,
            published: true,
          },
        ];

        let { data, error: insertErr } = await supabase.from('testimonials').insert(starters).select('*');
        if (insertErr && insertErr.message.includes("'role' column")) {
          const fallbackStarters = starters.map((s) => ({
            customer_name: s.customer_name,
            testimonial: s.testimonial,
            photo_url: s.photo_url,
            display_order: s.display_order,
            published: s.published,
          }));
          const retry = await supabase.from('testimonials').insert(fallbackStarters).select('*');
          if (retry.error) throw retry.error;
          data = retry.data;
        } else if (insertErr) {
          throw insertErr;
        }
        if (data) setRows(data as Row[]);
      } else if (section === 'about') {
        const starters = [
          { page: 'about', section: 'gallery', field: 'image_1', value: '/images/about/about-1.jpg', value_type: 'image', published: true },
          { page: 'about', section: 'gallery', field: 'image_2', value: '/images/about/about-2.jpg', value_type: 'image', published: true },
          { page: 'about', section: 'gallery', field: 'image_3', value: '/images/about/about-3.jpg', value_type: 'image', published: true },
        ];
        const { data, error: insertErr } = await supabase.from('page_content').insert(starters).select('*');
        if (insertErr) throw insertErr;
        if (data) setRows(data as Row[]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to seed starter data.');
    } finally {
      setIsSaving(false);
    }
  }

  async function saveRow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || config.readOnly) return;
    setIsSaving(true);
    setError(null);
    const payload: Row = {};
    config.fields.forEach((field) => {
      // Role is only read-only in users section
      if (field.key === 'role' && section === 'users') return;
      if (!READ_ONLY_COLUMNS.has(field.key) && editing[field.key] !== undefined) payload[field.key] = editing[field.key];
    });
    try {
      let request = editing.id
        ? await supabase.from(config.table).update(payload).eq('id', editing.id).select('*').single()
        : await supabase.from(config.table).insert(payload).select('*').single();

      if (request.error && request.error.message.includes("'role' column")) {
        const fallbackPayload = { ...payload };
        delete fallbackPayload.role;
        request = editing.id
          ? await supabase.from(config.table).update(fallbackPayload).eq('id', editing.id).select('*').single()
          : await supabase.from(config.table).insert(fallbackPayload).select('*').single();
      }

      if (request.error) throw request.error;
      setRows((current) => editing.id ? current.map((row) => row.id === editing.id ? request.data as Row : row) : [request.data as Row, ...current]);
      setEditing(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save this record.');
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteRow(row: Row) {
    if (config.readOnly || !row.id) return;

    if (config.table === 'products') {
      const confirmAction = window.confirm('Archive/deactivate this product? (It will be hidden from the customer order page without breaking past order history).');
      if (!confirmAction) return;

      const { error: updateError } = await supabase.from('products').update({ is_active: false }).eq('id', row.id);
      if (updateError) setError(updateError.message);
      else setRows((current) => current.map((item) => item.id === row.id ? { ...item, is_active: false } : item));
      return;
    }

    if (!window.confirm('Delete this record?')) return;
    const { error: deleteError } = await supabase.from(config.table).delete().eq('id', row.id);
    if (deleteError) setError(deleteError.message);
    else setRows((current) => current.filter((item) => item.id !== row.id));
  }

  async function markResolved(row: Row) {
    if (!row.id) return;
    const nextResolved = !Boolean(row.is_resolved);
    const { error: updateError } = await supabase.from(config.table).update({ is_resolved: nextResolved, is_read: true }).eq('id', row.id);
    if (updateError) setError(updateError.message);
    else setRows((current) => current.map((item) => item.id === row.id ? { ...item, is_resolved: nextResolved, is_read: true } : item));
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-bold text-neutral-900">{config.title} ({filteredRows.length})</h2>
            <p className="text-[13px] text-neutral-500 mt-0.5">{config.description}</p>
          </div>
          <div className="flex items-center gap-2.5">
            {(section === 'testimonials' || section === 'about') && (
              <button
                type="button"
                onClick={loadStarterData}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 text-[13px] font-bold hover:bg-neutral-100 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {section === 'testimonials' ? 'Seed Starter Testimonials' : 'Seed Gallery Images'}
              </button>
            )}
            {!config.readOnly && (
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-[13px] font-bold hover:bg-neutral-800"
              >
                <Plus className="h-4 w-4" /> Add {section === 'faq' ? 'Question' : 'Entry'}
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 focus-within:bg-white focus-within:border-neutral-900">
          <Search className="h-4 w-4 text-neutral-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this section..."
            className="w-full bg-transparent text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{error}</div>}
      {isLoading ? (
        <div className="rounded-[24px] bg-white border border-neutral-200/80 p-16 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mx-auto" />
          <p className="text-[13px] text-neutral-400 mt-2">Loading {config.title.toLowerCase()}...</p>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="rounded-[24px] bg-white border border-neutral-200/80 p-16 text-center">
          <Inbox className="h-8 w-8 text-neutral-300 mx-auto" />
          <p className="text-[14px] font-semibold text-neutral-700 mt-3">Nothing here yet</p>
          <p className="text-[13px] text-neutral-400 mt-1 mb-4">New records will appear in this section.</p>
          {(section === 'testimonials' || section === 'about') && (
            <button
              type="button"
              onClick={loadStarterData}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-[13px] font-bold hover:bg-neutral-800"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {section === 'testimonials' ? 'Load 3 Default Testimonials' : 'Load 3 Default Gallery Images'}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRows.map((row, index) => (
            <motion.div
              key={String(row.id || index)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.025 }}
              className="rounded-[22px] bg-white border border-neutral-200/80 p-5 shadow-xs"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-3">
                  {config.fields.slice(0, 6).map((field) => (
                    <div key={field.key} className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {field.label}
                      </p>
                      <p className="text-[13px] text-neutral-800 mt-1 whitespace-pre-wrap break-words">
                        {displayValue(row[field.key])}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 justify-end">
                  {section === 'messages' && (
                    <button
                      type="button"
                      onClick={() => void markResolved(row)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold ${
                        row.is_resolved
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {row.is_resolved ? 'Resolved' : 'Resolve'}
                    </button>
                  )}
                  {!config.readOnly && (
                    <>
                      <button
                        type="button"
                        onClick={() => setEditing(row)}
                        aria-label="Edit record"
                        className="h-9 w-9 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 flex items-center justify-center"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteRow(row)}
                        aria-label="Delete record"
                        className="h-9 w-9 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {editing && !config.readOnly && <div className="fixed inset-0 z-50 bg-neutral-950/30 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto"><div className="min-h-full flex items-start justify-center py-4 sm:py-8"><motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={saveRow} className="w-full max-w-2xl rounded-[24px] bg-white border border-neutral-200 shadow-xl overflow-hidden"><div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100"><div><h2 className="text-[18px] font-bold text-neutral-900">{editing.id ? 'Edit Record' : 'Add Record'}</h2><p className="text-[13px] text-neutral-500 mt-0.5">Changes publish through Supabase after saving.</p></div><button type="button" onClick={() => setEditing(null)} aria-label="Close editor" className="h-9 w-9 rounded-xl text-neutral-400 hover:bg-neutral-100 flex items-center justify-center"><X className="h-5 w-5" /></button></div><div className="p-6 grid gap-4 sm:grid-cols-2">{config.fields.map((field) => <label key={field.key} className={`text-[12px] font-bold text-neutral-700 ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>{field.label}{field.type === 'checkbox' ? <span className="flex items-center gap-2 mt-3 text-[13px] font-semibold"><input type="checkbox" checked={Boolean(editing[field.key])} onChange={(event) => setEditing({ ...editing, [field.key]: event.target.checked })} className="accent-neutral-900" /> Enabled</span> : field.type === 'textarea' ? <textarea required={field.required} rows={4} value={String(editing[field.key] ?? '')} onChange={(event) => setEditing({ ...editing, [field.key]: event.target.value })} className="admin-input resize-y" /> : <input required={field.required} type={field.type === 'number' ? 'number' : field.type} value={String(editing[field.key] ?? '')} onChange={(event) => setEditing({ ...editing, [field.key]: field.type === 'number' ? Number(event.target.value) : event.target.value })} className="admin-input" />}</label>)}</div><div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-100 bg-neutral-50"><button type="button" onClick={() => setEditing(null)} className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-neutral-600 hover:bg-white">Cancel</button><button disabled={isSaving} type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-[13px] font-bold disabled:opacity-60">{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Save</button></div></motion.form></div></div>}
      <style jsx>{`.admin-input { display:block; width:100%; margin-top:0.4rem; padding:0.65rem 0.8rem; border:1px solid rgb(229 229 229); border-radius:0.75rem; background:white; color:rgb(23 23 23); font-size:0.8rem; font-weight:500; outline:none; } .admin-input:focus { border-color:rgb(23 23 23); }`}</style>
    </div>
  );
}
