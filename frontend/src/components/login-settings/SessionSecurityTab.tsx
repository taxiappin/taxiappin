import React, { useState } from "react";
import {
  ShieldAlert,
  Clock,
  Lock,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Sliders,
  ShieldCheck,
  Zap,
  Activity,
  Info
} from "lucide-react";
import { SessionSecuritySettings } from "./types";

interface SessionSecurityTabProps {
  sessionSettings: SessionSecuritySettings;
  setSessionSettings: (settings: SessionSecuritySettings) => void;
  setToast: (toast: { show: boolean; message: string; type: "success" | "error" | "info" }) => void;
}

const PRESET_DURATIONS = [
  { label: "Never / Manual Logout Only", minutes: 0, description: "Users remain logged in indefinitely until they explicitly click Log Out.", badge: "Persistent" },
  { label: "15 Minutes (Strict Security)", minutes: 15, description: "High-security banking & financial level timeout.", badge: "Strict" },
  { label: "30 Minutes (High Security)", minutes: 30, description: "Auto-logout after 30 minutes of session duration.", badge: "Secure" },
  { label: "1 Hour", minutes: 60, description: "Session valid for 60 minutes.", badge: "Short" },
  { label: "4 Hours", minutes: 240, description: "Ideal for brief shifts or temporary kiosk usage.", badge: "Shift" },
  { label: "8 Hours (Standard Driver Shift)", minutes: 480, description: "Full working shift duration for drivers and daily dispatch.", badge: "Shift" },
  { label: "12 Hours (Half-Day)", minutes: 720, description: "Covers day-long operations without interruptions.", badge: "Daily" },
  { label: "24 Hours / 1 Day (Recommended)", minutes: 1440, description: "Full 24-hour daily commute session. Users stay logged in for the whole day until manual logout.", badge: "Default ★" },
  { label: "7 Days (Weekly)", minutes: 10080, description: "Convenient weekly login session for frequent riders and regular captains.", badge: "Weekly" },
  { label: "30 Days (Monthly)", minutes: 43200, description: "Extended 30-day session for regular riders.", badge: "Extended" }
];

