import React, { useState, useEffect, useMemo } from 'react';
import {
  Dumbbell,
  Play,
  Plus,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  ChevronRight,
  Trash2,
  Search,
  Timer,
  Check,
  X,
  Heart,
  Activity,
  Info,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WorkoutRoutine, RoutineExercise, MuscleGroup, SessionExercise } from '../../types';
import {
  EXERCISES_CATALOG,
  MUSCLE_GROUPS_PT,
  estimateCaloriesBurned,
} from '../../data/exercises';
import { formatDateBR } from '../../utils/nutritionCalculations';
import { MuscleHeatmap } from './MuscleHeatmap';
import { ExerciseIllustration } from './ExerciseIllustration';

export const WorkoutsScreen: React.FC = () => {
  const {
    routines,
    sessions,
    createRoutine,
    deleteRoutine,
    saveWorkoutSession,
    deleteWorkoutSession,
    profile,
    activeDate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'routines' | 'active' | 'heatmap' | 'exercises' | 'history'>('routines');

  // Active workout session state
  const [activeSessionRoutine, setActiveSessionRoutine] = useState<WorkoutRoutine | null>(null);
  const [activeExercises, setActiveExercises] = useState<SessionExercise[]>([]);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState<number>(531); // sample timer 08:51
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Rest countdown timer (like Zepp: 0:12)
  const [restSeconds, setRestSeconds] = useState<number>(45);
  const [isResting, setIsResting] = useState<boolean>(false);

  // New routine modal state
  const [isCreatingRoutine, setIsCreatingRoutine] = useState<boolean>(false);
  const [newRoutineName, setNewRoutineName] = useState<string>('');
  const [newRoutineNotes, setNewRoutineNotes] = useState<string>('');
  const [newRoutineExercises, setNewRoutineExercises] = useState<RoutineExercise[]>([]);

  // "Como fazer?" instruction modal
  const [infoExerciseName, setInfoExerciseName] = useState<string | null>(null);

  // Exercise catalog search
  const [exerciseQuery, setExerciseQuery] = useState<string>('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('');

  // Workout duration stopwatch
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setActiveTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Rest countdown
  useEffect(() => {
    let interval: any = null;
    if (isResting) {
      interval = setInterval(() => {
        setRestSeconds((s) => Math.max(0, s - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting]);

  const handleStartWorkout = (routine: WorkoutRoutine) => {
    setActiveSessionRoutine(routine);
    const sessionEx: SessionExercise[] = routine.exercises.map((e) => ({
      name: e.name,
      muscle_group: e.muscle_group,
      sets: Array.from({ length: e.sets }).map(() => ({
        reps: e.reps,
        weight_kg: e.weight_kg,
        done: false,
      })),
    }));
    setActiveExercises(sessionEx);
    setActiveTimerSeconds(0);
    setIsTimerRunning(true);
    setActiveTab('active');
  };

  const handleToggleSetDone = (exIdx: number, setIdx: number) => {
    setActiveExercises((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const current = copy[exIdx].sets[setIdx].done;
      copy[exIdx].sets[setIdx].done = !current;
      return copy;
    });

    // Start rest timer (e.g. 60 seconds countdown)
    setRestSeconds(60);
    setIsResting(true);
  };

  const handleUpdateSet = (exIdx: number, setIdx: number, field: 'reps' | 'weight_kg', delta: number) => {
    setActiveExercises((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const current = copy[exIdx].sets[setIdx][field];
      copy[exIdx].sets[setIdx][field] = Math.max(0, current + delta);
      return copy;
    });
  };

  const handleAddSet = (exIdx: number) => {
    setActiveExercises((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const last = copy[exIdx].sets[copy[exIdx].sets.length - 1];
      copy[exIdx].sets.push({
        reps: last?.reps || 10,
        weight_kg: last?.weight_kg || 0,
        done: false,
      });
      return copy;
    });
  };

  // Compute active volume (kg)
  const activeVolumeKg = useMemo(() => {
    return activeExercises.reduce((vol, ex) => {
      return (
        vol +
        ex.sets.reduce((sVol, s) => {
          return s.done ? sVol + s.reps * s.weight_kg : sVol;
        }, 0)
      );
    }, 0);
  }, [activeExercises]);

  const handleFinishWorkout = () => {
    if (!activeSessionRoutine) return;

    let volume = 0;
    let totalSets = 0;
    const records: string[] = [];

    activeExercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.done) {
          volume += s.reps * s.weight_kg;
          totalSets++;
        }
      });
      const doneSets = ex.sets.filter((s) => s.done);
      if (doneSets.length > 0) {
        const maxWeight = Math.max(...doneSets.map((s) => s.weight_kg));
        if (maxWeight > 0) {
          records.push(`${ex.name}: ${maxWeight}kg`);
        }
      }
    });

    const durationMin = Math.max(1, Math.round(activeTimerSeconds / 60));
    const caloriesBurned = estimateCaloriesBurned(durationMin, profile.weight_kg || 70);

    saveWorkoutSession({
      routine_id: activeSessionRoutine.id,
      routine_name: activeSessionRoutine.name,
      date: activeDate,
      duration_min: durationMin,
      exercises: activeExercises,
      volume_kg: Math.round(volume),
      total_sets: totalSets,
      calories_burned: caloriesBurned,
      records: records.slice(0, 3),
    });

    setIsTimerRunning(false);
    setIsResting(false);
    setActiveSessionRoutine(null);
    setActiveExercises([]);
    setActiveTab('heatmap');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Determine active/primary muscles from current routine or last session
  const primaryMuscles: MuscleGroup[] = useMemo(() => {
    if (activeSessionRoutine) {
      return Array.from(new Set(activeSessionRoutine.exercises.map((e) => e.muscle_group)));
    }
    const lastSession = sessions[0];
    if (lastSession && lastSession.exercises?.length) {
      return Array.from(new Set(lastSession.exercises.map((e) => e.muscle_group)));
    }
    return ['peito', 'ombros'];
  }, [activeSessionRoutine, sessions]);

  const secondaryMuscles: MuscleGroup[] = useMemo(() => {
    if (primaryMuscles.includes('peito')) return ['triceps', 'ombros'];
    if (primaryMuscles.includes('costas')) return ['biceps', 'ombros'];
    if (primaryMuscles.includes('pernas')) return ['gluteos', 'panturrilha'];
    return ['abdomen', 'corpo_inteiro'];
  }, [primaryMuscles]);

  // Filter catalog
  const filteredExercises = EXERCISES_CATALOG.filter((e) => {
    if (selectedMuscleFilter && e.muscle_group !== selectedMuscleFilter) return false;
    if (!exerciseQuery) return true;
    return e.name.toLowerCase().includes(exerciseQuery.toLowerCase());
  });

  return (
    <div className="space-y-4 pb-24">
      {/* Sub Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 text-xs font-bold text-slate-600 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('routines')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition ${
            activeTab === 'routines' ? 'bg-white text-emerald-700 shadow-sm' : 'hover:text-slate-900'
          }`}
        >
          Meus Treinos
        </button>
        {activeSessionRoutine && (
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2 px-3 rounded-xl whitespace-nowrap transition flex items-center gap-1 ${
              activeTab === 'active' ? 'bg-amber-500 text-slate-950 font-black shadow-sm' : 'bg-amber-100 text-amber-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            Em Andamento
          </button>
        )}
        <button
          onClick={() => setActiveTab('heatmap')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition flex items-center gap-1 ${
            activeTab === 'heatmap' ? 'bg-white text-emerald-700 shadow-sm' : 'hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-500" />
          Músculos Usados
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition ${
            activeTab === 'exercises' ? 'bg-white text-emerald-700 shadow-sm' : 'hover:text-slate-900'
          }`}
        >
          Exercícios
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-3 rounded-xl whitespace-nowrap transition ${
            activeTab === 'history' ? 'bg-white text-emerald-700 shadow-sm' : 'hover:text-slate-900'
          }`}
        >
          Histórico
        </button>
      </div>

      {/* TAB 1: ROUTINES LIST */}
      {activeTab === 'routines' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Modelos de Treino</h2>
              <p className="text-xs text-slate-500">Selecione para treinar com interface estilo Zepp</p>
            </div>
            <button
              onClick={() => setIsCreatingRoutine(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 transition"
            >
              <Plus className="w-4 h-4" />
              Novo Treino
            </button>
          </div>

          <div className="space-y-3">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3 hover:border-slate-200 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{routine.name}</h3>
                    {routine.notes && <p className="text-xs text-slate-400 mt-0.5">{routine.notes}</p>}
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      {routine.exercises.length} exercícios
                    </span>
                  </div>
                  <button
                    onClick={() => deleteRoutine(routine.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition"
                    title="Excluir rotina"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Exercises list with illustrations */}
                <div className="space-y-2 border-t border-slate-50 pt-2">
                  {routine.exercises.map((ex) => (
                    <div key={ex.id} className="flex items-center gap-2 text-xs">
                      <ExerciseIllustration name={ex.name} muscleGroup={ex.muscle_group} className="w-8 h-8 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-slate-800 truncate block">{ex.name}</span>
                        <span className="text-[11px] text-slate-400">
                          {ex.sets} séries x {ex.reps} reps {ex.weight_kg > 0 ? `• ${ex.weight_kg}kg` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleStartWorkout(routine)}
                  className="w-full py-3 bg-[#111318] hover:bg-emerald-600 text-white font-extrabold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 group"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  Iniciar Treino
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE WORKOUT (ZEPP STYLE - IMAGE 1) */}
      {activeTab === 'active' && activeSessionRoutine && (
        <div className="bg-[#121316] text-white rounded-3xl p-4 shadow-2xl space-y-4 border border-slate-800">
          {/* Top Zepp Stats Bar */}
          <div className="grid grid-cols-3 text-center border-b border-slate-800/80 pb-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Tempo</span>
              <span className="text-xl font-black text-white font-mono">
                {formatTimer(activeTimerSeconds)}
              </span>
              <div className="flex items-center justify-center gap-1 text-[10px] text-rose-500 font-bold mt-0.5">
                <Heart className="w-3 h-3 fill-rose-500" />
                80
              </div>
            </div>

            <div>
              <span className="text-[10px] text-amber-400 font-bold block uppercase">Descanso</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                0:{String(restSeconds).padStart(2, '0')}
              </span>
              <div className="flex items-center justify-center gap-1 text-[10px] text-amber-500 font-bold mt-0.5">
                <Flame className="w-3 h-3 fill-amber-500" />
                37
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Volume</span>
              <span className="text-xl font-black text-white font-mono">
                {activeVolumeKg} kg
              </span>
              <div className="flex items-center justify-center gap-1 text-[10px] text-rose-500 font-bold mt-0.5">
                <Heart className="w-3 h-3 fill-rose-500" />
                105
              </div>
            </div>
          </div>

          {/* Rest Bar Controls (+30s / Saltar) */}
          <div className="bg-[#1E2026] p-2.5 rounded-2xl flex items-center justify-between border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Timer className="w-4 h-4" />
              <span>Descanso: {restSeconds}s</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRestSeconds((s) => s + 30)}
                className="px-3 py-1 bg-[#2C2E38] hover:bg-[#383A46] text-amber-400 rounded-xl text-xs font-bold transition"
              >
                +30s
              </button>
              <button
                onClick={() => {
                  setRestSeconds(0);
                  setIsResting(false);
                }}
                className="px-3 py-1 bg-[#2C2E38] hover:bg-[#383A46] text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Saltar
              </button>
            </div>
          </div>

          {/* Exercise Cards */}
          <div className="space-y-4">
            {activeExercises.map((ex, exIdx) => {
              const doneCount = ex.sets.filter((s) => s.done).length;
              return (
                <div
                  key={exIdx}
                  className="bg-[#1A1C22] rounded-3xl p-4 border border-slate-800/80 space-y-3"
                >
                  {/* Exercise Header */}
                  <div className="flex items-center gap-3">
                    <ExerciseIllustration
                      name={ex.name}
                      muscleGroup={ex.muscle_group}
                      className="w-12 h-12 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{ex.name}</h4>
                      <button
                        onClick={() => setInfoExerciseName(ex.name)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium block mt-0.5"
                      >
                        Como fazer?
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400">
                        {doneCount}/{ex.sets.length}
                      </span>
                    </div>
                  </div>

                  {/* 1RM estimado banner */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-[#262832] px-3 py-1 rounded-xl">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>
                      1RM estimado:{' '}
                      <strong>
                        ~{Math.round(Math.max(1, ...ex.sets.map((s) => s.weight_kg)) * 1.15)} kg
                      </strong>
                    </span>
                  </div>

                  {/* Sets Table Header */}
                  <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 px-2 uppercase">
                    <span className="col-span-2">SÉRIE</span>
                    <span className="col-span-5 text-center">KG</span>
                    <span className="col-span-3 text-center">REPS</span>
                    <span className="col-span-2 text-right">STATUS</span>
                  </div>

                  {/* Sets Rows */}
                  <div className="space-y-2">
                    {ex.sets.map((set, sIdx) => {
                      const isDone = set.done;
                      return (
                        <div
                          key={sIdx}
                          className={`grid grid-cols-12 items-center p-2 rounded-2xl transition border ${
                            isDone
                              ? 'bg-[#21242C] border-amber-500/40'
                              : 'bg-[#181A20] border-slate-800'
                          }`}
                        >
                          {/* Série # */}
                          <div className="col-span-2 flex items-center gap-1">
                            <span className="text-xs font-extrabold text-amber-400">
                              {sIdx + 1}
                            </span>
                            {sIdx === 0 && <span className="text-[10px]">👑</span>}
                          </div>

                          {/* KG selector (- / +) */}
                          <div className="col-span-5 flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleUpdateSet(exIdx, sIdx, 'weight_kg', -2.5)}
                              className="w-6 h-6 rounded-lg bg-[#282B34] text-slate-300 font-bold flex items-center justify-center hover:bg-slate-700"
                            >
                              -
                            </button>
                            <span className="text-xs font-black w-10 text-center font-mono">
                              {set.weight_kg.toFixed(1)}
                            </span>
                            <button
                              onClick={() => handleUpdateSet(exIdx, sIdx, 'weight_kg', 2.5)}
                              className="w-6 h-6 rounded-lg bg-[#282B34] text-slate-300 font-bold flex items-center justify-center hover:bg-slate-700"
                            >
                              +
                            </button>
                          </div>

                          {/* REPS selector (- / +) */}
                          <div className="col-span-3 flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleUpdateSet(exIdx, sIdx, 'reps', -1)}
                              className="w-5 h-5 rounded-lg bg-[#282B34] text-slate-300 font-bold flex items-center justify-center hover:bg-slate-700 text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-black w-6 text-center font-mono">
                              {set.reps}
                            </span>
                            <button
                              onClick={() => handleUpdateSet(exIdx, sIdx, 'reps', 1)}
                              className="w-5 h-5 rounded-lg bg-[#282B34] text-slate-300 font-bold flex items-center justify-center hover:bg-slate-700 text-xs"
                            >
                              +
                            </button>
                          </div>

                          {/* Done Checkbox */}
                          <div className="col-span-2 flex justify-end">
                            <button
                              onClick={() => handleToggleSetDone(exIdx, sIdx)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition shadow-md ${
                                isDone
                                  ? 'bg-amber-500 text-slate-950 font-black'
                                  : 'border-2 border-slate-600 hover:border-amber-400'
                              }`}
                            >
                              {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : null}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add set button */}
                  <button
                    onClick={() => handleAddSet(exIdx)}
                    className="w-full py-2 bg-[#252832] hover:bg-[#30333E] rounded-xl text-xs font-bold text-amber-400 flex items-center justify-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Série
                  </button>
                </div>
              );
            })}
          </div>

          {/* Finish Workout Button */}
          <button
            onClick={handleFinishWorkout}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl text-sm shadow-xl transition flex items-center justify-center gap-2 tracking-wide"
          >
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            FINALIZAR TREINO
          </button>
        </div>
      )}

      {/* TAB 3: MUSCLE HEATMAP (ZEPP STYLE - IMAGE 2) */}
      {activeTab === 'heatmap' && (
        <div className="space-y-4">
          <MuscleHeatmap
            primaryMuscles={primaryMuscles}
            secondaryMuscles={secondaryMuscles}
            aerobicScore={0.4}
            anaerobicScore={2.8}
          />
        </div>
      )}

      {/* TAB 4: EXERCISES CATALOG */}
      {activeTab === 'exercises' && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar exercício com ilustração..."
              value={exerciseQuery}
              onChange={(e) => setExerciseQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white rounded-xl border border-slate-200 outline-none"
            />
          </div>

          {/* Muscle group chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedMuscleFilter('')}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
                selectedMuscleFilter === ''
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Todos
            </button>
            {Object.entries(MUSCLE_GROUPS_PT).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedMuscleFilter(selectedMuscleFilter === key ? '' : key)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
                  selectedMuscleFilter === key
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredExercises.map((e, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-2xl border border-slate-100 flex items-center justify-between text-xs hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-3">
                  <ExerciseIllustration name={e.name} muscleGroup={e.muscle_group} className="w-10 h-10" />
                  <div>
                    <span className="font-bold text-slate-800 block">{e.name}</span>
                    <span className="text-[11px] text-slate-400 uppercase">
                      {MUSCLE_GROUPS_PT[e.muscle_group] || e.muscle_group}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setInfoExerciseName(e.name)}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 text-[11px] font-bold"
                >
                  Instruções
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-800">Histórico de Treinos Concluídos</h2>
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Dumbbell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">Nenhum treino concluído ainda.</p>
            </div>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">{s.routine_name}</h3>
                    <p className="text-[11px] text-slate-400">{formatDateBR(s.date)}</p>
                  </div>
                  <button
                    onClick={() => deleteWorkoutSession(s.id)}
                    className="p-1 text-slate-300 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-50 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Duração</span>
                    <span className="text-xs font-bold text-slate-700">{s.duration_min} min</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Volume</span>
                    <span className="text-xs font-bold text-slate-700">{s.volume_kg} kg</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Calorias</span>
                    <span className="text-xs font-bold text-amber-600">~{s.calories_burned} kcal</span>
                  </div>
                </div>

                {s.records && s.records.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl">
                    <Award className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">{s.records.join(' • ')}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Como Fazer? Instruction Modal */}
      {infoExerciseName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800">Como fazer</h3>
              <button
                onClick={() => setInfoExerciseName(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center py-2">
              <ExerciseIllustration name={infoExerciseName} muscleGroup="peito" className="w-16 h-16 mx-auto mb-2" />
              <h4 className="font-extrabold text-sm text-slate-900">{infoExerciseName}</h4>
            </div>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl">
              <p>• Mantenha a postura alinhada e abdômen contraído durante todo o movimento.</p>
              <p>• Controle a fase excêntrica (descida de 2 a 3 segundos) sem deixar os pesos caírem.</p>
              <p>• Respire soltando o ar na subida e inspirando na descida.</p>
            </div>
            <button
              onClick={() => setInfoExerciseName(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Create Routine Modal */}
      {isCreatingRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800">Novo Modelo de Treino</h3>
              <button
                onClick={() => setIsCreatingRoutine(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Treino</label>
              <input
                type="text"
                placeholder="Ex: Treino de Dorsal e Bíceps"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Exercícios Selecionados ({newRoutineExercises.length}):
              </label>
              {newRoutineExercises.map((re, rIdx) => (
                <div key={rIdx} className="p-2 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 truncate pr-2">{re.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">{re.sets}x{re.reps}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setNewRoutineExercises((prev) => prev.filter((_, i) => i !== rIdx))
                      }
                      className="text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2">
              <span className="text-xs font-bold text-slate-600 block">Adicionar da biblioteca:</span>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {EXERCISES_CATALOG.slice(0, 15).map((ex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewRoutineExercises((prev) => [
                        ...prev,
                        {
                          id: `re-${Date.now()}-${idx}`,
                          name: ex.name,
                          muscle_group: ex.muscle_group,
                          sets: 3,
                          reps: 10,
                          weight_kg: 20,
                          rest_s: 60,
                        },
                      ]);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-xs font-semibold text-slate-700 flex justify-between items-center transition"
                  >
                    <span>{ex.name}</span>
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (!newRoutineName) return;
                createRoutine({
                  name: newRoutineName,
                  notes: newRoutineNotes,
                  exercises: newRoutineExercises,
                });
                setIsCreatingRoutine(false);
                setNewRoutineName('');
                setNewRoutineNotes('');
                setNewRoutineExercises([]);
              }}
              className="w-full py-3 bg-emerald-600 text-white font-bold rounded-2xl text-xs shadow-md"
            >
              Salvar Modelo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
