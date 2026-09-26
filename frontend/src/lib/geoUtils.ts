/**
 * Geographic, Location & Pricing Utility Module
 */

export interface PrecisePositionResult {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface PrecisePositionOptions {
  desiredAccuracyMeters?: number;
  timeoutMs?: number;
  maximumAge?: number;
}

/**
 * Calculates heading (bearing in degrees 0-360) between two coordinates
 */
export function getHeadingBetweenPoints(
  p1: [number, number],
  p2: [number, number]
): number {
  if (!p1 || !p2) return 0;
  const lat1 = (p1[0] * Math.PI) / 180;
  const lon1 = (p1[1] * Math.PI) / 180;
  const lat2 = (p2[0] * Math.PI) / 180;
  const lon2 = (p2[1] * Math.PI) / 180;

  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Calculates straight line great-circle distance between two points in Kilometers using Haversine formula
 */
export function getHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Formats duration in minutes to human readable string (e.g., "18 mins" or "1 hr 25 mins")
 */
export function formatDurationMinutes(minutes: number): string {
  const mins = Math.max(1, Math.round(minutes));
  if (mins < 60) {
    return `${mins} mins`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (remainingMins === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMins} min${remainingMins > 1 ? 's' : ''}`;
}

/**
 * Computes deterministic, bounded ride fare with base fee, per-km rate, and optional surge
 */
export function secureCalculateFare(
  distanceKm: number,
  ratePerKm: number,
  surgeMultiplier: number = 1.0,
  baseFare: number = 40
): number {
  const km = Math.max(0.5, distanceKm || 1);
  const rate = Math.max(5, ratePerKm || 12);
  const surge = Math.max(1.0, surgeMultiplier || 1.0);
  const base = Math.max(20, baseFare || 40);

  const rawFare = (base + km * rate) * surge;
  return Math.round(rawFare);
}

/**
 * Generates formatted local trip tracking ID (e.g. "HYD-7492")
 */
export function generateLocalTripId(city?: string): string {
  const prefix = (city || 'TAXI')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .slice(0, 3) || 'CAB';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomSuffix}`;
}

/**
 * Generates formatted intercity trip ID (e.g. "INT-HYD-BLR-8921")
 */
export function generateIntercityTripId(fromCity?: string, toCity?: string): string {
  const p1 = (fromCity || 'DEP').toUpperCase().slice(0, 3);
  const p2 = (toCity || 'ARR').toUpperCase().slice(0, 3);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `INT-${p1}-${p2}-${randomSuffix}`;
}

/**
 * Retrieves precise GPS location using hardware Geolocation with accuracy threshold fallback
 */
export function getPreciseCurrentPosition(
  options: PrecisePositionOptions = {}
): Promise<PrecisePositionResult> {
  const {
    desiredAccuracyMeters = 30,
    timeoutMs = 12000,
    maximumAge = 5000,
  } = options;

  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      // Default fallback coordinates if unsupported
      return resolve({
        latitude: 17.385044,
        longitude: 78.486671,
        accuracy: 100,
      });
    }

    let isResolved = false;
    let bestPosition: GeolocationPosition | null = null;

    const finish = (pos: GeolocationPosition | null) => {
      if (isResolved) return;
      isResolved = true;
      if (pos) {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      } else {
        // Fallback default center
        resolve({
          latitude: 17.385044,
          longitude: 78.486671,
          accuracy: 150,
        });
      }
    };

    const timer = setTimeout(() => {
      if (!isResolved) {
        finish(bestPosition);
      }
    }, timeoutMs);

    // First attempt quick high-accuracy one-shot
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        bestPosition = pos;
        if (pos.coords.accuracy <= desiredAccuracyMeters) {
          clearTimeout(timer);
          finish(pos);
        }
      },
      () => {
        // If error, let watch or timeout resolve
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs / 2,
        maximumAge,
      }
    );

    // Watch position briefly to acquire satellite fix refinement
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (!bestPosition || pos.coords.accuracy < bestPosition.coords.accuracy) {
          bestPosition = pos;
        }
        if (pos.coords.accuracy <= desiredAccuracyMeters) {
          clearTimeout(timer);
          navigator.geolocation.clearWatch(watchId);
          finish(pos);
        }
      },
      (err) => {
        console.warn('[GPS] Watch position warning:', err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge,
      }
    );

    // Ensure watch is cleared after timeout
    setTimeout(() => {
      try {
        navigator.geolocation.clearWatch(watchId);
      } catch (_) {}
    }, timeoutMs + 500);
  });
}

/**
 * Calculates human-formatted trip pickup and arrival times based on departure and duration
 */
export function getTripTimes(
  departureTime: string = "Now",
  durationStr: string = "30m"
): { start: string; end: string } {
  const now = new Date();
  let startMinutes = now.getHours() * 60 + now.getMinutes();

  if (departureTime && departureTime !== "Now") {
    const match = departureTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ampm = match[3]?.toUpperCase();
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      startMinutes = h * 60 + m;
    }
  }

  let durationMinutes = 30;
  if (durationStr) {
    const num = parseFloat(durationStr.replace(/[^\d.]/g, ""));
    if (!isNaN(num)) {
      if (
        durationStr.toLowerCase().includes("hr") ||
        durationStr.toLowerCase().includes("hour")
      ) {
        durationMinutes = Math.round(num * 60);
      } else {
        durationMinutes = Math.round(num);
      }
    }
  }

  const formatTime = (totalMinutes: number) => {
    const mins = ((totalMinutes % 1440) + 1440) % 1440;
    const hours24 = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = hours24 >= 12 ? "PM" : "AM";
    const h12 = hours24 % 12 || 12;
    return `${h12}:${m < 10 ? "0" : ""}${m} ${ampm}`;
  };

  return {
    start: formatTime(startMinutes),
    end: formatTime(startMinutes + durationMinutes),
  };
}

/**
 * Helper to get card proximity distance indicator
 */
export function getCardProximityDistance(
  option: any,
  userType?: string,
  userLat?: number | null,
  userLng?: number | null,
  targetLat?: number | null,
  targetAddress?: string | null
): { isOwnPost: boolean; label: string | null } {
  const label = option?.pickupDistance
    ? `${option.pickupDistance} away`
    : option?.distanceKm
    ? `${option.distanceKm} km away`
    : null;
  return {
    isOwnPost: false,
    label,
  };
}

