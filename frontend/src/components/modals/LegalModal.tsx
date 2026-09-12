import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, FileText, ChevronRight } from "lucide-react";
import { useConfig } from "../../lib/ConfigContext";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  const { config } = useConfig();
  const [selectedLegalPageId, setSelectedLegalPageId] = useState<string | null>(
    null
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[11000] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white border border-slate-200 w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              {selectedLegalPageId && (
                <button
                  onClick={() => setSelectedLegalPageId(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 transition-colors mr-1 flex items-center justify-center cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <h3 className="text-xs font-black uppercase tracking-tight text-slate-800">
                {selectedLegalPageId
                  ? config.pages?.find((p) => p.id === selectedLegalPageId)
                      ?.title || "Legal Policy"
                  : "Legal & Policies"}
              </h3>
            </div>
            <button
              onClick={() => {
                onClose();
                setSelectedLegalPageId(null);
              }}
              className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 transition-colors flex items-center justify-center text-slate-700 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 min-h-[300px] max-h-[500px]">
            {!selectedLegalPageId ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 text-center space-y-1">
                  <div className="w-10 h-10 bg-primary/15 text-primary rounded-full flex items-center justify-center mx-auto text-lg">
                    📄
                  </div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
                    Platform Policy Agreements
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    Please review the official terms, privacy guidelines, and
                    refund rules for{" "}
                    {config.general?.platformName || "RideBuddy"}.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {(config.pages || [])
                    .filter((p) => p.status === "Active")
                    .map((page) => (
                      <button
                        key={page.id}
                        onClick={() => setSelectedLegalPageId(page.id)}
                        className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 shadow-3xs transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <FileText size={16} />
                          </div>
                          <div className="text-left">
                            <span className="text-[11px] font-bold text-slate-800 block">
                              {page.title}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono block">
                              Updated: {page.lastUpdated}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          size={14}
                          className="text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                        />
                      </button>
                    ))}

                  {(config.pages || []).filter((p) => p.status === "Active")
                    .length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-8 font-medium">
                      No policies published currently.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const page = config.pages?.find(
                    (p) => p.id === selectedLegalPageId
                  );
                  if (!page)
                    return (
                      <p className="text-xs text-slate-400">
                        Page not found.
                      </p>
                    );
                  return (
                    <div
                      className="text-slate-700 text-xs leading-relaxed space-y-3 prose max-w-none prose-sm"
                      dangerouslySetInnerHTML={{
                        __html: page.content || "<p>No content provided.</p>",
                      }}
                    />
                  );
                })()}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => {
                if (selectedLegalPageId) {
                  setSelectedLegalPageId(null);
                } else {
                  onClose();
                }
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
            >
              {selectedLegalPageId ? "Back" : "Close"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
