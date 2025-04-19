
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ItemVariant } from "@/types/warehouse";
import { cn } from "@/lib/utils";
import { Edit, Trash, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ItemVariantsListProps {
  variants: ItemVariant[];
  onEdit: (variant: ItemVariant) => void;
  onDelete: (variant: ItemVariant) => void;
  onAddVariant: () => void;
}

const getColorDescription = (hexColor: string): string => {
  const colorMap: Record<string, string> = {
    '#FFFFFF': 'Bianco',
    '#000000': 'Nero',
    '#FF0000': 'Rosso',
    '#0000FF': 'Blu',
    '#008000': 'Verde',
    '#FFFF00': 'Giallo',
    '#FFA500': 'Arancione',
    '#800080': 'Viola',
    '#FFC0CB': 'Rosa',
    '#A52A2A': 'Marrone',
    '#808080': 'Grigio',
    '#C0C0C0': 'Argento',
    '#00FFFF': 'Ciano',
    '#800000': 'Bordeaux',
    '#FFD700': 'Oro',
    '#000080': 'Blu Navy',
    '#008080': 'Verde Acqua',
    '#FF00FF': 'Fucsia',
    '#F5F5DC': 'Beige',
    '#D3D3D3': 'Grigio Chiaro',
    '#1976d2': 'Blu Cobalto',
    '#556B2F': 'Verde Oliva',
    '#708090': 'Grigio Ardesia',
    '#4B0082': 'Indaco',
  };

  const normalizedHex = hexColor.toUpperCase();
  
  if (colorMap[normalizedHex]) {
    return colorMap[normalizedHex];
  }
  
  return `Personalizzato (${hexColor})`;
};

// Helper function to determine if status is considered "low stock"
const isLowStock = (status: string): boolean => {
  return status === 'low' || status === 'low_stock';
};

// Helper function to determine if status is considered "out of stock"
const isOutOfStock = (status: string): boolean => {
  return status === 'out' || status === 'out_of_stock';
};

// Helper function to get status display text
const getStatusDisplayText = (status: string): string => {
  if (status === 'available') return 'Disponibile';
  if (isLowStock(status)) return 'Scorta bassa';
  if (isOutOfStock(status)) return 'Esaurito';
  return status;
};

export function ItemVariantsList({ variants, onEdit, onDelete, onAddVariant }: ItemVariantsListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Varianti ({variants.length})</h3>
        <Button onClick={onAddVariant} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Aggiungi Variante
        </Button>
      </div>
      
      {variants.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">Nessuna variante disponibile</p>
          <Button variant="outline" onClick={onAddVariant} className="mt-2">
            <Plus className="h-4 w-4 mr-1" /> Aggiungi la prima variante
          </Button>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colore</TableHead>
                <TableHead>Taglia</TableHead>
                <TableHead>Quantità</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: variant.color }}
                    ></div>
                    {getColorDescription(variant.color)}
                  </TableCell>
                  <TableCell>{variant.size}</TableCell>
                  <TableCell>{variant.quantity}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={variant.status === 'available' ? 'default' : 'outline'}
                      className={cn(
                        isLowStock(variant.status) && 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
                        isOutOfStock(variant.status) && 'bg-red-100 text-red-800 hover:bg-red-100'
                      )}
                    >
                      {getStatusDisplayText(variant.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => onEdit(variant)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifica</span>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(variant)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Elimina</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
