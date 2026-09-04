'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  default_address: string | null;
  default_area: string | null;
  avatar_url: string | null;
  role: 'customer' | 'admin';
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  authModalView: 'sign_in' | 'sign_up';
  openAuthModal: (view?: 'sign_in' | 'sign_up') => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null; requiresEmailConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithApple: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'sign_in' | 'sign_up'>('sign_in');

  const openAuthModal = useCallback((view: 'sign_in' | 'sign_up' = 'sign_in') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const fetchProfile = useCallback(async (userId: string, email?: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Profile fetch notice:', error.message);
      }

      const isKnownAdmin =
        email === 'oillusionmiracle@gmail.com' ||
        email === 'ollusionmiracle@gmail.com' ||
        (email && email.toLowerCase().includes('illusionmiracle'));

      if (data) {
        const profileData = data as Profile;
        if (isKnownAdmin && profileData.role !== 'admin') {
          profileData.role = 'admin';
          supabase.from('profiles').update({ role: 'admin' }).eq('id', userId).then();
        }
        return profileData;
      }

      // If profile record is still being created or RLS is pending, provide authorized profile for primary admin
      if (isKnownAdmin) {
        return {
          id: userId,
          full_name: 'Onyenwe Miracle',
          phone: '',
          default_address: '',
          default_area: 'Lagos',
          avatar_url: '',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Profile;
      }

      return null;
    } catch (err) {
      console.warn('Profile fetch error:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const p = await fetchProfile(user.id, user.email);
    if (p) {
      setProfile(p);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    // Get current session on load
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id, session.user.email);
        if (mounted) setProfile(p);
      }
      if (mounted) setIsLoading(false);
    }).catch(() => {
      if (mounted) setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          const p = await fetchProfile(newSession.user.id, newSession.user.email);
          if (mounted) setProfile(p);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      closeAuthModal();
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Unable to sign in' };
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) return { error: error.message };

      // Check if email confirmation is required
      const requiresEmailConfirmation = !data.session;
      if (!requiresEmailConfirmation) {
        closeAuthModal();
      }
      return { error: null, requiresEmailConfirmation };
    } catch (err: any) {
      return { error: err.message || 'Unable to create account' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Google sign in failed' };
    }
  };

  const signInWithApple = async () => {
    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo,
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Apple sign in failed' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const isAdmin =
    profile?.role === 'admin' ||
    user?.email === 'oillusionmiracle@gmail.com' ||
    user?.email === 'ollusionmiracle@gmail.com' ||
    Boolean(user?.email && user.email.toLowerCase().includes('illusionmiracle'));

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isAdmin,
        isAuthModalOpen,
        authModalView,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithApple,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
