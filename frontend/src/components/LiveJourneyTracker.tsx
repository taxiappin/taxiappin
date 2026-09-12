import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { io, Socket } from "socket.io-client";
import {
  Share2,
  Navigation,
  MapPin,
  Shield,
  Phone,
  Clock,
  ArrowRight,
  ChevronRight,
  User,
  Car,
  AlertCircle,
  CheckCircle2,
  X,
  Copy,
  Info,
  Calendar,
  RotateCcw,
  Maximize2,
  Minimize2,
  MessageSquare,
  Send,
  Check,
  AlertTriangle,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useConfig } from "../lib/ConfigContext";
import { routingService } from "../services/routingService";
import { getHaversineDistance, formatDurationMinutes, secureCalculateFare } from "../lib/geoUtils";
import { getResolvedTileUrl, getTileLayerClassName } from "../lib/mapHelpers";
import { RiderRatingDeliveryModal } from "./RiderRatingDeliveryModal";

// Top view SVG helper for standard vehicles
const getTopViewVehicleSVG = (vType: string, color = "#10b981") => {
  const t = (vType || "").toUpperCase();
  if (t === "BIKE" || t === "MOTORCYCLE") {
    return `
      <svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect x="29" y="4" width="6" height="12" rx="2" fill="rgba(0,0,0,0.155)" />
        <rect x="29" y="46" width="6" height="14" rx="2" fill="rgba(0,0,0,0.155)" />
        <rect x="30" y="6" width="4" height="10" rx="1" fill="#1e293b" />
        <rect x="30" y="48" width="4" height="12" rx="1" fill="#1e293b" />
        <path d="M26 18 Q32 14 38 18 L36 44 Q32 46 28 44 Z" fill="${color}" stroke="#ffffff" stroke-width="1.5" />
        <rect x="18" y="14" width="28" height="3" rx="1.5" fill="#475569" />
        <rect x="16" y="13" width="4" height="5" rx="1" fill="#0f172a" />
        <rect x="44" y="13" width="4" height="5" rx="1" fill="#0f172a" />
        <path d="M27 28 Q32 23 37 28 L35 40 Q32 42 29 40 Z" fill="#0f172a" />
        <rect x="26" y="21" width="12" height="4" rx="1" fill="#94a3b8" />
        <circle cx="19" cy="10" r="3" fill="#cbd5e1" stroke="#475569" stroke-width="1" />
        <circle cx="45" cy="10" r="3" fill="#cbd5e1" stroke="#475569" stroke-width="1" />
        <path d="M30 4 L34 4 L36 1 L28 1 Z" fill="#fef08a" opacity="0.9" />
      </svg>
    `;
  }
  if (t === "AUTO" || t === "TUK-TUK") {
    return `
      <svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 10 L42 10 L46 54 L18 54 Z" fill="rgba(0,0,0,0.155)" />
        <rect x="14" y="42" width="6" height="10" rx="2" fill="#1e293b" />
        <rect x="44" y="42" width="6" height="10" rx="2" fill="#1e293b" />
        <rect x="29" y="8" width="6" height="10" rx="2" fill="#1e293b" />
        <path d="M28 8 L36 8 L44 18 L44 54 C44 56, 20 56, 20 54 L20 18 Z" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
        <rect x="24" y="28" width="16" height="6" rx="1" fill="#1e293b" />
        <rect x="23" y="44" width="18" height="7" rx="1.5" fill="#f59e0b" />
        <path d="M23 16 C23 12, 41 12, 41 16 L44 26 L20 26 Z" fill="#1e293b" />
        <rect x="22" y="24" width="20" height="24" rx="4" fill="#f59e0b" opacity="0.95" />
        <rect x="25" y="27" width="14" height="18" rx="2" fill="#d97706" />
        <rect x="16" y="14" width="4" height="2" fill="#475569" />
        <rect x="44" y="14" width="4" height="2" fill="#475569" />
      </svg>
    `;
  }

  // DEFAULT CAR
  let carColor = color;
  if (t === "SEDAN" || t === "PRIME SEDAN") carColor = "#1e3a8a";
  else if (t === "SUV" || t === "PREMIUM SUV") carColor = "#065f46";
  else if (t === "MINI" || t === "ECO") carColor = "#dc2626";
  else if (t === "CAR") carColor = "#1f2937";

  return `
    <svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="8" width="36" height="48" rx="8" fill="rgba(0,0,0,0.15)" />
      <rect x="10" y="14" width="6" height="10" rx="2" fill="#1e293b" />
      <rect x="48" y="14" width="6" height="10" rx="2" fill="#1e293b" />
      <rect x="10" y="40" width="6" height="10" rx="2" fill="#1e293b" />
      <rect x="48" y="40" width="6" height="10" rx="2" fill="#1e293b" />
      <rect x="14" y="6" width="36" height="52" rx="10" fill="${carColor}" stroke="#ffffff" stroke-width="2" />
      <path d="M18 20 C18 16, 46 16, 46 20 L42 26 C42 26, 22 26, 22 26 Z" fill="#38bdf8" opacity="0.85" />
      <rect x="18" y="28" width="28" height="12" fill="#38bdf8" opacity="0.65" />
      <path d="M20 48 Q32 44 44 48 L42 52 Q32 49 22 52 Z" fill="#38bdf8" opacity="0.85" />
      <rect x="18" y="4" width="4" height="3" rx="1" fill="#fef08a" />
      <rect x="42" y="4" width="4" height="3" rx="1" fill="#fef08a" />
      <rect x="18" y="57" width="5" height="2" fill="#ef4444" />
      <rect x="41" y="57" width="5" height="2" fill="#ef4444" />
      <rect x="22" y="24" width="20" height="20" rx="3" fill="rgba(255,255,255,0.15)" />
    </svg>
  `;
};

// Helper to calculate bearing/rotation angle in degrees between two coordinates
function calculateHeading(from: [number, number], to: [number, number]): number {
  const dLat = to[0] - from[0];
  const dLng = to[1] - from[1];
  if (Math.abs(dLat) < 0.00001 && Math.abs(dLng) < 0.00001) return 0;
  const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
  return (angle + 360) % 360;
}

