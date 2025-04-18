
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const DevSettings = () => {
  const { toast } = useToast();
  const [primaryColor, setPrimaryColor] = React.useState(() => 
    localStorage.getItem('theme-primary-color') || "#646cff"
  );
  const [secondaryColor, setSecondaryColor] = React.useState(() => 
    localStorage.getItem('theme-secondary-color') || "#535bf2"
  );
  const [accentColor, setAccentColor] = React.useState(() => 
    localStorage.getItem('theme-accent-color') || "#747bff"
  );

  const handleColorChange = () => {
    // Save colors to localStorage
    localStorage.setItem('theme-primary-color', primaryColor);
    localStorage.setItem('theme-secondary-color', secondaryColor);
    localStorage.setItem('theme-accent-color', accentColor);

    // Apply colors to CSS variables
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--secondary', secondaryColor);
    document.documentElement.style.setProperty('--accent', accentColor);
    
    // For the sidebar as well
    document.documentElement.style.setProperty('--sidebar-background', primaryColor);

    toast({
      title: "Tema aggiornato",
      description: "Le modifiche sono state salvate con successo.",
    });
  };

  // Apply saved colors on component mount
  React.useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--secondary', secondaryColor);
    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--sidebar-background', primaryColor);
  }, [primaryColor, secondaryColor, accentColor]);

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

              <Button onClick={handleColorChange} className="mt-4">
                Applica Colori
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
    </div>
  );
};

export default DevSettings;
