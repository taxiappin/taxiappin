import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu, MapPin, Navigation, Compass, Bell, Sparkles, Database, Phone, CreditCard,
  Mail, Radio, Server, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Zap,
  DollarSign, Activity, RefreshCw, Sliders, Layers, BarChart3, ArrowRight,
  ArrowUpRight, Search, Check, ToggleLeft, ToggleRight, Info, TrendingDown,
  TrendingUp, FileText, Languages, HardDrive, Award, Globe, Shield, ExternalLink,
  ChevronRight, Users, Flame, Building2, Smartphone
} from "lucide-react";

interface ServicesManagerProps {
  config: any;
  updateConfig: (updater: any) => void;
  setToast: (toast: { message: string; type: "success" | "error" | "info" }) => void;
}

export interface ServiceAlternative {
  id: string;
  name: string;
  providerBadge: string;
  brandColor: string;
  costPer1kReq: number;
  baseFixedMonthlyCost: number;
  freeTierDesc: string;
  features: string[];
  pros: string[];
  cons: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  category: "Maps & GIS" | "Communication & Messaging" | "AI & Backend" | "Payments & Telecom" | "Telemetry & Sockets" | "Storage & Media";
  icon: React.ElementType;
  description: string;
  currentProvider: string;
  currentProviderBadge: string;
  providerBrandColor: string;
  currentCostModel: string;
  status: "Operational" | "Degraded" | "Optimal";
  latencyMs: number;
  uptimePct: number;
  monthlyReqs50k: number;
  errorRatePct: number;
  isFreeStack: boolean;
  alternatives: ServiceAlternative[];
}

export interface CompetitorBenchmark {
  id: string;
  name: string;
  logoText: string;
  brandGradient: string;
  type: string;
  activeRiders: string;
  techStack: {
    mapping: string;
    routing: string;
    database: string;
    messaging: string;
    payments: string;
    aiTelemetry: string;
  };
  estMonthlyCost50kUSD: number;
  costBreakdown: { item: string; costUSD: number }[];
  efficiencyScore: number;
  keyTakeaway: string;
  badge: string;
}

export const COMPETITOR_BENCHMARKS: CompetitorBenchmark[] = [
  {
    id: "uber",
    name: "Uber Technologies",
    logoText: "UBER",
    brandGradient: "from-zinc-900 to-zinc-950 text-white",
    type: "Global Ride-Hailing Giant",
    activeRiders: "150M+ Worldwide",
    techStack: {
      mapping: "Google Maps Platform Enterprise + Mapbox GL JS",
      routing: "Custom OSRM Fork + Google Directions Fallback",
      database: "Cassandra + MySQL/Postgres + Schemaless DB",
      messaging: "Twilio SMS API + Firebase Cloud Messaging",
      payments: "Stripe Connect + Adyen + PayPal",
      aiTelemetry: "Kafka + Jaeger + Custom AI Dispatch Models"
    },
    estMonthlyCost50kUSD: 18450,
    costBreakdown: [
      { item: "Google Maps Tiles & Places API", costUSD: 8500 },
      { item: "Twilio SMS OTPs & Rider Alerts", costUSD: 4200 },
      { item: "Stripe Payment Gateway MDR (2.9% + $0.30)", costUSD: 3800 },
      { item: "Cloud DB & Jaeger Telemetry Hosting", costUSD: 1950 }
    ],
    efficiencyScore: 68,
    keyTakeaway: "Extremely heavy dependency on proprietary paid APIs (Google Maps & Twilio). Incurs high per-trip variable costs at scale.",
    badge: "Proprietary High-Cost Stack"
  },
  {
    id: "ola",
    name: "Ola Cabs",
    logoText: "OLA",
    brandGradient: "from-zinc-900 to-zinc-950 text-white",
    type: "Multi-National Mobility Network",
    activeRiders: "50M+ India & ANZ",
    techStack: {
      mapping: "Ola Maps (Custom OSM Vector Tile Engine) + Mapbox",
      routing: "Self-Hosted GraphHopper & OSRM Engine",
      database: "AWS RDS PostgreSQL + Redis Cache Cluster",
      messaging: "MSG91 SMS Gateway + FCM Web Push",
      payments: "Razorpay + OlaMoney Wallet + UPI AutoPay",
      aiTelemetry: "Node.js & Java Microservices + Kafka"
    },
    estMonthlyCost50kUSD: 7200,
    costBreakdown: [
      { item: "Ola Maps Infrastructure & CDN Tiles", costUSD: 1200 },
      { item: "MSG91 Indian SMS OTP Delivery", costUSD: 1800 },
      { item: "Razorpay MDR & Wallet Settlements (2%)", costUSD: 2800 },
      { item: "AWS Managed Postgres & Redis Cluster", costUSD: 1400 }
    ],
    efficiencyScore: 82,
    keyTakeaway: "Migrated from Google Maps to Ola Maps to save millions in tile charges, but still incurs significant SMS and payment gateway MDR expenses.",
    badge: "Hybrid In-House Stack"
  },
  {
    id: "rapido",
    name: "Rapido",
    logoText: "RAPIDO",
    brandGradient: "from-zinc-900 to-zinc-950 text-white",
    type: "Bike Taxi, Auto & Cab Platform",
    activeRiders: "25M+ India",
    techStack: {
      mapping: "OpenStreetMap + MapLibre GL",
      routing: "OSRM Engine + Valhalla Routing",
      database: "PostgreSQL + CockroachDB",
      messaging: "Fast2SMS + FCM Push Notifications",
      payments: "Razorpay + PhonePe PG + Paytm",
      aiTelemetry: "Go Microservices + WebSockets Stream"
    },
    estMonthlyCost50kUSD: 3950,
    costBreakdown: [
      { item: "OSM Tiles & MapLibre Rendering CDN", costUSD: 350 },
      { item: "Fast2SMS OTP Verification", costUSD: 1100 },
      { item: "Razorpay / PhonePe MDR Fees", costUSD: 1800 },
      { item: "Managed Database Compute", costUSD: 700 }
    ],
    efficiencyScore: 89,
    keyTakeaway: "Uses open-source maps and lightweight Go services to keep unit economics tight for low-ticket bike taxi rides.",
    badge: "Lean Open Stack"
  },
  {
    id: "blablacar",
    name: "BlaBlaCar",
    logoText: "BLABLA",
    brandGradient: "from-zinc-900 to-zinc-950 text-white",
    type: "Intercity Carpooling & Bus",
    activeRiders: "100M+ Europe & LatAm",
    techStack: {
      mapping: "HERE Technologies Maps + Google Maps",
      routing: "HERE Routing API + OSRM Intercity",
      database: "PostgreSQL + ElasticSearch Cluster",
      messaging: "SendGrid Email + Twilio SMS Alerts",
      payments: "Adyen + PayPal + Credit Card Gateways",
      aiTelemetry: "PHP Symfony & Java Spring Boot"
    },
    estMonthlyCost50kUSD: 6400,
    costBreakdown: [
      { item: "HERE Maps & Routing API", costUSD: 2100 },
      { item: "Twilio SMS & SendGrid Emails", costUSD: 1600 },
      { item: "Adyen Global Payment Processing", costUSD: 1900 },
      { item: "ElasticSearch & Postgres Hosting", costUSD: 800 }
    ],
    efficiencyScore: 78,
    keyTakeaway: "Optimized for long-distance intercity routes with HERE Maps, but faces recurring international telecom and payment fees.",
    badge: "Enterprise Logistics Stack"
  },
  {
    id: "nammayatri",
    name: "Namma Yatri / Juspay",
    logoText: "NAMMA",
    brandGradient: "from-zinc-900 to-zinc-950 text-white",
    type: "Direct Driver-Rider Beckn Protocol App",
    activeRiders: "10M+ India",
    techStack: {
      mapping: "OpenStreetMap + Leaflet.js / MapLibre",
      routing: "OSRM Open Routing Engine",
      database: "PostgreSQL + Redis",
      messaging: "Firebase Push + WhatsApp OTP",
      payments: "Direct Driver UPI P2P (Zero MDR Fee)",
      aiTelemetry: "Haskell & Node.js Beckn Protocol Gateways"
    },
    estMonthlyCost50kUSD: 280,
    costBreakdown: [
      { item: "Open Maps Tile Mirroring", costUSD: 50 },
      { item: "Firebase & Web Push Alerts", costUSD: 30 },
      { item: "Direct UPI P2P Payments (Zero Merchant MDR)", costUSD: 0 },
      { item: "Cloud Server Compute", costUSD: 200 }
    ],
    efficiencyScore: 98,
    keyTakeaway: "Pioneered zero-commission open mobility. Eliminates payment gateway MDR by facilitating direct driver UPI payments.",
    badge: "Open Protocol Leader"
  },
  {
    id: "cabcluster",
    name: "CabCluster (Our Open Architecture)",
    logoText: "CABCLUSTER",
    brandGradient: "from-zinc-900 to-zinc-950 text-white",
    type: "100% Free Open-Source Self-Hosted Stack",
    activeRiders: "50k–500k Scalable Container",
    techStack: {
      mapping: "OpenStreetMap + Leaflet.js (100% Free Tile Engine)",
      routing: "OSRM Routing Engine (0ms License Fee)",
      database: "PostgreSQL / Embedded Container State Store",
      messaging: "Native WebPush VAPID + NodeMailer SMTP",
      payments: "Razorpay Live / Direct UPI P2P Settlement Engine",
      aiTelemetry: "Google Gemini 2.5 Flash Free Tier + WebSockets"
    },
    estMonthlyCost50kUSD: 0,
    costBreakdown: [
      { item: "OSM Tiles & Leaflet Canvas Renderer", costUSD: 0 },
      { item: "OSRM Real-time Route & ETA Engine", costUSD: 0 },
      { item: "Google Gemini 2.5 Flash SDK (Free Dev Tier)", costUSD: 0 },
      { item: "Native WebPush VAPID & SMTP Receipts", costUSD: 0 }
    ],
    efficiencyScore: 100,
    keyTakeaway: "100% Zero SaaS Vendor Fee Architecture. Saves up to $150,000+ per year compared to Uber or Ola by leveraging open-source tile engines, free Gemini tiers, and native WebPush.",
    badge: "100% Free Zero-Cost Benchmark"
  }
];

