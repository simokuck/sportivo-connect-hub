
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, ShieldAlert, Users, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RoleCard from '@/components/roles/RoleCard';
import PermissionsMatrix from '@/components/roles/PermissionsMatrix';
import EditRoleDialog from '@/components/roles/EditRoleDialog';
import { useRoles } from '@/hooks/useRoles';
import { Role } from '@/types/roles';

const RolesAndPermissions = () => {
  const navigate = useNavigate();
  const { roles, permissions, createRole, updateRole, deleteRole } = useRoles();
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showNewRoleDialog, setShowNewRoleDialog] = useState(false);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
  };

  const handleSave = async (data: { name: string; description: string }) => {
    if (editingRole) {
      await updateRole.mutateAsync({
        id: editingRole.id,
        ...data
      });
    } else {
      await createRole.mutateAsync({
        name: data.name,
        description: data.description,
        isSystemRole: false
      });
    }
    setEditingRole(null);
    setShowNewRoleDialog(false);
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
        <Button onClick={() => setShowNewRoleDialog(true)}>
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
                role={role}
                usersCount={0} // TODO: Implement user count
                onEdit={handleEdit}
                onDelete={deleteRole.mutate}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsMatrix
            permissions={permissions.map(p => ({
              id: p.id,
              name: p.name,
              description: p.description,
              roles: [] // TODO: Implement role permissions mapping
            }))}
            roles={roles.map(r => ({
              id: parseInt(r.id),
              name: r.name,
              description: r.description,
              users: 0, // TODO: Implement user count
              isSystemRole: r.isSystemRole
            }))}
          />
        </TabsContent>
      </Tabs>

      <EditRoleDialog
        isOpen={editingRole !== null || showNewRoleDialog}
        onClose={() => {
          setEditingRole(null);
          setShowNewRoleDialog(false);
        }}
        onSave={handleSave}
        role={editingRole || undefined}
      />
    </div>
  );
};

export default RolesAndPermissions;
