
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayerManagement } from '@/context/PlayerManagementContext';

interface PlayerHistoryProps {
  playerId?: string;
  onlyCurrentPlayer?: boolean;
}

const PlayerHistory: React.FC<PlayerHistoryProps> = ({ playerId, onlyCurrentPlayer }) => {
  const { playerHistory, getPlayerHistory } = usePlayerManagement();
  const navigate = useNavigate();
  
  const playerHistoryData = playerId ? getPlayerHistory(playerId) : playerHistory;
  
  // Only show the back button if we're not embedded in another component
  const showBackButton = !onlyCurrentPlayer;

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
          <h1 className="text-3xl font-bold">Storico Giocatori</h1>
        </div>
      )}
      
      {playerHistoryData.length === 0 ? (
        <p className="text-muted-foreground italic">Nessuno storico disponibile</p>
      ) : (
        <div className="space-y-3">
          {playerHistoryData.map((history) => (
            <div key={history.id} className="border rounded-md p-3 bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{history.teamGroupName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {history.categoryName} - {history.seasonName}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>Dal: {new Date(history.startDate).toLocaleDateString('it-IT')}</p>
                  {history.endDate && (
                    <p>Al: {new Date(history.endDate).toLocaleDateString('it-IT')}</p>
                  )}
                </div>
              </div>
              {history.position && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Ruolo:</span> {history.position}
                </div>
              )}
              {history.notes && (
                <div className="mt-1 text-sm">
                  <span className="font-medium">Note:</span> {history.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerHistory;