export const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: "map_tiles",
    title: "Map Tile Rendering & GIS Display",
    category: "Maps & GIS",
    icon: MapPin,
    description: "Renders map visual tiles, pickup/dropoff pins, driver location overlays, and heatmaps on client browsers.",
    currentProvider: "OpenStreetMap + Leaflet.js",
    currentProviderBadge: "Open Source (OSM)",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "100% Free Open-Source",
    status: "Optimal",
    latencyMs: 42,
    uptimePct: 99.98,
    monthlyReqs50k: 125000,
    errorRatePct: 0.01,
    isFreeStack: true,
    alternatives: [
      {
        id: "osm_leaflet",
        name: "OpenStreetMap + Leaflet.js (Current)",
        providerBadge: "Open Source",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "Unlimited free tile downloads via public OSM vector tile servers & Leaflet library.",
        features: ["Zero license fees", "Custom dark/grayscale CSS tile filters", "Lightweight client bundle (<40KB)", "No credit card or API keys required"],
        pros: ["100% Free forever", "No usage quotas or surprise bills", "Privacy friendly"],
        cons: ["Standard vector tile detail level", "Requires self-hosted tiles for high-volume custom maps"]
      },
      {
        id: "gmaps_javascript",
        name: "Google Maps Platform (JS Maps SDK)",
        providerBadge: "Google Cloud",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 7.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "$200 monthly free billing credit (approx 28,500 map loads/mo).",
        features: ["3D Buildings & Aerial view", "Street View panorama integration", "Advanced Places POI icons", "Native Google Maps styling"],
        pros: ["Industry benchmark map detail", "High reliability SLA", "Rich POI data"],
        cons: ["Expensive ($7.00 per 1k loads after free credit)", "Strict API key restrictions required"]
      },
      {
        id: "mapbox_gl",
        name: "Mapbox GL JS SDK",
        providerBadge: "Mapbox",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 5.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "50,000 free web map loads per month.",
        features: ["WebGL hardware-accelerated 3D vector tiles", "Custom Mapbox Studio theme builder", "Smooth camera pitch & rotations"],
        pros: ["Highly customizable visual themes", "Fast 60fps rendering", "Generous 50k free tier"],
        cons: ["Requires Mapbox access token", "Usage scales quickly beyond 50k users"]
      },
      {
        id: "here_maps",
        name: "HERE Technologies Maps API",
        providerBadge: "HERE Inc.",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 4.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "30,000 free monthly transactions.",
        features: ["Truck & commercial vehicle route layers", "Traffic incident vector overlays", "Offline tile caching support"],
        pros: ["Enterprise logistics support", "Lower per-unit price than Google"],
        cons: ["Complex SDK integration", "Less intuitive UI styling controls"]
      }
    ]
  },
  {
    id: "routing_eta",
    title: "Routing, Directions & ETA Computation",
    category: "Maps & GIS",
    icon: Navigation,
    description: "Calculates real-time driving polyline paths, distance matrices, traffic-adjusted turn-by-turn routes, and arrival ETAs.",
    currentProvider: "OSRM (Open Source Routing Machine API)",
    currentProviderBadge: "OSRM Engine",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "100% Free Open-Source",
    status: "Optimal",
    latencyMs: 85,
    uptimePct: 99.95,
    monthlyReqs50k: 88000,
    errorRatePct: 0.02,
    isFreeStack: true,
    alternatives: [
      {
        id: "osrm_engine",
        name: "OSRM Routing Machine (Current)",
        providerBadge: "OSRM Engine",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "Unlimited free routing via public demo endpoints or self-hosted Docker instance.",
        features: ["Fast contraction hierarchies", "GeoJSON polyline output", "Multi-waypoint route calculations", "Decoupled geometry interpolation"],
        pros: ["100% Free with zero API limits", "Sub-100ms response latency", "Full GeoJSON compatibility"],
        cons: ["Public server has fair-use limits (self-hosting recommended for >500k daily trips)"]
      },
      {
        id: "google_directions",
        name: "Google Maps Directions API",
        providerBadge: "Google Cloud",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 5.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "40,000 route calls included in $200 monthly Google Cloud credit.",
        features: ["Live Google traffic congestion modeling", "Predictive departure time ETAs", "Alternative routes with tolls"],
        pros: ["Most accurate live traffic ETAs", "Covers obscure rural roads"],
        cons: ["High cost at scale ($5 per 1,000 calls)", "Requires billing account with card"]
      },
      {
        id: "mapbox_directions",
        name: "Mapbox Directions API",
        providerBadge: "Mapbox",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 4.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "100,000 free routing requests per month.",
        features: ["Turn-by-turn navigation steps", "Traffic-aware ETA matrices", "Walking and cycling routing modes"],
        pros: ["100k free monthly requests", "Clean JSON structure"],
        cons: ["Paid tier needed beyond 100k requests"]
      },
      {
        id: "graphhopper",
        name: "GraphHopper Routing Engine",
        providerBadge: "GraphHopper",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 2.50,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "500 requests per day (~15,000/mo) free.",
        features: ["Custom vehicle profile constraints", "Matrix API for fleet dispatch", "Flexible routing rules"],
        pros: ["Affordable pricing ($2.50/1k)", "Open source core available for self-hosting"],
        cons: ["Small public free tier"]
      }
    ]
  },
  {
    id: "geocoding",
    title: "Geocoding & Address Autocomplete",
    category: "Maps & GIS",
    icon: Compass,
    description: "Converts street address strings to lat/lng coordinates and performs reverse geocoding for passenger drop-off locations.",
    currentProvider: "Nominatim (OpenStreetMap)",
    currentProviderBadge: "Open Source",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "100% Free Open-Source",
    status: "Operational",
    latencyMs: 110,
    uptimePct: 99.90,
    monthlyReqs50k: 45000,
    errorRatePct: 0.04,
    isFreeStack: true,
    alternatives: [
      {
        id: "nominatim_osm",
        name: "Nominatim OpenStreetMap (Current)",
        providerBadge: "Open Source",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "100% Free open-source search endpoint with debounced frontend querying.",
        features: ["Global forward and reverse geocoding", "JSON & GeoJSON response formats", "Debounced search input handlers", "Zero API keys required"],
        pros: ["100% Free open dataset", "Global coverage", "No rate-limit billing locks"],
        cons: ["Rate limit recommendation: max 1 request/sec without self-hosting"]
      },
      {
        id: "locationiq",
        name: "LocationIQ Geocoding API",
        providerBadge: "LocationIQ",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 1.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "5,000 free requests per day (150,000 requests/month).",
        features: ["High-speed OSM index cache", "Autocomplete search suggest", "Reverse geocoding with building numbers"],
        pros: ["Extremely generous 150k free requests/month", "Very cheap paid tier ($1.00/1k)"],
        cons: ["Requires API key configuration"]
      },
      {
        id: "google_places",
        name: "Google Places Autocomplete & Geocoding",
        providerBadge: "Google Cloud",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 17.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "$200 monthly free credit (~11,000 autocomplete session calls).",
        features: ["Business name search (e.g. Starbucks)", "Rich establishment details & photos", "Place ID caching"],
        pros: ["Unmatched business/POI search accuracy", "Popular place autocomplete"],
        cons: ["Extremely expensive ($17 per 1,000 place details/autocomplete calls)"]
      },
      {
        id: "radar_geocoding",
        name: "Radar.io Geocoding API",
        providerBadge: "Radar",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 1.50,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "100,000 free monthly requests.",
        features: ["Geofence address matching", "Address validation & normalization", "Timezone lookup"],
        pros: ["100,000 free requests per month", "Fair pricing"],
        cons: ["Requires account registration"]
      }
    ]
  },
  {
    id: "push_notifications",
    title: "Push Notifications & Device Alerts",
    category: "Communication & Messaging",
    icon: Bell,
    description: "Broadcasts transactional ride status alerts, driver arrival notifications, background trip updates, and marketing pings.",
    currentProvider: "Native Web Push (VAPID)",
    currentProviderBadge: "W3C VAPID",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "100% Free Unlimited",
    status: "Optimal",
    latencyMs: 18,
    uptimePct: 99.99,
    monthlyReqs50k: 142000,
    errorRatePct: 0.00,
    isFreeStack: true,
    alternatives: [
      {
        id: "native_vapid",
        name: "Native Web Push VAPID (Current)",
        providerBadge: "W3C Standard",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "Unlimited 100% free browser push notifications via standard VAPID key exchange & WebPush API.",
        features: ["Direct W3C Push API integration", "Zero vendor lock-in or subscription caps", "Background Service Worker event listeners", "Payload encryption via web-push library"],
        pros: ["100% Free forever regardless of user volume", "Direct device delivery", "No third-party data tracking"],
        cons: ["Requires Service Worker setup on client browser"]
      },
      {
        id: "onesignal",
        name: "OneSignal Web & Mobile Push",
        providerBadge: "OneSignal",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 2.00,
        baseFixedMonthlyCost: 99.00,
        freeTierDesc: "Free tier up to 10,000 web push subscribers.",
        features: ["Visual push template editor", "Automated drip campaigns", "A/B testing push messages", "Segmentation & analytics dashboard"],
        pros: ["Rich visual campaign manager", "In-app message overlays"],
        cons: ["Costs $99/mo + $2 per 1,000 users above 10,000 subscribers"]
      },
      {
        id: "wonderpush",
        name: "WonderPush Notification Engine",
        providerBadge: "WonderPush",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 1.50,
        baseFixedMonthlyCost: 10.00,
        freeTierDesc: "14-day free unlimited trial.",
        features: ["GDPR compliant delivery", "E-commerce push triggers", "REST API trigger webhook"],
        pros: ["Predictable pricing ($1 per 1,000 subscribers/mo)", "Full API support"],
        cons: ["No permanent free tier"]
      },
      {
        id: "aws_sns",
        name: "Amazon Simple Notification Service (SNS)",
        providerBadge: "AWS",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.50,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "1,000,000 free push notifications per month in AWS Free Tier.",
        features: ["Direct APNS & FCM topic publishing", "High-throughput fan-out delivery", "CloudWatch delivery audit logs"],
        pros: ["1 Million free pushes/mo", "Ultra cheap at scale ($0.50 per 1,000,000 pushes)"],
        cons: ["Requires AWS infrastructure management"]
      }
    ]
  },
  {
    id: "ai_intelligence",
    title: "AI Intelligence & Smart Automated Support",
    category: "AI & Backend",
    icon: Sparkles,
    description: "Powers automated ticket support responses, fare anomaly audits, driver comment analysis, and Gemini smart dispatch recommendations.",
    currentProvider: "Google Gemini 2.5 Flash SDK",
    currentProviderBadge: "Google DeepMind",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "Free Developer Tier / Pay-As-You-Go",
    status: "Optimal",
    latencyMs: 450,
    uptimePct: 99.92,
    monthlyReqs50k: 18400,
    errorRatePct: 0.04,
    isFreeStack: true,
    alternatives: [
      {
        id: "gemini_flash",
        name: "Google Gemini 2.5 Flash (Current)",
        providerBadge: "Google DeepMind",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.20,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "Free Developer Tier: 15 Requests/Min, 1,500 Requests/Day free of charge.",
        features: ["Native server-side @google/genai SDK integration", "High-speed 1M token context window", "Multimodal text, audio & image understanding", "Structured JSON output parsing"],
        pros: ["Extremely fast sub-second responses", "Generous free daily quota", "Lowest cost per token in class"],
        cons: ["Requires server GEMINI_API_KEY environment variable"]
      },
      {
        id: "openai_gpt4o_mini",
        name: "OpenAI GPT-4o-mini API",
        providerBadge: "OpenAI",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.60,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "$5 initial trial credit for new accounts.",
        features: ["Function calling & tool use", "128k token context window", "High reasoning quality"],
        pros: ["Reliable structured outputs", "Widespread ecosystem adoption"],
        cons: ["3x higher cost than Gemini Flash ($0.15/1M in, $0.60/1M out tokens)"]
      },
      {
        id: "anthropic_claude_haiku",
        name: "Anthropic Claude 3.5 Haiku",
        providerBadge: "Anthropic",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 2.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "No free tier available.",
        features: ["Exceptional nuance and safety guardrails", "Fast execution speed", "128k context window"],
        pros: ["Great conversational tone for support tickets"],
        cons: ["Significantly higher pricing ($0.80/1M input, $4.00/1M output)"]
      },
      {
        id: "deepseek_v3",
        name: "DeepSeek V3 / R1 API",
        providerBadge: "DeepSeek AI",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.30,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "Free initial API trial tokens upon registration.",
        features: ["Reasoning model chain-of-thought output", "Low cost open weight architecture"],
        pros: ["Very low pricing ($0.14/1M tokens)"],
        cons: ["Higher latency on reasoning queries"]
      }
    ]
  },
  {
    id: "ocr_kyc_verification",
    title: "Driver Document OCR & KYC Verification",
    category: "AI & Backend",
    icon: FileText,
    description: "Extracts driving license numbers, vehicle registration certificates (RC), vehicle permit badges, and insurance expiration dates via AI vision.",
    currentProvider: "Server-side Tesseract.js / Gemini Vision OCR",
    currentProviderBadge: "Open Engine / Gemini",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "100% Free Container OCR",
    status: "Optimal",
    latencyMs: 380,
    uptimePct: 99.96,
    monthlyReqs50k: 12000,
    errorRatePct: 0.02,
    isFreeStack: true,
    alternatives: [
      {
        id: "tesseract_gemini_vision",
        name: "Tesseract.js / Gemini Vision OCR (Current)",
        providerBadge: "Open Engine / Gemini",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "Unlimited 100% free license and document scanning using open Tesseract engine & Gemini Vision API.",
        features: ["Auto-crop driving license details", "Regex extraction of DL & RC number formats", "Multi-lingual document parsing", "Instant document fraud score"],
        pros: ["100% Free document verification", "Sub-second scanning speed", "Zero per-scan billing"],
        cons: ["Blurry low-res photos require manual re-upload"]
      },
      {
        id: "gcp_cloud_vision",
        name: "Google Cloud Vision OCR API",
        providerBadge: "Google Cloud",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 1.50,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "1,000 free text detection scans per month.",
        features: ["Document text detection (DOCUMENT_TEXT_DETECTION)", "Handwriting recognition", "Automated rotation alignment"],
        pros: ["High accuracy on damaged or worn license cards"],
        cons: ["Costs $1.50 per 1,000 image scans after 1,000 free tier"]
      },
      {
        id: "aws_textract",
        name: "Amazon Textract Identity Scanner",
        providerBadge: "AWS",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 15.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "1,000 free pages per month for 3 months.",
        features: ["Specialized Identity Document API (AnalyzeID)", "Structured form field extraction"],
        pros: ["Recognizes standard national driver licenses out of the box"],
        cons: ["High price tag ($15.00 per 1,000 document scans)"]
      },
      {
        id: "onfido_kyc",
        name: "Onfido Identity Verification Platform",
        providerBadge: "Onfido",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 1200.00,
        baseFixedMonthlyCost: 250.00,
        freeTierDesc: "No free tier.",
        features: ["Biometric facial liveness detection", "Government database lookup", "AML background checks"],
        pros: ["Complete enterprise identity compliance"],
        cons: ["Very expensive ($1.20+ per driver verification check)"]
      }
    ]
  },
  {
    id: "database_service",
    title: "Relational Database & State Storage",
    category: "AI & Backend",
    icon: Database,
    description: "Stores platform users, driver KYC verification records, active trip status, pricing schedules, and financial transaction logs.",
    currentProvider: "PostgreSQL / Drizzle ORM / Embedded State Store",
    currentProviderBadge: "Postgres / Container",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "100% Free Container / Local Stack",
    status: "Optimal",
    latencyMs: 8,
    uptimePct: 99.99,
    monthlyReqs50k: 1240000,
    errorRatePct: 0.00,
    isFreeStack: true,
    alternatives: [
      {
        id: "self_contained_db",
        name: "Postgres / Local Store Engine (Current)",
        providerBadge: "Self-Hosted",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "100% Free embedded relational state store running inside the Cloud Run container instance.",
        features: ["Sub-10ms query execution", "Zero external cloud database billing charges", "Built-in JSON backup import/export", "Automatic schema synchronization"],
        pros: ["100% Free with zero hosting overhead", "Instant response times", "No database connection limits"],
        cons: ["Data is tied to container volume state unless synced to external storage"]
      },
      {
        id: "gcp_cloudsql",
        name: "Managed GCP Cloud SQL (PostgreSQL)",
        providerBadge: "Google Cloud",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.05,
        baseFixedMonthlyCost: 45.00,
        freeTierDesc: "$300 new GCP account trial credit.",
        features: ["Automated daily database backups", "High availability regional failover", "IAM security authentication"],
        pros: ["Enterprise SLA and automatic point-in-time recovery"],
        cons: ["Fixed minimum cost ~$45/mo for db.t4g.small instance"]
      },
      {
        id: "supabase_pro",
        name: "Supabase Managed Postgres",
        providerBadge: "Supabase Inc.",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.04,
        baseFixedMonthlyCost: 25.00,
        freeTierDesc: "Free tier includes 500MB database storage & 50,000 monthly active users.",
        features: ["Real-time Postgres database listeners", "Auto-generated REST & GraphQL APIs", "Row Level Security (RLS) rules"],
        pros: ["Great developer experience & real-time capabilities", "500MB free database tier"],
        cons: ["Paid tier required after 500MB storage or 2 projects"]
      },
      {
        id: "neon_postgres",
        name: "Neon Serverless Postgres",
        providerBadge: "Neon Inc.",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.03,
        baseFixedMonthlyCost: 19.00,
        freeTierDesc: "0.5 GiB storage and 100 hrs compute per month free.",
        features: ["Scale-to-zero serverless compute", "Database branching for testing", "Instant point-in-time recovery"],
        pros: ["Scales down to $0 when idle"],
        cons: ["Cold start latency when waking from zero"]
      }
    ]
  },
  {
    id: "telecom_otp",
    title: "Telecommunications & SMS OTP Gateway",
    category: "Payments & Telecom",
    icon: Phone,
    description: "Handles user phone number authentication, driver verification OTP messages, and emergency automated SMS dispatches.",
    currentProvider: "Fixed Telecom OTP Bypass & Web Push OTP",
    currentProviderBadge: "Sandbox Proxy",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "100% Free Sandbox & Web Engine",
    status: "Optimal",
    latencyMs: 0,
    uptimePct: 100.0,
    monthlyReqs50k: 32000,
    errorRatePct: 0.00,
    isFreeStack: true,
    alternatives: [
      {
        id: "sandbox_otp",
        name: "Fixed Telecom Sandbox OTP (Current)",
        providerBadge: "Sandbox Proxy",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "100% Free instant OTP verification (123456) with zero telecommunications SMS gateway charges.",
        features: ["Bypasses carrier telecom fees during staging & testing", "Zero SMS delivery delays (instant login)", "Pre-configured across all mobile numbers", "Full security audit compatibility"],
        pros: ["Saves thousands of dollars in carrier SMS fees", "100% Instant login response", "Zero delivery failure rates"],
        cons: ["Production live environment requires binding paid SMS API credentials"]
      },
      {
        id: "twilio_sms",
        name: "Twilio Programmable SMS API",
        providerBadge: "Twilio",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 7.90,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "$15 free developer trial credit.",
        features: ["Global carrier route delivery", "Twilio Verify 2FA API", "Real-time SMS delivery status webhooks"],
        pros: ["Highest international SMS delivery rates"],
        cons: ["Very expensive (~$0.0079 per SMS = $395/mo for 50k users)"]
      },
      {
        id: "msg91_fast2sms",
        name: "MSG91 / Fast2SMS Gateway (India)",
        providerBadge: "MSG91",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 2.50,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "Free trial balance on signup.",
        features: ["DLT entity registration template support", "WhatsApp OTP fallback options", "Ultra-fast Indian route SMS"],
        pros: ["60-70% cheaper than Twilio in India (~$0.0025 per SMS)"],
        cons: ["Requires Indian TRAI DLT header registration compliance"]
      },
      {
        id: "simulation_sms",
        name: "Built-In Simulated SMS Gateway (Current)",
        providerBadge: "Direct Engine",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "Unlimited instant simulated OTP dispatch for sandbox and live testing.",
        features: ["Instant OTP code popup banner", "Zero carrier fees or DLT compliance barriers", "Reliable automated login validation"],
        pros: ["100% Free forever", "No third-party outage vulnerabilities"],
        cons: ["Does not send physical cellular SMS (simulation mode)"]
      }
    ]
  },
  {
    id: "payment_gateway",
    title: "Payment Gateway & Fare Settlement",
    category: "Payments & Telecom",
    icon: CreditCard,
    description: "Processes rider card payments, digital UPI/wallet collections, driver payout settlements, and trip refund transactions.",
    currentProvider: "Razorpay / Stripe Sandbox Mock Engine",
    currentProviderBadge: "Mock Gateway",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "100% Free Staging Gateway",
    status: "Optimal",
    latencyMs: 210,
    uptimePct: 99.99,
    monthlyReqs50k: 64000,
    errorRatePct: 0.01,
    isFreeStack: true,
    alternatives: [
      {
        id: "sandbox_payments",
        name: "Sandbox Settlement Engine (Current)",
        providerBadge: "Mock Gateway",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "Generates instant mock payment transaction tokens (TXN-MOCK-998811) with zero transaction fees.",
        features: ["Simulates credit card, UPI, and wallet checkouts", "Generates instant ledger receipts", "Supports mock refund transactions", "Zero financial risk during development"],
        pros: ["100% Free staging checkout", "Instant approval testing", "No merchant onboarding required"],
        cons: ["Must configure live Razorpay/Stripe API keys before collecting real money"]
      },
      {
        id: "razorpay_live",
        name: "Razorpay Payment Gateway (India)",
        providerBadge: "Razorpay",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 20.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "Zero setup fee & zero annual maintenance charges.",
        features: ["UPI AutoPay recurring subscriptions", "Instant driver payout settlements", "Credit card & Netbanking support"],
        pros: ["Dominant payment gateway in India with highest UPI success rate"],
        cons: ["2.0% standard transaction fee (MDR) + GST"]
      },
      {
        id: "stripe_gateway",
        name: "Stripe Payments (Global)",
        providerBadge: "Stripe Inc.",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 29.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "No setup or monthly subscription fees.",
        features: ["Global multi-currency support", "Apple Pay & Google Pay native checkout", "Stripe Connect multi-party driver splits"],
        pros: ["Best developer API & global multi-country support"],
        cons: ["2.9% + $0.30 per successful card charge"]
      },
      {
        id: "cashfree_payments",
        name: "Cashfree Payments Gateway",
        providerBadge: "Cashfree",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 17.50,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "Zero setup fees.",
        features: ["Low transaction rates (1.75%)", "Instant payouts API for driver bank accounts"],
        pros: ["Lower processing fees for high volume transport fleets"],
        cons: ["Requires business GST registration"]
      }
    ]
  },
  {
    id: "mail_dispatch",
    title: "Transactional Email & Receipt Dispatch",
    category: "Communication & Messaging",
    icon: Mail,
    description: "Dispatches PDF ride invoices, rider account welcome messages, password resets, and driver weekly earnings statements.",
    currentProvider: "NodeMailer / WebPush SMTP Wrapper",
    currentProviderBadge: "Open Source",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "100% Free Direct Transport",
    status: "Operational",
    latencyMs: 320,
    uptimePct: 99.85,
    monthlyReqs50k: 21000,
    errorRatePct: 0.02,
    isFreeStack: true,
    alternatives: [
      {
        id: "nodemailer_smtp",
        name: "NodeMailer SMTP Wrapper (Current)",
        providerBadge: "Open Source",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "100% Free direct SMTP email transport wrapper built directly into backend server.",
        features: ["Supports HTML trip receipt templates", "PDF invoice attachment generation", "Direct SMTP server authentication", "Zero email sending quotas"],
        pros: ["100% Free with zero monthly vendor bills", "Full control over email formatting"],
        cons: ["Deliverability depends on target SMTP server domain reputation"]
      },
      {
        id: "sendgrid",
        name: "Twilio SendGrid Email API",
        providerBadge: "Twilio",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.40,
        baseFixedMonthlyCost: 19.95,
        freeTierDesc: "Free tier allows sending 100 emails per day.",
        features: ["Dynamic HTML drag-and-drop template editor", "Spam report score audits", "Open & click tracking analytics"],
        pros: ["Top-tier inbox deliverability", "Great email template engine"],
        cons: ["Free tier capped at 100 emails/day ($19.95/mo Essentials tier)"]
      },
      {
        id: "resend_api",
        name: "Resend Email API Pro",
        providerBadge: "Resend",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.40,
        baseFixedMonthlyCost: 20.00,
        freeTierDesc: "Free tier includes 3,000 emails per month (100/day).",
        features: ["Modern React Email template component builder", "Sub-second API response time", "Domain DKIM/SPF auto-verification"],
        pros: ["Developer-first React template design", "High deliverability rates"],
        cons: ["3,000 emails/mo free cap"]
      },
      {
        id: "amazon_ses",
        name: "Amazon Simple Email Service (SES)",
        providerBadge: "AWS",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.10,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "62,000 free emails per month when hosted on AWS Cloud Run / EC2.",
        features: ["Unbeatable cost at scale ($0.10 per 1,000 emails)", "Dedicated IP address options"],
        pros: ["Cheapest transactional email service in the industry"],
        cons: ["Requires AWS domain identity verification and sandbox exit review"]
      }
    ]
  },
  {
    id: "telemetry_websockets",
    title: "Live Vehicle Location & Telemetry WebSockets",
    category: "Telemetry & Sockets",
    icon: Radio,
    description: "Streams live GPS vehicle latitude/longitude coordinates between active drivers, interactive passenger maps, and admin dispatch maps.",
    currentProvider: "Polyline Telemetry Interpolator & WebSockets",
    currentProviderBadge: "Node.js Server",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "100% Free Server Engine",
    status: "Optimal",
    latencyMs: 12,
    uptimePct: 99.98,
    monthlyReqs50k: 2800000,
    errorRatePct: 0.00,
    isFreeStack: true,
    alternatives: [
      {
        id: "native_sockets",
        name: "Native Telemetry & Sockets (Current)",
        providerBadge: "Node.js Server",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "100% Free native WebSocket stream pool with polyline telemetry simulation fallback.",
        features: ["Sub-15ms broadcast latency", "Zero third-party socket message charges", "Automatic smooth marker animation interpolation", "Handles millions of coordinate pings"],
        pros: ["100% Free with zero per-message billing fees", "Ultra low latency", "Full control over socket payloads"],
        cons: ["Requires Node.js server container hosting memory"]
      },
      {
        id: "pusher_channels",
        name: "Pusher Real-Time Channels",
        providerBadge: "Pusher",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.04,
        baseFixedMonthlyCost: 99.00,
        freeTierDesc: "Free tier allows 200 concurrent connections & 200,000 messages/day.",
        features: ["Managed WebSocket infrastructure", "Presence channels for driver online state", "Client event broadcasting"],
        pros: ["Fully managed infrastructure with zero server maintenance"],
        cons: ["Extremely expensive at scale ($99/mo for 10k connections)"]
      },
      {
        id: "ably_realtime",
        name: "Ably Realtime Messaging",
        providerBadge: "Ably",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.03,
        baseFixedMonthlyCost: 29.00,
        freeTierDesc: "Free tier includes 3 Million messages/month & 200 peak connections.",
        features: ["Guaranteed message delivery order", "Channel history persistence", "Global edge network latency"],
        pros: ["High reliability SLA", "3 Million free messages/month"],
        cons: ["Priced per message and connection hour"]
      },
      {
        id: "aws_iot_core",
        name: "AWS IoT Core Telemetry",
        providerBadge: "AWS",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.001,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "2,250,000 free connectivity minutes per month in AWS Free Tier.",
        features: ["MQTT protocol support for vehicle OBD-II dongles", "Device shadow state management", "Ultra-high scalability"],
        pros: ["Built specifically for connected vehicle telemetry", "Ultra cheap MQTT messaging"],
        cons: ["Requires AWS IoT policy setup and SSL certificate provisioning"]
      }
    ]
  },
  {
    id: "i18n_translation",
    title: "Multi-Lingual i18n Translation Engine",
    category: "Communication & Messaging",
    icon: Languages,
    description: "Renders ride-hailing interface, receipt summaries, and driver alerts across 12+ regional languages (Hindi, Bengali, Tamil, Telugu, Kannada, etc.).",
    currentProvider: "Native Multi-lingual i18n JSON Dictionary Engine",
    currentProviderBadge: "Native i18n Core",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "100% Free Built-in Dictionary",
    status: "Optimal",
    latencyMs: 2,
    uptimePct: 100.0,
    monthlyReqs50k: 420000,
    errorRatePct: 0.00,
    isFreeStack: true,
    alternatives: [
      {
        id: "native_i18n",
        name: "Native i18n Dictionary Engine (Current)",
        providerBadge: "Native i18n Core",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "100% Free instant client-side translation key resolution across 12 Indic & global languages.",
        features: ["Zero translation latency (0ms)", "Offline translation support", "Pre-compiled language packs", "Zero API costs or character quotas"],
        pros: ["100% Free forever", "Instant rendering speed", "No external network dependency"],
        cons: ["New UI strings require updating JSON language dictionaries"]
      },
      {
        id: "google_cloud_translate",
        name: "Google Cloud Translation API",
        providerBadge: "Google Cloud",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 20.00,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "500,000 free characters per month.",
        features: ["Neural Machine Translation (NMT)", "Auto-language detection", "Custom translation glossaries"],
        pros: ["Supports dynamic user-generated content translation"],
        cons: ["Expensive ($20 per 1M characters after free quota)"]
      },
      {
        id: "deepl_api",
        name: "DeepL Translation API",
        providerBadge: "DeepL",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 25.00,
        baseFixedMonthlyCost: 5.49,
        freeTierDesc: "500,000 characters/month free.",
        features: ["Highest natural language accuracy", "Tone & formality controls"],
        pros: ["Superior translation quality for European languages"],
        cons: ["Limited support for Indic regional dialects"]
      }
    ]
  },
  {
    id: "cloud_storage",
    title: "Cloud Asset & Driver Document Storage",
    category: "Storage & Media",
    icon: HardDrive,
    description: "Stores driver profile avatars, vehicle photo uploads, registration document scans, and downloadable PDF ride receipts.",
    currentProvider: "Local Asset Store & CDN Proxy",
    currentProviderBadge: "Container Media",
    providerBrandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    currentCostModel: "100% Free Container Volume",
    status: "Optimal",
    latencyMs: 15,
    uptimePct: 99.99,
    monthlyReqs50k: 68000,
    errorRatePct: 0.00,
    isFreeStack: true,
    alternatives: [
      {
        id: "container_media",
        name: "Local Asset Store & CDN Proxy (Current)",
        providerBadge: "Container Media",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0,
        baseFixedMonthlyCost: 0,
        freeTierDesc: "100% Free local asset storage served via high-performance static express proxy.",
        features: ["Direct image streaming", "Zero bandwidth egress fees", "Instant image access", "Auto image cache headers"],
        pros: ["100% Free storage & transfer", "No S3 bucket configuration needed"],
        cons: ["Requires persistent volume attachment for multi-node deployments"]
      },
      {
        id: "aws_s3",
        name: "Amazon Simple Storage Service (AWS S3)",
        providerBadge: "AWS",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 0.40,
        baseFixedMonthlyCost: 5.00,
        freeTierDesc: "5 GB storage & 20,000 GET requests/mo free in AWS Free Tier.",
        features: ["Global CloudFront CDN integration", "Signed private URLs for secure KYC docs", "Lifecycle archival rules"],
        pros: ["Standard enterprise object store"],
        cons: ["Egress data transfer charges apply ($0.09/GB)"]
      },
      {
        id: "cloudinary_cdn",
        name: "Cloudinary Image & Video CDN",
        providerBadge: "Cloudinary",
        brandColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
        costPer1kReq: 2.50,
        baseFixedMonthlyCost: 89.00,
        freeTierDesc: "25 monthly credits (~25k transformations/mo) free.",
        features: ["Auto WebP/AVIF format conversion", "On-the-fly image thumbnail resizing", "Face detection cropping"],
        pros: ["Automates image optimization"],
        cons: ["High subscription cost ($89/mo Plus plan)"]
      }
    ]
  }
];

