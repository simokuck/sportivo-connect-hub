import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const permissions: Record<UserRole, string[]> = {
  player: [
    'view.own.profile',
    'view.own.calendar',
    'view.own.documents',
    'view.own.statistics',
    'view.own.medical',
  ],
  coach: [
    'view.team.profiles',
    'edit.team.profiles',
    'view.team.calendar',
    'edit.team.calendar',
    'view.team.documents',
    'edit.team.documents',
    'view.team.statistics',
    'edit.team.statistics',
    'view.team.medical',
    'create.training.plans',
    'edit.training.plans',
    'view.training.plans',
  ],
  admin: [
    'view.all.profiles',
    'edit.all.profiles',
    'view.all.calendar',
    'edit.all.calendar',
    'view.all.documents',
    'edit.all.documents',
    'view.all.statistics',
    'edit.all.statistics',
    'view.all.medical',
    'edit.all.medical',
    'manage.teams',
    'manage.users',
    'manage.roles',
    'manage.settings',
  ],
  medical: [
    'view.all.medical',
    'edit.all.medical',
    'view.team.profiles',
    'view.team.calendar',
    'view.team.statistics',
  ],
  developer: [
    'view.all.profiles',
    'edit.all.profiles',
    'view.all.calendar',
    'edit.all.calendar',
    'view.all.documents',
    'edit.all.documents',
    'view.all.statistics',
    'edit.all.statistics',
    'view.all.medical',
    'edit.all.medical',
    'manage.teams',
    'manage.users',
    'manage.roles',
    'manage.settings',
    'access.developer.tools',
    'edit.system.settings',
  ],
};

const roleLabels: Record<UserRole, string> = {
  player: 'Giocatore',
  coach: 'Allenatore',
  admin: 'Amministratore',
  medical: 'Staff Medico',
  developer: 'Sviluppatore'
};

