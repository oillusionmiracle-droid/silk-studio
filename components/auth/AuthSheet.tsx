'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import {
  Mail,
  Lock,
  User,
  X,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  Phone,
} from 'lucide-react';

/* ─── Brand Logo PNG Component ─────────────────────── */
function BrandLogo({ size = 22, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <Image
        src="/images/s-logo.png"
        alt="Silk Studio Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  );
}

/* ─── Google SVG Icon with Fixed Strict Dimensions ──── */
function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      className="shrink-0"
    >
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

/* ─── Password Validation Checklist ─────────────────── */
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
      className="mt-2 space-y-1.5 px-1"
    >
      {rules.map((rule) => (
        <div key={rule.label} className="flex items-center gap-2">
          <div
            className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
              rule.met ? 'bg-emerald-500 text-white' : 'bg-neutral-200'
            }`}
          >
            {rule.met && <Check className="h-2 w-2 stroke-[3]" />}
          </div>
          <span
            className={`text-[11.5px] font-medium transition-colors ${
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

  const [step, setStep] = useState<'options' | 'email_form' | 'phone_form'>('options');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [botField, setBotField] = useState('');
  const [formMode, setFormMode] = useState<'sign_in' | 'sign_up'>('sign_up');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // ── First-time visitor auto pop-up (Fast 350ms delay) ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const hasVisited = localStorage.getItem('silk_first_visit_shown');
      if (!hasVisited && !user) {
        const timer = setTimeout(() => {
          openAuthModal('options');
          localStorage.setItem('silk_first_visit_shown', 'true');
        }, 350);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage disabled/unavailable
    }
  }, [user, openAuthModal]);

  // Sync step when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setError(null);
      setSuccessNotice(null);
      setShowPassword(false);
      setBotField('');

      if (authModalView === 'sign_in') {
        setFormMode('sign_in');
        setStep('email_form');
      } else if (authModalView === 'sign_up') {
        setFormMode('sign_up');
        setStep('email_form');
      } else {
        setStep('options');
      }
    }
  }, [isAuthModalOpen, authModalView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Silent honeypot bot check
    if (botField) {
      setIsLoading(false);
      return;
    }

    setError(null);
    setSuccessNotice(null);
    setIsLoading(true);

    try {
      if (formMode === 'sign_in') {
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
          setSuccessNotice('Account created! Check your email to confirm your account.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Please enter a phone number.');
      return;
    }
    setError(null);
    setSuccessNotice(`Phone number saved (${phone}). Please complete your details.`);
    setStep('email_form');
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
          'Google sign-in is not yet enabled in the Supabase dashboard. Please use email & password!'
        );
      } else {
        setError(res.error);
      }
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col justify-end items-center p-0 sm:pb-5 sm:px-4 pointer-events-none font-sans">
          {/* ── Backdrop ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs pointer-events-auto"
          />

          {/* ── Sheet Container (Sliding Up from Bottom, Not Filling Page) ── */}
          <motion.div
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 360,
              mass: 0.75,
            }}
            className="pointer-events-auto relative w-full max-w-[410px] rounded-t-[28px] sm:rounded-[28px] bg-white text-neutral-900 shadow-2xl z-10 border border-neutral-200/80 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Mobile Grab Handle */}
            <div className="w-8 h-1 rounded-full bg-neutral-300 mx-auto mt-2.5 mb-0.5 sm:hidden shrink-0" />

            {/* ══════════════════════════════════════════
                STEP 1: LOGIN OPTIONS
               ══════════════════════════════════════════ */}
            {step === 'options' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="p-5 sm:p-7"
              >
                {/* Header Row: Compact S Logo Badge + Close Button */}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-9 w-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900 border border-neutral-200/80 shadow-2xs">
                    <BrandLogo size={18} />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={closeAuthModal}
                    aria-label="Close modal"
                    className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </motion.button>
                </div>

                {/* Title & Subtext */}
                <h2
                  className="text-[23px] font-black text-neutral-900 tracking-tight"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  Get Started
                </h2>
                <p className="text-[13px] text-neutral-500 leading-relaxed mt-1 mb-5">
                  Track your orders, save design proofs, book custom streetwear drops, and manage your deliveries.
                </p>

                {/* Option Buttons */}
                <div className="space-y-2.5">
                  {/* Continue with Phone */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setStep('phone_form')}
                    className="w-full py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-[14px] font-bold tracking-tight flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                  >
                    <Phone className="w-4 h-4 stroke-[2.2] shrink-0" />
                    <span>Continue with Phone</span>
                  </motion.button>

                  {/* Continue with Email */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setFormMode('sign_up');
                      setStep('email_form');
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-[14px] font-bold tracking-tight flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                  >
                    <Mail className="w-4 h-4 stroke-[2.2] shrink-0" />
                    <span>Continue with Email</span>
                  </motion.button>

                  {/* Continue with Google (Strictly constrained 18px SVG) */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full py-3 px-4 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-[14px] font-bold text-neutral-800 flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                  >
                    <GoogleIcon size={18} />
                    <span>Continue with Google</span>
                  </motion.button>
                </div>

                {/* Bottom Row */}
                <div className="mt-5 pt-3.5 border-t border-neutral-100 justify-end text-[12.5px] text-neutral-500">
                  <div>
                    Already a member?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setFormMode('sign_in');
                        setStep('email_form');
                      }}
                      className="font-bold text-neutral-900 hover:underline cursor-pointer ml-1"
                    >
                      Log in
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                STEP 3: PHONE FORM
               ══════════════════════════════════════════ */}
            {step === 'phone_form' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="p-5 sm:p-7"
              >
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setStep('options')}
                    className="inline-flex items-center gap-1 text-[12.5px] font-bold text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeAuthModal}
                    className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                <h3
                  className="text-[20px] font-black text-neutral-900 tracking-tight"
                  style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                  Enter phone number
                </h3>
                <p className="text-[12.5px] text-neutral-500 mt-0.5 mb-4">
                  Receive instant order proofs and drop notifications.
                </p>

                <form onSubmit={handlePhoneSubmit} className="space-y-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-[13px] font-bold text-neutral-800 shrink-0">
                      <span>🇳🇬</span>
                      <span>+234</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="801 234 5678"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-[13.5px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 outline-none transition-all"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-[13.5px] font-bold tracking-tight transition-all cursor-pointer shadow-xs"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                  >
                    Continue
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════
                STEP 4: EMAIL FORM (SIGN UP / LOG IN)
               ══════════════════════════════════════════ */}
            {step === 'email_form' && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
                className="p-5 sm:p-7 overflow-y-auto max-h-[82vh]"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={() => setStep('options')}
                    className="inline-flex items-center gap-1 text-[12.5px] font-bold text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Options</span>
                  </button>

                  <div className="h-7 w-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 border border-neutral-200/60">
                    <BrandLogo size={15} />
                  </div>

                  <button
                    type="button"
                    onClick={closeAuthModal}
                    className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Heading */}
                <div className="text-center mb-4">
                  <h2
                    className="text-[20px] font-black text-neutral-900 tracking-tight"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                  >
                    {formMode === 'sign_up' ? 'Create your account' : 'Welcome back!'}
                  </h2>
                  <p className="text-[12.5px] text-neutral-500 mt-0.5">
                    {formMode === 'sign_up'
                      ? 'Sign up to track orders and save design proofs.'
                      : 'Log in to view your order proofs and designs.'}
                  </p>
                </div>

                {/* Segmented Control */}
                <div className="relative flex bg-neutral-100 rounded-xl p-1 mb-4 border border-neutral-200/60">
                  <motion.div
                    layout
                    className="absolute top-1 bottom-1 rounded-lg bg-white shadow-2xs"
                    style={{
                      width: 'calc(50% - 4px)',
                      left: formMode === 'sign_up' ? 'calc(50% + 2px)' : '4px',
                    }}
                    transition={{ type: 'spring', damping: 26, stiffness: 380 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormMode('sign_in');
                      setError(null);
                    }}
                    className={`relative z-10 flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-colors cursor-pointer ${
                      formMode === 'sign_in' ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormMode('sign_up');
                      setError(null);
                    }}
                    className={`relative z-10 flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-colors cursor-pointer ${
                      formMode === 'sign_up' ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Google Button (Strictly Constrained 18px Icon) */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-[13px] font-bold text-neutral-800 transition-colors shadow-2xs mb-3.5 cursor-pointer"
                >
                  <GoogleIcon size={18} />
                  <span>Continue with Google</span>
                </motion.button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="text-[10.5px] text-neutral-400 font-semibold uppercase tracking-wider">
                    or with email
                  </span>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>

                {/* Alerts */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12px] flex items-start gap-2"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 stroke-[2]" />
                      <span className="leading-snug">{error}</span>
                    </motion.div>
                  )}

                  {successNotice && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 stroke-[2]" />
                      <span className="leading-snug">{successNotice}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Honeypot Bot Trap (Hidden from real users) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_url"
                      tabIndex={-1}
                      value={botField}
                      onChange={(e) => setBotField(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  {formMode === 'sign_up' && (
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3 h-3.5 w-3.5 text-neutral-400 stroke-[2]" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 outline-none transition-all font-medium"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 h-3.5 w-3.5 text-neutral-400 stroke-[2]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 h-3.5 w-3.5 text-neutral-400 stroke-[2]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 outline-none transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-3.5 h-3.5 stroke-[2]" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 stroke-[2]" />
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {formMode === 'sign_up' && <PasswordChecklist password={password} />}
                    </AnimatePresence>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 rounded-xl bg-neutral-950 text-white text-[13.5px] font-bold tracking-tight flex items-center justify-center gap-2 shadow-sm hover:bg-neutral-800 disabled:opacity-50 transition-all cursor-pointer"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin stroke-[2]" />
                    ) : (
                      <>
                        <span>{formMode === 'sign_up' ? 'Create Account' : 'Log In'}</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
