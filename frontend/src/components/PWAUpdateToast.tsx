import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, X, ArrowUpCircle, CheckCircle2 } from 'lucide-react';
import { sendPwaTelemetryPing, CURRENT_APP_VERSION } from '../services/pwaTelemetry';

export const PWAUpdateToast: React.FC = () => {
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [showUpdatedSuccessBanner, setShowUpdatedSuccessBanner] = useState(false);
  const [updatedVersionTag, setUpdatedVersionTag] = useState(CURRENT_APP_VERSION);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        setSwRegistration(r);
        console.log('[PWA] Service Worker registered successfully.');
        
        // Check for updates every 15 minutes
        setInterval(() => {
          r.update().catch((err) => console.log('[PWA] Check update error:', err));
        }, 15 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('[PWA] Service Worker registration failed:', error);
    },
  });

  // Handle URL auto update trigger from push notification link (e.g. ?action=pwa_auto_update)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    const targetVersion = urlParams.get('target_version') || CURRENT_APP_VERSION;

    if (action === 'pwa_auto_update' || action === 'update_pwa') {
      console.log('[PWA] Auto update triggered via push notification link.');
      setUpdatedVersionTag(targetVersion);
      setShowUpdatedSuccessBanner(true);

      // Execute update service worker
      updateServiceWorker(true);

      // Ping telemetry with updated version
      sendPwaTelemetryPing();

      // Clean up URL without page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      // Auto dismiss success toast after 6 seconds
      const timer = setTimeout(() => {
        setShowUpdatedSuccessBanner(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [updateServiceWorker]);

  // Check for updates whenever the user returns to the app / window regains focus
  useEffect(() => {
    const handleFocus = () => {
      if (swRegistration) {
        swRegistration.update().catch(() => {});
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && swRegistration) {
        swRegistration.update().catch(() => {});
      }
    });

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [swRegistration]);

  const handleUpdate = () => {
    updateServiceWorker(true);
    setShowUpdatedSuccessBanner(true);
    sendPwaTelemetryPing();
  };

  const handleDismiss = () => {
    setNeedRefresh(false);
  };

  return (
    <>
      <AnimatePresence>
        {/* Update Available Banner */}
        {needRefresh && !showUpdatedSuccessBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[12000] w-[92%] max-w-[420px] bg-slate-900 text-white rounded-2.5xl p-4 shadow-2xl border border-slate-700/60 flex items-center justify-between gap-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-tight text-white">App Update Available</span>
                  <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase bg-amber-500 text-slate-950 rounded-md">New</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium leading-tight">
                  A new version of TaxiApp is ready with new features & improvements.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleUpdate}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Update</span>
              </button>
              <button
                onClick={handleDismiss}
                className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Updated Successfully Banner */}
        {showUpdatedSuccessBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[12000] w-[92%] max-w-[420px] bg-emerald-950 text-white rounded-2.5xl p-4 shadow-2xl border border-emerald-500/50 flex items-center justify-between gap-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-tight text-white">PWA Updated Successfully!</span>
                  <span className="px-1.5 py-0.5 text-[8px] font-extrabold uppercase bg-emerald-400 text-emerald-950 rounded-md font-mono">{updatedVersionTag}</span>
                </div>
                <p className="text-[11px] text-emerald-200 font-medium leading-tight">
                  You are now running the latest version with active offline caching & live route tracking.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowUpdatedSuccessBanner(false)}
              className="w-7 h-7 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-300 flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
