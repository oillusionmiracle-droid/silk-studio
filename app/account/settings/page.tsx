'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  User,
  Phone,
  MapPin,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Lock,
} from 'lucide-react';

const LAGOS_AREAS = [
  'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa',
  'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye',
  'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland',
  'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere',
  'Lekki Phase 1', 'Lekki Phase 2', 'Victoria Island', 'Ikoyi', 'Yaba', 'Ajah', 'Gbagada',
  'Maryland', 'Ogba', 'Ogudu', 'Ojodu', 'Sangotedo', 'Chevron', 'Oniru',
];

export default function AccountSettingsPage() {
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+234');
  const [defaultAddress, setDefaultAddress] = useState('');
  const [defaultArea, setDefaultArea] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password reset state
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.phone) setPhone(profile.phone);
      if (profile.default_address) setDefaultAddress(profile.default_address);
      if (profile.default_area) setDefaultArea(profile.default_area);
    }
  }, [profile]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName.trim(),
          phone: phone.trim(),
          default_address: defaultAddress.trim(),
          default_area: defaultArea,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      await refreshProfile();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not save profile preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordNotice('Password must be at least 6 characters.');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordNotice(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordNotice('Password updated successfully.');
      setNewPassword('');
    } catch (err: any) {
      setPasswordNotice(err?.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl font-apple">
      {/* Profile & Delivery Form */}
      <div className="rounded-[26px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-neutral-900/80 backdrop-blur-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-base font-semibold tracking-tight text-neutral-950 dark:text-white">
            Personal & Delivery Details
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Default shipping address and phone number for faster checkout.
          </p>
        </div>

        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 stroke-[2]" />
            <span>Profile details updated successfully.</span>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0 stroke-[2]" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
              Full Name
            </label>
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-800/40 focus-within:border-black dark:focus-within:border-white transition-colors">
              <User className="h-4 w-4 text-neutral-400 stroke-[1.75]" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full bg-transparent text-xs text-neutral-900 dark:text-neutral-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
              Email Address (Read-only)
            </label>
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
              <Mail className="h-4 w-4 text-neutral-400 stroke-[1.75]" />
              <span className="text-xs">{user?.email}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
              Phone Number
            </label>
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-800/40 focus-within:border-black dark:focus-within:border-white transition-colors">
              <Phone className="h-4 w-4 text-neutral-400 stroke-[1.75]" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234..."
                className="w-full bg-transparent text-xs text-neutral-900 dark:text-neutral-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
              Default Delivery Address
            </label>
            <div className="flex items-start gap-3 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-800/40 focus-within:border-black dark:focus-within:border-white transition-colors">
              <MapPin className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5 stroke-[1.75]" />
              <input
                type="text"
                value={defaultAddress}
                onChange={(e) => setDefaultAddress(e.target.value)}
                placeholder="Street name, apartment, building"
                className="w-full bg-transparent text-xs text-neutral-900 dark:text-neutral-100 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
              Default Lagos Area / LGA
            </label>
            <select
              value={defaultArea}
              onChange={(e) => setDefaultArea(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-800/40 text-xs text-neutral-900 dark:text-neutral-100 outline-none focus:border-black dark:focus:border-white transition-colors"
            >
              <option value="">Select Lagos Area</option>
              {LAGOS_AREAS.map((a) => (
                <option key={a} value={a} className="bg-white dark:bg-neutral-900">
                  {a}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 px-4 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 mt-4"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin stroke-[2]" />
            ) : (
              <>
                <Save className="h-3.5 w-3.5 stroke-[2]" />
                <span>Save Delivery Preferences</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Security & Password Reset */}
      <div className="rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <h2 className="text-base font-semibold tracking-tight text-neutral-950 dark:text-white">
            Security & Password
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Update your Silk Studio ID credentials.
          </p>
        </div>

        {passwordNotice && (
          <div className="mb-4 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-white/10 text-xs text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
            <Lock className="h-4 w-4 stroke-[1.75]" />
            <span>{passwordNotice}</span>
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-1.5">
              New Password
            </label>
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-800/40 focus-within:border-black dark:focus-within:border-white transition-colors">
              <Lock className="h-4 w-4 text-neutral-400 stroke-[1.75]" />
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-transparent text-xs text-neutral-900 dark:text-neutral-100 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="py-2.5 px-5 rounded-xl border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium text-neutral-900 dark:text-white transition-colors flex items-center gap-2"
          >
            {isUpdatingPassword && <Loader2 className="h-3.5 w-3.5 animate-spin stroke-[2]" />}
            <span>Update Password</span>
          </button>
        </form>
      </div>
    </div>
  );
}
