
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, UserCog } from 'lucide-react';
import { getStatusBadge, getInitials } from "./utils";
import { PlayerRegistration, TeamGroup, TeamCategory } from '@/types/player-management';

interface PlayerRegistrationTableProps {
  registrations: PlayerRegistration[];
  teamGroups: TeamGroup[];
  onSendInvitation: (registrationId: string) => void;
  onManage: (registration: PlayerRegistration) => void;
  showInviteButton?: boolean;
}

export const PlayerRegistrationTable: React.FC<PlayerRegistrationTableProps> = ({
  registrations,
  teamGroups,
  onSendInvitation,
  onManage,
  showInviteButton = true
}) => (
  <div className="border rounded-md overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Data di nascita</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead>Squadre</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.length > 0 ? (
          registrations.map((registration) => (
            <TableRow key={registration.id}>
              <TableCell className="font-medium flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(`${registration.firstName} ${registration.lastName}`)}</AvatarFallback>
                </Avatar>
                {registration.firstName} {registration.lastName}
                {registration.isMinor && (
                  <Badge variant="secondary" className="ml-2">Minorenne</Badge>
                )}
              </TableCell>
              <TableCell>{registration.contactEmail}</TableCell>
              <TableCell>
                {new Date(registration.birthDate).toLocaleDateString("it-IT")}
              </TableCell>
              <TableCell>
                {getStatusBadge(registration.status)}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {registration.teamGroupsIds.map((teamId) => {
                    const team = teamGroups.find(t => t.id === teamId);
                    return team ? (
                      <Badge key={teamId} variant="outline">
                        {team.name}
                      </Badge>
                    ) : null;
                  })}
                  {registration.teamGroupsIds.length === 0 && (
                    <span className="text-sm text-muted-foreground">Nessuna squadra</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {showInviteButton && registration.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSendInvitation(registration.id)}
                    >
                      <Mail className="h-4 w-4 mr-1" /> Invia invito
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onManage(registration)}
                  >
                    <UserCog className="h-4 w-4 mr-1" /> Gestisci
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              Nessun giocatore trovato.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
