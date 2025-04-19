
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { Code, Database, Settings, Users, FileCode, Server, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/context/ThemeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Developer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { setTheme } = useTheme();

  // Verify that the user is a developer, otherwise show access denied message
  if (user?.role !== 'developer') {
    return (
      <div className="container py-10">
        <Card className="border-red-300 bg-red-50 dark:bg-red-950">
          <CardHeader>
            <CardTitle>Accesso negato</CardTitle>
            <CardDescription>
              Non hai i permessi necessari per accedere a questa sezione.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Questa area è riservata agli sviluppatori. Contatta l'amministratore se hai bisogno di accesso.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleClearCache = () => {
    // Simulate clearing cache
    setTimeout(() => {
      toast({
        title: "Cache cancellata",
        description: "La cache dell'applicazione è stata cancellata con successo.",
      });
    }, 500);
  };

  const handleResetDatabase = () => {
    // Simulate database reset
    setTimeout(() => {
      toast({
        title: "Database resettato",
        description: "Il database è stato resettato alle impostazioni predefinite.",
      });
    }, 800);
  };

  const handleGenerateTestData = () => {
    // Simulate generating test data
    setTimeout(() => {
      toast({
        title: "Dati di test generati",
        description: "Sono stati generati nuovi dati di test nel sistema.",
      });
    }, 600);
  };

  const mockLogs = [
    { timestamp: "2025-04-19 08:32:14", level: "INFO", message: "Applicazione avviata correttamente" },
    { timestamp: "2025-04-19 08:35:22", level: "DEBUG", message: "Connessione al database stabilita" },
    { timestamp: "2025-04-19 08:37:43", level: "INFO", message: "Utente ID:45 ha effettuato il login" },
    { timestamp: "2025-04-19 08:40:11", level: "WARN", message: "Rilevati numerosi tentativi di login falliti" },
    { timestamp: "2025-04-19 08:45:23", level: "ERROR", message: "Errore durante il salvataggio del documento ID:234" },
    { timestamp: "2025-04-19 08:50:19", level: "INFO", message: "Backup giornaliero completato con successo" },
    { timestamp: "2025-04-19 08:52:37", level: "DEBUG", message: "Pulizia cache avviata" },
    { timestamp: "2025-04-19 08:55:43", level: "INFO", message: "Sincronizzazione dati completata" },
    { timestamp: "2025-04-19 09:01:05", level: "WARN", message: "Livello di memoria disponibile basso" },
    { timestamp: "2025-04-19 09:05:22", level: "ERROR", message: "Impossibile connettersi al server di posta" },
    { timestamp: "2025-04-19 09:15:11", level: "INFO", message: "API key generata per utente ID:78" },
    { timestamp: "2025-04-19 09:20:44", level: "DEBUG", message: "Controllo aggiornamenti completato" },
  ];

  const getLogStyle = (level: string) => {
    switch(level) {
      case "ERROR":
        return "text-red-600 dark:text-red-400 font-medium";
      case "WARN":
        return "text-amber-600 dark:text-amber-400 font-medium";
      case "INFO":
        return "text-blue-600 dark:text-blue-400";
      case "DEBUG":
        return "text-gray-600 dark:text-gray-400 text-opacity-80";
      default:
        return "";
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Pannello Sviluppatore</h1>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span className="hidden md:inline">Sistema</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden md:inline">Database</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden md:inline">Logs</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            <span className="hidden md:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Utenti</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Sicurezza</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content: System */}
        <TabsContent value="system">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informazioni di Sistema</CardTitle>
                <CardDescription>Statistiche e informazioni sul server</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Versione</p>
                    <p className="font-medium">1.0.0</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ambiente</p>
                    <p className="font-medium">Produzione</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ultimo Aggiornamento</p>
                    <p className="font-medium">19/04/2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="font-medium">3d 7h 23m</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Utilizzo CPU</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>0%</span>
                    <span>45%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Utilizzo Memoria</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>0%</span>
                    <span>68%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Spazio Disco</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>0%</span>
                    <span>78%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => toast({ title: "Aggiornamento", description: "Statistiche di sistema aggiornate" })}>
                  Aggiorna Statistiche
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manutenzione</CardTitle>
                <CardDescription>Operazioni di manutenzione del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-mode">Modalità Manutenzione</Label>
                    <Switch id="maintenance-mode" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Attiva la modalità manutenzione per impedire l'accesso agli utenti durante gli aggiornamenti
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleClearCache}>Cancella Cache</Button>
                  <Button onClick={() => toast({ title: "Riavvio", description: "Server riavviato con successo" })}>
                    Riavvia Server
                  </Button>
                </div>

                <div className="pt-2">
                  <Label htmlFor="maintenance-message">Messaggio di Manutenzione</Label>
                  <Input 
                    id="maintenance-message"
                    placeholder="Stiamo effettuando manutenzione programmata..."
                    className="mt-2"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    toast({ 
                      title: "Modalità Manutenzione", 
                      description: "La modalità manutenzione verrà attivata tra 5 minuti",
                      variant: "destructive" 
                    });
                  }}
                >
                  Pianifica Manutenzione
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Content: Database */}
        <TabsContent value="database">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Database</CardTitle>
                <CardDescription>Operazioni sul database dell'applicazione</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Stato Connessione</p>
                    <div className="flex items-center mt-1">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <p className="font-medium">Connesso</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo Database</p>
                    <p className="font-medium">PostgreSQL 14</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dimensione</p>
                    <p className="font-medium">1.2 GB</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tabelle</p>
                    <p className="font-medium">42</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Ultimo Backup</p>
                  <div className="flex justify-between text-sm">
                    <span>19/04/2025, 03:00 AM</span>
                    <span className="text-green-600 dark:text-green-400">Completato con successo</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => toast({ title: "Backup", description: "Backup del database avviato" })}>
                    Backup Manuale
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => toast({ title: "Ottimizzazione", description: "Database ottimizzato con successo" })}
                  >
                    Ottimizza DB
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="destructive" onClick={handleResetDatabase}>
                  Reset Database
                </Button>
                <Button variant="secondary" onClick={handleGenerateTestData}>
                  Genera Dati Test
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Query Database</CardTitle>
                <CardDescription>Esegui query SQL dirette</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sql-query">Query SQL</Label>
                  <textarea
                    id="sql-query"
                    placeholder="SELECT * FROM users LIMIT 10;"
                    className="w-full min-h-[120px] p-2 border rounded-md bg-gray-50 dark:bg-gray-900 font-mono text-sm"
                  ></textarea>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Pulisci</Button>
                <Button onClick={() => toast({ title: "Query", description: "Query eseguita con successo" })}>
                  Esegui Query
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Content: Logs */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Log di Sistema</CardTitle>
              <CardDescription>Visualizza i log dell'applicazione</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="log-level" className="text-sm">Livello:</Label>
                  <select
                    id="log-level"
                    className="text-sm p-1 border rounded"
                    defaultValue="all"
                  >
                    <option value="all">Tutti</option>
                    <option value="error">Errori</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Log", description: "Log aggiornati" })}>
                  Aggiorna
                </Button>
              </div>

              <ScrollArea className="h-[400px] border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                <div className="font-mono text-sm space-y-2">
                  {mockLogs.map((log, index) => (
                    <div key={index} className={`${getLogStyle(log.level)}`}>
                      <span className="text-gray-500 dark:text-gray-400">{log.timestamp}</span>
                      {" ["}
                      <span className={getLogStyle(log.level)}>{log.level}</span>
                      {"] "}
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => toast({ title: "Log", description: "Log scaricati come file" })}>
                Scarica Log
              </Button>
              <Button variant="destructive" onClick={() => toast({ title: "Log", description: "Log cancellati" })}>
                Cancella Log
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab Content: API */}
        <TabsContent value="api">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Gestione delle chiavi API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">API Key Principale</p>
                      <p className="text-sm text-muted-foreground">Generata il: 15/03/2025</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "API", description: "API key copiata negli appunti" })}>
                      Copia
                    </Button>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm overflow-x-auto">
                    sk_test_51JgKMLKjhGfD9wer8765gfdsJK76hGFD8sdHGF87
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">API Key Sviluppo</p>
                      <p className="text-sm text-muted-foreground">Generata il: 18/04/2025</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "API", description: "API key copiata negli appunti" })}>
                      Copia
                    </Button>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono text-sm overflow-x-auto">
                    sk_dev_51JgKMLKjhGfD9werHGF876gJK76hGFD8sdHGF87
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => toast({ title: "API", description: "Nuova API key generata con successo" })}>
                  Genera Nuova API Key
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endpoint API</CardTitle>
                <CardDescription>Documentazione e stato degli endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[240px]">
                  <div className="space-y-3">
                    {[
                      { name: "/api/users", method: "GET", status: "Attivo" },
                      { name: "/api/users/:id", method: "GET", status: "Attivo" },
                      { name: "/api/users", method: "POST", status: "Attivo" },
                      { name: "/api/users/:id", method: "PUT", status: "Attivo" },
                      { name: "/api/users/:id", method: "DELETE", status: "Attivo" },
                      { name: "/api/teams", method: "GET", status: "Attivo" },
                      { name: "/api/teams/:id", method: "GET", status: "Attivo" },
                      { name: "/api/teams", method: "POST", status: "Attivo" },
                      { name: "/api/stats", method: "GET", status: "Manutenzione" },
                      { name: "/api/documents", method: "GET", status: "Attivo" },
                      { name: "/api/documents/:id", method: "GET", status: "Attivo" },
                      { name: "/api/events", method: "GET", status: "Attivo" },
                    ].map((endpoint, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-mono text-sm">{endpoint.name}</p>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                              endpoint.method === 'POST' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                              endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {endpoint.method}
                            </span>
                            <span className={`ml-2 text-xs ${endpoint.status === 'Attivo' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              {endpoint.status}
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2"
                          onClick={() => toast({ title: "Endpoint", description: `Documentazione per ${endpoint.name}` })}
                        >
                          Docs
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => window.open('https://api.docs.example.com', '_blank')}>
                  Documentazione Completa
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Content: Users */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Utenti Test</CardTitle>
              <CardDescription>Crea e gestisci utenti per il testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-email">Email</Label>
                    <Input id="test-email" placeholder="test@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="test-password">Password</Label>
                    <Input id="test-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="test-role">Ruolo</Label>
                    <select
                      id="test-role"
                      className="w-full p-2 border rounded"
                      defaultValue="player"
                    >
                      <option value="player">Giocatore</option>
                      <option value="coach">Allenatore</option>
                      <option value="admin">Admin</option>
                      <option value="medical">Staff Medico</option>
                      <option value="developer">Sviluppatore</option>
                    </select>
                  </div>
                  <Button className="w-full" onClick={() => toast({ title: "Utente", description: "Utente di test creato con successo" })}>
                    Crea Utente Test
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Utenti di Test Disponibili</h3>
                  <ScrollArea className="h-[200px] border rounded p-4">
                    {[
                      { name: "Test Giocatore", email: "test-player@example.com", role: "player" },
                      { name: "Test Allenatore", email: "test-coach@example.com", role: "coach" },
                      { name: "Test Admin", email: "test-admin@example.com", role: "admin" },
                      { name: "Test Medico", email: "test-medical@example.com", role: "medical" },
                      { name: "Test Sviluppatore", email: "test-dev@example.com", role: "developer" },
                    ].map((user, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                            {user.role}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toast({ title: "Login", description: `Accesso come ${user.name}` })}
                        >
                          Accedi
                        </Button>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Content: Security */}
        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Impostazioni di Sicurezza</CardTitle>
                <CardDescription>Configura i parametri di sicurezza</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Autenticazione a due fattori</Label>
                      <p className="text-sm text-muted-foreground">Richiedi 2FA per tutti gli utenti admin</p>
                    </div>
                    <Switch id="2fa" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ip-restriction">Restrizioni IP</Label>
                      <p className="text-sm text-muted-foreground">Limita l'accesso a IP specifici</p>
                    </div>
                    <Switch id="ip-restriction" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="session-timeout">Timeout Sessione</Label>
                      <p className="text-sm text-muted-foreground">Termina sessioni inattive dopo 30 minuti</p>
                    </div>
                    <Switch id="session-timeout" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password-policy">Policy Password</Label>
                    <select
                      id="password-policy"
                      className="w-full p-2 border rounded"
                      defaultValue="strong"
                    >
                      <option value="basic">Base (min. 8 caratteri)</option>
                      <option value="medium">Media (min. 10 caratteri, numeri)</option>
                      <option value="strong">Forte (min. 12 caratteri, speciali, numeri)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => toast({ title: "Sicurezza", description: "Impostazioni di sicurezza aggiornate" })}>
                  Salva Impostazioni
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Audit</CardTitle>
                <CardDescription>Controlla la sicurezza dell'applicazione</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Ultimi Test di Penetrazione</span>
                      <span className="text-green-600 dark:text-green-400">Passato</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Completato il 10/04/2025</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Vulnerabilità Rilevate</span>
                      <span>2 basse, 0 critiche</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Aggiornato il 15/04/2025</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Certificati SSL</span>
                      <span className="text-green-600 dark:text-green-400">Validi</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Scadenza: 15/10/2025</p>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast({ 
                        title: "Scan di sicurezza", 
                        description: "Scansione di sicurezza completata. Nessuna vulnerabilità critica rilevata." 
                      })}
                    >
                      Esegui Scan di Sicurezza
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => toast({ title: "Rapporto", description: "Rapporto di sicurezza generato e scaricato" })}
                >
                  Genera Rapporto Sicurezza
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Developer;
