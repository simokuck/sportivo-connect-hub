
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { mockExercises } from '@/data/mockData';
import { Dumbbell, Timer, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const ExercisesPage = () => {
  const { user } = useAuth();

  // Only coaches can access this page
  const canAccessExercises = user?.role === 'coach';
  const filteredExercises = canAccessExercises ? mockExercises : [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-sportivo-blue">Esercitazioni</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 gap-4">
              <Dumbbell className="h-8 w-8 text-sportivo-blue" />
              <CardTitle className="text-lg">{exercise.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {exercise.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Timer className="h-4 w-4" />
                  <span>{exercise.duration} minuti</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    {exercise.category}
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
    </div>
  );
};

export default ExercisesPage;
