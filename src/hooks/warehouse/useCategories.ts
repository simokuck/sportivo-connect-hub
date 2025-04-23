
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/warehouse';

export function useCategories() {
  const { data: categories = [] } = useQuery({
    queryKey: ['warehouse-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('warehouse_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;

      return (data || []).map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        createdAt: new Date(category.created_at),
        updatedAt: new Date(category.updated_at)
      })) as Category[];
    }
  });

  return { categories };
}
