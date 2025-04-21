
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@/types";
import { v4 as uuidv4 } from 'uuid';

interface ImportDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
}

const ImportDialog = ({ isOpen, setIsOpen, events, setEvents }: ImportDialogProps) => {
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType === 'pdf') {
      toast({
        title: "Impossibile importare PDF",
        description: "Attualmente supportiamo solo file CSV o Excel (XLS/XLSX). Si prega di utilizzare uno di questi formati.",
        variant: "destructive"
      });
      return;
    }
    
    // Per file Excel (XLS/XLSX) suggeriamo l'utilizzo di una libreria
    if (fileType === 'xlsx' || fileType === 'xls') {
      toast({
        title: "Importazione Excel",
        description: "Il supporto per file Excel è in fase di implementazione. Per ora, utilizzare file CSV.",
        variant: "default"
      });
      // Qui andrebbe l'implementazione della lettura Excel con una libreria come xlsx
      return;
    }
    
    if (fileType === 'csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());
        
        // Ignora la prima riga se contiene intestazioni
        const dataLines = lines[0].includes('titolo') || lines[0].includes('title') ? lines.slice(1) : lines;
        
        const newEvents = dataLines.map(line => {
          try {
            const [title, description, start, end, type, location] = line.split(',');
            return {
              id: uuidv4(),
              title: title || "Evento senza titolo",
              description: description || "",
              start: new Date(start).toISOString(),
              end: new Date(end).toISOString(),
              type: (type as "training" | "match" | "medical" | "meeting") || "training",
              location: location || "",
              isPrivate: false,
            } as Event;
          } catch (error) {
            console.error("Errore nel parsing della riga:", line, error);
            return null;
          }
        }).filter(event => event !== null) as Event[];
        
        if (newEvents.length > 0) {
          setEvents([...events, ...newEvents]);
          toast({
            title: "Eventi importati",
            description: `${newEvents.length} eventi sono stati importati con successo`,
          });
        } else {
          toast({
            title: "Nessun evento importato",
            description: "Non è stato possibile importare eventi dal file fornito. Verificare il formato.",
            variant: "destructive"
          });
        }
        setIsOpen(false);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Formato non supportato",
        description: "Per favore carica un file CSV o Excel (XLS/XLSX).",
        variant: "destructive"
      });
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
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annulla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
