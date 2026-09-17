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
  ArrowUpRight,
  Award,
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
        const { data: orders, error: ordersErr } = await supabase
          .from('orders')
          .select('id, paystack_ref, customer_name, total, status, type, created_at, area')
          .order('created_at', { ascending: false });

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
    <div className="space-y-8 font-sans text-neutral-900">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-sm space-y-3 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Gross Revenue</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p
              style={{ fontFamily: 'var(--font-jakarta)' }}
              className="text-[26px] sm:text-[32px] font-extrabold tracking-tight text-neutral-900 leading-none"
            >
              ₦{stats.totalRevenue.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="h-3 w-3" /> +14.2%
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">vs last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-sm space-y-3 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">In Production</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p
              style={{ fontFamily: 'var(--font-jakarta)' }}
              className="text-[26px] sm:text-[32px] font-extrabold tracking-tight text-neutral-900 leading-none"
            >
              {stats.inProduction}
            </p>
            <span className="text-[11px] font-medium text-neutral-400 mt-2 block">Active print & garment runs</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-sm space-y-3 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Pending Orders</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-[#5E17EB]">
              <AlertCircle className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p
              style={{ fontFamily: 'var(--font-jakarta)' }}
              className="text-[26px] sm:text-[32px] font-extrabold tracking-tight text-neutral-900 leading-none"
            >
              {stats.pendingOrders}
            </p>
            <span className="text-[11px] font-medium text-neutral-400 mt-2 block">Awaiting payment or quote</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-sm space-y-3 relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Total Orders</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p
              style={{ fontFamily: 'var(--font-jakarta)' }}
              className="text-[26px] sm:text-[32px] font-extrabold tracking-tight text-neutral-900 leading-none"
            >
              {stats.totalOrders}
            </p>
            <span className="text-[11px] font-medium text-emerald-600 mt-2 block">{stats.deliveredOrders} delivered to customers</span>
          </div>
        </motion.div>
      </div>

      {/* Production & Sales Activity Pipeline Chart Visualizer */}
      <div className="rounded-[28px] bg-white border border-neutral-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              style={{ fontFamily: 'var(--font-jakarta)' }}
              className="text-[20px] font-extrabold text-neutral-900 flex items-center gap-2.5"
            >
              <BarChart3 className="h-5 w-5 text-[#5E17EB] stroke-[2.5]" />
              <span>Studio Fulfillment Pipeline</span>
            </h2>
            <p className="text-[13px] text-neutral-500 mt-1">
              Live telemetry & order distribution across studio production stages
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[12px] font-extrabold bg-purple-50 text-[#5E17EB]">
            {stats.totalOrders} total jobs
          </span>
        </div>

        {/* Status Distribution Bars */}
        <div className="grid grid-cols-5 gap-4 pt-2">
          {[
            { label: 'Pending', count: stats.pendingOrders, color: 'from-amber-400 to-amber-500', textColor: 'text-amber-600' },
            { label: 'Production', count: stats.inProduction, color: 'from-blue-400 to-blue-600', textColor: 'text-blue-600' },
            { label: 'Delivered', count: stats.deliveredOrders, color: 'from-emerald-400 to-emerald-600', textColor: 'text-emerald-600' },
            { label: 'Customers', count: stats.totalCustomers, color: 'from-purple-400 to-[#5E17EB]', textColor: 'text-[#5E17EB]' },
            { label: 'Total Runs', count: stats.totalOrders, color: 'from-neutral-700 to-neutral-900', textColor: 'text-neutral-900' },
          ].map((bar, i) => {
            const heightPercent = stats.totalOrders > 0 ? Math.max(16, Math.min(100, (bar.count / stats.totalOrders) * 100)) : 20;
            return (
              <div key={bar.label} className="flex flex-col items-center">
                <div className="h-36 sm:h-44 w-full rounded-2xl bg-neutral-100 p-1.5 flex flex-col justify-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200, delay: i * 0.08 }}
                    className={`w-full rounded-xl bg-gradient-to-t ${bar.color} shadow-xs`}
                  />
                </div>
                <span className={`text-[15px] font-extrabold mt-3 ${bar.textColor}`}>{bar.count}</span>
                <span className="text-[11px] text-neutral-500 font-semibold text-center truncate w-full mt-0.5">
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Queue */}
      <div className="rounded-[28px] bg-white border border-neutral-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              style={{ fontFamily: 'var(--font-jakarta)' }}
              className="text-[20px] font-extrabold text-neutral-900"
            >
              Live Studio Order Stream
            </h2>
            <p className="text-[13px] text-neutral-500 mt-1">
              Real-time incoming customer orders and bespoke quote requests
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-[13px] font-bold text-[#5E17EB] hover:underline"
          >
            <span>View All Stream</span>
            <ChevronRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#5E17EB] mx-auto stroke-[2]" />
            <p className="text-[13px] text-neutral-400 mt-2">Connecting to live order stream...</p>
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {recentOrders.map((ord) => (
              <Link
                key={ord.id}
                href={`/admin/orders`}
                className="block py-4 hover:bg-neutral-50 rounded-2xl px-3 transition-colors group"
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
                    <p className="text-[15px] font-extrabold text-neutral-900">
                      {ord.total > 0 ? `₦${Number(ord.total).toLocaleString()}` : 'Quote'}
                    </p>
                    <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-[#5E17EB] group-hover:translate-x-1 transition-all" />
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
