import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getDriverVehicleProfileImage } from "../../lib/mapHelpers";

interface VehicleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  setUserProfile: React.Dispatch<React.SetStateAction<any>>;
  addNotification: (msg: string, type?: string) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  setUserProfile,
  addNotification,
}) => {
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
                Update Vehicle Details
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-mute cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-mute font-bold uppercase tracking-widest ml-1">
                Vehicle Make / Model
              </label>
              <input
                type="text"
                value={userProfile?.vehicle || "Maruti Swift"}
                onChange={(e) =>
                  setUserProfile((prev: any) => ({
                    ...prev,
                    vehicle: e.target.value,
                  }))
                }
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-bold text-secondary outline-none focus:border-primary/50 transition-all uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-mute font-bold uppercase tracking-widest ml-1">
                License Plate Number
              </label>
              <input
                type="text"
                value={userProfile?.plate || "MH12 AB 1234"}
                onChange={(e) =>
                  setUserProfile((prev: any) => ({
                    ...prev,
                    plate: e.target.value,
                  }))
                }
                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-5 text-sm font-mono font-bold text-secondary outline-none focus:border-primary/50 transition-all uppercase"
              />
            </div>

            <div className="space-y-1.5 font-sans">
              <label className="text-[10px] text-mute font-bold uppercase tracking-widest ml-1">
                Vehicle Image / Photo
              </label>
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="w-14 h-14 rounded-xl bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={getDriverVehicleProfileImage(userProfile)}
                    alt="Vehicle"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="inline-block px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-colors shadow-xs">
                    Upload Vehicle Photo
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
                                  vehicleImage: data.url,
                                }));
                                addNotification(
                                  "Vehicle image uploaded and synced successfully!",
                                  "success"
                                );
                              }
                            } catch (err) {
                              console.error(
                                "Failed to upload vehicle picture:",
                                err
                              );
                              addNotification(
                                "Vehicle image upload failed",
                                "info"
                              );
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                    Reflects live immediately
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                addNotification(
                  "Vehicle specifications updated successfully!",
                  "success"
                );
                onClose();
              }}
              className="w-full h-16 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-black/10 mt-2 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
