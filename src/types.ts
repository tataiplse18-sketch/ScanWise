export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  initials: string;
  joinedDate: string;
  country: string;
  streak: number;
  scanCount: number;
  favoriteCount: number;
  allergens: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  quantity: string;
  emoji: string;
  barcode: string;
  score: number;
  nutriScore: string;
  novaGroup: number;
  allergens: string[];
  calories: number;
  totalFat: number;
  carbs: number;
  sugars: number;
  protein: number;
  fiber: number;
  aiSummary: string;
  aiTags: string[];
  isFavorite: boolean;
  scannedAt: string;
}

export interface AllergenItem {
  id: string;
  name: string;
  emoji: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  emoji: string;
}

export interface AlternativeItem {
  id: string;
  name: string;
  brand: string;
  emoji: string;
  score: number;
}

export interface SearchResultItem {
  id: string;
  name: string;
  brand: string;
  emoji: string;
  score: number;
  badges: { text: string; color: 'green' | 'amber' | 'red' }[];
}
