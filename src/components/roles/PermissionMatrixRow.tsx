
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Check } from "lucide-react";

interface PermissionMatrixRowProps {
  permission: {
    id: string;
    name: string;
    description: string;
    roles: string[];
  };
  availableRoles: {
    id: number;
    name: string;
    description: string;
    users: number;
    isSystemRole: boolean;
  }[];
}

const PermissionMatrixRow = ({ permission, availableRoles }: PermissionMatrixRowProps) => {
  return (
    <TableRow key={permission.id}>
      <TableCell className="font-medium">
        <div>
          {permission.name}
          <div className="text-xs text-muted-foreground mt-1">
            {permission.description}
          </div>
        </div>
      </TableCell>
      {availableRoles.map(role => (
        <TableCell key={role.id} className="text-center">
          {permission.roles.includes(role.name) ? (
            <Check className="h-5 w-5 mx-auto text-green-600" />
          ) : (
            <span className="block h-5 w-5"></span>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default PermissionMatrixRow;
