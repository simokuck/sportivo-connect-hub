
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';

export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    console.log('Fetching user profile for:', userId);
    
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      toast.error('Errore nel caricamento del profilo');
      return null;
    }

    // If profile doesn't exist, try to create it
    if (!profile) {
      console.log('Profile not found, attempting to create one');
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser?.user) {
        console.error('No auth user found');
        return null;
      }

      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert([{
          id: userId,
          email: authUser.user.email,
          first_name: '',
          last_name: ''
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        toast.error('Errore nella creazione del profilo');
        return null;
      }

      profile = newProfile;
    }

    // Fetch user role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select(`
        roles (
          name
        )
      `)
      .eq('user_id', userId)
      .maybeSingle();

    if (roleError) {
      console.error('Error fetching user role:', roleError);
    }

    const userRole = roleData?.roles?.name as UserRole || 'player';
    
    return {
      id: profile.id,
      name: `${profile.first_name} ${profile.last_name}`.trim() || 'Utente',
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
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    toast.error('Errore nel caricamento del profilo utente');
    return null;
  }
}

export async function loginUser(email: string, password: string) {
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
    throw error;
  }
}

export async function logoutUser() {
  try {
    console.log('Attempting logout');
    await supabase.auth.signOut();
    toast.success('Logout effettuato con successo');
  } catch (error: any) {
    console.error('Logout error:', error);
    toast.error(`Errore durante il logout: ${error.message || 'Errore sconosciuto'}`);
    throw error;
  }
}

export async function setUserRole(userId: string, role: string): Promise<UserRole> {
  try {
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
      throw error;
    }

    if (!roles) {
      toast.error('Ruolo non trovato');
      throw new Error('Role not found');
    }
    
    const { data: userRole, error: userRoleError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role_id', roles.id)
      .maybeSingle();

    if (userRoleError) {
      console.error('Error checking user role:', userRoleError);
      toast.error('Errore durante la verifica del ruolo utente');
      throw userRoleError;
    }

    if (!userRole) {
      toast.error('Ruolo non assegnato all\'utente');
      throw new Error('Role not assigned to user');
    }
    
    toast.success(`Ruolo cambiato a: ${validRole}`);
    return validRole;
  } catch (error: any) {
    console.error('Error setting role:', error);
    toast.error(`Errore durante il cambio di ruolo: ${error.message || 'Errore sconosciuto'}`);
    throw error;
  }
}

function validateUserRole(role: string): UserRole {
  const validRoles: UserRole[] = ['player', 'coach', 'admin', 'medical', 'developer'];
  return validRoles.includes(role as UserRole) ? (role as UserRole) : 'player';
}
