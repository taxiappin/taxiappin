import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import { useMap, useMapEvents, Polyline, Marker } from "react-leaflet";
import { useConfig } from "../../lib/ConfigContext";
import { isValidLatLng } from "../../lib/mapHelpers";

/**
 * BoundsHandler safely centers and fits path geometry into view
 */
export const BoundsHandler = ({ path }: { path: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (path && path.length > 1) {
      const validPath = path.filter(
        (p) => p && p.length >= 2 && !isNaN(p[0]) && !isNaN(p[1])
      );
      if (validPath.length > 1) {
        try {
          const bounds = L.latLngBounds(validPath);
          map.fitBounds(bounds, {
            paddingTopLeft: [40, 60],
            paddingBottomRight: [40, 280],
            animate: true,
            maxZoom: 15,
          });
        } catch (e) {
          console.error("BoundsHandler failed to fit bounds: ", e);
        }
      }
    }
  }, [path, map]);
  return null;
};

/**
 * MapViewHandler updates center coordinates on map view
 */
export const MapViewHandler = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      try {
        map.setView(center, map.getZoom(), { animate: true });
      } catch (e) {
        console.error("MapViewHandler failed to set view: ", e);
      }
    }
  }, [center, map]);
  return null;
};

/**
 * MapFitter fits map bounds to specified points
 */
export const MapFitter = ({
  bounds,
  padding,
}: {
  bounds: L.LatLngExpression[];
  padding?: L.PointExpression;
}) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      const validBounds = bounds.filter((b) => {
        const coords = b as any;
        return Array.isArray(coords) && !isNaN(coords[0]) && !isNaN(coords[1]);
      });
      if (validBounds.length > 0) {
        try {
          map.fitBounds(L.latLngBounds(validBounds as any), {
            padding: padding || [30, 30],
          });
        } catch (e) {
          console.error("MapFitter failed:", e);
        }
      }
    }
  }, [map, bounds, padding]);
  return null;
};

/**
 * MapInvalidator triggers size calculation on mount
 */
export const MapInvalidator = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

/**
 * Helper component to fit map to bounds safely
 */
export const MapAutoFit = ({
  bounds,
  active,
}: {
  bounds: any;
  active?: boolean;
}) => {
  const map = useMap();
  useEffect(() => {
    if (active !== false && bounds) {
      try {
        let isValid = true;
        if (bounds instanceof L.LatLngBounds) {
          const northEast = bounds.getNorthEast();
          const southWest = bounds.getSouthWest();
          if (
            !northEast ||
            !southWest ||
            isNaN(northEast.lat) ||
            isNaN(northEast.lng) ||
            isNaN(southWest.lat) ||
            isNaN(southWest.lng)
          ) {
            isValid = false;
          }
        } else if (Array.isArray(bounds)) {
          const flat = bounds.flat(2) as any[];
          if (flat.some((val) => val == null || isNaN(Number(val)))) {
            isValid = false;
          }
        }
        if (isValid) {
          map.fitBounds(bounds, {
            padding: [45, 45],
            maxZoom: 16,
            animate: true,
            duration: 0.8,
          });
        }
      } catch (e) {
        console.error("MapAutoFit error: ", e);
      }
    }
  }, [bounds, map, active]);
  return null;
};

/**
 * Helper component to track user map interactions (pan, zoom)
 */
export const MapTouchTracker = ({
  onUserInteract,
}: {
  onUserInteract: () => void;
}) => {
  useMapEvents({
    dragstart: () => {
      onUserInteract();
    },
    zoomstart: () => {
      onUserInteract();
    },
  });
  return null;
};

/**
 * Helper to update Leaflet container size when height changes
 */
export const MapResizeInvalidator = ({ trigger }: { trigger: any }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 320);
    return () => clearTimeout(timer);
  }, [trigger, map]);
  return null;
};

/**
 * LiveVehiclePanTracker tracks dynamic live vehicle movements
 */
