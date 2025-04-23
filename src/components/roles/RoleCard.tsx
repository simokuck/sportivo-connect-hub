
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

interface RoleCardProps {
  id: number;
  name: string;
  description: string;
  users: number;
  isSystemRole: boolean;
  onEdit: (name: string) => void;
  onDelete: (name: string) => void;
}

const RoleCard = ({ 
  name, 
  description, 
  users, 
  isSystemRole, 
  onEdit, 
  onDelete 
}: RoleCardProps) => {
  const { showNotification } = useNotifications();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleDelete = () => {
    onDelete(name);
    showNotification("success", `Ruolo ${name} eliminato con successo`);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle>{name}</CardTitle>
            {isSystemRole && (
              <Badge variant="secondary">Sistema</Badge>
            )}
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              {users} utenti
            </div>
            <div className="space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onEdit(name)}
              >
                Modifica
              </Button>
              {!isSystemRole && (
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
        description={`Sei sicuro di voler eliminare il ruolo "${name}"? Questa azione non può essere annullata.`}
        confirmText="Elimina"
        cancelText="Annulla"
      />
    </>
  );
};

export default RoleCard;
