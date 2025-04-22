
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePlayerManagement } from '@/context/PlayerManagementContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  Users, 
  Search, 
  Archive, 
  UserPlus, 
  User, 
  Calendar, 
  UserRound,
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamGroup, Season, TeamCategory, PlayerRegistration } from '@/types/player-management';

// Schema per la validazione del form di creazione squadra
const teamGroupSchema = z.object({
  name: z.string().min(1, "Il nome è richiesto"),
  categoryId: z.string().min(1, "La categoria è richiesta"),
  seasonId: z.string().min(1, "La stagione è richiesta"),
});

type TeamGroupFormValues = z.infer<typeof teamGroupSchema>;

// Schema per la validazione del form di creazione categoria
const categorySchema = z.object({
  name: z.string().min(1, "Il nome è richiesto"),
  ageMin: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  ageMax: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  seasonId: z.string().min(1, "La stagione è richiesta"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// Schema per la validazione del form di creazione stagione
const seasonSchema = z.object({
  name: z.string().min(1, "Il nome è richiesto"),
  startDate: z.string().min(1, "La data di inizio è richiesta"),
  endDate: z.string().min(1, "La data di fine è richiesta"),
  isActive: z.boolean().default(false),
});

type SeasonFormValues = z.infer<typeof seasonSchema>;

const TeamGroupsPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    seasons, 
    categories, 
    teamGroups, 
    playerRegistrations,
    currentSeason,
    createTeamGroup,
    createTeamCategory,
    createSeason,
    archiveTeamGroup,
    getTeamPlayers,
    getCategoriesBySeason
  } = usePlayerManagement();
  
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSeasonDialogOpen, setIsSeasonDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamGroup | null>(null);
  const [isPlayersDialogOpen, setIsPlayersDialogOpen] = useState(false);
  
  // Form per la creazione di una squadra
  const teamForm = useForm<TeamGroupFormValues>({
    resolver: zodResolver(teamGroupSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      seasonId: currentSeason?.id || '',
    }
  });
  
  // Form per la creazione di una categoria
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      seasonId: currentSeason?.id || '',
    }
  });
  
  // Form per la creazione di una stagione
  const seasonForm = useForm<SeasonFormValues>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      isActive: false,
    }
  });
  
  // Filtra i gruppi squadra in base alla ricerca e stagione corrente
  const filteredTeams = teamGroups.filter(team => {
    // Filtra per stagione corrente
    if (currentSeason && team.seasonId !== currentSeason.id) return false;
    
    // Filtra per ricerca
    return team.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Raggruppa i team per categoria
  const teamsByCategory = filteredTeams.reduce((acc: Record<string, TeamGroup[]>, team) => {
    if (!acc[team.categoryId]) {
      acc[team.categoryId] = [];
    }
    acc[team.categoryId].push(team);
    return acc;
  }, {});
  
  // Verifica se l'utente ha i permessi di amministrazione
  const hasAdminAccess = user?.role === 'admin' || user?.role === 'coach';
  
  if (!hasAdminAccess) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Accesso negato</CardTitle>
            <CardDescription>
              Non hai i permessi necessari per visualizzare questa pagina.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const onSubmitTeam = teamForm.handleSubmit(async (data) => {
    try {
      await createTeamGroup(data);
      setIsTeamDialogOpen(false);
      teamForm.reset();
    } catch (error) {
      console.error('Errore durante la creazione della squadra:', error);
    }
  });
  
  const onSubmitCategory = categoryForm.handleSubmit(async (data) => {
    try {
      await createTeamCategory(data);
      setIsCategoryDialogOpen(false);
      categoryForm.reset();
    } catch (error) {
      console.error('Errore durante la creazione della categoria:', error);
    }
  });
  
  const onSubmitSeason = seasonForm.handleSubmit(async (data) => {
    try {
      await createSeason(data);
      setIsSeasonDialogOpen(false);
      seasonForm.reset();
    } catch (error) {
      console.error('Errore durante la creazione della stagione:', error);
    }
  });
  
  const handleArchiveTeam = async (teamId: string) => {
    try {
      await archiveTeamGroup(teamId);
    } catch (error) {
      console.error('Errore durante l\'archiviazione della squadra:', error);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Ottiene il nome della categoria da un ID
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Categoria sconosciuta';
  };
  
  // Ottiene i giocatori di una squadra
  const getPlayersList = (teamId: string): PlayerRegistration[] => {
    return getTeamPlayers(teamId);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-sportivo-blue">Gestione Squadre</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsSeasonDialogOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" /> Nuova Stagione
          </Button>
          
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
            <Users className="mr-2 h-4 w-4" /> Nuova Categoria
          </Button>
          
          <Button onClick={() => setIsTeamDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Nuova Squadra
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestione dei Gruppi Squadra</CardTitle>
          <CardDescription>
            Stagione {currentSeason?.name || 'Nessuna stagione attiva'}
          </CardDescription>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca squadra..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 self-end sm:self-auto">
              <Select 
                value={currentSeason?.id} 
                onValueChange={(value) => {
                  const selectedSeason = seasons.find(s => s.id === value);
                  if (selectedSeason) {
                    usePlayerManagement().setCurrentSeason(selectedSeason);
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleziona stagione" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map(season => (
                    <SelectItem key={season.id} value={season.id}>
                      {season.name} {season.isActive && '(Attiva)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {currentSeason ? (
            Object.entries(teamsByCategory).length > 0 ? (
              Object.entries(teamsByCategory).map(([categoryId, teams]) => (
                <div key={categoryId} className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">
                    {getCategoryName(categoryId)}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.filter(team => !team.isArchived).map(team => (
                      <Card key={team.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{team.name}</CardTitle>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setSelectedTeam(team);
                                  setIsPlayersDialogOpen(true);
                                }}
                              >
                                <Users className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleArchiveTeam(team.id)}
                              >
                                <Archive className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription>
                            {team.playersIds.length} giocatori
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-1">
                            {team.playersIds.slice(0, 5).map(playerId => {
                              const registration = playerRegistrations.find(reg => reg.playerId === playerId);
                              return registration ? (
                                <Avatar key={playerId} className="h-8 w-8">
                                  <AvatarFallback>
                                    {getInitials(`${registration.firstName} ${registration.lastName}`)}
                                  </AvatarFallback>
                                </Avatar>
                              ) : null;
                            })}
                            {team.playersIds.length > 5 && (
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm">
                                +{team.playersIds.length - 5}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Nessun gruppo squadra trovato per questa stagione.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => setIsTeamDialogOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Crea la prima squadra
                </Button>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nessuna stagione attiva. Crea una nuova stagione per iniziare.
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => setIsSeasonDialogOpen(true)}
              >
                <Calendar className="mr-2 h-4 w-4" /> Crea una stagione
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog per creare una nuova squadra */}
      <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nuova Squadra</DialogTitle>
            <DialogDescription>
              Crea un nuovo gruppo squadra per la stagione attuale
            </DialogDescription>
          </DialogHeader>
          
          <Form {...teamForm}>
            <form onSubmit={onSubmitTeam} className="space-y-4">
              <FormField
                control={teamForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Squadra</FormLabel>
                    <FormControl>
                      <Input placeholder="Es. Allievi A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={teamForm.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona una categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currentSeason &&
                          getCategoriesBySeason(currentSeason.id).map(category => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={teamForm.control}
                name="seasonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stagione</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={currentSeason?.id}
                      disabled={!!currentSeason}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona una stagione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {seasons.map(season => (
                          <SelectItem key={season.id} value={season.id}>
                            {season.name} {season.isActive && '(Attiva)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Crea Squadra</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog per creare una nuova categoria */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nuova Categoria</DialogTitle>
            <DialogDescription>
              Crea una nuova categoria per la stagione attuale
            </DialogDescription>
          </DialogHeader>
          
          <Form {...categoryForm}>
            <form onSubmit={onSubmitCategory} className="space-y-4">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Es. Allievi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={categoryForm.control}
                  name="ageMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Età Minima</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Es. 15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={categoryForm.control}
                  name="ageMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Età Massima</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Es. 16" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={categoryForm.control}
                name="seasonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stagione</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={currentSeason?.id}
                      disabled={!!currentSeason}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona una stagione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {seasons.map(season => (
                          <SelectItem key={season.id} value={season.id}>
                            {season.name} {season.isActive && '(Attiva)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Crea Categoria</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog per creare una nuova stagione */}
      <Dialog open={isSeasonDialogOpen} onOpenChange={setIsSeasonDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nuova Stagione</DialogTitle>
            <DialogDescription>
              Crea una nuova stagione sportiva
            </DialogDescription>
          </DialogHeader>
          
          <Form {...seasonForm}>
            <form onSubmit={onSubmitSeason} className="space-y-4">
              <FormField
                control={seasonForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Stagione</FormLabel>
                    <FormControl>
                      <Input placeholder="Es. 2024/2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={seasonForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Inizio</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={seasonForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Fine</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={seasonForm.control}
                name="isActive"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Imposta come stagione attiva
                    </label>
                  </div>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Crea Stagione</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog per visualizzare i giocatori di una squadra */}
      <Dialog open={isPlayersDialogOpen} onOpenChange={setIsPlayersDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedTeam && (
            <>
              <DialogHeader>
                <DialogTitle>Giocatori - {selectedTeam.name}</DialogTitle>
                <DialogDescription>
                  {getCategoryName(selectedTeam.categoryId)} - {currentSeason?.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {selectedTeam.playersIds.length > 0 ? (
                  <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                    {getPlayersList(selectedTeam.id).map(registration => (
                      <div key={registration.id} className="flex items-center justify-between p-3 bg-background rounded-md border">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {getInitials(`${registration.firstName} ${registration.lastName}`)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="font-medium">
                              {registration.firstName} {registration.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {registration.contactEmail}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    Nessun giocatore assegnato a questa squadra.
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsPlayersDialogOpen(false)}>Chiudi</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamGroupsPage;
