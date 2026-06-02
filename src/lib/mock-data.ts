import { Product, UserProfile, AllergenItem, CategoryItem, AlternativeItem, SearchResultItem } from '../types';

export const mockUser: UserProfile = {
  id: '1',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@email.com',
  avatar: null,
  initials: 'R',
  joinedDate: 'Jan 2026',
  country: '🇮🇳 India',
  streak: 7,
  scanCount: 47,
  favoriteCount: 12,
  allergens: ['Peanuts', 'Dairy', 'Gluten'],
};

export const mockAllergens: AllergenItem[] = [
  { id: '1', name: 'Peanuts', emoji: '🥜' },
  { id: '2', name: 'Dairy', emoji: '🥛' },
  { id: '3', name: 'Gluten', emoji: '🌾' },
];

export const mockCategories: CategoryItem[] = [
  { id: '1', name: 'Beverages', emoji: '🥤' },
  { id: '2', name: 'Snacks', emoji: '🍪' },
  { id: '3', name: 'Dairy', emoji: '🥛' },
  { id: '4', name: 'Bakery', emoji: '🍞' },
  { id: '5', name: 'Canned', emoji: '🥫' },
];

export const mockProducts: Product[] = [
  {
    id: '1', name: 'Tropicana Orange Juice', brand: 'PepsiCo India Holdings',
    quantity: '1 Litre · Tetra Pack', emoji: '🥤', barcode: '8901234567890',
    score: 8.2, nutriScore: 'B', novaGroup: 2, allergens: ['Dairy'],
    calories: 45, totalFat: 0.1, carbs: 10.4, sugars: 9.2, protein: 0.7, fiber: 0.2,
    aiSummary: "This orange juice is a good source of Vitamin C, providing about 120% daily value per serving. However, it contains 9.2g of natural sugars per 100ml with no added fiber. Best consumed in moderation — consider diluting with water or pairing with a protein-rich meal to reduce glycemic impact.",
    aiTags: ['High Vitamin C', 'Natural Sugar', 'Low Fiber'],
    isFavorite: true, scannedAt: '2 days ago',
  },
  {
    id: '2', name: 'Parle-G Biscuits', brand: 'Parle Products',
    quantity: '100g', emoji: '🍪', barcode: '8902345678901',
    score: 4.5, nutriScore: 'D', novaGroup: 4, allergens: ['Gluten', 'Dairy'],
    calories: 462, totalFat: 18.2, carbs: 68.5, sugars: 28.3, protein: 6.5, fiber: 1.8,
    aiSummary: "Parle-G is high in sugar and saturated fat with minimal fiber content. While it provides quick energy, it's classified as ultra-processed (NOVA 4). Consider switching to oat-based biscuits for better nutritional value.",
    aiTags: ['High Sugar', 'Ultra-Processed', 'Low Fiber'],
    isFavorite: false, scannedAt: '1 day ago',
  },
  {
    id: '3', name: 'Amul Toned Milk', brand: 'Amul',
    quantity: '500ml', emoji: '🥛', barcode: '8903456789012',
    score: 7.8, nutriScore: 'A', novaGroup: 1, allergens: ['Dairy'],
    calories: 52, totalFat: 3.0, carbs: 4.8, sugars: 4.8, protein: 3.3, fiber: 0,
    aiSummary: "Amul Toned Milk is an excellent source of protein and calcium with minimal processing. Great for daily consumption. The toned variety has reduced fat while maintaining protein content.",
    aiTags: ['High Protein', 'Good Calcium', 'Minimally Processed'],
    isFavorite: true, scannedAt: '3 days ago',
  },
  {
    id: '4', name: 'Maggi 2-Minute Noodles', brand: 'Nestlé India',
    quantity: '140g (2 blocks)', emoji: '🥘', barcode: '8904567890123',
    score: 4.2, nutriScore: 'D', novaGroup: 4, allergens: ['Gluten'],
    calories: 385, totalFat: 15.2, carbs: 54.6, sugars: 2.1, protein: 8.4, fiber: 2.0,
    aiSummary: "Maggi noodles are high in sodium and classified as ultra-processed. The tastemaker contains significant salt. Consider adding fresh vegetables and reducing the tastemaker to half for a healthier meal.",
    aiTags: ['High Sodium', 'Ultra-Processed', 'Quick Meal'],
    isFavorite: false, scannedAt: 'Today, 2:30 PM',
  },
  {
    id: '5', name: 'Amul Butter', brand: 'Amul',
    quantity: '100g', emoji: '🧈', barcode: '8905678901234',
    score: 3.1, nutriScore: 'E', novaGroup: 2, allergens: ['Dairy'],
    calories: 717, totalFat: 81.1, carbs: 0.5, sugars: 0.5, protein: 0.9, fiber: 0,
    aiSummary: "Amul Butter is very high in saturated fat (81% fat content). Use sparingly as a cooking fat. Consider switching to olive oil or Amul Lite for lower fat alternatives.",
    aiTags: ['Very High Fat', 'Saturated Fat', 'Use Sparingly'],
    isFavorite: false, scannedAt: 'Today, 11:15 AM',
  },
  {
    id: '6', name: 'Nescafé Classic', brand: 'Nestlé India',
    quantity: '200g jar', emoji: '☕', barcode: '8906789012345',
    score: 7.5, nutriScore: 'A', novaGroup: 1, allergens: [],
    calories: 2, totalFat: 0, carbs: 0.3, sugars: 0, protein: 0.1, fiber: 0,
    aiSummary: "Black coffee is virtually calorie-free and rich in antioxidants. Moderate consumption (2-3 cups/day) is associated with various health benefits. Avoid adding excessive sugar or cream.",
    aiTags: ['Zero Calorie', 'Antioxidants', 'Moderate Use'],
    isFavorite: true, scannedAt: 'Yesterday, 8:00 AM',
  },
  {
    id: '7', name: 'India Gate Basmati Rice', brand: 'KRBL Limited',
    quantity: '5kg', emoji: '🍚', barcode: '8907890123456',
    score: 8.5, nutriScore: 'A', novaGroup: 1, allergens: [],
    calories: 360, totalFat: 0.6, carbs: 78.2, sugars: 0.1, protein: 7.1, fiber: 0.8,
    aiSummary: "Basmati rice has a lower glycemic index compared to regular white rice. It's minimally processed and a staple grain. Pair with dal and vegetables for a complete balanced meal.",
    aiTags: ['Low GI', 'Minimally Processed', 'Good Staple'],
    isFavorite: true, scannedAt: '5 days ago',
  },
  {
    id: '8', name: 'Marie Gold Biscuits', brand: 'Britannia',
    quantity: '250g', emoji: '🍪', barcode: '8908901234567',
    score: 6.8, nutriScore: 'C', novaGroup: 3, allergens: ['Gluten'],
    calories: 425, totalFat: 12.5, carbs: 70.2, sugars: 18.6, protein: 7.2, fiber: 3.1,
    aiSummary: "Marie Gold offers moderate nutrition with decent fiber content. Lower in sugar compared to cream biscuits. A reasonable tea-time snack when consumed in moderation.",
    aiTags: ['Moderate Sugar', 'Some Fiber', 'Tea-time Snack'],
    isFavorite: true, scannedAt: '1 week ago',
  },
];

