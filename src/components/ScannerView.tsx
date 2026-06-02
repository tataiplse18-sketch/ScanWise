import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Zap, Image as ImageIcon, Clipboard, Mic, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../lib/constants';
import { Product } from '../types';

interface ScannerViewProps {
  lang: 'en' | 'hi';
  onNavigate: (screen: string, arg?: any) => void;
  mockProductsList: Product[];
  onConfirmScan: (productBarcode: string) => boolean;
}

export default function ScannerView({
  lang,
  onNavigate,
  mockProductsList,
  onConfirmScan,
}: ScannerViewProps) {
  const t = TRANSLATIONS[lang];
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualError, setManualError] = useState('');
  const [scanStatus, setScanStatus] = useState<null | 'success' | 'checking'>(null);

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');
    if (!manualCode.trim()) return;

    setScanStatus('checking');
    setTimeout(() => {
      const found = onConfirmScan(manualCode.trim());
      if (found) {
        setScanStatus('success');
        setTimeout(() => {
          setIsManualOpen(false);
          setScanStatus(null);
          setManualCode('');
        }, 800);
      } else {
        setScanStatus(null);
        setManualError(lang === 'hi' ? 'अमान्य बारकोड! कृपया पुन: प्रयास करें।' : 'Product not found. Try one of the quick selector barcodes below!');
      }
    }, 600);
  };

  const handleQuickSelectBarcode = (bc: string) => {
    setScanStatus('checking');
    setTimeout(() => {
      onConfirmScan(bc);
      setScanStatus('success');
      setTimeout(() => {
        setScanStatus(null);
      }, 500);
    }, 400);
  };

  return (
    <div className="absolute inset-0 bg-slate-950 text-white z-40 flex flex-col justify-between overflow-hidden">
      
      {/* ALWAYS DARK STYLING OVERRIDE IN CONTAINER */}
      <div className="absolute inset-0 bg-radial-at-t from-slate-900 via-slate-950 to-slate-950 opacity-90 -z-10" />

      {/* 1. Header */}
      <div className="px-5 pt-8 pb-4 flex items-center justify-between relative z-10">
        <button
          onClick={() => onNavigate('home')}
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold tracking-tight text-white/95">
          {t.scanner.title}
        </h2>
        <button
          onClick={() => setIsFlashActive(!isFlashActive)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
            isFlashActive ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
          }`}
        >
          <Zap className={`w-5 h-5 ${isFlashActive ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Camera viewfinder frame */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-6">
        
        {/* Instruction overlay pill */}
        <div className="absolute top-6 z-15 bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-lg text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          {t.scanner.instruction}
        </div>

        {/* 3. Scan Frame */}
        <div className="relative w-[280px] h-[190px] bg-slate-900/30 flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl">
          {/* Ambient scanner beam layout */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-emerald-950/10 to-transparent" />
          
          {/* Mock Barcode artwork */}
          <div className="w-[180px] h-[70px] opacity-25 flex gap-1 justify-between items-stretch">
            {[2, 4, 1, 3, 2, 5, 2, 1, 4, 2, 3, 1, 4, 3, 2, 1, 4].map((width, i) => (
              <div 
                key={i} 
                className="bg-white rounded-xs" 
                style={{ width: `${width * 2 + 1}px` }} 
              />
            ))}
          </div>

          {/* Animated 2D scan laser line */}
          <motion.div
            animate={{
              top: ['5%', '92%', '5%'],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-3 right-3 h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full shadow-[0_0_12px_rgba(16,185,129,0.9)]"
          />

          {/* 4 Corner view brackets */}
          {/* Top-Left */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-emerald-400 rounded-tl-xl" />
          {/* Top-Right */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-emerald-400 rounded-tr-xl" />
          {/* Bottom-Left */}
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-emerald-400 rounded-bl-xl" />
          {/* Bottom-Right */}
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-emerald-400 rounded-br-xl" />
        </div>

        {scanStatus === 'checking' && (
          <div className="absolute bg-slate-900/90 border border-slate-700 px-6 py-3 rounded-full mt-4 flex items-center gap-3 shadow-2xl text-sm font-semibold text-emerald-400 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            {t.common.loading}
          </div>
        )}

        {scanStatus === 'success' && (
          <div className="absolute bg-emerald-500 text-slate-950 px-6 py-3 rounded-full mt-4 flex items-center gap-2 shadow-2xl text-sm font-bold">
            ✓ Barcoded Verified!
          </div>
        )}
      </div>

      {/* 4. Bottom Controls Panel */}
      <div className="bg-slate-900/90 border-t border-white/5 backdrop-blur-xl px-5 pt-6 pb-12 rounded-t-[32px] space-y-6">
        
        {/* Manual entry trigger button */}
        <div
          onClick={() => setIsManualOpen(true)}
          className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl flex items-center justify-between cursor-pointer border border-white/5 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/50 border border-emerald-500/10 flex items-center justify-center text-emerald-400 text-lg">
              ⌨
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.scanner.manualTitle}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{t.scanner.manualDesc}</p>
            </div>
          </div>
          <span className="text-xs text-emerald-400 font-bold">→</span>
        </div>

        {/* Quick Simulator Barcode Selector */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            🔋 SIMULATOR BARCODE PRESETS (Tap to scan)
          </p>
          <div className="flex gap-2 justify-center overflow-x-auto py-1 scrollbar-none">
            {mockProductsList.map((p) => (
              <button
                key={p.id}
                onClick={() => handleQuickSelectBarcode(p.barcode)}
                className="bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl py-2 px-3 text-xs flex items-center gap-2 font-medium transition cursor-pointer"
              >
                <span>{p.emoji}</span>
                <span className="text-slate-300">{p.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions (Gallery, Paste, Voice) */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            type="button"
            onClick={() => handleQuickSelectBarcode('8901234567890')}
            className="bg-white/5 hover:bg-white/10 py-3 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-slate-300 hover:text-white"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] uppercase font-bold tracking-wider">{t.scanner.gallery}</span>
          </button>

          <button 
            type="button"
            onClick={() => handleQuickSelectBarcode('8903456789012')}
            className="bg-white/5 hover:bg-white/10 py-3 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-slate-300 hover:text-white"
          >
            <Clipboard className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] uppercase font-bold tracking-wider">{t.scanner.pasteCode}</span>
          </button>

          <button 
            type="button"
            onClick={() => handleQuickSelectBarcode('8904567890123')}
            className="bg-white/5 hover:bg-white/10 py-3 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-slate-300 hover:text-white"
          >
            <Mic className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] uppercase font-bold tracking-wider">{t.scanner.voice}</span>
          </button>
        </div>
      </div>

      {/* Manual Code Input Popup Modal */}
      <AnimatePresence>
        {isManualOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-[24px] p-6 w-full max-w-sm space-y-5"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>⌨</span>
                  {t.scanner.manualTitle}
                </h3>
                <p className="text-xs text-slate-400 leading-normal font-normal">
                  Enter a food barcode. (e.g. <code>8901234567890</code>, <code>8903456789012</code>, <code>8902345678901</code>)
                </p>
              </div>

              <form onSubmit={handleSubmitManual} className="space-y-4">
                <input
                  type="text"
                  placeholder="e.g. 8901234567890"
                  value={manualCode}
                  onChange={(e) => {
                    setManualCode(e.target.value);
                    setManualError('');
                  }}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3.5 text-center text-sm font-mono tracking-widest text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-600 uppercase"
                  autoFocus
                />

                {manualError && (
                  <p className="text-xs text-red-400 flex items-center gap-2 leading-relaxed bg-red-950/30 p-2.5 rounded-lg border border-red-900/30">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{manualError}</span>
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsManualOpen(false);
                      setManualError('');
                      setManualCode('');
                    }}
                    className="bg-white/5 hover:bg-white/10 text-slate-300 py-3 rounded-xl text-xs font-semibold"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10"
                  >
                    Submit
                  </button>
                </div>
              </form>

              {/* Presets helpers inside Modal */}
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Quick Copy Codes:</p>
                <div className="max-h-[140px] overflow-y-auto space-y-1.5 scrollbar-thin text-xs pr-1">
                  {mockProductsList.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => setManualCode(p.barcode)}
                      className="flex justify-between items-center p-2 rounded-lg bg-slate-950/40 hover:bg-slate-950 border border-slate-800/40 hover:border-slate-700/60 cursor-pointer transition text-slate-300 text-[11px]"
                    >
                      <span className="font-semibold">{p.emoji} {p.name.split(' ')[0]}</span>
                      <code className="text-emerald-500 text-[10px] font-bold">{p.barcode}</code>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
