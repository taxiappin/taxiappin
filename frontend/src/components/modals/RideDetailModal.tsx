import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronDown,
  Star,
  Check,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface RideDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ride: any;
  onBook: (ride: any) => void;
  appMode: string;
  onChat: (ride: any) => void;
  allTrips?: any[];
  bookings?: any[];
}

export const RideDetailModal: React.FC<RideDetailModalProps> = ({
  isOpen,
  onClose,
  ride,
  onBook,
  appMode,
  onChat,
  allTrips,
  bookings = [],
}) => {
  const [seatsSelected, setSeatsSelected] = useState<number>(1);
  const [isBeforeYouGoOpen, setIsBeforeYouGoOpen] = useState(false);

  const pricePerSeat = useMemo(() => {
    if (!ride) return 0;
    const basePrice = Number(ride.price) || 0;
    const initialSeats = Number(ride.seats) || 1;
    return Math.max(1, Math.round(basePrice / initialSeats));
  }, [ride]);

  const existingBooking = useMemo(() => {
    if (!ride || !bookings) return null;
    return bookings.find(
      (b: any) =>
        (b.rideId === ride.id || b.id === ride.id) &&
        b.status?.toLowerCase() !== "cancelled" &&
        b.status?.toLowerCase() !== "rejected"
    );
  }, [ride, bookings]);

  const currentBookingStatus = useMemo(() => {
    if (existingBooking?.status) return existingBooking.status.toLowerCase();
    if (ride?.bookingStatus) return ride.bookingStatus.toLowerCase();
    return null;
  }, [ride, existingBooking]);

  const isAlreadyBooked = useMemo(() => {
    if (!ride) return false;
    if (ride.isOwn) return true;
    if (existingBooking) return true;
    if (
      allTrips &&
      allTrips.some(
        (t: any) =>
          t.id === ride.id &&
          t.status?.toLowerCase() !== "cancelled" &&
          t.status?.toLowerCase() !== "rejected"
      )
    ) {
      return true;
    }
    return false;
  }, [ride, existingBooking, allTrips]);

  const seatsToShow =
    appMode === "driver"
      ? ride?.seats || 1
      : isAlreadyBooked
      ? ride?.seats || 1
      : seatsSelected;
  const priceToShow =
    appMode === "driver"
      ? pricePerSeat * (ride?.seats || 1)
      : isAlreadyBooked
      ? pricePerSeat * (ride?.seats || 1)
      : pricePerSeat * seatsSelected;

  const computedToTime = useMemo(() => {
    if (!ride) return "12:45";
    if (ride.toTime) return ride.toTime;
    try {
      const timeStr = ride.time || "12:00";
      const [hours, minutes] = timeStr.split(":").map(Number);
      const durationStr = ride.duration || "45m";
      const durationMinutes =
        parseInt(durationStr.replace(/[^0-9]/g, ""), 10) || 45;

      const dateObj = new Date();
      dateObj.setHours(hours, minutes, 0, 0);
      dateObj.setMinutes(dateObj.getMinutes() + durationMinutes);

      const h = dateObj.getHours().toString().padStart(2, "0");
      const m = dateObj.getMinutes().toString().padStart(2, "0");
      return `${h}:${m}`;
    } catch (e) {
      return "12:45";
    }
  }, [ride?.time, ride?.duration, ride?.toTime]);

  const fromTitle = useMemo(() => {
    if (!ride?.from) return "Terminal 3 - Indira Gandhi Int'l Airport, Delhi";
    const parts = ride.from.split(",");
    return parts[0].trim();
  }, [ride?.from]);

  const fromSub = useMemo(() => {
    if (!ride?.from) return "JUBILEE BUS STATION";
    const parts = ride.from.split(",");
    if (parts.length > 1) return parts.slice(1).join(",").trim().toUpperCase();
    return "NEARBY HUB";
  }, [ride?.from]);

  const toTitle = useMemo(() => {
    if (!ride?.to) return "Terminal 3 - Indira Gandhi Int'l Airport, Delhi";
    const parts = ride.to.split(",");
    return parts[0].trim();
  }, [ride?.to]);

  const toSub = useMemo(() => {
    if (!ride?.to) return "BUS STAND ROAD";
    const parts = ride.to.split(",");
    if (parts.length > 1) return parts.slice(1).join(",").trim().toUpperCase();
    return "METRO STATION OUTLET";
  }, [ride?.to]);

  useEffect(() => {
    if (isOpen) {
      setSeatsSelected(1);
      setIsBeforeYouGoOpen(false);
    }
  }, [isOpen, ride?.id]);

  return (
    <AnimatePresence>
      {isOpen && ride && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[10000] flex items-end justify-center"
        >
          <div
            className="absolute inset-0 bg-secondary/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full bg-slate-50 rounded-t-[40px] p-0 shadow-2xl relative z-50 max-h-[92%] overflow-hidden flex flex-col"
          >
            {/* Slide Pill */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />

            <div className="flex flex-col h-full overflow-hidden">
              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 bg-white">
                <div className="flex items-center">
                  <button
                    onClick={onClose}
                    className="h-10 w-10 flex items-center justify-center border border-gray-100 rounded-full hover:bg-gray-50 active:scale-95 transition-all text-secondary"
                  >
                    <ChevronLeft size={20} strokeWidth={2.5} />
                  </button>
                  <span className="text-md font-black text-secondary tracking-tight ml-3">
                    Booking details
                  </span>
                </div>
                <div className="text-[11px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                  {ride.date || "2026-06-12"}
                </div>
              </div>

              {/* Scrollable details */}
              <div className="flex-1 overflow-y-auto space-y-3 bg-slate-50 no-scrollbar pb-6">
                {/* 1. Timeline section */}
                <div className="p-6 bg-white border-b border-gray-100">
                  <div className="relative">
                    <div className="absolute left-[7px] top-[14px] bottom-[14px] w-[2px] bg-gray-100" />

                    {/* Pickup Pin & Time */}
                    <div className="relative pl-7 pb-5">
                      <div className="absolute left-[3px] top-[6px] w-[10px] h-[10px] rounded-full border-2 border-rose-500 bg-white" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-slate-50 border border-gray-150 px-2.5 py-0.5 rounded-lg text-gray-900 leading-none">
                          {ride.time || "12:00"}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          {ride.date || "2026-06-12"}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-gray-900 tracking-tight mt-1.5 leading-snug">
                        {fromTitle}
                      </h3>
                      <p className="text-[9px] font-black text-gray-400 tracking-wider uppercase mt-1">
                        {fromSub}
                      </p>
                    </div>

                    {/* Distance & Duration Badge */}
                    <div className="relative pl-7 py-2">
                      <span className="text-[9px] font-black text-rose-500 bg-rose-50/70 border border-rose-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {ride.distance || "18 KM"} • {ride.duration || "45M"} • APPROX
                      </span>
                    </div>

                    {/* Drop Pin & Time */}
                    <div className="relative pl-7 pt-4">
                      <div className="absolute left-[3px] top-[10px] w-[10px] h-[10px] rounded-full bg-gray-900" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-slate-50 border border-gray-150 px-2.5 py-0.5 rounded-lg text-gray-900 leading-none">
                          {computedToTime}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          {ride.date || "2026-06-12"}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-gray-900 tracking-tight mt-1.5 leading-snug">
                        {toTitle}
                      </h3>
                      <p className="text-[9px] font-black text-gray-400 tracking-wider uppercase mt-1">
                        {toSub}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Driver / Rider card */}
                <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 font-extrabold text-[13px] tracking-tight shrink-0 shadow-sm uppercase">
                      {ride.user
                        ? ride.user.substring(0, 2)
                        : ride.driverName
                        ? ride.driverName.substring(0, 2)
                        : "AS"}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 tracking-tight leading-none mb-1">
                        {appMode === "driver"
                          ? ride.user
                          : ride.driverName ||
                            ride.user ||
                            "Aryan Singhania (Rider)"}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 leading-none">
                        <Star
                          size={11}
                          className="text-amber-400 fill-amber-400"
                        />
                        <span className="font-extrabold text-gray-700">
                          {ride.driverRating || ride.rating || "4.8"}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>
                          {ride.vehicle ||
                            ride.driver?.vehicle ||
                            "Maruti Swift"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                </div>

                {/* OTP Row */}
                {appMode === "rider" &&
                  (ride.status === "active" || ride.status === "booked") &&
                  ride.otp && (
                    <div className="mx-6 my-2 bg-ink p-5 rounded-2xl text-white flex justify-between items-center shadow-md">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">
                          Confirm OTP with Driver
                        </p>
                        <p className="text-2xl font-black tracking-[0.25em] italic">
                          {ride.otp}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary">
                        <ShieldCheck size={20} />
                      </div>
                    </div>
                  )}

                {/* SELECT SEATS */}
                {appMode === "rider" && (
                  <div className="p-6 bg-white border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                          SELECT SEATS
                        </h4>
                        <p className="text-[10px] font-bold text-gray-400 mt-2">
                          {isAlreadyBooked
                            ? "SEATS CONFIRMED"
                            : `${ride.seatsAvailable || 4} SEATS REMAINING`}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          disabled={isAlreadyBooked || seatsSelected <= 1}
                          onClick={() =>
                            setSeatsSelected((prev) => Math.max(1, prev - 1))
                          }
                          className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-50 active:scale-95 transition-all text-gray-500 disabled:opacity-35 disabled:scale-100 bg-white shadow-xs"
                        >
                          <span className="w-2.5 h-[2px] bg-current rounded-full" />
                        </button>

                        <span className="text-base font-black text-gray-900 min-w-[12px] text-center">
                          {seatsToShow}
                        </span>

                        <button
                          disabled={
                            isAlreadyBooked ||
                            seatsSelected >= (ride.seatsAvailable || 4)
                          }
                          onClick={() =>
                            setSeatsSelected((prev) =>
                              Math.min(ride.seatsAvailable || 4, prev + 1)
                            )
                          }
                          className="h-9 w-9 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-50 active:scale-95 transition-all text-gray-500 disabled:opacity-35 disabled:scale-100 bg-white shadow-xs"
                        >
                          <span className="text-base leading-none font-black">
                            +
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs font-bold text-gray-500">
                        {seatsToShow} seat{seatsToShow > 1 ? "s" : ""} selected
                      </span>
                      <span className="text-[10px] font-black text-rose-500 bg-rose-50 border border-rose-100/50 px-3 py-1 rounded-full uppercase tracking-wider">
                        ₹{pricePerSeat} × {seatsToShow} = ₹{priceToShow}
                      </span>
                    </div>
                  </div>
                )}

                {/* FARE SUMMARY */}
                <div className="p-6 bg-white border-b border-gray-100">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-4">
                    FARE SUMMARY
                  </h4>

                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                      <span>
                        {seatsToShow} seat{seatsToShow > 1 ? "s" : ""} × ₹
                        {pricePerSeat}
                      </span>
                      <span className="text-gray-900 font-extrabold">
                        ₹{priceToShow}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                      <span>Distance</span>
                      <span className="text-gray-900 font-extrabold">
                        {ride.distance || "18 km"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                      <span>Payment Method</span>
                      <span className="text-gray-900 font-extrabold">
                        Cash to driver
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-primary/15 border border-primary/30 rounded-[20px] mt-4 shadow-sm shadow-primary/5">
                      <span className="text-xs font-black text-amber-600 dark:text-amber-500 uppercase tracking-wider">
                        TOTAL PRICE DUE
                      </span>
                      <span className="text-lg font-black text-slate-950 dark:text-white">
                        ₹{priceToShow}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BEFORE YOU GO INFO */}
                <div className="p-6 bg-white border-b border-gray-100">
                  <button
                    onClick={() => setIsBeforeYouGoOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500">⚠</span>
                      <span className="text-[11px] font-black text-gray-950 uppercase tracking-widest">
                        BEFORE YOU GO INFO
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "text-gray-400 transition-transform duration-300",
                        isBeforeYouGoOpen && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isBeforeYouGoOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3"
                      >
                        <div className="p-4 bg-slate-50 border border-gray-100 rounded-2xl text-[10px] font-bold text-gray-500 space-y-2 uppercase tracking-wide leading-relaxed">
                          <p>
                            • Verify the vehicle license plate matches before
                            entering.
                          </p>
                          <p>
                            • Ensure your registered phone number is correct and
                            active.
                          </p>
                          <p>
                            • Wear your seatbelt at all times during intercity
                            pool rides.
                          </p>
                          <p>
                            • Cash is paid directly to the driver upon complete
                            service drop-off.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Legal Agree and Book Button */}
                <div className="p-6 pb-12 bg-white flex flex-col items-center">
                  <span className="text-[9.5px] font-semibold text-gray-450 uppercase tracking-wide mb-4 text-center">
                    By {appMode === "driver" ? "offering" : "booking"} you agree
                    to our{" "}
                    <span 
                      onClick={() => {
                        window.history.pushState(null, "", "/Terms and conditions");
                        window.dispatchEvent(new Event("popstate"));
                      }}
                      className="text-primary hover:text-amber-500 underline cursor-pointer font-extrabold"
                    >
                      terms & conditions
                    </span>
                  </span>

                  {!isAlreadyBooked ? (
                    <div className="flex flex-col gap-2.5 w-full">
                      <button
                        onClick={() => {
                          onBook({
                            ...ride,
                            price: priceToShow,
                            seats:
                              appMode === "driver"
                                ? ride.seats || 1
                                : seatsSelected,
                            rideType:
                              appMode === "driver"
                                ? ride.rideType || "Solo"
                                : seatsSelected > 1
                                ? "Carpool"
                                : "Solo",
                          });
                          onClose();
                        }}
                        className="w-full h-15 bg-primary text-slate-950 rounded-2xl font-black text-[12px] uppercase tracking-[0.15em] shadow-lg shadow-primary/25 active:scale-95 transition-all hover:bg-amber-500 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>
                          ⚡{" "}
                          {appMode === "driver"
                            ? "CONFIRM ACCEPT & OFFER"
                            : "CONFIRM BOOK"}{" "}
                          • ₹{priceToShow}
                        </span>
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full h-12 bg-slate-100 text-gray-900 border border-gray-200 rounded-2xl font-black text-[11px] uppercase tracking-[0.1em] active:scale-95 transition-all hover:bg-gray-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        CLOSE OVERVIEW
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2.5 w-full">
                      {appMode === "rider" &&
                      !ride.isOwn &&
                      currentBookingStatus === "pending" ? (
                        <div className="w-full text-center py-3 px-4 bg-amber-50 border border-amber-200/50 rounded-2xl">
                          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center justify-center gap-1.5 italic">
                            <span>
                              🔒 Contact Details Unlocked Upon Acceptance
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-2 w-full pt-1">
                          {!ride.isOwn && (
                            <button
                              onClick={() => {
                                onChat(ride);
                                onClose();
                              }}
                              className="flex-1 h-14 bg-slate-100 text-gray-900 border border-gray-200 rounded-2xl font-black text-[11px] uppercase tracking-[0.1em] active:scale-95 transition-all hover:bg-gray-200 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <MessageSquare size={16} />
                              Chat Driver
                            </button>
                          )}
                        </div>
                      )}
                      <button
                        onClick={onClose}
                        className="h-14 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.1em] active:scale-95 transition-all hover:bg-gray-800 flex items-center justify-center w-full cursor-pointer"
                      >
                        CLOSE OVERVIEW
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
