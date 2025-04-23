
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useMedicalInfo(playerId: string) {
  return useQuery({
    queryKey: ['medical-info', playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_info')
        .select('*')
        .eq('player_id', playerId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!playerId
  });
}
