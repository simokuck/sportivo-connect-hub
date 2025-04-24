
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "La password deve essere lunga almeno 8 caratteri")
    .max(100, "La password non può superare i 100 caratteri"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Le password non coincidono",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingToken, setIsProcessingToken] = useState(true);
  const [tokenVerified, setTokenVerified] = useState(false);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Handle the password reset token when the component mounts
  useEffect(() => {
    const handlePasswordRecovery = async () => {
      setIsProcessingToken(true);
      
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        // Check if we have token and type in URL parameters
        if (token && type === 'recovery') {
          console.log('Trovato token di recupero nei parametri URL');
          
          // Verify the token directly from query parameters
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });

          if (error) {
            throw error;
          }
          
          setTokenVerified(true);
          toast.success('Puoi ora impostare la tua nuova password');
        } else {
          // Check for hash fragment as fallback (old format)
          const hash = window.location.hash;
          
          if (hash && hash.includes('type=recovery')) {
            console.log('Trovato token di recupero nel fragment URL');
            // Extract the token from the URL hash
            // URL will be like: #access_token=...&type=recovery&...
            const accessToken = hash.split('&')[0].replace('#access_token=', '');
            
            if (!accessToken) {
              throw new Error('Token di recupero non valido nel fragment URL');
            }
            
            // Verify the recovery token
            const { error } = await supabase.auth.verifyOtp({
              token_hash: accessToken,
              type: 'recovery'
            });

            if (error) {
              throw error;
            }
            
            setTokenVerified(true);
            toast.success('Puoi ora impostare la tua nuova password');
          } else {
            throw new Error('Token di recupero non trovato. Assicurati di utilizzare il link ricevuto nell\'email');
          }
        }
      } catch (error: any) {
        console.error('Recovery error:', error);
        setError(error.message || 'Errore durante il recupero password');
        toast.error(error.message || 'Errore durante il recupero password');
      } finally {
        setIsProcessingToken(false);
      }
    };

    handlePasswordRecovery();
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.updateUser({ 
        password: data.password 
      });

      if (error) throw error;

      toast.success('Password aggiornata con successo');
      navigate('/login');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Errore durante il reset della password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isProcessingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sportivo-blue to-sportivo-green p-4">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin mx-auto text-white mb-4" />
          <p className="text-white text-lg">Verifica del token in corso...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sportivo-blue to-sportivo-green p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Errore</CardTitle>
            <CardDescription>
              Si è verificato un errore durante il processo di reset password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-500">{error}</p>
            <Button 
              className="w-full" 
              onClick={() => navigate('/login')}
            >
              Torna al login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sportivo-blue to-sportivo-green p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Token non valido</CardTitle>
            <CardDescription>
              Il token di recupero password non è valido o è scaduto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => navigate('/login')}
            >
              Torna al login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sportivo-blue to-sportivo-green p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Inserisci la tua nuova password per completare il processo di reset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nuova Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conferma Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Aggiornamento in corso...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
