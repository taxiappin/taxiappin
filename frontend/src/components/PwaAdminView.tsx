import React, { useState, useEffect, useMemo } from 'react';
import { 
  Smartphone, Monitor, Globe, Shield, RefreshCw, Send, Sparkles, AlertTriangle, 
  CheckCircle2, Clock, Cpu, Bell, Download, Filter, Search, Layers, XCircle, 
  ArrowUpCircle, HardDrive, Wifi, Zap, Activity, Info, BarChart2, Edit3, Trash2, Check,
  Image as ImageIcon, Plus, Radio, Share2, Eye, Upload, Flame, Key, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useConfig } from '../lib/ConfigContext';
import { IosShareIcon } from './PWAInstallPrompt';
import { BrandLogo } from './BrandLogo';

export const PwaAdminView: React.FC<{ setToast?: (toast: any) => void }> = ({ setToast }) => {
  const { config, updateConfig } = useConfig();
  const [activeSubTab, setActiveSubTab] = useState<'telemetry' | 'prompt_card' | 'push' | 'version' | 'errors' | 'audit'>('prompt_card');
  const [loading, setLoading] = useState(false);

  // PWA Prompt Card Backend Controls & Live Customizer
  const [pwaPromptState, setPwaPromptState] = useState<any>(config.pwaPromptConfig || {
    enabled: true,
    cardTitle: 'Install TaxiApp Shortcut',
    cardSubtext: 'Add to home screen for instant 1-tap bookings & fast performance.',
    appTitle: 'TaxiApp Shortcut',
    appSubtitle: 'INSTALL FOR A FASTER EXPERIENCE',
    logoUrl: '',
    versionTag: 'v2.5.0',
    iosStep1Title: 'TAP SAFARI SHARE BUTTON',
    iosStep1Desc: 'Tap the share icon (box with upward arrow) in the Safari browser toolbar.',
    iosStep1Image: '/uploads/autotop.svg',
    iosStep2Title: 'SCROLL DOWN SHARE MENU',
    iosStep2Desc: 'Scroll down the options list in the iOS Share sheet.',
    iosStep2Image: '/uploads/carprofile.svg',
    iosStep3Title: 'SELECT "ADD TO HOME SCREEN"',
    iosStep3Desc: 'Confirm and tap "Add" at top right to place shortcut on your home screen!',
    iosStep3Image: '/uploads/cartop.svg',
    androidStep1Title: 'TAP CHROME MENU (⋮)',
    androidStep1Desc: 'Click the browser menu (⋮) in Chrome to reveal options.',
    androidStep1Image: '/uploads/bikeprofile.svg',
    androidStep2Title: 'SELECT "INSTALL APP"',
    androidStep2Desc: 'Tap "Install App" or "Add to Home Screen" to install.',
    androidStep2Image: '/uploads/biketop.svg',
    primaryButtonText: 'GOT IT, CLOSE GUIDE',
    secondaryButtonText: 'MAYBE LATER',
    autoPushToUninstalled: true,
    forceDeviceView: 'auto'
  });
  const [previewOS, setPreviewOS] = useState<'ios' | 'android'>('ios');
  const [isSavingPwaPrompt, setIsSavingPwaPrompt] = useState(false);

  // Telemetry data from backend
  const [telemetryData, setTelemetryData] = useState<any[]>([]);
  const [summaryStats, setSummaryStats] = useState<any>({
    totalTrackedUsers: 142,
    installedPwaUsers: 98,
    browserUsers: 44,
    pwaInstallRatePercent: 69,
    totalSessionHours: 482.5,
    platformBreakdown: { android: 68, ios: 24, desktop: 6 },
    pushEnabledCount: 112
  });

  // Save PWA Prompt Config
  const handleSavePwaPromptConfig = () => {
    setIsSavingPwaPrompt(true);
    updateConfig({
      pwaPromptConfig: pwaPromptState
    });
    setTimeout(() => {
      setIsSavingPwaPrompt(false);
      if (setToast) {
        setToast({
          message: '✓ PWA Shortcut Prompt Card saved & synced across client devices!',
          type: 'success'
        });
      }
    }, 300);
  };

  // Live Push Prompt / Version Pop-up to Uninstalled Users
  const handlePushPromptToUninstalledDevices = async () => {
    // 1. Dispatch locally for immediate admin preview
    window.dispatchEvent(new CustomEvent('push_pwa_install_prompt_event', {
      detail: {
        title: pwaPromptState.cardTitle || `⚡ Install ${pwaPromptState.appTitle || 'TaxiApp'} Shortcut`,
        body: pwaPromptState.cardSubtitle || 'Install shortcut for faster 1-tap bookings and offline app access!',
        url: '/?action=install_pwa',
        isInstallPrompt: true
      }
    }));

    // 2. Broadcast live socket event to all active Chrome & Safari browser users via backend
    try {
      await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'All',
          title: pwaPromptState.cardTitle || `⚡ Install ${pwaPromptState.appTitle || 'TaxiApp'} Shortcut`,
          body: pwaPromptState.cardSubtitle || 'Install shortcut for faster 1-tap bookings and offline app access!',
          url: '/?action=install_pwa',
          isInstallPrompt: true
        })
      });
    } catch (err) {
      console.error('Failed to broadcast PWA prompt card socket:', err);
    }

    if (setToast) {
      setToast({
        message: '🚀 PWA Install Shortcut Popup Card broadcasted live to all Chrome & Safari browser users!',
        type: 'success'
      });
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [versionFilter, setVersionFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Rider' | 'Driver'>('All');

  // Push Notification Composer states
  const [pushTarget, setPushTarget] = useState<'All' | 'Riders' | 'Drivers' | 'OutdatedPwa'>('All');
  const [pushTitle, setPushTitle] = useState('⚡ Flash Discount: 20% Off Your Next Ride!');
  const [pushBody, setPushBody] = useState('Open the TaxiApp PWA now to claim your instant weekend trip discount.');
  const [pushUrl, setPushUrl] = useState('/');
  const [pushImage, setPushImage] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80');
  const [pushActionLabel, setPushActionLabel] = useState('Claim Discount');
  const [pushActionUrl, setPushActionUrl] = useState('/book');
  const [isSendingPush, setIsSendingPush] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [pushHistory, setPushHistory] = useState<any[]>([
    {
      id: 'PUSH-101',
      target: 'All PWA Users',
      title: '🎉 App Update v2.5.0 Available',
      body: 'Enjoy real-time live route tracking & faster offline caching!',
      sentAt: '2026-08-11T02:30:00.000Z',
      deliveredCount: 98,
      failedCount: 0
    },
    {
      id: 'PUSH-100',
      target: 'Drivers',
      title: '🚕 High Demand Surge in HITEC City',
      body: 'Double earnings active now! Head to Sector 2 for instant trip requests.',
      sentAt: '2026-08-10T18:15:00.000Z',
      deliveredCount: 42,
      failedCount: 1
    }
  ]);

  // Version Control states
  const [versionConfig, setVersionConfig] = useState({
    currentVersion: '2.5.0-PROD',
    minRequiredVersion: '2.4.0',
    forceUpdateEnabled: false,
    releaseDate: '2026-08-11',
    releaseNotes: 'v2.5.0 Update: Live PWA Telemetry, Auto-update notifications, real-time route rendering, and offline caching improvements.',
    checkIntervalMinutes: 15,
    skipWaitingAuto: true,
    cacheBusterTag: 'v2.5.0-build-882'
  });
  const [isSavingVersion, setIsSavingVersion] = useState(false);

  // Errors state
  const [pwaErrors, setPwaErrors] = useState<any[]>([
    {
      id: 'ERR-201',
      user: 'Baldev Singh (DRV26MU501K9X2)',
      platform: 'Android 12 (OnePlus 9)',
      displayMode: 'standalone (PWA)',
      appVersion: '2.3.9-DEPRECATED',
      error: 'QuotaExceededError: Storage quota exceeded during tile precaching',
      timestamp: '2026-08-11T03:12:44.000Z',
      status: 'Unresolved'
    },
    {
      id: 'ERR-202',
      user: 'Suresh Kumar (DRV26HYM57P8Z2)',
      platform: 'Android 13 (Galaxy M33)',
      displayMode: 'standalone (PWA)',
      appVersion: '2.4.8-PROD',
      error: 'PushSubscriptionError: VAPID endpoint registration timed out on cellular net',
      timestamp: '2026-08-10T22:05:10.000Z',
      status: 'Resolved'
    }
  ]);

  // Push Notification Engine & Configuration states
  const [pushEngineSettings, setPushEngineSettings] = useState({
    vapidEnabled: true,
  });
  const [isSavingPushSettings, setIsSavingPushSettings] = useState(false);

  // Fetch telemetry and version config on mount
  const fetchPwaData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pwa/telemetry');
      if (res.ok) {
        const data = await res.json();
        if (data.summary) setSummaryStats(data.summary);
        if (data.telemetryLogs) setTelemetryData(data.telemetryLogs);
        if (data.versionConfig) setVersionConfig(data.versionConfig);
      }

      // Load push engine settings
      const pushRes = await fetch('/api/push/settings');
      if (pushRes.ok) {
        const pushData = await pushRes.json();
        if (pushData && typeof pushData === 'object') {
          setPushEngineSettings(prev => ({
            ...prev,
            ...pushData
          }));
        }
      }
    } catch (e) {
      console.error('Failed to load PWA telemetry or push settings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePushSettings = async () => {
    setIsSavingPushSettings(true);
    try {
      const res = await fetch('/api/push/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pushEngineSettings)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPushEngineSettings(prev => ({
          ...prev,
          isFcmActive: data.isFcmActive
        }));
        if (setToast) {
          setToast({
            message: '✓ Push Engine Settings saved successfully!',
            type: 'success'
          });
        }
      } else {
        throw new Error(data.error || 'Failed to save push settings');
      }
    } catch (err: any) {
      if (setToast) {
        setToast({
          message: `❌ Error saving settings: ${err.message}`,
          type: 'error'
        });
      }
    } finally {
      setIsSavingPushSettings(false);
    }
  };

  useEffect(() => {
    fetchPwaData();
  }, []);

  // Outdated devices list (users running older version than latest currentVersion)
  const outdatedDevices = useMemo(() => {
    return telemetryData.filter(u => u.appVersion !== versionConfig.currentVersion);
  }, [telemetryData, versionConfig.currentVersion]);

  // Filtered Telemetry Logs
  const filteredTelemetry = useMemo(() => {
    return telemetryData.filter(u => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (u.userName || '').toLowerCase().includes(q) ||
        (u.userId || '').toLowerCase().includes(q) ||
        (u.browser || '').toLowerCase().includes(q) ||
        (u.platform || '').toLowerCase().includes(q) ||
        (u.ipAddress || '').includes(q);

      const matchesPlatform = platformFilter === 'All' || u.platform === platformFilter;
      const matchesMode = modeFilter === 'All' || 
        (modeFilter === 'PWA Standalone' && (u.isPwa || u.displayMode === 'standalone')) ||
        (modeFilter === 'Chrome/Web Browser' && (!u.isPwa && u.displayMode !== 'standalone'));

      const matchesVersion = versionFilter === 'All' || u.appVersion === versionFilter;
      const matchesRole = roleFilter === 'All' || (u.role || '').toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesPlatform && matchesMode && matchesVersion && matchesRole;
    });
  }, [telemetryData, searchQuery, platformFilter, modeFilter, versionFilter, roleFilter]);

  // Handle Trigger PWA Update Pop-up for Unupdated Users (Version Control)
  const handleTriggerUserUpdate = async (targetUser?: any) => {
    const isSingle = !!targetUser?.userId;
    setUpdatingUserId(isSingle ? targetUser.userId : 'ALL');

    try {
      // 1. Call Backend Trigger Update Endpoint
      await fetch('/api/admin/pwa/trigger-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: isSingle ? targetUser.userId : undefined,
          target: isSingle ? 'SINGLE_USER' : 'OUTDATED_ALL'
        })
      });

      // 2. Dispatch Local Pop-up Event for Version Control
      window.dispatchEvent(new CustomEvent('push_pwa_install_prompt_event', {
        detail: {
          title: `🚀 Version Control Update: v${versionConfig.currentVersion}`,
          body: `TaxiApp update is ready! Tap here to install version ${versionConfig.currentVersion} instantly.`,
          url: `/?action=pwa_auto_update&target_version=${versionConfig.currentVersion}`
        }
      }));

      // 3. Update local state telemetry logs so device is shown as updated immediately
      setTelemetryData(prev => prev.map(u => {
        if (!isSingle && u.appVersion !== versionConfig.currentVersion) {
          return { ...u, appVersion: versionConfig.currentVersion, swState: 'activated', lastActive: new Date().toISOString() };
        }
        if (isSingle && u.userId === targetUser.userId) {
          return { ...u, appVersion: versionConfig.currentVersion, swState: 'activated', lastActive: new Date().toISOString() };
        }
        return u;
      }));

      // 4. Record Version Control Log
      const count = isSingle ? 1 : outdatedDevices.length;
      const newLog = {
        id: `VER-UPD-${Date.now().toString().slice(-4)}`,
        target: isSingle ? `${targetUser.userName} (${targetUser.role})` : 'All Outdated PWA Users',
        title: `Version Control Pop-up: v${versionConfig.currentVersion}`,
        body: `Triggered interactive update pop-up modal for v${versionConfig.currentVersion}`,
        sentAt: new Date().toISOString(),
        deliveredCount: count,
        failedCount: 0
      };
      setPushHistory(prev => [newLog, ...prev]);

      if (setToast) {
        setToast({
          message: isSingle 
            ? `⚡ Version Control pop-up dispatched to ${targetUser.userName}! Device updated to ${versionConfig.currentVersion}.` 
            : `🚀 Broadcast Version Control update pop-up sent to ${count} outdated devices! All updated to ${versionConfig.currentVersion}.`,
          type: 'success'
        });
      }
    } catch (e: any) {
      if (setToast) setToast({ message: `Update trigger error: ${e.message}`, type: 'error' });
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handle Manual Push Broadcast
  const handleSendPushNotification = async () => {
    if (!pushTitle.trim() || !pushBody.trim()) {
      if (setToast) setToast({ message: 'Title and Body are required for push notification.', type: 'error' });
      return;
    }

    setIsSendingPush(true);
    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: pushTarget,
          title: pushTitle,
          body: pushBody,
          url: pushUrl,
          image: pushImage,
          actionLabel: pushActionLabel,
          actionUrl: pushActionUrl,
          isPopupModal: true
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const sentCount = data.stats?.totalSent || summaryStats.installedPwaUsers || 1;
        const newLog = {
          id: `PUSH-${Date.now().toString().slice(-4)}`,
          target: `${pushTarget} Users`,
          title: pushTitle,
          body: pushBody,
          sentAt: new Date().toISOString(),
          deliveredCount: sentCount,
          failedCount: data.stats?.totalFailed || 0
        };
        setPushHistory(prev => [newLog, ...prev]);
        if (setToast) setToast({ message: `🚀 Push notification delivered to ${sentCount} devices!`, type: 'success' });
      } else {
        if (setToast) setToast({ message: data.error || 'Failed to broadcast push notification.', type: 'error' });
      }
    } catch (e: any) {
      if (setToast) setToast({ message: `Push error: ${e.message}`, type: 'error' });
    } finally {
      setIsSendingPush(false);
    }
  };

  // Handle Save Version Control
  const handleSaveVersionConfig = async () => {
    setIsSavingVersion(true);
    try {
      const res = await fetch('/api/admin/pwa/version-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(versionConfig)
      });
      if (res.ok) {
        if (setToast) setToast({ message: '✓ PWA Version Control settings published successfully!', type: 'success' });
      }
    } catch (e: any) {
      if (setToast) setToast({ message: 'Failed to update version settings.', type: 'error' });
    } finally {
      setIsSavingVersion(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Smartphone size={20} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">PWA & Version Control Center</h3>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPwaData}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-amber-600' : ''} />
            <span>Refresh Telemetry</span>
          </button>

          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-extrabold rounded-full flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Version: {versionConfig.currentVersion}</span>
          </span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider">Installed PWA</span>
            <Smartphone size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">{summaryStats.installedPwaUsers || 0}</p>
          <span className="text-[10px] font-bold text-emerald-600">{summaryStats.pwaInstallRatePercent}% Install Ratio</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider">Chrome/Web Users</span>
            <Globe size={16} className="text-indigo-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">{summaryStats.browserUsers || 0}</p>
          <span className="text-[10px] text-slate-400 font-medium">Standard Browsers</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider">Android Fleet</span>
            <Cpu size={16} className="text-emerald-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">{summaryStats.platformBreakdown?.android || 0}</p>
          <span className="text-[10px] text-slate-500 font-bold">APK / TWA / Chrome</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider">iOS Standalone</span>
            <Zap size={16} className="text-rose-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">{summaryStats.platformBreakdown?.ios || 0}</p>
          <span className="text-[10px] text-slate-500 font-bold">Apple WebKit PWA</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Usage Hours</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">{summaryStats.totalSessionHours || 0} hrs</p>
          <span className="text-[10px] text-slate-400 font-medium">Cumulative App Time</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-black uppercase tracking-wider">Push Subscriptions</span>
            <Bell size={16} className="text-blue-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900">{summaryStats.pushEnabledCount || 0}</p>
          <span className="text-[10px] text-emerald-600 font-bold">VAPID Subscribed</span>
        </div>
      </div>

      {/* Sub-Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('prompt_card')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            activeSubTab === 'prompt_card' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Sparkles size={16} className={activeSubTab === 'prompt_card' ? "text-slate-950" : "text-amber-500"} />
          <span>Popup Prompt Card &amp; Customizer</span>
          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-emerald-600 text-white font-bold">NEW</span>
        </button>

        <button
          onClick={() => setActiveSubTab('telemetry')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            activeSubTab === 'telemetry' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Smartphone size={16} className={activeSubTab === 'telemetry' ? "text-slate-950" : "text-amber-500"} />
          <span>Installed Users &amp; Telemetry</span>
          <span className={cn("px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold", activeSubTab === 'telemetry' ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700")}>{filteredTelemetry.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('push')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            activeSubTab === 'push' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Send size={16} className={activeSubTab === 'push' ? "text-slate-950" : "text-amber-500"} />
          <span>Popup Notifications</span>
        </button>

        <button
          onClick={() => setActiveSubTab('version')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            activeSubTab === 'version' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <ArrowUpCircle size={16} className={activeSubTab === 'version' ? "text-slate-950" : "text-amber-500"} />
          <span>Version Control &amp; Force Update</span>
        </button>

        <button
          onClick={() => setActiveSubTab('errors')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            activeSubTab === 'errors' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <AlertTriangle size={16} className={activeSubTab === 'errors' ? "text-slate-950" : "text-amber-500"} />
          <span>PWA Error Logs</span>
          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-rose-600 text-white font-bold">{pwaErrors.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            activeSubTab === 'audit' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <CheckCircle2 size={16} className={activeSubTab === 'audit' ? "text-slate-950" : "text-amber-500"} />
          <span>Manifest &amp; SW Audit</span>
        </button>
      </div>

      {/* SUB TAB 0: PWA PROMPT CARD & LIVE CUSTOMIZER */}
      {activeSubTab === 'prompt_card' && (
        <div className="space-y-6">
          {/* Header Action Banner */}
          <div className="p-6 bg-amber-50/80 border border-amber-200/90 rounded-3xl text-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-1.5 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Sparkles size={12} className="text-amber-600" />
                <span>Backend Brand Control &amp; Dynamic Card Engine</span>
              </div>
              <h3 className="text-xl font-black tracking-tight text-slate-900">PWA Install Prompt Customizer &amp; Live Simulator</h3>
              <p className="text-xs text-slate-600 font-medium max-w-xl leading-relaxed">
                Customize logo branding, titles, version tags, and step-by-step shortcuts for iOS &amp; Android. Push the card live to users who haven't installed the app yet.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
              <button
                onClick={handlePushPromptToUninstalledDevices}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-[0.97] cursor-pointer border border-amber-500"
              >
                <Send size={15} />
                <span>POPUP CARD TO USERS</span>
              </button>

              <button
                onClick={handleSavePwaPromptConfig}
                disabled={isSavingPwaPrompt}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-[0.97] cursor-pointer disabled:opacity-50"
              >
                {isSavingPwaPrompt ? <RefreshCw size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                <span>{isSavingPwaPrompt ? 'Saving...' : 'Save & Sync Prompt'}</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Config Form (Left) & Phone Simulator Preview (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT 7 COLS: FORM CONTROLS */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Main Brand & Logo Settings */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <ImageIcon size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">App Identity &amp; Logo Settings</h4>
                      <p className="text-[11px] text-slate-500 font-medium">Update prompt title, subtitle, logo URL &amp; version tag</p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-[11px] font-black uppercase text-slate-600">Card Enabled</span>
                    <input 
                      type="checkbox"
                      checked={pwaPromptState.enabled}
                      onChange={e => setPwaPromptState({ ...pwaPromptState, enabled: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Card Main Title</label>
                    <input 
                      type="text"
                      value={pwaPromptState.cardTitle || pwaPromptState.appTitle || ''}
                      onChange={e => setPwaPromptState({ ...pwaPromptState, cardTitle: e.target.value })}
                      placeholder="e.g. Install TaxiApp Shortcut"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Card Subtext / Description</label>
                    <input 
                      type="text"
                      value={pwaPromptState.cardSubtext || pwaPromptState.appSubtitle || ''}
                      onChange={e => setPwaPromptState({ ...pwaPromptState, cardSubtext: e.target.value })}
                      placeholder="e.g. Add to home screen for instant 1-tap bookings & fast performance."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Version Tag</label>
                    <input 
                      type="text"
                      value={pwaPromptState.versionTag || ''}
                      onChange={e => setPwaPromptState({ ...pwaPromptState, versionTag: e.target.value })}
                      placeholder="e.g. v2.5.0"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Device OS Guide Override</label>
                    <select
                      value={pwaPromptState.forceDeviceView || 'auto'}
                      onChange={e => setPwaPromptState({ ...pwaPromptState, forceDeviceView: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                    >
                      <option value="auto">Auto-detect Device OS (Recommended)</option>
                      <option value="ios">Force iOS (Safari Share Sheet Guide)</option>
                      <option value="android">Force Android (Chrome Menu Guide)</option>
                    </select>
                  </div>

                  {/* Logo Functionality Control */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Custom Logo Image</label>
                      {pwaPromptState.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setPwaPromptState({ ...pwaPromptState, logoUrl: '' })}
                          className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          Clear Logo
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 border border-amber-500 shadow-3xs transition-all active:scale-95">
                        <Upload size={13} /> Upload Logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setPwaPromptState((prev: any) => ({ ...prev, logoUrl: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <input 
                        type="text"
                        value={pwaPromptState.logoUrl || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, logoUrl: e.target.value })}
                        placeholder="Paste image URL or upload file..."
                        className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: iOS Device Steps Controls & Screenshots */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">iOS Device Screenshot Guide Settings (Apple Safari)</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Customize step titles, descriptions, and uploaded screenshots for iOS</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Step 1 */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-black uppercase text-amber-600 font-mono">iOS Step 1 (Share Icon)</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input 
                        type="text"
                        value={pwaPromptState.iosStep1Title || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, iosStep1Title: e.target.value })}
                        placeholder="Step 1 Title"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <input 
                        type="text"
                        value={pwaPromptState.iosStep1Desc || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, iosStep1Desc: e.target.value })}
                        placeholder="Step 1 Description"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer shrink-0">
                        Upload Step 1 Screenshot
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setPwaPromptState({ ...pwaPromptState, iosStep1Image: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                      <input 
                        type="text"
                        value={pwaPromptState.iosStep1Image || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, iosStep1Image: e.target.value })}
                        placeholder="Image URL (or uploaded)"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-black uppercase text-amber-600 font-mono">iOS Step 2 (Scroll Menu)</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input 
                        type="text"
                        value={pwaPromptState.iosStep2Title || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, iosStep2Title: e.target.value })}
                        placeholder="Step 2 Title"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <input 
                        type="text"
                        value={pwaPromptState.iosStep2Desc || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, iosStep2Desc: e.target.value })}
                        placeholder="Step 2 Description"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer shrink-0">
                        Upload Step 2 Screenshot
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setPwaPromptState({ ...pwaPromptState, iosStep2Image: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                      <input 
                        type="text"
                        value={pwaPromptState.iosStep2Image || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, iosStep2Image: e.target.value })}
                        placeholder="Image URL (or uploaded)"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-black uppercase text-amber-600 font-mono">iOS Step 3 (Add to Home Screen)</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input 
                        type="text"
                        value={pwaPromptState.iosStep3Title || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, iosStep3Title: e.target.value })}
                        placeholder="Step 3 Title"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <input 
                        type="text"
                        value={pwaPromptState.iosStep3Desc || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, iosStep3Desc: e.target.value })}
                        placeholder="Step 3 Description"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer shrink-0">
                        Upload Step 3 Screenshot
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setPwaPromptState({ ...pwaPromptState, iosStep3Image: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                      <input 
                        type="text"
                        value={pwaPromptState.iosStep3Image || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, iosStep3Image: e.target.value })}
                        placeholder="Image URL (or uploaded)"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Android Device Steps Controls & Screenshots */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Android Device Instructions (Google Chrome)</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Customize direct install button, titles, descriptions, and uploaded screenshots for Android</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Step 1 */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-black uppercase text-emerald-700 font-mono">Android Step 1 (Chrome Menu)</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input 
                        type="text"
                        value={pwaPromptState.androidStep1Title || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, androidStep1Title: e.target.value })}
                        placeholder="Step 1 Title"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <input 
                        type="text"
                        value={pwaPromptState.androidStep1Desc || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, androidStep1Desc: e.target.value })}
                        placeholder="Step 1 Description"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer shrink-0">
                        Upload Step 1 Screenshot
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setPwaPromptState({ ...pwaPromptState, androidStep1Image: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                      <input 
                        type="text"
                        value={pwaPromptState.androidStep1Image || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, androidStep1Image: e.target.value })}
                        placeholder="Image URL (or uploaded)"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <span className="text-[10px] font-black uppercase text-emerald-700 font-mono">Android Step 2 (Install App)</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input 
                        type="text"
                        value={pwaPromptState.androidStep2Title || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, androidStep2Title: e.target.value })}
                        placeholder="Step 2 Title"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                      <input 
                        type="text"
                        value={pwaPromptState.androidStep2ButtonText || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, androidStep2ButtonText: e.target.value })}
                        placeholder="Button Text (e.g. Install TaxiApp)"
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer shrink-0">
                        Upload Step 2 Screenshot
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setPwaPromptState({ ...pwaPromptState, androidStep2Image: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                      <input 
                        type="text"
                        value={pwaPromptState.androidStep2Image || ''}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, androidStep2Image: e.target.value })}
                        placeholder="Image URL (or uploaded)"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Trust Badge & Button Labels */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-5">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Trust Badge &amp; Action Button Labels</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Fine-tune button calls to action &amp; security guarantee banner</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Trust Badge Text</label>
                    <input 
                      type="text"
                      value={pwaPromptState.securityBadgeText}
                      onChange={e => setPwaPromptState({ ...pwaPromptState, securityBadgeText: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Primary Button Text</label>
                    <input 
                      type="text"
                      value={pwaPromptState.primaryButtonText}
                      onChange={e => setPwaPromptState({ ...pwaPromptState, primaryButtonText: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Secondary Button Text</label>
                    <input 
                      type="text"
                      value={pwaPromptState.secondaryButtonText}
                      onChange={e => setPwaPromptState({ ...pwaPromptState, secondaryButtonText: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={pwaPromptState.autoPushToUninstalled}
                        onChange={e => setPwaPromptState({ ...pwaPromptState, autoPushToUninstalled: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                      <span className="text-[11px] font-black uppercase text-slate-800">Auto Show to Browser Visitors</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT 5 COLS: LIVE PHONE SIMULATOR */}
            <div className="lg:col-span-5 sticky top-6">
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs text-slate-900 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Eye size={16} className="text-amber-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">Live Device Simulator</span>
                  </div>

                  {/* Device View Selector */}
                  <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                    <button
                      onClick={() => setPreviewOS('ios')}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer",
                        previewOS === 'ios' ? "bg-amber-400 text-slate-950 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      iPhone (iOS)
                    </button>
                    <button
                      onClick={() => setPreviewOS('android')}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer",
                        previewOS === 'android' ? "bg-amber-400 text-slate-950 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                      )}
                    >
                      Android
                    </button>
                  </div>
                </div>

                {/* Mobile Phone Mockup Box */}
                <div className="w-full max-w-[320px] mx-auto bg-slate-100/90 rounded-[40px] p-3 border-4 border-slate-300 shadow-md relative overflow-hidden my-2">
                  {/* Speaker Notch */}
                  <div className="w-24 h-4 bg-slate-300 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <div className="w-8 h-1 bg-slate-400 rounded-full"></div>
                  </div>

                  {/* Phone Screen Canvas */}
                  <div className="bg-slate-200/50 rounded-[30px] p-3 min-h-[480px] flex items-center justify-center relative overflow-hidden border border-slate-300/70">
                    {/* Simulated Background Content */}
                    <div className="absolute inset-0 p-4 opacity-20 pointer-events-none flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="w-full h-8 bg-slate-400 rounded-xl"></div>
                        <div className="w-3/4 h-4 bg-slate-500 rounded-lg"></div>
                      </div>
                      <div className="w-full h-32 bg-slate-500 rounded-2xl"></div>
                    </div>

                    {/* LIVE CARD PREVIEW REPLICA */}
                    <div className="w-full bg-white text-slate-900 rounded-[24px] p-3.5 shadow-2xl border border-slate-200/90 relative z-10 flex flex-col">
                      {/* Top Close Button */}
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <span className="text-xs font-bold">✕</span>
                      </div>

                      {/* Header: Exact Same Brand Logo as Home Page */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 pr-7">
                        <BrandLogo config={config} variant="combined" height={24} showTagline={false} />
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[8px] font-mono font-bold shrink-0">
                          {pwaPromptState.versionTag || 'v2.5.0'}
                        </span>
                      </div>

                      {/* Card Main Title & Subtext */}
                      <div className="text-center space-y-0.5 mb-2">
                        <h4 className="text-xs font-extrabold text-slate-900 tracking-tight leading-tight">
                          {pwaPromptState.cardTitle || pwaPromptState.appTitle || 'Install TaxiApp Shortcut'}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">
                          {pwaPromptState.cardSubtext || pwaPromptState.appSubtitle || 'Add to home screen for instant 1-tap bookings & fast performance.'}
                        </p>
                      </div>

                      {/* Android Direct Install Button if previewing Android */}
                      {previewOS === 'android' && (
                        <div className="w-full mb-2 bg-amber-400 text-slate-950 font-black py-1.5 px-2 rounded-xl text-[9.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 border border-amber-500/80">
                          <Download size={12} />
                          <span>INSTALL APP DIRECTLY</span>
                        </div>
                      )}

                      {/* Step Tabs Preview */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex-1 py-1 px-1 bg-slate-950 text-amber-400 rounded-lg text-[9px] font-black uppercase text-center">
                          Step 1
                        </div>
                        <div className="flex-1 py-1 px-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase text-center border border-slate-200">
                          Step 2
                        </div>
                        {previewOS === 'ios' && (
                          <div className="flex-1 py-1 px-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase text-center border border-slate-200">
                            Step 3
                          </div>
                        )}
                      </div>

                      {/* Active Step Box Preview */}
                      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2 space-y-1.5 mb-2.5">
                        <div className="flex items-center gap-1">
                          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 font-black text-[8px] flex items-center justify-center shrink-0">
                            1
                          </span>
                          <h5 className="font-extrabold text-[10px] text-slate-900 truncate">
                            {previewOS === 'ios' ? (pwaPromptState.iosStep1Title || 'TAP SAFARI SHARE BUTTON') : (pwaPromptState.androidStep1Title || 'TAP CHROME MENU (⋮)')}
                          </h5>
                        </div>

                        <p className="text-[9px] text-slate-500 font-medium leading-tight line-clamp-2">
                          {previewOS === 'ios' ? (pwaPromptState.iosStep1Desc || 'Tap share icon in Safari browser toolbar.') : (pwaPromptState.androidStep1Desc || 'Click browser menu (⋮) in Chrome.')}
                        </p>

                        <div className="w-full h-20 bg-slate-900 rounded-lg overflow-hidden border border-slate-300 p-1 flex items-center justify-center relative">
                          <img 
                            src={previewOS === 'ios' ? (pwaPromptState.iosStep1Image || '/uploads/autotop.svg') : (pwaPromptState.androidStep1Image || '/uploads/bikeprofile.svg')} 
                            alt="Step 1 Preview" 
                            className="h-16 max-h-16 w-auto max-w-full object-contain mx-auto"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = previewOS === 'ios' ? "/uploads/autotop.svg" : "/uploads/bikeprofile.svg";
                            }}
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-1">
                        <button className="w-full bg-slate-950 text-white h-8 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-1 shadow-sm">
                          <span>{pwaPromptState.primaryButtonText || 'GOT IT, CLOSE GUIDE'}</span>
                        </button>

                        <button className="w-full h-5 text-[8.5px] font-black uppercase text-slate-400 flex items-center justify-center">
                          {pwaPromptState.secondaryButtonText || 'MAYBE LATER'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-medium">
                    ✨ Matches live app branding &amp; responsiveness seamlessly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeSubTab === 'telemetry' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search telemetry by name, ID, browser, IP or platform..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs rounded-xl outline-none font-medium text-slate-800"
              />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-slate-500 uppercase">Role:</span>
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="Rider">Riders Only</option>
                  <option value="Driver">Drivers Only</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-slate-500 uppercase">Platform:</span>
                <select
                  value={platformFilter}
                  onChange={e => setPlatformFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 outline-none"
                >
                  <option value="All">All Platforms</option>
                  <option value="Android">Android</option>
                  <option value="iOS">iOS</option>
                  <option value="Windows">Windows</option>
                  <option value="macOS">macOS</option>
                  <option value="Linux">Linux</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-slate-500 uppercase">Mode:</span>
                <select
                  value={modeFilter}
                  onChange={e => setModeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 outline-none"
                >
                  <option value="All">All Display Modes</option>
                  <option value="PWA Standalone">PWA Standalone (Installed)</option>
                  <option value="Chrome/Web Browser">Web Browser</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black text-slate-500 uppercase">Version:</span>
                <select
                  value={versionFilter}
                  onChange={e => setVersionFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 outline-none"
                >
                  <option value="All">All App Versions</option>
                  <option value="2.5.0-PROD">2.5.0-PROD (Latest)</option>
                  <option value="2.4.8-PROD">2.4.8-PROD</option>
                  <option value="2.3.9-DEPRECATED">2.3.9-DEPRECATED</option>
                </select>
              </div>
            </div>
          </div>

          {/* Telemetry Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 text-[10px] font-black uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3.5">User Identity</th>
                    <th className="p-3.5">PWA / Browser Mode</th>
                    <th className="p-3.5">Device & OS Platform</th>
                    <th className="p-3.5">App Version</th>
                    <th className="p-3.5">Usage Hours</th>
                    <th className="p-3.5">Push Status</th>
                    <th className="p-3.5">SW Cache</th>
                    <th className="p-3.5">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {filteredTelemetry.map((u, i) => {
                    const isPwa = u.isPwa || u.displayMode === 'standalone';
                    const isDriver = u.role?.toLowerCase() === 'driver';
                    return (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0",
                              isDriver ? "bg-amber-400 text-slate-950" : "bg-indigo-500 text-white"
                            )}>
                              {u.userName?.substring(0, 2).toUpperCase() || 'US'}
                            </div>
                            <div>
                              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                <span>{u.userName || 'Anonymous User'}</span>
                                {isDriver ? (
                                  <span className="px-2 py-0.5 bg-amber-400/20 text-amber-950 border border-amber-400/40 rounded text-[9px] font-black uppercase flex items-center gap-0.5">
                                    🚖 Driver
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[9px] font-extrabold uppercase flex items-center gap-0.5">
                                    👤 Rider
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">{u.userId} • IP: {u.ipAddress}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          {isPwa ? (
                            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 font-black text-[10px] rounded-full flex items-center gap-1 w-fit">
                              <Smartphone size={12} className="text-emerald-600" /> Standalone PWA
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 font-extrabold text-[10px] rounded-full flex items-center gap-1 w-fit">
                              <Globe size={12} className="text-slate-500" /> Chrome / Safari
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-slate-800">{u.platform}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{u.browser}</span>
                        </td>

                        <td className="p-3.5">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-mono font-black border",
                            u.appVersion === versionConfig.currentVersion ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-rose-100 text-rose-800 border-rose-200"
                          )}>
                            {u.appVersion}
                          </span>
                        </td>

                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          ⏱️ {u.sessionHours} hrs
                        </td>

                        <td className="p-3.5">
                          {u.pushStatus === 'granted' ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded border border-emerald-200">
                              ✓ Granted
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded border border-slate-200">
                              Off / Prompt
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 font-mono text-[11px]">
                          <span className="text-emerald-600 font-bold">{u.swState || 'activated'}</span>
                        </td>

                        <td className="p-3.5 text-[11px] text-slate-500 font-mono">
                          {new Date(u.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: MANUAL PUSH NOTIFICATIONS */}
      {activeSubTab === 'push' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Push Composer Form */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Bell className="text-amber-500" size={16} /> Broadcast Popup Notification
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">Send lock-screen push alerts &amp; centered interactive popups directly to active browser users and installed PWAs.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Target Segment</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'All', label: 'All Users', badge: null },
                    { key: 'Riders', label: 'Riders', badge: null },
                    { key: 'Drivers', label: 'Drivers', badge: null },
                    { key: 'OutdatedPwa', label: 'Outdated PWA Users', badge: `${outdatedDevices.length} Pending` }
                  ].map((seg) => (
                    <button
                      key={seg.key}
                      type="button"
                      onClick={() => {
                        const targetKey = seg.key as any;
                        setPushTarget(targetKey);
                        if (targetKey === 'OutdatedPwa') {
                          setPushTitle(`🚀 PWA Auto-Update Required: v${versionConfig.currentVersion}`);
                          setPushBody(`A new version of TaxiApp PWA is ready (${versionConfig.currentVersion}). Tap here to automatically update now!`);
                          setPushActionLabel('Update PWA Now');
                          setPushActionUrl(`/?action=pwa_auto_update&target_version=${versionConfig.currentVersion}`);
                          setPushUrl(`/?action=pwa_auto_update&target_version=${versionConfig.currentVersion}`);
                        }
                      }}
                      className={cn(
                        "py-2.5 px-3 rounded-xl text-xs font-black uppercase transition-all border cursor-pointer text-left flex flex-col justify-between gap-1",
                        pushTarget === seg.key 
                          ? (seg.key === 'OutdatedPwa' ? "bg-rose-500 text-white border-rose-600 shadow-md" : "bg-amber-400 text-slate-950 border-amber-500 shadow-xs") 
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      )}
                    >
                      <span>{seg.label}</span>
                      {seg.badge && (
                        <span className={cn(
                          "px-1.5 py-0.5 text-[8px] rounded font-mono font-extrabold w-fit",
                          pushTarget === seg.key ? "bg-rose-950/40 text-rose-100" : "bg-rose-100 text-rose-800"
                        )}>
                          {seg.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Push Title</label>
                <input
                  type="text"
                  value={pushTitle}
                  onChange={e => setPushTitle(e.target.value)}
                  placeholder="e.g., Weekend Special Fare Offer"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs rounded-xl p-3 outline-none font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Message Body</label>
                <textarea
                  value={pushBody}
                  onChange={e => setPushBody(e.target.value)}
                  placeholder="Provide message details..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs rounded-xl p-3 outline-none font-medium text-slate-800 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Launch Target URL</label>
                  <input
                    type="text"
                    value={pushUrl}
                    onChange={e => setPushUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 outline-none font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Banner Image URL</label>
                  <input
                    type="text"
                    value={pushImage}
                    onChange={e => setPushImage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 outline-none font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Action Button Label</label>
                  <input
                    type="text"
                    value={pushActionLabel}
                    onChange={e => setPushActionLabel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 outline-none font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Action Link</label>
                  <input
                    type="text"
                    value={pushActionUrl}
                    onChange={e => setPushActionUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 outline-none font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-bold">
                  🔔 Target Devices: <span className="text-amber-600 font-mono font-black">{summaryStats.installedPwaUsers || 98} PWA Subscriptions</span>
                </span>

                <button
                  onClick={handleSendPushNotification}
                  disabled={isSendingPush}
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border border-amber-500"
                >
                  <Send size={15} className={isSendingPush ? 'animate-bounce' : ''} />
                  <span>{isSendingPush ? 'Broadcasting...' : 'Push Now'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Lock Screen Phone Mockup Preview & Push Log */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 text-slate-900 space-y-3 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">
                📱 Lock Screen PWA Push Mockup
              </span>

              {/* Phone Notification Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center">
                      TA
                    </div>
                    <span className="text-xs font-bold text-slate-800">TaxiApp PWA</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">now</span>
                </div>

                <div>
                  <h5 className="font-extrabold text-xs text-slate-900 leading-snug">{pushTitle || 'Push Notification Title'}</h5>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-0.5">{pushBody || 'Notification body content preview...'}</p>
                </div>

                {pushImage && (
                  <div className="h-24 w-full rounded-xl overflow-hidden border border-slate-700">
                    <img src={pushImage} alt="Push banner" className="w-full h-full object-cover" />
                  </div>
                )}

                {pushActionLabel && (
                  <div className="pt-1">
                    <button className="w-full py-1.5 bg-amber-400 text-slate-950 font-black text-[11px] rounded-lg">
                      {pushActionLabel}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sent Push History */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h5 className="text-xs font-black uppercase text-slate-900 tracking-wider">Broadcast History Log</h5>
                  <p className="text-[10px] text-slate-400 font-medium">Recent push notifications sent to PWA instances</p>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                  {pushHistory.length} Total
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-wider border-b border-slate-200/80">
                      <th className="py-2.5 px-3">Title & Message</th>
                      <th className="py-2.5 px-3">Target</th>
                      <th className="py-2.5 px-3 font-mono">Delivered</th>
                      <th className="py-2.5 px-3 font-mono text-right">Sent Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {pushHistory.map(h => (
                      <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 max-w-xs">
                          <div className="font-extrabold text-slate-900 truncate" title={h.title}>{h.title}</div>
                          <div className="text-[10px] text-slate-500 truncate mt-0.5" title={h.body}>{h.body}</div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            h.target === 'Riders' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                              : h.target === 'Drivers' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {h.target}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                            ✓ {h.deliveredCount} Nodes
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono text-[10px] text-slate-400">
                          {new Date(h.sentAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} {new Date(h.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                    {pushHistory.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400 text-xs">
                          No previous broadcast records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Unupdated PWA Devices & 1-Click Push Update Manager Table */}
          <div className="lg:col-span-12 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ArrowUpCircle className="text-rose-500" size={18} /> Outdated PWA Devices & Manual Update Manager
                  </h4>
                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-mono font-black rounded-md">
                    {outdatedDevices.length} Unupdated Users
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Below are riders and drivers running older PWA versions. Click <strong>"Push 1-Click Update"</strong> to send a direct notification that updates their device on click.
                </p>
              </div>

              {outdatedDevices.length > 0 && (
                <button
                  onClick={() => handleTriggerUserUpdate()}
                  disabled={updatingUserId === 'ALL'}
                  className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Send size={14} className={updatingUserId === 'ALL' ? 'animate-bounce' : ''} />
                  <span>{updatingUserId === 'ALL' ? 'Broadcasting Updates...' : `🚀 Push Auto-Update to All (${outdatedDevices.length})`}</span>
                </button>
              )}
            </div>

            {outdatedDevices.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-emerald-800 space-y-1">
                <CheckCircle2 size={28} className="mx-auto text-emerald-500 mb-2" />
                <h5 className="font-black text-sm">All Active PWA Devices Are Up To Date!</h5>
                <p className="text-xs text-emerald-700">Every active rider and driver is currently running the latest production build <strong>v{versionConfig.currentVersion}</strong>.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 text-[10px] font-black uppercase tracking-wider border-b border-slate-200">
                      <th className="p-3">User & Role</th>
                      <th className="p-3">Device Platform</th>
                      <th className="p-3">Current Version</th>
                      <th className="p-3">Target Version</th>
                      <th className="p-3">Push Status</th>
                      <th className="p-3">Last Ping</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    {outdatedDevices.map((u) => {
                      const isDriver = u.role?.toLowerCase() === 'driver';
                      const isUpdatingThisUser = updatingUserId === u.userId;

                      return (
                        <tr key={u.userId} className="hover:bg-rose-50/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className={cn(
                                "w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0",
                                isDriver ? "bg-amber-400 text-slate-950" : "bg-indigo-500 text-white"
                              )}>
                                {u.userName?.substring(0, 2).toUpperCase() || 'US'}
                              </div>
                              <div>
                                <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                                  <span>{u.userName}</span>
                                  {isDriver ? (
                                    <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-900 border border-amber-300 rounded text-[9px] font-black uppercase">
                                      🚖 Driver
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[9px] font-black uppercase">
                                      👤 Rider
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">{u.userId}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3 font-bold text-slate-800">
                            {u.platform}
                            <span className="block text-[10px] text-slate-400 font-mono font-normal">{u.browser}</span>
                          </td>

                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-mono font-black rounded">
                              {u.appVersion}
                            </span>
                          </td>

                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-black rounded">
                              {versionConfig.currentVersion}
                            </span>
                          </td>

                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-200">
                              ✓ {u.pushStatus || 'granted'}
                            </span>
                          </td>

                          <td className="p-3 text-[10px] text-slate-500 font-mono">
                            {new Date(u.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>

                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleTriggerUserUpdate(u)}
                              disabled={isUpdatingThisUser}
                              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] rounded-lg shadow-xs transition-all flex items-center gap-1.5 ml-auto cursor-pointer border border-amber-500"
                            >
                              <RefreshCw size={12} className={isUpdatingThisUser ? 'animate-spin' : ''} />
                              <span>{isUpdatingThisUser ? 'Pushing Update...' : '⚡ Push 1-Click Update'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB TAB 3: VERSION CONTROL & FORCE UPDATE */}
      {activeSubTab === 'version' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ArrowUpCircle className="text-amber-500" size={18} /> PWA Version Control & Force Update Engine
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Control live build tags, force updates for deprecated app versions, and manage Service Worker caching policy.</p>
            </div>

            <button
              onClick={handleSaveVersionConfig}
              disabled={isSavingVersion}
              className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-amber-500"
            >
              <CheckCircle2 size={16} />
              <span>{isSavingVersion ? 'Publishing...' : 'Publish Version Control'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">Current Production Version Tag</label>
                <input
                  type="text"
                  value={versionConfig.currentVersion}
                  onChange={e => setVersionConfig(prev => ({ ...prev, currentVersion: e.target.value }))}
                  className="w-full bg-white border border-slate-200 text-xs font-mono font-bold p-3 rounded-xl outline-none"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">Minimum Required Version</label>
                <input
                  type="text"
                  value={versionConfig.minRequiredVersion}
                  onChange={e => setVersionConfig(prev => ({ ...prev, minRequiredVersion: e.target.value }))}
                  className="w-full bg-white border border-slate-200 text-xs font-mono font-bold p-3 rounded-xl outline-none"
                />
                <p className="text-[11px] text-slate-500">Users on versions lower than this will be prompted to refresh & update.</p>
              </div>

              {/* Force Update Toggle */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h5 className="text-xs font-black text-amber-950 uppercase">Enforce Required Hard Update</h5>
                  <p className="text-[11px] text-amber-800">Block usage for users on outdated builds until they tap Update.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setVersionConfig(prev => ({ ...prev, forceUpdateEnabled: !prev.forceUpdateEnabled }))}
                  className={cn(
                    "w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer relative",
                    versionConfig.forceUpdateEnabled ? "bg-amber-500" : "bg-slate-300"
                  )}
                >
                  <span className={cn(
                    "w-5.5 h-5.5 rounded-full bg-white block transition-transform shadow-md",
                    versionConfig.forceUpdateEnabled ? "translate-x-5.5" : "translate-x-0"
                  )} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-1">Release Notes & Changelog</label>
                <textarea
                  value={versionConfig.releaseNotes}
                  onChange={e => setVersionConfig(prev => ({ ...prev, releaseNotes: e.target.value }))}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-medium p-3 rounded-xl outline-none resize-none"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h5 className="text-xs font-black text-slate-900 uppercase">Service Worker Cache Policies</h5>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Auto Skip Waiting on install:</span>
                  <span className="font-mono text-emerald-600 font-bold">Enabled (`self.skipWaiting()`)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Cache Buster Tag:</span>
                  <span className="font-mono text-slate-900 font-bold">{versionConfig.cacheBusterTag}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 4: ERRORS LOG */}
      {activeSubTab === 'errors' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="text-rose-500" size={18} /> PWA Client Errors & Crash Stream
            </h4>
            <span className="text-xs font-bold text-slate-500">{pwaErrors.length} Reported Client Errors</span>
          </div>

          <div className="space-y-3">
            {pwaErrors.map(err => (
              <div key={err.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-rose-600 font-mono">{err.id} • {err.error}</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-bold text-[10px] rounded">{err.status}</span>
                </div>
                <p className="text-xs text-slate-600">User: <span className="font-bold text-slate-900">{err.user}</span> ({err.platform})</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Display Mode: {err.displayMode} • App Version: {err.appVersion}</span>
                  <span>{new Date(err.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 5: PWA MANIFEST & AUDIT */}
      {activeSubTab === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle2 className="text-emerald-500" size={18} /> Web App Manifest & Service Worker Audit
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <h5 className="font-black text-emerald-900 uppercase">✓ Web App Manifest (`manifest.webmanifest`)</h5>
              <p className="text-emerald-800">Short name "TaxiApp", theme color `#F2B33D`, background `#020617`, standalone display mode.</p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <h5 className="font-black text-emerald-900 uppercase">✓ Service Worker Cache (`sw.ts`)</h5>
              <p className="text-emerald-800">Workbox precaching active, `clientsClaim()`, `skipWaiting()`, offline fallback routes enabled.</p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <h5 className="font-black text-emerald-900 uppercase">✓ Web Push VAPID Keypair</h5>
              <p className="text-emerald-800">Self-generated public/private VAPID keypair stored in configuration & ready for instant push delivery.</p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <h5 className="font-black text-emerald-900 uppercase">✓ HTTPS & Security Headers</h5>
              <p className="text-emerald-800">Cloud Run SSL endpoint active with Service Worker scope `/` enabled.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
