'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Phone,
  Mail,
  FileText,
  ExternalLink,
  Download,
  Loader2,
  Save,
  MessageSquare,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

const STATUS_PIPELINE = [
  'pending',
  'paid',
  'confirmed',
  'in_production',
  'ready',
  'shipped',
  'delivered',
  'cancelled',
  'quote_requested',
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { session } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    async function loadOrder() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              quantity,
              price_at_purchase,
              variants (
                id,
                size,
                color,
                products (
                  id,
                  name,
                  image_url
                )
              )
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) {
          console.warn('Order load error:', error.message);
        } else {
          setOrder(data);
          setSelectedStatus(data.status);
          setAdminNotes(data.admin_notes || '');
        }
      } catch (err) {
        console.warn('Exception loading order:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrder();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (!order || selectedStatus === order.status) return;

    setIsUpdatingStatus(true);
    setNoticeMessage(null);

    try {
      const historyEntry = {
        status: selectedStatus,
        timestamp: new Date().toISOString(),
        note: `Status advanced by admin`,
      };

      const updatedHistory = Array.isArray(order.status_history)
        ? [...order.status_history, historyEntry]
        : [historyEntry];

      const { error } = await supabase
        .from('orders')
        .update({
          status: selectedStatus,
          status_history: updatedHistory,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (error) throw error;

      setOrder((prev: any) => ({
        ...prev,
        status: selectedStatus,
        status_history: updatedHistory,
      }));

      setNoticeMessage(`Order status updated to ${selectedStatus}.`);
      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err: any) {
      alert('Status update failed: ' + (err?.message || 'Error'));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!order) return;

    setIsSavingNotes(true);
    setNoticeMessage(null);

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      if (error) throw error;

      setOrder((prev: any) => ({ ...prev, admin_notes: adminNotes }));
      setNoticeMessage('Internal administrator notes saved.');
      setTimeout(() => setNoticeMessage(null), 4000);
    } catch (err: any) {
      alert('Failed to save notes: ' + (err?.message || 'Error'));
    } finally {
      setIsSavingNotes(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[24px] bg-white border border-neutral-200/80 p-16 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mx-auto stroke-[2]" />
        <p className="text-[13px] text-neutral-400 mt-2">Loading studio order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-[24px] bg-white border border-neutral-200/80 p-12 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3 stroke-[2]" />
        <h3 className="text-[16px] font-bold text-neutral-900">Order Record Not Found</h3>
        <p className="text-[13px] text-neutral-500 mt-1">This order does not exist or was deleted.</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 px-4 py-2 mt-5 rounded-xl bg-neutral-900 text-white text-[12px] font-bold"
        >
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2]" />
          <span>Back to All Orders</span>
        </Link>
      </div>
    );
  }

  const cleanPhone = (order.phone || '').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : cleanPhone}`;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-neutral-500 hover:text-neutral-900 mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 stroke-[2]" />
            <span>Back to All Orders</span>
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-[20px] font-bold text-neutral-900">
              {order.paystack_ref}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-700">
              {order.type}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize bg-emerald-50 text-emerald-800">
              {order.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-[12px] text-neutral-400 mt-1">
            Created on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Value</p>
          <p className="text-[22px] font-bold text-neutral-900">
            {order.total > 0 ? `₦${Number(order.total).toLocaleString()}` : 'Quote Request'}
          </p>
        </div>
      </div>

      {noticeMessage && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4 stroke-[2]" />
          <span>{noticeMessage}</span>
        </motion.div>
      )}

      {/* Grid: 2 cols on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Status Pipeline Control & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Pipeline Controller */}
          <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs">
            <h3 className="text-[15px] font-bold text-neutral-900 mb-1">
              Production & Delivery Pipeline
            </h3>
            <p className="text-[13px] text-neutral-500 mb-4">
              Advance the customer&apos;s order status to update their live tracking timeline.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-[13px] font-semibold text-neutral-800 outline-none focus:border-neutral-900 capitalize cursor-pointer"
              >
                {STATUS_PIPELINE.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={isUpdatingStatus || selectedStatus === order.status}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isUpdatingStatus ? (
                  <Loader2 className="h-4 w-4 animate-spin stroke-[2]" />
                ) : (
                  <span>Update Status</span>
                )}
              </button>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs">
            <h3 className="text-[15px] font-bold text-neutral-900 mb-4">
              Order Items Breakdown
            </h3>

            {order.order_items && order.order_items.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {order.order_items.map((item: any, idx: number) => {
                  const product = item.variants?.products;
                  const variant = item.variants;
                  return (
                    <div key={item.id || idx} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 rounded-xl bg-neutral-100 overflow-hidden flex items-center justify-center border border-neutral-200">
                          {product?.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
                          )}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-neutral-900">
                            {product?.name || 'Studio Apparel Piece'}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {variant?.size && `Size: ${variant.size}`}
                            {variant?.color && ` • Color: ${variant.color}`}
                            {' • '}Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[13px] font-bold text-neutral-900">
                          ₦{Number(item.price_at_purchase * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-[11px] text-neutral-400">
                          ₦{Number(item.price_at_purchase).toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[13px] text-neutral-500">Custom print specification.</p>
            )}

            <div className="mt-4 pt-4 border-t border-neutral-100 space-y-1.5 text-[13px]">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>₦{Number(order.subtotal || order.total).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Delivery Fee</span>
                <span>₦{Number(order.delivery_fee || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-100 text-[14px]">
                <span>Total Amount</span>
                <span>₦{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Specs & Reference Files */}
          {order.specs && (
            <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs">
              <h3 className="text-[15px] font-bold text-neutral-900 mb-3">
                Custom Client Specifications
              </h3>
              <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-200/80">
                <pre className="text-[12px] font-mono text-neutral-700 whitespace-pre-wrap overflow-x-auto">
                  {typeof order.specs === 'string'
                    ? order.specs
                    : JSON.stringify(order.specs, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {order.reference_files && order.reference_files.length > 0 && (
            <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs">
              <h3 className="text-[15px] font-bold text-neutral-900 mb-3">
                Uploaded Client References
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.reference_files.map((fileUrl: string, idx: number) => (
                  <a
                    key={idx}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-4 w-4 text-neutral-500 shrink-0 stroke-[2]" />
                      <span className="text-[13px] font-semibold text-neutral-800 truncate">
                        File Asset {idx + 1}
                      </span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-neutral-400 shrink-0 stroke-[2]" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Customer Details, Admin Notes, History */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs space-y-3">
            <h3 className="text-[15px] font-bold text-neutral-900">
              Customer Information
            </h3>
            <div className="text-[13px] space-y-2.5 text-neutral-700">
              <p className="font-bold text-neutral-900 text-[15px]">
                {order.customer_name}
              </p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-neutral-400 stroke-[2]" />
                <span>{order.phone}</span>
              </div>
              {order.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-neutral-400 stroke-[2]" />
                  <span>{order.email}</span>
                </div>
              )}
              <div className="flex items-start gap-2 pt-2 border-t border-neutral-100">
                <MapPin className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5 stroke-[2]" />
                <div>
                  <p>{order.address}</p>
                  <p className="text-neutral-500">{order.area}, Lagos</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[13px] font-bold transition-colors"
              >
                <MessageSquare className="h-4 w-4 stroke-[2]" />
                <span>Contact via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Admin Internal Notes */}
          <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs space-y-3">
            <h3 className="text-[15px] font-bold text-neutral-900">
              Internal Admin Notes
            </h3>
            <p className="text-[12px] text-neutral-400">
              Private notes visible only to studio staff.
            </p>
            <textarea
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Garment printing scheduled for Friday, dispatch driver assigned."
              className="w-full p-3 rounded-xl border border-neutral-200 bg-neutral-50 text-[13px] text-neutral-900 outline-none focus:bg-white focus:border-neutral-900 placeholder:text-neutral-400 resize-none transition-all"
            />
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 text-white text-[12px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSavingNotes ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin stroke-[2]" />
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 stroke-[2]" />
                  <span>Save Notes</span>
                </>
              )}
            </button>
          </div>

          {/* Status History */}
          <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs">
            <h3 className="text-[15px] font-bold text-neutral-900 mb-3">
              Status Change Log
            </h3>
            {Array.isArray(order.status_history) && order.status_history.length > 0 ? (
              <div className="relative pl-5 space-y-3 border-l-2 border-neutral-200">
                {order.status_history.map((h: any, i: number) => (
                  <div key={i} className="relative text-[13px]">
                    <div className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-neutral-900" />
                    <p className="font-bold text-neutral-900 capitalize">
                      {h.status?.replace('_', ' ')}
                    </p>
                    {h.note && <p className="text-[12px] text-neutral-500 mt-0.5">{h.note}</p>}
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {new Date(h.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-neutral-400">No status updates logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
