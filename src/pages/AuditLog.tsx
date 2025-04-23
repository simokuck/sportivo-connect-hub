
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

const AuditLog: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([
    { id: 1, action: "Creazione utente", user: "admin@sportivo.com", timestamp: "2025-04-20 15:23:45", details: "Creazione dell'utente mario.rossi@example.com" },
    { id: 2, action: "Modifica ruolo", user: "admin@sportivo.com", timestamp: "2025-04-20 15:30:12", details: "Modifica del ruolo da 'player' a 'coach' per l'utente luigi.verdi@example.com" },
    { id: 3, action: "Eliminazione documento", user: "coach@sportivo.com", timestamp: "2025-04-19 09:12:34", details: "Eliminazione del documento 'Regolamento 2024-2025'" },
    { id: 4, action: "Accesso negato", user: "player@sportivo.com", timestamp: "2025-04-19 10:45:22", details: "Tentativo di accesso a una pagina riservata" },
    { id: 5, action: "Importazione dati", user: "admin@sportivo.com", timestamp: "2025-04-18 14:20:11", details: "Importazione di 25 nuovi giocatori dal file CSV" },
    { id: 6, action: "Aggiornamento sistema", user: "system", timestamp: "2025-04-18 02:00:00", details: "Aggiornamento automatico del sistema alla versione 1.2.3" },
  ]);

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)} 
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Indietro
        </Button>
        <h1 className="text-3xl font-bold">Audit Log</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Registro delle attività</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-medium">Azione</th>
                  <th className="text-left py-2 px-3 font-medium">Utente</th>
                  <th className="text-left py-2 px-3 font-medium">Data e ora</th>
                  <th className="text-left py-2 px-3 font-medium">Dettagli</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-3">{log.action}</td>
                    <td className="py-2 px-3">{log.user}</td>
                    <td className="py-2 px-3">{log.timestamp}</td>
                    <td className="py-2 px-3">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLog;
