
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useAuthState } from '@/hooks/useAuthState';
import { fetchUserProfile, loginUser, logoutUser, setUserRole } from '@/services/auth';

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
    
    const checkSession = async () => {
      try {
        console.log('Session check started');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          setLoading(false);
          return;
        }
        
        if (session) {
          console.log('Session found, fetching user profile');
          const userProfile = await fetchUserProfile(session.user.id);
          setUser(userProfile);
        } else {
          console.log('No session found');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in, fetching profile');
          const userProfile = await fetchUserProfile(session.user.id);
          setUser(userProfile);
          setLoading(false);
          if (window.location.pathname.includes('/login')) {
            console.log('Redirecting to dashboard from login');
            navigate('/dashboard');
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setLoading(false);
          navigate('/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setUser, setLoading]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSetRole = async (role: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const newRole = await setUserRole(user.id, role);
      setUser(prev => prev ? { ...prev, role: newRole } : null);
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
