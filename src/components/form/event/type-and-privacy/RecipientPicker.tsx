
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, User, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';
import { mockTeams } from '@/data/mockData';

interface Recipient {
  id: string;
  name: string;
  type: "user" | "group";
}

const mockUsers = [
  { id: "user1", name: "Marco Rossi", type: "user" },
  { id: "user2", name: "Giulia Bianchi", type: "user" },
  { id: "user3", name: "Alessandro Verdi", type: "user" },
  { id: "user4", name: "Francesca Neri", type: "user" },
  { id: "user5", name: "Luca Gialli", type: "user" },
];

// Generate team groups from mockTeams
const teamGroups = mockTeams.map(team => ({
  id: `team-${team.id}`,
  name: `Team ${team.name}`,
  type: "group"
}));

const mockGroups = [
  { id: "group1", name: "Allenatori", type: "group" },
  { id: "group2", name: "Staff Medico", type: "group" },
  { id: "group3", name: "Dirigenti", type: "group" },
  ...teamGroups
];

const allRecipients = [...mockUsers, ...mockGroups];

interface RecipientPickerProps {
  form: UseFormReturn<EventFormValues>;
}

const RecipientPicker = ({ form }: RecipientPickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const recipients = form.watch("recipients") || [];

  // Filter recipients based on search input
  const filteredRecipients = React.useMemo(() => {
    if (!searchValue) return allRecipients;
    return allRecipients.filter((recipient) =>
      recipient.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  // Reset search value when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  // Handle selecting a recipient
  const handleSelectRecipient = React.useCallback((recipientId: string) => {
    const currentRecipients = form.getValues("recipients") || [];
    
    // Check if the recipient is already selected
    if (currentRecipients.some(r => r === recipientId)) {
      // If already selected, remove it
      const updatedRecipients = currentRecipients.filter(id => id !== recipientId);
      form.setValue("recipients", updatedRecipients, { shouldValidate: true });
    } else {
      // If not selected, add it
      const updatedRecipients = [...currentRecipients, recipientId];
      form.setValue("recipients", updatedRecipients, { shouldValidate: true });
    }
  }, [form]);

  // Remove a recipient
  const removeRecipient = React.useCallback((recipientId: string) => {
    const currentRecipients = form.getValues("recipients") || [];
    const updatedRecipients = currentRecipients.filter(id => id !== recipientId);
    form.setValue("recipients", updatedRecipients, { shouldValidate: true });
  }, [form]);

  // Get recipient details from id
  const getRecipientDetails = React.useCallback((id: string) => {
    return allRecipients.find(recipient => recipient.id === id);
  }, []);

  return (
    <FormField
      control={form.control}
      name="recipients"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Destinatari</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <div 
                  className={cn(
                    "flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                    recipients.length > 0 ? "pl-2" : "pl-3"
                  )}
                >
                  {recipients.map((recipientId) => {
                    const recipient = getRecipientDetails(recipientId);
                    return recipient ? (
                      <Badge 
                        key={recipient.id} 
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-0"
                      >
                        {recipient.type === "user" ? 
                          <User className="h-3 w-3" /> : 
                          <Users className="h-3 w-3" />
                        }
                        {recipient.name}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive" 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecipient(recipient.id);
                          }}
                        />
                      </Badge>
                    ) : null;
                  })}
                  {recipients.length === 0 && (
                    <span className="text-muted-foreground">
                      Seleziona destinatari...
                    </span>
                  )}
                  <button 
                    type="button"
                    className="ml-auto rounded-md hover:text-primary"
                    tabIndex={-1}
                  >
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                  </button>
                </div>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-80" align="start">
              <Command>
                <CommandInput 
                  placeholder="Cerca utenti o gruppi..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>Nessun risultato trovato</CommandEmpty>
                  <CommandGroup heading="Utenti">
                    {filteredRecipients
                      .filter(r => r.type === "user")
                      .map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.id}
                          onSelect={() => handleSelectRecipient(user.id)}
                        >
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            {user.name}
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              recipients.includes(user.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                  <CommandGroup heading="Gruppi">
                    {filteredRecipients
                      .filter(r => r.type === "group")
                      .map((group) => (
                        <CommandItem
                          key={group.id}
                          value={group.id}
                          onSelect={() => handleSelectRecipient(group.id)}
                        >
                          <div className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            {group.name}
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              recipients.includes(group.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RecipientPicker;
