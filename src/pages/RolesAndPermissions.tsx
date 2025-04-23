import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, ShieldAlert, Users, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import RoleCard from '@/components/roles/RoleCard';
import PermissionsMatrix from '@/components/roles/PermissionsMatrix';

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
  const navigate = useNavigate();
  
  const handleEdit = (roleName: string) => {
    toast.info(`Modifica del ruolo ${roleName} non ancora implementata.`);
  };

  const handleDelete = (roleName: string) => {
    toast.info(`Eliminazione del ruolo ${roleName} non ancora implementata.`);
  };

  const handleNewRole = () => {
    toast.info("Creazione di un nuovo ruolo non ancora implementata.");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ChevronLeft className="h-5 w-5 mr-1" /> Indietro
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Ruoli e Permessi</h1>
          <p className="text-muted-foreground">
            Gestisci ruoli, permessi e controllo accessi per gli utenti della piattaforma
          </p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={handleNewRole}>
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
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                {...role}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsMatrix
            permissions={permissions}
            roles={roles}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RolesAndPermissions;
