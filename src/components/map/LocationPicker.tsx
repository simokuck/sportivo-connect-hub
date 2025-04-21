import React, {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";

interface LocationPickerProps {
  value?: string;
  onChange: (location: string, coords?: { lat: number; lng: number }) => void;
  useOpenStreetMap?: boolean;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState<Array<{label: string, lat: number, lng: number}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue.length > 3) {
      try {
        // Chiamata all'API di Nominatim (OpenStreetMap)
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newValue)}&limit=5`);
        const data = await response.json();
        
        const newSuggestions = data.map((item: any) => ({
          label: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }));
        
        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
      } catch (error) {
        console.error("Errore nella ricerca dell'indirizzo:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: {label: string, lat: number, lng: number}) => {
    setInputValue(suggestion.label);
    onChange(suggestion.label, { lat: suggestion.lat, lng: suggestion.lng });
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Inserisci un indirizzo"
        className="w-full"
      />
      
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-accent"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
