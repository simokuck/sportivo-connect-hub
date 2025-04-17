
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team, Player } from '@/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Goal, Clock, Award, AlertTriangle } from 'lucide-react';

interface TeamStatisticsProps {
  team: Team;
}

const TeamStatistics = ({ team }: TeamStatisticsProps) => {
  const players = team.players || [];

  // Calculate aggregated team statistics
  const totalGoals = players.reduce((sum, player) => sum + player.stats.goals, 0);
  const totalAssists = players.reduce((sum, player) => sum + player.stats.assists, 0);
  const totalYellowCards = players.reduce((sum, player) => sum + player.stats.yellowCards, 0);
  const totalRedCards = players.reduce((sum, player) => sum + player.stats.redCards, 0);
  const totalGames = players.length > 0 ? players[0].stats.games : 0; // Assuming all players have the same number of games
  const totalMinutesPlayed = players.reduce((sum, player) => sum + player.stats.minutesPlayed, 0);
  const totalAbsences = players.reduce((sum, player) => sum + player.stats.absences, 0);

  // Process data for charts
  const topScorers = [...players]
    .sort((a, b) => b.stats.goals - a.stats.goals)
    .slice(0, 5)
    .map(player => ({
      name: player.name,
      goals: player.stats.goals
    }));

  const topAssisters = [...players]
    .sort((a, b) => b.stats.assists - a.stats.assists)
    .slice(0, 5)
    .map(player => ({
      name: player.name,
      assists: player.stats.assists
    }));

  // Position distribution for pie chart
  const positionCounts: Record<string, number> = {};
  players.forEach(player => {
    if (positionCounts[player.position]) {
      positionCounts[player.position]++;
    } else {
      positionCounts[player.position] = 1;
    }
  });

  const positionData = Object.entries(positionCounts).map(([position, count]) => ({
    position,
    count,
  }));

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Statistiche Generali</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 bg-accent rounded-lg">
              <Goal className="h-6 w-6 mb-2 text-sportivo-blue" />
              <span className="text-2xl font-bold">{totalGoals}</span>
              <span className="text-sm text-muted-foreground">Gol Totali</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-accent rounded-lg">
              <Award className="h-6 w-6 mb-2 text-sportivo-blue" />
              <span className="text-2xl font-bold">{totalAssists}</span>
              <span className="text-sm text-muted-foreground">Assist Totali</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-accent rounded-lg">
              <Clock className="h-6 w-6 mb-2 text-sportivo-blue" />
              <span className="text-2xl font-bold">{Math.floor(totalMinutesPlayed / 60)}</span>
              <span className="text-sm text-muted-foreground">Ore Giocate</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-accent rounded-lg">
              <AlertTriangle className="h-6 w-6 mb-2 text-sportivo-blue" />
              <span className="text-2xl font-bold">{totalAbsences}</span>
              <span className="text-sm text-muted-foreground">Assenze</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Migliori Marcatori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topScorers}
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="goals" name="Gol" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Migliori Assistmen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topAssisters}
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="assists" name="Assist" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuzione per Ruolo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={positionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ position, count }) => `${position}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {positionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} giocatori`, props.payload.position]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiche Disciplinari</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Giocatore</TableHead>
                  <TableHead className="text-right">Gialli</TableHead>
                  <TableHead className="text-right">Rossi</TableHead>
                  <TableHead className="text-right">Assenze</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players
                  .filter(player => player.stats.yellowCards > 0 || player.stats.redCards > 0 || player.stats.absences > 0)
                  .sort((a, b) => 
                    (b.stats.yellowCards + b.stats.redCards * 2) - 
                    (a.stats.yellowCards + a.stats.redCards * 2)
                  )
                  .slice(0, 5)
                  .map(player => (
                    <TableRow key={player.id}>
                      <TableCell>{player.name}</TableCell>
                      <TableCell className="text-right">{player.stats.yellowCards}</TableCell>
                      <TableCell className="text-right">{player.stats.redCards}</TableCell>
                      <TableCell className="text-right">{player.stats.absences}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamStatistics;
