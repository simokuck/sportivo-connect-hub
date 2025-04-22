
import React from 'react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { ArrowUpDown, Calendar, FilePlus } from 'lucide-react';

interface CalendarHeaderProps {
  date?: Date;
  setDate: (date?: Date) => void;
  onImportClick: () => void;
  onAddEventClick: () => void;
  showDatePicker?: boolean; // New prop to control date picker visibility
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  date, 
  setDate, 
  onImportClick, 
  onAddEventClick,
  showDatePicker = true // Default to showing the date picker
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-2 mb-4 p-1">
      <div className="flex items-center gap-2">
        {/* Only show date picker if showDatePicker is true */}
        {showDatePicker && (
          <DatePicker 
            date={date} 
            setDate={setDate}
            placeholder="Seleziona una data"
          />
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onImportClick} className="flex items-center gap-1">
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">Importa</span>
        </Button>
        
        <Button onClick={onAddEventClick} className="flex items-center gap-1">
          <FilePlus className="h-4 w-4" />
          <span className="hidden sm:inline">Aggiungi Evento</span>
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
