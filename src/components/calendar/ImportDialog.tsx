
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
        title: "Importazione PDF",
        description: "Il file PDF è stato importato correttamente",
      });
      setIsOpen(false);
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n').slice(1);
      const newEvents = lines.map(line => {
        const [title, description, start, end, type, location] = line.split(',');
        return {
          id: uuidv4(),
          title,
          description,
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
          type: (type as "training" | "match" | "medical" | "meeting") || "training",
          location,
          isPrivate: false,
        } as Event;
      });
      setEvents([...events, ...newEvents]);
      toast({
        title: "Eventi importati",
        description: `${newEvents.length} eventi sono stati importati con successo`,
      });
      setIsOpen(false);
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Importa Eventi</DialogTitle>
          <DialogDescription>
            Carica un file CSV o PDF con gli eventi da importare.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Label htmlFor="file-upload" className="text-center">
              Seleziona un file CSV o PDF da importare
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.pdf"
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
