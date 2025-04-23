
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BaseItem, ItemVariant } from '@/types/warehouse';
import { toast } from 'sonner';

export function useItems() {
  const queryClient = useQueryClient();

  // Query degli articoli base con le loro varianti
  const { data: items = [] } = useQuery({
    queryKey: ['warehouse-items'],
    queryFn: async () => {
      // Fetch degli articoli base
      const { data: baseItems, error: baseItemsError } = await supabase
        .from('warehouse_items')
        .select('*')
        .order('name');
      
      if (baseItemsError) throw baseItemsError;

      // Fetch delle varianti per tutti gli articoli
      const { data: variants, error: variantsError } = await supabase
        .from('item_variants')
        .select('*');
      
      if (variantsError) throw variantsError;

      // Combina gli articoli con le loro varianti
      return (baseItems || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        category: item.category,
        brand: item.brand || '',
        sku: item.sku || '',
        image: item.image_url,
        notes: item.notes || [],
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        variants: variants
          .filter(v => v.base_item_id === item.id)
          .map(v => ({
            id: v.id,
            baseItemId: v.base_item_id,
            color: v.color || '',
            size: v.size || '',
            quantity: v.quantity,
            minimumThreshold: v.minimum_threshold || 0,
            location: v.location || '',
            status: v.status,
            uniqueSku: v.unique_sku,
            lastUpdated: v.updated_at,
            createdAt: new Date(v.created_at),
            updatedAt: new Date(v.updated_at)
          }))
      })) as (BaseItem & { variants: ItemVariant[] })[];
    }
  });

  // Mutation per creare un nuovo articolo base
  const createBaseItem = useMutation({
    mutationFn: async (item: Omit<BaseItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('warehouse_items')
        .insert({
          name: item.name,
          category: item.category,
          description: item.description,
          brand: item.brand,
          sku: item.sku,
          image_url: item.image,
          notes: item.notes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast.success('Articolo creato con successo');
    }
  });

  // Mutation per aggiornare un articolo base
  const updateBaseItem = useMutation({
    mutationFn: async ({ id, ...item }: BaseItem) => {
      const { data, error } = await supabase
        .from('warehouse_items')
        .update({
          name: item.name,
          category: item.category,
          description: item.description,
          brand: item.brand,
          sku: item.sku,
          image_url: item.image,
          notes: item.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast.success('Articolo aggiornato con successo');
    }
  });

  // Mutation per eliminare un articolo base
  const deleteBaseItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('warehouse_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast.success('Articolo eliminato con successo');
    }
  });

  // Mutation per creare una nuova variante
  const createVariant = useMutation({
    mutationFn: async (variant: Omit<ItemVariant, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('item_variants')
        .insert({
          base_item_id: variant.baseItemId,
          color: variant.color,
          size: variant.size,
          quantity: variant.quantity,
          minimum_threshold: variant.minimumThreshold,
          location: variant.location,
          status: variant.status,
          unique_sku: variant.uniqueSku
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast.success('Variante creata con successo');
    }
  });

  // Mutation per aggiornare una variante
  const updateVariant = useMutation({
    mutationFn: async ({ id, ...variant }: ItemVariant) => {
      const { data, error } = await supabase
        .from('item_variants')
        .update({
          color: variant.color,
          size: variant.size,
          quantity: variant.quantity,
          minimum_threshold: variant.minimumThreshold,
          location: variant.location,
          status: variant.status,
          unique_sku: variant.uniqueSku
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast.success('Variante aggiornata con successo');
    }
  });

  // Mutation per eliminare una variante
  const deleteVariant = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('item_variants')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast.success('Variante eliminata con successo');
    }
  });

  return {
    items,
    createBaseItem,
    updateBaseItem,
    deleteBaseItem,
    createVariant,
    updateVariant,
    deleteVariant,
    lowStockItems: items.filter(item => 
      item.variants.some(v => v.status === 'low' || v.status === 'out')
    )
  };
}
