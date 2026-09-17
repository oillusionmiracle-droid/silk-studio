'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard,
  Package,
  Heart,
  FolderOpen,
  Settings,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Loader2,
  Lock,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/orders', label: 'Orders & Tracking', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/files', label: 'Uploaded Files', icon: FolderOpen },
  { href: '/account/settings', label: 'Profile & Settings', icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading, isAdmin, signOut, openAuthModal } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F9] text-neutral-800 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-neutral-500 stroke-[2]" />
          <p className="text-[13px] font-semibold text-neutral-600">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F9] px-5 py-20 font-sans">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="max-w-md w-full text-center rounded-[28px] border border-neutral-200/80 bg-white p-8 sm:p-10 shadow-xl"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-[#5E17EB] mb-5 shadow-inner">
            <Lock className="h-6 w-6 stroke-[2]" />
          </div>
          <h2
            style={{ fontFamily: 'var(--font-jakarta)' }}
            className="text-[26px] font-extrabold text-neutral-900 tracking-tight mb-2"
          >
            Welcome to Silk Studio 👋
          </h2>
          <p className="text-[14px] text-neutral-500 leading-relaxed mb-6">
            Sign up or log in to track your orders, save wishlist items, book custom apparel drops, and manage your delivery details!
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => openAuthModal('sign_in')}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#5E17EB] hover:bg-[#4700D8] text-white text-[14px] font-bold tracking-tight transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
          >
            Sign Up or Log In
          </motion.button>
          <div className="mt-4">
            <Link
              href="/"
              className="text-[13px] font-semibold text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              ← Return to Silk Studio
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F9] text-neutral-900 font-sans antialiased">
      {/* ── Top Header Bar ── */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-neutral-500 hover:text-neutral-950 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 stroke-[2] group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Store</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <div className="flex items-center gap-2">
              <span
                style={{ fontFamily: 'var(--font-jakarta)' }}
                className="text-[14px] font-bold text-neutral-900 tracking-tight"
              >
                Customer Dashboard
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-[#5E17EB]">
                VIP Member
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-950 text-white text-[12px] font-semibold shadow-sm hover:bg-neutral-800 transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5 stroke-[2] text-amber-400" />
                <span>Admin Console</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 stroke-[2]" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32">
        {/* Navigation Segmented Bar */}
        <div className="flex items-center gap-1.5 mb-8 p-1.5 rounded-full sm:rounded-2xl bg-white border border-neutral-200/80 shadow-sm overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full sm:rounded-xl text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-[#5E17EB] font-bold'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 rounded-full sm:rounded-xl bg-purple-50 border border-purple-100 shadow-xs"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`h-4 w-4 stroke-[2] ${isActive ? 'text-[#5E17EB]' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Dynamic Page Content */}
        {children}
      </div>
    </div>
  );
}
