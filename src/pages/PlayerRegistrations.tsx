
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlayerRegistrationTable } from './player-registrations/PlayerRegistrationTable';
import { usePlayerManagement } from '@/context/PlayerManagementContext';

const PlayerRegistrations = () => {
  const navigate = useNavigate();
  const { playerRegistrations, teamGroups } = usePlayerManagement();
  
  // Handler functions for the registration table
  const handleSendInvitation = (registrationId: string) => {
    console.log('Send invitation for:', registrationId);
    // Implement the actual invitation sending logic
  };

  const handleManageRegistration = (registration: any) => {
    console.log('Manage registration:', registration);
    // Implement the management logic
  };

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
      <PlayerRegistrationTable 
        registrations={playerRegistrations}
        teamGroups={teamGroups}
        onSendInvitation={handleSendInvitation}
        onManage={handleManageRegistration}
      />
    </div>
  );
};

export default PlayerRegistrations;
