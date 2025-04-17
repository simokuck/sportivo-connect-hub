
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TrainingExercise } from '@/types';
import { 
  ArrowDown, 
  ArrowUp, 
  CalendarDays, 
  Edit, 
  Plus, 
  Save, 
  Trash, 
  ClipboardList, 
  Timer 
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

// Mock training exercises data
const mockExercises: TrainingExercise[] = [
  {
    id: '1',
    title: 'Passaggi a coppie',
    description: 'Esercitazione con passaggi a coppie a corta e media distanza',
    category: 'technical',
    duration: 15,
    createdBy: '2', // Coach Paolo
    playersNeeded: 2
  },
  {
    id: '2',
    title: 'Triangolazioni',
    description: 'Lavoro di triangolazioni con movimento senza palla',
    category: 'tactical',
    duration: 20,
    createdBy: '2',
    playersNeeded: 6,
    groupsNeeded: 2
  },
  {
    id: '3',
    title: 'Scatti brevi',
    description: 'Serie di scatti brevi con cambio di direzione',
    category: 'physical',
    duration: 12,
    createdBy: '2'
  },
  {
    id: '4',
    title: 'Gestione dello stress',
    description: 'Tecniche di respirazione e concentrazione pre-partita',
    category: 'mental',
    duration: 15,
    createdBy: '2'
  },
  {
    id: '5',
    title: 'Tiri in porta',
    description: 'Esercitazione di finalizzazione con tiri da varie posizioni',
    category: 'technical',
    duration: 25,
    createdBy: '2',
    playersNeeded: 5,
    forPosition: ['striker', 'midfielder']
  },
  {
    id: '6',
    title: 'Possesso palla',
    description: 'Possesso palla 5 vs 2 con spazi ridotti',
    category: 'tactical',
    duration: 20,
    createdBy: '2',
    playersNeeded: 7,
    groupsNeeded: 1
  },
];

// Training plan interface
interface TrainingPlan {
  id?: string;
  name: string;
  date: string;
  description: string;
  exercises: TrainingExercise[];
  totalDuration: number;
}

// Saved plans mock data
const mockSavedPlans: TrainingPlan[] = [
  {
    id: '1',
    name: 'Allenamento pre-partita',
    date: '2025-04-20',
    description: 'Allenamento di preparazione alla partita di campionato',
    exercises: [mockExercises[0], mockExercises[1], mockExercises[4]],
    totalDuration: 60
  },
  {
    id: '2',
    name: 'Tecnica individuale',
    date: '2025-04-15',
    description: 'Sessione focalizzata su tecnica individuale e precisione',
    exercises: [mockExercises[0], mockExercises[4], mockExercises[2]],
    totalDuration: 52
  }
];

const TrainingPlanner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedExercises, setSelectedExercises] = useState<TrainingExercise[]>([]);
  const [savedPlans, setSavedPlans] = useState<TrainingPlan[]>(mockSavedPlans);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanDate, setNewPlanDate] = useState('');
  const [newPlanDescription, setNewPlanDescription] = useState('');
  const [editingPlan, setEditingPlan] = useState<TrainingPlan | null>(null);
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Function to get category label in Italian
  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'technical':
        return 'Tecnico';
      case 'tactical':
        return 'Tattico';
      case 'physical':
        return 'Fisico';
      case 'mental':
        return 'Mentale';
      default:
        return category;
    }
  };

  // Get category badge color
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'technical':
        return 'bg-blue-100 text-blue-800';
      case 'tactical':
        return 'bg-green-100 text-green-800';
      case 'physical':
        return 'bg-red-100 text-red-800';
      case 'mental':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter exercises by category
  const filteredExercises = filterCategory === 'all'
    ? mockExercises
    : mockExercises.filter(ex => ex.category === filterCategory);

  // Add exercise to plan
  const addExercise = (exercise: TrainingExercise) => {
    setSelectedExercises(prev => [...prev, exercise]);
    toast({
      title: 'Esercizio aggiunto',
      description: `"${exercise.title}" aggiunto al piano di allenamento`
    });
  };

  // Remove exercise from plan
  const removeExercise = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
  };

  // Move exercise up in the list
  const moveExerciseUp = (index: number) => {
    if (index === 0) return;
    const newExercises = [...selectedExercises];
    [newExercises[index], newExercises[index - 1]] = [newExercises[index - 1], newExercises[index]];
    setSelectedExercises(newExercises);
  };

  // Move exercise down in the list
  const moveExerciseDown = (index: number) => {
    if (index === selectedExercises.length - 1) return;
    const newExercises = [...selectedExercises];
    [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
    setSelectedExercises(newExercises);
  };

  // Calculate total duration of selected exercises
  const totalDuration = selectedExercises.reduce((total, ex) => total + ex.duration, 0);

  // Save current plan
  const savePlan = () => {
    if (!newPlanName || !newPlanDate) {
      toast({
        title: 'Errore',
        description: 'Nome e data sono obbligatori',
        variant: 'destructive'
      });
      return;
    }

    if (selectedExercises.length === 0) {
      toast({
        title: 'Errore',
        description: 'Aggiungi almeno un esercizio al piano',
        variant: 'destructive'
      });
      return;
    }

    const newPlan: TrainingPlan = {
      id: editingPlan?.id || `plan-${Date.now()}`,
      name: newPlanName,
      date: newPlanDate,
      description: newPlanDescription,
      exercises: [...selectedExercises],
      totalDuration
    };

    if (editingPlan) {
      // Update existing plan
      setSavedPlans(prev => prev.map(p => p.id === editingPlan.id ? newPlan : p));
      setEditingPlan(null);
    } else {
      // Add new plan
      setSavedPlans(prev => [...prev, newPlan]);
    }

    toast({
      title: 'Piano salvato',
      description: `Il piano "${newPlanName}" è stato salvato`
    });

    // Reset form
    setNewPlanName('');
    setNewPlanDate('');
    setNewPlanDescription('');
    setSelectedExercises([]);
  };

  // Load a saved plan for editing
  const loadPlan = (plan: TrainingPlan) => {
    setEditingPlan(plan);
    setNewPlanName(plan.name);
    setNewPlanDate(plan.date);
    setNewPlanDescription(plan.description);
    setSelectedExercises([...plan.exercises]);
    setShowSavedPlans(false);
  };

  // Delete a saved plan
  const deletePlan = (id: string) => {
    setSavedPlans(prev => prev.filter(p => p.id !== id));
    toast({
      title: 'Piano eliminato',
      description: 'Il piano di allenamento è stato eliminato'
    });
  };

  // Only coaches can create training plans
  if (user?.role !== 'coach') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Accesso non consentito</h1>
          <p className="mt-2 text-muted-foreground">
            Solo gli allenatori possono accedere a questa pagina.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pianificazione Allenamenti</h1>
          <p className="text-muted-foreground">
            Crea e gestisci i tuoi piani di allenamento
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showSavedPlans} onOpenChange={setShowSavedPlans}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ClipboardList className="mr-2 h-4 w-4" />
                Piani salvati
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Piani di allenamento salvati</DialogTitle>
                <DialogDescription>
                  Seleziona un piano per modificarlo o creane uno nuovo
                </DialogDescription>
              </DialogHeader>
              {savedPlans.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Nessun piano salvato
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {savedPlans.map((plan) => (
                    <Card key={plan.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">{plan.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              <CalendarDays className="inline h-3 w-3 mr-1" />
                              {plan.date}
                            </p>
                            <p className="text-sm mt-1">{plan.description}</p>
                            <div className="mt-2">
                              <Badge variant="secondary">
                                <Timer className="h-3 w-3 mr-1" />
                                {plan.totalDuration} min
                              </Badge>
                              <Badge variant="outline" className="ml-2">
                                {plan.exercises.length} esercizi
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => loadPlan(plan)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deletePlan(plan.id!)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Exercise Library */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Libreria Esercizi</CardTitle>
              <CardDescription>
                Seleziona gli esercizi per il tuo allenamento
              </CardDescription>
              <Select
                value={filterCategory}
                onValueChange={setFilterCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtra per categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le categorie</SelectItem>
                  <SelectItem value="technical">Tecnico</SelectItem>
                  <SelectItem value="tactical">Tattico</SelectItem>
                  <SelectItem value="physical">Fisico</SelectItem>
                  <SelectItem value="mental">Mentale</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredExercises.map(exercise => (
                  <Card key={exercise.id} className="border-l-4" style={{ 
                    borderLeftColor: exercise.category === 'technical' ? '#3b82f6' :
                                    exercise.category === 'tactical' ? '#10b981' :
                                    exercise.category === 'physical' ? '#ef4444' : '#8b5cf6'
                  }}>
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{exercise.title}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(exercise.category)}`}>
                              {getCategoryLabel(exercise.category)}
                            </span>
                            <span className="text-xs ml-2 text-muted-foreground">
                              {exercise.duration} min
                            </span>
                          </div>
                          <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                            {exercise.description}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => addExercise(exercise)}
                          className="h-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Plan */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingPlan ? `Modifica Piano: ${editingPlan.name}` : 'Nuovo Piano di Allenamento'}
              </CardTitle>
              <CardDescription>
                Organizza la sequenza degli esercizi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="planName">Nome del piano</Label>
                  <Input
                    id="planName"
                    value={newPlanName}
                    onChange={e => setNewPlanName(e.target.value)}
                    placeholder="Es. Allenamento pre-partita"
                  />
                </div>
                <div>
                  <Label htmlFor="planDate">Data</Label>
                  <Input
                    id="planDate"
                    type="date"
                    value={newPlanDate}
                    onChange={e => setNewPlanDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="planDescription">Descrizione</Label>
                <Textarea
                  id="planDescription"
                  value={newPlanDescription}
                  onChange={e => setNewPlanDescription(e.target.value)}
                  placeholder="Descrizione del piano di allenamento"
                  className="h-20"
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Esercizi selezionati</h3>
                {selectedExercises.length === 0 ? (
                  <div className="text-center p-8 border rounded-md border-dashed">
                    <p className="text-muted-foreground">
                      Nessun esercizio selezionato. Aggiungi esercizi dalla libreria.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedExercises.map((exercise, index) => (
                      <div
                        key={`${exercise.id}-${index}`}
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div className="flex items-center">
                          <span className="bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{exercise.title}</p>
                            <div className="flex items-center">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(exercise.category)}`}>
                                {getCategoryLabel(exercise.category)}
                              </span>
                              <span className="text-xs ml-2 text-muted-foreground">
                                {exercise.duration} min
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveExerciseUp(index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveExerciseDown(index)}
                            disabled={index === selectedExercises.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeExercise(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Durata totale: <span className="text-sportivo-blue">{totalDuration} minuti</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedExercises.length} esercizi
                    </p>
                  </div>
                  <Button onClick={savePlan} className="ml-auto">
                    <Save className="mr-2 h-4 w-4" />
                    {editingPlan ? 'Aggiorna piano' : 'Salva piano'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlanner;
