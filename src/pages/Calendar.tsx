import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, EventFormValues } from "@/schemas/eventSchema";
import { Event } from '@/types';
import { cn } from "@/lib/utils";
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import EventsList from '@/components/calendar/EventsList';
import ImportDialog from '@/components/calendar/ImportDialog';
import CreateEventDialog from '@/components/calendar/dialogs/CreateEventDialog';
import EditEventDialog from '@/components/calendar/dialogs/EditEventDialog';
import CalendarView from '@/components/calendar/advanced/CalendarView';
import { useEventNotifications } from '@/hooks/useEventNotifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, List } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CalendarProps {
  className?: string;
}

const CalendarPage: React.FC<CalendarProps> = ({ className }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [teams] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<string>("advanced");
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  const { createEvent, updateEvent, deleteEvent } = useCalendarEvents();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role_id, roles(name)')
        .eq('user_id', user.id);

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*');
      
      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      const transformedEvents = (data || []).map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || "",
        start: new Date(event.start_time).toISOString(),
        end: new Date(event.end_time).toISOString(),
        type: event.type as "training" | "match" | "medical" | "meeting",
        location: event.location || "",
        recipients: [], // Default empty array since it's required
        teamId: event.team_id,
        requiresMedical: event.requires_medical || false,
        canEdit: event.can_edit ?? true,
      }));

      setEvents(transformedEvents);
    };

    fetchEvents();
  }, [user]);

  const { notifyEventCreated, notifyEventUpdated, notifyEventDeleted } = useEventNotifications();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      start: "",
      end: "",
      type: "training" as const,
      location: "",
      recipients: [],
      requiresMedical: false,
      lat: undefined,
      lng: undefined,
      teamId: undefined,
    },
  });

  const handleLocationChange = useCallback((location: string, coords?: { lat: number; lng: number }) => {
    form.setValue("location", location);
    if (coords) {
      form.setValue("lat", coords.lat);
      form.setValue("lng", coords.lng);
    }
  }, [form]);

  const handleCreateEvent = async (data: EventFormValues) => {
    try {
      const { data: newEventData, error } = await supabase
        .from('calendar_events')
        .insert({
          title: data.title,
          description: data.description,
          start_time: new Date(data.start).toISOString(),
          end_time: new Date(data.end).toISOString(),
          type: data.type,
          location: data.location,
          team_id: data.teamId,
          requires_medical: data.requiresMedical
        })
        .select()
        .single();

      if (error) throw error;

      const newEvent = {
        id: newEventData.id,
        title: newEventData.title,
        description: newEventData.description || "",
        start: new Date(newEventData.start_time).toISOString(),
        end: new Date(newEventData.end_time).toISOString(),
        type: newEventData.type as "training" | "match" | "medical" | "meeting",
        location: newEventData.location || "",
        recipients: data.recipients || [],
        teamId: newEventData.team_id,
        requiresMedical: newEventData.requires_medical || false,
        canEdit: newEventData.can_edit ?? true
      };

      setEvents(prev => [...prev, newEvent]);
      setIsCreateDialogOpen(false);
      notifyEventCreated(newEvent);
      toast.success("Evento creato con successo");
      
      form.reset();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error("Errore nella creazione dell'evento");
    }
  };

  const handleUpdateEvent = async (data: EventFormValues) => {
    if (!selectedEvent) return;
    
    try {
      const { error } = await supabase
        .from('calendar_events')
        .update({
          title: data.title,
          description: data.description,
          start_time: new Date(data.start).toISOString(),
          end_time: new Date(data.end).toISOString(),
          type: data.type,
          location: data.location,
          team_id: data.teamId,
          requires_medical: data.requiresMedical
        })
        .eq('id', selectedEvent.id);

      if (error) throw error;

      const updatedEvent = {
        ...selectedEvent,
        title: data.title,
        description: data.description || "",
        start: new Date(data.start).toISOString(),
        end: new Date(data.end).toISOString(),
        type: data.type,
        location: data.location || "",
        teamId: data.teamId,
        requiresMedical: data.requiresMedical || false
      };

      setEvents(prev => 
        prev.map(event => event.id === selectedEvent.id ? updatedEvent : event)
      );
      
      setIsEditDialogOpen(false);
      notifyEventUpdated(updatedEvent);
      setSelectedEvent(null);
      toast.success("Evento aggiornato con successo");
      
      form.reset({
        title: "",
        description: "",
        start: "",
        end: "",
        type: "training" as const,
        location: "",
        recipients: [],
        requiresMedical: false,
        lat: undefined,
        lng: undefined,
        teamId: undefined,
      });
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error("Errore nell'aggiornamento dell'evento");
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', selectedEvent.id);

      if (error) throw error;
      
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
      notifyEventDeleted(selectedEvent);
      setIsEditDialogOpen(false);
      setSelectedEvent(null);
      toast.success("Evento eliminato con successo");
      form.reset();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error("Errore nell'eliminazione dell'evento");
    }
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    form.reset({
      title: event.title,
      description: event.description || "",
      start: new Date(event.start).toISOString().slice(0, 16),
      end: new Date(event.end).toISOString().slice(0, 16),
      type: event.type,
      location: event.location || "",
      recipients: event.recipients || [],
      teamId: event.teamId,
      requiresMedical: event.requiresMedical || false,
      lat: event.lat,
      lng: event.lng,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <CalendarHeader 
        date={date}
        setDate={setDate}
        onImportClick={() => setImportDialogOpen(true)}
        onAddEventClick={() => setIsCreateDialogOpen(true)}
        showDatePicker={activeView === "list"}
      />

      <Tabs 
        defaultValue="advanced" 
        value={activeView}
        onValueChange={setActiveView}
        className="flex-1 flex flex-col"
      >
        <TabsList className="mx-auto mb-2">
          <TabsTrigger value="advanced" className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>Calendario</span>
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-1">
            <List className="h-4 w-4" />
            <span>Lista</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="advanced" className="flex-1 overflow-y-auto data-[state=active]:flex-1">
          <CalendarView 
            events={events}
            onEventSelect={handleEventSelect}
          />
        </TabsContent>
        
        <TabsContent value="list" className="flex-1 overflow-y-auto p-4">
          <EventsList 
            events={events}
            setEvents={setEvents}
            onEventSelect={handleEventSelect}
          />
        </TabsContent>
      </Tabs>

      <CreateEventDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        form={form}
        onSubmit={handleCreateEvent}
        teams={teams}
        handleLocationChange={handleLocationChange}
      />

      <EditEventDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        form={form}
        onSubmit={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        teams={teams}
        handleLocationChange={handleLocationChange}
      />

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
