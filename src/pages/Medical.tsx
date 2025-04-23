
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle, AlertCircle, FileText, FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Medical = () => {
  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Area Medica</h1>
          <p className="text-muted-foreground">Gestione delle visite mediche e certificati</p>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Panoramica</TabsTrigger>
            <TabsTrigger value="certificates">Certificati</TabsTrigger>
            <TabsTrigger value="visits">Visite Programmate</TabsTrigger>
            <TabsTrigger value="history">Storico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Visite da completare</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">7</span>
                    <AlertCircle className="h-6 w-6 text-amber-500" />
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">Questa settimana</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Certificati in scadenza</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">3</span>
                    <Calendar className="h-6 w-6 text-red-500" />
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">Prossimi 30 giorni</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Visite completate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">12</span>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">Questo mese</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Documenti archiviati</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">124</span>
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">Totale</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Prossime visite mediche</CardTitle>
                <CardDescription>
                  Visite mediche programmate per i prossimi giorni
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, player: 'Marco Rossi', team: 'Under 16', date: '25 Apr 2025', type: 'Agonistica' },
                    { id: 2, player: 'Luca Bianchi', team: 'Under 18', date: '26 Apr 2025', type: 'Agonistica' },
                    { id: 3, player: 'Giulia Verdi', team: 'Under 14', date: '28 Apr 2025', type: 'Non Agonistica' },
                    { id: 4, player: 'Sara Neri', team: 'Prima Squadra', date: '29 Apr 2025', type: 'Agonistica' },
                  ].map(visit => (
                    <div key={visit.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{visit.player}</p>
                        <p className="text-sm text-muted-foreground">{visit.team} • {visit.type}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{visit.date}</span>
                        <Button variant="outline" size="sm">Dettagli</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="certificates" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gestione Certificati</CardTitle>
                  <CardDescription>Tutti i certificati medici registrati</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <FilePlus2 className="h-4 w-4" />
                  Nuovo Certificato
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground pb-4">
                  Questa sezione è in fase di sviluppo. Presto potrai gestire tutti i certificati medici dei tuoi atleti.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visits" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Visite Programmate</CardTitle>
                  <CardDescription>Calendario delle visite mediche</CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Nuova Visita
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground pb-4">
                  Questa sezione è in fase di sviluppo. Presto potrai programmare e gestire le visite mediche.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Storico</CardTitle>
                <CardDescription>Archivio delle visite mediche passate</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground pb-4">
                  Questa sezione è in fase di sviluppo. Presto potrai consultare lo storico di tutte le visite mediche.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Medical;
