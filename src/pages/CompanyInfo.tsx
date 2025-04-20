import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Save, User, Users, Building, Award } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'companyInfo';

const companyInfoSchema = z.object({
  companyName: z.string().min(1, 'Il nome della società è richiesto'),
  businessName: z.string().min(1, 'La ragione sociale è richiesta'),
  registrationNumber: z.string().min(1, 'La matricola è richiesta'),
  taxId: z.string().min(1, 'La partita IVA/Codice fiscale è richiesta'),
  shareCapital: z.string().optional(),
  foundingYear: z.string().regex(/^\d{4}$/, 'Inserisci un anno valido'),
  headquarters: z.string().min(1, 'La sede legale è richiesta'),
  operationalOffice: z.string().optional(),
  phoneNumber: z.string().min(1, 'Il numero di telefono è richiesto'),
  email: z.string().email('Email non valida'),
  website: z.string().url('URL non valido').optional().or(z.literal('')),
  socialMedia: z.object({
    facebook: z.string().url('URL non valido').optional().or(z.literal('')),
    instagram: z.string().url('URL non valido').optional().or(z.literal('')),
    twitter: z.string().url('URL non valido').optional().or(z.literal('')),
    youtube: z.string().url('URL non valido').optional().or(z.literal('')),
  }),
  legalRepresentative: z.object({
    name: z.string().min(1, 'Il nome è richiesto'),
    surname: z.string().min(1, 'Il cognome è richiesto'),
    fiscalCode: z.string().min(16, 'Codice fiscale non valido').max(16, 'Codice fiscale non valido'),
    phoneNumber: z.string().min(1, 'Il numero di telefono è richiesto'),
    email: z.string().email('Email non valida'),
  }),
  description: z.string().optional(),
  colors: z.string().min(1, 'I colori sociali sono richiesti'),
});

type CompanyInfoValues = z.infer<typeof companyInfoSchema>;

// Dati di esempio
const mockCompanyInfo: CompanyInfoValues = {
  companyName: 'A.S.D. Sportivo',
  businessName: 'Associazione Sportiva Dilettantistica Sportivo',
  registrationNumber: '123456',
  taxId: '01234567890',
  shareCapital: '10.000,00 €',
  foundingYear: '1985',
  headquarters: 'Via Roma 123, 00100 Roma (RM)',
  operationalOffice: 'Via Napoli 45, 00100 Roma (RM)',
  phoneNumber: '+39 06 1234567',
  email: 'info@sportivo.it',
  website: 'https://www.sportivo.it',
  socialMedia: {
    facebook: 'https://facebook.com/sportivo',
    instagram: 'https://instagram.com/sportivo',
    twitter: 'https://twitter.com/sportivo',
    youtube: 'https://youtube.com/sportivo',
  },
  legalRepresentative: {
    name: 'Mario',
    surname: 'Rossi',
    fiscalCode: 'RSSMRA70A01H501Z',
    phoneNumber: '+39 333 1234567',
    email: 'mario.rossi@sportivo.it',
  },
  description: 'Associazione sportiva dilettantistica fondata nel 1985 con lo scopo di promuovere lo sport e i suoi valori educativi e sociali.',
  colors: 'Blu e Bianco',
};

const CompanyInfo = () => {
  const { toast } = useToast();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);

  const form = useForm<CompanyInfoValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: mockCompanyInfo,
  });

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
      } catch (error) {
        console.error('Error parsing saved company data:', error);
      }
    }
  }, [form]);

  const onSubmit = (data: CompanyInfoValues) => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirm = () => {
    const data = form.getValues();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    
    setIsConfirmDialogOpen(false);
    toast({
      title: 'Dati salvati',
      description: 'Le informazioni della società sono state aggiornate',
    });

    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    const previousColors = savedData ? JSON.parse(savedData).colors : '';
    
    if (data.colors !== previousColors) {
      setIsColorDialogOpen(true);
    }
  };

  const applyColorsToApp = () => {
    const colors = form.getValues('colors');
    toast({
      title: 'Colori applicati',
      description: `I colori "${colors}" sono stati impostati come tema principale dell'applicativo`,
    });
    setIsColorDialogOpen(false);
  };

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Anagrafica Società</h1>
          <p className="text-muted-foreground">Gestisci le informazioni della tua società sportiva</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="general">Generale</TabsTrigger>
                <TabsTrigger value="legal">Dati Legali</TabsTrigger>
                <TabsTrigger value="contact">Contatti</TabsTrigger>
                <TabsTrigger value="representative">Rappresentante</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" /> 
                      Informazioni Generali
                    </CardTitle>
                    <CardDescription>
                      Informazioni di base sulla società
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome società</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>Il nome ufficiale della società sportiva</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="foundingYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Anno di fondazione</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="colors"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Colori sociali</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrizione</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={4}
                              placeholder="Inserisci una descrizione della società..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="legal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Informazioni Legali
                    </CardTitle>
                    <CardDescription>
                      Dati fiscali e legali della società
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ragione Sociale</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="registrationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Matricola</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="taxId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Partita IVA / Codice Fiscale</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="shareCapital"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capitale Sociale</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="headquarters"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sede Legale</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="operationalOffice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sede Operativa</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>Opzionale, se diversa dalla sede legale</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Contatti
                    </CardTitle>
                    <CardDescription>
                      Recapiti e presenze online della società
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefono</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sito Web</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator className="my-4" />
                    <h3 className="text-lg font-medium mb-2">Social Media</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="socialMedia.facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://facebook.com/..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="socialMedia.instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://instagram.com/..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="socialMedia.twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://twitter.com/..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="socialMedia.youtube"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>YouTube</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://youtube.com/..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="representative" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Rappresentante Legale
                    </CardTitle>
                    <CardDescription>
                      Dati del legale rappresentante della società
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="legalRepresentative.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="legalRepresentative.surname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cognome</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="legalRepresentative.fiscalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Codice Fiscale</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="legalRepresentative.phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefono</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="legalRepresentative.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end mt-6">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salva Modifiche
              </Button>
            </div>
          </form>
        </Form>

        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Conferma salvataggio</DialogTitle>
              <DialogDescription>
                Sei sicuro di voler salvare le modifiche ai dati della società?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                Annulla
              </Button>
              <Button onClick={handleConfirm}>
                Conferma
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Applica colori sociali</DialogTitle>
              <DialogDescription>
                Vuoi utilizzare i colori sociali ({form.getValues('colors')}) come tema principale dell'applicazione?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsColorDialogOpen(false)}>
                No, solo salva
              </Button>
              <Button onClick={applyColorsToApp}>
                Sì, applica come tema
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CompanyInfo;
