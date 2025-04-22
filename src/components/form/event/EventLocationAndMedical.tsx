
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';
import LocationPicker from '@/components/map/LocationPicker';

interface EventLocationAndMedicalProps {
  form: UseFormReturn<EventFormValues>;
  handleLocationChange: (location: string, coords?: { lat: number; lng: number }) => void;
}

const EventLocationAndMedical = ({ form, handleLocationChange }: EventLocationAndMedicalProps) => {
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> Posizione
          </FormLabel>
          <FormControl>
            <LocationPicker
              value={field.value}
              onChange={(location, coords) => {
                field.onChange(location);
                handleLocationChange(location, coords);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EventLocationAndMedical;
