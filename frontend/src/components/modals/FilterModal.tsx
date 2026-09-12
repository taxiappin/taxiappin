import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  buttonLabel = "Apply Filters",
  onButtonClick,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-[10000] flex items-end justify-center"
      >
        <div
          className="absolute inset-0 bg-secondary/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full bg-canvas rounded-t-lg p-0 shadow-2xl relative z-10 max-h-[90%] overflow-y-auto flex flex-col"
        >
          <div className="w-12 h-1.5 bg-hairline-soft rounded-full mx-auto mt-6 mb-2" />
          <div className="p-6 flex flex-col h-full bg-surface-soft">
            <div className="flex items-start justify-between mb-6 mt-1">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-ink uppercase tracking-tight">
                    {title}
                  </h3>
                </div>
                <p className="text-[10px] font-bold text-mute uppercase tracking-widest leading-none">
                  Refine your search results
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-canvas flex items-center justify-center text-ink hover:bg-surface-card transition-colors shadow-sm shrink-0 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
              <div className="max-w-md mx-auto w-full">{children}</div>
            </div>
            <div className="absolute bottom-6 left-0 right-0 z-[8001] flex justify-center px-6">
              <button
                onClick={onButtonClick || onClose}
                className="w-full py-4 bg-primary text-black rounded-md font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all cursor-pointer"
              >
                {buttonLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
