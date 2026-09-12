import { globalTrips, syncTrip, removeTrip } from "./db";
import { getPgPool, getIsPgConnected } from "./postgres";

export class RideModelRepository {
  static getAll() {
    return globalTrips;
  }

  static findById(id: string) {
    return globalTrips.find(t => t.id === id) || null;
  }

  static async create(rideData: any) {
    globalTrips.unshift(rideData);
    await syncTrip(rideData);
    return rideData;
  }

  static async update(id: string, updates: any) {
    const idx = globalTrips.findIndex(t => t.id === id);
    if (idx !== -1) {
      globalTrips[idx] = { ...globalTrips[idx], ...updates, updatedAt: Date.now() };
      await syncTrip(globalTrips[idx]);
      return globalTrips[idx];
    }
    return null;
  }

  static async delete(id: string) {
    const idx = globalTrips.findIndex(t => t.id === id);
    if (idx !== -1) {
      const removed = globalTrips.splice(idx, 1)[0];
      await removeTrip(id);
      return removed;
    }
    return null;
  }
}
