
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';
import { Team } from "@/types";

interface TeamSelectProps {
  form: UseFormReturn<EventFormValues>;
  teams?: Team[];
  show: boolean;
}

const TeamSelect = ({ form, teams, show }: TeamSelectProps) => {
  if (!show) return null;

  return (
    <FormField
      control={form.control}
      name="teamId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Calendario Squadra</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || ""}
            defaultValue=""
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona una squadra" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {teams && teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TeamSelect;
