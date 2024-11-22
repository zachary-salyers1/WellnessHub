import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  height?: number;
  weight?: number;
  fitness_goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'general_fitness';
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
};

export type Exercise = {
  name: string;
  sets: number;
  reps: number;
  notes?: string;
  weight?: number;
};

export type Workout = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  completed: boolean;
  completion_date?: string;
  created_at: string;
  updated_at: string;
};

export async function saveWorkout(workout: Omit<Workout, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be authenticated to save workouts');

  const { data, error } = await supabase
    .from('workouts')
    .insert({
      ...workout,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWorkouts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be authenticated to fetch workouts');

  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Workout[];
}

export async function updateWorkout(id: string, updates: Partial<Workout>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be authenticated to update workouts');

  const { data, error } = await supabase
    .from('workouts')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteWorkout(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be authenticated to delete workouts');

  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function completeWorkout(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be authenticated to complete workouts');

  const { data, error } = await supabase
    .from('workouts')
    .update({
      completed: true
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}