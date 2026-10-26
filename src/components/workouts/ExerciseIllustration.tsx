import React from 'react';
import { MuscleGroup } from '../../types';

interface ExerciseIllustrationProps {
  name: string;
  muscleGroup: MuscleGroup;
  className?: string;
}

export const ExerciseIllustration: React.FC<ExerciseIllustrationProps> = ({
  name,
  muscleGroup,
  className = 'w-10 h-10',
}) => {
  const normName = name.toLowerCase();

  // Bench press (Supino)
  if (normName.includes('supino')) {
    return (
      <div className={`rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1 ${className}`}>
        <svg viewBox="0 0 64 64" className="w-full h-full text-amber-400" fill="currentColor">
          {/* Bench */}
          <rect x="12" y="44" width="40" height="4" rx="2" fill="#94A3B8" />
          <rect x="18" y="48" width="4" height="12" fill="#64748B" />
          <rect x="42" y="48" width="4" height="12" fill="#64748B" />
          {/* Person silhouette */}
          <circle cx="20" cy="38" r="4" fill="#F8FAFC" />
          <path d="M 22 42 L 44 42" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" />
          {/* Barbell & Plates */}
          <line x1="8" y1="26" x2="56" y2="26" stroke="#CBD5E1" strokeWidth="2.5" />
          <rect x="10" y="20" width="3" height="12" rx="1" fill="#F59E0B" />
          <rect x="51" y="20" width="3" height="12" rx="1" fill="#F59E0B" />
          {/* Arms holding barbell */}
          <line x1="30" y1="42" x2="28" y2="28" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
          <line x1="38" y1="42" x2="40" y2="28" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Bicep curl (Rosca)
  if (normName.includes('rosca') || muscleGroup === 'biceps') {
    return (
      <div className={`rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1 ${className}`}>
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="currentColor">
          {/* Standing figure */}
          <circle cx="32" cy="12" r="5" fill="#F8FAFC" />
          <line x1="32" y1="18" x2="32" y2="40" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" />
          <line x1="32" y1="40" x2="26" y2="60" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="32" y1="40" x2="38" y2="60" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
          {/* Curling arms with dumbbell */}
          <path d="M 32 24 L 24 34 L 22 24" fill="none" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
          <circle cx="22" cy="23" r="3.5" fill="#F59E0B" />
          <line x1="20" y1="23" x2="24" y2="23" stroke="#CBD5E1" strokeWidth="2" />
        </svg>
      </div>
    );
  }

  // Squat (Agachamento) / Legs
  if (normName.includes('agachamento') || normName.includes('leg press') || muscleGroup === 'pernas') {
    return (
      <div className={`rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1 ${className}`}>
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="currentColor">
          {/* Barbell on back */}
          <line x1="6" y1="18" x2="58" y2="18" stroke="#CBD5E1" strokeWidth="2.5" />
          <rect x="8" y="12" width="3" height="12" rx="1" fill="#EF4444" />
          <rect x="53" y="12" width="3" height="12" rx="1" fill="#EF4444" />
          {/* Squatting body */}
          <circle cx="32" cy="14" r="4.5" fill="#F8FAFC" />
          <path d="M 32 20 L 26 34 L 38 42 L 32 58" fill="none" stroke="#F8FAFC" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 32 20 L 36 34 L 28 42 L 36 58" fill="none" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Pull / Back (Puxada / Remada)
  if (normName.includes('puxada') || normName.includes('remada') || normName.includes('barra') || muscleGroup === 'costas') {
    return (
      <div className={`rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1 ${className}`}>
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="currentColor">
          {/* Lat pull bar */}
          <line x1="8" y1="10" x2="56" y2="10" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="10" r="2" fill="#F59E0B" />
          <line x1="32" y1="10" x2="32" y2="2" stroke="#64748B" strokeWidth="2" />
          {/* Person pulling bar */}
          <circle cx="32" cy="26" r="4.5" fill="#F8FAFC" />
          <line x1="32" y1="32" x2="32" y2="52" stroke="#F8FAFC" strokeWidth="4" />
          {/* Arms reaching bar */}
          <line x1="32" y1="34" x2="18" y2="12" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="34" x2="46" y2="12" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Shoulder / Overhead press (Desenvolvimento / Elevação)
  if (normName.includes('desenvolvimento') || normName.includes('elevação') || muscleGroup === 'ombros') {
    return (
      <div className={`rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1 ${className}`}>
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="currentColor">
          {/* Overhead weights */}
          <circle cx="16" cy="12" r="3.5" fill="#F59E0B" />
          <circle cx="48" cy="12" r="3.5" fill="#F59E0B" />
          {/* Person */}
          <circle cx="32" cy="22" r="4.5" fill="#F8FAFC" />
          <line x1="32" y1="28" x2="32" y2="48" stroke="#F8FAFC" strokeWidth="4" />
          <line x1="32" y1="32" x2="16" y2="16" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="32" x2="48" y2="16" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Default workout silhouette
  return (
    <div className={`rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1 ${className}`}>
      <svg viewBox="0 0 64 64" className="w-full h-full text-emerald-400" fill="currentColor">
        <circle cx="32" cy="16" r="5" fill="#F8FAFC" />
        <line x1="32" y1="22" x2="32" y2="44" stroke="#F8FAFC" strokeWidth="4" />
        <line x1="32" y1="28" x2="18" y2="34" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
        <line x1="32" y1="28" x2="46" y2="34" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
        <line x1="32" y1="44" x2="24" y2="60" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="32" y1="44" x2="40" y2="60" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};
