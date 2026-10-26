import React, { useState } from 'react';
import {
  User,
  Shield,
  Download,
  Dumbbell,
  Save,
  Check,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityLevel, NutritionGoal, Sex } from '../../types';
import { computeAge } from '../../utils/nutritionCalculations';

export const ProfileScreen: React.FC = () => {
  const { profile, goals, updateProfile, exportAllData } = useApp();

  const [name, setName] = useState(profile.name || '');
  const [birthDate, setBirthDate] = useState(profile.birth_date || '1998-06-15');
  const [sex, setSex] = useState<Sex>(profile.sex || 'male');
  const [heightCm, setHeightCm] = useState(String(profile.height_cm || 176));
  const [weightKg, setWeightKg] = useState(String(profile.weight_kg || 76.5));
  const [goalWeightKg, setGoalWeightKg] = useState(String(profile.goal_weight_kg || 72));
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activity_level || 'moderate');
  const [goal, setGoal] = useState<NutritionGoal>(profile.goal || 'emagrecimento');
  const [athleteMode, setAthleteMode] = useState<boolean>(Boolean(profile.athlete_mode));
  const [waterGoalMl, setWaterGoalMl] = useState(String(profile.water_goal_ml || 2700));

  const [useCustomGoals, setUseCustomGoals] = useState<boolean>(Boolean(profile.custom_goals?.calories));
  const [customCals, setCustomCals] = useState(String(profile.custom_goals?.calories || ''));
  const [customP, setCustomP] = useState(String(profile.custom_goals?.protein || ''));
  const [customC, setCustomC] = useState(String(profile.custom_goals?.carbs || ''));
  const [customF, setCustomF] = useState(String(profile.custom_goals?.fat || ''));

  const [savedFeedback, setSavedFeedback] = useState(false);

  const calculatedAge = computeAge(birthDate);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const customObj = useCustomGoals && Number(customCals) > 0 ? {
      calories: Number(customCals),
      protein: Number(customP) || 0,
      carbs: Number(customC) || 0,
      fat: Number(customF) || 0,
    } : undefined;

    updateProfile({
      name: name.trim(),
      birth_date: birthDate,
      sex,
      height_cm: Number(heightCm) || 170,
      weight_kg: Number(weightKg) || 70,
      goal_weight_kg: Number(goalWeightKg) || 70,
      activity_level: activityLevel,
      goal,
      athlete_mode: athleteMode,
      water_goal_ml: Number(waterGoalMl) || 2500,
      custom_goals: customObj,
    });

    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  const handleExportData = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nutrify_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header Profile Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 text-xl font-black">
            {name ? name.charAt(0).toUpperCase() : 'N'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{name || 'Usuário Nutrify'}</h2>
            <p className="text-xs text-slate-400">
              {calculatedAge} anos • {heightCm} cm • {weightKg} kg
            </p>
            <div className="flex gap-1.5 mt-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 capitalize">
                {goal.replace('_', ' ')}
              </span>
              {athleteMode && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Modo Atleta
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Calculated Goals Highlights */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 text-xs">
          <div className="bg-slate-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 font-medium block">Taxa Metabólica Basal (BMR)</span>
            <span className="font-extrabold text-white text-sm">{goals.bmr} kcal</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 font-medium block">Gasto Total Diário (TDEE)</span>
            <span className="font-extrabold text-white text-sm">{goals.tdee} kcal</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600" />
          Dados Pessoais & Antropometria
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Nome Completo</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Data de Nascimento</label>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Sexo Biológico</label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as Sex)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none"
            >
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Altura (cm)</label>
            <input
              type="number"
              min="100"
              max="240"
              required
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 rounded-xl border border-slate-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Peso Atual (kg)</label>
            <input
              type="number"
              step="0.1"
              min="30"
              max="350"
              required
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 rounded-xl border border-slate-200 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Peso Meta (kg)</label>
            <input
              type="number"
              step="0.1"
              min="30"
              max="350"
              required
              value={goalWeightKg}
              onChange={(e) => setGoalWeightKg(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-50 rounded-xl border border-slate-200 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Nível de Atividade</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
            className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none"
          >
            <option value="sedentary">Sedentário (pouco ou nenhum exercício)</option>
            <option value="light">Leve (exercício 1-3 dias por semana)</option>
            <option value="moderate">Moderado (exercício 3-5 dias por semana)</option>
            <option value="active">Ativo (exercício 6-7 dias por semana)</option>
            <option value="very_active">Muito Ativo (treinos pesados diários)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Objetivo Nutricional</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as NutritionGoal)}
            className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 rounded-xl border border-slate-200 outline-none"
          >
            <option value="emagrecimento">Emagrecimento (-20% calorias, 2.0g/kg proteína)</option>
            <option value="ganho_massa">Ganho de Massa Muscular (+12% calorias, 2.0g/kg proteína)</option>
            <option value="manutencao">Manutenção de Peso (1.6g/kg proteína)</option>
            <option value="recomposicao">Recomposição Corporal (-8% calorias, 2.2g/kg proteína)</option>
            <option value="performance">Performance Atlética (+8% calorias, 1.8g/kg proteína)</option>
          </select>
        </div>

        {/* Athlete Mode Toggle */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Modo Atleta</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Soma o gasto calórico real de treinos concluídos à meta do dia.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAthleteMode(!athleteMode)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              athleteMode ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                athleteMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Water Goal */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Meta Diária de Água (ml)
          </label>
          <input
            type="number"
            min="1000"
            max="8000"
            step="100"
            value={waterGoalMl}
            onChange={(e) => setWaterGoalMl(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold bg-slate-50 rounded-xl border border-slate-200 outline-none"
          />
        </div>

        {/* Custom Goals Toggle & Form */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                Metas Personalizadas
              </span>
              <p className="text-[11px] text-slate-500">Defina calorias e macros manualmente</p>
            </div>
            <button
              type="button"
              onClick={() => setUseCustomGoals(!useCustomGoals)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                useCustomGoals ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  useCustomGoals ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {useCustomGoals && (
            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500">Calorias (kcal)</label>
                  <input
                    type="number"
                    value={customCals}
                    onChange={(e) => setCustomCals(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-blue-600 font-bold">Proteína (g)</label>
                  <input
                    type="number"
                    value={customP}
                    onChange={(e) => setCustomP(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-amber-600 font-bold">Carboidratos (g)</label>
                  <input
                    type="number"
                    value={customC}
                    onChange={(e) => setCustomC(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-red-600 font-bold">Gordura (g)</label>
                  <input
                    type="number"
                    value={customF}
                    onChange={(e) => setCustomF(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-white rounded-lg border border-slate-200"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          Salvar Alterações
        </button>

        {savedFeedback && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold text-center border border-emerald-200 flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            Perfil e metas atualizados com sucesso!
          </div>
        )}
      </form>

      {/* PRIVACY & DATA EXPORT (LGPD) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" />
          Privacidade & Portabilidade (LGPD)
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          O Nutrify respeita sua privacidade. Em conformidade com o artigo 18 da LGPD, você pode
          exportar todos os seus dados e registros a qualquer momento.
        </p>

        <button
          type="button"
          onClick={handleExportData}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-slate-600" />
          Exportar Meus Dados em JSON
        </button>
      </div>
    </div>
  );
};
