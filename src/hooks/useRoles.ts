
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Role, Permission, UserRole } from '@/types/roles';
import { toast } from 'sonner';

export function useRoles() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: roles = [] } = useQuery({
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

  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Permission[];
    }
  });

  const createRole = useMutation({
    mutationFn: async (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('roles')
        .insert(role)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Ruolo creato con successo');
    },
    onError: (error) => {
      toast.error(`Errore durante la creazione del ruolo: ${error.message}`);
    }
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, ...role }: Partial<Role> & { id: string }) => {
      const { data, error } = await supabase
        .from('roles')
        .update(role)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Ruolo aggiornato con successo');
    },
    onError: (error) => {
      toast.error(`Errore durante l'aggiornamento del ruolo: ${error.message}`);
    }
  });

  const deleteRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Ruolo eliminato con successo');
    },
    onError: (error) => {
      toast.error(`Errore durante l'eliminazione del ruolo: ${error.message}`);
    }
  });

  const assignRoleToUser = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
      toast.success('Ruolo assegnato con successo');
    },
    onError: (error) => {
      toast.error(`Errore durante l'assegnazione del ruolo: ${error.message}`);
    }
  });

  const removeRoleFromUser = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .match({ user_id: userId, role_id: roleId });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
      toast.success('Ruolo rimosso con successo');
    },
    onError: (error) => {
      toast.error(`Errore durante la rimozione del ruolo: ${error.message}`);
    }
  });

  return {
    roles,
    permissions,
    loading,
    createRole,
    updateRole,
    deleteRole,
    assignRoleToUser,
    removeRoleFromUser
  };
}
