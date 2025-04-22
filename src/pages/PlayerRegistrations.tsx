
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePlayerManagement } from '@/context/PlayerManagementContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PlayerRegistration, Season, TeamCategory, TeamGroup } from '@/types/player-management';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Search, Filter, UserPlus, Check, X, Mail, Calendar, User, UserRound, UserCog } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import it from 'date-fns/locale/it';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Schema per la validazione del form
const playerRegistrationSchema = z.object({
  firstName: z.string().min(1, "Il nome è richiesto"),
  lastName: z.string().min(1, "Il cognome è richiesto"),
  birthDate: z.string().min(1, "La data di nascita è richiesta"),
  isMinor: z.boolean(),
  contactEmail: z.string().email("Inserisci un'email valida"),
  guardianName: z.string().optional(),
  guardianRelationship: z.string().optional(),
  seasonId: z.string().min(1, "La stagione è richiesta"),
  teamGroupsIds: z.array(z.string()).optional(),
});

type PlayerRegistrationFormValues = z.infer<typeof playerRegistrationSchema>;

const PlayerRegistrationsPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    playerRegistrations, 
    seasons, 
    categories,
    teamGroups,
    currentSeason,
    createPlayerRegistration,
    updatePlayerRegistration,
    sendInvitation,
    assignPlayerToTeam,
    removePlayerFromTeam,
    getPlayerTeams,
    getCategoriesBySeason,
    getTeamsByCategory
  } = usePlayerManagement();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<PlayerRegistration | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const form = useForm<PlayerRegistrationFormValues>({
    resolver: zodResolver(playerRegistrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
      isMinor: false,
      contactEmail: '',
      guardianName: '',
      guardianRelationship: '',
      seasonId: currentSeason?.id || '',
      teamGroupsIds: [],
    }
  });
  
  // Effetto per aggiornare il valore della stagione nel form quando cambia la stagione corrente
  useEffect(() => {
    if (currentSeason) {
      form.setValue('seasonId', currentSeason.id);
    }
  }, [currentSeason, form]);
  
  // Filtra le registrazioni in base ai filtri applicati
  const filteredRegistrations = playerRegistrations.filter(registration => {
    // Filtra per tab attivo
    if (activeTab === 'pending' && registration.status !== 'pending') return false;
    if (activeTab === 'active' && registration.status !== 'active') return false;
    if (activeTab === 'inactive' && registration.status !== 'inactive') return false;
    if (activeTab === 'to_reassign' && registration.status !== 'to_reassign') return false;
    
    // Filtra per ricerca
    const fullName = `${registration.firstName} ${registration.lastName}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    if (searchQuery && !fullName.includes(searchLower)) return false;
    
    // Filtra per status
    if (statusFilter !== 'all' && registration.status !== statusFilter) return false;
    
    return true;
  });
  
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
  
  const onSubmit: SubmitHandler<PlayerRegistrationFormValues> = async (data) => {
    try {
      await createPlayerRegistration(data);
      setIsAddDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Errore durante la creazione del giocatore:', error);
    }
  };
  
  const handleAssignPlayerToTeam = async (playerId: string, teamId: string) => {
    try {
      await assignPlayerToTeam(playerId, teamId);
    } catch (error) {
      console.error('Errore durante l\'assegnazione del giocatore:', error);
    }
  };
  
  const handleRemovePlayerFromTeam = async (playerId: string, teamId: string) => {
    try {
      await removePlayerFromTeam(playerId, teamId);
    } catch (error) {
      console.error('Errore durante la rimozione del giocatore:', error);
    }
  };
  
  const handleSendInvitation = async (registrationId: string) => {
    try {
      await sendInvitation(registrationId);
    } catch (error) {
      console.error('Errore durante l\'invio dell\'invito:', error);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Attivo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inattivo</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In attesa</Badge>;
      case 'to_reassign':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Da riassegnare</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-sportivo-blue">Gestione Giocatori</h1>
        
        {user?.role === 'admin' && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Nuovo Giocatore
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Giocatori Registrati</CardTitle>
          <CardDescription>
            Gestisci le registrazioni dei giocatori e le assegnazioni ai team
          </CardDescription>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca giocatore..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 self-end sm:self-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtra per stato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli stati</SelectItem>
                  <SelectItem value="active">Attivi</SelectItem>
                  <SelectItem value="pending">In attesa</SelectItem>
                  <SelectItem value="inactive">Inattivi</SelectItem>
                  <SelectItem value="to_reassign">Da riassegnare</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tutti</TabsTrigger>
              <TabsTrigger value="active">Attivi</TabsTrigger>
              <TabsTrigger value="pending">In attesa</TabsTrigger>
              <TabsTrigger value="to_reassign">Da riassegnare</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Data di nascita</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Squadre</TableHead>
                      <TableHead className="text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.length > 0 ? (
                      filteredRegistrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{getInitials(`${registration.firstName} ${registration.lastName}`)}</AvatarFallback>
                            </Avatar>
                            {registration.firstName} {registration.lastName}
                            {registration.isMinor && (
                              <Badge variant="secondary" className="ml-2">Minorenne</Badge>
                            )}
                          </TableCell>
                          <TableCell>{registration.contactEmail}</TableCell>
                          <TableCell>
                            {format(new Date(registration.birthDate), 'dd/MM/yyyy', { locale: it })}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(registration.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {registration.teamGroupsIds.map((teamId) => {
                                const team = teamGroups.find(t => t.id === teamId);
                                return team ? (
                                  <Badge key={teamId} variant="outline">
                                    {team.name}
                                  </Badge>
                                ) : null;
                              })}
                              {registration.teamGroupsIds.length === 0 && (
                                <span className="text-sm text-muted-foreground">Nessuna squadra</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {registration.status === 'pending' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleSendInvitation(registration.id)}
                                >
                                  <Mail className="h-4 w-4 mr-1" /> Invia invito
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  setSelectedRegistration(registration);
                                  setIsAssignDialogOpen(true);
                                }}
                              >
                                <UserCog className="h-4 w-4 mr-1" /> Gestisci
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Nessun giocatore trovato.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="active">
              {/* Contenuto uguale a "all" ma filtrato automaticamente */}
              <div className="border rounded-md overflow-hidden">
                <Table>
                  {/* ... stesso contenuto della tabella precedente ... */}
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="pending">
              {/* Contenuto uguale a "all" ma filtrato automaticamente */}
              <div className="border rounded-md overflow-hidden">
                <Table>
                  {/* ... stesso contenuto della tabella precedente ... */}
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="to_reassign">
              {/* Contenuto uguale a "all" ma filtrato automaticamente */}
              <div className="border rounded-md overflow-hidden">
                <Table>
                  {/* ... stesso contenuto della tabella precedente ... */}
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Dialog per creare un nuovo giocatore */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Nuovo Giocatore</DialogTitle>
            <DialogDescription>
              Inserisci i dati del giocatore da registrare
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cognome</FormLabel>
                      <FormControl>
                        <Input placeholder="Cognome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data di nascita</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isMinor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Giocatore minorenne</FormLabel>
                      <FormDescription>
                        Se selezionato, l'email di contatto sarà quella del genitore/tutore
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch('isMinor') ? 'Email genitore/tutore' : 'Email'}
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@esempio.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch('isMinor') && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="guardianName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome genitore/tutore</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="guardianRelationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relazione</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Genitore">Genitore</SelectItem>
                            <SelectItem value="Padre">Padre</SelectItem>
                            <SelectItem value="Madre">Madre</SelectItem>
                            <SelectItem value="Tutore legale">Tutore legale</SelectItem>
                            <SelectItem value="Altro">Altro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <FormField
                control={form.control}
                name="seasonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stagione</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona la stagione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {seasons.map(season => (
                          <SelectItem 
                            key={season.id} 
                            value={season.id}
                          >
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
                <Button type="submit">Crea Giocatore</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog per gestire un giocatore */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedRegistration && (
            <>
              <DialogHeader>
                <DialogTitle>Gestione Giocatore</DialogTitle>
                <DialogDescription>
                  {selectedRegistration.firstName} {selectedRegistration.lastName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {getInitials(`${selectedRegistration.firstName} ${selectedRegistration.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedRegistration.firstName} {selectedRegistration.lastName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" /> {selectedRegistration.contactEmail}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" /> {format(new Date(selectedRegistration.birthDate), 'dd/MM/yyyy', { locale: it })}
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-2">Squadre Assegnate</h4>
                  
                  {selectedRegistration.teamGroupsIds.length > 0 ? (
                    <div className="space-y-2">
                      {selectedRegistration.teamGroupsIds.map(teamId => {
                        const team = teamGroups.find(t => t.id === teamId);
                        if (!team) return null;
                        
                        const category = categories.find(c => c.id === team.categoryId);
                        
                        return (
                          <div key={teamId} className="flex items-center justify-between px-4 py-2 bg-background rounded-md border">
                            <div>
                              <div className="font-medium">{team.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {category?.name}
                              </div>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemovePlayerFromTeam(selectedRegistration.playerId, teamId)}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm italic p-2">
                      Nessuna squadra assegnata
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-2">Assegna ad una squadra</h4>
                  
                  <div className="space-y-3">
                    <Select onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona una categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentSeason && getCategoriesBySeason(currentSeason.id).map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedCategory && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {getTeamsByCategory(selectedCategory).map(team => {
                          const isAssigned = selectedRegistration.teamGroupsIds.includes(team.id);
                          return (
                            <Button
                              key={team.id}
                              variant={isAssigned ? "secondary" : "outline"}
                              size="sm"
                              className="justify-start"
                              onClick={() => {
                                if (isAssigned) {
                                  handleRemovePlayerFromTeam(selectedRegistration.playerId, team.id);
                                } else {
                                  handleAssignPlayerToTeam(selectedRegistration.playerId, team.id);
                                }
                              }}
                            >
                              {isAssigned ? (
                                <Check className="h-4 w-4 mr-2 text-green-600" />
                              ) : (
                                <UserPlus className="h-4 w-4 mr-2" />
                              )}
                              {team.name}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsAssignDialogOpen(false)}>Chiudi</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayerRegistrationsPage;
