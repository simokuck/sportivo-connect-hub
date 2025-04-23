
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

export const useUserRoles = (userId?: string) => {
  // Fetches all roles in the system
  const { data: systemRoles = [], isLoading: loadingSystemRoles, error: systemRolesError } = useQuery({
    queryKey: ['systemRoles'],
    queryFn: async () => {
      console.log('Fetching system roles');
      try {
        const { data, error } = await supabase
          .from('roles')
          .select('*')
          .order('name');
        
        if (error) {
          console.error('Error fetching system roles:', error);
          throw error;
        }
        
        console.log('System roles fetched:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('Exception fetching system roles:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetches roles assigned to the specific user
  const { data: userRoleData = [], isLoading: loadingUserRoles, error: userRolesError } = useQuery({
    queryKey: ['userRoles', userId],
    queryFn: async () => {
      if (!userId) {
        console.log('No user ID provided for user roles');
        return [];
      }
      
      console.log('Fetching roles for user:', userId);
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select(`
            role_id,
            roles:roles (
              id, 
              name,
              description
            )
          `)
          .eq('user_id', userId);
        
        if (error) {
          console.error('Error fetching user roles:', error);
          throw error;
        }
        
        console.log('User roles fetched:', data?.length || 0, data);
        return data || [];
      } catch (error) {
        console.error('Exception fetching user roles:', error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Process user roles into a simpler format
  const [userRoles, setUserRoles] = useState<string[]>([]);
  
  useEffect(() => {
    if (userRoleData && Array.isArray(userRoleData)) {
      const roles = userRoleData
        .filter(role => role.roles && role.roles.name)
        .map(role => role.roles?.name || '')
        .filter(Boolean);
      console.log('Processed user roles:', roles);
      setUserRoles(roles);
    } else {
      console.log('User role data is not valid:', userRoleData);
      setUserRoles([]);
    }
  }, [userRoleData]);

  // Helper to check if a user has a specific role
  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
  };

  // Helper to get the translated role name
  const getRoleTranslation = (role: string): string => {
    const translations: Record<string, string> = {
      'player': 'Giocatore',
      'coach': 'Allenatore',
      'admin': 'Amministratore',
      'medical': 'Staff Medico',
      'developer': 'Sviluppatore'
    };
    
    return translations[role] || role;
  };

  // Map system roles to valid UserRole types
  const validSystemRoles = systemRoles
    .filter(role => {
      const validRoles: UserRole[] = ['player', 'coach', 'admin', 'medical', 'developer'];
      return validRoles.includes(role.name as UserRole);
    })
    .map(role => ({
      id: role.id,
      name: role.name as UserRole,
      description: role.description
    }));

  return {
    systemRoles: validSystemRoles,
    userRoles,
    hasRole,
    getRoleTranslation,
    isLoading: loadingSystemRoles || loadingUserRoles,
    error: systemRolesError || userRolesError
  };
};
