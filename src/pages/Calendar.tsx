
import React, { useState, useCallback } from 'react';
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

  const { events, setEvents, createEvent, updateEvent, deleteEvent } = useCalendarEvents();
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

  const handleCreateEvent = (data: EventFormValues) => {
    const newEvent = createEvent(data);
    setIsCreateDialogOpen(false);
    notifyEventCreated(newEvent);
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
  };

  const handleUpdateEvent = (data: EventFormValues) => {
    if (!selectedEvent) return;
    updateEvent(selectedEvent.id, data);
    setIsEditDialogOpen(false);
    notifyEventUpdated({...selectedEvent, ...data});
    setSelectedEvent(null);
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
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    deleteEvent(selectedEvent.id);
    notifyEventDeleted(selectedEvent);
    setIsEditDialogOpen(false);
    setSelectedEvent(null);
    form.reset();
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    form.reset({
      title: event.title,
      description: event.description || "",
      start: event.start,
      end: event.end,
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
      />

      <Tabs 
        defaultValue="advanced" 
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
