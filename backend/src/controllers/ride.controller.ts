import { Request, Response } from "express";
import { 
  getTrips,
  createTrip,
  cancelTrip,
  deleteTrip,
  verifyTripOtp,
  updateTrip,
  getDrivers,
  updateDriverStatus
} from "./trip.controller";
import { FareService } from "../services/fare.service";
import { RideCategory } from "../../../shared/types/ride.types";

export {
  getTrips as getRides,
  createTrip as createRide,
  cancelTrip as cancelRide,
  deleteTrip as deleteRide,
  verifyTripOtp as verifyRideOtp,
  updateTrip as updateRide,
  getDrivers,
  updateDriverStatus
};

export async function estimateFare(req: Request, res: Response) {
  try {
    const { distanceKm, durationMinutes, category, surgeMultiplier } = req.body;
    const estimate = FareService.calculateFare({
      distanceKm: Number(distanceKm) || 5,
      durationMinutes: Number(durationMinutes) || 15,
      category: (category as RideCategory) || 'mini',
      surgeMultiplier: Number(surgeMultiplier) || 1.0
    });
    return res.json({ success: true, estimate });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
