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

/* ── Circular Progress Meter (Peerlist style) ── */
function RadialProgress({ percentage }: { percentage: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={radius}
          stroke="currentColor"
          strokeWidth="5"
          className="text-white/10"
          fill="transparent"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          stroke="currentColor"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-cyan-400 transition-all duration-1000 ease-out"
          fill="transparent"
        />
      </svg>
      <span className="absolute text-[13px] font-extrabold tracking-tight text-white">
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
    <div className="font-sans antialiased text-white w-full block">
      {/* ── Top Profile Header Banner ── */}
      <div className="relative rounded-[28px] border border-white/[0.08] bg-white/[0.02] backdrop-blur-2xl overflow-hidden shadow-2xl mb-8">
        {/* Ambient Banner Gradient */}
        <div className="h-36 w-full bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-indigo-950/40 relative border-b border-white/[0.06]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(6,182,212,0.18),transparent_60%)]" />
          <div className="absolute top-4 right-5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-medium text-white border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Verified Studio Collector
            </span>
          </div>
        </div>

        {/* Profile details under banner */}
        <div className="px-6 lg:px-8 pb-7 pt-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-end gap-5 -mt-12">
            {/* Avatar with Verified Badge */}
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-[24px] bg-neutral-950 text-cyan-300 text-2xl font-bold border-4 border-[#08080C] shadow-2xl ring-1 ring-cyan-500/30">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-neutral-950 border-2 border-[#08080C] shadow-md font-bold">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[24px] font-bold tracking-tight text-white">
                  {displayName}
                </h1>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[13px] text-neutral-400 font-medium">@{handle} • Lagos, Nigeria</p>
              <p className="text-[12px] text-neutral-500 mt-0.5">
                Silk Studio ID: {user?.id.substring(0, 8)}...
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/account/settings"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-[13px] font-semibold text-neutral-200 hover:bg-white/10 hover:border-white/20 transition-all shadow-lg"
            >
              <User className="w-3.5 h-3.5 stroke-[2]" />
              <span>Edit Profile</span>
            </Link>
            <Link
              href="/order"
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-neutral-950 text-[13px] font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Custom Merch Drop</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2-Column Dashboard Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column (2 spans) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Metric counters */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-5 rounded-[22px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-xl">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Active Orders
              </p>
              <p className="text-[28px] font-extrabold text-white mt-1">
                {activeOrders.length}
              </p>
            </div>

            <div className="p-5 rounded-[22px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-xl">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Completed
              </p>
              <p className="text-[28px] font-extrabold text-emerald-400 mt-1">
                {completedOrders.length}
              </p>
            </div>

            <div className="p-5 rounded-[22px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-xl">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Saved Wishlist
              </p>
              <p className="text-[28px] font-extrabold text-cyan-400 mt-1">
                {wishlistCount}
              </p>
            </div>
          </div>

          {/* Live Active Order Progress Bar */}
          {activeOrders.length > 0 ? (
            <div className="p-6 rounded-[24px] bg-white/[0.03] border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    Live Production Tracking
                  </span>
                  <h2 className="text-[18px] font-bold text-white mt-1">
                    Order #{activeOrders[0].paystack_ref.substring(0, 14)}
                  </h2>
                </div>
                <Link
                  href={`/account/orders`}
                  className="text-[13px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <span>View Details</span>
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
                              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                              : 'bg-white/10'
                          }`}
                        />
                        <span
                          className={`text-[12px] font-medium ${
                            isComplete
                              ? 'text-cyan-300 font-bold'
                              : 'text-neutral-500'
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
            <div className="p-7 rounded-[24px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-xl flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-white">
                  No active orders in production
                </h2>
                <p className="text-[13px] text-neutral-400 mt-1">
                  Browse the latest studio streetwear collection or request a bespoke drop.
                </p>
              </div>
              <Link
                href="/apparel"
                className="px-4 py-2.5 rounded-xl bg-white text-neutral-950 text-[13px] font-bold hover:bg-neutral-200 transition-colors shrink-0"
              >
                Shop Apparel
              </Link>
            </div>
          )}

          {/* Showcase Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-white">
                Studio Services & Offerings
              </h2>
              <Link
                href="/services"
                className="text-[13px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/order" className="group block">
                <div className="p-5 rounded-[22px] bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.04] transition-all shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Custom Streetwear Drops
                    </h3>
                    <p className="text-[12px] text-neutral-400 mt-1 leading-relaxed">
                      High-density screenprinting, puff prints, embroidered hoodies & custom cut-and-sew blanks.
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/account/files" className="group block">
                <div className="p-5 rounded-[22px] bg-white/[0.02] border border-white/[0.08] hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <FolderOpen className="h-5 w-5" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Digital Vault & Vectors
                    </h3>
                    <p className="text-[12px] text-neutral-400 mt-1 leading-relaxed">
                      Access high-resolution tech packs, design proofs, and asset files associated with your orders.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Column (1 span) */}
        <div className="space-y-8">
          {/* Peerlist-Style Profile Completion Widget */}
          <div className="p-6 rounded-[26px] bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center gap-4">
              <RadialProgress percentage={completionSteps.percentage} />
              <div>
                <h3 className="text-[15px] font-bold text-white">
                  Collector Profile
                </h3>
                <p className="text-[12px] text-neutral-400 mt-0.5">
                  {completionSteps.percentage}% Completed
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
              {completionSteps.steps.map((step) => (
                <Link key={step.id} href={step.href} className="block group">
                  <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${step.completed ? 'bg-cyan-500 text-neutral-950 font-bold' : 'border border-white/20 text-transparent'}`}>
                        ✓
                      </div>
                      <span className={`text-[12.5px] ${step.completed ? 'text-neutral-300 line-through' : 'text-white font-medium group-hover:text-cyan-300'}`}>
                        {step.label}
                      </span>
                    </div>
                    {!step.completed && (
                      <ChevronRight className="h-3.5 w-3.5 text-neutral-500 group-hover:text-cyan-400" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Concierge Support Card */}
          <div className="p-6 rounded-[26px] bg-gradient-to-br from-emerald-950/40 to-teal-950/40 border border-emerald-500/30 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-white">
                  VIP Concierge
                </h3>
                <p className="text-[12px] text-emerald-400 font-medium">
                  Direct WhatsApp Line
                </p>
              </div>
            </div>
            <p className="text-[12px] text-neutral-300 leading-relaxed">
              Need assistance with an active order or custom fabric selection? Chat directly with our Lagos studio team.
            </p>
            <a
              href="https://wa.me/2347064829776?text=Hi+Silk+Studio%2C+I%27d+like+VIP+concierge+support"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 px-4 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-[13px] text-center hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              Connect on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
