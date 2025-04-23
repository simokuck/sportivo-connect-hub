
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  CalendarDays,
  UserPlus,
  Users,
  Archive
} from 'lucide-react';
import { usePlayerManagement } from '@/context/PlayerManagementContext';
import TeamGroupsList from './TeamGroupsList';
import CreateSeasonDialog from './CreateSeasonDialog';
import CreateCategoryDialog from './CreateCategoryDialog';
import CreateTeamDialog from './CreateTeamDialog';
import ViewPlayersDialog from './ViewPlayersDialog';
import { TeamGroup, TeamCategory, Season, PlayerRegistration } from '@/types/player-management';
import { v4 as uuidv4 } from 'uuid';

const seasonSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  startDate: z.string().min(1, "La data di inizio è obbligatoria"),
  endDate: z.string().min(1, "La data di fine è obbligatoria"),
  isActive: z.boolean().default(false),
});

const categorySchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  ageMin: z.coerce.number().int().min(1, "L'età minima è obbligatoria"),
  ageMax: z.coerce.number().int().min(1, "L'età massima è obbligatoria"),
  seasonId: z.string().min(1, "La stagione è obbligatoria"),
});

const teamSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  categoryId: z.string().min(1, "La categoria è obbligatoria"),
  seasonId: z.string().min(1, "La stagione è obbligatoria"),
});

