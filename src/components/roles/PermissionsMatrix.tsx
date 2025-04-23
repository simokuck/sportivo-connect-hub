
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import PermissionMatrixHeader from './PermissionMatrixHeader';
import PermissionMatrixRow from './PermissionMatrixRow';

interface Permission {
  id: string;
  name: string;
  description: string;
  roles: string[];
}

interface Role {
  id: number;
  name: string;
  description: string;
  users: number;
  isSystemRole: boolean;
}

interface PermissionsMatrixProps {
  permissions: Permission[];
  roles: Role[];
}

const PermissionsMatrix = ({ permissions, roles }: PermissionsMatrixProps) => {
  return (
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
            <PermissionMatrixHeader roles={roles} />
            <TableBody>
              {permissions.map(permission => (
                <PermissionMatrixRow 
                  key={permission.id} 
                  permission={permission} 
                  availableRoles={roles}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsMatrix;
