import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Check, X, Car, Shield, Compass, Sparkles, Pause, Play, ChevronLeft,
  MapPin, ShieldCheck, Gift, Wallet, Clock, Heart, Star, Zap, Award, CheckCircle,
  TrendingUp, Users, Smartphone, Navigation
} from 'lucide-react';
import { OnboardingSlide } from '../types';
import { useConfig } from '../lib/ConfigContext';

interface OnboardingModalProps {
  slides?: OnboardingSlide[];
  onClose: () => void;
  onFinish: () => void;
  allowSkip?: boolean;
  appMode?: 'rider' | 'driver';
  isEmbeddedPreview?: boolean;
}

// Icon mapping helper
const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Car,
  ShieldCheck,
  Shield,
  MapPin,
  Compass,
  Gift,
  Wallet,
  Clock,
  Heart,
  Sparkles,
  Star,
  Zap,
  Award,
  CheckCircle,
  TrendingUp,
  Users,
  Smartphone,
  Navigation
};

const DEFAULT_RIDER_SLIDES: OnboardingSlide[] = [
  {
    id: 's_r1',
    title: 'Book Rides in Seconds',
    subtitle: 'Choose your pickup & dropoff location, pick your preferred cab tier, and get matched with verified top-rated drivers nearby.',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80',
    iconName: 'Car',
    buttonText: 'Next: Live Tracking ➔',
    durationSeconds: 5,
    showSkip: true,
    active: true,
    order: 1,
    targetAudience: 'rider'
  },
  {
    id: 's_r2',
    title: 'Real-Time Live Tracking',
    subtitle: 'Track your vehicle on an interactive live map with real-time turn-by-turn telemetry, live ETA, and instant driver chat.',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&auto=format&fit=crop&q=80',
    iconName: 'Compass',
    buttonText: 'Next: Cashless Wallet ➔',
    durationSeconds: 5,
    showSkip: true,
    active: true,
    order: 2,
    targetAudience: 'rider'
  },
  {
    id: 's_r3',
    title: 'Seamless Digital Wallet',
    subtitle: 'Pay effortlessly with in-app wallet cash, UPI, or cards. Earn cashback rewards, referral bonuses, and transparent receipts.',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    iconName: 'Wallet',
    buttonText: 'Next: Safety First ➔',
    durationSeconds: 5,
    showSkip: true,
    active: true,
    order: 3,
    targetAudience: 'rider'
  },
  {
    id: 's_r4',
    title: '24/7 Verified Safety & Emergency SOS',
    subtitle: 'Every ride is protected with background-checked drivers, route monitoring, safety pins, and instant 1-tap SOS assistance.',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    iconName: 'ShieldCheck',
    buttonText: 'Get Started Now 🚀',
    durationSeconds: 5,
    showSkip: false,
    active: true,
    order: 4,
    targetAudience: 'rider'
  }
];

