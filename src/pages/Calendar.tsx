import React, { useState } from 'react';
import { Event } from '@/types';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/schemas/eventSchema";
import * as z from 'zod';
import EventForm from '@/components/form/EventForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CalendarHeader from '@/components/calendar/CalendarHeader';
import EventsList from '@/components/calendar/EventsList';
import ImportDialog from '@/components/calendar/ImportDialog';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
      recipients: [],
      requiresMedical: false,
    },
  });

  React.useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }

    const storedTeams = localStorage.getItem('teams');
    if (storedTeams) {
      setTeams(JSON.parse(storedTeams));
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleCreateEvent = (data: z.infer<typeof eventSchema>) => {
    const newEvent: Event = {
      id: uuidv4(),
      title: data.title,
      description: data.description || "",
      start: new Date(data.start).toISOString(),
      end: new Date(data.end).toISOString(),
      type: data.type || "training",
      location: data.location,
      recipients: data.recipients || [],
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

  const handleLocationChange = React.useCallback((location: string, coords?: { lat: number; lng: number }) => {
    form.setValue("location", location);
    if (coords) {
      form.setValue("lat", coords.lat);
      form.setValue("lng", coords.lng);
    }
  }, [form]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <CalendarHeader 
        date={date}
        setDate={setDate}
        onImportClick={() => setImportDialogOpen(true)}
        onAddEventClick={() => setIsCreateDialogOpen(true)}
      />

      <div className="flex-1 overflow-y-auto p-4">
        <EventsList 
          events={events}
          setEvents={setEvents}
          onEventSelect={(event) => {
            setSelectedEvent(event);
            form.reset({
              title: event.title,
              description: event.description,
              start: event.start,
              end: event.end,
              type: event.type,
              location: event.location,
              recipients: event.recipients,
              teamId: event.teamId,
              requiresMedical: event.requiresMedical,
            });
            setIsEditDialogOpen(true);
          }}
        />
      </div>

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
            handleLocationChange={handleLocationChange}
          />
        </DialogContent>
      </Dialog>

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
            handleLocationChange={handleLocationChange}
          />
        </DialogContent>
      </Dialog>

      <ImportDialog 
        isOpen={importDialogOpen}
        setIsOpen={setImportDialogOpen}
        events={events}
        setEvents={setEvents}
      />
    </div>
  );
};

export default CalendarPage;
