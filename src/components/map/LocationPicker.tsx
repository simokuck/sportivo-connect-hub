
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Fix Leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
  value?: string;
  onChange: (location: string, coordinates?: { lat: number; lng: number }) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState(value || '');

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const map = L.map(mapRef.current).setView([41.9028, 12.4964], 6); // Default to Italy
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      mapInstance.current = map;
      
      // Add click event to map
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        placeMarker([lat, lng]);
        reverseGeocode(lat, lng);
      });
    }
    
    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);
  
  // Place marker on the map
  const placeMarker = (coords: [number, number]) => {
    if (!mapInstance.current) return;
    
    if (markerRef.current) {
      mapInstance.current.removeLayer(markerRef.current);
    }
    
    markerRef.current = L.marker(coords).addTo(mapInstance.current);
    mapInstance.current.setView(coords, 16);
  };
  
  // Search for location using Nominatim
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      const data = await response.json();
      const address = data.display_name;
      setSelectedLocation(address);
      onChange(address, { lat, lng });
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };
  
  // Handle selection from search results
  const handleSelectResult = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    placeMarker([lat, lon]);
    setSelectedLocation(result.display_name);
    onChange(result.display_name, { lat, lon });
    setSearchResults([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Cerca un indirizzo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchLocation()}
        />
        <Button type="button" onClick={searchLocation} variant="outline">
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>
      
      {selectedLocation && (
        <div className="text-sm border p-2 rounded bg-muted">
          <p><strong>Indirizzo selezionato:</strong> {selectedLocation}</p>
        </div>
      )}
      
      {searchResults.length > 0 && (
        <div className="bg-background border rounded-md shadow-sm z-10">
          <ul className="max-h-60 overflow-auto">
            {searchResults.map((result, index) => (
              <li 
                key={index}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleSelectResult(result)}
              >
                {result.display_name}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div ref={mapRef} className="h-[300px] w-full rounded-md border"></div>
    </div>
  );
}

export default LocationPicker;
