import React, {useEffect} from 'react';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Switch} from "@/components/ui/switch";
import {ItemSize} from '@/types/warehouse';
import {UseFormReturn} from 'react-hook-form';
import SizeTypeSelector from './SizeTypeSelector';
import SizesList from './SizesList';
import CustomSizeInput from './CustomSizeInput';

interface SizesEditorProps {
  form: UseFormReturn<any>;
}

const defaultSizes: Record<string, ItemSize[]> = {
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

  // Initialize sizes if needed
  useEffect(() => {
    if (hasSizes && (!form.getValues('sizes') || form.getValues('sizes').length === 0)) {
      form.setValue('sizesType', 'standard');
      form.setValue('sizes', [...defaultSizes.standard]);
    }
  }, [hasSizes, form]);

  // Update sizes based on type selection
  const updateSizesForType = (type: string) => {
    if (type !== 'custom') {
      form.setValue('sizes', [...defaultSizes[type as keyof typeof defaultSizes]]);
    } else if (!form.getValues('sizes') || form.getValues('sizes').length === 0) {
      form.setValue('sizes', []);
    }
  };

  // Add new custom size
  const handleAddSize = (newSizeLabel: string) => {
    const currentSizes = form.getValues('sizes') || [];
    if (currentSizes.some((size: ItemSize) => size.label.toLowerCase() === newSizeLabel.trim().toLowerCase())) {
      return;
    }
    
    const updatedSizes = [...currentSizes, { label: newSizeLabel.trim(), quantity: 0 }];
    form.setValue('sizes', updatedSizes);
  };

  // Remove size
  const handleRemoveSize = (index: number) => {
    const currentSizes = form.getValues('sizes') || [];
    const updatedSizes = currentSizes.filter((_: any, i: number) => i !== index);
    form.setValue('sizes', updatedSizes);
  };

  // Update quantity for a specific size
  const updateSizeQuantity = (index: number, quantity: number) => {
    const currentSizes: ItemSize[] = form.getValues('sizes') || [];
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
    
    // Update general status based on sizes
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
          <SizeTypeSelector 
            form={form} 
            onTypeChange={updateSizesForType} 
          />

          <FormField
            control={form.control}
            name="sizes"
            render={() => (
              <FormItem>
                <FormLabel>Taglie disponibili</FormLabel>
                <div className="space-y-3">
                  {sizesType === 'custom' && (
                    <CustomSizeInput onAddSize={handleAddSize} />
                  )}

                  <SizesList 
                    form={form}
                    sizesType={sizesType}
                    updateSizeQuantity={updateSizeQuantity}
                    handleRemoveSize={handleRemoveSize}
                  />
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
