
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PermissionMatrixHeaderProps {
  roles: {
    id: number;
    name: string;
    description: string;
    users: number;
    isSystemRole: boolean;
  }[];
}

const PermissionMatrixHeader = ({ roles }: PermissionMatrixHeaderProps) => {
  return (
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
  );
};

export default PermissionMatrixHeader;