export const LiveVehiclePanTracker = ({
  vehiclePos,
  isAutoTracking,
  onUserInteract,
}: {
  vehiclePos: [number, number] | null;
  isAutoTracking: boolean;
  onUserInteract: () => void;
}) => {
  const map = useMap();
  useMapEvents({
    dragstart: () => onUserInteract(),
    zoomstart: () => onUserInteract(),
    movestart: () => onUserInteract(),
  });
  useEffect(() => {
    if (
      !isAutoTracking ||
      !vehiclePos ||
      isNaN(vehiclePos[0]) ||
      isNaN(vehiclePos[1])
    )
      return;
    try {
      map.panTo(vehiclePos, {
        animate: true,
        duration: 0.35,
        easeLinearity: 0.25,
      });
    } catch (e) {
      console.error("Auto pan error:", e);
    }
  }, [vehiclePos, isAutoTracking, map]);
  return null;
};

/**
 * Interpolates coordinates along a path based on progress value between 0 and 1.
 */
export function interpolatePath(
  path: [number, number][],
  progress: number
): [number, number][] {
  if (path.length < 2) return path;
  if (progress <= 0) return [path[0]];
  if (progress >= 1) return path;
  const totalSegments = path.length - 1;
  const currentSegmentFloat = progress * totalSegments;
  const currentIndex = Math.floor(currentSegmentFloat);
  const nextIndex = currentIndex + 1;
  const segmentProgress = currentSegmentFloat - currentIndex;
  const startPt = path[currentIndex];
  const endPt = path[nextIndex];
  if (!startPt || !endPt) return path;
  const interpolatedLat =
    startPt[0] + (endPt[0] - startPt[0]) * segmentProgress;
  const interpolatedLng =
    startPt[1] + (endPt[1] - startPt[1]) * segmentProgress;
  const subPath = path.slice(0, currentIndex + 1);
  subPath.push([interpolatedLat, interpolatedLng]);
  return subPath;
}

/**
 * Animated route component to progressively draw map routing paths
 */
