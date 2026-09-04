'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Phone,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Download,
} from 'lucide-react';

interface OrderDetail {
  id: string;
  paystack_ref: string;
  type: string;
  status: string;
  total: number;
  subtotal: number;
  delivery_fee: number;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  area: string;
  specs: any;
  reference_files: string[];
  status_history: Array<{ status: string; timestamp: string; note?: string }>;
  created_at: string;
  order_items?: Array<{
    id: string;
    quantity: number;
    price_at_purchase: number;
    variants?: {
      size: string;
      color: string;
      products?: {
        name: string;
        image_url: string;
      };
    };
  }>;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !orderId) return;

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
                size,
                color,
                products (
                  name,
                  image_url
                )
              )
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) {
          setError('Order record not found or inaccessible.');
        } else {
          setOrder(data);
        }
      } catch (err: any) {
        setError(err?.message || 'Error loading order details.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrder();
  }, [user, orderId]);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-16 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mx-auto stroke-[2]" />
        <p className="text-xs text-neutral-400 mt-2">Retrieving order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-10 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3 stroke-[1.75]" />
        <h3 className="text-base font-semibold text-neutral-950 dark:text-white">
          Order Not Found
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
          {error || 'This order could not be located on your studio account.'}
        </p>
        <div className="mt-5">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5 stroke-[2]" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const history = Array.isArray(order.status_history) ? order.status_history : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-950 dark:hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="h-3 w-3 stroke-[2]" />
            <span>Back to Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium tracking-tight text-neutral-950 dark:text-white">
              Order {order.paystack_ref}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {order.type}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Placed on{' '}
            {new Date(order.created_at).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-neutral-400 block">Total Investment</span>
          <span className="text-xl font-bold text-neutral-950 dark:text-white">
            {order.total > 0 ? `₦${Number(order.total).toLocaleString()}` : 'Quote Request'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Order Items & Specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Section */}
          <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 shadow-xs">
            <h3 className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-white mb-4">
              Purchased Items
            </h3>

            {order.order_items && order.order_items.length > 0 ? (
              <div className="divide-y divide-neutral-100 dark:divide-white/10">
                {order.order_items.map((item, idx) => {
                  const product = item.variants?.products;
                  const variant = item.variants;
                  return (
                    <div key={item.id || idx} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 shrink-0 rounded-xl bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center border border-neutral-200/60 dark:border-white/10">
                          {product?.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name || 'Product'}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-neutral-400 stroke-[1.5]" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-neutral-950 dark:text-white">
                            {product?.name || 'Studio Piece'}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            {variant?.size && `Size: ${variant.size}`}
                            {variant?.color && ` • Color: ${variant.color}`}
                            {' • '}Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-semibold text-neutral-950 dark:text-white">
                          ₦{Number(item.price_at_purchase * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          ₦{Number(item.price_at_purchase).toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-neutral-400">Custom production brief — see specifications below.</p>
            )}

            {/* Subtotal breakdown */}
            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-white/10 space-y-1 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>₦{Number(order.subtotal || order.total).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Delivery Fee ({order.area || 'Lagos'})</span>
                <span>{order.delivery_fee > 0 ? `₦${Number(order.delivery_fee).toLocaleString()}` : 'Free'}</span>
              </div>
              <div className="flex justify-between font-semibold text-neutral-950 dark:text-white pt-2 border-t border-neutral-100 dark:border-white/10">
                <span>Total</span>
                <span>₦{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Custom Specifications (if present) */}
          {order.specs && (
            <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 shadow-xs">
              <h3 className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-white mb-3">
                Custom Production Brief
              </h3>
              <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800/50 p-4 border border-neutral-100 dark:border-white/5">
                <pre className="text-xs font-mono text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap overflow-x-auto">
                  {typeof order.specs === 'string'
                    ? order.specs
                    : JSON.stringify(order.specs, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Reference Files */}
          {order.reference_files && order.reference_files.length > 0 && (
            <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 shadow-xs">
              <h3 className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-white mb-3">
                Uploaded Reference Files
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.reference_files.map((fileUrl, idx) => (
                  <a
                    key={idx}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-800/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-4 w-4 text-neutral-500 shrink-0 stroke-[1.75]" />
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        Reference Asset {idx + 1}
                      </span>
                    </div>
                    <Download className="h-3.5 w-3.5 text-neutral-400 shrink-0 stroke-[2]" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Fulfillment Timeline & Delivery Info */}
        <div className="space-y-6">
          {/* Delivery Details */}
          <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-white">
              Delivery Destination
            </h3>
            <div className="text-xs space-y-2 text-neutral-600 dark:text-neutral-300">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5 stroke-[1.75]" />
                <div>
                  <p className="font-medium text-neutral-950 dark:text-white">
                    {order.customer_name}
                  </p>
                  <p>{order.address}</p>
                  <p>{order.area}, Lagos State</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-white/10">
                <Phone className="h-4 w-4 text-neutral-400 shrink-0 stroke-[1.75]" />
                <span>{order.phone}</span>
              </div>
            </div>
          </div>

          {/* Fulfillment Status History Audit */}
          <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 shadow-xs">
            <h3 className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-white mb-4">
              Status Milestones
            </h3>

            {history.length > 0 ? (
              <div className="relative pl-6 space-y-4 border-l-2 border-neutral-200 dark:border-white/10">
                {history.map((h, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-0.5 h-3.5 w-3.5 rounded-full bg-neutral-950 dark:bg-white border-2 border-white dark:border-neutral-900" />
                    <p className="text-xs font-semibold capitalize text-neutral-950 dark:text-white">
                      {h.status.replace('_', ' ')}
                    </p>
                    {h.note && (
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {h.note}
                      </p>
                    )}
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {new Date(h.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400">Order is pending verification.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
