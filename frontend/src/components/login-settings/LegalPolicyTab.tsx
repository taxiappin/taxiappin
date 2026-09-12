import React from "react";
import { FileText, ShieldCheck, Globe, HelpCircle } from "lucide-react";
import { LegalPolicySettings } from "./types";

interface LegalPolicyTabProps {
  policySettings: LegalPolicySettings;
  setPolicySettings: React.Dispatch<React.SetStateAction<LegalPolicySettings>>;
  setToast: (toast: { show: boolean; message: string; type: "success" | "error" | "info" }) => void;
}

export const LegalPolicyTab: React.FC<LegalPolicyTabProps> = ({
  policySettings,
  setPolicySettings,
  setToast
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText size={18} className="text-amber-500" /> Rules, Regulations & Legal Policy Page Links
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure target URL links and labels for Terms of Service, Privacy Policy, Rules & Regulations, and Age Verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Rules & Regulations Link */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-amber-500" /> Rules & Regulations Page
            </h4>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-600 uppercase">Link Title Label</label>
              <input
                type="text"
                value={policySettings.rulesTitle}
                onChange={(e) =>
                  setPolicySettings((prev) => ({ ...prev, rulesTitle: e.target.value }))
                }
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-600 uppercase">URL / Route Path</label>
              <input
                type="text"
                value={policySettings.rulesUrl}
                onChange={(e) =>
                  setPolicySettings((prev) => ({ ...prev, rulesUrl: e.target.value }))
                }
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Terms & Conditions Link */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={16} className="text-amber-500" /> Terms & Conditions Page
            </h4>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-600 uppercase">Link Title Label</label>
              <input
                type="text"
                value={policySettings.termsTitle}
                onChange={(e) =>
                  setPolicySettings((prev) => ({ ...prev, termsTitle: e.target.value }))
                }
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-600 uppercase">URL / Route Path</label>
              <input
                type="text"
                value={policySettings.termsUrl}
                onChange={(e) =>
                  setPolicySettings((prev) => ({ ...prev, termsUrl: e.target.value }))
                }
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Privacy Policy Link */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Globe size={16} className="text-amber-500" /> Privacy Policy Page
            </h4>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-600 uppercase">Link Title Label</label>
              <input
                type="text"
                value={policySettings.privacyTitle}
                onChange={(e) =>
                  setPolicySettings((prev) => ({ ...prev, privacyTitle: e.target.value }))
                }
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-600 uppercase">URL / Route Path</label>
              <input
                type="text"
                value={policySettings.privacyUrl}
                onChange={(e) =>
                  setPolicySettings((prev) => ({ ...prev, privacyUrl: e.target.value }))
                }
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Minimum Age Policy */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle size={16} className="text-amber-500" /> Minimum Age Requirement
            </h4>
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-600 uppercase">Minimum Allowed Age (Years)</label>
              <input
                type="number"
                value={policySettings.minAgeRequired}
                onChange={(e) =>
                  setPolicySettings((prev) => ({ ...prev, minAgeRequired: Number(e.target.value) }))
                }
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium pt-1">
              Enforced on Rider and Driver DOB field validation during Step 2 onboarding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