export function AnimatedRoute({
  positions,
  color,
  weight,
  opacity,
}: {
  positions: [number, number][];
  color: string;
  weight: number;
  opacity: number;
}) {
  const { config } = useConfig();
  const [progress, setProgress] = useState(0);
  const [isDelaying, setIsDelaying] = useState(true);

  const positionsKey = useMemo(() => {
    return JSON.stringify(positions);
  }, [positions]);

  useEffect(() => {
    if (positions.length < 2) {
      setProgress(0);
      setIsDelaying(true);
      return;
    }
    setProgress(0);
    setIsDelaying(true);
    let animationFrameId: number;
    let startTimestamp: number | null = null;
    const animDuration = 1250;

    const delayTimer = setTimeout(() => {
      setIsDelaying(false);
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progressVal = Math.min(elapsed / animDuration, 1);
        setProgress(progressVal);
        if (progressVal < 1) {
          animationFrameId = requestAnimationFrame(step);
        }
      };
      animationFrameId = requestAnimationFrame(step);
    }, 1300);

    return () => {
      clearTimeout(delayTimer);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [positionsKey]);

  if (isDelaying || positions.length < 2) {
    return null;
  }

  const animatedPath = interpolatePath(positions, progress);
  const tipPosition = animatedPath[animatedPath.length - 1];

  return (
    <>
      {/* Background static line */}
      {positions.length > 1 && (
        <Polyline
          positions={positions}
          color={color}
          weight={weight}
          opacity={opacity * 0.15}
          lineCap="round"
          lineJoin="round"
          dashArray={
            config?.map?.roadPulseAnimation !== false ? "12, 10" : undefined
          }
          className={
            config?.map?.roadPulseAnimation !== false
              ? "route-pulse-dash"
              : undefined
          }
        />
      )}
      {/* Active animated route */}
      {animatedPath.length > 1 && (
        <Polyline
          positions={animatedPath}
          color={color}
          weight={weight}
          opacity={opacity}
          lineCap="round"
          lineJoin="round"
          dashArray={
            config?.map?.roadPulseAnimation !== false ? "12, 10" : undefined
          }
          className={
            config?.map?.roadPulseAnimation !== false
              ? "route-pulse-dash"
              : undefined
          }
        />
      )}
      {/* Pulsing traveling dot cursor */}
      {tipPosition && progress < 1 && (
        <Marker
          position={tipPosition}
          icon={L.divIcon({
            className: "bg-transparent",
            html: `
              <div class="relative w-6 h-6 flex items-center justify-center -translate-x-[6px] -translate-y-[6px]">
                <div class="absolute w-4 h-4 bg-emerald-400/40 rounded-full animate-ping"></div>
                <div class="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white shadow-md"></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })}
        />
      )}
    </>
  );
}

export interface MapHandlerProps {
  appMode: "rider" | "driver";
  currentTab: string;
  step: string;
  isPinningOnMap: boolean;
  sheetMode: any;
  isSearchMinimized: boolean;
  pickupCoords: [number, number] | null;
  dropCoords: [number, number] | null;
  tripPath: [number, number][];
  centeringCount: number;
  isDraggingMap: boolean;
  setIsDraggingMap: (val: boolean) => void;
  mapCenter: [number, number];
  handleMapClick: (latlng: L.LatLng) => void;
  handleMapMove: (latlng: L.LatLng) => void;
  mapInstance: React.MutableRefObject<L.Map | null>;
  userHasInteracted: React.MutableRefObject<boolean>;
  onMapActivity?: () => void;
}

export function MapHandler({
  appMode,
  currentTab,
  step,
  isPinningOnMap,
  sheetMode,
  isSearchMinimized,
  pickupCoords,
  dropCoords,
  tripPath,
  centeringCount,
  isDraggingMap,
  setIsDraggingMap,
  mapCenter,
  handleMapClick,
  handleMapMove,
  mapInstance,
  userHasInteracted,
  onMapActivity,
}: MapHandlerProps) {
  const map = useMap();
  const lastProgrammaticCenter = useRef<[number, number] | null>(null);
  const lastHandledCenteringCount = useRef(centeringCount);
  const isAnimating = useRef(false);

  const lastFlownCoordsKey = useRef<string>("");
  const lastFlownCenterKey = useRef<string>("");

  useMapEvents({
    mousedown: () => {
      onMapActivity?.();
      if (!isAnimating.current) {
        userHasInteracted.current = true;
      }
    },
    movestart: () => {
      onMapActivity?.();
      if (!isAnimating.current) {
        userHasInteracted.current = true;
      }
    },
    zoomstart: () => {
      onMapActivity?.();
      if (!isAnimating.current) {
        userHasInteracted.current = true;
        setIsDraggingMap(true);
      }
    },
    dragstart: () => {
      onMapActivity?.();
      if (!isAnimating.current) {
        userHasInteracted.current = true;
        setIsDraggingMap(true);
      }
    },
    drag: () => {
      onMapActivity?.();
    },
    dragend: () => {
      onMapActivity?.();
      setIsDraggingMap(false);
      userHasInteracted.current = true;
    },
    zoomend: () => {
      onMapActivity?.();
      setIsDraggingMap(false);
      userHasInteracted.current = true;
    },
    moveend: () => {
      onMapActivity?.();
      const center = map.getCenter();
      handleMapMove(center);
      setIsDraggingMap(false);
      userHasInteracted.current = true;
    },
    click: (e) => {
      onMapActivity?.();
      handleMapClick(e.latlng);
      userHasInteracted.current = false;
    },
  });

  useEffect(() => {
    mapInstance.current = map;
    map.invalidateSize();
    return () => {
      mapInstance.current = null;
    };
  }, [map, mapInstance]);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize({ animate: true });
    }, 400);
    return () => clearTimeout(timer);
  }, [map, currentTab, isSearchMinimized, step, sheetMode]);

  const prevCoordsKey = useRef("");
  const currentCoordsKey = `${pickupCoords?.[0] || 0},${pickupCoords?.[1] || 0}-${dropCoords?.[0] || 0},${dropCoords?.[1] || 0}`;
  useEffect(() => {
    if (pickupCoords || dropCoords) {
      if (currentCoordsKey !== prevCoordsKey.current) {
        prevCoordsKey.current = currentCoordsKey;
        userHasInteracted.current = false;
        lastFlownCoordsKey.current = "";
        lastFlownCenterKey.current = "";
      }
    }
  }, [pickupCoords, dropCoords, currentCoordsKey, userHasInteracted]);

  useEffect(() => {
    if (isAnimating.current) return;
    if (isDraggingMap) return;

    const isExplicitRequest = centeringCount > lastHandledCenteringCount.current;
    if (isExplicitRequest) {
      userHasInteracted.current = false;
      lastHandledCenteringCount.current = centeringCount;
    }

    if (isPinningOnMap && !isExplicitRequest) return;

    const currentRouteKey = `${pickupCoords?.[0] || 0},${pickupCoords?.[1] || 0}-${dropCoords?.[0] || 0},${dropCoords?.[1] || 0}-${tripPath?.length || 0}`;

    if (
      !isPinningOnMap &&
      tripPath &&
      tripPath.length > 1 &&
      (!userHasInteracted.current || isExplicitRequest)
    ) {
      if (currentRouteKey !== lastFlownCoordsKey.current || isExplicitRequest) {
        const validPath = tripPath.filter(
          (p) =>
            p && p[0] != null && !isNaN(p[0]) && p[1] != null && !isNaN(p[1])
        );
        if (validPath.length > 1) {
          try {
            const bounds = L.latLngBounds(validPath);
            isAnimating.current = true;
            lastFlownCoordsKey.current = currentRouteKey;
            const vHeight = window.innerHeight;
            const pt = vHeight < 700 ? 120 : 200;
            const pb = vHeight < 700 ? 80 : 120;
            map.flyToBounds(bounds, {
              paddingTopLeft: [30, pt],
              paddingBottomRight: [30, pb],
              duration: 1.2,
              easeLinearity: 0.2,
              animate: true,
              maxZoom: 15,
            });
            setTimeout(() => {
              isAnimating.current = false;
            }, 1400);
            return;
          } catch (e) {
            console.error("Map flyToBounds path failed:", e);
          }
        }
      }
    }

    if (userHasInteracted.current && !isExplicitRequest) return;
    if (
      appMode === "driver" &&
      step !== "live" &&
      currentTab !== "home" &&
      !isExplicitRequest
    )
      return;

    if (
      !isPinningOnMap &&
      pickupCoords &&
      dropCoords &&
      pickupCoords[0] != null &&
      !isNaN(pickupCoords[0]) &&
      pickupCoords[1] != null &&
      !isNaN(pickupCoords[1]) &&
      dropCoords[0] != null &&
      !isNaN(dropCoords[0]) &&
      dropCoords[1] != null &&
      !isNaN(dropCoords[1])
    ) {
      if (currentRouteKey !== lastFlownCoordsKey.current || isExplicitRequest) {
        try {
          const bounds = L.latLngBounds([pickupCoords, dropCoords]);
          isAnimating.current = true;
          lastFlownCoordsKey.current = currentRouteKey;
          const vHeight = window.innerHeight;
          const pt = vHeight < 700 ? 120 : 200;
          const pb = vHeight < 700 ? 80 : 120;
          map.flyToBounds(bounds, {
            paddingTopLeft: [30, pt],
            paddingBottomRight: [30, pb],
            duration: 1.2,
            easeLinearity: 0.2,
            animate: true,
            maxZoom: 15,
          });
          setTimeout(() => {
            isAnimating.current = false;
          }, 1400);
        } catch (e) {
          console.error("Map flyToBounds coordinates failed:", e);
        }
      }
    } else if (isValidLatLng(mapCenter)) {
      const bothSelected = !!(pickupCoords && dropCoords);
      if (!bothSelected) {
        const centerStr = `${mapCenter[0]},${mapCenter[1]}`;
        const hasCenterChanged = centerStr !== lastFlownCenterKey.current;
        if (isExplicitRequest || hasCenterChanged) {
          try {
            const currentCenter = map.getCenter();
            const dist =
              currentCenter && isValidLatLng(currentCenter)
                ? currentCenter.distanceTo(
                    L.latLng(mapCenter[0], mapCenter[1])
                  )
                : 1000;
            const threshold = userHasInteracted.current
              ? 500
              : appMode === "driver"
              ? 8
              : 20;
            if (isExplicitRequest || dist > threshold) {
              const zoom = 16;
              const point = map.project(mapCenter, zoom);
              const targetPoint = L.point(point.x, point.y - 110);
              const adjustedCenter = map.unproject(targetPoint, zoom);
              map.setView(adjustedCenter, zoom, { animate: isExplicitRequest });
              lastProgrammaticCenter.current = mapCenter;
              lastFlownCenterKey.current = centerStr;
            }
          } catch (e) {
            console.error("Map flyTo center failed:", e);
          }
        }
      }
    }
  }, [
    mapCenter,
    map,
    pickupCoords,
    dropCoords,
    tripPath,
    step,
    centeringCount,
    isPinningOnMap,
    isDraggingMap,
    appMode,
    setIsDraggingMap,
    userHasInteracted,
  ]);

  return null;
}
