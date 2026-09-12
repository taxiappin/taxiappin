import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Star,
  FileText,
  Mail,
  Check,
  X,
  Clock,
  Shield,
  CreditCard,
  User,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Zap
} from "lucide-react";
import { cn } from "../lib/utils";
import { useLanguage } from "../lib/LanguageContext";
import { getTripOriginInfo } from "../lib/tripOrigin";

interface RideDetailsBreakdownProps {
  trip: any;
  onClose: () => void;
  appMode: "rider" | "driver";
  userEmail?: string;
  vehicleIconUrl?: string;
  addNotification?: (message: string, type?: "success" | "info" | "error" | "warning") => void;
}

export const RideDetailsBreakdown: React.FC<RideDetailsBreakdownProps> = ({
  trip,
  onClose,
  appMode,
  userEmail = "user@test.com",
  vehicleIconUrl,
  addNotification
}) => {
  const { t } = useLanguage();
  const [invoiceSent, setInvoiceSent] = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState(false);

  if (!trip) return null;

  const isRider = appMode === "rider";
  const isCancelled = trip.status?.toLowerCase() === "cancelled";

  // Format Date and Time
  const dateStr = trip.date || "Today";
  const timeStr = trip.time || "12:00 AM";

  // Ride ID Format: e.g. #RDH1 7831 9139 9052 9
  const getRideId = () => {
    if (!trip.id) return "RDH1 7831 9139 9052 9";
    const cleanId = trip.id.toString().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (cleanId.startsWith("RD")) {
      return cleanId;
    }
    return `RDH1 ${cleanId.slice(0, 4)} ${cleanId.slice(4, 8)} ${cleanId.slice(8, 12)} 9`.trim();
  };

  const rideIdString = getRideId();

  // Address helper
  const getAddressTitle = (addrStr: any) => {
    const address = typeof addrStr === "string" ? addrStr : addrStr?.address || "";
    if (!address) return "Unknown Location";
    const parts = address.split(",");
    return parts[0].trim();
  };

  const pickupTitle = getAddressTitle(trip.pickup || trip.from);
  const dropTitle = getAddressTitle(trip.drop || trip.to);

  // Price & Earnings calculation as per Uber standard
  const customerPrice = trip.price || 0;
  const platformFeeRatio = 0.15; // 15% platform fee
  const platformFee = parseFloat((customerPrice * platformFeeRatio).toFixed(2));
  const driverEarnings = parseFloat((customerPrice - platformFee).toFixed(2));

  // Partner Info
  const partnerName = isRider
    ? trip.driver?.name || "Aryan Singhania"
    : trip.customer?.name || "Customer";
  const partnerAvatar = isRider
    ? trip.driver?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
    : trip.customer?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100";

  const ratingGiven = isRider
    ? trip.riderRatingGiven || trip.ratingGiven || 5
    : trip.driverRatingGiven || trip.ratingGiven || 5;

  const vehicleName = isRider
    ? trip.driver?.vehicle || trip.vehicleType || "Comfort Sedan"
    : trip.vehicle || trip.vehicleType || "Comfort Sedan";

  const vehicleDisplay = vehicleName.toUpperCase().includes("BIKE") || trip.rideType?.toLowerCase()?.includes("bike")
    ? "Bike"
    : vehicleName.toUpperCase().includes("AUTO")
    ? "Auto"
    : "Comfort Sedan";

  const licensePlate = trip.driver?.licensePlate || "TS09-UB-4892";

  const handleSendEmail = () => {
    setSendingInvoice(true);
    setTimeout(() => {
      setSendingInvoice(false);
      setInvoiceSent(true);
      if (addNotification) {
        addNotification(`Invoice sent to ${userEmail}!`, "success");
      }
    }, 1000);
  };

  return (
    <div id="ride-details-page" className="absolute inset-0 bg-[#f8fafc] z-[9000] flex flex-col font-sans select-none overflow-hidden">
      {/* HEADER */}
      <div className="pt-12 pb-4 px-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <button
          id="btn-close-details"
          onClick={onClose}
          className="w-11 h-11 rounded-full bg-white border border-slate-200/60 shadow-xs flex items-center justify-center text-slate-800 active:scale-95 transition-all hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-base font-extrabold text-slate-950 tracking-tight">{t("Ride Details", "Ride Details")}</span>
        <div className="w-11" />
      </div>

      {/* COMPACT MAIN SCREEN BODY */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col justify-start">
        
        {/* ONE SINGLE CONSOLIDATED CARD WITH SEPARATE LINES */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-md flex flex-col p-4 divide-y divide-slate-100 gap-y-3.5">
          
          {/* LINE 1: HIGHLIGHTED RIDE ID & STATUS ON TOP */}
          <div className="pb-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t("RIDE IDENTIFIER", "RIDE IDENTIFIER")}</span>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                  <Shield size={12} className="text-indigo-600" />
                  <span className="font-mono text-[11px] font-black text-slate-800 tracking-tight">
                    #{rideIdString}
                  </span>
                </div>
              </div>

              {/* Completed / Cancelled Badge */}
              <div className="flex items-end">
                {isCancelled ? (
                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    <X size={10} strokeWidth={2.5} /> {t("CANCELLED", "CANCELLED")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    <Check size={10} strokeWidth={2.5} /> {t("COMPLETED", "COMPLETED")}
                  </span>
                )}
              </div>
            </div>

            {/* Badges: Origin Tag (Engage/Offer/Request Accepted/Request/Offer Booked) & Scope (Local/Intercity Solo/Carpool) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {(() => {
                const origin = getTripOriginInfo(trip, appMode);
                return (
                  <span
                    className={cn(
                      "text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border shadow-3xs",
                      origin.badgeBg,
                      origin.badgeText,
                      origin.badgeBorder
                    )}
                  >
                    {origin.label}
                  </span>
                );
              })()}

              {(() => {
                const isIntercity = trip.type?.includes("intercity") || trip.rideType?.toLowerCase()?.includes("intercity");
                const isCarpool =
                  trip.rideType === "Carpool" ||
                  trip.type?.toLowerCase().includes("pool");
                const scope = isIntercity ? "Intercity" : "Local";
                const seats = trip.seats || 1;
                const detailsString = isCarpool
                  ? `${scope} • Carpool (${seats} seats)`
                  : `${scope} • Solo`;

                return (
                  <span className="text-[9px] font-semibold text-slate-600 bg-slate-50 border border-slate-200/60 tracking-wider px-2.5 py-0.5 rounded-lg uppercase shadow-3xs">
                    {detailsString}
                  </span>
                );
              })()}

              {/* Ride Now / Ride Later badge if applicable */}
              {trip.isScheduled ? (
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border shadow-3xs bg-amber-50 text-amber-700 border-amber-200/60 flex items-center gap-1">
                  <Clock size={9} className="text-amber-500 shrink-0" />
                  Ride Later
                </span>
              ) : (
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border shadow-3xs bg-emerald-50 text-emerald-700 border-emerald-200/60 flex items-center gap-1">
                  <Zap size={9} className="fill-emerald-600 text-emerald-700 shrink-0" />
                  Ride Now
                </span>
              )}
            </div>
          </div>

          {/* LINE 2: VEHICLE TYPE, TIME & DUAL PRICING VIEW */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {vehicleIconUrl && (
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-1 shadow-3xs">
                  <img
                    src={vehicleIconUrl}
                    alt={vehicleDisplay}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">{vehicleDisplay}</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{dateStr} • {timeStr}</p>
              </div>
            </div>

            {/* Pricing Section customized as per Rider/Driver Views */}
            <div className="text-right">
              {isRider ? (
                <>
                  <span className="text-xl font-black text-slate-950">₹{customerPrice}</span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Approx Paid Fare</p>
                </>
              ) : (
                <>
                  <span className="text-xl font-black text-emerald-600">₹{driverEarnings}</span>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider mt-0.5">Your Earnings</p>
                </>
              )}
            </div>
          </div>

          {/* LINE 3: TIMELINE / ADDRESS DETAILS */}
          <div className="py-3.5 flex flex-col justify-start">
            <div className="relative pl-6.5 space-y-3">
              {/* Timeline Connector */}
              <div className="absolute left-[5.5px] top-2 bottom-2 w-[1.5px] border-l border-dashed border-slate-200" />

              {/* Pickup location */}
              <div className="relative flex items-start gap-2.5">
                <div className="absolute -left-[24.5px] top-1 w-3.5 h-3.5 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center shadow-3xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">{pickupTitle}</p>
                  <p className="text-[10px] text-slate-450 font-medium mt-0.5">Pickup Address</p>
                </div>
              </div>

              {/* Specs (Duration & Distance) placed IN BETWEEN start and endpoint */}
              <div className="relative flex items-center gap-2 py-0.5">
                <div className="absolute -left-[23.5px] w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shadow-3xs">
                  <Clock size={6} className="text-slate-400" />
                </div>
                <div className="flex items-center gap-1.5 bg-[#FAB818]/10 text-[#e0a10c] dark:text-[#FAB818] border border-[#FAB818]/20 px-2 py-0.5 rounded-full text-[10px] font-black tracking-tight shadow-3xs">
                  <span>{trip.duration || "24 mins"}</span>
                  <span className="opacity-30">•</span>
                  <span>{trip.distance || "12.5 km"}</span>
                </div>
              </div>

              {/* Drop-off location */}
              <div className="relative flex items-start gap-2.5">
                <div className="absolute -left-[24.5px] top-1 w-3.5 h-3.5 rounded-full border-2 border-rose-500 bg-white flex items-center justify-center shadow-3xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">{dropTitle}</p>
                  <p className="text-[10px] text-slate-450 font-medium mt-0.5">Drop-off Destination</p>
                </div>
              </div>
            </div>
          </div>

          {/* LINE 4: PARTNER & VEHICLE INFORMATION & RATINGS */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={partnerAvatar}
                alt={partnerName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200/60 bg-slate-50 shadow-3xs shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-extrabold text-slate-950">
                    {isRider ? partnerName : `Rider: ${partnerName}`}
                  </h4>
                  {isRider && (
                    <span className="bg-slate-100 text-slate-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-slate-150">
                      {licensePlate}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {isRider ? "Your Professional Partner" : "Trip Passenger"}
                </p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                {isRider ? "Your Rating" : "Passenger Rated"}
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={11}
                    className={cn(
                      "transition-colors",
                      star <= ratingGiven
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* LINE 5: UBER STANDARD FARE BREAKDOWN & INVOICE ACTION */}
          <div className="pt-3 space-y-2">
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>{isRider ? "Trip Fare" : "Passenger Fare"}</span>
              <span>₹{customerPrice.toFixed(2)}</span>
            </div>
            {isRider ? (
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Platform, Taxes & Booking Fees</span>
                <span>Included</span>
              </div>
            ) : (
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Platform Commission (15%)</span>
                <span className="text-rose-500">-₹{platformFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-slate-800 font-extrabold pt-2 border-t border-slate-50">
              <span>{isRider ? "Approx Paid Fare" : "Net Payout Earnings"}</span>
              <span className={cn("text-sm font-black", isRider ? "text-slate-950" : "text-emerald-600")}>
                ₹{(isRider ? customerPrice : driverEarnings).toFixed(2)}
              </span>
            </div>

            {/* PAYMENT TYPE METADATA */}
            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CreditCard size={12} className="text-slate-400" />
                <span>Payment Method</span>
              </div>
              <span className="font-bold text-slate-600">{trip.paymentMethod || trip.paymentType || "Wallet / Digital Pay"}</span>
            </div>

            {/* INVOICE BUTTON */}
            <button
              id="btn-invoice-action"
              onClick={handleSendEmail}
              disabled={sendingInvoice || invoiceSent}
              className={cn(
                "w-full mt-3 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all border",
                invoiceSent
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-slate-950 text-white border-transparent hover:bg-slate-900 active:scale-[0.98] cursor-pointer shadow-sm"
              )}
            >
              {invoiceSent ? (
                <>
                  <Check size={13} className="text-emerald-600 animate-pulse" />
                  <span>Invoice Emailed to {userEmail}</span>
                </>
              ) : sendingInvoice ? (
                <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Mail size={13} />
                  <span>Send PDF Receipt to Email</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
