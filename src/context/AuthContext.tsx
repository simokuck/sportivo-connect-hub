import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useAuthState } from '@/hooks/useAuthState';
import { fetchUserProfile, loginUser, logoutUser, setUserRole, updateUserProfile } from '@/services/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setRole: (role: string) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, setUser, loading, setLoading } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Setting up auth listener...');
    let mounted = true;
    
    // Setup auth state listener FIRST
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
              navigate('/dashboard');
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

    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session check:', session?.user?.id);
        
        if (error) {
          console.error('Session check error:', error);
          return;
        }

        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          if (userProfile && mounted) {
            setUser(userProfile);
            if (window.location.pathname === '/') {
              navigate('/dashboard');
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSession();

    // Refresh session every 4 minutes
    const refreshInterval = setInterval(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          console.log('Refreshing session...');
          supabase.auth.refreshSession();
        }
      });
    }, 4 * 60 * 1000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearInterval(refreshInterval);
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

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) return;
      setLoading(true);
      const updatedProfile = await updateUserProfile(user.id, data);
      setUser(updatedProfile);
      toast.success('Profilo aggiornato con successo');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Errore durante l\'aggiornamento del profilo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    logout,
    setRole: handleSetRole,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
