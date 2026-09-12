/**
 * Helper to determine the specific Origin / Nature tag for a ride/trip
 * according to Driver vs Rider mode flows:
 *
 * For Driver:
 * - "ENGAGE" - when rider engaged directly with driver (on-demand vehicle tap / direct engage)
 * - "OFFER" - when driver offered a ride or trip in market
 * - "REQUEST ACCEPTED" - when driver accepted a rider request from market
 *
 * For Rider:
 * - "ENGAGE" - when driver accepted rider engage trip/ride (direct vehicle engage)
 * - "REQUEST" - when rider requested a ride or trip in market
 * - "OFFER BOOKED" - when rider booked a driver offer in market
 */

export type TripOriginType = "engage" | "offer" | "request_accepted" | "request" | "offer_booked";

export interface TripOriginInfo {
  type: TripOriginType;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export function parseTripDate(trip: any): Date {
  if (!trip) return new Date();

  // 1. Direct createdAt or timestamp
  if (trip.createdAt) {
    const d = new Date(trip.createdAt);
    if (!isNaN(d.getTime())) return d;
  }
  if (trip.timestamp) {
    const d = new Date(trip.timestamp);
    if (!isNaN(d.getTime())) return d;
  }

  // 2. Named string in trip.date
  if (typeof trip.date === "string") {
    const trimmed = trip.date.trim().toLowerCase();
    const today = new Date();
    if (trimmed === "today" || trimmed === "just now") {
      return today;
    }
    if (trimmed === "yesterday") {
      const y = new Date();
      y.setDate(today.getDate() - 1);
      return y;
    }
    if (trimmed === "tomorrow") {
      const t = new Date();
      t.setDate(today.getDate() + 1);
      return t;
    }

    // Try standard ISO or parseable format (YYYY-MM-DD)
    const parsed = new Date(trip.date);
    if (!isNaN(parsed.getTime())) {
      // If no year was in string, e.g. "May 09", ensure current year if needed
      return parsed;
    }

    // Try parsing format like "May 09" or "Aug 16" with current year
    const parts = trip.date.split(" ");
    if (parts.length >= 2) {
      const parsedWithYear = new Date(`${trip.date} ${today.getFullYear()}`);
      if (!isNaN(parsedWithYear.getTime())) {
        return parsedWithYear;
      }
    }
  }

  // 3. ID timestamp heuristic (e.g. h1723849200000 or trip-1723849200000)
  if (trip.id && typeof trip.id === "string") {
    const match = trip.id.match(/\d{10,13}/);
    if (match) {
      const num = parseInt(match[0], 10);
      const ts = num < 1e11 ? num * 1000 : num;
      const d = new Date(ts);
      if (!isNaN(d.getTime())) return d;
    }
  }

  return new Date();
}

export function formatToYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isTripMatchingDate(
  trip: any,
  dateFilterMode: "ALL" | "TODAY" | "YESTERDAY" | "LAST_7_DAYS" | "THIS_MONTH" | "CUSTOM_DATE" | "DATE_RANGE",
  customDate?: string,
  endDate?: string,
  dateQuery?: string
): boolean {
  if (dateFilterMode === "ALL" && !dateQuery && !customDate) {
    return true;
  }

  const tripDate = parseTripDate(trip);
  const tripYMD = formatToYMD(tripDate);
  const today = new Date();
  const todayYMD = formatToYMD(today);

  // Check text search query if present
  if (dateQuery && dateQuery.trim()) {
    const q = dateQuery.trim().toLowerCase();
    const formattedTripDate = tripDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).toLowerCase();
    const rawDate = (trip.date || "").toLowerCase();
    const rawTime = (trip.time || "").toLowerCase();

    const matchesQuery =
      tripYMD.includes(q) ||
      formattedTripDate.includes(q) ||
      rawDate.includes(q) ||
      rawTime.includes(q);

    if (!matchesQuery) return false;
  }

  if (dateFilterMode === "ALL") {
    return true;
  }

  if (dateFilterMode === "TODAY") {
    return tripYMD === todayYMD || (typeof trip.date === "string" && trip.date.toLowerCase() === "today");
  }

