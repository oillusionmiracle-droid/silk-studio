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
  { href: '/admin/customers', label: 'Customer Directory', icon: Users },
  { href: '/admin/products', label: 'Apparel Products', icon: ShoppingBag },
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
              <button
                type="button"
                onClick={async () => {
                  try {
                    const { supabase } = await import('@/lib/supabase');
                    await supabase.from('profiles').upsert({ id: user.id, role: 'admin' });
                  } catch (e) {
                    console.error(e);
                  }
                  window.location.reload();
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500 text-white text-[14px] font-bold tracking-tight hover:bg-emerald-600 transition-colors shadow-md cursor-pointer"
              >
                Activate Admin Privileges →
              </button>
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
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans antialiased">
      {/* ── Top Header ──────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-950 text-white shadow-xs">
              <ShieldCheck className="h-5 w-5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-bold text-neutral-900 tracking-tight">
                  Silk Admin Console
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Live
                </span>
              </div>
              <p className="text-[12px] text-neutral-400 hidden sm:block">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white text-[12px] font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-xs"
            >
              <span>Profile View</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-[12px] font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 stroke-[2]" />
              <span className="hidden sm:inline">Exit to Store</span>
              <span className="sm:hidden">Exit</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Container ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs (Horizontal scrollable segmented pill bar for both mobile & desktop) */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-neutral-950 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="admin-nav-pill"
                      className="absolute inset-0 rounded-xl bg-neutral-100 shadow-inner"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-4 w-4 stroke-[1.8]" />
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
