
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Shield, ShieldAlert, User, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const roles = [
  { 
    id: 1, 
    name: "Administrator", 
    description: "Accesso completo a tutte le funzionalità del sistema",
    users: 3,
    isSystemRole: true 
  },
  { 
    id: 2, 
    name: "Coach", 
    description: "Gestione team, allenamenti e statistiche",
    users: 8,
    isSystemRole: true 
  },
  { 
    id: 3, 
    name: "Manager", 
    description: "Gestione amministrativa e documentale",
    users: 5,
    isSystemRole: true 
  },
  { 
    id: 4, 
    name: "Medical Staff", 
    description: "Accesso a dati medici e certificati",
    users: 4,
    isSystemRole: true 
  },
  { 
    id: 5, 
    name: "Custom Role", 
    description: "Ruolo personalizzato con permessi specifici",
    users: 2,
    isSystemRole: false 
  }
];

const permissions = [
  { 
    id: "dashboard", 
    name: "Dashboard", 
    description: "Accesso alla dashboard e statistiche",
    roles: ["Administrator", "Coach", "Manager", "Medical Staff", "Custom Role"]
  },
  { 
    id: "teams", 
    name: "Team", 
    description: "Gestione dei team e giocatori",
    roles: ["Administrator", "Coach", "Manager"]
  },
  { 
    id: "calendar", 
    name: "Calendario", 
    description: "Visualizzazione e gestione eventi",
    roles: ["Administrator", "Coach", "Manager", "Medical Staff"]
  },
  { 
    id: "warehouse", 
    name: "Magazzino", 
    description: "Gestione inventario e attrezzature",
    roles: ["Administrator", "Manager"]
  },
  { 
    id: "documents", 
    name: "Documenti", 
    description: "Gestione e upload documenti",
    roles: ["Administrator", "Manager"]
  },
  { 
    id: "medical", 
    name: "Dati Medici", 
    description: "Accesso a dati sanitari e certificati",
    roles: ["Administrator", "Medical Staff"]
  },
  { 
    id: "settings", 
    name: "Impostazioni", 
    description: "Configurazione sistema e preferenze",
    roles: ["Administrator"]
  }
];

const RolesAndPermissions = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ruoli e Permessi</h1>
          <p className="text-muted-foreground">
            Gestisci ruoli, permessi e controllo accessi per gli utenti della piattaforma
          </p>
        </div>
        <Button className="mt-4 md:mt-0">
          <Shield className="mr-2 h-4 w-4" />
          Nuovo Ruolo
        </Button>
      </div>

      <Tabs defaultValue="roles">
        <TabsList className="w-full md:w-auto mb-4">
          <TabsTrigger value="roles" className="flex-1 md:flex-initial">
            <Users className="mr-2 h-4 w-4" />
            Ruoli
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex-1 md:flex-initial">
            <ShieldAlert className="mr-2 h-4 w-4" />
            Permessi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map(role => (
              <Card key={role.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{role.name}</CardTitle>
                    {role.isSystemRole && (
                      <Badge variant="secondary">Sistema</Badge>
                    )}
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-2 h-4 w-4" />
                      {role.users} utenti
                    </div>
                    <div className="space-x-2">
                      <Button variant="ghost" size="sm">
                        Modifica
                      </Button>
                      {!role.isSystemRole && (
                        <Button variant="ghost" size="sm">
                          Elimina
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Matrice dei Permessi</CardTitle>
              <CardDescription>
                Visualizza quali permessi sono assegnati a ciascun ruolo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Permesso</TableHead>
                      {roles.map(role => (
                        <TableHead key={role.id} className="text-center">
                          {role.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map(permission => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">
                          <div>
                            {permission.name}
                            <div className="text-xs text-muted-foreground mt-1">
                              {permission.description}
                            </div>
                          </div>
                        </TableCell>
                        {roles.map(role => (
                          <TableCell key={role.id} className="text-center">
                            {permission.roles.includes(role.name) ? (
                              <Check className="h-5 w-5 mx-auto text-green-600" />
                            ) : (
                              <span className="block h-5 w-5"></span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RolesAndPermissions;
