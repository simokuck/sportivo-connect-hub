
import React, { useState } from 'react';
import { CalendarDays } from "lucide-react";
import { Team } from "@/types";
import { useAuth } from '@/context/AuthContext';
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useForm, FormProvider } from "react-hook-form";

// Mock data
const mockEvents = [
  {
    id: "1",
    title: "Allenamento Mattutino",
    date: new Date(),
    time: "10:00 - 12:00",
    location: "Campo Sportivo Comunale",
    teamId: "1",
    description: "Allenamento focalizzato su tecnica e tattica."
  },
  {
    id: "2",
    title: "Partita Amichevole",
    date: new Date(),
    time: "15:00 - 17:00",
    location: "Stadio Olimpico",
    teamId: "2",
    description: "Partita amichevole contro la squadra locale."
  },
  {
    id: "3",
    title: "Riunione Tecnica",
    date: new Date(),
    time: "18:00 - 19:00",
    location: "Sede Societaria",
    teamId: "1",
    description: "Analisi video e preparazione strategia."
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { DatePicker } from "@/components/ui/date-picker";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  teamId: string;
  description?: string;
}

interface EventDialogProps {
  event: Event | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: Event) => void;
}

const EventDialog: React.FC<EventDialogProps> = ({ event, isOpen, onOpenChange, onSave }) => {
  const [title, setTitle] = useState(event?.title || "");
  const [date, setDate] = useState<Date | undefined>(event?.date || new Date());
  const [time, setTime] = useState(event?.time || "");
  const [location, setLocation] = useState(event?.location || "");
  const [teamId, setTeamId] = useState(event?.teamId || "");
  const [description, setDescription] = useState(event?.description || "");
  
  const methods = useForm(); // Create a form instance for FormProvider
  
  const handleSave = () => {
    if (!title || !date || !time || !location || !teamId) {
      return;
    }
    
    onSave({
      id: event?.id || Math.random().toString(36).substr(2, 9),
      title,
      date: date!,
      time,
      location,
      teamId,
      description
    });
    
    onOpenChange(false);
    resetForm();
  };
  
  const resetForm = () => {
    setTitle("");
    setDate(new Date());
    setTime("");
    setLocation("");
    setTeamId("");
    setDescription("");
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? "Modifica Evento" : "Nuovo Evento"}</DialogTitle>
          <DialogDescription>
            {event ? "Modifica i dettagli dell'evento" : "Inserisci i dettagli del nuovo evento"}
          </DialogDescription>
        </DialogHeader>
        
        {/* Wrap the form content with FormProvider */}
        <FormProvider {...methods}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Titolo</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Inserisci un titolo"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">Data</label>
                <DatePicker
                  date={date}
                  setDate={setDate}
                  placeholder="Seleziona una data"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">Orario</label>
                <Input
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="es. 10:00 - 12:00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Luogo</label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Inserisci il luogo"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="team" className="text-sm font-medium">Squadra</label>
              <Select value={teamId} onValueChange={setTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona una squadra" />
                </SelectTrigger>
                <SelectContent>
                  {mockTeams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Descrizione</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrizione dell'evento (opzionale)"
                rows={3}
              />
            </div>
          </div>
        </FormProvider>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleSave}>
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface EventDetailsDialogProps {
  event: Event | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({ event, isOpen, onOpenChange, onEdit }) => {
  const teamName = event ? mockTeams.find(team => team.id === event.teamId)?.name || 'Nessuna squadra' : '';
  const methods = useForm(); // Create a form instance for FormProvider
  
  if (!event) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>
            {format(event.date, "EEEE d MMMM yyyy", { locale: it })}
          </DialogDescription>
        </DialogHeader>
        
        {/* Wrap the content with FormProvider to ensure any form components work properly */}
        <FormProvider {...methods}>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orario</p>
                <p className="text-sm">{event.time}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Squadra</p>
                <p className="text-sm">{teamName}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Luogo</p>
              <p className="text-sm">{event.location}</p>
            </div>
            
            {event.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Descrizione</p>
                <p className="text-sm">{event.description}</p>
              </div>
            )}
          </div>
        </FormProvider>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Chiudi
          </Button>
          <Button onClick={() => {
            onOpenChange(false);
            onEdit();
          }}>
            Modifica
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [teams, setTeams] = useState(mockTeams);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const [isViewEventDialogOpen, setIsViewEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Import form methods
  const importFormMethods = useForm();
  
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
  
  const handleSaveEvent = (event: Event) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
      toast({
        title: "Evento aggiornato",
        description: "L'evento è stato aggiornato con successo",
      });
    } else {
      // Add new event
      setEvents(prev => [...prev, event]);
      toast({
        title: "Evento creato",
        description: "Il nuovo evento è stato creato con successo",
      });
    }
  };
  
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditEventDialogOpen(true);
  };
  
  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsViewEventDialogOpen(true);
  };
  
  const filteredEvents = selectedDate 
    ? events.filter(event => 
        event.date.getDate() === selectedDate.getDate() && 
        event.date.getMonth() === selectedDate.getMonth() && 
        event.date.getFullYear() === selectedDate.getFullYear())
    : events;
  
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
              
              {/* Wrap the form content with FormProvider */}
              <FormProvider {...importFormMethods}>
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
              </FormProvider>
              
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
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calendario</h1>
        <div className="flex gap-4 items-center">
          {/* Wrap the DatePicker with FormProvider */}
          <FormProvider {...useForm()}>
            <DatePicker
              date={selectedDate}
              setDate={setSelectedDate}
              placeholder="Seleziona una data"
            />
          </FormProvider>
          <Button onClick={() => {
            setSelectedEvent(null);
            setIsNewEventDialogOpen(true);
          }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuovo Evento
          </Button>
        </div>
      </div>
      
      {/* Event Dialogs */}
      <EventDialog
        event={selectedEvent}
        isOpen={isNewEventDialogOpen}
        onOpenChange={setIsNewEventDialogOpen}
        onSave={handleSaveEvent}
      />
      
      <EventDialog
        event={selectedEvent}
        isOpen={isEditEventDialogOpen}
        onOpenChange={setIsEditEventDialogOpen}
        onSave={handleSaveEvent}
      />
      
      <EventDetailsDialog
        event={selectedEvent}
        isOpen={isViewEventDialogOpen}
        onOpenChange={setIsViewEventDialogOpen}
        onEdit={() => {
          setIsViewEventDialogOpen(false);
          setIsEditEventDialogOpen(true);
        }}
      />
      
      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const teamName = teams.find(team => team.id === event.teamId)?.name || 'Nessuna squadra';
            
            return (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    {format(event.date, "dd/MM/yyyy")} - {event.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-2"><span className="font-medium">Squadra:</span> {teamName}</p>
                  <p><span className="font-medium">Location:</span> {event.location}</p>
                  {event.description && (
                    <p className="mt-2 line-clamp-2">{event.description}</p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => handleViewEvent(event)}>
                    Visualizza Dettagli
                  </Button>
                  <Button onClick={() => handleEditEvent(event)}>
                    Modifica
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center">
          <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nessun evento trovato</h3>
          <p className="mt-2 text-muted-foreground">
            Non ci sono eventi per la data selezionata. Prova a selezionare un'altra data o crea un nuovo evento.
          </p>
        </div>
      )}
    </div>
  );
};

export default Calendar;
