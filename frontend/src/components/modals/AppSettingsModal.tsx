import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useConfig } from "../../lib/ConfigContext";

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: string;
  setAppLanguage: (lang: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  enableCurrentLocationCard: boolean;
  setEnableCurrentLocationCard: (val: boolean) => void;
  userProfile: any;
  setUserProfile: React.Dispatch<React.SetStateAction<any>>;
  addNotification: (msg: string, type?: string) => void;
}

export const AppSettingsModal: React.FC<AppSettingsModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  setAppLanguage,
  soundEnabled,
  setSoundEnabled,
  highContrast,
  setHighContrast,
  enableCurrentLocationCard,
  setEnableCurrentLocationCard,
  userProfile,
  setUserProfile,
  addNotification,
}) => {
  const { config } = useConfig();

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
          <div className="p-6 border-b border-hairline-soft flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase text-secondary tracking-tight">
                App Settings
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-mute cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-mute font-bold uppercase tracking-widest">
                Regional Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["English", "Hindi", "Marathi"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setAppLanguage(lang);
                      addNotification(
                        `Language changed to ${lang}`,
                        "success"
                      );
                    }}
                    className={cn(
                      "py-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer",
                      appLanguage === lang
                        ? "bg-primary text-slate-950 border-primary shadow-sm"
                        : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-mute"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="text-xs font-black text-secondary uppercase tracking-tight">
                    Audio Announcements
                  </h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                    Status voices & sounds
                  </p>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-colors duration-200 outline-none cursor-pointer",
                    soundEnabled
                      ? "bg-primary flex justify-end"
                      : "bg-gray-200 flex justify-start"
                  )}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 bg-secondary rounded-full"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="text-xs font-black text-secondary uppercase tracking-tight">
                    High Contrast Mode
                  </h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                    Optimized view outdoors
                  </p>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-colors duration-200 outline-none cursor-pointer",
                    highContrast
                      ? "bg-primary flex justify-end"
                      : "bg-gray-200 flex justify-start"
                  )}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 bg-secondary rounded-full"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <h4 className="text-xs font-black text-secondary uppercase tracking-tight">
                    Current Location Prompts
                  </h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                    Show location confirm popup
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEnableCurrentLocationCard(!enableCurrentLocationCard)
                  }
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-colors duration-200 outline-none cursor-pointer",
                    enableCurrentLocationCard
                      ? "bg-primary flex justify-end"
                      : "bg-gray-200 flex justify-start"
                  )}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 bg-secondary rounded-full"
                  />
                </button>
              </div>
            </div>

            {/* Profile Customizer & Photo Upload */}
            <div className="space-y-3 pt-2 border-t border-hairline-soft">
              <h4 className="text-[10px] text-mute font-bold uppercase tracking-widest">
                My Account Profile
              </h4>
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-14 h-14 rounded-xl bg-slate-250 border border-slate-300 overflow-hidden flex items-center justify-center shrink-0">
                  {(() => {
                    const riderEntity = config?.vehicles?.find(
                      (v: any) => v.id === "rider" || v.type === "RIDER"
                    );
                    const finalPic = riderEntity?.useCustomImage
                      ? riderEntity.image
                      : userProfile?.avatar ||
                        userProfile?.selfieUrl ||
                        riderEntity?.image;
                    return finalPic ? (
                      <img
                        src={finalPic}
                        alt="Selfie"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-slate-500">
                        {userProfile?.name
                          ? userProfile.name[0]?.toUpperCase()
                          : "U"}
                      </span>
                    );
                  })()}
                </div>
                <div className="flex-1 space-y-1">
                  <label className="inline-block px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-colors shadow-xs">
                    Change Photo / Selfie
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            try {
                              const response = await fetch(
                                "/api/admin/upload",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    filename: file.name,
                                    base64Data: reader.result as string,
                                  }),
                                }
                              );
                              if (response.ok) {
                                const data = await response.json();
                                setUserProfile((prev: any) => ({
                                  ...prev,
                                  avatar: data.url,
                                  selfieUrl: data.url,
                                }));
                                addNotification(
                                  "Profile photograph uploaded and synced successfully!",
                                  "success"
                                );
                              }
                            } catch (err) {
                              console.error(
                                "Failed to upload profile picture:",
                                err
                              );
                              addNotification(
                                "Profile photo upload failed",
                                "info"
                              );
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <p className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">
                    Reflects live immediately
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[8.5px] text-mute font-bold uppercase tracking-widest block pl-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userProfile?.name || ""}
                    onChange={(e) =>
                      setUserProfile((prev: any) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full h-11 bg-slate-50 border border-slate-150 rounded-xl px-3 text-xs font-bold text-secondary outline-none focus:border-primary/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[8.5px] text-mute font-bold uppercase tracking-widest block pl-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userProfile?.email || ""}
                    onChange={(e) =>
                      setUserProfile((prev: any) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full h-11 bg-slate-50 border border-slate-150 rounded-xl px-3 text-xs font-bold text-secondary outline-none focus:border-primary/50"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                addNotification("App preferences saved securely", "success");
                onClose();
              }}
              className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
            >
              Save & Apply Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
