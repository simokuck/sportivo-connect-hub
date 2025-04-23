
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { Calendar } from 'lucide-react';

interface CreateSeasonDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  seasonForm: UseFormReturn<any>;
  onSubmitSeason: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const CreateSeasonDialog: React.FC<CreateSeasonDialogProps> = ({
  open,
  onOpenChange,
  seasonForm,
  onSubmitSeason,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Nuova Stagione</DialogTitle>
        <DialogDescription>
          Crea una nuova stagione sportiva
        </DialogDescription>
      </DialogHeader>
      <Form {...seasonForm}>
        <form onSubmit={onSubmitSeason} className="space-y-4">
          <FormField
            control={seasonForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Stagione</FormLabel>
                <FormControl>
                  <Input placeholder="Es. 2024/2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={seasonForm.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Inizio</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={seasonForm.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Fine</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={seasonForm.control}
            name="isActive"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Imposta come stagione attiva
                </label>
              </div>
            )}
          />
          <DialogFooter>
            <Button type="submit">
              <Calendar className="mr-2 h-4 w-4" />Crea Stagione
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
);

export default CreateSeasonDialog;
