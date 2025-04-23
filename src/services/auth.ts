import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';

export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    console.log('Fetching user profile for:', userId);
    
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      toast.error('Errore nel caricamento del profilo');
      return null;
    }

    if (!profileData) {
      console.error('Profile not found for user:', userId);
      toast.error('Profilo utente non trovato');
      return null;
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
      id: profileData.id,
      name: `${profileData.first_name} ${profileData.last_name}`.trim() || 'Utente',
      firstName: profileData.first_name,
      lastName: profileData.last_name,
      email: profileData.email,
      role: userRole,
      avatar: profileData.avatar,
      birthDate: profileData.birth_date,
      address: profileData.address,
      city: profileData.city,
      biometricEnabled: profileData.biometric_enabled
    };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    toast.error('Errore nel caricamento del profilo utente');
    return null;
  }
}

export async function updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
  try {
    console.log('Updating user profile:', userId, data);
    
    const { data: updatedProfile, error } = await supabase
      .from('user_profiles')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        birth_date: data.birthDate,
        address: data.address,
        city: data.city,
        avatar: data.avatar,
        biometric_enabled: data.biometricEnabled
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    if (!updatedProfile) {
      throw new Error('Profile not found');
    }

    // Convert database model to User type
    return {
      id: updatedProfile.id,
      name: `${updatedProfile.first_name} ${updatedProfile.last_name}`.trim() || 'Utente',
      firstName: updatedProfile.first_name,
      lastName: updatedProfile.last_name,
      email: updatedProfile.email,
      role: updatedProfile.role,
      avatar: updatedProfile.avatar,
      birthDate: updatedProfile.birth_date,
      address: updatedProfile.address,
      city: updatedProfile.city,
      biometricEnabled: updatedProfile.biometric_enabled
    };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  console.log('Attempting login for:', email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error details:', error);
    if (error.message?.includes('Invalid login credentials')) {
      toast.error('Credenziali non valide');
    } else if (error.message?.includes('Email not confirmed')) {
      toast.error('Email non confermata. Controlla la tua casella di posta.');
    } else {
      toast.error(`Errore durante il login: ${error.message || 'Errore sconosciuto'}`);
    }
    throw error;
  }

  console.log('Login successful, session:', data.session?.user.id);
  toast.success('Login effettuato');
  return data;
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
    
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role)
      .single();

    if (roleError || !roleData) {
      throw new Error('Role not found');
    }

    const { error: updateError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role_id: roleData.id
      });

    if (updateError) {
      throw updateError;
    }

    // Update profile role
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', userId);

    if (profileError) {
      throw profileError;
    }
    
    toast.success(`Ruolo cambiato a: ${role}`);
    return role as UserRole;
  } catch (error: any) {
    console.error('Error setting role:', error);
    toast.error(`Errore durante il cambio di ruolo: ${error.message || 'Errore sconosciuto'}`);
    throw error;
  }
}

function validateUserRole(role: string): UserRole {
  const validRoles: UserRole[] = ['player', 'coach', 'admin', 'medical', 'developer', 'pending'];
  return validRoles.includes(role as UserRole) ? (role as UserRole) : 'pending';
}
