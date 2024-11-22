export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
};

export type Workout = {
  id: string;
  title: string;
  description?: string;
  exercises: Exercise[];
  date: string;
  completed: boolean;
  type: 'strength' | 'cardio' | 'flexibility' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};