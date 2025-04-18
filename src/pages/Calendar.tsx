import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockEvents } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { CalendarEvent } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, isAfter, isBefore, isSameDay, addHours } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { Calendar as CalendarIcon, Clock, MapPin, Users, X, Edit, Plus, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import LocationPicker from '@/components/map/LocationPicker';
import { useNotifications } from '@/context/NotificationContext';

const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Il titolo deve essere di almeno 3 caratteri" }),
  description: z.string().optional(),
  start: z.string(),
  end: z.string(),
  type: z.enum(["training", "match", "medical", "meeting"]),
  location: z.string().optional(),
  teamId: z.string().optional(), // Made teamId optional for private events
  requiresMedical: z.boolean().optional().default(false),
  isPrivate: z.boolean().optional().default(false),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const CalendarPage = () => {
  const { user } = useAuth();
  const { showGroupNotification } = useNotifications();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogAction, setDialogAction] = useState<'create' | 'edit'>('create');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(undefined);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      end: format(addHours(new Date(), 2), "yyyy-MM-dd'T'HH:mm"),
      type: "training",
      location: "",
      requiresMedical: false,
      isPrivate: false,
    },
  });

  const isPrivate = form.watch("isPrivate");

  useEffect(() => {
    if (!user) return;
    
    const filteredEvents = mockEvents.filter(event => {
      // Private events are only visible to their creator
      if (event.userId === user.id) return true;
      
      // Filter events based on user role and team
      switch (user.role) {
        case 'player':
          return user.teams?.some(team => team.id === event.teamId);
        case 'coach':
          return user.teams?.some(team => team.id === event.teamId);
        case 'medical':
          return event.requiresMedical || user.teams?.some(team => team.id === event.teamId);
        case 'admin':
          return true;
        default:
          return false;
      }
    });
    
    setEvents(filteredEvents);
  }, [user]);

  useEffect(() => {
    if (dialogAction === 'create' && dialogOpen) {
      form.reset({
        title: "",
        description: "",
        start: format(date || new Date(), "yyyy-MM-dd'T'HH:mm"),
        end: format(addHours(date || new Date(), 2), "yyyy-MM-dd'T'HH:mm"),
        type: "training",
        location: "",
        requiresMedical: false,
        isPrivate: false,
        teamId: user?.teams && user.teams.length > 0 ? user.teams[0].id : undefined,
      });
      setCoordinates(undefined);
    }
  }, [dialogAction, dialogOpen, date, form, user]);

  useEffect(() => {
    if (selectedEvent && dialogAction === 'edit' && dialogOpen) {
      form.reset({
        title: selectedEvent.title,
        description: selectedEvent.description || '',
        start: format(new Date(selectedEvent.start), "yyyy-MM-dd'T'HH:mm"),
        end: format(new Date(selectedEvent.end), "yyyy-MM-dd'T'HH:mm"),
        type: selectedEvent.type,
        location: selectedEvent.location || '',
        teamId: selectedEvent.teamId,
        requiresMedical: selectedEvent.requiresMedical || false,
        isPrivate: selectedEvent.teamId ? false : true, // Fix: Set isPrivate based on teamId
      });
    }
  }, [selectedEvent, dialogAction, dialogOpen, form]);

  const onSubmit = (data: EventFormValues) => {
    if (dialogAction === 'create') {
      const newEvent: CalendarEvent = {
        id: `event-${Date.now()}`,
        title: data.title,
        description: data.description,
        start: data.start,
        end: data.end,
        type: data.type,
        location: data.location,
        teamId: data.isPrivate ? undefined : data.teamId,
        requiresMedical: data.requiresMedical,
        userId: user?.id, // Add userId for private events
        canEdit: user?.role !== 'player',
        coordinates: coordinates
      };
      
      setEvents([...events, newEvent]);
      toast({
        title: "Evento creato",
        description: "L'evento è stato creato con successo",
      });
      
      // Send group notification if this is a team event
      if (!data.isPrivate && data.teamId && user?.teams) {
        const team = user.teams.find(t => t.id === data.teamId);
        if (team) {
          showGroupNotification(
            "info",
            `Nuovo evento: ${data.title}`,
            {
              groupName: team.name,
              description: `È stato creato un nuovo evento per la tua squadra: ${data.title}`,
              eventId: newEvent.id,
              priority: "normal"
            }
          );
        }
      }
    } else if (dialogAction === 'edit' && selectedEvent) {
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id 
          ? { 
              ...event, 
              ...data, 
              teamId: data.isPrivate ? undefined : data.teamId,
              coordinates: coordinates || event.coordinates
            } 
          : event
      );
      
      setEvents(updatedEvents);
      toast({
        title: "Evento aggiornato",
        description: "L'evento è stato aggiornato con successo",
      });
      
      // Notify team about updated event
      if (!data.isPrivate && data.teamId && user?.teams) {
        const team = user.teams.find(t => t.id === data.teamId);
        if (team) {
          showGroupNotification(
            "info",
            `Evento aggiornato: ${data.title}`,
            {
              groupName: team.name,
              description: `Un evento della tua squadra è stato aggiornato: ${data.title}`,
              eventId: selectedEvent.id,
              priority: "normal"
            }
          );
        }
      }
    }
    
    setDialogOpen(false);
  };

  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    
    // Notify team about deleted event if it's a team event
    if (selectedEvent.teamId && user?.teams) {
      const team = user.teams.find(t => t.id === selectedEvent.teamId);
      if (team) {
        showGroupNotification(
          "warning",
          `Evento cancellato: ${selectedEvent.title}`,
          {
            groupName: team.name,
            description: `Un evento della tua squadra è stato cancellato: ${selectedEvent.title}`,
            eventId: selectedEvent.id,
            priority: "high"
          }
        );
      }
    }
    
    const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
    setEvents(updatedEvents);
    
    toast({
      title: "Evento eliminato",
      description: "L'evento è stato eliminato con successo",
    });
    
    setDialogOpen(false);
  };

  const handleLocationChange = (location: string, coords?: [number, number]) => {
    form.setValue("location", location);
    setCoordinates(coords);
  };

  const todaysEvents = events.filter(event => 
    date && isSameDay(new Date(event.start), date)
  );

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return isAfter(eventDate, today) && 
           isBefore(eventDate, nextWeek) && 
           !isSameDay(eventDate, date || today);
  }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  // Check if user can create events
  const canCreateEvents = user?.role !== 'player';

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-sportivo-blue">Calendario</h1>
      
      <div className="grid md:grid-cols-[400px_1fr] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seleziona Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
            <CardFooter>
              {canCreateEvents && (
                <Button 
                  className="w-full" 
                  onClick={() => {
                    setDialogAction('create');
                    setSelectedEvent(null);
                    setDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Nuovo Evento
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          {date && todaysEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-sportivo-blue" /> 
                  Eventi del {format(date, "dd/MM/yyyy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onEdit={() => {
                        setDialogAction('edit');
                        setSelectedEvent(event);
                        setDialogOpen(true);
                      }} 
                      canEdit={event.canEdit && canCreateEvents}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                {date && todaysEvents.length > 0 
                  ? "Prossimi Eventi" 
                  : "Eventi Imminenti"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onEdit={() => {
                        setDialogAction('edit');
                        setSelectedEvent(event);
                        setDialogOpen(true);
                      }} 
                      canEdit={event.canEdit && canCreateEvents}
                    />
                  ))
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    Nessun evento imminente nei prossimi giorni
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'create' ? 'Crea Nuovo Evento' : 'Modifica Evento'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titolo</FormLabel>
                    <FormControl>
                      <Input placeholder="Inserisci il titolo dell'evento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrizione</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Aggiungi una descrizione (opzionale)" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data e ora di inizio</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data e ora di fine</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo di evento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona un tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="training">Allenamento</SelectItem>
                          <SelectItem value="match">Partita</SelectItem>
                          <SelectItem value="medical">Visita Medica</SelectItem>
                          <SelectItem value="meeting">Riunione</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Evento Privato</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // Clear teamId if event is private
                            if (checked) {
                              form.setValue("teamId", undefined);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {!isPrivate && user?.teams && user.teams.length > 0 && (
                <FormField
                  control={form.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Squadra</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona una squadra" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {user.teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posizione</FormLabel>
                    <FormControl>
                      <LocationPicker 
                        value={field.value} 
                        onChange={handleLocationChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {(form.watch('type') === 'training' || form.watch('type') === 'match') && (
                <FormField
                  control={form.control}
                  name="requiresMedical"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Richiedi presenza medica</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter className="space-x-2">
                {dialogAction === 'edit' && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleDeleteEvent}
                  >
                    <X className="mr-2 h-4 w-4" /> Elimina
                  </Button>
                )}
                <Button type="submit">
                  {dialogAction === 'create' ? 'Crea Evento' : 'Aggiorna Evento'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EventCardProps {
  event: CalendarEvent;
  onEdit: () => void;
  canEdit: boolean;
}

const EventCard = ({ event, onEdit, canEdit }: EventCardProps) => {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'training': return 'bg-blue-100 text-blue-700';
      case 'match': return 'bg-green-100 text-green-700';
      case 'medical': return 'bg-red-100 text-red-700';
      case 'meeting': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'training': return 'Allenamento';
      case 'match': return 'Partita';
      case 'medical': return 'Visita Medica';
      case 'meeting': return 'Riunione';
      default: return type;
    }
  };

  return (
    <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className={getEventTypeColor(event.type)}>
              {getEventTypeLabel(event.type)}
            </Badge>
            {!event.teamId && (
              <Badge variant="outline" className="border-gray-300 text-gray-600">
                Privato
              </Badge>
            )}
            {event.requiresMedical && (
              <Badge variant="outline" className="border-red-300 text-red-600">
                <AlertCircle className="h-3 w-3 mr-1" /> Medico richiesto
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-lg">{event.title}</h3>
          {event.description && (
            <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
          )}
        </div>
        {canEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>
            {format(new Date(event.start), "dd/MM/yyyy HH:mm")} - {format(new Date(event.end), "HH:mm")}
          </span>
        </div>
        
        {event.location && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
        )}
        
        {event.attendees && (
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>{event.attendees.length} partecipanti</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
