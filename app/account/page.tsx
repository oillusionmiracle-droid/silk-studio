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

/* ─── Circular Progress Meter (Peerlist style) ─── */
function RadialProgress({ percentage }: { percentage: number }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-18 h-18 -rotate-90" viewBox="0 0 76 76">
        <circle
          cx="38"
          cy="38"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          className="text-neutral-200"
          fill="transparent"
        />
        <circle
          cx="38"
          cy="38"
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-emerald-500 transition-all duration-1000 ease-out"
          fill="transparent"
        />
      </svg>
      <span className="absolute text-[14px] font-bold tracking-tight text-neutral-900">
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

  // Peerlist-style profile completion steps
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
    return { steps, percentage };
  }, [profile, user, orders]);

  return (
    <div className="font-sans antialiased text-neutral-900">
      {/* ═════════════════════════════════════════════════════════
          MOBILE VIEW (Exact Airbnb iOS Style — screens < 768px)
      ═════════════════════════════════════════════════════════ */}
      <div className="md:hidden max-w-lg mx-auto px-1 pb-32">
        {/* Large Airbnb Title */}
        <div className="pt-2 pb-5">
          <h1 className="text-[34px] font-bold text-neutral-900 tracking-tight">
            Profile
          </h1>
        </div>

        {/* User Card Row (Judy style) */}
        <Link
          href="/account/settings"
          className="group block"
        >
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between py-3 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 border border-neutral-200/80 text-xl font-bold shadow-xs">
                {initials}
              </div>
              <div>
                <h2 className="text-[19px] font-semibold text-neutral-900 leading-snug">
                  {displayName}
                </h2>
                <p className="text-[14px] text-neutral-500 font-normal mt-0.5">
                  Show profile
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-neutral-400 stroke-[2] group-hover:text-neutral-700 transition-colors" />
          </motion.div>
        </Link>

        <div className="h-px bg-neutral-200/80 my-4" />

        {/* Promo Banner Card ("Airbnb your place" style) */}
        <Link href="/order" className="block my-6">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="rounded-[22px] bg-white border border-neutral-200/80 p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex items-center justify-between gap-4 cursor-pointer"
          >
            <div className="space-y-1 pr-2">
              <h3 className="text-[17px] font-bold text-neutral-900 leading-snug">
                Produce your own merch
              </h3>
              <p className="text-[13px] text-neutral-500 leading-relaxed">
                It’s simple to get custom screenprints, puff prints & bespoke apparel drops.
              </p>
            </div>
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-md">
              <Sparkles className="h-7 w-7 text-[#C6FF33]" />
            </div>
          </motion.div>
        </Link>

        {/* ── Section: Settings ─────────────────────────────── */}
        <div className="mt-8">
          <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight mb-2">
            Settings
          </h2>
          <div className="divide-y divide-neutral-100">
            <Link href="/account/settings" className="block">
              <motion.div whileTap={{ scale: 0.99 }} className="flex items-center justify-between py-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  <User className="w-[22px] h-[22px] text-neutral-800 stroke-[1.6]" />
                  <span className="text-[16px] text-neutral-900 font-normal">Personal information</span>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 stroke-[2]" />
              </motion.div>
            </Link>

            <Link href="/account/settings" className="block">
              <motion.div whileTap={{ scale: 0.99 }} className="flex items-center justify-between py-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  <MapPin className="w-[22px] h-[22px] text-neutral-800 stroke-[1.6]" />
                  <span className="text-[16px] text-neutral-900 font-normal">Delivery addresses</span>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 stroke-[2]" />
              </motion.div>
            </Link>

            <Link href="/account/settings" className="block">
              <motion.div whileTap={{ scale: 0.99 }} className="flex items-center justify-between py-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Lock className="w-[22px] h-[22px] text-neutral-800 stroke-[1.6]" />
                  <span className="text-[16px] text-neutral-900 font-normal">Login & security</span>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 stroke-[2]" />
              </motion.div>
            </Link>
          </div>
        </div>

        {/* ── Section: Studio Activity ──────────────────────── */}
        <div className="mt-8">
          <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight mb-2">
            Studio Activity
          </h2>
          <div className="divide-y divide-neutral-100">
            <Link href="/account/orders" className="block">
              <motion.div whileTap={{ scale: 0.99 }} className="flex items-center justify-between py-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Package className="w-[22px] h-[22px] text-neutral-800 stroke-[1.6]" />
                  <span className="text-[16px] text-neutral-900 font-normal">Orders & live tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  {activeOrders.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      {activeOrders.length} active
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-neutral-400 stroke-[2]" />
                </div>
              </motion.div>
            </Link>

            <Link href="/account/wishlist" className="block">
              <motion.div whileTap={{ scale: 0.99 }} className="flex items-center justify-between py-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Heart className="w-[22px] h-[22px] text-neutral-800 stroke-[1.6]" />
                  <span className="text-[16px] text-neutral-900 font-normal">Saved wishlist</span>
                </div>
                <div className="flex items-center gap-2">
                  {wishlistCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-700">
                      {wishlistCount}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-neutral-400 stroke-[2]" />
                </div>
              </motion.div>
            </Link>

            <Link href="/account/files" className="block">
              <motion.div whileTap={{ scale: 0.99 }} className="flex items-center justify-between py-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  <FolderOpen className="w-[22px] h-[22px] text-neutral-800 stroke-[1.6]" />
                  <span className="text-[16px] text-neutral-900 font-normal">Uploaded files & artwork</span>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 stroke-[2]" />
              </motion.div>
            </Link>
          </div>
        </div>

        {/* ── Section: Studio Services ──────────────────────── */}
        <div className="mt-8">
          <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight mb-2">
            Studio Services
          </h2>
          <div className="divide-y divide-neutral-100">
            <Link href="/order" className="block">
              <motion.div whileTap={{ scale: 0.99 }} className="flex items-center justify-between py-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Sparkles className="w-[22px] h-[22px] text-neutral-800 stroke-[1.6]" />
                  <span className="text-[16px] text-neutral-900 font-normal">Custom apparel drops</span>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 stroke-[2]" />
              </motion.div>
            </Link>

            <Link href="/services" className="block">
              <motion.div whileTap={{ scale: 0.99 }} className="flex items-center justify-between py-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Palette className="w-[22px] h-[22px] text-neutral-800 stroke-[1.6]" />
                  <span className="text-[16px] text-neutral-900 font-normal">Services catalog</span>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-400 stroke-[2]" />
              </motion.div>
            </Link>

            <a
              href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I%27d+like+VIP+concierge+support"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <motion.div whileTap={{ scale: 0.99 }} className="flex items-center justify-between py-4 cursor-pointer">
                <div className="flex items-center gap-4">
                  <MessageCircle className="w-[22px] h-[22px] text-emerald-600 stroke-[1.6]" />
                  <span className="text-[16px] text-neutral-900 font-normal">WhatsApp Studio VIP</span>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-400 stroke-[2]" />
              </motion.div>
            </a>
          </div>
        </div>

        {/* ── Section: Account ──────────────────────────────── */}
        <div className="mt-8">
          <h2 className="text-[22px] font-bold text-neutral-900 tracking-tight mb-2">
            Account
          </h2>
          <div className="divide-y divide-neutral-100">
            {isAdmin && (
              <Link href="/admin" className="block">
                <motion.div whileTap={{ scale: 0.99 }} className="flex items-center justify-between py-4 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="w-[22px] h-[22px] text-neutral-800 stroke-[1.6]" />
                    <span className="text-[16px] text-neutral-900 font-normal">Admin console</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 stroke-[2]" />
                </motion.div>
              </Link>
            )}

            <button
              type="button"
              onClick={() => signOut()}
              className="w-full text-left cursor-pointer"
            >
              <motion.div whileTap={{ scale: 0.99 }} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4 text-rose-600">
                  <LogOut className="w-[22px] h-[22px] stroke-[1.8]" />
                  <span className="text-[16px] font-semibold">Log out</span>
                </div>
              </motion.div>
            </button>
          </div>
        </div>

        {/* Footnote */}
        <div className="text-center pt-8 pb-12">
          <p className="text-[12px] font-medium text-neutral-400">
            Silk Studio • v2.4.0 (Build 412)
          </p>
        </div>
      </div>


      {/* ═════════════════════════════════════════════════════════
          DESKTOP VIEW (Peerlist Profile Style — screens >= 768px)
      ═════════════════════════════════════════════════════════ */}
      <div className="hidden md:block space-y-8">
        {/* ── Top Profile Header Banner ───────────────────────── */}
        <div className="relative rounded-[28px] border border-neutral-200/80 bg-white overflow-hidden shadow-sm">
          {/* Ambient Banner Gradient */}
          <div className="h-36 w-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-950 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(198,255,51,0.15),transparent_60%)]" />
            <div className="absolute top-4 right-5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-medium text-white border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Studio Member
              </span>
            </div>
          </div>

          {/* Profile details under banner */}
          <div className="px-8 pb-7 pt-0 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="flex items-end gap-5 -mt-12">
              {/* Avatar with Verified Badge */}
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-[24px] bg-neutral-900 text-white text-2xl font-bold border-4 border-white shadow-xl">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-white shadow-sm">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-[24px] font-bold tracking-tight text-neutral-900">
                    {displayName}
                  </h1>
                  {isAdmin && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-900 text-white shadow-xs">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-neutral-500 font-medium">@{handle} • Lagos, Nigeria</p>
                <p className="text-[12px] text-neutral-400 mt-0.5">
                  Silk Studio ID: {user?.id.substring(0, 8)}...
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/account/settings"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-xs"
              >
                <User className="w-3.5 h-3.5 stroke-[2]" />
                <span>Edit Profile</span>
              </Link>
              <Link
                href="/order"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-[13px] font-semibold hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Custom Order</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── 2-Column Dashboard Layout ──────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 spans) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Metric counters */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 rounded-[22px] bg-white border border-neutral-200/80 shadow-xs">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Active Orders
                </p>
                <p className="text-[26px] font-bold text-neutral-900 mt-1">
                  {activeOrders.length}
                </p>
              </div>

              <div className="p-5 rounded-[22px] bg-white border border-neutral-200/80 shadow-xs">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Completed
                </p>
                <p className="text-[26px] font-bold text-neutral-900 mt-1">
                  {completedOrders.length}
                </p>
              </div>

              <div className="p-5 rounded-[22px] bg-white border border-neutral-200/80 shadow-xs">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Wishlist Items
                </p>
                <p className="text-[26px] font-bold text-neutral-900 mt-1">
                  {wishlistCount}
                </p>
              </div>
            </div>

            {/* Live Active Order Progress Bar */}
            {activeOrders.length > 0 ? (
              <div className="p-6 rounded-[24px] bg-white border border-neutral-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      Live Delivery Tracking
                    </span>
                    <h2 className="text-[17px] font-bold text-neutral-900 mt-0.5">
                      Order #{activeOrders[0].paystack_ref.substring(0, 14)}
                    </h2>
                  </div>
                  <Link
                    href={`/account/orders`}
                    className="text-[13px] font-semibold text-neutral-500 hover:text-neutral-950 flex items-center gap-1 transition-colors"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Milestone Stepper */}
                <div className="pt-3">
                  <div className="grid grid-cols-5 gap-2 text-center">
                    {MILESTONES.map((step, idx) => {
                      const currentIdx = getMilestoneIndex(activeOrders[0].status);
                      const isComplete = idx <= currentIdx;
                      return (
                        <div key={step.key} className="flex flex-col items-center gap-2">
                          <div
                            className={`h-2.5 w-full rounded-full transition-all duration-500 ${
                              isComplete
                                ? 'bg-neutral-900'
                                : 'bg-neutral-200'
                            }`}
                          />
                          <span
                            className={`text-[12px] font-medium ${
                              isComplete
                                ? 'text-neutral-900 font-bold'
                                : 'text-neutral-400'
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
              <div className="p-7 rounded-[24px] bg-white border border-neutral-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-bold text-neutral-900">
                    No active orders in production
                  </h2>
                  <p className="text-[13px] text-neutral-500 mt-0.5">
                    Browse the latest studio collection or initiate a custom streetwear drop.
                  </p>
                </div>
                <Link
                  href="/apparel"
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-[13px] font-semibold hover:bg-neutral-800 transition-colors shrink-0"
                >
                  Shop Apparel
                </Link>
              </div>
            )}

            {/* Showcase Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-neutral-900">
                  Studio Showcase & Services
                </h2>
                <Link
                  href="/services"
                  className="text-[13px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Explore All
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-[22px] bg-white border border-neutral-200/80 shadow-xs flex flex-col justify-between hover:border-neutral-400 transition-all">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-3">
                      <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <h3 className="text-[15px] font-bold text-neutral-900">
                      Custom Streetwear Drops
                    </h3>
                    <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">
                      260gsm combed cotton tees, hoodies, and cargo accessories screenprinted with custom inks.
                    </p>
                  </div>
                  <Link
                    href="/order"
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-neutral-900 hover:underline underline-offset-4"
                  >
                    <span>Request Drops Quote</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>

                <div className="p-5 rounded-[22px] bg-white border border-neutral-200/80 shadow-xs flex flex-col justify-between hover:border-neutral-400 transition-all">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 mb-3">
                      <Palette className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <h3 className="text-[15px] font-bold text-neutral-900">
                      Brand Identity & Printing
                    </h3>
                    <p className="text-[13px] text-neutral-500 mt-1 leading-relaxed">
                      Custom packaging, product tags, stationery, and premium foil-embossed lookbooks.
                    </p>
                  </div>
                  <Link
                    href="/services"
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-neutral-900 hover:underline underline-offset-4"
                  >
                    <span>View Print Specs</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column (Peerlist Profile Completion) */}
          <div className="space-y-6">
            {/* Profile Completion Widget */}
            <div className="p-6 rounded-[26px] bg-white border border-neutral-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-bold text-neutral-900">
                    Profile Completion
                  </h3>
                  <p className="text-[12px] text-neutral-400">
                    Boost studio tier benefits
                  </p>
                </div>
                <RadialProgress percentage={completionSteps.percentage} />
              </div>

              {/* Steps Checklist */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                {completionSteps.steps.map((step) => (
                  <Link
                    key={step.id}
                    href={step.href}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors ${
                          step.completed
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-neutral-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span
                        className={`text-[13px] transition-colors ${
                          step.completed
                            ? 'text-neutral-400 line-through'
                            : 'text-neutral-800 font-semibold group-hover:text-neutral-950'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Studio VIP Card */}
            <div className="p-6 rounded-[26px] bg-white border border-neutral-200/80 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-700">
                  VIP Studio Member
                </span>
              </div>
              <h4 className="text-[16px] font-bold leading-snug mb-1 text-neutral-900">
                Direct WhatsApp Concierge
              </h4>
              <p className="text-[13px] text-neutral-500 leading-relaxed mb-4">
                Skip the queue for custom screenprinting orders and design proofing.
              </p>
              <a
                href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I%27d+like+VIP+concierge+support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center py-2.5 rounded-xl bg-neutral-900 text-white text-[13px] font-bold hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4 stroke-[2]" />
                <span>Chat with Production Lead</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
