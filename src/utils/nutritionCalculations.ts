import { UserProfile, ComputedGoals, MealKey } from '../types';

export const MEAL_NAMES_PT: Record<MealKey, string> = {
  cafe_manha: 'Café da manhã',
  lanche_manha: 'Lanche da manhã',
  almoco: 'Almoço',
  lanche_tarde: 'Lanche da tarde',
  jantar: 'Jantar',
  ceia: 'Ceia',
};

export const MEAL_ICONS: Record<MealKey, string> = {
  cafe_manha: '☕',
  lanche_manha: '🍎',
  almoco: '🥗',
  lanche_tarde: '🥪',
  jantar: '🍲',
  ceia: '🥛',
};

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const GOAL_CALORIE_ADJUST = {
  emagrecimento: -0.20,
  ganho_massa: 0.12,
  manutencao: 0.0,
  recomposicao: -0.08,
  performance: 0.08,
};

export const GOAL_PROTEIN_PER_KG = {
  emagrecimento: 2.0,
  ganho_massa: 2.0,
  manutencao: 1.6,
  recomposicao: 2.2,
  performance: 1.8,
};

export const CALORIE_FLOOR = {
  male: 1500,
  female: 1200,
};

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateBR(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  } catch {
    return dateStr;
  }
}

export function computeAge(birthDate: string): number {
  if (!birthDate) return 28;
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return Math.max(16, age);
  } catch {
    return 28;
  }
}

export function computeGoals(profile: UserProfile): ComputedGoals {
  const weight = Number(profile.weight_kg) || 70;
  const height = Number(profile.height_cm) || 170;
  const sex = profile.sex || 'male';
  const age = computeAge(profile.birth_date);
  const goal = profile.goal || 'manutencao';
  const athlete = Boolean(profile.athlete_mode);
  const activity = profile.activity_level || 'moderate';

  // Mifflin-St Jeor equation
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);

  // In athlete mode activity multiplier is NEAT only (1.2) to prevent double counting
  const mult = athlete ? 1.2 : (ACTIVITY_MULTIPLIERS[activity] || 1.55);
  const tdee = bmr * mult;

  const floor = CALORIE_FLOOR[sex] || 1200;
  let floor_applied = false;
  let calories = 0;
  let protein = 0;
  let fat = 0;
  let carbs = 0;

  if (profile.custom_goals && profile.custom_goals.calories) {
    calories = Number(profile.custom_goals.calories);
    protein = Number(profile.custom_goals.protein || 0);
    fat = Number(profile.custom_goals.fat || 0);
    carbs = Number(profile.custom_goals.carbs || 0);
  } else {
    calories = tdee * (1 + (GOAL_CALORIE_ADJUST[goal] || 0));
    if (calories < floor) {
      calories = floor;
      floor_applied = true;
    }
    protein = (GOAL_PROTEIN_PER_KG[goal] || 1.8) * weight;
    fat = (calories * 0.27) / 9;
    const carbsKcal = calories - (protein * 4) - (fat * 9);
    carbs = Math.max(0, carbsKcal / 4);
  }

  const waterGoal = Number(profile.water_goal_ml) || Math.round(weight * 35);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    athlete_mode: athlete,
    water_goal_ml: waterGoal,
    calorie_floor: floor,
    floor_applied,
    below_floor: calories < floor,
  };
}
