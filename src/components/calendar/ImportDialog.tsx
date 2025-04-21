
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ImportDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
}

const ImportDialog = ({ isOpen, setIsOpen, events, setEvents }: ImportDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const parseCSV = (content: string): Event[] => {
    const lines = content.split('\n').filter(line => line.trim());
    
    // Ignora la prima riga se contiene intestazioni
    const dataLines = lines[0].includes('titolo') || 
                      lines[0].includes('title') || 
                      lines[0].includes(',') ? 
                      lines.slice(1) : lines;
    
    return dataLines.map(line => {
      try {
        const [title, description, start, end, type, location] = line.split(',').map(item => item?.trim());
        
        // Validazione base
        if (!title || !start || !end) {
          throw new Error("Dati insufficienti");
        }
        
        const eventType = ["training", "match", "medical", "meeting"].includes(type as any) 
          ? type as "training" | "match" | "medical" | "meeting" 
          : "training";
        
        return {
          id: uuidv4(),
          title: title || "Evento senza titolo",
          description: description || "",
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
          type: eventType,
          location: location || "",
          recipients: []
        } as Event;
      } catch (error) {
        console.error("Errore nel parsing della riga:", line, error);
        return null;
      }
    }).filter(event => event !== null) as Event[];
  };

  const parseExcel = (data: ArrayBuffer): Event[] => {
    try {
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Converti il foglio in JSON
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);
      
      return jsonData.map(row => {
        try {
          // Cerca campi sia in italiano che in inglese
          const title = row.titolo || row.title || "Evento senza titolo";
          const description = row.descrizione || row.description || "";
          const start = row.inizio || row.start || row.data || row.date;
          const end = row.fine || row.end;
          const type = row.tipo || row.type;
          const location = row.luogo || row.location || "";
          
          if (!start || !end) {
            throw new Error("Date mancanti");
          }
          
          // Converti le date in formato ISO
          const startDate = new Date(start);
          const endDate = new Date(end);
          
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error("Date non valide");
          }
          
          const eventType = ["training", "match", "medical", "meeting"].includes(type as any) 
            ? type as "training" | "match" | "medical" | "meeting" 
            : "training";
          
          return {
            id: uuidv4(),
            title,
            description,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            type: eventType,
            location,
            recipients: []
          } as Event;
        } catch (error) {
          console.error("Errore nel parsing della riga Excel:", row, error);
          return null;
        }
      }).filter(event => event !== null) as Event[];
    } catch (error) {
      console.error("Errore nel parsing del file Excel:", error);
      return [];
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      
      if (fileType === 'pdf') {
        toast({
          title: "Impossibile importare PDF",
          description: "Attualmente supportiamo solo file CSV o Excel (XLS/XLSX). Si prega di utilizzare uno di questi formati.",
          variant: "destructive"
        });
        return;
      }
      
      let newEvents: Event[] = [];
      
      // Gestione file Excel (XLS/XLSX)
      if (fileType === 'xlsx' || fileType === 'xls') {
        const buffer = await file.arrayBuffer();
        newEvents = parseExcel(buffer);
      } 
      // Gestione file CSV
      else if (fileType === 'csv') {
        const content = await file.text();
        newEvents = parseCSV(content);
      } 
      else {
        toast({
          title: "Formato non supportato",
          description: "Per favore carica un file CSV o Excel (XLS/XLSX).",
          variant: "destructive"
        });
        return;
      }
      
      if (newEvents.length > 0) {
        setEvents([...events, ...newEvents]);
        toast({
          title: "Eventi importati",
          description: `${newEvents.length} eventi sono stati importati con successo`,
        });
        setIsOpen(false);
      } else {
        toast({
          title: "Nessun evento importato",
          description: "Non è stato possibile importare eventi dal file fornito. Verificare il formato.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Errore durante l'importazione:", error);
      toast({
        title: "Errore durante l'importazione",
        description: "Si è verificato un errore durante l'elaborazione del file.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Importa Eventi</DialogTitle>
          <DialogDescription>
            Carica un file CSV o Excel con gli eventi da importare. I file CSV devono avere colonne per titolo, descrizione, data inizio, data fine, tipo e luogo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Label htmlFor="file-upload" className="text-center">
              Seleziona un file CSV o Excel (XLS/XLSX) da importare
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <DialogFooter>
          {isLoading && (
            <div className="flex items-center mr-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2">Importazione in corso...</span>
            </div>
          )}
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Annulla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
