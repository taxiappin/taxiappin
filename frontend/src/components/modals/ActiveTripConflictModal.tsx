import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Navigation, Trash2 } from "lucide-react";

interface ActiveTripConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTripConflictTargetMode: string;
  onViewActiveTrip: () => void;
  onForceClearAndSwitch: () => void;
}

export const ActiveTripConflictModal: React.FC<ActiveTripConflictModalProps> = ({
  isOpen,
  onClose,
  activeTripConflictTargetMode,
  onViewActiveTrip,
  onForceClearAndSwitch,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[999999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-[#1a1f26] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-5 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center shrink-0">
              <AlertCircle size={24} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Active Trip Detected
              </h3>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Mode switch locked during active ride
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            You have an active trip in progress. View your live ride to complete
            or cancel it, or force clear it to switch to{" "}
            <strong className="text-slate-900 dark:text-white uppercase">
              {activeTripConflictTargetMode}
            </strong>{" "}
            mode.
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={onViewActiveTrip}
              className="w-full py-3 bg-primary text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation size={16} />
              View Active Ride Progress
            </button>
            <button
              onClick={onForceClearAndSwitch}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 size={14} />
              Cancel Trip & Switch Mode
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
