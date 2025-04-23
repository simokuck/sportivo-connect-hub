import React, { createContext, useContext, useState } from 'react';
import { useTeamGroups } from '@/hooks/useTeamGroups';
import { usePlayers } from '@/hooks/usePlayers';
import { useTeamCategories } from '@/hooks/useTeamCategories';
import { useSeasons } from '@/hooks/useSeasons';
import { Player, TeamCategory, TeamGroup, Season, PlayerRegistration } from '@/types';
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
  createTeamGroup: (team: Omit<TeamGroup, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createTeamCategory: (category: Omit<TeamCategory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  createSeason: (season: Omit<Season, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const PlayerManagementContext = createContext<PlayerManagementContextType | undefined>(undefined);

export function PlayerManagementProvider({ children }: { children: React.ReactNode }) {
  const { data: teamGroups = [] } = useTeamGroups();
  const { data: players = [] } = usePlayers();
  const { data: categories = [] } = useTeamCategories();
  const { data: seasons = [] } = useSeasons();
  const { data: playerRegistrations = [] } = usePlayerRegistrations();
  const queryClient = useQueryClient();

  // Mutation to create a new team group
  const createTeamGroupMutation = useMutation({
    mutationFn: async (team: Omit<TeamGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
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

  // Mutation to create a new team category
  const createTeamCategoryMutation = useMutation({
    mutationFn: async (category: Omit<TeamCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('team_categories')
        .insert(category)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-categories'] });
      toast.success('Category created successfully');
    },
  });

  // Mutation to create a new season
  const createSeasonMutation = useMutation({
    mutationFn: async (season: Omit<Season, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('seasons')
        .insert(season)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      toast.success('Season created successfully');
    },
  });

  // Handler functions to trigger mutations
  const createTeamGroup = (team: Omit<TeamGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    createTeamGroupMutation.mutate(team);
  };

  const createTeamCategory = (category: Omit<TeamCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    createTeamCategoryMutation.mutate(category);
  };

  const createSeason = (season: Omit<Season, 'id' | 'createdAt' | 'updatedAt'>) => {
    createSeasonMutation.mutate(season);
  };
  
  return (
    <PlayerManagementContext.Provider
      value={{
        players,
        teamGroups,
        categories,
        seasons,
        playerRegistrations,
        createTeamGroup,
        createTeamCategory,
        createSeason,
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