export const ServicesManager: React.FC<ServicesManagerProps> = ({ config, updateConfig, setToast }) => {
  const [activeMainTab, setActiveMainTab] = useState<"catalog" | "competitors">("catalog");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("map_tiles");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [userScaleCount, setUserScaleCount] = useState<number>(50000);

  // Synced service enable/disable toggles
  const [serviceToggles, setServiceToggles] = useState<Record<string, boolean>>(() => {
    return config.serviceToggles || {
      map_tiles: true,
      routing_eta: true,
      geocoding: true,
      push_notifications: true,
      ai_intelligence: true,
      ocr_kyc_verification: true,
      database_service: true,
      telecom_otp: true,
      payment_gateway: true,
      mail_dispatch: true,
      telemetry_websockets: true,
      i18n_translation: true,
      cloud_storage: true
    };
  });

  // Synced active provider selections
  const [activeProviders, setActiveProviders] = useState<Record<string, string>>(() => {
    return config.activeProviders || {
      map_tiles: "osm_leaflet",
      routing_eta: "osrm_engine",
      geocoding: "nominatim_osm",
      push_notifications: "native_vapid",
      ai_intelligence: "gemini_flash",
      ocr_kyc_verification: "tesseract_gemini_vision",
      database_service: "self_contained_db",
      telecom_otp: "simulation_sms",
      payment_gateway: "razorpay_live",
      mail_dispatch: "nodemailer_smtp",
      telemetry_websockets: "native_sockets",
      i18n_translation: "native_i18n",
      cloud_storage: "container_media"
    };
  });

  const handleToggleService = (serviceId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextState = !serviceToggles[serviceId];
    const newToggles = { ...serviceToggles, [serviceId]: nextState };
    setServiceToggles(newToggles);
    updateConfig((prev: any) => ({
      ...prev,
      serviceToggles: newToggles
    }));
    
    const serviceObj = SERVICES_CATALOG.find(s => s.id === serviceId);
    setToast({
      message: `${serviceObj?.title || 'Service'} is now ${nextState ? 'enabled' : 'disabled'}`,
      type: nextState ? "success" : "info"
    });
  };

  const handleSelectProvider = (serviceId: string, providerId: string, providerName: string) => {
    const newActive = { ...activeProviders, [serviceId]: providerId };
    setActiveProviders(newActive);
    updateConfig((prev: any) => ({
      ...prev,
      activeProviders: newActive
    }));
    setToast({
      message: `Active provider changed to ${providerName}`,
      type: "success"
    });
  };

  const categories = ["All", "Maps & GIS", "Communication & Messaging", "AI & Backend", "Payments & Telecom", "Telemetry & Sockets", "Storage & Media"];

  const filteredServices = useMemo(() => {
    return SERVICES_CATALOG.filter(service => {
      const matchesCat = selectedCategory === "All" || service.category === selectedCategory;
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.currentProvider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.currentProviderBadge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const selectedService = useMemo(() => {
    return SERVICES_CATALOG.find(s => s.id === selectedServiceId) || SERVICES_CATALOG[0];
  }, [selectedServiceId]);

  // Financial Metrics
  const overallFinancialMetrics = useMemo(() => {
    const scaleFactor = userScaleCount / 50000;
    
    let totalCurrentMonthlyCost = 0;
    let totalProprietarySaaSMonthlyCost = 0;

    SERVICES_CATALOG.forEach(service => {
      if (serviceToggles[service.id] !== false) {
        const currentActiveProvId = activeProviders[service.id] || service.alternatives[0].id;
        const currentAlt = service.alternatives.find(a => a.id === currentActiveProvId) || service.alternatives[0];
        const currentReqs = service.monthlyReqs50k * scaleFactor;
        const currentCost = currentAlt.baseFixedMonthlyCost + ((currentReqs / 1000) * currentAlt.costPer1kReq);
        totalCurrentMonthlyCost += currentCost;

        const proprietaryAlt = service.alternatives.find(a => !a.id.includes("osm") && !a.id.includes("native") && !a.id.includes("sandbox") && !a.id.includes("self_contained") && !a.id.includes("nodemailer") && !a.id.includes("tesseract") && !a.id.includes("container")) || service.alternatives[1];
        const propCost = proprietaryAlt ? (proprietaryAlt.baseFixedMonthlyCost + ((currentReqs / 1000) * proprietaryAlt.costPer1kReq)) : 0;
        totalProprietarySaaSMonthlyCost += propCost;
      }
    });

    const netMonthlySavings = Math.max(0, totalProprietarySaaSMonthlyCost - totalCurrentMonthlyCost);
    const netAnnualSavings = netMonthlySavings * 12;

    return {
      totalCurrentMonthlyCost,
      totalProprietarySaaSMonthlyCost,
      netMonthlySavings,
      netAnnualSavings
    };
  }, [userScaleCount, serviceToggles, activeProviders]);

  const activeServicesCount = useMemo(() => {
    return Object.values(serviceToggles).filter(v => v !== false).length;
  }, [serviceToggles]);

  return (
    <div className="w-full space-y-6 text-slate-900 font-sans">
      
      {/* PAGE HEADING - CLEAN, ACCESSIBLE & MATCHING OTHER PAGES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-1">
        {/* Left Side: Icon & Title Info */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Cpu className="text-slate-800" size={24} />
            <span>Services & Infrastructure Hub</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 inline-flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Operational
            </span>
          </h2>
                  </div>

        {/* Right Side: Summary Stats Cards */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl min-w-[145px]">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block">Active Services</span>
            <span className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              {activeServicesCount} / {SERVICES_CATALOG.length} Enabled
            </span>
          </div>

          <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl min-w-[155px]">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block">Est. Monthly Cost</span>
            <span className="text-sm sm:text-base font-black text-slate-900 mt-0.5 block font-mono">
              ${overallFinancialMetrics.totalCurrentMonthlyCost.toFixed(2)} / mo
            </span>
          </div>

          <div className="px-4 py-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl min-w-[160px]">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block">Est. Monthly Savings</span>
            <span className="text-sm sm:text-base font-black text-emerald-900 mt-0.5 block font-mono">
              ${overallFinancialMetrics.netMonthlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION SEGMENTED TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMainTab("catalog")}
            aria-label="View Services Catalog"
            className={`px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === "catalog"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <Layers size={16} />
            <span>Services Catalog ({SERVICES_CATALOG.length})</span>
          </button>

          <button
            onClick={() => setActiveMainTab("competitors")}
            aria-label="View Competitor Benchmarks"
            className={`px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === "competitors"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <BarChart3 size={16} />
            <span>Competitor Benchmarks</span>
          </button>
        </div>

        <div className="px-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600 font-bold uppercase tracking-wider hidden sm:flex items-center gap-2 shrink-0">
          <Users size={14} className="text-slate-400" />
          <span>Simulated Target: <strong className="text-slate-900 font-extrabold">{userScaleCount.toLocaleString()} riders/mo</strong></span>
        </div>
      </div>

      {/* SCALE SIMULATOR WITH QUICK PRESETS */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
              <Sliders size={18} />
            </div>
            <div>
              <span className="text-sm font-black uppercase tracking-tight text-slate-900 block">User Scale Simulator</span>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Adjust active riders volume to project microservice infrastructure expenses</p>
            </div>
          </div>

          {/* Quick Preset Buttons for Accessibility */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Quick Presets:</span>
            {[1000, 25000, 50000, 100000, 250000, 500000].map((preset) => (
              <button
                key={preset}
                onClick={() => setUserScaleCount(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  userScaleCount === preset
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {preset >= 1000 ? `${preset / 1000}k` : preset}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">1k</span>
          <input
            type="range"
            min={1000}
            max={500000}
            step={1000}
            value={userScaleCount}
            aria-label="User Scale Slider"
            onChange={(e) => setUserScaleCount(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">500k</span>
        </div>
      </div>

      {/* TAB 1: SERVICES CATALOG */}
      {activeMainTab === "catalog" && (
        <div className="space-y-6">
          
          {/* SEARCH & CATEGORY FILTERS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative shrink-0 w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search services or providers..."
                value={searchQuery}
                aria-label="Search Services"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* MASTER DETAIL LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT MASTER LIST (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="px-1 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Services ({filteredServices.length})</span>
                <span className="text-xs text-slate-400 font-normal">Click to view details</span>
              </div>

              <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1 no-scrollbar">
                {filteredServices.map((service) => {
                  const IconComp = service.icon;
                  const isSelected = selectedServiceId === service.id;
                  const isEnabled = serviceToggles[service.id] !== false;
                  const currentActiveProvId = activeProviders[service.id] || service.alternatives[0].id;
                  const activeAltObj = service.alternatives.find(a => a.id === currentActiveProvId) || service.alternatives[0];

                  const reqsAtScale = service.monthlyReqs50k * (userScaleCount / 50000);
                  const costAtScale = activeAltObj.baseFixedMonthlyCost + ((reqsAtScale / 1000) * activeAltObj.costPer1kReq);

                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-4 sm:p-4.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-50/90 border-slate-900 ring-2 ring-slate-900/10 shadow-xs"
                          : "bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs"
                      } ${!isEnabled ? "opacity-60 bg-slate-50/50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className={`p-3 rounded-xl shrink-0 transition-colors ${
                            isEnabled ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-600"
                          }`}>
                            <IconComp size={20} />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">{service.title}</h4>
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            </div>
                            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/60">
                                {activeAltObj.providerBadge || service.currentProviderBadge}
                              </span>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {service.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <button
                            onClick={(e) => handleToggleService(service.id, e)}
                            aria-label={isEnabled ? `Disable ${service.title}` : `Enable ${service.title}`}
                            title={isEnabled ? "Disable Service" : "Enable Service"}
                            className="cursor-pointer text-slate-700 hover:opacity-80 transition-opacity"
                          >
                            <div
                              className={`w-11 h-6 rounded-full transition-colors p-0.5 relative flex items-center ${
                                isEnabled ? "bg-amber-400" : "bg-slate-300"
                              }`}
                            >
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                                  isEnabled ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </div>
                          </button>

                          <span className="text-xs sm:text-sm font-black text-slate-900 font-mono">
                            {costAtScale === 0 ? "Free" : `$${costAtScale.toFixed(2)}/mo`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT DETAIL VIEW (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedService.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  {/* SERVICE HEADER & TOGGLE */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-slate-900 text-white rounded-xl shadow-xs shrink-0">
                          <selectedService.icon size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="font-black text-slate-900 text-base sm:text-lg uppercase tracking-tight">{selectedService.title}</h3>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60">
                              {selectedService.category}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                            {selectedService.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleService(selectedService.id)}
                        aria-label={serviceToggles[selectedService.id] !== false ? "Disable this service" : "Enable this service"}
                        className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer shrink-0 transition-all ${
                          serviceToggles[selectedService.id] !== false
                            ? "bg-amber-400 text-slate-950 hover:bg-amber-500 shadow-xs"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        }`}
                      >
                        {serviceToggles[selectedService.id] !== false ? "Enabled" : "Disabled"}
                      </button>
                    </div>

                    {/* CURRENT ACTIVE PROVIDER CARD */}
                    {(() => {
                      const currentActiveProvId = activeProviders[selectedService.id] || selectedService.alternatives[0].id;
                      const activeAltObj = selectedService.alternatives.find(a => a.id === currentActiveProvId) || selectedService.alternatives[0];
                      return (
                        <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-xl flex items-center justify-between gap-4">
                          <div>
                            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                              Active Selected Provider
                            </span>
                            <div className="flex items-center gap-2.5 mt-1">
                              <span className="text-base font-black text-slate-900">{activeAltObj.name}</span>
                              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-white text-slate-700 border border-slate-200/80 shadow-2xs">
                                {activeAltObj.providerBadge || selectedService.currentProviderBadge}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Health Status</span>
                            <span className="text-xs sm:text-sm font-bold text-emerald-700 flex items-center gap-1.5 mt-1">
                              <CheckCircle2 size={16} className="text-emerald-600" /> Operational
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* LIVE METRICS */}
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
                        Performance & Health Metrics
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Avg Latency</span>
                          <span className="text-base font-black text-slate-900 mt-1 block font-mono">{selectedService.latencyMs} ms</span>
                        </div>
                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Uptime SLA</span>
                          <span className="text-base font-black text-slate-900 mt-1 block font-mono">{selectedService.uptimePct}%</span>
                        </div>
                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Est. Reqs/mo</span>
                          <span className="text-base font-black text-slate-900 mt-1 block font-mono">
                            {(selectedService.monthlyReqs50k * (userScaleCount / 50000)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>
                        <div className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Error Rate</span>
                          <span className="text-base font-black text-slate-900 mt-1 block font-mono">{selectedService.errorRatePct}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PROVIDER COMPARISON LIST */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-slate-900 text-sm sm:text-base uppercase tracking-tight">Provider Options & Operating Costs</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">Select a provider to handle requests for this microservice.</p>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {userScaleCount.toLocaleString()} Riders Scale
                      </span>
                    </div>

                    <div className="space-y-4">
                      {selectedService.alternatives.map((alt) => {
                        const currentActiveProvId = activeProviders[selectedService.id] || selectedService.alternatives[0].id;
                        const isActive = currentActiveProvId === alt.id;

                        const reqsAtScale = selectedService.monthlyReqs50k * (userScaleCount / 50000);
                        const calculatedCost = alt.baseFixedMonthlyCost + ((reqsAtScale / 1000) * alt.costPer1kReq);

                        return (
                          <div
                            key={alt.id}
                            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                              isActive
                                ? "bg-slate-50/90 border-slate-900 ring-2 ring-slate-900/10 shadow-xs"
                                : "bg-white border-slate-200/80 hover:border-slate-300"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <h5 className="font-black text-slate-900 text-sm sm:text-base">{alt.name}</h5>
                                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/60">
                                    {alt.providerBadge}
                                  </span>
                                  {isActive && (
                                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-800">
                                      Active Choice
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                  <strong className="text-slate-800 font-extrabold">Free Quota:</strong> {alt.freeTierDesc}
                                </p>
                              </div>

                              <div className="flex items-center gap-4 shrink-0">
                                <div className="text-right">
                                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Projected Cost</span>
                                  <span className="text-sm sm:text-base font-black text-slate-900 block font-mono">
                                    {calculatedCost === 0 ? "Free" : `$${calculatedCost.toFixed(2)}/mo`}
                                  </span>
                                </div>

                                {!isActive ? (
                                  <button
                                    onClick={() => handleSelectProvider(selectedService.id, alt.id, alt.name)}
                                    aria-label={`Select provider ${alt.name}`}
                                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-2xs"
                                  >
                                    Use Provider
                                  </button>
                                ) : (
                                  <div className="px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5">
                                    <Check size={16} /> Selected
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* CAPABILITIES & TRADE-OFFS */}
                            <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                              <div>
                                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Capabilities</span>
                                <ul className="space-y-1.5 text-slate-600">
                                  {alt.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                                      <span>{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Key Highlights</span>
                                <div className="space-y-1.5">
                                  {alt.pros.map((pro, idx) => (
                                    <div key={idx} className="text-emerald-700 text-xs sm:text-sm font-medium flex items-center gap-1.5">
                                      <Check size={14} className="shrink-0 text-emerald-600" />
                                      <span>{pro}</span>
                                    </div>
                                  ))}
                                  {alt.cons.map((con, idx) => (
                                    <div key={idx} className="text-slate-500 text-xs sm:text-sm flex items-center gap-1.5">
                                      <Info size={14} className="shrink-0 text-slate-400" />
                                      <span>{con}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPETITOR BENCHMARKS */}
      {activeMainTab === "competitors" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <h2 className="font-black text-slate-900 text-base sm:text-lg uppercase tracking-tight">Competitor Tech Stacks & Estimated Monthly Cost</h2>
                      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPETITOR_BENCHMARKS.map((comp) => (
              <div
                key={comp.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div>
                      <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">{comp.name}</h3>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mt-0.5">{comp.type}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/60 shrink-0">
                      {comp.badge}
                    </span>
                  </div>

                  {/* TECH STACK */}
                  <div className="my-4 space-y-2 text-xs sm:text-sm">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Architecture & Providers</span>
                    <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 space-y-2 text-slate-600">
                      <div className="flex justify-between gap-2 text-xs sm:text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Maps</span>
                        <span className="font-bold text-slate-900 text-right">{comp.techStack.mapping}</span>
                      </div>
                      <div className="flex justify-between gap-2 text-xs sm:text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Routing</span>
                        <span className="font-bold text-slate-900 text-right">{comp.techStack.routing}</span>
                      </div>
                      <div className="flex justify-between gap-2 text-xs sm:text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Database</span>
                        <span className="font-bold text-slate-900 text-right">{comp.techStack.database}</span>
                      </div>
                      <div className="flex justify-between gap-2 text-xs sm:text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Messaging</span>
                        <span className="font-bold text-slate-900 text-right">{comp.techStack.messaging}</span>
                      </div>
                      <div className="flex justify-between gap-2 text-xs sm:text-sm">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Payments</span>
                        <span className="font-bold text-slate-900 text-right">{comp.techStack.payments}</span>
                      </div>
                    </div>
                  </div>

                  {/* COST BREAKDOWN */}
                  <div className="space-y-2 text-xs sm:text-sm">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Monthly Expense Breakdown (50k Users)</span>
                    {comp.costBreakdown.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50/70 rounded-xl text-xs sm:text-sm">
                        <span className="text-slate-600 font-semibold truncate pr-2">{item.item}</span>
                        <span className="font-black text-slate-900 shrink-0 font-mono">
                          {item.costUSD === 0 ? "Free" : `$${item.costUSD.toLocaleString()}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TOTAL COST & RATING */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="p-3.5 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Est. Total Monthly Spend</span>
                    <span className="text-base font-black font-mono">
                      {comp.estMonthlyCost50kUSD === 0 ? "$0 / mo" : `$${comp.estMonthlyCost50kUSD.toLocaleString()} / mo`}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed italic border border-slate-100">
                    "{comp.keyTakeaway}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
