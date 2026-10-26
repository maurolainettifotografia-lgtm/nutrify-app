import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  ComputedGoals,
  DiaryEntry,
  MealKey,
  FoodItem,
  WeightRecord,
  WorkoutRoutine,
  WorkoutSession,
  ChatMessage,
} from '../types';
import { computeGoals, getTodayString } from '../utils/nutritionCalculations';
import { estimateCaloriesBurned } from '../data/exercises';
import { ALL_TACO_FOODS } from '../data/tacoFoods';

interface AppContextType {
  profile: UserProfile;
  goals: ComputedGoals;
  activeDate: string;
  setActiveDate: (d: string) => void;
  diaryEntries: DiaryEntry[];
  waterAmount: number;
  weights: WeightRecord[];
  routines: WorkoutRoutine[];
  sessions: WorkoutSession[];
  customFoods: FoodItem[];
  favoriteFoodIds: string[];
  chatMessages: ChatMessage[];
  isChatLoading: boolean;

  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  addDiaryEntry: (meal: MealKey, food: FoodItem, grams: number) => void;
  updateDiaryEntryGrams: (entryId: string, grams: number) => void;
  deleteDiaryEntry: (entryId: string) => void;
  copyDiaryDay: (fromDate: string, toDate: string, meal?: MealKey) => number;
  addWater: (amountMl: number, date?: string) => void;
  resetWater: (date?: string) => void;
  addWeight: (weightKg: number, date?: string) => void;
  createRoutine: (routine: Omit<WorkoutRoutine, 'id' | 'created_at'>) => WorkoutRoutine;
  updateRoutine: (routine: WorkoutRoutine) => void;
  deleteRoutine: (id: string) => void;
  saveWorkoutSession: (session: Omit<WorkoutSession, 'id' | 'created_at'>) => WorkoutSession;
  deleteWorkoutSession: (id: string) => void;
  addCustomFood: (food: Omit<FoodItem, 'id' | 'source'>) => FoodItem;
  toggleFavoriteFood: (foodId: string) => void;
  sendChatMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  exportAllData: () => string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Usuário Nutrify',
  birth_date: '1998-06-15',
  sex: 'male',
  height_cm: 176,
  weight_kg: 76.5,
  goal_weight_kg: 72.0,
  activity_level: 'moderate',
  goal: 'emagrecimento',
  athlete_mode: true,
  water_goal_ml: 2700,
  onboarded: true,
  accepted_terms: true,
};

