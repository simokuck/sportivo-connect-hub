
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Player } from '@/types';

interface NonCompliantCardProps {
  members: Player[];
  onClick: () => void;
}

export const NonCompliantCard = ({ members, onClick }: NonCompliantCardProps) => {
  return (
    <Card className="hover-card-highlight cursor-pointer transition-all hover:shadow-md hover:border-primary/50" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Membri Non in Regola
        </CardTitle>
        <CardDescription>Richiede attenzione immediata</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {members.map((member) => (
            <li key={member.id} className="p-2 bg-red-50 dark:bg-red-900/30 rounded-md">
              <p className="font-medium dark:text-white">{member.name}</p>
              <p className="text-xs text-red-600 dark:text-red-300">
                Documenti mancanti o scaduti
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
