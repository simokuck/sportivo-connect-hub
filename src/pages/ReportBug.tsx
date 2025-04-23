
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bug } from "lucide-react";

const ReportBug = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    if (message.trim() === "") {
      toast({ title: "Inserisci un messaggio per la segnalazione", variant: "destructive" });
      return;
    }
    // Qui normalmente invieresti la segnalazione a backend o mail
    setIsSent(true);
    toast({ title: "Grazie per la segnalazione!", description: "Il tuo feedback è stato inviato al team.", variant: "default" });
    setMessage("");
  };

  return (
    <div className="container flex justify-center items-center py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center gap-2">
          <Bug className="h-8 w-8 text-destructive"/>
          <CardTitle>Segnala un Bug o Suggerisci un Miglioramento</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Descrivi il problema o il suggerimento..."
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <Button className="mt-4 w-full" onClick={handleSend} disabled={isSent && message === ""}>
            Invia segnalazione
          </Button>
          {isSent && <p className="text-green-600 mt-4 text-sm">Feedback inviato, grazie!</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportBug;
