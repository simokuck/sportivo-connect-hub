
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, List, Plus } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Link, useNavigate } from "react-router-dom";
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

const Calendar = () => {
  const [view, setView] = useState<'month' | 'list'>('month');
  const [date, setDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    setShowEventForm(true);
  };

  const handleCloseForm = () => {
    setShowEventForm(false);
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Calendario</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" size="icon" onClick={() => setView(view === 'month' ? 'list' : 'month')}>
              {view === 'month' ? <List className="h-5 w-5" /> : <CalendarIcon className="h-5 w-5" />}
            </Button>
            <Button onClick={handleCreateEvent}>
              <Plus className="mr-2 h-4 w-4" />
              Nuovo Evento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {view === 'month' ? (
            <div>Calendario Mese</div>
          ) : (
            <div>Lista Eventi</div>
          )}
        </CardContent>
      </Card>
      
      {showEventForm && (
        <div className="fixed inset-0 bg-black/50 z-40 overflow-auto pt-10 pb-20">
          <div className="max-w-4xl mx-auto">
            <CustomEventForm />
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

export default Calendar;
