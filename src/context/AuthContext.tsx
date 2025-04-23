
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setRole: (role: string) => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await fetchUserProfile(session.user.id);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*, user_roles(role_id)')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Fetch role information if there's a role_id
      let roleName = 'player'; // Default role
      if (profileData.user_roles && profileData.user_roles.length > 0) {
        const { data: roleData } = await supabase
          .from('roles')
          .select('name')
          .eq('id', profileData.user_roles[0].role_id)
          .single();
          
        if (roleData) {
          roleName = roleData.name;
        }
      }

      const userProfile: User = {
        id: profileData.id,
        name: `${profileData.first_name} ${profileData.last_name}`.trim(),
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        email: profileData.email,
        role: roleName,
        avatar: profileData.avatar,
        birthDate: profileData.birth_date,
        address: profileData.address,
        city: profileData.city,
        biometricEnabled: profileData.biometric_enabled
      };

      setUser(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Errore durante il caricamento del profilo utente');
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Login effettuato');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Credenziali non valide');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Errore durante il logout');
    }
  };

  const setRole = async (role: string) => {
    if (!user) return;

    try {
      // In a real app, you'd manage roles more securely
      const { data, error } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', user.id)
        .eq('roles.name', role)
        .single();

      if (error || !data) {
        toast.error('Ruolo non valido');
        return;
      }

      setUser(prev => prev ? { ...prev, role } : null);
    } catch (error) {
      console.error('Error setting role:', error);
      toast.error('Errore durante il cambio di ruolo');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      setRole 
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
