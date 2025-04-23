
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TeamGroup, PlayerRegistration, Season, TeamCategory } from '@/types/player-management';

interface ViewPlayersDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  selectedTeam: TeamGroup | null;
  getPlayersList: (teamId: string) => PlayerRegistration[];
  getCategoryName: (id: string) => string;
  getInitials: (name: string) => string;
  currentSeason: Season | null;
}

export const ViewPlayersDialog: React.FC<ViewPlayersDialogProps> = ({
  open,
  onOpenChange,
  selectedTeam,
  getPlayersList,
  getCategoryName,
  getInitials,
  currentSeason,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[600px]">
      {selectedTeam && (
        <>
          <DialogHeader>
            <DialogTitle>Giocatori - {selectedTeam.name}</DialogTitle>
            <DialogDescription>
              {getCategoryName(selectedTeam.categoryId)} - {currentSeason?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTeam.playersIds.length > 0 ? (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {getPlayersList(selectedTeam.id).map(registration => (
                  <div key={registration.id} className="flex items-center justify-between p-3 bg-background rounded-md border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {getInitials(`${registration.firstName} ${registration.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {registration.firstName} {registration.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {registration.contactEmail}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Nessun giocatore assegnato a questa squadra.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Chiudi</Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  </Dialog>
);

export default ViewPlayersDialog;
