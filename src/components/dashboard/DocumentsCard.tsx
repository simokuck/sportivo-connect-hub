
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface DocumentsCardProps {
  onClick: () => void;
  role: string;
}

export const DocumentsCard = ({ onClick, role }: DocumentsCardProps) => {
  return (
    <Card className="hover-card-highlight cursor-pointer transition-all hover:shadow-md hover:border-primary/50" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2 text-sportivo-blue" />
          Documenti
        </CardTitle>
        <CardDescription>
          {role === 'admin' ? 'Gestione documentale' : 'Documenti medici'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
            <span className="text-sm">Certificati medici</span>
            <span className="text-xs bg-sportivo-green text-white px-2 py-1 rounded">
              Aggiornati
            </span>
          </li>
          <li className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
            <span className="text-sm">Contratti</span>
            <span className="text-xs bg-sportivo-blue text-white px-2 py-1 rounded">
              3 in scadenza
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
