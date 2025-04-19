import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import LocationPicker from "../map/LocationPicker";

// Mock team data
const teams = [
  { id: "1", name: "Prima Squadra" },
  { id: "2", name: "Under 17" },
  { id: "3", name: "Under 15" },
];

// Prevent submission of duplicate events
let submittingEvent = false;

const CustomEventForm = ({ editEvent = null }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Event form state
  const [title, setTitle] = useState(editEvent?.title || "");
  const [description, setDescription] = useState(editEvent?.description || "");
  const [eventType, setEventType] = useState(editEvent?.type || "training");
  const [startDate, setStartDate] = useState(editEvent?.start ? new Date(editEvent.start) : new Date());
  const [endDate, setEndDate] = useState(editEvent?.end ? new Date(editEvent.end) : new Date(new Date().setHours(new Date().getHours() + 2)));
  const [location, setLocation] = useState(editEvent?.location || "");
  const [coords, setCoords] = useState(editEvent?.coords || null);
  const [isPrivate, setIsPrivate] = useState(editEvent?.isPrivate || false);
  const [selectedTeam, setSelectedTeam] = useState(editEvent?.teamId || "");
  const [showMap, setShowMap] = useState(false);
  
  // Fix: This useEffect ensures that changes to isPrivate immediately update UI
  useEffect(() => {
    console.log("isPrivate changed:", isPrivate);
  }, [isPrivate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (submittingEvent) return;
    submittingEvent = true;
    
    // Simple validation
    if (!title.trim()) {
      toast.error("Inserisci un titolo per l'evento");
      submittingEvent = false;
      return;
    }
    
    const eventData = {
      id: editEvent?.id || Date.now().toString(),
      title,
      description,
      type: eventType,
      start: startDate,
      end: endDate,
      location,
      coords,
      createdBy: user.id,
      isPrivate,
      teamId: !isPrivate ? selectedTeam : null,
    };
    
    // In a real app, we'd save to a backend
    setTimeout(() => {
      toast.success(
        editEvent ? "Evento aggiornato con successo" : "Evento creato con successo"
      );
      console.log("Event data:", eventData);
      navigate("/calendar");
      submittingEvent = false;
    }, 500);
  };
  
  const handleMapSelection = (locationName, locationCoords) => {
    setLocation(locationName);
    setCoords(locationCoords);
    setShowMap(false);
  };
  
  // Fix: showTeamSelector now properly checks if user has a role that can see teams AND the event is not private
  const showTeamSelector = () => {
    const canSelectTeam = ['admin', 'coach', 'medical'].includes(user.role);
    return canSelectTeam && !isPrivate && teams.length > 0;
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{editEvent ? "Modifica Evento" : "Crea Nuovo Evento"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titolo</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titolo dell'evento"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrizione dell'evento"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-type">Tipo di Evento</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger id="event-type">
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">Allenamento</SelectItem>
                  <SelectItem value="match">Partita</SelectItem>
                  <SelectItem value="meeting">Riunione</SelectItem>
                  <SelectItem value="medical">Visita Medica</SelectItem>
                  <SelectItem value="other">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="is-private" className="flex items-center justify-between">
                Evento Privato
                <Switch 
                  id="is-private" 
                  checked={isPrivate} 
                  onCheckedChange={(checked) => {
                    console.log("Setting isPrivate to:", checked);
                    setIsPrivate(checked);
                    if (checked) {
                      setSelectedTeam("");
                    }
                  }}
                />
              </Label>
              <p className="text-sm text-muted-foreground">
                Gli eventi privati sono visibili solo a te
              </p>
            </div>
          </div>
          
          {showTeamSelector() && (
            <div className="space-y-2">
              <Label htmlFor="team">Squadra</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger id="team">
                  <SelectValue placeholder="Seleziona squadra" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data e Ora Inizio</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Seleziona data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        if (date) {
                          const newDate = new Date(date);
                          newDate.setHours(startDate.getHours());
                          newDate.setMinutes(startDate.getMinutes());
                          setStartDate(newDate);
                          
                          // Adjust end date if it's before the new start date
                          if (endDate < newDate) {
                            const newEndDate = new Date(newDate);
                            newEndDate.setHours(newDate.getHours() + 2);
                            setEndDate(newEndDate);
                          }
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Input
                  type="time"
                  value={format(startDate, "HH:mm")}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newDate = new Date(startDate);
                    newDate.setHours(hours, minutes);
                    setStartDate(newDate);
                    
                    // Adjust end date if it's before the new start date
                    if (endDate < newDate) {
                      const newEndDate = new Date(newDate);
                      newEndDate.setHours(newDate.getHours() + 2);
                      setEndDate(newEndDate);
                    }
                  }}
                  className="w-24 flex-shrink-0"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Data e Ora Fine</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Seleziona data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        if (date) {
                          const newDate = new Date(date);
                          newDate.setHours(endDate.getHours());
                          newDate.setMinutes(endDate.getMinutes());
                          
                          // Ensure end date is not before start date
                          setEndDate(newDate < startDate ? new Date(startDate.getTime() + 7200000) : newDate);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Input
                  type="time"
                  value={format(endDate, "HH:mm")}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newDate = new Date(endDate);
                    newDate.setHours(hours, minutes);
                    
                    // Ensure end date is not before start date
                    setEndDate(newDate < startDate ? new Date(startDate.getTime() + 7200000) : newDate);
                  }}
                  className="w-24 flex-shrink-0"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Luogo</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Luogo dell'evento"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowMap(true)}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {showMap && (
            <div className="relative mt-2 rounded-md border p-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10"
                onClick={() => setShowMap(false)}
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
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Annulla
          </Button>
          <Button type="submit">
            {editEvent ? "Aggiorna Evento" : "Crea Evento"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CustomEventForm;
