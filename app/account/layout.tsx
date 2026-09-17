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
    <div className="min-h-screen bg-[#08080C] text-neutral-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ── Background Glow Effects ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px]" />
      </div>

      {/* ── Top Header Bar ── */}
      <div className="sticky top-0 z-40 bg-[#0A0A0E]/80 backdrop-blur-2xl border-b border-white/[0.08] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-neutral-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 stroke-[2] group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Store</span>
            </Link>
            <span className="text-white/20">/</span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-white tracking-tight">
                Customer Dashboard
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                VIP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-[12px] font-semibold shadow-lg hover:border-amber-500/50 transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5 stroke-[2] text-amber-400" />
                <span>Admin Console</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-neutral-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 stroke-[2]" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Container ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-32">
        {/* Desktop Navigation Segmented Bar */}
        <div className="flex items-center gap-1.5 mb-8 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-2xl overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
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

        {/* Dynamic Page Content */}
        {children}
      </div>
    </div>
  );
}
