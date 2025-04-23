
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import CreateTeamDialog from './CreateTeamDialog';
import CreateCategoryDialog from './CreateCategoryDialog';
import CreateSeasonDialog from './CreateSeasonDialog';
import TeamGroupsList from './TeamGroupsList';

const TeamGroupsPage = () => {
  const navigate = useNavigate();
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [createSeasonOpen, setCreateSeasonOpen] = useState(false);

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

      <TeamGroupsList />

      <CreateTeamDialog open={createTeamOpen} onOpenChange={setCreateTeamOpen} />
      <CreateCategoryDialog open={createCategoryOpen} onOpenChange={setCreateCategoryOpen} />
      <CreateSeasonDialog open={createSeasonOpen} onOpenChange={setCreateSeasonOpen} />
    </div>
  );
};

export default TeamGroupsPage;
