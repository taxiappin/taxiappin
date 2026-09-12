import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/utils";

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  addMoneyAmount: string;
  setAddMoneyAmount: (amount: string) => void;
  isProcessingPayment: boolean;
  onProceedToPay: (amount: number) => void;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
  isOpen,
  onClose,
  addMoneyAmount,
  setAddMoneyAmount,
  isProcessingPayment,
  onProceedToPay,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center">
          {/* Click-away overlay wrapper */}
          <div
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] cursor-pointer"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 1 }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="bg-canvas w-full max-w-md rounded-t-[40px] px-6 pb-12 pt-4 shadow-[0_-15px_45px_rgba(0,0,0,0.15)] border-t border-x border-white/10 relative z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Drag Handle Top */}
            <div className="w-12 sm:w-14 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 shrink-0" />

            {/* Styled Header with Back Arrow on Left */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center text-secondary active:scale-95 transition-all border border-gray-100 shadow-sm shrink-0 cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h3 className="text-xl font-black text-ink uppercase tracking-tight italic leading-none">
                  Add Money
                </h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1.5 font-mono">
                  Secure Payment Gateway
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                {/* Quick Preset Buttons */}
                <div>
                  <span className="text-[9px] font-black text-mute uppercase tracking-widest block mb-1.5">
                    Select Amount Presets
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {["200", "500", "1000", "2000"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAddMoneyAmount(preset)}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-black transition-all active:scale-[0.93] border cursor-pointer",
                          addMoneyAmount === preset
                            ? "bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-400 font-black shadow-2xs"
                            : "bg-surface-soft border-hairline-soft text-mute hover:bg-white"
                        )}
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Input */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-mute uppercase tracking-widest block leading-none">
                    Custom Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-mute font-mono">
                      ₹
                    </span>
                    <input
                      type="text"
                      placeholder="Enter amount"
                      value={addMoneyAmount}
                      onChange={(e) =>
                        setAddMoneyAmount(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="w-full bg-surface-soft text-ink font-mono font-black text-lg pl-8 p-3.5 pr-4 rounded-xl border border-hairline-soft focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Action Button */}
              <button
                type="button"
                disabled={
                  !addMoneyAmount ||
                  parseInt(addMoneyAmount) < 10 ||
                  isProcessingPayment
                }
                onClick={() => {
                  onProceedToPay(parseInt(addMoneyAmount));
                }}
                className={cn(
                  "w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-lg border border-white/10",
                  !addMoneyAmount ||
                    parseInt(addMoneyAmount) < 10 ||
                    isProcessingPayment
                    ? "bg-amber-500/40 text-slate-950/50 cursor-not-allowed opacity-60"
                    : "bg-primary hover:bg-amber-400 text-slate-950 cursor-pointer shadow-amber-500/20"
                )}
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    PROCEED TO PAY
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  walletBalance: number;
  isProcessingWithdrawal: boolean;
  onWithdraw: (amount: number) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  withdrawAmount,
  setWithdrawAmount,
  walletBalance,
  isProcessingWithdrawal,
  onWithdraw,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center">
          {/* Click-away overlay wrapper */}
          <div
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] cursor-pointer"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 1 }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="bg-canvas w-full max-w-md rounded-t-[40px] px-6 pb-12 pt-4 shadow-[0_-15px_45px_rgba(0,0,0,0.15)] border-t border-x border-white/10 relative z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Drag Handle Top */}
            <div className="w-12 sm:w-14 h-1.5 bg-gray-100 rounded-full mx-auto mb-6 shrink-0" />

            {/* Styled Header with Back Arrow on Left */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center text-secondary active:scale-[0.93] transition-all border border-gray-100 shadow-sm shrink-0 cursor-pointer"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h3 className="text-xl font-black text-ink uppercase tracking-tight italic leading-none">
                  Withdraw Funds
                </h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1.5 font-mono">
                  To Verified Bank Account
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                {/* Quick Preset Buttons */}
                <div>
                  <span className="text-[9px] font-black text-mute uppercase tracking-widest block mb-1.5">
                    Select Payout Amount
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {["100", "500", "1000", "5000"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setWithdrawAmount(preset)}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-black transition-all active:scale-[0.93] border cursor-pointer",
                          withdrawAmount === preset
                            ? "bg-emerald-50 border-emerald-500 text-emerald-600 font-bold"
                            : "bg-surface-soft border-hairline-soft text-mute hover:bg-white"
                        )}
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual Input */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-mute uppercase tracking-widest block leading-none font-mono">
                    Custom Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-mute font-mono">
                      ₹
                    </span>
                    <input
                      type="text"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) =>
                        setWithdrawAmount(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      className="w-full bg-surface-soft text-ink font-mono font-black text-lg pl-8 p-3.5 pr-4 rounded-xl border border-hairline-soft focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                  <p className="text-[9px] font-bold text-gray-400 pl-1 font-mono">
                    Available balance: ₹{walletBalance.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Submit Action Button */}
              <button
                type="button"
                disabled={
                  !withdrawAmount ||
                  parseInt(withdrawAmount) < 10 ||
                  parseInt(withdrawAmount) > walletBalance ||
                  isProcessingWithdrawal
                }
                onClick={() => {
                  onWithdraw(parseInt(withdrawAmount));
                }}
                className={cn(
                  "w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-xl border border-white/10",
                  !withdrawAmount ||
                    parseInt(withdrawAmount) < 10 ||
                    parseInt(withdrawAmount) > walletBalance ||
                    isProcessingWithdrawal
                    ? "bg-emerald-600/50 cursor-not-allowed opacity-60"
                    : "bg-emerald-600 hover:bg-emerald-750 text-white cursor-pointer"
                )}
              >
                {isProcessingWithdrawal ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Transferring...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    SECURE WITHDRAW
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
