
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Role } from '@/types/roles';

export const useSystemRoles = () => {
  const { data: roles = [], isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Map the database response to match our Role interface
      const mappedRoles: Role[] = data.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
        isSystemRole: role.is_system_role || false,
        createdAt: role.created_at || '',
        updatedAt: role.updated_at || ''
      }));
      
      return mappedRoles;
    }
  });

  return { roles, isLoading, error };
};
