/**
 * Shared Ride Types
 * Shared data contracts between Frontend and Backend
 */

export type AppMode = 'rider' | 'driver';
export type Intent = 'ride' | 'carpool' | 'intercity' | 'intercity-carpool';
export type BookingStep = 'idle' | 'searching' | 'selecting' | 'confirming' | 'live';
export type RideCategory = 'bike' | 'auto' | 'mini' | 'sedan' | 'suv';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
  name?: string;
  city?: string;
  state?: string;
}

export interface RideOption {
  id: string;
  type: RideCategory;
  name: string;
  price: number;
  eta: number;
  seats?: number;
  description?: string;
  baseFare?: number;
  perKmRate?: number;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone?: string;
  rating: number;
  tripsCount?: number;
  vehicle: string;
  vehicleType?: RideCategory;
  plate: string;
  avatar: string;
  coords?: [number, number];
  rotation?: number;
  status?: 'idle' | 'arriving' | 'active' | 'offline';
  lastSeen?: number;
}

export interface SharedTrip {
  id: string;
  type: Intent | string;
  status: 'searching' | 'accepted' | 'arrived' | 'active' | 'completed' | 'cancelled';
  customerId?: string;
  driverId?: string;
  driver?: DriverProfile;
  pickup: LocationCoordinates;
  drop: LocationCoordinates;
  price: number;
  distance: string;
  duration: string;
  fareBreakdown?: {
    baseFare: number;
    distanceCharge: number;
    platformFee: number;
    tax: number;
    totalFare: number;
  };
  otp?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface WalletBalance {
  userId: string;
  balance: number;
  currency: string;
  holdAmount?: number;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  timestamp: string | number;
  referenceId?: string;
  status: 'pending' | 'success' | 'failed';
}
