export type Sex = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type NutritionGoal = 'emagrecimento' | 'ganho_massa' | 'manutencao' | 'recomposicao' | 'performance';

export type MealKey = 'cafe_manha' | 'lanche_manha' | 'almoco' | 'lanche_tarde' | 'jantar' | 'ceia';

export type MuscleGroup =
  | 'peito'
  | 'costas'
  | 'ombros'
  | 'biceps'
  | 'triceps'
  | 'pernas'
  | 'gluteos'
  | 'panturrilha'
  | 'abdomen'
  | 'corpo_inteiro'
  | 'outro';

export interface UserProfile {
  name: string;
  birth_date: string; // YYYY-MM-DD
  sex: Sex;
  height_cm: number;
  weight_kg: number;
  goal_weight_kg: number;
  activity_level: ActivityLevel;
  goal: NutritionGoal;
  athlete_mode: boolean;
  water_goal_ml?: number;
  custom_goals?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  onboarded: boolean;
  accepted_terms?: boolean;
}

export interface ComputedGoals {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water_goal_ml: number;
  athlete_mode: boolean;
  calorie_floor: number;
  floor_applied: boolean;
  below_floor: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  calories: number; // per 100g
  protein: number;  // g per 100g
  carbs: number;    // g per 100g
  fat: number;      // g per 100g
  fiber?: number;   // g per 100g
  sodium?: number;  // mg per 100g
  source?: 'taco' | 'custom' | 'favorite' | 'recipe';
}

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  meal: MealKey;
  foodId: string;
  name: string;
  brand?: string;
  grams: number;
  calories100: number;
  protein100: number;
  carbs100: number;
  fat100: number;
  fiber100?: number;
  sodium100?: number;
  // Computed values for current portion
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
}

export interface WaterLog {
  date: string;
  total_ml: number;
}

export interface WeightRecord {
  id: string;
  date: string;
  weight_kg: number;
  created_at: string;
}

export interface RoutineExercise {
  id: string;
  name: string;
  muscle_group: MuscleGroup;
  sets: number;
  reps: number;
  weight_kg: number;
  rest_s: number;
  notes?: string;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  notes?: string;
  exercises: RoutineExercise[];
  created_at: string;
}

export interface SessionSet {
  reps: number;
  weight_kg: number;
  done: boolean;
}

export interface SessionExercise {
  name: string;
  muscle_group: MuscleGroup;
  sets: SessionSet[];
}

export interface WorkoutSession {
  id: string;
  routine_id?: string;
  routine_name: string;
  date: string;
  duration_min: number;
  exercises: SessionExercise[];
  volume_kg: number;
  total_sets: number;
  calories_burned: number;
  records?: string[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface MealSuggestion {
  id: string;
  title: string;
  description: string;
  items: {
    name: string;
    grams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
