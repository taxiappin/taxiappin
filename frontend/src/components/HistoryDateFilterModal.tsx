import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  X,
  Search,
  Check,
  RotateCcw,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "../lib/utils";

export type HistoryDateFilterMode =
  | "ALL"
  | "TODAY"
  | "YESTERDAY"
  | "LAST_7_DAYS"
  | "THIS_MONTH"
  | "CUSTOM_DATE"
  | "DATE_RANGE";

interface HistoryDateFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterMode: HistoryDateFilterMode;
  onSelectFilterMode: (mode: HistoryDateFilterMode) => void;
  customDate: string;
  onChangeCustomDate: (date: string) => void;
  endDate: string;
  onChangeEndDate: (date: string) => void;
  searchQuery: string;
  onChangeSearchQuery: (query: string) => void;
  onReset: () => void;
  matchingCount?: number;
}

export const HistoryDateFilterModal: React.FC<HistoryDateFilterModalProps> = ({
  isOpen,
  onClose,
  filterMode,
  onSelectFilterMode,
  customDate,
  onChangeCustomDate,
  endDate,
  onChangeEndDate,
  searchQuery,
  onChangeSearchQuery,
  onReset,
  matchingCount,
}) => {
  if (!isOpen) return null;

  const presets: { mode: HistoryDateFilterMode; label: string; desc: string }[] = [
    { mode: "ALL", label: "All Dates", desc: "Show complete history" },
    { mode: "TODAY", label: "Today", desc: "Trips from today" },
    { mode: "YESTERDAY", label: "Yesterday", desc: "Trips from yesterday" },
    { mode: "LAST_7_DAYS", label: "Last 7 Days", desc: "Past week activity" },
    { mode: "THIS_MONTH", label: "This Month", desc: "Current calendar month" },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/40">
                <Calendar size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  Filter by Date & Time
                </h3>
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  Search & narrow down your trip history
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-4 overflow-y-auto scrollbar-hide flex-1">
            {/* Search Input for Quick Keyword / Date search */}
            <div className="space-y-1.5">
              <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Search By Date Keyword
              </label>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="e.g. Today, Aug 16, 2026-08, May 09..."
                  value={searchQuery}
                  onChange={(e) => onChangeSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => onChangeSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {presets.map((preset) => {
                  const isSelected =
                    filterMode === preset.mode &&
                    !customDate &&
                    !searchQuery;
                  return (
                    <button
                      key={preset.mode}
                      onClick={() => {
                        onSelectFilterMode(preset.mode);
                        onChangeCustomDate("");
                        onChangeEndDate("");
                      }}
                      className={cn(
                        "flex flex-col items-start p-2.5 rounded-xl border text-left transition-all relative overflow-hidden outline-none active:scale-98 cursor-pointer select-none",
                        isSelected
                          ? "bg-amber-500 border-amber-500 text-slate-950 shadow-xs"
                          : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-black tracking-tight">
                          {preset.label}
                        </span>
                        {isSelected && <Check size={12} className="text-slate-950 font-bold" />}
                      </div>
                      <span
                        className={cn(
                          "text-[9.5px] font-semibold mt-0.5 leading-tight",
                          isSelected
                            ? "text-slate-900/80"
                            : "text-slate-400 dark:text-slate-500"
                        )}
                      >
                        {preset.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Specific Date Picker */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Specific Calendar Date
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => {
                    onChangeCustomDate(e.target.value);
                    if (e.target.value) {
                      onSelectFilterMode(endDate ? "DATE_RANGE" : "CUSTOM_DATE");
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
                />
                {customDate && (
                  <button
                    onClick={() => {
                      onChangeCustomDate("");
                      if (!endDate) onSelectFilterMode("ALL");
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Date Range Option (Optional) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[10.5px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Or Custom Date Range (From – To)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[9.5px] font-bold text-slate-400 mb-1">
                    Start Date
                  </span>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => {
                      onChangeCustomDate(e.target.value);
                      if (e.target.value) {
                        onSelectFilterMode(endDate ? "DATE_RANGE" : "CUSTOM_DATE");
                      }
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <span className="block text-[9.5px] font-bold text-slate-400 mb-1">
                    End Date
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      onChangeEndDate(e.target.value);
                      if (e.target.value) {
                        onSelectFilterMode("DATE_RANGE");
                      }
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={() => {
                onReset();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
            >
              <RotateCcw size={12} />
              <span>Clear Filter</span>
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black bg-[#FACC15] hover:bg-amber-400 text-slate-950 shadow-xs active:scale-95 transition-all"
            >
              <span>Apply</span>
              {typeof matchingCount === "number" && (
                <span className="px-1.5 py-0.5 rounded-md bg-black/10 text-slate-950 text-[10px] font-black">
                  {matchingCount}
                </span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
