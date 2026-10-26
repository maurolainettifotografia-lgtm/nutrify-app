import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Check,
  X,
  Utensils,
  BookOpen,
  ArrowRight,
  Info,
  Flame,
} from 'lucide-react';
import { MealKey } from '../../types';
import { useApp } from '../../context/AppContext';
import { MEAL_NAMES_PT } from '../../utils/nutritionCalculations';
import { parseFreeTextMeal, ParseBatchResult } from '../../utils/aiFoodParser';
import { searchFoods, FOOD_CATEGORIES } from '../../data/tacoFoods';

interface FoodSearchModalProps {
  meal: MealKey;
  onClose: () => void;
}

export const FoodSearchModal: React.FC<FoodSearchModalProps> = ({ meal, onClose }) => {
  const { addDiaryEntry, customFoods } = useApp();

  const [activeTab, setActiveTab] = useState<'ai' | 'catalog'>('ai');
  const [mealTextInput, setMealTextInput] = useState('');
  const [parsedResult, setParsedResult] = useState<ParseBatchResult | null>(null);

  // Catalog search state (secondary)
  const [catalogQuery, setCatalogQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Auto-parse as user types (debounced)
  useEffect(() => {
    if (!mealTextInput.trim()) {
      setParsedResult(null);
      return;
    }
    const timer = setTimeout(() => {
      const res = parseFreeTextMeal(mealTextInput, customFoods);
      setParsedResult(res);
    }, 250);
    return () => clearTimeout(timer);
  }, [mealTextInput, customFoods]);

  const handleConfirmAddAll = () => {
    if (!parsedResult || parsedResult.items.length === 0) return;

    parsedResult.items.forEach((item) => {
      addDiaryEntry(meal, item.food, item.grams);
    });

    onClose();
  };

  const quickExamples = [
    '150gr de arroz, 150gr de batata inglesa, 100gr de frango',
    '2 ovos cozidos, 2 fatias de pão francês, 30g de queijo',
    '1 filé de tilápia grelhado, 150g de mandioca cozida, salada de tomate',
    '30g de whey protein, 1 banana prata, 40g de aveia em flocos',
  ];

  const catalogResults = searchFoods(catalogQuery, selectedCategory || undefined, customFoods, 30);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 fill-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Adicionar ao {MEAL_NAMES_PT[meal]}
              </h2>
              <p className="text-xs text-slate-500">Cálculo inteligente com IA e tabela TACO</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-2 px-3 rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'border-b-2 border-emerald-600 text-emerald-700 bg-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Cálculo com IA (Texto Livre)
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-2 px-3 rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'catalog'
                ? 'border-b-2 border-emerald-600 text-emerald-700 bg-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            Tabela TACO Completa
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === 'ai' ? (
            <>
              {/* Natural Text Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Digite tudo o que você vai consumir:
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="Ex: 150gr de arroz, 150gr de batata inglesa, 100gr de frango grelhado..."
                    value={mealTextInput}
                    onChange={(e) => setMealTextInput(e.target.value)}
                    className="w-full p-3.5 text-sm font-medium bg-slate-50 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:bg-white outline-none transition resize-none text-slate-800 placeholder:text-slate-400"
                    autoFocus
                  />
                  {mealTextInput && (
                    <button
                      onClick={() => setMealTextInput('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick suggestion prompt chips */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 block">Exemplos rápidos:</span>
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {quickExamples.map((ex, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMealTextInput(ex)}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 border border-slate-200/60 whitespace-nowrap text-[11px] transition"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Automatic Calculation Preview */}
              {parsedResult && parsedResult.items.length > 0 && (
                <div className="space-y-3 pt-2">
                  {/* Totals Summary Banner */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-4 h-4 text-emerald-400" />
                        Cálculo Automático da IA
                      </span>
                      <span className="text-xl font-black text-white">
                        {parsedResult.totals.calories} kcal
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-700/80 text-center">
                      <div className="bg-slate-800/80 p-1.5 rounded-xl">
                        <span className="text-[10px] text-blue-400 font-bold block">Proteína</span>
                        <span className="text-xs font-extrabold text-white">
                          {parsedResult.totals.protein}g
                        </span>
                      </div>
                      <div className="bg-slate-800/80 p-1.5 rounded-xl">
                        <span className="text-[10px] text-amber-400 font-bold block">Carboidrato</span>
                        <span className="text-xs font-extrabold text-white">
                          {parsedResult.totals.carbs}g
                        </span>
                      </div>
                      <div className="bg-slate-800/80 p-1.5 rounded-xl">
                        <span className="text-[10px] text-red-400 font-bold block">Gordura</span>
                        <span className="text-xs font-extrabold text-white">
                          {parsedResult.totals.fat}g
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Identified items list */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-600 block">
                      Alimentos Reconhecidos ({parsedResult.items.length}):
                    </span>
                    <div className="space-y-1.5">
                      {parsedResult.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-bold text-slate-800 block truncate">
                              {item.food.name}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {item.grams}g • P:{item.protein}g • C:{item.carbs}g • G:{item.fat}g
                            </span>
                          </div>
                          <span className="font-extrabold text-emerald-700 text-xs shrink-0">
                            {item.calories} kcal
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unmatched warning */}
                  {parsedResult.unmatched.length > 0 && (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-1.5">
                      <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        Não reconhecido: "{parsedResult.unmatched.join(', ')}". Verifique a grafia.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Catalog tab */
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Buscar na TACO..."
                value={catalogQuery}
                onChange={(e) => setCatalogQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none"
              />
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {catalogResults.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => {
                      addDiaryEntry(meal, food, 100);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 cursor-pointer flex justify-between items-center transition text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block">{food.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {food.calories} kcal/100g • P:{food.protein}g • C:{food.carbs}g
                      </span>
                    </div>
                    <Plus className="w-4 h-4 text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Confirm Button */}
        {activeTab === 'ai' && parsedResult && parsedResult.items.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-white">
            <button
              onClick={handleConfirmAddAll}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-sm shadow-lg transition flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Lançar Tudo no Diário ({parsedResult.totals.calories} kcal)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
