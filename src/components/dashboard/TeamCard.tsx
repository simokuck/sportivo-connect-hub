
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface TeamCardProps {
  onClick: () => void;
}

export const TeamCard = ({ onClick }: TeamCardProps) => {
  return (
    <Card className="hover-card-highlight cursor-pointer transition-all hover:shadow-md hover:border-primary/50" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Users className="h-5 w-5 mr-2 text-sportivo-blue" />
          Squadre
        </CardTitle>
        <CardDescription>Gestione squadre e giocatori</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
            <span>Prima Squadra</span>
            <span className="text-xs bg-sportivo-blue text-white px-2 py-1 rounded">
              22 giocatori
            </span>
          </li>
          <li className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
            <span>Under 17</span>
            <span className="text-xs bg-sportivo-green text-white px-2 py-1 rounded">
              12 giocatori
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
