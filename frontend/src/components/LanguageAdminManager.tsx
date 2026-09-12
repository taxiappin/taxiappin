import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, Search, Save, Plus, CheckCircle2, Languages, Type, Edit3, Sparkles, FileText, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, DEFAULT_TRANSLATIONS, GOOGLE_FONTS_PER_LANG } from '../lib/LanguageContext';

interface LanguageAdminManagerProps {
  onSaveToast: (message: string) => void;
}

export const LanguageAdminManager: React.FC<LanguageAdminManagerProps> = ({ onSaveToast }) => {
  const {
    currentLang,
    customTranslations,
    updateCustomTranslations,
    languageFonts,
    setLanguageFont,
    isLanguageSwitcherEnabled,
    setIsLanguageSwitcherEnabled,
    t
  } = useLanguage();

  const [activeAdminTab, setActiveAdminTab] = useState<'text_editor' | 'fonts_manager'>('text_editor');
  const [selectedTargetLang, setSelectedTargetLang] = useState<string>('hi');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [draftTranslations, setDraftTranslations] = useState<Record<string, Record<string, string>>>(() => {
    const initial: Record<string, Record<string, string>> = {};
    SUPPORTED_LANGUAGES.forEach(lang => {
      initial[lang.code] = {
        ...(DEFAULT_TRANSLATIONS[lang.code] || {}),
        ...(customTranslations[lang.code] || {})
      };
    });
    return initial;
  });

  const [newKeyInput, setNewKeyInput] = useState<string>('');
  const [newEnglishInput, setNewEnglishInput] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const englishDict = draftTranslations['en'] || DEFAULT_TRANSLATIONS['en'] || {};
  const targetDict = draftTranslations[selectedTargetLang] || {};
  const targetLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === selectedTargetLang) || SUPPORTED_LANGUAGES[1];

  const handleEnglishTextChange = (key: string, newEnglishText: string) => {
    setDraftTranslations(prev => ({
      ...prev,
      en: {
        ...(prev.en || {}),
        [key]: newEnglishText
      }
    }));
  };

  const handleTextChange = (key: string, newText: string) => {
    setDraftTranslations(prev => ({
      ...prev,
      [selectedTargetLang]: {
        ...(prev[selectedTargetLang] || {}),
        [key]: newText
      }
    }));
  };

  const handleSave = () => {
    updateCustomTranslations(draftTranslations);
    onSaveToast(`Translations & English text changes saved successfully across all pages!`);
  };

  const handleAddNewKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyInput.trim() || !newEnglishInput.trim()) return;

    const cleanKey = newKeyInput.trim().toLowerCase().replace(/\s+/g, '_');

    setDraftTranslations(prev => {
      const updated = { ...prev };
      SUPPORTED_LANGUAGES.forEach(lang => {
        if (!updated[lang.code]) updated[lang.code] = {};
        if (lang.code === 'en') {
          updated['en'][cleanKey] = newEnglishInput.trim();
        } else {
          updated[lang.code][cleanKey] = updated[lang.code][cleanKey] || newEnglishInput.trim();
        }
      });
      return updated;
    });

    setNewKeyInput('');
    setNewEnglishInput('');
    setShowAddModal(false);
    onSaveToast(`Added new translation string key: "${cleanKey}"`);
  };

  // Filter keys
  const keysList = Object.keys(englishDict);
  const filteredKeys = keysList.filter(key => {
    const englishVal = englishDict[key] || '';
    const targetVal = targetDict[key] || '';
    const matchesSearch = key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      englishVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      targetVal.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'booking') {
      return ['where_to', 'enter_pickup', 'enter_dropoff', 'pickup_location', 'dropoff_location', 'book_taxi_now', 'schedule_ride', 'searching_taxis', 'taxi_found', 'request_a_ride', 'complete_your_journey_details', 'route_details', 'schedule', 'vehicle_preference'].includes(key);
    }
    if (selectedCategory === 'vehicles_fares') {
      return ['estimated_fare', 'base_fare', 'taxes_fees', 'total_amount', 'pay_via_upi', 'pay_cash', 'apply_coupon', 'select_vehicle', 'mini_hatchback', 'sedan_prime', 'auto_rickshaw', 'bike_taxi', 'suv_exec'].includes(key);
    }
    if (selectedCategory === 'driver') {
      return ['driver_mode', 'go_online', 'go_offline', 'accept_ride', 'decline_ride', 'start_trip', 'complete_trip', 'enter_otp', 'wallet_balance', 'today_earnings', 'become_partner', 'switch_to_driver_mode'].includes(key);
    }
    if (selectedCategory === 'general') {
      return ['app_name', 'app_tagline', 'language_settings', 'select_language', 'help_support', 'emergency_sos', 'settings', 'save_changes', 'close', 'back', 'next', 'chats', 'my_rides', 'market'].includes(key);
    }
    return true;
  });

  const fontOptionsForTarget = GOOGLE_FONTS_PER_LANG[selectedTargetLang] || GOOGLE_FONTS_PER_LANG['en'];
  const currentSelectedFont = languageFonts[selectedTargetLang] || fontOptionsForTarget[0]?.name;

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner - Standardized Light Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Globe className="text-slate-800" size={24} />
            <span>Language, App Text & Google Fonts</span>
          </h2>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-2 rounded-2xl border border-slate-200 shrink-0 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveAdminTab('text_editor')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'text_editor'
                ? 'bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Edit3 size={16} className={activeAdminTab === 'text_editor' ? "text-slate-950" : "text-amber-500"} />
            <span>App Text Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('fonts_manager')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'fonts_manager'
                ? 'bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Type size={16} className={activeAdminTab === 'fonts_manager' ? "text-slate-950" : "text-amber-500"} />
            <span>Google Fonts</span>
          </button>
        </div>
      </div>

      {/* Master Feature Toggle Switch */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${isLanguageSwitcherEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
            <Globe size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <span>Enable Front-End Language Switcher & Multi-Language Feature</span>
              {isLanguageSwitcherEnabled ? (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded-md">ACTIVE</span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-mono font-bold rounded-md">DISABLED</span>
              )}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isLanguageSwitcherEnabled
                ? "Feature Enabled: Front-end language switcher icon and translations are active for all users."
                : "Feature Disabled: Language switcher icon is hidden on front-end. App strictly renders in default/custom English."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              const nextState = !isLanguageSwitcherEnabled;
              setIsLanguageSwitcherEnabled(nextState);
              onSaveToast(`Language translation feature ${nextState ? 'ENABLED' : 'DISABLED'} on front-end`);
            }}
            className={`w-12 h-6.5 transition-colors duration-200 ease-in-out outline-none flex items-center shrink-0 cursor-pointer p-0.5 relative rounded-full ${
              isLanguageSwitcherEnabled ? 'bg-amber-400' : 'bg-slate-300'
            }`}
            title="Toggle Language Switcher Feature"
          >
            <div
              className={`w-5.5 h-5.5 bg-white rounded-full transition-all duration-200 ease-in-out shadow-md absolute left-0.5 ${
                isLanguageSwitcherEnabled ? 'translate-x-5.5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Target Language Selector Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Languages size={16} className="text-amber-500" />
            <span>Select Target Language to Manage ({SUPPORTED_LANGUAGES.length - 1} Indian Languages + English)</span>
          </label>
          <span className="text-xs font-mono font-bold text-slate-500">
            Active: <strong className="text-amber-600 font-black">{targetLangInfo.name} ({targetLangInfo.nativeName})</strong>
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedTargetLang === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedTargetLang(lang.code)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm ring-2 ring-amber-400/30'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
                <span className="text-[10px] font-mono opacity-60">({lang.name})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: APP TEXT EDITOR & SIDE-BY-SIDE TRANSLATIONS */}
      {activeAdminTab === 'text_editor' && (
        <div className="space-y-4">
          {/* Live Mobile App Screen Preview - Rendered in Light Theme */}
          <div className="p-5 bg-white text-slate-900 rounded-3xl border border-slate-200/90 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Type className="text-amber-600" size={18} />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Live Mobile App Screen Preview: {targetLangInfo.name} ({targetLangInfo.nativeName})
                </h4>
              </div>
              <span className="text-[10px] font-mono text-amber-800 font-extrabold uppercase tracking-widest bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-lg">
                Font: {fontOptionsForTarget.find(f => f.name === currentSelectedFont)?.fontFamily || 'Anek Indian Multi-Script Font'}
              </span>
            </div>

            <div 
              className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3 text-left"
              style={{ fontFamily: fontOptionsForTarget.find(f => f.name === currentSelectedFont)?.fontFamily || 'Anek Latin, Anek Devanagari, sans-serif' }}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
                  {draftTranslations[selectedTargetLang]?.app_name || englishDict['app_name'] || 'TaxiApp'}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  {targetLangInfo.nativeName} ({targetLangInfo.region})
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 leading-tight">
                {draftTranslations[selectedTargetLang]?.app_tagline || englishDict['app_tagline'] || 'Fast, Reliable & Safe Taxi Service'}
              </h3>

              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block font-semibold">{draftTranslations[selectedTargetLang]?.pickup_location || englishDict['pickup_location'] || 'Pickup Location'}</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">{draftTranslations[selectedTargetLang]?.current_location || englishDict['current_location'] || 'Current Location'}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-500 block font-semibold">{draftTranslations[selectedTargetLang]?.dropoff_location || englishDict['dropoff_location'] || 'Dropoff Location'}</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">{draftTranslations[selectedTargetLang]?.where_to || englishDict['where_to'] || 'Where to?'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-400 text-slate-950 rounded-xl font-black text-xs uppercase tracking-wider shadow-2xs">
                <span>{draftTranslations[selectedTargetLang]?.book_taxi_now || englishDict['book_taxi_now'] || 'Book Taxi Now'}</span>
                <span>→</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-3xs">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search text, headers or string keys..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-xs font-medium text-slate-800 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus size={15} />
                <span>Add Custom Key</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save size={15} />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-3 rounded-2xl border border-slate-200">
            {[
              { id: 'all', label: 'All App Strings' },
              { id: 'booking', label: 'Booking & Ride Details' },
              { id: 'vehicles_fares', label: 'Vehicles & Fares' },
              { id: 'driver', label: 'Driver Controls' },
              { id: 'general', label: 'General Navigation & Tabs' },
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-3.5 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-black uppercase tracking-wider">
              <div className="md:col-span-3 flex items-center gap-2">
                <FileText size={14} className="text-amber-400" />
                <span>Key / Identifier</span>
              </div>
              <div className="md:col-span-4 flex items-center gap-2">
                <span>Original English Text</span>
              </div>
              <div className="md:col-span-5 flex items-center gap-2 text-amber-400">
                <span>{targetLangInfo.flag} {targetLangInfo.name} Custom Text ({targetLangInfo.nativeName})</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
              {filteredKeys.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Search size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="font-bold text-sm text-slate-600">No strings matched your search.</p>
                </div>
              ) : (
                filteredKeys.map((key) => {
                  const englishText = englishDict[key] || key;
                  const targetText = targetDict[key] ?? englishText;

                  return (
                    <div key={key} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-amber-50/20 transition-colors">
                      <div className="md:col-span-3">
                        <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 inline-block break-all">
                          {key}
                        </span>
                      </div>

                      <div className="md:col-span-4">
                        <input
                          type="text"
                          value={englishText}
                          onChange={(e) => handleEnglishTextChange(key, e.target.value)}
                          placeholder="Enter English text..."
                          className="w-full bg-slate-50 border border-slate-200/90 focus:border-slate-400 focus:bg-white p-2.5 rounded-xl text-xs font-semibold text-slate-900 outline-none transition-all"
                        />
                      </div>

                      <div className="md:col-span-5">
                        <input
                          type="text"
                          value={targetText}
                          onChange={(e) => handleTextChange(key, e.target.value)}
                          placeholder={`Enter custom ${targetLangInfo.name} text...`}
                          className="w-full bg-amber-50/30 border border-amber-300/80 focus:border-amber-500 focus:bg-white p-2.5 rounded-xl text-xs font-bold text-slate-900 outline-none transition-all shadow-2xs"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
              <span>
                Showing <strong>{filteredKeys.length}</strong> strings for <strong className="text-slate-900">{targetLangInfo.name}</strong>.
              </span>

              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Save All Text Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE FONTS MANAGER */}
      {activeAdminTab === 'fonts_manager' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Recommended Fonts for {targetLangInfo.name} ({targetLangInfo.nativeName})
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Anek font family is set as the primary default across all Indian languages. You can switch or test any alternative Google Font below.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-xl uppercase tracking-wider">
              Default: Anek Font System
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fontOptionsForTarget.map((font, idx) => {
              const isSelected = currentSelectedFont === font.name;
              return (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => {
                    setLanguageFont(selectedTargetLang, font.name);
                    onSaveToast(`Google Font for ${targetLangInfo.name} updated to "${font.name}"`);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 relative ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400 ring-2 ring-amber-400/40 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider bg-slate-200 px-2.5 py-0.5 rounded-md">
                      {font.name.startsWith('Anek') ? '⭐ Recommended: ' : ''}{font.name}
                    </span>
                    {isSelected ? (
                      <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full">
                        Active Font
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-bold">Select</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-lg font-bold text-slate-900" style={{ fontFamily: font.fontFamily }}>
                      {t('where_to', 'Where to?')} • {t('local_or_intercity', 'Local or intercity?')}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      Font Family: {font.fontFamily}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Live Mobile App Typography Preview Card */}
          <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Type className="text-amber-400" size={18} />
                <h4 className="text-sm font-black uppercase tracking-wider text-amber-400">
                  Live Preview: {targetLangInfo.name} ({targetLangInfo.nativeName}) with {currentSelectedFont || 'Anek'}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-800 px-2.5 py-1 rounded-lg">
                Font: {fontOptionsForTarget.find(f => f.name === currentSelectedFont)?.fontFamily || 'Anek Sans'}
              </span>
            </div>

            <div 
              className="p-5 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-4 text-left"
              style={{ fontFamily: fontOptionsForTarget.find(f => f.name === currentSelectedFont)?.fontFamily }}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  {t('app_name', 'TaxiApp')}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {targetLangInfo.region}
                </span>
              </div>

              <h3 className="text-2xl font-black text-white leading-tight">
                {t('app_tagline', 'Fast, Reliable & Safe Taxi Service')}
              </h3>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{t('pickup_location', 'Pickup Location')}</span>
                  <span className="text-sm font-bold text-white block mt-0.5">{t('current_location', 'Current Location')}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{t('dropoff_location', 'Dropoff Location')}</span>
                  <span className="text-sm font-bold text-white block mt-0.5">{t('where_to', 'Where to?')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-400 text-slate-950 rounded-xl font-black text-sm">
                <span>{t('book_taxi_now', 'Book Taxi Now')}</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Key Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 w-full max-w-md space-y-4"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-slate-900 text-base uppercase">Add Custom Text Key</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewKey} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">String Key (e.g. request_a_ride_header)</label>
                <input
                  type="text"
                  required
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                  placeholder="e.g. promo_banner_header"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Original English Text</label>
                <input
                  type="text"
                  required
                  value={newEnglishInput}
                  onChange={(e) => setNewEnglishInput(e.target.value)}
                  placeholder="e.g. Request a Ride"
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Add Key
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
