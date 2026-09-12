export interface CountryItem {
  id: string;
  name: string;
  code: string;       // Dial code e.g. +91
  isoCode: string;    // e.g. IN, US
  flag: string;       // e.g. 🇮🇳
  maxDigits: number;
  example: string;    // e.g. 9876543210
  active: boolean;
  validationRegex?: string;
}

export interface StateItem {
  id: string;
  name: string;
  countryName: string;
  code?: string;       // e.g. MH, CA, NY
  active: boolean;
}

export interface CityItem {
  id: string;
  name: string;
  stateName: string;
  countryName: string;
  tier?: string;       // e.g. Tier 1, Tier 2, Tier 3
  localAreas?: string[]; // e.g. ["Baner", "Hinjawadi", "Kothrud"]
  active: boolean;
}

export interface RiderFieldItem {
  key: string;
  enabled: boolean;
  mandatory: boolean;
  label: string;
  helper?: string;
  type?: string;
  stepId?: number; // Step 1, Step 2, or Step 3
}

export interface DriverStepItem {
  id: number;
  key: string;
  enabled: boolean;
  label: string;
  description: string;
}

export interface DriverFieldItem {
  key: string;
  enabled: boolean;
  mandatory: boolean;
  label: string;
  stepId: number;
  helper?: string;
  type?: string;
}

export interface VehicleCategoryItem {
  id: string;
  name: string;
  icon?: string;
  baseFare?: number;
  perKmRate?: number;
  enabled: boolean;
}

export interface VehicleBrandItem {
  id: string;
  brandName: string;
  category: string; // e.g. Hatchback, Sedan, SUV
  models: string[]; // e.g. ["Dzire", "Swift", "Brezza"]
  enabled: boolean;
}

export interface SampleDocumentItem {
  id: string;
  docType: "driving_license" | "vehicle_rc" | "vehicle_insurance" | "national_id" | "biometric_selfie";
  title: string;
  sampleUrl?: string;
  frontSampleUrl?: string;
  backSampleUrl?: string;
  instructions: string;
  required: boolean;
}

export interface SubscriberItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "rider" | "driver";
  promoSubscribed: boolean;
  subscribedAt: string;
}

export interface LegalPolicySettings {
  termsUrl: string;
  termsTitle: string;
  privacyUrl: string;
  privacyTitle: string;
  rulesUrl: string;
  rulesTitle: string;
  minAgeRequired: number;
}

export interface SessionSecuritySettings {
  sessionTimeoutMinutes: number;
  inactivityTimeoutMinutes: number;
  enableFraudPrevention: boolean;
  allowStayLoggedIn: boolean;
  maxActiveSessionsPerUser: number;
  logoutMessage: string;
  requireReauthForDriverDispatch?: boolean;
}
