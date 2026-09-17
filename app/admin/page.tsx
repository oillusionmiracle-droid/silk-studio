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
  Zap,
  Activity,
  Layers,
  ArrowUpRight,
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
    <div className="space-y-8 font-sans text-white">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[24px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-5 shadow-2xl space-y-3 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Gross Revenue</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <DollarSign className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p className="text-[24px] sm:text-[30px] font-extrabold tracking-tight text-white">
              ₦{stats.totalRevenue.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" /> +14.2%
              </span>
              <span className="text-[11px] text-neutral-400">vs last month</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[24px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-5 shadow-2xl space-y-3 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">In Production</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Clock className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p className="text-[24px] sm:text-[30px] font-extrabold tracking-tight text-white">
              {stats.inProduction}
            </p>
            <span className="text-[11px] text-neutral-400 mt-1 block">Active garment & print runs</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[24px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-5 shadow-2xl space-y-3 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Pending Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <AlertCircle className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p className="text-[24px] sm:text-[30px] font-extrabold tracking-tight text-white">
              {stats.pendingOrders}
            </p>
            <span className="text-[11px] text-neutral-400 mt-1 block">Awaiting payment or quote</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="rounded-[24px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-5 shadow-2xl space-y-3 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Total Orders</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Package className="h-4.5 w-4.5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <p className="text-[24px] sm:text-[30px] font-extrabold tracking-tight text-white">
              {stats.totalOrders}
            </p>
            <span className="text-[11px] text-emerald-400 mt-1 block">{stats.deliveredOrders} delivered to customers</span>
          </div>
        </motion.div>
      </div>

      {/* Production & Sales Activity Chart Visualizer */}
      <div className="rounded-[28px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-[18px] font-bold text-white flex items-center gap-2.5">
              <BarChart3 className="h-5 w-5 text-cyan-400 stroke-[2.5]" />
              <span>Studio Fulfillment Pipeline</span>
            </h2>
            <p className="text-[13px] text-neutral-400 mt-1">
              Live telemetry & distribution across studio production stages
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-[12px] font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {stats.totalOrders} total jobs
          </span>
        </div>

        {/* Status Distribution Bars */}
        <div className="grid grid-cols-5 gap-4 pt-2">
          {[
            { label: 'Pending', count: stats.pendingOrders, color: 'from-amber-500 to-orange-600', textColor: 'text-amber-400' },
            { label: 'Production', count: stats.inProduction, color: 'from-blue-500 to-indigo-600', textColor: 'text-blue-400' },
            { label: 'Delivered', count: stats.deliveredOrders, color: 'from-emerald-400 to-teal-600', textColor: 'text-emerald-400' },
            { label: 'Customers', count: stats.totalCustomers, color: 'from-purple-500 to-pink-600', textColor: 'text-purple-400' },
            { label: 'Total Runs', count: stats.totalOrders, color: 'from-cyan-400 to-blue-600', textColor: 'text-cyan-400' },
          ].map((bar, i) => {
            const heightPercent = stats.totalOrders > 0 ? Math.max(16, Math.min(100, (bar.count / stats.totalOrders) * 100)) : 20;
            return (
              <div key={bar.label} className="flex flex-col items-center">
                <div className="h-36 sm:h-44 w-full rounded-2xl bg-white/[0.03] border border-white/[0.06] p-1.5 flex flex-col justify-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200, delay: i * 0.08 }}
                    className={`w-full rounded-xl bg-gradient-to-t ${bar.color} shadow-[0_0_20px_rgba(6,182,212,0.2)]`}
                  />
                </div>
                <span className={`text-[15px] font-extrabold mt-3 ${bar.textColor}`}>{bar.count}</span>
                <span className="text-[11px] text-neutral-400 font-medium text-center truncate w-full mt-0.5">
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Queue */}
      <div className="rounded-[28px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[18px] font-bold text-white">
              Live Studio Order Stream
            </h2>
            <p className="text-[13px] text-neutral-400 mt-1">
              Real-time incoming customer orders and bespoke quote requests
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-[13px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All Stream</span>
            <ChevronRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-cyan-400 mx-auto stroke-[2]" />
            <p className="text-[13px] text-neutral-400 mt-2">Connecting to live order stream...</p>
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="divide-y divide-white/[0.06]">
            {recentOrders.map((ord) => (
              <Link
                key={ord.id}
                href={`/admin/orders`}
                className="block py-4 hover:bg-white/[0.04] rounded-2xl px-3 transition-colors group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[13px] font-bold text-cyan-300">
                        {ord.paystack_ref}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/10 text-neutral-300 border border-white/10">
                        {ord.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[13px] text-neutral-400 mt-1">
                      {ord.customer_name} • {ord.area || 'Lagos'} •{' '}
                      {new Date(ord.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <p className="text-[15px] font-bold text-white">
                      {ord.total > 0 ? `₦${Number(ord.total).toLocaleString()}` : 'Quote'}
                    </p>
                    <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
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
