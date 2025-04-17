
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: 'Login effettuato',
        description: 'Benvenuto su Sportivo Connect Hub',
      });
    } catch (error) {
      toast({
        title: 'Errore di login',
        description: 'Credenziali non valide. Prova con marco@example.com / password',
        variant: 'destructive',
      });
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    try {
      await login(demoEmail, 'password');
      toast({
        title: 'Login demo effettuato',
        description: 'Accesso come ' + demoEmail,
      });
    } catch (error) {
      toast({
        title: 'Errore di login',
        description: 'Qualcosa è andato storto',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sportivo-blue to-sportivo-green p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sportivo Connect Hub</h1>
          <p className="text-white/80">Piattaforma di gestione per società sportive</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accedi</CardTitle>
            <CardDescription>
              Inserisci le tue credenziali per accedere alla piattaforma
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@esempio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Accesso in corso...' : 'Accedi'}
              </Button>

              <div className="text-sm text-gray-500 mt-4">
                <p className="mb-2">Demo: Scegli un ruolo per provare l'app</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => handleDemoLogin('marco@example.com')}
                  >
                    Giocatore
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => handleDemoLogin('paolo@example.com')}
                  >
                    Allenatore
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => handleDemoLogin('giuseppe@example.com')}
                  >
                    Amministrazione
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => handleDemoLogin('anna@example.com')}
                  >
                    Staff Medico
                  </Button>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
