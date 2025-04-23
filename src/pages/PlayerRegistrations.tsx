
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlayerRegistrationTable from './player-registrations/PlayerRegistrationTable';

const PlayerRegistrations = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-8">
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
        <h1 className="text-3xl font-bold">Registrazioni Giocatori</h1>
      </div>
      <PlayerRegistrationTable />
    </div>
  );
};

export default PlayerRegistrations;
