import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Sparkles, ExternalLink, Smartphone, CheckCircle2 } from 'lucide-react';

export interface PopupNotificationData {
  id: string;
  title: string;
  body: string;
  image?: string;
  url?: string;
  actionLabel?: string;
  actionUrl?: string;
  isInstallPrompt?: boolean;
}

interface PopupNotificationModalProps {
  notification: PopupNotificationData | null;
  onClose: () => void;
  onAction?: (url?: string) => void;
  appLogo?: string;
  appName?: string;
}

export const PopupNotificationModal: React.FC<PopupNotificationModalProps> = ({
  notification,
  onClose,
  onAction,
  appLogo,
  appName = 'TaxiApp'
}) => {
  if (!notification) return null;

  const handleActionClick = () => {
    const targetUrl = notification.actionUrl || notification.url;
    if (onAction && targetUrl) {
      onAction(targetUrl);
    }
    onClose();
  };

  const logoSrc = appLogo || '/uploads/autoprofile.svg';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[12000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full max-w-[420px] rounded-[32px] p-6 shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col relative max-h-[90vh]"
        >
          {/* Close Mark Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-rose-600 transition-colors cursor-pointer outline-none z-20 shadow-xs"
            aria-label="Close Popup"
          >
            <X size={18} />
          </button>

          {/* Header Badge & App Branding */}
          <div className="flex items-center gap-3 mb-4 pr-10 border-b border-slate-100 pb-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 p-1 shadow-md border border-amber-500/30 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={logoSrc}
                alt={appName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/uploads/autoprofile.svg';
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 tracking-tight truncate">
                  {appName}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 text-[9px] font-extrabold uppercase border border-amber-500/20 font-mono">
                  ANNOUNCEMENT
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Instant Notification
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-3.5 overflow-y-auto pr-0.5 my-auto">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Bell size={18} />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-base font-extrabold text-slate-900 leading-snug tracking-tight">
                  {notification.title}
                </h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                  {notification.body}
                </p>
              </div>
            </div>

            {/* Attached Campaign Image */}
            {notification.image && (
              <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm max-h-48 bg-slate-50">
                <img
                  src={notification.image}
                  alt="Notification banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition-all cursor-pointer text-center"
            >
              CLOSE
            </button>

            {(notification.actionLabel || notification.actionUrl || notification.url) && (
              <button
                onClick={handleActionClick}
                className="flex-[1.4] py-3 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-2xl transition-all cursor-pointer shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
              >
                <span>{notification.actionLabel || 'VIEW NOW'}</span>
                <ExternalLink size={14} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
