
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { mockTeams } from '@/data/mockData';
import { Users, Search, Filter, User, Trophy, ChevronLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PlayerList from '@/components/player/PlayerList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Team } from '@/types';
import TeamStatistics from '@/components/team/TeamStatistics';

const TeamsPage = () => {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [activeView, setActiveView] = useState<'teams' | 'team-details'>('teams');

  // Ensure user is defined before filtering
  if (!user) return <div className="p-4">Loading...</div>;

  const filteredTeams = mockTeams.filter(team => {
    switch (user.role) {
      case 'admin':
      case 'developer':
      case 'medical':
        return true;
      case 'coach':
        return team.coaches?.some(coach => coach.id === user.id);
      case 'player':
        return team.players?.some(player => player.id === user.id);
      default:
        return false;
    }
  });

  const handleTeamSelect = (team: Team) => {
    setSelectedTeam(team);
    setActiveView('team-details');
  };

  const handleBackToTeams = () => {
    setActiveView('teams');
    setSelectedTeam(null);
  };

  // Filter players based on search query and position filter
  const filteredPlayers = selectedTeam?.players?.filter(player => {
    const matchesName = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = positionFilter === 'all' ? true : player.position === positionFilter;
    return matchesName && matchesPosition;
  }) || [];

  // Get unique positions from the selected team
  const uniquePositions = [...new Set(selectedTeam?.players?.map(player => player.position))] as string[];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-sportivo-blue">Squadre</h1>

      {activeView === 'teams' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <Card 
              key={team.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleTeamSelect(team)}
            >
              <CardHeader className="flex flex-row items-center space-y-0 gap-4">
                <Users className="h-8 w-8 text-sportivo-blue" />
                <div>
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{team.category}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Allenatori</h4>
                    <div className="flex flex-wrap gap-2">
                      {team.coaches?.map((coach) => (
                        <Avatar key={coach.id} className="h-8 w-8">
                          <AvatarImage src={coach.avatar} alt={coach.name} />
                          <AvatarFallback>{coach.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">
                      Giocatori ({team.players?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {team.players?.slice(0, 5).map((player) => (
                        <Avatar key={player.id} className="h-8 w-8">
                          <AvatarImage src={player.avatar} alt={player.name} />
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      {(team.players?.length || 0) > 5 && (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm">
                          +{(team.players?.length || 0) - 5}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        selectedTeam && (
          <div className="space-y-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleBackToTeams} className="mr-2">
                <ChevronLeft className="h-4 w-4 mr-1" /> Torna alle Squadre
              </Button>
              <h2 className="text-2xl font-semibold">{selectedTeam.name}</h2>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Panoramica</TabsTrigger>
                <TabsTrigger value="players">Giocatori</TabsTrigger>
                <TabsTrigger value="stats">Statistiche</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-sportivo-blue" /> 
                      {selectedTeam.name} - {selectedTeam.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Allenatori</h3>
                        <div className="space-y-3">
                          {selectedTeam.coaches?.map((coach) => (
                            <div key={coach.id} className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={coach.avatar} alt={coach.name} />
                                <AvatarFallback>{coach.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{coach.name}</p>
                                <p className="text-sm text-muted-foreground">{coach.email}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Informazioni Squadra</h3>
                        <div className="space-y-2">
                          <p><span className="font-medium">Categoria:</span> {selectedTeam.category}</p>
                          <p><span className="font-medium">Numero giocatori:</span> {selectedTeam.players?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="players">
                <Card>
                  <CardHeader>
                    <CardTitle>Giocatori</CardTitle>
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Cerca giocatore..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Select value={positionFilter} onValueChange={setPositionFilter}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtra per ruolo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tutti i ruoli</SelectItem>
                            {uniquePositions.map(position => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <PlayerList players={filteredPlayers} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="stats">
                {selectedTeam && <TeamStatistics team={selectedTeam} />}
              </TabsContent>
            </Tabs>
          </div>
        )
      )}
    </div>
  );
};

export default TeamsPage;
