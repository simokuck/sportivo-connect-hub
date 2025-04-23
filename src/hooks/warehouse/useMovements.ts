
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { InventoryMovement } from '@/types/warehouse';
import { toast } from 'sonner';

export function useMovements() {
  const queryClient = useQueryClient();

  // Query dei movimenti
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

  // Mutation per aggiungere un movimento
  const addMovement = useMutation({
    mutationFn: async (movement: Omit<InventoryMovement, 'id' | 'date'>) => {
      const { data, error } = await supabase
        .from('inventory_movements')
        .insert({
          base_item_id: movement.baseItemId,
          variant_id: movement.variantId,
          type: movement.type,
          quantity: movement.quantity,
          note: movement.note,
          player_id: movement.playerId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-movements'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast.success('Movimento registrato con successo');
    }
  });

  return {
    movements,
    addMovement
  };
}
