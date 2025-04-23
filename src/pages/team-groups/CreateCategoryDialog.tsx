
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { TeamCategory, Season } from '@/types/player-management';
import { Users } from 'lucide-react';

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  categoryForm: UseFormReturn<any>;
  onSubmitCategory: (e: React.FormEvent<HTMLFormElement>) => void;
  currentSeason: Season | null;
  seasons: Season[];
}

export const CreateCategoryDialog: React.FC<CreateCategoryDialogProps> = ({
  open,
  onOpenChange,
  categoryForm,
  onSubmitCategory,
  currentSeason,
  seasons,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Nuova Categoria</DialogTitle>
        <DialogDescription>
          Crea una nuova categoria per la stagione attuale
        </DialogDescription>
      </DialogHeader>
      <Form {...categoryForm}>
        <form onSubmit={onSubmitCategory} className="space-y-4">
          <FormField
            control={categoryForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Categoria</FormLabel>
                <FormControl>
                  <Input placeholder="Es. Allievi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={categoryForm.control}
              name="ageMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Età Minima</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Es. 15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={categoryForm.control}
              name="ageMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Età Massima</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Es. 16" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={categoryForm.control}
            name="seasonId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stagione</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={currentSeason?.id}
                  disabled={!!currentSeason}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona una stagione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {seasons.map(season => (
                      <SelectItem key={season.id} value={season.id}>
                        {season.name} {season.isActive && '(Attiva)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit">
              <Users className="mr-2 h-4 w-4" />Crea Categoria
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
);

export default CreateCategoryDialog;
