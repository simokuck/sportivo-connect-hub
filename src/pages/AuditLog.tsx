import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Search, Filter, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UserRole } from '@/types';

// Mock data for audit logs
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    role: UserRole;
  };
  action: string;
  target: string;
  details: string;
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: new Date(2023, 3, 15, 10, 30),
    user: { id: '1', name: 'Marco Rossi', role: 'player' },
    action: 'login',
    target: 'system',
    details: 'Login effettuato con successo'
  },
  {
    id: '2',
    timestamp: new Date(2023, 3, 15, 11, 45),
    user: { id: '2', name: 'Paolo Bianchi', role: 'coach' },
    action: 'create',
    target: 'event',
    details: 'Creato nuovo evento: Allenamento del 16/04/2023'
  },
  {
    id: '3',
    timestamp: new Date(2023, 3, 15, 14, 15),
    user: { id: '3', name: 'Giuseppe Verdi', role: 'admin' },
    action: 'update',
    target: 'user',
    details: 'Aggiornato profilo utente: Marco Rossi'
  },
  {
    id: '4',
    timestamp: new Date(2023, 3, 16, 9, 10),
    user: { id: '4', name: 'Anna Ferrari', role: 'medical' },
    action: 'upload',
    target: 'document',
    details: 'Caricato nuovo documento medico per: Marco Rossi'
  },
  {
    id: '5',
    timestamp: new Date(2023, 3, 16, 15, 30),
    user: { id: '2', name: 'Paolo Bianchi', role: 'coach' },
    action: 'delete',
    target: 'event',
    details: 'Eliminato evento: Allenamento del 18/04/2023'
  },
  {
    id: '6',
    timestamp: new Date(2023, 3, 17, 10, 45),
    user: { id: '3', name: 'Giuseppe Verdi', role: 'admin' },
    action: 'create',
    target: 'team',
    details: 'Creata nuova squadra: Under 16'
  },
  {
    id: '7',
    timestamp: new Date(2023, 3, 17, 14, 20),
    user: { id: '1', name: 'Marco Rossi', role: 'player' },
    action: 'view',
    target: 'document',
    details: 'Visualizzato documento: Programma allenamenti'
  },
  {
    id: '8',
    timestamp: new Date(2023, 3, 18, 11, 15),
    user: { id: '4', name: 'Anna Ferrari', role: 'medical' },
    action: 'update',
    target: 'medical_record',
    details: 'Aggiornata scheda medica: Paolo Bianchi'
  }
];

const AuditLog = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const uniqueUsers = Array.from(new Set(mockAuditLogs.map(log => log.user.id)))
    .map(userId => mockAuditLogs.find(log => log.user.id === userId)?.user);

  const uniqueActions = Array.from(new Set(mockAuditLogs.map(log => log.action)));

  const applyFilters = () => {
    let filteredLogs = [...mockAuditLogs];
    
    // Search query filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.target.toLowerCase().includes(query) || 
        log.details.toLowerCase().includes(query) ||
        log.user.name.toLowerCase().includes(query)
      );
    }
    
    // Action filter
    if (actionFilter) {
      filteredLogs = filteredLogs.filter(log => log.action === actionFilter);
    }
    
    // User filter
    if (userFilter) {
      filteredLogs = filteredLogs.filter(log => log.user.id === userFilter);
    }
    
    // Date range filter
    if (startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= startDate);
    }
    
    if (endDate) {
      // Set end of day for the end date
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filteredLogs = filteredLogs.filter(log => log.timestamp <= endOfDay);
    }
    
    setLogs(filteredLogs);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setActionFilter('');
    setUserFilter('');
    setStartDate(undefined);
    setEndDate(undefined);
    setLogs(mockAuditLogs);
  };

  const formatActionType = (action: string) => {
    const actionMap: Record<string, string> = {
      'login': 'Login',
      'logout': 'Logout',
      'create': 'Creazione',
      'update': 'Modifica',
      'delete': 'Eliminazione',
      'upload': 'Caricamento',
      'view': 'Visualizzazione'
    };
    
    return actionMap[action] || action;
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Audit Log</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtra Log</CardTitle>
          <CardDescription>
            Filtra i log per utente, azione, data o cerca termini specifici
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Cerca</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca nei log..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Azione</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tutte le azioni" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le azioni</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>
                      {formatActionType(action)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Utente</label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tutti gli utenti" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti gli utenti</SelectItem>
                  {uniqueUsers.map(user => user && (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium mb-1 block">Data inizio</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : "Seleziona"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Data fine</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy") : "Seleziona"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={resetFilters}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={applyFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Applica Filtri
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Log di Sistema</CardTitle>
          <CardDescription>
            Visualizzazione di tutte le attività registrate nel sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data e Ora</TableHead>
                  <TableHead>Utente</TableHead>
                  <TableHead>Azione</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Dettagli</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {format(log.timestamp, "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <div>{log.user.name}</div>
                        <div className="text-xs text-muted-foreground">{log.user.role}</div>
                      </TableCell>
                      <TableCell>{formatActionType(log.action)}</TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nessun risultato trovato.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLog;
