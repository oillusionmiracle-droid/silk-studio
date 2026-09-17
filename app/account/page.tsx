'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { useWishlist } from '@/lib/WishlistContext';
import {
  Package,
  Heart,
  Clock,
  ArrowRight,
  CheckCircle2,
  Truck,
  Sparkles,
  ShoppingBag,
  Palette,
  Loader2,
  ExternalLink,
  ChevronRight,
  User,
  MapPin,
  Phone,
  ShieldCheck,
  Check,
  Plus,
  MessageCircle,
  Share2,
  FileText,
  HelpCircle,
  LogOut,
  FolderOpen,
  Lock,
  CreditCard,
  Building,
  Sliders,
  Bell,
  Award,
  Bookmark,
  Zap,
  Settings,
} from 'lucide-react';

interface OrderSummary {
  id: string;
  paystack_ref: string;
  type: string;
  total: number;
  status: string;
  created_at: string;
  address: string;
  area: string;
  order_items?: Array<{ id: string; quantity: number; price_at_purchase: number }>;
}

const MILESTONES = [
  { key: 'pending', label: 'Placed' },
  { key: 'paid', label: 'Paid' },
  { key: 'in_production', label: 'Production' },
  { key: 'shipped', label: 'Dispatched' },
  { key: 'delivered', label: 'Delivered' },
];

function getMilestoneIndex(status: string): number {
  switch (status) {
    case 'pending':
    case 'quote_requested':
      return 0;
    case 'paid':
    case 'confirmed':
      return 1;
    case 'in_production':
      return 2;
    case 'ready':
    case 'shipped':
      return 3;
    case 'delivered':
      return 4;
    default:
      return 0;
  }
}

/* ── Circular Progress Meter (Plum / Bing style) ── */
function RadialProgress({ percentage }: { percentage: number }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 68 68">
        <circle
          cx="34"
          cy="34"
          r={radius}
          stroke="currentColor"
          strokeWidth="5"
          className="text-neutral-100"
          fill="transparent"
        />
        <circle
          cx="34"
          cy="34"
          r={radius}
          stroke="currentColor"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-[#5E17EB] transition-all duration-1000 ease-out"
          fill="transparent"
        />
      </svg>
      <span className="absolute text-[13px] font-extrabold tracking-tight text-neutral-900">
        {percentage}%
      </span>
    </div>
  );
}

