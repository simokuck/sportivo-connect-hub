
import React, { useEffect } from 'react';
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";
import { Team } from "@/types";
import EventBasicDetails from './event/EventBasicDetails';
import EventDateTime from './event/EventDateTime';
import EventTypeAndPrivacy from './event/EventTypeAndPrivacy';
import EventLocationAndMedical from './event/EventLocationAndMedical';

interface EventFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  dialogAction: 'create' | 'edit';
  handleDeleteEvent?: () => void;
  handleLocationChange: (location: string, coords?: { lat: number; lng: number }) => void;
  teams?: Team[];
}

const EventForm = ({ 
  form, 
  onSubmit, 
  dialogAction, 
  handleDeleteEvent, 
  handleLocationChange,
  teams
}: EventFormProps) => {
  
  // Add keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        form.reset();
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        form.handleSubmit(onSubmit)();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [form, onSubmit]);

  return (
    <Form {...form}>
      <form onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit(onSubmit)(e);
      }} className="space-y-4">
        <EventBasicDetails form={form} />
        <EventDateTime form={form} />
        <EventTypeAndPrivacy form={form} teams={teams} />
        <EventLocationAndMedical form={form} handleLocationChange={handleLocationChange} />
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Annulla (ESC)
          </Button>
          <Button type="submit">
            {dialogAction === 'create' ? 'Crea Evento' : 'Aggiorna Evento'} (⌘ + Enter)
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EventForm;
