import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Minus, Plus, ChevronDown, Check, Zap, AlertCircle, Shield,
  Info, Wallet, ShieldAlert, Share2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { soundService } from '../services/systemService';
import { useConfig } from '../lib/ConfigContext';

// Helper to parse duration string like "3h 15m" or "45m" into minutes
const parseDuration = (durationStr: string): number => {
  let totalMinutes = 0;
  const hoursMatch = durationStr.match(/(\d+)\s*h/);
  const minutesMatch = durationStr.match(/(\d+)\s*m/);
  
  if (hoursMatch) totalMinutes += parseInt(hoursMatch[1]) * 60;
  if (minutesMatch) totalMinutes += parseInt(minutesMatch[1]);
  
  if (!hoursMatch && !minutesMatch && /^\d+$/.test(durationStr)) {
    totalMinutes = parseInt(durationStr);
  }
  
  return totalMinutes || 30; // Default to 30 mins
};

// Helper to get 24h start and end times dynamically
const getTripTimes = (startTimeStr: string, durationStr: string) => {
  if (startTimeStr.toLowerCase() === 'now' || startTimeStr.toLowerCase() === 'instant') {
    const now = new Date();
    const startTotalMins = now.getHours() * 60 + now.getMinutes();
    const durationMins = parseDuration(durationStr);
    const endTotalMins = (startTotalMins + durationMins) % 1440;
    
    const formatTime = (totalMins: number) => {
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };
    
    return {
      start: formatTime(startTotalMins),
      end: formatTime(endTotalMins)
    };
  }
  try {
    const cleanTime = startTimeStr.replace(/([AP]M)/i, ' $1').trim();
    const parts = cleanTime.split(' ');
    const time = parts[0];
    const modifier = parts[1];
    
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    const startTotalMins = hours * 60 + (minutes || 0);
    const durationMins = parseDuration(durationStr);
    const endTotalMins = (startTotalMins + durationMins) % 1440;
    
    const formatTime = (totalMins: number) => {
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };
    
    return {
      start: formatTime(startTotalMins),
      end: formatTime(endTotalMins)
    };
  } catch (e) {
    return { start: '11:10', end: '14:40' };
  }
};

interface BookingFlowSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  appMode: 'rider' | 'driver';
  userProfile: any;
  onCompleteSimulation: (otp: string, seatsSelected?: number) => void;
  onShowTerms?: () => void;
}