const TeamGroupsPage: React.FC = () => {
  const { toast } = useToast();
  const { 
    seasons, 
    categories,  // Using categories instead of teamCategories
    teamGroups,
    playerRegistrations,
    createSeason, // Using context functions instead of direct state setters
    createTeamCategory,
    createTeamGroup,
    archiveTeamGroup,
    getCategoriesBySeason
  } = usePlayerManagement();

  const [seasonDialogOpen, setSeasonDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [playersDialogOpen, setPlayersDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamGroup | null>(null);

  const seasonForm = useForm({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      isActive: false,
    },
  });

  const categoryForm = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      ageMin: 5,
      ageMax: 19,
      seasonId: "",
    },
  });

  const teamForm = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      seasonId: "",
    },
  });

  // Helper functions
  const getCurrentSeason = (): Season | null => {
    return seasons.find(s => s.isActive) || null;
  };

  const getCategoryName = (id: string): string => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : "Categoria sconosciuta";
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getPlayersList = (teamId: string): PlayerRegistration[] => {
    const team = teamGroups.find(t => t.id === teamId);
    if (!team) return [];
    return playerRegistrations.filter(registration => 
      team.playersIds.includes(registration.playerId)
    );
  };

  // Organize teams by category
  const getTeamsByCategory = (): Record<string, TeamGroup[]> => {
    const currentSeason = getCurrentSeason();
    if (!currentSeason) return {};
    
    const filteredTeams = teamGroups.filter(team => 
      team.seasonId === currentSeason.id && !team.isArchived
    );
    
    return filteredTeams.reduce((acc, team) => {
      if (!acc[team.categoryId]) {
        acc[team.categoryId] = [];
      }
      acc[team.categoryId].push(team);
      return acc;
    }, {} as Record<string, TeamGroup[]>);
  };

  // Form submission handlers
  const handleSubmitSeason = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    seasonForm.handleSubmit(async (data) => {
      try {
        // Create new season using context function instead of direct state manipulation
        await createSeason({
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          isActive: data.isActive
        });
        
        toast({
          title: "Stagione Creata",
          description: `La stagione ${data.name} è stata creata con successo.`,
        });
        
        seasonForm.reset();
        setSeasonDialogOpen(false);
      } catch (error) {
        console.error("Error creating season:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante la creazione della stagione.",
          variant: "destructive"
        });
      }
    })();
  };

  const handleSubmitCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    categoryForm.handleSubmit(async (data) => {
      try {
        // Create new category using context function
        await createTeamCategory({
          name: data.name,
          ageMin: data.ageMin,
          ageMax: data.ageMax,
          seasonId: data.seasonId
        });
        
        toast({
          title: "Categoria Creata",
          description: `La categoria ${data.name} è stata creata con successo.`,
        });
        
        categoryForm.reset();
        setCategoryDialogOpen(false);
      } catch (error) {
        console.error("Error creating category:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante la creazione della categoria.",
          variant: "destructive"
        });
      }
    })();
  };

  const handleSubmitTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    teamForm.handleSubmit(async (data) => {
      try {
        // Create new team group using context function
        await createTeamGroup({
          name: data.name,
          categoryId: data.categoryId,
          seasonId: data.seasonId
        });
        
        toast({
          title: "Squadra Creata",
          description: `La squadra ${data.name} è stata creata con successo.`,
        });
        
        teamForm.reset();
        setTeamDialogOpen(false);
      } catch (error) {
        console.error("Error creating team:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante la creazione della squadra.",
          variant: "destructive"
        });
      }
    })();
  };

  const handleArchiveTeam = async (id: string) => {
    try {
      // Archive team using context function
      await archiveTeamGroup(id);
      
      toast({
        title: "Squadra Archiviata",
        description: "La squadra è stata archiviata con successo.",
      });
    } catch (error) {
      console.error("Error archiving team:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'archiviazione della squadra.",
        variant: "destructive"
      });
    }
  };

  const handleShowPlayers = (team: TeamGroup) => {
    setSelectedTeam(team);
    setPlayersDialogOpen(true);
  };

  // Set form defaults when dialogs open
  React.useEffect(() => {
    if (getCurrentSeason()) {
      categoryForm.setValue("seasonId", getCurrentSeason()!.id);
      teamForm.setValue("seasonId", getCurrentSeason()!.id);
    }
  }, [categoryDialogOpen, teamDialogOpen]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gruppi Squadra</h1>
          <p className="text-muted-foreground">
            Gestisci le squadre, le categorie e le stagioni sportive.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setSeasonDialogOpen(true)}>
            <CalendarDays className="mr-2 h-4 w-4" />
            Nuova Stagione
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setCategoryDialogOpen(true)}
            disabled={!getCurrentSeason()}
          >
            <Users className="mr-2 h-4 w-4" />
            Nuova Categoria
          </Button>
          <Button 
            onClick={() => setTeamDialogOpen(true)}
            disabled={!getCurrentSeason() || getCategoriesBySeason(getCurrentSeason()?.id || "").length === 0}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Nuova Squadra
          </Button>
        </div>
      </div>

      <TeamGroupsList 
        teamsByCategory={getTeamsByCategory()}
        categories={categories}
        playerRegistrations={playerRegistrations}
        currentSeason={getCurrentSeason()}
        onShowPlayers={handleShowPlayers}
        onArchive={handleArchiveTeam}
        onCreateTeam={() => setTeamDialogOpen(true)}
        getCategoryName={getCategoryName}
        getInitials={getInitials}
        getCategoriesBySeason={getCategoriesBySeason}
      />
      
      <CreateSeasonDialog
        open={seasonDialogOpen}
        onOpenChange={setSeasonDialogOpen}
        seasonForm={seasonForm}
        onSubmitSeason={handleSubmitSeason}
      />
      
      <CreateCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        categoryForm={categoryForm}
        onSubmitCategory={handleSubmitCategory}
        currentSeason={getCurrentSeason()}
        seasons={seasons}
      />
      
      <CreateTeamDialog
        open={teamDialogOpen}
        onOpenChange={setTeamDialogOpen}
        teamForm={teamForm}
        onSubmitTeam={handleSubmitTeam}
        getCategoriesBySeason={getCategoriesBySeason}
        currentSeason={getCurrentSeason()}
        seasons={seasons}
      />
      
      <ViewPlayersDialog
        open={playersDialogOpen}
        onOpenChange={setPlayersDialogOpen}
        selectedTeam={selectedTeam}
        getPlayersList={getPlayersList}
        getCategoryName={getCategoryName}
        getInitials={getInitials}
        currentSeason={getCurrentSeason()}
      />
    </div>
  );
};

export default TeamGroupsPage;
