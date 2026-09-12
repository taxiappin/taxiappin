import React, { useState } from 'react';
import { 
  GitBranch, Code, Server, Smartphone, Database, Search, Filter, 
  ExternalLink, Copy, Check, ChevronRight, Layers, FileCode, Cpu, 
  Zap, ArrowRight, ShieldCheck, MapPin, Navigation, UserCheck, 
  Radio, Lock, Globe, MessageSquare, IndianRupee, Bell, AlertTriangle,
  CheckCircle2, Info, Eye, Sparkles, Sliders, Play, RefreshCw, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export interface AppFlowItem {
  id: string;
  title: string;
  category: 'auth' | 'rider' | 'driver' | 'realtime' | 'seo' | 'admin';
  categoryLabel: string;
  brief: string;
  icon: any;
  badge: string;
  badgeColor: string;
  frontendPath: string;
  frontendMainFuncs: string[];
  backendPath: string;
  backendEndpoints: string[];
  dbTables: string[];
  syncMethod: string;
  steps: { title: string; desc: string; codeSnippet?: string }[];
  payloadExample?: string;
  mockupBg: string;
  mockupTitle: string;
  mockupItems: string[];
}

export const APP_FLOWS_DATA: AppFlowItem[] = [
  {
    id: 'flow_auth',
    title: 'User Registration, Login & Role Session',
    category: 'auth',
    categoryLabel: 'Auth & Onboarding',
    brief: 'Handles mobile OTP & password authentication, user role switching (Rider vs Driver), session persistence, and socket client pairing.',
    icon: Lock,
    badge: 'CORE AUTH',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    frontendPath: '/src/components/LoginPage.tsx & /src/App.tsx',
    frontendMainFuncs: ['loginUser()', 'sendOtp()', 'verifyOtp()', 'switchRole()', 'useAuth()'],
    backendPath: '/backend/src/routes/auth.routes.ts & /backend/src/controllers/auth.controller.ts',
    backendEndpoints: ['POST /api/auth/send-otp', 'POST /api/auth/verify-otp', 'POST /api/auth/login', 'GET /api/auth/me'],
    dbTables: ['users (id, phone, role, verification_status, wallet_balance)'],
    syncMethod: 'REST API + JWT Auth Token in LocalStorage + Socket Authenticate Handshake',
    steps: [
      {
        title: '1. User Input & Method Selection',
        desc: 'Rider or driver enters 10-digit mobile number or email credentials on the responsive login page (/login).',
        codeSnippet: `const handleSendOtp = async () => {\n  const res = await fetch('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) });\n  const data = await res.json();\n  setOtpSent(true);\n};`
      },
      {
        title: '2. Backend OTP Generation & Rate Limit',
        desc: 'Express controller validates phone format, generates a secure 4-digit OTP, saves token with 5-minute expiry, and triggers SMS gateway service.',
        codeSnippet: `// backend/src/controllers/auth.controller.ts\nexport const sendOtp = async (req: Request, res: Response) => {\n  const { phone } = req.body;\n  const otp = Math.floor(1000 + Math.random() * 9000).toString();\n  await db.query('INSERT INTO otps (phone, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL 5 MINUTE)', [phone, otp]);\n  return res.json({ status: 'ok', message: 'OTP dispatched' });\n};`
      },
      {
        title: '3. Token Verification & Session Init',
        desc: 'Upon entering valid OTP, server generates JWT session token and user profile record. Client saves token and pairs Socket.io instance.',
        codeSnippet: `localStorage.setItem('taxiapp_user', JSON.stringify(userData));\nsocket.emit('authenticate', { userId: userData.id, role: userData.role });`
      }
    ],
    payloadExample: `{\n  "status": "success",\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n  "user": {\n    "id": "USR981240",\n    "name": "Alex Mercer",\n    "phone": "+91 9876543210",\n    "role": "rider",\n    "walletBalance": 450\n  }\n}`,
    mockupBg: 'from-indigo-600 to-blue-700',
    mockupTitle: 'Login & Verification Screen',
    mockupItems: ['Phone / Email Input Box', 'Role Switcher Pill (Rider / Driver)', '4-Digit OTP Entry Dialog', 'Remember Me & Privacy Terms']
  },
  {
    id: 'flow_cab_search',
    title: 'Rider Fare Calculation & Location Search',
    category: 'rider',
    categoryLabel: 'Rider Experience',
    brief: 'Enables riders to choose pickup and drop points via map pin or reverse geocoding, calculating upfront fares across multiple vehicle tiers.',
    icon: Navigation,
    badge: 'FARE ENGINE',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    frontendPath: '/src/App.tsx, /src/lib/fareCalculator.ts & LocationPickerModal.tsx',
    frontendMainFuncs: ['af()' /* Reverse Geocode */, 'calculateDistance()', 'calculateFare()', 'setPickupCoords()'],
    backendPath: '/backend/src/controllers/trip.controller.ts & /backend/src/routes/trip.routes.ts',
    backendEndpoints: ['POST /api/trips/estimate-fare', 'GET /api/config/pricing'],
    dbTables: ['price_settings (base_fare, per_km, surge_multiplier, category)'],
    syncMethod: 'Haversine Geographic Math + Dynamic Pricing Rules Config Context',
    steps: [
      {
        title: '1. Reverse Geocoding & Address Lookup',
        desc: 'User moves Leaflet map marker or types address; af() calls OpenStreetMap Nominatim reverse geocoding API to extract street & city name.',
        codeSnippet: `const address = await reverseGeocode(lat, lng);\nsetPickupAddress(address.display_name);`
      },
      {
        title: '2. Distance Calculation & Vehicle Tiers',
        desc: 'Haversine formula calculates exact route distance in kilometers. Fare engine applies base fare, per-km rate, surge factor, and promo discounts.',
        codeSnippet: `const distKm = calculateDistance(pickup[0], pickup[1], drop[0], drop[1]);\nconst fare = Math.round(baseFare + (distKm * ratePerKm) * surgeMultiplier);`
      }
    ],
    payloadExample: `{\n  "pickup": "Hitech City, Hyderabad",\n  "drop": "Rajiv Gandhi Intl Airport",\n  "distanceKm": 32.4,\n  "estimates": [\n    { "type": "AUTO", "fare": 380, "etaMins": 4 },\n    { "type": "CAR", "fare": 550, "etaMins": 3 },\n    { "type": "XL", "fare": 820, "etaMins": 6 }\n  ]\n}`,
    mockupBg: 'from-amber-500 to-orange-600',
    mockupTitle: 'Pickup Selection & Fare Comparison',
    mockupItems: ['Leaflet Map Pin Drag Handle', 'Pickup & Drop Address Search Bars', 'Vehicle Category Selector Pills', 'Upfront Fare & ETA Summary']
  },
  {
    id: 'flow_dispatch',
    title: 'Instant Driver Matching & Dispatch Engine',
    category: 'realtime',
    categoryLabel: 'Real-time Dispatch',
    brief: 'Broadcasts new ride requests to online drivers within radius, displaying accept timer modals and notifying riders instantly upon driver acceptance.',
    icon: Radio,
    badge: 'WEBSOCKET DISPATCH',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    frontendPath: '/src/App.tsx & /src/components/BackendAdmin.tsx',
    frontendMainFuncs: ['socket.emit("get_nearby_drivers")', 'socket.on("ride_request")', 'handleAcceptTrip()'],
    backendPath: '/backend/app.ts & /backend/src/services/socket.service.ts',
    backendEndpoints: ['POST /api/trips', 'POST /api/trips/:id/accept', 'WebSocket Event: ride_request'],
    dbTables: ['trips (id, rider_id, driver_id, status, fare, pickup_coords, drop_coords)'],
    syncMethod: 'Socket.io Bidirectional Room Broadcasts + REST Backing Record',
    steps: [
      {
        title: '1. Booking Request Creation',
        desc: 'Rider confirms booking; frontend posts new trip to POST /api/trips with status "REQUESTED". Server broadcasts event over Socket.io.',
        codeSnippet: `const res = await fetch('/api/trips', { method: 'POST', body: JSON.stringify(tripData) });\nsocket.emit('new_ride_created', tripData);`
      },
      {
        title: '2. Driver Proximity Filter & Popup',
        desc: 'Backend filters active drivers within configured matching radius (e.g., 5km). Dispatches "ride_request" with a 30-second countdown.',
        codeSnippet: `// Socket Server\nio.to(\`driver_\${driverId}\`).emit('ride_request', { tripId, pickup, drop, fare, timer: 30 });`
      },
      {
        title: '3. Acceptance & Lock',
        desc: 'First driver to tap Accept claims trip via POST /api/trips/:id/accept. Server updates trip status to "ACCEPTED" and alerts rider.',
        codeSnippet: `socket.emit('trip_accepted', { tripId, driverId });\nsetTripStatus('ACCEPTED');`
      }
    ],
    payloadExample: `{\n  "event": "ride_request",\n  "tripId": "TRP908123",\n  "pickupAddress": "Madhapur Main Rd",\n  "dropAddress": "Secunderabad Station",\n  "fare": 320,\n  "passengerName": "Siddharth V.",\n  "passengerRating": "4.9"\n}`,
    mockupBg: 'from-rose-600 to-pink-700',
    mockupTitle: 'Driver Match Radar & Incoming Modal',
    mockupItems: ['Searching Radar Pulse Animation', 'Incoming Ride Request Modal on Driver Phone', '30-Sec Accept/Decline Ring Timer', 'Rider Confirmation Banner']
  },
  {
    id: 'flow_driver_kyc',
    title: 'Driver Onboarding, Vehicle Registry & KYC Verification',
    category: 'driver',
    categoryLabel: 'Driver Operations',
    brief: 'Manages driver profile setup, vehicle plate details, document upload (License, RC), and admin verification desk approval matrix.',
    icon: UserCheck,
    badge: 'KYC REGISTRY',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    frontendPath: '/src/components/LoginPage.tsx & BackendAdmin.tsx (Driver Fleet)',
    frontendMainFuncs: ['registerDriver()', 'uploadKyc()', 'approveDriverKyc()', 'toggleOnlineStatus()'],
    backendPath: '/backend/src/controllers/admin.controller.ts & /backend/src/routes/admin.routes.ts',
    backendEndpoints: ['POST /api/driver/kyc', 'PATCH /api/admin/drivers/:id/kyc', 'GET /api/admin/drivers'],
    dbTables: ['drivers (id, name, vehicle_plate, vehicle_type, kyc_status, documents)'],
    syncMethod: 'REST API Data Persistence + Admin Operations Approval Push',
    steps: [
      {
        title: '1. Driver Registration & Vehicle Entry',
        desc: 'Driver fills in full name, phone number, vehicle type (Auto, Sedan, Bike), vehicle model, color, and license plate number.',
        codeSnippet: `const payload = { userId, vehicleType: 'CAR', plate: 'TS 09 EA 4321', licenseNo: 'DL-14201988' };\nawait fetch('/api/driver/register', { method: 'POST', body: JSON.stringify(payload) });`
      },
      {
        title: '2. Admin KYC Approval Desk',
        desc: 'Admin inspects driver credentials in Backend Operations Panel and clicks "APPROVE KYC", enabling driver to switch online.',
        codeSnippet: `await fetch(\`/api/admin/drivers/\${driverId}/kyc\`, {\n  method: 'PATCH',\n  body: JSON.stringify({ status: 'APPROVED' })\n});`
      }
    ],
    payloadExample: `{\n  "driverId": "DRV772109",\n  "name": "Vikram Sharma",\n  "vehiclePlate": "TS 09 EA 4321",\n  "vehicleType": "CAR",\n  "kycStatus": "APPROVED",\n  "isOnline": true\n}`,
    mockupBg: 'from-purple-600 to-indigo-800',
    mockupTitle: 'Driver Onboarding & Document Upload',
    mockupItems: ['Vehicle Model & License Plate Inputs', 'DL & Vehicle RC Document Drag-and-Drop', 'Admin KYC Approval Status Badge', 'Go Online / Offline Master Toggle']
  },
  {
    id: 'flow_navigation_otp',
    title: 'Live Ride Tracking, OTP Verification & Trip Finish',
    category: 'realtime',
    categoryLabel: 'Real-time Navigation',
    brief: 'Streams driver arrival coordinates, verifies passenger 4-digit pickup OTP, renders route trajectory polyline, and completes trip upon arrival.',
    icon: MapPin,
    badge: 'LIVE GPS TRACKING',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    frontendPath: '/src/App.tsx, TrackTripView.tsx & Leaflet Polyline component',
    frontendMainFuncs: ['verifyOtp()', 'updateDriverLocation()', 'completeTrip()', 'renderRoutePolyline()'],
    backendPath: '/backend/src/controllers/trip.controller.ts & /backend/app.ts',
    backendEndpoints: ['POST /api/trips/:id/verify-otp', 'PATCH /api/trips/:id', 'WebSocket Event: driver_location_update'],
    dbTables: ['trips (status, subStatus, otp, started_at, completed_at, live_coords)'],
    syncMethod: 'Socket.io Coordinate Telemetry Streaming + Leaflet Animated Marker',
    steps: [
      {
        title: '1. Pickup Point Arrival & OTP Verification',
        desc: 'Driver arrives at pickup; rider shares 4-digit OTP. Driver enters OTP; backend verifies token and sets subStatus to "STARTED".',
        codeSnippet: `const res = await fetch(\`/api/trips/\${tripId}/verify-otp\`, {\n  method: 'POST',\n  body: JSON.stringify({ otp: enteredOtp })\n});`
      },
      {
        title: '2. Live Trajectory & Route Rendering',
        desc: 'Map renders colorful route polyline between pickup and drop. Socket streams driver GPS position every 1.5 seconds with smooth interpolation.',
        codeSnippet: `socket.on('driver_location_update', (coords) => {\n  setDriverCoords(coords);\n  mapRef.current?.panTo(coords);\n});`
      },
      {
        title: '3. Destination Reached & Finish Trip',
        desc: 'Upon reaching destination, driver clicks "FINISH TRIP". Backend updates status to "COMPLETED" and generates final fare invoice.',
        codeSnippet: `await fetch(\`/api/trips/\${tripId}\`, {\n  method: 'PATCH',\n  body: JSON.stringify({ status: 'COMPLETED' })\n});`
      }
    ],
    payloadExample: `{\n  "tripId": "TRP908123",\n  "status": "COMPLETED",\n  "otpVerified": true,\n  "startedAt": "2026-08-11T05:10:00Z",\n  "completedAt": "2026-08-11T05:32:00Z",\n  "finalFare": 320\n}`,
    mockupBg: 'from-teal-600 to-emerald-700',
    mockupTitle: 'Live Navigation & OTP Input',
    mockupItems: ['Driver Arrival ETA Card', '4-Digit Passenger Pickup OTP Dialog', 'Live Route Polyline on Leaflet Map', 'FINISH TRIP Action Bar']
  },
  {
    id: 'flow_chat',
    title: 'In-App Live Messaging & Quick Chips',
    category: 'realtime',
    categoryLabel: 'Real-time Chat',
    brief: 'Provides instant encrypted messaging between rider and driver during an active trip, complete with audio chime notifications.',
    icon: MessageSquare,
    badge: 'WEBSOCKET CHAT',
    badgeColor: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    frontendPath: '/src/App.tsx (Chat Tray Component) & BackendAdmin.tsx (Chat Audits)',
    frontendMainFuncs: ['sendMessage()', 'socket.on("receive_message")', 'loadTripMessages()'],
    backendPath: '/backend/app.ts (Socket handler: send_message)',
    backendEndpoints: ['GET /api/trips/:id/messages', 'WebSocket Event: send_message'],
    dbTables: ['trip_messages (id, trip_id, sender_id, text, timestamp)'],
    syncMethod: 'Socket.io Trip Room Relay + In-Memory & DB Message Log',
    steps: [
      {
        title: '1. Chat Tray Open & Message Send',
        desc: 'User opens chat overlay on active ride view, taps quick reply chip ("I am at main gate") or types custom text.',
        codeSnippet: `socket.emit('send_message', { tripId, senderId: user.id, text: messageText });`
      },
      {
        title: '2. Socket Broadcast & Audio Alert',
        desc: 'Socket server relays message to recipient room trip_{tripId}. Recipient UI appends message bubble and plays notification audio.',
        codeSnippet: `socket.on('receive_message', (msg) => {\n  setMessages(prev => [...prev, msg]);\n  playNotificationChime();\n});`
      }
    ],
    payloadExample: `{\n  "event": "receive_message",\n  "tripId": "TRP908123",\n  "senderRole": "rider",\n  "text": "I am standing near the landmark building in white shirt.",\n  "timestamp": "10:42 AM"\n}`,
    mockupBg: 'from-cyan-600 to-blue-700',
    mockupTitle: 'Rider-Driver In-App Chat Tray',
    mockupItems: ['Preset Quick Reply Chips', 'Rider & Driver Message Bubbles', 'Unread Message Badge Count', 'Audio Notification Chime Sound']
  },
  {
    id: 'flow_billing',
    title: 'Fare Invoice, Wallet Settlements & Admin Commission',
    category: 'driver',
    categoryLabel: 'Wallet & Billing',
    brief: 'Calculates passenger invoice, processes Cash/UPI/Wallet payments, auto-deducts platform commission (10%), and credits driver earnings balance.',
    icon: IndianRupee,
    badge: 'FINANCIAL ENGINE',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    frontendPath: '/src/components/DriverEarningsPage.tsx & /src/App.tsx',
    frontendMainFuncs: ['processPayment()', 'topupWallet()', 'fetchDriverEarnings()', 'withdrawFunds()'],
    backendPath: '/backend/src/controllers/trip.controller.ts & admin.controller.ts',
    backendEndpoints: ['POST /api/trips/:id/pay', 'POST /api/wallet/topup', 'GET /api/driver/earnings'],
    dbTables: ['wallet_transactions, drivers (wallet_balance), admin_revenue'],
    syncMethod: 'REST API Transaction Writes + DB Double-Entry Accounting Log',
    steps: [
      {
        title: '1. Trip Completion & Fare Invoice',
        desc: 'System presents itemized fare receipt showing Base Fare, Distance Charge, Surge, Promo Discount, and Final Amount.',
        codeSnippet: `const invoice = { fare: 320, commission: 32, netDriverEarnings: 288 };`
      },
      {
        title: '2. Payment Processing & Wallet Credit',
        desc: 'Passenger pays via Cash or Digital Wallet. Server auto-credits driver balance with net fare (Fare minus 10% admin fee).',
        codeSnippet: `await db.query('UPDATE drivers SET wallet_balance = wallet_balance + $1 WHERE id = $2', [netEarnings, driverId]);`
      }
    ],
    payloadExample: `{\n  "tripId": "TRP908123",\n  "totalFare": 320,\n  "adminCommission": 32,\n  "driverCredited": 288,\n  "paymentMethod": "CASH",\n  "status": "PAID"\n}`,
    mockupBg: 'from-emerald-600 to-green-800',
    mockupTitle: 'Passenger Invoice & Driver Earnings Sheet',
    mockupItems: ['Itemized Fare Receipt Breakdown', 'Cash / Digital Wallet Payment Switch', 'Driver Net Daily Earnings Graph', 'Payout Withdrawal Request Button']
  },
  {
    id: 'flow_admin_ops',
    title: 'Admin Operations Panel & Pricing Rules Engine',
    category: 'admin',
    categoryLabel: 'Admin Control Room',
    brief: 'Provides master control room for platform management: active trips live map, pricing rule customization, coupon management, and global config.',
    icon: Sliders,
    badge: 'ADMIN DASHBOARD',
    badgeColor: 'bg-slate-700/10 text-slate-800 border-slate-400/20',
    frontendPath: '/src/components/BackendAdmin.tsx & ConfigContext.tsx',
    frontendMainFuncs: ['updateConfig()', 'fetchAdminStats()', 'manageDrivers()', 'managePricing()'],
    backendPath: '/backend/src/controllers/admin.controller.ts & /backend/app.ts',
    backendEndpoints: ['POST /api/admin/config', 'GET /api/admin/stats', 'GET /api/admin/trips'],
    dbTables: ['config.json / app_settings'],
    syncMethod: 'REST API Admin Saves + Socket Event "config_updated" Push',
    steps: [
      {
        title: '1. Admin Login & Master Telemetry',
        desc: 'Admin logs into /backend dashboard to view live platform KPIs: active trips, online drivers, total revenue, and active alerts.',
        codeSnippet: `const stats = await fetch('/api/admin/stats').then(r => r.json());\nsetPlatformMetrics(stats);`
      },
      {
        title: '2. Dynamic Price Rule Modification',
        desc: 'Admin adjusts base fare or surge rates in Price Control Center. Tapping "Save" updates config store and pushes event to connected apps.',
        codeSnippet: `updateConfig({ priceSettings: { baseFare: 50, perKm: 14, surge: 1.2 } });\nsocket.emit('config_updated', updatedConfig);`
      }
    ],
    payloadExample: `{\n  "activeTrips": 18,\n  "onlineDrivers": 42,\n  "todayRevenue": "₹14,850",\n  "activeSurgeMultiplier": 1.25\n}`,
    mockupBg: 'from-slate-900 to-slate-800',
    mockupTitle: 'Admin Master Operations Center',
    mockupItems: ['Live Fleet & Active Trip Map', 'Dynamic Base Fare & Surge Sliders', 'Driver Approval & Suspension Grid', 'Global Platform Modes Control']
  },
  {
    id: 'flow_seo_sitemap',
    title: 'SEO Dashboard, Meta Directives & Google Sitelinks',
    category: 'seo',
    categoryLabel: 'SEO & Performance',
    brief: 'Controls search engine indexing, OpenGraph preview metadata, Google SERP Sitelinks configuration, and dynamic XML sitemap generation.',
    icon: FileCode,
    badge: 'SEO ENGINE',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    frontendPath: '/src/components/SeoDashboardView.tsx & /index.html',
    frontendMainFuncs: ['handleGenerateAiMeta()', 'handleTestUrlIndexability()', 'saveSeoConfig()'],
    backendPath: '/backend/app.ts (Route: /sitemap.xml)',
    backendEndpoints: ['GET /sitemap.xml', 'GET /robots.txt', 'POST /api/seo/save'],
    dbTables: ['config.json (seo)'],
    syncMethod: 'Server-Side Sitemap Endpoint + Frontend Document Head Injections',
    steps: [
      {
        title: '1. Meta Tags & OpenGraph Configuration',
        desc: 'Admin sets site title, meta description, and keywords in SEO Dashboard, or uses AI Generate Meta Tags button.',
        codeSnippet: `document.title = config.seo.siteTitle;\ndocument.querySelector('meta[name="description"]').setAttribute('content', config.seo.metaDescription);`
      },
      {
        title: '2. Dynamic Sitemap XML Serving',
        desc: 'Googlebot requests /sitemap.xml; server returns well-formed XML sitemap listing active app routes.',
        codeSnippet: `app.get('/sitemap.xml', (req, res) => {\n  res.header('Content-Type', 'application/xml');\n  res.send(\`<?xml version="1.0"?><urlset>...</urlset>\`);\n});`
      }
    ],
    payloadExample: `{\n  "siteTitle": "TaxiApp - #1 Instant Cab Booking & Airport Transfers",\n  "sitemapUrl": "https://taxiapp.com/sitemap.xml",\n  "googleSitelinks": [\n    { "title": "Create new account", "url": "/signup" },\n    { "title": "Video & How It Works", "url": "/safety" }\n  ]\n}`,
    mockupBg: 'from-blue-600 to-indigo-800',
    mockupTitle: 'SEO & Google SERP Sitelinks Dashboard',
    mockupItems: ['Google Search Result Preview Card', 'Meta Title & Keyword Form Fields', 'JSON-LD Structured Data Viewer', 'IndexNow Ping & Sitemap Status']
  },
  {
    id: 'flow_push_promotions',
    title: 'Push Notifications, Marquees & Promo Campaigns',
    category: 'seo',
    categoryLabel: 'Promotions',
    brief: 'Allows admins to broadcast push notifications, scrolling top marquee tickers, banner ads, and referral promo codes to user segments.',
    icon: Bell,
    badge: 'CAMPAIGN DESK',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    frontendPath: '/src/components/BackendAdmin.tsx (Promotions) & /src/App.tsx',
    frontendMainFuncs: ['sendPushNotification()', 'createMarquee()', 'applyPromoCoupon()'],
    backendPath: '/backend/src/routes/push.routes.ts & /backend/app.ts',
    backendEndpoints: ['POST /api/push/send', 'GET /api/marquees', 'POST /api/coupons/apply'],
    dbTables: ['push_campaigns, marquees, promo_coupons'],
    syncMethod: 'Web Push Protocol + Socket.io Marquee Broadcasts',
    steps: [
      {
        title: '1. Campaign Creation & Audience Target',
        desc: 'Admin creates a push notification or top marquee ticker, selecting audience (Riders, Drivers, or All Users).',
        codeSnippet: `await fetch('/api/push/send', {\n  method: 'POST',\n  body: JSON.stringify({ title: '50% Off Airport Rides!', target: 'rider' })\n});`
      },
      {
        title: '2. Client Notification Display',
        desc: 'Target client devices receive notification banner and top scrolling marquee updates on home screen.',
        codeSnippet: `socket.on('marquee_update', (newMarquee) => {\n  setMarquees(prev => [...prev, newMarquee]);\n});`
      }
    ],
    payloadExample: `{\n  "title": "Flat ₹100 Off Your First Airport Ride!",\n  "couponCode": "AIRPORT100",\n  "targetAudience": "rider",\n  "deliveredCount": 1420\n}`,
    mockupBg: 'from-rose-500 to-red-700',
    mockupTitle: 'Push Campaign & Top Marquee Creator',
    mockupItems: ['Push Notification Message Editor', 'Audience Segment Selector (Riders / Drivers)', 'Top Marquee Yellow Ticker Banner', 'Promo Coupon Discount Code Generator']
  },
  {
    id: 'flow_sos_emergency',
    title: 'Emergency SOS Safety Trigger & Live Alert Monitor',
    category: 'admin',
    categoryLabel: 'Safety & SOS',
    brief: '24/7 high-priority distress system allowing riders and drivers to trigger 1-tap SOS alerts, broadcasting live GPS coordinates to admin dispatch.',
    icon: AlertTriangle,
    badge: 'SAFETY CRITICAL',
    badgeColor: 'bg-red-500/10 text-red-600 border-red-500/20',
    frontendPath: '/src/App.tsx (SOS Button) & BackendAdmin.tsx (Alerts Desk)',
    frontendMainFuncs: ['triggerSosAlert()', 'resolveSosAlert()', 'socket.emit("sos_trigger")'],
    backendPath: '/backend/app.ts (Socket event: sos_trigger) & admin.controller.ts',
    backendEndpoints: ['POST /api/trips/:id/sos', 'PATCH /api/admin/sos/:id/resolve'],
    dbTables: ['sos_alerts (id, trip_id, user_id, coords, status, triggered_at)'],
    syncMethod: 'High-Priority WebSocket Event + Admin Panel Sound Alarm',
    steps: [
      {
        title: '1. Emergency SOS Trigger',
        desc: 'Passenger or driver taps red SOS Emergency button during an active ride. App grabs current GPS position and posts alert.',
        codeSnippet: `socket.emit('sos_trigger', { tripId, userCoords, userId, role: user.role });`
      },
      {
        title: '2. Admin Dispatch Desk Alarm',
        desc: 'Backend creates urgent alert record and triggers audible chime sound in Admin Operations Center map desk for immediate intervention.',
        codeSnippet: `io.to('admin_room').emit('sos_alert', alertPayload);\nplayEmergencyAlarmSound();`
      }
    ],
    payloadExample: `{\n  "alertId": "SOS99812",\n  "tripId": "TRP908123",\n  "triggeredBy": "passenger",\n  "passengerPhone": "+91 9876543210",\n  "liveCoords": [17.4435, 78.3772],\n  "status": "ACTIVE_DISPATCH"\n}`,
    mockupBg: 'from-red-700 to-rose-950',
    mockupTitle: 'SOS Emergency Button & Admin Response Center',
    mockupItems: ['Red Pulsing SOS Button on Live Ride Screen', 'Emergency Contact Auto-SMS Dispatch', 'Admin Operations Desk Loud Alarm Card', 'Live GPS Pin Location Tracker']
  }
];

export const FlowsDashboardView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFlow, setSelectedFlow] = useState<AppFlowItem | null>(APP_FLOWS_DATA[0]);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'overview' | 'frontend' | 'backend' | 'sync' | 'mockup'>('overview');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const filteredFlows = APP_FLOWS_DATA.filter((flow) => {
    const matchesCategory = selectedCategory === 'all' || flow.category === selectedCategory;
    const matchesSearch = 
      flow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.brief.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.frontendPath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.backendPath.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <GitBranch className="text-amber-500" size={26} />
          <span>Application Flows & Code Directory Map</span>
        </h1>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Flows (12)' },
            { id: 'auth', label: 'Auth & Roles' },
            { id: 'rider', label: 'Rider Flow' },
            { id: 'driver', label: 'Driver Ops' },
            { id: 'realtime', label: 'Real-time & Telemetry' },
            { id: 'seo', label: 'SEO & Web' },
            { id: 'admin', label: 'Admin & Safety' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                selectedCategory === cat.id
                  ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search function, component or route..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Main Grid: Left Flow Directory List, Right Interactive Flow Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Directory List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-amber-500" />
              <span>Select Application Flow ({filteredFlows.length})</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-bold">Click to inspect</span>
          </div>

          <div className="space-y-2.5 max-h-[820px] overflow-y-auto pr-1">
            {filteredFlows.map((flow) => {
              const IconComp = flow.icon;
              const isSelected = selectedFlow?.id === flow.id;
              return (
                <div
                  key={flow.id}
                  onClick={() => setSelectedFlow(flow)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer relative group",
                    isSelected
                      ? "bg-amber-50/90 text-slate-900 border-amber-400 shadow-xs ring-2 ring-amber-400/30"
                      : "bg-white text-slate-900 border-slate-200 hover:border-slate-300 hover:shadow-xs"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold transition-all",
                        isSelected ? "bg-amber-400 text-slate-950" : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
                      )}>
                        <IconComp size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold leading-tight text-slate-900">
                          {flow.title}
                        </h3>
                        <span className="text-[10px] font-medium block mt-0.5 text-slate-500">
                          {flow.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border shrink-0", flow.badgeColor)}>
                      {flow.badge}
                    </span>
                  </div>

                  <p className="text-[11px] leading-relaxed mt-2.5 line-clamp-2 text-slate-600">
                    {flow.brief}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                    <span className={cn("truncate max-w-[200px]", isSelected ? "text-amber-800 font-bold" : "text-slate-500")}>
                      {flow.frontendPath.split('&')[0]}
                    </span>
                    <span className={cn("flex items-center gap-1 font-bold", isSelected ? "text-amber-700" : "text-slate-700")}>
                      Inspect <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive Code & Logic Inspector (7 cols) */}
        <div className="lg:col-span-7">
          {selectedFlow ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden sticky top-6 space-y-0">
              {/* Flow Inspector Header - Clean Light Theme */}
              <div className="p-6 bg-slate-50/80 border-b border-slate-200 text-slate-900 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shadow-2xs">
                      {React.createElement(selectedFlow.icon, { size: 20 })}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-700 tracking-wider">
                        {selectedFlow.categoryLabel}
                      </span>
                      <h2 className="text-lg font-black text-slate-900 leading-tight">
                        {selectedFlow.title}
                      </h2>
                    </div>
                  </div>

                  <span className={cn("px-3 py-1 rounded-full text-xs font-mono font-bold border", selectedFlow.badgeColor)}>
                    {selectedFlow.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedFlow.brief}
                </p>

                {/* Sub Tab Buttons inside Inspector - Light Mode */}
                <div className="flex items-center gap-1.5 bg-white p-2 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto shadow-sm">
                  {[
                    { id: 'overview', label: '1. Procedure & Logic', icon: GitBranch },
                    { id: 'frontend', label: '2. Frontend Code', icon: Smartphone },
                    { id: 'backend', label: '3. Backend Code', icon: Server },
                    { id: 'sync', label: '4. Sync & DB Payload', icon: Database },
                    { id: 'mockup', label: '5. Screenshot Mockup', icon: Eye }
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeInspectorTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveInspectorTab(tab.id as any)}
                        className={cn(
                          "py-2 px-3.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer",
                          isActive
                            ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        )}
                      >
                        <TabIcon size={16} className={isActive ? "text-slate-950" : "text-amber-500"} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inspector Content Body */}
              <div className="p-6 space-y-6">
                {/* TAB 1: OVERVIEW & STEPS */}
                {activeInspectorTab === 'overview' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Zap size={16} className="text-amber-500" />
                      <span>Step-by-Step Execution Logic</span>
                    </h3>

                    <div className="space-y-4">
                      {selectedFlow.steps.map((step, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-mono text-[10px] font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span>{step.title}</span>
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed pl-7">
                            {step.desc}
                          </p>

                          {step.codeSnippet && (
                            <div className="pl-7 pt-1">
                              <pre className="p-3 bg-amber-50/80 text-slate-900 text-[11px] font-mono rounded-lg overflow-x-auto leading-relaxed border border-amber-200 font-medium">
                                {step.codeSnippet}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: FRONTEND CODE MAP */}
                {activeInspectorTab === 'frontend' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Smartphone size={16} className="text-blue-600" />
                          <span>Frontend File Path</span>
                        </span>
                        <button
                          onClick={() => copyToClipboard(selectedFlow.frontendPath)}
                          className="text-[10px] font-mono font-bold text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <Copy size={12} /> Copy Path
                        </button>
                      </div>
                      <code className="block p-3 bg-white border border-slate-200 rounded-lg font-mono text-xs text-slate-900 font-bold">
                        {selectedFlow.frontendPath}
                      </code>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Key Functions & Hooks</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedFlow.frontendMainFuncs.map((fn, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-xs font-mono font-bold">
                            {fn}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: BACKEND CODE MAP */}
                {activeInspectorTab === 'backend' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Server size={16} className="text-emerald-600" />
                          <span>Backend File Path</span>
                        </span>
                        <button
                          onClick={() => copyToClipboard(selectedFlow.backendPath)}
                          className="text-[10px] font-mono font-bold text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <Copy size={12} /> Copy Path
                        </button>
                      </div>
                      <code className="block p-3 bg-white border border-slate-200 rounded-lg font-mono text-xs text-slate-900 font-bold">
                        {selectedFlow.backendPath}
                      </code>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Endpoints & Handlers</h4>
                      <div className="space-y-1.5">
                        {selectedFlow.backendEndpoints.map((ep, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-xs font-mono font-bold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{ep}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 4: SYNC & DB PAYLOAD */}
                {activeInspectorTab === 'sync' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Cpu size={16} className="text-purple-600" />
                        <span>Data Synchronization Mechanism</span>
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {selectedFlow.syncMethod}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Database size={14} className="text-amber-500" />
                        <span>Database Tables & Columns</span>
                      </h4>
                      <div className="space-y-1">
                        {selectedFlow.dbTables.map((tbl, idx) => (
                          <div key={idx} className="p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-mono font-bold">
                            {tbl}
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedFlow.payloadExample && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Sample JSON Payload</h4>
                          <button
                            onClick={() => copyToClipboard(selectedFlow.payloadExample!)}
                            className="text-[10px] font-mono text-slate-500 hover:text-slate-900 flex items-center gap-1"
                          >
                            <Copy size={12} /> Copy JSON
                          </button>
                        </div>
                        <pre className="p-4 bg-amber-50/80 text-slate-900 text-xs font-mono rounded-xl overflow-x-auto leading-relaxed border border-amber-200 font-medium">
                          {selectedFlow.payloadExample}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* TAB 5: UI MOCKUP SCREENSHOT PREVIEW */}
                {activeInspectorTab === 'mockup' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="p-6 rounded-2xl text-slate-900 bg-slate-50 border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-rose-400" />
                          <div className="w-3 h-3 rounded-full bg-amber-400" />
                          <div className="w-3 h-3 rounded-full bg-emerald-400" />
                          <span className="text-xs font-bold font-mono ml-2 text-slate-700">App Screen Preview</span>
                        </div>
                        <span className="text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                          {selectedFlow.mockupTitle}
                        </span>
                      </div>

                      <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">UI Controls & Visual Elements:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedFlow.mockupItems.map((item, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-bold flex items-center gap-2 text-slate-800">
                              <CheckCircle2 size={14} className="text-amber-600 shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-3">
              <GitBranch size={40} className="mx-auto text-slate-300" />
              <p className="text-xs font-bold">Select any flow from the left directory to inspect developer details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
