
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, 
         isSameMonth, isSameDay, addMonths, subMonths, addWeeks, subWeeks, getDay, 
         startOfDay, endOfDay } from 'date-fns';
import { it } from "date-fns/locale";
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Event } from '@/types';
import { ChevronLeft, ChevronRight, Calendar, CalendarDays } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/context/NotificationContext';

interface CalendarViewProps {
  events: Event[];
  onEventSelect: (event: Event) => void;
}

type ViewMode = 'month' | 'week';

const CalendarView: React.FC<CalendarViewProps> = ({ events, onEventSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { showNotification } = useNotifications();

  // Funzioni di navigazione
  const navigatePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  // Calcola date del calendario in base alla modalità
  const calculateDaysToDisplay = () => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Inizia da lunedì
      const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: startDate, end: endDate });
    } else {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }
  };

  // Ottenere gli eventi per un giorno specifico
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, day);
    });
  };

  // Stile dei giorni
  const getDayClass = (day: Date) => {
    const isCurrentMonth = isSameMonth(day, currentDate);
    const isToday = isSameDay(day, new Date());
    const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
    
    let className = "h-full rounded-md transition-all flex flex-col p-1 ";
    
    if (!isCurrentMonth && viewMode === 'month') {
      className += "text-gray-400 dark:text-gray-600 ";
    }
    
    if (isToday) {
      className += "bg-blue-100 dark:bg-blue-900/30 ";
    }
    
    if (isSelected) {
      className += "ring-2 ring-primary ";
    }
    
    return className;
  };

  // Giorni da visualizzare
  const days = calculateDaysToDisplay();

  // Reset della data selezionata quando cambia la visualizzazione
  useEffect(() => {
    setSelectedDate(null);
  }, [viewMode, currentDate]);

  return (
    <div className="flex flex-col h-full">
      {/* Header e controlli */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={navigateToday}>
            Oggi
          </Button>
          
          <Button variant="outline" size="sm" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <h2 className="text-xl font-semibold">
            {viewMode === 'month' 
              ? format(currentDate, 'MMMM yyyy', { locale: it })
              : `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM', { locale: it })} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: it })}`
            }
          </h2>
        </div>
        
        <ToggleGroup type="single" value={viewMode} onValueChange={(value: string) => value && setViewMode(value as ViewMode)}>
          <ToggleGroupItem value="month" aria-label="Mese" title="Visualizzazione mensile">
            <Calendar className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="week" aria-label="Settimana" title="Visualizzazione settimanale">
            <CalendarDays className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Intestazione giorni della settimana */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
          <div 
            key={day}
            className="text-center font-medium text-sm py-1 text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Griglia calendario */}
      <div className={`grid grid-cols-7 gap-1 flex-1 ${viewMode === 'week' ? 'h-[500px]' : ''}`}>
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          
          return (
            <div 
              key={index} 
              className={getDayClass(day)}
              onClick={() => setSelectedDate(day)}
            >
              {/* Numero del giorno */}
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${viewMode === 'week' ? 'p-1' : ''}`}>
                  {format(day, 'd')}
                </span>
                
                {/* Indicatore eventi */}
                {hasEvents && (
                  <span className="h-2 w-2 rounded-full bg-primary mr-1"></span>
                )}
              </div>
              
              {/* Lista eventi (solo i primi 3 in visualizzazione mensile) */}
              <div className="mt-1 overflow-y-auto flex-1">
                {hasEvents && (
                  <div className="space-y-1">
                    {dayEvents
                      .slice(0, viewMode === 'month' ? 3 : undefined)
                      .map((event) => (
                        <div 
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventSelect(event);
                          }}
                          className="text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          style={{ 
                            backgroundColor: getEventColor(event.type, 0.2),
                            color: getEventTextColor(event.type)
                          }}
                        >
                          {format(new Date(event.start), 'HH:mm')} - {event.title}
                        </div>
                      ))}
                    {viewMode === 'month' && dayEvents.length > 3 && (
                      <div className="text-xs text-center text-gray-500">
                        +{dayEvents.length - 3} altri
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Panel eventi del giorno selezionato */}
      {selectedDate && (
        <div className="mt-4 border rounded-md p-3 bg-card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">
              {format(selectedDate, 'EEEE d MMMM', { locale: it })}
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedDate(null)}
            >
              Chiudi
            </Button>
          </div>
          
          <div className="space-y-2">
            {getEventsForDay(selectedDate).length > 0 ? (
              getEventsForDay(selectedDate).map((event) => (
                <div 
                  key={event.id}
                  className="p-2 border rounded-md cursor-pointer hover:bg-accent"
                  onClick={() => onEventSelect(event)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="text-sm text-gray-500">
                        {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
                      </div>
                      {event.location && (
                        <div className="text-sm mt-1">{event.location}</div>
                      )}
                    </div>
                    <Badge variant={getEventBadgeVariant(event.type)}>
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-2">Nessun evento in questo giorno</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Funzioni di utilità per colori e etichette degli eventi
const getEventColor = (type: string, alpha: number = 1): string => {
  const colors = {
    training: `rgba(75, 192, 192, ${alpha})`,
    match: `rgba(255, 99, 132, ${alpha})`,
    medical: `rgba(153, 102, 255, ${alpha})`,
    meeting: `rgba(255, 159, 64, ${alpha})`,
  };
  return colors[type as keyof typeof colors] || `rgba(201, 203, 207, ${alpha})`;
};

const getEventTextColor = (type: string): string => {
  const colors = {
    training: 'rgb(21, 128, 128)',
    match: 'rgb(205, 32, 74)',
    medical: 'rgb(110, 66, 193)',
    meeting: 'rgb(194, 110, 34)',
  };
  return colors[type as keyof typeof colors] || 'rgb(100, 100, 100)';
};

const getEventBadgeVariant = (type: string): any => {
  const variants = {
    training: 'default',
    match: 'destructive',
    medical: 'secondary',
    meeting: 'outline',
  };
  return variants[type as keyof typeof variants] || 'default';
};

const getEventTypeLabel = (type: string): string => {
  const labels = {
    training: 'Allenamento',
    match: 'Partita',
    medical: 'Visita Medica',
    meeting: 'Riunione',
  };
  return labels[type as keyof typeof labels] || type;
};

export default CalendarView;
