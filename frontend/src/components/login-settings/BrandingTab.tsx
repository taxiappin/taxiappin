import React, { useState } from "react";
import { Upload, ImageIcon, X, Smartphone, User, Car, Sparkles, Moon, Sun, Shield, Layers, Send, CheckCircle2, AlertCircle, RefreshCw, Flame } from "lucide-react";

interface BrandingTabProps {
  promoTickerText: string;
  setPromoTickerText: (val: string) => void;
  logoText: string;
  setLogoText: (val: string) => void;
  logoUrl: string;
  setLogoUrl: (val: string) => void;
  darkLogoUrl?: string;
  setDarkLogoUrl?: (val: string) => void;
  riderLogoUrl?: string;
  setRiderLogoUrl?: (val: string) => void;
  riderDarkLogoUrl?: string;
  setRiderDarkLogoUrl?: (val: string) => void;
  driverLogoUrl?: string;
  setDriverLogoUrl?: (val: string) => void;
  driverDarkLogoUrl?: string;
  setDriverDarkLogoUrl?: (val: string) => void;
  riderTextLogo?: string;
  setRiderTextLogo?: (val: string) => void;
  riderTagline?: string;
  setRiderTagline?: (val: string) => void;
  driverTextLogo?: string;
  setDriverTextLogo?: (val: string) => void;
  driverTagline?: string;
  setDriverTagline?: (val: string) => void;
  loginTitle: string;
  setLoginTitle: (val: string) => void;
  loginSubtext: string;
  setLoginSubtext: (val: string) => void;
  bookRightsText: string;
  setBookRightsText: (val: string) => void;
  quickDemoEnabled: boolean;
  setQuickDemoEnabled: (val: boolean) => void;
  quickDemoRiderEmail: string;
  setQuickDemoRiderEmail: (val: string) => void;
  quickDemoRiderPhone: string;
  setQuickDemoRiderPhone: (val: string) => void;
  quickDemoRiderPassword: string;
  setQuickDemoRiderPassword: (val: string) => void;
  quickDemoDriverEmail: string;
  setQuickDemoDriverEmail: (val: string) => void;
  quickDemoDriverPhone: string;
  setQuickDemoDriverPhone: (val: string) => void;
  quickDemoDriverPassword: string;
  setQuickDemoDriverPassword: (val: string) => void;
  otpMode?: "simulated" | "sms";
  setOtpMode?: (val: "simulated" | "sms") => void;
  handleLogoFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDarkLogoFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRiderLogoFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRiderDarkLogoFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDriverLogoFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDriverDarkLogoFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BrandingTab: React.FC<BrandingTabProps> = ({
  promoTickerText,
  setPromoTickerText,
  logoText,
  setLogoText,
  logoUrl,
  setLogoUrl,
  darkLogoUrl = "",
  setDarkLogoUrl,
  riderLogoUrl = "",
  setRiderLogoUrl,
  riderDarkLogoUrl = "",
  setRiderDarkLogoUrl,
  driverLogoUrl = "",
  setDriverLogoUrl,
  driverDarkLogoUrl = "",
  setDriverDarkLogoUrl,
  riderTextLogo = "",
  setRiderTextLogo,
  riderTagline = "",
  setRiderTagline,
  driverTextLogo = "",
  setDriverTextLogo,
  driverTagline = "",
  setDriverTagline,
  loginTitle,
  setLoginTitle,
  loginSubtext,
  setLoginSubtext,
  bookRightsText,
  setBookRightsText,
  quickDemoEnabled,
  setQuickDemoEnabled,
  quickDemoRiderEmail,
  setQuickDemoRiderEmail,
  quickDemoRiderPhone,
  setQuickDemoRiderPhone,
  quickDemoRiderPassword,
  setQuickDemoRiderPassword,
  quickDemoDriverEmail,
  setQuickDemoDriverEmail,
  quickDemoDriverPhone,
  setQuickDemoDriverPhone,
  quickDemoDriverPassword,
  setQuickDemoDriverPassword,
  otpMode = "simulated",
  setOtpMode,
  handleLogoFileUpload,
  handleDarkLogoFileUpload,
  handleRiderLogoFileUpload,
  handleRiderDarkLogoFileUpload,
  handleDriverLogoFileUpload,
  handleDriverDarkLogoFileUpload
}) => {
  return (
    <div className="space-y-6">
      {/* SECTION 1: LOGO & MODE IDENTITY CONTROLS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers size={20} className="text-amber-500" />
              <span>Logo & Mode Identity Studio</span>
            </h3>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full text-[10px] font-black uppercase tracking-wider">
              Mode Specific Logos
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure distinct brand logos for General App, Rider Mode, and Driver Mode so users instantly recognize which mode they are using.
          </p>
        </div>

        {/* 1A. MAIN APP / GENERAL BRAND LOGOS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ImageIcon size={16} className="text-amber-500" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              1. General Platform Logo (Default)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Light Logo */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sun size={14} className="text-amber-500" /> Light Mode Main Logo
                </label>
                <span className="text-[10px] text-slate-400 font-bold uppercase">PNG / SVG / WebP</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Main Light Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Car size={22} className="text-amber-500" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="Paste image URL (e.g. https://.../logo.png)"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[11px] rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 border border-amber-500/60 shadow-2xs">
                      <Upload size={12} /> Upload File
                      <input type="file" accept="image/*" onChange={handleLogoFileUpload} className="hidden" />
                    </label>
                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => setLogoUrl("")}
                        className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1 border border-rose-200/60"
                      >
                        <X size={12} /> Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Dark Logo */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Moon size={14} className="text-indigo-500" /> Dark Mode Main Logo
                </label>
                <span className="text-[10px] text-slate-400 font-bold uppercase">PNG / SVG / WebP</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200/90 flex items-center justify-center p-1.5 shrink-0 shadow-2xs overflow-hidden">
                  {darkLogoUrl ? (
                    <img src={darkLogoUrl} alt="Main Dark Logo" className="max-w-full max-h-full object-contain" />
                  ) : logoUrl ? (
                    <img src={logoUrl} alt="Main Fallback Logo" className="max-w-full max-h-full object-contain opacity-80" />
                  ) : (
                    <Car size={22} className="text-indigo-500" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    type="url"
                    value={darkLogoUrl}
                    onChange={(e) => setDarkLogoUrl && setDarkLogoUrl(e.target.value)}
                    placeholder="Paste image URL (e.g. https://.../dark-logo.png)"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-[11px] rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs">
                      <Upload size={12} /> Upload File
                      <input type="file" accept="image/*" onChange={handleDarkLogoFileUpload} className="hidden" />
                    </label>
                    {darkLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setDarkLogoUrl && setDarkLogoUrl("")}
                        className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1 border border-rose-200/60"
                      >
                        <X size={12} /> Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1B. RIDER MODE SPECIFIC LOGO */}
        <div className="p-4.5 bg-amber-50/40 rounded-2xl border border-amber-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={16} className="text-amber-600" />
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                2. Rider Mode Brand Identity Logo
              </h4>
            </div>
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
              Rider Active Header
            </span>
          </div>
          <p className="text-[11px] text-amber-800/80">
            This distinct logo is displayed in the header when the user is logged in as a <strong>Rider</strong> or during Rider booking flows.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rider Logo Text */}
            <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 space-y-2">
              <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">
                Rider Logo Title Text
              </label>
              <input
                type="text"
                value={riderTextLogo}
                onChange={(e) => setRiderTextLogo && setRiderTextLogo(e.target.value)}
                placeholder="e.g. TaxiApp"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
              />
            </div>

            {/* Rider Tagline / Subtext */}
            <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 space-y-2">
              <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">
                Rider Sub-Text / Tagline
              </label>
              <input
                type="text"
                value={riderTagline}
                onChange={(e) => setRiderTagline && setRiderTagline(e.target.value)}
                placeholder="e.g. Rider"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
              />
            </div>

            {/* Rider Light Logo */}
            <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 space-y-2.5">
              <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">
                Rider Light Logo Image
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  {riderLogoUrl ? (
                    <img src={riderLogoUrl} alt="Rider Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <User size={20} className="text-amber-600" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="url"
                    value={riderLogoUrl}
                    onChange={(e) => setRiderLogoUrl && setRiderLogoUrl(e.target.value)}
                    placeholder="https://.../rider-logo.png"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-[10px] rounded cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload size={10} /> Upload
                      <input type="file" accept="image/*" onChange={handleRiderLogoFileUpload} className="hidden" />
                    </label>
                    {riderLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setRiderLogoUrl && setRiderLogoUrl("")}
                        className="text-rose-600 hover:bg-rose-50 px-2 py-1 text-[10px] font-bold rounded cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Rider Dark Logo */}
            <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 space-y-2.5">
              <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">
                Rider Dark Mode Logo
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-100/60 border border-amber-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  {riderDarkLogoUrl ? (
                    <img src={riderDarkLogoUrl} alt="Rider Dark Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <User size={20} className="text-amber-700" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="url"
                    value={riderDarkLogoUrl}
                    onChange={(e) => setRiderDarkLogoUrl && setRiderDarkLogoUrl(e.target.value)}
                    placeholder="https://.../rider-dark-logo.png"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-[10px] rounded cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload size={10} /> Upload
                      <input type="file" accept="image/*" onChange={handleRiderDarkLogoFileUpload} className="hidden" />
                    </label>
                    {riderDarkLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setRiderDarkLogoUrl && setRiderDarkLogoUrl("")}
                        className="text-rose-600 hover:bg-rose-50 px-2 py-1 text-[10px] font-bold rounded cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1C. DRIVER MODE SPECIFIC LOGO */}
        <div className="p-4.5 bg-emerald-50/40 rounded-2xl border border-emerald-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car size={16} className="text-emerald-600" />
              <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                3. Driver Mode Brand Identity Logo
              </h4>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
              Driver Active Header
            </span>
          </div>
          <p className="text-[11px] text-emerald-800/80">
            This distinct logo is displayed in the header when the user toggles into <strong>Driver Mode</strong> or active dispatch screens.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Driver Logo Text */}
            <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 space-y-2">
              <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">
                Driver Logo Title Text
              </label>
              <input
                type="text"
                value={driverTextLogo}
                onChange={(e) => setDriverTextLogo && setDriverTextLogo(e.target.value)}
                placeholder="e.g. TaxiApp"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Driver Tagline / Subtext */}
            <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 space-y-2">
              <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">
                Driver Sub-Text / Tagline
              </label>
              <input
                type="text"
                value={driverTagline}
                onChange={(e) => setDriverTagline && setDriverTagline(e.target.value)}
                placeholder="e.g. Driver"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Driver Light Logo */}
            <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 space-y-2.5">
              <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">
                Driver Light Logo Image
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  {driverLogoUrl ? (
                    <img src={driverLogoUrl} alt="Driver Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Car size={20} className="text-emerald-600" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="url"
                    value={driverLogoUrl}
                    onChange={(e) => setDriverLogoUrl && setDriverLogoUrl(e.target.value)}
                    placeholder="https://.../driver-logo.png"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] rounded cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload size={10} /> Upload
                      <input type="file" accept="image/*" onChange={handleDriverLogoFileUpload} className="hidden" />
                    </label>
                    {driverLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setDriverLogoUrl && setDriverLogoUrl("")}
                        className="text-rose-600 hover:bg-rose-50 px-2 py-1 text-[10px] font-bold rounded cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Dark Logo */}
            <div className="p-3.5 bg-white rounded-xl border border-emerald-200/80 space-y-2.5">
              <label className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">
                Driver Dark Mode Logo
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-emerald-100/60 border border-emerald-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  {driverDarkLogoUrl ? (
                    <img src={driverDarkLogoUrl} alt="Driver Dark Logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Car size={20} className="text-emerald-700" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="url"
                    value={driverDarkLogoUrl}
                    onChange={(e) => setDriverDarkLogoUrl && setDriverDarkLogoUrl(e.target.value)}
                    placeholder="https://.../driver-dark-logo.png"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] rounded cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload size={10} /> Upload
                      <input type="file" accept="image/*" onChange={handleDriverDarkLogoFileUpload} className="hidden" />
                    </label>
                    {driverDarkLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setDriverDarkLogoUrl && setDriverDarkLogoUrl("")}
                        className="text-rose-600 hover:bg-rose-50 px-2 py-1 text-[10px] font-bold rounded cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PLATFORM BRAND COPY & HEADLINES */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" /> Platform Name, Headlines & Copy
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Customize platform name, top announcement ticker, login titles, and copyright metadata.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" /> Top Yellow Announcement Ticker Bar
            </label>
            <input
              type="text"
              value={promoTickerText}
              onChange={(e) => setPromoTickerText(e.target.value)}
              placeholder="e.g. Use promo code WELCOME50 to get flat ₹50 off on your very first ride booking!"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">App Name / Brand Text *</label>
            <input
              type="text"
              value={logoText}
              onChange={(e) => setLogoText(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Login Headline Title</label>
            <input
              type="text"
              value={loginTitle}
              onChange={(e) => setLoginTitle(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Tagline Subtext</label>
            <input
              type="text"
              value={loginSubtext}
              onChange={(e) => setLoginSubtext(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Book Rights & Copyright Footer</label>
            <input
              type="text"
              value={bookRightsText}
              onChange={(e) => setBookRightsText(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2B: OTP AUTHENTICATION & VERIFICATION ENGINE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Flame size={18} className="text-amber-500" /> OTP Authentication Engine Mode
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select how SMS OTP verification codes are dispatched for Rider/Driver registrations and Password Resets.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <Shield size={12} /> Active: {otpMode === "sms" ? "Production SMS Gateway" : "Simulated In-App OTP"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setOtpMode?.("simulated")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              otpMode === "simulated"
                ? "bg-amber-500/10 border-amber-500 text-slate-900 ring-2 ring-amber-400/40"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-slate-900">
                <Smartphone size={16} className="text-amber-500" /> In-App Simulation (Fast Test)
              </div>
              {otpMode === "simulated" && <CheckCircle2 size={16} className="text-amber-600" />}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Displays floating auto-fill token banner for instant rapid UI registration & password reset testing.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setOtpMode?.("sms")}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              otpMode === "sms"
                ? "bg-amber-500/10 border-amber-500 text-slate-900 ring-2 ring-amber-400/40"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-slate-900">
                <Send size={16} className="text-amber-500" /> SMS / SMTP Gateway
              </div>
              {otpMode === "sms" && <CheckCircle2 size={16} className="text-amber-600" />}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Dispatches verification tokens directly to email / phone using configured SMTP and SMS servers.
            </p>
          </button>
        </div>
      </div>

      {/* SECTION 3: QUICK DEMO FILL CREDENTIALS EDITOR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Smartphone size={18} className="text-amber-500" /> Quick Demo Fill Buttons
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Configure quick fill test buttons on the login page for rapid demo testing.</p>
          </div>
          <button
            type="button"
            onClick={() => setQuickDemoEnabled(!quickDemoEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
              quickDemoEnabled ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"
            }`}
          >
            {quickDemoEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        {quickDemoEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <User size={14} className="text-amber-500" /> Rider Quick Fill Account
              </h4>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={quickDemoRiderPhone}
                  onChange={(e) => setQuickDemoRiderPhone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                <input
                  type="email"
                  value={quickDemoRiderEmail}
                  onChange={(e) => setQuickDemoRiderEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Password</label>
                <input
                  type="password"
                  value={quickDemoRiderPassword}
                  onChange={(e) => setQuickDemoRiderPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2.5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Car size={14} className="text-amber-500" /> Driver Quick Fill Account
              </h4>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={quickDemoDriverPhone}
                  onChange={(e) => setQuickDemoDriverPhone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                <input
                  type="email"
                  value={quickDemoDriverEmail}
                  onChange={(e) => setQuickDemoDriverEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Password</label>
                <input
                  type="password"
                  value={quickDemoDriverPassword}
                  onChange={(e) => setQuickDemoDriverPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-slate-800"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
