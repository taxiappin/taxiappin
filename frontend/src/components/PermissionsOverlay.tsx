import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, MapPin, ShieldCheck, X, ChevronRight, Lock } from 'lucide-react';
import { notificationService } from '../services/systemService';
import { subscribeToPush } from '../lib/webPushClient';

export const PermissionsOverlay: React.FC = () => {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState({
    location: false,
    notifications: false
  });

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('permissions_overlay_dismissed');
    if (isDismissed) return;

    const checkPermissions = async () => {
      const locPerm = await navigator.permissions?.query?.({ name: 'geolocation' as any });
      const notifPerm = Notification.permission;
      
      const isLocGranted = locPerm?.state === 'granted';
      const isNotifGranted = notifPerm === 'granted';

      setStatus({
        location: isLocGranted,
        notifications: isNotifGranted
      });

      // Show overlay if any permission is missing
      if (!isLocGranted || !isNotifGranted) {
        // Wait a bit before showing
        const timer = setTimeout(() => setShow(true), 2500); // 2.5s delay
        return () => clearTimeout(timer);
      }
    };

    checkPermissions();
  }, []);

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => setStatus(prev => ({ ...prev, location: true })),
      (err) => console.warn('Location denied', err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const requestNotifications = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      setStatus(prev => ({ ...prev, notifications: true }));
      try {
        await subscribeToPush('rider');
      } catch (e) {
        console.warn("Push sync error:", e);
      }
      notificationService.show('TaxiApp Notifications', 'You will now receive real-time updates for your rides!');
    }
  };

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('permissions_overlay_dismissed', 'true');
  };

  // If both granted, hide
  if (status.location && status.notifications) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/20"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center shadow-xl">
                  <ShieldCheck size={32} className="text-white" />
                </div>
                <button 
                  onClick={handleClose}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X size={20} className="text-ink/40" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-ink mb-2 tracking-tight">Enable Experience</h2>
              <p className="text-ink/60 text-sm leading-relaxed mb-8">
                To provide safe and real-time rides, we need your permission for the following:
              </p>

              <div className="space-y-4">
                {/* Location */}
                <div 
                  className={`p-5 rounded-2xl border-2 transition-all ${status.location ? 'border-green-500/20 bg-green-500/5' : 'border-black/5 bg-gray-50'}`}
                  onClick={!status.location ? requestLocation : undefined}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${status.location ? 'bg-green-500 text-white' : 'bg-white text-ink'}`}>
                      <MapPin size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-ink">Live Location</p>
                      <p className="text-xs text-ink/50">Needed for pickup tracking</p>
                    </div>
                    {status.location ? (
                      <div className="bg-green-500 rounded-full p-1"><ShieldCheck size={14} className="text-white" /></div>
                    ) : (
                      <ChevronRight size={18} className="text-ink/20" />
                    )}
                  </div>
                </div>

                {/* Notifications */}
                <div 
                  className={`p-5 rounded-2xl border-2 transition-all ${status.notifications ? 'border-green-500/20 bg-green-500/5' : 'border-black/5 bg-gray-50'}`}
                  onClick={!status.notifications ? requestNotifications : undefined}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${status.notifications ? 'bg-green-500 text-white' : 'bg-white text-ink'}`}>
                      <Bell size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-ink">Push Notifications</p>
                      <p className="text-xs text-ink/50">Get alerts for ride status</p>
                    </div>
                    {status.notifications ? (
                      <div className="bg-green-500 rounded-full p-1"><ShieldCheck size={14} className="text-white" /></div>
                    ) : (
                      <ChevronRight size={18} className="text-ink/20" />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <button
                  onClick={handleClose}
                  className="w-full h-14 bg-black text-white rounded-2xl font-bold shadow-xl shadow-black/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {status.location && status.notifications ? "Let's Go" : "Maybe Later"}
                </button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-ink/30 font-medium uppercase tracking-[0.05em]">
                  <Lock size={12} />
                  <span>Privacy First Encryption</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
