
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check } from "lucide-react";

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
  );
};

export default PermissionsMatrix;
