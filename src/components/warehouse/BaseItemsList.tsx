
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BaseItem, ItemVariant } from '@/types/warehouse';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface BaseItemsListProps {
  items: (BaseItem & { variants: ItemVariant[] })[];
  onSelectItem: (item: BaseItem) => void;
  onEditItem: (item: BaseItem) => void;
  onDeleteItem: (item: BaseItem) => void;
  onAddItem: () => void;
}

export function BaseItemsList({ 
  items, 
  onSelectItem, 
  onEditItem, 
  onDeleteItem, 
  onAddItem 
}: BaseItemsListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Catalogo Articoli</h2>
        <Button onClick={onAddItem}>
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Articolo
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codice SKU</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Varianti</TableHead>
              <TableHead>Totale</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Nessun articolo presente nel catalogo
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const totalQuantity = item.variants.reduce((sum, variant) => sum + variant.quantity, 0);
                const hasLowStock = item.variants.some(v => v.status === 'low');
                const hasOutOfStock = item.variants.some(v => v.status === 'out');
                
                let status = 'available';
                if (hasOutOfStock) status = 'out';
                else if (hasLowStock) status = 'low';
                
                return (
                  <TableRow 
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>{item.sku}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.brand || '-'}</TableCell>
                    <TableCell>
                      <Badge>{item.variants.length}</Badge>
                    </TableCell>
                    <TableCell>{totalQuantity} pezzi</TableCell>
                    <TableCell>
                      <Badge variant={
                        status === 'low' ? "secondary" : 
                        status === 'out' ? "destructive" : 
                        "outline"
                      }>
                        {status === 'available' ? 'Disponibile' : 
                         status === 'low' ? 'Scorta bassa' : 
                         status === 'out' ? 'Esaurito' : status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditItem(item);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteItem(item);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
