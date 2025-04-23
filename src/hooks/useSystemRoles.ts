
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
      return data as Role[];
    }
  });

  return { roles, isLoading, error };
};
