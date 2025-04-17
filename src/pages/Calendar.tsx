
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEvents } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';

const CalendarPage = () => {
  const { user } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const filteredEvents = mockEvents.filter(event => {
    if (!user) return false;
    
    switch (user.role) {
      case 'player':
        return event.teamId === user.teams?.[0]?.id;
      case 'coach':
        return user.teams?.some(team => team.id === event.teamId);
      case 'medical':
        return event.requiresMedical;
      case 'admin':
        return true;
      default:
        return false;
    }
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-sportivo-blue">Calendario</h1>
      
      <div className="grid md:grid-cols-[400px_1fr] gap-6">
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
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <div className="mt-2 text-sm">
                    <p>Inizio: {new Date(event.start).toLocaleString('it-IT')}</p>
                    <p>Fine: {new Date(event.end).toLocaleString('it-IT')}</p>
                    {event.location && <p>Luogo: {event.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;
