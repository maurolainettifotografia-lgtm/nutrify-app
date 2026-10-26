import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Flame,
  Dumbbell,
  Trash2,
  Edit2,
  Copy,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MealKey, DiaryEntry } from '../../types';
import {
  MEAL_NAMES_PT,
  MEAL_ICONS,
  formatDateBR,
  getTodayString,
} from '../../utils/nutritionCalculations';
import { FoodSearchModal } from '../food/FoodSearchModal';

const ALL_MEALS: MealKey[] = [
  'cafe_manha',
  'lanche_manha',
  'almoco',
  'lanche_tarde',
  'jantar',
  'ceia',
];

export const DiaryScreen: React.FC<{ onNavigateToAi?: () => void }> = ({ onNavigateToAi }) => {
  const {
    activeDate,
    setActiveDate,
    diaryEntries,
    goals,
    sessions,
    updateDiaryEntryGrams,
    deleteDiaryEntry,
    copyDiaryDay,
  } = useApp();

  const [activeModalMeal, setActiveModalMeal] = useState<MealKey | null>(null);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [editGrams, setEditGrams] = useState<number>(100);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Filter entries for active date
  const todaysEntries = useMemo(() => {
    return diaryEntries.filter((e) => e.date === activeDate);
  }, [diaryEntries, activeDate]);

  // Calories burned from workouts today
  const todaysWorkouts = useMemo(() => {
    return sessions.filter((s) => s.date === activeDate);
  }, [sessions, activeDate]);

  const workoutCaloriesBurned = useMemo(() => {
    return todaysWorkouts.reduce((sum, s) => sum + (s.calories_burned || 0), 0);
  }, [todaysWorkouts]);

  // Target calories adjusted for athlete mode
  const targetCalories = goals.athlete_mode
    ? goals.calories + workoutCaloriesBurned
    : goals.calories;

  // Consumed totals
  const totalCalories = Math.round(todaysEntries.reduce((s, e) => s + e.calories, 0));
  const totalProtein = Math.round(todaysEntries.reduce((s, e) => s + e.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(todaysEntries.reduce((s, e) => s + e.carbs, 0) * 10) / 10;
  const totalFat = Math.round(todaysEntries.reduce((s, e) => s + e.fat, 0) * 10) / 10;

  const remainingCalories = targetCalories - totalCalories;
  const caloriePercent = Math.min(100, Math.round((totalCalories / (targetCalories || 1)) * 100));

  // Date navigation helpers
  const handlePrevDay = () => {
    const cur = new Date(activeDate + 'T12:00:00');
    cur.setDate(cur.getDate() - 1);
    setActiveDate(cur.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const cur = new Date(activeDate + 'T12:00:00');
    cur.setDate(cur.getDate() + 1);
    setActiveDate(cur.toISOString().split('T')[0]);
  };

  const handleCopyYesterday = () => {
    const cur = new Date(activeDate + 'T12:00:00');
    cur.setDate(cur.getDate() - 1);
    const yestStr = cur.toISOString().split('T')[0];
    const copiedCount = copyDiaryDay(yestStr, activeDate);
    if (copiedCount > 0) {
      setCopyFeedback(`${copiedCount} alimentos copiados do dia anterior!`);
    } else {
      setCopyFeedback('Nenhum alimento encontrado no dia anterior.');
    }
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const handleSaveEditGrams = () => {
    if (!editingEntry) return;
    updateDiaryEntryGrams(editingEntry.id, Number(editGrams) || 100);
    setEditingEntry(null);
  };

  const isToday = activeDate === getTodayString();

  return (
    <div className="space-y-4 pb-24">
      {/* Date Switcher Bar */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between">
        <button
          onClick={handlePrevDay}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
          aria-label="Dia anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-extrabold text-slate-800 text-base">
              {isToday ? 'Hoje' : formatDateBR(activeDate)}
            </span>
            {isToday && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {formatDateBR(activeDate)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleNextDay}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
          aria-label="Próximo dia"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Copy feedback toast */}
      {copyFeedback && (
        <div className="p-3 bg-emerald-700 text-white rounded-xl text-xs font-semibold text-center shadow-lg flex items-center justify-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          {copyFeedback}
        </div>
      )}

      {/* Calorie & Macro Target Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-medium text-slate-400">Balanço Calórico</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-white tracking-tight">{totalCalories}</span>
              <span className="text-sm text-slate-400">/ {targetCalories} kcal</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-slate-400">Restante</span>
            <div
              className={`text-xl font-bold ${
                remainingCalories >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {remainingCalories >= 0 ? `${remainingCalories} kcal` : `+${Math.abs(remainingCalories)} kcal`}
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-700/60 rounded-full h-3 overflow-hidden p-0.5 mb-4">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              remainingCalories >= 0
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-rose-500'
            }`}
            style={{ width: `${caloriePercent}%` }}
          />
        </div>

        {/* Athlete mode workout bonus info */}
        {goals.athlete_mode && workoutCaloriesBurned > 0 && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2 text-xs text-amber-300">
            <Dumbbell className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Modo Atleta: <strong>+{workoutCaloriesBurned} kcal</strong> de treinos somadas à meta hoje.
            </span>
          </div>
        )}

        {/* Safety floor notice if applied */}
        {goals.floor_applied && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-blue-900/40 border border-blue-700/50 flex items-center gap-2 text-xs text-blue-200">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Piso de segurança ativo: meta mantida no mínimo saudável de {goals.calorie_floor} kcal.</span>
          </div>
        )}

        {/* Macros Breakdown Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Protein */}
          <div className="bg-slate-800/80 rounded-2xl p-2.5 border border-slate-700/70">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-blue-400 font-bold">Proteína</span>
              <span className="text-[11px] text-slate-400">{goals.protein}g</span>
            </div>
            <div className="text-sm font-black text-white">{totalProtein}g</div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (totalProtein / (goals.protein || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-slate-800/80 rounded-2xl p-2.5 border border-slate-700/70">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-amber-400 font-bold">Carboidrato</span>
              <span className="text-[11px] text-slate-400">{goals.carbs}g</span>
            </div>
            <div className="text-sm font-black text-white">{totalCarbs}g</div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (totalCarbs / (goals.carbs || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="bg-slate-800/80 rounded-2xl p-2.5 border border-slate-700/70">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-red-400 font-bold">Gordura</span>
              <span className="text-[11px] text-slate-400">{goals.fat}g</span>
            </div>
            <div className="text-sm font-black text-white">{totalFat}g</div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div
                className="bg-red-500 h-full rounded-full"
                style={{ width: `${Math.min(100, (totalFat / (goals.fat || 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCopyYesterday}
          className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-sm transition"
        >
          <Copy className="w-3.5 h-3.5 text-slate-500" />
          Copiar do Dia Anterior
        </button>
        {onNavigateToAi && (
          <button
            onClick={onNavigateToAi}
            className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Sugestão da Nutri IA
          </button>
        )}
      </div>

      {/* Meals List */}
      <div className="space-y-3">
        {ALL_MEALS.map((mealKey) => {
          const mealEntries = todaysEntries.filter((e) => e.meal === mealKey);
          const mealCals = Math.round(mealEntries.reduce((s, e) => s + e.calories, 0));
          const mealP = Math.round(mealEntries.reduce((s, e) => s + e.protein, 0) * 10) / 10;
          const mealC = Math.round(mealEntries.reduce((s, e) => s + e.carbs, 0) * 10) / 10;
          const mealF = Math.round(mealEntries.reduce((s, e) => s + e.fat, 0) * 10) / 10;

          return (
            <div
              key={mealKey}
              className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3 transition"
            >
              {/* Meal Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{MEAL_ICONS[mealKey]}</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{MEAL_NAMES_PT[mealKey]}</h3>
                    <p className="text-[11px] text-slate-500">
                      {mealEntries.length === 0
                        ? 'Nenhum alimento registrado'
                        : `P: ${mealP}g • C: ${mealC}g • G: ${mealF}g`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-800">{mealCals} kcal</span>
                  <button
                    onClick={() => setActiveModalMeal(mealKey)}
                    className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition shadow-sm"
                    aria-label={`Adicionar alimento a ${MEAL_NAMES_PT[mealKey]}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items in this meal */}
              {mealEntries.length > 0 && (
                <div className="divide-y divide-slate-100 border-t border-slate-100 pt-1">
                  {mealEntries.map((item) => (
                    <div
                      key={item.id}
                      className="py-2.5 flex items-center justify-between text-xs group"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-semibold text-slate-800 block truncate">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {item.grams}g • P:{item.protein}g • C:{item.carbs}g • G:{item.fat}g
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">{item.calories} kcal</span>
                        <button
                          onClick={() => {
                            setEditingEntry(item);
                            setEditGrams(item.grams);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 transition"
                          title="Alterar porção"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteDiaryEntry(item.id)}
                          className="p-1 text-slate-300 hover:text-rose-500 transition"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Food Modal */}
      {activeModalMeal && (
        <FoodSearchModal
          meal={activeModalMeal}
          onClose={() => setActiveModalMeal(null)}
        />
      )}

      {/* Edit portion modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Alterar Porção</h3>
              <p className="text-xs text-slate-500 truncate mt-0.5">{editingEntry.name}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Quantidade em gramas:</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="4000"
                  value={editGrams}
                  onChange={(e) => setEditGrams(Math.max(1, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-base font-bold bg-slate-100 rounded-xl outline-none border border-transparent focus:border-emerald-500 focus:bg-white"
                  autoFocus
                />
                <span className="absolute right-3 top-2 text-xs font-semibold text-slate-400">g</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingEntry(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEditGrams}
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
