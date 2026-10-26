import React from 'react';
import { MuscleGroup } from '../../types';

interface MuscleHeatmapProps {
  primaryMuscles?: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  aerobicScore?: number;
  anaerobicScore?: number;
}

export const MuscleHeatmap: React.FC<MuscleHeatmapProps> = ({
  primaryMuscles = ['peito'],
  secondaryMuscles = ['triceps', 'ombros'],
  aerobicScore = 0.3,
  anaerobicScore = 2.4,
}) => {
  const isPrimary = (m: MuscleGroup) => primaryMuscles.includes(m);
  const isSecondary = (m: MuscleGroup) => secondaryMuscles.includes(m);

  const getMuscleColor = (m: MuscleGroup): string => {
    if (isPrimary(m)) return '#EF4444'; // Red
    if (isSecondary(m)) return '#F59E0B'; // Orange/Amber
    return '#E2E8F0'; // Non-target clean gray
  };

  return (
    <div className="bg-[#181A20] text-white rounded-3xl p-5 shadow-2xl space-y-5 border border-slate-800">
      {/* SECTION: EFEITO DO TREINO (Training Effect Dials like Zepp) */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
          EFEITO DO TREINO
        </span>
        <div className="grid grid-cols-2 gap-4">
          {/* Aerobic Dial */}
          <div className="bg-[#22252D] rounded-2xl p-3 border border-slate-800/80 text-center relative overflow-hidden">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Aeróbico</span>
            <div className="relative inline-block my-1">
              {/* Semi-circle arc dial */}
              <svg className="w-24 h-14" viewBox="0 0 100 55">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#333842"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#0EA5E9"
                  strokeWidth="8"
                  strokeDasharray="125"
                  strokeDashoffset={125 - (Math.min(5, aerobicScore) / 5) * 125}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 top-3 flex items-center justify-center">
                <span className="text-xl font-black text-white">{aerobicScore.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-[10px] text-sky-400 font-semibold">
              {aerobicScore < 1.0 ? 'Efeito suave' : aerobicScore < 3.0 ? 'Manutenção' : 'Melhora aeróbica'}
            </p>
          </div>

          {/* Anaerobic Dial */}
          <div className="bg-[#22252D] rounded-2xl p-3 border border-slate-800/80 text-center relative overflow-hidden">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">Anaeróbico</span>
            <div className="relative inline-block my-1">
              <svg className="w-24 h-14" viewBox="0 0 100 55">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#333842"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="8"
                  strokeDasharray="125"
                  strokeDashoffset={125 - (Math.min(5, anaerobicScore) / 5) * 125}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 top-3 flex items-center justify-center">
                <span className="text-xl font-black text-white">{anaerobicScore.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-[10px] text-amber-400 font-semibold">
              {anaerobicScore < 1.0 ? 'Leve' : anaerobicScore < 2.5 ? 'Efeito bom' : 'Efeito alto de força'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION: MÚSCULOS USADOS (Body map front and back view) */}
      <div className="border-t border-slate-800/80 pt-4 space-y-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
          MÚSCULOS USADOS
        </span>

        <div className="flex justify-around items-center py-2 px-1">
          {/* ANTERIOR (FRONT VIEW) */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 mb-2">FRENTE</span>
            <svg width="110" height="220" viewBox="0 0 100 200" className="drop-shadow-md">
              {/* Head */}
              <circle cx="50" cy="14" r="8" fill="#475569" />

              {/* Neck */}
              <rect x="47" y="22" width="6" height="6" fill="#475569" />

              {/* Shoulders / Deltoids (ombros) */}
              <path
                d="M 33 28 C 30 29, 26 36, 26 44 C 28 46, 33 46, 35 40 Z"
                fill={getMuscleColor('ombros')}
              />
              <path
                d="M 67 28 C 70 29, 74 36, 74 44 C 72 46, 67 46, 65 40 Z"
                fill={getMuscleColor('ombros')}
              />

              {/* Chest / Peitorais (peito) */}
              <path
                d="M 35 30 L 49 32 L 49 50 C 42 51, 35 48, 33 42 Z"
                fill={getMuscleColor('peito')}
              />
              <path
                d="M 65 30 L 51 32 L 51 50 C 58 51, 65 48, 67 42 Z"
                fill={getMuscleColor('peito')}
              />

              {/* Biceps */}
              <rect x="23" y="46" width="7" height="18" rx="3.5" fill={getMuscleColor('biceps')} />
              <rect x="70" y="46" width="7" height="18" rx="3.5" fill={getMuscleColor('biceps')} />

              {/* Forearms */}
              <rect x="20" y="66" width="6" height="20" rx="3" fill="#64748B" />
              <rect x="74" y="66" width="6" height="20" rx="3" fill="#64748B" />

              {/* Abdomen / Abs */}
              <g fill={getMuscleColor('abdomen')}>
                <rect x="42" y="52" width="7" height="6" rx="1.5" />
                <rect x="51" y="52" width="7" height="6" rx="1.5" />
                <rect x="42" y="60" width="7" height="6" rx="1.5" />
                <rect x="51" y="60" width="7" height="6" rx="1.5" />
                <rect x="42" y="68" width="7" height="6" rx="1.5" />
                <rect x="51" y="68" width="7" height="6" rx="1.5" />
              </g>

              {/* Quadríceps / Thighs (pernas) */}
              <path
                d="M 37 84 C 33 90, 31 106, 33 130 C 37 132, 45 132, 47 122 C 48 106, 46 90, 44 84 Z"
                fill={getMuscleColor('pernas')}
              />
              <path
                d="M 63 84 C 67 90, 69 106, 67 130 C 63 132, 55 132, 53 122 C 52 106, 54 90, 56 84 Z"
                fill={getMuscleColor('pernas')}
              />

              {/* Knee caps */}
              <circle cx="40" cy="134" r="3" fill="#64748B" />
              <circle cx="60" cy="134" r="3" fill="#64748B" />

              {/* Shin / Panturrilha anterior (panturrilha) */}
              <path
                d="M 37 138 C 34 144, 34 165, 36 182 L 44 182 C 46 165, 45 144, 43 138 Z"
                fill={getMuscleColor('panturrilha')}
              />
              <path
                d="M 63 138 C 66 144, 66 165, 64 182 L 56 182 C 54 165, 55 144, 57 138 Z"
                fill={getMuscleColor('panturrilha')}
              />
            </svg>
          </div>

          {/* POSTERIOR (BACK VIEW) */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 mb-2">COSTAS</span>
            <svg width="110" height="220" viewBox="0 0 100 200" className="drop-shadow-md">
              {/* Back Head */}
              <circle cx="50" cy="14" r="8" fill="#475569" />

              {/* Trapezius / Upper back */}
              <polygon
                points="50,22 36,30 42,44 50,48 58,44 64,30"
                fill={getMuscleColor(isPrimary('costas') || isPrimary('ombros') ? 'ombros' : 'costas')}
              />

              {/* Rear Deltoids */}
              <circle cx="29" cy="36" r="6" fill={getMuscleColor('ombros')} />
              <circle cx="71" cy="36" r="6" fill={getMuscleColor('ombros')} />

              {/* Latissimus Dorsi / Costas */}
              <path
                d="M 40 45 C 33 50, 32 66, 37 76 C 45 74, 48 60, 48 48 Z"
                fill={getMuscleColor('costas')}
              />
              <path
                d="M 60 45 C 67 50, 68 66, 63 76 C 55 74, 52 60, 52 48 Z"
                fill={getMuscleColor('costas')}
              />

              {/* Triceps */}
              <rect x="22" y="44" width="7" height="18" rx="3.5" fill={getMuscleColor('triceps')} />
              <rect x="71" y="44" width="7" height="18" rx="3.5" fill={getMuscleColor('triceps')} />

              {/* Forearms */}
              <rect x="19" y="64" width="6" height="20" rx="3" fill="#64748B" />
              <rect x="75" y="64" width="6" height="20" rx="3" fill="#64748B" />

              {/* Gluteos (Glúteos) */}
              <path
                d="M 37 80 C 33 86, 33 100, 40 106 C 47 106, 49 96, 49 80 Z"
                fill={getMuscleColor('gluteos')}
              />
              <path
                d="M 63 80 C 67 86, 67 100, 60 106 C 53 106, 51 96, 51 80 Z"
                fill={getMuscleColor('gluteos')}
              />

              {/* Hamstrings / Posteriores de coxa (pernas) */}
              <path
                d="M 37 108 C 34 116, 34 126, 36 132 L 46 132 C 48 126, 48 116, 47 108 Z"
                fill={getMuscleColor('pernas')}
              />
              <path
                d="M 63 108 C 66 116, 66 126, 64 132 L 54 132 C 52 126, 52 116, 53 108 Z"
                fill={getMuscleColor('pernas')}
              />

              {/* Calves / Panturrilha posterior (panturrilha) */}
              <path
                d="M 36 138 C 33 146, 33 162, 36 182 L 44 182 C 47 162, 47 146, 44 138 Z"
                fill={getMuscleColor('panturrilha')}
              />
              <path
                d="M 64 138 C 67 146, 67 162, 64 182 L 56 182 C 53 162, 53 146, 56 138 Z"
                fill={getMuscleColor('panturrilha')}
              />
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-4 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
            <span>Músculo primário usado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span>Músculo secundário</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
            <span>Não alvo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
