
import React, { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoles } from '@/hooks/useRoles';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const CreateUserDialog = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const { roles } = useRoles();
  
  const handleCreateUser = async () => {
    try {
      // Step 1: Create user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'temp_password_123!', // Temporary password, user should reset
      });

      if (error) throw error;

      // Step 2: Assign role to user
      if (data.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role_id: role
          });

        if (roleError) throw roleError;

        toast.success('User created successfully');
      }
    } catch (err) {
      toast.error('Error creating user');
      console.error(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Utente
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crea Nuovo Utente</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Ruolo
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleziona ruolo" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleCreateUser}>
            Crea Utente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
      <div className="flex items-center mb-6 justify-between">
        <div className="flex items-center">
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
        <CreateUserDialog />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Elenco Utenti</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Questa sezione mostra l'elenco degli utenti del sistema.</p>
          {/* TODO: Implement user list */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
