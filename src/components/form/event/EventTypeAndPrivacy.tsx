
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';
import { Team } from "@/types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import EventTypeSelect from './type-and-privacy/EventTypeSelect';
import RecipientPicker from './type-and-privacy/RecipientPicker';
import TeamSelect from './type-and-privacy/TeamSelect';

interface EventTypeAndPrivacyProps {
  form: UseFormReturn<EventFormValues>;
  teams?: Team[];
}

const EventTypeAndPrivacy = ({ form, teams }: EventTypeAndPrivacyProps) => {
  const formType = form.watch("type");

  // Show team selection only for training, match, and medical events
  // And only when teams exist
  const showTeamSelection = React.useMemo(() => {
    const hasTeams = teams && teams.length > 0;
    const isTeamEvent = ['training', 'match', 'medical'].includes(formType);
    return hasTeams && isTeamEvent;
  }, [teams, formType]);

  const showMedicalCheck = ['training', 'match'].includes(formType);

  const handleTypeChange = (value: string) => {
    // Reset team selection if changing to a non-team event type
    if (!['training', 'match', 'medical'].includes(value)) {
      form.setValue("teamId", undefined);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <EventTypeSelect form={form} onTypeChange={handleTypeChange} />
        
        {showMedicalCheck && (
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
      </div>

      <TeamSelect form={form} teams={teams} show={showTeamSelection} />
      
      <RecipientPicker form={form} />
    </>
  );
};

export default EventTypeAndPrivacy;
