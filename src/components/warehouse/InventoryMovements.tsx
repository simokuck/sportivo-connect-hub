import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FileDown, Filter, Plus} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Movement} from "@/types/warehouse";
import {MovementTypeBadge} from './MovementTypeBadge';
import {MovementNote} from './MovementNote';
import {VariantDisplay} from './VariantDisplay';

interface InventoryMovementsProps {
  movements: Movement[];
  onAddMovement: () => void;
}

export const InventoryMovements = ({ movements, onAddMovement }: InventoryMovementsProps) => {
  const [filter, setFilter] = useState<string | null>(null);
  
  // Sort movements by date (newest first)
  const sortedMovements = [...movements].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Apply filter if set
  const filteredMovements = filter 
    ? sortedMovements.filter(m => m.type === filter)
    : sortedMovements;
  
  const exportToCSV = () => {
    // Implementation for CSV export
    console.log("Exporting movements to CSV");
  };
  
  return (
    <Card className="hover-card-highlight">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 space-y-0">
        <CardTitle className="text-xl">Movimenti Magazzino</CardTitle>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtri
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setFilter(null)}>
                Tutti
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('in')}>
                Solo carichi
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('out')}>
                Solo scarichi
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('assign')}>
                Solo assegnazioni
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setFilter('return')}>
                Solo resi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Esporta
          </Button>
          
          <Button onClick={onAddMovement} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Movimento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Data</TableHead>
              <TableHead>Articolo</TableHead>
              <TableHead>Variante</TableHead>
              <TableHead className="text-center">Quantità</TableHead>
              <TableHead className="text-center">Tipo</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Operatore</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  Nessun movimento trovato
                </TableCell>
              </TableRow>
            ) : (
              filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    {new Date(movement.date).toLocaleDateString('it-IT')}
                  </TableCell>
                  <TableCell>
                    {movement.baseItem?.name || "Articolo non disponibile"}
                  </TableCell>
                  <TableCell>
                    <VariantDisplay 
                      color={movement.color} 
                      size={movement.size} 
                      variant={movement.variant}
                    />
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {Math.abs(movement.quantity)}
                  </TableCell>
                  <TableCell className="text-center">
                    <MovementTypeBadge type={movement.type} />
                  </TableCell>
                  <TableCell>
                    <MovementNote note={movement.note} />
                  </TableCell>
                  <TableCell>
                    {movement.operator?.name || movement.userId || movement.performedBy || "Sistema"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InventoryMovements;
