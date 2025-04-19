
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';

interface CustomSizeInputProps {
  onAddSize: (label: string) => void;
}

const CustomSizeInput = ({ onAddSize }: CustomSizeInputProps) => {
  const [newSizeLabel, setNewSizeLabel] = useState('');

  const handleAddSize = () => {
    if (!newSizeLabel.trim()) return;
    onAddSize(newSizeLabel);
    setNewSizeLabel('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSize();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Nuova taglia"
        value={newSizeLabel}
        onChange={(e) => setNewSizeLabel(e.target.value)}
        onKeyDown={handleKeyDown}
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
  );
};

export default CustomSizeInput;
