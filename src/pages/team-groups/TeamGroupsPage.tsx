
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
    categories, // This was the error - using categories instead of teamCategories
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
    return categories.filter(c => c.seasonId === seasonId);
  };

  // Group teams by category
  const teamsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = teamGroups.filter(team => team.categoryId === category.id);
    return acc;
  }, {} as Record<string, typeof teamGroups>);

  // Helper functions for TeamGroupsList
  const getCategoryName = (id: string): string => {
    const category = categories.find(c => c.id === id);
    return category?.name || "Categoria sconosciuta";
  };
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleShowPlayers = (team: any) => {
    console.log('View players for team:', team);
    // Implement view players logic
  };
  
  const handleArchive = (teamId: string) => {
    console.log('Archive team:', teamId);
    // Implement archive team logic
  };

  const handleCreateTeam = () => {
    setCreateTeamOpen(true);
  };

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
        categories={categories}
        playerRegistrations={playerRegistrations}
        currentSeason={currentSeason}
        onShowPlayers={handleShowPlayers}
        onArchive={handleArchive}
        onCreateTeam={handleCreateTeam}
        getCategoryName={getCategoryName}
        getInitials={getInitials}
        getCategoriesBySeason={getCategoriesBySeason}
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
