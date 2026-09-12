import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Search, ThumbsUp, ThumbsDown, CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { useConfig } from "../../lib/ConfigContext";

interface SupportSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  supportModalTab: "safety" | "knowledge_base" | "report_issue";
  setSupportModalTab: (tab: "safety" | "knowledge_base" | "report_issue") => void;
  addNotification: (msg: string, type?: string) => void;
}

export const SupportSafetyModal: React.FC<SupportSafetyModalProps> = ({
  isOpen,
  onClose,
  supportModalTab,
  setSupportModalTab,
  addNotification,
}) => {
  const { config } = useConfig();
  const [kbMobileCategory, setKbMobileCategory] = useState("All");
  const [kbMobileSearch, setKbMobileSearch] = useState("");
  const [expandedKbIdMobile, setExpandedKbIdMobile] = useState<string | null>(null);
  const [kbFeedbackGiven, setKbFeedbackGiven] = useState<Record<string, "yes" | "no">>({});
  const [issueSubject, setIssueSubject] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);

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
          className="bg-canvas border border-hairline-soft w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
        >
          <div className="p-6 border-b border-hairline-soft flex items-center justify-between bg-rose-50/10">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-rose-500 rounded-full" />
              <h3 className="text-sm font-black uppercase text-rose-500 tracking-tight">
                Safety & Support
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-mute cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex border-b border-hairline-soft bg-slate-50/50 p-1 gap-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSupportModalTab("safety")}
              className={cn(
                "flex-1 py-2.5 px-2 text-[10px] font-black uppercase tracking-wider transition-all rounded-xl shrink-0 whitespace-nowrap cursor-pointer",
                supportModalTab === "safety"
                  ? "bg-white text-rose-500 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              🚨 Safety
            </button>
            <button
              onClick={() => setSupportModalTab("knowledge_base")}
              className={cn(
                "flex-1 py-2.5 px-2 text-[10px] font-black uppercase tracking-wider transition-all rounded-xl shrink-0 whitespace-nowrap cursor-pointer",
                supportModalTab === "knowledge_base"
                  ? "bg-white text-amber-600 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              📚 Rules & KB
            </button>
            <button
              onClick={() => setSupportModalTab("report_issue")}
              className={cn(
                "flex-1 py-2.5 px-2 text-[10px] font-black uppercase tracking-wider transition-all rounded-xl shrink-0 whitespace-nowrap cursor-pointer",
                supportModalTab === "report_issue"
                  ? "bg-white text-indigo-500 shadow-xs"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              💬 Report Issue
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
            {supportModalTab === "safety" ? (
              <>
                <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto animate-pulse flex-col text-xl">
                    🚨
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-rose-700 uppercase tracking-tight">
                      Tap SOS Helpline
                    </h4>
                    <p className="text-[9px] text-rose-500 font-bold uppercase tracking-widest mt-1">
                      Simulates safety center notifications and law alert
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      addNotification(
                        "Emergency SOS activated! Live tracking shared with police & emergency contacts.",
                        "error"
                      );
                      onClose();
                    }}
                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-md shadow-rose-600/30 cursor-pointer"
                  >
                    Activate Emergency Response
                  </button>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] text-mute font-bold uppercase tracking-widest">
                    Emergency Numbers
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="tel:112"
                      className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-secondary hover:bg-slate-100"
                    >
                      <span className="text-xs font-black">Police (112)</span>
                      <span className="text-[10px]">📞</span>
                    </a>
                    <a
                      href="tel:102"
                      className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-secondary hover:bg-slate-100"
                    >
                      <span className="text-xs font-black">Ambulance (102)</span>
                      <span className="text-[10px]">🚑</span>
                    </a>
                  </div>
                </div>
              </>
            ) : supportModalTab === "knowledge_base" ? (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={kbMobileSearch}
                    onChange={(e) => setKbMobileSearch(e.target.value)}
                    placeholder="Search rules, fares, policies..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pl-8 text-[11px] font-bold text-slate-800 outline-none"
                  />
                  <Search
                    size={13}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    "All",
                    "Safety & Emergency",
                    "Fares & Pricing",
                    "Vehicle Standards",
                    "Rider Guidelines",
                    "Driver Earnings",
                    "Lost & Found",
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setKbMobileCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shrink-0 border cursor-pointer whitespace-nowrap",
                        kbMobileCategory === cat
                          ? "bg-amber-400 text-slate-950 border-amber-400 font-black"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-1 max-h-[45vh] overflow-y-auto pr-1">
                  {(() => {
                    const articles = config?.knowledgeBase || [
                      {
                        id: "kb_1",
                        title:
                          "Zero-Tolerance Alcohol & Substance Abuse Policy",
                        category: "Safety & Emergency",
                        targetAudience: "All Users",
                        content:
                          "We maintain a strict zero-tolerance policy for drug and alcohol consumption during rides. Drivers found under the influence face instant account termination.",
                      },
                      {
                        id: "kb_2",
                        title:
                          "FasTag Auto-Toll Computation & Cash Collection Rules",
                        category: "Fares & Pricing",
                        targetAudience: "Riders & Drivers",
                        content:
                          "All state and national highway toll charges are tracked automatically using FasTag RFID coordinates.",
                      },
                    ];

                    const filtered = articles.filter((a: any) => {
                      if (
                        kbMobileCategory !== "All" &&
                        a.category !== kbMobileCategory
                      )
                        return false;
                      if (!kbMobileSearch.trim()) return true;
                      const q = kbMobileSearch.toLowerCase();
                      return (
                        a.title?.toLowerCase().includes(q) ||
                        a.category?.toLowerCase().includes(q) ||
                        a.content?.toLowerCase().includes(q)
                      );
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200">
                          <BookOpen
                            size={24}
                            className="text-slate-300 mx-auto mb-2"
                          />
                          <p className="text-xs font-bold text-slate-600">
                            No matching rules found
                          </p>
                        </div>
                      );
                    }

                    return filtered.map((item: any) => {
                      const isExpanded = expandedKbIdMobile === item.id;
                      return (
                        <div
                          key={item.id}
                          className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-2"
                        >
                          <div
                            className="flex items-start justify-between gap-2 cursor-pointer"
                            onClick={() =>
                              setExpandedKbIdMobile(
                                isExpanded ? null : item.id
                              )
                            }
                          >
                            <div className="space-y-1 min-w-0">
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-900 text-[8.5px] font-black rounded-md border border-amber-200/80 uppercase">
                                {item.category}
                              </span>
                              <h5 className="text-xs font-black text-slate-900 leading-snug">
                                {item.title}
                              </h5>
                            </div>
                            <ChevronDown
                              size={14}
                              className={cn(
                                "text-slate-400 transition-transform",
                                isExpanded && "rotate-180"
                              )}
                            />
                          </div>
                          {isExpanded && (
                            <p className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                              {item.content}
                            </p>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-mute font-bold uppercase tracking-widest">
                    Issue Subject
                  </label>
                  <input
                    type="text"
                    value={issueSubject}
                    onChange={(e) => setIssueSubject(e.target.value)}
                    placeholder="e.g. Lost item, billing discrepancy..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[11px] font-bold text-slate-800 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-mute font-bold uppercase tracking-widest">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Describe what happened in detail..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] font-bold text-slate-800 outline-none resize-none"
                  />
                </div>
                <button
                  disabled={
                    isSubmittingIssue ||
                    !issueSubject.trim() ||
                    !issueDescription.trim()
                  }
                  onClick={() => {
                    setIsSubmittingIssue(true);
                    setTimeout(() => {
                      setIsSubmittingIssue(false);
                      setIssueSubject("");
                      setIssueDescription("");
                      addNotification(
                        "Support ticket registered! Support will respond shortly.",
                        "success"
                      );
                      onClose();
                    }, 600);
                  }}
                  className="w-full py-3 bg-primary text-black font-black text-[11px] uppercase tracking-wider rounded-xl hover:bg-primary-dark transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingIssue ? "Submitting..." : "Submit Support Ticket"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
