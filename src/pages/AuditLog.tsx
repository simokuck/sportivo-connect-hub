
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  AlertCircle, 
  Calendar, 
  ChevronDown,
  Download,
  Filter, 
  Info, 
  Search, 
  User
} from 'lucide-react';

// Mock data for audit logs
const auditLogs = [
  {
    id: "1",
    user: "Marco Rossi",
    action: "login",
    resource: "auth",
    details: "Login successful",
    ip: "192.168.1.1",
    timestamp: "2025-04-22T08:30:45Z",
    severity: "info"
  },
  {
    id: "2",
    user: "Admin",
    action: "create",
    resource: "team",
    details: "Created new team 'Juventus U-16'",
    ip: "192.168.1.5",
    timestamp: "2025-04-22T09:15:22Z",
    severity: "info"
  },
  {
    id: "3",
    user: "Giulia Bianchi",
    action: "update",
    resource: "player",
    details: "Updated player profile for 'Alessandro Verdi'",
    ip: "192.168.1.10",
    timestamp: "2025-04-21T14:22:36Z",
    severity: "info"
  },
  {
    id: "4",
    user: "System",
    action: "error",
    resource: "database",
    details: "Failed database connection",
    ip: "localhost",
    timestamp: "2025-04-21T02:45:12Z",
    severity: "error"
  },
  {
    id: "5",
    user: "Admin",
    action: "delete",
    resource: "document",
    details: "Deleted document 'player_contract.pdf'",
    ip: "192.168.1.5",
    timestamp: "2025-04-20T16:30:10Z",
    severity: "warning"
  },
  {
    id: "6",
    user: "Paolo Neri",
    action: "update",
    resource: "settings",
    details: "Modified system settings",
    ip: "192.168.1.15",
    timestamp: "2025-04-20T11:05:33Z",
    severity: "warning"
  },
  {
    id: "7",
    user: "Marco Rossi",
    action: "create",
    resource: "event",
    details: "Created new training event",
    ip: "192.168.1.1",
    timestamp: "2025-04-19T09:45:21Z",
    severity: "info"
  },
  {
    id: "8",
    user: "System",
    action: "backup",
    resource: "database",
    details: "Automatic backup completed",
    ip: "localhost",
    timestamp: "2025-04-19T03:00:00Z",
    severity: "info"
  }
];

// Format date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Get severity icon
const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case "info":
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

// Get severity badge variant
const getSeverityVariant = (severity: string) => {
  switch (severity) {
    case "error":
      return "destructive";
    case "warning":
      return "warning";
    case "info":
    default:
      return "info";
  }
};

const AuditLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedResource, setSelectedResource] = useState<string>("all");
  
  // Filter logs based on search and filters
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = selectedSeverity === "all" || log.severity === selectedSeverity;
    const matchesResource = selectedResource === "all" || log.resource === selectedResource;
    
    return matchesSearch && matchesSeverity && matchesResource;
  });
  
  // Get unique resources for filter
  const resources = Array.from(new Set(auditLogs.map(log => log.resource)));

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Registro Attività</h1>
          <p className="text-muted-foreground">
            Monitora e analizza le attività e gli eventi di sistema
          </p>
        </div>
        <Button variant="outline" className="mt-4 md:mt-0">
          <Download className="mr-2 h-4 w-4" />
          Esporta Log
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Filtri</CardTitle>
          <CardDescription>
            Filtra i log per trovare informazioni specifiche
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Cerca nei log..." 
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Filtra per severità" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le severità</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedResource} onValueChange={setSelectedResource}>
              <SelectTrigger>
                <SelectValue placeholder="Filtra per risorsa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le risorse</SelectItem>
                {resources.map(resource => (
                  <SelectItem key={resource} value={resource}>
                    {resource.charAt(0).toUpperCase() + resource.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Log di Sistema</CardTitle>
          <CardDescription>
            {filteredLogs.length} record trovati
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severità</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Utente</TableHead>
                  <TableHead>Azione</TableHead>
                  <TableHead>Risorsa</TableHead>
                  <TableHead>Dettagli</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant={getSeverityVariant(log.severity)} className="flex items-center justify-center w-24">
                          {getSeverityIcon(log.severity)}
                          <span className="ml-1 capitalize">{log.severity}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          {log.user}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{log.action}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {log.resource}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.details}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span className="sr-only">Azioni</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Vedi dettagli</DropdownMenuItem>
                            <DropdownMenuItem>Esporta</DropdownMenuItem>
                            <DropdownMenuItem>Filtra simili</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      Nessun record trovato
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
