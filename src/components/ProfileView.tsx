import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Calendar, MapPin, Award, ShieldCheck, Moon, Sun, 
  Languages, Bell, FileDown, Lock, Star, MessageSquare, Info, LogOut, Heart, AlertOctagon, Sparkles, ChevronRight 
} from 'lucide-react';
import { TRANSLATIONS, ALL_ALLERGENS } from '../lib/constants';
import { UserProfile, AllergenItem } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  lang: 'en' | 'hi';
  onUpdateLanguage: (l: 'en' | 'hi') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userAllergens: string[];
  onToggleAllergen: (name: string) => void;
  onSignOut: () => void;
  onUpdateName: (newName: string) => void;
}

export default function ProfileView({
  user,
  lang,
  onUpdateLanguage,
  isDarkMode,
  onToggleDarkMode,
  userAllergens,
  onToggleAllergen,
  onSignOut,
  onUpdateName,
}: ProfileViewProps) {
  const t = TRANSLATIONS[lang];
  const [isEditingName, setIsEditingName] = useState(false);
  const [tmpName, setTmpName] = useState(user.name);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const saveNameEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tmpName.trim()) {
      onUpdateName(tmpName.trim());
      setIsEditingName(false);
      showToast(lang === 'hi' ? 'प्रोफ़ाइल नाम अपडेट किया गया!' : 'Profile name successfully updated!');
    }
  };

  const handleExportData = () => {
    showToast(
      lang === 'hi' 
        ? 'खाद्य इतिहास डाउनलोड शुरू हो रहा है... (CSV)' 
        : 'Constructing CSV backup... Your foods audit download starting.'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-24"
    >
      {/* Dynamic Simulation Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-805 border border-slate-700 text-emerald-400 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header with Avatar & Meta */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 relative overflow-hidden shadow-xs">
        {/* Background ambient shade */}
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center font-black text-2xl text-white shadow-md uppercase shrink-0">
          {user.name ? user.name.charAt(0) : 'U'}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          {isEditingName ? (
            <form onSubmit={saveNameEdit} className="flex gap-2 items-center">
              <input
                type="text"
                value={tmpName}
                onChange={(e) => setTmpName(e.target.value)}
                className="bg-slate-100 dark:bg-slate-900 border border-slate-205 dark:border-slate-850 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full"
                autoFocus
              />
              <button 
                type="submit" 
                className="bg-emerald-550 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg shrink-0 cursor-pointer hover:bg-emerald-600 uppercase"
              >
                Save
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-850 dark:text-slate-50 line-clamp-1">
                {user.name}
              </h3>
              <button
                onClick={() => {
                  setTmpName(user.name);
                  setIsEditingName(true);
                }}
                className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/60 font-semibold hover:border-emerald-500 transition"
              >
                ✎ Edit
              </button>
            </div>
          )}
          
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 leading-none">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{user.email}</span>
          </p>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 pt-1.5 text-[10px] font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {t.profile.joined}: {user.joinedDate}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded">
              <MapPin className="w-3 h-3" />
              {user.country}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Numerical Summary Statistics Panel Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 text-center">
          <p className="text-lg font-black text-slate-90s text-emerald-505 dark:text-emerald-400">{user.scanCount}</p>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{t.home.scans}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 text-center">
          <p className="text-lg font-black text-slate-90s text-rose-500">{user.favoriteCount}</p>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{t.home.favorites}</span>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-3 text-center">
          <p className="text-lg font-black text-slate-90s text-amber-505 dark:text-amber-500">{user.streak}d</p>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Streak</span>
        </div>
      </div>

      {/* 3. Allergen Alert Profile Controller */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-amber-505 dark:text-amber-500" />
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-800 dark:text-slate-100 tracking-wider leading-none">
              🚨 {t.profile.myAllergens}
            </h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal font-normal">
              {lang === 'hi' 
                ? 'जिन खाद्य तत्वों से आपको असुविधा है, उन्हें फ्लैग करने के लिए नीचे चुनें।' 
                : 'Tap allergen cards to toggle automatic red flags on scanned foods.'}
            </p>
          </div>
        </div>

        {/* Dynamic allergen tags toggle grid */}
        <div className="flex flex-wrap gap-2 pt-1">
          {ALL_ALLERGENS.map((alg) => {
            const isActive = userAllergens.some((ua) => ua.toLowerCase() === alg.name.toLowerCase());
            return (
              <motion.button
                key={alg.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => onToggleAllergen(alg.name)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition cursor-pointer border ${
                  isActive
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-900 text-red-700 dark:text-red-400 shadow-xs shadow-red-500/5'
                    : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350'
                }`}
              >
                <span>{alg.emoji}</span>
                <span>{alg.name}</span>
                {isActive && <span className="text-[9px] text-red-500 shrink-0">✓</span>}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 4. Settings Options Group list */}
      <div className="space-y-4">
        
        {/* GROUP A: Preferences Group */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
            {t.settings.preferences}
          </h4>
          
          <div className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
            {/* Dark Mode toggle switch row */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 flex items-center justify-center">
                  {isDarkMode ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-850 dark:text-slate-200">{t.profile.darkMode}</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.profile.darkModeDesc}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none bg-slate-205 dark:bg-emerald-500"
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-250 ease-in-out ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Language Selection Toggle */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center">
                  <Languages className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-850 dark:text-slate-200">
                    Language / भाषा
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'hi' ? 'सक्रिय: हिंदी (HI)' : 'Active: English (EN)'}
                  </p>
                </div>
              </div>

              {/* EN vs HI Pill Switch */}
              <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-0.5 flex">
                <button
                  type="button"
                  onClick={() => onUpdateLanguage('en')}
                  className={`rounded-md px-2.5 py-1 text-[10px] font-black cursor-pointer transition ${
                    lang === 'en' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLanguage('hi')}
                  className={`rounded-md px-2.5 py-1 text-[10px] font-black cursor-pointer transition ${
                    lang === 'hi' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            {/* Alerts Notifications Toggles row */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center">
                  <Bell className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-850 dark:text-slate-200">{t.profile.allergenAlerts}</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">{t.profile.allergenAlertsDesc}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast(lang === 'hi' ? 'सूचना प्राथमिकताएं सेव्ड!' : 'Alert notices updated.')}
                className="text-xs text-emerald-500 font-bold hover:underline cursor-pointer"
              >
                ON
              </button>
            </div>
          </div>
        </div>

        {/* GROUP B: Account settings list */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
            {t.settings.account}
          </h4>

          <div className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
            {/* Export data triggers */}
            <div 
              onClick={handleExportData}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-550/10 text-teal-550 flex items-center justify-center">
                  <FileDown className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-505 transition-colors">{t.profile.exportData}</h5>
                  <p className="text-[10px] text-slate-405 mt-0.5">{lang === 'hi' ? 'इतिहास रिपोर्ट डाउनलोड करें' : 'Download details report CSV'}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            </div>

            {/* Change password mock trigger */}
            <div 
              onClick={() => showToast(lang === 'hi' ? 'पासवर्ड बदलने का लिंक डिस्पैच किया गया!' : 'Password modifier directions dispatched.')}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-505 transition-colors">{t.profile.changePassword}</h5>
                  <p className="text-[10px] text-slate-405 mt-0.5">{lang === 'hi' ? 'खाता पासवर्ड संशोधित करें' : 'Change account login credentials'}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            </div>
          </div>
        </div>

        {/* GROUP C: About group settings */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
            {t.settings.about}
          </h4>

          <div className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-3xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
            {/* Rate App */}
            <div 
              onClick={() => showToast(lang === 'hi' ? 'रेटिंग दर्ज की गई! धन्यवाद।' : 'ScanWise 5-Stars rating received! Thank you.')}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
                  <Star className="w-4.5 h-4.5 text-yellow-500 fill-current" />
                </div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-505 transition-colors">{t.profile.rateApp}</h5>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            </div>

            {/* Support and Feedback */}
            <div 
              onClick={() => showToast(lang === 'hi' ? 'सपोर्ट ईमेल कॉपी किया गया: support@scanwise.in' : 'Support tickets forwarded to desk.')}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-505 transition-colors">{t.profile.feedback}</h5>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            </div>

            {/* Privacy Rules */}
            <div 
              onClick={() => showToast('Full HIPAA and PDP rules maintained offline.')}
              className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-500/10 text-slate-500 flex items-center justify-center">
                  <Info className="w-4.5 h-4.5" />
                </div>
                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-505 transition-colors">{t.profile.privacy}</h5>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            </div>
          </div>
        </div>

        {/* Red sign out button trigger */}
        <button
          type="button"
          onClick={onSignOut}
          className="w-full bg-red-50 dark:bg-red-950/20 hover:bg-red-100/60 dark:hover:bg-red-950/40 text-red-650 dark:text-red-400 font-bold p-4 rounded-2xl flex items-center justify-center gap-2.5 transition border-2 border-red-200/50 dark:border-red-900/30 text-xs uppercase tracking-wider cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5" />
          {t.profile.signOut}
        </button>
      </div>
    </motion.div>
  );
}
