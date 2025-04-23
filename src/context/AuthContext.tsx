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
  const [loading, setLoading] = useState(true);
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
          await fetchUserProfile(session.user.id);
        } else {
          console.log('No session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in, fetching profile');
          await fetchUserProfile(session.user.id);
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
  }, [navigate]);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        setLoading(false);
        toast.error('Errore nel caricamento del profilo');
        return;
      }

      if (!profile) {
        console.error('No profile found for user:', userId);
        setLoading(false);
        toast.error('Profilo utente non trovato');
        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select(`
          roles:roles (
            name
          )
        `)
        .eq('user_id', userId)
        .maybeSingle();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
      }

      const userRole = roleData?.roles?.name as UserRole || 'player';
      
      const userProfile: User = {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`.trim(),
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        role: userRole,
        avatar: profile.avatar,
        birthDate: profile.birth_date,
        address: profile.address,
        city: profile.city,
        biometricEnabled: profile.biometric_enabled
      };

      console.log('User profile loaded:', userProfile);
      setUser(userProfile);
      setLoading(false);
      
      if (window.location.pathname.includes('/login')) {
        console.log('Redirecting to dashboard from login');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setLoading(false);
      toast.error('Errore nel caricamento del profilo utente');
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error details:', error);
        throw error;
      }

      console.log('Login successful, session:', data.session?.user.id);
      toast.success('Login effettuato');
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message?.includes('Invalid login credentials')) {
        toast.error('Credenziali non valide');
      } else if (error.message?.includes('Email not confirmed')) {
        toast.error('Email non confermata. Controlla la tua casella di posta.');
      } else {
        toast.error(`Errore durante il login: ${error.message || 'Errore sconosciuto'}`);
      }
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout');
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Logout effettuato con successo');
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(`Errore durante il logout: ${error.message || 'Errore sconosciuto'}`);
    } finally {
      setLoading(false);
    }
  };

  const setRole = async (role: string) => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Setting role to:', role);
      
      const validRole = validateUserRole(role);
      
      const { data: roles, error } = await supabase
        .from('roles')
        .select('id, name')
        .eq('name', validRole)
        .single();

      if (error) {
        console.error('Error checking role:', error);
        toast.error('Errore durante la verifica del ruolo');
        return;
      }

      if (!roles) {
        toast.error('Ruolo non trovato');
        return;
      }
      
      const { data: userRole, error: userRoleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role_id', roles.id)
        .maybeSingle();

      if (userRoleError) {
        console.error('Error checking user role:', userRoleError);
        toast.error('Errore durante la verifica del ruolo utente');
        return;
      }

      if (!userRole) {
        toast.error('Ruolo non assegnato all\'utente');
        return;
      }
      
      setUser(prev => prev ? { ...prev, role: validRole } : null);
      toast.success(`Ruolo cambiato a: ${validRole}`);
    } catch (error: any) {
      console.error('Error setting role:', error);
      toast.error(`Errore durante il cambio di ruolo: ${error.message || 'Errore sconosciuto'}`);
    } finally {
      setLoading(false);
    }
  };

  const validateUserRole = (role: string): UserRole => {
    const validRoles: UserRole[] = ['player', 'coach', 'admin', 'medical', 'developer'];
    return validRoles.includes(role as UserRole) ? (role as UserRole) : 'player';
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
