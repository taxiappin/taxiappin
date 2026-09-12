import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, 
  Copy, 
  MessageSquare, 
  X, 
  Check, 
  QrCode, 
  Users, 
  Sparkles,
  Send,
  Mail,
  Smartphone,
  Car,
  Gift,
  UserPlus,
  ExternalLink
} from 'lucide-react';
import { useConfig } from '../lib/ConfigContext';

interface InviteFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  addNotification?: (msg: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export const InviteFriendModal: React.FC<InviteFriendModalProps> = ({
  isOpen,
  onClose,
  addNotification
}) => {
  const { config } = useConfig();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const inviteSettings = config.inviteSettings;
  const defaultUrl = typeof window !== 'undefined' ? window.location.origin : 'https://taxiapp.com';
  
  const appUrl = inviteSettings?.shareUrl || defaultUrl;
  const shareTitle = inviteSettings?.title || "Invite your Friends to TaxiApp";
  const shareHeadline = inviteSettings?.headline || "Book safe, fast, and comfortable rides anytime!";
  const shareDesc = inviteSettings?.description || "Send an invite link so your friends can book safe, fast, and comfortable rides anytime directly on the web.";
  const badgeText = inviteSettings?.badgeText || "Easy App Sharing";
  
  const whatsappMsg = inviteSettings?.whatsappMessage 
    ? inviteSettings.whatsappMessage 
    : `Hey! Check out TaxiApp to book safe, fast, and comfortable rides anytime: ${appUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    addNotification?.("Invite link copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMsg)}`;
    window.open(url, '_blank');
  };

  const handleTelegramShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(url, '_blank');
  };

  const handleEmailShare = () => {
    const subject = inviteSettings?.emailSubject || "Invitation to join TaxiApp";
    const body = inviteSettings?.emailBody || `Hey there,\n\nI'm inviting you to try TaxiApp for fast and reliable rides:\n${appUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: whatsappMsg,
          url: appUrl,
        });
      } catch {
        // User cancelled or failed
      }
    } else {
      handleCopy();
    }
  };

  const enabledApps = inviteSettings?.enabledApps || {
    whatsapp: true,
    telegram: true,
    sms: true,
    email: true,
    facebook: true,
    twitter: true,
    copyLink: true,
    nativeShare: true
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[10005] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 240 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative text-slate-900 dark:text-slate-100 p-6 space-y-5 font-sans"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md border border-amber-500 shrink-0">
                <Users size={22} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {shareTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
                  {shareHeadline}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Hero Banner Card */}
          <div className="p-4 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-amber-500/15 rounded-2xl border border-amber-300 dark:border-amber-800/80 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
              <Sparkles size={12} className="text-amber-500" />
              <span>{badgeText}</span>
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {shareHeadline}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {shareDesc}
            </p>
          </div>

          {/* App URL Copy Box */}
          {enabledApps.copyLink !== false && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Sharing Link:
                </label>
                <button 
                  onClick={() => setShowQr(!showQr)}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <QrCode size={13} />
                  <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2.5 px-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex-1">
                  {appUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copied ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* QR Code expansion */}
              {showQr && (
                <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-2 animate-in zoom-in-95 duration-200">
                  <div className="w-36 h-36 mx-auto bg-slate-950 p-3 rounded-2xl border border-amber-400/50 flex flex-col items-center justify-center text-amber-400 font-mono text-center">
                    <QrCode size={90} className="text-amber-400" />
                    <span className="text-[10px] font-bold mt-1 tracking-widest truncate max-w-full">TaxiApp</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Scan QR code using camera to open the website.</p>
                </div>
              )}
            </div>
          )}

          {/* Social Share Action Buttons */}
          <div className="space-y-2 pt-1">
            {enabledApps.whatsapp !== false && (
              <button
                onClick={handleWhatsAppShare}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-500"
              >
                <MessageSquare size={16} />
                <span>Share via WhatsApp</span>
              </button>
            )}

            {enabledApps.telegram !== false && (
              <button
                onClick={handleTelegramShare}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-sky-500"
              >
                <Send size={16} />
                <span>Share via Telegram</span>
              </button>
            )}

            {enabledApps.email !== false && (
              <button
                onClick={handleEmailShare}
                className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose-500"
              >
                <Mail size={16} />
                <span>Share via Email</span>
              </button>
            )}

            {enabledApps.nativeShare !== false && (
              <button
                onClick={handleNativeShare}
                className="w-full py-3 px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
              >
                <Share2 size={16} />
                <span>Share via Other Apps</span>
              </button>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Anyone with this link can instantly access TaxiApp on mobile or desktop.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
