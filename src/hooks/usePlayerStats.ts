
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePlayerStats(playerId: string) {
  return useQuery({
    queryKey: ['player-stats', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .eq('player_id', playerId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!playerId
  });
}
