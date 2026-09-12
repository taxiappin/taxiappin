export type AppMode = 'rider' | 'driver';
export type Intent = 'ride' | 'carpool' | 'intercity' | 'intercity-carpool';
export type BookingStep = 'idle' | 'searching' | 'selecting' | 'confirming' | 'live';
export type Tab = 'home' | 'pay' | 'notifications' | 'profile' | 'trips' | 'chat' | 'publish' | 'safety' | 'support' | 'saved_places' | 'kyc' | 'settings' | 'preferences';

export interface Location {
  address: string;
  name?: string;
  lat: number;
  lng: number;
}

export interface RideOption {
  id: string;
  type: 'bike' | 'auto' | 'mini' | 'sedan' | 'suv';
  name: string;
  price: number;
  eta: number;
  seats?: number;
}

export interface CarpoolTrip {
  id: string;
  driverName: string;
  driverRating: number;
  price: number;
  departureTime: string;
  seatsAvailable: number;
  vehicle: string;
  isInstant?: boolean;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  threadId?: string;
  senderRole?: string;
}

export interface ChatThread {
  id: string;
  otherUser: string;
  otherUserAvatar?: string;
  lastMsg?: string;
  lastTime?: string;
  unread?: boolean;
  unreadCount?: number;
  messages: Message[];
  user?: string;
  avatar?: string;
  time?: string;
  handle?: string;
  statusColor?: string;
  category?: 'ALL' | 'SUPPORT' | 'RIDERS' | 'DRIVERS';
  tripId?: string;
  userId?: string;
  lastMessage?: string;
  updatedAt?: number;
  allowCalls?: boolean;
  phone?: string;
}

export interface Trip {
  id: string;
  type: Intent | string;
  publishIntent?: string;
  isOffer?: boolean;
  customerId?: string;
  status: string;
  subStatus?: string;
  driverCoords?: [number, number];
  driverRotation?: number;
  isFinished?: boolean;
  pickup: { address: string; lat: number; lng: number };
  drop: { address: string; lat: number; lng: number };
  price: number;
  date: string;
  time?: string;
  distance: string;
  duration: string;
  role: 'rider' | 'driver';
  rideType?: string;
  isInstant?: boolean;
  isScheduled?: boolean;
  isReviewed?: boolean;
  ratingGiven?: number;
  isRiderFinished?: boolean;
  isRiderReviewed?: boolean;
  riderRatingGiven?: number;
  isDriverFinished?: boolean;
  isDriverReviewed?: boolean;
  driverRatingGiven?: number;
  createdAt?: number;
  driver?: {
    id?: string;
    name: string;
    rating: number;
    vehicle: string;
    plate: string;
    avatar: string;
    phone?: string;
    type?: string;
  };
  customer?: {
    id?: string;
    name: string;
    avatar: string;
    rating?: number;
    phone?: string;
  };
  riders?: {
    id: string;
    name: string;
    avatar: string;
    status: 'pending' | 'accepted' | 'rejected';
    pickup?: string;
    phone?: string;
    distance?: string;
    coordinates?: [number, number];
  }[];
  otp?: string;
  postId?: string;
  sourcePostId?: string;
  driverId?: string;
  driverPhone?: string;
  riderId?: string;
  riderPhone?: string;
  userId?: string;
  ownerId?: string;
  acceptedBy?: string;
  riderDistance?: string;
  seats?: number;
  onDemand?: boolean;
  isOnDemand?: boolean;
  isBookedByMe?: boolean;
  originType?: string;
  isDirectEngage?: boolean;
  bookingFlow?: string;
  source?: string;
  pickupCoords?: [number, number];
  dropCoords?: [number, number];
  from?: string;
  to?: string;
  driverName?: string;
  user?: string;
  pickupAddress?: string;
  dropAddress?: string;
}

export interface RouteData {
  coordinates: [number, number][];
  distance: number;
  duration: number;
  distanceStr: string;
  durationStr: string;
}

