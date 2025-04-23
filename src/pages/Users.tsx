
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthorized = user?.role === 'admin' || user?.role === 'developer';

  if (!isAuthorized) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Accesso non autorizzato</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Non disponi dei permessi necessari per visualizzare questa pagina.</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              Torna indietro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold">Gestione Utenze</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Elenco Utenti</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Questa sezione è in fase di sviluppo.</p>
          <p>Qui potrai gestire gli utenti della piattaforma, visualizzare i loro dati, modificare i loro ruoli e creare nuovi utenti.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
