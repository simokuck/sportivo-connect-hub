import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette } from 'lucide-react';
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useNotifications } from "@/context/NotificationContext";

const DevSettings = () => {
  const { showNotification } = useNotifications();
  const [primaryColor, setPrimaryColor] = React.useState(() => 
    localStorage.getItem('theme-primary-color') || "#646cff"
  );
  const [secondaryColor, setSecondaryColor] = React.useState(() => 
    localStorage.getItem('theme-secondary-color') || "#535bf2"
  );
  const [accentColor, setAccentColor] = React.useState(() => 
    localStorage.getItem('theme-accent-color') || "#747bff"
  );
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);

  const applyColorsToDOM = (primary: string, secondary: string, accent: string) => {
    // Apply colors to CSS variables
    document.documentElement.style.setProperty('--primary', primary);
    document.documentElement.style.setProperty('--secondary', secondary);
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--sidebar-background', primary);

    // Convert HEX to HSL for Tailwind CSS variables
    const hexToHSL = (hex: string) => {
      // Remove the # if present
      hex = hex.replace(/^#/, '');
      
      // Parse the hex values
      let r = parseInt(hex.slice(0, 2), 16) / 255;
      let g = parseInt(hex.slice(2, 4), 16) / 255;
      let b = parseInt(hex.slice(4, 6), 16) / 255;
      
      // Find the min and max values to calculate the lightness
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      
      if (max === min) {
        // Achromatic
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
          default: h = 0;
        }
        
        h = Math.round(h * 60);
      }
      
      // Convert saturation and lightness to percentages
      s = Math.round(s * 100);
      l = Math.round(l * 100);
      
      return { h, s, l };
    };
    
    // Apply HSL values to CSS variables
    const primaryHSL = hexToHSL(primary);
    const secondaryHSL = hexToHSL(secondary);
    const accentHSL = hexToHSL(accent);
    
    document.documentElement.style.setProperty('--primary', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
    document.documentElement.style.setProperty('--secondary', `${secondaryHSL.h} ${secondaryHSL.s}% ${secondaryHSL.l}%`);
    document.documentElement.style.setProperty('--accent', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
  };

  const clearColorCache = () => {
    // Clear any cached color values in session/local storage
    const colorKeys = Object.keys(localStorage).filter(key => 
      key.includes('color') || key.includes('theme')
    );
    
    // Keep the new values but clear any other cached colors
    colorKeys.forEach(key => {
      if (!['theme-primary-color', 'theme-secondary-color', 'theme-accent-color'].includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear any CSS variables that might be cached in memory
    document.documentElement.removeAttribute('style');
    
    // Re-apply the colors to ensure they take effect
    applyColorsToDOM(primaryColor, secondaryColor, accentColor);
  };

  const handleColorChange = () => {
    // Save colors to localStorage
    localStorage.setItem('theme-primary-color', primaryColor);
    localStorage.setItem('theme-secondary-color', secondaryColor);
    localStorage.setItem('theme-accent-color', accentColor);

    // Clear cache and apply new colors
    clearColorCache();
    
    // Apply colors to CSS variables
    applyColorsToDOM(primaryColor, secondaryColor, accentColor);

    showNotification('success', 'Tema aggiornato', {
      description: "Le modifiche sono state salvate con successo e applicate all'interfaccia.",
    });

    // Reload key UI components to ensure all elements get the new colors
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Impostazioni Sviluppatore</h1>

      <Tabs defaultValue="theme" className="w-full">
        <TabsList>
          <TabsTrigger value="theme">Tema</TabsTrigger>
          <TabsTrigger value="config">Configurazione</TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Palette Colori
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="primaryColor">Colore Primario</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-[100px] h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-[120px]"
                    />
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: primaryColor }}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="secondaryColor">Colore Secondario</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-[100px] h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-[120px]"
                    />
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: secondaryColor }}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="accentColor">Colore Accent</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="accentColor"
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-[100px] h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-[120px]"
                    />
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: accentColor }}
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setIsConfirmationOpen(true)}
                className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Applica Modifiche
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configurazione Generale</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add additional configuration options here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleColorChange}
        title="Conferma Modifiche"
        description="Sei sicuro di voler applicare le modifiche? L'applicazione verrà riavviata per applicare tutte le modifiche al tema."
      />
    </div>
  );
};

export default DevSettings;
