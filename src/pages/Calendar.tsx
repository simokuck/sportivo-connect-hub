import React, { useState } from 'react';
import { CalendarDays } from "lucide-react";
import { Team } from "@/types";

// Mock data
const mockEvents = [
  {
    id: "1",
    title: "Allenamento Mattutino",
    date: new Date(),
    time: "10:00 - 12:00",
    location: "Campo Sportivo Comunale",
    teamId: "1",
  },
  {
    id: "2",
    title: "Partita Amichevole",
    date: new Date(),
    time: "15:00 - 17:00",
    location: "Stadio Olimpico",
    teamId: "2",
  },
  {
    id: "3",
    title: "Riunione Tecnica",
    date: new Date(),
    time: "18:00 - 19:00",
    location: "Sede Societaria",
    teamId: "1",
  },
];

const mockTeams: Team[] = [
  { id: '1', name: 'Prima Squadra', category: 'Senior' },
  { id: '2', name: 'Under 19', category: 'Youth' },
  { id: '3', name: 'Under 17', category: 'Youth' },
];

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
  const [events, setEvents] = useState(mockEvents);
  const [teams, setTeams] = useState(mockTeams);
  const { user } = useAuth();
  
  const { toast } = useToast(); 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  // Aggiungiamo la funzione per gestire l'importazione del calendario
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  
  const handleImportCalendar = () => {
    if (!selectedFile || !selectedTeam) {
      toast({
        title: "Errore",
        description: "Seleziona un file e una squadra",
        variant: "destructive"
      });
      return;
    }
    
    // Qui andrebbe implementata la logica per elaborare il file
    // Per ora mostriamo un messaggio di successo
    
    toast({
      title: "Importazione completata",
      description: `Calendario importato per ${selectedTeam}`,
    });
    
    setIsImportDialogOpen(false);
    setSelectedFile(null);
    setSelectedTeam("");
  };
  
  return (
    <div className="container py-6">
      {user?.role === "admin" && (
        <div className="mb-6">
          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                Importa Calendario Gare
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importa Calendario Gare</DialogTitle>
                <DialogDescription>
                  Carica un file CSV o Excel con il calendario gare per una squadra
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="team" className="text-sm font-medium">Squadra</label>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona una squadra" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="file" className="text-sm font-medium">File</label>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input 
                      id="file" 
                      type="file" 
                      accept=".csv,.xlsx,.xls" 
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Formati supportati: CSV, Excel (.xlsx, .xls)
                    </p>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                  Annulla
                </Button>
                <Button onClick={handleImportCalendar}>
                  Importa Calendario
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
      
      <h1 className="text-3xl font-bold mb-6">Calendario</h1>
      
      <div className="flex flex-col space-y-6">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>
                {event.date.toLocaleDateString()} - {event.time}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Location: {event.location}</p>
            </CardContent>
            <CardFooter>
              <Button>View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
