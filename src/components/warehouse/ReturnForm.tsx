
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ItemAssignment, BaseItem, ItemVariant } from '@/types/warehouse';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const returnSchema = z.object({
  returnDate: z.date({
    required_error: "La data di restituzione è obbligatoria",
  }),
  returnedCondition: z.enum(['good', 'damaged', 'lost']),
  notes: z.string().optional(),
});

type ReturnFormValues = z.infer<typeof returnSchema>;

interface ReturnFormProps {
  assignment: ItemAssignment & { 
    baseItem?: BaseItem, 
    variant?: ItemVariant 
  };
  onSubmit: (data: ReturnFormValues) => void;
  onCancel: () => void;
}

export function ReturnForm({ assignment, onSubmit, onCancel }: ReturnFormProps) {
  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      returnDate: new Date(),
      returnedCondition: 'good',
      notes: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="p-4 border rounded-md bg-muted/20 mb-4">
          <h3 className="text-lg font-semibold mb-2">Informazioni articolo</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Articolo:</p>
              <p className="font-medium">{assignment.baseItem?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Variante:</p>
              <p className="font-medium">{assignment.variant?.size}, {assignment.variant?.color}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Giocatore:</p>
              <p className="font-medium">{assignment.playerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assegnato il:</p>
              <p className="font-medium">{format(new Date(assignment.assignDate), "dd/MM/yyyy")}</p>
            </div>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="returnDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data restituzione *</FormLabel>
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
                      date > new Date() || date < new Date(assignment.assignDate)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="returnedCondition"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Condizione articolo *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="good" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Buone condizioni (rientra in magazzino)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="damaged" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Danneggiato (non rientra in magazzino)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="lost" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Smarrito (non restituito)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Note sulla restituzione"
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
            Registra restituzione
          </Button>
        </div>
      </form>
    </Form>
  );
}
