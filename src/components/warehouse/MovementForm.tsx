
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BaseItem, ItemVariant, MovementType } from '@/types/warehouse';
import { Player } from '@/types';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const movementSchema = z.object({
  baseItemId: z.string({
    required_error: "Seleziona un articolo",
  }),
  variantId: z.string({
    required_error: "Seleziona una variante",
  }),
  type: z.enum(['in', 'out', 'assign', 'return', 'lost', 'damaged'], {
    required_error: "Seleziona un tipo di movimento",
  }),
  quantity: z.coerce.number().int().min(1, "La quantità deve essere almeno 1"),
  date: z.date({
    required_error: "La data è obbligatoria",
  }),
  playerId: z.string().optional(),
  notes: z.string().optional(),
});

type MovementFormValues = z.infer<typeof movementSchema>;

interface MovementFormProps {
  items: (BaseItem & { variants: ItemVariant[] })[];
  players: Player[];
  onSubmit: (data: MovementFormValues) => void;
  onCancel: () => void;
}

export function MovementForm({ items, players, onSubmit, onCancel }: MovementFormProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedVariants, setSelectedVariants] = useState<ItemVariant[]>([]);
  const [movementType, setMovementType] = useState<MovementType>('in');
  
  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      baseItemId: '',
      variantId: '',
      type: 'in',
      quantity: 1,
      date: new Date(),
      notes: '',
    },
  });

  // Update available variants when base item changes
  useEffect(() => {
    if (selectedItemId) {
      const selectedItem = items.find(item => item.id === selectedItemId);
      if (selectedItem) {
        setSelectedVariants(selectedItem.variants);
        
        // Reset variant selection
        form.setValue('variantId', '');
      }
    } else {
      setSelectedVariants([]);
    }
  }, [selectedItemId, items, form]);

  // Update form when movement type changes
  useEffect(() => {
    setMovementType(form.getValues('type'));
    
    // If movement type requires player but no player is selected, reset the player field
    if (['assign', 'return'].includes(form.getValues('type')) && !form.getValues('playerId')) {
      form.setValue('playerId', '');
    }
  }, [form.watch('type'), form]);

  // Handle form submission
  const handleSubmit = (values: MovementFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo di movimento *</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setMovementType(value as MovementType);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipo di movimento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="in">Carico (Entrata)</SelectItem>
                  <SelectItem value="out">Scarico (Uscita)</SelectItem>
                  <SelectItem value="assign">Assegnazione</SelectItem>
                  <SelectItem value="return">Restituzione</SelectItem>
                  <SelectItem value="lost">Smarrimento</SelectItem>
                  <SelectItem value="damaged">Danneggiamento</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="baseItemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Articolo *</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedItemId(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona articolo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="variantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variante *</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona variante" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedVariants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.size}, {variant.color} (Disp: {variant.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantità *</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Seleziona una data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {(movementType === 'assign' || movementType === 'return') && (
          <FormField
            control={form.control}
            name="playerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giocatore *</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona giocatore" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.firstName} {player.lastName}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Note aggiuntive"
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annulla
          </Button>
          <Button type="submit">
            Registra movimento
          </Button>
        </div>
      </form>
    </Form>
  );
}
