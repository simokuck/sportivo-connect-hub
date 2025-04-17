
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { mockTeams } from '@/data/mockData';
import { Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PlayerList from '@/components/player/PlayerList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TeamsPage = () => {
  const { user } = useAuth();
  const [selectedTeam, setSelectedTeam] = React.useState<string | null>(null);

  const filteredTeams = mockTeams.filter(team => {
    if (!user) return false;
    
    switch (user.role) {
      case 'admin':
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-sportivo-blue">Squadre</h1>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList>
          <TabsTrigger value="teams">Panoramica Squadre</TabsTrigger>
          {selectedTeam && <TabsTrigger value="players">Giocatori</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="teams">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map((team) => (
              <Card 
                key={team.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTeam(team.id)}
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
        </TabsContent>
        
        <TabsContent value="players">
          {selectedTeam && (
            <PlayerList 
              players={mockTeams.find(t => t.id === selectedTeam)?.players || []} 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamsPage;