export interface VehicleConfig {
  id: string;
  name: string;
  type: string; // 'BIKE' | 'AUTO' | 'CAR' | 'SEDAN' | 'SUV' | 'MINI'
  image: string;
  capacity: number;
  localPerKm: number;
  intercityPerKm: number;
  waitingPerKm: number;
  localBaseFare?: number;
  intercityBaseFare?: number;
  customCharges?: Record<string, number>;
  mapIcon?: string;
  scale?: number;
  useCustomImage?: boolean;
  enabled?: boolean;
  ac?: boolean;
  luggage?: boolean;
  localEligible?: boolean;
  intercityEligible?: boolean;
}

export interface RuleItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  value: string;
  category?: 'dispatch' | 'pricing' | 'comfort' | 'system';
}

export interface BeforeGoItem {
  id: string;
  title: string;
  subtitle: string;
  icon: 'info' | 'wallet' | 'verify' | 'share';
  color: 'gold' | 'blue' | 'pink';
}

export interface AppBanner {
  id: string;
  title: string;
  image: string;
  url?: string;
  active: boolean;
  position: 'top' | 'middle' | 'bottom';
  buttonText?: string;
  buttonSize?: 'xs' | 'sm' | 'md' | 'lg';
  buttonBgColor?: string;
  buttonTextColor?: string;
  scrollingSpeed?: number;
  audience?: 'rider' | 'driver' | 'both';
  targetAudience?: 'rider' | 'driver' | 'both';
}

export interface TopMarquee {
  id: string;
  text: string;
  fontSize: number;
  bgColor: string;
  textColor: string;
  speed: number; // Animation duration in seconds (smaller is faster)
  link?: string;
  enabled: boolean;
  audience: 'both' | 'rider' | 'driver';
}

