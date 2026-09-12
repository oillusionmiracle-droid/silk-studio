'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/AuthContext';

const TurnstileWidget = dynamic(() => import('@/components/TurnstileWidget'), {
  ssr: false,
});
import {
  Mail,
  Lock,
  User,
  X,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import Link from 'next/link';

const AUTH_VIDEO_URL =
  'https://res.cloudinary.com/dagqxe3fh/video/upload/v1789160501/From_Klickpin.com-_808396201917383492-pin-id-808396201917383492_ie3z7p.mp4';
const AUTH_VIDEO_POSTER = '/images/hero-bg.jpg';

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
function PasswordChecklist({ password, dark = false }: { password: string; dark?: boolean }) {
  const rules = useMemo(
    () => [
      { label: 'At least 8 characters', met: password.length >= 8 },
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
              rule.met ? 'bg-[#C6FF33] text-black' : dark ? 'bg-white/15' : 'bg-neutral-200'
            }`}
          >
            {rule.met && <Check className="h-2 w-2 stroke-[3]" />}
          </div>
          <span
            className={`text-[11.5px] font-medium transition-colors ${
              rule.met ? (dark ? 'text-[#C6FF33]' : 'text-emerald-700') : dark ? 'text-white/35' : 'text-neutral-400'
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
    requestPasswordReset,
  } = useAuth();

  type AuthView = 'sign_up' | 'sign_in' | 'forgot' | 'check_email';
  const [authView, setAuthView] = useState<AuthView>('sign_up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [botField, setBotField] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const turnstileRequired =
    typeof process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY === 'string' &&
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY.length > 0;
  const [formMode, setFormMode] = useState<'sign_in' | 'sign_up'>('sign_up');
  const isSignUp = authView === 'sign_up';
  const isSignIn = authView === 'sign_in';
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutMsg, setLockoutMsg] = useState<string | null>(null);
  const failedAttemptsRef = useRef(0);

  // Brute-force throttle: 5 failed email attempts => 60s cooldown.
  // Supabase still enforces its own server-side limits; this stops casual
  // rapid guessing from one browser without locking real accounts.
  const MAX_AUTH_ATTEMPTS = 5;
  const AUTH_LOCKOUT_MS = 60 * 1000;

  const checkAuthLockout = () => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secs = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(`Too many attempts. Try again in ${secs}s.`);
      return true;
    }
    if (lockoutUntil && Date.now() >= lockoutUntil) {
      setLockoutUntil(null);
      setLockoutMsg(null);
      failedAttemptsRef.current = 0;
    }
    return false;
  };

  const recordAuthFailure = () => {
    failedAttemptsRef.current += 1;
    if (failedAttemptsRef.current >= MAX_AUTH_ATTEMPTS) {
      const until = Date.now() + AUTH_LOCKOUT_MS;
      setLockoutUntil(until);
      setLockoutMsg('Too many failed attempts. Please wait 60 seconds before trying again.');
      setError('Too many failed attempts. Please wait 60 seconds before trying again.');
    }
  };

  const recordAuthSuccess = () => {
    failedAttemptsRef.current = 0;
    setLockoutUntil(null);
    setLockoutMsg(null);
  };

  const [lockoutSecsLeftUI, setLockoutSecsLeftUI] = useState(0);
  useEffect(() => {
    if (!lockoutUntil) { setLockoutSecsLeftUI(0); return; }
    const t = setInterval(() => {
      const s = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutSecsLeftUI(s);
      if (s <= 0) { setLockoutUntil(null); setLockoutMsg(null); failedAttemptsRef.current = 0; clearInterval(t); }
    }, 500);
    return () => clearInterval(t);
  }, [lockoutUntil]);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  /* ~~ First-time visitor auto pop-up DISABLED ~~
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
  */

  // Sync view when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setError(null);
      setSuccessNotice(null);
      setShowPassword(false);
      setBotField('');

      if (authModalView === 'sign_in') {
        setAuthView('sign_in');
        setFormMode('sign_in');
      } else if (authModalView === 'sign_up') {
        setAuthView('sign_up');
        setFormMode('sign_up');
      } else {
        setAuthView('sign_up');
        setFormMode('sign_up');
      }
    }
  }, [isAuthModalOpen, authModalView]);

  // Lock body scroll while full-screen auth is open
  useEffect(() => {
    if (!isAuthModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isAuthModalOpen]);

  const switchView = (v: AuthView) => {
    setAuthView(v);
    setFormMode(v === 'sign_in' ? 'sign_in' : 'sign_up');
    setError(null);
    setSuccessNotice(null);
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Silent honeypot bot check
    if (botField) {
      setIsLoading(false);
      return;
    }

    // Client-side brute-force throttle (server Supabase limits still apply).
    if (checkAuthLockout()) return;

    // Require Turnstile only when a site key is configured; otherwise direct
    // Supabase auth (Turnstile verification would be skipped server-side too).
    if (turnstileRequired && !turnstileToken) {
      setError('Please complete the bot verification check.');
      return;
    }

    setError(null);
    setSuccessNotice(null);
    setIsLoading(true);

    try {
      if (formMode === 'sign_in' && isSignIn) {
        const res = await signInWithEmail(email, password, turnstileToken);
        // Turnstile tokens are single-use: refresh the widget after every
        // attempt so the next submit gets a fresh token.
        setTurnstileResetKey((k) => k + 1);
        if (res.error) {
          setError(res.error);
          recordAuthFailure();
        } else {
          recordAuthSuccess();
          setTurnstileToken(null);
        }
      } else {
        if (!username.trim()) {
          setError('Please enter a username.');
          setIsLoading(false);
          return;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters.');
          setIsLoading(false);
          return;
        }
        const res = await signUpWithEmail(email, password, username.trim(), turnstileToken);
        setTurnstileResetKey((k) => k + 1);
        if (res.error) {
          setError(res.error);
          recordAuthFailure();
        } else if (res.requiresEmailConfirmation) {
          recordAuthSuccess();
          setTurnstileToken(null);
          setSuccessNotice('Account created! Check your email to confirm your account.');
        } else {
          recordAuthSuccess();
          setTurnstileToken(null);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
      recordAuthFailure();
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAuthLockout()) return;
    const em = email.trim();
    if (!em) {
      setError('Please enter your email address.');
      return;
    }
    setError(null);
    setSuccessNotice(null);
    setIsLoading(true);
    try {
      const res = await requestPasswordReset(em);
      if (res.error) {
        setError(res.error);
        recordAuthFailure();
      } else {
        recordAuthSuccess();
        setAuthView('check_email');
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to send reset email. Please try again.');
      recordAuthFailure();
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
          'Google sign-in is not yet enabled in the Supabase dashboard. Please use email & password!'
        );
      } else {
        setError(res.error);
      }
      setIsLoading(false);
    }
  };
  const isSignUpView = authView === 'sign_up';
  const isSignInView = authView === 'sign_in';

  const lockoutBanner = lockoutMsg && lockoutSecsLeftUI > 0 && (
    <p className="text-[12px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 text-center">
      {lockoutMsg} ({lockoutSecsLeftUI}s)
    </p>
  );

  const alertsBlock = (
    <>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2"
        >
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5 stroke-[2]" />
          <span className="text-[12.5px] font-medium text-red-300 leading-snug">{error}</span>
        </motion.div>
      )}
      {successNotice && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2]" />
          <span className="text-[12.5px] font-medium text-emerald-300 leading-snug">{successNotice}</span>
        </motion.div>
      )}
    </>
  );

  const limeBtn = (label: string) => (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={isLoading || lockoutSecsLeftUI > 0}
      className="w-full py-3.5 rounded-xl text-[15px] font-bold tracking-tight flex items-center justify-center transition-all disabled:opacity-60 cursor-pointer"
      style={{
        fontFamily: 'var(--font-jakarta)',
        background: 'linear-gradient(180deg, #E5FF80 0%, #C6FF33 60%, #B8F52E 100%)',
        color: '#0D0D0D',
        boxShadow: '0 8px 32px rgba(198,255,51,0.25)',
      }}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin stroke-[2.5]" /> : <span>{label}</span>}
    </motion.button>
  );

  const googleBtn = (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-white text-[14px] font-bold transition-all disabled:opacity-60 cursor-pointer"
      style={{ fontFamily: 'var(--font-jakarta)' }}
    >
      <GoogleIcon size={18} />
      <span>Google</span>
    </button>
  );

  const darkInput =
    'w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-[14px] text-white placeholder:text-white/30 focus:bg-white/[0.09] focus:border-[#C6FF33]/60 outline-none transition-all font-medium';
  const formBody = (
    <div className="w-full max-w-[430px] my-auto">
      <AnimatePresence mode="wait">
        {authView === 'check_email' && (
          <motion.div key="check" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center py-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C6FF33]/15 border border-[#C6FF33]/30 mb-5">
              <Mail className="h-6 w-6 text-[#C6FF33] stroke-[2]" />
            </div>
            <h3 className="text-[22px] font-black text-white tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Check your inbox
            </h3>
            <p className="text-[13.5px] text-white/55 mt-2 leading-relaxed">
              We sent a password reset link to <span className="text-white font-semibold">{email}</span>. It expires in 1 hour.
            </p>
            <button type="button" onClick={() => switchView('sign_in')} className="mt-6 text-[13.5px] font-bold text-[#C6FF33] hover:underline cursor-pointer" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Back to Login
            </button>
          </motion.div>
        )}

        {authView === 'forgot' && (
          <motion.div key="forgot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h3 className="text-[24px] font-black text-white tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Reset password
            </h3>
            <p className="text-[13.5px] text-white/55 mt-1.5 mb-5">
              Enter your account email and we will send you a reset link.
            </p>
            {alertsBlock}
            <form onSubmit={handleForgotSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-[13px] font-bold text-white mb-2" style={{ fontFamily: 'var(--font-jakarta)' }}>Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 h-4 w-4 text-white/40 stroke-[2]" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="email" className={darkInput} />
                </div>
              </div>
              {lockoutBanner}
              <div className="pt-1">{limeBtn('Send reset link')}</div>
            </form>
            <button type="button" onClick={() => switchView('sign_in')} className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-white/60 hover:text-white transition-colors cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" /> Back to Login
            </button>
          </motion.div>
        )}
        {(authView === 'sign_up' || authView === 'sign_in') && (
          <motion.div key={authView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <p className="text-center text-[13px] font-semibold text-white/70 mb-4" style={{ fontFamily: 'var(--font-jakarta)' }}>
              {isSignUpView ? 'Register' : 'Login'} with:
            </p>
            {googleBtn}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[12.5px] text-white/40 font-medium">Or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="space-y-4">
              {alertsBlock}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="website_url" value={botField} onChange={(e) => setBotField(e.target.value)} autoComplete="off" tabIndex={-1} aria-hidden="true" className="absolute opacity-0 h-0 w-0 pointer-events-none" />
                {isSignUpView && (
                  <div>
                    <label className="block text-[13px] font-bold text-white mb-2" style={{ fontFamily: 'var(--font-jakarta)' }}>Username</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 h-4 w-4 text-white/40 stroke-[2]" />
                      <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" autoComplete="username" className={darkInput} />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-[13px] font-bold text-white mb-2" style={{ fontFamily: 'var(--font-jakarta)' }}>Email</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 h-4 w-4 text-white/40 stroke-[2]" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="email" className={darkInput} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[13px] font-bold text-white" style={{ fontFamily: 'var(--font-jakarta)' }}>Password</label>
                    {isSignInView && (
                      <button type="button" onClick={() => switchView('forgot')} className="text-[12.5px] font-semibold text-[#C6FF33]/90 hover:text-[#C6FF33] hover:underline cursor-pointer">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 h-4 w-4 text-white/40 stroke-[2]" />
                    <input type={showPassword ? 'text' : 'password'} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete={isSignUpView ? 'new-password' : 'current-password'} className={darkInput} />
                    <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-4 text-white/40 hover:text-white transition-colors cursor-pointer">
                      {showPassword ? <EyeOff className="w-4 h-4 stroke-[2]" /> : <Eye className="w-4 h-4 stroke-[2]" />}
                    </button>
                  </div>
                  {isSignUpView && <p className="text-[12px] text-white/35 mt-1.5">Minimum length is 8 characters.</p>}
                  <AnimatePresence>{isSignUpView && <PasswordChecklist password={password} dark />}</AnimatePresence>
                </div>
                <div className="flex justify-center py-1">
                  <TurnstileWidget onToken={setTurnstileToken} resetKey={turnstileResetKey} />
                </div>
                {lockoutBanner}
                <div className="pt-1">{limeBtn(isSignUpView ? 'Sign Up' : 'Login')}</div>
              </form>
            </div>
            {isSignUpView && (
              <p className="text-[12.5px] text-white/45 leading-relaxed mt-5">
                By creating an account, you agree to the{' '}
                <Link href="/terms" onClick={closeAuthModal} className="underline underline-offset-2 text-white/70 hover:text-[#C6FF33] transition-colors">
                  Terms of Service
                </Link>
                . We will occasionally send you account-related emails.
              </p>
            )}
            <p className="text-center text-[13.5px] text-white/60 mt-7">
              {isSignUpView ? 'Already have an account? ' : "Don't have an account? "}
              <button type="button" onClick={() => switchView(isSignUpView ? 'sign_in' : 'sign_up')} className="font-bold text-[#C6FF33] hover:underline cursor-pointer" style={{ fontFamily: 'var(--font-jakarta)' }}>
                {isSignUpView ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  const mediaPanel = (compact: boolean) => (
    <div className={compact ? 'relative overflow-hidden bg-black h-[300px] shrink-0' : 'relative overflow-hidden bg-black h-full min-h-full'}>
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={AUTH_VIDEO_URL}
        poster={AUTH_VIDEO_POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)' }}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <BrandLogo size={30} />
          <button type="button" onClick={closeAuthModal} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/80 hover:text-white transition-colors cursor-pointer" style={{ fontFamily: 'var(--font-jakarta)' }}>
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Back</span>
          </button>
        </div>
        <div>
          <h2 className="text-white font-black tracking-tight leading-[1.05]" style={{ fontFamily: 'var(--font-jakarta)', fontSize: compact ? 34 : 'clamp(30px, 3.4vw, 46px)' }}>
            Speed up your work with Silk Studio
          </h2>
          <p className="text-white/70 text-[13.5px] leading-relaxed mt-3 max-w-[380px]">
            Design, print &amp; digital — one brief, flawless delivery across Lagos.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-4 md:p-6 pointer-events-none font-sans">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} onClick={closeAuthModal} className="fixed inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto" />

          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.99 }}
            transition={{ type: 'spring', damping: 30, stiffness: 340, mass: 0.8 }}
            className="pointer-events-auto relative hidden md:grid w-full max-w-[1080px] h-[min(720px,92vh)] grid-cols-2 rounded-[20px] overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl"
          >
            {mediaPanel(false)}
            <div className="flex-1 flex items-center justify-center overflow-y-auto px-10 py-6">
              {formBody}
            </div>
            <button type="button" onClick={closeAuthModal} aria-label="Close" className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer">
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </motion.div>

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 360, mass: 0.8 }}
            className="pointer-events-auto relative flex md:hidden w-full h-[100dvh] flex-col bg-[#0A0A0A] overflow-hidden"
          >
            {mediaPanel(true)}
            <div className="flex-1 overflow-y-auto bg-[#0A0A0A] rounded-t-[24px] -mt-6 relative border-t border-white/10 px-6 py-8">
              {formBody}
            </div>
            <button type="button" onClick={closeAuthModal} aria-label="Close" className="absolute top-4 right-4 h-9 w-9 flex items-center justify-center rounded-full bg-black/50 border border-white/15 text-white cursor-pointer">
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