const DEFAULT_DRIVER_SLIDES: OnboardingSlide[] = [
  {
    id: 's_d1',
    title: 'Maximize Your Daily Earnings',
    subtitle: 'Go online whenever you choose, accept nearby trip requests automatically, and keep 100% of your fares with zero hidden fees.',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80',
    iconName: 'TrendingUp',
    buttonText: 'Next: Smart Navigation ➔',
    durationSeconds: 5,
    showSkip: true,
    active: true,
    order: 1,
    targetAudience: 'driver'
  },
  {
    id: 's_d2',
    title: 'Turn-by-Turn GPS Guidance',
    subtitle: 'Navigate traffic with real-time GPS routing, automatic surge map zone alerts, and seamless passenger pickup locations.',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop&q=80',
    iconName: 'Navigation',
    buttonText: 'Next: Instant Payouts ➔',
    durationSeconds: 5,
    showSkip: true,
    active: true,
    order: 2,
    targetAudience: 'driver'
  },
  {
    id: 's_d3',
    title: 'Instant Daily Bank Payouts',
    subtitle: 'Withdraw your daily driver earnings directly to your bank account anytime with 1-tap instant payout processing.',
    mediaType: 'image',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    iconName: 'Wallet',
    buttonText: 'Start Driving Now 🚘',
    durationSeconds: 5,
    showSkip: false,
    active: true,
    order: 3,
    targetAudience: 'driver'
  }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  slides = [],
  onClose,
  onFinish,
  allowSkip = true,
  appMode = 'rider',
  isEmbeddedPreview = false
}) => {
  const { config } = useConfig();

  // If provided slides is empty or filtered out, fall back to default slides
  const configuredActiveSlides = (slides || []).filter(s => s.active !== false);
  const activeSlides = configuredActiveSlides.length > 0 
    ? configuredActiveSlides 
    : (appMode === 'driver' ? DEFAULT_DRIVER_SLIDES : DEFAULT_RIDER_SLIDES);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];
  const duration = (currentSlide?.durationSeconds || 5) * 1000;

  useEffect(() => {
    if (!currentSlide || activeSlides.length === 0 || isPaused) return;

    setProgress(0);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        handleNext();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, duration, activeSlides.length, isPaused]);

  const handleNext = () => {
    if (currentIndex < activeSlides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const isLastSlide = currentIndex === activeSlides.length - 1;
  const canSkip = (allowSkip || currentSlide?.showSkip !== false) && !isLastSlide;

  // Resolve Icon component
  const SelectedIcon = currentSlide?.iconName && ICON_MAP[currentSlide.iconName] 
    ? ICON_MAP[currentSlide.iconName] 
    : (appMode === 'driver' ? ShieldCheck : Car);

  const content = (
    <div 
      className="w-full h-full flex flex-col justify-between overflow-hidden relative font-sans select-none bg-slate-950 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Controls & Progress Bar */}
      <div className="pt-6 px-6 z-20 shrink-0 space-y-4">
        {/* Progress Bar Segments */}
        <div className="flex gap-1.5 items-center w-full">
          {activeSlides.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/15 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-400 rounded-full transition-all duration-75"
                style={{
                  width: idx < currentIndex ? '100%' : (idx === currentIndex ? `${progress}%` : '0%')
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header Items: App Mode Badge & Close/Skip Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-lg shadow-2xs">
              {appMode === 'driver' ? 'Driver Walkthrough' : 'Rider Walkthrough'}
            </span>
            <span className="text-[10px] font-mono text-slate-400 font-bold">
              {currentIndex + 1} / {activeSlides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canSkip && (
              <button
                type="button"
                onClick={onFinish}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold rounded-full transition-all cursor-pointer backdrop-blur-md border border-white/10"
              >
                Skip
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Body */}
      <div className="flex-1 min-h-0 px-6 py-4 flex flex-col items-center justify-center text-center relative overflow-y-auto z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id || currentIndex}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md flex flex-col items-center justify-center space-y-6 my-auto"
          >
            {/* Visual Hero Container */}
            <div className="w-full max-w-xs h-60 sm:h-64 rounded-3xl overflow-hidden relative border border-white/15 bg-slate-900 shadow-2xl flex items-center justify-center p-2 group">
              {currentSlide?.mediaType === 'icon' ? (
                <div className="w-28 h-28 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-lg">
                  <SelectedIcon size={56} className="text-amber-400" />
                </div>
              ) : (
                <img
                  src={currentSlide.imageUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80'}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop&q=80';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs font-mono">
                <span className="flex items-center gap-1.5 bg-slate-950/70 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
                  <SelectedIcon size={14} className="text-amber-400" />
                  <span className="font-bold text-[10px] uppercase tracking-wider">{currentSlide.title}</span>
                </span>
              </div>
            </div>

            {/* Slide Title & Description */}
            <div className="space-y-2.5 px-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                {currentSlide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-sm mx-auto">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-2 items-center pt-2">
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={`transition-all duration-300 cursor-pointer ${
                    i === currentIndex 
                      ? 'w-7 h-2 bg-amber-400 rounded-full' 
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60 rounded-full'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action Footer */}
      <div className="p-6 pt-2 z-20 shrink-0 space-y-3 max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={handleNext}
          className="w-full py-4 px-6 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] border border-amber-500"
        >
          <span>{currentSlide.buttonText || (isLastSlide ? "Get Started Now 🚀" : "Continue ➔")}</span>
          {isLastSlide ? <Check size={18} className="stroke-[3]" /> : <ArrowRight size={18} className="stroke-[3]" />}
        </button>

        {currentIndex > 0 && (
          <div className="text-center">
            <button
              type="button"
              onClick={handlePrev}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer py-1"
            >
              <ChevronLeft size={14} />
              <span>Previous Slide</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (isEmbeddedPreview) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-[10010] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-0 sm:p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-md h-full sm:h-[680px] sm:max-h-[90vh] sm:rounded-[36px] overflow-hidden shadow-2xl border border-white/10 relative">
        {content}
      </div>
    </div>
  );
};


