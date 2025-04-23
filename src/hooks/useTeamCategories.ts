
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TeamCategory } from '@/types/player-management';

export function useTeamCategories() {
  return useQuery({
    queryKey: ['team-categories'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .eq('category', 'Juniores')
          .order('name');
        
        if (error) throw error;
        
        // For now, return the teams as categories until we have a separate table
        return (data || []).map(team => ({
          id: team.id,
          name: team.category,
          seasonId: null,
          createdAt: team.created_at
        })) as TeamCategory[];
      } catch (error) {
        console.error('Error fetching team categories:', error);
        return [];
      }
    }
  });
}
