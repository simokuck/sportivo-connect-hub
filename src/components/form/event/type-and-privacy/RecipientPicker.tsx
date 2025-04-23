
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';
import { User, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RecipientOption {
  value: string;
  label: string;
  type: 'user' | 'team';
}

interface RecipientPickerProps {
  form: UseFormReturn<EventFormValues>;
}

const RecipientPicker = ({ form }: RecipientPickerProps) => {
  const [users, setUsers] = useState<RecipientOption[]>([]);
  const [teams, setTeams] = useState<RecipientOption[]>([]);
  const selectedValues = form.watch("recipients") || [];

  useEffect(() => {
    const fetchRecipients = async () => {
      // Fetch users with roles
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles:roles(name)
        `);

      // Get unique user IDs
      const uniqueUserIds = [...new Set(userRoles?.map(ur => ur.user_id) || [])];

      // Transform to options format
      const userOptions: RecipientOption[] = uniqueUserIds.map(userId => ({
        value: userId,
        label: `User ${userId.slice(0, 8)}`, // You might want to fetch actual user names
        type: 'user'
      }));

      // Fetch teams
      const { data: teamsData } = await supabase
        .from('teams')
        .select('id, name');

      const teamOptions: RecipientOption[] = (teamsData || []).map(team => ({
        value: team.id,
        label: team.name,
        type: 'team'
      }));

      setUsers(userOptions);
      setTeams(teamOptions);
    };

    fetchRecipients();
  }, []);

  const groupedOptions = [
    {
      label: "Utenti",
      options: users
    },
    {
      label: "Squadre",
      options: teams
    }
  ];

  // Find full option objects for selected values
  const selectedOptions = groupedOptions
    .flatMap(group => group.options)
    .filter(option => selectedValues.includes(option.value));

  const formatOptionLabel = ({ label, type }: RecipientOption) => (
    <div className="flex items-center gap-2">
      {type === 'user' ? (
        <User className="h-4 w-4" />
      ) : (
        <Users className="h-4 w-4" />
      )}
      <span>{label}</span>
    </div>
  );

  return (
    <FormField
      control={form.control}
      name="recipients"
      render={({ field }) => (
        <FormItem className="col-span-2">
          <FormLabel>Destinatari</FormLabel>
          <FormControl>
            <Select
              isMulti
              options={groupedOptions}
              value={selectedOptions}
              onChange={(newValue) => {
                const selectedValues = (newValue as RecipientOption[]).map(option => option.value);
                form.setValue("recipients", selectedValues, { shouldValidate: true });
              }}
              formatOptionLabel={formatOptionLabel}
              classNames={{
                control: () => "!min-h-10 !bg-background !border-input",
                menu: () => "!bg-popover !border !border-border",
                option: (state) => 
                  `!text-sm !cursor-default !bg-${state.isFocused ? 'accent' : 'transparent'} !text-${state.isFocused ? 'accent-foreground' : 'foreground'}`,
                placeholder: () => "!text-muted-foreground",
                multiValue: () => "!bg-secondary !text-secondary-foreground",
                groupHeading: () => "!text-muted-foreground !text-sm !font-semibold",
              }}
              placeholder="Seleziona destinatari..."
              noOptionsMessage={() => "Nessun risultato trovato"}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RecipientPicker;
