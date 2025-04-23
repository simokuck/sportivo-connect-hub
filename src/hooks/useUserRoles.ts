
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';

export const useUserRoles = (userId?: string) => {
  // Fetches all roles in the system
  const { data: systemRoles = [], isLoading: loadingSystemRoles } = useQuery({
    queryKey: ['systemRoles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching system roles:', error);
        throw error;
      }
      
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetches roles assigned to the specific user
  const { data: userRoleData = [], isLoading: loadingUserRoles } = useQuery({
    queryKey: ['userRoles', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles:role_id (
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
      
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Process user roles into a simpler format
  const [userRoles, setUserRoles] = useState<string[]>([]);
  
  useEffect(() => {
    if (userRoleData) {
      const roles = userRoleData.map(role => role.roles?.name || '').filter(Boolean);
      setUserRoles(roles);
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
  const validSystemRoles: { id: string; name: UserRole; description: string }[] = systemRoles
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
    isLoading: loadingSystemRoles || loadingUserRoles
  };
};
