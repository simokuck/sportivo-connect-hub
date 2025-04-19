
import React from 'react';
import { cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';

interface SizeTypeSelectorProps {
  form: UseFormReturn<any>;
  onTypeChange: (type: string) => void;
}

const SizeTypeSelector = ({ form, onTypeChange }: SizeTypeSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="sizesType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo di taglie</FormLabel>
          <Select
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              onTypeChange(value);
            }}
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
  );
};

export default SizeTypeSelector;