// Dynamic Map Auto-Pan & Vehicle Tracking component
const DynamicMapTracker = ({
  pickupCoords,
  dropCoords,
  driverCoords,
  vehiclePos,
  isLoaded,
  isAutoTracking,
  onUserInteract,
}: {
  pickupCoords?: [number, number];
  dropCoords?: [number, number];
  driverCoords?: [number, number];
  vehiclePos?: [number, number];
  isLoaded: boolean;
  isAutoTracking: boolean;
  onUserInteract?: () => void;
}) => {
  const map = useMap();
  const initialFitDoneRef = useRef(false);

  // Initial bounds fit once loaded
  useEffect(() => {
    if (!isLoaded || initialFitDoneRef.current) return;

    const validPoints: [number, number][] = [];
    if (pickupCoords && !isNaN(pickupCoords[0]) && !isNaN(pickupCoords[1])) validPoints.push(pickupCoords);
    if (dropCoords && !isNaN(dropCoords[0]) && !isNaN(dropCoords[1])) validPoints.push(dropCoords);
    if (driverCoords && !isNaN(driverCoords[0]) && !isNaN(driverCoords[1])) validPoints.push(driverCoords);
    if (vehiclePos && !isNaN(vehiclePos[0]) && !isNaN(vehiclePos[1])) validPoints.push(vehiclePos);

    if (validPoints.length > 0) {
      try {
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        initialFitDoneRef.current = true;
      } catch (e) {
        console.error("Initial fit bounds error:", e);
      }
    }
  }, [pickupCoords, dropCoords, driverCoords, vehiclePos, isLoaded, map]);

  // Listen for manual map panning or zooming by user
  useMapEvents({
    dragstart: () => {
      onUserInteract?.();
    },
    zoomstart: () => {
      onUserInteract?.();
    },
    movestart: () => {
      onUserInteract?.();
    },
  });

  // Dynamic map auto-panning as vehiclePos updates (throttled for fluid 60fps movement)
  const lastPanTimeRef = useRef<number>(0);
  useEffect(() => {
    if (!isAutoTracking || !vehiclePos || isNaN(vehiclePos[0]) || isNaN(vehiclePos[1])) return;

    const now = Date.now();
    if (now - lastPanTimeRef.current < 1200) return;
    lastPanTimeRef.current = now;

    try {
      map.panTo(vehiclePos, {
        animate: true,
        duration: 0.9,
        easeLinearity: 0.25,
      });
    } catch (e) {
      console.error("Auto pan error:", e);
    }
  }, [vehiclePos, isAutoTracking, map]);

  return null;
};

interface LiveJourneyTrackerProps {
  tripId: string;
  isSharedView?: boolean;
  onCloseTrackView?: () => void;
}