export default function AccountOverviewPage() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const { totalItems: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const currentUserId = user.id;

    async function loadOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', currentUserId)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Orders query notice:', error.message);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.warn('Orders query exception:', err);
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrders();
  }, [user]);

  const activeOrders = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );
  const completedOrders = orders.filter((o) => o.status === 'delivered');

  const displayName =
    profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Studio Member';
  const displayEmail = user?.email || '';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  const handle = displayName.toLowerCase().replace(/\s+/g, '_');

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';

  // Account setup completion steps
  const completionSteps = useMemo(() => {
    const hasName = Boolean(profile?.full_name || user?.user_metadata?.full_name);
    const hasPhone = Boolean(profile?.phone);
    const hasAddress = Boolean(profile?.default_address);
    const hasOrder = orders.length > 0;
    const steps = [
      { id: 'name', label: 'Set studio display name', completed: hasName, href: '/account/settings' },
      { id: 'phone', label: 'Verify contact phone number', completed: hasPhone, href: '/account/settings' },
      { id: 'address', label: 'Add Lagos delivery address', completed: hasAddress, href: '/account/settings' },
      { id: 'order', label: 'Place your first studio order', completed: hasOrder, href: '/apparel' },
    ];
    const completedCount = steps.filter((s) => s.completed).length;
    const percentage = Math.round((completedCount / steps.length) * 100);
    return { steps, percentage, completedCount, totalCount: steps.length };
  }, [profile, user, orders]);

  return (
    <div className="font-sans antialiased text-neutral-900 w-full space-y-8">
      {/* ── Top Header Greeting (Screenshot 1 "Morning, Alex" Style) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1
            style={{ fontFamily: 'var(--font-jakarta)' }}
            className="text-[32px] sm:text-[40px] font-extrabold text-neutral-900 tracking-tight leading-tight"
          >
            {greeting}, {displayName.split(' ')[0]}
          </h1>
          <p className="text-[14px] text-neutral-500 font-medium mt-1">
            @{handle} • {displayEmail}
          </p>
        </div>

        {/* User Avatar Card (Screenshot 3 "John Mobbin" style) */}
        <div className="flex items-center gap-3.5 p-2.5 pr-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm w-fit">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white text-lg font-bold shadow-md">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-bold text-neutral-900">{displayName}</span>
              <ChevronRight className="h-4 w-4 text-neutral-400 stroke-[2.5]" />
            </div>
            <span className="text-[12px] font-medium text-blue-600">VIP Studio Collector</span>
          </div>
        </div>
      </div>

      {/* ── Plum-Inspired Electric Purple Card (Screenshot 2) ── */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#5E17EB] via-[#6F26FF] to-[#4700D8] p-6 sm:p-8 text-white shadow-xl shadow-purple-600/20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-purple-200">
                Silk Studio Collector Value ⓘ
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span
                style={{ fontFamily: 'var(--font-jakarta)' }}
                className="text-[42px] sm:text-[52px] font-extrabold tracking-tight text-white leading-none"
              >
                {activeOrders.length > 0 ? `${activeOrders.length} Active Jobs` : 'Ready to Drop'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold text-purple-200 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                ▲ {completedOrders.length} Orders Delivered
              </span>
              <span>• Lagos, Nigeria</span>
            </div>
          </div>

          <Link
            href="/order"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#5E17EB] font-bold text-[14px] hover:bg-purple-50 transition-all shadow-lg active:scale-95 shrink-0"
          >
            <Plus className="h-4.5 w-4.5 stroke-[3]" />
            <span>Create Custom Order</span>
          </Link>
        </div>
      </div>

      {/* ── Bing 3-Column Metric Card (Screenshot 3) ── */}
      <div className="rounded-[24px] bg-white border border-neutral-200/80 p-5 shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0">
        <div className="flex flex-col items-center justify-center text-center p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#5E17EB] mb-2">
            <Package className="h-5 w-5 stroke-[2]" />
          </div>
          <span
            style={{ fontFamily: 'var(--font-jakarta)' }}
            className="text-[28px] font-extrabold text-neutral-900 leading-tight"
          >
            {activeOrders.length}
          </span>
          <span className="text-[12px] font-semibold text-neutral-500 mt-0.5">Active Production</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-2">
            <Award className="h-5 w-5 stroke-[2]" />
          </div>
          <span
            style={{ fontFamily: 'var(--font-jakarta)' }}
            className="text-[28px] font-extrabold text-neutral-900 leading-tight"
          >
            {completedOrders.length}
          </span>
          <span className="text-[12px] font-semibold text-neutral-500 mt-0.5">Completed Orders</span>
        </div>

        <div className="flex flex-col items-center justify-center text-center p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-2">
            <Heart className="h-5 w-5 stroke-[2]" />
          </div>
          <span
            style={{ fontFamily: 'var(--font-jakarta)' }}
            className="text-[28px] font-extrabold text-neutral-900 leading-tight"
          >
            {wishlistCount}
          </span>
          <span className="text-[12px] font-semibold text-neutral-500 mt-0.5">Saved Wishlist</span>
        </div>
      </div>

      {/* ── 2-Column Main Dashboard Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left / Main Column (2 Spans) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Order Progress Stepper */}
          {activeOrders.length > 0 ? (
            <div className="rounded-[26px] bg-white border border-neutral-200/80 p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5E17EB] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#5E17EB] animate-ping" />
                    Live Fulfillment Tracking
                  </span>
                  <h2
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                    className="text-[20px] font-extrabold text-neutral-900 mt-1"
                  >
                    Order #{activeOrders[0].paystack_ref.substring(0, 14)}
                  </h2>
                </div>
                <Link
                  href="/account/orders"
                  className="text-[13px] font-bold text-[#5E17EB] hover:underline flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>

              {/* Milestones Stepper */}
              <div className="pt-2">
                <div className="grid grid-cols-5 gap-2 text-center">
                  {MILESTONES.map((step, idx) => {
                    const currentIdx = getMilestoneIndex(activeOrders[0].status);
                    const isComplete = idx <= currentIdx;
                    return (
                      <div key={step.key} className="flex flex-col items-center gap-2">
                        <div
                          className={`h-2.5 w-full rounded-full transition-all duration-500 ${
                            isComplete
                              ? 'bg-[#5E17EB] shadow-xs'
                              : 'bg-neutral-100'
                          }`}
                        />
                        <span
                          className={`text-[12px] ${
                            isComplete
                              ? 'text-neutral-900 font-bold'
                              : 'text-neutral-400 font-medium'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[26px] bg-white border border-neutral-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                  className="text-[18px] font-extrabold text-neutral-900"
                >
                  No active orders in production
                </h3>
                <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">
                  Explore our latest streetwear collection or request a bespoke garment run.
                </p>
              </div>
              <Link
                href="/apparel"
                className="px-5 py-3 rounded-full bg-neutral-950 text-white font-bold text-[13px] hover:bg-neutral-800 transition-colors shrink-0 text-center"
              >
                Shop Apparel
              </Link>
            </div>
          )}

          {/* Studio Services Cards (Plum / Future Pro Grid Style) */}
          <div className="space-y-4">
            <h2
              style={{ fontFamily: 'var(--font-jakarta)' }}
              className="text-[20px] font-extrabold text-neutral-900"
            >
              Studio Services & Drops
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/order" className="block group">
                <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-[#5E17EB]">
                      <Sparkles className="h-6 w-6 stroke-[2]" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-300 group-hover:text-[#5E17EB] group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3
                      style={{ fontFamily: 'var(--font-jakarta)' }}
                      className="text-[16px] font-bold text-neutral-900 group-hover:text-[#5E17EB] transition-colors"
                    >
                      Custom Apparel Drop
                    </h3>
                    <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">
                      Screenprinting, puff prints, embroidered hoodies & bespoke cut-and-sew blanks.
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/account/files" className="block group">
                <div className="rounded-[24px] bg-white border border-neutral-200/80 p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <FolderOpen className="h-6 w-6 stroke-[2]" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-neutral-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3
                      style={{ fontFamily: 'var(--font-jakarta)' }}
                      className="text-[16px] font-bold text-neutral-900 group-hover:text-blue-600 transition-colors"
                    >
                      Digital Asset Vault
                    </h3>
                    <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">
                      High-resolution vector files, design proofs, and tech packs from your orders.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (1 Span) */}
        <div className="space-y-6">
          {/* Plum / Future Pro Style Setup Progress Card (Screenshot 2) */}
          <div className="rounded-[26px] bg-white border border-neutral-200/80 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-4">
              <RadialProgress percentage={completionSteps.percentage} />
              <div>
                <h3
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                  className="text-[16px] font-extrabold text-neutral-900"
                >
                  Profile Setup
                </h3>
                <p className="text-[12px] font-semibold text-purple-600 mt-0.5">
                  {completionSteps.completedCount} of {completionSteps.totalCount} complete
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-neutral-100">
              {completionSteps.steps.map((step) => (
                <Link key={step.id} href={step.href} className="block group">
                  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-bold ${step.completed ? 'bg-purple-100 text-[#5E17EB]' : 'border-2 border-neutral-200 text-transparent'}`}>
                        ✓
                      </div>
                      <span className={`text-[13px] ${step.completed ? 'text-neutral-400 line-through font-medium' : 'text-neutral-900 font-semibold group-hover:text-[#5E17EB]'}`}>
                        {step.label}
                      </span>
                    </div>
                    {!step.completed && (
                      <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-[#5E17EB]" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bing Menu Action List (Screenshot 3) */}
          <div className="rounded-[26px] bg-white border border-neutral-200/80 p-3 shadow-sm divide-y divide-neutral-100">
            <Link href="/account/orders" className="block">
              <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <Package className="h-5 w-5 text-neutral-700 stroke-[1.8]" />
                  <span className="text-[14px] font-semibold text-neutral-900">Orders & Live Tracking</span>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </div>
            </Link>

            <Link href="/account/wishlist" className="block">
              <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <Heart className="h-5 w-5 text-neutral-700 stroke-[1.8]" />
                  <span className="text-[14px] font-semibold text-neutral-900">Saved Wishlist</span>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </div>
            </Link>

            <Link href="/account/settings" className="block">
              <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <Settings className="h-5 w-5 text-neutral-700 stroke-[1.8]" />
                  <span className="text-[14px] font-semibold text-neutral-900">Delivery & Profile Settings</span>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </div>
            </Link>

            <a
              href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I%27d+like+VIP+concierge+support"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex items-center justify-between p-3.5 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <MessageCircle className="h-5 w-5 text-emerald-600 stroke-[1.8]" />
                  <span className="text-[14px] font-semibold text-neutral-900">WhatsApp VIP Concierge</span>
                </div>
                <ExternalLink className="h-4 w-4 text-neutral-400" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
