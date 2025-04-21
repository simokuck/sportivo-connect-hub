
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';
import { Team } from "@/types";
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
        <RecipientPicker form={form} />
      </div>

      <TeamSelect form={form} teams={teams} show={showTeamSelection} />
    </>
  );
};

export default EventTypeAndPrivacy;
