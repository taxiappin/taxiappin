/**
 * Backend Data Contracts & Domain Types
 */
import { LocationCoordinates, RideCategory } from "../../../shared/types/ride.types";

export interface CreateRidePayload {
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  pickup: LocationCoordinates;
  drop: LocationCoordinates;
  rideType: RideCategory;
  price: number;
  distance: string;
  duration: string;
}

export interface RideEntity {
  id: string;
  type: string;
  status: string;
  customerId: string;
  driverId?: string;
  pickup: LocationCoordinates;
  drop: LocationCoordinates;
  price: number;
  distance: string;
  duration: string;
  createdAt: number;
  driverCoords?: [number, number];
  driverRotation?: number;
  otp?: string;
}

export interface WalletTransactionPayload {
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  referenceId?: string;
}
