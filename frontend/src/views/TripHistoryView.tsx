import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  Filter,
  IndianRupee,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Trip, AppMode } from "../types";

interface TripHistoryViewProps {
  trips: Trip[];
  appMode: AppMode;
  onSelectTrip: (trip: Trip) => void;
  onCancelTrip?: (tripId: string) => void;
  onOpenDateFilter?: () => void;
  selectedDateFilter?: string;
}

export const TripHistoryView: React.FC<TripHistoryViewProps> = ({
  trips,
  appMode,
  onSelectTrip,
  onCancelTrip,
  onOpenDateFilter,
  selectedDateFilter,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"all" | "active" | "completed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrips = trips.filter((trip) => {
    // Sub-tab filter
    if (activeSubTab === "active" && trip.status !== "active" && trip.status !== "accepted") return false;
    if (activeSubTab === "completed" && trip.status !== "completed") return false;
    if (activeSubTab === "cancelled" && trip.status !== "cancelled" && trip.status !== "rejected") return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchFrom = trip.from?.toLowerCase().includes(q);
      const matchTo = trip.to?.toLowerCase().includes(q);
      const matchDriver = trip.driverName?.toLowerCase().includes(q);
      const matchRider = trip.user?.toLowerCase().includes(q);
      if (!matchFrom && !matchTo && !matchDriver && !matchRider) return false;
    }

    return true;
  });

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 size={12} />
            Completed
          </span>
        );
      case "active":
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200 animate-pulse">
            <Clock size={12} />
            Active
          </span>
        );
      case "cancelled":
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
            <XCircle size={12} />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
            <Clock size={12} />
            {status || "Scheduled"}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
      {/* Header & Controls */}
      <div className="bg-white border-b border-slate-200 p-4 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-tight font-mono">
              {appMode === "driver" ? "Driver Ride History" : "Rider Activity & Trips"}
            </h2>
            <p className="text-[11px] text-slate-500 font-mono">
              {filteredTrips.length} total recorded rides
            </p>
          </div>

          {onOpenDateFilter && (
            <button
              onClick={onOpenDateFilter}
              className={cn(
                "px-3 py-1.5 rounded-xl border text-[11px] font-black font-mono uppercase flex items-center gap-1.5 transition-all cursor-pointer",
                selectedDateFilter
                  ? "bg-amber-400 text-slate-950 border-amber-500 shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              )}
            >
              <Calendar size={13} />
              <span>{selectedDateFilter || "Filter Date"}</span>
            </button>
          )}
        </div>

        {/* Filter Sub-Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {(["all", "active", "completed", "cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-black font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                activeSubTab === tab
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {tab === "all" ? "All Trips" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Trips List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 mx-auto shadow-xs">
              <Car size={24} />
            </div>
            <h3 className="text-xs font-black uppercase font-mono text-slate-700">
              No Rides Found
            </h3>
            <p className="text-[11px] text-slate-400 font-mono max-w-xs mx-auto">
              No trip records match the current status and date filters.
            </p>
          </div>
        ) : (
          filteredTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => onSelectTrip(trip)}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 space-y-3 transition-all shadow-3xs hover:shadow-xs cursor-pointer"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 font-mono">
                    {trip.time || "12:00"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    {trip.date || "Today"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(trip.status)}
                  <span className="text-xs font-black text-slate-900 font-mono">
                    ₹{trip.price || 150}
                  </span>
                </div>
              </div>

              {/* Route Endpoints */}
              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-800 truncate">
                      {trip.from || "Origin Location"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-slate-900 mt-1 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-800 truncate">
                      {trip.to || "Destination Location"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Companion / Driver & Details Row */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                <span className="truncate max-w-[180px]">
                  {appMode === "driver"
                    ? `Rider: ${trip.user || "Passenger"}`
                    : `Driver: ${trip.driverName || "Driver Partner"}`}
                </span>
                <span className="flex items-center gap-1 font-bold text-slate-700">
                  <span>View Details</span>
                  <ChevronRight size={13} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
