import { FoodItem } from '../types';
import tacoDataRaw from '../../taco_data.json';

export interface TacoRawItem {
  id: number;
  name: string;
  category: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sodium: number;
}

const POPULAR_EXTRAS: Omit<FoodItem, 'id'>[] = [
  { name: 'Tapioca (goma hidratada)', brand: 'Referência comum', category: 'Cereais e derivados', calories: 240, protein: 0.0, carbs: 60.0, fat: 0.0, fiber: 0.0, sodium: 2.0, source: 'taco' },
  { name: 'Purê de batata com leite e manteiga', brand: 'Referência comum', category: 'Preparações', calories: 89, protein: 2.0, carbs: 13.0, fat: 3.3, fiber: 1.2, sodium: 280.0, source: 'taco' },
  { name: 'Macarrão cozido simples', brand: 'Referência comum', category: 'Cereais e derivados', calories: 158, protein: 5.8, carbs: 30.9, fat: 0.9, fiber: 1.8, sodium: 1.0, source: 'taco' },
  { name: 'Polenta cozida', brand: 'Referência comum', category: 'Cereais e derivados', calories: 70, protein: 1.6, carbs: 15.0, fat: 0.3, fiber: 1.0, sodium: 80.0, source: 'taco' },
  { name: 'Omelete simples (2 ovos com fio de azeite)', brand: 'Referência comum', category: 'Ovos e derivados', calories: 154, protein: 10.6, carbs: 0.6, fat: 12.0, fiber: 0.0, sodium: 220.0, source: 'taco' },
  { name: 'Linguiça calabresa frita', brand: 'Referência comum', category: 'Carnes e derivados', calories: 320, protein: 16.0, carbs: 2.0, fat: 27.0, fiber: 0.0, sodium: 850.0, source: 'taco' },
  { name: 'Bacon frito', brand: 'Referência comum', category: 'Carnes e derivados', calories: 541, protein: 37.0, carbs: 1.4, fat: 42.0, fiber: 0.0, sodium: 1200.0, source: 'taco' },
  { name: 'Peito de peru defumado fatiado', brand: 'Referência comum', category: 'Carnes e derivados', calories: 108, protein: 19.0, carbs: 2.0, fat: 2.5, fiber: 0.0, sodium: 820.0, source: 'taco' },
  { name: 'Salsicha cozida', brand: 'Referência comum', category: 'Carnes e derivados', calories: 257, protein: 12.0, carbs: 3.0, fat: 22.0, fiber: 0.0, sodium: 790.0, source: 'taco' },
  { name: 'Filé de tilápia grelhado', brand: 'Referência comum', category: 'Pescados e frutos do mar', calories: 128, protein: 26.0, carbs: 0.0, fat: 2.7, fiber: 0.0, sodium: 65.0, source: 'taco' },
  { name: 'Atum sólido em lata ao natural (água)', brand: 'Referência comum', category: 'Pescados e frutos do mar', calories: 116, protein: 26.0, carbs: 0.0, fat: 1.0, fiber: 0.0, sodium: 320.0, source: 'taco' },
  { name: 'Iogurte grego natural', brand: 'Referência comum', category: 'Leite e derivados', calories: 120, protein: 5.0, carbs: 14.0, fat: 5.0, fiber: 0.0, sodium: 55.0, source: 'taco' },
  { name: 'Grão de bico cozido', brand: 'Referência comum', category: 'Leguminosas e derivados', calories: 164, protein: 8.9, carbs: 27.4, fat: 2.6, fiber: 7.6, sodium: 10.0, source: 'taco' },
  { name: 'Granola tradicional com castanhas', brand: 'Referência comum', category: 'Cereais e derivados', calories: 420, protein: 10.0, carbs: 64.0, fat: 14.0, fiber: 7.0, sodium: 45.0, source: 'taco' },
  { name: 'Pasta de amendoim integral', brand: 'Referência comum', category: 'Nozes e sementes', calories: 588, protein: 25.0, carbs: 20.0, fat: 50.0, fiber: 6.0, sodium: 5.0, source: 'taco' },
  { name: 'Pizza de muçarela fatia', brand: 'Referência comum', category: 'Preparações', calories: 286, protein: 12.0, carbs: 32.0, fat: 12.0, fiber: 2.0, sodium: 550.0, source: 'taco' },
  { name: 'Whey protein concentrado 80%', brand: 'Referência comum', category: 'Suplementos', calories: 400, protein: 80.0, carbs: 8.0, fat: 6.0, fiber: 0.0, sodium: 180.0, source: 'taco' },
];

export const ALIASES: Record<string, string> = {
  'arroz branco': 'Arroz, tipo 1, cozido',
  'pao frances': 'Pão, trigo, francês',
  'pao de sal': 'Pão, trigo, francês',
  'paozinho': 'Pão, trigo, francês',
  'mussarela': 'Queijo, mozarela',
  'mucarela': 'Queijo, mozarela',
  'aipim': 'Mandioca, cozida',
  'macaxeira': 'Mandioca, cozida',
  'coca cola': 'Refrigerante, tipo cola',
  'mamao papaya': 'Mamão, Papaia, cru',
  'cafe coado': 'Café, infusão 10%',
  'frango grelhado': 'Frango, peito, sem pele, grelhado',
  'carne moida': 'Carne, bovina, acém, moído, cozido',
  'ovo cozido': 'Ovo, de galinha, inteiro, cozido',
  'feijao carioca': 'Feijão, carioca, cozido',
  'feijao preto': 'Feijão, preto, cozido',
};

export function normalizeStr(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Convert taco data to FoodItem
export const ALL_TACO_FOODS: FoodItem[] = [
  ...(tacoDataRaw as TacoRawItem[]).map((item) => ({
    id: `taco-${item.id}`,
    name: item.name,
    brand: 'TACO - UNICAMP',
    category: item.category || 'Alimento TACO',
    calories: Number(item.calories) || 0,
    protein: Number(item.protein) || 0,
    fat: Number(item.fat) || 0,
    carbs: Number(item.carbs) || 0,
    fiber: Number(item.fiber) || 0,
    sodium: Number(item.sodium) || 0,
    source: 'taco' as const,
  })),
  ...POPULAR_EXTRAS.map((extra, idx) => ({
    id: `ref-${idx}`,
    ...extra,
  })),
];

// Distinct categories
export const FOOD_CATEGORIES = Array.from(
  new Set(ALL_TACO_FOODS.map((f) => f.category).filter(Boolean))
) as string[];

export function searchFoods(
  query: string,
  categoryFilter?: string,
  customFoods: FoodItem[] = [],
  limit = 50
): FoodItem[] {
  const qClean = normalizeStr(query);
  const aliasMatch = ALIASES[qClean];

  const pool = [...customFoods, ...ALL_TACO_FOODS];

  if (!qClean && !categoryFilter) {
    // Return standard popular foods by default
    return pool.slice(0, 30);
  }

  const results = pool.filter((food) => {
    if (categoryFilter && food.category !== categoryFilter) {
      return false;
    }
    if (!qClean) return true;

    const normName = normalizeStr(food.name);
    const normBrand = normalizeStr(food.brand || '');

    if (aliasMatch && normalizeStr(aliasMatch) === normName) {
      return true;
    }

    const tokens = qClean.split(' ').filter(Boolean);
    return tokens.every((token) => normName.includes(token) || normBrand.includes(token));
  });

  return results.slice(0, limit);
}
