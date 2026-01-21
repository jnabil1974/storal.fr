'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!supabase) { setLoading(false); return; }
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setUser(session?.user ? { id: session.user.id, email: session.user.email || '' } : null);
        setLoading(false);
      }
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ? { id: session.user.id, email: session.user.email || '' } : null);
      });
    };
    init();
    return () => { mounted = false; };
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase non initialisé');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase non initialisé');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const redirectTo = baseUrl ? `${baseUrl}/auth/callback` : undefined;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        emailRedirectTo: redirectTo || 'https://storal.fr/auth/callback'
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!supabase) {
      setUser(null);
      return;
    }
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Supabase signOut failed:', error);
    } finally {
      // Forcer la déco côté UI même si le signOut échoue
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
