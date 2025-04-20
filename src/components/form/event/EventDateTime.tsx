
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';

interface EventDateTimeProps {
  form: UseFormReturn<EventFormValues>;
}

const EventDateTime = ({ form }: EventDateTimeProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="start"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data e ora di inizio</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="end"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data e ora di fine</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default EventDateTime;
