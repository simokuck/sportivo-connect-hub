
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import * as z from 'zod';
import { Season, TeamCategory } from '@/types/player-management';

interface PlayerRegistrationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: any;
  seasons: Season[];
  onSubmit: (data: any) => void;
}

export const PlayerRegistrationFormDialog: React.FC<PlayerRegistrationFormDialogProps> = ({
  open, onOpenChange, form, seasons, onSubmit
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>Nuovo Giocatore</DialogTitle>
        <DialogDescription>
          Inserisci i dati del giocatore da registrare
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cognome</FormLabel>
                  <FormControl>
                    <Input placeholder="Cognome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data di nascita</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isMinor"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Giocatore minorenne</FormLabel>
                  <FormDescription>
                    Se selezionato, l'email di contatto sarà quella del genitore/tutore
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {form.watch('isMinor') ? 'Email genitore/tutore' : 'Email'}
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@esempio.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch('isMinor') && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guardianName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome genitore/tutore</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guardianRelationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relazione</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Genitore">Genitore</SelectItem>
                        <SelectItem value="Padre">Padre</SelectItem>
                        <SelectItem value="Madre">Madre</SelectItem>
                        <SelectItem value="Tutore legale">Tutore legale</SelectItem>
                        <SelectItem value="Altro">Altro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <FormField
            control={form.control}
            name="seasonId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stagione</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona la stagione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {seasons.map(season => (
                      <SelectItem
                        key={season.id}
                        value={season.id}
                      >
                        {season.name} {season.isActive && '(Attiva)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit">Crea Giocatore</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
);
