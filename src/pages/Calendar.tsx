
import React, { useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "@/schemas/eventSchema";
import { Event } from '@/types';
import { cn } from "@/lib/utils";
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import EventsList from '@/components/calendar/EventsList';
import ImportDialog from '@/components/calendar/ImportDialog';
import CreateEventDialog from '@/components/calendar/dialogs/CreateEventDialog';
import EditEventDialog from '@/components/calendar/dialogs/EditEventDialog';

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

  const { events, setEvents, createEvent, updateEvent, deleteEvent } = useCalendarEvents();

  const form = useForm({
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

  const handleLocationChange = useCallback((location: string, coords?: { lat: number; lng: number }) => {
    form.setValue("location", location);
    if (coords) {
      form.setValue("lat", coords.lat);
      form.setValue("lng", coords.lng);
    }
  }, [form]);

  const handleCreateEvent = (data: any) => {
    createEvent(data);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleUpdateEvent = (data: any) => {
    if (!selectedEvent) return;
    updateEvent(selectedEvent.id, data);
    setIsEditDialogOpen(false);
    setSelectedEvent(null);
    form.reset();
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    deleteEvent(selectedEvent.id);
    setIsEditDialogOpen(false);
    setSelectedEvent(null);
    form.reset();
  };

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