const RolesAndPermissions = () => {
  const [customRoles, setCustomRoles] = useState<Record<string, string[]>>({
    'team_manager': [
      'view.team.profiles',
      'view.team.calendar',
      'view.team.documents',
      'view.team.statistics',
      'manage.teams',
    ],
    'analyst': [
      'view.team.profiles',
      'view.team.statistics',
      'edit.team.statistics',
      'view.team.calendar',
    ],
  });

  const [activeRole, setActiveRole] = useState<UserRole | string>('admin');
  const [editMode, setEditMode] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const { toast } = useToast();

  const allPermissions = [
    { id: 'view.own.profile', label: 'Visualizza profilo personale' },
    { id: 'view.own.calendar', label: 'Visualizza calendario personale' },
    { id: 'view.own.documents', label: 'Visualizza documenti personali' },
    { id: 'view.own.statistics', label: 'Visualizza statistiche personali' },
    { id: 'view.own.medical', label: 'Visualizza dati medici personali' },
    { id: 'view.team.profiles', label: 'Visualizza profili squadra' },
    { id: 'edit.team.profiles', label: 'Modifica profili squadra' },
    { id: 'view.team.calendar', label: 'Visualizza calendario squadra' },
    { id: 'edit.team.calendar', label: 'Modifica calendario squadra' },
    { id: 'view.team.documents', label: 'Visualizza documenti squadra' },
    { id: 'edit.team.documents', label: 'Modifica documenti squadra' },
    { id: 'view.team.statistics', label: 'Visualizza statistiche squadra' },
    { id: 'edit.team.statistics', label: 'Modifica statistiche squadra' },
    { id: 'view.team.medical', label: 'Visualizza dati medici squadra' },
    { id: 'create.training.plans', label: 'Crea piani di allenamento' },
    { id: 'edit.training.plans', label: 'Modifica piani di allenamento' },
    { id: 'view.training.plans', label: 'Visualizza piani di allenamento' },
    { id: 'view.all.profiles', label: 'Visualizza tutti i profili' },
    { id: 'edit.all.profiles', label: 'Modifica tutti i profili' },
    { id: 'view.all.calendar', label: 'Visualizza tutti i calendari' },
    { id: 'edit.all.calendar', label: 'Modifica tutti i calendari' },
    { id: 'view.all.documents', label: 'Visualizza tutti i documenti' },
    { id: 'edit.all.documents', label: 'Modifica tutti i documenti' },
    { id: 'view.all.statistics', label: 'Visualizza tutte le statistiche' },
    { id: 'edit.all.statistics', label: 'Modifica tutte le statistiche' },
    { id: 'view.all.medical', label: 'Visualizza tutti i dati medici' },
    { id: 'edit.all.medical', label: 'Modifica tutti i dati medici' },
    { id: 'manage.teams', label: 'Gestisci squadre' },
    { id: 'manage.users', label: 'Gestisci utenti' },
    { id: 'manage.roles', label: 'Gestisci ruoli' },
    { id: 'manage.settings', label: 'Gestisci impostazioni' },
    { id: 'access.developer.tools', label: 'Accesso strumenti sviluppatore' },
    { id: 'edit.system.settings', label: 'Modifica impostazioni di sistema' },
  ];

  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    setEditMode(false);
    
    if (Object.keys(roleLabels).includes(role)) {
      setRolePermissions([...(permissions[role as UserRole] || [])]);
    } else {
      setRolePermissions([...(customRoles[role] || [])]);
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    if (!editMode) return;
    
    setRolePermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(p => p !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleSavePermissions = () => {
    if (Object.keys(roleLabels).includes(activeRole)) {
      // For system roles, we would typically call an API
      toast({
        title: "Operazione non consentita",
        description: "Non è possibile modificare i ruoli di sistema",
        variant: "destructive",
      });
    } else {
      // For custom roles
      setCustomRoles(prev => ({
        ...prev,
        [activeRole]: [...rolePermissions]
      }));
      
      toast({
        title: "Permessi aggiornati",
        description: `I permessi per ${activeRole} sono stati aggiornati`,
      });
    }
    
    setEditMode(false);
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Ruoli e Permessi</h1>
      
      <Tabs defaultValue="system" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="system">Ruoli di Sistema</TabsTrigger>
          <TabsTrigger value="custom">Ruoli Personalizzati</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {Object.entries(roleLabels).map(([role, label]) => (
              <Card 
                key={role} 
                className={`cursor-pointer hover:border-primary transition-colors ${activeRole === role ? 'border-primary' : ''}`}
                onClick={() => handleRoleChange(role)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{label}</CardTitle>
                  <CardDescription>
                    {permissions[role as UserRole]?.length || 0} permessi
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {Object.keys(customRoles).map((role) => (
              <Card 
                key={role} 
                className={`cursor-pointer hover:border-primary transition-colors ${activeRole === role ? 'border-primary' : ''}`}
                onClick={() => handleRoleChange(role)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg capitalize">{role.replace('_', ' ')}</CardTitle>
                  <CardDescription>
                    {customRoles[role]?.length || 0} permessi
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {activeRole && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {Object.keys(roleLabels).includes(activeRole) 
                  ? roleLabels[activeRole as UserRole] 
                  : activeRole.replace('_', ' ')}
              </CardTitle>
              <CardDescription>
                Gestisci i permessi per questo ruolo
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-mode" 
                  checked={editMode} 
                  onCheckedChange={setEditMode}
                  disabled={Object.keys(roleLabels).includes(activeRole)}
                />
                <Label htmlFor="edit-mode">Modalità modifica</Label>
              </div>
              
              {editMode && (
                <Button onClick={handleSavePermissions}>
                  Salva Modifiche
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allPermissions.map((permission) => {
                const hasPermission = rolePermissions.includes(permission.id);
                
                return (
                  <div 
                    key={permission.id} 
                    className={`p-3 border rounded-md flex justify-between items-center ${
                      hasPermission ? 'bg-muted/50' : ''
                    } ${editMode ? 'cursor-pointer' : ''}`}
                    onClick={() => handleTogglePermission(permission.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{permission.label}</span>
                      {hasPermission && <Badge>Attivo</Badge>}
                    </div>
                    
                    {editMode && (
                      <Switch checked={hasPermission} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RolesAndPermissions;
