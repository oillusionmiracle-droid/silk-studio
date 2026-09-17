'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Home,
  Star,
  CircleHelp,
  Images,
  UserRound,
  MessageSquare,
  Mail,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Lock,
} from 'lucide-react';

const ADMIN_NAV = [
  { href: '/admin', label: 'Analytics & Overview', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'All Studio Orders', icon: Package },
  { href: '/admin/products', label: 'Products & Offerings', icon: ShoppingBag },
  { href: '/admin/variants', label: 'Product Variants', icon: Package },
  { href: '/admin/customers', label: 'Customer Directory', icon: Users },
  { href: '/admin/home', label: 'Homepage Content', icon: Home },
  { href: '/admin/banners', label: 'Banners', icon: Images },
  { href: '/admin/apparel', label: 'Apparel Content', icon: ShoppingBag },
  { href: '/admin/services', label: 'Services Page', icon: Package },
  { href: '/admin/about', label: 'About Page', icon: Users },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/faq', label: 'FAQ', icon: CircleHelp },
  { href: '/admin/portfolio', label: 'Portfolio', icon: Images },
  { href: '/admin/users', label: 'Users', icon: UserRound },
  { href: '/admin/messages', label: 'Reports & Messages', icon: MessageSquare },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading, isAdmin } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-neutral-800">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-neutral-400 stroke-[2]" />
          <p className="text-[13px] font-semibold text-neutral-500">
            Validating Administrator Privileges...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-5 py-20 font-sans">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 280 }}
          className="max-w-md w-full text-center rounded-[28px] border border-neutral-200/80 bg-white p-8 sm:p-10 shadow-xl"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 mb-5 shadow-inner">
            <Lock className="h-6 w-6 stroke-[1.8]" />
          </div>
          <h2 className="text-[22px] font-bold tracking-tight text-neutral-900 mb-2">
            Admin Console Access
          </h2>
          <p className="text-[14px] text-neutral-500 leading-relaxed mb-6">
            {!user
              ? 'Sign in with your studio administrator account to manage orders, inventory, and customer accounts.'
              : `Logged in as ${user.email}. Confirm admin privileges to proceed.`}
          </p>
          <div className="space-y-3">
            {!user ? (
              <button
                type="button"
                onClick={() => {
                  const event = new CustomEvent('open-auth-modal', { detail: 'sign_in' });
                  window.dispatchEvent(event);
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-neutral-950 text-white text-[14px] font-bold tracking-tight hover:bg-neutral-800 transition-colors shadow-md cursor-pointer"
              >
                Sign In as Admin
              </button>
            ) : (
              <p className="text-[13px] text-amber-600 font-medium bg-amber-50 rounded-xl p-3 border border-amber-200/60">
                This account does not have administrator privileges. Please contact an existing studio administrator to grant access.
              </p>
            )}
            <Link
              href="/account"
              className="block w-full py-3 px-5 rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-700 text-[13px] font-semibold hover:bg-neutral-100 transition-colors"
            >
              Go to Customer Profile
            </Link>
            <Link
              href="/"
              className="block text-[13px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              ← Return to Storefront
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-neutral-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ── Background Scrim & Glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/3 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px]" />
      </div>

      {/* ── Top Command Bar ── */}
      <div className="sticky top-0 z-40 bg-[#090D14]/85 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-neutral-950 shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="h-5.5 w-5.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-bold text-white tracking-tight">
                  Silk Command Center
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live System
                </span>
              </div>
              <p className="text-[12px] text-neutral-400 hidden sm:block">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 text-[12px] font-semibold text-neutral-300 hover:bg-white/10 hover:text-white transition-all"
            >
              <span>Customer Profile</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-neutral-950 text-[12px] font-bold hover:brightness-110 transition-all shadow-md shadow-cyan-500/15"
            >
              <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Exit to Storefront</span>
              <span className="sm:hidden">Exit</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Command Container ── */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs (Scrollable Command Pills) */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-2xl">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="admin-nav-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={`h-4 w-4 stroke-[1.8] ${isActive ? 'text-cyan-400' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dynamic Admin Page Content */}
        {children}
      </div>
    </div>
  );
}
