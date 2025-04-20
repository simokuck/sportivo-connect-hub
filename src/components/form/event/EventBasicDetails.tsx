
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';

interface EventBasicDetailsProps {
  form: UseFormReturn<EventFormValues>;
}

const EventBasicDetails = ({ form }: EventBasicDetailsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titolo</FormLabel>
            <FormControl>
              <Input
                placeholder="Inserisci il titolo dell'evento" 
                {...field}
                onChange={(e) => {
                  e.stopPropagation();
                  field.onChange(e);
                }}
              />
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
              <Textarea 
                placeholder="Aggiungi una descrizione (opzionale)" 
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default EventBasicDetails;
