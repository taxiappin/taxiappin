import React from "react";
import { motion } from "motion/react";
import {
  Car,
  MapPin,
  Navigation,
  Clock,
  IndianRupee,
  ShieldCheck,
  Check,
  X,
  Zap,
  TrendingUp,
  User,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Trip } from "../types";

interface DriverFeedPanelProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingRequests: Trip[];
  onAcceptRequest: (trip: Trip) => void;
  onDeclineRequest: (tripId: string) => void;
  todayEarnings?: number;
  completedRidesCount?: number;
  driverRating?: number;
}

export const DriverFeedPanel: React.FC<DriverFeedPanelProps> = ({
  isOnline,
  onToggleOnline,
  pendingRequests,
  onAcceptRequest,
  onDeclineRequest,
  todayEarnings = 1250,
  completedRidesCount = 6,
  driverRating = 4.9,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 space-y-4 font-sans text-slate-900">
      {/* Online / Offline Toggle Header */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              isOnline ? "bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" : "bg-slate-400"
            )}
          />
          <div>
            <p className="text-xs font-black font-mono uppercase tracking-tight">
              {isOnline ? "YOU ARE ONLINE" : "YOU ARE OFFLINE"}
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              {isOnline ? "Receiving nearby ride dispatch requests" : "Switch online to receive passenger requests"}
            </p>
          </div>
        </div>

        <button
          onClick={onToggleOnline}
          className={cn(
            "px-4 py-2 rounded-xl font-black font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs",
            isOnline
              ? "bg-rose-500 hover:bg-rose-600 text-white"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          )}
        >
          {isOnline ? "GO OFFLINE" : "GO ONLINE"}
        </button>
      </div>

      {/* Driver Daily Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-2xl text-center font-mono">
          <p className="text-[9px] font-black uppercase text-amber-800">TODAY</p>
          <p className="text-base font-black text-slate-900 mt-0.5">₹{todayEarnings}</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center font-mono">
          <p className="text-[9px] font-black uppercase text-slate-500">RIDES</p>
          <p className="text-base font-black text-slate-900 mt-0.5">{completedRidesCount}</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center font-mono">
          <p className="text-[9px] font-black uppercase text-slate-500">RATING</p>
          <p className="text-base font-black text-slate-900 mt-0.5">⭐ {driverRating}</p>
        </div>
      </div>

      {/* Incoming Requests Feed */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-black font-mono uppercase text-slate-500">
          <span>INCOMING RIDE REQUESTS</span>
          <span className="text-amber-600 font-bold">{pendingRequests.length} Active</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2 font-mono">
            <Zap size={24} className="mx-auto text-amber-500 animate-bounce" />
            <p className="text-xs font-black uppercase text-slate-700">
              {isOnline ? "Searching for passenger requests..." : "Driver Offline"}
            </p>
            <p className="text-[10px] text-slate-400">
              {isOnline
                ? "New rides within your operating radius will appear here instantly."
                : "Toggle your status to online above to receive requests."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 bg-white border-2 border-amber-300 rounded-2xl shadow-xs space-y-3 font-mono"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                      {request.user ? request.user.substring(0, 1).toUpperCase() : "P"}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">{request.user || "Passenger"}</p>
                      <p className="text-[9px] text-slate-400">{request.distance || "3.5 km"} • {request.duration || "12 mins"}</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    ₹{request.price || 120}
                  </span>
                </div>

                {/* Pickup / Drop locations */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">{request.from || "Pickup point"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-slate-900 shrink-0" />
                    <span className="truncate">{request.to || "Destination"}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onDeclineRequest(request.id)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <X size={14} />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => onAcceptRequest(request)}
                    className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Check size={14} strokeWidth={3} />
                    <span>Accept Ride</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
