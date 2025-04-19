
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BaseItem } from '@/types/warehouse';

const baseItemSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  sku: z.string().min(1, "Il codice SKU è obbligatorio"),
  category: z.string().min(1, "La categoria è obbligatoria"),
  brand: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  image: z.string().optional(),
});

type BaseItemFormValues = z.infer<typeof baseItemSchema>;

interface BaseItemFormProps {
  item?: BaseItem;
  onSubmit: (data: BaseItemFormValues) => void;
  onCancel: () => void;
}

export function BaseItemForm({ item, onSubmit, onCancel }: BaseItemFormProps) {
  const form = useForm<BaseItemFormValues>({
    resolver: zodResolver(baseItemSchema),
    defaultValues: {
      name: item?.name || '',
      sku: item?.sku || '',
      category: item?.category || '',
      brand: item?.brand || '',
      description: item?.description || '',
      notes: item?.notes?.join('\n') || '',
      image: item?.image || '',
    },
  });

  const handleSubmit = (values: BaseItemFormValues) => {
    const notesArray = values.notes 
      ? values.notes.split('\n').filter(note => note.trim().length > 0) 
      : [];
    
    onSubmit({
      ...values,
      notes: notesArray.length > 0 ? values.notes : undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome articolo *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome dell'articolo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codice SKU *</FormLabel>
                <FormControl>
                  <Input placeholder="Codice articolo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria *</FormLabel>
                <FormControl>
                  <Input placeholder="Es. Maglia, Pantaloncino, Accessorio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Es. Nike, Adidas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrizione dell'articolo"
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Immagine</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
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
                  placeholder="Note aggiuntive (una per riga)"
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
            {item ? 'Aggiorna articolo' : 'Crea articolo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