export const SessionSecurityTab: React.FC<SessionSecurityTabProps> = ({
  sessionSettings,
  setSessionSettings,
  setToast
}) => {
  const [customUnit, setCustomUnit] = useState<"minutes" | "hours" | "days">("hours");
  const [customValue, setCustomValue] = useState<number>(() => {
    if (sessionSettings.sessionTimeoutMinutes % 1440 === 0 && sessionSettings.sessionTimeoutMinutes > 0) {
      return sessionSettings.sessionTimeoutMinutes / 1440;
    }
    if (sessionSettings.sessionTimeoutMinutes % 60 === 0 && sessionSettings.sessionTimeoutMinutes > 0) {
      return sessionSettings.sessionTimeoutMinutes / 60;
    }
    return sessionSettings.sessionTimeoutMinutes || 24;
  });

  const isPresetSelected = (minutes: number) => {
    return sessionSettings.sessionTimeoutMinutes === minutes;
  };

  const handleSelectPreset = (minutes: number) => {
    setSessionSettings({
      ...sessionSettings,
      sessionTimeoutMinutes: minutes
    });
    setToast({
      show: true,
      message: minutes === 0 ? "Session policy set to: Manual Logout Only (Persistent)" : `Session timeout set to: ${minutes >= 1440 ? `${minutes / 1440} day(s)` : minutes >= 60 ? `${minutes / 60} hour(s)` : `${minutes} minute(s)`}`,
      type: "success"
    });
  };

  const handleApplyCustom = () => {
    let computedMinutes = customValue;
    if (customUnit === "hours") computedMinutes = customValue * 60;
    if (customUnit === "days") computedMinutes = customValue * 1440;

    setSessionSettings({
      ...sessionSettings,
      sessionTimeoutMinutes: Math.max(0, computedMinutes)
    });
    setToast({
      show: true,
      message: `Custom session timeout set to ${customValue} ${customUnit} (${computedMinutes} minutes)`,
      type: "success"
    });
  };

  const formatDurationDisplay = (mins: number) => {
    if (mins === 0) return "Never (Manual Logout Only)";
    if (mins % 1440 === 0) return `${mins / 1440} Day(s) (${mins} min)`;
    if (mins % 60 === 0) return `${mins / 60} Hour(s) (${mins} min)`;
    return `${mins} Minutes`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/60 p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-amber-400 text-slate-950 rounded-xl shrink-0 mt-0.5">
          <ShieldAlert size={20} />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span>Session & Anti-Fraud Security Timeout Control</span>
            <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md text-[10px] font-black uppercase tracking-wider">
              Fraud Prevention
            </span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Configure how long Riders and Drivers remain authenticated. When users log in for the day, they will not be logged out until they explicitly click <strong className="text-slate-900">Log Out</strong> or their session exceeds the configured security threshold below. This protects against unauthorized account takeover and stale session fraud.
          </p>
        </div>
      </div>

      {/* Current Active Status Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Current Active Session Expiry</div>
            <div className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>{formatDurationDisplay(sessionSettings.sessionTimeoutMinutes)}</span>
              {sessionSettings.allowStayLoggedIn && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>Day Stay-Logged-In Active</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Inactivity Guard:</span>
          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${sessionSettings.inactivityTimeoutMinutes > 0 ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-700"}`}>
            {sessionSettings.inactivityTimeoutMinutes > 0 ? `${sessionSettings.inactivityTimeoutMinutes} mins` : "Disabled"}
          </span>
        </div>
      </div>

      {/* SECTION 1: PRESET DURATION CHOICES */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="text-amber-500" size={18} />
            <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide">
              1. Session Timeout Duration Presets
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Select a recommended profile</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {PRESET_DURATIONS.map((preset) => {
            const selected = isPresetSelected(preset.minutes);
            return (
              <button
                key={preset.minutes}
                type="button"
                onClick={() => handleSelectPreset(preset.minutes)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                  selected
                    ? "bg-amber-50/80 border-amber-400 shadow-xs ring-1 ring-amber-400"
                    : "bg-slate-50/50 hover:bg-slate-100/70 border-slate-200"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black ${selected ? "text-slate-950" : "text-slate-800"}`}>
                      {preset.label}
                    </span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      selected ? "bg-amber-400 text-slate-950" : "bg-slate-200 text-slate-700"
                    }`}>
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {preset.description}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                  selected ? "border-amber-500 bg-amber-400 text-slate-950" : "border-slate-300 bg-white"
                }`}>
                  {selected && <CheckCircle2 size={13} className="text-slate-950 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* CUSTOM TIME INPUT */}
        <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Sliders size={14} className="text-slate-600" />
            <span>Or Define a Custom Session Timeout</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              min={1}
              max={365}
              value={customValue}
              onChange={(e) => setCustomValue(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-28 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
              placeholder="e.g. 24"
            />
            <select
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
            <button
              type="button"
              onClick={handleApplyCustom}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Apply Custom Time
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: INACTIVITY & PERSISTENCE POLICIES */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="text-amber-500" size={18} />
            <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide">
              2. Activity & Daily Persistence Policies
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stay Logged In Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900 flex items-center gap-2 cursor-pointer">
                <Lock size={14} className="text-amber-600" />
                <span>Daily Stay Logged In Policy</span>
              </label>
              <input
                type="checkbox"
                checked={sessionSettings.allowStayLoggedIn}
                onChange={(e) => setSessionSettings({ ...sessionSettings, allowStayLoggedIn: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              When enabled, riders and drivers stay logged in across page refreshes and app re-opens for the day without being logged out until manual logout or timeout.
            </p>
          </div>

          {/* Anti-Fraud Protection */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-900 flex items-center gap-2 cursor-pointer">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Anti-Fraud Token Validation</span>
              </label>
              <input
                type="checkbox"
                checked={sessionSettings.enableFraudPrevention}
                onChange={(e) => setSessionSettings({ ...sessionSettings, enableFraudPrevention: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Automatically invalidates tokens and terminates sessions if suspicious credential modification or session hijacking is detected.
            </p>
          </div>

          {/* Inactivity Auto-Logout Timeout */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-black text-slate-900 flex items-center gap-2">
              <Clock size={14} className="text-blue-600" />
              <span>Inactivity Auto-Logout Duration</span>
            </label>
            <select
              value={sessionSettings.inactivityTimeoutMinutes}
              onChange={(e) => setSessionSettings({ ...sessionSettings, inactivityTimeoutMinutes: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value={0}>Disabled (Only Max Session Expiry Applies)</option>
              <option value={15}>15 Minutes of Inactivity</option>
              <option value={30}>30 Minutes of Inactivity</option>
              <option value={60}>1 Hour of Inactivity</option>
              <option value={120}>2 Hours of Inactivity</option>
              <option value={240}>4 Hours of Inactivity</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Logs out the user if no clicks or touches are registered for this duration.
            </p>
          </div>

          {/* Maximum Active Devices */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <label className="text-xs font-black text-slate-900 flex items-center gap-2">
              <Smartphone size={14} className="text-purple-600" />
              <span>Max Concurrent Active Devices</span>
            </label>
            <select
              value={sessionSettings.maxActiveSessionsPerUser}
              onChange={(e) => setSessionSettings({ ...sessionSettings, maxActiveSessionsPerUser: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value={1}>1 Active Device (Strict Single-Device)</option>
              <option value={2}>2 Devices (Phone + Tablet/Laptop)</option>
              <option value={5}>5 Devices (Multi-Device Household)</option>
              <option value={0}>Unlimited Devices</option>
            </select>
            <p className="text-[11px] text-slate-500">
              Restricts concurrent logins to prevent account sharing and driver credential abuse.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: SESSION EXPIRY NOTIFICATION MESSAGE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Info className="text-amber-500" size={18} />
          <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide">
            3. Session Expiry & Auto-Logout User Notice
          </h4>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Notification message shown to user when session expires:
          </label>
          <input
            type="text"
            value={sessionSettings.logoutMessage}
            onChange={(e) => setSessionSettings({ ...sessionSettings, logoutMessage: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            placeholder="Your session has ended for security and anti-fraud protection. Please log in again."
          />
        </div>
      </div>
    </div>
  );
};
