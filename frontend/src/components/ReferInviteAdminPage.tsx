import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  MessageSquare, 
  X, 
  Check, 
  QrCode, 
  Users, 
  Sparkles,
  ExternalLink,
  Edit3,
  Palette,
  Layout,
  Send,
  Mail,
  Smartphone,
  Globe,
  RotateCcw,
  Save,
  Gift,
  Car,
  UserPlus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useConfig } from '../lib/ConfigContext';
import { InviteSettings } from '../types';

interface ReferInviteAdminPageProps {
  setToast?: (toast: { message: string; type: 'success' | 'error' | 'info' }) => void;
}

export const ReferInviteAdminPage: React.FC<ReferInviteAdminPageProps> = ({ setToast }) => {
  const { config, updateConfig } = useConfig();

  // Current domain fallback
  const defaultUrl = typeof window !== 'undefined' ? window.location.origin : 'https://taxiapp.com';

  const defaultInviteSettings: InviteSettings = {
    enabled: true,
    title: "Invite your Friends to TaxiApp",
    headline: "Book safe, fast, and comfortable rides anytime!",
    description: "Experience seamless urban commuting with verified drivers, instant booking, and zero surge pricing.",
    shareUrl: defaultUrl,
    badgeText: "⭐ EXCLUSIVE INVITE",
    buttonText: "Start Riding Now",
    cardTheme: "amber",
    customBgColor: "#f59e0b",
    customTextColor: "#0f172a",
    logoType: "taxi",
    customLogoUrl: "",
    showQrCode: true,
    whatsappMessage: `Hey! Check out TaxiApp to book safe, fast, and comfortable rides anytime: ${defaultUrl}`,
    emailSubject: "Invitation to join TaxiApp",
    emailBody: `Hey there,\n\nI'm inviting you to try TaxiApp for fast and reliable rides. Check it out here:\n${defaultUrl}\n\nSee you on board!`,
    enabledApps: {
      whatsapp: true,
      telegram: true,
      sms: true,
      email: true,
      facebook: true,
      twitter: true,
      copyLink: true,
      nativeShare: true
    }
  };

  const [settings, setSettings] = useState<InviteSettings>({
    ...defaultInviteSettings,
    ...(config.inviteSettings || {})
  });

  const [previewTab, setPreviewTab] = useState<'card' | 'shareSheet' | 'chat'>('card');
  const [copiedTest, setCopiedTest] = useState(false);
  const [previewDarkBg, setPreviewDarkBg] = useState(false);

  // Theme presets mapping
  const themePresets = {
    amber: {
      bg: "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600",
      text: "text-slate-950",
      subtext: "text-slate-800",
      badge: "bg-slate-950 text-amber-300 border-amber-400/40",
      button: "bg-slate-950 text-amber-400 hover:bg-slate-900 border-slate-800",
      border: "border-amber-300/80"
    },
    slate: {
      bg: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950",
      text: "text-white",
      subtext: "text-slate-300",
      badge: "bg-amber-400 text-slate-950 border-amber-300",
      button: "bg-amber-400 text-slate-950 hover:bg-amber-300 border-amber-500",
      border: "border-slate-700"
    },
    emerald: {
      bg: "bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900",
      text: "text-white",
      subtext: "text-emerald-100",
      badge: "bg-emerald-950 text-emerald-300 border-emerald-400/40",
      button: "bg-white text-emerald-950 hover:bg-emerald-50 border-emerald-200",
      border: "border-emerald-500/80"
    },
    indigo: {
      bg: "bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900",
      text: "text-white",
      subtext: "text-indigo-100",
      badge: "bg-indigo-950 text-indigo-300 border-indigo-400/40",
      button: "bg-amber-400 text-slate-950 hover:bg-amber-300 border-amber-500",
      border: "border-indigo-500/80"
    },
    rose: {
      bg: "bg-gradient-to-br from-rose-500 via-pink-600 to-red-700",
      text: "text-white",
      subtext: "text-rose-100",
      badge: "bg-rose-950 text-rose-300 border-rose-400/40",
      button: "bg-white text-rose-950 hover:bg-rose-50 border-rose-200",
      border: "border-rose-400/80"
    },
    sunset: {
      bg: "bg-gradient-to-br from-orange-500 via-amber-600 to-red-600",
      text: "text-white",
      subtext: "text-amber-100",
      badge: "bg-slate-950 text-amber-300 border-amber-400/40",
      button: "bg-slate-950 text-amber-400 hover:bg-slate-900 border-slate-800",
      border: "border-orange-400/80"
    },
    custom: {
      bg: "",
      text: "text-white",
      subtext: "opacity-90",
      badge: "bg-black/30 text-white border-white/20",
      button: "bg-white text-slate-950 hover:bg-slate-100 border-slate-200",
      border: "border-white/20"
    }
  };

  const activeTheme = themePresets[settings.cardTheme || 'amber'];

  const handleSave = () => {
    updateConfig(prev => ({
      ...prev,
      inviteSettings: settings
    }));
    setToast?.({
      message: "Refer & Invite template settings saved successfully!",
      type: "success"
    });
  };

  const handleReset = () => {
    setSettings(defaultInviteSettings);
    updateConfig(prev => ({
      ...prev,
      inviteSettings: defaultInviteSettings
    }));
    setToast?.({
      message: "Refer & Invite settings reset to defaults.",
      type: "info"
    });
  };

  const focusField = (fieldId: string) => {
    const el = document.getElementById(fieldId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
      el.classList.add('ring-2', 'ring-amber-400');
      setTimeout(() => el.classList.remove('ring-2', 'ring-amber-400'), 1800);
    }
  };

  const renderLogo = () => {
    switch (settings.logoType) {
      case 'gift':
        return <Gift size={26} />;
      case 'sparkles':
        return <Sparkles size={26} />;
      case 'user':
        return <UserPlus size={26} />;
      case 'custom':
        if (settings.customLogoUrl) {
          return <img src={settings.customLogoUrl} alt="Logo" className="w-7 h-7 object-contain rounded-md" />;
        }
        return <Car size={26} />;
      case 'taxi':
      default:
        return <Car size={26} />;
    }
  };

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Top Header matching other backend admin modules */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <UserPlus className="text-slate-800 dark:text-slate-200" size={24} />
            <span>Refer or Invite</span>
          </h2>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            settings.enabled 
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}>
            {settings.enabled ? 'Module Enabled' : 'Module Disabled'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Master Enable/Disable Switch Pill */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-700 shadow-2xs">
            <span className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider select-none">
              ENABLE REFER OR INVITE:
            </span>
            <button 
              type="button"
              onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none items-center p-0.5 ${
                settings.enabled ? "bg-amber-400" : "bg-slate-300 dark:bg-slate-600"
              }`}
              title={settings.enabled ? "Refer or Invite Enabled" : "Refer or Invite Disabled"}
              aria-label="Toggle Refer or Invite"
            >
              <span className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out absolute left-0.5 ${
                settings.enabled ? "translate-x-5.5" : "translate-x-0"
              }`} />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer"
            title="Reset to Default Preset"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border border-amber-500"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {!settings.enabled && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl flex items-center gap-3 text-amber-900 dark:text-amber-200 text-xs font-medium">
          <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Refer or Invite module is currently disabled globally. Riders and drivers will not see the Refer or Invite options or share buttons in their account drawer. Toggle "ENABLE REFER OR INVITE" above to re-activate.</span>
        </div>
      )}

      {/* Main Grid: Left Controls & Right Real-Time Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Customizer Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card Content & Text Editor */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Edit3 size={18} className="text-amber-500" />
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                1. Invite Card Content & Text
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Card Main Title
                </label>
                <input
                  id="input-title"
                  type="text"
                  value={settings.title || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Invite your Friends to TaxiApp"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white rounded-xl p-3 outline-none focus:border-amber-400 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Headline / Subtitle
                </label>
                <input
                  id="input-headline"
                  type="text"
                  value={settings.headline || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, headline: e.target.value }))}
                  placeholder="Book safe, fast, and comfortable rides anytime!"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 rounded-xl p-3 outline-none focus:border-amber-400 font-medium transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Description / Body Text
                </label>
                <textarea
                  id="input-description"
                  rows={3}
                  value={settings.description || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Experience seamless urban commuting..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 rounded-xl p-3 outline-none focus:border-amber-400 resize-none font-medium transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Sharing Link / Target URL
                  </label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      id="input-share-url"
                      type="url"
                      value={settings.shareUrl || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, shareUrl: e.target.value }))}
                      placeholder="https://taxiapp.com"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white rounded-xl p-3 pl-10 outline-none focus:border-amber-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Action Button Label
                  </label>
                  <input
                    id="input-button-text"
                    type="text"
                    value={settings.buttonText || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, buttonText: e.target.value }))}
                    placeholder="Start Riding Now"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white rounded-xl p-3 outline-none focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Card Top Badge Tag
                </label>
                <input
                  id="input-badge-text"
                  type="text"
                  value={settings.badgeText || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, badgeText: e.target.value }))}
                  placeholder="⭐ EXCLUSIVE INVITE"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-900 dark:text-white rounded-xl p-3 outline-none focus:border-amber-400 uppercase tracking-wider transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card Appearance & Styling ("Edit the entire card") */}
          <div id="section-theme-logo" className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Palette size={18} className="text-amber-500" />
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  2. Card Theme & Visual Customizer
                </h2>
              </div>
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Full Card Styling
              </span>
            </div>

            {/* Theme Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Select Card Theme Preset:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'amber', name: 'Amber Gold', bg: 'bg-amber-500 text-slate-950' },
                  { id: 'slate', name: 'Dark Slate', bg: 'bg-slate-900 text-white' },
                  { id: 'emerald', name: 'Emerald Ride', bg: 'bg-emerald-600 text-white' },
                  { id: 'indigo', name: 'Indigo Night', bg: 'bg-indigo-600 text-white' },
                  { id: 'rose', name: 'Sunset Rose', bg: 'bg-rose-500 text-white' },
                  { id: 'sunset', name: 'Sunset Flame', bg: 'bg-orange-500 text-white' },
                  { id: 'custom', name: 'Custom Color', bg: 'bg-slate-400 text-slate-900' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSettings(prev => ({ ...prev, cardTheme: preset.id as any }))}
                    className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all border cursor-pointer ${
                      settings.cardTheme === preset.id 
                        ? 'border-amber-500 ring-2 ring-amber-400/50 shadow-xs' 
                        : 'border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100'
                    } ${preset.bg}`}
                  >
                    <span>{preset.name}</span>
                    {settings.cardTheme === preset.id && <Check size={14} className="stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom hex colors if custom selected */}
            {settings.cardTheme === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Custom Background Color / Hex
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.customBgColor || '#f59e0b'}
                      onChange={(e) => setSettings(prev => ({ ...prev, customBgColor: e.target.value }))}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-600 p-0.5 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      value={settings.customBgColor || '#f59e0b'}
                      onChange={(e) => setSettings(prev => ({ ...prev, customBgColor: e.target.value }))}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold p-2.5 rounded-xl uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Custom Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.customTextColor || '#0f172a'}
                      onChange={(e) => setSettings(prev => ({ ...prev, customTextColor: e.target.value }))}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-600 p-0.5 bg-white dark:bg-slate-900"
                    />
                    <input
                      type="text"
                      value={settings.customTextColor || '#0f172a'}
                      onChange={(e) => setSettings(prev => ({ ...prev, customTextColor: e.target.value }))}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold p-2.5 rounded-xl uppercase"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Logo / Icon Selector & QR Code toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  Card Logo / Icon Type
                </label>
                <select
                  value={settings.logoType || 'taxi'}
                  onChange={(e) => setSettings(prev => ({ ...prev, logoType: e.target.value as any }))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white rounded-xl p-3 outline-none focus:border-amber-400"
                >
                  <option value="taxi">🚕 Taxi Vehicle Icon</option>
                  <option value="gift">🎁 Gift Box Icon</option>
                  <option value="sparkles">✨ Sparkles Icon</option>
                  <option value="user">👤 User Plus Icon</option>
                  <option value="custom">🖼️ Custom Image URL</option>
                </select>
              </div>

              {settings.logoType === 'custom' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Custom Logo Image URL
                  </label>
                  <input
                    type="url"
                    value={settings.customLogoUrl || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, customLogoUrl: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white rounded-xl p-3 outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div className="md:col-span-2 flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                    Show QR Code on Card Preview
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Allows mobile users to scan the link directly off the card screen.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showQrCode !== false}
                  onChange={(e) => setSettings(prev => ({ ...prev, showQrCode: e.target.checked }))}
                  className="w-5 h-5 rounded-md text-amber-500 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Suggested Apps & Social Media Pre-filled Content */}
          <div id="section-suggested-apps" className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-all">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Share2 size={18} className="text-amber-500" />
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                3. Suggested Apps & Pre-filled Messages
              </h2>
            </div>

            {/* Toggle Channels */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Enabled Suggested Sharing Apps:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { key: 'whatsapp', label: 'WhatsApp', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                  { key: 'telegram', label: 'Telegram', color: 'bg-sky-50 text-sky-800 border-sky-300' },
                  { key: 'sms', label: 'SMS Messages', color: 'bg-amber-50 text-amber-800 border-amber-300' },
                  { key: 'email', label: 'Email', color: 'bg-rose-50 text-rose-800 border-rose-300' },
                  { key: 'facebook', label: 'Facebook', color: 'bg-blue-50 text-blue-800 border-blue-300' },
                  { key: 'twitter', label: 'Twitter / X', color: 'bg-slate-100 text-slate-800 border-slate-300' },
                  { key: 'copyLink', label: 'Copy Link', color: 'bg-purple-50 text-purple-800 border-purple-300' },
                  { key: 'nativeShare', label: 'System Share', color: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
                ].map((item) => {
                  const isChecked = settings.enabledApps?.[item.key as keyof typeof settings.enabledApps] !== false;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        enabledApps: {
                          ...(prev.enabledApps || {}),
                          [item.key]: !isChecked
                        }
                      }))}
                      className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border cursor-pointer transition-all ${
                        isChecked 
                          ? `${item.color} shadow-2xs font-extrabold` 
                          : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 line-through'
                      }`}
                    >
                      <span>{item.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent button click
                        className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Pre-filled Messages */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  WhatsApp & Chat Pre-filled Message Template
                </label>
                <textarea
                  rows={2}
                  value={settings.whatsappMessage || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, whatsappMessage: e.target.value }))}
                  placeholder="Hey! Check out TaxiApp..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl p-3 outline-none focus:border-amber-400 resize-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    value={settings.emailSubject || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, emailSubject: e.target.value }))}
                    placeholder="Invitation to join TaxiApp"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white rounded-xl p-3 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                    Email Body Text
                  </label>
                  <input
                    type="text"
                    value={settings.emailBody || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, emailBody: e.target.value }))}
                    placeholder="Hey there, check out TaxiApp..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-xl p-3 outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Real-Time Share Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-6 self-start">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  Live Template Preview
                </h3>
                <p className="text-[11px] text-slate-400">See how riders & drivers will view this invite card</p>
              </div>

              {/* Dark/Light Preview Canvas Toggle */}
              <button
                onClick={() => setPreviewDarkBg(!previewDarkBg)}
                className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {previewDarkBg ? '☀️ Light Canvas' : '🌙 Dark Canvas'}
              </button>
            </div>

            {/* Preview Mode Selector Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              {[
                { id: 'card', label: '🎴 Share Card' },
                { id: 'shareSheet', label: '📱 App Sheet' },
                { id: 'chat', label: '💬 Chat Message' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPreviewTab(tab.id as any)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    previewTab === tab.id
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* PREVIEW CANVAS CONTAINER */}
            <div className={`p-4 rounded-2xl border transition-all ${
              previewDarkBg 
                ? 'bg-slate-950 border-slate-800 text-white' 
                : 'bg-slate-100 border-slate-200 text-slate-900'
            }`}>

              {/* TAB 1: SHARE CARD PREVIEW */}
              {previewTab === 'card' && (
                <div className="space-y-3">
                  <div 
                    style={settings.cardTheme === 'custom' ? { backgroundColor: settings.customBgColor || '#f59e0b', color: settings.customTextColor || '#0f172a' } : {}}
                    className={`p-4 rounded-2xl border shadow-md space-y-3 text-center transition-all relative overflow-hidden ${
                      settings.cardTheme !== 'custom' ? `${activeTheme.bg} ${activeTheme.text} ${activeTheme.border}` : ''
                    }`}
                  >
                    {/* Top Tag Badge - Clickable */}
                    <div 
                      onClick={() => focusField('input-badge-text')}
                      title="Click to edit Badge Tag"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs mx-auto cursor-pointer hover:scale-105 transition-transform bg-white/20 hover:bg-white/30"
                    >
                      <span>{settings.badgeText || "⭐ EXCLUSIVE INVITE"}</span>
                    </div>

                    {/* Logo & Main Title - Clickable */}
                    <div className="space-y-1.5">
                      <div 
                        onClick={() => focusField('section-theme-logo')}
                        title="Click to edit Logo & Theme"
                        className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center shadow-inner border border-white/30 cursor-pointer hover:scale-105 transition-transform"
                      >
                        {renderLogo()}
                      </div>
                      <h4 
                        onClick={() => focusField('input-title')}
                        title="Click to edit Card Main Title"
                        className="text-base font-black tracking-tight leading-snug cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        {settings.title || "Invite your Friends to TaxiApp"}
                      </h4>
                      <p 
                        onClick={() => focusField('input-headline')}
                        title="Click to edit Subtitle"
                        className={`text-xs font-medium px-2 cursor-pointer hover:opacity-80 transition-opacity ${settings.cardTheme !== 'custom' ? activeTheme.subtext : 'opacity-90'}`}
                      >
                        {settings.headline || "Book safe, fast, and comfortable rides anytime!"}
                      </p>
                    </div>

                    {/* Body Text - Clickable */}
                    <p 
                      onClick={() => focusField('input-description')}
                      title="Click to edit Description"
                      className="text-[11px] leading-relaxed opacity-80 px-1 line-clamp-2 cursor-pointer hover:opacity-100 transition-opacity"
                    >
                      {settings.description || "Experience seamless urban commuting with verified drivers, instant booking, and zero surge pricing."}
                    </p>

                    {/* Optional QR Code Box - Clickable */}
                    {settings.showQrCode !== false && (
                      <div 
                        onClick={() => focusField('section-theme-logo')}
                        title="Click to edit QR Code setting"
                        className="w-20 h-20 mx-auto bg-white p-1.5 rounded-xl shadow-xs border border-black/10 flex flex-col items-center justify-center text-slate-900 cursor-pointer hover:scale-105 transition-transform"
                      >
                        <QrCode size={52} className="text-slate-900" />
                        <span className="text-[7px] font-extrabold uppercase tracking-wider">Scan Link</span>
                      </div>
                    )}

                    {/* CTA Button - Clickable */}
                    <button 
                      onClick={() => focusField('input-button-text')}
                      title="Click to edit Button Label"
                      className={`w-full py-2.5 px-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5 border cursor-pointer hover:opacity-95 ${
                        settings.cardTheme !== 'custom' ? activeTheme.button : 'bg-white text-slate-950'
                      }`}
                    >
                      <span>{settings.buttonText || "Start Riding Now"}</span>
                      <ExternalLink size={13} />
                    </button>

                    {/* Footer link URL - Clickable */}
                    <div className="pt-0.5">
                      <span 
                        onClick={() => focusField('input-share-url')}
                        title="Click to edit Share URL"
                        className="text-[10px] font-mono opacity-75 underline truncate block max-w-full cursor-pointer hover:opacity-100"
                      >
                        {settings.shareUrl || defaultUrl}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MOBILE SHARE SHEET PREVIEW */}
              {previewTab === 'shareSheet' && (
                <div 
                  onClick={() => focusField('section-suggested-apps')}
                  title="Click to edit Suggested Apps"
                  className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 cursor-pointer hover:border-amber-400/80 transition-all"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-black uppercase text-slate-800 dark:text-slate-200">
                      Suggested App Share Sheet
                    </span>
                    <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold">Click to configure</span>
                  </div>

                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate flex-1">
                      {settings.shareUrl || defaultUrl}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(settings.shareUrl || defaultUrl);
                        setCopiedTest(true);
                        setTimeout(() => setCopiedTest(false), 2000);
                      }}
                      className="px-2 py-0.5 bg-amber-400 text-slate-950 font-bold text-[9px] uppercase rounded-md shrink-0 cursor-pointer"
                    >
                      {copiedTest ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {settings.enabledApps?.whatsapp !== false && (
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
                        <MessageSquare size={13} />
                        <span>WhatsApp</span>
                      </div>
                    )}
                    {settings.enabledApps?.telegram !== false && (
                      <div className="p-2 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 rounded-lg border border-sky-200 dark:border-sky-800 text-[11px] font-bold flex items-center gap-1.5">
                        <Send size={13} />
                        <span>Telegram</span>
                      </div>
                    )}
                    {settings.enabledApps?.sms !== false && (
                      <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800 text-[11px] font-bold flex items-center gap-1.5">
                        <Smartphone size={13} />
                        <span>SMS Text</span>
                      </div>
                    )}
                    {settings.enabledApps?.email !== false && (
                      <div className="p-2 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 rounded-lg border border-rose-200 dark:border-rose-800 text-[11px] font-bold flex items-center gap-1.5">
                        <Mail size={13} />
                        <span>Email</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: CHAT MESSAGE BUBBLE PREVIEW */}
              {previewTab === 'chat' && (
                <div 
                  onClick={() => focusField('section-suggested-apps')}
                  title="Click to edit Chat Messages"
                  className="bg-[#0b141a] p-3 rounded-xl space-y-2 font-sans text-white border border-slate-800 cursor-pointer hover:border-amber-400/80 transition-all"
                >
                  <div className="text-[9px] font-bold text-center text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-800 flex justify-between px-1">
                    <span>WhatsApp Message Preview</span>
                    <span className="text-amber-400">Click to edit</span>
                  </div>

                  <div className="max-w-[90%] bg-[#005c4b] p-2.5 rounded-xl rounded-tr-none ml-auto text-xs space-y-1.5 shadow-xs text-white">
                    <p className="leading-snug text-[11px]">
                      {settings.whatsappMessage || `Hey! Check out TaxiApp to book safe, fast, and comfortable rides anytime: ${settings.shareUrl}`}
                    </p>

                    {/* Rich Link Card Preview */}
                    <div className="p-2 bg-[#025143] rounded-lg border border-[#007a63] space-y-0.5">
                      <div className="text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                        TaxiApp Official Website
                      </div>
                      <div className="text-[11px] font-bold text-white truncate">
                        {settings.title}
                      </div>
                      <div className="text-[9px] text-slate-300 line-clamp-1">
                        {settings.headline}
                      </div>
                    </div>

                    <div className="text-[8px] text-slate-300 text-right font-mono">
                      10:42 AM ✓✓
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Status Information Box */}
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-xs space-y-1 text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                <AlertCircle size={14} className="text-amber-600 dark:text-amber-400" />
                <span>Sync Notice</span>
              </div>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90">
                Saving these settings instantly updates the <strong>Invite a Friend</strong> dialog across the entire mobile & web application for all users.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
