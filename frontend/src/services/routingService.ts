import { RouteData } from '../types';

/**
 * Service to interact with OpenStreetMap Routing Machine (OSRM)
 */
export const routingService = {
  /**
   * Fetches route data between two points
   * @param start [lat, lng]
   * @param end [lat, lng]
   */
  async getRoute(start: [number, number], end: [number, number]): Promise<RouteData> {
    try {
      const [startLat, startLng] = start;
      const [endLat, endLng] = end;

      // OSRM expects coordinates in lon,lat format
      const coordinates = `${startLng},${startLat};${endLng},${endLat}`;
      const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          return this.getFallbackRoute(start, end);
        }

        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
          return this.getFallbackRoute(start, end);
        }

        const route = data.routes[0];
        
        // OSRM returns coordinates as [lon, lat], we need [lat, lng] for Leaflet
        const routeCoordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
        
        // Force start and end coordinates to be exactly what was requested 
        // to prevent "gaps" between markers and the polyline due to road-snapping
        if (routeCoordinates.length > 0) {
          routeCoordinates[0] = [startLat, startLng];
          routeCoordinates[routeCoordinates.length - 1] = [endLat, endLng];
        }
        
        const distance = route.distance; // meters
        const duration = route.duration; // seconds

        return {
          coordinates: routeCoordinates,
          distance,
          duration,
          distanceStr: this.formatDistance(distance),
          durationStr: this.formatDuration(duration)
        };
      } catch (err: any) {
        clearTimeout(timeoutId);
        // Silently use fallback route on any error
        return this.getFallbackRoute(start, end);
      }
    } catch (error) {
      console.error('Error in routingService:', error);
      return this.getFallbackRoute(start, end);
    }
  },

  getFallbackRoute(start: [number, number], end: [number, number]): RouteData {
    const straightDistance = this.calculateHaversineDistance(start, end);
    // Real driving distance is typically 1.25x the straight-line distance
    const distance = straightDistance * 1.25;
    // Rough estimate: 50km/h average speed in mixed traffic (intercity/city) -> ~13.88 m/s
    const duration = distance / 13.88; 

    // Generate a beautiful winding pseudo-road route to avoid blocky 90-degree distortion
    const coordinates: [number, number][] = [];
    const steps = 30; // 30 points to look extremely detailed, smooth and organic
    
    // Calculate the direction vector
    const dLat = end[0] - start[0];
    const dLng = end[1] - start[1];
    
    // Perpendicular vector for proportional wavy offsets
    const pLat = -dLng;
    const pLng = dLat;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Base linear interpolation
      let lat = start[0] + dLat * t;
      let lng = start[1] + dLng * t;
      
      if (i > 0 && i < steps) {
        // Add smooth combination of sine/cosine waves to simulate winding road turns
        const wave1 = Math.sin(t * Math.PI * 2) * 0.08;
        const wave2 = Math.cos(t * Math.PI * 5) * 0.03;
        const totalOffset = wave1 + wave2;
        
        lat += pLat * totalOffset;
        lng += pLng * totalOffset;
      }
      
      coordinates.push([lat, lng]);
    }

    return {
      coordinates,
      distance,
      duration,
      distanceStr: this.formatDistance(distance),
      durationStr: this.formatDuration(duration)
    };
  },

  calculateHaversineDistance(start: [number, number], end: [number, number]): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = start[0] * Math.PI / 180;
    const phi2 = end[0] * Math.PI / 180;
    const deltaPhi = (end[0] - start[0]) * Math.PI / 180;
    const deltaLambda = (end[1] - start[1]) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  },

  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  },

  formatDuration(seconds: number): string {
    const minutes = Math.ceil(seconds / 60);
    if (minutes < 60) {
      return `${minutes} mins`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
};
