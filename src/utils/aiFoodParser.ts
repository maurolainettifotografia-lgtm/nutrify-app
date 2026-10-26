import { ALL_TACO_FOODS, normalizeStr, ALIASES } from '../data/tacoFoods';
import { FoodItem } from '../types';

export interface ParsedFoodResult {
  rawText: string;
  food: FoodItem;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

export interface ParseBatchResult {
  items: ParsedFoodResult[];
  unmatched: string[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
    totalGrams: number;
  };
}

// Unit conversion helpers
const UNIT_MULTIPLIERS: Record<string, number> = {
  g: 1,
  gr: 1,
  grama: 1,
  gramas: 1,
  kg: 1000,
  kilo: 1000,
  quilo: 1000,
  ml: 1,
  colher: 25,
  colheres: 25,
  'colher de sopa': 25,
  'colheres de sopa': 25,
  'colher de cha': 8,
  concha: 130,
  conchas: 130,
  fatia: 30,
  fatias: 30,
  ovo: 50,
  ovos: 50,
  unidade: 100,
  unidades: 100,
  copo: 200,
  copos: 200,
  prato: 300,
  pratos: 300,
  porcao: 100,
  porcoes: 100,
  scoop: 30,
  scoops: 30,
};

// Common direct mappings to best TACO items
const COMMON_MAPPINGS: Record<string, string> = {
  arroz: 'Arroz, tipo 1, cozido',
  'arroz branco': 'Arroz, tipo 1, cozido',
  'arroz integral': 'Arroz, integral, cozido',
  feijao: 'Feijão, carioca, cozido',
  'feijao carioca': 'Feijão, carioca, cozido',
  'feijao preto': 'Feijão, preto, cozido',
  frango: 'Frango, peito, sem pele, grelhado',
  'peito de frango': 'Frango, peito, sem pele, grelhado',
  'frango grelhado': 'Frango, peito, sem pele, grelhado',
  carne: 'Carne, bovina, acém, moído, cozido',
  'carne moida': 'Carne, bovina, acém, moído, cozido',
  patinho: 'Carne, bovina, patinho, sem gordura, grelhado',
  'carne bovina': 'Carne, bovina, alcatra, sem gordura, grelhada',
  ovo: 'Ovo, de galinha, inteiro, cozido',
  ovos: 'Ovo, de galinha, inteiro, cozido',
  'ovo cozido': 'Ovo, de galinha, inteiro, cozido',
  'ovo frito': 'Omelete simples (2 ovos com fio de azeite)',
  omelete: 'Omelete simples (2 ovos com fio de azeite)',
  batata: 'Batata, inglesa, cozida',
  'batata inglesa': 'Batata, inglesa, cozida',
  'batata doce': 'Batata, doce, cozida',
  mandioca: 'Mandioca, cozida',
  aipim: 'Mandioca, cozida',
  macaxeira: 'Mandioca, cozida',
  macarrao: 'Macarrão cozido simples',
  pasta: 'Macarrão cozido simples',
  tapioca: 'Tapioca (goma hidratada)',
  pure: 'Purê de batata com leite e manteiga',
  'pure de batata': 'Purê de batata com leite e manteiga',
  tilapia: 'Filé de tilápia grelhado',
  peixe: 'Filé de tilápia grelhado',
  salmao: 'Pescado, filhote, cru',
  atum: 'Atum sólido em lata ao natural (água)',
  whey: 'Whey protein concentrado 80%',
  'whey protein': 'Whey protein concentrado 80%',
  aveia: 'Aveia, flocos, crua',
  banana: 'Banana, prata, crua',
  maca: 'Maçã, fuji, com casca',
  mamao: 'Mamão, Papaia, cru',
  abacate: 'Abacate, cru',
  leite: 'Leite, de vaca, desnatado, pó',
  'leite integral': 'Leite, de vaca, integral',
  queijo: 'Queijo, mozarela',
  mussarela: 'Queijo, mozarela',
  mucarela: 'Queijo, mozarela',
  'queijo minas': 'Queijo, minas, frescal',
  requeijao: 'Requeijão, cremoso',
  iogurte: 'Iogurte grego natural',
  azeite: 'Azeite, de oliva, extravirgem',
  'pasta de amendoim': 'Pasta de amendoim integral',
  castanha: 'Castanha-de-caju, torrada, salgada',
  alface: 'Alface, lisa, crua',
  tomate: 'Tomate, com semente, cru',
  cenoura: 'Cenoura, cozida',
  brocolis: 'Brócolis, cozido',
};

export function parseFreeTextMeal(input: string, customFoods: FoodItem[] = []): ParseBatchResult {
  if (!input || !input.trim()) {
    return {
      items: [],
      unmatched: [],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0, totalGrams: 0 },
    };
  }

  // Split lines, semicolons, commas, " e ", "+"
  const segments = input
    .split(/[\n;+]|\s+e\s+|(?<=\D),(?=\D)|(?<=\w),(?=\s*\d)|(?<=\D),(?=\s*[a-zA-Z])/gi)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  const parsedItems: ParsedFoodResult[] = [];
  const unmatched: string[] = [];

