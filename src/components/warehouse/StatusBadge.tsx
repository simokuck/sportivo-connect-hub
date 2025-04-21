
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusLabel = (): string => {
    switch (status) {
      case 'available':
        return 'Disponibile';
      case 'low':
        return 'Scorta bassa';
      case 'out':
        return 'Esaurito';
      case 'assigned':
        return 'Assegnato';
      case 'returned':
        return 'Restituito';
      case 'lost':
        return 'Smarrito';
      case 'damaged':
        return 'Danneggiato';
      default:
        return status;
    }
  };
  
  return (
    <Badge 
      className={cn(
        "capitalize",
        status === 'available' && "status-badge-available",
        status === 'low' && "status-badge-low",
        status === 'out' && "status-badge-out",
        status === 'assigned' && "status-badge-assigned",
        status === 'returned' && "status-badge-returned",
        className
      )}
      variant="outline"
    >
      {getStatusLabel()}
    </Badge>
  );
};
