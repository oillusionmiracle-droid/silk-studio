'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Users,
  Loader2,
  DollarSign,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  inProduction: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalCustomers: number;
}

interface OrderPreview {
  id: string;
  paystack_ref: string;
  customer_name: string;
  total: number;
  status: string;
  type: string;
  created_at: string;
  area: string;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalRevenue: 0,
    totalOrders: 0,
    inProduction: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<OrderPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        // Fetch all orders
        const { data: orders, error: ordersErr } = await supabase
          .from('orders')
          .select('id, paystack_ref, customer_name, total, status, type, created_at, area')
          .order('created_at', { ascending: false });

        // Fetch customer count
        const { count: customerCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (orders) {
          let rev = 0;
          let inProd = 0;
          let pend = 0;
          let deliv = 0;

          for (const ord of orders) {
            if (['paid', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered'].includes(ord.status)) {
              rev += Number(ord.total) || 0;
            }
            if (ord.status === 'in_production') inProd++;
            if (ord.status === 'pending' || ord.status === 'quote_requested') pend++;
            if (ord.status === 'delivered') deliv++;
          }

          setStats({
            totalRevenue: rev,
            totalOrders: orders.length,
            inProduction: inProd,
            pendingOrders: pend,
            deliveredOrders: deliv,
            totalCustomers: customerCount || 0,
          });

          setRecentOrders(orders.slice(0, 6));
        }
      } catch (err) {
        console.warn('Admin stats error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void loadAdminData();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-[22px] bg-white border border-neutral-200/80 p-5 shadow-xs"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Gross Revenue</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-[22px] sm:text-[26px] font-bold tracking-tight text-neutral-900">
            ₦{stats.totalRevenue.toLocaleString()}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">
            Completed transactions
          </span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-[22px] bg-white border border-neutral-200/80 p-5 shadow-xs"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Production</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-[22px] sm:text-[26px] font-bold tracking-tight text-neutral-900">
            {stats.inProduction}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Active print & garment runs</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-[22px] bg-white border border-neutral-200/80 p-5 shadow-xs"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Orders</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <AlertCircle className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-[22px] sm:text-[26px] font-bold tracking-tight text-neutral-900">
            {stats.pendingOrders}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">Awaiting payment or quote</span>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-[22px] bg-white border border-neutral-200/80 p-5 shadow-xs"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Package className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="text-[22px] sm:text-[26px] font-bold tracking-tight text-neutral-900">
            {stats.totalOrders}
          </p>
          <span className="text-[11px] text-neutral-400 mt-1 block">{stats.deliveredOrders} delivered</span>
        </motion.div>
      </div>

      {/* Production & Sales Activity Chart */}
      <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[17px] font-bold text-neutral-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-neutral-700 stroke-[2]" />
              <span>Studio Fulfillment Pipeline</span>
            </h2>
            <p className="text-[13px] text-neutral-500 mt-0.5">
              Live distribution of orders across studio stages
            </p>
          </div>
          <span className="text-[12px] font-bold text-neutral-400">{stats.totalOrders} units</span>
        </div>

        {/* Status Distribution Bars */}
        <div className="grid grid-cols-5 gap-3 pt-2">
          {[
            { label: 'Pending', count: stats.pendingOrders, color: 'bg-amber-500' },
            { label: 'Production', count: stats.inProduction, color: 'bg-blue-500' },
            { label: 'Delivered', count: stats.deliveredOrders, color: 'bg-emerald-500' },
            { label: 'Customers', count: stats.totalCustomers, color: 'bg-purple-500' },
            { label: 'Total Runs', count: stats.totalOrders, color: 'bg-neutral-900' },
          ].map((bar, i) => {
            const heightPercent = stats.totalOrders > 0 ? Math.max(12, Math.min(100, (bar.count / stats.totalOrders) * 100)) : 15;
            return (
              <div key={bar.label} className="flex flex-col items-center">
                <div className="h-32 sm:h-36 w-full rounded-2xl bg-neutral-100 p-1 flex flex-col justify-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200, delay: i * 0.08 }}
                    className={`w-full rounded-xl ${bar.color} opacity-90 shadow-xs`}
                  />
                </div>
                <span className="text-[13px] font-bold text-neutral-900 mt-2">{bar.count}</span>
                <span className="text-[11px] text-neutral-400 text-center truncate w-full mt-0.5">
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Queue */}
      <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[17px] font-bold text-neutral-900">
              Recent Studio Orders
            </h2>
            <p className="text-[13px] text-neutral-500 mt-0.5">
              Latest apparel purchases and custom design requests
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-[13px] font-bold text-neutral-900 hover:underline underline-offset-4"
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400 mx-auto stroke-[2]" />
            <p className="text-[13px] text-neutral-400 mt-2">Loading orders...</p>
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {recentOrders.map((ord) => (
              <Link
                key={ord.id}
                href={`/admin/orders/${ord.id}`}
                className="block py-4 hover:bg-neutral-50 rounded-xl px-2 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[13px] font-bold text-neutral-900">
                        {ord.paystack_ref}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-700">
                        {ord.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize bg-emerald-50 text-emerald-800">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[13px] text-neutral-500 mt-1">
                      {ord.customer_name} • {ord.area || 'Lagos'} •{' '}
                      {new Date(ord.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <p className="text-[14px] font-bold text-neutral-900">
                      {ord.total > 0 ? `₦${Number(ord.total).toLocaleString()}` : 'Quote'}
                    </p>
                    <ChevronRight className="h-4 w-4 text-neutral-400 stroke-[2]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-[13px] text-neutral-400">
            No studio orders recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
