
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LocationPickerProps {
  value?: string;
  onChange: (value: string, coords?: { lat: number; lng: number }) => void;
  className?: string;
  useOpenStreetMap?: boolean;
}

const LocationPicker = ({ 
  value = '', 
  onChange, 
  className,
  useOpenStreetMap = false
}: LocationPickerProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (newValue.length > 2 && useOpenStreetMap) {
      setIsLoading(true);
      
      timeoutRef.current = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newValue)}`)
          .then(response => response.json())
          .then(data => {
            setSuggestions(data);
            setShowSuggestions(true);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Error fetching suggestions:", error);
            setIsLoading(false);
          });
      }, 400);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const location = suggestion.display_name;
    setInputValue(location);
    onChange(location, { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent form submission from bubbling up
    onChange(inputValue);
    setShowSuggestions(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="pl-8"
          placeholder="Cerca una posizione..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute mt-1 w-full rounded-md border bg-background shadow-lg z-50">
          <ul className="py-1 max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="flex items-center px-3 py-2 hover:bg-accent cursor-pointer text-sm"
              >
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{suggestion.display_name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
