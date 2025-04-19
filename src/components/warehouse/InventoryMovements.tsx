
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { InventoryMovement, BaseItem, ItemVariant } from '@/types/warehouse';
import { ArrowDown, ArrowUp, CalendarIcon, Filter, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { it } from 'date-fns/locale';

interface InventoryMovementsProps {
  movements: (InventoryMovement & { 
    baseItem?: BaseItem, 
    variant?: ItemVariant,
    playerName?: string
  })[];
  onAddMovement: () => void;
}

export function InventoryMovements({ movements, onAddMovement }: InventoryMovementsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredMovements = movements.filter(movement => {
    const matchesSearch = 
      (movement.baseItem?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (movement.variant?.color?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (movement.variant?.size?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (movement.playerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesType = filterType === 'all' || movement.type === filterType;
    
    const matchesDate = !filterDate || 
      format(new Date(movement.date), 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd');
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getMovementTypeLabel = (type: string) => {
    switch(type) {
      case 'in': return 'Carico';
      case 'out': return 'Scarico';
      case 'assign': return 'Assegnazione';
      case 'return': return 'Restituzione';
      case 'lost': return 'Smarrimento';
      case 'damaged': return 'Danneggiamento';
      default: return type;
    }
  };
  
  const getMovementTypeVariant = (type: string) => {
    switch(type) {
      case 'in': 
      case 'return': 
        return 'default';
      case 'out': 
      case 'assign': 
        return 'outline';
      case 'lost': 
      case 'damaged': 
        return 'destructive';
      default: 
        return 'secondary';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Movimenti Magazzino</h2>
        <Button onClick={onAddMovement}>
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Movimento
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cerca articoli o giocatori..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="sm:w-auto w-full"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtri {isFilterOpen ? '▲' : '▼'}
        </Button>
      </div>
      
      {isFilterOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-background rounded-md border mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo movimento</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tutti i tipi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i tipi</SelectItem>
                <SelectItem value="in">Carico</SelectItem>
                <SelectItem value="out">Scarico</SelectItem>
                <SelectItem value="assign">Assegnazione</SelectItem>
                <SelectItem value="return">Restituzione</SelectItem>
                <SelectItem value="lost">Smarrimento</SelectItem>
                <SelectItem value="damaged">Danneggiamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterDate ? format(filterDate, 'PPP', { locale: it }) : 'Seleziona data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filterDate}
                    onSelect={setFilterDate}
                    locale={it}
                  />
                </PopoverContent>
              </Popover>
              {filterDate && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setFilterDate(undefined)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Articolo</TableHead>
              <TableHead>Variante</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Quantità</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Operatore</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Nessun movimento trovato
                </TableCell>
              </TableRow>
            ) : (
              filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{format(new Date(movement.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                  <TableCell>{movement.baseItem?.name || '-'}</TableCell>
                  <TableCell>
                    {movement.variant ? (
                      <div>
                        <span className="font-medium">{movement.variant.size}</span>,{' '}
                        <span className="flex items-center gap-1 inline-flex">
                          <div 
                            className="w-3 h-3 rounded-full border inline-block" 
                            style={{ backgroundColor: movement.variant.color }}
                          />
                          {movement.variant.color}
                        </span>
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getMovementTypeVariant(movement.type)}>
                      {getMovementTypeLabel(movement.type)}
                      {movement.type === 'in' || movement.type === 'return' ? (
                        <ArrowDown className="ml-1 h-3 w-3" />
                      ) : movement.type === 'out' || movement.type === 'assign' ? (
                        <ArrowUp className="ml-1 h-3 w-3" />
                      ) : null}
                    </Badge>
                    {movement.playerName && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {movement.playerName}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {movement.type === 'in' || movement.type === 'return' ? '+' : '-'}
                    {movement.quantity}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {movement.notes || '-'}
                  </TableCell>
                  <TableCell>{movement.performedBy || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
