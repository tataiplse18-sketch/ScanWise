import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, X, SlidersHorizontal, ChevronRight, TrendingUp, AlertCircle } from 'lucide-react';
import { TRANSLATIONS, getScoreColor } from '../lib/constants';
import { Product } from '../types';

interface SearchViewProps {
  lang: 'en' | 'hi';
  mockProductsList: Product[];
  onNavigate: (screen: string, arg?: any) => void;
  initialFilter?: string; // Optional category filter passed from home
  onClearCategoryFilter: () => void;
}

export default function SearchView({
  lang,
  mockProductsList,
  onNavigate,
  initialFilter,
  onClearCategoryFilter,
}: SearchViewProps) {
  const t = TRANSLATIONS[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Good' | 'Mod' | 'Low' | 'GlutenFree'>('All');
  const [sortByScore, setSortByScore] = useState(true);

  // Trending search suggestions
  const trendingSearches = [
    { text: 'Orange Juice', query: 'Orange' },
    { text: 'Amul Milk', query: 'Milk' },
    { text: 'Biscuits', query: 'Biscuits' },
    { text: 'Marie Gold', query: 'Marie' },
  ];

  // Map category filter to query if active
  React.useEffect(() => {
    if (initialFilter) {
      if (initialFilter === 'beverages') setSearchQuery('Orange');
      else if (initialFilter === 'snacks') setSearchQuery('Biscuit');
      else if (initialFilter === 'dairy') setSearchQuery('Milk');
      else if (initialFilter === 'bakery') setSearchQuery('Marie');
      else if (initialFilter === 'canned') setSearchQuery('Noodles');
      setActiveFilter('All');
    }
  }, [initialFilter]);

  // Compute filtered search results
  const filteredProducts = useMemo(() => {
    let result = [...mockProductsList];

    // Filter by text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.barcode.includes(q)
      );
    }

    // Filter by score / allergen badge filters
    if (activeFilter === 'Good') {
      result = result.filter((p) => p.score >= 7);
    } else if (activeFilter === 'Mod') {
      result = result.filter((p) => p.score >= 4 && p.score < 7);
    } else if (activeFilter === 'Low') {
      result = result.filter((p) => p.score < 4);
    } else if (activeFilter === 'GlutenFree') {
      result = result.filter((p) => !p.allergens.includes('Gluten'));
    }

    // Sorting by score descending
    if (sortByScore) {
      result.sort((a, b) => b.score - a.score);
    }

    return result;
  }, [searchQuery, activeFilter, sortByScore, mockProductsList]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 pb-24"
    >
      {/* 1. Active Search Input bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-emerald-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (initialFilter) onClearCategoryFilter();
          }}
          placeholder={t.search.placeholder}
          className="w-full bg-white dark:bg-slate-800 border-2 border-emerald-500 dark:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none rounded-2xl pl-11 pr-11 py-3.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              onClearCategoryFilter();
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4.5 h-4.5 bg-slate-100 dark:bg-slate-700/60 p-0.5 rounded-full" />
          </button>
        )}
      </div>

      {/* 2. Filter Chips Scroll Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x -mx-1 px-1">
        {[
          { id: 'All', label: t.search.filterAll },
          { id: 'Good', label: t.search.filterGood },
          { id: 'Mod', label: t.search.filterModerate },
          { id: 'Low', label: t.search.filterLow },
          { id: 'GlutenFree', label: t.search.filterGlutenFree },
        ].map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap snap-center transition cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-emerald-500 text-white border border-transparent shadow-xs shadow-emerald-500/10'
                  : 'bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 border border-slate-200 dark:border-slate-700/80'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Helper label for category filters */}
      {initialFilter && (
        <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 text-xs px-3.5 py-2.5 rounded-xl flex items-center justify-between text-emerald-800 dark:text-emerald-400">
          <span>Active filter: <b>{initialFilter} category</b></span>
          <button onClick={onClearCategoryFilter} className="text-[10px] font-bold text-emerald-600 hover:underline">
            CLEAR
          </button>
        </div>
      )}

      {/* 3. Results count summary & sort triggers */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <span>
          {filteredProducts.length} {t.search.results}{' '}
          {searchQuery ? `"${searchQuery}"` : 'all products'}
        </span>
        <button
          onClick={() => setSortByScore(!sortByScore)}
          className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>{sortByScore ? t.search.sortScore : 'Match ↓'}</span>
        </button>
      </div>

      {/* 4. Results List rendering */}
      <div className="space-y-3">
        {filteredProducts.map((p) => {
          const scoreDetails = getScoreColor(p.score);
          return (
            <motion.div
              key={p.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => onNavigate('product', p.id)}
              className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:shadow-xs transition duration-200 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-200">
                  {p.emoji}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-50 line-clamp-1 group-hover:text-emerald-500 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {p.brand}
                  </p>
                  
                  {/* Custom alert labels */}
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-450 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded uppercase tracking-wider">
                      {p.quantity.split(' ')[0]}
                    </span>
                    {p.allergens.includes('Gluten') ? (
                      <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 px-2 py-0.5 rounded uppercase tracking-wider">
                        Gluten
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 px-2 py-0.5 rounded uppercase tracking-wider">
                        Gluten-Free
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-extrabold ${scoreDetails.bg} ${scoreDetails.text} border ${scoreDetails.border}`}>
                  <span className="text-sm leading-none">{p.score}</span>
                  <span className="text-[8px] opacity-75 mt-0.5">/10</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              </div>
            </motion.div>
          );
        })}

        {/* 5. Empty State display */}
        {filteredProducts.length === 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-3xl text-center space-y-3.5 border border-slate-100 dark:border-slate-800/50 max-w-sm mx-auto">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {lang === 'hi' ? 'कोई उत्पाद नहीं मिला!' : 'No exact food products found'}
              </h4>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-normal font-normal">
                {lang === 'hi'
                  ? 'अतिरिक्त खोज मापदंड या अन्य शब्दावली का प्रयोग करें।'
                  : 'Try typing other keywords or check one of our popular quick queries below.'}
              </p>
            </div>
            
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('All');
              }}
              className="text-xs font-bold text-emerald-500 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Trending / Recent suggestions Section */}
      <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          {lang === 'hi' ? 'लोकप्रिय खोजें' : 'Trending food searches'}
        </h4>

        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((item) => (
            <button
              key={item.text}
              onClick={() => setSearchQuery(item.query)}
              className="bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-100 dark:border-slate-700/60 transition cursor-pointer"
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
