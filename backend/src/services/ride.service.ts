import { RideModelRepository } from "../models/Ride.model";
import { globalDrivers } from "../models/db";
import { calculateDistanceKm } from "../utils/geoUtils";

export class RideService {
  static async getActiveTrips() {
    return RideModelRepository.getAll();
  }

  static async findNearbyDrivers(lat: number, lng: number, radiusKm: number = 10) {
    const activeThreshold = Date.now() - 60000;
    const availableDrivers = Object.values(globalDrivers).filter(d => {
      const isOnline = d.status !== 'offline';
      const isRecent = d.lastSeen ? d.lastSeen > activeThreshold : true;
      return isOnline && isRecent && d.coords;
    });

    return availableDrivers.filter(d => {
      if (!d.coords) return false;
      const dist = calculateDistanceKm(lat, lng, d.coords[0], d.coords[1]);
      return dist <= radiusKm;
    });
  }

  static async dispatchRide(rideData: any) {
    return await RideModelRepository.create(rideData);
  }

  static async cancelRide(tripId: string, reason?: string) {
    return await RideModelRepository.update(tripId, {
      status: 'cancelled',
      cancellationReason: reason || 'Cancelled by user',
      cancelledAt: Date.now()
    });
  }
}
