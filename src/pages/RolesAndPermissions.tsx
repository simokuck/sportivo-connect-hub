
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserRole } from '@/types';

// Mock data for permissions
const permissions = [
  { id: 'read_players', name: 'Visualizzare Giocatori' },
  { id: 'edit_players', name: 'Modificare Giocatori' },
  { id: 'read_teams', name: 'Visualizzare Squadre' },
  { id: 'edit_teams', name: 'Modificare Squadre' },
  { id: 'read_events', name: 'Visualizzare Eventi' },
  { id: 'create_events', name: 'Creare Eventi' },
  { id: 'edit_events', name: 'Modificare Eventi' },
  { id: 'delete_events', name: 'Eliminare Eventi' },
  { id: 'read_documents', name: 'Visualizzare Documenti' },
  { id: 'manage_documents', name: 'Gestire Documenti' },
  { id: 'access_warehouse', name: 'Accedere al Magazzino' },
  { id: 'manage_warehouse', name: 'Gestire il Magazzino' },
  { id: 'view_statistics', name: 'Visualizzare Statistiche' },
  { id: 'manage_medical', name: 'Gestire Dati Medici' },
  { id: 'view_video_sessions', name: 'Visualizzare Sessioni Video' },
  { id: 'manage_video_sessions', name: 'Gestire Sessioni Video' },
];

// Initial role permissions (mock data)
const initialRolePermissions: Record<UserRole, string[]> = {
  player: ['read_events', 'read_players', 'view_statistics', 'view_video_sessions'],
  coach: [
    'read_players', 'edit_players', 'read_teams', 'read_events', 'create_events', 
    'edit_events', 'read_documents', 'view_statistics', 'view_video_sessions', 
    'manage_video_sessions'
  ],
  admin: permissions.map(p => p.id),
  medical: [
    'read_players', 'read_teams', 'read_events', 'create_events', 
    'read_documents', 'manage_documents', 'manage_medical',
  ],
};

const RolesAndPermissions = () => {
  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, string[]>>(initialRolePermissions);
  const roles: UserRole[] = ['player', 'coach', 'admin', 'medical'];

  const handleTogglePermission = (role: UserRole, permissionId: string) => {
    setRolePermissions(prev => {
      const newPermissions = { ...prev };
      
      if (newPermissions[role].includes(permissionId)) {
        newPermissions[role] = newPermissions[role].filter(id => id !== permissionId);
      } else {
        newPermissions[role] = [...newPermissions[role], permissionId];
      }
      
      return newPermissions;
    });
  };

  const handleSave = () => {
    // In a real app, this would save to a backend
    toast.success('Permessi salvati con successo');
    console.log('Saved permissions:', rolePermissions);
  };

  const handleReset = () => {
    setRolePermissions(initialRolePermissions);
    toast.info('Permessi reimpostati ai valori predefiniti');
  };

  const translateRole = (role: UserRole): string => {
    const translations: Record<UserRole, string> = {
      player: 'Giocatore',
      coach: 'Allenatore',
      admin: 'Amministratore',
      medical: 'Staff Medico'
    };
    return translations[role];
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Ruoli e Permessi</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestione Permessi</CardTitle>
          <CardDescription>
            Configura i permessi per ciascun ruolo nel sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permesso</TableHead>
                  {roles.map(role => (
                    <TableHead key={role} className="text-center">
                      {translateRole(role)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map(permission => (
                  <TableRow key={permission.id}>
                    <TableCell className="font-medium">{permission.name}</TableCell>
                    {roles.map(role => (
                      <TableCell key={role} className="text-center">
                        <Checkbox
                          checked={rolePermissions[role].includes(permission.id)}
                          onCheckedChange={() => handleTogglePermission(role, permission.id)}
                          id={`${role}-${permission.id}`}
                          aria-label={`${permission.name} per ${translateRole(role)}`}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={handleReset}>
              Ripristina Predefiniti
            </Button>
            <Button onClick={handleSave}>
              Salva Modifiche
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesAndPermissions;
