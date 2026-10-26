import React, { useState } from 'react';
import { Droplet, Scale, Plus, Minus, RotateCcw, TrendingDown, Calendar, Check, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateBR } from '../../utils/nutritionCalculations';

export const WaterWeightScreen: React.FC = () => {
  const {
    activeDate,
    waterAmount,
    goals,
    weights,
    profile,
    addWater,
    resetWater,
    addWeight,
  } = useApp();

  const [customMl, setCustomMl] = useState<string>('200');
  const [newWeight, setNewWeight] = useState<string>('');
  const [weightFeedback, setWeightFeedback] = useState<boolean>(false);

  const waterPercent = Math.min(100, Math.round((waterAmount / (goals.water_goal_ml || 2500)) * 100));

  const sortedWeights = [...weights].sort((a, b) => b.date.localeCompare(a.date));
  const latestWeight = sortedWeights[0]?.weight_kg || profile.weight_kg;
  const initialWeight = sortedWeights[sortedWeights.length - 1]?.weight_kg || profile.weight_kg;
  const goalWeight = profile.goal_weight_kg || 70;
  const weightDiff = Math.round((latestWeight - initialWeight) * 10) / 10;
  const toGoalDiff = Math.round((latestWeight - goalWeight) * 10) / 10;

  const handleAddCustomWater = () => {
    const val = Number(customMl);
    if (val > 0) {
      addWater(val);
      setCustomMl('');
    }
  };

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeight.replace(',', '.'));
    if (val >= 20 && val <= 400) {
      addWeight(val, activeDate);
      setNewWeight('');
      setWeightFeedback(true);
      setTimeout(() => setWeightFeedback(false), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* SECTION 1: WATER TRACKER */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Droplet className="w-5 h-5 fill-cyan-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Hidratação Diária</h2>
              <p className="text-xs text-slate-500">Meta: {goals.water_goal_ml} ml (35ml/kg)</p>
            </div>
          </div>
          <button
            onClick={() => resetWater()}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition"
            title="Zerar água de hoje"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Water Fill Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-xs text-cyan-100 font-medium">Consumido hoje</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black">{waterAmount}</span>
                <span className="text-sm text-cyan-200">/ {goals.water_goal_ml} ml</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black">{waterPercent}%</span>
              <p className="text-[11px] text-cyan-100">
                {waterAmount >= goals.water_goal_ml ? 'Meta batida! 🎉' : `Faltam ${Math.max(0, goals.water_goal_ml - waterAmount)} ml`}
              </p>
            </div>
          </div>

          {/* Liquid progress wave bar */}
          <div className="w-full bg-white/20 rounded-full h-3.5 mt-4 p-0.5 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => addWater(150)}
            className="p-2.5 rounded-2xl bg-slate-50 hover:bg-cyan-50 hover:border-cyan-200 border border-slate-100 text-center transition group"
          >
            <span className="block text-xs font-bold text-slate-800 group-hover:text-cyan-700">+150 ml</span>
            <span className="text-[10px] text-slate-400">Copo peq.</span>
          </button>
          <button
            onClick={() => addWater(250)}
            className="p-2.5 rounded-2xl bg-slate-50 hover:bg-cyan-50 hover:border-cyan-200 border border-slate-100 text-center transition group"
          >
            <span className="block text-xs font-bold text-slate-800 group-hover:text-cyan-700">+250 ml</span>
            <span className="text-[10px] text-slate-400">Copo médio</span>
          </button>
          <button
            onClick={() => addWater(500)}
            className="p-2.5 rounded-2xl bg-slate-50 hover:bg-cyan-50 hover:border-cyan-200 border border-slate-100 text-center transition group"
          >
            <span className="block text-xs font-bold text-slate-800 group-hover:text-cyan-700">+500 ml</span>
            <span className="text-[10px] text-slate-400">Garrafinha</span>
          </button>
          <button
            onClick={() => addWater(-250)}
            className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-100 text-center transition"
          >
            <span className="block text-xs font-bold text-rose-700">-250 ml</span>
            <span className="text-[10px] text-rose-500">Desfazer</span>
          </button>
        </div>

        {/* Custom ml input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Outro valor..."
              value={customMl}
              onChange={(e) => setCustomMl(e.target.value)}
              className="w-full pl-3 pr-10 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-cyan-500"
            />
            <span className="absolute right-3 top-2 text-xs text-slate-400 font-medium">ml</span>
          </div>
          <button
            onClick={handleAddCustomWater}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* SECTION 2: WEIGHT TRACKER */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Evolução do Peso</h2>
              <p className="text-xs text-slate-500">Meta: {goalWeight} kg ({profile.goal})</p>
            </div>
          </div>
        </div>

        {/* Weight Stat Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Atual</span>
            <span className="text-lg font-black text-slate-800">{latestWeight} kg</span>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Variação Total</span>
            <span className={`text-lg font-black ${weightDiff <= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {weightDiff > 0 ? `+${weightDiff}` : weightDiff} kg
            </span>
          </div>
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 font-medium block">Para a Meta</span>
            <span className="text-lg font-black text-blue-600">
              {toGoalDiff > 0 ? `-${toGoalDiff}` : `${Math.abs(toGoalDiff)}`} kg
            </span>
          </div>
        </div>

        {/* Quick Log Form */}
        <form onSubmit={handleSaveWeight} className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
          <label className="block text-xs font-bold text-emerald-900">
            Registrar peso em {formatDateBR(activeDate)}:
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                step="0.1"
                min="20"
                max="400"
                required
                placeholder="Ex: 75.8"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-sm font-bold bg-white rounded-xl border border-emerald-200 outline-none focus:border-emerald-600"
              />
              <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">kg</span>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Salvar
            </button>
          </div>
          {weightFeedback && (
            <p className="text-[11px] text-emerald-700 font-semibold">Peso registrado com sucesso!</p>
          )}
        </form>

        {/* History List */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-600 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Histórico Recente
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {sortedWeights.slice(0, 10).map((w, idx) => {
              const prev = sortedWeights[idx + 1];
              const diff = prev ? Math.round((w.weight_kg - prev.weight_kg) * 10) / 10 : null;
              return (
                <div
                  key={w.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-600">{formatDateBR(w.date)}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800">{w.weight_kg} kg</span>
                    {diff !== null && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          diff <= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {diff > 0 ? `+${diff}` : diff} kg
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
