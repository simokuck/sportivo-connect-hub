
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MovementType } from "@/types/warehouse";

interface MovementTypeBadgeProps {
  type: MovementType;
}

export const MovementTypeBadge: React.FC<MovementTypeBadgeProps> = ({ type }) => {
  const getTypeLabel = (): string => {
    switch (type) {
      case 'in':
        return 'Carico';
      case 'out':
        return 'Scarico';
      case 'assign':
        return 'Assegnazione';
      case 'return':
        return 'Restituzione';
      case 'lost':
        return 'Smarrito';
      case 'damaged':
        return 'Danneggiato';
      default:
        return type;
    }
  };
  
  return (
    <Badge 
      className={cn(
        "capitalize",
        type === 'in' && "bg-blue-100 text-blue-800 hover:bg-blue-100",
        type === 'out' && "bg-red-100 text-red-800 hover:bg-red-100",
        type === 'assign' && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", // Cambiato in giallo
        type === 'return' && "bg-green-100 text-green-800 hover:bg-green-100", // Cambiato in verde
        type === 'lost' && "bg-amber-100 text-amber-800 hover:bg-amber-100",
        type === 'damaged' && "bg-orange-100 text-orange-800 hover:bg-orange-100"
      )}
      variant="outline"
    >
      {getTypeLabel()}
    </Badge>
  );
};
