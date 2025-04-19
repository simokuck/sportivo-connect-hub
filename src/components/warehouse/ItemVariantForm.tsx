
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ItemVariant, BaseItem } from '@/types/warehouse';

const itemVariantSchema = z.object({
  size: z.string().min(1, "La taglia è obbligatoria"),
  color: z.string().min(1, "Il colore è obbligatorio"),
  uniqueSku: z.string().min(1, "Il codice SKU è obbligatorio"),
  quantity: z.coerce.number().int().min(0, "La quantità deve essere maggiore o uguale a 0"),
  minimumThreshold: z.coerce.number().int().min(0, "La soglia minima deve essere maggiore o uguale a 0"),
  location: z.string().optional(),
});

type ItemVariantFormValues = z.infer<typeof itemVariantSchema>;

interface ItemVariantFormProps {
  baseItem: BaseItem;
  variant?: ItemVariant;
  onSubmit: (data: ItemVariantFormValues) => void;
  onCancel: () => void;
}

export function ItemVariantForm({ baseItem, variant, onSubmit, onCancel }: ItemVariantFormProps) {
  const form = useForm<ItemVariantFormValues>({
    resolver: zodResolver(itemVariantSchema),
    defaultValues: {
      size: variant?.size || '',
      color: variant?.color || '',
      uniqueSku: variant?.uniqueSku || `${baseItem.sku}-`,
      quantity: variant?.quantity || 0,
      minimumThreshold: variant?.minimumThreshold || 5,
      location: variant?.location || '',
    },
  });

  // Generate a unique SKU when size or color changes if it's a new variant
  const watchSize = form.watch("size");
  const watchColor = form.watch("color");
  
  React.useEffect(() => {
    if (!variant && watchSize && watchColor) {
      // Create a slug from the color and size
      const colorSlug = watchColor.toLowerCase().replace(/\s+/g, '-');
      const sizeSlug = watchSize.toLowerCase().replace(/\s+/g, '-');
      const uniqueSku = `${baseItem.sku}-${colorSlug}-${sizeSlug}`;
      form.setValue("uniqueSku", uniqueSku);
    }
  }, [watchSize, watchColor, baseItem.sku, variant, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taglia *</FormLabel>
                <FormControl>
                  <Input placeholder="Es. S, M, L, XL, 42, 44" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colore *</FormLabel>
                <FormControl>
                  <div className="flex gap-2 items-center">
                    <Input placeholder="Es. Rosso, Blu, Verde" {...field} />
                    <input
                      type="color"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-9 w-10 border rounded"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="uniqueSku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Codice SKU Variante *</FormLabel>
              <FormControl>
                <Input placeholder="Codice univoco della variante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantità iniziale *</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="minimumThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soglia minima *</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posizione magazzino</FormLabel>
                <FormControl>
                  <Input placeholder="Es. Armadio A, Scaffale 2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annulla
          </Button>
          <Button type="submit">
            {variant ? 'Aggiorna variante' : 'Crea variante'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