export const BookingFlowSimulator: React.FC<BookingFlowSimulatorProps> = ({
  isOpen,
  onClose,
  post,
  onCompleteSimulation,
  onShowTerms
}) => {
  const { config } = useConfig();
  const initialSeats = post.seats || 1;
  const parseSeatsAvailable = parseInt(post.seatsAvailable) || 4;
  const maxAvailableSeats = post.seats ? post.seats : parseSeatsAvailable;
  const [selectedSeats, setSelectedSeats] = useState<number>(initialSeats);
  const [isBeforeYouGoOpen, setIsBeforeYouGoOpen] = useState<boolean>(false);
  const [isBookingDone, setIsBookingDone] = useState<boolean>(false);

  if (!isOpen) return null;

  // Calculate prices
  const isRiderRequest = post.type === 'request' || !!post.seats;
  const unitPrice = isRiderRequest && post.seats 
    ? Math.round((post.price || 480) / post.seats) 
    : (post.price || 480);
  const totalPrice = unitPrice * selectedSeats;
  const distance = post.distance || "18";
  const duration = post.duration || "45m";
  const tripDate = post.date || "Sunday, 24 May";

  // Calculate start & end times using getTripTimes maps correctly
  const isInstant = post.isInstant || post.time === 'Instant' || post.time === 'Now';
  const tripDeparture = post.departureTime || post.time || '11:10';
  const times = getTripTimes(isInstant ? 'Now' : tripDeparture, duration);

  // Driver details
  const driverName = post.user || "Aryan Singhania (Rider)";
  const driverRating = post.rating || "4.8";
  const driverVehicle = post.vehicle || "Maruti Swift";
  const driverInitials = driverName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || "AS";

  const handleMinus = () => {
    if (selectedSeats > 1) {
      setSelectedSeats(prev => prev - 1);
    }
  };

  const handlePlus = () => {
    if (selectedSeats < maxAvailableSeats) {
      setSelectedSeats(prev => prev + 1);
    }
  };

  const handleBookNow = () => {
    setIsBookingDone(true);
    try {
      soundService.playSuccess();
    } catch (e) {}

    setTimeout(() => {
      const simulatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      onCompleteSimulation(simulatedOtp, selectedSeats);
    }, 1000);
  };

  return (
    <div className="absolute inset-0 bg-white z-[12000] flex flex-col font-sans overflow-hidden w-full h-full rounded-inherit animate-in fade-in zoom-in-95 duration-200">
      {/* Sticky Compact Header */}
      <div className="px-4 py-3 border-b border-hairline-soft flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            id="btn_back_booking_details"
            className="w-8 h-8 rounded-full bg-surface-soft hover:bg-surface-card border border-hairline flex items-center justify-center text-secondary transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
          </button>
          <span className="text-sm font-black text-secondary tracking-tight">
            Booking details
          </span>
        </div>
        <div className="text-[10px] font-black text-mute bg-surface-soft px-2.5 py-1 rounded-full border border-hairline-soft">
          {tripDate}
        </div>
      </div>

      {/* Main content scroll area with optimized compact layout */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
        
        {/* Dynamic Route Timings & Info - Map and details mapped exactly */}
        <div className="space-y-2.5 relative pl-1">
          
          {/* Pickup Block */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center pt-1.5 w-4 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white" />
              <div className="w-[1.5px] h-6 bg-hairline-soft mt-1" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-secondary bg-surface-soft px-1.5 py-0.5 rounded border border-hairline-soft">{times.start}</span>
                <span className="text-[9px] text-mute font-bold">{tripDate}</span>
              </div>
              <h3 className="text-xs font-black text-secondary mt-0.5 leading-normal">{post.from || 'Secunderabad'}</h3>
              <p className="text-[9px] text-mute font-bold uppercase tracking-wider">Jubilee Bus Station</p>
            </div>
          </div>

          {/* Dynamic Middle Connector with the stats badge inside */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center w-4 shrink-0">
              <div className="w-[1.5px] h-6 bg-hairline-soft" />
            </div>
            <div className="py-0.5">
              <span className="text-[9px] text-primary font-black uppercase tracking-widest bg-primary/5 border border-primary/20 px-2.5 py-0.5 rounded-full">
                {distance} KM • {duration} • APPROX
              </span>
            </div>
          </div>

          {/* Destination Block */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center w-4 shrink-0">
              <div className="w-[1.5px] h-4 bg-hairline-soft mb-1" />
              <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-secondary bg-surface-soft px-1.5 py-0.5 rounded border border-hairline-soft">{times.end}</span>
                <span className="text-[9px] text-mute font-bold">{tripDate}</span>
              </div>
              <h3 className="text-xs font-black text-secondary mt-0.5 leading-normal">{post.to || 'Peddapalli'}</h3>
              <p className="text-[9px] text-mute font-bold uppercase tracking-wider">Bus Stand Road</p>
            </div>
          </div>

        </div>

        <div className="h-[1px] bg-hairline-soft" />

        {/* Verified Driver & Vehicle Identity Row */}
        <div className="flex items-center justify-between py-1 px-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xs tracking-widest shrink-0">
              {driverInitials}
            </div>
            <div>
              <h4 className="text-xs font-black text-secondary">{driverName}</h4>
              <div className="flex items-center gap-1.5 text-[10px] text-mute font-bold">
                <span className="text-amber-500">★</span>
                <span>{driverRating}</span>
                <span className="text-hairline-soft">•</span>
                <span>{driverVehicle}</span>
              </div>
            </div>
          </div>
          
          <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <Shield size={12} className="fill-current" />
          </div>
        </div>

        <div className="h-[1px] bg-hairline-soft" />

        {/* Flat Un-boxed Seats Control Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-secondary tracking-tight uppercase">Select Seats</h4>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleMinus}
                disabled={selectedSeats <= 1}
                className={cn(
                  "w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer",
                  selectedSeats <= 1 
                    ? "border-hairline-soft text-ash opacity-30 cursor-not-allowed bg-transparent" 
                    : "border-hairline text-secondary hover:bg-surface-soft bg-canvas"
                )}
              >
                <Minus size={12} strokeWidth={3} />
              </button>

              <span className="text-sm font-black text-secondary font-mono w-4 text-center">
                {selectedSeats}
              </span>

              <button
                onClick={handlePlus}
                disabled={selectedSeats >= maxAvailableSeats}
                className={cn(
                  "w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer",
                  selectedSeats >= maxAvailableSeats 
                    ? "border-hairline-soft text-ash opacity-30 cursor-not-allowed bg-transparent" 
                    : "border-hairline text-secondary hover:bg-surface-soft bg-canvas"
                )}
              >
                <Plus size={12} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Informational lines customized & dynamic price aligned to exact right & highlighted */}
          <div className="text-[10px] space-y-1.5 font-bold">
            <div className="text-mute uppercase tracking-wider">
              {maxAvailableSeats} seats remaining
            </div>
            <div className="flex items-center justify-between font-black text-sm pt-0.5">
              <span className="text-secondary text-xs">
                {selectedSeats} {selectedSeats === 1 ? 'seat' : 'seats'} selected
              </span>
              <span className="text-[#ff3b30] dark:text-red-400 font-extrabold uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-md text-[10px] shadow-3xs">
                ₹{unitPrice} × {selectedSeats} = ₹{totalPrice}
              </span>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-hairline-soft" />

        {/* FARE SUMMARY */}
        <div className="space-y-1.5">
          <h4 className="text-[9px] font-black text-ash uppercase tracking-widest font-mono">
            FARE SUMMARY
          </h4>
          
          <div className="space-y-1 font-bold text-[11px] text-body">
            <div className="flex justify-between">
              <span>{selectedSeats} {selectedSeats === 1 ? 'seat' : 'seats'} × ₹{unitPrice}</span>
              <span className="text-secondary font-black">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Distance</span>
              <span className="text-secondary">{distance} km</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="text-secondary">Cash to driver</span>
            </div>
          </div>

          {/* Total Price Due highlighted beautifully inside a premium card row block */}
          <div className="flex justify-between items-center py-2.5 px-3 bg-[#ff3b30]/5 dark:bg-rose-950/20 rounded-xl border border-[#ff3b30]/15 mt-1.5">
            <span className="text-xs font-black text-[#ff3b30] dark:text-red-400 uppercase tracking-wider">Approx price due</span>
            <span className="text-lg font-black text-[#ff3b30] dark:text-rose-400">₹{totalPrice}</span>
          </div>
        </div>

        {/* Before you go info check dropdown */}
        <div className="border border-hairline-soft rounded-xl overflow-hidden bg-surface-soft/40">
          <button
            type="button"
            onClick={() => setIsBeforeYouGoOpen(!isBeforeYouGoOpen)}
            className="w-full px-3 py-2.5 flex items-center justify-between font-black text-[9.5px] text-secondary uppercase tracking-wider hover:bg-surface-soft transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <span className="p-0.5 bg-[#f6ab2e]/10 text-[#e69b1e] rounded">
                <AlertCircle size={10} />
              </span>
              <span>Before you go info</span>
            </div>
            <ChevronDown 
              size={12} 
              className={cn("text-mute transition-transform", isBeforeYouGoOpen && "rotate-180")} 
              />
          </button>
          
          <AnimatePresence>
            {isBeforeYouGoOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-hairline-soft bg-white"
              >
                <div className="p-4 space-y-4">
                  {(config.beforeGoInfo || []).map((item) => {
                    let IconComponent = Info;
                    let iconColorClass = "text-[#e69b1e]";
                    let bgClass = "bg-[#f6ab2e]/10";
                    
                    if (item.icon === 'wallet') {
                      IconComponent = Wallet;
                    } else if (item.icon === 'verify') {
                      IconComponent = ShieldAlert;
                    } else if (item.icon === 'share') {
                      IconComponent = Share2;
                    }

                    if (item.color === 'blue') {
                      iconColorClass = "text-[#3272d1]";
                      bgClass = "bg-[#3272d1]/10";
                    } else if (item.color === 'pink') {
                      iconColorClass = "text-[#ff3b30]";
                      bgClass = "bg-[#ff3b30]/10";
                    } else if (item.color === 'gold') {
                      iconColorClass = "text-[#e69b1e]";
                      bgClass = "bg-[#f6ab2e]/10";
                    }

                    return (
                      <div key={item.id} className="flex gap-3.5 items-start">
                        <span className={cn("w-7 h-7 rounded-full shrink-0 flex items-center justify-center", bgClass)}>
                          <IconComponent size={13} className={iconColorClass} />
                        </span>
                        <div className="text-secondary text-[10.5px] leading-relaxed font-medium">
                          <strong className="font-extrabold text-[#111111] mr-1">{item.title}</strong>
                          <span>{item.subtitle}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Disclaimer terms and CTA footer */}
        <div className="pt-1.5 text-center space-y-2.5 pb-4">
          <p className="text-[9.5px] text-mute font-bold leading-normal">
            By booking you agree to our{" "}
            <span 
              onClick={onShowTerms}
              className="text-primary hover:underline cursor-pointer underline font-extrabold"
            >
              terms & conditions
            </span>
          </p>

          <button
            onClick={handleBookNow}
            disabled={isBookingDone}
            className={cn(
              "w-full h-11 rounded-xl font-black text-xs uppercase tracking-widest shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2",
              isBookingDone 
                ? "bg-emerald-500 text-white shadow-emerald-500/10" 
                : "bg-primary text-black hover:bg-primary-dark shadow-primary/10"
            )}
          >
            {isBookingDone ? (
              <>
                <Check size={14} strokeWidth={3} className="animate-pulse" />
                <span>Trip Booked Successfully!</span>
              </>
            ) : (
              <>
                <Zap size={10} fill="currentColor" />
                <span>Confirm Book • ₹{totalPrice}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