  const allFoodPool = [...customFoods, ...ALL_TACO_FOODS];

  for (const seg of segments) {
    const normSeg = normalizeStr(seg);

    // 1. Extract quantity and unit
    // Match patterns like: "150gr", "150g", "150 gramas", "2 ovos", "1 colher de sopa", "1.5 kg"
    let grams = 100; // default 100g
    let cleanedFoodQuery = normSeg;

    const qtyRegex =
      /(\d+(?:[.,]\d+)?)\s*(gr|gramas|g|kg|quilos|colheres de sopa|colher de sopa|colheres|colher|conchas|concha|fatias|fatia|ovos|ovo|unidades|unidade|copos|copo|scoops|scoop|pratos|prato)?\b/i;
    const match = normSeg.match(qtyRegex);

    if (match) {
      const numStr = match[1].replace(',', '.');
      const num = parseFloat(numStr);
      const unit = match[2] ? normalizeStr(match[2]) : 'g';

      if (!isNaN(num) && num > 0) {
        const mult = UNIT_MULTIPLIERS[unit] || 1;
        grams = Math.round(num * mult);
      }

      // Remove quantity and unit from the string
      cleanedFoodQuery = normSeg.replace(match[0], '').replace(/\b(de|do|da|com|em)\b/g, ' ').trim();
    } else {
      cleanedFoodQuery = normSeg.replace(/\b(de|do|da|com|em)\b/g, ' ').trim();
    }

    if (!cleanedFoodQuery) {
      continue;
    }

    // 2. Search for the best match
    let bestFood: FoodItem | null = null;

    // Check direct common mappings first
    if (COMMON_MAPPINGS[cleanedFoodQuery]) {
      const targetName = COMMON_MAPPINGS[cleanedFoodQuery];
      bestFood = allFoodPool.find((f) => f.name === targetName) || null;
    }

    // Check aliases
    if (!bestFood && ALIASES[cleanedFoodQuery]) {
      const aliasTarget = ALIASES[cleanedFoodQuery];
      bestFood = allFoodPool.find((f) => f.name === aliasTarget) || null;
    }

    // Check custom foods exact match
    if (!bestFood) {
      bestFood = customFoods.find((f) => normalizeStr(f.name).includes(cleanedFoodQuery)) || null;
    }

    // General keyword scoring against TACO database
    if (!bestFood) {
      const tokens = cleanedFoodQuery.split(' ').filter((t) => t.length > 2);
      let highestScore = 0;

      for (const food of allFoodPool) {
        const foodNorm = normalizeStr(food.name);
        let score = 0;

        if (foodNorm === cleanedFoodQuery) {
          score += 100;
        } else if (foodNorm.startsWith(cleanedFoodQuery)) {
          score += 60;
        } else if (foodNorm.includes(cleanedFoodQuery)) {
          score += 40;
        }

        for (const token of tokens) {
          if (foodNorm.includes(token)) {
            score += 15;
          }
        }

        // Give slight preference to cooked/grelhado if query doesn't specify cru
        if (score > 0 && !cleanedFoodQuery.includes('cru') && foodNorm.includes('cozido')) {
          score += 5;
        }
        if (score > 0 && !cleanedFoodQuery.includes('cru') && foodNorm.includes('grelhado')) {
          score += 5;
        }

        if (score > highestScore && score >= 15) {
          highestScore = score;
          bestFood = food;
        }
      }
    }

    if (bestFood && grams > 0) {
      const factor = grams / 100;
      parsedItems.push({
        rawText: seg,
        food: bestFood,
        grams,
        calories: Math.round(bestFood.calories * factor),
        protein: Math.round(bestFood.protein * factor * 10) / 10,
        carbs: Math.round(bestFood.carbs * factor * 10) / 10,
        fat: Math.round(bestFood.fat * factor * 10) / 10,
        fiber: Math.round((bestFood.fiber || 0) * factor * 10) / 10,
        sodium: Math.round((bestFood.sodium || 0) * factor),
      });
    } else {
      unmatched.push(seg);
    }
  }

  const totals = {
    calories: Math.round(parsedItems.reduce((s, i) => s + i.calories, 0)),
    protein: Math.round(parsedItems.reduce((s, i) => s + i.protein, 0) * 10) / 10,
    carbs: Math.round(parsedItems.reduce((s, i) => s + i.carbs, 0) * 10) / 10,
    fat: Math.round(parsedItems.reduce((s, i) => s + i.fat, 0) * 10) / 10,
    fiber: Math.round(parsedItems.reduce((s, i) => s + i.fiber, 0) * 10) / 10,
    sodium: Math.round(parsedItems.reduce((s, i) => s + i.sodium, 0)),
    totalGrams: parsedItems.reduce((s, i) => s + i.grams, 0),
  };

  return { items: parsedItems, unmatched, totals };
}
