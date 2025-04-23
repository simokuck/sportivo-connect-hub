
import React from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const PendingUserRestriction = () => {
  return (
    <div className="container py-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4">
            <AlertCircle className="h-12 w-12 text-yellow-500" />
            <CardTitle>Accesso in attesa di approvazione</CardTitle>
            <p className="text-muted-foreground">
              Il tuo account è in attesa di approvazione da parte di un amministratore. 
              Una volta approvato, avrai accesso alle funzionalità dell'applicazione.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
