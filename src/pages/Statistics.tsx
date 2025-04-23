
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockPlayers, mockTeams } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const Statistics = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // For player view, show only their stats
  // For coach view, show all players' stats
  const playersToShow = user.role === 'player' 
    ? mockPlayers.filter(player => player.id === user.id)
    : mockPlayers;
  
  // Prepare data for charts
  const goalsData = playersToShow.map(player => ({
    name: player.name.split(' ')[0],
    goals: player.stats.goals
  }));
  
  const assistsData = playersToShow.map(player => ({
    name: player.name.split(' ')[0],
    assists: player.stats.assists
  }));
  
  const minutesData = playersToShow.map(player => ({
    name: player.name.split(' ')[0],
    minuti: Math.round(player.stats.minutesPlayed / 90) // Minutes in match equivalent
  }));

  // Chart configuration
  const chartConfig = {
    goals: {
      label: "Gol",
      color: "#1E40AF"
    },
    assists: {
      label: "Assist",
      color: "#047857"
    },
    minuti: {
      label: "Partite (90 min)",
      color: "#93C5FD"
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Statistiche</h1>
        {user.role === 'coach' && (
          <div>
            <select className="p-2 border rounded-md">
              <option>Tutte le squadre</option>
              {mockTeams.map(team => (
                <option key={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {user.role === 'player' ? (
        <PlayerStatistics player={playersToShow[0]} />
      ) : (
        <Tabs defaultValue="sommario">
          <TabsList className="mb-4">
            <TabsTrigger value="sommario">Sommario</TabsTrigger>
            <TabsTrigger value="gol">Gol</TabsTrigger>
            <TabsTrigger value="presenze">Presenze</TabsTrigger>
          </TabsList>

          <TabsContent value="sommario" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gol Segnati</CardTitle>
                  <CardDescription>Totale gol per giocatore</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartContainer config={chartConfig}>
                      <BarChart data={goalsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="goals" fill="#1E40AF" name="Gol" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assist</CardTitle>
                  <CardDescription>Totale assist per giocatore</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartContainer config={chartConfig}>
                      <BarChart data={assistsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="assists" fill="#047857" name="Assist" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Minutaggio</CardTitle>
                  <CardDescription>Partite complete equivalenti</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartContainer config={chartConfig}>
                      <BarChart data={minutesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="minuti" fill="#93C5FD" name="Partite (90 min)" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Statistica Giocatori</CardTitle>
                <CardDescription>Tabella completa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Giocatore</th>
                        <th className="text-center py-3 px-4">Partite</th>
                        <th className="text-center py-3 px-4">Minuti</th>
                        <th className="text-center py-3 px-4">Gol</th>
                        <th className="text-center py-3 px-4">Assist</th>
                        <th className="text-center py-3 px-4">Gialli</th>
                        <th className="text-center py-3 px-4">Rossi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playersToShow.map((player) => (
                        <tr key={player.id} className="border-b">
                          <td className="py-3 px-4">{player.name}</td>
                          <td className="text-center py-3 px-4">{player.stats.games}</td>
                          <td className="text-center py-3 px-4">{player.stats.minutesPlayed}</td>
                          <td className="text-center py-3 px-4">{player.stats.goals}</td>
                          <td className="text-center py-3 px-4">{player.stats.assists}</td>
                          <td className="text-center py-3 px-4">{player.stats.yellowCards}</td>
                          <td className="text-center py-3 px-4">{player.stats.redCards}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gol" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiche Gol</CardTitle>
                <CardDescription>Analisi dettagliata delle reti</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ChartContainer config={chartConfig}>
                    <BarChart data={goalsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="goals" fill="#1E40AF" name="Gol" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="presenze" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiche Presenze</CardTitle>
                <CardDescription>Analisi presenze e minutaggio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ChartContainer config={chartConfig}>
                    <BarChart data={minutesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="minuti" fill="#93C5FD" name="Partite (90 min)" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

// Component for individual player statistics view
const PlayerStatistics = ({ player }: { player: typeof mockPlayers[0] }) => {
  // Chart configuration for player stats
  const chartConfig = {
    value: {
      label: "Contributo",
      color: "#1E40AF"
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Le tue Statistiche</CardTitle>
          <CardDescription>Stagione 2024/25</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Partite" value={player.stats.games} />
            <StatCard title="Minuti" value={player.stats.minutesPlayed} />
            <StatCard title="Gol" value={player.stats.goals} />
            <StatCard title="Assist" value={player.stats.assists} />
            <StatCard title="Gialli" value={player.stats.yellowCards} />
            <StatCard title="Rossi" value={player.stats.redCards} />
            <StatCard title="Media Minuti" value={Math.round(player.stats.minutesPlayed / player.stats.games)} />
            <StatCard 
              title="Efficienza" 
              value={`${Math.round((player.stats.goals + player.stats.assists) / player.stats.games * 100) / 100}`} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dettagli Giocatore</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-2"><strong>Nome:</strong> {player.name}</p>
              <p className="mb-2"><strong>Ruolo:</strong> {player.position}</p>
              <p className="mb-2"><strong>Piede:</strong> {player.strongFoot === 'right' ? 'Destro' : player.strongFoot === 'left' ? 'Sinistro' : 'Ambidestro'}</p>
            </div>
            <div>
              <p className="text-xl font-semibold mb-2">Contributo alla Squadra</p>
              <div className="h-48">
                <ChartContainer config={chartConfig}>
                  <BarChart
                    data={[
                      { name: 'Gol', value: player.stats.goals },
                      { name: 'Assist', value: player.stats.assists },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#1E40AF" />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper component for stat display
const StatCard = ({ title, value }: { title: string; value: number | string }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default Statistics;
