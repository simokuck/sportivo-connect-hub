
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';

interface EventLocationAndMedicalProps {
  form: UseFormReturn<EventFormValues>;
  handleLocationChange: (location: string, coords?: { lat: number; lng: number }) => void;
}

const EventLocationAndMedical = ({ form, handleLocationChange }: EventLocationAndMedicalProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> Posizione
            </FormLabel>
            <FormControl>
              <Input 
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  handleLocationChange(e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {(form.watch('type') === 'training' || form.watch('type') === 'match') && (
        <FormField
          control={form.control}
          name="requiresMedical"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Richiedi presenza medica</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default EventLocationAndMedical;