export interface InviteSettings {
  enabled?: boolean;
  title?: string;
  headline?: string;
  description?: string;
  shareUrl?: string;
  badgeText?: string;
  buttonText?: string;
  cardTheme?: 'amber' | 'slate' | 'emerald' | 'indigo' | 'rose' | 'sunset' | 'custom';
  customBgColor?: string;
  customTextColor?: string;
  logoType?: 'taxi' | 'gift' | 'sparkles' | 'user' | 'custom';
  customLogoUrl?: string;
  showQrCode?: boolean;
  whatsappMessage?: string;
  emailSubject?: string;
  emailBody?: string;
  enabledApps?: {
    whatsapp?: boolean;
    telegram?: boolean;
    sms?: boolean;
    email?: boolean;
    facebook?: boolean;
    twitter?: boolean;
    copyLink?: boolean;
    nativeShare?: boolean;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  status: 'Published' | 'Draft';
  views?: number;
}

export interface LandingTestimonial {
  id: string;
  name: string;
  role: 'Rider' | 'Driver' | 'Corporate Client' | string;
  rating: number;
  avatar: string;
  comment: string;
  audience?: 'rider' | 'driver' | 'both';
  highlightText?: string;
}

export interface LandingFeatureCard {
  id: string;
  title: string;
  subtitle?: string;
  desc?: string;
  tag?: string;
  badge?: string;
  image?: string;
  gradientOverlay?: string;
  ctaText?: string;
  icon?: string;
  audience?: 'rider' | 'driver' | 'both';
}

export interface LandingPageConfig {
  enabled: boolean;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  heroImage: string;
  brandName?: string;
  brandLogoEmoji?: string;
  showBlogs: boolean;
  showTestimonials: boolean;
  showFaqs: boolean;
  showAppDownload: boolean;
  playStoreUrl: string;
  appStoreUrl: string;
  features: LandingFeatureCard[];
  testimonials: LandingTestimonial[];
  faqs: Array<{ id: string; q: string; a: string; category?: 'rider' | 'driver' | 'safety' | 'payment' | 'general' }>;
  seoKeywords: string;
}

export interface PlatformConfig {
  landingPage?: LandingPageConfig;
  blogsList?: BlogPost[];
  seo?: any;
  inviteSettings?: InviteSettings;
  knowledgeBase?: Array<{
    id: string;
    title: string;
    category: string;
    targetAudience?: string;
    content: string;
    author?: string;
    isPublished?: boolean;
    views?: number;
    helpfulCount?: number;
  }>;
  maintenanceMode?: boolean;
  maintenanceConfig?: {
    enabled?: boolean;
    title?: string;
    tagline?: string;
    message?: string;
    logoUrl?: string;
    imageUrl?: string;
    eta?: string;
    targetTimestamp?: number;
    contactEmail?: string;
    contactPhone?: string;
    whatsapp?: string;
    telegram?: string;
    twitter?: string;
    allowedRoles?: string[];
  };
  environmentPipeline?: {
    mode: 'test' | 'production';
    autoCleanOnProdSwitch?: boolean;
    lastProdDeployment?: string;
    simulatedGpsDelayMs?: number;
  };
  testMode?: boolean;
  bannersEnabled?: boolean;
  marqueeEnabled?: boolean;
  onboardingEnabled?: boolean;
  adsEnabled?: boolean;
  referralsEnabled?: boolean;
  appLogo?: string;
  favicon?: string;
  riderFreePlanEnabled?: boolean;
  driverFreePlanEnabled?: boolean;
  subscriptionBannerTitle?: string;
  subscriptionBannerText?: string;
  marquees?: TopMarquee[];
  modules: {
    ride: boolean;
    intercity: boolean;
    carpool: boolean;
    marketplace: boolean;
    scheduled: boolean;
    wallet: boolean;
  };
  pricing: {
    surgeEnabled?: boolean;
    localFee?: number;
    intercityFee?: number;
    localTripThresholdKm?: number; // e.g., 50 (Local is < 50 km, Intercity is > 50 km)
    waitingPerKm?: number;
    localCoverFactor?: number; // Speed/distance coverage rating style for local drivers
    intercityCoverFactor?: number; // Speed/distance coverage rating style for intercity drivers
    soloMultiplier?: number;
    carpoolMultiplier?: number;
    localBaseFare?: number;
    intercityBaseFare?: number;
    soloBaseFare?: number;
    carpoolBaseFare?: number;
    commissionPercentage?: number;
    minimumCommissionFee?: number;
    taxPercentage?: number;
    surgeMultiplier?: number;
    minimumWalletBalanceToBook?: number;
    gstEnabled?: boolean;
    gstPercentage?: number;
    couponEnabled?: boolean;
    couponCode?: string;
    couponDiscountPercentage?: number;
    taxesSectionEnabled?: boolean;
    platformFeesSectionEnabled?: boolean;
    customSurchargesSectionEnabled?: boolean;
    riderCouponEnabled?: boolean;
    riderCouponCode?: string;
    riderCouponType?: 'Percentage' | 'Flat';
    riderCouponValue?: number;
    driverCouponEnabled?: boolean;
    driverCouponCode?: string;
    driverCouponType?: 'Percentage' | 'Flat';
    driverCouponValue?: number;
    additionalChargesEnabled?: boolean;
    additionalChargesAmount?: number;
    waitingChargesEnabled?: boolean;
    customColumns?: Array<{ id: string; label: string }>;
    customFees?: Array<{
      id: string;
      name: string;
      category: string;
      enabled: boolean;
      amount: number;
      code?: string;
      unit?: string;
    }>;
    promoCodes?: Array<{
      id: string;
      code: string;
      description: string;
      discount: number;
      type: 'flat' | 'percentage';
      minFare: number;
      maxDiscount: number;
      expiry: string;
      status: 'Active' | 'Expired';
      usageCount: number;
      recipient: 'RIDER' | 'DRIVER';
    }>;
  };
  security: {
    mandatorySos?: boolean;
    restrictNightRides?: boolean;
    shadowBanEnabled?: boolean;
  };
  general: {
    platformName?: string;
    contactEmail?: string;
    currency?: string;
    timezone?: string;
    riderWelcomeImage?: string; // Custom image shown to rider when screen is loaded
    defaultCountryCode?: string;
  };
  razorpay?: {
    keyId: string;
    keySecret: string;
    enabled: boolean;
  };
  vehicles: VehicleConfig[];
  rules?: RuleItem[];
  beforeGoInfo?: BeforeGoItem[];
  moduleConditions?: {
    ride?: string;
    intercity?: string;
    carpool?: string;
    marketplace?: string;
    scheduled?: string;
    wallet?: string;
  };
  map?: MapCustomization;
  branding?: AppBranding;
  enabledFeatures?: Record<string, boolean>;
  appSettings?: {
    driverMatchingRadius: number;
    gpsTelemetryUpdateDelay: number;
    autoCancelBookingExpiration: number;
    footerHashtag?: string;
    footerAttribution?: string;
    ambulanceImageUrl?: string;
    ambulanceMapIconUrl?: string;
    isAdsEnabled?: boolean;
    googleAdMobAppId?: string;
    googleAdMobBannerId?: string;
    riderReferralBonus?: number;
    driverReferralBonus?: number;
    referralCodeExpirationDays?: number;
    versionBrandingText?: string;
  };
  pages?: LegalPage[];
  riderFaqs?: FAQItem[];
  driverFaqs?: FAQItem[];
  faqs?: FAQItem[];
  riderOnboarding?: OnboardingSlide[];
  driverOnboarding?: OnboardingSlide[];
  onboardingSettings?: OnboardingSettings;
  riderBanners?: AppBanner[];
  driverBanners?: AppBanner[];
  bothBanners?: AppBanner[];
  events?: MapEvent[];
  mobileFeatures?: { [key: string]: boolean };
  payment?: {
    environment?: 'sandbox' | 'production' | string;
    merchantId?: string;
    keyId?: string;
    keySecret?: string;
    webhookSecret?: string;
  };
  ads?: {
    globalEnabled?: boolean;
    appIdAndroid?: string;
    appIdIos?: string;
    bannerUnitId?: string;
    interstitialUnitId?: string;
    interstitialFrequency?: string | number;
    rewardUnitId?: string;
  };
  referrals?: {
    enabled?: boolean;
    pattern?: string;
    inviterBonus?: number;
    inviteeBonus?: number;
    riderInviterBonus?: number;
    riderInviteeBonus?: number;
    driverInviterBonus?: number;
    driverInviteeBonus?: number;
    driverMinTrips?: number;
    maxDailyPerUser?: number;
    shareText?: string;
  };
  loginSettings?: {
    resetPasswordTemplate?: string;
    newRegisterTemplate?: string;
    loginSignupTemplate?: string;
    requiredFields?: {
      name?: boolean;
      email?: boolean;
      phone?: boolean;
      vehicle?: boolean;
    };
    authSystem?: 'postgres' | 'custom' | 'offline';
    otpMode?: 'simulated' | 'sms';
    howToResetPassword?: string;
    defaultAvatarUrl?: string;
    customFields?: any[];
    verificationTexts?: any;
    profileFieldConfig?: any;
    countries?: any[];
    states?: any[];
    cities?: any[];
    vehicleCategories?: any[];
    vehicleBrands?: any[];
    vehicleModels?: any[];
    vehicleColors?: any[];
    documentSamples?: any[];
  };
  pushSettings?: {
    enabled: boolean;
    engine: 'system' | 'vapid';
    autoPrompt?: boolean;
    disabledTriggerIds?: string[];
    triggerOverrides?: Record<string, { enabled?: boolean; templateTitle?: string; templateBody?: string }>;
  };
  pwaPromptConfig?: PwaPromptConfig;
}

export interface PwaPromptConfig {
  enabled: boolean;
  appTitle: string;
  appSubtitle: string;
  logoUrl?: string;
  versionTag: string;
  iosStep1Title: string;
  iosStep1ButtonText: string;
  iosStep2Title: string;
  iosStep2ButtonText: string;
  androidStep1Title: string;
  androidStep1Desc: string;
  androidStep2Title: string;
  androidStep2ButtonText: string;
  securityBadgeText: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  autoPushToUninstalled: boolean;
  forceDeviceView?: 'auto' | 'ios' | 'android';
}

export interface MapEvent {
  id: string;
  title: string;
  description: string;
  image?: string;
  iconUrl?: string;
  iconSize?: number;
  eventDate?: string;
  startDate?: string;
  endDate?: string;
  lat: number;
  lng: number;
  active: boolean;
  actionType: 'redirect' | 'book' | 'popup-only';
  actionUrl?: string;
  actionText?: string;
  targetAudience: 'all' | 'riders' | 'drivers';
}

export interface LegalPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  lastUpdated: string;
  status: 'Active' | 'Draft';
  category?: 'Legal' | 'Safety' | 'Billing' | 'Policy' | 'General';
  targetAudience?: 'all' | 'riders' | 'drivers';
  icon?: string;
  seoTitle?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  targetAudience: 'rider' | 'driver' | 'all';
  active: boolean;
  order?: number;
}

