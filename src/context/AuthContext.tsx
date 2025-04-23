
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
  const [loading, setLoading] = useState(true);  // Inizia come true per indicare il caricamento iniziale
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        console.log('Checking session...');
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

    // Listen for auth changes
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
    setLoading(true);
    try {
      console.log('Fetching user profile for:', userId);
      
      // Fetch the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast.error('Errore durante il caricamento del profilo utente');
        setLoading(false);
        return;
      }

      if (!profileData) {
        console.error('User profile not found');
        toast.error('Profilo utente non trovato');
        setLoading(false);
        return;
      }

      console.log('Profile data retrieved:', profileData);

      // Query user roles in a single, simpler query
      const { data: userRoleData, error: userRoleError } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles:roles(name)
        `)
        .eq('user_id', userId)
        .maybeSingle();

      if (userRoleError) {
        console.error('Error fetching user role:', userRoleError);
      }

      // Default role
      let roleName = 'player' as UserRole;
      
      // If we have role data, use it
      if (userRoleData && userRoleData.roles) {
        roleName = validateUserRole(userRoleData.roles.name);
        console.log('User role found:', roleName);
      } else {
        console.log('No role found, using default:', roleName);
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
        console.log('Redirecting to dashboard from login');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Errore durante il caricamento del profilo utente');
    } finally {
      setLoading(false);  // Assicuriamo che loading venga sempre impostato a false alla fine
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
      setLoading(false);  // Importante: imposta loading a false in caso di errore
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
      
      // Validate the role before proceeding
      const validRole = validateUserRole(role);
      
      // Semplifichiamo la query per verificare se l'utente ha il ruolo
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
      
      // Verifica se l'utente ha già il ruolo assegnato
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
