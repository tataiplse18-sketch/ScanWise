import React from 'react';
import { motion } from 'motion/react';
import { Search, ScanLine, AlertTriangle, ChevronRight, Zap, Award, Heart } from 'lucide-react';
import { TRANSLATIONS, getScoreColor } from '../lib/constants';
import { Product, UserProfile } from '../types';

interface HomeViewProps {
  user: UserProfile;
  lang: 'en' | 'hi';
  recentScans: Product[];
  onNavigate: (screen: string, arg?: any) => void;
  onSelectCategory: (category: string) => void;
}

export default function HomeView({
  user,
  lang,
  recentScans,
  onNavigate,
  onSelectCategory,
}: HomeViewProps) {
  const t = TRANSLATIONS[lang];

  // Map category IDs to translation keys or text
  const categories = [
    { id: 'beverages', name: t.categories.beverages, emoji: '🥤' },
    { id: 'snacks', name: t.categories.snacks, emoji: '🍪' },
    { id: 'dairy', name: t.categories.dairy, emoji: '🥛' },
    { id: 'bakery', name: t.categories.bakery, emoji: '🍞' },
    { id: 'canned', name: t.categories.canned, emoji: '🥫' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6 pb-24"
    >
      {/* 1. Greeting */}
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          {t.home.greeting} {t.home.greetingEmoji}
        </p>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-1 leading-tight tracking-tight">
          {t.home.title}
        </h1>
      </div>

      {/* 2. Search Bar Trigger */}
      <div 
        id="home-search-trigger"
        onClick={() => onNavigate('search')}
        className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-3 cursor-pointer text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-all shadow-sm group"
      >
        <Search className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
        <span className="text-sm text-slate-400 dark:text-slate-500">
          {t.home.searchPlaceholder}
        </span>
      </div>

      {/* 3. Scan CTA Card */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('scan')}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-[24px] p-6 text-white shadow-lg cursor-pointer group"
      >
        {/* Decorative ambient circles */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute right-12 top-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />

        <div className="relative z-10 space-y-4">
          <div className="space-y-1.5 max-w-[80%]">
            <h2 className="text-xl font-bold tracking-tight">
              {t.home.scanTitle}
            </h2>
            <p className="text-xs text-white/95 leading-relaxed font-normal">
              {t.home.scanDesc}
            </p>
          </div>

          <button className="flex items-center gap-2.5 bg-white text-emerald-800 font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl shadow-md group-hover:bg-teal-50 transition-colors">
            <ScanLine className="w-4 h-4 text-emerald-600" />
            {t.home.scanBtn}
          </button>
        </div>
      </motion.div>

      {/* 4. Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div 
          onClick={() => onNavigate('favorites', 'history')}
          className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-[18px] p-3.5 text-center cursor-pointer hover:border-slate-200 dark:hover:border-slate-700 transition"
        >
          <div className="w-9 h-9 mx-auto mb-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center text-emerald-500 dark:text-emerald-400">
            <ScanLine className="w-5 h-5" />
          </div>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-155">{user.scanCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{t.home.scans}</p>
        </div>

        <div 
          onClick={() => onNavigate('profile')}
          className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-[18px] p-3.5 text-center cursor-pointer hover:border-slate-200 dark:hover:border-slate-700 transition"
        >
          <div className="w-9 h-9 mx-auto mb-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl flex items-center justify-center text-amber-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-155">{user.allergens.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{t.home.allergens}</p>
        </div>

        <div 
          onClick={() => onNavigate('favorites', 'favorites')}
          className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-[18px] p-3.5 text-center cursor-pointer hover:border-slate-200 dark:hover:border-slate-700 transition"
        >
          <div className="w-9 h-9 mx-auto mb-2 bg-amber-50/70 dark:bg-amber-950/20 rounded-xl flex items-center justify-center text-rose-500">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-155">{user.favoriteCount}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{t.common.saved}</p>
        </div>
      </div>

      {/* 5. Allergen Banner */}
      {user.allergens.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-amber-50/40 dark:from-amber-950/15 dark:to-transparent border-2 border-amber-300/60 dark:border-amber-900/40 rounded-[18px] p-4 flex gap-3 shadow-xs">
          <div className="p-1 text-lg">⚠️</div>
          <div className="flex-1 space-y-1">
            <h3 className="text-xs font-bold text-amber-800 dark:text-amber-300">
              {t.home.allergenAlertTitle}
            </h3>
            <p className="text-xs text-amber-700/90 dark:text-amber-400/80 leading-relaxed font-normal">
              {t.home.allergenAlertDesc.replace('{count}', String(user.allergens.length))}
            </p>
            <div 
              onClick={() => onNavigate('profile')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1 cursor-pointer hover:underline"
            >
              {t.home.allergenAlertAction}
            </div>
          </div>
        </div>
      )}

      {/* 6. Browse Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          {t.home.browseCategories}
        </h3>
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x mask-x-edges -mx-1 px-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap shadow-xs snap-center transition active:scale-95 cursor-pointer"
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 7. Recent Scans */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            {t.home.recentScans}
          </h3>
          <button 
            onClick={() => onNavigate('favorites', 'history')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline"
          >
            {t.common.seeAll}
          </button>
        </div>

        <div className="space-y-2.5">
          {recentScans.slice(0, 3).map((prod) => {
            const scoreDetails = getScoreColor(prod.score);
            return (
              <motion.div
                key={prod.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => onNavigate('product', prod.id)}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 hover:dark:border-slate-600/80 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:shadow-xs transition duration-200 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-200">
                    {prod.emoji}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-50 group-hover:text-emerald-500 transition-colors line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {prod.brand}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-400 mr-1 hidden sm:inline">
                    {prod.scannedAt}
                  </span>
                  <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-extrabold ${scoreDetails.bg} ${scoreDetails.text} border ${scoreDetails.border}`}>
                    <span className="text-sm leading-none">{prod.score}</span>
                    <span className="text-[8px] opacity-75 mt-0.5">/10</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
