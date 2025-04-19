
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ItemAssignment, BaseItem, ItemVariant } from '@/types/warehouse';
import { Filter, Search, Plus, CalendarIcon, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Player } from '@/types';

interface ItemAssignmentsProps {
  assignments: (ItemAssignment & { 
    baseItem?: BaseItem, 
    variant?: ItemVariant 
  })[];
  players: Player[];
  onAddAssignment: () => void;
  onMarkReturned: (assignment: ItemAssignment) => void;
}

export function ItemAssignments({ 
  assignments, 
  players,
  onAddAssignment, 
  onMarkReturned 
}: ItemAssignmentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlayer, setFilterPlayer] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [view, setView] = useState<'items' | 'players'>('players');

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      (assignment.baseItem?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (assignment.variant?.color?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (assignment.variant?.size?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (assignment.playerName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPlayer = filterPlayer === 'all' || assignment.playerId === filterPlayer;
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    
    return matchesSearch && matchesPlayer && matchesStatus;
  });

  // Group assignments by player
  const assignmentsByPlayer = players.map(player => {
    const playerAssignments = filteredAssignments.filter(
      assignment => assignment.playerId === player.id
    );
    return {
      player,
      assignments: playerAssignments,
      totalAssigned: playerAssignments.length,
      notReturned: playerAssignments.filter(a => a.status === 'assigned').length
    };
  }).filter(group => group.totalAssigned > 0);

  // Group assignments by item
  const assignmentsByItem = [...new Set(filteredAssignments.map(a => a.baseItem?.id))].map(itemId => {
    const itemAssignments = filteredAssignments.filter(a => a.baseItem?.id === itemId);
    const baseItem = itemAssignments[0]?.baseItem;
    return {
      baseItem,
      assignments: itemAssignments,
      totalAssigned: itemAssignments.length,
      notReturned: itemAssignments.filter(a => a.status === 'assigned').length
    };
  }).filter(group => !!group.baseItem);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Assegnazioni</h2>
        <Button onClick={onAddAssignment}>
          <Plus className="mr-2 h-4 w-4" />
          Nuova Assegnazione
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cerca giocatori o articoli..." 
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
            <label className="block text-sm font-medium mb-1">Giocatore</label>
            <Select value={filterPlayer} onValueChange={setFilterPlayer}>
              <SelectTrigger>
                <SelectValue placeholder="Tutti i giocatori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i giocatori</SelectItem>
                {players.map(player => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.firstName} {player.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stato</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Tutti gli stati" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="assigned">Assegnato</SelectItem>
                <SelectItem value="returned">Restituito</SelectItem>
                <SelectItem value="pending">In attesa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="players" className="w-full" value={view} onValueChange={(v: string) => setView(v as 'items' | 'players')}>
        <TabsList className="mb-4">
          <TabsTrigger value="players">Per Giocatore</TabsTrigger>
          <TabsTrigger value="items">Per Articolo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="players">
          {assignmentsByPlayer.length === 0 ? (
            <div className="text-center p-4 bg-muted/20 rounded-md">
              <p>Nessuna assegnazione trovata con i filtri selezionati</p>
            </div>
          ) : (
            assignmentsByPlayer.map(({ player, assignments, notReturned }) => (
              <div key={player.id} className="mb-6 border rounded-md overflow-hidden">
                <div className="bg-muted/30 p-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {player.firstName} {player.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {assignments.length} articoli assegnati, {notReturned} da restituire
                    </p>
                  </div>
                  <Badge variant={notReturned > 0 ? "secondary" : "outline"}>
                    {notReturned > 0 ? `${notReturned} non restituiti` : "Tutto restituito"}
                  </Badge>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Articolo</TableHead>
                      <TableHead>Variante</TableHead>
                      <TableHead>Quantità</TableHead>
                      <TableHead>Data Assegnazione</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.baseItem?.name || '-'}</TableCell>
                        <TableCell>
                          {assignment.variant ? (
                            <div>
                              <span className="font-medium">{assignment.variant.size}</span>,{' '}
                              <span className="flex items-center gap-1 inline-flex">
                                <div 
                                  className="w-3 h-3 rounded-full border inline-block" 
                                  style={{ backgroundColor: assignment.variant.color }}
                                />
                                {assignment.variant.color}
                              </span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>{assignment.quantity}</TableCell>
                        <TableCell>
                          {format(new Date(assignment.assignDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            assignment.status === 'assigned' ? "secondary" : 
                            assignment.status === 'returned' ? "outline" : 
                            "default"
                          }>
                            {assignment.status === 'assigned' ? 'Assegnato' : 
                             assignment.status === 'returned' ? 'Restituito' : 
                             'In attesa'}
                          </Badge>
                          {assignment.returnDate && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Restituito il {format(new Date(assignment.returnDate), 'dd/MM/yyyy')}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {assignment.status === 'assigned' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => onMarkReturned(assignment)}
                            >
                              <Check className="h-3 w-3" />
                              Segna restituito
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="items">
          {assignmentsByItem.length === 0 ? (
            <div className="text-center p-4 bg-muted/20 rounded-md">
              <p>Nessuna assegnazione trovata con i filtri selezionati</p>
            </div>
          ) : (
            assignmentsByItem.map(({ baseItem, assignments, notReturned }) => (
              <div key={baseItem?.id} className="mb-6 border rounded-md overflow-hidden">
                <div className="bg-muted/30 p-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {baseItem?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {assignments.length} assegnazioni, {notReturned} attive
                    </p>
                  </div>
                  {baseItem?.image && (
                    <div className="w-10 h-10 rounded overflow-hidden">
                      <img 
                        src={baseItem.image} 
                        alt={baseItem.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Giocatore</TableHead>
                      <TableHead>Variante</TableHead>
                      <TableHead>Quantità</TableHead>
                      <TableHead>Data Assegnazione</TableHead>
                      <TableHead>Stato</TableHead>
                      <TableHead>Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.playerName}</TableCell>
                        <TableCell>
                          {assignment.variant ? (
                            <div>
                              <span className="font-medium">{assignment.variant.size}</span>,{' '}
                              <span className="flex items-center gap-1 inline-flex">
                                <div 
                                  className="w-3 h-3 rounded-full border inline-block" 
                                  style={{ backgroundColor: assignment.variant.color }}
                                />
                                {assignment.variant.color}
                              </span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>{assignment.quantity}</TableCell>
                        <TableCell>
                          {format(new Date(assignment.assignDate), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            assignment.status === 'assigned' ? "secondary" : 
                            assignment.status === 'returned' ? "outline" : 
                            "default"
                          }>
                            {assignment.status === 'assigned' ? 'Assegnato' : 
                             assignment.status === 'returned' ? 'Restituito' : 
                             'In attesa'}
                          </Badge>
                          {assignment.returnDate && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Restituito il {format(new Date(assignment.returnDate), 'dd/MM/yyyy')}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {assignment.status === 'assigned' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => onMarkReturned(assignment)}
                            >
                              <Check className="h-3 w-3" />
                              Segna restituito
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
