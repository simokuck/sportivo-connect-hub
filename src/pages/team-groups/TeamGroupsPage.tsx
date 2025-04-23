
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import CreateTeamDialog from './CreateTeamDialog';
import CreateCategoryDialog from './CreateCategoryDialog';
import CreateSeasonDialog from './CreateSeasonDialog';
import TeamGroupsList from './TeamGroupsList';
import { usePlayerManagement } from '@/context/PlayerManagementContext';
import { useForm } from 'react-hook-form';

const TeamGroupsPage = () => {
  const navigate = useNavigate();
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [createSeasonOpen, setCreateSeasonOpen] = useState(false);
  
  const { 
    teamGroups, 
    teamCategories, 
    seasons, 
    playerRegistrations,
    createTeamGroup,
    createTeamCategory,
    createSeason
  } = usePlayerManagement();

  const currentSeason = seasons.find(s => s.isActive) || seasons[0];

  // Forms
  const teamForm = useForm();
  const categoryForm = useForm();
  const seasonForm = useForm();

  // Handler functions
  const onSubmitTeam = (data: any) => {
    createTeamGroup(data);
    setCreateTeamOpen(false);
    teamForm.reset();
  };

  const onSubmitCategory = (data: any) => {
    createTeamCategory(data);
    setCreateCategoryOpen(false);
    categoryForm.reset();
  };

  const onSubmitSeason = (data: any) => {
    createSeason(data);
    setCreateSeasonOpen(false);
    seasonForm.reset();
  };

  const getCategoriesBySeason = (seasonId: string) => {
    return teamCategories.filter(c => c.seasonId === seasonId);
  };

  // Group teams by category
  const teamsByCategory = teamCategories.reduce((acc, category) => {
    acc[category.id] = teamGroups.filter(team => team.categoryId === category.id);
    return acc;
  }, {} as Record<string, typeof teamGroups>);

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/user-management')} 
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Indietro
        </Button>
        <h1 className="text-3xl font-bold">Gruppi Squadra</h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={() => setCreateTeamOpen(true)}>Crea Squadra</Button>
        <Button variant="outline" onClick={() => setCreateCategoryOpen(true)}>Gestisci Categorie</Button>
        <Button variant="outline" onClick={() => setCreateSeasonOpen(true)}>Gestisci Stagioni</Button>
      </div>

      <TeamGroupsList 
        teamsByCategory={teamsByCategory}
        categories={teamCategories}
        playerRegistrations={playerRegistrations}
        currentSeason={currentSeason}
        seasons={seasons}
        onViewPlayers={() => {}}
        onEditTeam={() => {}}
        onArchiveTeam={() => {}}
        onDeleteTeam={() => {}}
      />

      <CreateTeamDialog 
        open={createTeamOpen} 
        onOpenChange={setCreateTeamOpen} 
        teamForm={teamForm}
        onSubmitTeam={onSubmitTeam}
        getCategoriesBySeason={getCategoriesBySeason}
        currentSeason={currentSeason}
        seasons={seasons}
      />
      
      <CreateCategoryDialog 
        open={createCategoryOpen} 
        onOpenChange={setCreateCategoryOpen} 
        categoryForm={categoryForm}
        onSubmitCategory={onSubmitCategory}
        currentSeason={currentSeason}
        seasons={seasons}
      />
      
      <CreateSeasonDialog 
        open={createSeasonOpen} 
        onOpenChange={setCreateSeasonOpen} 
        seasonForm={seasonForm}
        onSubmitSeason={onSubmitSeason}
      />
    </div>
  );
};

export default TeamGroupsPage;
