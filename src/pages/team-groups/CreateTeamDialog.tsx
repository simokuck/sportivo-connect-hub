
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { TeamCategory, Season } from '@/types/player-management';
import { UserPlus } from 'lucide-react';

interface CreateTeamDialogProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  teamForm: UseFormReturn<any>;
  onSubmitTeam: (e: React.FormEvent<HTMLFormElement>) => void;
  getCategoriesBySeason: (seasonId: string) => TeamCategory[];
  currentSeason: Season | null;
  seasons: Season[];
}

export const CreateTeamDialog: React.FC<CreateTeamDialogProps> = ({
  open,
  onOpenChange,
  teamForm,
  onSubmitTeam,
  getCategoriesBySeason,
  currentSeason,
  seasons,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Nuova Squadra</DialogTitle>
        <DialogDescription>
          Crea un nuovo gruppo squadra per la stagione attuale
        </DialogDescription>
      </DialogHeader>
      <Form {...teamForm}>
        <form onSubmit={onSubmitTeam} className="space-y-4">
          <FormField
            control={teamForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Squadra</FormLabel>
                <FormControl>
                  <Input placeholder="Es. Allievi A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={teamForm.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona una categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currentSeason &&
                      getCategoriesBySeason(currentSeason.id).map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={teamForm.control}
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
              <UserPlus className="mr-2 h-4 w-4" />Crea Squadra
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
);

export default CreateTeamDialog;
