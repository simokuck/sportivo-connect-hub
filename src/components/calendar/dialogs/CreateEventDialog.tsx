
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';
import EventForm from '@/components/form/EventForm';

interface CreateEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<EventFormValues>;
  onSubmit: (data: EventFormValues) => void;
  teams?: any[];
  handleLocationChange: (location: string, coords?: { lat: number; lng: number }) => void;
}

const CreateEventDialog = ({
  isOpen,
  onOpenChange,
  form,
  onSubmit,
  teams,
  handleLocationChange
}: CreateEventDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Crea un nuovo evento</DialogTitle>
          <DialogDescription>
            Aggiungi un evento al calendario. Clicca salva quando hai finito.
          </DialogDescription>
        </DialogHeader>
        <EventForm 
          form={form}
          onSubmit={onSubmit}
          dialogAction="create"
          teams={teams}
          handleLocationChange={handleLocationChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
