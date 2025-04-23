
import React from 'react';
import { usePlayerManagement } from '@/context/PlayerManagementContext';
import { Badge } from "@/components/ui/badge";

interface PlayerConsentsProps {
  playerId?: string;
  onlyCurrentPlayer?: boolean;
}

const PlayerConsents: React.FC<PlayerConsentsProps> = ({ playerId, onlyCurrentPlayer }) => {
  const { playerConsents } = usePlayerManagement();
  
  const filteredConsents = playerId 
    ? playerConsents.filter(consent => consent.playerId === playerId)
    : playerConsents;

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
