
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TeamCategory } from '@/types/player-management';

export function useTeamCategories() {
  return useQuery({
    queryKey: ['team-categories'],
    queryFn: async () => {
      try {
        // For now, get unique categories from the teams table
        const { data, error } = await supabase
          .from('teams')
          .select('category')
          .order('category');
        
        if (error) throw error;
        
        // Get unique categories and transform to TeamCategory format
        const uniqueCategories = Array.from(new Set((data || []).map(team => team.category)));
        return uniqueCategories.map(categoryName => ({
          id: categoryName, // Using the name as ID for now
          name: categoryName,
          seasonId: null,
          createdAt: new Date().toISOString()
        })) as TeamCategory[];
      } catch (error) {
        console.error('Error fetching team categories:', error);
        return [];
      }
    }
  });
}
