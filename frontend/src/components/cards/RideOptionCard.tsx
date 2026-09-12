import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  MapPin,
  Star,
  MessageSquare,
  Zap,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useConfig } from "../../lib/ConfigContext";
import { getTripTimes, getCardProximityDistance } from "../../lib/geoUtils";

interface RideOptionCardProps {
  option: any;
  active: boolean;
  onClick: () => void;
  onBook: () => void;
  distance: number;
  duration: string;
  rideType?: string;
  pickup?: string;
  drop?: string;
  onChat?: () => void;
  isDarkTheme?: boolean;
  estEta?: number;
}

export const RideOptionCard: React.FC<RideOptionCardProps> = ({
  option,
  active,
  onClick,
  onBook,
  distance,
  duration,
  pickup,
  drop,
  onChat,
  isDarkTheme = false,
  estEta,
}) => {
  const { config } = useConfig();
  const [showFareBreakdown, setShowFareBreakdown] = useState(false);

  const rideTypeVal =
    option.rideType || ("departureTime" in option ? "Carpool" : "Solo");
  const isCarpool = rideTypeVal === "Carpool";
  const isIntercity = option.isIntercity || distance >= 50;
  const isInstant = option.isInstant !== false;
  const driverName = option.driverName || "1 DRIVERS NEARBY";

  const times = getTripTimes(
    isInstant ? "Now" : option.departureTime || "10:00 AM",
    duration || "30m"
  );

  const proximityInfo = useMemo(() => {
    return getCardProximityDistance(
      option,
      "rider",
      null,
      null,
      null,
      pickup || option.from
    );
  }, [option, pickup]);

  // Scheduled rides / co-rides style matching driver-created offers in the market
  if (!isInstant) {
    return (
      <motion.div
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        className={cn(
          "w-full rounded-2xl p-4 border transition-all cursor-pointer mb-3.5 bg-white relative overflow-hidden group shadow-xs duration-200",
          active
            ? "border-blue-600 ring-1 ring-blue-500/20"
            : "border-slate-200/60 hover:shadow-md hover:border-slate-300"
        )}
      >
        {/* Date, Departure & Scheduled Tags Header */}
        <div className="flex items-center justify-start mb-4 select-none text-slate-500 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-slate-700 text-[10px] font-medium">
              <Calendar
                size={11}
                className="shrink-0 text-slate-500"
                strokeWidth={2}
              />
              <span>
                {option.day || "Today"} •{" "}
                {option.departureTime || "04:15 PM"}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-medium px-2.5 py-1 rounded-lg border border-slate-200/80">
              <Calendar size={11} className="shrink-0 text-slate-500" />
              <span>Scheduled</span>
            </div>
          </div>
        </div>

        {/* Route Details with Connections */}
        <div className="flex justify-between items-start mb-3.5">
          <div className="relative pl-6 flex flex-col justify-center min-h-[50px] flex-1">
            <div className="absolute left-[11px] top-1.5 bottom-1.5 w-[1px] border-l border-dashed border-slate-200" />
            <div className="relative mb-3">
              <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-white z-10" />
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-normal text-slate-400 w-8 shrink-0">
                  {times.start}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12.5px] font-medium text-slate-800 tracking-tight truncate max-w-[200px]">
                    {option.from ||
                      (pickup && pickup !== "Current Location"
                        ? pickup
                        : "Pickup Point")}
                  </span>
                  {!proximityInfo.isOwnPost && proximityInfo.label && (
                    <span className="text-[8px] font-normal text-blue-600 flex items-center gap-0.5">
                      <MapPin size={8} className="text-blue-500 shrink-0" />
                      {proximityInfo.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-slate-900 z-10" />
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-normal text-slate-400 w-8 shrink-0">
                  {times.end}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12.5px] font-medium text-slate-800 tracking-tight truncate max-w-[200px]">
                    {option.to || drop || "Destination"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 pl-2">
            <span className="text-[17px] font-display font-semibold text-slate-900 leading-none">
              ₹{option.price}
            </span>
            <span className="text-[10px] font-normal text-slate-400 mt-0.5">
              Approx
            </span>
          </div>
        </div>

        {/* Footer info & Book CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-[10px] font-medium">
              {driverName.charAt(0)}
            </div>
            <span className="text-[11px] font-medium text-slate-700 truncate max-w-[120px]">
              {driverName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {onChat && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChat();
                }}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <MessageSquare size={13} />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBook();
              }}
              className="px-4 py-1.5 rounded-xl bg-primary text-black font-semibold text-[11px] hover:bg-primary-dark transition-all cursor-pointer"
            >
              Book
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Intercity / Instant Ride Card Design
  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl p-3 border transition-all cursor-pointer mb-2.5 bg-white relative",
        active ? "border-primary shadow-sm" : "border-hairline-soft"
      )}
    >
      {/* Top Tags */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <span
          className={cn(
            "text-[9px] font-medium px-2 py-0.5 rounded-md border shadow-xs",
            isCarpool
              ? "bg-purple-600 text-white border-purple-700"
              : "bg-blue-600 text-white border-blue-700"
          )}
        >
          {isCarpool ? "Carpool" : "Solo"}
        </span>
        {isCarpool && (option.seatsLeft || 1) > 1 && (
          <span className="text-[9px] font-medium px-2 py-0.5 rounded-md bg-amber-500 text-white border border-amber-600 shadow-xs">
            {option.seatsLeft} seats left
          </span>
        )}
      </div>

      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <div className="relative flex flex-col gap-2">
            <div className="flex items-start gap-2">
              {!isInstant && (
                <span className="text-[10px] font-medium text-ink/70 mt-0.5 shrink-0 min-w-[28px]">
                  {times.start}
                </span>
              )}
              <div className="flex flex-col items-center gap-0.5 mt-1 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full border border-red-500 bg-white" />
                <div className="w-[0.5px] h-4 border-l border-dashed border-gray-300" />
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[12.5px] font-semibold text-ink leading-none truncate">
                  {pickup && pickup !== "Current Location"
                    ? pickup
                    : "Pickup Location"}
                </h4>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="text-[10.5px] font-normal text-mute">
                    {distance ? `${distance} km` : "Estimating..."} •{" "}
                    {duration || "Estimating..."}
                  </span>
                  {!proximityInfo.isOwnPost && proximityInfo.label && (
                    <span className="text-[10.5px] font-medium text-blue-600 flex items-center gap-0.5">
                      <MapPin size={10} className="text-blue-500 shrink-0" />
                      {proximityInfo.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              {!isInstant && (
                <span className="text-[10px] font-medium text-ink/70 mt-0.5 shrink-0 min-w-[28px]">
                  {times.end}
                </span>
              )}
              <div className="flex flex-col items-center shrink-0 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-black" />
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[12.5px] font-semibold text-ink leading-none truncate">
                  {drop || "Destination"}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="text-[18px] font-display font-semibold text-ink leading-none">
            ₹{option.price}
          </span>
          <span className="text-[10px] font-normal text-mute/60 mt-0.5">
            Approx
          </span>
          <div className="flex items-center gap-1 mt-2 text-mute/80">
            <Users size={11} className="shrink-0" />
            <span className="text-[10px] font-medium">
              {option.seatsLeft || 1} seats
            </span>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-gray-50 mb-3 w-full" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 border border-hairline-soft">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${option.driverName || "driver"}`}
                alt="driver"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-white border border-hairline-soft rounded-full w-3 h-3 flex items-center justify-center shadow-xs">
              <Star size={7} className="fill-orange-400 text-orange-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-ink">
              {driverName}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={9} className="fill-orange-400 text-orange-400" />
              <span className="text-[11px] font-medium text-ink">
                {option.driverRating || "4.7"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {onChat && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChat?.();
              }}
              className="flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-hairline-soft bg-white text-[11px] font-medium text-ink hover:bg-gray-50 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <MessageSquare size={12} className="stroke-[2]" />
              Chat
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook();
            }}
            className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-[#FF3B30] text-[11px] font-semibold text-white shadow-md shadow-red-500/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Zap size={12} className="fill-white" />
            Book
          </button>
        </div>
      </div>
    </motion.div>
  );
};
