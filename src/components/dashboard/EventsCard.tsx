
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { Event } from '@/types';

interface EventsCardProps {
  events: Event[];
  onClick: () => void;
}

export const EventsCard = ({ events, onClick }: EventsCardProps) => {
  return (
    <Card className="hover-card-highlight cursor-pointer transition-all hover:shadow-md hover:border-primary/50" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Calendar className="h-5 w-5 mr-2 text-sportivo-blue" />
          Prossimi Eventi
        </CardTitle>
        <CardDescription>I tuoi prossimi impegni</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="p-2 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-xs text-gray-500">{event.location}</p>
                </div>
                <div className="flex items-center text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(event.start).toLocaleDateString('it-IT', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
