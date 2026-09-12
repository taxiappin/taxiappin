import { RideCategory } from "../../../shared/types/ride.types";

interface FareCalculationOptions {
  distanceKm: number;
  durationMinutes: number;
  category: RideCategory;
  surgeMultiplier?: number;
}

export class FareService {
  private static categoryRates: Record<RideCategory, { base: number; perKm: number; perMin: number; minFare: number }> = {
    bike: { base: 25, perKm: 7, perMin: 1.0, minFare: 30 },
    auto: { base: 35, perKm: 12, perMin: 1.2, minFare: 40 },
    mini: { base: 50, perKm: 14, perMin: 1.5, minFare: 60 },
    sedan: { base: 70, perKm: 18, perMin: 1.8, minFare: 80 },
    suv: { base: 100, perKm: 24, perMin: 2.5, minFare: 120 },
  };

  static calculateFare(options: FareCalculationOptions) {
    const { distanceKm, durationMinutes, category, surgeMultiplier = 1.0 } = options;
    const rates = this.categoryRates[category] || this.categoryRates.sedan;

    const baseFare = rates.base;
    const distanceCharge = Math.max(0, distanceKm) * rates.perKm;
    const timeCharge = Math.max(0, durationMinutes) * rates.perMin;
    const subtotal = (baseFare + distanceCharge + timeCharge) * surgeMultiplier;
    const finalFare = Math.round(Math.max(rates.minFare, subtotal));

    return {
      category,
      baseFare,
      distanceKm,
      distanceCharge: Math.round(distanceCharge),
      timeCharge: Math.round(timeCharge),
      surgeMultiplier,
      totalFare: finalFare,
      currency: "INR"
    };
  }
}
