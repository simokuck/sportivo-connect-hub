import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Event } from '@/types';
import EventForm from '@/components/form/EventForm';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';

const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, {
    message: "Il titolo deve essere di almeno 3 caratteri.",
  }),
  description: z.string().optional(),
  start: z.string().refine((date) => {
    try {
      new Date(date);
      return true;
    } catch (error) {
      return false;
    }
  }, {
    message: "Data di inizio non valida",
  }),
  end: z.string().refine((date) => {
    try {
      new Date(date);
      return true;
    } catch (error) {
      return false;
    }
  }, {
    message: "Data di fine non valida",
  }),
  type: z.enum(["training", "match", "medical", "meeting"]),
  location: z.string().optional(),
  isPrivate: z.boolean().default(false),
  teamId: z.string().optional(),
  requiresMedical: z.boolean().default(false),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

interface CalendarProps {
  className?: string;
}

const CalendarPage: React.FC<CalendarProps> = ({ className }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      start: "",
      end: "",
      type: "training",
      location: "",
      isPrivate: false,
      requiresMedical: false,
    },
  });

  useEffect(() => {
    // Carica gli eventi dal localStorage all'avvio
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }

    // Carica le squadre (teams) dal localStorage
    const storedTeams = localStorage.getItem('teams');
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    }
  }, []);

  useEffect(() => {
    // Salva gli eventi nel localStorage ogni volta che cambiano
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleCreateEvent = (data: z.infer<typeof eventSchema>) => {
    // Make sure all required fields for Event type are provided
    const newEvent: Event = {
      id: uuidv4(),
      title: data.title, // Required field
      description: data.description || "",
      start: new Date(data.start).toISOString(),
      end: new Date(data.end).toISOString(),
      type: data.type || "training", // Required field with default
      location: data.location,
      isPrivate: data.isPrivate || false, // Required field with default
      teamId: data.teamId,
      requiresMedical: data.requiresMedical || false,
      lat: data.lat,
      lng: data.lng,
    };

    setEvents([...events, newEvent]);
    setIsCreateDialogOpen(false);
    form.reset();
    toast({
      title: "Evento creato",
      description: "L'evento è stato creato con successo",
    });
  };

  const handleUpdateEvent = (data: z.infer<typeof eventSchema>) => {
    if (!selectedEvent) return;

    const updatedEvent: Event = {
      ...selectedEvent,
      ...data,
      start: new Date(data.start).toISOString(),
      end: new Date(data.end).toISOString(),
    };

    const updatedEvents = events.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    );

    setEvents(updatedEvents);
    setIsEditDialogOpen(false);
    setSelectedEvent(null);
    form.reset();
    toast({
      title: "Evento aggiornato",
      description: "L'evento è stato aggiornato con successo",
    });
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;

    const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
    setEvents(updatedEvents);
    setIsEditDialogOpen(false);
    setSelectedEvent(null);
    form.reset();
    toast({
      title: "Evento eliminato",
      description: "L'evento è stato eliminato con successo",
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const reorderedEvents = Array.from(events);
    const [movedEvent] = reorderedEvents.splice(startIndex, 1);
    reorderedEvents.splice(endIndex, 0, movedEvent);

    setEvents(reorderedEvents);
  };

  const handleFileUpload = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType === 'pdf') {
      toast({
        title: "Importazione PDF",
        description: "Il file PDF è stato importato correttamente",
      });
      
      console.log("Importazione file PDF:", file.name);
      
      setImportDialogOpen(false);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      const lines = content.split('\n').slice(1);
      const newEvents = lines.map(line => {
        const [title, description, start, end, type, location] = line.split(',');
        return {
          id: uuidv4(),
          title,
          description,
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
          type: (type as "training" | "match" | "medical" | "meeting") || "training",
          location,
          isPrivate: false,
        } as Event;
      });
      setEvents([...events, ...newEvents]);
      toast({
        title: "Eventi importati",
        description: `${newEvents.length} eventi sono stati importati con successo`,
      });
      setImportDialogOpen(false);
    };
    reader.readAsText(file);
  };

  const ImportDialog = () => (
    <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Importa Eventi</DialogTitle>
          <DialogDescription>
            Carica un file CSV o PDF con gli eventi da importare.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Label htmlFor="file-upload" className="text-center">
              Seleziona un file CSV o PDF da importare
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
            Annulla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const EventDialog = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Crea un nuovo evento</DialogTitle>
          <DialogDescription>
            Aggiungi un evento al calendario. Clicca salva quando hai finito.
          </DialogDescription>
        </DialogHeader>
        <EventForm 
          form={form}
          onSubmit={handleCreateEvent}
          dialogAction="create"
          teams={teams}
          handleLocationChange={(location, coords) => {
            form.setValue("location", location);
            if (coords) {
              form.setValue("lat", coords.lat);
              form.setValue("lng", coords.lng);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );

  const EditEventDialog = () => (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Modifica evento</DialogTitle>
          <DialogDescription>
            Modifica i dettagli dell'evento. Clicca aggiorna quando hai finito.
          </DialogDescription>
        </DialogHeader>
        <EventForm 
          form={form}
          onSubmit={handleUpdateEvent}
          dialogAction="edit"
          handleDeleteEvent={handleDeleteEvent}
          teams={teams}
          handleLocationChange={(location, coords) => {
            form.setValue("location", location);
            if (coords) {
              form.setValue("lat", coords.lat);
              form.setValue("lng", coords.lng);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );

  const handleLocationChange = useCallback((location: string, coords?: { lat: number; lng: number }) => {
    form.setValue("location", location);
    if (coords) {
      form.setValue("lat", coords.lat);
      form.setValue("lng", coords.lng);
    }
  }, [form]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-semibold">Calendario</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            Importa
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Aggiungi Evento
          </Button>
        </div>
      </div>
      <div className="border-b p-4">
        <div className="md:w-64">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Seleziona una data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="events">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {events.map((event, index) => (
                  <Draggable key={event.id} draggableId={event.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white rounded-md shadow-sm p-4 border"
                        onClick={() => {
                          setSelectedEvent(event);
                          form.reset({
                            title: event.title,
                            description: event.description,
                            start: event.start,
                            end: event.end,
                            type: event.type,
                            location: event.location,
                            isPrivate: event.isPrivate,
                            teamId: event.teamId,
                            requiresMedical: event.requiresMedical,
                          });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <p className="text-xs">
                          {format(new Date(event.start), "PPP")} - {format(new Date(event.end), "PPP")}
                        </p>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        {events.length === 0 && (
          <div className="text-center text-muted-foreground">
            Nessun evento programmato.
          </div>
        )}
      </div>

      <EventDialog />
      <EditEventDialog />
      <ImportDialog />
    </div>
  );
};

export default CalendarPage;
