
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Shirt, Volleyball, Flag, Layers } from 'lucide-react';
import { WarehouseItem as WarehouseItemType, ItemSize } from '@/types/warehouse';
import { WarehouseItemDetail } from './WarehouseItemDetail';

interface WarehouseItemProps {
  item: WarehouseItemType;
  onEdit: () => void;
  onDelete: () => void;
}

export const WarehouseItemCard = ({ item, onEdit, onDelete }: WarehouseItemProps) => {
  const getItemIcon = () => {
    switch (item.category) {
      case 'kit':
        return <Shirt className="h-5 w-5" />;
      case 'palloni':
        return <Volleyball className="h-5 w-5" />;
      default:
        return <Flag className="h-5 w-5" />;
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'low': return "secondary";
      case 'out': return "destructive";
      default: return "outline";
    }
  };

  // Calculate total quantity from all sizes
  const getTotalQuantity = () => {
    if (item.sizes && item.sizes.length > 0) {
      return item.sizes.reduce((total, size) => total + (size.quantity || 0), 0);
    }
    return item.quantity || 0;
  };

  // Determine overall status based on sizes
  const getOverallStatus = () => {
    if (!item.sizes || item.sizes.length === 0) return item.status;
    
    const totalQuantity = getTotalQuantity();
    if (totalQuantity === 0) return 'out';
    if (totalQuantity <= 5) return 'low';
    return 'available';
  };

  const status = getOverallStatus();

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              {getItemIcon()}
              {item.name}
            </CardTitle>
            <CardDescription className="flex flex-wrap gap-2 mt-1">
              <Badge variant={getStatusBadgeVariant(status)}>
                {status === 'available' ? 'Disponibile' : 
                 status === 'low' ? 'Scorta bassa' : 
                 status === 'out' ? 'Esaurito' : status}
              </Badge>
              <Badge variant="secondary">Tot. {getTotalQuantity()}</Badge>
              {item.color && <Badge variant="outline">{item.color}</Badge>}
              {item.hasSizes && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Layers className="h-3 w-3" /> Taglie
                </Badge>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <WarehouseItemDetail item={item} />
        
        {/* Visualizzazione delle taglie */}
        {item.sizes && item.sizes.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Taglie disponibili</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {item.sizes.map((size, index) => (
                <div key={index} className="border rounded-md p-2 flex justify-between items-center">
                  <span className="font-medium">{size.label}</span>
                  <Badge variant={getStatusBadgeVariant(size.status)}>
                    {size.quantity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