export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  iconName?: string;
  mediaType?: 'image' | 'icon';
  buttonText: string;
  durationSeconds: number;
  showSkip: boolean;
  active: boolean;
  order: number;
  targetAudience: 'rider' | 'driver';
  bgGradient?: string;
  cardTheme?: 'lime' | 'pink' | 'mint' | 'amber' | 'slate' | 'indigo' | 'purple' | 'custom';
  customBgColor?: string;
  circleColor?: string;
}

export interface OnboardingSettings {
  enableRiderOnboarding: boolean;
  enableDriverOnboarding: boolean;
  autoSlideIntervalSeconds: number;
  allowSkip: boolean;
}

export interface AppBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  surfaceCardColor: string;
  surfaceSoftColor: string;
  textColor: string;
  textColorMuted: string;
  fontFamily: string;
  headingFontFamily?: string;
  logoFontFamily?: string;
  backendFontFamily?: string;
  borderRadiusMd: number;
  borderRadiusLg: number;
  cardShadow: 'none' | 'soft' | 'vibrant' | 'ambient' | 'brutalist';
  borderWidth: number;
  spacingDensity: 'compact' | 'comfortable' | 'spacious';
  headingStyle: 'normal' | 'uppercase' | 'display-italic' | 'clunky-retro';
  logoUrl?: string;
  darkLogoUrl?: string;
  lightLogoUrl?: string;
  textLogo?: string;
  horizontalLogoUrl?: string;
  horizontalLogoDarkUrl?: string;
  faviconUrl?: string;
  logoType?: 'icon' | 'text' | 'combined' | 'horizontal';
  logoHeight?: number;
  logoWithText?: boolean;
  tagline?: string;
  // Section-specific logo overrides
  landingLogoUrl?: string;
  landingDarkLogoUrl?: string;
  appLogoUrl?: string;
  appDarkLogoUrl?: string;
  backendLogoUrl?: string;
  backendDarkLogoUrl?: string;
  authLogoUrl?: string;
  authDarkLogoUrl?: string;
  // Mode-specific logo overrides
  riderLogoUrl?: string;
  riderDarkLogoUrl?: string;
  driverLogoUrl?: string;
  driverDarkLogoUrl?: string;
  // Mode-specific text and sub-text controls
  riderTextLogo?: string;
  riderTagline?: string;
  riderShowText?: boolean;
  riderShowTagline?: boolean;
  driverTextLogo?: string;
  driverTagline?: string;
  driverShowText?: boolean;
  driverShowTagline?: boolean;
}

