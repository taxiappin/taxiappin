import React, { useState } from "react";
import { motion } from "motion/react";
import { Shield, ShieldCheck, User, Camera, ArrowLeft, ArrowRight, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface RiderKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  step?: "not-started" | "documents" | "pending" | "verified";
  docs: any;
  onUpload: (type: string, url?: string) => void;
  onSubmit: () => void;
  onboardingStep?: number;
  setOnboardingStep?: (s: number) => void;
  addNotification?: (txt: string, type?: "info" | "success") => void;
  isInline?: boolean;
}

export const RiderKycModal: React.FC<RiderKycModalProps> = ({
  isOpen,
  onClose,
  docs,
  onUpload,
  onSubmit,
  onboardingStep = 1,
  setOnboardingStep,
  addNotification,
  isInline = false,
}) => {
  const steps = [
    "Aadhaar Verification",
    "Aadhaar OTP Code",
    "Selfie Identity Scan",
    "Trust Verification Secured",
  ];

  const [aadhaarVal, setAadhaarVal] = useState("");
  const [codeVal, setCodeVal] = useState("");
  const [aadhaarError, setAadhaarError] = useState("");

  const renderStepContent = () => {
    switch (onboardingStep) {
      case 1:
        return (
          <div className="space-y-5 py-4">
            <div className="bg-canvas border border-hairline-soft p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-primary" />
                <p className="text-[10px] font-black text-ink uppercase tracking-widest italic">
                  Aadhaar National ID Card
                </p>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <User
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-mute"
                  />
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaarVal}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setAadhaarVal(value);
                    }}
                    placeholder="ENTER 12-DIGIT AADHAAR"
                    className="w-full bg-surface-soft border border-hairline-soft rounded-xl py-4 pl-12 pr-4 text-[12px] font-black text-ink uppercase tracking-wider outline-none focus:ring-1 focus:ring-primary/30 transition-all shadow-inner"
                  />
                </div>
                {aadhaarError && (
                  <p className="text-[10px] font-bold text-rose-500 uppercase">
                    {aadhaarError}
                  </p>
                )}
                <p className="text-[9px] font-bold text-gray-400 uppercase leading-snug">
                  Your Aadhaar details are processed through a secure KYC
                  sandbox. We do not store your credentials.
                </p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5 py-4">
            <div className="bg-canvas border border-hairline-soft p-5 rounded-2xl">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center mb-4">
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider font-sans">
                  SMS OTP sent to UIDAI registered mobile! Use code 123456
                </p>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="ENTER 6-DIGIT OTP"
                  maxLength={6}
                  value={codeVal}
                  onChange={(e) => setCodeVal(e.target.value)}
                  className="w-full bg-surface-soft border border-hairline-soft rounded-xl py-4 px-4 text-center text-[14px] font-black text-ink tracking-[0.5em] outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setCodeVal("123456")}
                  className="w-full py-2 bg-gray-50 text-gray-400 rounded-xl text-[9px] uppercase tracking-widest hover:text-ink font-bold border-0 shadow-xs cursor-pointer font-mono"
                >
                  Auto-fill OTP Demo code (123456)
                </button>
              </div>
            </div>
          </div>
        );
      case 3:
        const selfieUrl = docs?.selfieUrl;
        return (
          <div className="space-y-6 py-4 text-center">
            <div className="w-36 h-36 rounded-full border-[6px] border-amber-400 mx-auto overflow-hidden relative shadow-2xl bg-neutral-100 group">
              <img
                src={selfieUrl || "https://picsum.photos/seed/rider/200/200"}
                className="w-full h-full object-cover"
                alt="Rider Selfie Match"
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-amber-500/0 via-amber-500/30 to-amber-500/0 animate-shimmer pointer-events-none"
                style={{ animationDuration: "2s", backgroundSize: "100% 200%" }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-amber-500 shadow-[0_0_10px_#f59e0b] animate-bounce pointer-events-none"
                style={{ animationDuration: "3s" }}
              />

              <label className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer duration-200 transition-opacity chat-bubble select-none">
                <Camera size={24} className="text-white mb-1" />
                <span className="text-[8px] font-black text-white uppercase tracking-wider leading-none">
                  Capture
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        onUpload("selfieUrl", reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
            <div className="space-y-2 max-w-xs mx-auto">
              <p className="text-[12px] font-black text-ink uppercase italic tracking-tight">
                Biometric Selfie Matching
              </p>
              <p className="text-[9px] font-bold text-mute uppercase tracking-widest leading-relaxed">
                Matches selfie features with your registered Aadhaar identity
                picture. Frame face clearly.
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 py-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto shadow-lg shadow-emerald-500/10 animate-bounce">
              <ShieldCheck size={32} className="fill-emerald-50" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-ink uppercase italic tracking-tight">
                Trust Verification Complete!
              </h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                You have successfully authenticated your profile. A green
                verification badge is now active on your profile info and rides.
              </p>
              <div className="max-w-[180px] mx-auto bg-green-500/10 border border-green-500/20 text-green-600 font-extrabold text-[8px] tracking-[0.2em] py-1.5 rounded-xl uppercase mt-4">
                🔒 Verified Profile Active
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen && !isInline) return null;

  const content = (
    <div className={cn(
      "bg-canvas w-full overflow-hidden relative text-ink",
      isInline ? "p-2" : "p-10 rounded-t-[40px] sm:rounded-3xl shadow-2xl"
    )}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    i === onboardingStep
                      ? "w-8 bg-primary"
                      : i < onboardingStep
                        ? "w-4 bg-ink/20"
                        : "w-4 bg-hairline-soft",
                  )}
                />
              ))}
            </div>
          </div>
          <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">
            Step {onboardingStep}/4
          </p>
          <h4 className="text-xl font-black text-ink uppercase tracking-tighter italic">
            {steps[onboardingStep - 1]}
          </h4>
        </div>
        {!isInline && (
          <button
            onClick={onClose}
            className="w-12 h-12 bg-surface-soft rounded-full flex items-center justify-center text-ink hover:bg-white transition-all shadow-sm cursor-pointer"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="min-h-[200px]">{renderStepContent()}</div>

      <div className="mt-8 flex gap-4">
        {onboardingStep > 1 && onboardingStep < 4 && (
          <button
            onClick={() => setOnboardingStep?.(onboardingStep - 1)}
            className="w-14 h-14 bg-surface-soft text-ink rounded-2xl flex items-center justify-center hover:bg-white transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (onboardingStep === 1) {
              if (!aadhaarVal || aadhaarVal.length < 12) {
                setAadhaarError("Aadhaar number must be exactly 12 digits");
                return;
              }
              setAadhaarError("");
              setOnboardingStep?.(2);
            } else if (onboardingStep === 2) {
              if (codeVal !== "123456") {
                addNotification?.(
                  "Verification code is 123456 for demo onboarding",
                  "info",
                );
              }
              setOnboardingStep?.(3);
            } else if (onboardingStep === 3) {
              onSubmit();
            } else {
              onClose();
            }
          }}
          className="flex-1 h-14 bg-ink text-canvas rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          {onboardingStep === 3
            ? "Sync Biometrics"
            : onboardingStep === 4
              ? "Close Trust Panel"
              : "Proceed Key Secure"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  if (isInline) return content;

  return (
    <div className="absolute inset-0 z-[10002] bg-ink/75 backdrop-blur-md flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 1 }}
        className="bg-canvas w-full max-w-lg rounded-t-[40px] sm:rounded-3xl shadow-2xl p-10 overflow-hidden relative text-ink"
      >
        {content}
      </motion.div>
    </div>
  );
};
