import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface DriverPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverTripPreference: string;
  setDriverTripPreference: (val: string) => void;
  driverPickupRadius: number;
  setDriverPickupRadius: (val: number) => void;
  driverAcOnly: boolean;
  setDriverAcOnly: (val: boolean) => void;
  driverAcceptOnDemand: boolean;
  setDriverAcceptOnDemand: (val: boolean) => void;
  addNotification: (msg: string, type?: string) => void;
}

export const DriverPreferencesModal: React.FC<DriverPreferencesModalProps> = ({
  isOpen,
  onClose,
  driverTripPreference,
  setDriverTripPreference,
  driverPickupRadius,
  setDriverPickupRadius,
  driverAcOnly,
  setDriverAcOnly,
  driverAcceptOnDemand,
  setDriverAcceptOnDemand,
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
                Driver Preferences
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
            <div className="space-y-2">
              <label className="text-[10px] text-mute font-bold uppercase tracking-widest">
                Trip Route Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "all", label: "ALL TRIPS", desc: "No filter" },
                  { id: "short", label: "SHORT (<10KM)", desc: "City rides" },
                  { id: "long", label: "LONG (>10KM)", desc: "High fare" },
                ].map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => setDriverTripPreference(pref.id)}
                    className={cn(
                      "p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer",
                      driverTripPreference === pref.id
                        ? "bg-secondary text-white border-secondary shadow-md"
                        : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-mute"
                    )}
                  >
                    <span className="text-[9.5px] font-black uppercase tracking-tight">
                      {pref.label}
                    </span>
                    <span className="text-[6.5px] font-mono font-bold opacity-75 mt-0.5">
                      {pref.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-secondary uppercase tracking-tight">
                    Pickup Radius Preference
                  </h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                    Filter trips within search radius
                  </p>
                </div>
                <span className="text-[10.5px] font-black text-secondary tracking-tight uppercase font-sans">
                  {driverPickupRadius} KM
                </span>
              </div>
              <div className="pt-1">
                <div className="relative h-6 flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={driverPickupRadius}
                    onChange={(e) =>
                      setDriverPickupRadius(parseInt(e.target.value))
                    }
                    className="w-full h-1 bg-hairline rounded-lg appearance-none cursor-pointer accent-ink outline-none"
                  />
                </div>
                <div className="flex justify-between text-[7.5px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 leading-none">
                  <span>1 KM</span>
                  <span>DEFAULT (10 KM)</span>
                  <span>100 KM</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <h4 className="text-xs font-black text-secondary uppercase tracking-tight">
                  Air Conditioning
                </h4>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                  Enforce premium climate choice
                </p>
              </div>
              <button
                onClick={() => setDriverAcOnly(!driverAcOnly)}
                className={cn(
                  "w-12 h-6 rounded-full p-1 transition-colors duration-200 outline-none cursor-pointer",
                  driverAcOnly
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
                  Receive On-Demand Trips
                </h4>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                  Accept direct calling and booking requests
                </p>
              </div>
              <button
                onClick={() =>
                  setDriverAcceptOnDemand(!driverAcceptOnDemand)
                }
                className={cn(
                  "w-12 h-6 rounded-full p-1 transition-colors duration-200 outline-none cursor-pointer",
                  driverAcceptOnDemand
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

            <button
              onClick={() => {
                addNotification("Preferences updated successfully!", "success");
                onClose();
              }}
              className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg mt-2 cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
