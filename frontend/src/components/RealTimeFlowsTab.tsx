import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitBranch, 
  MapPin, 
  Search, 
  Bell, 
  User, 
  ChevronRight, 
  Car, 
  Zap, 
  Compass, 
  Clock, 
  ShieldAlert, 
  Star, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Lock, 
  Database,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Users,
  Check,
  UserCheck,
  ArrowLeft,
  Minus,
  Plus,
  ChevronDown,
  AlertCircle,
  Shield,
  Info,
  Wallet,
  Share2
} from 'lucide-react';

interface RealTimeFlowsTabProps {
  setToast: (toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' }) => void;
}

export const RealTimeFlowsTab: React.FC<RealTimeFlowsTabProps> = ({ setToast }) => {
  const [activeFlow, setActiveFlow] = useState<'driver' | 'carpool'>('driver');
  const [activeStep, setActiveStep] = useState(0);

  // Flow-specific state simulations
  const [selectedVehicle, setSelectedVehicle] = useState<'mini' | 'sedan' | 'luxury'>('sedan');
  const [promoApplied, setPromoApplied] = useState(true);
  const [sosActive, setSosActive] = useState(false);
  const [cabinAc, setCabinAc] = useState(true);
  const [quietRide, setQuietRide] = useState(false);
  const [driverRating, setDriverRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Driver Flow state simulations
  const [driverKycStatus, setDriverKycStatus] = useState<'approved' | 'pending' | 'rejected'>('approved');
  const [driverOnDuty, setDriverOnDuty] = useState(true);
  const [driverOtpInput, setDriverOtpInput] = useState('');
  const [tripStarted, setTripStarted] = useState(false);
  const [tripStep, setTripStep] = useState<'offer' | 'accepted' | 'navigating' | 'completed'>('offer');

  // Carpooling state simulations
  const [seatsRequested, setSeatsRequested] = useState(2);
  const [carpoolChat, setCarpoolChat] = useState<Array<{ sender: 'rider' | 'driver'; text: string; time: string }>>([
    { sender: 'rider', text: "Hi, I've reached the pickup gate near Cyber Towers.", time: "9:43 AM" },
    { sender: 'driver', text: "Got it. Be there in 2 mins. I'm in a blue hatchback.", time: "9:44 AM" }
  ]);
  const [chatInput, setChatInput] = useState('');

  const flowsData = {
    driver: {
      title: "Driver Dispatch & Compliance",
      desc: "Comprehensive journey of fleet operators from identity checks to radar matching and instant electronic balance withdrawal.",
      steps: [
        {
          title: "KYC Compliance & Auditing",
          desc: "Fleets undergo strict paper audit (Driving License, RC, PAN) and visual face match. Verified drivers gain on-duty toggles.",
          highlight: "View audited status and switch duty states to activate live radar.",
          technical: "GET /api/admin/drivers, POST /api/admin/drivers/verify"
        },
        {
          title: "Live Radar Scan (On-Duty)",
          desc: "Going online registers the driver's coordinates to regional zones and initiates standard high-frequency radar scans for matching requests.",
          highlight: "Simulates live radar scanning overlay. Toggle duty off to pause scanning.",
          technical: "WS: 'driver_coordinates_sync', GET /api/trips/offers"
        },
        {
          title: "Accepting Ride Request",
          desc: "Incoming booking offer pops up with a 15-second response window, displaying distance, rider rating, pickup point, and gross revenue.",
          highlight: "Accept the ride offer to secure the customer booking instantly.",
          technical: "WS: Emit 'accept_trip_request', POST /api/trips/accept"
        },
        {
          title: "Security OTP Handshake",
          desc: "To prevent fraudulent transits, the driver must enter the rider's secure 4-digit code (e.g. 7749) to begin the trip.",
          highlight: "Simulate entering OTP '7749' to unlock the active transit navigation state.",
          technical: "POST /api/trips/start (verifies OTP payload)"
        },
        {
          title: "Revenue Direct Settlement",
          desc: "Fares are processed securely. The driver's dashboard is credited, showing immediate revenue analytics and wallet withdraw triggers.",
          highlight: "Initiate direct bank transfer to withdraw current daily ride earnings.",
          technical: "POST /api/payouts/withdraw"
        }
      ]
    },
    carpool: {
      title: "Intercity Share & Chat Pool",
      desc: "City-to-city ridesharing flow showing how drivers list routes, and co-travelers search, request seats, and chat in real-time.",
      steps: [
        {
          title: "Publishing Shared Route",
          desc: "Intercity drivers list travel plans: source, destination, date, available seats, and split price per seat.",
          highlight: "Set custom price and seats to publish a high-capacity intercity pool route.",
          technical: "POST /api/intercity/publish"
        },
        {
          title: "Rider Request & Seat Match",
          desc: "Co-travelers search listed pools, request specific seat counts, and view verified profile metadata before requesting.",
          highlight: "Select seat quantity and submit booking request to the pool owner.",
          technical: "POST /api/intercity/book-seat"
        },
        {
          title: "Real-Time Negotiation Chat",
          desc: "Enables coordination of pickup details via safe, zero-latency in-app chat with convenient pre-formatted fast text presets.",
          highlight: "Simulate a live conversation! Choose quick presets or type and send messages to driver.",
          technical: "WS: 'new_chat_message', POST /api/chat/send"
        },
        {
          title: "Co-Rider Verification & Approval",
          desc: "Driver reviews pending co-traveler accounts, checks Aadhaar check indicators, and approves/declines requests to lock the pool.",
          highlight: "Review booking, check Aadhaar verified badge, and approve seat allocation.",
          technical: "POST /api/intercity/approve-booking"
        },
        {
          title: "Shared Route Completion",
          desc: "The transit is completed. Splitting fuel, tolls, and carbon credits are calculated and recorded to user profiles.",
          highlight: "Review eco-savings summary and offset metrics.",
          technical: "POST /api/intercity/complete"
        }
      ]
    }
  };

  const handleNextStep = () => {
    if (activeStep < flowsData[activeFlow].steps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      setToast({ message: `Completed ${flowsData[activeFlow].title}!`, type: 'success' });
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const selectFlow = (flow: 'driver' | 'carpool') => {
    setActiveFlow(flow);
    setActiveStep(0);
    setReviewSubmitted(false);
    setSosActive(false);
    setTripStep('offer');
    setTripStarted(false);
  };

  const currentFlow = flowsData[activeFlow];
  const currentStepData = currentFlow.steps[activeStep];

  // Helper render for the real app simulator on the right
  const renderAppMockup = () => {
    const isDriver = activeFlow === 'driver';
    const isCarpool = activeFlow === 'carpool';

    if (false) {
      // @ts-ignore
      switch (activeStep) {
        case 0: // Home Screen & Search (Matching user's exact uploaded screenshot!)
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 relative select-none">
              {/* Header location bar */}
              <div className="pt-4 px-4 pb-2 flex items-center justify-between bg-white z-10 border-b border-slate-50">
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center text-slate-950 shadow-xs shrink-0">
                    <MapPin size={16} fill="currentColor" />
                  </div>
                  <div className="leading-tight">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black tracking-tight text-slate-900">P&T COLONY</span>
                      <span className="text-[6px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-black border border-slate-200">V5</span>
                    </div>
                    <p className="text-[7px] text-slate-400 font-extrabold tracking-wider leading-none">WARD 23 GADDIANNARAM</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 relative">
                    <Bell size={12} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                  </button>
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                    AS
                  </div>
                </div>
              </div>

              {/* Input Box */}
              <div className="px-4 py-2 bg-white">
                <div className="flex items-center gap-1.5 bg-white rounded-xl p-1 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-1.5 flex-1 pl-2">
                    <Search size={12} className="text-slate-400" />
                    <input 
                      type="text" 
                      readOnly 
                      placeholder="Local or intercity?" 
                      className="bg-transparent text-[9px] text-slate-800 font-bold placeholder-slate-400 w-full outline-none"
                    />
                  </div>
                  <button className="bg-[#FAB818] text-slate-950 font-black text-[8px] uppercase tracking-wider px-3 py-1.5 rounded-lg">
                    FIND
                  </button>
                </div>
              </div>

              {/* Promo Banner Card */}
              <div className="px-4 py-1.5">
                <div className="bg-[#5c8a9e] rounded-xl p-3 relative overflow-hidden text-white">
                  <div className="relative z-10 max-w-[150px] space-y-1">
                    <span className="text-[6px] bg-black/20 text-[#ffd15c] px-1 py-0.2 rounded font-black tracking-widest uppercase">
                      PROMO EXCLUSIVE
                    </span>
                    <h5 className="text-[9px] font-black leading-tight tracking-tight uppercase">
                      AIRPORT LUXURY PROMO
                    </h5>
                    <div className="flex gap-1 pt-1">
                      <span className="w-1 h-1 bg-amber-400 rounded-full" />
                      <span className="w-1 h-1 bg-white/40 rounded-full" />
                    </div>
                  </div>
                  <div className="absolute right-2 bottom-1 w-16 h-12 flex items-center justify-center text-3xl opacity-30">
                    🚕
                  </div>
                </div>
              </div>

              {/* Vector Map area with pins */}
              <div className="flex-1 bg-slate-50 relative overflow-hidden border-t border-slate-100 flex flex-col justify-between">
                <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M-10 40 Q 140 100 320 80 M40 -10 Q 120 180 30 380 M-10 210 Q 180 180 320 250" stroke="#cbd5e1" strokeWidth="4" fill="none" />
                </svg>

                {/* Map Pins */}
                <div className="absolute top-[60px] left-[110px] z-10 flex flex-col items-center scale-75">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
                    🚗
                  </div>
                  <span className="text-[6px] bg-slate-900 text-white font-black px-1 rounded mt-0.5">₹480 • Sedan</span>
                </div>

                <div className="absolute bottom-[90px] right-[60px] z-10 flex flex-col items-center scale-75">
                  <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold animate-bounce">
                    🛺
                  </div>
                </div>

                {/* Bottom navigation bar */}
                <div className="mt-auto bg-white border-t border-slate-100 flex justify-around items-center py-2 z-10">
                  <button className="flex flex-col items-center gap-0.5 text-[#FAB818]">
                    <MapPin size={12} fill="currentColor" />
                    <span className="text-[6px] font-black">HOME</span>
                  </button>
                  <button className="flex flex-col items-center gap-0.5 text-slate-400">
                    <Car size={12} />
                    <span className="text-[6px] font-bold">RIDES</span>
                  </button>
                  <button className="flex flex-col items-center gap-0.5 text-slate-400">
                    <Users size={12} />
                    <span className="text-[6px] font-bold">MARKET</span>
                  </button>
                  <button className="flex flex-col items-center gap-0.5 text-slate-400">
                    <MessageSquare size={12} />
                    <span className="text-[6px] font-bold">CHAT</span>
                  </button>
                </div>
              </div>
            </div>
          );

        case 1: // Tier Selection & Fare Match
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 relative select-none">
              {/* Header block */}
              <div className="px-3 py-2.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-2">
                  <button className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <ArrowLeft size={12} strokeWidth={2.5} />
                  </button>
                  <span className="text-[10px] font-black text-slate-900 tracking-tight">Booking details</span>
                </div>
                <div className="text-[8px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  Sunday, 24 May
                </div>
              </div>

              {/* Main routing list - Replicating BookingFlowSimulator */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar text-left">
                {/* Routing Timeline */}
                <div className="space-y-1.5 relative pl-1">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center pt-1 w-3 shrink-0">
                      <div className="w-2 h-2 rounded-full border-2 border-[#FAB818] bg-white" />
                      <div className="w-[1px] h-4 bg-slate-200 mt-1" />
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-900 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">11:10 AM</span>
                      <h3 className="text-[10px] font-black text-slate-800 leading-none mt-1">Secunderabad</h3>
                      <p className="text-[7px] text-slate-400 font-bold">JUBILEE BUS STATION</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center w-3 shrink-0">
                      <div className="w-[1px] h-4 bg-slate-200" />
                    </div>
                    <span className="text-[7px] text-[#FAB818] font-black uppercase tracking-widest bg-[#FAB818]/5 border border-[#FAB818]/20 px-1.5 py-0.2 rounded-full">
                      195 KM • 3H 15M • APPROX
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center w-3 shrink-0">
                      <div className="w-[1px] h-2 bg-slate-200 mb-1" />
                      <div className="w-2 h-2 rounded-full bg-slate-800" />
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-900 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">11:55 AM</span>
                      <h3 className="text-[10px] font-black text-slate-800 leading-none mt-1">Peddapalli</h3>
                      <p className="text-[7px] text-slate-400 font-bold">BUS STAND ROAD</p>
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-slate-100" />

                {/* Verified Driver Identity */}
                <div className="flex items-center justify-between py-0.5 px-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FAB818]/10 border border-[#FAB818]/20 flex items-center justify-center font-black text-[#FAB818] text-[10px]">
                      AS
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black text-slate-800 leading-none">Aryan Singhania (Rider)</h4>
                      <div className="flex items-center gap-1 text-[7px] text-slate-400 font-bold mt-1">
                        <span className="text-amber-500">★</span>
                        <span>4.8</span>
                        <span>•</span>
                        <span>Maruti Swift</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                    <Shield size={10} className="fill-current" />
                  </div>
                </div>

                <div className="h-[1px] bg-slate-100" />

                {/* Seats control linked to state */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-tight">Select Seats</h4>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => { if (seatsRequested > 1) setSeatsRequested(seatsRequested - 1); }}
                        className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 bg-slate-50 hover:bg-slate-100"
                      >
                        <Minus size={10} strokeWidth={3} />
                      </button>
                      <span className="text-[11px] font-black text-slate-800 font-mono w-3 text-center">{seatsRequested}</span>
                      <button 
                        onClick={() => { if (seatsRequested < 4) setSeatsRequested(seatsRequested + 1); }}
                        className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 bg-slate-50 hover:bg-slate-100"
                      >
                        <Plus size={10} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                  <div className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">
                    4 seats remaining
                  </div>
                </div>

                <div className="h-[1px] bg-slate-100" />

                {/* Total Price highlighted beautifully inside light rose container block */}
                <div className="flex justify-between items-center py-2 px-3 bg-[#ff3b30]/5 rounded-xl border border-[#ff3b30]/15">
                  <span className="text-[9px] font-black text-[#ff3b30] uppercase tracking-wider">Approx price due</span>
                  <span className="text-sm font-black text-[#ff3b30]">₹{480 * seatsRequested}</span>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                <button
                  onClick={handleNextStep}
                  className="w-full py-2.5 bg-[#FAB818] hover:bg-[#e0a10c] text-slate-950 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xs flex items-center justify-center gap-1"
                >
                  <Zap size={10} fill="currentColor" />
                  <span>Confirm Book • ₹{480 * seatsRequested}</span>
                </button>
              </div>
            </div>
          );

        case 2: // Driver Matching (WebSocket)
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 justify-between p-4 relative select-none">
              <div className="flex-1 flex flex-col items-center justify-center relative">
                {/* Simulated Radar Circles */}
                <div className="absolute w-28 h-28 border border-emerald-500/10 rounded-full animate-ping" />
                <div className="absolute w-20 h-20 border border-emerald-500/20 rounded-full animate-pulse" />
                
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 shadow-xs relative z-10">
                  <Compass size={18} className="text-[#FAB818] animate-spin" style={{ animationDuration: '6s' }} />
                </div>

                <div className="text-center mt-5 space-y-1 z-10">
                  <h5 className="text-[10px] font-black text-slate-800 animate-pulse">Searching taxi dispatch grids</h5>
                  <p className="text-[7.5px] text-slate-400 font-bold max-w-[170px] leading-relaxed mx-auto">
                    Transmitting socket packet <code className="text-indigo-600 font-mono text-[7px]">new_trip_alert</code> in 5km radius...
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 mt-5 w-full max-w-[180px] z-10 text-[6.5px] text-slate-500 font-mono space-y-0.5 text-left leading-tight">
                  <div className="text-emerald-600 font-bold">● EMITTING WS BROADCAST</div>
                  <div>origin_lat: 17.4483 • origin_lng: 78.3741</div>
                  <div>seats_requested: {seatsRequested}</div>
                  <div className="text-amber-600">broadcast_radius: 5.0 km</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setToast({ message: "Simulated acceptance from Karan Malhotra", type: 'success' });
                    handleNextStep();
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all shadow-xs text-center"
                >
                  SIMULATE DRIVER ACCEPTANCE ✓
                </button>
              </div>
            </div>
          );

        case 3: // Live GPS Route Tracking
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 select-none relative">
              {/* Navigation map with path */}
              <div className="flex-1 bg-slate-50 relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 10 120 Q 140 140 280 100" stroke="#cbd5e1" strokeWidth="3" fill="none" />
                  <path d="M 50 124 Q 140 140 198 234 Q 220 340 236 394" stroke={sosActive ? "#ef4444" : "#10b981"} strokeWidth="4.5" fill="none" strokeLinecap="round" strokeDasharray="6, 6" />
                </svg>

                {/* Top tracking bar widgets */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-25">
                  <div className="bg-white/95 rounded-full px-2.5 py-1 border border-slate-200 text-[7.5px] font-black text-slate-700 flex items-center gap-1 shadow-xs">
                    <Clock size={8} className="text-[#FAB818]" />
                    <span>ETA: 14 mins</span>
                  </div>

                  <button
                    onClick={() => {
                      setSosActive(!sosActive);
                      if (!sosActive) {
                        setToast({ message: "CRITICAL PANIC TRIGGERED. Telemetry broadcast to admin activated!", type: 'error' });
                      } else {
                        setToast({ message: "SOS Emergency de-activated.", type: 'info' });
                      }
                    }}
                    className={`px-2.5 py-1 text-[7.5px] font-black uppercase tracking-wider rounded-full flex items-center gap-0.5 shadow-xs transition-all cursor-pointer ${
                      sosActive 
                        ? "bg-rose-600 text-white animate-bounce border border-rose-400" 
                        : "bg-white text-rose-600 border border-rose-100 hover:bg-rose-50"
                    }`}
                  >
                    🚨 SOS {sosActive ? "Flashing" : "Trigger"}
                  </button>
                </div>

                {/* Moving taxi indicator */}
                <div className="absolute top-[160px] left-[130px] flex flex-col items-center justify-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-md border-2 border-white ${
                    sosActive ? "bg-rose-600 animate-bounce text-white" : "bg-emerald-600 animate-pulse text-white"
                  }`}>
                    🚕
                  </div>
                  <span className="text-[6px] bg-white px-1 rounded border border-slate-200 mt-1 font-bold text-slate-700">
                    {sosActive ? "68 km/h" : "45 km/h"}
                  </span>
                </div>

                {/* SOS Panic Overlay Warning */}
                {sosActive && (
                  <div className="absolute bottom-[90px] left-2 right-2 bg-rose-50 border border-rose-200 rounded-xl p-2 z-20 text-[6.5px] text-rose-800 font-bold animate-pulse shadow-sm text-left leading-normal">
                    ⚠️ EMERGENCY INTRUSION BROADCAST IN PROGRESS. Telemetry, video, and audio stream dispatched to dispatch center.
                  </div>
                )}

                {/* Bottom cockpit controller drawer */}
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-2.5 border-t border-slate-250 space-y-1.5 z-25 shadow-md text-left">
                  <div className="flex justify-between items-start gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-800">
                        KM
                      </div>
                      <div>
                        <h5 className="text-[8.5px] font-black text-slate-800 leading-none">Karan Malhotra</h5>
                        <p className="text-[6.5px] text-slate-400 font-bold mt-1">Maruti Dzire • DL 1C 4920</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[6.5px] bg-slate-100 text-[#FAB818] px-1 rounded font-black border border-slate-200 font-mono">OTP: 7749</span>
                      <p className="text-[6.5px] text-slate-400 font-bold mt-1">Status: Cruising</p>
                    </div>
                  </div>

                  {/* Active Ride settings cockpit */}
                  <div className="border-t border-slate-100 pt-1.5 grid grid-cols-2 gap-1 text-[7px] font-bold">
                    <button
                      onClick={() => setCabinAc(!cabinAc)}
                      className={`p-1 rounded-md border flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        cabinAc ? "bg-[#FAB818]/10 border-[#FAB818]/30 text-slate-800" : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}
                    >
                      ❄️ AC Cabin: {cabinAc ? "ON" : "OFF"}
                    </button>
                    <button
                      onClick={() => setQuietRide(!quietRide)}
                      className={`p-1 rounded-md border flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                        quietRide ? "bg-slate-800 border-slate-900 text-white" : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}
                    >
                      🔇 Quiet Ride: {quietRide ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-white border-t border-slate-100 shrink-0">
                <button
                  onClick={handleNextStep}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-all shadow-xs text-center"
                >
                  ARRIVED AT DESTINATION 🏁
                </button>
              </div>
            </div>
          );

        case 4: // Settlement & Feedback
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 justify-between p-3 select-none text-left">
              <div className="text-center py-2 space-y-1 shrink-0">
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto text-sm font-bold">
                  ✓
                </div>
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wide">Transit Settled</h4>
                <p className="text-[6.5px] text-slate-400 font-bold">THANK YOU FOR TRANSITING WITH US</p>
              </div>

              {/* Invoice receipt breakdown card */}
              <div className="flex-1 space-y-2 overflow-y-auto py-1 no-scrollbar">
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1.5 text-left">
                  <p className="text-[6.5px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">Fare Breakdown Receipt</p>
                  
                  <div className="space-y-1 text-[7.5px] font-semibold text-slate-500">
                    <div className="flex justify-between">
                      <span>Base Booking Tariff:</span>
                      <span className="text-slate-800">₹50.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance rate (195 km):</span>
                      <span className="text-slate-800">₹{430 * seatsRequested}.00</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] font-black text-[#ff3b30] border-t border-slate-200 pt-1 mt-1">
                    <span>Grand Total Settled:</span>
                    <span>₹{480 * seatsRequested}.00</span>
                  </div>
                </div>

                {/* Stars and comments reviews panel */}
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-2.5 text-center space-y-2">
                  <p className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider">Rate Your Journey</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        disabled={reviewSubmitted}
                        onClick={() => setDriverRating(star)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star 
                          size={13} 
                          className={star <= driverRating ? "fill-[#FAB818] text-[#FAB818]" : "text-slate-300"} 
                        />
                      </button>
                    ))}
                  </div>

                  {!reviewSubmitted ? (
                    <button
                      onClick={() => {
                        setReviewSubmitted(true);
                        setToast({ message: "Rating saved directly to digital ledger database!", type: 'success' });
                      }}
                      className="w-full py-1 bg-slate-200 text-[7px] text-slate-700 font-black uppercase rounded-md hover:bg-slate-300 transition-colors"
                    >
                      Submit Feedback
                    </button>
                  ) : (
                    <p className="text-[6.5px] text-emerald-600 font-black flex items-center justify-center gap-1 py-1">
                      ✓ FEEDBACK SECURED SUCCESSFUL
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setReviewSubmitted(false);
                  setActiveStep(0);
                }}
                className="w-full py-2 bg-[#FAB818] text-slate-950 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all shadow-xs text-center"
              >
                Reset Walkthrough Flow
              </button>
            </div>
          );

        default:
          return null;
      }
    }

    if (isDriver) {
      switch (activeStep) {
        case 0: // KYC Compliance & Auditing
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 justify-between p-3 select-none text-left">
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <ShieldCheck size={12} />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-800 leading-none">Compliance Center</h4>
                    <p className="text-[6.5px] text-slate-400 font-bold uppercase">Audit & Verification</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1.5">
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">KYC Upload Vault</p>
                  <div className="space-y-1 text-[7.5px] font-bold text-slate-500">
                    <div className="flex justify-between items-center p-1 bg-white border border-slate-100 rounded-md">
                      <span>Driving License</span>
                      <span className="text-emerald-600">AUDITED ✓</span>
                    </div>
                    <div className="flex justify-between items-center p-1 bg-white border border-slate-100 rounded-md">
                      <span>Vehicle Registration</span>
                      <span className="text-emerald-600">AUDITED ✓</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center space-y-1">
                  <div className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[7.5px] font-black">
                    APPROVED & ACTIVE
                  </div>
                  <p className="text-[6.5px] text-slate-400 font-semibold leading-relaxed">
                    Identity check, background scan, and Aadhaar passed.
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider rounded-lg text-center"
              >
                PROCEED ON-DUTY →
              </button>
            </div>
          );

        case 1: // Live Radar Scan (On-Duty)
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 justify-between p-3 select-none relative overflow-hidden text-left">
              <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-emerald-500 rounded-full animate-ping" />
              </div>

              <div className="relative z-10 flex justify-between items-center bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-slate-700 uppercase">RADAR SCANNING</span>
                </div>
                <button 
                  onClick={() => setDriverOnDuty(!driverOnDuty)}
                  className={`px-1.5 py-0.5 rounded text-[6px] font-black uppercase tracking-widest ${
                    driverOnDuty ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {driverOnDuty ? "ONLINE" : "OFFLINE"}
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center p-3 relative z-10 text-center space-y-1.5">
                {driverOnDuty ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100 animate-spin" style={{ animationDuration: '4s' }}>
                      <Compass size={12} />
                    </div>
                    <p className="text-[9px] font-black text-slate-800">Listening for client sockets...</p>
                    <p className="text-[6.5px] text-slate-400 max-w-[150px] mx-auto">
                      Coordinates are sync'ing to active zone tables. Matches emit directly to your device.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Lock size={10} />
                    </div>
                    <p className="text-[8px] font-bold text-slate-400">Duty is paused</p>
                  </>
                )}
              </div>

              <button
                disabled={!driverOnDuty}
                onClick={handleNextStep}
                className="w-full py-2 bg-emerald-600 disabled:opacity-40 text-white text-[9px] font-black uppercase tracking-wider rounded-lg text-center z-10"
              >
                SIMULATE RIDE OFFER
              </button>
            </div>
          );

        case 2: // Accepting Ride Request
          return (
            <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 justify-end p-3 select-none relative text-left">
              <div className="bg-white rounded-xl p-2.5 border border-slate-150 shadow-md space-y-2 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[6.5px] font-black rounded uppercase">
                    Incoming Offer
                  </span>
                  <span className="text-[7.5px] font-black text-[#ff3b30] animate-pulse">12s Left</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-700">
                    AS
                  </div>
                  <div>
                    <h5 className="text-[8.5px] font-black text-slate-800 leading-none">Ananya Sharma</h5>
                    <p className="text-[6.5px] text-slate-400 font-bold mt-0.5">★ 4.9 Rating</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-1.5 space-y-0.5 text-[7px] text-slate-500 font-medium">
                  <p className="truncate">📍 <strong className="text-slate-400 font-bold">From:</strong> Cyber Towers Sector 1</p>
                  <p className="truncate">🏁 <strong className="text-slate-400 font-bold">To:</strong> RGIA Airport corridor</p>
                  <div className="flex justify-between border-t border-slate-100 pt-1 text-[7px] font-black">
                    <span>Distance: 22.4 km</span>
                    <span className="text-[#FAB818]">Est Fare: ₹430</span>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider rounded-lg text-center"
                >
                  ACCEPT OFFER ✓
                </button>
              </div>
            </div>
          );

        case 3: // Security OTP Handshake
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 justify-between p-3 select-none text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                    <Lock size={12} />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-800 leading-none">Passenger Handshake</h4>
                    <p className="text-[6.5px] text-slate-400 font-bold uppercase">Transit Verification</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center space-y-2">
                  <p className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest leading-none">Rider Security Code</p>
                  <p className="text-[6.5px] text-slate-400">Ask the passenger for their secure 4-digit code to start the ride safely.</p>
                  
                  <div className="flex gap-2 justify-center max-w-[140px] mx-auto">
                    <input
                      type="text"
                      maxLength={4}
                      value={driverOtpInput}
                      onChange={(e) => setDriverOtpInput(e.target.value)}
                      placeholder="ENTER OTP"
                      className="bg-white border border-slate-200 text-center text-xs font-black p-1.5 rounded-lg text-[#FAB818] tracking-widest placeholder-slate-300 w-full outline-none font-mono"
                    />
                  </div>

                  {driverOtpInput === '7749' && (
                    <div className="text-emerald-600 text-[7.5px] font-black">
                      ✓ SECURITY PASSCODE MATCHED
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (driverOtpInput !== '7749') {
                    setDriverOtpInput('7749');
                    setToast({ message: "Auto-filled rider passcode: 7749", type: 'info' });
                  } else {
                    handleNextStep();
                  }
                }}
                className="w-full py-2 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider rounded-lg text-center"
              >
                {driverOtpInput === '7749' ? "START TRANSIT JOURNEY ✓" : "AUTO-FILL CODE (7749)"}
              </button>
            </div>
          );

        case 4: // Revenue Direct Settlement
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 justify-between p-3 select-none text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 border border-amber-100">
                    <Zap size={12} />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-800 leading-none">Driver Wallet</h4>
                    <p className="text-[6.5px] text-slate-400 font-bold uppercase">Settlements</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center">
                  <p className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest">Available Balance</p>
                  <p className="text-base font-black text-slate-900 font-mono pt-1">₹1,430.00</p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 space-y-1 text-[7.5px] font-bold text-slate-400">
                  <div className="flex justify-between border-b border-slate-200 pb-0.5">
                    <span>Ride ID #902</span>
                    <span className="text-emerald-600">+₹380.00</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-0.5">
                    <span>Ride ID #897</span>
                    <span className="text-emerald-600">+₹180.00</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setToast({ message: "Payout request successfully dispatched to linked bank routing!", type: 'success' });
                  setActiveStep(0);
                }}
                className="w-full py-2 bg-[#FAB818] text-slate-950 text-[9px] font-black uppercase tracking-wider rounded-lg text-center"
              >
                WITHDRAW TO BANK ACCOUNT
              </button>
            </div>
          );

        default:
          return null;
      }
    }

    if (isCarpool) {
      switch (activeStep) {
        case 0: // Publishing Shared Route
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 justify-between p-3 select-none text-left">
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <GitBranch size={12} />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-800 leading-none">Publish Pool Route</h4>
                    <p className="text-[6.5px] text-slate-400 font-bold uppercase">Intercity carpool splits</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-2">
                  <div className="space-y-0.5 text-[7px] font-bold text-slate-400">
                    <label>ORIGIN CITY</label>
                    <input type="text" readOnly value="Hyderabad (HITEC City)" className="bg-white border border-slate-200 text-[8px] text-slate-800 rounded-md p-1.5 w-full font-bold" />
                  </div>
                  <div className="space-y-0.5 text-[7px] font-bold text-slate-400">
                    <label>DESTINATION CITY</label>
                    <input type="text" readOnly value="Vijayawada (Benz Circle)" className="bg-white border border-slate-200 text-[8px] text-slate-800 rounded-md p-1.5 w-full font-bold" />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[7px] font-bold text-slate-400">
                    <div className="space-y-0.5">
                      <label>SEATS</label>
                      <input type="number" readOnly value={4} className="bg-white border border-slate-200 text-[8px] text-slate-800 rounded-md p-1.5 w-full text-center font-bold" />
                    </div>
                    <div className="space-y-0.5">
                      <label>PRICE / SEAT</label>
                      <input type="text" readOnly value="₹650" className="bg-white border border-slate-200 text-[8px] text-[#FAB818] rounded-md p-1.5 w-full text-center font-bold" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase tracking-wider rounded-lg text-center"
              >
                PUBLISH POOL ROUTE ✓
              </button>
            </div>
          );

        case 1: // Rider Request & Seat Match
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 justify-between p-3 select-none text-left">
              <div className="space-y-2.5">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1.5">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                    <span className="text-[8px] font-black text-indigo-600">POOL ROUTE MATCH</span>
                    <span className="text-[9px] font-black text-slate-850">₹650/seat</span>
                  </div>
                  <p className="text-[9px] font-black text-slate-800 leading-none">Karan Malhotra's Pool Ride</p>
                  <p className="text-[6.5px] text-slate-400 font-bold">Departure: Tomorrow 06:00 AM</p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center space-y-2">
                  <p className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest">Select Requested Seats</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3].map(num => (
                      <button
                        key={num}
                        onClick={() => setSeatsRequested(num)}
                        className={`w-6 h-6 rounded-full font-mono text-[9px] font-black border transition-all cursor-pointer ${
                          seatsRequested === num 
                            ? "bg-indigo-600 border-indigo-400 text-white" 
                            : "bg-white border-slate-200 text-slate-400"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <p className="text-[7px] text-slate-400 font-bold">Booking: {seatsRequested} seats • Total: ₹{seatsRequested * 650}</p>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase tracking-wider rounded-lg text-center"
              >
                REQUEST SEATS IN POOL
              </button>
            </div>
          );

        case 2: // Real-Time Negotiation Chat
          return (
            <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 justify-between select-none overflow-hidden text-left">
              {/* Chat Header */}
              <div className="p-2.5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] text-[#FAB818] font-black">
                    KM
                  </div>
                  <div>
                    <h5 className="text-[8.5px] font-black text-slate-800 leading-none">Karan Malhotra</h5>
                    <p className="text-[6px] text-emerald-600 font-bold uppercase mt-0.5">Verified Pool Host</p>
                  </div>
                </div>
                <span className="text-[6.5px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-bold">Pool chat</span>
              </div>

              {/* Chat Message Lists */}
              <div className="flex-1 p-2.5 space-y-2 overflow-y-auto no-scrollbar">
                {carpoolChat.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col max-w-[80%] ${msg.sender === 'rider' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div className={`p-1.5 rounded-lg text-[7.5px] font-semibold ${
                      msg.sender === 'rider' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none shadow-xs border border-slate-100'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[5px] text-slate-400 font-bold mt-0.5">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Quick Preset buttons */}
              <div className="p-1 bg-white border-t border-slate-100 flex gap-1 overflow-x-auto no-scrollbar shrink-0">
                {["Perfect. I'm on the way", "Okay, thanks", "Coffee stop?"].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const updatedChat: Array<{ sender: 'rider' | 'driver'; text: string; time: string }> = [
                        ...carpoolChat, 
                        { sender: 'rider', text: preset, time: "9:45 AM" }
                      ];
                      setCarpoolChat(updatedChat);
                      setToast({ message: "Simulated chat message socket emit!", type: 'success' });
                    }}
                    className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 text-[6px] font-bold text-slate-600 rounded-md whitespace-nowrap"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Chat input box */}
              <div className="p-1.5 bg-white border-t border-slate-100 flex gap-1 shrink-0">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-[8px] rounded-md p-1.5 flex-1 placeholder-slate-400 focus:border-indigo-500 outline-none text-slate-800 font-medium"
                />
                <button
                  onClick={() => {
                    if (chatInput.trim()) {
                      const updatedChat: Array<{ sender: 'rider' | 'driver'; text: string; time: string }> = [
                        ...carpoolChat, 
                        { sender: 'rider', text: chatInput, time: "9:45 AM" }
                      ];
                      setCarpoolChat(updatedChat);
                      setChatInput('');
                      setToast({ message: "Message dispatched!", type: 'success' });
                    }
                  }}
                  className="p-1.5 bg-indigo-600 text-white rounded-md flex items-center justify-center shrink-0"
                >
                  <Send size={8} />
                </button>
              </div>

              <div className="p-1.5 bg-white border-t border-slate-100 text-center shrink-0">
                <button
                  onClick={handleNextStep}
                  className="w-full py-1 bg-slate-100 text-slate-600 text-[7.5px] font-black uppercase rounded-md text-center"
                >
                  PROCEED TO APPROVALS STEP →
                </button>
              </div>
            </div>
          );

        case 3: // Co-Rider Verification & Approval
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 justify-between p-3 select-none text-left">
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <UserCheck size={12} />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-slate-800 leading-none">Co-Rider Allocations</h4>
                    <p className="text-[6.5px] text-slate-400 font-bold uppercase">Aadhaar verified passengers</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 space-y-1.5">
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">PENDING REQUESTS</p>
                  
                  <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[9px] font-bold text-white">
                        AS
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-[8.5px] font-black text-slate-800">Ananya Sharma</span>
                          <span className="text-[5.5px] bg-emerald-50 text-emerald-600 px-1 rounded font-black border border-emerald-200">KYC APPROVED</span>
                        </div>
                        <p className="text-[6.5px] text-slate-400 font-bold">Requested seats: {seatsRequested} • Aadhaar Match ✓</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setToast({ message: "Passenger booking request approved successfully!", type: 'success' });
                  handleNextStep();
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider rounded-lg text-center"
              >
                APPROVE ALLOCATION REQUEST ✓
              </button>
            </div>
          );

        case 4: // Shared Route Completion
          return (
            <div className="flex-1 flex flex-col bg-white text-slate-800 justify-between p-3 select-none text-left">
              <div className="space-y-2.5 text-center py-2 shrink-0">
                <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto text-xs">
                  🌱
                </div>
                <h4 className="text-[9.5px] font-black text-slate-900 uppercase tracking-wide leading-none">CO-TRANSIT COMPLETED</h4>
                <p className="text-[6.5px] text-emerald-600 font-black">POOL COMPLETED SUCCESSFULLY</p>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl space-y-1.5">
                  <p className="text-[6.5px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">POOL METRICS & SPLITS</p>
                  
                  <div className="space-y-1 text-[7.5px] font-semibold text-slate-500">
                    <div className="flex justify-between">
                      <span>Carbon offset:</span>
                      <span className="text-emerald-600 font-black">-14.2 kg CO2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total toll savings:</span>
                      <span className="text-[#FAB818] font-black">₹1,300 split</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passenger credit:</span>
                      <span className="text-slate-800 font-bold">₹{seatsRequested * 650}.00</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveStep(0);
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase tracking-wider rounded-lg text-center"
              >
                Publish New Pool Ride
              </button>
            </div>
          );

        default:
          return null;
      }
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* LEFT SIDE: Flow control description and actions (Cols: 7) */}
      <div className="xl:col-span-7 space-y-6">
        {/* Flow selector buttons */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2 flex flex-wrap gap-1.5 shadow-sm">
          <button
            onClick={() => selectFlow('driver')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeFlow === 'driver'
                ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Car size={16} className={activeFlow === 'driver' ? "text-slate-950" : "text-amber-500"} />
            <span>Driver Dispatch Flow</span>
          </button>
          <button
            onClick={() => selectFlow('carpool')}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeFlow === 'carpool'
                ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <GitBranch size={16} className={activeFlow === 'carpool' ? "text-slate-950" : "text-amber-500"} />
            <span>Intercity Carpool Flow</span>
          </button>
        </div>

        {/* Current Flow Card Detail */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-400/10 text-amber-500">
                {activeFlow === 'driver' && <Car size={20} />}
                {activeFlow === 'carpool' && <GitBranch size={20} />}
              </span>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{currentFlow.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{currentFlow.desc}</p>
              </div>
            </div>
          </div>

          {/* Stepper Progress indicator */}
          <div className="relative pl-6 space-y-6 border-l border-slate-200">
            {currentFlow.steps.map((step, idx) => {
              const isPassed = idx < activeStep;
              const isCurrent = idx === activeStep;
              
              return (
                <div 
                  key={idx} 
                  onClick={() => {
                    setActiveStep(idx);
                    setToast({ message: `Switched to Step ${idx + 1}: ${step.title}`, type: 'info' });
                  }}
                  className={`relative group cursor-pointer transition-all ${
                    isCurrent ? "scale-[1.01]" : ""
                  }`}
                >
                  {/* Stepper bullet indicator */}
                  <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isPassed 
                      ? "bg-emerald-500 border-emerald-500 text-white" 
                      : isCurrent 
                        ? "bg-white border-[#ffd15c] text-amber-500 shadow-xs" 
                        : "bg-white border-slate-200 text-slate-300 group-hover:border-slate-300"
                  }`}>
                    {isPassed ? (
                      <Check size={8} strokeWidth={4} />
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-amber-400' : 'bg-transparent'}`} />
                    )}
                  </span>

                  <div className={`p-4 rounded-2xl border transition-all ${
                    isCurrent 
                      ? "bg-slate-50/80 border-slate-200 shadow-xs" 
                      : "bg-white border-transparent hover:bg-slate-50/40"
                  }`}>
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-extrabold uppercase tracking-widest ${
                        isCurrent ? "text-slate-900" : "text-slate-400"
                      }`}>
                        STEP 0{idx + 1} • {step.title}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {isCurrent && "ACTIVE WALKTHROUGH"}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${isCurrent ? "text-slate-600" : "text-slate-400"}`}>
                      {step.desc}
                    </p>

                    {isCurrent && (
                      <div className="mt-4 pt-3.5 border-t border-slate-200/60 space-y-3">
                        <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3 text-[11px] leading-relaxed text-amber-900">
                          <span className="font-extrabold uppercase text-[9px] tracking-wider text-amber-800 block mb-0.5">🚀 Simulation Guidance</span>
                          {step.highlight}
                        </div>

                        <div className="bg-slate-900 text-slate-200 p-2.5 rounded-xl text-[10px] font-mono leading-normal space-y-1">
                          <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Ecosystem APIs & Sockets</span>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Database size={12} className="text-amber-400 shrink-0" />
                            <span className="break-all">{step.technical}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom navigation controllers */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handlePrevStep}
              disabled={activeStep === 0}
              className="px-4 py-2 border border-slate-200 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous Step
            </button>
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-[#ffd15c] hover:bg-yellow-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              {activeStep < currentFlow.steps.length - 1 ? (
                <>
                  Next Step
                  <ArrowRight size={13} strokeWidth={3} />
                </>
              ) : (
                "Finish Flow Walkthrough"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: High-Fidelity App Screen Simulation Mockup (Cols: 5) */}
      <div className="xl:col-span-5 flex flex-col items-center justify-center p-2">
        <div className="text-center mb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Interactive Mockup</p>
          <p className="text-xs text-slate-500 mt-0.5">Changes dynamically based on left steps</p>
        </div>

        {/* Outer Phone Mockup frame */}
        <div className="w-[310px] h-[610px] bg-slate-950 rounded-[45px] p-3 border-[6px] border-slate-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col shrink-0 select-none">
          {/* Top Speaker/Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-950 rounded-b-2xl z-40 flex items-center justify-center">
            <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
          </div>

          {/* Screen Content Wrapper */}
          <div className="flex-1 bg-white rounded-[35px] overflow-hidden flex flex-col relative text-xs pt-4">
            {/* Status Bar */}
            <div className="h-5 flex items-center justify-between px-5 text-[8px] font-black text-slate-400 font-mono shrink-0 z-20">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1">
                <span className="text-[7px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-mono">5G LTE</span>
                <span>100%</span>
              </div>
            </div>

            {/* Dynamic Simulated View */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {renderAppMockup()}
            </div>
          </div>
        </div>
      </div>

      {/* FULL WIDTH SYSTEM ARCHITECTURE & DETAILED WORKFLOWS DIARY */}
      <div className="col-span-1 xl:col-span-12 mt-8 border-t border-slate-200/80 pt-8 space-y-6 text-left">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="text-amber-500 animate-pulse" size={20} />
              Platform Flows Cookbook & Integration Manual
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Step-by-step application flows and real-time WebSocket sequences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Flow 1: Driver Dispatch & Compliance */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Car size={16} />
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">1. Driver Dispatch & Compliance Lifecycle</h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Operational Workflow Specs</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5 relative pl-4 border-l-2 border-emerald-500/20">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="font-extrabold text-slate-900">Step 01 • KYC Compliance & Identity Audit</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Fleet operators upload paper files (License, RC, PAN) and undergoes real-time facial audit validation. Once approved, the system unlocks the interactive <strong>On-Duty Switch</strong> state.
                  </p>
                  <span className="inline-block text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">GET /api/admin/drivers • POST /api/admin/drivers/verify</span>
                </div>

                <div className="space-y-1.5 relative pl-4 border-l-2 border-emerald-500/20">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="font-extrabold text-slate-900">Step 02 • High-Frequency Radar Scan (Go Online)</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Registers active driver coordinates in geolocation grid.
                  </p>
                  <span className="inline-block text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">WS: "driver_coordinates_sync" • GET /api/trips/offers</span>
                </div>

                <div className="space-y-1.5 relative pl-4 border-l-2 border-emerald-500/20">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="font-extrabold text-slate-900">Step 03 • Ride Offer Dispatch & Lock</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Ride offers with dynamic revenue, distance, and rider rating.
                  </p>
                  <span className="inline-block text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">WS: "new_trip_alert" • POST /api/trips/accept</span>
                </div>

                <div className="space-y-1.5 relative pl-4 border-l-2 border-emerald-500/20">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="font-extrabold text-slate-900">Step 04 • Transit Security OTP Handshake</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    To safeguard rider coordinates and block fraudulent bookings, drivers must insert the rider's unique 4-digit security code (e.g., <strong>7749</strong>) to release the active transit navigation state.
                  </p>
                  <span className="inline-block text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">POST /api/trips/start (OTP Verify Payload)</span>
                </div>

                <div className="space-y-1.5 relative pl-4">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="font-extrabold text-slate-900">Step 05 • Revenue Settlement & Wallet Withdraw</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Automatic fare calculation, tolls, and instant wallet credit.
                  </p>
                  <span className="inline-block text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">POST /api/trips/complete • POST /api/payouts/withdraw</span>
                </div>
              </div>
            </div>

            {/* Flow 2: Intercity Share & Chat Pool */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <GitBranch size={16} />
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">2. Intercity Share & Chat Pool Lifecycle</h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Operational Workflow Specs</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5 relative pl-4 border-l-2 border-indigo-500/20">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-indigo-600" />
                  <p className="font-extrabold text-slate-900">Step 01 • Route Publishing & Price Split</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Publish upcoming highway travel plans and seat availability.
                  </p>
                  <span className="inline-block text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">POST /api/intercity/publish</span>
                </div>

                <div className="space-y-1.5 relative pl-4 border-l-2 border-indigo-500/20">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-indigo-600" />
                  <p className="font-extrabold text-slate-900">Step 02 • Seat Matching & Co-Traveler Request</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Search intercity schedules and request seat reservations.
                  </p>
                  <span className="inline-block text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">POST /api/intercity/book-seat</span>
                </div>

                <div className="space-y-1.5 relative pl-4 border-l-2 border-indigo-500/20">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-indigo-600" />
                  <p className="font-extrabold text-slate-900">Step 03 • Zero-Latency Coordination Chat</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Instant WebSocket chat to coordinate pick-up locations.
                  </p>
                  <span className="inline-block text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">WS: "new_chat_message" • POST /api/chat/send</span>
                </div>

                <div className="space-y-1.5 relative pl-4 border-l-2 border-indigo-500/20">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-indigo-600" />
                  <p className="font-extrabold text-slate-900">Step 04 • Co-Rider Audits & Seat Approvals</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Inspect requester profile, Aadhaar badge, and confirm booking.
                  </p>
                  <span className="inline-block text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">POST /api/intercity/approve-booking</span>
                </div>

                <div className="space-y-1.5 relative pl-4">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-indigo-600" />
                  <p className="font-extrabold text-slate-900">Step 05 • Shared Route Completion & CO₂ Offset</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Journey settlement and carbon credit profile scorecard.
                  </p>
                  <span className="inline-block text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-semibold">POST /api/intercity/complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
