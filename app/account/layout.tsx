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
  Sparkles,
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
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-neutral-800">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-neutral-400 stroke-[2]" />
          <p className="text-[13px] font-medium text-neutral-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
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
          <h2 className="text-[24px] font-bold text-neutral-900 tracking-tight mb-2">
            Hey there! 👋
          </h2>
          <p className="text-[14px] text-neutral-500 leading-relaxed mb-6">
            Sign up or log in to track your orders, save your wishlist items, book custom streetwear drops, and manage your delivery details!
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => openAuthModal('sign_in')}
            className="w-full py-3.5 px-5 rounded-2xl bg-neutral-900 text-white text-[14px] font-bold tracking-tight transition-all hover:bg-neutral-800 shadow-md cursor-pointer"
          >
            Sign Up or Log In
          </motion.button>
          <div className="mt-4">
            <Link
              href="/"
              className="text-[13px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              ← Return to Silk Studio
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 font-sans antialiased">
      {/* ── Top Header: Desktop only (on mobile, title appears clean and large in page.tsx like Airbnb) ── */}
      <div className="hidden md:block sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 stroke-[2]" />
              <span>Back to Store</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-[14px] font-bold text-neutral-900">
              Customer Profile
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-950 text-white text-[12px] font-semibold shadow-xs hover:bg-neutral-800 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 stroke-[2]" />
                <span>Admin Operations</span>
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

      {/* ── Main Container ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-32">
        {/* Desktop Navigation Tabs (Horizontal segmented bar) */}
        <div className="hidden md:flex items-center gap-1.5 mb-8 p-1.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs w-fit">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-pill"
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

        {/* Dynamic Page Content */}
        {children}
      </div>
    </div>
  );
}
