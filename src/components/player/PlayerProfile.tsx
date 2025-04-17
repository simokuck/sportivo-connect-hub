
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Player } from '@/types';
import { Award, Calendar, Clock, Goal, AlertTriangle } from 'lucide-react';

interface PlayerProfileProps {
  player: Player;
}

const PlayerProfile = ({ player }: PlayerProfileProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center space-y-0 gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={player.avatar} alt={player.name} />
          <AvatarFallback>{player.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl">{player.name}</CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge>{player.position}</Badge>
            <Badge variant="outline">Piede {player.strongFoot}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-lg font-semibold">{player.stats.games}</span>
            <span className="text-sm text-muted-foreground">Presenze</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
            <Clock className="h-5 w-5 mb-1" />
            <span className="text-lg font-semibold">{player.stats.minutesPlayed}</span>
            <span className="text-sm text-muted-foreground">Minuti</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
            <Goal className="h-5 w-5 mb-1" />
            <span className="text-lg font-semibold">{player.stats.goals}</span>
            <span className="text-sm text-muted-foreground">Gol</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
            <Award className="h-5 w-5 mb-1" />
            <span className="text-lg font-semibold">{player.stats.assists}</span>
            <span className="text-sm text-muted-foreground">Assist</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{player.stats.redCards}</Badge>
            <span className="text-sm text-muted-foreground">Rossi</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{player.stats.yellowCards}</Badge>
            <span className="text-sm text-muted-foreground">Gialli</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">
              {player.stats.absences} assenze
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProfile;
