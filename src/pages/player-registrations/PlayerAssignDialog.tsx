
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Check, X, UserPlus } from 'lucide-react';
import { getInitials } from './utils';
import { PlayerRegistration, TeamGroup, TeamCategory } from '@/types/player-management';

interface PlayerAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: PlayerRegistration | null;
  teamGroups: TeamGroup[];
  categories: TeamCategory[];
  currentSeasonId?: string;
  getCategoriesBySeason: (seasonId: string) => TeamCategory[];
  getTeamsByCategory: (categoryId: string) => TeamGroup[];
  onAssign: (playerId: string, teamId: string) => void;
  onRemove: (playerId: string, teamId: string) => void;
}

export const PlayerAssignDialog: React.FC<PlayerAssignDialogProps> = ({
  open,
  onOpenChange,
  registration,
  teamGroups,
  categories,
  currentSeasonId,
  getCategoriesBySeason,
  getTeamsByCategory,
  onAssign,
  onRemove
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  if (!registration) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gestione Giocatore</DialogTitle>
          <DialogDescription>
            {registration.firstName} {registration.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {getInitials(`${registration.firstName} ${registration.lastName}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">
                {registration.firstName} {registration.lastName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" /> {registration.contactEmail}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" /> {new Date(registration.birthDate).toLocaleDateString('it-IT')}
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">Squadre Assegnate</h4>
            {registration.teamGroupsIds.length > 0 ? (
              <div className="space-y-2">
                {registration.teamGroupsIds.map(teamId => {
                  const team = teamGroups.find(t => t.id === teamId);
                  const category = team ? categories.find(c => c.id === team.categoryId) : null;
                  if (!team) return null;
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
                        onClick={() => onRemove(registration.playerId, teamId)}
                      >
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )
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
              <select
                className="block w-full rounded-md border p-2"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="">Seleziona una categoria</option>
                {currentSeasonId && getCategoriesBySeason(currentSeasonId).map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {selectedCategory && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {getTeamsByCategory(selectedCategory).map(team => {
                    const isAssigned = registration.teamGroupsIds.includes(team.id);
                    return (
                      <Button
                        key={team.id}
                        variant={isAssigned ? "secondary" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => {
                          if (isAssigned) onRemove(registration.playerId, team.id);
                          else onAssign(registration.playerId, team.id);
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
          <Button onClick={() => onOpenChange(false)}>Chiudi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