const INITIAL_ROUTINES: WorkoutRoutine[] = [
  {
    id: 'routine-1',
    name: 'Treino A - Peito, Ombros e Tríceps',
    notes: 'Foco em hipertrofia e força básica',
    created_at: new Date().toISOString(),
    exercises: [
      { id: 're-1', name: 'Supino reto com barra', muscle_group: 'peito', sets: 4, reps: 10, weight_kg: 60, rest_s: 90 },
      { id: 're-2', name: 'Supino inclinado com halteres', muscle_group: 'peito', sets: 3, reps: 12, weight_kg: 22, rest_s: 60 },
      { id: 're-3', name: 'Desenvolvimento com halteres', muscle_group: 'ombros', sets: 4, reps: 10, weight_kg: 16, rest_s: 60 },
      { id: 're-4', name: 'Elevação lateral com halteres', muscle_group: 'ombros', sets: 4, reps: 15, weight_kg: 10, rest_s: 45 },
      { id: 're-5', name: 'Tríceps pulley com corda', muscle_group: 'triceps', sets: 3, reps: 12, weight_kg: 25, rest_s: 45 },
    ],
  },
  {
    id: 'routine-2',
    name: 'Treino B - Costas e Bíceps',
    notes: 'Ênfase em puxadas e largura dorsal',
    created_at: new Date().toISOString(),
    exercises: [
      { id: 're-6', name: 'Puxada frontal na polia', muscle_group: 'costas', sets: 4, reps: 10, weight_kg: 55, rest_s: 90 },
      { id: 're-7', name: 'Remada curvada com barra', muscle_group: 'costas', sets: 4, reps: 10, weight_kg: 50, rest_s: 90 },
      { id: 're-8', name: 'Remada baixa na polia', muscle_group: 'costas', sets: 3, reps: 12, weight_kg: 45, rest_s: 60 },
      { id: 're-9', name: 'Rosca direta com barra', muscle_group: 'biceps', sets: 3, reps: 10, weight_kg: 24, rest_s: 60 },
      { id: 're-10', name: 'Rosca martelo', muscle_group: 'biceps', sets: 3, reps: 12, weight_kg: 14, rest_s: 45 },
    ],
  },
  {
    id: 'routine-3',
    name: 'Treino C - Pernas Completo',
    notes: 'Agachamento pesado e flexão de joelhos',
    created_at: new Date().toISOString(),
    exercises: [
      { id: 're-11', name: 'Agachamento livre', muscle_group: 'pernas', sets: 4, reps: 8, weight_kg: 80, rest_s: 120 },
      { id: 're-12', name: 'Leg press 45°', muscle_group: 'pernas', sets: 4, reps: 12, weight_kg: 180, rest_s: 90 },
      { id: 're-13', name: 'Cadeira extensora', muscle_group: 'pernas', sets: 3, reps: 15, weight_kg: 45, rest_s: 60 },
      { id: 're-14', name: 'Mesa flexora', muscle_group: 'pernas', sets: 4, reps: 12, weight_kg: 40, rest_s: 60 },
      { id: 're-15', name: 'Panturrilha em pé', muscle_group: 'panturrilha', sets: 4, reps: 15, weight_kg: 60, rest_s: 45 },
    ],
  },
];

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`nutrify_${key}`);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`nutrify_${key}`, JSON.stringify(val));
  } catch {
    // quota exceeded or private mode
  }
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDate, setActiveDate] = useState<string>(getTodayString());
  const [profile, setProfile] = useState<UserProfile>(() => getStored('profile', DEFAULT_PROFILE));
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(() => {
    const stored = getStored<DiaryEntry[]>('diary', []);
    if (stored.length === 0) {
      // Seed initial sample meal for today
      const today = getTodayString();
      const p1 = 150; // 150g frango
      const p2 = 200; // 200g arroz
      const p3 = 100; // 100g feijao
      return [
        {
          id: 'init-1',
          date: today,
          meal: 'almoco',
          foodId: 'taco-3',
          name: 'Arroz, tipo 1, cozido',
          brand: 'TACO - UNICAMP',
          grams: p2,
          calories100: 128,
          protein100: 2.5,
          carbs100: 28.1,
          fat100: 0.2,
          calories: Math.round(128 * (p2 / 100)),
          protein: Math.round(2.5 * (p2 / 100) * 10) / 10,
          carbs: Math.round(28.1 * (p2 / 100) * 10) / 10,
          fat: Math.round(0.2 * (p2 / 100) * 10) / 10,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'init-2',
          date: today,
          meal: 'almoco',
          foodId: 'taco-180',
          name: 'Frango, peito, sem pele, grelhado',
          brand: 'TACO - UNICAMP',
          grams: p1,
          calories100: 159,
          protein100: 32.0,
          carbs100: 0.0,
          fat100: 2.5,
          calories: Math.round(159 * (p1 / 100)),
          protein: Math.round(32.0 * (p1 / 100) * 10) / 10,
          carbs: 0,
          fat: Math.round(2.5 * (p1 / 100) * 10) / 10,
          createdAt: new Date().toISOString(),
        },
      ];
    }
    return stored;
  });

  const [waterLogs, setWaterLogs] = useState<Record<string, number>>(() =>
    getStored('water_logs', { [getTodayString()]: 1250 })
  );

  const [weights, setWeights] = useState<WeightRecord[]>(() =>
    getStored('weights', [
      { id: 'w-1', date: '2026-10-01', weight_kg: 78.2, created_at: '2026-10-01T08:00:00Z' },
      { id: 'w-2', date: '2026-10-10', weight_kg: 77.4, created_at: '2026-10-10T08:00:00Z' },
      { id: 'w-3', date: '2026-10-18', weight_kg: 76.9, created_at: '2026-10-18T08:00:00Z' },
      { id: 'w-4', date: getTodayString(), weight_kg: 76.5, created_at: new Date().toISOString() },
    ])
  );

  const [routines, setRoutines] = useState<WorkoutRoutine[]>(() =>
    getStored('routines', INITIAL_ROUTINES)
  );

  const [sessions, setSessions] = useState<WorkoutSession[]>(() =>
    getStored('workout_sessions', [
      {
        id: 'sess-1',
        routine_name: 'Treino A - Peito, Ombros e Tríceps',
        date: getTodayString(),
        duration_min: 50,
        volume_kg: 6840,
        total_sets: 18,
        calories_burned: 319,
        records: ['Supino reto com barra: 60kg x 10'],
        created_at: new Date().toISOString(),
        exercises: [],
      },
    ])
  );

  const [customFoods, setCustomFoods] = useState<FoodItem[]>(() => getStored('custom_foods', []));
  const [favoriteFoodIds, setFavoriteFoodIds] = useState<string[]>(() =>
    getStored('favorite_ids', ['taco-3', 'taco-180', 'ref-0'])
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    getStored('chat_messages', [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content:
          'Olá! Sou a Nutri, sua nutricionista inteligente no Nutrify. Posso te ajudar a planejar refeições com a tabela TACO brasileira, tirar dúvidas de macros ou sugerir lanches saudáveis para bater sua meta de hoje. Como posso te ajudar?',
        timestamp: new Date().toISOString(),
      },
    ])
  );
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Sync to localStorage
  useEffect(() => setStored('profile', profile), [profile]);
  useEffect(() => setStored('diary', diaryEntries), [diaryEntries]);
  useEffect(() => setStored('water_logs', waterLogs), [waterLogs]);
  useEffect(() => setStored('weights', weights), [weights]);
  useEffect(() => setStored('routines', routines), [routines]);
  useEffect(() => setStored('workout_sessions', sessions), [sessions]);
  useEffect(() => setStored('custom_foods', customFoods), [customFoods]);
  useEffect(() => setStored('favorite_ids', favoriteFoodIds), [favoriteFoodIds]);
  useEffect(() => setStored('chat_messages', chatMessages), [chatMessages]);

  const goals = useMemo(() => computeGoals(profile), [profile]);

  const waterAmount = waterLogs[activeDate] || 0;

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      if (updates.weight_kg && updates.weight_kg !== prev.weight_kg) {
        addWeight(updates.weight_kg, activeDate);
      }
      return next;
    });
  };

  const addDiaryEntry = (meal: MealKey, food: FoodItem, grams: number) => {
    const factor = grams / 100;
    const newEntry: DiaryEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      date: activeDate,
      meal,
      foodId: food.id,
      name: food.name,
      brand: food.brand,
      grams,
      calories100: food.calories,
      protein100: food.protein,
      carbs100: food.carbs,
      fat100: food.fat,
      fiber100: food.fiber,
      sodium100: food.sodium,
      calories: Math.round(food.calories * factor),
      protein: Math.round(food.protein * factor * 10) / 10,
      carbs: Math.round(food.carbs * factor * 10) / 10,
      fat: Math.round(food.fat * factor * 10) / 10,
      createdAt: new Date().toISOString(),
    };
    setDiaryEntries((prev) => [newEntry, ...prev]);
  };

  const updateDiaryEntryGrams = (entryId: string, grams: number) => {
    setDiaryEntries((prev) =>
      prev.map((e) => {
        if (e.id !== entryId) return e;
        const factor = grams / 100;
        return {
          ...e,
          grams,
          calories: Math.round(e.calories100 * factor),
          protein: Math.round(e.protein100 * factor * 10) / 10,
          carbs: Math.round(e.carbs100 * factor * 10) / 10,
          fat: Math.round(e.fat100 * factor * 10) / 10,
        };
      })
    );
  };

  const deleteDiaryEntry = (entryId: string) => {
    setDiaryEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  const copyDiaryDay = (fromDate: string, toDate: string, meal?: MealKey): number => {
    const toCopy = diaryEntries.filter(
      (e) => e.date === fromDate && (!meal || e.meal === meal)
    );
    if (toCopy.length === 0) return 0;

    const newItems: DiaryEntry[] = toCopy.map((item) => ({
      ...item,
      id: `copy-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      date: toDate,
      createdAt: new Date().toISOString(),
    }));

    setDiaryEntries((prev) => [...newItems, ...prev]);
    return newItems.length;
  };

  const addWater = (amountMl: number, date = activeDate) => {
    setWaterLogs((prev) => {
      const cur = prev[date] || 0;
      const next = Math.max(0, cur + amountMl);
      return { ...prev, [date]: next };
    });
  };

  const resetWater = (date = activeDate) => {
    setWaterLogs((prev) => ({ ...prev, [date]: 0 }));
  };

  const addWeight = (weightKg: number, date = activeDate) => {
    const record: WeightRecord = {
      id: `weight-${Date.now()}`,
      date,
      weight_kg: Number(weightKg),
      created_at: new Date().toISOString(),
    };
    setWeights((prev) => {
      const filtered = prev.filter((r) => r.date !== date);
      return [...filtered, record].sort((a, b) => a.date.localeCompare(b.date));
    });
    setProfile((prev) => ({ ...prev, weight_kg: Number(weightKg) }));
  };

  const createRoutine = (routine: Omit<WorkoutRoutine, 'id' | 'created_at'>): WorkoutRoutine => {
    const newRoutine: WorkoutRoutine = {
      ...routine,
      id: `routine-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setRoutines((prev) => [newRoutine, ...prev]);
    return newRoutine;
  };

  const updateRoutine = (routine: WorkoutRoutine) => {
    setRoutines((prev) => prev.map((r) => (r.id === routine.id ? routine : r)));
  };

  const deleteRoutine = (id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  const saveWorkoutSession = (session: Omit<WorkoutSession, 'id' | 'created_at'>): WorkoutSession => {
    const newSession: WorkoutSession = {
      ...session,
      id: `session-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    return newSession;
  };

  const deleteWorkoutSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const addCustomFood = (food: Omit<FoodItem, 'id' | 'source'>): FoodItem => {
    const newFood: FoodItem = {
      ...food,
      id: `custom-${Date.now()}`,
      source: 'custom',
    };
    setCustomFoods((prev) => [newFood, ...prev]);
    return newFood;
  };

  const toggleFavoriteFood = (foodId: string) => {
    setFavoriteFoodIds((prev) =>
      prev.includes(foodId) ? prev.filter((id) => id !== foodId) : [...prev, foodId]
    );
  };

  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      // Calculate today's consumed macros
      const todaysEntries = diaryEntries.filter((e) => e.date === activeDate);
      const consumedCals = Math.round(todaysEntries.reduce((s, e) => s + e.calories, 0));
      const consumedP = Math.round(todaysEntries.reduce((s, e) => s + e.protein, 0));
      const consumedC = Math.round(todaysEntries.reduce((s, e) => s + e.carbs, 0));
      const consumedF = Math.round(todaysEntries.reduce((s, e) => s + e.fat, 0));
      const remainingCals = Math.max(0, goals.calories - consumedCals);
      const remainingP = Math.max(0, goals.protein - consumedP);

      // Local smart response simulating Nutri assistant tailored to user context
      await new Promise((r) => setTimeout(r, 800));

      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('proteína') || lower.includes('proteina')) {
        reply = `Para bater suas proteínas (${consumedP}g de ${goals.protein}g atingidos hoje, restam ${remainingP}g), recomendo excelentes opções brasileiras da tabela TACO:\n• Peito de frango grelhado (32g P / 100g)\n• Tilápia grelhada (26g P / 100g)\n• Ovos cozidos (13g P a cada 100g)\n• Queijo minas frescal ou muçarela (22g P / 100g)\n• Whey protein concentrado (80g P / 100g).`;
      } else if (lower.includes('jantar') || lower.includes('almoço') || lower.includes('almoco')) {
        reply = `Você ainda tem aproximadamente ${remainingCals} kcal disponíveis hoje. Uma ótima pedida brasileira para seu objetivo (${profile.goal}) seria:\n• 150g de peito de frango grelhado ou filé de tilápia\n• 120g de arroz integral ou batata cozida\n• 80g de feijão carioca com bastante salada verde (alface, tomate e rúcula à vontade com 1 colher de chá de azeite extra virgem).`;
      } else if (lower.includes('lanche')) {
        reply = `Para um lanche prático e saciante:\n• 1 maçã ou banana fatiada com 20g de pasta de amendoim integral\n• Ou 150g de iogurte grego natural com 30g de aveia em flocos e canela em pó.\nAmbos fornecem energia estável sem estourar as calorias!`;
      } else if (lower.includes('água') || lower.includes('agua')) {
        const curWater = waterLogs[activeDate] || 0;
        reply = `Sua meta diária de água é de ${goals.water_goal_ml} ml (baseado em 35ml por kg corporal). Você já registrou ${curWater} ml hoje. Manter-se hidratado otimiza a queima de gordura e o rendimento muscular!`;
      } else {
        reply = `Com base no seu perfil (${profile.name}, objetivo: ${profile.goal}), seu gasto calórico total diário (TDEE) é de cerca de ${goals.tdee} kcal e sua meta ajustada é de ${goals.calories} kcal.\nHoje você já consumiu ${consumedCals} kcal (${consumedP}g P, ${consumedC}g C, ${consumedF}g G).\nRestam ${remainingCals} kcal para o restante do dia. Como posso te orientar na próxima refeição?`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch {
      const errReply: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Desculpe, ocorreu uma instabilidade momentânea. Por favor, tente novamente.',
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, errReply]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  const exportAllData = (): string => {
    const payload = {
      exported_at: new Date().toISOString(),
      profile,
      goals,
      diaryEntries,
      waterLogs,
      weights,
      routines,
      sessions,
      customFoods,
      favoriteFoodIds,
      chatMessages,
    };
    return JSON.stringify(payload, null, 2);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        goals,
        activeDate,
        setActiveDate,
        diaryEntries,
        waterAmount,
        weights,
        routines,
        sessions,
        customFoods,
        favoriteFoodIds,
        chatMessages,
        isChatLoading,
        updateProfile,
        addDiaryEntry,
        updateDiaryEntryGrams,
        deleteDiaryEntry,
        copyDiaryDay,
        addWater,
        resetWater,
        addWeight,
        createRoutine,
        updateRoutine,
        deleteRoutine,
        saveWorkoutSession,
        deleteWorkoutSession,
        addCustomFood,
        toggleFavoriteFood,
        sendChatMessage,
        clearChat,
        exportAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
