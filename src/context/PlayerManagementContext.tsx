
import React, { createContext, useContext, useState } from 'react';
import { useTeamGroups } from '@/hooks/useTeamGroups';
import { usePlayers } from '@/hooks/usePlayers';
import { useTeamCategories } from '@/hooks/useTeamCategories';
import { useSeasons } from '@/hooks/useSeasons';
import { Player } from '@/types';
import { PlayerRegistration, PlayerConsent, PlayerTeamHistory, TeamCategory, TeamGroup, Season } from '@/types/player-management';
import { usePlayerRegistrations } from '@/hooks/usePlayerRegistrations';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PlayerManagementContextType {
  players: Player[];
  teamGroups: TeamGroup[];
  categories: TeamCategory[];
  seasons: Season[];
  playerRegistrations: PlayerRegistration[];
  playerConsents: PlayerConsent[];
  playerHistory: PlayerTeamHistory[];
  createTeamGroup: (team: { name: string, category: string }) => void;
  createTeamCategory: (category: Omit<TeamCategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createSeason: (season: Omit<Season, 'id' | 'createdAt' | 'updatedAt'>) => void;
  getPlayerHistory: (playerId: string) => PlayerTeamHistory[];
}

const PlayerManagementContext = createContext<PlayerManagementContextType | undefined>(undefined);

export function PlayerManagementProvider({ children }: { children: React.ReactNode }) {
  const { data: teamGroups = [] } = useTeamGroups();
  const { data: players = [] } = usePlayers();
  const { data: categories = [] } = useTeamCategories();
  const { data: seasons = [] } = useSeasons();
  const { data: playerRegistrations = [] } = usePlayerRegistrations();
  const [playerConsents, setPlayerConsents] = useState<PlayerConsent[]>([]);
  const [playerHistory, setPlayerHistory] = useState<PlayerTeamHistory[]>([]);
  const queryClient = useQueryClient();

  const createTeamGroupMutation = useMutation({
    mutationFn: async (team: { name: string, category: string }) => {
      const { data, error } = await supabase
        .from('teams')
        .insert(team)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      toast.success('Team created successfully');
    },
  });

  const createTeamCategoryMutation = useMutation({
    mutationFn: async (category: { name: string }) => {
      console.log('Creating category (mock):', category);
      return { 
        id: `cat-${Date.now()}`,
        name: category.name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-categories'] });
      toast.success('Category created successfully');
    },
  });

  const createSeasonMutation = useMutation({
    mutationFn: async (season: { name: string, startDate: string, endDate: string, isActive: boolean }) => {
      console.log('Creating season (mock):', season);
      return { 
        id: `season-${Date.now()}`,
        name: season.name,
        startDate: season.startDate,
        endDate: season.endDate,
        isActive: season.isActive,
        created_at: new Date().toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      toast.success('Season created successfully');
    },
  });

  const createTeamGroup = (team: { name: string, category: string }) => {
    createTeamGroupMutation.mutate(team);
  };

  const createTeamCategory = (category: { name: string }) => {
    createTeamCategoryMutation.mutate(category);
  };

  const createSeason = (season: { name: string, startDate: string, endDate: string, isActive: boolean }) => {
    createSeasonMutation.mutate(season);
  };

  const getPlayerHistory = (playerId: string) => {
    return playerHistory.filter(history => history.playerId === playerId);
  };

  return (
    <PlayerManagementContext.Provider
      value={{
        players,
        teamGroups,
        categories,
        seasons,
        playerRegistrations,
        playerConsents,
        playerHistory,
        createTeamGroup,
        createTeamCategory,
        createSeason,
        getPlayerHistory
      }}
    >
      {children}
    </PlayerManagementContext.Provider>
  );
}

export function usePlayerManagement() {
  const context = useContext(PlayerManagementContext);
  if (context === undefined) {
    throw new Error('usePlayerManagement must be used within a PlayerManagementProvider');
  }
  return context;
}
