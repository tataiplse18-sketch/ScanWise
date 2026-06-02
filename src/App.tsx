import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Search, ScanLine, Heart, User, Wifi, BatteryCharging, Battery, 
  Sparkles, Languages, Sun, Moon, ArrowLeft, Info, HelpCircle
} from 'lucide-react';

// Imports types & helpers
import { Product, UserProfile } from './types';
import { mockUser, mockProducts, mockAlternatives } from './lib/mock-data';
import { TRANSLATIONS } from './lib/constants';

// Imports detailed screen subviews
import HomeView from './components/HomeView';
import ScannerView from './components/ScannerView';
import ProductDetailView from './components/ProductDetailView';
import SearchView from './components/SearchView';
import LibraryView from './components/LibraryView';
import AuthView from './components/AuthView';
import ProfileView from './components/ProfileView';

export default function App() {
  // 1. Core States
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(mockUser);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // App navigation state mapping
  const [activeScreen, setActiveScreen] = useState<string>('home'); // 'home' | 'scan' | 'product' | 'search' | 'favorites' | 'profile'
  const [libraryInitialTab, setLibraryInitialTab] = useState<'favorites' | 'history'>('favorites');
  const [selectedProductId, setSelectedProductId] = useState<string>('1');
  const [categorySearchFilter, setCategorySearchFilter] = useState<string>('');

  // 2. Data Persistence States (MVP client standard storage)
  const [favorites, setFavorites] = useState<Product[]>(() => 
    mockProducts.filter(p => p.isFavorite)
  );
  
  const [history, setHistory] = useState<Product[]>(() => 
    mockProducts.slice().sort((a, b) => b.id.localeCompare(a.id))
  );

  // 3. Dynamic Digital Clock for simulated mobile status bar
  const [currentTime, setCurrentTime] = useState('09:41');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const strHours = hours < 10 ? '0' + hours : String(hours);
      const strMinutes = minutes < 10 ? '0' + minutes : String(minutes);
      setCurrentTime(`${strHours}:${strMinutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sync isDarkMode class onto container
  useEffect(() => {
    const hostEl = document.getElementById('scanwise-simulator-host');
    if (hostEl) {
      if (isDarkMode) {
        hostEl.classList.add('dark');
      } else {
        hostEl.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  // 4. State Modification Methods
  const handleToggleFavorite = (id: string) => {
    // Find absolute product
    const absoluteProduct = mockProducts.find(p => p.id === id);
    if (!absoluteProduct) return;

    if (favorites.some(p => p.id === id)) {
      setFavorites(prev => prev.filter(p => p.id !== id));
      // update mock reference if any
      absoluteProduct.isFavorite = false;
      showSimulatorNotice(lang === 'hi' ? 'लाइब्रेरी से हटाया गया' : 'Removed from favorites');
    } else {
      const updatedProd = { ...absoluteProduct, isFavorite: true };
      setFavorites(prev => [updatedProd, ...prev]);
      absoluteProduct.isFavorite = true;
      showSimulatorNotice(lang === 'hi' ? 'पसंदीदा में जोड़ा गया!' : 'Added to saved library!');
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    showSimulatorNotice(lang === 'hi' ? 'स्कैन इतिहास साफ़ किया गया' : 'Scan history deleted');
  };

  const handleUpdateLanguage = (newLang: 'en' | 'hi') => {
    setLang(newLang);
    showSimulatorNotice(newLang === 'hi' ? 'भाषा: हिन्दी' : 'Language set to English');
  };

  const handleUpdateName = (newName: string) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, name: newName } : null);
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setActiveScreen('auth');
    showSimulatorNotice(lang === 'hi' ? 'साइन आउट किया गया' : 'Logged out securely');
  };

  const handleLoginSuccess = (name: string, email: string) => {
    const freshProfile: UserProfile = {
      id: String(Date.now()),
      name,
      email,
      avatar: null,
      initials: name.charAt(0).toUpperCase(),
      joinedDate: 'Jun 2026',
      country: '🇮🇳 India',
      streak: 1,
      scanCount: 1,
      favoriteCount: 0,
      allergens: ['Peanuts'],
    };
    setCurrentUser(freshProfile);
    setActiveScreen('home');
    showSimulatorNotice(lang === 'hi' ? 'सफलतापूर्वक साइन इन किया!' : 'Authenticated successfully!');
  };

  const handleToggleAllergen = (name: string) => {
    if (!currentUser) return;
    const isAlreadyChosen = currentUser.allergens.some(
      a => a.toLowerCase() === name.toLowerCase()
    );
    let updated;
    if (isAlreadyChosen) {
      updated = currentUser.allergens.filter(a => a.toLowerCase() !== name.toLowerCase());
      showSimulatorNotice(lang === 'hi' ? `${name} हटाया गया` : `Removed ${name} allergen`);
    } else {
      updated = [...currentUser.allergens, name];
      showSimulatorNotice(lang === 'hi' ? `${name} अलर्ट अलर्ट सक्रिय!` : `${name} alert active!`);
    }
    setCurrentUser({
      ...currentUser,
      allergens: updated,
    });
  };

  // Simulated scan verification handler
  const handleConfirmScan = (barcode: string): boolean => {
    // Audit products by barcode
    const scannedProduct = mockProducts.find(
      p => p.barcode === barcode || p.barcode.includes(barcode)
    );

    if (scannedProduct) {
      // Prepend or move item to active history
      setHistory(prev => {
        const clean = prev.filter(p => p.id !== scannedProduct.id);
        const record = { ...scannedProduct, scannedAt: 'Today, ' + currentTime };
        return [record, ...clean];
      });

      // Navigate to details
      setSelectedProductId(scannedProduct.id);
      setActiveScreen('product');
      return true;
    }
    return false;
  };

  // Simulator toast notices
  const [noticeMsg, setNoticeMsg] = useState('');
  const showSimulatorNotice = (msg: string) => {
    setNoticeMsg(msg);
    setTimeout(() => setNoticeMsg(''), 2000);
  };

  const handleSelectCategory = (catId: string) => {
    setCategorySearchFilter(catId);
    setActiveScreen('search');
  };

  const handleNavigate = (screen: string, argument?: any) => {
    if (screen === 'favorites') {
      if (argument === 'history') {
        setLibraryInitialTab('history');
      } else {
        setLibraryInitialTab('favorites');
      }
    }
    if (screen === 'product' && argument) {
      setSelectedProductId(argument);
    }
    setActiveScreen(screen);
  };

  const activeProduct = mockProducts.find(p => p.id === selectedProductId) || mockProducts[0];
  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between overflow-x-hidden antialiased">
      
      {/* Dynamic Background visual pattern */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-600/10 via-transparent to-transparent pointer-events-none -z-10" />

      {/* Simulator Container */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8">
        
        {/* Device Shell Phone Simulator */}
        <div 
          id="scanwise-simulator-host"
          className="relative max-w-[425px] w-full min-h-[810px] bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-[11px] border-slate-950 dark:border-slate-800 rounded-[48px] shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 transform"
        >
          {/* Dynamic Ambient Notch Area */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6.5 bg-slate-950 dark:bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
            {/* Camera lens dot */}
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-indigo-900" />
            </div>
            {/* Speaker bar */}
            <div className="w-10 h-1 bg-slate-900 rounded-full ml-4" />
          </div>

          {/* Core simulated battery + signals bar */}
          <div className="absolute top-0 left-0 right-0 h-10 px-6 pt-2.5 flex justify-between items-center text-[11px] font-bold text-slate-900 dark:text-white pointer-events-none z-30">
            {/* Clock display */}
            <span className="tracking-tight">{currentTime}</span>
            
            {/* Signal icons */}
            <div className="flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5 text-slate-800 dark:text-slate-100" />
              <div className="flex gap-0.5 items-end h-2.5">
                <span className="w-0.5 h-1 bg-current rounded-xs" />
                <span className="w-0.5 h-1.5 bg-current rounded-xs" />
                <span className="w-0.5 h-2 bg-current rounded-xs" />
                <span className="w-0.5 h-2.5 bg-current rounded-xs" />
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[9px]">98%</span>
                <BatteryCharging className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Simulated App Bar Header (Only shown on non-full screens like Scan) */}
          {activeScreen !== 'scan' && (
            <header className="px-5 pt-12 pb-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md relative z-20">
              <div className="flex items-center gap-2">
                <div className="w-7' h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                  <ScanLine className="w-4 h-4" />
                </div>
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-emerald-400">
                  {t.common.appName}
                </span>
              </div>

              {/* Dynamic Quick Settings widgets */}
              <div className="flex items-center gap-2 text-xs">
                {/* Languages selectors */}
                <button
                  onClick={() => handleUpdateLanguage(lang === 'en' ? 'hi' : 'en')}
                  className="w-10 h-7.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 rounded-lg flex items-center justify-center gap-1 font-semibold transition active:scale-95 cursor-pointer"
                  title="Toggle display language"
                >
                  <Languages className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-extrabold uppercase">{lang}</span>
                </button>

                {/* Dark Mode selector */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-8 h-7.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 rounded-lg flex items-center justify-center transition active:scale-95 cursor-pointer"
                  title="Toggle theme mode"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-slate-500" />}
                </button>
              </div>
            </header>
          )}

          {/* Core Content Body (Scrollable viewport) */}
          <div className="flex-1 overflow-y-auto px-5 pt-4 scrollbar-none relative">
            <AnimatePresence mode="wait">
              
              {/* Boot View Auth Check Override */}
              {!currentUser && activeScreen !== 'auth' ? (
                <AuthView 
                  lang={lang} 
                  onLoginSuccess={handleLoginSuccess} 
                />
              ) : (
                <>
                  {/* HOME View render */}
                  {activeScreen === 'home' && (
                    <div key="home">
                      <HomeView
                        user={currentUser!}
                        lang={lang}
                        recentScans={history}
                        onNavigate={handleNavigate}
                        onSelectCategory={handleSelectCategory}
                      />
                    </div>
                  )}

                  {/* SCANNER VIEW Render */}
                  {activeScreen === 'scan' && (
                    <div key="scan">
                      <ScannerView
                        lang={lang}
                        onNavigate={handleNavigate}
                        mockProductsList={mockProducts}
                        onConfirmScan={handleConfirmScan}
                      />
                    </div>
                  )}

                  {/* PRODUCT DETAILS Render */}
                  {activeScreen === 'product' && (
                    <div key="product">
                      <ProductDetailView
                        product={activeProduct}
                        userAllergens={currentUser!.allergens}
                        lang={lang}
                        isFavorite={favorites.some(f => f.id === activeProduct.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onNavigate={handleNavigate}
                        alternativesList={mockAlternatives}
                      />
                    </div>
                  )}

                  {/* SEARCH RESULTS VIEW */}
                  {activeScreen === 'search' && (
                    <div key="search">
                      <SearchView
                        lang={lang}
                        mockProductsList={mockProducts}
                        onNavigate={handleNavigate}
                        initialFilter={categorySearchFilter}
                        onClearCategoryFilter={() => setCategorySearchFilter('')}
                      />
                    </div>
                  )}

                  {/* SAVED & HISTORY TIMELINE VIEWS */}
                  {activeScreen === 'favorites' && (
                    <div key="library">
                      <LibraryView
                        user={currentUser!}
                        lang={lang}
                        favorites={favorites}
                        history={history}
                        onNavigate={handleNavigate}
                        onToggleFavorite={handleToggleFavorite}
                        onClearHistory={handleClearHistory}
                        initialTab={libraryInitialTab}
                      />
                    </div>
                  )}

                  {/* AUTH FORM VIEWS (Login / Register) */}
                  {activeScreen === 'auth' && (
                    <div key="auth">
                      <AuthView
                        lang={lang}
                        onLoginSuccess={handleLoginSuccess}
                      />
                    </div>
                  )}

                  {/* PROFILE AND SETTINGS */}
                  {activeScreen === 'profile' && (
                    <div key="profile">
                      <ProfileView
                        user={currentUser!}
                        lang={lang}
                        onUpdateLanguage={handleUpdateLanguage}
                        isDarkMode={isDarkMode}
                        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                        userAllergens={currentUser!.allergens}
                        onToggleAllergen={handleToggleAllergen}
                        onSignOut={handleSignOut}
                        onUpdateName={handleUpdateName}
                      />
                    </div>
                  )}
                </>
              )}

            </AnimatePresence>
          </div>

          {/* Central Simulator Notification pop */}
          <AnimatePresence>
            {noticeMsg && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-full shadow-lg z-30 flex items-center gap-1.5 animate-bounce leading-none"
              >
                <span>✓</span>
                <span>{noticeMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. Glassy Bottom Navigation Bar panel */}
          {currentUser && (
            <nav className="border-t border-slate-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 flex items-center justify-between relative z-30">
              
              {/* Home tab */}
              <button
                onClick={() => handleNavigate('home')}
                className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition ${
                  activeScreen === 'home' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-555'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[9px] font-semibold">{t.common.home}</span>
              </button>

              {/* Search tab */}
              <button
                onClick={() => handleNavigate('search')}
                className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition ${
                  activeScreen === 'search' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-555'
                }`}
              >
                <Search className="w-5 h-5" />
                <span className="text-[9px] font-semibold">{t.common.search}</span>
              </button>

              {/* Centered Large Floating Scan Line Trigger Button */}
              <div className="relative -top-3 px-1">
                <button
                  onClick={() => handleNavigate('scan')}
                  className="w-13 h-13 bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-500 rounded-full flex flex-col items-center justify-center text-white shadow-lg border-4 border-slate-50 dark:border-slate-900 cursor-pointer active:scale-95 hover:scale-105 transition duration-200"
                >
                  <ScanLine className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Saved tab */}
              <button
                onClick={() => handleNavigate('favorites')}
                className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition ${
                  activeScreen === 'favorites' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-555'
                }`}
              >
                <Heart className={`w-5 h-5 ${activeScreen === 'favorites' ? 'fill-current' : ''}`} />
                <span className="text-[9px] font-semibold">{t.common.saved}</span>
              </button>

              {/* Profile tab */}
              <button
                onClick={() => handleNavigate('profile')}
                className={`flex-1 flex flex-col items-center gap-1 cursor-pointer transition ${
                  activeScreen === 'profile' ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-555'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[9px] font-semibold">{t.common.profile}</span>
              </button>

            </nav>
          )}

        </div>

        {/* Outer instructions card descriptor */}
        <div className="mt-5 max-w-[425px] w-full bg-slate-800/50 border border-slate-700/60 p-4 rounded-3xl text-xs space-y-2 text-slate-300">
          <p className="font-bold text-center text-white flex items-center justify-center gap-1.5 uppercase tracking-widest text-[10px]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Interactive PWA Simulator Dashboard
          </p>
          <p className="leading-relaxed text-slate-400 font-normal">
            Interact with our simulated client view to test all 8 designed MVP screens! Tap language selector <code>EN</code> to translate the whole app to <code>Hindi</code> instantly. Update active allergen profiles to see real-time color-coded alerts on products.
          </p>
        </div>

      </main>
    </div>
  );
}
