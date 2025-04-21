
import React from 'react';
import { ItemVariant } from '@/types/warehouse';

interface VariantDisplayProps {
  variant?: ItemVariant;
  color?: string;
  size?: string;
}

// Function to convert hex color to human-readable name
const getColorName = (color: string): string => {
  const colorMap: Record<string, string> = {
    "#FF0000": "Rosso",
    "#00FF00": "Verde",
    "#0000FF": "Blu",
    "#FFFF00": "Giallo",
    "#FF00FF": "Magenta",
    "#00FFFF": "Ciano",
    "#000000": "Nero",
    "#FFFFFF": "Bianco",
    "#808080": "Grigio",
    "#800000": "Bordeaux",
    "#808000": "Oliva",
    "#008000": "Verde scuro",
    "#800080": "Viola",
    "#008080": "Teal",
    "#000080": "Blu navy",
    "#FFA500": "Arancione",
    "#A52A2A": "Marrone",
    "#1976d2": "Blu Cobalto",
    "#556B2F": "Verde Oliva",
    "#708090": "Grigio Ardesia",
    "#4B0082": "Indaco",
  };
  
  return colorMap[color] || "Colore personalizzato";
};

export const VariantDisplay: React.FC<VariantDisplayProps> = ({ variant, color, size }) => {
  // If a variant object is provided, use its properties
  const displayColor = variant?.color || color || '';
  const displaySize = variant?.size || size || '';
  
  if (!displayColor && !displaySize) {
    return <span className="text-muted-foreground">-</span>;
  }
  
  return (
    <div className="flex items-center gap-2">
      {displayColor && (
        <div className="flex items-center gap-1">
          <div 
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: displayColor }}
            title={displayColor}
          ></div>
          <span>{getColorName(displayColor)}</span>
        </div>
      )}
      {displayColor && displaySize && <span className="text-muted-foreground">/</span>}
      {displaySize && <span>{displaySize}</span>}
    </div>
  );
};
