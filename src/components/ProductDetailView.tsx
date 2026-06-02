import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Share2, AlertTriangle, ShieldCheck, Sparkles, Scale, Info, ArrowUpRight } from 'lucide-react';
import { TRANSLATIONS, getScoreColor, getScoreLabel, getNutriScoreColor, getNovaGroupColor } from '../lib/constants';
import { Product, AlternativeItem } from '../types';

interface ProductDetailViewProps {
  product: Product;
  userAllergens: string[];
  lang: 'en' | 'hi';
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onNavigate: (screen: string, arg?: any) => void;
  alternativesList: AlternativeItem[];
}

export default function ProductDetailView({
  product,
  userAllergens,
  lang,
  isFavorite,
  onToggleFavorite,
  onNavigate,
  alternativesList,
}: ProductDetailViewProps) {
  const t = TRANSLATIONS[lang];
  const scoreDetails = getScoreColor(product.score);
  const [copyStatus, setCopyStatus] = useState(false);

  // Check if this product triggers any allergen alerts for the user
  const matchingAllergens = product.allergens.filter((a) =>
    userAllergens.some((ua) => ua.toLowerCase() === a.toLowerCase())
  );

  const handleShare = () => {
    // Simulated copy toast
    setCopyStatus(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`ScanWise Food Score for ${product.name}: ${product.score}/10! Check it out.`);
    }
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-28"
    >
      {/* Sticky top bar (simulated) */}
      <div className="flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 py-3 z-20">
        <button
          onClick={() => onNavigate('home')}
          className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {copyStatus && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/45 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
              Copied!
            </span>
          )}
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={() => onToggleFavorite(product.id)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition ${
              isFavorite
                ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-500'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* 2. Product Hero */}
      <div className="flex items-center gap-5 mt-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-3xl border border-slate-100 dark:border-slate-800/40">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-950/20 dark:to-emerald-900/20 border border-emerald-100/30 flex items-center justify-center text-5xl relative shadow-sm">
          <span>{product.emoji}</span>
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-850 px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-400 tracking-wider shadow-xs border border-slate-100 dark:border-slate-800 uppercase">
            {product.quantity.split(' ')[0]}
          </div>
        </div>
        
        <div className="space-y-1.5 flex-1 min-w-0">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 leading-tight leading-snug break-words">
            {product.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-450 line-clamp-1">{product.brand}</p>
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider bg-slate-100/80 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              Barcode: {product.barcode}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {product.quantity}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Score Card */}
      <div className={`rounded-3xl p-5 text-slate-800 dark:text-slate-200 border ${scoreDetails.border} ${scoreDetails.bg} relative overflow-hidden flex items-center gap-4 shadow-xs`}>
        {/* Background ambient bubble */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 dark:bg-white/5 rounded-full blur-xl" />

        <div className={`w-16 h-16 shrink-0 rounded-2xl flex flex-col items-center justify-center border-2 font-black ${scoreDetails.circleBg} z-10 animate-pulse`}>
          <span className="text-2xl leading-none">{product.score}</span>
          <span className="text-[9px] opacity-75 mt-0.5">/10</span>
        </div>

        <div className="space-y-1 relative z-10 flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{t.product.scanwiseScore}</p>
          <h3 className={`text-base font-extrabold leading-none ${scoreDetails.text}`}>
            {getScoreLabel(product.score, lang)}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal line-clamp-2 mt-1">
            {lang === 'hi' 
              ? 'यह उत्पाद आपके समग्र स्वास्थ्य के लिए संतुलित आहार के हिस्से के रूप में देखा जा सकता है।' 
              : 'Detailed calorie metric analysis highlights key natural sugar values versus fiber concentration.'}
          </p>
        </div>
      </div>

      {/* 4. Conditional Allergen Warning */}
      {matchingAllergens.length > 0 && (
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.5, repeat: 1 }}
          className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/40 p-4 rounded-2xl flex gap-3 text-red-800 dark:text-red-400 shadow-sm"
        >
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
              🚨 {t.product.allergenWarning}
            </h4>
            <p className="text-xs text-red-600/90 dark:text-red-400/80 font-normal leading-relaxed">
              {lang === 'hi' 
                ? 'यह उत्पाद आपके सक्रिय एलर्जी प्रोफाइल में शामिल खाद्य पदार्थों को शामिल करता है!' 
                : 'Contains allergens configured on your profile! Consuming this product may cause problems.'}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              {matchingAllergens.map((alg) => (
                <span
                  key={alg}
                  className="bg-red-150 dark:bg-red-900/40 border border-red-300 dark:border-red-800 font-bold text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider"
                >
                  ⚠️ {alg}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 5. Badges - NutriScore & NOVA */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-[18px] p-4 flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.product.nutriScore}</span>
            <Info className="w-3.5 h-3.5 text-slate-300" />
          </div>
          
          <div className="flex items-center gap-1.5">
            {['A', 'B', 'C', 'D', 'E'].map((letter) => {
              const isActive = product.nutriScore.toUpperCase() === letter;
              return (
                <span
                  key={letter}
                  className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center text-[11px] font-black tracking-tighter ${
                    isActive ? getNutriScoreColor(letter) + ' scale-110 shadow-sm border border-white/20' : 'bg-slate-100 dark:bg-slate-750 text-slate-400 dark:text-slate-600 opacity-60'
                  }`}
                >
                  {letter}
                </span>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {lang === 'hi' ? 'ग्रेड ' + product.nutriScore + ' - समग्र आहार माप' : 'Grade ' + product.nutriScore + ' - Overall nutritional profile'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-[18px] p-4 flex flex-col justify-between space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t.product.novaGroup}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((group) => {
              const isActive = product.novaGroup === group;
              return (
                <span
                  key={group}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isActive ? getNovaGroupColor(group) + ' text-white scale-110 border-2 border-white' : 'bg-slate-100 dark:bg-slate-750 text-slate-400 dark:text-slate-600 opacity-50'
                  }`}
                >
                  {group}
                </span>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {product.novaGroup >= 4 
              ? (lang === 'hi' ? 'अल्ट्रा-प्रोसेस्ड' : 'Ultra-Processed food product')
              : (lang === 'hi' ? 'न्यूनतम प्रोसेस्ड' : 'Minimally processed ingredient')}
          </p>
        </div>
      </div>

      {/* 6. Nutrition Facts Grid */}
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {t.product.nutritionFacts}
          </h4>
          <span className="text-[11px] bg-slate-100 dark:bg-slate-750 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-md font-bold">
            {product.emoji === '🥤' ? t.product.per100ml : t.product.per100g}
          </span>
        </div>

        {/* 6 Grid layout with visual progress bars */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: t.product.calories, value: `${product.calories} kcal`, percent: Math.min((product.calories / 600) * 100, 100), colorVar: 'bg-orange-500' },
            { label: t.product.totalFat, value: `${product.totalFat} g`, percent: Math.min((product.totalFat / 50) * 100, 100), colorVar: 'bg-red-400' },
            { label: t.product.carbs, value: `${product.carbs} g`, percent: Math.min((product.carbs / 100) * 100, 100), colorVar: 'bg-amber-400' },
            { label: t.product.sugars, value: `${product.sugars} g`, percent: Math.min((product.sugars / 40) * 100, 100), colorVar: 'bg-red-500' },
            { label: t.product.protein, value: `${product.protein} g`, percent: Math.min((product.protein / 20) * 100, 100), colorVar: 'bg-emerald-500' },
            { label: t.product.fiber, value: `${product.fiber} g`, percent: Math.min((product.fiber / 10) * 100, 100), colorVar: 'bg-cyan-500' },
          ].map((item) => (
            <div key={item.label} className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl flex flex-col justify-between space-y-2 border border-slate-100/50 dark:border-slate-800/10">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{item.label}</span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{item.value}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-150 dark:bg-slate-750 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${item.colorVar}`} 
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. AI Summary Gemini-powered Card */}
      <div className="relative overflow-hidden bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-md border border-slate-800 space-y-3.5">
        <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
        <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-lg" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-indigo-505/20 border border-indigo-500/10">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-xs font-bold tracking-wider text-white uppercase">
              {t.product.aiInsight}
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-bold bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/40">
            {t.product.aiPowered}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {product.aiSummary}
        </p>

        {/* AI labels chips */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800/60">
          {product.aiTags.map((tag) => (
            <span
              key={tag}
              className="bg-indigo-950/40 hover:bg-indigo-950/65 border border-indigo-900 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap uppercase tracking-wider"
            >
              🚀 {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 8. Healthier Alternatives */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          {t.product.healthierAlt}
        </h4>
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none snap-x -mx-1 px-1">
          {alternativesList.map((alt) => (
            <motion.div
              key={alt.id}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700/80 rounded-2xl p-3.5 w-44 shrink-0 shadow-xs snap-center flex flex-col justify-between space-y-3 hover:border-emerald-500 transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{alt.emoji}</span>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-emerald-500 transition-colors">
                    {alt.name}
                  </h5>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{alt.brand}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100/65 dark:border-slate-700">
                <div className="flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{alt.score}</span>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-750 px-1.5 py-0.5 rounded-md font-bold">
                  BEST
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
