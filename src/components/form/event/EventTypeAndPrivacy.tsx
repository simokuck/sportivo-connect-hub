
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from '@/schemas/eventSchema';
import { Team } from "@/types";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, User, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for users and groups
const mockUsers = [
  { id: "user1", name: "Marco Rossi", type: "user" },
  { id: "user2", name: "Giulia Bianchi", type: "user" },
  { id: "user3", name: "Alessandro Verdi", type: "user" },
  { id: "user4", name: "Francesca Neri", type: "user" },
  { id: "user5", name: "Luca Gialli", type: "user" },
];

const mockGroups = [
  { id: "group1", name: "Allenatori", type: "group" },
  { id: "group2", name: "Staff Medico", type: "group" },
  { id: "group3", name: "Dirigenti", type: "group" },
];

// Combine users and groups for the recipient picker
const allRecipients = [...mockUsers, ...mockGroups];

interface EventTypeAndPrivacyProps {
  form: UseFormReturn<EventFormValues>;
  teams?: Team[];
}

const EventTypeAndPrivacy = ({ form, teams }: EventTypeAndPrivacyProps) => {
  const formType = form.watch("type");
  const recipients = form.watch("recipients") || [];
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  // Show team selection only for training, match, and medical events
  // And only when teams exist
  const showTeamSelection = React.useMemo(() => {
    const hasTeams = teams && teams.length > 0;
    const isTeamEvent = ['training', 'match', 'medical'].includes(formType);
    return hasTeams && isTeamEvent;
  }, [teams, formType]);

  // Filter recipients based on search input
  const filteredRecipients = React.useMemo(() => {
    if (!searchValue) return allRecipients;
    return allRecipients.filter((recipient) =>
      recipient.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  // Handle selecting a recipient
  const handleSelectRecipient = (recipientId: string) => {
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
  };

  // Remove a recipient
  const removeRecipient = (recipientId: string) => {
    const currentRecipients = form.getValues("recipients") || [];
    const updatedRecipients = currentRecipients.filter(id => id !== recipientId);
    form.setValue("recipients", updatedRecipients, { shouldValidate: true });
  };

  // Get recipient details from id
  const getRecipientDetails = (id: string) => {
    return allRecipients.find(recipient => recipient.id === id);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo di evento</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                // Reset team selection if changing to a non-team event type
                if (!['training', 'match', 'medical'].includes(value)) {
                  form.setValue("teamId", undefined);
                }
              }} 
              defaultValue={field.value}>
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
                              value={user.name}
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
                              value={group.name}
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
      </div>

      {showTeamSelection && (
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
      )}
    </>
  );
};

export default EventTypeAndPrivacy;
