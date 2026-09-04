'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import {
  Package,
  Heart,
  FolderOpen,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from 'lucide-react';

export default function AccountMenu() {
  const { user, profile, isAdmin, signOut, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openAuthModal('sign_in')}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 border border-neutral-200 dark:border-white/20 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow-xs"
      >
        Sign In
      </button>
    );
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const displayEmail = user.email || '';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative font-apple" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-neutral-200 dark:border-white/15 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md hover:bg-white dark:hover:bg-neutral-800 transition-colors shadow-xs"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-950 dark:bg-white text-[11px] font-semibold text-white dark:text-neutral-950">
          {initials}
        </div>
        <span className="hidden md:inline-block max-w-[100px] truncate text-xs font-medium text-neutral-800 dark:text-neutral-200">
          {displayName}
        </span>
        <ChevronDown className="h-3 w-3 text-neutral-400 transition-transform stroke-[2]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            style={{ transformOrigin: 'top right' }}
            className="absolute right-0 mt-2 w-64 rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl p-2 shadow-2xl z-50 text-neutral-900 dark:text-neutral-100"
          >
            {/* Header info */}
            <div className="px-3 py-2.5 border-b border-neutral-100 dark:border-white/10 mb-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold truncate text-neutral-950 dark:text-white">
                  {displayName}
                </p>
                {isAdmin && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 truncate mt-0.5">{displayEmail}</p>
            </div>

            {/* Menu options */}
            <div className="space-y-0.5">
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4 text-neutral-500 stroke-[1.75]" />
                <span>Dashboard Overview</span>
              </Link>

              <Link
                href="/account/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Package className="h-4 w-4 text-neutral-500 stroke-[1.75]" />
                <span>Orders & Tracking</span>
              </Link>

              <Link
                href="/account/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Heart className="h-4 w-4 text-neutral-500 stroke-[1.75]" />
                <span>Saved Wishlist</span>
              </Link>

              <Link
                href="/account/files"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <FolderOpen className="h-4 w-4 text-neutral-500 stroke-[1.75]" />
                <span>Uploaded References</span>
              </Link>

              <Link
                href="/account/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Settings className="h-4 w-4 text-neutral-500 stroke-[1.75]" />
                <span>Profile & Addresses</span>
              </Link>

              {isAdmin && (
                <>
                  <div className="my-1 border-t border-neutral-100 dark:border-white/10" />
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-950 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4 text-neutral-700 dark:text-neutral-300 stroke-[2]" />
                    <span>Admin Operations</span>
                  </Link>
                </>
              )}

              <div className="my-1 border-t border-neutral-100 dark:border-white/10" />

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
              >
                <LogOut className="h-4 w-4 stroke-[1.75]" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
