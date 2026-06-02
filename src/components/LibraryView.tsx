import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Clock, Award, Flame, Calendar, ChevronRight, LayoutGrid, Trash2 } from 'lucide-react';
import { TRANSLATIONS, getScoreColor } from '../lib/constants';
import { Product, UserProfile } from '../types';

interface LibraryViewProps {
  user: UserProfile;
  lang: 'en' | 'hi';
  favorites: Product[];
  history: Product[];
  onNavigate: (screen: string, arg?: any) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
  initialTab?: 'favorites' | 'history';
}

export default function LibraryView({
  user,
  lang,
  favorites,
  history,
  onNavigate,
  onToggleFavorite,
  onClearHistory,
  initialTab = 'favorites',
}: LibraryViewProps) {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>(initialTab);

  // Group history items by scanner dates
  const groupedHistory = React.useMemo(() => {
    const groups: Record<string, Product[]> = {};
    history.forEach((prod) => {
      let dateLabel = prod.scannedAt || 'Today';
      // Normalize labels
      if (dateLabel.toLowerCase().includes('today')) dateLabel = lang === 'hi' ? 'आज' : 'Today';
      else if (dateLabel.toLowerCase().includes('yesterday')) dateLabel = lang === 'hi' ? 'कल' : 'Yesterday';
      else if (dateLabel.toLowerCase().includes('1 day')) dateLabel = lang === 'hi' ? 'कल' : 'Yesterday';
      else dateLabel = lang === 'hi' ? 'पहले के स्कैन' : 'Earlier Scanned';

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(prod);
    });
    return groups;
  }, [history, lang]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-5 pb-24"
    >
      {/* 1. Page Title */}
      <div className="flex justify-between items-baseline">
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 leading-none tracking-tight">
          {t.favorites.title}
        </h1>
        {activeTab === 'history' && history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete All
          </button>
        )}
      </div>

      {/* 2. Tab switcher segment wrapper */}
      <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-white dark:bg-slate-700 text-slate-850 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'text-rose-500 fill-current' : ''}`} />
          {t.favorites.tabFavorites}
          <span className="text-[10px] bg-slate-205 dark:bg-slate-900 px-1.5 py-0.5 rounded-md font-black">
            {favorites.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
            activeTab === 'history'
              ? 'bg-white dark:bg-slate-700 text-slate-850 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-emerald-500" />
          {t.favorites.tabHistory}
          <span className="text-[10px] bg-slate-205 dark:bg-slate-900 px-1.5 py-0.5 rounded-md font-black">
            {history.length}
          </span>
        </button>
      </div>

      {/* 3. Day Scan Streak Banner */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-100/35 dark:from-slate-900 dark:to-slate-800 border-2 border-amber-300 dark:border-amber-900/40 p-4 rounded-2xl relative overflow-hidden flex items-center justify-between shadow-xs">
        {/* Background bubbles decoration */}
        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-500/10 rounded-full blur-xl" />
        
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-11 h-11 bg-gradient-to-tr from-amber-300 to-amber-500 rounded-xl flex items-center justify-center shadow-md animate-pulse">
            <Flame className="w-6 h-6 text-slate-950 fill-current" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-50">
              {user.streak} {t.favorites.streakTitle}
            </h3>
            <p className="text-[11px] text-slate-550 dark:text-slate-400 font-normal mt-0.5 max-w-[85%] leading-relaxed">
              {t.favorites.streakDesc}
            </p>
          </div>
        </div>

        <span className="text-3xl font-black text-amber-50s shrink-0 opacity-80 text-amber-600 dark:text-amber-500 border border-amber-300/40 dark:border-amber-850 bg-white dark:bg-slate-800/80 px-3.5 py-1.5 rounded-xl">
          {user.streak}
        </span>
      </div>

      {/* 4. Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'favorites' ? (
          <motion.div
            key="favs"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 gap-3.5">
                {favorites.map((p) => {
                  const scoreDetails = getScoreColor(p.score);
                  return (
                    <motion.div
                      key={p.id}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 space-y-3.5 relative flex flex-col justify-between hover:border-emerald-500/40 transition cursor-pointer group"
                    >
                      {/* Heart action overlay */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(p.id);
                        }}
                        className="absolute right-3 top-3 w-7 h-7 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-rose-500 shadow-xs active:scale-90 hover:bg-rose-50 cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <div 
                        onClick={() => onNavigate('product', p.id)}
                        className="space-y-2 flex-1"
                      >
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform duration-200">
                          {p.emoji}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-emerald-500 transition-colors">
                            {p.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{p.brand}</p>
                        </div>
                      </div>

                      <div 
                        onClick={() => onNavigate('product', p.id)}
                        className="flex items-center justify-between border-t border-slate-100/60 dark:border-slate-750 pt-3"
                      >
                        <div className={`px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 font-extrabold ${scoreDetails.bg} ${scoreDetails.text} border ${scoreDetails.border}`}>
                          <span className="text-[11px] leading-none">{p.score}</span>
                          <span className="text-[7px] opacity-75">/10</span>
                        </div>
                        <span className="text-[9px] text-slate-300 dark:text-slate-550 hidden sm:inline truncate">
                          {p.scannedAt}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400 py-12 max-w-xs mx-auto">
                <Heart className="w-8 h-8 text-slate-300 dark:text-slate-650 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205">No saved items yet</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed mt-1">
                  {lang === 'hi'
                    ? 'अपनी पसंदीदा खाद्य वस्तुओं को सुरक्षित रखने के लिए दिल वाले चिह्न पर क्लिक करें।'
                    : 'Tap the heart icon on any food item card details to save and build your custom library.'}
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="hist"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {history.length > 0 ? (
              Object.keys(groupedHistory).map((dateLabel) => (
                <div key={dateLabel} className="space-y-2.5">
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {dateLabel}
                  </h4>

                  <div className="space-y-2">
                    {groupedHistory[dateLabel].map((p) => {
                      const scoreDetails = getScoreColor(p.score);
                      return (
                        <motion.div
                          key={p.id}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => onNavigate('product', p.id)}
                          className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 flex justify-between items-center cursor-pointer hover:shadow-xs transition group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-xl group-hover:scale-105 transition-transform duration-200">
                              {p.emoji}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-500 transition-colors line-clamp-1">
                                {p.name}
                              </h5>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                                {p.brand}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className={`w-8.5 h-8.5 rounded-lg flex flex-col items-center justify-center font-black ${scoreDetails.bg} ${scoreDetails.text} border ${scoreDetails.border}`}>
                              <span className="text-xs leading-none">{p.score}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400 py-12 max-w-xs mx-auto">
                <Clock className="w-8 h-8 text-slate-300 dark:text-slate-650 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205">No history yet</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed mt-1">
                  {lang === 'hi'
                    ? 'हाल के स्कैन की सूची खाली है। बारकोड स्कैनर का प्रयास करें!'
                    : 'Scan barcodes to instantly maintain a detailed timeline diary of all foods.'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
