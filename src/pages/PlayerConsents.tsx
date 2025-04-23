
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerManagement } from '@/context/PlayerManagementContext';
import { Badge } from "@/components/ui/badge";

interface PlayerConsentsProps {
  playerId?: string;
  onlyCurrentPlayer?: boolean;
}

const PlayerConsents: React.FC<PlayerConsentsProps> = ({ playerId, onlyCurrentPlayer }) => {
  const { playerConsents } = usePlayerManagement();
  const navigate = useNavigate();
  
  const filteredConsents = playerId 
    ? playerConsents.filter(consent => consent.playerId === playerId)
    : playerConsents;
    
  // Only show the back button if we're not embedded in another component
  const showBackButton = !onlyCurrentPlayer;

  const getConsentTypeLabel = (type: string) => {
    switch (type) {
      case 'terms': return 'Termini e Condizioni';
      case 'privacy': return 'Privacy';
      case 'regulations': return 'Regolamento';
      case 'medical': return 'Certificato Medico';
      case 'insurance': return 'Assicurazione';
      case 'photo': return 'Uso Immagini';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      {showBackButton && (
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/user-management')} 
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Indietro
          </Button>
          <h1 className="text-3xl font-bold">Consensi Giocatori</h1>
        </div>
      )}
      
      {filteredConsents.length === 0 ? (
        <p className="text-muted-foreground italic">Nessun consenso registrato</p>
      ) : (
        <div className="space-y-3">
          {filteredConsents.map((consent) => (
            <div key={consent.id} className="border rounded-md p-3 bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{getConsentTypeLabel(consent.type)}</h4>
                  <p className="text-sm text-muted-foreground">
                    Versione: {consent.version}
                  </p>
                </div>
                <Badge variant="outline">
                  {consent.isGuardian ? 'Firmato da tutore' : 'Firmato dal giocatore'}
                </Badge>
              </div>
              <div className="mt-2 text-sm">
                <p>Firmato il: {new Date(consent.signedAt).toLocaleString('it-IT')}</p>
                <p>Email: {consent.signedByEmail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerConsents;
