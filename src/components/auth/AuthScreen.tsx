import React, { useState } from 'react';
import { Lock, ShieldCheck, Mail, User, ArrowRight, Check, Delete } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthScreenProps {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { profile, updateProfile } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('usuario@nutrify.app');
  const [name, setName] = useState(profile.name || 'Usuário');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleDigitClick = (d: string) => {
    if (pin.length < 6) {
      const next = pin + d;
      setPin(next);
      setError(null);
      if (next.length === 6) {
        // Auto-submit on 6 digits
        handleCompletePin(next);
      }
    }
  };

  const handleDeleteDigit = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleCompletePin = (completedPin: string) => {
    if (completedPin.length !== 6) {
      setError('A senha deve ter exatamente 6 números');
      return;
    }
    // Success: updates profile and authenticates
    if (mode === 'register') {
      updateProfile({ name, onboarded: true });
    }
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 max-w-md mx-auto">
      {/* Top Header */}
      <div className="pt-8 text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Nutrify</h1>
        <p className="text-xs text-slate-400">
          {mode === 'login'
            ? 'Digite sua senha numérica de 6 dígitos'
            : 'Cadastre sua senha numérica de 6 dígitos'}
        </p>
      </div>

      {/* PIN Dots Display */}
      <div className="my-6 text-center space-y-3">
        {mode === 'register' && (
          <div className="space-y-2 mb-4 text-left max-w-xs mx-auto">
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 rounded-xl border border-slate-800 text-white outline-none"
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 rounded-xl border border-slate-800 text-white outline-none"
            />
          </div>
        )}

        <div className="flex justify-center items-center gap-3 py-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i < pin.length
                  ? 'bg-emerald-500 scale-110 shadow-lg shadow-emerald-500/50'
                  : 'border-2 border-slate-700 bg-slate-900'
              }`}
            />
          ))}
        </div>

        {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}
      </div>

      {/* Numeric Keypad (0-9) */}
      <div className="pb-4">
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigitClick(digit)}
              className="h-16 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-xl font-bold text-white border border-slate-800/80 shadow-md transition flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setPin('')}
              className="text-xs text-slate-500 hover:text-slate-300 font-bold"
            >
              Limpar
            </button>
          </div>
          <button
            onClick={() => handleDigitClick('0')}
            className="h-16 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-xl font-bold text-white border border-slate-800/80 shadow-md transition flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDeleteDigit}
            className="h-16 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-white border border-slate-800/80 shadow-md transition flex items-center justify-center"
          >
            <Delete className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Switch between Login and Register */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setPin('');
              setError(null);
            }}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
          >
            {mode === 'login'
              ? 'Não tem conta? Cadastrar com senha de 6 números'
              : 'Já tem conta? Entrar com senha de 6 números'}
          </button>
        </div>
      </div>
    </div>
  );
};
