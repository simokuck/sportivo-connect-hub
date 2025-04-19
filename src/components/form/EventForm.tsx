
import React, { useEffect } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Team } from "@/types";
import LocationPicker from '@/components/map/LocationPicker';

interface EventFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  dialogAction: 'create' | 'edit';
  handleDeleteEvent?: () => void;
  handleLocationChange: (location: string, coords?: { lat: number; lng: number }) => void;
  teams?: Team[];
}

const EventForm = ({ 
  form, 
  onSubmit, 
  dialogAction, 
  handleDeleteEvent, 
  handleLocationChange,
  teams
}: EventFormProps) => {
  const isPrivate = form.watch("isPrivate");
  
  // Add keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        form.reset();
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        form.handleSubmit(onSubmit)();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [form, onSubmit]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titolo</FormLabel>
              <FormControl>
                <Input placeholder="Inserisci il titolo dell'evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Aggiungi una descrizione (opzionale)" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data e ora di inizio</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data e ora di fine</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
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
                    size="small"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      // Clear teamId if event is private
                      if (checked) {
                        form.setValue("teamId", undefined);
                      }
                    }}
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
                  onChange={handleLocationChange}
                  useOpenStreetMap={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {(form.watch('type') === 'training' || form.watch('type') === 'match') && (
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
                    size="small"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Annulla (ESC)
          </Button>
          <Button type="submit">
            {dialogAction === 'create' ? 'Crea Evento' : 'Aggiorna Evento'} (⌘ + Enter)
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EventForm;
