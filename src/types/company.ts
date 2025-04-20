
import { z } from 'zod';

export const companyInfoSchema = z.object({
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

export type CompanyInfoValues = z.infer<typeof companyInfoSchema>;
