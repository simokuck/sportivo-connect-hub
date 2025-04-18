
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Laptop } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTheme } from "@/context/ThemeContext";

const themeSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  primaryColor: z.string().regex(/^#([0-9A-F]{6})$/i, {
    message: "Il colore deve essere in formato esadecimale (es. #1976D2)",
  }),
});

type ThemeFormValues = z.infer<typeof themeSchema>;

const DevSettings = () => {
  const { theme, setTheme, primaryColor, setPrimaryColor } = useTheme();

  const form = useForm<ThemeFormValues>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      theme,
      primaryColor,
    },
  });

  const handleSubmit = (data: ThemeFormValues) => {
    setTheme(data.theme);
    setPrimaryColor(data.primaryColor);
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Impostazioni Sviluppatore</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tema Applicazione</CardTitle>
            <CardDescription>
              Personalizza il tema e i colori dell'applicazione
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tema</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col gap-4 sm:flex-row"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="light" />
                            <label
                              htmlFor="light"
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Sun className="h-4 w-4" /> Chiaro
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="dark" />
                            <label
                              htmlFor="dark"
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Moon className="h-4 w-4" /> Scuro
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="system" id="system" />
                            <label
                              htmlFor="system"
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Laptop className="h-4 w-4" /> Sistema
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Separator />

                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colore Principale</FormLabel>
                      <div className="flex items-center gap-3">
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <Input
                          type="color"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                          className="w-12 h-10 p-1"
                        />
                      </div>
                      <FormDescription>
                        Questo colore sarà utilizzato per la sidebar e gli elementi principali
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Salva Impostazioni
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anteprima</CardTitle>
            <CardDescription>
              Visualizza un'anteprima delle impostazioni attuali
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Colore Principale:</p>
                <div
                  className="h-12 rounded-md"
                  style={{ backgroundColor: form.watch("primaryColor") }}
                />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Pulsanti:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    style={{
                      backgroundColor: form.watch("primaryColor"),
                    }}
                  >
                    Pulsante Primario
                  </Button>
                  <Button variant="outline">Pulsante Outline</Button>
                  <Button variant="secondary">Pulsante Secondario</Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Elementi UI:</p>
                <div className="flex flex-wrap gap-2">
                  <div
                    className="p-3 rounded-md text-white"
                    style={{ backgroundColor: form.watch("primaryColor") }}
                  >
                    Sidebar
                  </div>
                  <div className="p-3 border rounded-md">Card</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Note per gli Sviluppatori</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Queste impostazioni sono pensate per il debug e lo sviluppo dell'applicazione.
              Le modifiche qui applicate influenzeranno l'intera applicazione e saranno
              salvate nel localStorage del browser.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DevSettings;
