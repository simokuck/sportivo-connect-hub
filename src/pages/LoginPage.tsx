
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Fingerprint } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricDialog, setBiometricDialog] = useState(false);
  const { login, loading, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Check if biometric authentication is available in the browser
  useEffect(() => {
    const checkBiometricSupport = async () => {
      try {
        // This is a basic check for PublicKeyCredential API which is required for biometrics
        if (window.PublicKeyCredential) {
          setBiometricSupported(true);
        }
      } catch (error) {
        console.error("Error checking biometric support:", error);
      }
    };

    checkBiometricSupport();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: 'Login effettuato',
        description: 'Benvenuto su Sportivo Connect Hub',
      });
      navigate('/'); // Navigate to dashboard after successful login
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
      navigate('/'); // Navigate to dashboard after successful demo login
    } catch (error) {
      toast({
        title: 'Errore di login',
        description: 'Qualcosa è andato storto',
        variant: 'destructive',
      });
    }
  };

  const handleBiometricLogin = async () => {
    // Show biometric dialog
    setBiometricDialog(true);
    
    // Simulate successful biometric authentication after 2 seconds
    setTimeout(() => {
      setBiometricDialog(false);
      
      // For demo, log in as player (Marco)
      handleDemoLogin('marco@example.com');
    }, 2000);
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
              
              {biometricSupported && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleBiometricLogin}
                >
                  <Fingerprint className="mr-2 h-5 w-5" />
                  Accedi con riconoscimento biometrico
                </Button>
              )}

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

        {/* Biometric authentication dialog */}
        <Dialog open={biometricDialog} onOpenChange={setBiometricDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Riconoscimento biometrico</DialogTitle>
              <DialogDescription>
                Completa l'autenticazione biometrica sul tuo dispositivo
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-6">
              <Fingerprint className="h-16 w-16 text-sportivo-blue animate-pulse" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LoginPage;
