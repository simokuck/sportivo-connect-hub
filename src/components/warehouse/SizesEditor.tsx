
import React, { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ItemSize } from '@/types/warehouse';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface SizesEditorProps {
  form: UseFormReturn<any>;
}

const defaultSizes = {
  numeric: [
    { label: '36', quantity: 0 },
    { label: '38', quantity: 0 },
    { label: '40', quantity: 0 },
    { label: '42', quantity: 0 },
    { label: '44', quantity: 0 },
  ],
  letter: [
    { label: 'XS', quantity: 0 },
    { label: 'S', quantity: 0 },
    { label: 'M', quantity: 0 },
    { label: 'L', quantity: 0 },
    { label: 'XL', quantity: 0 },
  ],
  standard: [
    { label: 'Unica', quantity: 0 },
  ],
  custom: [],
};

const SizesEditor = ({ form }: SizesEditorProps) => {
  const hasSizes = form.watch('hasSizes');
  const sizesType = form.watch('sizesType') || 'standard';
  const [newSizeLabel, setNewSizeLabel] = useState('');

  // Initialize sizes if needed
  useEffect(() => {
    if (hasSizes && (!form.getValues('sizes') || form.getValues('sizes').length === 0)) {
      form.setValue('sizesType', 'standard');
      form.setValue('sizes', [...defaultSizes.standard]);
    }
  }, [hasSizes, form]);

  // Update sizes based on type selection
  const updateSizesForType = (type: string) => {
    form.setValue('sizesType', type);
    
    if (type !== 'custom') {
      form.setValue('sizes', [...defaultSizes[type as keyof typeof defaultSizes]]);
    } else if (!form.getValues('sizes') || form.getValues('sizes').length === 0) {
      form.setValue('sizes', []);
    }
  };

  // Add new custom size
  const handleAddSize = () => {
    if (!newSizeLabel.trim()) return;
    
    const currentSizes = form.getValues('sizes') || [];
    if (currentSizes.some(size => size.label.toLowerCase() === newSizeLabel.trim().toLowerCase())) {
      return;
    }
    
    const updatedSizes = [...currentSizes, { label: newSizeLabel.trim(), quantity: 0 }];
    form.setValue('sizes', updatedSizes);
    setNewSizeLabel('');
  };

  // Remove size
  const handleRemoveSize = (index: number) => {
    const currentSizes = form.getValues('sizes') || [];
    const updatedSizes = currentSizes.filter((_, i) => i !== index);
    form.setValue('sizes', updatedSizes);
  };

  // Update quantity for a specific size
  const updateSizeQuantity = (index: number, quantity: number) => {
    const currentSizes = form.getValues('sizes') || [];
    const updatedSizes = [...currentSizes];
    
    // Status
    let status: 'available' | 'low' | 'out' = 'available';
    if (quantity === 0) {
      status = 'out';
    } else if (quantity <= 5) {
      status = 'low';
    }
    
    updatedSizes[index] = { 
      ...updatedSizes[index], 
      quantity,
      status
    };
    
    form.setValue('sizes', updatedSizes);
    
    // Update general status
    updateGeneralStatus(updatedSizes);
  };
  
  // Update general status based on sizes
  const updateGeneralStatus = (sizes: ItemSize[]) => {
    if (!sizes || sizes.length === 0) return;
    
    const totalQuantity = sizes.reduce((total, size) => total + size.quantity, 0);
    
    let generalStatus: 'available' | 'low' | 'out' = 'available';
    if (totalQuantity === 0) {
      generalStatus = 'out';
    } else if (totalQuantity <= 5) {
      generalStatus = 'low';
    }
    
    form.setValue('status', generalStatus);
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="hasSizes"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md shadow-sm">
            <div>
              <FormLabel>Gestione taglie</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked && !form.getValues('sizes')) {
                    form.setValue('sizesType', 'standard');
                    form.setValue('sizes', [...defaultSizes.standard]);
                  }
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {hasSizes && (
        <>
          <FormField
            control={form.control}
            name="sizesType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo di taglie</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => updateSizesForType(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona un tipo di taglia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="numeric">Numeriche (36, 38, 40...)</SelectItem>
                    <SelectItem value="letter">Lettere (XS, S, M, L, XL...)</SelectItem>
                    <SelectItem value="standard">Taglia unica</SelectItem>
                    <SelectItem value="custom">Personalizzate</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sizes"
            render={() => (
              <FormItem>
                <FormLabel>Taglie disponibili</FormLabel>
                <div className="space-y-3">
                  {sizesType === 'custom' && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nuova taglia"
                        value={newSizeLabel}
                        onChange={(e) => setNewSizeLabel(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddSize}
                        size="sm"
                      >
                        <PlusCircle className="h-4 w-4 mr-1" /> Aggiungi
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {form.watch('sizes')?.map((size: ItemSize, index: number) => (
                      <div key={index} className="flex items-center gap-2 border rounded-md p-2">
                        <Badge variant="outline" className="min-w-16 justify-center">
                          {size.label}
                        </Badge>
                        <Input
                          type="number"
                          min="0"
                          value={size.quantity}
                          onChange={(e) => updateSizeQuantity(index, parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                        {sizesType === 'custom' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSize(index)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

export default SizesEditor;
