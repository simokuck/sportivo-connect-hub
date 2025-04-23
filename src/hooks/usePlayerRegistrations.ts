
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PlayerRegistration } from '@/types/player-management';

export function usePlayerRegistrations() {
  return useQuery({
    queryKey: ['player-registrations'],
    queryFn: async () => {
      try {
        const { data: players, error } = await supabase
          .from('players')
          .select('*');
        
        if (error) throw error;
        
        // Transform players to registrations format
        return (players || []).map(player => ({
          id: player.id,
          playerId: player.id,
          firstName: player.first_name,
          lastName: player.last_name,
          birthDate: null,
          isMinor: false,
          contactEmail: player.email || '',
          status: 'active' as PlayerRegistrationStatus,
          seasonId: '1', // From mock season
          teamGroupsIds: [],
          consentsIds: []
        })) as PlayerRegistration[];
      } catch (error) {
        console.error('Error fetching player registrations:', error);
        return [];
      }
    }
  });
}
