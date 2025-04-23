
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';
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
      // Fetch the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw profileError;
      }

      if (!profileData) {
        console.error('User profile not found');
        toast.error('Profilo utente non trovato');
        return;
      }

      // Fetch user role from user_roles table
      const { data: userRoleData, error: userRoleError } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (userRoleError) {
        console.error('Error fetching user role:', userRoleError);
      }

      // Default role
      let roleName = 'player' as UserRole;
      
      // If we have a role_id, fetch the role name
      if (userRoleData && userRoleData.role_id) {
        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('name')
          .eq('id', userRoleData.role_id)
          .maybeSingle();
          
        if (roleError) {
          console.error('Error fetching role:', roleError);
        } else if (roleData) {
          roleName = validateUserRole(roleData.name);
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

      console.log('User profile loaded:', userProfile);
      setUser(userProfile);
      
      // If we're on the login page, redirect to dashboard
      if (window.location.pathname.includes('/login')) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Errore durante il caricamento del profilo utente');
    }
  };

  // Helper function to validate if a string is a valid UserRole
  const validateUserRole = (role: string): UserRole => {
    const validRoles: UserRole[] = ['player', 'coach', 'admin', 'medical', 'developer'];
    return validRoles.includes(role as UserRole) ? (role as UserRole) : 'player';
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error details:', error);
        throw error;
      }

      toast.success('Login effettuato');
      // fetchUserProfile will be called by the onAuthStateChange listener
    } catch (error: any) {
      console.error('Login error:', error);
      
      // More specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Credenziali non valide');
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('Email non confermata. Controlla la tua casella di posta.');
      } else {
        toast.error(`Errore durante il login: ${error.message || 'Errore sconosciuto'}`);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Logout effettuato con successo');
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(`Errore durante il logout: ${error.message || 'Errore sconosciuto'}`);
    }
  };

  const setRole = async (role: string) => {
    if (!user) return;

    try {
      // Validate the role before proceeding
      const validRole = validateUserRole(role);
      
      // In a real app, you'd check if the user has this role assigned
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role_id', (await supabase.from('roles').select('id').eq('name', validRole).single()).data?.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking role:', error);
        toast.error('Errore durante la verifica del ruolo');
        return;
      }

      if (!data) {
        toast.error('Ruolo non assegnato all\'utente');
        return;
      }
      
      setUser(prev => prev ? { ...prev, role: validRole } : null);
      toast.success(`Ruolo cambiato a: ${validRole}`);
    } catch (error: any) {
      console.error('Error setting role:', error);
      toast.error(`Errore durante il cambio di ruolo: ${error.message || 'Errore sconosciuto'}`);
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
