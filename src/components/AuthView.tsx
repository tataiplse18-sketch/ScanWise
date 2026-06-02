import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScanLine, Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../lib/constants';

interface AuthViewProps {
  lang: 'en' | 'hi';
  onLoginSuccess: (name: string, email: string) => void;
}

export default function AuthView({ lang, onLoginSuccess }: AuthViewProps) {
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Forms states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAlertMessage('');

    if (!email.trim() || !password.trim()) {
      setError(lang === 'hi' ? 'कृपया सभी फ़ील्ड भरें!' : 'Please fill out all required fields.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError(lang === 'hi' ? 'कृपया अपना पूरा नाम भरें!' : 'Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError(lang === 'hi' ? 'पासवर्ड मेल नहीं खाते!' : 'Passwords do not match.');
        return;
      }
    }

    // Simulate Network Request
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(
        mode === 'register' ? name.trim() : (email.split('@')[0] || 'User'),
        email.trim()
      );
    }, 1000);
  };

  const handleForgotPassword = () => {
    setAlertMessage(
      lang === 'hi' 
        ? 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है!' 
        : 'Password reset instructions have been dispatched to your email address.'
    );
    // Auto clear alert
    setTimeout(() => setAlertMessage(''), 4000);
  };

  const handleSocialMock = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(`${provider} User`, `user@${provider.toLowerCase()}.com`);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-sm mx-auto px-1 py-4 pb-20"
    >
      {/* 1. App Icon Logo and Tagline Header */}
      <div className="flex flex-col items-center text-center space-y-3.5 pt-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-700 rounded-[20px] flex items-center justify-center text-white shadow-lg relative group">
          <div className="absolute inset-0 bg-white/10 rounded-[20px] blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          <ScanLine className="w-8 h-8 text-white relative z-10 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-none">
            {t.common.appName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {t.common.tagline}
          </p>
        </div>
      </div>

      {/* Mode Switches Form */}
      <div className="bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-5 shadow-xs">
        
        {/* Alerts messages display area */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-3 rounded-xl flex items-center gap-2 text-red-700 dark:text-red-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        {alertMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-3 rounded-xl flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-500" />
            <span className="font-semibold leading-relaxed">{alertMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Real-time Dynamic Fields based on login vs signup */}
          <AnimatePresence mode="popLayout">
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-1.5"
              >
                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block">{t.auth.name}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder={t.auth.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-205 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block">{t.auth.email}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                type="email"
                required
                placeholder={t.auth.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-205 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block">{t.auth.password}</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  {t.auth.forgotPassword}
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type="password"
                required
                minLength={6}
                placeholder={t.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-205 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-1.5 animate-delay-100"
              >
                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest block">{t.auth.confirmPassword}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="re-enter password to match"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-205 dark:border-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-450 hover:to-teal-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition cursor-pointer flex justify-center items-center gap-2"
          >
            {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {mode === 'login' ? t.auth.signIn : t.auth.createAccount}
          </button>
        </form>

        {/* or continue with third-parties */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{t.auth.orContinueWith}</span>
          <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
        </div>

        {/* Social auth grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialMock('Google')}
            className="flex items-center justify-center gap-2 border-2 border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 p-2.5 rounded-xl cursor-pointer transition text-xs font-semibold text-slate-750 dark:text-slate-350"
          >
            <span className="text-sm">🌐</span>
            {t.auth.google}
          </button>
          <button
            type="button"
            onClick={() => handleSocialMock('Facebook')}
            className="flex items-center justify-center gap-2 border-2 border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 p-2.5 rounded-xl cursor-pointer transition text-xs font-semibold text-slate-750 dark:text-slate-350"
          >
            <span className="text-sm">💙</span>
            {t.auth.facebook}
          </button>
        </div>
      </div>

      {/* Redirect Footer links */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
        {mode === 'login' ? (
          <>
            {t.auth.noAccount}{' '}
            <button
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer bg-transparent border-none"
            >
              {t.auth.signUp}
            </button>
          </>
        ) : (
          <>
            {t.auth.hasAccount}{' '}
            <button
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer bg-transparent border-none"
            >
              {t.auth.signIn}
            </button>
          </>
        )}
      </p>
    </motion.div>
  );
}
