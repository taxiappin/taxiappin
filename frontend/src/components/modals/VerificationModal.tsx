import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  User,
  Car,
  RefreshCw,
  Upload,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  step?: "not-started" | "documents" | "pending" | "verified";
  docs: any;
  onUpload: (type: string, url?: string) => void;
  onSubmit: (details?: any) => void;
  onboardingStep?: number;
  setOnboardingStep?: (s: number) => void;
  status?: string;
  rejectionReason?: string;
  isInline?: boolean;
  userProfile?: any;
  isRiderConvertingToDriver?: boolean;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  docs,
  onUpload,
  onSubmit,
  onboardingStep = 1,
  setOnboardingStep,
  isInline = false,
  userProfile,
  isRiderConvertingToDriver = true,
}) => {
  const [fullName, setFullName] = useState(userProfile?.name || "Srinu K");
  const [workCity, setWorkCity] = useState(userProfile?.city || "Pune");
  const [driverPhone, setDriverPhone] = useState(userProfile?.phone || "+91 98765 43210");
  const [driverEmail, setDriverEmail] = useState(userProfile?.email || "driver@example.com");
  const [driverDob, setDriverDob] = useState(userProfile?.dob || "1995-05-15");
  const [driverGender, setDriverGender] = useState(userProfile?.gender || "Male");
  const [driverBloodGroup, setDriverBloodGroup] = useState(userProfile?.bloodGroup || "O+");

  // Driver Specs State
  const [driverVehicleCategory, setDriverVehicleCategory] = useState(userProfile?.vehicleCategory || "Car");
  const [selectedBrand, setSelectedBrand] = useState(userProfile?.vehicleBrand || "Maruti Suzuki");
  const [selectedModel, setSelectedModel] = useState(userProfile?.vehicleModel || "Swift Dzire");
  const [selectedColor, setSelectedColor] = useState(userProfile?.vehicleColor || "White");
  const [rcPlateNumber, setRcPlateNumber] = useState(userProfile?.plate || "");
  const [vehiclePhotoUrl, setVehiclePhotoUrl] = useState(
    docs?.vehiclePhotoUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80"
  );
  const [dlFrontUrl, setDlFrontUrl] = useState(docs?.licenseUrl || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80");
  const [dlBackUrl, setDlBackUrl] = useState(docs?.licenseBackUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80");
  const [aadhaarFrontUrl, setAadhaarFrontUrl] = useState(docs?.aadhaarUrl || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80");
  const [aadhaarBackUrl, setAadhaarBackUrl] = useState(docs?.aadhaarBackUrl || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80");
  const [selfiePhotoUrl, setSelfiePhotoUrl] = useState(docs?.selfieUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");

  useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setFullName(userProfile.name);
      if (userProfile.city) setWorkCity(userProfile.city);
      if (userProfile.phone) setDriverPhone(userProfile.phone);
      if (userProfile.email) setDriverEmail(userProfile.email);
      if (userProfile.plate) setRcPlateNumber(userProfile.plate);
    }
  }, [userProfile]);

  const isConverting = isRiderConvertingToDriver !== undefined ? isRiderConvertingToDriver : (userProfile?.role === "rider" || !!userProfile?.id || true);
  const totalStepsCount = isConverting ? 5 : 7;

  const isContactStepActive = !isConverting && onboardingStep === 1;
  const isPersonalStepActive = !isConverting && onboardingStep === 2;
  const isVehicleSpecsActive = isConverting ? onboardingStep === 1 : onboardingStep === 3;
  const isLicenseActive = isConverting ? onboardingStep === 2 : onboardingStep === 4;
  const isAadhaarActive = isConverting ? onboardingStep === 3 : onboardingStep === 5;
  const isSelfieActive = isConverting ? onboardingStep === 4 : onboardingStep === 6;
  const isReviewActive = isConverting ? onboardingStep === 5 : onboardingStep === 7;

  if (!isOpen && !isInline) return null;

  const content = (
    <div className={cn(
      "bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 font-sans text-slate-900 w-full overflow-hidden relative",
      isInline ? "p-4 sm:p-6" : "p-6 sm:p-8"
    )}>
      {/* HEADER TOP ROW */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <button
          type="button"
          onClick={() => {
            if (onboardingStep > 1) setOnboardingStep?.(onboardingStep - 1);
            else onClose();
          }}
          className="flex items-center gap-1 text-amber-800 hover:text-amber-950 font-black text-xs uppercase tracking-wider cursor-pointer font-mono transition-colors"
        >
          <ArrowLeft size={16} />
          <span>RETURN</span>
        </button>

        <h2 className="text-xs font-black uppercase font-mono tracking-wider text-slate-900">
          DRIVER REGISTRATION
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-wider underline font-mono cursor-pointer"
        >
          CANCEL
        </button>
      </div>

      {/* NUMBERED PROGRESS BAR */}
      <div className="space-y-3 pt-1 pb-1">
        <div className="relative flex items-center justify-between max-w-md mx-auto px-1">
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 rounded-full z-0" />
          <div 
            className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-amber-400 rounded-full z-0 transition-all duration-300 ease-out"
            style={{ width: `calc(${((Math.min(onboardingStep, totalStepsCount) - 1) / Math.max(1, totalStepsCount - 1)) * 100}% - 1.5rem)` }}
          />

          {Array.from({ length: totalStepsCount }, (_, i) => i + 1).map((stepNum) => {
            const isCompleted = stepNum < onboardingStep;
            const isActive = stepNum === onboardingStep;
            return (
              <div key={stepNum} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (stepNum < onboardingStep) setOnboardingStep?.(stepNum);
                  }}
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center font-black font-mono text-[9px] transition-all duration-200 cursor-pointer shadow-xs",
                    isCompleted
                      ? "bg-emerald-500 text-white font-bold"
                      : isActive
                      ? "bg-amber-400 text-slate-950 font-black ring-2 ring-amber-400/40 scale-110"
                      : "bg-slate-100 border border-slate-300 text-slate-400"
                  )}
                  title={`Step ${stepNum}`}
                >
                  {isCompleted ? "✓" : stepNum}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: CONTACT & ACCOUNT SETUP */}
      {isContactStepActive && (
        <div className="space-y-4 pt-2">
          <div className="space-y-0.5 border-b border-slate-200 pb-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
              DRIVER ACCOUNT & CONTACT DETAILS
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">
              Step 1/7: Primary phone number and email for driver registration.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                MOBILE PHONE NUMBER
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 pl-8 text-xs font-black font-mono text-slate-900 outline-none focus:border-amber-500 shadow-xs"
                />
                <Phone size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={driverEmail}
                  onChange={(e) => setDriverEmail(e.target.value)}
                  placeholder="driver@example.com"
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 pl-8 text-xs font-black font-mono text-slate-900 outline-none focus:border-amber-500 shadow-xs"
                />
                <Mail size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-slate-800 font-mono text-[10px]">
              <span className="font-bold">✓ Contact Verification Active</span>
              <span className="px-2 py-0.5 bg-emerald-500 text-white rounded font-black text-[9px] uppercase">VERIFIED</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PERSONAL DETAILS */}
      {isPersonalStepActive && (
        <div className="space-y-4 pt-2">
          <div className="space-y-0.5 border-b border-slate-200 pb-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
              PERSONAL DETAILS & OPERATING CITY
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">
              Step 2/7: Personal profile info and primary city of operation.
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                FULL NAME
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full legal name"
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 pl-8 text-xs font-black font-mono text-slate-900 outline-none focus:border-amber-500 shadow-xs"
                />
                <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                  DATE OF BIRTH
                </label>
                <input
                  type="date"
                  value={driverDob}
                  onChange={(e) => setDriverDob(e.target.value)}
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-black font-mono text-slate-900 outline-none focus:border-amber-500 shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                  GENDER
                </label>
                <select
                  value={driverGender}
                  onChange={(e) => setDriverGender(e.target.value)}
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-black font-mono text-slate-900 outline-none focus:border-amber-500 shadow-xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                  BLOOD GROUP
                </label>
                <select
                  value={driverBloodGroup}
                  onChange={(e) => setDriverBloodGroup(e.target.value)}
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-black font-mono text-slate-900 outline-none focus:border-amber-500 shadow-xs"
                >
                  <option value="O+">O+</option>
                  <option value="A+">A+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                  <option value="A-">A-</option>
                  <option value="B-">B-</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                  OPERATING CITY
                </label>
                <input
                  type="text"
                  value={workCity}
                  onChange={(e) => setWorkCity(e.target.value)}
                  placeholder="E.g. Pune, Hyderabad, Mumbai"
                  className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-black font-mono text-slate-900 outline-none focus:border-amber-500 shadow-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VEHICLE SPECS */}
      {isVehicleSpecsActive && (
        <div className="space-y-4 pt-2">
          <div className="space-y-0.5 border-b border-slate-200 pb-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
              VEHICLE CATEGORY & SPECS
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">
              {isConverting ? "Step 1/5: Select vehicle category, brand, model & upload exterior photo." : "Step 3/7: Select vehicle category, brand, model & upload exterior photo."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono">
                <span>VEHICLE CATEGORY</span>
                <span className="text-[9px] text-amber-700 font-normal">DYNAMIC ADMIN SYNC ACTIVE</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { cat: "Car", label: "CAR", icon: "🚗" },
                  { cat: "Motorcycle", label: "MOTORCYCLE", icon: "🏍️" },
                  { cat: "Scooter", label: "SCOOTER", icon: "🛵" },
                  { cat: "Micro-Van", label: "MICRO-VAN", icon: "🚐" },
                  { cat: "Auto", label: "AUTO", icon: "🛺" },
                  { cat: "Medical Van", label: "MEDICAL VAN", icon: "🚑" },
                  { cat: "Other", label: "OTHER", icon: "🚚" },
                ].map((item) => (
                  <button
                    key={item.cat}
                    type="button"
                    onClick={() => setDriverVehicleCategory(item.cat)}
                    className={cn(
                      "p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer font-mono",
                      driverVehicleCategory === item.cat
                        ? "bg-amber-400 border-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-400/30"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-[10px] font-black uppercase">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                  VEHICLE BRAND
                </label>
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-black text-slate-900 font-mono outline-none focus:border-amber-500 cursor-pointer appearance-none shadow-xs"
                  >
                    <option value="">Select Brand</option>
                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Tata">Tata</option>
                    <option value="Mahindra">Mahindra</option>
                    <option value="Honda">Honda</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Kia">Kia</option>
                    <option value="Bajaj">Bajaj</option>
                    <option value="TVS">TVS</option>
                    <option value="Hero">Hero</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                  VEHICLE MODEL
                </label>
                <div className="relative">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-black text-slate-900 font-mono outline-none focus:border-amber-500 cursor-pointer appearance-none shadow-xs"
                  >
                    <option value="">Select Model</option>
                    <option value="Swift Dzire">Swift Dzire</option>
                    <option value="Swift">Swift</option>
                    <option value="Creta">Creta</option>
                    <option value="WagonR">WagonR</option>
                    <option value="Baleno">Baleno</option>
                    <option value="Ertiga">Ertiga</option>
                    <option value="Nexon">Nexon</option>
                    <option value="City">City</option>
                    <option value="Auto Rickshaw">Auto Rickshaw</option>
                    <option value="Activa">Activa</option>
                    <option value="Splendor">Splendor</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                  VEHICLE EXTERIOR COLOR
                </label>
                <div className="relative">
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-black text-slate-900 font-mono outline-none focus:border-amber-500 cursor-pointer appearance-none shadow-xs"
                  >
                    <option value="">Select Color</option>
                    <option value="White">Arctic White</option>
                    <option value="Silver">Silver Metallic</option>
                    <option value="Black">Midnight Black</option>
                    <option value="Red">Crimson Red</option>
                    <option value="Blue">Navy Blue</option>
                    <option value="Grey">Grey / Charcoal</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                  NUMBER PLATE
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rcPlateNumber}
                    onChange={(e) => setRcPlateNumber(e.target.value.toUpperCase())}
                    placeholder="E.G. MH12 AB 1234"
                    className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 pl-8 text-xs font-black font-mono text-slate-900 uppercase outline-none focus:border-amber-500 shadow-xs"
                  />
                  <Car size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Vehicle Exterior Photo Upload Zone */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                VEHICLE EXTERIOR PHOTO
              </label>
              <div className="border-2 border-dashed border-amber-300 bg-amber-50/50 rounded-2xl p-4 text-center space-y-2">
                {vehiclePhotoUrl ? (
                  <div className="relative h-32 rounded-xl overflow-hidden border border-slate-300 bg-slate-900 group">
                    <img src={vehiclePhotoUrl} alt="Vehicle Exterior" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="bg-white text-slate-950 font-black px-3 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer shadow-md flex items-center gap-1 font-mono">
                        <RefreshCw size={12} /> REPLACE PHOTO
                        <input type="file" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setVehiclePhotoUrl(reader.result as string);
                              onUpload("vehiclePhotoUrl", reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }} className="hidden" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-4 cursor-pointer gap-2">
                    <Upload size={24} className="text-amber-600" />
                    <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-4 py-2 rounded-xl shadow-xs font-mono">
                      UPLOAD VEHICLE EXTERIOR PHOTO
                    </span>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setVehiclePhotoUrl(reader.result as string);
                          onUpload("vehiclePhotoUrl", reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }} className="hidden" />
                  </label>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const sample = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80";
                    setVehiclePhotoUrl(sample);
                    onUpload("vehiclePhotoUrl", sample);
                  }}
                  className="w-full py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase font-mono border border-slate-200 cursor-pointer"
                >
                  Use Sample Vehicle Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRIVING LICENSE (STEP 2 OF 5 FOR CONVERTING RIDER) */}
      {isLicenseActive && (
        <div className="space-y-4 pt-2">
          <div className="space-y-0.5 border-b border-slate-200 pb-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
              DRIVING LICENSE (DL) VERIFICATION
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">
              {isConverting ? "Step 2/5: Upload front and back photos of your valid driving license." : "Step 4/7: Upload front and back photos of your valid driving license."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 space-y-2 text-center">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider font-mono block">
                DL FRONT PHOTO
              </span>
              {dlFrontUrl ? (
                <div className="relative h-28 rounded-xl overflow-hidden border border-slate-300">
                  <img src={dlFrontUrl} alt="DL Front" className="w-full h-full object-cover" />
                </div>
              ) : (
                <label className="h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer gap-1 bg-white">
                  <Upload size={20} className="text-amber-600" />
                  <span className="bg-amber-400 text-slate-950 font-black text-[9px] uppercase px-3 py-1.5 rounded-lg font-mono">
                    UPLOAD DL FRONT
                  </span>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setDlFrontUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} className="hidden" />
                </label>
              )}
              <button
                type="button"
                onClick={() => setDlFrontUrl("https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80")}
                className="w-full py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase font-mono border border-slate-200 cursor-pointer"
              >
                Use Sample DL Front
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 space-y-2 text-center">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider font-mono block">
                DL BACK PHOTO
              </span>
              {dlBackUrl ? (
                <div className="relative h-28 rounded-xl overflow-hidden border border-slate-300">
                  <img src={dlBackUrl} alt="DL Back" className="w-full h-full object-cover" />
                </div>
              ) : (
                <label className="h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer gap-1 bg-white">
                  <Upload size={20} className="text-amber-600" />
                  <span className="bg-amber-400 text-slate-950 font-black text-[9px] uppercase px-3 py-1.5 rounded-lg font-mono">
                    UPLOAD DL BACK
                  </span>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setDlBackUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} className="hidden" />
                </label>
              )}
              <button
                type="button"
                onClick={() => setDlBackUrl("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80")}
                className="w-full py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase font-mono border border-slate-200 cursor-pointer"
              >
                Use Sample DL Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AADHAAR CARD (STEP 3 OF 5 FOR CONVERTING RIDER) */}
      {isAadhaarActive && (
        <div className="space-y-4 pt-2">
          <div className="space-y-0.5 border-b border-slate-200 pb-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
              AADHAAR GOVT ID CARD
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">
              {isConverting ? "Step 3/5: Upload front and back photos of your Aadhaar card." : "Step 5/7: Upload front and back photos of your Aadhaar card."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 space-y-2 text-center">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider font-mono block">
                AADHAAR FRONT
              </span>
              {aadhaarFrontUrl ? (
                <div className="relative h-28 rounded-xl overflow-hidden border border-slate-300">
                  <img src={aadhaarFrontUrl} alt="Aadhaar Front" className="w-full h-full object-cover" />
                </div>
              ) : (
                <label className="h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer gap-1 bg-white">
                  <Upload size={20} className="text-amber-600" />
                  <span className="bg-amber-400 text-slate-950 font-black text-[9px] uppercase px-3 py-1.5 rounded-lg font-mono">
                    UPLOAD AADHAAR FRONT
                  </span>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setAadhaarFrontUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} className="hidden" />
                </label>
              )}
              <button
                type="button"
                onClick={() => setAadhaarFrontUrl("https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80")}
                className="w-full py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase font-mono border border-slate-200 cursor-pointer"
              >
                Use Sample Aadhaar Front
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 space-y-2 text-center">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider font-mono block">
                AADHAAR BACK
              </span>
              {aadhaarBackUrl ? (
                <div className="relative h-28 rounded-xl overflow-hidden border border-slate-300">
                  <img src={aadhaarBackUrl} alt="Aadhaar Back" className="w-full h-full object-cover" />
                </div>
              ) : (
                <label className="h-28 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer gap-1 bg-white">
                  <Upload size={20} className="text-amber-600" />
                  <span className="bg-amber-400 text-slate-950 font-black text-[9px] uppercase px-3 py-1.5 rounded-lg font-mono">
                    UPLOAD AADHAAR BACK
                  </span>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setAadhaarBackUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} className="hidden" />
                </label>
              )}
              <button
                type="button"
                onClick={() => setAadhaarBackUrl("https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80")}
                className="w-full py-1.5 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black uppercase font-mono border border-slate-200 cursor-pointer"
              >
                Use Sample Aadhaar Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IDENTITY SELFIE (STEP 4 OF 5 FOR CONVERTING RIDER) */}
      {isSelfieActive && (
        <div className="space-y-4 pt-2 text-center">
          <div className="space-y-0.5 border-b border-slate-200 pb-2 text-left">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
              IDENTITY SELFIE CHECK
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">
              {isConverting ? "Step 4/5: Capture clear face portrait selfie." : "Step 6/7: Capture clear face portrait selfie."}
            </p>
          </div>
          <div className="w-36 h-36 rounded-full border-4 border-amber-400 mx-auto overflow-hidden relative shadow-md bg-slate-100">
            <img src={selfiePhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"} className="w-full h-full object-cover" alt="Selfie" />
          </div>
          <p className="text-[10px] font-mono text-slate-600 uppercase font-bold">
            Ensure your face is clearly visible without sunglasses or face coverings.
          </p>
          <button
            type="button"
            onClick={() => setSelfiePhotoUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80")}
            className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl text-[10px] font-black uppercase font-mono border border-slate-200 cursor-pointer"
          >
            Use Sample Selfie Photo
          </button>
        </div>
      )}

      {/* REVIEW & SUBMIT (STEP 5 OF 5 FOR CONVERTING RIDER) */}
      {isReviewActive && (
        <div className="space-y-4 pt-2">
          <div className="space-y-0.5 border-b border-slate-200 pb-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
              REVIEW DRIVER REGISTRATION
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">
              {isConverting ? "Step 5/5: Final review and driver account submission." : "Step 7/7: Final review and driver account submission."}
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs font-mono">
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Applicant Name:</span>
              <span className="font-bold text-slate-900">{fullName || userProfile?.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Contact Details:</span>
              <span className="font-bold text-slate-900">{driverPhone || userProfile?.phone} ✓</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Operating City:</span>
              <span className="font-bold text-slate-900">{workCity || userProfile?.city || "Pune"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Vehicle Category:</span>
              <span className="font-bold text-slate-900">{driverVehicleCategory}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Vehicle Brand/Model:</span>
              <span className="font-bold text-slate-900">{selectedBrand} {selectedModel}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Number Plate:</span>
              <span className="font-bold text-slate-900">{rcPlateNumber || "MH12 AB 1234"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Verification Status:</span>
              <span className="font-bold text-emerald-600">✓ All Documents Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM ACTION BUTTONS */}
      <div className="pt-2 flex gap-3">
        {onboardingStep > 1 && (
          <button
            type="button"
            onClick={() => setOnboardingStep?.(onboardingStep - 1)}
            className="w-11 h-11 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all cursor-pointer shrink-0 font-mono"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (onboardingStep < totalStepsCount) {
              setOnboardingStep?.(onboardingStep + 1);
            } else {
              onSubmit({
                fullName: fullName || userProfile?.name,
                workCity: workCity || userProfile?.city,
                driverPhone: driverPhone || userProfile?.phone,
                driverEmail: driverEmail || userProfile?.email,
                vehicleType: driverVehicleCategory,
                vehicleBrand: selectedBrand,
                vehicleModel: selectedModel,
                vehicleColor: selectedColor,
                vehicleNumber: rcPlateNumber,
                vehiclePhotoUrl,
              });
            }
          }}
          className="flex-1 h-11 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer font-mono flex items-center justify-center gap-2"
        >
          <span>{isReviewActive ? "SUBMIT DRIVER REGISTRATION & VERIFICATION" : "CONTINUE TO NEXT STEP"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  if (isInline) return content;

  return (
    <div className="absolute inset-0 z-[10000] bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center px-4 pb-4">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 1 }}
        className="w-full max-w-lg bg-transparent"
      >
        {content}
      </motion.div>
    </div>
  );
};
