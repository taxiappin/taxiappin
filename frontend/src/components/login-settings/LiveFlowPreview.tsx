import React, { useState } from "react";
import {
  Smartphone,
  Mail,
  User,
  Car,
  ChevronDown,
  Lock,
  ArrowRight,
  Upload,
  CheckCircle2,
  FileText,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  Eye,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import {
  CountryItem,
  RiderFieldItem,
  DriverStepItem,
  DriverFieldItem,
  VehicleBrandItem,
  SampleDocumentItem,
  LegalPolicySettings
} from "./types";

interface LiveFlowPreviewProps {
  previewFlow: "login" | "rider" | "driver" | "reset";
  setPreviewFlow: (flow: "login" | "rider" | "driver" | "reset") => void;
  previewRiderStep: number;
  setPreviewRiderStep: (step: number) => void;
  previewDriverStep: number;
  setPreviewDriverStep: (step: number) => void;
  promoTickerText: string;
  logoText: string;
  logoUrl: string;
  loginTitle: string;
  loginSubtext: string;
  bookRightsText: string;
  quickDemoEnabled: boolean;
  quickDemoRiderEmail: string;
  quickDemoRiderPhone: string;
  quickDemoDriverEmail: string;
  quickDemoDriverPhone: string;
  countries: CountryItem[];
  riderFields: Record<string, RiderFieldItem>;
  driverSteps: Record<string, DriverStepItem>;
  driverFields: Record<string, DriverFieldItem>;
  vehicleBrands: VehicleBrandItem[];
  sampleDocuments: SampleDocumentItem[];
  policySettings?: LegalPolicySettings;
  onSelectSection?: (targetTab: "branding" | "rider" | "driver", step?: number) => void;
}

export const LiveFlowPreview: React.FC<LiveFlowPreviewProps> = ({
  previewFlow,
  setPreviewFlow,
  previewRiderStep,
  setPreviewRiderStep,
  previewDriverStep,
  setPreviewDriverStep,
  promoTickerText,
  logoText,
  logoUrl,
  loginTitle,
  loginSubtext,
  bookRightsText,
  quickDemoEnabled,
  quickDemoRiderEmail,
  quickDemoRiderPhone,
  quickDemoDriverEmail,
  quickDemoDriverPhone,
  countries,
  riderFields,
  driverSteps,
  driverFields,
  vehicleBrands,
  sampleDocuments,
  policySettings,
  onSelectSection
}) => {
  const [previewLoginTab, setPreviewLoginTab] = useState<"mobile" | "email">("mobile");
  const [demoSelectedRole, setDemoSelectedRole] = useState<"rider" | "driver" | "dual" | null>(null);

  const activeCountries = countries.filter((c) => c.active);

  const handleQuickDemoFill = (role: "rider" | "driver" | "dual") => {
    setDemoSelectedRole(role);
    if (role === "rider") {
      setPreviewLoginTab("mobile");
    } else if (role === "driver") {
      setPreviewLoginTab("mobile");
    }
  };

  return (
    <div className="bg-white text-slate-900 rounded-3xl border border-slate-200/90 p-4 shadow-sm flex flex-col space-y-3 sticky top-6">
      {/* CANVAS HEADER & FLOW NAVIGATION TABS */}
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-Time Live Canvas Preview
          </span>
          <span className="text-[10px] font-mono text-slate-400">Interactive Mobile Frame</span>
        </div>

        {/* FLOW SWITCHER BUTTONS */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setPreviewFlow("login")}
            className={`py-1.5 rounded-xl transition-all cursor-pointer ${
              previewFlow === "login" ? "bg-amber-400 text-slate-950 shadow-xs border border-amber-500" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setPreviewFlow("rider")}
            className={`py-1.5 rounded-xl transition-all cursor-pointer ${
              previewFlow === "rider" ? "bg-amber-400 text-slate-950 shadow-xs border border-amber-500" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Rider (3)
          </button>
          <button
            type="button"
            onClick={() => setPreviewFlow("driver")}
            className={`py-1.5 rounded-xl transition-all cursor-pointer ${
              previewFlow === "driver" ? "bg-amber-400 text-slate-950 shadow-xs border border-amber-500" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Driver (7)
          </button>
          <button
            type="button"
            onClick={() => setPreviewFlow("reset")}
            className={`py-1.5 rounded-xl transition-all cursor-pointer ${
              previewFlow === "reset" ? "bg-amber-400 text-slate-950 shadow-xs border border-amber-500" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Reset
          </button>
        </div>
      </div>

      {/* MOBILE DEVICE SIMULATION CANVAS */}
      <div className="bg-[#FAFBFD] rounded-2xl border border-slate-300 overflow-hidden shadow-inner font-sans text-slate-900 max-h-[740px] overflow-y-auto">
        {/* VIEW 1: LOGIN PAGE */}
        {previewFlow === "login" && (
          <div className="p-4 sm:p-5 space-y-4">
            {/* LOGO & APP BRAND HEADER */}
            <div className="text-center pt-2 space-y-1">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain mx-auto rounded-full bg-amber-400 p-1 shadow-sm" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center mx-auto shadow-sm text-xl border border-amber-500/50">
                  <Car size={24} />
                </div>
              )}
              <h3 className="text-xl font-black text-slate-900 tracking-wider uppercase font-mono mt-1.5">
                {logoText || "TAXIAAPP"}
              </h3>
            </div>

            {/* LOGIN CARD */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
              <div>
                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">{loginTitle || "Login"}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {loginSubtext || "Book rides, plan trips, or drive — all in one account"}
                </p>
              </div>

              {/* WITH MOBILE vs WITH EMAIL SWITCHER PILLS */}
              <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200/80 flex gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewLoginTab("mobile")}
                  className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    previewLoginTab === "mobile"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Smartphone size={13} />
                  <span>WITH MOBILE</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLoginTab("email")}
                  className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    previewLoginTab === "email"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Mail size={13} />
                  <span>WITH EMAIL</span>
                </button>
              </div>

              {/* INPUT FIELDS */}
              {previewLoginTab === "mobile" ? (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest block">
                    MOBILE NUMBER
                  </label>
                  <div className="flex gap-2">
                    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer">
                      <span>{activeCountries[0]?.flag || "🇮🇳"}</span>
                      <span>{activeCountries[0]?.code || "+91"}</span>
                      <ChevronDown size={12} className="text-slate-400" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 flex-1 flex items-center gap-2 shadow-2xs">
                      <Smartphone size={14} className="text-slate-400 shrink-0" />
                      <span>
                        {demoSelectedRole === "driver"
                          ? quickDemoDriverPhone
                          : quickDemoRiderPhone || "9988776655"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest block">
                    EMAIL ADDRESS
                  </label>
                  <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 w-full flex items-center gap-2 shadow-2xs">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span>
                      {demoSelectedRole === "driver"
                        ? quickDemoDriverEmail
                        : quickDemoRiderEmail || "rider@taxiapp.com"}
                    </span>
                  </div>
                </div>
              )}

              {/* PASSWORD FIELD */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest">
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => setPreviewFlow("reset")}
                    className="text-[10px] font-mono font-extrabold text-amber-600 uppercase hover:underline cursor-pointer"
                  >
                    FORGOT?
                  </button>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-slate-400 shrink-0" />
                    <span className="font-bold tracking-widest">••••••••</span>
                  </div>
                  <Eye size={14} className="text-slate-400 cursor-pointer" />
                </div>
              </div>

              {/* QUICK DEMO FILL BUTTONS */}
              {quickDemoEnabled && (
                <div className="pt-1">
                  <label className="text-[10px] font-mono font-extrabold text-slate-600 uppercase tracking-wider block mb-1">
                    QUICK DEMO FILL:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoFill("rider")}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        demoSelectedRole === "rider"
                          ? "bg-amber-400 text-slate-950 font-black border border-amber-500"
                          : "bg-slate-100 hover:bg-amber-100 text-slate-800 border border-slate-200"
                      }`}
                    >
                      Rider
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoFill("driver")}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        demoSelectedRole === "driver"
                          ? "bg-amber-400 text-slate-950 font-black border border-amber-500"
                          : "bg-slate-100 hover:bg-amber-100 text-slate-800 border border-slate-200"
                      }`}
                    >
                      Driver
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoFill("dual")}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        demoSelectedRole === "dual"
                          ? "bg-amber-400 text-slate-950 font-black border border-amber-500"
                          : "bg-slate-100 hover:bg-amber-100 text-slate-800 border border-slate-200"
                      }`}
                    >
                      Dual-Role
                    </button>
                  </div>
                </div>
              )}

              {/* LOG IN BUTTON */}
              <button
                type="button"
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-500/50 cursor-pointer mt-1"
              >
                <span>LOG IN</span>
                <ArrowRight size={15} />
              </button>

              {/* SIGN UP OPTIONS */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase tracking-widest text-center block">
                  DON'T HAVE AN ACCOUNT?
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewFlow("rider")}
                    className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <User size={13} className="text-amber-500" />
                    <span>SIGN UP AS RIDER</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewFlow("driver")}
                    className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-extrabold text-[10px] uppercase tracking-wider rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Car size={13} className="text-amber-500" />
                    <span>SIGN UP AS DRIVER</span>
                  </button>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="text-center pt-1">
              <span className="text-[10px] font-mono text-slate-400 block">
                {bookRightsText || "© 2026 TaxiApp Inc. All rights reserved. Book rights reserved."}
              </span>
            </div>
          </div>
        )}

        {/* VIEW 2: RIDER REGISTRATION (3 STEPS) */}
        {previewFlow === "rider" && (
          <div className="space-y-0">
            {/* TOP NAVIGATION BAR */}
            <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPreviewFlow("login")}
                className="text-xs font-mono font-extrabold text-slate-700 hover:text-slate-900 cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={14} /> RETURN
              </button>
              <span className="font-black text-slate-900 text-xs tracking-wider uppercase font-mono">
                RIDER REGISTRATION
              </span>
              <button
                type="button"
                onClick={() => setPreviewFlow("login")}
                className="text-xs font-mono font-extrabold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                CANCEL
              </button>
            </div>

            {/* STEP PROGRESS BAR */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-center gap-3">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <button
                    type="button"
                    onClick={() => setPreviewRiderStep(stepNum)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs cursor-pointer transition-all ${
                      previewRiderStep === stepNum
                        ? "bg-amber-400 text-slate-950 ring-2 ring-amber-500 shadow-xs"
                        : previewRiderStep > stepNum
                        ? "bg-slate-900 text-amber-400"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {stepNum}
                  </button>
                  {stepNum < 3 && <div className="h-0.5 w-8 bg-slate-300"></div>}
                </React.Fragment>
              ))}
            </div>

            {/* CARD BODY */}
            <div className="p-4 bg-white space-y-4">
              <h4 className="font-extrabold text-slate-900 uppercase text-xs tracking-wider font-mono border-b border-slate-200 pb-2">
                {previewRiderStep === 1
                  ? "VERIFY PHONE & EMAIL"
                  : previewRiderStep === 2
                  ? "PERSONAL DETAILS & CITY"
                  : "REVIEW & ACTIVATE ACCOUNT"}
              </h4>

              {/* STEP 1 */}
              {previewRiderStep === 1 && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest block">
                      MOBILE NUMBER
                    </label>
                    <div className="flex gap-2">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-900 flex items-center gap-1 shrink-0">
                        <span>{activeCountries[0]?.flag || "🇮🇳"}</span>
                        <span>{activeCountries[0]?.code || "+91"}</span>
                        <ChevronDown size={12} />
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 flex-1 flex items-center justify-between">
                        <span>10-digit mobile number</span>
                        <span className="px-2 py-0.5 bg-slate-900 text-white font-mono font-extrabold text-[9px] rounded uppercase tracking-wider">
                          VERIFY
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest block">
                      EMAIL ADDRESS
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-500 flex items-center gap-2">
                      <Mail size={14} />
                      <span>Email address</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest block">
                        ACCOUNT PASSWORD
                      </label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-500 flex items-center justify-between">
                        <span>Create password</span>
                        <Eye size={12} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest block">
                        RE-ENTER PASSWORD
                      </label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-500 flex items-center justify-between">
                        <span>Confirm password</span>
                        <Eye size={12} />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="text-[11px] font-bold text-slate-800 flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" aria-label="Option selection" defaultChecked className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" />
                      <span>Subscribe to promotional offers & updates</span>
                    </label>
                    <label className="text-[11px] font-bold text-slate-800 flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" aria-label="Option selection" defaultChecked className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" />
                      <span>I agree to Rules, Terms & Privacy Policy</span>
                    </label>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                    By continuing, you confirm that you are {policySettings?.minAgeRequired || 18} years of age and agree to the{" "}
                    <span className="text-amber-600 underline font-bold cursor-pointer">
                      {policySettings?.termsTitle || "Terms & Conditions"}
                    </span>{" "}
                    and{" "}
                    <span className="text-amber-600 underline font-bold cursor-pointer">
                      {policySettings?.privacyTitle || "Privacy Policy"}
                    </span>
                    .
                  </p>

                  <button
                    type="button"
                    onClick={() => setPreviewRiderStep(2)}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-500/50 cursor-pointer"
                  >
                    <span>NEXT STEP</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {previewRiderStep === 2 && (
                <div className="space-y-3">
                  {Object.entries(riderFields)
                    .filter(([_, f]) => f.enabled && (f.stepId || 2) === 2)
                    .map(([k, field]) => (
                      <div key={k} className="space-y-1">
                        <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1">
                          <span>{field.label}</span>
                          {field.mandatory && <span className="text-rose-600">*</span>}
                        </label>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800">
                          {field.helper || `Enter ${field.label}`}
                        </div>
                      </div>
                    ))}

                  <button
                    type="button"
                    onClick={() => setPreviewRiderStep(3)}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-500/50 cursor-pointer mt-2"
                  >
                    <span>NEXT STEP</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {/* STEP 3 */}
              {previewRiderStep === 3 && (
                <div className="space-y-3 text-center">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
                    <h5 className="text-xs font-black text-emerald-950 uppercase">Account Profile Verified</h5>
                    <p className="text-xs text-emerald-800 font-medium">
                      All required rider fields verified. Click below to activate account and start booking rides!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewFlow("login")}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-500/50 cursor-pointer"
                  >
                    <span>COMPLETE RIDER REGISTRATION</span>
                    <Check size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: DRIVER REGISTRATION (7 STEPS) */}
        {previewFlow === "driver" && (
          <div className="space-y-0">
            {/* TOP NAVIGATION BAR */}
            <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPreviewFlow("login")}
                className="text-xs font-mono font-extrabold text-slate-700 hover:text-slate-900 cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={14} /> RETURN
              </button>
              <span className="font-black text-slate-900 text-xs tracking-wider uppercase font-mono">
                DRIVER REGISTRATION
              </span>
              <button
                type="button"
                onClick={() => setPreviewFlow("login")}
                className="text-xs font-mono font-extrabold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                CANCEL
              </button>
            </div>

            {/* 7-STEP PROGRESS BAR */}
            <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-1 overflow-x-auto">
              {[1, 2, 3, 4, 5, 6, 7].map((stepNum) => (
                <button
                  key={stepNum}
                  type="button"
                  onClick={() => setPreviewDriverStep(stepNum)}
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] cursor-pointer transition-all shrink-0 ${
                    previewDriverStep === stepNum
                      ? "bg-amber-400 text-slate-950 ring-2 ring-amber-500 shadow-xs"
                      : previewDriverStep > stepNum
                      ? "bg-slate-900 text-amber-400"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {stepNum}
                </button>
              ))}
            </div>

            {/* CARD BODY */}
            <div className="p-4 bg-white space-y-4">
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 space-y-0.5">
                <h5 className="text-xs font-black text-amber-950 uppercase">
                  Step {previewDriverStep}: {driverSteps[previewDriverStep]?.label || `Step ${previewDriverStep}`}
                </h5>
                <p className="text-[11px] text-amber-800 font-medium">
                  {driverSteps[previewDriverStep]?.description || "Driver requirement onboarding step"}
                </p>
              </div>

              {/* STEP 1: Phone & Email */}
              {previewDriverStep === 1 && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest block">
                      MOBILE NUMBER
                    </label>
                    <div className="flex gap-2">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-900 flex items-center gap-1 shrink-0">
                        <span>{activeCountries[0]?.flag || "🇮🇳"}</span>
                        <span>{activeCountries[0]?.code || "+91"}</span>
                        <ChevronDown size={12} />
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 flex-1 flex items-center justify-between">
                        <span>Driver mobile number</span>
                        <span className="px-2 py-0.5 bg-slate-900 text-white font-mono font-extrabold text-[9px] rounded uppercase tracking-wider">
                          VERIFY
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest block">
                      EMAIL ADDRESS
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-500 flex items-center gap-2">
                      <Mail size={14} />
                      <span>Driver email address</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest block">
                        ACCOUNT PASSWORD
                      </label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-500 flex items-center justify-between">
                        <span>Create password</span>
                        <Eye size={12} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest block">
                        RE-ENTER PASSWORD
                      </label>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-500 flex items-center justify-between">
                        <span>Confirm password</span>
                        <Eye size={12} />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="text-[11px] font-bold text-slate-800 flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" aria-label="Option selection" defaultChecked className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" />
                      <span>Subscribe to driver partner bonuses & updates</span>
                    </label>
                    <label className="text-[11px] font-bold text-slate-800 flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" aria-label="Option selection" defaultChecked className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" />
                      <span>I agree to Rules, Terms & Commercial Policy</span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewDriverStep(2)}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-500/50 cursor-pointer"
                  >
                    <span>NEXT STEP</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {/* STEPS 2 to 7 */}
              {previewDriverStep > 1 && (
                <div className="space-y-3">
                  {Object.entries(driverFields)
                    .filter(([_, f]) => f.enabled && f.stepId === previewDriverStep)
                    .map(([k, field]) => (
                      <div key={k} className="space-y-1">
                        <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1">
                          <span>{field.label}</span>
                          {field.mandatory && <span className="text-rose-600">*</span>}
                        </label>

                        {field.type === "file" ? (
                          <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-1 cursor-pointer hover:bg-slate-100">
                            <Upload size={18} className="mx-auto text-amber-500" />
                            <span className="text-[10px] font-bold text-slate-600 block">
                              Click to upload {field.label}
                            </span>
                          </div>
                        ) : (
                          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800">
                            {field.helper || `Enter ${field.label}`}
                          </div>
                        )}
                      </div>
                    ))}

                  {/* Sample Reference Doc Guide with Front and Back side previews */}
                  {sampleDocuments.length > 0 && previewDriverStep >= 4 && (
                    <div className="p-3 bg-amber-50/90 rounded-2xl space-y-2 border border-amber-200/90 shadow-2xs">
                      <span className="text-[10px] font-mono font-extrabold text-amber-950 uppercase flex items-center gap-1">
                        📷 Real-Time Sample Reference (Front & Back Sides)
                      </span>
                      <p className="text-[10px] text-amber-900/80 font-medium">
                        Required document photo samples configured in admin:
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {sampleDocuments.map((doc) => {
                          const front = doc.frontSampleUrl || doc.sampleUrl;
                          const back = doc.backSampleUrl || doc.sampleUrl;
                          return (
                            <div key={doc.id} className="p-2 bg-white rounded-xl border border-slate-200 space-y-1.5">
                              <span className="text-[10px] font-black uppercase text-slate-900 block border-b border-slate-100 pb-1">
                                {doc.title}
                              </span>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Front Side</span>
                                  <div className="h-14 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative flex items-center justify-center">
                                    {front ? (
                                      <img src={front} alt={`${doc.title} Front`} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-[8px] font-bold text-slate-400">No Front Image</span>
                                    )}
                                    <span className="absolute bottom-0.5 left-0.5 bg-slate-950/80 text-amber-400 text-[7px] font-mono font-bold px-1 rounded">
                                      FRONT
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-0.5">
                                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block">Back Side</span>
                                  <div className="h-14 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative flex items-center justify-center">
                                    {back ? (
                                      <img src={back} alt={`${doc.title} Back`} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-[8px] font-bold text-slate-400">No Back Image</span>
                                    )}
                                    <span className="absolute bottom-0.5 left-0.5 bg-slate-950/80 text-amber-400 text-[7px] font-mono font-bold px-1 rounded">
                                      BACK
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (previewDriverStep < 7) {
                        setPreviewDriverStep(previewDriverStep + 1);
                      } else {
                        setPreviewFlow("login");
                      }
                    }}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-500/50 cursor-pointer mt-2"
                  >
                    <span>
                      {previewDriverStep === 7 ? "COMPLETE DRIVER REGISTRATION" : "NEXT STEP"}
                    </span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: RESET PASSWORD */}
        {previewFlow === "reset" && (
          <div className="p-4 sm:p-5 space-y-4">
            {/* LOGO */}
            <div className="text-center pt-2 space-y-1">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center mx-auto shadow-sm text-xl border border-amber-500/50">
                <Car size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-wider uppercase font-mono mt-1.5">
                {logoText || "TAXIAAPP"}
              </h3>
            </div>

            {/* RESET CARD */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Lock size={20} />
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-slate-900 tracking-tight">Reset your password</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                  Enter your registered mobile number with country code and we'll send you a 6-digit OTP code.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-extrabold text-slate-800 uppercase tracking-widest block">
                  MOBILE NUMBER
                </label>
                <div className="flex gap-2">
                  <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer">
                    <span>{activeCountries[0]?.flag || "🇮🇳"}</span>
                    <span>{activeCountries[0]?.code || "+91"}</span>
                    <ChevronDown size={12} className="text-slate-400" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 flex-1 flex items-center gap-2 shadow-2xs">
                    <Smartphone size={14} className="text-slate-400 shrink-0" />
                    <span>9988776655</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-amber-500/50 cursor-pointer"
              >
                <span>Send OTP Code</span>
                <ArrowRight size={15} />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewFlow("login")}
                  className="text-xs font-mono font-extrabold text-slate-600 hover:text-slate-900 uppercase cursor-pointer"
                >
                  ← Back to login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
