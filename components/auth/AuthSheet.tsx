'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import {
  Mail,
  Lock,
  User,
  X,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  Sparkles,
} from 'lucide-react';

/* ─── Google SVG Icon ───────────────────────────────── */
function GoogleIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
      />
      <path
        fill="#34A853"
        d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z"
      />
    </svg>
  );
}

/* ─── Password Validation Checklist (Buffer-style) ─── */
function PasswordChecklist({ password }: { password: string }) {
  const rules = useMemo(
    () => [
      { label: 'At least 6 characters', met: password.length >= 6 },
      { label: 'Contains a letter', met: /[a-zA-Z]/.test(password) },
      { label: 'Contains a number or symbol', met: /[\d\W]/.test(password) },
    ],
    [password]
  );

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2.5 space-y-2 px-1"
    >
      {rules.map((rule) => (
        <div key={rule.label} className="flex items-center gap-2">
          <motion.div
            initial={false}
            animate={{ scale: rule.met ? [1, 1.25, 1] : 1 }}
            transition={{ duration: 0.25 }}
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
              rule.met ? 'bg-emerald-500 text-white' : 'bg-neutral-200'
            }`}
          >
            {rule.met && <Check className="h-2.5 w-2.5 stroke-[3]" />}
          </motion.div>
          <span
            className={`text-[12px] font-medium transition-colors ${
              rule.met ? 'text-emerald-700' : 'text-neutral-400'
            }`}
          >
            {rule.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Main AuthSheet Component ─────────────────────── */
export default function AuthSheet() {
  const {
    user,
    isAuthModalOpen,
    authModalView,
    closeAuthModal,
    openAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const isSignUp = authModalView === 'sign_up';

  // ── First-time visitor auto pop-up with bounce ──────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const hasVisited = localStorage.getItem('silk_first_visit_shown');
      if (!hasVisited && !user) {
        const timer = setTimeout(() => {
          openAuthModal('sign_up');
          localStorage.setItem('silk_first_visit_shown', 'true');
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthModalOpen) {
      setError(null);
      setSuccessNotice(null);
      setShowPassword(false);
    }
  }, [isAuthModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessNotice(null);
    setIsLoading(true);

    try {
      if (!isSignUp) {
        const res = await signInWithEmail(email, password);
        if (res.error) setError(res.error);
      } else {
        if (!fullName.trim()) {
          setError('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        const res = await signUpWithEmail(email, password, fullName);
        if (res.error) {
          setError(res.error);
        } else if (res.requiresEmailConfirmation) {
          setSuccessNotice(
            'Account created! Check your email to confirm your account.'
          );
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setIsLoading(true);
    const res = await signInWithGoogle();
    if (res.error) {
      if (
        res.error.toLowerCase().includes('provider is not enabled') ||
        res.error.toLowerCase().includes('unsupported provider')
      ) {
        setError(
          'Google sign-in is not yet enabled in the Supabase dashboard. Please use email & password above!'
        );
      } else {
        setError(res.error);
      }
      setIsLoading(false);
    }
  };

  const switchView = (view: 'sign_in' | 'sign_up') => {
    setError(null);
    setSuccessNotice(null);
    openAuthModal(view);
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 font-sans">
          {/* ── Backdrop ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* ── Modal with Scale-Up Bounce (Pop In) ── */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.75, opacity: 0, transition: { duration: 0.15 } }}
            transition={{
              type: 'spring',
              damping: 17,
              stiffness: 300,
              mass: 0.8,
            }}
            className="relative w-full max-w-[440px] max-h-[92vh] overflow-y-auto rounded-[28px] bg-white text-neutral-900 shadow-2xl z-10 border border-neutral-100"
          >
            {/* Close button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={closeAuthModal}
              className="absolute top-5 right-5 h-9 w-9 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 transition-colors z-20"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </motion.button>

            <div className="p-7 sm:p-8">
              {/* ── Friendly Header ─────────────────────── */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-neutral-900 text-white mb-3 shadow-md">
                  <span className="text-xl font-bold tracking-tight">S</span>
                </div>
                <h2 className="text-[24px] font-bold text-neutral-900 tracking-tight leading-tight">
                  {isSignUp ? 'Create your account' : 'Welcome back!'}
                </h2>
                <p className="text-[13px] text-neutral-500 mt-2 leading-relaxed max-w-[340px] mx-auto">
                  {isSignUp
                    ? 'Sign up or log in to track your orders, save your wishlist, book custom streetwear drops, and manage your delivery details!'
                    : 'Log in to track your active orders, check design proofs, and view saved items.'}
                </p>
              </div>

              {/* ── Tab Segmented Control with Bounce ── */}
              <div className="relative flex bg-neutral-100 rounded-2xl p-1 mb-6 border border-neutral-200/60">
                <motion.div
                  layout
                  className="absolute top-1 bottom-1 rounded-xl bg-white shadow-sm"
                  style={{
                    width: 'calc(50% - 4px)',
                    left: isSignUp ? 'calc(50% + 2px)' : '4px',
                  }}
                  transition={{ type: 'spring', damping: 22, stiffness: 350 }}
                />
                <button
                  type="button"
                  onClick={() => switchView('sign_in')}
                  className={`relative z-10 flex-1 py-2.5 text-[14px] font-semibold rounded-xl transition-colors ${
                    !isSignUp ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => switchView('sign_up')}
                  className={`relative z-10 flex-1 py-2.5 text-[14px] font-semibold rounded-xl transition-colors ${
                    isSignUp ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* ── Google Social Button (Apple Removed) ── */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 text-[14px] font-semibold text-neutral-800 transition-colors shadow-xs mb-5"
              >
                <GoogleIcon className="h-5 w-5 shrink-0" />
                <span>Continue with Google</span>
              </motion.button>

              {/* ── Divider ─────────────────────────────── */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="text-[12px] text-neutral-400 font-medium uppercase tracking-wider">
                  or with email
                </span>
                <div className="flex-1 h-px bg-neutral-200" />
              </div>

              {/* ── Alerts ──────────────────────────────── */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 stroke-[2]" />
                    <span className="leading-snug">{error}</span>
                  </motion.div>
                )}

                {successNotice && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 stroke-[2]" />
                    <span className="leading-snug">{successNotice}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Form ────────────────────────────────── */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 h-4 w-4 text-neutral-400 stroke-[2]" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Miracle Onyenwe"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 h-4 w-4 text-neutral-400 stroke-[2]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="miracle@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-neutral-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 h-4 w-4 text-neutral-400 stroke-[2]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3.5 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 stroke-[2]" />
                      ) : (
                        <Eye className="w-4 h-4 stroke-[2]" />
                      )}
                    </button>
                  </div>

                  {/* Buffer-style live checklist for sign up */}
                  <AnimatePresence>
                    {isSignUp && <PasswordChecklist password={password} />}
                  </AnimatePresence>
                </div>

                {/* Submit button with bounce */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 rounded-2xl bg-neutral-950 text-white text-[14px] font-bold tracking-tight flex items-center justify-center gap-2 shadow-md hover:bg-neutral-800 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin stroke-[2]" />
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create My Account' : 'Log In'}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* ── Switcher ────────────────────────────── */}
              <div className="mt-6 text-center text-[13px] text-neutral-500">
                {!isSignUp ? (
                  <p>
                    Don&apos;t have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => switchView('sign_up')}
                      className="font-bold text-neutral-900 hover:underline underline-offset-4 cursor-pointer"
                    >
                      Sign up for free
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchView('sign_in')}
                      className="font-bold text-neutral-900 hover:underline underline-offset-4 cursor-pointer"
                    >
                      Log in here
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
