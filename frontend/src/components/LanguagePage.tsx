import React from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  ArrowLeft,
  Check,
  Languages
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface LanguagePageProps {
  onClose: () => void;
}

export const LanguagePage: React.FC<LanguagePageProps> = ({ onClose }) => {
  const {
    currentLang,
    setLanguage,
    languages,
    t
  } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.8 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden font-sans"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-amber-400" />
                <h2 className="text-base sm:text-lg font-black uppercase tracking-tight">
                  {t('app_language', 'App Language Settings')}
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {t('choose_preferred_language', 'Choose your preferred language.')}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950/40 flex-1">
          
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1 pt-1">
            <span>{t('available_languages', 'Available Languages')}</span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full font-mono">
              Active: {currentLang.toUpperCase()}
            </span>
          </div>

          {/* Language Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {languages.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 relative ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400 ring-2 ring-amber-400/40 shadow-xs'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl shrink-0 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      {lang.flag}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-slate-900 dark:text-white text-sm">
                          {lang.nativeName}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold font-mono">
                          ({lang.name})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {lang.region}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                        <Check size={14} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Languages size={15} className="text-amber-500" />
            <span>{t('language_changes_instantly', 'Language updates instantly across all pages.')}</span>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-950 dark:bg-amber-400 text-amber-400 dark:text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
          >
            {t('save_changes', 'Done')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
