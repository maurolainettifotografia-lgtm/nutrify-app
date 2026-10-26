import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Calendar, Award, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateBR } from '../../utils/nutritionCalculations';

export const ReportsScreen: React.FC = () => {
  const { diaryEntries, goals, weights, profile } = useApp();
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const daysCount = period === 'week' ? 7 : 30;

  // Generate date list
  const dateList = useMemo(() => {
    const list: string[] = [];
    const now = new Date();
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      list.push(d.toISOString().split('T')[0]);
    }
    return list;
  }, [daysCount]);

  // Aggregate diary entries per day
  const dailyData = useMemo(() => {
    return dateList.map((dateStr) => {
      const dayEntries = diaryEntries.filter((e) => e.date === dateStr);
      const calories = Math.round(dayEntries.reduce((s, e) => s + e.calories, 0));
      const protein = Math.round(dayEntries.reduce((s, e) => s + e.protein, 0));
      const carbs = Math.round(dayEntries.reduce((s, e) => s + e.carbs, 0));
      const fat = Math.round(dayEntries.reduce((s, e) => s + e.fat, 0));
      return { date: dateStr, calories, protein, carbs, fat, hasEntries: dayEntries.length > 0 };
    });
  }, [dateList, diaryEntries]);

  const loggedDays = dailyData.filter((d) => d.hasEntries);
  const n = Math.max(1, loggedDays.length);

  const avgCalories = Math.round(loggedDays.reduce((s, d) => s + d.calories, 0) / n);
  const avgProtein = Math.round(loggedDays.reduce((s, d) => s + d.protein, 0) / n);
  const avgCarbs = Math.round(loggedDays.reduce((s, d) => s + d.carbs, 0) / n);
  const avgFat = Math.round(loggedDays.reduce((s, d) => s + d.fat, 0) / n);

  // Macro ratio
  const totalMacroKcal = avgProtein * 4 + avgCarbs * 4 + avgFat * 9 || 1;
  const pPct = Math.round(((avgProtein * 4) / totalMacroKcal) * 100);
  const cPct = Math.round(((avgCarbs * 4) / totalMacroKcal) * 100);
  const fPct = Math.max(0, 100 - pPct - cPct);

  const maxCalorieValue = Math.max(goals.calories * 1.2, ...dailyData.map((d) => d.calories), 2000);

  return (
    <div className="space-y-4 pb-24">
      {/* Header and Period Switcher */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Relatórios & Evolução</h2>
          <p className="text-xs text-slate-500">Acompanhamento nutricional</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold text-slate-600">
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1 rounded-lg transition ${
              period === 'week' ? 'bg-white text-emerald-700 shadow-sm' : ''
            }`}
          >
            7 Dias
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-1 rounded-lg transition ${
              period === 'month' ? 'bg-white text-emerald-700 shadow-sm' : ''
            }`}
          >
            30 Dias
          </button>
        </div>
      </div>

      {/* Averages Summary Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 shadow-md">
          <span className="text-[11px] text-slate-400 font-medium">Média Calórica Diária</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-white">{avgCalories}</span>
            <span className="text-xs text-slate-400">/ {goals.calories} kcal</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
            {loggedDays.length} de {daysCount} dias registrados
          </span>
        </div>

        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <span className="text-[11px] text-slate-500 font-medium">Médias de Macros</span>
          <div className="space-y-1 mt-1 text-xs">
            <div className="flex justify-between">
              <span className="text-blue-600 font-bold">Proteína:</span>
              <span className="font-extrabold text-slate-800">{avgProtein}g / {goals.protein}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-600 font-bold">Carboidrato:</span>
              <span className="font-extrabold text-slate-800">{avgCarbs}g / {goals.carbs}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600 font-bold">Gordura:</span>
              <span className="font-extrabold text-slate-800">{avgFat}g / {goals.fat}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Calorie Consumption Bar Chart */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            Consumo Calórico Diário (kcal)
          </h3>
          <span className="text-[10px] text-slate-400">Meta: {goals.calories} kcal</span>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-44 flex items-end gap-1.5 pt-6 pb-2 border-b border-slate-100 overflow-x-auto no-scrollbar">
          {dailyData.map((d) => {
            const heightPercent = Math.min(100, Math.max(6, (d.calories / maxCalorieValue) * 100));
            const isOver = d.calories > goals.calories;
            const isZero = d.calories === 0;

            return (
              <div
                key={d.date}
                className="flex-1 flex flex-col items-center min-w-[20px] group relative h-full justify-end"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-7 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap z-20 pointer-events-none transition">
                  {d.calories} kcal
                </div>

                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    isZero
                      ? 'bg-slate-100'
                      : isOver
                      ? 'bg-rose-500'
                      : 'bg-emerald-500 group-hover:bg-emerald-600'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />

                <span className="text-[9px] text-slate-400 mt-1 font-mono">
                  {d.date.split('-')[2]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Na meta
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ml-2" /> Acima da meta
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 ml-2" /> Sem registro
          </div>
        </div>
      </div>

      {/* Macro Distribution Ratio Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-800">Distribuição Média de Calorias</h3>

        {/* Stacked Percentage Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
          <div className="bg-blue-500 h-full" style={{ width: `${pPct}%` }} title={`Proteína: ${pPct}%`} />
          <div className="bg-amber-500 h-full" style={{ width: `${cPct}%` }} title={`Carboidratos: ${cPct}%`} />
          <div className="bg-red-500 h-full" style={{ width: `${fPct}%` }} title={`Gordura: ${fPct}%`} />
        </div>

        <div className="grid grid-cols-3 text-center text-xs pt-1">
          <div>
            <span className="text-blue-600 font-bold block">{pPct}%</span>
            <span className="text-[10px] text-slate-400">Proteína</span>
          </div>
          <div>
            <span className="text-amber-600 font-bold block">{cPct}%</span>
            <span className="text-[10px] text-slate-400">Carboidrato</span>
          </div>
          <div>
            <span className="text-red-600 font-bold block">{fPct}%</span>
            <span className="text-[10px] text-slate-400">Gordura</span>
          </div>
        </div>
      </div>

      {/* Weight History Summary */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Progresso Corporal
          </h3>
          <span className="text-[11px] font-bold text-emerald-700">
            Objetivo: {profile.goal}
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Peso inicial: <strong>{weights[0]?.weight_kg || profile.weight_kg} kg</strong> • Atual:{' '}
          <strong>{weights[weights.length - 1]?.weight_kg || profile.weight_kg} kg</strong> • Meta:{' '}
          <strong>{profile.goal_weight_kg || 70} kg</strong>
        </p>
      </div>
    </div>
  );
};
