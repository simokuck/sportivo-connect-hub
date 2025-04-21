
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';

interface EventTypeSelectProps {
  form: UseFormReturn<EventFormValues>;
  onTypeChange: (value: string) => void;
}

const EventTypeSelect = ({ form, onTypeChange }: EventTypeSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo di evento</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              onTypeChange(value);
            }} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un tipo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="training">Allenamento</SelectItem>
              <SelectItem value="match">Partita</SelectItem>
              <SelectItem value="medical">Visita Medica</SelectItem>
              <SelectItem value="meeting">Riunione</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EventTypeSelect;
