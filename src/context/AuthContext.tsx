import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useAuthState } from '@/hooks/useAuthState';
import { fetchUserProfile, loginUser, logoutUser, setUserRole } from '@/services/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setRole: (role: string) => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, setUser, loading, setLoading } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Checking session...');
    let mounted = true;
    
    const checkSession = async () => {
      try {
        if (mounted) setLoading(true);
        console.log('Session check started');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          return;
        }
        
        if (session && mounted) {
          console.log('Session found, fetching user profile');
          const userProfile = await fetchUserProfile(session.user.id);
          if (!userProfile) {
            console.error('No profile found for authenticated user');
            toast.error('Errore nel caricamento del profilo utente');
            await supabase.auth.signOut();
            navigate('/login');
            return;
          }
          if (mounted) {
            setUser(userProfile);
            if (window.location.pathname === '/login') {
              navigate('/dashboard');
            }
          }
        } else {
          console.log('No session found');
          if (!window.location.pathname.includes('/login')) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        setLoading(true);
        
        try {
          if (event === 'SIGNED_IN' && session) {
            console.log('User signed in, fetching profile');
            const userProfile = await fetchUserProfile(session.user.id);
            if (!userProfile) {
              console.error('No profile found after sign in');
              toast.error('Errore nel caricamento del profilo utente');
              await supabase.auth.signOut();
              navigate('/login');
              return;
            }
            if (mounted) {
              setUser(userProfile);
              if (window.location.pathname === '/login') {
                navigate('/dashboard');
              }
            }
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            if (mounted) {
              setUser(null);
              navigate('/login');
            }
          }
        } catch (error) {
          console.error('Auth state change error:', error);
        } finally {
          if (mounted) setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, setUser, setLoading]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await loginUser(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetRole = async (role: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const newRole = await setUserRole(user.id, role);
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      setRole: handleSetRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
