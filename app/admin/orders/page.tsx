'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
}

interface OrderRecord {
  id: string;
  paystack_ref: string;
  type: 'apparel' | 'custom';
  status: string;
  total: number;
  created_at: string;
  customer_name: string;
  phone: string;
  email: string | null;
  area: string;
  order_items?: OrderItem[];
}

const STATUS_OPTIONS = [
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

export default function AdminOrdersPage() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Orders fetch error:', error.message);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.warn('Orders exception:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrders();
  }, []);

  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      alert('Failed to update status: ' + (err?.message || 'Error'));
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      order.paystack_ref.toLowerCase().includes(query) ||
      (order.customer_name || '').toLowerCase().includes(query) ||
      (order.phone || '').toLowerCase().includes(query) ||
      (order.area || '').toLowerCase().includes(query);

    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Controls */}
      <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-bold text-neutral-900">
              Studio Orders ({filteredOrders.length})
            </h2>
            <p className="text-[13px] text-neutral-500 mt-0.5">
              Manage apparel shop orders and custom branding quote pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-[13px] font-semibold text-neutral-800 outline-none focus:border-neutral-900 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-[13px] font-semibold text-neutral-800 outline-none focus:border-neutral-900 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="apparel">Apparel</option>
              <option value="custom">Custom Print</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 focus-within:bg-white focus-within:border-neutral-900 transition-all">
          <Search className="h-4 w-4 text-neutral-400 stroke-[2]" />
          <input
            type="text"
            placeholder="Search by customer name, Paystack reference, phone, or LGA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[13px] text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="rounded-[24px] bg-white border border-neutral-200/80 p-16 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mx-auto stroke-[2]" />
          <p className="text-[13px] text-neutral-400 mt-2">Loading studio orders...</p>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => {
              const isUpdating = updatingId === order.id;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[22px] bg-white border border-neutral-200/80 p-5 shadow-xs hover:border-neutral-300 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[13px] font-bold text-neutral-900">
                          {order.paystack_ref}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-700">
                          {order.type}
                        </span>
                        <span className="text-[14px] font-bold text-neutral-900">
                          {order.customer_name}
                        </span>
                      </div>
                      <p className="text-[12px] text-neutral-500">
                        {order.phone} • {order.email || 'No email'} • {order.area || 'Lagos'} •{' '}
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-3 flex-wrap">
                      <div className="text-left lg:text-right pr-2">
                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total</p>
                        <p className="text-[15px] font-bold text-neutral-900">
                          {order.total > 0 ? `₦${Number(order.total).toLocaleString()}` : 'Quote'}
                        </p>
                      </div>

                      {/* Quick Status Selector */}
                      <div className="flex items-center gap-1.5">
                        <select
                          disabled={isUpdating}
                          value={order.status}
                          onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 text-[12px] font-semibold text-neutral-800 outline-none focus:border-neutral-900 disabled:opacity-50 capitalize cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-[12px] font-bold hover:bg-neutral-800 transition-colors shadow-xs"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="rounded-[24px] bg-white border border-neutral-200/80 p-12 text-center">
          <p className="text-[14px] text-neutral-500">
            No orders match your filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
