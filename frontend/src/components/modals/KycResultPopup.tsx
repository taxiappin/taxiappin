import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface KycResultPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: "approved" | "rejected";
  reason?: string;
  onFix?: () => void;
}

export const KycResultPopup: React.FC<KycResultPopupProps> = ({
  isOpen,
  onClose,
  type,
  reason,
  onFix,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[20000] bg-ink/65 backdrop-blur-sm flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-canvas w-full max-w-md rounded-3xl border border-hairline-soft shadow-2xl p-8 text-center space-y-6"
      >
        {type === "approved" ? (
          <>
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
              <ShieldCheck size={44} className="text-emerald-500 relative z-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-emerald-600 uppercase italic tracking-tighter">
                KYC Verification Approved!
              </h3>
              <p className="text-[11px] font-bold text-mute uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto">
                Congratulations! Our safety compliance audit is complete. Your driver account is fully active.
              </p>
            </div>
            <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-left">
              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-2">
                Unlocked Features:
              </p>
              <ul className="text-[10px] font-bold text-emerald-700 space-y-1.5 uppercase">
                <li className="flex items-center gap-2">✔ Access Live Ride Requests</li>
                <li className="flex items-center gap-2">✔ Activate Online Status Toggle</li>
                <li className="flex items-center gap-2">✔ Withdraw earnings to wallet</li>
              </ul>
            </div>
            <button
              onClick={onClose}
              className="w-full py-4 bg-emerald-600 text-canvas rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:bg-emerald-700 hover:scale-[1.02] transition-all cursor-pointer"
            >
              Start Earning Now
            </button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
              <div className="absolute inset-0 rounded-full bg-rose-400/20 animate-pulse" />
              <AlertTriangle size={44} className="text-rose-500 relative z-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-rose-600 uppercase italic tracking-tighter">
                KYC Verification Rejected
              </h3>
              <p className="text-[11px] font-bold text-mute uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto">
                Our compliance team has flagged deficiencies with your submitted verification documents.
              </p>
            </div>
            <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 text-left">
              <p className="text-[10px] font-black text-rose-800 uppercase tracking-wider mb-1.5">
                Deficiency Report / Reason:
              </p>
              <p className="text-[11px] font-bold text-rose-700 uppercase tracking-tight">
                {reason || "Incorrect or blurry documents. Please check that license and selfie are clear."}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-surface-soft text-ink rounded-2xl font-black text-[10px] uppercase tracking-wider hover:bg-white transition-all shadow-sm cursor-pointer"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  onClose();
                  onFix?.();
                }}
                className="flex-1 py-4 bg-ink text-canvas rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] shadow-lg hover:bg-slate-800 hover:scale-[1.02] transition-all cursor-pointer"
              >
                Fix & Re-Submit
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