export const LiveJourneyTracker: React.FC<LiveJourneyTrackerProps> = ({
  tripId,
  isSharedView: isSharedProp,
  onCloseTrackView,
}) => {
  const { config } = useConfig();
  const [trip, setTrip] = useState<any>(null);

  const userPreferences = React.useMemo(() => {
    try {
      const saved = localStorage.getItem("user_contact_preferences");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { allowCalls: true, allowChat: true };
  }, []);

  // Check if current view is a shared tracking view (for friends/family)
  const isSharedFromUrl = React.useMemo(() => {
    if (typeof window === "undefined") return false;
    const search = window.location.search;
    const params = new URLSearchParams(search);
    return (
      params.get("shared") === "true" ||
      params.get("isShared") === "true" ||
      params.get("mode") === "shared" ||
      params.has("shared") ||
      params.has("isShared")
    );
  }, []);

  const isRiderOwner = React.useMemo(() => {
    if (!trip) return true; // Default to owner while loading so UI doesn't flicker
    try {
      const currentUserId = localStorage.getItem("ride-buddy-user-id");
      const storedProfileStr = localStorage.getItem("ride-buddy-user-profile");
      const currentProfile = storedProfileStr ? JSON.parse(storedProfileStr) : null;

      if (currentUserId && trip.userId && String(trip.userId) === String(currentUserId)) return true;
      if (currentProfile) {
        if (currentProfile.phone && trip.customer?.phone && currentProfile.phone === trip.customer.phone) return true;
        if (currentProfile.email && trip.customer?.email && currentProfile.email === trip.customer.email) return true;
        if (currentProfile.name && (trip.user === currentProfile.name || trip.customer?.name === currentProfile.name)) return true;
      }
    } catch (e) {}
    return false;
  }, [trip]);

  // Shared mode: true if URL has shared flag, or if prop is true, or if viewer is not the rider who booked the trip
  const isSharedMode = Boolean(isSharedProp || isSharedFromUrl || (trip && !isRiderOwner));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [copied, setCopied] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // New UI feature states
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isAutoTracking, setIsAutoTracking] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);
  const [riderToRate, setRiderToRate] = useState<any | null>(null);

  // Live animated vehicle location and rotation
  const [vehiclePos, setVehiclePos] = useState<[number, number] | null>(null);
  const [vehicleRotation, setVehicleRotation] = useState<number>(0);
  const [pathSequence, setPathSequence] = useState<[number, number][]>([]);
  const pathStepIndexRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const isRealGpsActiveRef = useRef<boolean>(false);
  const currentPosRef = useRef<[number, number] | null>(null);
  const currentRotRef = useRef<number>(0);

  // Synchronize ref with state
  useEffect(() => {
    currentPosRef.current = vehiclePos;
  }, [vehiclePos]);
  useEffect(() => {
    currentRotRef.current = vehicleRotation;
  }, [vehicleRotation]);

  // Smooth angle difference calculation (shortest turn to prevent 360 flip)
  const calcShortestAngle = (targetDeg: number, currentDeg: number) => {
    let diff = (targetDeg - currentDeg) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return currentDeg + diff;
  };

  // High-precision smooth animation from current position to new target coordinate
  const animateToPosition = useCallback((targetCoords: [number, number], targetHeading?: number, durationMs = 1200) => {
    if (!targetCoords || isNaN(targetCoords[0]) || isNaN(targetCoords[1])) return;
    isRealGpsActiveRef.current = true;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const startCoords: [number, number] = currentPosRef.current || targetCoords;
    const initialRot = currentRotRef.current;
    const computedHeading = targetHeading !== undefined ? targetHeading : calculateHeading(startCoords, targetCoords);
    const destinationRot = calcShortestAngle(computedHeading, initialRot);

    const startTime = performance.now();

    const frameStep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Quad ease-out curve for smooth vehicle deceleration into position
      const ease = 1 - (1 - progress) * (1 - progress);

      const lat = startCoords[0] + (targetCoords[0] - startCoords[0]) * ease;
      const lng = startCoords[1] + (targetCoords[1] - startCoords[1]) * ease;
      const rot = initialRot + (destinationRot - initialRot) * ease;

      setVehiclePos([lat, lng]);
      setVehicleRotation(rot);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(frameStep);
      } else {
        setVehiclePos(targetCoords);
        setVehicleRotation(destinationRot % 360);
      }
    };

    animFrameRef.current = requestAnimationFrame(frameStep);
  }, []);

  // Generate sequence of points for live vehicle movement based on trip status:
  // Phase 1 (Accepted/Arriving): Driver starting location -> Pickup (A)
  // Phase 2 (Started/Active): Pickup (A) -> Destination (B)
  useEffect(() => {
    if (!trip) return;
    const pCoords: [number, number] = trip.pickupCoords || [trip.pickup?.lat || 17.4474, trip.pickup?.lng || 78.3762];
    const dCoords: [number, number] = trip.dropCoords || [trip.drop?.lat || 17.2403, trip.drop?.lng || 78.4294];
    const drCoords: [number, number] = trip.driverCoords || (trip.driver?.lat && trip.driver?.lng ? [trip.driver.lat, trip.driver.lng] : null) || [pCoords[0] + 0.005, pCoords[1] - 0.005];

    const statusLower = (trip.status || "").toLowerCase();
    const subStatusLower = (trip.subStatus || "").toLowerCase();

    const isTripStarted =
      statusLower === "started" ||
      statusLower === "active" ||
      statusLower === "in-progress" ||
      statusLower === "live" ||
      subStatusLower === "started";

    const isTripCompleted =
      statusLower === "completed" ||
      statusLower === "delivered" ||
      statusLower === "arrived";

    if (isTripCompleted) {
      setVehiclePos(dCoords);
      setPathSequence([]);
      return;
    }

    const rawSeq: [number, number][] = [];

    if (isTripStarted) {
      // Vehicle travels from Pickup A to Destination B along the turn-by-turn route path
      if (routePath && routePath.length > 1) {
        rawSeq.push(...routePath);
      } else {
        const steps = 30;
        for (let i = 0; i <= steps; i++) {
          const r = i / steps;
          rawSeq.push([
            pCoords[0] + (dCoords[0] - pCoords[0]) * r,
            pCoords[1] + (dCoords[1] - pCoords[1]) * r,
          ]);
        }
      }
    } else {
      // Driver approaches Pickup A from their starting position
      const steps = 25;
      for (let i = 0; i <= steps; i++) {
        const r = i / steps;
        rawSeq.push([
          drCoords[0] + (pCoords[0] - drCoords[0]) * r,
          drCoords[1] + (pCoords[1] - drCoords[1]) * r,
        ]);
      }
    }

    // High-density sub-step interpolation for 60fps Uber-grade vehicle gliding
    const denseSeq: [number, number][] = [];
    for (let k = 0; k < rawSeq.length - 1; k++) {
      const ptA = rawSeq[k];
      const ptB = rawSeq[k + 1];
      const subCount = 4;
      for (let s = 0; s < subCount; s++) {
        const r = s / subCount;
        denseSeq.push([
          ptA[0] + (ptB[0] - ptA[0]) * r,
          ptA[1] + (ptB[1] - ptA[1]) * r,
        ]);
      }
    }
    if (rawSeq.length > 0) denseSeq.push(rawSeq[rawSeq.length - 1]);

    setPathSequence(denseSeq);
    if (!vehiclePos && denseSeq.length > 0) {
      setVehiclePos(denseSeq[0]);
      if (denseSeq.length > 1) {
        setVehicleRotation(calculateHeading(denseSeq[0], denseSeq[1]));
      }
    }
  }, [trip?.status, trip?.subStatus, trip?.driverCoords, routePath]);

  // Realistic Route Traversal Loop (Active when real driver updates are between GPS pings)
  useEffect(() => {
    if (pathSequence.length < 2) return;
    const isCancelled = (trip?.status || "").toLowerCase() === "cancelled";
    if (isCancelled) return;

    pathStepIndexRef.current = 0;

    const interval = setInterval(() => {
      // If real driver GPS updates are active, let real GPS govern position
      if (isRealGpsActiveRef.current) return;

      if (pathStepIndexRef.current < pathSequence.length - 1) {
        pathStepIndexRef.current += 1;
        const curr = pathSequence[pathStepIndexRef.current];
        const next = pathSequence[Math.min(pathStepIndexRef.current + 1, pathSequence.length - 1)];

        setVehiclePos(curr);
        if (curr && next) {
          const newHeading = calculateHeading(curr, next);
          setVehicleRotation((prev) => calcShortestAngle(newHeading, prev));
        }
      } else {
        // Arrived at destination / pickup point: hold position smoothly without looping back
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [pathSequence, trip?.status]);

  const handleDeliverySubmitInTracker = async (bookingId: string, rating: number, feedback: string) => {
    try {
      await fetch(`/api/trips/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "delivered",
          driverRating: rating,
          driverFeedback: feedback,
        }),
      });
      setTrip((prev: any) => ({
        ...prev,
        status: "delivered",
        driverRating: rating,
        driverFeedback: feedback,
      }));
      showTrackingNotification(`Rider marked delivered! Rating ⭐ ${rating} saved.`);
    } catch (err) {
      showTrackingNotification("Failed to save rider rating.");
    }
  };
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "driver"; text: string; time: string }>
  >([
    {
      sender: "driver",
      text: "Hello! I am assigned to your ride. Let me know if you need any assistance.",
      time: "Just now",
    },
  ]);
  const [chatInputText, setChatInputText] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  // Status mapping to human titles
  const getStatusDisplay = (status: string, subStatus?: string) => {
    const s = (status || "").toLowerCase();
    const sub = (subStatus || "").toLowerCase();

    if (s === "pending" || s === "searching") {
      return {
        title: "Searching Match",
        desc: "Matching with travel companions...",
        badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        isStarted: false,
      };
    }
    if (s === "cancelled") {
      return {
        title: "Trip Cancelled",
        desc: "This journey was cancelled.",
        badgeColor: "bg-red-500/10 text-red-500 border-red-500/20",
        isStarted: false,
      };
    }
    if (s === "completed") {
      return {
        title: "Ride Completed",
        desc: "Rider reached destination safely!",
        badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        isStarted: true,
      };
    }
    if (sub === "arrived") {
      return {
        title: "Driver Arrived",
        desc: "Driver is waiting at the pickup spot.",
        badgeColor: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
        isStarted: false,
      };
    }
    if (s === "active" || sub === "arriving") {
      return {
        title: "Driver Arriving",
        desc: "Driver is picking up the passenger.",
        badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        isStarted: false,
      };
    }
    if (s === "started" || s === "live" || sub === "started" || s === "in-progress") {
      return {
        title: "Ride in Progress",
        desc: "En route to dropoff destination safely.",
        badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        isStarted: true,
      };
    }

    return {
      title: "Active Journey",
      desc: "Following journey updates in real-time.",
      badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      isStarted: false,
    };
  };

  // Helper to fetch the trip initial state from the API list or fallback
  const fetchTripData = async () => {
    let targetTrip = null;
    try {
      const res = await fetch("/api/trips");
      if (res.ok) {
        const allTrips = await res.json();
        targetTrip = allTrips.find((t: any) => t.id === tripId);
      }
    } catch (err) {
      console.warn("API trips fetch error, falling back to local search:", err);
    }

    if (!targetTrip) {
      // Check client-side storage for scheduled or posted rides
      try {
        const stored = localStorage.getItem("app_all_trips") || localStorage.getItem("postedRides");
        if (stored) {
          const parsed = JSON.parse(stored);
          targetTrip = parsed.find((t: any) => t.id === tripId);
        }
      } catch (e) {}
    }

    if (!targetTrip) {
      // Dynamic fallback trip details for external shared links
      const numericSeed = (tripId || "").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const generatedOtp = (numericSeed % 9000) + 1000;
      targetTrip = {
        id: tripId,
        type: "Scheduled",
        status: "scheduled",
        pickup: { address: "Hitec City Metro Station, Hyderabad", lat: 17.4474, lng: 78.3762 },
        drop: { address: "Rajiv Gandhi International Airport (HYD)", lat: 17.2403, lng: 78.4294 },
        pickupCoords: [17.4474, 78.3762],
        dropCoords: [17.2403, 78.4294],
        distance: "32.5 km",
        duration: "45 mins",
        date: "Today",
        time: "06:30 PM",
        otp: generatedOtp,
        driver: {
          name: "Kabir Malhotra",
          phone: "+91 98765 43210",
          rating: "4.9",
          vehicle: "Sedan",
          plate: "TS 08 ET 4920",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          lat: 17.4480,
          lng: 78.3820,
        },
        customer: {
          name: "Rider",
          phone: "+91 91234 56789",
        }
      };
    }

    if (targetTrip) {
      const pLat = targetTrip.pickupCoords?.[0] || targetTrip.pickup?.lat;
      const pLng = targetTrip.pickupCoords?.[1] || targetTrip.pickup?.lng;
      const dLat = targetTrip.dropCoords?.[0] || targetTrip.drop?.lat;
      const dLng = targetTrip.dropCoords?.[1] || targetTrip.drop?.lng;

      if (pLat && pLng && dLat && dLng) {
        const kmVal = (getHaversineDistance(pLat, pLng, dLat, dLng) * 1.25).toFixed(1);
        const parsedKm = parseFloat(kmVal) || 12.5;

        if (!targetTrip.distance || targetTrip.distance === "12.5 km" || targetTrip.distance === "0.1 km") {
          targetTrip.distance = `${parsedKm} km`;
        }
        if (!targetTrip.duration || targetTrip.duration === "24 mins" || targetTrip.duration === "1 MIN") {
          const mins = Math.max(5, Math.round((parsedKm / (parsedKm > 50 ? 50 : 28)) * 60));
          targetTrip.duration = formatDurationMinutes(mins);
        }
        if (!targetTrip.price && !targetTrip.fare) {
          const isIntercity = parsedKm >= 50;
          targetTrip.price = secureCalculateFare(parsedKm, isIntercity ? 15 : 18, 1.0, isIntercity ? 100 : 40);
        }
      }
    }

    setTrip(targetTrip);
    setError(null);

    // Build route path
    const pCoords = targetTrip.pickupCoords || [targetTrip.pickup?.lat || 17.4474, targetTrip.pickup?.lng || 78.3762];
    const dCoords = targetTrip.dropCoords || [targetTrip.drop?.lat || 17.2403, targetTrip.drop?.lng || 78.4294];
    if (pCoords[0] && dCoords[0]) {
      try {
        const route = await routingService.getRoute(pCoords, dCoords);
        if (route && route.coordinates) {
          setRoutePath(route.coordinates);
        }
      } catch (rErr) {
        // Fallback straight line polyline
        setRoutePath([pCoords, dCoords]);
      }
    }
    setLoading(false);
  };

  // Setup Socket.io listening and join the specific trip room
  useEffect(() => {
    fetchTripData();

    // Establish WebSocket Sync
    if (!socketRef.current) {
      socketRef.current = io(window.location.origin, {
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });
    }

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("[TRACKING SOCKET] Connected to tracking server");
      socket.emit("join_trip_room", tripId);
    });

    // Real-time GPS movement broadcast from Driver's device
    socket.on("driver_update", (d: any) => {
      if (d && Array.isArray(d.coords) && d.coords.length >= 2 && !isNaN(d.coords[0]) && !isNaN(d.coords[1])) {
        // Verify driver belongs to this trip
        const assignedDriverId = trip?.driver?.id || trip?.acceptedBy || trip?.driverId;
        if (!assignedDriverId || d.id === assignedDriverId || d.driverId === assignedDriverId) {
          animateToPosition(d.coords, typeof d.rotation === "number" ? d.rotation : d.heading, 1200);
        }
      }
    });

    socket.on("active_trip_update", (updatedTrip: any) => {
      if (updatedTrip && (updatedTrip.id === tripId || updatedTrip._id === tripId)) {
        if (Array.isArray(updatedTrip.driverCoords) && !isNaN(updatedTrip.driverCoords[0]) && !isNaN(updatedTrip.driverCoords[1])) {
          animateToPosition(updatedTrip.driverCoords, updatedTrip.driverRotation, 1200);
        }
      }
    });

    socket.on("trip_update", (updatedTrip: any) => {
      if (updatedTrip.id === tripId) {
        if (Array.isArray(updatedTrip.driverCoords) && !isNaN(updatedTrip.driverCoords[0]) && !isNaN(updatedTrip.driverCoords[1])) {
          animateToPosition(updatedTrip.driverCoords, updatedTrip.driverRotation, 1200);
        }
        setTrip((prev: any) => {
          if (prev && prev.status !== updatedTrip.status) {
            const display = getStatusDisplay(updatedTrip.status, updatedTrip.subStatus);
            showTrackingNotification(`Ride Status: ${display.title}`);
          }
          return updatedTrip;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [tripId, trip?.driver?.id, trip?.acceptedBy, trip?.driverId, animateToPosition]);

  const showTrackingNotification = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => setActiveNotification(null), 4000);
  };

  const copyShareLink = async () => {
    const url = `${window.location.origin}?trackTripId=${tripId}&shared=true`;
    const pAddr =
      trip?.pickup?.address ||
      (typeof trip?.pickup === "string" ? trip?.pickup : trip?.pickupAddress || trip?.from || "Pickup");
    const dAddr =
      trip?.drop?.address ||
      (typeof trip?.drop === "string" ? trip?.drop : trip?.dropAddress || trip?.to || "Drop");
    const driverName = trip?.driver?.name || "Assigned Driver";
    const plate = trip?.driver?.plate || "";
    const vehicle = trip?.driver?.vehicle || "Vehicle";
    const schedTime = `${trip?.date || "Today"} ${trip?.time || ""}`.trim();

    const shareTextOnly = `🚖 Track my scheduled ride on TaxiApp!\n📍 Pickup: ${pAddr}\n🏁 Dropoff: ${dAddr}\n⏰ Scheduled Time: ${schedTime}\n🚘 Driver: ${driverName} - ${vehicle} ${plate ? `[${plate}]` : ""}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Track My Scheduled Ride",
          text: shareTextOnly,
          url: url,
        });
        showTrackingNotification("Ride tracking details shared with friends!");
        return;
      } catch (e) {
        // User cancelled share dialog
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareTextOnly}\n📍 Live Map Tracking Link: ${url}`);
      setCopied(true);
      showTrackingNotification("Tracking link & ride details copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      showTrackingNotification("Tracking link: " + url);
    }
  };

  const handleCancelRide = async () => {
    setCancelling(true);
    try {
      await fetch(`/api/trips/${tripId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      setTrip((prev: any) => ({ ...prev, status: "cancelled" }));
      setShowCancelModal(false);
      showTrackingNotification("Ride cancelled successfully.");
    } catch (err) {
      showTrackingNotification("Failed to cancel ride.");
    } finally {
      setCancelling(false);
    }
  };

  const handleSendChatMessage = () => {
    if (!chatInputText.trim()) return;
    const newMsg = {
      sender: "user" as const,
      text: chatInputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInputText("");

    // Simulate driver reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "driver",
          text: "Thanks for the message! I am currently en route.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  // Marker icon builders
  const getStartIcon = () => {
    return L.divIcon({
      className: "custom-vehicle-marker",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-7 h-7 bg-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-black text-[9px] uppercase tracking-tighter">
            START
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const getPickupIcon = () => {
    const scale = (config?.map?.pickupIconScale ?? 1.0) * 0.8;
    const finalSize = Math.round(35 * scale);
    return L.divIcon({
      className: "bg-transparent",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 bg-emerald-500/35 rounded-full animate-ping" style="animation-duration: 2s"></div>
          <div class="absolute w-6 h-6 bg-emerald-500/20 rounded-full animate-pulse"></div>
          <div class="relative z-10 flex items-center justify-center drop-shadow-md">
            <div class="w-[26px] h-[26px] bg-emerald-600 border-2 border-white text-white rounded-full flex items-center justify-center shadow-md font-black text-[11px] tracking-tighter">
              A
            </div>
          </div>
        </div>
      `,
      iconSize: [finalSize, finalSize],
      iconAnchor: [Math.round(finalSize / 2), Math.round(finalSize / 2)],
    });
  };

  const getDropIcon = () => {
    const scale = (config?.map?.dropoffIconScale ?? 1.0) * 0.8;
    const finalSize = Math.round(35 * scale);
    return L.divIcon({
      className: "bg-transparent",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 border-2 border-dashed border-rose-500/80 rounded-full animate-spin" style="animation-duration: 7s"></div>
          <div class="absolute w-6 h-6 bg-rose-500/30 rounded-full animate-ping" style="animation-duration: 2.2s"></div>
          <div class="relative z-10 flex items-center justify-center drop-shadow-md">
            <div class="w-[26px] h-[26px] bg-rose-600 border-2 border-white text-white rounded-full flex items-center justify-center shadow-md font-black text-[11px] tracking-tighter">
              B
            </div>
          </div>
        </div>
      `,
      iconSize: [finalSize, finalSize],
      iconAnchor: [Math.round(finalSize / 2), Math.round(finalSize / 2)],
    });
  };

  const getVehicleMarkerIcon = (type: string, rotation = 0) => {
    const configVehicles = config.vehicles || [];
    const t = (type || "").toUpperCase();
    const found = configVehicles.find(
      (v: any) =>
        v.type === t ||
        v.id === type.toLowerCase() ||
        (t === "CAR" && (v.id === "mini" || v.id === "sedan" || v.id === "suv"))
    );

    const hasCustomUpload =
      found?.mapIcon ||
      found?.image ||
      (t === "BIKE" ? config?.map?.bikeIconUrl : null) ||
      (t === "AUTO" ? config?.map?.autoIconUrl : null) ||
      config?.map?.vehicleIconUrl;

    const svgContent = getTopViewVehicleSVG(type, t === "BIKE" ? "#10b981" : "#f59e0b");

    return L.divIcon({
      className: "uber-vehicle-marker",
      html: `
        <div class="relative flex items-center justify-center select-none" style="width: 50px; height: 50px;">
          <!-- GPS Pulse Aura -->
          <div class="absolute w-10 h-10 bg-emerald-500/15 rounded-full animate-ping pointer-events-none" style="animation-duration: 2.8s"></div>
          <div class="absolute w-7 h-7 bg-amber-500/20 rounded-full animate-pulse pointer-events-none"></div>

          <!-- Rotating Top-Down Vehicle Body aligned with heading -->
          <div class="uber-vehicle-body relative z-20 flex items-center justify-center drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]" 
               style="width: 44px; height: 44px; transform: rotate(${rotation}deg);">
            ${hasCustomUpload ? `
              <img src="${hasCustomUpload}" class="w-full h-full object-contain" referrerPolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
              <div style="display: none;" class="w-full h-full">${svgContent}</div>
            ` : svgContent}
          </div>
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[10000] bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
        <h3 className="text-sm font-black uppercase tracking-widest text-amber-400">
          Connecting to Live Tracker...
        </h3>
        <p className="text-xs text-slate-400 mt-1">Retrieving journey parameters...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="fixed inset-0 z-[10000] bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-black uppercase tracking-wide text-white">
          Journey Unavailable
        </h3>
        <p className="text-xs text-slate-400 max-w-xs mt-2 leading-relaxed">
          {error || "We couldn't locate this trip in our active tracking registry."}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              setLoading(true);
              fetchTripData();
            }}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg"
          >
            Retry Connection
          </button>
          {onCloseTrackView && (
            <button
              onClick={onCloseTrackView}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer border border-white/10"
            >
              Go to App
            </button>
          )}
        </div>
      </div>
    );
  }

  const pCoords = trip.pickupCoords || [trip.pickup?.lat || 17.4474, trip.pickup?.lng || 78.3762];
  const dCoords = trip.dropCoords || [trip.drop?.lat || 17.2403, trip.drop?.lng || 78.4294];
  const drCoords = trip.driverCoords || (trip.driver?.lat && trip.driver?.lng ? [trip.driver.lat, trip.driver.lng] : null) || [pCoords[0] + 0.006, pCoords[1] - 0.005];
  const statusInfo = getStatusDisplay(trip.status, trip.subStatus);

  const pickupAddr =
    trip.pickup?.address ||
    (typeof trip.pickup === "string" ? trip.pickup : trip.pickupAddress || trip.from || "Pickup Location");
  const dropoffAddr =
    trip.drop?.address ||
    (typeof trip.drop === "string" ? trip.drop : trip.dropAddress || trip.to || "Dropoff Location");
  const driverStartAddr =
    trip.driver?.locationName || trip.driverStartLocation || trip.from || "Driver Start Point";

  const isRideStarted =
    (trip.status || "").toLowerCase() === "started" ||
    (trip.status || "").toLowerCase() === "active" ||
    (trip.status || "").toLowerCase() === "in-progress" ||
    (trip.subStatus || "").toLowerCase() === "started";

  const isCancelled = (trip.status || "").toLowerCase() === "cancelled";

  return (
    <div className="absolute inset-0 z-[1000] bg-canvas flex flex-col overflow-hidden select-none">
      {/* Banner Notifications */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-4 left-4 right-4 z-[10002] bg-slate-900 border border-white/10 text-white p-4 rounded-2xl flex items-center gap-3 shadow-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
              <Clock size={16} className="animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                Tracker Notification
              </p>
              <p className="text-xs font-bold">{activeNotification}</p>
            </div>
            <button
              onClick={() => setActiveNotification(null)}
              className="text-white/40 hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar - Clean TaxiApp Branding, No Active Journey Tag */}
      <header className="bg-surface-card border-b border-hairline-soft px-5 py-3.5 flex items-center justify-between shadow-xs shrink-0 z-[1001]">
        <div className="flex items-center gap-3">
          {onCloseTrackView && (
            <button
              onClick={onCloseTrackView}
              className="w-9 h-9 rounded-full bg-surface-soft hover:bg-surface-soft/80 flex items-center justify-center text-ink border border-hairline-soft cursor-pointer active:scale-95 transition-all"
              title="Close Tracker"
            >
              <X size={16} />
            </button>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15] animate-pulse" />
              <h1 className="text-base font-black uppercase tracking-tight italic text-ink leading-none">
                {config.general?.platformName || "TaxiApp"}
              </h1>
            </div>
            <p className="text-[9px] font-black tracking-widest text-ash uppercase mt-0.5 leading-none">
              {isSharedMode ? "Shared Journey Tracker" : "Live Journey Tracker"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[9.5px] font-black uppercase px-3 py-1.5 rounded-full border shadow-3xs ${statusInfo.badgeColor}`}
          >
            {statusInfo.title}
          </span>
        </div>
      </header>

      {/* Map Container with Maximise/Minimise and Recenter */}
      <div className={`relative bg-surface-soft transition-all duration-300 ${isMapExpanded ? "flex-1 h-full" : "h-[42vh] sm:h-[48vh] shrink-0"}`}>
        <MapContainer
          center={drCoords && !isNaN(drCoords[0]) ? drCoords : pCoords && !isNaN(pCoords[0]) ? pCoords : [17.385, 78.4867]}
          zoom={14}
          className="h-full w-full"
          zoomControl={false}
          preferCanvas={false}
        >
          <TileLayer
            url={getResolvedTileUrl(config.map)}
            className={getTileLayerClassName(config.map)}
            subdomains="abc"
            maxZoom={19}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <DynamicMapTracker
            pickupCoords={pCoords}
            dropCoords={dCoords}
            driverCoords={drCoords}
            vehiclePos={vehiclePos || drCoords}
            isLoaded={true}
            isAutoTracking={isAutoTracking}
            onUserInteract={() => setIsAutoTracking(false)}
          />

          {/* Leg 1: Driver Start to Pickup Point Polyline */}
          {drCoords && pCoords && !isNaN(drCoords[0]) && !isNaN(pCoords[0]) && (
            <Polyline
              positions={[drCoords, pCoords]}
              color="#3b82f6"
              weight={4}
              dashArray="6, 6"
              opacity={0.85}
            />
          )}

          {/* Leg 2: Pickup to Destination Point Polyline */}
          {routePath.length > 1 ? (
            <Polyline
              positions={routePath}
              color={config.map?.riderToDestColor || config.map?.roadHighlightColor || "#FACC15"}
              weight={config.map?.roadHighlightWeight ?? 5}
              opacity={config.map?.roadHighlightOpacity ?? 0.9}
            />
          ) : pCoords && dCoords && !isNaN(pCoords[0]) && !isNaN(dCoords[0]) && (
            <Polyline
              positions={[pCoords, dCoords]}
              color="#FACC15"
              weight={5}
              opacity={0.9}
            />
          )}

          {/* 1. Driver Start Point Marker */}
          {drCoords && !isNaN(drCoords[0]) && !isNaN(drCoords[1]) && (
            <Marker position={drCoords} icon={getStartIcon()}>
              <Popup>
                <div className="p-1 font-sans text-xs">
                  <p className="font-extrabold text-blue-600 flex items-center gap-1">📍 Driver Start Point</p>
                  <p className="text-[10px] text-gray-700 font-bold mt-0.5">{driverStartAddr}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* 2. Pickup Point Marker (A) */}
          {pCoords && !isNaN(pCoords[0]) && (
            <Marker position={pCoords} icon={getPickupIcon()}>
              <Popup>
                <div className="p-1 font-sans text-xs">
                  <p className="font-extrabold text-emerald-600 flex items-center gap-1">🟢 Rider Pickup Point (A)</p>
                  <p className="text-[10px] text-gray-700 font-bold mt-0.5">{pickupAddr}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* 3. Destination Point Marker (B) */}
          {dCoords && !isNaN(dCoords[0]) && (
            <Marker position={dCoords} icon={getDropIcon()}>
              <Popup>
                <div className="p-1 font-sans text-xs">
                  <p className="font-extrabold text-rose-600 flex items-center gap-1">🔴 Rider Destination Point (B)</p>
                  <p className="text-[10px] text-gray-700 font-bold mt-0.5">{dropoffAddr}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* 4. LIVE ANIMATED VEHICLE MARKER */}
          {(vehiclePos || drCoords) && !isNaN((vehiclePos || drCoords)![0]) && (
            <Marker
              position={vehiclePos || drCoords}
              icon={getVehicleMarkerIcon(
                trip.driver?.type || trip.rideType || "CAR",
                vehicleRotation
              )}
              zIndexOffset={3000}
            >
              <Popup>
                <div className="p-1 font-sans text-xs">
                  <p className="font-extrabold text-amber-600 flex items-center gap-1">🚗 Assigned Live Vehicle</p>
                  <p className="text-[10px] text-gray-700 font-bold mt-0.5">{trip.driver?.name || "Driver"} &bull; {trip.driver?.plate || "TS 08 ET 4920"}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Map Floating Controls: Maximize/Minimize & Recenter Side-by-Side */}
        <div className="absolute bottom-3 right-3 z-[999] flex items-center gap-2.5">
          <button
            onClick={() => setIsMapExpanded(!isMapExpanded)}
            className="w-10 h-10 bg-white text-secondary border border-hairline-soft rounded-full shadow-lg flex items-center justify-center backdrop-blur-md active:scale-90 transition-all cursor-pointer hover:border-amber-400"
            title={isMapExpanded ? "Minimise Map View" : "Maximise Map View"}
            aria-label={isMapExpanded ? "Minimise Map View" : "Maximise Map View"}
          >
            {isMapExpanded ? (
              <Minimize2 size={18} className="stroke-[2.5] text-secondary" />
            ) : (
              <Maximize2 size={18} className="stroke-[2.5] text-secondary" />
            )}
          </button>

          <button
            onClick={() => {
              const mapEl = document.querySelector(".leaflet-container");
              const activeVehiclePos = vehiclePos || drCoords;
              if (mapEl && (mapEl as any)._leaflet_map) {
                const mapObj = (mapEl as any)._leaflet_map;
                if (activeVehiclePos && !isNaN(activeVehiclePos[0])) {
                  mapObj.panTo(activeVehiclePos, { animate: true, duration: 0.5 });
                } else if (pCoords && dCoords) {
                  const bounds = L.latLngBounds([pCoords, dCoords]);
                  mapObj.fitBounds(bounds, { padding: [50, 50] });
                }
              }
              setIsAutoTracking(true);
              showTrackingNotification("Auto-Pan & Vehicle Tracking Re-enabled");
            }}
            className="w-10 h-10 bg-white text-secondary border border-hairline-soft rounded-full shadow-lg flex items-center justify-center backdrop-blur-md active:scale-90 transition-all cursor-pointer hover:border-amber-400"
            title="Recenter Vehicle"
            aria-label="Recenter Vehicle"
          >
            <Navigation size={18} className="transform rotate-45 fill-current text-secondary" />
          </button>
        </div>
      </div>

      {/* Journey Panel Overlay */}
      <div className={`bg-surface-card border-t border-hairline shadow-2xl px-5 py-4 overflow-y-auto shrink-0 z-[1000] flex-1 flex flex-col justify-between ${isMapExpanded ? "max-h-[220px]" : ""}`}>
        <div>
          {/* Scheduled Banner & Ride Status (Started or Not Started) */}
          <div className="mb-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 rounded-2xl p-3 flex flex-col gap-2 shadow-3xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Calendar size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-[11px] font-black uppercase tracking-wide text-amber-900 dark:text-amber-200 truncate">
                  Scheduled Ride: {trip.date || "Today"} {trip.time ? `at ${trip.time}` : ""}
                </span>
              </div>
              <span className="bg-amber-500 text-slate-950 text-[8.5px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-widest shrink-0 shadow-3xs">
                SCHEDULED
              </span>
            </div>

            {/* Ride Status: Started or Not Started */}
            <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between">
              <span className="text-[9.5px] font-black text-amber-900/80 dark:text-amber-300 uppercase tracking-wider">
                Ride Status
              </span>
              <span
                className={`text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-3xs ${
                  isCancelled
                    ? "bg-rose-500 text-white"
                    : isRideStarted
                      ? "bg-emerald-500 text-white animate-pulse"
                      : "bg-slate-950 text-amber-400"
                }`}
              >
                {isCancelled
                  ? "✕ Trip Cancelled"
                  : isRideStarted
                    ? "● Ride Started"
                    : "○ Not Started Yet"}
              </span>
            </div>
          </div>

          {/* Attractive & Prominent Trip Code (OTP) - ONLY VISIBLE TO RIDER */}
          {!isSharedMode && (
            <div className="bg-gradient-to-r from-amber-400 via-[#FACC15] to-yellow-300 text-slate-950 p-3.5 rounded-2xl flex items-center justify-between mb-3.5 shadow-sm border border-amber-300/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-950/10 flex items-center justify-center text-slate-950 font-bold shrink-0">
                  <Shield size={18} />
                </div>
                <div>
                  <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-900/80 block leading-none">
                    Trip Verification Code (OTP)
                  </span>
                  <span className="text-xl font-black uppercase tracking-[0.2em] font-mono text-slate-950 leading-tight block mt-0.5">
                    {trip.otp || (trip.id ? String(trip.id).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 9000 + 1000 : 4829)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const otpVal = trip.otp || (trip.id ? String(trip.id).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 9000 + 1000 : 4829);
                  navigator.clipboard.writeText(String(otpVal));
                  showTrackingNotification("Trip OTP copied to clipboard!");
                }}
                className="px-3 py-1.5 bg-slate-950 text-white hover:bg-slate-900 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all shadow-3xs cursor-pointer shrink-0"
              >
                <Copy size={11} />
                <span>COPY</span>
              </button>
            </div>
          )}

          {/* Driver Start, Pickup, and Destination Timeline Card */}
          <div className="bg-surface-soft dark:bg-slate-900/70 p-3.5 rounded-2xl border border-hairline-soft mb-3.5 space-y-2.5">
            {/* Step 1: Driver Start Point */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-500/20 flex items-center justify-center text-white text-[8px] font-black">
                  <Car size={9} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider block leading-none">
                  Driver Start Point
                </span>
                <p className="text-xs font-black text-ink leading-tight truncate mt-0.5">
                  {driverStartAddr}
                </p>
              </div>
            </div>

            <div className="flex items-center pl-1.5 gap-3">
              <div className="w-0.5 h-3 bg-blue-300 dark:bg-blue-800 rounded-full" />
            </div>

            {/* Step 2: Rider Pickup Point */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 flex items-center justify-center text-white text-[8px] font-black">
                  A
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block leading-none">
                  Rider Pickup Point
                </span>
                <p className="text-xs font-black text-ink leading-tight truncate mt-0.5">
                  {pickupAddr}
                </p>
              </div>
            </div>

            {/* In-Between Distance & Duration Indicator */}
            <div className="flex items-center pl-1.5 gap-3">
              <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-500 via-amber-400 to-rose-500 rounded-full" />
              <div className="flex items-center gap-2 px-3 py-0.5 bg-surface-card dark:bg-slate-800 rounded-full border border-hairline-soft shadow-3xs">
                <Clock size={10} className="text-amber-500 shrink-0" />
                <span className="text-[9.5px] font-extrabold text-ink">
                  {trip.duration || "15 mins"}
                </span>
                <span className="text-slate-300 dark:text-slate-700 font-bold">&bull;</span>
                <Navigation size={9} className="text-sky-500 shrink-0 transform rotate-45" />
                <span className="text-[9.5px] font-extrabold text-ink">
                  {trip.distance || "12.5 km"}
                </span>
              </div>
            </div>

            {/* Step 3: Rider Destination Point */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-rose-500 ring-4 ring-rose-500/20 flex items-center justify-center text-white text-[8px] font-black">
                  B
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8.5px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider block leading-none">
                  Rider Destination Point
                </span>
                <p className="text-xs font-black text-ink leading-tight truncate mt-0.5">
                  {dropoffAddr}
                </p>
              </div>
            </div>
          </div>

          {/* Estimated Fare & Payment Method Row */}
          <div className="bg-surface-soft dark:bg-slate-900/90 p-3 rounded-2xl border border-hairline-soft mb-3.5 flex items-center justify-between">
            <div>
              <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-0.5">
                APPROX
              </span>
              <span className="text-lg font-black text-ink italic tracking-tight leading-none block">
                ₹{trip.price || trip.fare || 350}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/40">
                {trip.paymentMethod || "CASH ON TRIP"}
              </span>
            </div>
          </div>

          {/* Driver Details Card with Call and Chat */}
          {trip.driver ? (
            <div className="flex items-center justify-between bg-zinc-950 p-3.5 rounded-3xl text-white mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={trip.driver.avatar || "https://picsum.photos/seed/driver/100/100"}
                  alt="Driver profile"
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-2xl object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-black uppercase tracking-tight text-white italic leading-none truncate">
                    {trip.driver.name}
                  </h4>
                  <p className="text-[9px] font-bold tracking-widest text-[#FACC15] uppercase mt-1 truncate">
                    ★ {trip.driver.rating || "4.9"} &bull; {trip.driver.vehicle || "Cab Vehicle"}
                  </p>
                  <p className="text-[10px] font-mono tracking-widest text-emerald-400 mt-0.5 uppercase font-black truncate">
                    {trip.driver.plate || "MH12 AB 1234"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Call Driver Button */}
                {userPreferences.allowCalls && (
                  <a
                    href={`tel:${trip.driver.phone || "9988776655"}`}
                    className="w-10 h-10 rounded-2xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center border border-white/10 text-[#FACC15] active:scale-95 transition-all"
                    aria-label="Call driver"
                    title="Call Driver"
                  >
                    <Phone size={16} />
                  </a>
                )}

                {/* Chat with Driver Button */}
                {userPreferences.allowChat && (
                  <button
                    onClick={() => setShowChatModal(true)}
                    className="w-10 h-10 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 flex items-center justify-center text-sky-400 active:scale-95 transition-all cursor-pointer"
                    aria-label="Chat with driver"
                    title="Chat with Driver"
                  >
                    <MessageSquare size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-surface-soft border border-hairline-soft p-3.5 rounded-3xl flex flex-col gap-3 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {trip.customer?.avatar ? (
                    <img
                      src={trip.customer.avatar}
                      alt={trip.customer?.name || trip.user || "Rider"}
                      className="w-10 h-10 rounded-2xl object-cover border border-hairline-soft shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-[#FACC15]/20 flex items-center justify-center text-amber-500 font-black text-xs">
                      {(trip.customer?.name || trip.user || "Rider").substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-black uppercase text-ink italic leading-none">
                      {trip.customer?.name || trip.user || "Rider Partner"}
                    </h4>
                    <p className="text-[9.5px] font-bold text-ash mt-1 flex items-center gap-1">
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <span>{trip.customer?.rating || 4.9} &bull; {trip.seats || 1} seat(s) requested</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {userPreferences.allowCalls && (
                    <a
                      href={`tel:${trip.customer?.phone || "9988776655"}`}
                      className="w-9 h-9 rounded-2xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center border border-white/10 text-[#FACC15] active:scale-95 transition-all"
                      title="Call Rider"
                    >
                      <Phone size={14} />
                    </a>
                  )}
                  {userPreferences.allowChat && (
                    <button
                      onClick={() => setShowChatModal(true)}
                      className="w-9 h-9 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 flex items-center justify-center text-sky-400 active:scale-95 transition-all cursor-pointer"
                      title="Chat Rider"
                    >
                      <MessageSquare size={14} />
                    </button>
                  )}
                </div>
              </div>

              {trip.status === "delivered" || trip.status === "completed" ? (
                <div className="w-full h-10 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-[10.5px] uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>RIDER DROPPED (⭐ {trip.driverRating || 5})</span>
                </div>
              ) : (
                <button
                  onClick={() => setRiderToRate(trip)}
                  className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10.5px] uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  <CheckCircle2 size={15} />
                  <span>MARK DROPPED & RATE RIDER</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Action Section: CANCEL RIDE & SHARE RIDE - ONLY VISIBLE TO RIDER */}
        {!isSharedMode && (
          <div className="pt-2.5 border-t border-hairline-soft flex gap-2.5 w-full">
            {!isCancelled && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="flex-1 h-11 bg-rose-50 hover:bg-rose-100/80 text-rose-600 rounded-2xl flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider border border-rose-200/80 active:scale-95 transition-all cursor-pointer shadow-3xs"
              >
                <X size={13} strokeWidth={2.5} />
                <span>CANCEL RIDE</span>
              </button>
            )}

            <button
              onClick={copyShareLink}
              className="flex-1 h-11 bg-[#FACC15] hover:bg-[#E2B90D] text-slate-950 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider border border-[#FACC15] shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 size={14} className="text-slate-950" />
                  <span>LINK COPIED</span>
                </>
              ) : (
                <>
                  <Share2 size={13} className="text-slate-950 shrink-0" />
                  <span>SHARE RIDE</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Built-in Chat Drawer / Modal */}
      <AnimatePresence>
        {showChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10005] bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="w-full max-w-lg bg-surface-card border-t sm:border border-hairline rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[80vh] max-h-[600px] overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-slate-950 p-4 text-white flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={trip?.driver?.avatar || "https://picsum.photos/seed/driver/100/100"}
                      alt="Driver"
                      className="w-10 h-10 rounded-2xl object-cover border border-white/20"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wide text-white">
                      Chat with {trip?.driver?.name || "Driver"}
                    </h3>
                    <p className="text-[9px] font-bold text-amber-400 uppercase tracking-widest mt-0.5">
                      {trip?.driver?.vehicle || "Vehicle"} &bull; Online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-soft">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#FACC15] text-slate-950 rounded-br-none font-bold"
                          : "bg-surface-card text-ink border border-hairline-soft rounded-bl-none shadow-3xs"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[8.5px] font-bold text-ash mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Reply Chips */}
              <div className="p-2.5 bg-surface-card border-t border-hairline-soft flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
                {["I am waiting at pickup", "Where are you?", "On my way!", "Thank you!"].map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setChatInputText(chip);
                    }}
                    className="px-3 py-1 bg-surface-soft hover:bg-amber-500/10 hover:border-amber-500/30 text-ink text-[10px] font-bold rounded-full border border-hairline-soft whitespace-nowrap active:scale-95 transition-all cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-surface-card border-t border-hairline-soft flex gap-2 items-center shrink-0">
                <input
                  type="text"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                  placeholder="Type a message to driver..."
                  className="flex-1 h-10 bg-surface-soft border border-hairline-soft rounded-xl px-3.5 text-xs text-ink focus:outline-none focus:border-amber-500 font-medium"
                />
                <button
                  onClick={handleSendChatMessage}
                  className="w-10 h-10 bg-[#FACC15] hover:bg-[#E2B90D] text-slate-950 rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  <Send size={15} className="transform translate-x-0.5 -translate-y-0.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Built-in Cancel Ride Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10006] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-surface-card border border-hairline rounded-3xl p-5 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mx-auto flex items-center justify-center mb-3">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-black uppercase text-ink tracking-tight">
                Cancel Scheduled Ride?
              </h3>
              <p className="text-xs text-ash mt-1.5 leading-relaxed">
                Are you sure you want to cancel this trip? Your assigned driver will be notified.
              </p>

              <div className="mt-5 flex gap-2.5">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 h-10 bg-surface-soft hover:bg-surface-soft/80 text-ink font-black text-xs uppercase tracking-wider rounded-xl border border-hairline-soft cursor-pointer"
                >
                  Keep Ride
                </button>
                <button
                  onClick={handleCancelRide}
                  disabled={cancelling}
                  className="flex-1 h-10 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md active:scale-95 transition-all flex items-center justify-center"
                >
                  {cancelling ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <RiderRatingDeliveryModal
        booking={riderToRate}
        isOpen={Boolean(riderToRate)}
        onClose={() => setRiderToRate(null)}
        onSubmitDelivery={handleDeliverySubmitInTracker}
      />
    </div>
  );
};
