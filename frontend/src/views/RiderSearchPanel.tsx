import React from "react";
import { motion } from "motion/react";
import {
  Search,
  MapPin,
  Navigation,
  Clock,
  Car,
  Bike,
  Users,
  ChevronRight,
  Shield,
  Sparkles,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Location, RideOption } from "../types";

interface RiderSearchPanelProps {
  pickup: Location | null;
  dropoff: Location | null;
  onSelectPickup: (loc: Location) => void;
  onSelectDropoff: (loc: Location) => void;
  onOpenSearchModal: (mode: "pickup" | "dropoff") => void;
  selectedVehicleType: string;
  onSelectVehicleType: (vType: string) => void;
  rideOptions?: RideOption[];
  onConfirmBooking?: (ride: RideOption) => void;
  isSearchingRoutes?: boolean;
  distanceKm?: number;
  durationMins?: number;
}

export const RiderSearchPanel: React.FC<RiderSearchPanelProps> = ({
  pickup,
  dropoff,
  onOpenSearchModal,
  selectedVehicleType,
  onSelectVehicleType,
  rideOptions = [],
  onConfirmBooking,
  isSearchingRoutes = false,
  distanceKm,
  durationMins,
}) => {
  const vehicleCategories = [
    { id: "all", label: "ALL", icon: "✨" },
    { id: "car", label: "CAR", icon: "🚗" },
    { id: "auto", label: "AUTO", icon: "🛺" },
    { id: "bike", label: "BIKE", icon: "🏍️" },
    { id: "pool", label: "CARPOOL", icon: "👥" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 space-y-4 font-sans">
      {/* Pickup & Dropoff Inputs */}
      <div className="space-y-2">
        {/* Pickup */}
        <div
          onClick={() => onOpenSearchModal("pickup")}
          className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <MapPin size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase text-slate-400 font-mono leading-none">
              PICKUP POINT
            </p>
            <p className="text-xs font-bold text-slate-800 truncate mt-1">
              {pickup?.name || pickup?.address || "Select your pickup location"}
            </p>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </div>

        {/* Dropoff */}
        <div
          onClick={() => onOpenSearchModal("dropoff")}
          className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shrink-0">
            <Navigation size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase text-slate-400 font-mono leading-none">
              WHERE TO?
            </p>
            <p className="text-xs font-bold text-slate-800 truncate mt-1">
              {dropoff?.name || dropoff?.address || "Enter destination location"}
            </p>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </div>
      </div>

      {/* Vehicle Category Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-black font-mono text-slate-500 uppercase">
          <span>SELECT RIDE TYPE</span>
          {distanceKm && (
            <span className="text-amber-600 font-bold">
              {distanceKm} KM • ~{durationMins || 25} MINS
            </span>
          )}
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {vehicleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectVehicleType(cat.id)}
              className={cn(
                "py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer font-mono",
                selectedVehicleType.toLowerCase() === cat.id
                  ? "bg-amber-400 border-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-400/30"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              )}
            >
              <span className="text-base leading-none">{cat.icon}</span>
              <span className="text-[9px] font-bold uppercase">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Ride Options or Search Callout */}
      {isSearchingRoutes && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-xs font-mono text-amber-800">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Calculating accurate route fares and live driver availability...</span>
        </div>
      )}
    </div>
  );
};
