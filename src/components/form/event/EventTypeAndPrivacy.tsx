
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';
import { Team } from "@/types";

interface EventTypeAndPrivacyProps {
  form: UseFormReturn<EventFormValues>;
  teams?: Team[];
}

const EventTypeAndPrivacy = ({ form, teams }: EventTypeAndPrivacyProps) => {
  const isPrivate = form.watch("isPrivate");
  
  React.useEffect(() => {
    // Reset teamId when isPrivate is toggled to true
    if (isPrivate && form.getValues("teamId")) {
      form.setValue("teamId", undefined);
    }
  }, [isPrivate, form]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo di evento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-sm">Evento Privato</FormLabel>
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
      </div>

      {!isPrivate && teams && teams.length > 0 && (
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
                  {teams.map((team) => (
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
      )}
    </>
  );
};

export default EventTypeAndPrivacy;
