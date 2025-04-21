
import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { eventSchema } from '@/schemas/eventSchema';
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const createEvent = (data: z.infer<typeof eventSchema>) => {
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

    setEvents(prev => [...prev, newEvent]);
    toast({
      title: "Evento creato",
      description: "L'evento è stato creato con successo",
    });
    return newEvent;
  };

  const updateEvent = (eventId: string, data: z.infer<typeof eventSchema>) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? {
            ...event,
            ...data,
            start: new Date(data.start).toISOString(),
            end: new Date(data.end).toISOString(),
          }
        : event
    ));
    toast({
      title: "Evento aggiornato",
      description: "L'evento è stato aggiornato con successo",
    });
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast({
      title: "Evento eliminato",
      description: "L'evento è stato eliminato con successo",
    });
  };

  return {
    events,
    setEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
