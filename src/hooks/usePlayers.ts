
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/types';

export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          player_stats(*),
          medical_info(*)
        `)
        .order('last_name');
      
      if (error) throw error;
      
      return (data || []).map(player => ({
        id: player.id,
        firstName: player.first_name,
        lastName: player.last_name,
        name: `${player.first_name} ${player.last_name}`,
        email: player.email || '',
        position: player.position,
        strongFoot: player.strong_foot,
        avatar: player.avatar_url,
        stats: player.player_stats?.[0] ? {
          games: player.player_stats[0].games || 0,
          minutesPlayed: player.player_stats[0].minutes_played || 0,
          goals: player.player_stats[0].goals || 0,
          assists: player.player_stats[0].assists || 0,
          yellowCards: player.player_stats[0].yellow_cards || 0,
          redCards: player.player_stats[0].red_cards || 0,
          absences: player.player_stats[0].absences || 0
        } : null,
        medicalInfo: player.medical_info?.[0] || null,
        createdAt: new Date(player.created_at),
        updatedAt: new Date(player.updated_at)
      })) as Player[];
    }
  });
}
