
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePlayerManagement } from '@/context/PlayerManagementContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, XCircle, RefreshCw, FileText, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import it from 'date-fns/locale/it';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PlayerConsent } from '@/types/player-management';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PlayerConsentsPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    playerRegistrations, 
    playerConsents,
    seasons,
    currentSeason
  } = usePlayerManagement();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isConsentDialogOpen, setIsConsentDialogOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [consentType, setConsentType] = useState<'terms' | 'privacy' | 'regulations'>('terms');
  
  // Stato per tenere traccia dei consensi accettati nel form
  const [formConsents, setFormConsents] = useState({
    terms: false,
    privacy: false,
    regulations: false,
  });
  
  // Funzione per simulare l'invio di un consenso
  const handleConsentSubmit = () => {
    // In un'applicazione reale, qui salveremmo i consensi nel database
    // con informazioni come l'IP, la data, ecc.
    
    // Per ora simuliamo solo la chiusura del dialog
    setIsConsentDialogOpen(false);
    setFormConsents({
      terms: false,
      privacy: false,
      regulations: false,
    });
  };
  
  // Filtra i giocatori in base alla ricerca
  const filteredPlayers = playerRegistrations.filter(reg => {
    const fullName = `${reg.firstName} ${reg.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  
  // Verifica se l'utente ha i permessi di amministrazione
  const hasAdminAccess = user?.role === 'admin' || user?.role === 'coach';
  
  if (!hasAdminAccess) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Accesso negato</CardTitle>
            <CardDescription>
              Non hai i permessi necessari per visualizzare questa pagina.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Ottiene i consensi di un giocatore
  const getPlayerConsents = (playerId: string): PlayerConsent[] => {
    return playerConsents.filter(consent => consent.playerId === playerId);
  };
  
  // Ottieni il giocatore selezionato
  const selectedPlayer = selectedPlayerId 
    ? playerRegistrations.find(reg => reg.playerId === selectedPlayerId) 
    : null;
  
  // Verifica se un giocatore ha dato un consenso specifico
  const hasConsent = (playerId: string, type: 'terms' | 'privacy' | 'regulations'): boolean => {
    return playerConsents.some(consent => 
      consent.playerId === playerId && consent.type === type
    );
  };
  
  // Ottieni il documento di consenso in base al tipo
  const getConsentDocument = (type: 'terms' | 'privacy' | 'regulations') => {
    switch (type) {
      case 'terms':
        return `
# Termini e Condizioni d'Uso

Ultimo aggiornamento: ${format(new Date(), 'dd MMMM yyyy', { locale: it })}

## 1. Accettazione dei Termini

Utilizzando i servizi offerti dalla nostra società sportiva, l'utente accetta di essere vincolato dai presenti Termini e Condizioni d'Uso. Se non si accettano tutti i termini e le condizioni, non è possibile utilizzare i servizi.

## 2. Modifiche ai Termini

Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Le modifiche entrano in vigore immediatamente dopo la pubblicazione. L'uso continuato dei servizi dopo tali modifiche costituirà il consenso a tali modifiche.

## 3. Utilizzo dei Servizi

I servizi sono destinati esclusivamente all'uso personale e non commerciale. L'utente non può modificare, copiare, distribuire, trasmettere, visualizzare, eseguire, riprodurre, pubblicare, concedere in licenza, creare opere derivate, trasferire o vendere qualsiasi informazione ottenuta dai nostri servizi.

## 4. Registrazione dell'Account

Per utilizzare determinati servizi, è necessario registrare un account. L'utente è responsabile del mantenimento della riservatezza delle informazioni dell'account e di tutte le attività che si verificano sotto il proprio account.

## 5. Comportamento dell'Utente

L'utente accetta di non utilizzare i servizi per:
- Violare leggi o regolamenti
- Violare i diritti di terzi
- Interferire con l'utilizzo dei servizi da parte di altri

## 6. Limitazione di Responsabilità

In nessun caso la società sportiva sarà responsabile per danni indiretti, incidentali, speciali, consequenziali o punitivi, inclusi, senza limitazione, perdita di profitti, dati, uso, avviamento o altre perdite intangibili.

## 7. Legge Applicabile

Questi termini saranno regolati e interpretati in conformità con le leggi italiane, senza riguardo alle sue disposizioni sui conflitti di legge.

## 8. Contatti

Per domande sui Termini e Condizioni d'Uso, contattare la direzione della società sportiva.
`;
      case 'privacy':
        return `
# Informativa sulla Privacy

Ultimo aggiornamento: ${format(new Date(), 'dd MMMM yyyy', { locale: it })}

## 1. Raccolta delle Informazioni

Raccogliamo informazioni personali come nome, indirizzo email, data di nascita e altre informazioni pertinenti quando ci vengono fornite volontariamente durante la registrazione o in altri contesti.

## 2. Utilizzo delle Informazioni

Utilizziamo le informazioni raccolte per:
- Gestire la partecipazione alle attività sportive
- Comunicare notizie, aggiornamenti e informazioni relative alla società sportiva
- Migliorare i nostri servizi
- Rispondere a richieste, domande e preoccupazioni
- Adempiere agli obblighi legali

## 3. Condivisione delle Informazioni

Non vendiamo, scambiamo o trasferiamo in altro modo a terzi le informazioni personali identificabili, a meno che non sia necessario per fornire i servizi richiesti o richiesto dalla legge.

## 4. Protezione delle Informazioni

Adottiamo misure di sicurezza appropriate per proteggere le informazioni personali da accessi non autorizzati, alterazione, divulgazione o distruzione.

## 5. Cookie e Tecnologie di Tracciamento

Possiamo utilizzare cookie e tecnologie simili per migliorare l'esperienza dell'utente, analizzare le tendenze e amministrare il sito web.

## 6. Diritti dell'Interessato

In conformità con la normativa applicabile sulla protezione dei dati, gli utenti hanno il diritto di:
- Accedere alle proprie informazioni personali
- Correggere informazioni imprecise
- Richiedere la cancellazione delle informazioni
- Opporsi al trattamento delle informazioni
- Richiedere la limitazione del trattamento

## 7. Modifiche all'Informativa sulla Privacy

Possiamo aggiornare questa informativa sulla privacy di tanto in tanto. Gli utenti saranno informati di eventuali modifiche sostanziali.

## 8. Contatti

Per domande sulla nostra Informativa sulla Privacy, contattare la direzione della società sportiva.
`;
      case 'regulations':
        return `
# Regolamento Interno della Società

Ultimo aggiornamento: ${format(new Date(), 'dd MMMM yyyy', { locale: it })}

## 1. Principi Generali

Tutti i membri della società sportiva sono tenuti a:
- Rispettare i principi di lealtà, probità e correttezza sportiva
- Astenersi da qualsiasi comportamento discriminatorio
- Rispettare le strutture, le attrezzature e i materiali messi a disposizione

## 2. Obblighi degli Atleti

Gli atleti tesserati sono tenuti a:
- Partecipare con regolarità agli allenamenti e alle partite
- Avvisare tempestivamente in caso di assenza
- Mantenere un comportamento rispettoso verso compagni, avversari, arbitri e staff
- Indossare l'abbigliamento sportivo fornito dalla società durante gli eventi ufficiali

## 3. Quota Associativa e Contributi

Gli atleti sono tenuti al pagamento della quota associativa annuale e dei contributi stabiliti dal Consiglio Direttivo, secondo le modalità e le scadenze indicate.

## 4. Certificazioni Mediche

È obbligatorio presentare un certificato medico valido per l'attività sportiva praticata, secondo quanto previsto dalla normativa vigente.

## 5. Utilizzo delle Strutture

L'accesso alle strutture sportive è riservato agli atleti tesserati durante gli orari di allenamento e di partita. È vietato l'ingresso negli spogliatoi a persone non autorizzate.

## 6. Provvedimenti Disciplinari

In caso di comportamenti contrari al presente regolamento, la società può adottare provvedimenti disciplinari, che possono includere richiami, sospensioni temporanee o esclusione definitiva.

## 7. Responsabilità per Danni

Chiunque causi danni alle strutture, alle attrezzature o ai materiali della società sarà tenuto al risarcimento.

## 8. Modifiche al Regolamento

Il Consiglio Direttivo può modificare il presente regolamento in qualsiasi momento, dandone comunicazione agli interessati.

## 9. Accettazione del Regolamento

L'iscrizione alla società sportiva implica l'accettazione integrale del presente regolamento.
`;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-sportivo-blue">Consensi e Firme Digitali</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestione Consensi</CardTitle>
          <CardDescription>
            Monitora e gestisci i consensi firmati digitalmente dai giocatori o dai loro tutori
          </CardDescription>
          
          <div className="relative flex-1 mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca giocatore per nome..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <Card key={player.playerId} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {getInitials(`${player.firstName} ${player.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {player.firstName} {player.lastName}
                        </CardTitle>
                        <CardDescription>
                          {player.isMinor ? 'Minorenne' : 'Maggiorenne'} • {player.contactEmail}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Termini e Condizioni</span>
                        </div>
                        {hasConsent(player.playerId, 'terms') ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Accettato
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Non firmato
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>Privacy Policy</span>
                        </div>
                        {hasConsent(player.playerId, 'privacy') ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Accettato
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Non firmato
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>Regolamento Interno</span>
                        </div>
                        {hasConsent(player.playerId, 'regulations') ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Accettato
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
                            <XCircle className="h-3 w-3" /> Non firmato
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        setSelectedPlayerId(player.playerId);
                        setIsConsentDialogOpen(true);
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" /> 
                      Richiedi firma
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-6 text-muted-foreground">
                Nessun giocatore corrisponde ai criteri di ricerca.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog per la firma dei consensi */}
      <Dialog open={isConsentDialogOpen} onOpenChange={setIsConsentDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedPlayer && (
            <>
              <DialogHeader>
                <DialogTitle>Firma Consensi Digitali</DialogTitle>
                <DialogDescription>
                  {selectedPlayer.firstName} {selectedPlayer.lastName} 
                  {selectedPlayer.isMinor ? ' (Minorenne)' : ' (Maggiorenne)'}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="terms" onValueChange={(value) => setConsentType(value as any)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="terms">Termini e Condizioni</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                  <TabsTrigger value="regulations">Regolamento</TabsTrigger>
                </TabsList>
                
                <TabsContent value="terms" className="space-y-4">
                  <div className="h-[400px] overflow-y-auto p-4 border rounded-md">
                    <div className="prose max-w-none dark:prose-invert">
                      <pre className="text-sm whitespace-pre-wrap font-sans">
                        {getConsentDocument('terms')}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms-consent"
                      checked={formConsents.terms}
                      onCheckedChange={(checked) => 
                        setFormConsents(prev => ({ ...prev, terms: checked as boolean }))
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="terms-consent"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accetto i Termini e Condizioni d'Uso
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedPlayer.isMinor 
                          ? `In qualità di genitore/tutore di ${selectedPlayer.firstName} ${selectedPlayer.lastName}, accetto questi termini per suo conto.`
                          : 'Accetto questi termini e condizioni per l\'utilizzo dei servizi.'}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="privacy" className="space-y-4">
                  <div className="h-[400px] overflow-y-auto p-4 border rounded-md">
                    <div className="prose max-w-none dark:prose-invert">
                      <pre className="text-sm whitespace-pre-wrap font-sans">
                        {getConsentDocument('privacy')}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacy-consent"
                      checked={formConsents.privacy}
                      onCheckedChange={(checked) => 
                        setFormConsents(prev => ({ ...prev, privacy: checked as boolean }))
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="privacy-consent"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accetto l'Informativa sulla Privacy
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedPlayer.isMinor 
                          ? `In qualità di genitore/tutore di ${selectedPlayer.firstName} ${selectedPlayer.lastName}, acconsento al trattamento dei suoi dati personali.`
                          : 'Acconsento al trattamento dei miei dati personali come descritto nell\'informativa.'}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="regulations" className="space-y-4">
                  <div className="h-[400px] overflow-y-auto p-4 border rounded-md">
                    <div className="prose max-w-none dark:prose-invert">
                      <pre className="text-sm whitespace-pre-wrap font-sans">
                        {getConsentDocument('regulations')}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="regulations-consent"
                      checked={formConsents.regulations}
                      onCheckedChange={(checked) => 
                        setFormConsents(prev => ({ ...prev, regulations: checked as boolean }))
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="regulations-consent"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accetto il Regolamento Interno della Società
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {selectedPlayer.isMinor 
                          ? `In qualità di genitore/tutore di ${selectedPlayer.firstName} ${selectedPlayer.lastName}, mi impegno a far rispettare il regolamento interno.`
                          : 'Mi impegno a rispettare il regolamento interno della società sportiva.'}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="bg-muted p-4 rounded-md text-sm">
                <p>
                  Firmando digitalmente, confermi di aver letto e compreso i documenti sopra indicati.
                  La tua firma sarà registrata insieme al tuo indirizzo IP e alla data e ora correnti.
                </p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConsentDialogOpen(false)}>
                  Annulla
                </Button>
                <Button 
                  onClick={handleConsentSubmit}
                  disabled={!formConsents[consentType]}
                >
                  Firma {consentType === 'terms' ? 'Termini' : consentType === 'privacy' ? 'Privacy' : 'Regolamento'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayerConsentsPage;
