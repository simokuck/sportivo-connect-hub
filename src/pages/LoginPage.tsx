import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Fingerprint } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsSubmitting(false);
        setLoginAttempted(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      try {
        if (window.PublicKeyCredential && 
            typeof window.PublicKeyCredential === 'function' && 
            typeof window.navigator.credentials.get === 'function') {
          setBiometricSupported(true);
        }
      } catch (error) {
        console.error('Biometric support check failed:', error);
      }
    };
    
    checkBiometricSupport();
  }, []);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      if (user && !loginAttempted && mounted) {
        console.log('User already logged in, redirecting to dashboard');
        navigate('/dashboard');
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [user, navigate, loginAttempted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setLoginAttempted(true);
      console.log('Login attempted with:', email);
      await login(email, password);
    } catch (error) {
      console.error('Login error in component:', error);
      setLoginAttempted(false);
    } finally {
      if (document.visibilityState === 'visible') {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = useCallback(() => {
    setIsSubmitting(false);
    setLoginAttempted(false);
  }, []);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const handleBiometricLogin = async () => {
    try {
      setLoginAttempted(true);
      toast.info('Autenticazione biometrica in corso...');
      // Here you would implement the actual WebAuthn/FIDO2 authentication
      // This is just a placeholder for demonstration
      toast.error('Funzionalità biometrica in sviluppo');
      setLoginAttempted(false);
    } catch (error) {
      console.error('Biometric auth error:', error);
      toast.error('Autenticazione biometrica fallita');
      setLoginAttempted(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Inserisci la tua email per resettare la password');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Se l\'email esiste, riceverai le istruzioni per il reset della password');
    } catch (error: any) {
      console.error('Password reset request error:', error);
      toast.error(error.message || 'Errore durante la richiesta di reset password');
    } finally {
      setIsSubmitting(false);
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
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? 'Accesso in corso...' : 'Accedi'}
              </Button>
              
              {biometricSupported && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleBiometricLogin}
                  disabled={loading}
                >
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Accedi con riconoscimento biometrico
                </Button>
              )}
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={handleForgotPassword}
                disabled={isSubmitting}
              >
                Password dimenticata?
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
