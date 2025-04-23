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
      
      // Map database columns to our interface properties
      return (data || []).map(role => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
        isSystemRole: role.is_system_role || false,
        createdAt: role.created_at,
        updatedAt: role.updated_at
      })) as Role[];
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
      
      // Map database columns to our interface properties
      return (data || []).map(permission => ({
        id: permission.id,
        name: permission.name,
        description: permission.description || '',
        code: permission.code,
        createdAt: permission.created_at
      })) as Permission[];
    }
  });

  const createRole = useMutation({
    mutationFn: async (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('Creating role:', role);
      
      // Convert our interface properties to database column names
      const dbRole = {
        name: role.name,
        description: role.description,
        is_system_role: role.isSystemRole
      };
      
      const { data, error } = await supabase
        .from('roles')
        .insert(dbRole)
        .select()
        .single();

      if (error) throw error;
      
      // Map back to our interface
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        isSystemRole: data.is_system_role || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Role;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Ruolo creato con successo');
    },
    onError: (error: Error) => {
      console.error('Error creating role:', error);
      toast.error(`Errore durante la creazione del ruolo: ${error.message}`);
    }
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, ...role }: Partial<Role> & { id: string }) => {
      console.log('Updating role:', id, role);
      
      // Convert our interface properties to database column names
      const dbRole = {
        name: role.name,
        description: role.description,
        is_system_role: role.isSystemRole
      };
      
      const { data, error } = await supabase
        .from('roles')
        .update(dbRole)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Map back to our interface
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        isSystemRole: data.is_system_role || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Role;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Ruolo aggiornato con successo');
    },
    onError: (error: Error) => {
      console.error('Error updating role:', error);
      toast.error(`Errore durante l'aggiornamento del ruolo: ${error.message}`);
    }
  });

  const deleteRole = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting role:', id);
      
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
    onError: (error: Error) => {
      console.error('Error deleting role:', error);
      toast.error(`Errore durante l'eliminazione del ruolo: ${error.message}`);
    }
  });

  const assignRoleToUser = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      console.log('Assigning role to user:', userId, roleId);
      
      // First check if the assignment already exists
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role_id', roleId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // If it already exists, return it
      if (existingRole) {
        return {
          id: existingRole.id,
          userId: existingRole.user_id,
          roleId: existingRole.role_id,
          assignedAt: existingRole.assigned_at,
          assignedBy: existingRole.assigned_by
        };
      }
      
      // Otherwise, create the new assignment
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: roleId
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        roleId: data.role_id,
        assignedAt: data.assigned_at,
        assignedBy: data.assigned_by
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
      toast.success('Ruolo assegnato con successo');
    },
    onError: (error: Error) => {
      console.error('Error assigning role:', error);
      toast.error(`Errore durante l'assegnazione del ruolo: ${error.message}`);
    }
  });

  const removeRoleFromUser = useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      console.log('Removing role from user:', userId, roleId);
      
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
    onError: (error: Error) => {
      console.error('Error removing role:', error);
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