  if (dateFilterMode === "YESTERDAY") {
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayYMD = formatToYMD(yesterday);
    return tripYMD === yesterdayYMD || (typeof trip.date === "string" && trip.date.toLowerCase() === "yesterday");
  }

  if (dateFilterMode === "LAST_7_DAYS") {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    return tripDate >= sevenDaysAgo && tripDate <= new Date(today.getTime() + 86400000);
  }

  if (dateFilterMode === "THIS_MONTH") {
    return tripDate.getMonth() === today.getMonth() && tripDate.getFullYear() === today.getFullYear();
  }

  if (dateFilterMode === "CUSTOM_DATE" && customDate) {
    return tripYMD === customDate || (customDate === todayYMD && (trip.date || "").toLowerCase() === "today");
  }

  if (dateFilterMode === "DATE_RANGE") {
    if (customDate && endDate) {
      return tripYMD >= customDate && tripYMD <= endDate;
    } else if (customDate) {
      return tripYMD >= customDate;
    }
  }

  return true;
}

export function getTripOriginInfo(
  trip: any,
  mode: "rider" | "driver" = "rider",
  currentUserId?: string
): TripOriginInfo {
  if (!trip) {
    return {
      type: "offer",
      label: mode === "driver" ? "OFFER" : "REQUEST",
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-700",
      badgeBorder: "border-emerald-200/60",
    };
  }

  const isOnDemandEngage =
    trip.onDemand === true ||
    trip.isOnDemand === true ||
    trip.bookingFlow === "map" ||
    trip.bookingFlow === "instant" ||
    trip.bookingFlow === "engage" ||
    trip.originType === "engage" ||
    trip.isDirectEngage === true ||
    trip.source === "engage" ||
    trip.isInstant === true ||
    (trip.id && String(trip.id).startsWith("h")); // on-demand ids generated as h<timestamp>

  const isDriverMode = mode === "driver";

  if (isDriverMode) {
    // 1. Direct Engage flow
    if (isOnDemandEngage) {
      return {
        type: "engage",
        label: "ENGAGE",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        badgeBorder: "border-amber-200/60",
      };
    }

    // 2. Driver accepted a rider's request from the marketplace / feed
    const isAcceptedRiderRequest =
      trip.type === "request" ||
      trip.publishIntent === "request" ||
      trip.originType === "request_accepted" ||
      trip.isRequest === true ||
      (trip.role === "driver" && trip.ownerId && trip.ownerId !== currentUserId && trip.riderId && trip.riderId !== currentUserId) ||
      (trip.acceptedBy && (trip.type === "request" || trip.publishIntent === "request"));

    if (isAcceptedRiderRequest) {
      return {
        type: "request_accepted",
        label: "REQUEST ACCEPTED",
        badgeBg: "bg-indigo-50",
        badgeText: "text-indigo-700",
        badgeBorder: "border-indigo-200/60",
      };
    }

    // 3. Driver offered a ride or trip
    return {
      type: "offer",
      label: "OFFER",
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-700",
      badgeBorder: "border-emerald-200/60",
    };
  } else {
    // Rider Mode
    // 1. Direct Engage flow
    if (isOnDemandEngage) {
      return {
        type: "engage",
        label: "ENGAGE",
        badgeBg: "bg-amber-50",
        badgeText: "text-amber-700",
        badgeBorder: "border-amber-200/60",
      };
    }

    // 2. Rider booked a driver's posted offer in market
    const isBookedOffer =
      trip.isBookedByMe === true ||
      trip.originType === "offer_booked" ||
      trip.isOffer === true ||
      trip.publishIntent === "offer" ||
      (trip.postId && (trip.type === "offer" || trip.role === "driver" || trip.driverId));

    if (isBookedOffer) {
      return {
        type: "offer_booked",
        label: "OFFER BOOKED",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-700",
        badgeBorder: "border-emerald-200/60",
      };
    }

    // 3. Rider requested a ride or trip in market
    return {
      type: "request",
      label: "REQUEST",
      badgeBg: "bg-sky-50",
      badgeText: "text-sky-700",
      badgeBorder: "border-sky-200/60",
    };
  }
}
