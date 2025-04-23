
import React from 'react';
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Role } from '@/types/roles';

interface EditRoleFormData {
  name: string;
  description: string;
}

interface EditRoleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditRoleFormData) => void;
  role?: Role;
}

const EditRoleDialog = ({ isOpen, onClose, onSave, role }: EditRoleDialogProps) => {
  const form = useForm<EditRoleFormData>({
    defaultValues: {
      name: role?.name || '',
      description: role?.description || ''
    }
  });

  React.useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description
      });
    }
  }, [role, form]);

  const onSubmit = (data: EditRoleFormData) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? 'Modifica Ruolo' : 'Nuovo Ruolo'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={role?.isSystemRole} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Annulla
              </Button>
              <Button type="submit">
                {role ? 'Salva' : 'Crea'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoleDialog;
