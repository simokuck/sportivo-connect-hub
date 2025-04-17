import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { mockExercises } from '@/data/mockData';
import { Dumbbell, Timer, Tag, Users, Video, Plus, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TrainingExercise } from '@/types';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

const exerciseFormSchema = z.object({
  title: z.string().min(3, { message: "Il titolo deve essere di almeno 3 caratteri" }),
  description: z.string().min(10, { message: "La descrizione deve essere di almeno 10 caratteri" }),
  category: z.enum(["technical", "tactical", "physical", "mental"]),
  duration: z.coerce.number().min(5, { message: "La durata minima è di 5 minuti" }),
  playersNeeded: z.coerce.number().min(1, { message: "È richiesto almeno 1 giocatore" }),
  groupsNeeded: z.coerce.number().min(1, { message: "È richiesto almeno 1 gruppo" }),
  videoUrl: z.string().url({ message: "Inserisci un URL valido" }).optional().or(z.literal('')),
  forPosition: z.array(z.string()).optional(),
});

type ExerciseFormValues = z.infer<typeof exerciseFormSchema>;

const ExercisesPage = () => {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<(TrainingExercise & { playersNeeded?: number; groupsNeeded?: number; videoUrl?: string })[]>(
    mockExercises.map(ex => ({
      ...ex,
      playersNeeded: Math.floor(Math.random() * 10) + 4, // Random number between 4 and 13
      groupsNeeded: Math.floor(Math.random() * 3) + 1, // Random number between 1 and 3
      videoUrl: Math.floor(Math.random() * 3) === 0 ? "https://www.youtube.com/embed/dQw4w9WgXcQ" : "", // Example video for some exercises
    }))
  );
  const [selectedExercise, setSelectedExercise] = useState<(TrainingExercise & { playersNeeded?: number; groupsNeeded?: number; videoUrl?: string }) | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const canAccessExercises = user?.role === 'coach';

  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "technical",
      duration: 15,
      playersNeeded: 10,
      groupsNeeded: 1,
      videoUrl: "",
      forPosition: [],
    },
  });

  const positionOptions = [
    "Portiere",
    "Difensore",
    "Centrocampista",
    "Attaccante",
    "Terzino",
    "Centrale",
    "Ala",
    "Punta"
  ];

  const onSubmit = (data: ExerciseFormValues) => {
    const newExercise = {
      id: `exercise-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      duration: data.duration,
      createdBy: user?.id || "",
      playersNeeded: data.playersNeeded,
      groupsNeeded: data.groupsNeeded,
      videoUrl: data.videoUrl,
      forPosition: data.forPosition,
    };
    
    setExercises([...exercises, newExercise]);
    setDialogOpen(false);
    form.reset();
    
    toast({
      title: "Esercitazione Creata",
      description: "La nuova esercitazione è stata aggiunta con successo",
    });
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
    setDrawerOpen(false);
    setSelectedExercise(null);
    
    toast({
      title: "Esercitazione Eliminata",
      description: "L'esercitazione è stata eliminata con successo",
    });
  };

  const openExerciseDetails = (exercise: TrainingExercise & { playersNeeded?: number; groupsNeeded?: number; videoUrl?: string }) => {
    setSelectedExercise(exercise);
    setDrawerOpen(true);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'technical': return 'Tecnica';
      case 'tactical': return 'Tattica';
      case 'physical': return 'Fisica';
      case 'mental': return 'Mentale';
      default: return category;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-sportivo-blue">Esercitazioni</h1>
        {canAccessExercises && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nuova Esercitazione
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => (
          <Card 
            key={exercise.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openExerciseDetails(exercise)}
          >
            <CardHeader className="flex flex-row items-center space-y-0 gap-4">
              <Dumbbell className="h-8 w-8 text-sportivo-blue" />
              <CardTitle className="text-lg">{exercise.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {exercise.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  <span>{exercise.duration} minuti</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{exercise.playersNeeded} giocatori, {exercise.groupsNeeded} {exercise.groupsNeeded === 1 ? 'gruppo' : 'gruppi'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    {getCategoryLabel(exercise.category)}
                  </Badge>
                  {exercise.forPosition?.map((position) => (
                    <Badge key={position} variant="secondary">
                      {position}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crea Nuova Esercitazione</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titolo</FormLabel>
                    <FormControl>
                      <Input placeholder="Inserisci il titolo dell'esercitazione" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrizione</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrivi l'esercitazione in dettaglio" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
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
                          <SelectItem value="technical">Tecnica</SelectItem>
                          <SelectItem value="tactical">Tattica</SelectItem>
                          <SelectItem value="physical">Fisica</SelectItem>
                          <SelectItem value="mental">Mentale</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durata (minuti)</FormLabel>
                      <FormControl>
                        <Input type="number" min="5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="playersNeeded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giocatori Necessari</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="groupsNeeded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gruppi Necessari</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Video Dimostrativo</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://www.youtube.com/embed/..." 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Inserisci l'URL embed di YouTube (opzionale)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="forPosition"
                render={() => (
                  <FormItem>
                    <FormLabel>Ruoli Consigliati</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {positionOptions.map((position) => (
                        <Badge
                          key={position}
                          variant={form.getValues("forPosition")?.includes(position) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const currentPositions = form.getValues("forPosition") || [];
                            if (currentPositions.includes(position)) {
                              form.setValue(
                                "forPosition",
                                currentPositions.filter((p) => p !== position)
                              );
                            } else {
                              form.setValue("forPosition", [...currentPositions, position]);
                            }
                          }}
                        >
                          {position}
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button type="submit">Crea Esercitazione</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{selectedExercise?.title}</DrawerTitle>
            <DrawerDescription>
              Categoria: {selectedExercise && getCategoryLabel(selectedExercise.category)}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Descrizione</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedExercise?.description}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
                  <Timer className="h-5 w-5 mb-1" />
                  <span className="text-lg font-semibold">{selectedExercise?.duration}</span>
                  <span className="text-xs text-muted-foreground">Minuti</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
                  <Users className="h-5 w-5 mb-1" />
                  <span className="text-lg font-semibold">{selectedExercise?.playersNeeded}</span>
                  <span className="text-xs text-muted-foreground">Giocatori</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-accent rounded-lg">
                  <Tag className="h-5 w-5 mb-1" />
                  <span className="text-lg font-semibold">{selectedExercise?.groupsNeeded}</span>
                  <span className="text-xs text-muted-foreground">Gruppi</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Ruoli Consigliati</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise?.forPosition && selectedExercise.forPosition.length > 0 ? (
                    selectedExercise.forPosition.map((position) => (
                      <Badge key={position} variant="secondary">
                        {position}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Nessun ruolo specifico</span>
                  )}
                </div>
              </div>

              {selectedExercise?.videoUrl && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Video Dimostrativo</h3>
                  <AspectRatio ratio={16 / 9} className="max-w-[400px] mx-auto">
                    <iframe
                      src={selectedExercise.videoUrl}
                      className="h-full w-full rounded-md"
                      allowFullScreen
                    />
                  </AspectRatio>
                </div>
              )}
            </div>
          </div>
          <DrawerFooter className="flex-row justify-end space-x-2 pt-2">
            {canAccessExercises && selectedExercise && (
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteExercise(selectedExercise.id)}
              >
                <X className="mr-2 h-4 w-4" /> Elimina
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Chiudi</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ExercisesPage;
