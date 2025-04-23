
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ItemAssignment } from '@/types/warehouse';
import { toast } from 'sonner';

export function useAssignments() {
  const queryClient = useQueryClient();

  // Query delle assegnazioni
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

  // Mutation per aggiungere un'assegnazione
  const addAssignment = useMutation({
    mutationFn: async (assignment: Omit<ItemAssignment, 'id' | 'assignDate' | 'returnDate'>) => {
      const { data, error } = await supabase
        .from('item_assignments')
        .insert({
          variant_id: assignment.variantId,
          player_id: assignment.playerId,
          expected_return_date: assignment.expectedReturnDate,
          quantity: assignment.quantity,
          notes: assignment.notes,
          status: assignment.status
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast.success('Assegnazione creata con successo');
    }
  });

  // Mutation per registrare una restituzione
  const markAssignmentReturned = useMutation({
    mutationFn: async ({ id, returnedCondition }: { id: string; returnedCondition: string }) => {
      const { data, error } = await supabase
        .from('item_assignments')
        .update({
          status: 'returned',
          return_date: new Date().toISOString(),
          returned_condition: returnedCondition
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse-items'] });
      toast.success('Restituzione registrata con successo');
    }
  });

  return {
    assignments,
    addAssignment,
    markAssignmentReturned
  };
}
