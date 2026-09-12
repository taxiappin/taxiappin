import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Download, Smartphone, Check } from 'lucide-react';
import { useConfig } from '../lib/ConfigContext';
import { BrandLogo } from './BrandLogo';

interface PWAInstallPromptProps {
  delay?: number;
}

// Custom Apple iOS standard Share Icon
export const IosShareIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 3v12M8 7l4-4 4 4" />
    <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
  </svg>
);

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ delay = 2500 }) => {
  const { config } = useConfig();
  const pwaPrompt = (config.pwaPromptConfig || {
    enabled: true,
    appTitle: 'TaxiApp Shortcut',
    appSubtitle: 'INSTALL FOR A FASTER EXPERIENCE',
    versionTag: 'v2.5.0',
    iosStep1Title: 'TAP SAFARI SHARE BUTTON',
    iosStep1Desc: 'Tap the share icon (box with arrow) at the bottom or top of Safari.',
    iosStep1Image: '/uploads/autotop.svg',
    iosStep2Title: 'SCROLL DOWN SHARE MENU',
    iosStep2Desc: 'Scroll down the options list in the iOS Share sheet.',
    iosStep2Image: '/uploads/carprofile.svg',
    iosStep3Title: 'SELECT "ADD TO HOME SCREEN"',
    iosStep3Desc: 'Confirm and tap "Add" at top right to place app on your home screen!',
    iosStep3Image: '/uploads/cartop.svg',
    androidStep1Title: 'TAP CHROME MENU BUTTON (⋮)',
    androidStep1Desc: 'Click the browser menu (⋮) in Chrome to reveal options.',
    androidStep1Image: '/uploads/bikeprofile.svg',
    androidStep2Title: 'HIT "INSTALL APP" OR "ADD TO HOME"',
    androidStep2Desc: 'Tap "Install App" or "Add to Home Screen" to install.',
    androidStep2Image: '/uploads/biketop.svg',
    primaryButtonText: 'GOT IT, CLOSE GUIDE',
    secondaryButtonText: 'MAYBE LATER',
    autoPushToUninstalled: true,
    forceDeviceView: 'auto'
  }) as any;

  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [targetOS, setTargetOS] = useState<'ios' | 'android'>('ios');
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  useEffect(() => {
    if (!pwaPrompt.enabled) {
      setIsVisible(false);
      return;
    }

    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    // Auto-detect device OS or respect forced override from admin
    if (pwaPrompt.forceDeviceView === 'ios') {
      setTargetOS('ios');
    } else if (pwaPrompt.forceDeviceView === 'android') {
      setTargetOS('android');
    } else {
      setTargetOS(isAndroidDevice ? 'android' : 'ios');
    }

    // Check standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Google Chrome / Android install prompt handler
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = sessionStorage.getItem('pwa_prompt_dismissed_v3');
      if (dismissed !== 'true' && pwaPrompt.autoPushToUninstalled) {
        setTimeout(() => setIsVisible(true), delay);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Auto show if not dismissed
    const dismissed = sessionStorage.getItem('pwa_prompt_dismissed_v3');
    if (dismissed !== 'true' && pwaPrompt.autoPushToUninstalled && !isStandalone) {
      setTimeout(() => setIsVisible(true), delay);
    }

    // Listen for live backend push event
    const handlePushEvent = () => {
      setIsVisible(true);
      sessionStorage.removeItem('pwa_prompt_dismissed_v3');
    };
    window.addEventListener('push_pwa_install_prompt_event', handlePushEvent);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('push_pwa_install_prompt_event', handlePushEvent);
    };
  }, [delay, pwaPrompt.enabled, pwaPrompt.autoPushToUninstalled, pwaPrompt.forceDeviceView]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      closePrompt();
    }
  };

  const closePrompt = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_prompt_dismissed_v3', 'true');
  };

  if (!pwaPrompt.enabled || isInstalled) {
    return null;
  }

  // iOS Screenshot Steps
  const iosSteps = [
    {
      step: 1,
      title: pwaPrompt.iosStep1Title || 'TAP SAFARI SHARE BUTTON',
      desc: pwaPrompt.iosStep1Desc || 'Tap the share icon (box with upward arrow) in the Safari browser toolbar.',
      image: pwaPrompt.iosStep1Image || '/uploads/autotop.svg'
    },
    {
      step: 2,
      title: pwaPrompt.iosStep2Title || 'SCROLL DOWN SHARE MENU',
      desc: pwaPrompt.iosStep2Desc || 'Scroll down the options list in the iOS Share sheet.',
      image: pwaPrompt.iosStep2Image || '/uploads/carprofile.svg'
    },
    {
      step: 3,
      title: pwaPrompt.iosStep3Title || 'SELECT "ADD TO HOME SCREEN"',
      desc: pwaPrompt.iosStep3Desc || 'Confirm and tap "Add" at top right to place shortcut on your home screen!',
      image: pwaPrompt.iosStep3Image || '/uploads/cartop.svg'
    }
  ];

  // Android Screenshot Steps
  const androidSteps = [
    {
      step: 1,
      title: pwaPrompt.androidStep1Title || 'TAP CHROME MENU (⋮)',
      desc: pwaPrompt.androidStep1Desc || 'Click the three dots (⋮) in the top right corner of Chrome.',
      image: pwaPrompt.androidStep1Image || '/uploads/bikeprofile.svg'
    },
    {
      step: 2,
      title: pwaPrompt.androidStep2Title || 'SELECT "INSTALL APP"',
      desc: pwaPrompt.androidStep2Desc || 'Select "Install App" or "Add to Home Screen" from the Chrome menu.',
      image: pwaPrompt.androidStep2Image || '/uploads/biketop.svg'
    }
  ];

  const currentSteps = targetOS === 'ios' ? iosSteps : androidSteps;
  const activeStep = currentSteps.find(s => s.step === activeStepTab) || currentSteps[0];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute inset-0 z-[11000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 select-none overflow-y-auto rounded-[inherit]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="bg-white w-full max-w-[340px] rounded-3xl p-4 shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col relative max-h-[90%] my-auto"
          >
            {/* Close Button */}
            <button 
              onClick={closePrompt}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer outline-none z-10"
              aria-label="Close modal"
            >
              <X size={15} />
            </button>

            {/* Header: Exact Same Brand Logo as Home Page */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5 pr-8">
              <BrandLogo config={config} variant="combined" height={28} showTagline={false} />
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-md text-[9px] font-mono font-bold shrink-0">
                {pwaPrompt.versionTag || 'v2.5.0'}
              </span>
            </div>

            {/* Card Title & Subtext */}
            <div className="text-center space-y-0.5 mb-2.5">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight leading-snug">
                {pwaPrompt.cardTitle || pwaPrompt.appTitle || 'Install TaxiApp Shortcut'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                {pwaPrompt.cardSubtext || pwaPrompt.appSubtitle || 'Add to home screen for instant 1-tap bookings & fast performance.'}
              </p>
            </div>

            {/* Android Direct Install Action (if available / Android mode) */}
            {targetOS === 'android' && (
              <button
                onClick={handleInstallClick}
                className="w-full mb-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2 px-3 rounded-2xl shadow-sm border border-amber-500/80 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer active:scale-98 transition-all"
              >
                <Download size={14} />
                <span>INSTALL APP DIRECTLY</span>
              </button>
            )}

            {/* Step Tabs Navigation - Equal width & clean alignment */}
            <div className="flex items-center gap-1.5 mb-2">
              {currentSteps.map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStepTab(s.step)}
                  className={`flex-1 py-1 px-2 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer border text-center ${
                    activeStepTab === s.step
                      ? 'bg-slate-950 text-amber-400 border-slate-900 shadow-2xs'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/70'
                  }`}
                >
                  Step {s.step}
                </button>
              ))}
            </div>

            {/* Active Step Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${targetOS}-${activeStep.step}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="bg-slate-50 border border-slate-200/90 rounded-2xl p-2.5 space-y-2 shadow-2xs"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center shrink-0">
                    {activeStep.step}
                  </span>
                  <h4 className="font-extrabold text-[11px] text-slate-900 tracking-tight leading-tight">
                    {activeStep.title}
                  </h4>
                </div>

                <p className="text-[10px] text-slate-600 leading-tight font-medium">
                  {activeStep.desc}
                </p>

                {/* Uniform Image Box - Strictly Identical Heights across all steps */}
                <div className="w-full h-28 bg-slate-900 rounded-xl overflow-hidden border border-slate-300/80 p-2 flex items-center justify-center shadow-inner relative">
                  <img 
                    src={activeStep.image} 
                    alt={`Step ${activeStep.step}`} 
                    className="h-20 max-h-20 w-auto max-w-full object-contain mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 
                        activeStep.step === 1 ? "/uploads/autotop.svg" : activeStep.step === 2 ? "/uploads/carprofile.svg" : "/uploads/cartop.svg";
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Primary & Secondary Action Buttons */}
            <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-1 shrink-0 mt-2.5">
              <button
                onClick={closePrompt}
                className="w-full bg-slate-950 hover:bg-black text-white h-9 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all cursor-pointer outline-none"
              >
                <span>{pwaPrompt.primaryButtonText || 'DONE WITH INSTRUCTION'}</span>
                <ArrowRight size={13} />
              </button>

              <button
                onClick={closePrompt}
                className="w-full h-6 text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center justify-center hover:text-slate-800 transition-all outline-none cursor-pointer"
              >
                {pwaPrompt.secondaryButtonText || 'MAYBE LATER'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

