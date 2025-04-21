
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';
import EventForm from '@/components/form/EventForm';

interface EditEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<EventFormValues>;
  onSubmit: (data: EventFormValues) => void;
  onDelete: () => void;
  teams?: any[];
  handleLocationChange: (location: string, coords?: { lat: number; lng: number }) => void;
}

const EditEventDialog = ({
  isOpen,
  onOpenChange,
  form,
  onSubmit,
  onDelete,
  teams,
  handleLocationChange
}: EditEventDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Modifica evento</DialogTitle>
          <DialogDescription>
            Modifica i dettagli dell'evento. Clicca aggiorna quando hai finito.
          </DialogDescription>
        </DialogHeader>
        <EventForm 
          form={form}
          onSubmit={onSubmit}
          dialogAction="edit"
          handleDeleteEvent={onDelete}
          teams={teams}
          handleLocationChange={handleLocationChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditEventDialog;
