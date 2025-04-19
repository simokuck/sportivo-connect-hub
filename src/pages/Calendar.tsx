
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, List, Plus } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Link, useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import CustomEventForm from '@/components/form/CustomEventForm';

const mockEvents = [
  {
    id: "1",
    title: "Allenamento Mattutino",
    start: new Date(2024, 4, 20, 9, 0).toISOString(),
    end: new Date(2024, 4, 20, 11, 0).toISOString(),
    location: "Campo Sportivo Comunale",
    description: "Esercizi di riscaldamento e preparazione atletica.",
    type: "training",
    teamId: "1",
    createdBy: "1",
    coords: { lat: 45.4642, lng: 9.1900 },
    isPrivate: false,
  },
  {
    id: "2",
    title: "Partita Amichevole",
    start: new Date(2024, 4, 22, 15, 0).toISOString(),
    end: new Date(2024, 4, 22, 17, 0).toISOString(),
    location: "Stadio San Siro",
    description: "Partita amichevole contro la squadra locale.",
    type: "match",
    teamId: "1",
    createdBy: "2",
    coords: { lat: 45.4781, lng: 9.1287 },
    isPrivate: false,
  },
  {
    id: "3",
    title: "Riunione Tecnica",
    start: new Date(2024, 4, 25, 18, 0).toISOString(),
    end: new Date(2024, 4, 25, 19, 0).toISOString(),
    location: "Sala Riunioni",
    description: "Discussione sulle strategie per la prossima partita.",
    type: "meeting",
    teamId: "2",
    createdBy: "3",
    coords: { lat: 45.4642, lng: 9.1900 },
    isPrivate: false,
  },
  {
    id: "4",
    title: "Visita Medica",
    start: new Date(2024, 4, 28, 10, 0).toISOString(),
    end: new Date(2024, 4, 28, 12, 0).toISOString(),
    location: "Centro Medico Sportivo",
    description: "Controllo medico generale per tutti i giocatori.",
    type: "medical",
    teamId: "3",
    createdBy: "4",
    coords: { lat: 45.4642, lng: 9.1900 },
    isPrivate: false,
  },
  {
    id: "5",
    title: "Sessione Video",
    start: new Date(2024, 4, 29, 16, 0).toISOString(),
    end: new Date(2024, 4, 29, 17, 0).toISOString(),
    location: "Online",
    description: "Analisi video della partita precedente.",
    type: "training",
    teamId: "1",
    createdBy: "2",
    coords: null,
    isPrivate: true,
  },
];

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const navigate = useNavigate();
  
  // Filtro gli eventi del giorno selezionato
  const eventsForSelectedDay = mockEvents.filter(event => {
    const eventDate = new Date(event.start);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

  const handleCreateEvent = () => {
    setShowEventForm(true);
  };

  const handleCloseForm = () => {
    setShowEventForm(false);
  };

  // Gestione dei tasti per il form
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showEventForm) {
        if (e.key === 'Escape') {
          handleCloseForm();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEventForm]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendario</h1>
        <Button onClick={handleCreateEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Evento
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calendario a sinistra */}
            <div className="md:col-span-1">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="border rounded-md"
                locale={it}
              />
            </div>
            
            {/* Eventi del giorno a destra */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-4">
                Eventi del {format(date, "d MMMM yyyy", { locale: it })}
              </h3>
              
              {eventsForSelectedDay.length > 0 ? (
                <div className="space-y-4">
                  {eventsForSelectedDay.map((event) => (
                    <Card key={event.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
                          </p>
                          {event.location && (
                            <p className="text-sm mt-1">{event.location}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${
                            event.type === 'training' ? 'bg-green-500' :
                            event.type === 'match' ? 'bg-orange-500' :
                            event.type === 'meeting' ? 'bg-blue-500' :
                            event.type === 'medical' ? 'bg-red-500' : 'bg-gray-500'
                          }`}></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {event.type === 'training' ? 'Allenamento' :
                             event.type === 'match' ? 'Partita' :
                             event.type === 'meeting' ? 'Riunione' :
                             event.type === 'medical' ? 'Medico' : 'Altro'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Nessun evento programmato per questo giorno
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showEventForm && (
        <div className="fixed inset-0 bg-black/50 z-40 overflow-auto pt-10 pb-20">
          <div className="max-w-4xl mx-auto">
            <CustomEventForm onClose={handleCloseForm} />
          </div>
        </div>
      )}
      
      <div className="md:hidden">
        <Button variant="secondary" onClick={() => navigate('/training-planner')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Vai al Training Planner
        </Button>
      </div>
    </div>
  );
};

export default CalendarPage;
