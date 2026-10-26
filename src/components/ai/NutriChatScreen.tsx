import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  Bot,
  User,
  Utensils,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MealKey, MealSuggestion } from '../../types';
import { MEAL_NAMES_PT } from '../../utils/nutritionCalculations';

export const NutriChatScreen: React.FC = () => {
  const {
    chatMessages,
    isChatLoading,
    sendChatMessage,
    clearChat,
    goals,
    diaryEntries,
    activeDate,
    profile,
    addDiaryEntry,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedMealForSuggest, setSelectedMealForSuggest] = useState<MealKey>('almoco');
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [addedSuggestionId, setAddedSuggestionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  // Compute remaining macros for today
  const todaysEntries = diaryEntries.filter((e) => e.date === activeDate);
  const consumedCals = Math.round(todaysEntries.reduce((s, e) => s + e.calories, 0));
  const consumedP = Math.round(todaysEntries.reduce((s, e) => s + e.protein, 0));
  const consumedC = Math.round(todaysEntries.reduce((s, e) => s + e.carbs, 0));
  const consumedF = Math.round(todaysEntries.reduce((s, e) => s + e.fat, 0));

  const remainingCals = Math.max(0, goals.calories - consumedCals);
  const remainingP = Math.max(0, goals.protein - consumedP);
  const remainingC = Math.max(0, goals.carbs - consumedC);
  const remainingF = Math.max(0, goals.fat - consumedF);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isChatLoading) return;
    setInputMessage('');
    await sendChatMessage(text);
  };

  const generateMealSuggestions = () => {
    // Generate 3 contextual Brazilian meal combos using TACO ingredients
    const mealLabel = MEAL_NAMES_PT[selectedMealForSuggest];
    const portionFactor = Math.min(1.5, Math.max(0.6, remainingCals / 600));

    const options: MealSuggestion[] = [
      {
        id: `sug-1-${Date.now()}`,
        title: `Opção Tradicional Brasileira (${mealLabel})`,
        description: 'Equilíbrio clássico com alta saciedade e proteína magra',
        items: [
          { name: 'Frango, peito, sem pele, grelhado', grams: Math.round(150 * portionFactor), calories: Math.round(238 * portionFactor), protein: Math.round(48 * portionFactor), carbs: 0, fat: Math.round(3.7 * portionFactor) },
          { name: 'Arroz, tipo 1, cozido', grams: Math.round(130 * portionFactor), calories: Math.round(166 * portionFactor), protein: Math.round(3.2 * portionFactor), carbs: Math.round(36.5 * portionFactor), fat: 0.3 },
          { name: 'Feijão, carioca, cozido', grams: Math.round(90 * portionFactor), calories: Math.round(68 * portionFactor), protein: Math.round(4.3 * portionFactor), carbs: Math.round(12.2 * portionFactor), fat: 0.4 },
        ],
        totals: {
          calories: Math.round(472 * portionFactor),
          protein: Math.round(55.5 * portionFactor),
          carbs: Math.round(48.7 * portionFactor),
          fat: Math.round(4.4 * portionFactor),
        },
      },
      {
        id: `sug-2-${Date.now()}`,
        title: `Opção Pescado & Raízes (${mealLabel})`,
        description: 'Digestão leve, rico em ômega-3 e carboidrato de baixo índice glicêmico',
        items: [
          { name: 'Filé de tilápia grelhado', grams: Math.round(170 * portionFactor), calories: Math.round(217 * portionFactor), protein: Math.round(44.2 * portionFactor), carbs: 0, fat: Math.round(4.6 * portionFactor) },
          { name: 'Mandioca, cozida', grams: Math.round(140 * portionFactor), calories: Math.round(175 * portionFactor), protein: Math.round(0.8 * portionFactor), carbs: Math.round(42.4 * portionFactor), fat: 0.4 },
          { name: 'Tomate, com semente, cru', grams: 100, calories: 15, protein: 1.1, carbs: 3.1, fat: 0.2 },
        ],
        totals: {
          calories: Math.round(407 * portionFactor),
          protein: Math.round(46.1 * portionFactor),
          carbs: Math.round(45.5 * portionFactor),
          fat: Math.round(5.2 * portionFactor),
        },
      },
      {
        id: `sug-3-${Date.now()}`,
        title: `Opção Rápida & Prática (${mealLabel})`,
        description: 'Perfeita para dias corridos, mantendo alto aporte de aminoácidos',
        items: [
          { name: 'Omelete simples (ovos caipiras)', grams: Math.round(140 * portionFactor), calories: Math.round(215 * portionFactor), protein: Math.round(14.8 * portionFactor), carbs: 0.8, fat: Math.round(16.8 * portionFactor) },
          { name: 'Tapioca (goma hidratada)', grams: Math.round(80 * portionFactor), calories: Math.round(192 * portionFactor), protein: 0, carbs: Math.round(48.0 * portionFactor), fat: 0 },
          { name: 'Queijo, mozarela', grams: 30, calories: 84, protein: 6.8, carbs: 0.9, fat: 6.2 },
        ],
        totals: {
          calories: Math.round(491 * portionFactor),
          protein: Math.round(21.6 * portionFactor),
          carbs: Math.round(49.7 * portionFactor),
          fat: Math.round(23.0 * portionFactor),
        },
      },
    ];

    setSuggestions(options);
  };

  const handleAddSuggestionToMeal = (sug: MealSuggestion) => {
    sug.items.forEach((it) => {
      addDiaryEntry(
        selectedMealForSuggest,
        {
          id: `sug-food-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: it.name,
          brand: 'TACO - UNICAMP',
          calories: Math.round((it.calories / it.grams) * 100),
          protein: Math.round((it.protein / it.grams) * 100 * 10) / 10,
          carbs: Math.round((it.carbs / it.grams) * 100 * 10) / 10,
          fat: Math.round((it.fat / it.grams) * 100 * 10) / 10,
        },
        it.grams
      );
    });

    setAddedSuggestionId(sug.id);
    setTimeout(() => setAddedSuggestionId(null), 3000);
  };

  const quickPrompts = [
    'O que comer no almoço para bater proteínas?',
    'Quais alimentos da TACO são ricos em ferro?',
    'Sugestão de lanche prático com menos de 200 kcal',
    'Como distribuir os macros restantes do meu dia?',
  ];

  return (
    <div className="space-y-4 pb-24">
      {/* Nutri AI Header Card */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 rounded-3xl p-4 text-white shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
            <Sparkles className="w-6 h-6 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-extrabold text-white">Nutri IA</h2>
              <span className="text-[10px] bg-emerald-500/50 border border-emerald-400/40 px-1.5 py-0.5 rounded-full font-bold">
                Online
              </span>
            </div>
            <p className="text-xs text-emerald-100">
              Sua nutricionista brasileira especializada na tabela TACO
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-emerald-100 hover:text-white rounded-xl hover:bg-white/10 transition"
          title="Limpar conversa"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Today's Context Banner */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 font-medium block text-[11px]">Metas Restantes Hoje:</span>
          <span className="font-extrabold text-slate-800 text-sm">{remainingCals} kcal</span>
        </div>
        <div className="flex gap-2 text-[11px]">
          <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-bold">
            P: {remainingP}g
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 font-bold">
            C: {remainingC}g
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-red-50 text-red-700 font-bold">
            G: {remainingF}g
          </span>
        </div>
      </div>

      {/* SMART MEAL SUGGESTER SECTION */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800">Gerador de Refeições Inteligente</h3>
          </div>
          <select
            value={selectedMealForSuggest}
            onChange={(e) => setSelectedMealForSuggest(e.target.value as MealKey)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 outline-none text-slate-700"
          >
            <option value="cafe_manha">Café da Manhã</option>
            <option value="lanche_manha">Lanche da Manhã</option>
            <option value="almoco">Almoço</option>
            <option value="lanche_tarde">Lanche da Tarde</option>
            <option value="jantar">Jantar</option>
            <option value="ceia">Ceia</option>
          </select>
        </div>

        <button
          onClick={generateMealSuggestions}
          className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Gerar 3 Sugestões com Alimentos TACO
        </button>

        {suggestions.length > 0 && (
          <div className="space-y-2 mt-2 pt-2 border-t border-slate-100">
            {suggestions.map((sug) => {
              const isAdded = addedSuggestionId === sug.id;
              return (
                <div
                  key={sug.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800">{sug.title}</h4>
                      <p className="text-[11px] text-slate-500">{sug.description}</p>
                    </div>
                    <span className="font-black text-emerald-700 text-xs">
                      {sug.totals.calories} kcal
                    </span>
                  </div>

                  <div className="space-y-0.5 text-[11px] text-slate-600">
                    {sug.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>• {it.name} ({it.grams}g)</span>
                        <span className="text-slate-400 font-mono">{it.calories} kcal</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-500 font-medium">
                      P: {sug.totals.protein}g • C: {sug.totals.carbs}g • G: {sug.totals.fat}g
                    </span>
                    <button
                      onClick={() => handleAddSuggestionToMeal(sug)}
                      disabled={isAdded}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 shadow-sm ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Adicionado!
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" /> Lançar no Diário
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QUICK PROMPTS CHIPS */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 text-slate-700 whitespace-nowrap transition flex items-center gap-1 text-[11px] font-medium"
          >
            <Lightbulb className="w-3 h-3 text-amber-500" />
            {q}
          </button>
        ))}
      </div>

      {/* CHAT MESSAGES DISPLAY */}
      <div className="space-y-3 min-h-[220px]">
        {chatMessages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-100 whitespace-pre-wrap'
                }`}
              >
                {msg.content}
              </div>
              {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isChatLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white rounded-2xl p-3 text-xs text-slate-500 border border-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px]">Nutri pensando...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* CHAT INPUT BAR */}
      <div className="sticky bottom-16 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200 shadow-lg flex gap-2">
        <input
          type="text"
          placeholder="Pergunte à Nutri (ex: opções de jantar leve)..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-3 py-2 text-xs bg-slate-50 rounded-xl outline-none focus:bg-white text-slate-800"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputMessage.trim() || isChatLoading}
          className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition shadow-md shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
