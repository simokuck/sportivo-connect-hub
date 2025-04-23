
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Role } from '@/types/roles';

interface RoleCardProps {
  role: Role;
  usersCount: number;
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}

const RoleCard = ({ 
  role,
  usersCount,
  onEdit,
  onDelete
}: RoleCardProps) => {
  const { showNotification } = useNotifications();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleDelete = () => {
    onDelete(role.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Card>
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
              {usersCount} utenti
            </div>
            <div className="space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onEdit(role)}
              >
                Modifica
              </Button>
              {!role.isSystemRole && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Elimina
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Elimina Ruolo"
        description={`Sei sicuro di voler eliminare il ruolo "${role.name}"? Questa azione non può essere annullata.`}
        confirmText="Elimina"
        cancelText="Annulla"
      />
    </>
  );
};

export default RoleCard;
