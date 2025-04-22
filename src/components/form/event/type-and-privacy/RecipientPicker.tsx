
import React from 'react';
import Select from 'react-select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';
import { User, Users } from 'lucide-react';

interface RecipientOption {
  value: string;
  label: string;
  type: 'user' | 'group';
}

const mockUsers: RecipientOption[] = [
  { value: "user1", label: "Marco Rossi", type: "user" },
  { value: "user2", label: "Giulia Bianchi", type: "user" },
  { value: "user3", label: "Alessandro Verdi", type: "user" },
  { value: "user4", label: "Francesca Neri", type: "user" },
  { value: "user5", label: "Luca Gialli", type: "user" },
];

const mockGroups: RecipientOption[] = [
  { value: "group1", label: "Allenatori", type: "group" },
  { value: "group2", label: "Staff Medico", type: "group" },
  { value: "group3", label: "Dirigenti", type: "group" },
  { value: "team-1", label: "Team Prima Squadra", type: "group" },
  { value: "team-2", label: "Team Juniores", type: "group" },
];

const groupedOptions = [
  {
    label: "Utenti",
    options: mockUsers
  },
  {
    label: "Gruppi",
    options: mockGroups
  }
];

interface RecipientPickerProps {
  form: UseFormReturn<EventFormValues>;
}

const RecipientPicker = ({ form }: RecipientPickerProps) => {
  const selectedValues = form.watch("recipients") || [];

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
        <FormItem>
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
