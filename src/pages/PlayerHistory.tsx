
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePlayerManagement } from '@/context/PlayerManagementContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { it } from 'date-fns/locale'; // Fixed import
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayerRegistration, PlayerTeamHistory } from '@/types/player-management';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PlayerHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    playerRegistrations, 
    playerHistory,
    seasons,
    teamGroups,
    categories,
    getPlayerHistory
  } = usePlayerManagement();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('all');
  
  // Filtra i giocatori in base alla ricerca
  const filteredPlayers = playerRegistrations.filter(reg => {
    const fullName = `${reg.firstName} ${reg.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
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
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Ottiene lo storico di un giocatore
  const getPlayerHistoryData = (playerId: string): PlayerTeamHistory[] => {
    // Ottieni lo storico e filtra per stagione se selezionata
    let history = getPlayerHistory(playerId);
    
    if (selectedSeasonId !== 'all') {
      history = history.filter(h => h.seasonId === selectedSeasonId);
    }
    
    // Ordina per data di inizio decrescente
    return history.sort((a, b) => 
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  };
  
  // Ottieni il giocatore selezionato
  const selectedPlayer = selectedPlayerId 
    ? playerRegistrations.find(reg => reg.playerId === selectedPlayerId) 
    : null;
  
  // Ottieni lo storico del giocatore selezionato
  const playerHistoryData = selectedPlayerId 
    ? getPlayerHistoryData(selectedPlayerId)
    : [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-sportivo-blue">Storico Giocatori</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Seleziona un giocatore</CardTitle>
          <CardDescription>
            Visualizza lo storico completo dei giocatori in tutte le stagioni
          </CardDescription>
          
          <div className="relative flex-1 mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca giocatore per nome..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <Card 
                key={player.playerId} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  selectedPlayerId === player.playerId ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedPlayerId(player.playerId)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {getInitials(`${player.firstName} ${player.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {player.firstName} {player.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(player.birthDate), 'dd/MM/yyyy', { locale: it })}
                    </p>
                    {player.isMinor && (
                      <Badge variant="secondary" className="mt-1">Minorenne</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-muted-foreground">
              Nessun giocatore corrisponde ai criteri di ricerca.
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedPlayer && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {selectedPlayer.firstName} {selectedPlayer.lastName}
              </CardTitle>
              <CardDescription>
                Data di nascita: {format(new Date(selectedPlayer.birthDate), 'dd MMMM yyyy', { locale: it })}
              </CardDescription>
            </div>
            
            <Select
              value={selectedSeasonId}
              onValueChange={setSelectedSeasonId}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tutte le stagioni" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le stagioni</SelectItem>
                {seasons.map(season => (
                  <SelectItem key={season.id} value={season.id}>
                    {season.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stagione</TableHead>
                    <TableHead>Squadra</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Ruolo</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerHistoryData.length > 0 ? (
                    playerHistoryData.map((history) => (
                      <TableRow key={history.id}>
                        <TableCell>{history.seasonName}</TableCell>
                        <TableCell>{history.teamGroupName}</TableCell>
                        <TableCell>{history.categoryName}</TableCell>
                        <TableCell>{history.position || '-'}</TableCell>
                        <TableCell>
                          {format(new Date(history.startDate), 'dd/MM/yyyy', { locale: it })}
                          {' - '}
                          {history.endDate 
                            ? format(new Date(history.endDate), 'dd/MM/yyyy', { locale: it })
                            : 'In corso'}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              {history.notes ? (
                                <button className="text-primary hover:underline text-sm">
                                  Visualizza note
                                </button>
                              ) : (
                                <span className="text-sm text-muted-foreground">Nessuna nota</span>
                              )}
                            </DialogTrigger>
                            {history.notes && (
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Note</DialogTitle>
                                  <DialogDescription>
                                    Stagione {history.seasonName} - {history.teamGroupName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 p-4 bg-muted rounded-md">
                                  {history.notes}
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Nessuna storia disponibile per questo giocatore
                        {selectedSeasonId !== 'all' && ' nella stagione selezionata'}.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayerHistoryPage;
