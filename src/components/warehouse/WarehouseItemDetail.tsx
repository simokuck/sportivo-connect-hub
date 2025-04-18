
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WarehouseItem, ItemSize } from "@/types/warehouse";

interface WarehouseItemDetailProps {
  item: WarehouseItem;
}

export const WarehouseItemDetail = ({ item }: WarehouseItemDetailProps) => {
  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'low': return "secondary";
      case 'out': return "destructive";
      default: return "outline";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'available': return 'Disponibile';
      case 'low': return 'Scorta bassa';
      case 'out': return 'Esaurito';
      default: return status || 'Sconosciuto';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {item.image && (
        <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex items-center justify-center">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {item.material && (
            <div className="flex flex-col">
              <span className="font-medium text-xs text-muted-foreground">Materiale</span>
              <span>{item.material}</span>
            </div>
          )}
          
          {item.features && (
            <div className="flex flex-col">
              <span className="font-medium text-xs text-muted-foreground">Caratteristiche</span>
              <span>{item.features}</span>
            </div>
          )}
          
          {item.notes && (
            <div className="flex flex-col sm:col-span-2">
              <span className="font-medium text-xs text-muted-foreground">Note</span>
              <span>{item.notes}</span>
            </div>
          )}
        </div>
        
        {item.sizes && item.sizes.length > 0 && (
          <div className="mt-3">
            <span className="font-medium text-xs text-muted-foreground block mb-1">Taglie e disponibilità</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {item.sizes.map((size, index) => (
                <Card key={index} className="p-1 border-muted">
                  <CardContent className="p-2 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">{size.label}</span>
                      <Badge variant={getStatusBadgeVariant(size.status)}>
                        {getStatusLabel(size.status)}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      Quantità: {size.quantity}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Posizione: {item.location}</p>
          <p>Fornitore: {item.supplier}</p>
          {item.lastUpdated && (
            <p>Ultimo aggiornamento: {new Date(item.lastUpdated).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};
