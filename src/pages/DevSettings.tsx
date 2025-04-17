
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DevSettings = () => {
  const { user } = useAuth();

  // Only allow access to users with role 'admin'
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-sportivo-blue mb-6">Impostazioni Sviluppatore</h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Generale</TabsTrigger>
          <TabsTrigger value="sports">Sport</TabsTrigger>
          <TabsTrigger value="roles">Ruoli</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Generali</CardTitle>
              <CardDescription>
                Configura le impostazioni base dell'applicazione
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Questa sezione verrà implementata per gestire le configurazioni generali dell'applicazione.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Sport</CardTitle>
              <CardDescription>
                Aggiungi e configura nuovi sport supportati dall'applicazione
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Qui verranno gestiti i diversi sport supportati (calcio, basket, pallavolo, ecc.)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Ruoli</CardTitle>
              <CardDescription>
                Configura i ruoli e le autorizzazioni per ogni sport
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Questa sezione permetterà di definire ruoli specifici per ogni sport
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevSettings;
