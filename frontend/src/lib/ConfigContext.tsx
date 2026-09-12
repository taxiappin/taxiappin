import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { PlatformConfig } from '../types';
import { EMBEDDED_VEHICLES } from './embeddedVehicles';

interface ConfigContextType {
  config: PlatformConfig;
  updateConfig: (newConfig: Partial<PlatformConfig> | ((prev: PlatformConfig) => PlatformConfig)) => void;
  isModuleEnabled: (moduleId: keyof PlatformConfig['modules']) => boolean;
}

const DEFAULT_CONFIG: PlatformConfig = {
  landingPage: {
    enabled: true,
    heroTitle: "Fast, Reliable & Safe Taxi Rides Whenever You Need",
    heroSubtitle: "Book local rides, instant airport transfers, outstation cab journeys, and carpool trips with verified top-rated drivers.",
    ctaText: "Book Your Ride Now",
    heroImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
    showBlogs: true,
    showTestimonials: true,
    showFaqs: true,
    showAppDownload: true,
    playStoreUrl: "https://play.google.com",
    appStoreUrl: "https://apple.com/app-store",
    seoKeywords: "taxi app, cab booking, airport transfer, outstation cabs, driver earnings, safe city rides",
    features: [
      { id: "f1", title: "Instant & Scheduled Rides", desc: "Book in seconds or schedule hours in advance with guaranteed zero cancellations.", icon: "Zap" },
      { id: "f2", title: "100% Verified Drivers", desc: "Background-checked, police-verified professional drivers with top safety ratings.", icon: "ShieldCheck" },
      { id: "f3", title: "Upfront Transparent Fares", desc: "No hidden charges or surprise surge rates. What you see is exactly what you pay.", icon: "CheckCircle2" },
      { id: "f4", title: "24/7 SOS & Live Track", desc: "Share real-time GPS coordinates with emergency contacts and direct control center access.", icon: "MapPin" }
    ],
    testimonials: [
      {
        id: "t1",
        name: "Ananya Sharma",
        role: "Daily Commuter (Rider)",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
        comment: "The airport pre-booking saved my trip! The driver arrived 10 minutes early in a sparkling clean sedan. Zero stress."
      },
      {
        id: "t2",
        name: "Rajesh Kumar",
        role: "Partner Driver (5,000+ Trips)",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        comment: "Daily payouts straight to my UPI wallet and clear trip fares. My earnings jumped 30% compared to other ride-hailing apps."
      },
      {
        id: "t3",
        name: "Vikram Mehta",
        role: "Corporate Travel Manager",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
        comment: "Our entire office team relies on TaxiApp for outstation business meetings. On-time invoices and extremely reliable vehicles."
      }
    ],
    faqs: [
      { id: "q1", q: "How do I book a ride?", a: "Simply open our app or click 'Book Ride' on this page, enter your pickup and drop location, pick your vehicle category, and confirm!" },
      { id: "q2", q: "Are fares fixed or metered?", a: "All fares are calculated upfront before you confirm booking. There are no hidden surcharges or post-trip surprises." },
      { id: "q3", q: "How do I apply as a driver partner?", a: "Switch to Driver Mode in the app or tap 'Driver Login', complete your KYC document upload, and get verified within 24 hours." }
    ]
  },
  blogsList: [
    {
      id: "blog_1",
      slug: "night-taxi-safety-tips-2026",
      title: "10 Essential Safety Tips for Night Taxi Trips in 2026",
      excerpt: "Learn how live GPS tracking, emergency SOS buttons, driver verification badges, and OTP trip start safeguard every night journey.",
      content: `### Staying Safe During Late Night Cab Trips

Night travel requires extra vigilance and smart app features. Here are the top 10 safety measures built into our taxi app to ensure every passenger reaches their destination securely:

1. **Verify Driver Profile & License Plate**: Always match the vehicle plate number and driver photo on your screen before opening the cab door.
2. **In-App OTP Verification**: Our drivers cannot start the trip until you share the unique 4-digit PIN generated on your phone.
3. **Live GPS Trip Sharing**: Tap the "Share Live Location" button to send an active tracking link to your family via WhatsApp or SMS.
4. **24/7 Dedicated SOS Panic Button**: In an emergency, pressing the in-app SOS immediately alerts our 24/7 security desk and dispatches local assistance.
5. **Driver Background & Police Clearance**: 100% of driver partners undergo background checks and biometric document validation before taking rides.
6. **Cashless Digital Payments**: Avoid carrying large sums of physical cash late at night by paying via UPI, credit card, or wallet.
7. **Well-Lit Pickup Zones**: Always wait inside well-lit lobbies or main street areas rather than dark side alleys.
8. **In-App Voice Masking**: Call your driver safely through masked phone numbers without exposing your personal mobile number.
9. **Audio & Route Anomaly Detection**: Our AI engine monitors sudden off-route detours or unexpected long stops during night trips.
10. **Post-Trip Review & Feedback**: Rate your driver after every journey to help maintain high community safety standards.`,
      coverImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1000",
      category: "Safety & Mobility",
      author: "Security Team",
      date: "Aug 08, 2026",
      readTime: "5 min read",
      tags: ["Safety", "Night Ride", "GPS Tracking", "OTP"],
      status: "Published",
      views: 1240
    },
    {
      id: "blog_2",
      slug: "airport-cab-pre-booking-guide",
      title: "Why Airport Cab Pre-Booking Saves Time & Up to 30% Money",
      excerpt: "Avoid last-minute surge prices, airport parking hassles, and long taxi queues by pre-scheduling guaranteed airport transfers.",
      content: `### Pre-Booking Your Airport Transfer Made Simple

Catching an early morning flight or landing after an exhausting long-haul journey? Pre-booking your airport cab is the smartest way to guarantee a hassle-free trip.

#### Key Advantages of Airport Pre-Booking:
- **Flight Number Tracking**: Enter your flight code during booking, and our system automatically adjusts pickup times if your flight is delayed or lands early.
- **Zero Surge Guarantee**: Lock in your fixed fare when you schedule, protecting you from sudden 2x or 3x airport surge pricing.
- **Dedicated Driver Pickup**: Your driver waits at the designated arrivals terminal exit with your name card.
- **Spacious Boot Luggage Capacity**: Choose from Hatchback, Sedan, or SUV models tailored to your luggage volume.
- **24-Hour Buffer Cancelation**: Need to alter your plans? Modify or cancel your scheduled airport ride up to 2 hours prior with zero penalty.`,
      coverImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
      category: "Airport Transfers",
      author: "Operations Desk",
      date: "Aug 05, 2026",
      readTime: "4 min read",
      tags: ["Airport Cab", "Pre-Booking", "Flight Tracker", "Surge Protection"],
      status: "Published",
      views: 980
    },
    {
      id: "blog_3",
      slug: "taxi-driver-earnings-guide-2026",
      title: "Driver Earnings Guide: How Top Taxi Partners Earn ₹45,000+ Monthly",
      excerpt: "Discover peak-hour multipliers, daily trip bonus incentives, zero-commission subscription models, and instant wallet payouts.",
      content: `### Maximize Your Daily Income as a Cab Partner

Driving with TaxiApp offers complete freedom, flexible working hours, and industry-leading payout structures. Here is how our top-performing driver partners consistently earn above ₹45,000 every month.

#### Proven Strategies to Boost Driver Revenue:
1. **Target High-Demand Peak Hours**: Morning office hours (8 AM - 11 AM) and evening rush hours (5 PM - 9 PM) feature surge pricing multipliers.
2. **Unlock Daily Target Bonuses**: Complete 8 rides a day to trigger ₹300 daily cash bonuses directly in your driver wallet.
3. **Zero-Commission Monthly Plans**: Opt for our flat subscription fee instead of per-ride percentage cuts, keeping 100% of your trip fares!
4. **Instant Instant Bank Payouts**: Cash out your earnings anytime 24/7 with instant UPI transfers—no waiting for weekly payout cycles.
5. **Outstation High-Value Trips**: Accept intercity weekend rides for higher per-km rates and round-trip return allowances.`,
      coverImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1000",
      category: "Driver Fleet",
      author: "Driver Community",
      date: "Aug 02, 2026",
      readTime: "6 min read",
      tags: ["Driver Earnings", "Incentives", "Zero Commission", "Wallet Payout"],
      status: "Published",
      views: 1850
    },
    {
      id: "blog_4",
      slug: "outstation-cab-vs-train-travel-comparison",
      title: "Outstation Cab vs Train Travel: Complete Cost & Comfort Comparison",
      excerpt: "Door-to-door comfort, luggage space, flexible departure times, and transparent per-km fares compared against scheduled trains.",
      content: `### Outstation Cabs vs Intercity Trains

Planning a weekend getaway or family trip to a nearby city? Choosing between an outstation cab booking and train tickets can make or break your trip experience.

#### Direct Comparison Breakdown:

| Feature | Outstation Taxi App | Railway / Train |
| :--- | :--- | :--- |
| **Door-to-Door Pick** | Picked up at your doorstep | Travel to station + taxi queue |
| **Schedule Flexibility** | Leave whenever you want | Fixed departure timetable |
| **Luggage Limits** | Boot space unlimited | Heavy lifting across platforms |
| **Group Travel Cost** | Split fare among 4 passengers | Multiple individual tickets |
| **Sightseeing Stops** | Stop at restaurants & scenic views | Non-stop train express |

#### Why Families Prefer Outstation Taxi Cabs:
When traveling with elderly parents or young kids, the convenience of private air-conditioned cars, custom roadside dining breaks, and direct drop at your hotel outweighs crowded railway platforms.`,
      coverImage: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1000",
      category: "Intercity Journeys",
      author: "Travel Editorial",
      date: "Jul 28, 2026",
      readTime: "5 min read",
      tags: ["Outstation Cabs", "Intercity", "Door-to-Door", "Fare Calculator"],
      status: "Published",
      views: 740
    },
    {
      id: "blog_5",
      slug: "ev-cab-fleet-zero-emission-rides",
      title: "The Future of EV Cab Fleets & Zero-Emission City Rides",
      excerpt: "How electric taxi fleets reduce city pollution, cut ride fares by 20%, and deliver quiet, smooth urban commuting.",
      content: `### Driving Green: The Rise of Electric Taxis

Electric Vehicles (EVs) are revolutionizing urban transportation. Our eco-friendly EV cab fleet combines sustainability, lower ride pricing, and whisper-quiet passenger comfort.

#### Why Electric Cabs Are Better for Everyone:
- **Quiet & Smooth Cabin**: Zero engine noise or gear vibration creates a serene atmosphere for working on your laptop or relaxing on the move.
- **Lower Operating Costs = Cheaper Fares**: Electricity is significantly cheaper than petrol or diesel, allowing us to pass up to 20% fare savings to passengers.
- **Zero Tailpipe Carbon Footprint**: Every 10 km EV ride prevents over 1.5 kg of CO2 emissions in our city air.
- **Fast-Charging Fleet Hubs**: Strategically placed rapid chargers ensure EV taxis stay on the road with minimal downtime.

Join our green movement today by selecting the **EV Eco** category on your next booking!`,
      coverImage: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1000",
      category: "Sustainability",
      author: "Eco Tech Team",
      date: "Jul 20, 2026",
      readTime: "4 min read",
      tags: ["Electric Vehicles", "EV Taxi", "Zero Emission", "Green Rides"],
      status: "Published",
      views: 1120
    }
  ],
  maintenanceMode: false,
  maintenanceConfig: {
    enabled: false,
    title: 'System Under Maintenance',
    message: 'We are currently performing scheduled infrastructure upgrades and security enhancements. We will be back online shortly!',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    eta: '30 Minutes',
    contactEmail: 'support@taxiapp.com',
    allowedRoles: ['admin', 'super_admin']
  },
  environmentPipeline: {
    mode: 'production',
    autoCleanOnProdSwitch: true,
    lastProdDeployment: 'Real-Time Active',
    simulatedGpsDelayMs: 0
  },
  testMode: false,
  riderFreePlanEnabled: true,
  driverFreePlanEnabled: true,
  subscriptionBannerTitle: 'Unlock Premium Member Club',
  subscriptionBannerText: 'If you want to change your subscription, just choose a different plan at the top and click the "Subscribe" button',
  marquees: [
    {
      id: 'marquee_rider_1',
      text: '📢 RIDER FLASH: Use promo code WELCOME50 to get flat ₹50 off on your very first ride booking! Travel safe with our premium certified hatchback and sedan partners.',
      fontSize: 13,
      bgColor: '#FAB818',
      textColor: '#000000',
      speed: 15,
      link: 'https://example.com',
      enabled: true,
      audience: 'rider'
    },
    {
      id: 'marquee_driver_1',
      text: '⚡ DRIVER NOTICE: Complete 5 local trips today and get ₹100 cash incentive credited directly to your operator wallet. Check earnings history for live updates!',
      fontSize: 13,
      bgColor: '#FAB818',
      textColor: '#000000',
      speed: 15,
      link: 'https://example.com',
      enabled: true,
      audience: 'driver'
    }
  ],
  modules: {
    ride: true,
    intercity: true,
    carpool: true,
    marketplace: true,
    scheduled: true,
    wallet: true,
  },
  pricing: {
    surgeEnabled: true,
    localFee: 15,
    intercityFee: 12,
    localTripThresholdKm: 50,
    waitingPerKm: 5,
    localCoverFactor: 30, // Default 30 km/h cover factor
    intercityCoverFactor: 70, // Default 70 km/h cover factor
    soloMultiplier: 1.0,
    carpoolMultiplier: 0.7,
    localBaseFare: 40,
    intercityBaseFare: 100,
    soloBaseFare: 50,
    carpoolBaseFare: 30,
    gstEnabled: true,
    gstPercentage: 5,
    couponEnabled: true,
    couponCode: "SAVE10",
    couponDiscountPercentage: 10,
    taxesSectionEnabled: true,
    platformFeesSectionEnabled: true,
    customSurchargesSectionEnabled: true,
    riderCouponEnabled: true,
    riderCouponCode: "RIDER50",
    riderCouponType: "Flat",
    riderCouponValue: 50,
    driverCouponEnabled: true,
    driverCouponCode: "DRV20",
    driverCouponType: "Flat",
    driverCouponValue: 20,
    additionalChargesEnabled: true,
    additionalChargesAmount: 15,
    waitingChargesEnabled: true,
    promoCodes: [
      { id: '1', code: 'WELCOME50', description: 'Flat ₹50 off on your first ride', discount: 50, type: 'flat', minFare: 150, maxDiscount: 50, expiry: '2026-12-31', status: 'Active', usageCount: 145, recipient: 'RIDER' },
      { id: '2', code: 'MONSOON25', description: '25% discount during monsoon rain', discount: 25, type: 'percentage', minFare: 100, maxDiscount: 75, expiry: '2026-07-31', status: 'Active', usageCount: 232, recipient: 'RIDER' },
      { id: '3', code: 'AIRPORT150', description: 'Special airport transfer coupon', discount: 150, type: 'flat', minFare: 500, maxDiscount: 150, expiry: '2026-09-30', status: 'Active', usageCount: 68, recipient: 'RIDER' },
      { id: '4', code: 'RIDENOW', description: '10% discount on weekday travel', discount: 10, type: 'percentage', minFare: 120, maxDiscount: 50, expiry: '2026-06-30', status: 'Expired', usageCount: 512, recipient: 'RIDER' },
      { id: '5', code: 'DRV20', description: 'Flat ₹20 completed ride bonus incentive', discount: 20, type: 'flat', minFare: 100, maxDiscount: 20, expiry: '2026-12-31', status: 'Active', usageCount: 340, recipient: 'DRIVER' },
      { id: '6', code: 'DRV_PEAK', description: '15% extra driver incentive during high peak hours', discount: 15, type: 'percentage', minFare: 150, maxDiscount: 100, expiry: '2026-12-31', status: 'Active', usageCount: 112, recipient: 'DRIVER' }
    ]
  },
  security: {
    mandatorySos: true,
    restrictNightRides: false,
    shadowBanEnabled: true,
  },
  general: {
    platformName: 'TaxiApp',
    contactEmail: 'ops@taxiapp.com',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    riderWelcomeImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600',
  },
  razorpay: {
    keyId: "rzp_live_TYiPjYgvWmFKof",
    keySecret: "fM9jy54kYSuB85I9GDpk2YDC",
    enabled: true
  },
  payment: {
    environment: 'production',
    merchantId: '',
    keyId: "rzp_live_TYiPjYgvWmFKof",
    keySecret: "fM9jy54kYSuB85I9GDpk2YDC",
    webhookSecret: ''
  },
  vehicles: EMBEDDED_VEHICLES,
  rules: [
    {
      id: 'rule_local_ride_limit',
      name: 'Local Ride Limit Threshold Range',
      description: 'Defines the distance limit (in kilometers) below which rides are classified as Local. Rides under this limit have ride modes restricted to local carriers.',
      enabled: true,
      value: 'Rides below 50 km are treated as Local. Under local limits, only local-eligible vehicles can accept them. Rides >= 50 km are intercity.',
      category: 'dispatch'
    },
    {
      id: 'rule_intercity_min',
      name: 'Intercity Ride Threshold Limit',
      description: 'Rides equal to or above this distance threshold in km undergo Intercity carpool/travel regulations. Only vehicles registered for intercity can execute them.',
      enabled: true,
      value: 'Rides with distance >= 50 km are marked as Intercity. Standard city auto-rickshaws and bikes are banned from intercity trips.',
      category: 'dispatch'
    },
    {
      id: 'rule_driver_range_preferences',
      name: 'Driver Range Preference Filter Compliance',
      description: 'Restrict incoming dispatch alerts appearing on matching driver dashboards based on their current operating preference choice (\'All\', \'Local Only\', or \'Intercity Only\').',
      enabled: true,
      value: 'Drivers who register as \'Local\' are strictly isolated from receiving intercity alerts or request feeds. Drivers registered as \'Intercity\' will ONLY receive matching intercity jobs, with 100% coverage, filtering out local urban noise.',
      category: 'dispatch'
    },
    {
      id: 'rule_auto_accept_bypass',
      name: 'Smart Virtual Auto-Accept & Operator Control',
      description: 'If a real driver is active and online in the dispatch cell, bypass the background simulated auto-accept loop to let the human operator manually test accepts/bids.',
      enabled: true,
      value: 'Automatically assign simulated drivers to live rider requests within 4 seconds when no real human drivers are active on the platform.',
      category: 'system'
    },
    {
      id: 'rule_ac_preference',
      name: 'AC Cabin Ventilation Preference Code',
      description: 'Only alerts drivers possessing active matching air conditioner specifications when a rider specifies or requests high comfort class rides.',
      enabled: true,
      value: 'Riders may select AC-conditioned vehicle preferences. High-tier air comfort is enforced for hatchbacks, sedans, and premium SUVs only.',
      category: 'comfort'
    },
    {
      id: 'rule_silent_preference',
      name: 'Muted Quiet Ride Comfort Preference',
      description: 'Instructs the system dashboard and the active driver to preserve silent transit environments when riders toggle silent preferences.',
      enabled: true,
      value: 'A rider can request quiet transit mode. If enabled, the driver receives an alert instructing them to keep conversation. Muted safe ride feedback is shown on the dashboard.',
      category: 'comfort'
    },
    {
      id: 'rule_pricing_rate_base',
      name: 'Dynamic Pricing Base Rate Calculations',
      description: 'Computes fares automatically from starting coordinates using variable vehicle rates (e.g. ₹15/km base for Mini, ₹18/km Premium) with flat state/city border adjustments.',
      enabled: true,
      value: 'Pricing engine compiles base fares of ₹15/km for local hatchbacks, and ₹12/km for larger intercity sedan fleets, with a default waiting fee cap of ₹5/minute.',
      category: 'pricing'
    }
  ],
  moduleConditions: {
    ride: "Enable for trips within city boundary limits under 50km. System flags local hatchbacks and mini-segments to receive priority routing.",
    intercity: "Enable for inter-state highway commutes. Requires drivers to have highway permits and standard emergency survival kits.",
    carpool: "Limits pooling matching to maximum 2 concurrent riders on the same path with at most a 15-minute detour penalty.",
    marketplace: "Allows open bidding on rides where riders can choose their driver based on bid fare, rating, or ETA within 3 minutes of request lifecycle.",
    scheduled: "Allows booking trips up to 30 days in advance. Automatically schedules pre-allocated driver matching 30 minutes before pickup.",
    wallet: "Enforces virtual wallet settlements. Restricts riders with negative balance of more than ₹150 from booking post-paid trips."
  },
  beforeGoInfo: [
    {
      id: 'bg_marketplace',
      title: 'We are a marketplace.',
      subtitle: 'We connect riders and drivers but do not operate vehicles or employ drivers.',
      icon: 'info',
      color: 'gold'
    },
    {
      id: 'bg_prepay',
      title: 'Never pay in advance.',
      subtitle: 'Pay cash directly to the driver at the start of your ride. Ignore any payment links.',
      icon: 'wallet',
      color: 'blue'
    },
    {
      id: 'bg_verify',
      title: 'Verify driver and vehicle',
      subtitle: 'before boarding. Match the name, photo, and car plate on your booking.',
      icon: 'verify',
      color: 'gold'
    },
    {
      id: 'bg_share',
      title: 'Share your trip.',
      subtitle: 'Let someone you trust know your route, driver, and expected arrival time.',
      icon: 'share',
      color: 'pink'
    }
  ],
  map: {
    tilePreset: 'esri-gray',
    roadHighlightColor: '#FAB818',
    roadHighlightWeight: 2,
    roadHighlightOpacity: 0.9,
    roadPulseAnimation: false,
    transitShadesEnabled: false,
    pickupIconUrl: '',
    dropoffIconUrl: '',
    pickupIconScale: 1.0,
    dropoffIconScale: 1.0,
    vehicleIconUrl: '/uploads/cartop.svg',
    vehicleIconScale: 0.7,
    bikeIconUrl: '/uploads/biketop.svg',
    bikeIconScale: 0.7,
    autoIconUrl: '/uploads/autotop.svg',
    autoIconScale: 0.7,
    riderIconUrl: '/uploads/driverprofile.svg',
    riderIconScale: 0.7,
    homeIconUrl: '',
    homeIconScale: 1.0,
    driverToRiderColor: '#FAB818',
    riderToDestColor: '#FAB818',
    markerBounceAnimation: false,
    showMinimap: true,
    frontVehicleIconUrl: '/uploads/carprofile.svg',
    frontBikeIconUrl: '/uploads/bikeprofile.svg',
    frontAutoIconUrl: '/uploads/autoprofile.svg',
    tileLayerUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  },
  branding: {
    primaryColor: '#FAB818',
    secondaryColor: '#0d5c56',
    accentColor: '#FAB818',
    bgColor: '#f8fafc',
    surfaceCardColor: '#ffffff',
    surfaceSoftColor: '#f1f5f9',
    textColor: '#0d5c56',
    textColorMuted: '#64748b',
    fontFamily: 'Poppins',
    headingFontFamily: 'Poppins',
    logoFontFamily: 'Poppins',
    backendFontFamily: 'Poppins',
    borderRadiusMd: 8,
    borderRadiusLg: 12,
    cardShadow: 'soft',
    borderWidth: 1,
    spacingDensity: 'comfortable',
    headingStyle: 'normal',
    logoUrl: '',
    darkLogoUrl: '',
    lightLogoUrl: '',
    textLogo: 'TaxiApp',
    horizontalLogoUrl: '',
    horizontalLogoDarkUrl: '',
    faviconUrl: '',
    logoType: 'combined',
    logoHeight: 36,
    logoWithText: true,
    tagline: 'PREMIUM MOBILITY ECOSYSTEM',
    landingLogoUrl: '',
    landingDarkLogoUrl: '',
    appLogoUrl: '',
    appDarkLogoUrl: '',
    backendLogoUrl: '',
    backendDarkLogoUrl: '',
    authLogoUrl: '',
    authDarkLogoUrl: '',
    riderTextLogo: 'TaxiApp',
    riderTagline: 'Rider',
    riderShowText: true,
    riderShowTagline: true,
    driverTextLogo: 'TaxiApp',
    driverTagline: 'Driver',
    driverShowText: true,
    driverShowTagline: true,
  },
  enabledFeatures: {
    dashboard: true,
    landing_page: true,
    seo_dashboard: true,
    languages_translations: true,
    refer_invite: true,
    referral_settings: true,
    ads_networks: true,
    riders: true,
    drivers: true,
    trips: true,
    tracking: false,
    earnings: true,
    verification: true,
    database: true,
    zones: false,
    services: true,
    peak_zones: false,
    heat_map: false,
    preferences: true,
    vehicles: true,
    sos: true,
    sos_alerts: true,
    trip_chats: true,
    driver_mode_switch: true,
    airports: true,
    reports: true,
    reviews: true,
    app_settings: true,
    price_control: true,
    subscriptions: true,
    subscribers: true,
    coupons: true,
    extra_charges: false,
    surge_prices: false,
    push_notifications: true,
    notify_templates: true,
    testimonials: true,
    banners: true,
    onboardings: true,
    blogs: true,
    pages: true,
    faqs: true,
    support_ticket: true,
    knowledge_bases: true,
    features: true,
    general_settings: true,
    appearance: true,
    system_tools: true,
    menus: true,
    branding: true,
    events: true,
    marquee: true,
    media: true,
    pipeline: true,
    maintenance_mode: true,
    mail_settings: true,
  },
  appSettings: {
    driverMatchingRadius: 5.0,
    gpsTelemetryUpdateDelay: 10,
    autoCancelBookingExpiration: 45,
  },
  pages: [
    {
      id: 'page_1',
      title: 'Terms and Conditions',
      slug: '/terms',
      content: `<h1 class="text-xl font-bold mb-4">Terms &amp; Conditions</h1>\n<p class="text-xs text-slate-500 mb-4">Last Updated: June 25, 2026</p>\n<p class="mb-3">Welcome to TaxiApp. These Terms &amp; Conditions ("Terms") govern your access to and use of the TaxiApp mobile application and services (collectively, the "Platform") operated in India.</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">1. Contracting Parties</h2>\n<p class="mb-3">By registering, installing, or using the Platform, you enter into a legally binding agreement with TaxiApp India Technologies Private Limited (referred to as "TaxiApp", "we", "us", or "our").</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">2. Services Offered</h2>\n<p class="mb-3">TaxiApp acts as an aggregator/facilitator providing an online marketplace platform that connects independent commercial transportation service providers ("Drivers") with passengers ("Riders") seeking transport services.</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">3. User Verification & Accounts</h2>\n<p class="mb-3">To utilize TaxiApp, you must register for an active user account. Riders must supply a verified mobile phone number, name, and valid payment profile. Drivers are subject to standard KYC verification including background checks, valid commercial driver\'s license (DL), Aadhaar, PAN card, and commercial vehicle insurance.</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">4. Fare and Payment Rules</h2>\n<p class="mb-3">Fares are computed dynamically based on distance, time, traffic, and surge multi-factors. All toll tax computations are done digitally using FasTag telemetry. Payment is processed in-app via UPI, card, or wallet, or can be paid in cash directly to the driver upon completion.</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">5. User Conduct</h2>\n<p class="mb-3">Riders and Drivers agree to treat each other with utmost respect. Any abuse, harassment, rash driving, or safety violation will result in immediate termination of account access and dynamic shadow-banning.</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">6. Limitation of Liability</h2>\n<p class="mb-3">TaxiApp facilitates peer-to-peer transport connections. We do not operate vehicles, employ drivers directly, or accept liability for any actions, delays, or incidents occurring during transit.</p>`,
      lastUpdated: 'Jan 10, 2026',
      status: 'Active'
    },
    {
      id: 'page_2',
      title: 'Privacy Policy',
      slug: '/privacy',
      content: `<h1 class="text-xl font-bold mb-4">Privacy Policy</h1>\n<p class="text-xs text-slate-500 mb-4">Last Updated: June 25, 2026</p>\n<p class="mb-3">At TaxiApp, protecting your privacy and personal data is our highest priority. This Privacy Policy outlines how we collect, store, process, and safeguard your personal information when using our mobile app and operator backend services.</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">1. Data We Collect</h2>\n<p class="mb-3">We collect several types of data to provide premium taxi services safely:</p>\n<ul class="list-disc list-inside space-y-1 mb-3 pl-2">\n  <li><strong>Precise Location Data:</strong> Continuous real-time GPS coordinates are captured to trace route trajectories, calculate ETAs, and trigger SOS alerts.</li>\n  <li><strong>Profile Information:</strong> Name, phone number, email address, and profile picture.</li>\n  <li><strong>KYC Documents:</strong> For drivers, we store encrypted copies of Driver\'s License, Aadhaar, PAN, and vehicle papers.</li>\n  <li><strong>Telemetry & Usage:</strong> Device logs, app crash diagnostics, and interactive screen histories.</li>\n</ul>\n\n<h2 class="text-sm font-bold mt-4 mb-2">2. How We Use Data</h2>\n<p class="mb-3">Captured data is used solely to facilitate successful matches, map routes, verify identity, automate billing via FasTag, and secure operations via our real-time safety monitor.</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">3. Data Sharing and Third-Parties</h2>\n<p class="mb-3">We do not sell your personal data. Location coordinates are shared live with matching drivers/passengers during active transit. In emergency situations, coordinates are sent to government SOS services and local law enforcement.</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">4. User Rights</h2>\n<p class="mb-3">You can request account deletion or data erasure at any time directly through the app settings drawer. Driver records are retained as mandated by legal security frameworks in India.</p>`,
      lastUpdated: 'Mar 15, 2026',
      status: 'Active'
    },
    {
      id: 'page_3',
      title: 'Refund Policy',
      slug: '/refunds',
      content: `<h1 class="text-xl font-bold mb-4">Refund &amp; Cancellation Policy</h1>\n<p class="text-xs text-slate-500 mb-4">Last Updated: June 25, 2026</p>\n<p class="mb-3">Thank you for riding with TaxiApp. This Refund &amp; Cancellation Policy details the terms governing cancellation fees, wrong fare adjustments, and user wallets refund mechanisms.</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">1. Ride Cancellations</h2>\n<p class="mb-3">Riders may cancel bookings free of charge within 3 minutes of a driver accepting the request. Cancellations made after this grace period, or when the driver has arrived at the pickup coordinate, will incur a flat cancellation fee of ₹50 to compensate driver fuel and time.</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">2. Driver-Initiated Cancellations</h2>\n<p class="mb-3">If a driver cancels after reaching the location, no fee is charged to the rider. If a driver fails to progress towards the pickup location within 5 minutes, riders can cancel without fee penalties.</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">3. Fare Overcharging & Discrepancies</h2>\n<p class="mb-3">If you believe you were overcharged due to map calculation errors, wrong toll collection, or incorrect route trajectory tracking, file a support ticket in the support screen. Disputed amounts will be audited by our operations team and refunded directly to your TaxiApp Wallet within 24 hours.</p>\n\n<h2 class="text-sm font-bold mt-4 mb-2">4. Wallet Balance Refunds</h2>\n<p class="mb-3">Prepaid wallet balances uploaded via Razorpay/UPI can be refunded back to the source bank account. Requests can be submitted via email to support@taxiapp.in. Processing takes 5-7 business days as per standard banking schedules.</p>`,
      lastUpdated: 'May 02, 2026',
      status: 'Active'
    }
  ],
  riderBanners: [
    { id: 'ban_r1', title: 'Airport Luxury Transfer - Flat 15% Off On Prime Sedans', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80', url: 'https://www.google.com', active: true, position: 'top', buttonText: 'Book Cab', buttonSize: 'sm', buttonBgColor: 'bg-amber-400 text-slate-950 hover:bg-amber-300', buttonTextColor: '#000000', scrollingSpeed: 3.5, targetAudience: 'rider' },
    { id: 'ban_r2', title: 'Zero Surge Commuter Hours: 8 AM - 11 AM Across Metro Zones', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80', url: 'https://www.google.com', active: true, position: 'top', buttonText: 'Ride Now', buttonSize: 'sm', buttonBgColor: 'bg-emerald-500 text-white hover:bg-emerald-600', buttonTextColor: '#ffffff', scrollingSpeed: 4, targetAudience: 'rider' },
    { id: 'ban_r3', title: 'Weekend City Getaway - Up to ₹250 Off On Intercity Outstation', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80', url: 'https://www.google.com', active: true, position: 'top', buttonText: 'Explore Trips', buttonSize: 'sm', buttonBgColor: 'bg-blue-600 text-white hover:bg-blue-500', buttonTextColor: '#ffffff', scrollingSpeed: 4, targetAudience: 'rider' }
  ],
  driverBanners: [
    { id: 'ban_d1', title: 'Weekly Captain Bonus: Complete 15 Trips & Earn ₹1,500 Extra', image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80', url: 'https://www.google.com', active: true, position: 'top', buttonText: 'View Target', buttonSize: 'sm', buttonBgColor: 'bg-amber-400 text-slate-950 hover:bg-amber-300', buttonTextColor: '#000000', scrollingSpeed: 3.5, targetAudience: 'driver' },
    { id: 'ban_d2', title: 'Zero Commission Hours: Keep 100% Fare Between 5 PM - 8 PM', image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80', url: 'https://www.google.com', active: true, position: 'top', buttonText: 'Go Online', buttonSize: 'sm', buttonBgColor: 'bg-emerald-500 text-white hover:bg-emerald-600', buttonTextColor: '#ffffff', scrollingSpeed: 4, targetAudience: 'driver' },
    { id: 'ban_d3', title: 'EV Fleet Captain Power Rebates: 15% Cashback On Fast Charging', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80', url: 'https://www.google.com', active: true, position: 'top', buttonText: 'Claim Cashback', buttonSize: 'sm', buttonBgColor: 'bg-blue-600 text-white hover:bg-blue-500', buttonTextColor: '#ffffff', scrollingSpeed: 4, targetAudience: 'driver' }
  ],
  bothBanners: [
    { id: 'ban_b1', title: '24/7 Safety First: Emergency SOS & Real-time Live Route Monitoring', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80', url: 'https://www.google.com', active: true, position: 'top', buttonText: 'Safety Hub', buttonSize: 'sm', buttonBgColor: 'bg-rose-500 text-white hover:bg-rose-600', buttonTextColor: '#ffffff', scrollingSpeed: 4, targetAudience: 'both' },
    { id: 'ban_b2', title: 'Refer & Earn ₹500: Invite Drivers or Friends To TaxiApp Club', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', url: 'https://www.google.com', active: true, position: 'top', buttonText: 'Invite Friends', buttonSize: 'sm', buttonBgColor: 'bg-amber-400 text-slate-950 hover:bg-amber-300', buttonTextColor: '#000000', scrollingSpeed: 4, targetAudience: 'both' },
    { id: 'ban_b3', title: 'New Version Update Available: Faster Booking & Live Driver Radar', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80', url: 'https://www.google.com', active: true, position: 'top', buttonText: "What's New", buttonSize: 'sm', buttonBgColor: 'bg-indigo-600 text-white hover:bg-indigo-500', buttonTextColor: '#ffffff', scrollingSpeed: 4, targetAudience: 'both' }
  ],
  events: [
    {
      id: 'evt_1',
      title: 'HITEC Music Fest & Concert',
      description: 'Annual technology and musical concert at HITEC City. Heavy demand expected in this region. Book rides in advance!',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3845/3845814.png',
      iconSize: 32,
      lat: 17.4483,
      lng: 78.3762,
      active: true,
      actionType: 'book',
      actionText: 'Book Fast Ride',
      targetAudience: 'all'
    },
    {
      id: 'evt_2',
      title: 'Charminar Food & Heritage Walk',
      description: 'Explore the heritage food stalls and illuminated monument views during late-night hours.',
      image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=600&q=80',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2819/2819777.png',
      iconSize: 30,
      lat: 17.3616,
      lng: 78.4747,
      active: true,
      actionType: 'redirect',
      actionUrl: 'https://www.google.com/search?q=charminar+food+stalls',
      actionText: 'Explore Food Stalls',
      targetAudience: 'riders'
    }
  ],
  loginSettings: {
    resetPasswordTemplate: 'Enter your registered email address below, and we will issue a verification security credentials token.',
    newRegisterTemplate: 'A secure OTP has been dispatched. Enter the token along with your desired new password below to update your credentials.',
    loginSignupTemplate: 'Premium Mobility Ecosystem',
    requiredFields: {
      name: true,
      email: true,
      phone: true,
      vehicle: true
    },
    authSystem: 'custom',
    otpMode: 'simulated',
    howToResetPassword: '1. Click on "Forgot Password" on the login screen.\n2. Enter your registered email address.\n3. Enter the 6-digit verification code sent to your email.\n4. Set your new password and submit.'
  },
  pushSettings: {
    enabled: true,
    engine: 'vapid',
    autoPrompt: true,
    disabledTriggerIds: [],
    triggerOverrides: {}
  },
  pwaPromptConfig: {
    enabled: true,
    appTitle: 'TaxiApp Shortcut',
    appSubtitle: 'INSTALL FOR A FASTER EXPERIENCE',
    logoUrl: '',
    versionTag: 'v2.5.0-PROD',
    iosStep1Title: 'TAP SAFARI SHARE BUTTON',
    iosStep1ButtonText: 'SHARE APP',
    iosStep2Title: 'SELECT "ADD TO HOME SCREEN"',
    iosStep2ButtonText: 'Add to Home Screen',
    androidStep1Title: 'TAP CHROME MENU BUTTON',
    androidStep1Desc: 'Click the top-right browser three-dot menu icon to reveal controls.',
    androidStep2Title: 'HIT INSTALL APP / ADD SHORTCUT',
    androidStep2ButtonText: 'Install TaxiApp',
    securityBadgeText: 'INSTANT & HIGHLY SECURE SETUP',
    primaryButtonText: 'DONE WITH INSTRUCTION →',
    secondaryButtonText: 'MAYBE LATER',
    autoPushToUninstalled: true,
    forceDeviceView: 'auto'
  }
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const ensureAllVehicles = (vehiclesList: any[] | undefined) => {
  const base = vehiclesList || EMBEDDED_VEHICLES;
  const copy = [...base];
  for (const embedded of EMBEDDED_VEHICLES) {
    if (!copy.some(v => v.id === embedded.id)) {
      const riderIdx = copy.findIndex(v => v.id === 'rider');
      if (riderIdx !== -1) {
        copy.splice(riderIdx, 0, embedded);
      } else {
        copy.push(embedded);
      }
    }
  }
  return copy;
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isInitialMount = useRef(true);
  const isRemoteUpdate = useRef(false);

  const [config, setConfig] = useState<PlatformConfig>(() => {
    const saved = localStorage.getItem('platform_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration to clean Uber-style minimal map (100% Free OSM Humanitarian with zero watermarks)
        if (!parsed.map?.tileLayerUrl || (parsed.map.tileLayerUrl.includes('cartocdn.com') && !parsed.map.tileLayerUrl.includes('api_key')) || parsed.map.tileLayerUrl.includes('World_Street_Map')) {
          parsed.map = {
            ...(parsed.map || {}),
            tileLayerUrl: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
          };
          try {
            localStorage.setItem('platform_config', JSON.stringify(parsed));
          } catch (e) {}
        }
        if (parsed.testMode === undefined) {
          parsed.testMode = false;
        }
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          testMode: parsed.testMode ?? false,
          vehicles: ensureAllVehicles(parsed.vehicles),
          modules: { ...DEFAULT_CONFIG.modules, ...(parsed.modules || {}) },
          moduleConditions: { ...DEFAULT_CONFIG.moduleConditions, ...(parsed.moduleConditions || {}) },
          pricing: { ...DEFAULT_CONFIG.pricing, ...(parsed.pricing || {}) },
          rules: parsed.rules || DEFAULT_CONFIG.rules,
          beforeGoInfo: parsed.beforeGoInfo || DEFAULT_CONFIG.beforeGoInfo,
          map: { ...DEFAULT_CONFIG.map, ...(parsed.map || {}) },
          branding: { ...DEFAULT_CONFIG.branding, ...(parsed.branding || {}) },
          enabledFeatures: { ...DEFAULT_CONFIG.enabledFeatures, ...(parsed.enabledFeatures || {}) },
          appSettings: { ...DEFAULT_CONFIG.appSettings, ...(parsed.appSettings || {}) },
          loginSettings: { ...DEFAULT_CONFIG.loginSettings, ...(parsed.loginSettings || {}) },
          pwaPromptConfig: { ...DEFAULT_CONFIG.pwaPromptConfig, ...(parsed.pwaPromptConfig || {}) },
          pages: parsed.pages || DEFAULT_CONFIG.pages,
          riderBanners: parsed.riderBanners || DEFAULT_CONFIG.riderBanners,
          driverBanners: parsed.driverBanners || DEFAULT_CONFIG.driverBanners,
          bothBanners: parsed.bothBanners || DEFAULT_CONFIG.bothBanners,
          events: parsed.events || DEFAULT_CONFIG.events,
          marquees: parsed.marquees || DEFAULT_CONFIG.marquees,
          razorpay: {
            ...DEFAULT_CONFIG.razorpay,
            ...(parsed.razorpay || {}),
            keyId: (parsed.razorpay?.keyId && parsed.razorpay.keyId.trim()) || DEFAULT_CONFIG.razorpay?.keyId,
            keySecret: (parsed.razorpay?.keySecret && parsed.razorpay.keySecret.trim()) || DEFAULT_CONFIG.razorpay?.keySecret
          },
          payment: {
            ...DEFAULT_CONFIG.payment,
            ...(parsed.payment || {}),
            keyId: (parsed.payment?.keyId && parsed.payment.keyId.trim()) || DEFAULT_CONFIG.payment?.keyId,
            keySecret: (parsed.payment?.keySecret && parsed.payment.keySecret.trim()) || DEFAULT_CONFIG.payment?.keySecret
          }
        };
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  // Load config from backend on mount and listen for real-time broadcasts
  useEffect(() => {
    const fetchBackendConfig = async () => {
      try {
        const response = await fetch('/api/admin/config');
        if (response.ok) {
          const backendData = await response.json();
          const mergedConfig = {
            ...DEFAULT_CONFIG,
            ...backendData,
            vehicles: ensureAllVehicles(backendData.vehicles),
            modules: { ...DEFAULT_CONFIG.modules, ...(backendData.modules || {}) },
            moduleConditions: { ...DEFAULT_CONFIG.moduleConditions, ...(backendData.moduleConditions || {}) },
            pricing: { ...DEFAULT_CONFIG.pricing, ...(backendData.pricing || {}) },
            rules: backendData.rules || DEFAULT_CONFIG.rules,
            beforeGoInfo: backendData.beforeGoInfo || DEFAULT_CONFIG.beforeGoInfo,
            map: { 
              ...DEFAULT_CONFIG.map, 
              ...(backendData.map || {}),
              tileLayerUrl: (backendData.map?.tileLayerUrl && !backendData.map.tileLayerUrl.includes('World_Street_Map') && (!backendData.map.tileLayerUrl.includes('cartocdn.com') || backendData.map.tileLayerUrl.includes('api_key'))) 
                ? backendData.map.tileLayerUrl 
                : DEFAULT_CONFIG.map.tileLayerUrl
            },
            branding: { 
              ...DEFAULT_CONFIG.branding, 
              ...(backendData.branding || {}),
            },
            enabledFeatures: { ...DEFAULT_CONFIG.enabledFeatures, ...(backendData.enabledFeatures || {}) },
            appSettings: { ...DEFAULT_CONFIG.appSettings, ...(backendData.appSettings || {}) },
            loginSettings: { ...DEFAULT_CONFIG.loginSettings, ...(backendData.loginSettings || {}) },
            pwaPromptConfig: { ...DEFAULT_CONFIG.pwaPromptConfig, ...(backendData.pwaPromptConfig || {}) },
            pages: backendData.pages || DEFAULT_CONFIG.pages,
            riderBanners: backendData.riderBanners || DEFAULT_CONFIG.riderBanners,
            driverBanners: backendData.driverBanners || DEFAULT_CONFIG.driverBanners,
            bothBanners: backendData.bothBanners || DEFAULT_CONFIG.bothBanners,
            events: backendData.events || DEFAULT_CONFIG.events,
            marquees: backendData.marquees || DEFAULT_CONFIG.marquees,
            razorpay: {
              ...DEFAULT_CONFIG.razorpay,
              ...(backendData.razorpay || {}),
              keyId: (backendData.razorpay?.keyId && backendData.razorpay.keyId.trim()) || DEFAULT_CONFIG.razorpay?.keyId,
              keySecret: (backendData.razorpay?.keySecret && backendData.razorpay.keySecret.trim()) || DEFAULT_CONFIG.razorpay?.keySecret
            },
            payment: {
              ...DEFAULT_CONFIG.payment,
              ...(backendData.payment || {}),
              keyId: (backendData.payment?.keyId && backendData.payment.keyId.trim()) || DEFAULT_CONFIG.payment?.keyId,
              keySecret: (backendData.payment?.keySecret && backendData.payment.keySecret.trim()) || DEFAULT_CONFIG.payment?.keySecret
            }
          };
          isRemoteUpdate.current = true;
          setConfig(mergedConfig);
          try {
            localStorage.setItem('platform_config', JSON.stringify(mergedConfig));
          } catch (err) {}
        }
      } catch (e) {
        console.warn('Could not load config from backend, falling back to local storage', e);
      }
    };
    fetchBackendConfig();

    // Revalidate when user returns to window/tab
    const onVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchBackendConfig();
      }
    };
    window.addEventListener('focus', onVisibilityOrFocus);
    document.addEventListener('visibilitychange', onVisibilityOrFocus);

    // Listen for live socket updates when backend or admin modifies settings
    let socket: any = null;
    try {
      socket = io();
      socket.on('config_updated', (updatedConfig: any) => {
        if (updatedConfig) {
          isRemoteUpdate.current = true;
          setConfig(prev => {
            const merged = {
              ...prev,
              ...updatedConfig,
              map: {
                ...(prev.map || {}),
                ...(updatedConfig.map || {})
              },
              branding: {
                ...(prev.branding || {}),
                ...(updatedConfig.branding || {})
              },
              pricing: {
                ...(prev.pricing || {}),
                ...(updatedConfig.pricing || {})
              },
              modules: {
                ...(prev.modules || {}),
                ...(updatedConfig.modules || {})
              },
              appSettings: {
                ...(prev.appSettings || {}),
                ...(updatedConfig.appSettings || {})
              },
              enabledFeatures: {
                ...(prev.enabledFeatures || {}),
                ...(updatedConfig.enabledFeatures || {})
              },
              pwaPromptConfig: {
                ...(prev.pwaPromptConfig || {}),
                ...(updatedConfig.pwaPromptConfig || {})
              },
              razorpay: {
                ...(prev.razorpay || {}),
                ...(updatedConfig.razorpay || {})
              },
              payment: {
                ...(prev.payment || {}),
                ...(updatedConfig.payment || {})
              }
            };
            try {
              localStorage.setItem('platform_config', JSON.stringify(merged));
            } catch (err) {}
            return merged;
          });
        }
      });

      socket.on('connect', () => {
        fetchBackendConfig();
      });

      socket.on('system_data_reset', () => {
        fetchBackendConfig();
      });
    } catch (err) {
      console.warn('Socket connection for config sync unavailable', err);
    }

    // 15-second background synchronization polling guarantee for production
    const pollInterval = setInterval(() => {
      fetchBackendConfig();
    }, 15000);

    return () => {
      window.removeEventListener('focus', onVisibilityOrFocus);
      document.removeEventListener('visibilitychange', onVisibilityOrFocus);
      clearInterval(pollInterval);
      if (socket) {
        socket.off('config_updated');
        socket.off('connect');
        socket.off('system_data_reset');
        socket.disconnect();
      }
    };
  }, []);

  // Sync favicon dynamics
  useEffect(() => {
    const targetIcon = config.branding?.faviconUrl || config.branding?.logoUrl || config.branding?.darkLogoUrl;
    if (targetIcon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = targetIcon;

      let appleLink: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
      if (appleLink) {
        appleLink.href = targetIcon;
      }
    }
  }, [config.branding?.faviconUrl, config.branding?.logoUrl, config.branding?.darkLogoUrl]);

  // Sync config to local storage and backend with debouncer (only on explicit user modifications)
  useEffect(() => {
    try {
      localStorage.setItem('platform_config', JSON.stringify(config));
    } catch (e) {}

    // If this update was triggered by initial load or a remote socket broadcast, skip posting back to server
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    const syncBackend = async () => {
      try {
        await fetch('/api/admin/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config)
        });
      } catch (e) {
        console.warn('Could not sync config update to backend', e);
      }
    };

    const timer = setTimeout(() => {
      syncBackend();
    }, 400);

    return () => clearTimeout(timer);
  }, [config]);

  const updateConfig = (newConfig: Partial<PlatformConfig> | ((prev: PlatformConfig) => PlatformConfig)) => {
    isRemoteUpdate.current = false;
    setConfig(prev => {
      if (typeof newConfig === 'function') {
        return newConfig(prev);
      }
      return {
        ...prev,
        ...newConfig,
      };
    });
  };

  const isModuleEnabled = (moduleId: keyof PlatformConfig['modules']) => {
    return config.modules[moduleId];
  };

  useEffect(() => {
    const b = config.branding;
    if (!b) return;

    const isDarkTheme = b.textColor?.toLowerCase() === '#ffffff' || 
                        b.textColor?.toLowerCase() === '#f8fafc' ||
                        (b.bgColor?.toLowerCase() !== '#ffffff' && 
                         b.bgColor?.toLowerCase() !== '#f8fafc' && 
                         b.bgColor?.toLowerCase() !== '#f1f5f9');

    // Toggle document class for Tailwind dark: prefix support
    document.documentElement.classList.toggle('dark', isDarkTheme);

    // Load custom Google Fonts dynamically
    const loadedFontsId = 'dynamic-fonts-link';
    let linkEl = document.getElementById(loadedFontsId) as HTMLLinkElement;
    const fontNames = [b.fontFamily, b.headingFontFamily, b.logoFontFamily, b.backendFontFamily].filter(Boolean);
    if (fontNames.length > 0) {
      const fontQuery = fontNames.map(f => `family=${f?.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900`).join('&');
      const href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
      if (!linkEl) {
        linkEl = document.createElement('link');
        linkEl.id = loadedFontsId;
        linkEl.rel = 'stylesheet';
        document.head.appendChild(linkEl);
      }
      linkEl.href = href;
    }

    // Determine custom shadows
    let shadowVal = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)';
    if (b.cardShadow === 'none') {
      shadowVal = 'none';
    } else if (b.cardShadow === 'vibrant') {
      shadowVal = `0 10px 15px -3px ${b.primaryColor}25, 0 4px 6px -4px ${b.primaryColor}20`;
    } else if (b.cardShadow === 'ambient') {
      shadowVal = '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)';
    } else if (b.cardShadow === 'brutalist') {
      shadowVal = `4px 4px 0px 0px ${b.secondaryColor || '#000000'}`;
    }

    let headingStyleCss = 'font-family: var(--font-display) !important;';
    if (b.headingStyle === 'uppercase') {
      headingStyleCss += ' text-transform: uppercase !important;';
    } else if (b.headingStyle === 'display-italic') {
      headingStyleCss += ' font-style: italic !important;';
    } else if (b.headingStyle === 'clunky-retro') {
      headingStyleCss += ' text-transform: uppercase !important; font-style: italic !important; letter-spacing: -0.05em !important; font-weight: 900 !important;';
    }

    const css = `
      :root, html {
        --color-primary: ${b.primaryColor} !important;
        --color-primary-custom: ${b.primaryColor} !important;
        --color-primary-dark: ${b.primaryColor}e0 !important;
        --color-primary-dark-custom: ${b.primaryColor}e0 !important;
        --color-secondary: ${b.secondaryColor} !important;
        --color-secondary-custom: ${b.secondaryColor} !important;
        --color-canvas: ${b.bgColor} !important;
        --color-canvas-custom: ${b.bgColor} !important;
        --color-surface-soft: ${b.surfaceSoftColor} !important;
        --color-surface-soft-custom: ${b.surfaceSoftColor} !important;
        --color-surface-card: ${b.surfaceCardColor} !important;
        --color-surface-card-custom: ${b.surfaceCardColor} !important;
        --color-ink: ${b.textColor} !important;
        --color-ink-custom: ${b.textColor} !important;
        --color-body: ${b.textColor} !important;
        --color-body-custom: ${b.textColor} !important;
        --color-mute: ${b.textColorMuted} !important;
        --color-mute-custom: ${b.textColorMuted} !important;
        
        --radius-md: ${b.borderRadiusMd}px !important;
        --radius-lg: ${b.borderRadiusLg}px !important;
        
        --font-sans: "${b.fontFamily}", "Poppins", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif !important;
        --font-display: "${b.headingFontFamily || b.fontFamily}", "Poppins", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif !important;
        --font-logo: "${b.logoFontFamily || b.headingFontFamily || b.fontFamily}", "Poppins", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif !important;
        --font-backend: "${b.backendFontFamily || b.fontFamily}", "Poppins", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif !important;

        --color-hairline: ${isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'} !important;
        --color-hairline-custom: ${isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'} !important;
        --color-hairline-soft: ${isDarkTheme ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'} !important;
        --color-hairline-soft-custom: ${isDarkTheme ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'} !important;
      }

      body {
        background-color: var(--color-surface-soft) !important;
        color: var(--color-ink) !important;
        font-family: var(--font-sans) !important;
      }

      #admin-root-container,
      .backend-admin-root,
      #admin-root-container *,
      .backend-admin-root * {
        font-family: var(--font-backend) !important;
      }

      /* Dynamically override user interface spacing and margins */
      ${b.spacingDensity === 'compact' ? `
        .p-6, .md\\:p-6, .p-5, .p-4 { padding: 12px !important; }
        .mb-6, .mb-5, .my-6 { margin-bottom: 8px !important; margin-top: 8px !important; }
        .gap-6, .gap-5 { gap: 12px !important; }
        .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 12px !important; }
      ` : b.spacingDensity === 'spacious' ? `
        .p-6, .md\\:p-6 { padding: 32px !important; }
        .p-5 { padding: 24px !important; }
        .p-4 { padding: 20px !important; }
        .mb-6, .mb-5, .my-6 { margin-bottom: 24px !important; margin-top: 24px !important; }
        .gap-6 { gap: 28px !important; }
        .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 28px !important; }
      ` : ''}

      /* Dynamic Card Overrides */
      .dynamic-card, .bg-white.p-6, .bg-white.rounded-2xl {
        border-radius: var(--radius-md) !important;
        border-width: ${b.borderWidth}px !important;
        border-color: rgba(0, 0, 0, 0.08) !important;
        box-shadow: ${shadowVal} !important;
      }

      .btn-primary, .bg-rose-600, .bg-primary, .bg-[#F43F5E] {
        border-radius: var(--radius-md) !important;
      }

      .dynamic-heading, h1, h2, .font-display {
        ${headingStyleCss}
      }

      /* Global Adaptive Styling for Standard Elements */
      ${isDarkTheme ? `
        /* Dark Theme Adaptive Overrides - High legibility & accessibility inspired by elite dark designs */
        html body .bg-white, 
        html body .bg-white\\/95, 
        html body .bg-white\\/90, 
        html body .bg-white\\/85, 
        html body .bg-white\\/80,
        html body div.bg-white,
        html body button.bg-white,
        html body a.bg-white,
        html body .bg-surface-card {
          background-color: var(--color-surface-card) !important;
          color: var(--color-ink) !important;
        }

        html body .bg-app-bg,
        html body div.bg-app-bg {
          background-color: var(--color-surface-soft) !important;
        }

        html body .bg-gray-50, 
        html body .bg-slate-50, 
        html body .bg-zinc-50, 
        html body .bg-gray-100, 
        html body .bg-slate-100, 
        html body .bg-zinc-100,
        html body div.bg-gray-50,
        html body div.bg-slate-50 {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }

        html body .border-gray-100, 
        html body .border-gray-200, 
        html body .border-slate-100, 
        html body .border-slate-200, 
        html body [class*="border-gray-200"],
        html body [class*="border-slate-200"],
        html body .border-gray-200\\/50, 
        html body .border-slate-200\\/50, 
        html body .border-hairline, 
        html body .border-hairline-soft,
        html body .border {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }

        /* Specific tab bar switcher styling - My Trips & Market */
        div[class*="bg-gray-100"][class*="p-1"] {
          background-color: var(--color-surface-soft) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        div[class*="bg-white"][class*="p-1.5"] {
          background-color: var(--color-surface-soft) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }

        /* Form Inputs, Select options & Textareas inside Rider/Driver views */
        input, select, textarea, .bg-slate-50 input, .bg-gray-50 input {
          background-color: rgba(255, 255, 255, 0.04) !important;
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
        }
        input:focus, select:focus, textarea:focus {
          border-color: var(--color-primary) !important;
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(30, 206, 155, 0.2) !important;
        }

        /* Switcher buttons */
        div[class*="bg-gray-100"][class*="p-1"] button {
          color: var(--color-mute) !important;
        }
        div[class*="bg-gray-100"][class*="p-1"] button[class*="bg-black"], 
        div[class*="bg-gray-100"][class*="p-1"] button[class*="bg-slate-900"],
        div[class*="bg-gray-100"][class*="p-1"] button[class*="bg-white"] {
          background-color: var(--color-primary) !important;
          color: #121315 !important;
          font-weight: 600 !important;
        }
        div[class*="bg-gray-100"][class*="p-1"] button:not([class*="bg-black"]):hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: var(--color-ink) !important;
        }

        /* Tab buttons (My Trips) */
        button[class*="bg-secondary"], button[class*="bg-black"] {
          background-color: var(--color-primary) !important;
          color: #121315 !important;
          font-weight: 600 !important;
        }
        div[class*="bg-white"][class*="p-1.5"] button:not([class*="bg-secondary"]) {
          color: var(--color-mute) !important;
        }
        div[class*="bg-white"][class*="p-1.5"] button:not([class*="bg-secondary"]):hover {
          color: var(--color-ink) !important;
        }

        /* General text color overrides */
        .text-slate-900, .text-zinc-900, .text-gray-900, .text-black, .text-slate-800, .text-zinc-800, .text-gray-800, .text-indigo-950, .text-secondary, [class*="text-secondary"] {
          color: var(--color-ink) !important;
        }
        
        .text-slate-500, .text-zinc-500, .text-gray-500, .text-slate-400, .text-zinc-400, .text-gray-400, .text-slate-600,   [class*="text-secondary/"], [class*="text-secondary-"] {
          color: var(--color-mute) !important;
        }

        [class*="text-secondary/10"], [class*="text-secondary/20"], [class*="text-secondary/30"] {
          color: rgba(255, 255, 255, 0.4) !important;
        }

        .text-slate-700, .text-zinc-700, .text-gray-700, .text-slate-600, .text-zinc-600, .text-gray-600,
        [class*="text-slate-900"], [class*="text-slate-800"], [class*="text-slate-700"], [class*="text-slate-600"],
        [class*="text-gray-900"], [class*="text-gray-800"], [class*="text-gray-700"], [class*="text-gray-600"],
        [class*="text-neutral-900"], [class*="text-neutral-800"], [class*="text-neutral-700"], [class*="text-neutral-600"],
        [class*="text-zinc-900"], [class*="text-zinc-800"], [class*="text-zinc-700"], [class*="text-zinc-600"] {
          color: var(--color-mute) !important;
        }

        /* Hover states for list items & dropdown options */
        .hover\\:bg-gray-50:hover, .hover\\:bg-slate-50:hover, .hover\\:bg-zinc-50:hover {
          background-color: rgba(255, 255, 255, 0.06) !important;
        }

        /* Filter Pills */
        button.border-black.text-black {
          background-color: var(--color-primary) !important;
          border-color: var(--color-primary) !important;
          color: #121315 !important;
          font-weight: 600 !important;
        }
        button.border-slate-200.text-slate-500 {
          background-color: var(--color-surface-card) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
          color: var(--color-mute) !important;
        }

        /* Empty states box */
        div[class*="rounded-[44px]"] {
          background-color: rgba(255, 255, 255, 0.02) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        div[class*="rounded-full"][class*="bg-white"] {
          background-color: var(--color-surface-soft) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        div[class*="rounded-full"][class*="bg-white"] svg {
          color: var(--color-primary) !important;
        }
        div[class*="rounded-[32px]"][class*="bg-gray-50"] {
          background-color: var(--color-surface-soft) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        div[class*="rounded-[32px]"][class*="bg-gray-50"] svg {
          color: var(--color-primary) !important;
        }

        /* Dropdowns & Popups Inner Pages Menu Accessibility */
        div[role="menu"], div[class*="shadow-lg"][class*="rounded-"], div[class*="absolute"][class*="bg-white"] {
          background-color: #1c1d1f !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
        }

        /* Buttons & Badges consistency with mint green */
        .bg-primary, .bg-rose-500, .bg-rose-600, .bg-emerald-500, .bg-[#F43F5E] {
          background-color: var(--color-primary) !important;
          color: #121315 !important;
        }
        .text-primary, .text-rose-500, .text-rose-600, .text-[#F43F5E], .text-emerald-500 {
          color: var(--color-primary) !important;
        }

        /* Inputs and placeholders */
        input::placeholder, textarea::placeholder {
          color: var(--color-mute) !important;
          opacity: 0.8 !important;
        }

        /* Scrollbars inside dropdown lists */
        div::-webkit-scrollbar {
          width: 6px !important;
          height: 6px !important;
        }
        div::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.15) !important;
          border-radius: 9999px !important;
        }

        /* Leaflet Dark map style styling */
        .leaflet-container {
          background-color: #0c0c0e !important;
        }
        .leaflet-tile,
        img.leaflet-tile,
        .leaflet-tile-pane img,
        .leaflet-tile-container img {
          filter: invert(100%) hue-rotate(180deg) brightness(0.7) contrast(1.1) !important;
          -webkit-filter: invert(100%) hue-rotate(180deg) brightness(0.7) contrast(1.1) !important;
        }
        .leaflet-objects-pane,
        .leaflet-marker-pane,
        .leaflet-overlay-pane,
        .leaflet-popup-pane,
        .leaflet-tooltip-pane {
          filter: none !important;
          -webkit-filter: none !important;
        }
      ` : `
        /* Light Theme Dynamic Mapping - Natural Clean Colors */
        .grayscale-map .leaflet-tile,
        .grayscale-map img.leaflet-tile,
        .grayscale-map .leaflet-tile-pane img,
        .grayscale-map .leaflet-tile-container img {
          filter: grayscale(100%) contrast(92%) brightness(104%) !important;
          -webkit-filter: grayscale(100%) contrast(92%) brightness(104%) !important;
        }
        .leaflet-objects-pane,
        .leaflet-marker-pane,
        .leaflet-overlay-pane,
        .leaflet-popup-pane,
        .leaflet-tooltip-pane {
          filter: none !important;
          -webkit-filter: none !important;
        }
        .leaflet-container {
          background-color: #f4f4f6 !important;
        }
        html body .bg-white {
          background-color: var(--color-surface-card) !important;
        }
        html body .bg-gray-50, html body .bg-slate-50, html body .bg-zinc-50, html body .bg-gray-100, html body .bg-slate-100, html body .bg-zinc-100 {
          background-color: var(--color-surface-soft) !important;
        }
        .text-slate-900, .text-zinc-900, .text-gray-900 {
          color: var(--color-ink) !important;
        }
        .text-slate-500, .text-zinc-500, .text-gray-500 {
          color: var(--color-mute) !important;
        }
        .border-gray-100, .border-gray-200, .border-slate-100, .border-slate-200 {
          border-color: var(--color-hairline-soft) !important;
        }
      `}
    `;

    const styleId = 'dynamic-branding-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = css;
  }, [config.branding?.primaryColor, config.branding?.secondaryColor, config.branding?.accentColor, config.branding?.bgColor, config.branding?.surfaceCardColor, config.branding?.surfaceSoftColor, config.branding?.textColor, config.branding?.textColorMuted, config.branding?.fontFamily, config.branding?.headingFontFamily, config.branding?.logoFontFamily, config.branding?.backendFontFamily, config.branding?.borderRadiusMd, config.branding?.borderRadiusLg, config.branding?.cardShadow, config.branding?.borderWidth, config.branding?.spacingDensity, config.branding?.headingStyle]);

  useEffect(() => {
    document.title = config.general.platformName;
    
    // Also update apple-mobile-web-app-title and theme-color if possible
    const metaTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (metaTitle) {
      metaTitle.setAttribute('content', config.general.platformName);
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      // In a real app we might get this from config, for now we keep it consistent
      metaThemeColor.setAttribute('content', '#111111');
    }
  }, [config.general.platformName]);

  return (
    <ConfigContext.Provider value={{ config, updateConfig, isModuleEnabled }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
