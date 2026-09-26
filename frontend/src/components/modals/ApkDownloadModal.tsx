import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Download, Smartphone, ShieldCheck, Zap, 
  CheckCircle2, AlertCircle, FileCode, ExternalLink, 
  HelpCircle, ChevronDown, ChevronUp 
} from 'lucide-react';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
  versionName?: string;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
  appName = "TaxiApp",
  versionName = "2.0.4"
}) => {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  if (!isOpen) return null;

  const handleDownload = (type: 'release' | 'debug') => {
    setDownloadStarted(true);
    const downloadUrl = `/api/mobile/download-apk/${type}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `taxiapp-${type}-v${versionName}.apk`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-slate-900 dark:text-slate-100"
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-950 p-5 sm:p-6 text-white overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all cursor-pointer z-10"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner shrink-0">
                <Smartphone className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-400/20 border border-emerald-300/40 text-emerald-200">
                    Official Android App
                  </span>
                  <span className="text-[10px] font-mono text-emerald-200/80">
                    v{versionName}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                  {appName} APK Download
                </h3>
              </div>
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Install directly on your Android device for 0% latency, instant GPS radar, and lock-screen dispatch notifications.
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {downloadStarted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-xs font-bold"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Your APK download has started! Follow the installation steps below once the file finishes downloading.
                </span>
              </motion.div>
            )}

            {/* APK Action Download Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Release APK */}
              <button
                type="button"
                onClick={() => handleDownload('release')}
                className="group relative p-4 rounded-xl border-2 border-emerald-500 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900 text-left hover:shadow-lg hover:border-emerald-400 transition-all cursor-pointer active:scale-98"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                    Recommended
                  </span>
                  <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Release APK (.apk)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Signed production build • High performance
                </p>
                <div className="mt-3 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download APK</span>
                </div>
              </button>

              {/* Debug / Test APK */}
              <button
                type="button"
                onClick={() => handleDownload('debug')}
                className="group relative p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-left hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer active:scale-98"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    Developer
                  </span>
                  <FileCode className="w-4 h-4 text-slate-500 group-hover:translate-y-0.5 transition-transform" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Debug APK (.apk)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Testing &amp; log monitoring enabled
                </p>
                <div className="mt-3 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white font-bold text-xs transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Debug</span>
                </div>
              </button>
            </div>

            {/* Features Highlight */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
              <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Native Android Advantages</span>
              </h5>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>0% Lag &amp; Hardware GPS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Play Protect Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-3 h-3 text-blue-500 shrink-0" />
                  <span>Lockscreen Push Alerts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-teal-500 shrink-0" />
                  <span>Offline Cache Support</span>
                </div>
              </div>
            </div>

            {/* 3-Step Install Guide */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowSteps(!showSteps)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-left font-bold text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>How to Install .APK on Android (3 Steps)</span>
                </div>
                {showSteps ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {showSteps && (
                <div className="p-3.5 space-y-3 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex gap-2.5 pt-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-200">Tap "Download APK"</p>
                      <p className="text-[11px] mt-0.5">Your browser will download the APK installer file to your device.</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-200">Open Downloaded File</p>
                      <p className="text-[11px] mt-0.5">Tap the downloaded notification or open your device's <strong>Downloads</strong> folder.</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-200">Allow "Install Unknown Apps" &amp; Confirm</p>
                      <p className="text-[11px] mt-0.5">
                        If Android shows a prompt, tap <strong>Settings</strong>, toggle <strong>Allow from this source</strong> to ON, and tap <strong>Install</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
            <a
              href="/api/mobile/download-zip"
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Capacitor Project (ZIP)</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
