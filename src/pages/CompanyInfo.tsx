
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import { CompanyInfoValues, companyInfoSchema } from '@/types/company';
import { CompanyGeneralForm } from '@/components/company/CompanyGeneralForm';
import { CompanyLegalForm } from '@/components/company/CompanyLegalForm';
import { CompanyContactForm } from '@/components/company/CompanyContactForm';
import { CompanyRepresentativeForm } from '@/components/company/CompanyRepresentativeForm';

const LOCAL_STORAGE_KEY = 'companyInfo';

// Mock data structure
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
                <CompanyGeneralForm form={form} />
              </TabsContent>

              <TabsContent value="legal" className="space-y-6">
                <CompanyLegalForm form={form} />
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <CompanyContactForm form={form} />
              </TabsContent>

              <TabsContent value="representative" className="space-y-6">
                <CompanyRepresentativeForm form={form} />
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
