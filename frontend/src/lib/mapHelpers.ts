import L from "leaflet";
import React from "react";

export const getTopViewVehicleSVG = (vType: string, color = "#10b981") => {
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

  // DEFAULT CAR / SEDAN / SUV / MINI
  let carColor = color;
  if (t === "SEDAN" || t === "PRIME SEDAN")
    carColor = "#1e3a8a"; // Executive dark blue
  else if (t === "SUV" || t === "PREMIUM SUV")
    carColor = "#065f46"; // Forest green
  else if (t === "MINI" || t === "ECO CRUISER" || t === "ECO")
    carColor = "#dc2626"; // Sporty Red
  else if (t === "CAR" || t === "LUXURY") carColor = "#1f2937"; // Sleek dark charcoal

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
      <rect x="9" y="18" width="5" height="3" rx="1" fill="${carColor}" />
      <rect x="50" y="18" width="5" height="3" rx="1" fill="${carColor}" />
    </svg>
  `;
};

export const PickupIcon = L.divIcon({
  className: "bg-transparent",
  html: `
    <div style="width: 40px; height: 40px; position: relative;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <div class="relative w-10 h-10 flex items-center justify-center">
          <div class="w-7 h-7 bg-green-600 rounded-full border-4 border-white shadow-2xl relative z-10 flex items-center justify-center">
            <div class="w-2.5 h-2.5 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export const DropIcon = L.divIcon({
  className: "bg-transparent",
  html: `
    <div style="width: 40px; height: 40px; position: relative;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <div class="relative w-10 h-10 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/10 rounded-full animate-pulse scale-150"></div>
          <div class="w-7 h-7 bg-ink rounded-full border-4 border-white shadow-2xl relative z-10 flex items-center justify-center">
            <div class="w-3 h-3 bg-white rounded-sm transform rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export const getUserMarkerIcon = (
  avatarUrl?: string,
  name?: string,
  config?: any,
  mapIcon?: string,
  tooltipText: string = "You are here"
) => {
  const riderEntity = config?.vehicles?.find(
    (v: any) => v.id === "rider" || v.type === "RIDER"
  );

  let finalUrl = "";
  if (riderEntity) {
    if (riderEntity.mapIcon && riderEntity.mapIcon !== "") {
      finalUrl = riderEntity.mapIcon;
    } else if (riderEntity.image && riderEntity.image !== "") {
      finalUrl = riderEntity.image;
    }
  }

  if (!finalUrl) {
    finalUrl = config?.map?.riderIconUrl || mapIcon || avatarUrl;
  }

  const scale = config?.map?.riderIconScale ?? riderEntity?.scale ?? 1.0;
  const finalSize = Math.round(44 * scale);
  const initial = name ? name[0].toUpperCase() : "U";
  const isTopView =
    finalUrl?.includes("top") ||
    finalUrl?.includes("marker") ||
    finalUrl?.includes("vehicle") ||
    finalUrl?.includes("car") ||
    (riderEntity && finalUrl === riderEntity.mapIcon) ||
    !!mapIcon ||
    !!config?.map?.riderIconUrl;

  const imgHtml = finalUrl
    ? `<img src="${finalUrl}" style="width: ${finalSize}px; height: ${finalSize}px; ${isTopView ? "" : "border-radius: 50%; object-fit: cover;"}" class="${isTopView ? "object-contain drop-shadow-md" : "object-cover border-2 border-white shadow-xl bg-white"}" referrerPolicy="no-referrer" />`
    : `<div class="w-11 h-11 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center border-2 border-white shadow-xl">${initial}</div>`;

  const tooltipHtml = tooltipText
    ? `
    <div class="absolute bottom-[100%] left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-2xl border border-white/20 flex items-center gap-1.5 whitespace-nowrap z-50 uppercase tracking-wider pointer-events-none">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>${tooltipText}</span>
      <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900"></div>
    </div>
  `
    : "";

  return L.divIcon({
    className: "bg-transparent leaflet-smooth-marker",
    html: `
      <div class="relative flex items-center justify-center" style="width: ${finalSize + 10}px; height: ${finalSize + 10}px;">
        ${tooltipHtml}
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-2 rounded-full bg-blue-500/20 animate-ping" style="animation-duration: 3s"></div>
          ${imgHtml}
        </div>
      </div>
    `,
    iconSize: [finalSize + 10, finalSize + 10],
    iconAnchor: [(finalSize + 10) / 2, (finalSize + 10) / 2],
  });
};

export const getPickupIcon = (config?: any) => {
  const customUrl = config?.map?.pickupIconUrl;
  const scale = (config?.map?.pickupIconScale ?? 1.0) * 0.8;
  if (customUrl) {
    const finalSize = Math.round(26 * scale);
    return L.divIcon({
      className: "bg-transparent",
      html: `
        <div class="relative flex items-center justify-center">
          ${config?.map?.markerBounceAnimation !== false ? '<div class="absolute w-6 h-6 bg-emerald-500/35 rounded-full animate-ping" style="animation-duration: 2.5s"></div>' : ""}
          <img src="${customUrl}" style="width: ${finalSize}px; height: ${finalSize}px; object-fit: contain; display: block;" />
        </div>
      `,
      iconSize: [finalSize + 8, finalSize + 8],
      iconAnchor: [
        Math.round((finalSize + 8) / 2),
        Math.round((finalSize + 8) / 2),
      ],
    });
  }

  const finalSize = Math.round(38 * scale);
  const pulseHtml =
    config?.map?.markerBounceAnimation !== false
      ? '<div class="absolute w-8 h-8 bg-emerald-500/35 rounded-full animate-ping" style="animation-duration: 2s"></div><div class="absolute w-6 h-6 bg-emerald-500/20 rounded-full animate-pulse"></div>'
      : "";

  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div style="width: ${finalSize}px; height: ${finalSize}px; position: relative;" class="flex items-center justify-center">
        ${pulseHtml}
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

export const getDropIcon = (config?: any) => {
  const customUrl = config?.map?.dropoffIconUrl;
  const scale = (config?.map?.dropoffIconScale ?? 1.0) * 0.8;
  if (customUrl) {
    const finalSize = Math.round(26 * scale);
    return L.divIcon({
      className: "bg-transparent",
      html: `
        <div class="relative flex items-center justify-center">
          ${config?.map?.markerBounceAnimation !== false ? '<div class="absolute w-6 h-6 bg-rose-500/10 rounded-full animate-pulse"></div>' : ""}
          <img src="${customUrl}" style="width: ${finalSize}px; height: ${finalSize}px; object-fit: contain; display: block;" />
        </div>
      `,
      iconSize: [finalSize + 8, finalSize + 8],
      iconAnchor: [
        Math.round((finalSize + 8) / 2),
        Math.round((finalSize + 8) / 2),
      ],
    });
  }

  const finalSize = Math.round(38 * scale);
  const pulseHtml =
    config?.map?.markerBounceAnimation !== false
      ? '<div class="absolute w-8 h-8 border-2 border-dashed border-rose-500/80 rounded-full animate-spin" style="animation-duration: 7s"></div><div class="absolute w-6 h-6 bg-rose-500/30 rounded-full animate-ping" style="animation-duration: 2.2s"></div>'
      : "";

  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div style="width: ${finalSize}px; height: ${finalSize}px; position: relative;" class="flex items-center justify-center">
        ${pulseHtml}
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

export const getHomeIcon = (config?: any) => {
  const customUrl = config?.map?.homeIconUrl;
  const scale = config?.map?.homeIconScale ?? 1.0;
  if (customUrl) {
    const finalSize = Math.round(32 * scale);
    return L.divIcon({
      className: "bg-transparent",
      html: `
        <div class="relative flex items-center justify-center transform -translate-x-1 -translate-y-1">
          ${config?.map?.markerBounceAnimation !== false ? '<div class="absolute w-8 h-8 bg-indigo-500/10 rounded-full animate-pulse"></div>' : ""}
          <img src="${customUrl}" style="width: ${finalSize}px; height: ${finalSize}px; object-fit: contain; display: block;" />
        </div>
      `,
      iconSize: [finalSize + 10, finalSize + 10],
      iconAnchor: [
        Math.round((finalSize + 10) / 2),
        Math.round((finalSize + 10) / 2),
      ],
    });
  }

  const finalSize = Math.round(40 * scale);
  const pulseHtml =
    config?.map?.markerBounceAnimation !== false
      ? '<div class="absolute w-10 h-10 bg-indigo-500/15 rounded-full animate-pulse scale-150"></div>'
      : "";

  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div style="width: ${finalSize}px; height: ${finalSize}px; position: relative;" class="flex items-center justify-center">
        ${pulseHtml}
        <div class="relative flex items-center justify-center" style="transform: scale(${scale})">
          <div class="w-7 h-7 bg-indigo-600 rounded-md border border-white shadow-md flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="3" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [finalSize, finalSize],
    iconAnchor: [Math.round(finalSize / 2), Math.round(finalSize / 2)],
  });
};

export const splitAddress = (addr: string) => {
  if (!addr) return { main: "Detecting Location...", sub: "Current Area" };
  const parts = addr
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return { main: "VR Colony", sub: "Hyderabad" };

  const main = parts[0];
  const remainingParts = parts.slice(1);

  const cleanedSubParts = remainingParts.filter((part) => {
    const lower = part.toLowerCase();
    if (lower === "india" || lower === "united states" || lower === "usa")
      return false;
    if (
      lower === "telangana" ||
      lower === "andhra pradesh" ||
      lower === "maharashtra"
    )
      return false;
    if (/^\d{5,6}$/.test(part)) return false;
    return true;
  });

  const sourceParts =
    cleanedSubParts.length > 0 ? cleanedSubParts : remainingParts;
  const sub = sourceParts.slice(0, 2).join(", ");

  return {
    main: main || "VR Colony",
    sub: sub || "Hyderabad",
  };
};

export const isValidLatLng = (latlng: any): boolean => {
  if (!latlng) return false;
  try {
    if (Array.isArray(latlng)) {
      const lat = Number(latlng[0]);
      const lng = Number(latlng[1]);
      return (
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      );
    }
    const lat = Number(latlng.lat != null ? latlng.lat : latlng[0]);
    const lng = Number(
      latlng.lng != null ? latlng.lng : latlng.lon != null ? latlng.lon : latlng[1]
    );
    return (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  } catch {
    return false;
  }
};

export const isGenericAddress = (addr: any): boolean => {
  if (!addr || typeof addr !== "string") return true;
  const s = addr.trim().toLowerCase();
  return (
    s === "" ||
    s === "pickup address" ||
    s === "drop-off address" ||
    s === "dropoff address" ||
    s === "pickup location" ||
    s === "dropoff location" ||
    s === "destination" ||
    s === "pickup" ||
    s === "drop" ||
    s === "drop-off"
  );
};

export const getResolvedPickupAddress = (
  trip: any,
  allTrips: any[] = []
): string => {
  if (!trip) return "Bompally, Peddapalli";
  const candidates = [
    trip.from,
    trip.pickup?.address,
    typeof trip.pickup === "string" ? trip.pickup : null,
    trip.pickupAddress,
    trip.fromAddress,
    trip.boardingHub,
    trip.origin,
    trip.pickupLocation,
    trip.sourcePost?.from,
    trip.sourcePost?.pickup?.address,
  ];
  for (const c of candidates) {
    if (c && !isGenericAddress(c)) return c;
  }
  if (trip.postId) {
    const post = allTrips.find((p: any) => p.id === trip.postId);
    if (post) {
      const postCandidates = [
        post.from,
        post.pickup?.address,
        typeof post.pickup === "string" ? post.pickup : null,
        post.pickupAddress,
        post.fromAddress,
        post.boardingHub,
        post.origin,
      ];
      for (const pc of postCandidates) {
        if (pc && !isGenericAddress(pc)) return pc;
      }
    }
  }
  return "Bompally, Peddapalli";
};

export const getResolvedDropAddress = (
  trip: any,
  allTrips: any[] = []
): string => {
  if (!trip) return "Gollapally, Peddapalli";
  const candidates = [
    trip.to,
    trip.drop?.address,
    typeof trip.drop === "string" ? trip.drop : null,
    trip.dropAddress,
    trip.toAddress,
    trip.destinationHub,
    trip.destination,
    trip.dropLocation,
    trip.sourcePost?.to,
    trip.sourcePost?.drop?.address,
  ];
  for (const c of candidates) {
    if (c && !isGenericAddress(c)) return c;
  }
  if (trip.postId) {
    const post = allTrips.find((p: any) => p.id === trip.postId);
    if (post) {
      const postCandidates = [
        post.to,
        post.drop?.address,
        typeof post.drop === "string" ? post.drop : null,
        post.dropAddress,
        post.toAddress,
        post.destinationHub,
        post.destination,
      ];
      for (const pc of postCandidates) {
        if (pc && !isGenericAddress(pc)) return pc;
      }
    }
  }
  return "Gollapally, Peddapalli";
};

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getSpacedCoordinates(
  coordA: [number, number] | null | undefined,
  coordB: [number, number] | null | undefined,
  target: "A" | "B"
): [number, number] | null {
  if (!coordA) return null;
  if (!coordB) return [coordA[0], coordA[1]];
  const latDiff = coordA[0] - coordB[0];
  const lngDiff = coordA[1] - coordB[1];
  const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  if (dist < 0.00018) {
    const shift = 0.00015;
    if (target === "A") {
      return [coordA[0], coordA[1] - shift];
    } else {
      return [coordB[0], coordB[1] + shift];
    }
  }
  return target === "A" ? [coordA[0], coordA[1]] : [coordB[0], coordB[1]];
}

export function formatMinimalAddress(addr: string): string {
  if (!addr) return "";
  const parts = addr.split(", ");
  if (parts.length <= 3) return addr;
  const selected: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].trim();
    if (!p) continue;
    if (
      selected.length >= 2 &&
      (p.toLowerCase().includes("municipal") ||
        p.toLowerCase().includes("corporation") ||
        p.toLowerCase().includes("zone") ||
        p.toLowerCase().includes("mandal") ||
        p.toLowerCase().includes("district") ||
        p.toLowerCase().includes("county") ||
        p.toLowerCase().includes("state") ||
        p.toLowerCase().includes("ward"))
    ) {
      continue;
    }
    selected.push(p);
    if (selected.length >= 3) break;
  }
  if (selected.length < 2) {
    return parts.slice(0, 3).join(", ");
  }
  return selected.join(", ");
}

export function getVehicleIcon(type: string = "car", variant: string = "default"): string {
  const t = (type || "").toLowerCase();
  if (t.includes("bike") || t.includes("motorcycle") || t.includes("scooter")) {
    return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80";
  }
  if (t.includes("auto") || t.includes("tuk")) {
    return "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=400&q=80";
  }
  if (t.includes("suv")) {
    return "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80";
  }
  return "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80";
}

export function getDriverVehicleProfileImage(profile: any): string {
  if (
    profile?.vehicleImage &&
    profile.vehicleImage !== "/uploads/carprofile.svg" &&
    profile.vehicleImage !== "" &&
    !profile.vehicleImage.includes("carprofile.svg")
  ) {
    return profile.vehicleImage;
  }
  const vType = profile?.vehicleType || "car";
  return getVehicleIcon(vType, "profile");
}

/**
 * Resolves the active tile URL, ensuring clean free basemaps without "API KEY REQUIRED" watermarks.
 * Defaults to high-speed Humanitarian OpenStreetMap styled as Uber-minimal gray.
 */
export function getResolvedTileUrl(mapConfig?: any): string {
  const customUrl = mapConfig?.tileLayerUrl;
  // If user provided a valid custom URL that is not Carto without an API key or legacy World Street Map
  if (
    customUrl &&
    !customUrl.includes("World_Street_Map") &&
    (!customUrl.includes("cartocdn.com") || customUrl.includes("api_key"))
  ) {
    return customUrl;
  }
  if (mapConfig?.tilePreset === "satellite") {
    return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  }
  if (mapConfig?.tilePreset === "topo") {
    return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
  }
  if (mapConfig?.tilePreset === "esri-gray") {
    return "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";
  }
  if (mapConfig?.tilePreset === "osm-standard") {
    return "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  }
  if (mapConfig?.tilePreset === "osm-hot" || mapConfig?.tilePreset === "humanitarian") {
    return "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
  }
  // Default: Esri Light Gray Canvas (Ultra-clean, uncluttered, zero building/hospital noise, 100% free)
  return "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}";
}

/**
 * Returns the CSS class for styling the tile layer to match Uber's clean minimalist gray or night mode
 */
export function getTileLayerClassName(mapConfig?: any, isDark?: boolean): string {
  const preset = mapConfig?.tilePreset;
  if (preset === "satellite" || preset === "fullcolor" || preset === "topo" || preset === "esri-gray") {
    return "";
  }
  return isDark || preset === "dark" ? "map-tiles-uber-dark" : "map-tiles-uber-minimal";
}
