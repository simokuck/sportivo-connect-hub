
import React from 'react';
import { Badge } from "@/components/ui/badge";

export function getStatusBadge(status: string): React.ReactNode {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Attivo</Badge>;
    case 'inactive':
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inattivo</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In attesa</Badge>;
    case 'to_reassign':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Da riassegnare</Badge>;
    default:
      return <Badge variant="outline">Sconosciuto</Badge>;
  }
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}
