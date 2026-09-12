import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, X, Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface DisplayScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayScale: "large" | "medium" | "small";
  setDisplayScale: (scale: "large" | "medium" | "small") => void;
  onApply: (scale: string) => void;
}

export const DisplayScaleModal: React.FC<DisplayScaleModalProps> = ({
  isOpen,
  onClose,
  displayScale,
  setDisplayScale,
  onApply,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10005] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-secondary/60 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="w-full max-w-sm bg-canvas rounded-t-3xl sm:rounded-3xl border border-hairline-soft shadow-2xl p-4 sm:p-5 overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-hairline-soft mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <Smartphone size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-ink uppercase tracking-tight leading-none">
                    Select Screen Size
                  </h3>
                  <p className="text-[10px] font-semibold text-mute mt-0.5">
                    Choose display scale for your phone
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-surface-soft hover:bg-surface-card border border-hairline-soft flex items-center justify-center text-mute hover:text-ink transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Screen Size Options Grid */}
            <div className="grid grid-cols-1 gap-2 mb-4">
              {[
                {
                  id: "large",
                  title: '6.5" Default',
                  subtitle: "100% Scale",
                  icon: "📱",
                },
                {
                  id: "medium",
                  title: '5.5" Medium',
                  subtitle: "89% Scale",
                  icon: "📲",
                },
                {
                  id: "small",
                  title: '5.0" Small',
                  subtitle: "78% Scale",
                  icon: "📱",
                },
              ].map((option) => {
                const isSelected = displayScale === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setDisplayScale(option.id as any);
                    }}
                    className={cn(
                      "w-full text-left px-3.5 py-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 relative",
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-2xs"
                        : "border-hairline-soft bg-surface-card hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl select-none">{option.icon}</span>
                      <div>
                        <h4 className="text-xs font-black text-ink tracking-tight">
                          {option.title}
                        </h4>
                        <span className="text-[10px] font-bold text-mute">
                          {option.subtitle}
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0",
                        isSelected
                          ? "bg-primary border-primary-dark text-slate-950 font-black"
                          : "border-hairline-soft bg-surface-soft"
                      )}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Controls */}
            <div className="flex items-center gap-2 pt-2.5 border-t border-hairline-soft">
              <button
                onClick={() => setDisplayScale("large")}
                className="py-2.5 px-3 bg-surface-soft hover:bg-surface-card text-secondary font-black text-[10px] uppercase tracking-wider rounded-xl border border-hairline-soft transition-all cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  onClose();
                  onApply(displayScale);
                }}
                className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 border border-primary-dark active:scale-95"
              >
                <Check size={15} strokeWidth={2.5} />
                <span>Apply Size</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
