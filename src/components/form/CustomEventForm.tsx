
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { CalendarIcon, MapPin, Clock, Users, X } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { LocationPicker } from "@/components/map/LocationPicker";
import { useAuth } from '@/context/AuthContext';

// Tipi di evento
const eventTypes = [
  { value: "training", label: "Allenamento" },
  { value: "match", label: "Partita" },
  { value: "meeting", label: "Riunione" },
  { value: "medical", label: "Visita Medica" },
  { value: "other", label: "Altro" },
];

// Ore disponibili per selezionare inizio e fine evento
const availableHours = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, '0') + ":00",
  label: i.toString().padStart(2, '0') + ":00",
}));

// Squadre disponibili (mock)
const availableTeams = [
  { id: "1", name: "Prima Squadra" },
  { id: "2", name: "Juniores" },
  { id: "3", name: "Allievi" },
  { id: "4", name: "Giovanissimi" }
];

interface CustomEventFormProps {
  onClose?: () => void;
}

const CustomEventForm: React.FC<CustomEventFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [eventType, setEventType] = useState(eventTypes[0].value);
  const [isPrivate, setIsPrivate] = useState(false);
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [location, setLocation] = useState("");
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Funzione per determinare se mostrare il selettore squadra
  const showTeamSelector = () => {
    // Se l'evento è privato, non mostrare il selettore squadra
    if (isPrivate) return false;
    
    // Se l'utente è admin, coach o staff medico, mostrare il selettore squadra
    return ['admin', 'coach', 'medical'].includes(user?.role || '');
  };

  // Aggiorna la UI quando isPrivate cambia
  useEffect(() => {
    // Se l'evento diventa privato, resetta la squadra selezionata
    if (isPrivate) {
      setTeamId(undefined);
    }
  }, [isPrivate]);

  const handleMapSelection = (locationName: string, coords: { lat: number; lng: number }) => {
    setLocation(locationName);
    setLocationCoords(coords);
    setShowLocationPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Costruiamo l'oggetto evento
    const eventData = {
      title,
      description,
      date: date ? format(date, "yyyy-MM-dd") : "",
      startTime,
      endTime,
      type: eventType,
      isPrivate,
      teamId: isPrivate ? null : teamId,
      location,
      coords: locationCoords,
      createdBy: user?.id,
    };
    
    console.log("Dati evento:", eventData);
    
    // Qui andrebbe la chiamata API per salvare l'evento
    // Per ora simuliamo un successo e chiudiamo il form
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="relative pb-2">
        <CardTitle className="text-xl">Crea Nuovo Evento</CardTitle>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titolo Evento *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Inserisci il titolo dell'evento"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Inserisci una descrizione dell'evento"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "PPP", { locale: it })
                    ) : (
                      <span>Seleziona una data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={it}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventType">Tipo Evento *</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger id="eventType">
                  <SelectValue placeholder="Seleziona il tipo di evento" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Ora Inizio *</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="startTime">
                  <SelectValue placeholder="Seleziona ora inizio" />
                </SelectTrigger>
                <SelectContent>
                  {availableHours.map((hour) => (
                    <SelectItem key={hour.value} value={hour.value}>
                      {hour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">Ora Fine *</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger id="endTime">
                  <SelectValue placeholder="Seleziona ora fine" />
                </SelectTrigger>
                <SelectContent>
                  {availableHours.map((hour) => (
                    <SelectItem key={hour.value} value={hour.value}>
                      {hour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {showTeamSelector() && (
            <div className="space-y-2">
              <Label htmlFor="team">Squadra</Label>
              <Select value={teamId} onValueChange={setTeamId}>
                <SelectTrigger id="team">
                  <SelectValue placeholder="Seleziona la squadra" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
            <Label htmlFor="private">Evento Privato</Label>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="location">Ubicazione</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowLocationPicker(true)}
              >
                <MapPin className="mr-1 h-4 w-4" />
                Seleziona sulla mappa
              </Button>
            </div>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Inserisci l'ubicazione dell'evento"
            />
          </div>
          
          {showLocationPicker && (
            <div className="border rounded-md p-2 relative h-[300px]">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowLocationPicker(false)}
                className="absolute top-2 right-2 z-10"
              >
                <X className="h-4 w-4" />
              </Button>
              <LocationPicker 
                onChange={handleMapSelection} 
                value={location}
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button type="submit">Salva Evento</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CustomEventForm;
