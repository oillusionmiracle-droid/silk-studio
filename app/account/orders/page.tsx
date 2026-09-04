'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  Package,
  Search,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Loader2,
} from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  variant_id?: string;
}

interface OrderRecord {
  id: string;
  paystack_ref: string;
  type: 'apparel' | 'custom';
  status: string;
  total: number;
  created_at: string;
  address: string;
  area: string;
  specs?: any;
  order_items?: OrderItem[];
}

export default function AccountOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'apparel' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;
    const currentUserId = user.id;

    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', currentUserId)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Error fetching orders:', error.message);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.warn('Orders exception:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    const matchesType = filterType === 'all' || order.type === filterType;
    const matchesSearch =
      order.paystack_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.area || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
            <CheckCircle2 className="h-3 w-3 stroke-[2]" />
            Paid
          </span>
        );
      case 'in_production':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
            <Clock className="h-3 w-3 stroke-[2]" />
            In Production
          </span>
        );
      case 'shipped':
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-900/40">
            <Truck className="h-3 w-3 stroke-[2]" />
            Dispatched
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
            <CheckCircle2 className="h-3 w-3 stroke-[2]" />
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
            <Clock className="h-3 w-3 stroke-[2]" />
            {status.replace('_', ' ')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium tracking-tight text-neutral-950 dark:text-white">
              Order History & Tracking
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Track fulfillment progress and inspect full invoice breakdowns.
            </p>
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-medium self-start sm:self-auto">
            {(['all', 'apparel', 'custom'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  filterType === t
                    ? 'bg-white dark:bg-neutral-900 text-neutral-950 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-800/40">
          <Search className="h-4 w-4 text-neutral-400 stroke-[1.75]" />
          <input
            type="text"
            placeholder="Search by order reference or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-neutral-900 dark:text-neutral-100 outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-16 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mx-auto stroke-[2]" />
          <p className="text-xs text-neutral-400 mt-2">Loading your orders...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => {
              const itemCount = order.order_items?.reduce((acc, i) => acc + (i.quantity || 1), 0) || 1;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-5 shadow-xs hover:border-neutral-300 dark:hover:border-white/20 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-950 dark:text-white">
                          {order.paystack_ref}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          {order.type}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {new Date(order.created_at).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        • {order.area ? `${order.area}, Lagos` : 'Lagos'} • {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100 dark:border-white/10">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-neutral-400">Total Amount</p>
                        <p className="text-sm font-semibold text-neutral-950 dark:text-white">
                          {order.total > 0 ? `₦${Number(order.total).toLocaleString()}` : 'Quote Request'}
                        </p>
                      </div>

                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-medium hover:opacity-90 transition-opacity shadow-xs"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5 stroke-[2]" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-16 text-center">
          <Package className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3 stroke-[1.5]" />
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            No matching orders found
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            {searchQuery
              ? 'Try modifying your search reference or clear active filters.'
              : 'You have not placed any orders with this studio account yet.'}
          </p>
          <div className="mt-5">
            <Link
              href="/apparel"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider hover:opacity-90 shadow-xs"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
