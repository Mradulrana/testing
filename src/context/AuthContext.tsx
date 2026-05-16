'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { supabase } from '@/lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

type Role = 'buyer' | 'seller' | 'agent' | 'admin' | null;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: Role;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const [role, setRole] = useState<Role>(null);

  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // FETCH USER ROLE
  // =========================

  const fetchRole = async (userId: string) => {
    try {
      console.log('Fetching role for:', userId);

      const { data, error } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', userId)
        .maybeSingle();

      // REAL DATABASE ERROR
      if (error) {
        console.error('Error fetching role:', error);

        // fallback role
        setRole('buyer');

        return;
      }

      // PROFILE NOT FOUND
      if (!data) {
        console.warn('No profile found for user:', userId);

        // fallback role
        setRole('buyer');

        return;
      }

      console.log('Role data:', data);

      setRole(data.user_role as Role);

    } catch (error) {
      console.error('Role fetch error:', error);

      setRole('buyer');
    }
  };

  // =========================
  // INITIAL SESSION
  // =========================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          return;
        }

        console.log('Initial session:', session);

        setSession(session);

        setUser(session?.user || null);

        if (session?.user) {
          await fetchRole(session.user.id);
        } else {
          setRole(null);
        }

      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // =========================
    // AUTH STATE LISTENER
    // =========================

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth event:', event);

        setSession(newSession);

        setUser(newSession?.user || null);

        if (newSession?.user) {
          await fetchRole(newSession.user.id);
        } else {
          setRole(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // =========================
  // SIGN OUT
  // =========================

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        return;
      }

      setSession(null);

      setUser(null);

      setRole(null);

    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // =========================
  // CONTEXT PROVIDER
  // =========================

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        role,
        isLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// CUSTOM HOOK
// =========================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}