export interface MapCustomization {
  tilePreset?: 'light' | 'dark' | 'voyager' | 'satellite' | 'esri-gray' | 'topo' | 'osm-standard' | 'osm-hot' | 'uber-minimal' | 'fullcolor' | string;
  roadHighlightColor?: string;
  roadHighlightWeight?: number;
  roadHighlightOpacity?: number;
  roadPulseAnimation?: boolean;
  transitShadesEnabled?: boolean;
  pickupIconUrl?: string;
  dropoffIconUrl?: string;
  pickupIconScale?: number;
  dropoffIconScale?: number;
  vehicleIconUrl?: string;
  vehicleIconScale?: number;
  bikeIconUrl?: string;
  bikeIconScale?: number;
  autoIconUrl?: string;
  autoIconScale?: number;
  riderIconUrl?: string;
  riderIconScale?: number;
  homeIconUrl?: string;
  homeIconScale?: number;
  driverToRiderColor?: string;
  riderToDestColor?: string;
  markerBounceAnimation?: boolean;
  showMinimap?: boolean;
  frontVehicleIconUrl?: string;
  frontBikeIconUrl?: string;
  frontAutoIconUrl?: string;
  openMapsEnabled?: boolean;
  googleMapsEnabled?: boolean;
  googleMapsApiKey?: string;
  googlePlacesApiKey?: string;
  tileLayerUrl?: string;
  centerLat?: number;
  centerLng?: number;
}
