export interface SystemNotificationTrigger {
  id: string;
  category: 'rider' | 'driver' | 'payment' | 'safety' | 'marketing';
  title: string;
  templateTitle: string;
  templateBody: string;
  targetAudience: 'Riders' | 'Drivers' | 'Both';
  triggerEvent: string;
  icon: string;
  defaultEnabled: boolean;
  priority: 'High' | 'Normal' | 'Urgent';
  cooldownHours?: number;
  description: string;
  samplePayload?: {
    actionLabel?: string;
    actionUrl?: string;
  };
}

export const SYSTEM_PUSH_TRIGGERS: SystemNotificationTrigger[] = [
  // 1. RIDER EXPERIENCE NOTIFICATIONS
  {
    id: 'notif_rider_driver_assigned',
    category: 'rider',
    title: 'Driver Partner Assigned',
    templateTitle: '🚖 Driver Partner Found!',
    templateBody: '{driver_name} ({rating}★) is driving a {vehicle_model} [{plate_number}] towards your pickup spot.',
    targetAudience: 'Riders',
    triggerEvent: 'When a nearby driver partner accepts the rider booking request',
    icon: 'Car',
    defaultEnabled: true,
    priority: 'High',
    description: 'Instant alert when a driver partner is dispatched to avoid passenger cancellation.',
    samplePayload: {
      actionLabel: 'Track Driver',
      actionUrl: '/tracking'
    }
  },
  {
    id: 'notif_rider_driver_arrived',
    category: 'rider',
    title: 'Driver Arrived at Pickup',
    templateTitle: '📍 Driver Has Arrived!',
    templateBody: '{driver_name} is waiting at your pickup location in {vehicle_model} [{plate_number}].',
    targetAudience: 'Riders',
    triggerEvent: 'When the driver partner reaches within 50 meters of the pickup pin',
    icon: 'MapPin',
    defaultEnabled: true,
    priority: 'Urgent',
    description: 'Alerts rider to proceed to the vehicle immediately to avoid wait-time charges.',
    samplePayload: {
      actionLabel: 'View Vehicle',
      actionUrl: '/tracking'
    }
  },
  {
    id: 'notif_rider_trip_started',
    category: 'rider',
    title: 'Trip Started & Live OTP Verified',
    templateTitle: '🚀 Trip in Progress',
    templateBody: 'Your trip to {destination_address} has commenced safely. Share your live trip status with family.',
    targetAudience: 'Riders',
    triggerEvent: 'When the driver inputs and validates the 4-digit start OTP',
    icon: 'ShieldCheck',
    defaultEnabled: true,
    priority: 'Normal',
    description: 'Confirms safe trip commencement with live GPS route telemetry.',
    samplePayload: {
      actionLabel: 'Share Live Trip',
      actionUrl: '/safety'
    }
  },
  {
    id: 'notif_rider_trip_completed',
    category: 'rider',
    title: 'Trip Completed & Invoice Ready',
    templateTitle: '🎉 Destination Reached!',
    templateBody: 'You have arrived at {destination_address}. Total fare: ₹{fare_amount}. Receipt saved in Wallet.',
    targetAudience: 'Riders',
    triggerEvent: 'When the driver partner marks the trip as completed at the destination',
    icon: 'CheckCircle2',
    defaultEnabled: true,
    priority: 'High',
    description: 'Provides immediate fare breakdown and prompts for 5-star driver review.',
    samplePayload: {
      actionLabel: 'Rate & Pay',
      actionUrl: '/wallet'
    }
  },
  {
    id: 'notif_rider_nearby_cab_discount',
    category: 'marketing',
    title: 'Nearby Fleet Availability & Discount',
    templateTitle: '⚡ Cabs Available in 2 Mins!',
    templateBody: 'Grab 20% OFF your next ride with code MONSOON20. Drivers are around your area now.',
    targetAudience: 'Riders',
    triggerEvent: 'When high driver density is detected near inactive rider locations',
    icon: 'Zap',
    defaultEnabled: true,
    priority: 'Normal',
    cooldownHours: 24,
    description: 'Re-engagement nudge when cabs are plentiful in the commuter zone.',
    samplePayload: {
      actionLabel: 'Book Now',
      actionUrl: '/booking'
    }
  },
  {
    id: 'notif_rider_referral_reward',
    category: 'rider',
    title: 'Referral Bonus Credited',
    templateTitle: '🎁 Referral Bonus Added!',
    templateBody: 'Your friend {friend_name} completed their first ride. ₹{reward_amount} added to your Wallet balance!',
    targetAudience: 'Riders',
    triggerEvent: 'When an invited referee completes their qualifying first ride',
    icon: 'Gift',
    defaultEnabled: true,
    priority: 'Normal',
    description: 'Notifies users of successful viral referral wallet payouts.',
    samplePayload: {
      actionLabel: 'View Wallet',
      actionUrl: '/wallet'
    }
  },

  // 2. DRIVER PARTNER NOTIFICATIONS
  {
    id: 'notif_driver_new_booking_radar',
    category: 'driver',
    title: 'Incoming Ride Request Alert',
    templateTitle: '🚨 New Ride Request Nearby!',
    templateBody: 'Pickup: {pickup_area} ({distance_km} km away) • Estimated Fare: ₹{est_fare}. Tap to Accept (15s).',
    targetAudience: 'Drivers',
    triggerEvent: 'When an active commuter requests a ride in the driver radius',
    icon: 'BellRing',
    defaultEnabled: true,
    priority: 'Urgent',
    description: 'Critical high-priority audio & push alert to accept upcoming trips within 15 seconds.',
    samplePayload: {
      actionLabel: 'Accept Ride',
      actionUrl: '/driver-portal'
    }
  },
  {
    id: 'notif_driver_rider_cancelled',
    category: 'driver',
    title: 'Rider Cancellation Alert',
    templateTitle: '❌ Ride Cancelled by Rider',
    templateBody: 'Ride #{trip_id} was cancelled by the passenger. A ₹{cancellation_fee} fee has been credited to your earnings.',
    targetAudience: 'Drivers',
    triggerEvent: 'When a commuter cancels an active dispatched trip',
    icon: 'AlertTriangle',
    defaultEnabled: true,
    priority: 'High',
    description: 'Immediately frees the driver radar and updates wallet with cancellation compensation.',
    samplePayload: {
      actionLabel: 'Back to Radar',
      actionUrl: '/driver-portal'
    }
  },
  {
    id: 'notif_driver_instant_payout',
    category: 'payment',
    title: 'Instant Bank / UPI Payout Dispatched',
    templateTitle: '💰 Payout Deposited: ₹{amount}',
    templateBody: 'Your withdrawal payout of ₹{amount} has been successfully settled to your UPI / Bank account.',
    targetAudience: 'Drivers',
    triggerEvent: 'When automated driver end-of-day or on-demand wallet settlement succeeds',
    icon: 'Wallet',
    defaultEnabled: true,
    priority: 'High',
    description: 'Instant notification on successful earnings bank transfer.',
    samplePayload: {
      actionLabel: 'Earnings Report',
      actionUrl: '/earnings'
    }
  },
  {
    id: 'notif_driver_surge_hotspot',
    category: 'driver',
    title: 'Surge Pricing & Hotspot Zone Alert',
    templateTitle: '🔥 High Demand Surge Zone (1.8x)',
    templateBody: 'High ride demand detected in {zone_name}! Head towards the hotspot for 1.8x multiplier earnings.',
    targetAudience: 'Drivers',
    triggerEvent: 'When demand-supply ratio triggers automatic surge multiplier in a specific geofence',
    icon: 'TrendingUp',
    defaultEnabled: true,
    priority: 'Normal',
    cooldownHours: 6,
    description: 'Directs idle driver fleet to high passenger density zones.',
    samplePayload: {
      actionLabel: 'View Heatmap',
      actionUrl: '/driver-portal'
    }
  },
  {
    id: 'notif_driver_kyc_approved',
    category: 'driver',
    title: 'Document & KYC Verification Approval',
    templateTitle: '✅ Account Verified & Approved!',
    templateBody: 'Congratulations! Your Driver License and Vehicle documents are approved. You can now go ONLINE.',
    targetAudience: 'Drivers',
    triggerEvent: 'When administrator or AI KYC approves the pending onboarding documents',
    icon: 'FileCheck',
    defaultEnabled: true,
    priority: 'High',
    description: 'Notifies newly onboarded driver partners that their fleet status is activated.',
    samplePayload: {
      actionLabel: 'Go Online',
      actionUrl: '/driver-portal'
    }
  },

  // 3. SAFETY & SOS DISPATCHES
  {
    id: 'notif_safety_sos_triggered',
    category: 'safety',
    title: 'Emergency SOS Alert Triggered',
    templateTitle: '🚨 EMERGENCY SOS ACTIVE',
    templateBody: 'Emergency SOS dispatched for Trip #{trip_id}. Live GPS telemetry shared with emergency contacts & admin desk.',
    targetAudience: 'Both',
    triggerEvent: 'When passenger or driver hits the SOS panic emergency button',
    icon: 'ShieldAlert',
    defaultEnabled: true,
    priority: 'Urgent',
    description: 'Broadcasts emergency coordinates to emergency response dispatchers and trusted contacts.',
    samplePayload: {
      actionLabel: 'View SOS Desk',
      actionUrl: '/sos'
    }
  },
  {
    id: 'notif_safety_route_deviation',
    category: 'safety',
    title: 'Route Deviation & Prolonged Stop Alert',
    templateTitle: '🛡️ Safety Check: Are you okay?',
    templateBody: 'We detected an unexpected route deviation or stop for Trip #{trip_id}. Tap to confirm you are safe.',
    targetAudience: 'Riders',
    triggerEvent: 'When real-time GPS deviates by >500m from prescribed OSRM navigation path',
    icon: 'Navigation',
    defaultEnabled: true,
    priority: 'High',
    description: 'Proactive in-app and push welfare check for commuter safety during nocturnal or highway rides.',
    samplePayload: {
      actionLabel: "I'm Safe",
      actionUrl: '/safety'
    }
  }
];
