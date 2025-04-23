
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TeamGroup } from '@/types/player-management';

export function useTeamGroups() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Transform the data to match the TeamGroup type
      return (data || []).map(team => ({
        id: team.id,
        name: team.name,
        categoryId: team.category,  // Using category as categoryId for now
        seasonId: '1', // Default to first season until we have proper season linking
        isArchived: false,
        playersIds: [],
        coachesIds: [],
        createdAt: team.created_at,
        category: {
          id: team.category,
          name: team.category,
          seasonId: null
        }
      })) as TeamGroup[];
    }
  });
}
