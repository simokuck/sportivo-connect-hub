
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Archive, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TeamGroup, PlayerRegistration, TeamCategory, Season } from '@/types/player-management';

interface TeamGroupsListProps {
  teamsByCategory: Record<string, TeamGroup[]>;
  categories: TeamCategory[]; // Updated from teamCategories to categories
  playerRegistrations: PlayerRegistration[];
  currentSeason: Season | null;
  onShowPlayers: (team: TeamGroup) => void;
  onArchive: (id: string) => void;
  onCreateTeam: () => void;
  getCategoryName: (id: string) => string;
  getInitials: (name: string) => string;
  getCategoriesBySeason: (seasonId: string) => TeamCategory[];
}

export const TeamGroupsList: React.FC<TeamGroupsListProps> = ({
  teamsByCategory,
  categories, // Updated property name
  playerRegistrations,
  currentSeason,
  onShowPlayers,
  onArchive,
  onCreateTeam,
  getCategoryName,
  getInitials,
  getCategoriesBySeason,
}) => {
  return (
    <>
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
                            onClick={() => onShowPlayers(team)}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onArchive(team.id)}
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
              onClick={onCreateTeam}
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
        </div>
      )}
    </>
  );
};

export default TeamGroupsList;
