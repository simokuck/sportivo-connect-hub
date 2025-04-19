
import React from 'react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MinusCircle } from 'lucide-react';
import { ItemSize } from '@/types/warehouse';
import { UseFormReturn } from 'react-hook-form';

interface SizesListProps {
  form: UseFormReturn<any>;
  sizesType: string;
  updateSizeQuantity: (index: number, quantity: number) => void;
  handleRemoveSize: (index: number) => void;
}

const SizesList = ({ form, sizesType, updateSizeQuantity, handleRemoveSize }: SizesListProps) => {
  const sizes = form.watch('sizes') || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {sizes.map((size: ItemSize, index: number) => (
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
  );
};

export default SizesList;
