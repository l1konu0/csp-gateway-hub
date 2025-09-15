import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  nom: string | null;
  prenom: string | null;
  telephone: string | null;
  adresse: string | null;
  ville: string | null;
  code_postal: string | null;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isAdmin: false,
    loading: true,
  });

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({ ...prev, session, user: session?.user ?? null }));
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
            checkUserRole(session.user.id);
          }, 0);
        } else {
          setState(prev => ({ 
            ...prev, 
            profile: null, 
            isAdmin: false, 
            loading: false 
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({ ...prev, session, user: session?.user ?? null }));
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
          checkUserRole(session.user.id);
        }, 0);
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else {
        setState(prev => ({ ...prev, profile: data }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      setState(prev => ({ 
        ...prev, 
        isAdmin: !error && data?.role === 'admin',
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ ...prev, isAdmin: false, loading: false }));
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', state.user.id);

    if (!error) {
      setState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : null
      }));
    }

    return { error };
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
};