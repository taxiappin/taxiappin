import { useEffect } from "react";
import { useMap } from "react-leaflet";

/**
 * MapMemoryCleanup - A specialized performance controller for Leaflet
 * Unloads TileLayers, removes custom events, and tears down instance structures on unmount
 * to prevent massive WebGL & DOM memory leaks on high-frequency tab switching or re-renders.
 */
export function MapMemoryCleanup() {
  const map = useMap();

  useEffect(() => {
    // Standard map resizing adjustments on mount to prevent broken gray tiles (Leaflet container ref issue)
    setTimeout(() => {
      if (map) {
        map.invalidateSize();
      }
    }, 100);

    return () => {
      if (map) {
        // Unbind any active custom DOM event listeners attached to standard Leaflet interactions
        map.off();
        
        // Safely remove each layer and cache objects from WebKit memory space
        map.eachLayer((layer) => {
          try {
            layer.off();
            map.removeLayer(layer);
          } catch (err) {
            // graceful suppression for layers already garbage collected
          }
        });
      }
    };
  }, [map]);

  return null;
}
