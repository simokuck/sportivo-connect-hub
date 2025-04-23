
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePlayerManagement } from '@/context/PlayerManagementContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlayerRegistrationFormDialog } from './player-registrations/PlayerRegistrationFormDialog';
import { PlayerAssignDialog } from './player-registrations/PlayerAssignDialog';
import { PlayerRegistrationTable } from './player-registrations/PlayerRegistrationTable';
import { getStatusBadge, getInitials } from './player-registrations/utils';

import { PlayerRegistration, Season, TeamCategory, TeamGroup } from '@/types/player-management';

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
  playerId: z.string().optional(),
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

  useEffect(() => {
    if (currentSeason) {
      form.setValue('seasonId', currentSeason.id);
    }
  }, [currentSeason, form]);

  const filteredRegistrations = playerRegistrations.filter(registration => {
    if (activeTab === 'pending' && registration.status !== 'pending') return false;
    if (activeTab === 'active' && registration.status !== 'active') return false;
    if (activeTab === 'inactive' && registration.status !== 'inactive') return false;
    if (activeTab === 'to_reassign' && registration.status !== 'to_reassign') return false;
    const fullName = `${registration.firstName} ${registration.lastName}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    if (searchQuery && !fullName.includes(searchLower)) return false;
    if (statusFilter !== 'all' && registration.status !== statusFilter) return false;
    return true;
  });

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

  const onSubmit = async (data: PlayerRegistrationFormValues) => {
    try {
      const playerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        isMinor: data.isMinor,
        contactEmail: data.contactEmail,
        guardianName: data.guardianName,
        guardianRelationship: data.guardianRelationship,
        seasonId: data.seasonId,
        playerId: data.playerId || `player-${Date.now()}`,
        teamGroupsIds: data.teamGroupsIds || []
      };
      await createPlayerRegistration(playerData);
      setIsAddDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Errore durante la creazione del giocatore:', error);
    }
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
              <PlayerRegistrationTable
                registrations={filteredRegistrations}
                teamGroups={teamGroups}
                onSendInvitation={async (id) => await sendInvitation(id)}
                onManage={(registration) => { setSelectedRegistration(registration); setIsAssignDialogOpen(true); }}
              />
            </TabsContent>
            <TabsContent value="active">
              <PlayerRegistrationTable
                registrations={filteredRegistrations.filter(r => r.status === 'active')}
                teamGroups={teamGroups}
                onSendInvitation={async (id) => await sendInvitation(id)}
                onManage={reg => { setSelectedRegistration(reg); setIsAssignDialogOpen(true); }}
              />
            </TabsContent>
            <TabsContent value="pending">
              <PlayerRegistrationTable
                registrations={filteredRegistrations.filter(r => r.status === 'pending')}
                teamGroups={teamGroups}
                onSendInvitation={async (id) => await sendInvitation(id)}
                onManage={reg => { setSelectedRegistration(reg); setIsAssignDialogOpen(true); }}
              />
            </TabsContent>
            <TabsContent value="to_reassign">
              <PlayerRegistrationTable
                registrations={filteredRegistrations.filter(r => r.status === 'to_reassign')}
                teamGroups={teamGroups}
                onSendInvitation={async (id) => await sendInvitation(id)}
                onManage={reg => { setSelectedRegistration(reg); setIsAssignDialogOpen(true); }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <PlayerRegistrationFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        form={form}
        seasons={seasons}
        onSubmit={onSubmit}
      />
      <PlayerAssignDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        registration={selectedRegistration}
        teamGroups={teamGroups}
        categories={categories}
        currentSeasonId={currentSeason?.id}
        getCategoriesBySeason={getCategoriesBySeason}
        getTeamsByCategory={getTeamsByCategory}
        onAssign={assignPlayerToTeam}
        onRemove={removePlayerFromTeam}
      />
    </div>
  );
};

export default PlayerRegistrationsPage;
