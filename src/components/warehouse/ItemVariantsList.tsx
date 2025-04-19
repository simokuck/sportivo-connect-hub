
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BaseItem, ItemVariant } from '@/types/warehouse';
import { Edit, Plus, Trash2, ArrowRight, Warehouse, UserPlus } from 'lucide-react';

interface ItemVariantsListProps {
  baseItem: BaseItem;
  variants: ItemVariant[];
  onAddVariant: (baseItem: BaseItem) => void;
  onEditVariant: (variant: ItemVariant) => void;
  onDeleteVariant: (variant: ItemVariant) => void;
  onAdjustStock: (variant: ItemVariant) => void;
  onAssignToPlayer: (variant: ItemVariant) => void;
  onBack: () => void;
}

export function ItemVariantsList({
  baseItem,
  variants,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
  onAdjustStock,
  onAssignToPlayer,
  onBack
}: ItemVariantsListProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
          Indietro
        </Button>
        <h2 className="text-xl font-bold">{baseItem.name}</h2>
        <Badge>{baseItem.category}</Badge>
        {baseItem.brand && <Badge variant="outline">{baseItem.brand}</Badge>}
      </div>
      
      <div className="p-4 border rounded-md mb-4 bg-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Codice SKU: {baseItem.sku}</p>
            {baseItem.description && <p>{baseItem.description}</p>}
          </div>
          {baseItem.image && (
            <div className="flex justify-end">
              <div className="w-24 h-24 rounded-md overflow-hidden">
                <img src={baseItem.image} alt={baseItem.name} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Varianti ({variants.length})</h3>
        <Button onClick={() => onAddVariant(baseItem)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuova Variante
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Taglia</TableHead>
              <TableHead>Colore</TableHead>
              <TableHead>Quantità</TableHead>
              <TableHead>Soglia</TableHead>
              <TableHead>Posizione</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Nessuna variante per questo articolo
                </TableCell>
              </TableRow>
            ) : (
              variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell className="font-mono text-sm">{variant.uniqueSku}</TableCell>
                  <TableCell>{variant.size}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border" 
                        style={{ backgroundColor: variant.color }}
                      />
                      {variant.color}
                    </div>
                  </TableCell>
                  <TableCell>{variant.quantity}</TableCell>
                  <TableCell>{variant.minimumThreshold}</TableCell>
                  <TableCell>{variant.location || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={
                      variant.status === 'low' ? "secondary" : 
                      variant.status === 'out' ? "destructive" : 
                      "outline"
                    }>
                      {variant.status === 'available' ? 'Disponibile' : 
                       variant.status === 'low' ? 'Scorta bassa' : 
                       variant.status === 'out' ? 'Esaurito' : variant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onAdjustStock(variant)}
                        title="Movimento magazzino"
                      >
                        <Warehouse className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onAssignToPlayer(variant)}
                        title="Assegna a giocatore"
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEditVariant(variant)}
                        title="Modifica"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDeleteVariant(variant)}
                        title="Elimina"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
