
import { z } from "zod";

export const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, {
    message: "Il titolo deve essere di almeno 3 caratteri.",
  }),
  description: z.string().optional(),
  start: z.string().refine((date) => {
    try {
      new Date(date);
      return true;
    } catch (error) {
      return false;
    }
  }, {
    message: "Data di inizio non valida",
  }),
  end: z.string().refine((date) => {
    try {
      new Date(date);
      return true;
    } catch (error) {
      return false;
    }
  }, {
    message: "Data di fine non valida",
  }),
  type: z.enum(["training", "match", "medical", "meeting"]),
  location: z.string().optional(),
  isPrivate: z.boolean().default(false),
  teamId: z.string().optional(),
  requiresMedical: z.boolean().default(false),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type EventFormValues = z.infer<typeof eventSchema>;
