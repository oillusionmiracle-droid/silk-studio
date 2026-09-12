'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setError(null); setIsLoading(true);
    try {
      const res = await updatePassword(password);
      if (res.error) setError(res.error);
      else { setDone(true); setTimeout(() => router.push('/account'), 1500); }
    } catch (err: any) {
      setError(err?.message || 'Unable to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-5 py-20 font-sans">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[430px] rounded-[20px] border border-white/10 bg-white/[0.03] p-8">
        <h1 className="text-[24px] font-black text-white tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>Set a new password</h1>
        <p className="text-[13.5px] text-white/55 mt-1.5 mb-6">Choose a strong password with at least 8 characters.</p>
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5 stroke-[2]" />
            <span className="text-[12.5px] font-medium text-red-300">{error}</span>
          </div>
        )}
        {done ? (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2]" />
            <span className="text-[12.5px] font-medium text-emerald-300">Password updated. Redirecting to your account…</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-bold text-white mb-2" style={{ fontFamily: 'var(--font-jakarta)' }}>New password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 h-4 w-4 text-white/40 stroke-[2]" />
                <input type={show ? 'text' : 'password'} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" autoComplete="new-password" className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-[14px] text-white placeholder:text-white/30 focus:border-[#C6FF33]/60 outline-none font-medium" />
                <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-4 text-white/40 hover:text-white cursor-pointer">{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-white mb-2" style={{ fontFamily: 'var(--font-jakarta)' }}>Confirm password</label>
              <input type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" autoComplete="new-password" className="w-full px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/10 text-[14px] text-white placeholder:text-white/30 focus:border-[#C6FF33]/60 outline-none font-medium" />
            </div>
            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading} className="w-full py-3.5 rounded-xl text-[15px] font-bold cursor-pointer disabled:opacity-60" style={{ fontFamily: 'var(--font-jakarta)', background: 'linear-gradient(180deg, #E5FF80 0%, #C6FF33 60%, #B8F52E 100%)', color: '#0D0D0D' }}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Update password'}
            </motion.button>
          </form>
        )}
        <p className="text-center text-[13px] text-white/50 mt-6"><Link href="/" className="hover:text-white">Back to home</Link></p>
      </motion.div>
    </main>
  );
}
