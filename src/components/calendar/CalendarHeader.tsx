
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onImportClick: () => void;
  onAddEventClick: () => void;
}

const CalendarHeader = ({ date, setDate, onImportClick, onAddEventClick }: CalendarHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-semibold">Calendario</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={onImportClick}>
            Importa
          </Button>
          <Button onClick={onAddEventClick}>
            Aggiungi Evento
          </Button>
        </div>
      </div>
      <div className="border-b p-4">
        <div className="md:w-64">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Seleziona una data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default CalendarHeader;