export const mockAlternatives: AlternativeItem[] = [
  { id: 'a1', name: 'Real Activ 100%', brand: 'Dabur', emoji: '🧃', score: 8.8 },
  { id: 'a2', name: 'Paper Boat', brand: 'Hector Beverages', emoji: '🍊', score: 8.5 },
  { id: 'a3', name: 'B Natural Mixed', brand: 'ITC Limited', emoji: '🍋', score: 8.0 },
];

export const mockSearchResults: SearchResultItem[] = [
  { id: '2', name: 'Parle-G Gold Biscuits', brand: 'Parle Products · 200g', emoji: '🍪', score: 4.5, badges: [{ text: 'Mid Sugar', color: 'amber' }, { text: 'Contains Gluten', color: 'red' }] },
  { id: '8', name: 'Marie Gold', brand: 'Britannia · 250g', emoji: '🍪', score: 6.8, badges: [{ text: 'Low Sugar', color: 'green' }, { text: 'Contains Gluten', color: 'red' }] },
  { id: '9', name: 'Dark Fantasy', brand: 'Sunfeast · 75g', emoji: '🍪', score: 3.2, badges: [{ text: 'High Sugar', color: 'amber' }, { text: 'Contains Gluten', color: 'red' }] },
  { id: '10', name: 'Oatmeal Digestive', brand: "McVitie's · 150g", emoji: '🍪', score: 7.1, badges: [{ text: 'High Fiber', color: 'green' }, { text: 'Contains Gluten', color: 'amber' }] },
];
