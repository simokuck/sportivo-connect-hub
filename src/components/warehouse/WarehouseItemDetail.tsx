
import React from 'react';
import { WarehouseItem, ItemSize } from '@/types/warehouse';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface WarehouseItemDetailProps {
  item: WarehouseItem;
}

export const WarehouseItemDetail = ({ item }: WarehouseItemDetailProps) => {
  const getSizeStatusColor = (size: ItemSize) => {
    switch(size.status) {
      case 'low': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'out': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-3 text-sm">
      {/* Sizes section */}
      {item.sizes && item.sizes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Taglie disponibili:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {item.sizes.map((size, index) => (
              <div 
                key={index} 
                className={`border rounded-md p-2 flex flex-col justify-between ${getSizeStatusColor(size)}`}
              >
                <div className="font-medium">{size.label}</div>
                <div className="mt-1">
                  Qt: {size.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Structured details */}
      <div className="space-y-2">
        {item.supplier && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Fornitore:</span>
            <span className="font-medium">{item.supplier}</span>
          </div>
        )}
        
        {item.location && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Posizione:</span>
            <span className="font-medium">{item.location}</span>
          </div>
        )}
        
        {item.material && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Materiale:</span>
            <span className="font-medium">{item.material}</span>
          </div>
        )}
        
        {item.lastUpdated && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ultimo aggiornamento:</span>
            <span className="font-medium">{item.lastUpdated}</span>
          </div>
        )}
      </div>
      
      {/* Features */}
      {item.features && item.features.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-1">Caratteristiche:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {item.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      
      {/* Notes */}
      {item.notes && item.notes.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-1">Note tecniche:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {item.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
