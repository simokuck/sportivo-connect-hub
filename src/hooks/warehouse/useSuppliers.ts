
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Supplier } from '@/types/warehouse';

export function useSuppliers() {
  const { data: suppliers = [] } = useQuery({
    queryKey: ['warehouse-suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warehouse_suppliers')
        .select('*')
        .order('name');
      
      if (error) throw error;

      return (data || []).map(supplier => ({
        id: supplier.id,
        name: supplier.name,
        contactName: supplier.contact_name,
        contactEmail: supplier.contact_email,
        contactPhone: supplier.contact_phone,
        address: supplier.address,
        notes: supplier.notes,
        createdAt: new Date(supplier.created_at),
        updatedAt: new Date(supplier.updated_at)
      })) as Supplier[];
    }
  });

  return { suppliers };
}
