
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BaseItem, ItemVariant, InventoryMovement, ItemAssignment } from '@/types/warehouse';
import { toast } from 'sonner';

export function useWarehouseData() {
  const queryClient = useQueryClient();

  // Query per ottenere gli articoli base con le loro varianti
  const { data: items = [] } = useQuery({
    queryKey: ['warehouse-items'],
    queryFn: async () => {
      // Fetch base items
      const { data: baseItems, error: baseItemsError } = await supabase
        .from('warehouse_items')
        .select('*')
        .order('name');
      
      if (baseItemsError) throw baseItemsError;

      // Fetch variants for all items
      const { data: variants, error: variantsError } = await supabase
        .from('item_variants')
        .select('*');
      
      if (variantsError) throw variantsError;

      // Map database columns to our interface and combine items with their variants
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

  // Query per ottenere i movimenti
  const { data: movements = [] } = useQuery({
    queryKey: ['inventory-movements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_movements')
        .select(`
          *,
          players (
            first_name,
            last_name
          )
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;

      return (data || []).map(mov => ({
        id: mov.id,
        baseItemId: mov.base_item_id,
        variantId: mov.variant_id,
        type: mov.type,
        quantity: mov.quantity,
        date: mov.date,
        note: mov.note || '',
        playerId: mov.player_id,
        playerName: mov.players ? `${mov.players.first_name} ${mov.players.last_name}` : undefined
      })) as InventoryMovement[];
    }
  });

  // Query per ottenere le assegnazioni
  const { data: assignments = [] } = useQuery({
    queryKey: ['item-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('item_assignments')
        .select(`
          *,
          players (
            first_name,
            last_name
          )
        `);
      
      if (error) throw error;

      return (data || []).map(assignment => ({
        id: assignment.id,
        variantId: assignment.variant_id,
        playerId: assignment.player_id,
        playerName: `${assignment.players.first_name} ${assignment.players.last_name}`,
        assignDate: assignment.assign_date,
        expectedReturnDate: assignment.expected_return_date,
        returnDate: assignment.return_date,
        quantity: assignment.quantity,
        notes: assignment.notes || '',
        status: assignment.status,
        returnedCondition: assignment.returned_condition
      })) as ItemAssignment[];
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
    },
    onError: (error) => {
      toast.error(`Errore durante la creazione dell'articolo: ${error.message}`);
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
    },
    onError: (error) => {
      toast.error(`Errore durante l'aggiornamento dell'articolo: ${error.message}`);
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
    },
    onError: (error) => {
      toast.error(`Errore durante l'eliminazione dell'articolo: ${error.message}`);
    }
  });

  return {
    items,
    movements,
    assignments,
    createBaseItem,
    updateBaseItem,
    deleteBaseItem,
    // ... altre mutation per varianti e movimenti verranno aggiunte qui
  };
}
