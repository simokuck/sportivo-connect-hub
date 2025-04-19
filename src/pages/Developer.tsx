
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Code, Database, Server, Globe, Lock, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Developer = () => {
  const { toast } = useToast();
  const [apiMode, setApiMode] = useState("production");
  const [debugMode, setDebugMode] = useState(false);
  const [corsEnabled, setCorsEnabled] = useState(true);
  const [apiEndpoint, setApiEndpoint] = useState("https://api.sportivo-connect.com");
  
  const handleRebuild = () => {
    toast({
      title: "Ricostruzione avviata",
      description: "La ricostruzione dell'applicazione è in corso...",
    });
    
    // Simula una ricostruzione
    setTimeout(() => {
      toast({
        title: "Ricostruzione completata",
        description: "L'applicazione è stata ricostruita con successo!",
      });
    }, 3000);
  };
  
  const handleClearCache = () => {
    toast({
      title: "Pulizia cache",
      description: "La cache dell'applicazione è stata pulita con successo!",
    });
  };

  const handleSaveApiConfig = () => {
    toast({
      title: "Configurazione API salvata",
      description: `Endpoint: ${apiEndpoint}, Modalità: ${apiMode}`,
    });
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Area Developer</h1>
          <p className="text-muted-foreground">Strumenti e configurazioni avanzate per sviluppatori</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleClearCache} className="flex gap-2 items-center">
            <RefreshCw className="h-4 w-4" />
            Pulisci Cache
          </Button>
          <Button onClick={handleRebuild} className="flex gap-2 items-center">
            <Code className="h-4 w-4" />
            Ricostruisci
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="api" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="security">Sicurezza</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configurazione API
              </CardTitle>
              <CardDescription>Gestisci la configurazione delle API dell'applicazione</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="api-endpoint">Endpoint API</Label>
                    <Input 
                      id="api-endpoint" 
                      value={apiEndpoint} 
                      onChange={(e) => setApiEndpoint(e.target.value)} 
                      placeholder="https://api.example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Modalità API</Label>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="production"
                          value="production"
                          checked={apiMode === "production"}
                          onChange={() => setApiMode("production")}
                        />
                        <label htmlFor="production">Produzione</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="staging"
                          value="staging"
                          checked={apiMode === "staging"}
                          onChange={() => setApiMode("staging")}
                        />
                        <label htmlFor="staging">Staging</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="development"
                          value="development"
                          checked={apiMode === "development"}
                          onChange={() => setApiMode("development")}
                        />
                        <label htmlFor="development">Sviluppo</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Switch 
                      id="debug-mode" 
                      checked={debugMode} 
                      onCheckedChange={setDebugMode} 
                    />
                    <div>
                      <Label htmlFor="debug-mode" className="mb-1 block">Modalità Debug</Label>
                      <p className="text-sm text-muted-foreground">
                        Attiva più informazioni di debug nelle risposte API
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Switch 
                      id="cors-enabled" 
                      checked={corsEnabled} 
                      onCheckedChange={setCorsEnabled} 
                    />
                    <div>
                      <Label htmlFor="cors-enabled" className="mb-1 block">CORS Abilitato</Label>
                      <p className="text-sm text-muted-foreground">
                        Consente richieste cross-origin all'API
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveApiConfig}>Salva Configurazione</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Endpoints Disponibili
              </CardTitle>
              <CardDescription>Lista degli endpoints API disponibili nell'applicazione</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="bg-muted p-4">
                  <code className="text-sm whitespace-pre font-mono">
                    GET /api/v1/teams - Lista squadre<br />
                    GET /api/v1/teams/:id - Dettagli squadra<br />
                    POST /api/v1/teams - Crea squadra<br />
                    PUT /api/v1/teams/:id - Aggiorna squadra<br />
                    DELETE /api/v1/teams/:id - Elimina squadra<br />
                    <br />
                    GET /api/v1/users - Lista utenti<br />
                    GET /api/v1/users/:id - Dettagli utente<br />
                    POST /api/v1/users - Crea utente<br />
                    PUT /api/v1/users/:id - Aggiorna utente<br />
                    DELETE /api/v1/users/:id - Elimina utente<br />
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gestione Database
              </CardTitle>
              <CardDescription>Gestisci la configurazione e le operazioni del database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Stato Database</h3>
                  <p className="text-sm mb-4">Il database è attualmente online e funzionante.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Connessioni attive:</span>
                      <span className="text-sm font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Dimensione totale:</span>
                      <span className="text-sm font-medium">456 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ultimo backup:</span>
                      <span className="text-sm font-medium">Oggi, 05:30</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Operazioni Database</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Esegui Backup
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Ripristina da Backup
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Ottimizza Database
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Migrazioni Schema
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Query SQL Personalizzata</h3>
                <textarea 
                  className="w-full h-20 p-2 rounded-md border mb-2" 
                  placeholder="Inserisci la tua query SQL qui..."
                ></textarea>
                <div className="flex justify-end">
                  <Button variant="secondary">Esegui Query</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Deployment</CardTitle>
              <CardDescription>Gestisci il deployment dell'applicazione</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Stato Deployment</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Versione:</span>
                      <span className="text-sm font-medium">v2.3.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ultimo deploy:</span>
                      <span className="text-sm font-medium">10/04/2025 12:45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ambiente:</span>
                      <span className="text-sm font-medium">Production</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="default" className="flex gap-2 items-center">
                    <Code className="h-4 w-4" />
                    Deploy in Staging
                  </Button>
                  <Button variant="default" className="flex gap-2 items-center">
                    <Code className="h-4 w-4" />
                    Deploy in Production
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">Ultimi Deployment</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-medium">v2.3.0</p>
                        <p className="text-sm text-muted-foreground">10/04/2025 12:45</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Logs</Button>
                        <Button variant="ghost" size="sm">Rollback</Button>
                      </div>
                    </div>
                    <div className="p-3 border rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-medium">v2.2.5</p>
                        <p className="text-sm text-muted-foreground">05/04/2025 09:30</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Logs</Button>
                        <Button variant="ghost" size="sm">Rollback</Button>
                      </div>
                    </div>
                    <div className="p-3 border rounded-md flex justify-between items-center">
                      <div>
                        <p className="font-medium">v2.2.0</p>
                        <p className="text-sm text-muted-foreground">28/03/2025 15:20</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Logs</Button>
                        <Button variant="ghost" size="sm">Rollback</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Impostazioni di Sicurezza
              </CardTitle>
              <CardDescription>Configura le impostazioni di sicurezza dell'applicazione</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Switch id="tls-enabled" defaultChecked />
                  <div>
                    <Label htmlFor="tls-enabled" className="mb-1 block">TLS/SSL Obbligatorio</Label>
                    <p className="text-sm text-muted-foreground">
                      Richiede connessioni sicure HTTPS per tutte le API
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Switch id="2fa-enabled" defaultChecked />
                  <div>
                    <Label htmlFor="2fa-enabled" className="mb-1 block">2FA per gli Amministratori</Label>
                    <p className="text-sm text-muted-foreground">
                      Richiede autenticazione a due fattori per gli account amministratore
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Switch id="rate-limiting" defaultChecked />
                  <div>
                    <Label htmlFor="rate-limiting" className="mb-1 block">Limitazione Richieste API</Label>
                    <p className="text-sm text-muted-foreground">
                      Limita il numero di richieste API per IP per prevenire abusi
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Chiavi API</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">Chiave Produzione</p>
                      <p className="text-sm text-muted-foreground">Scade: 31/12/2025</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Mostra</Button>
                      <Button variant="ghost" size="sm">Rigenera</Button>
                    </div>
                  </div>
                  <div className="p-3 border rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">Chiave Test</p>
                      <p className="text-sm text-muted-foreground">Scade: 31/12/2025</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Mostra</Button>
                      <Button variant="ghost" size="sm">Rigenera</Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline">Genera Nuova Chiave API</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log di Sistema</CardTitle>
              <CardDescription>Visualizza e analizza i log di sistema dell'applicazione</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <option value="all">Tutti i livelli</option>
                    <option value="error">Solo errori</option>
                    <option value="warning">Avvisi e errori</option>
                    <option value="info">Informazioni</option>
                    <option value="debug">Debug</option>
                  </Select>
                  <Button variant="outline">Aggiorna</Button>
                  <Button variant="outline">Download</Button>
                </div>
                
                <div className="h-80 overflow-y-auto border rounded-md p-4 bg-muted/50">
                  <pre className="text-xs font-mono">
                    <code>
                      [2025-04-19 08:14:22] [INFO] Server started on port 3000<br />
                      [2025-04-19 08:15:30] [INFO] User id=42 logged in<br />
                      [2025-04-19 08:16:45] [WARNING] High memory usage detected: 85%<br />
                      [2025-04-19 08:18:12] [ERROR] Failed to connect to database: timeout<br />
                      [2025-04-19 08:18:15] [INFO] Database connection retry successful<br />
                      [2025-04-19 08:19:01] [INFO] User id=15 logged in<br />
                      [2025-04-19 08:20:32] [DEBUG] Cache hit ratio: 78%<br />
                      [2025-04-19 08:22:47] [INFO] API request: GET /api/v1/teams<br />
                      [2025-04-19 08:23:10] [WARNING] Slow query detected: SELECT * FROM users WHERE last_login > ?<br />
                      [2025-04-19 08:25:01] [INFO] Scheduled task started: daily-backup<br />
                      [2025-04-19 08:30:45] [INFO] Scheduled task completed: daily-backup<br />
                      [2025-04-19 08:32:22] [INFO] User id=42 logged out<br />
                      [2025-04-19 08:35:17] [ERROR] Failed to process image upload: file too large<br />
                    </code>
                  </pre>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Mostrando 13 righe di log</span>
                  <span>Ultima attività: 19/04/2025 08:35:17</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Developer;
