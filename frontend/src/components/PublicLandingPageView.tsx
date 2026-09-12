import React, { useState, useEffect, useRef } from 'react';
import { BlogPost, LandingPageConfig, LandingFeatureCard, LandingTestimonial } from '../types';
import { useConfig } from '../lib/ConfigContext';
import { BrandLogo } from './BrandLogo';
import { 
  Globe, Zap, ShieldCheck, CheckCircle2, MapPin, Star, HelpCircle, 
  BookOpen, ArrowRight, Smartphone, ChevronRight, User, Calendar, 
  ArrowLeft, Share2, Sparkles, Car, Shield, MessageSquare, Download,
  ChevronDown, Heart, Eye, ArrowUp, Layers, Home, ChevronLeft, Award,
  DollarSign, ShieldAlert, Check, Users, Navigation, CreditCard,
  ThumbsUp, TrendingUp, Clock, AlertTriangle, PhoneCall, Search, Filter, X
} from 'lucide-react';
import { cn } from '../lib/utils';

interface PublicLandingPageViewProps {
  onLaunchApp: () => void;
  onOpenRiderLogin?: () => void;
  onOpenDriverLogin?: () => void;
}

const DEFAULT_FEATURE_CARDS: LandingFeatureCard[] = [
  // RIDER CARDS
  {
    id: "f1",
    title: "Instant City Cabs & Auto Pickup",
    badge: "24/7 LIVE GPS",
    audience: "rider",
    subtitle: "Book city rides, bike taxis, and auto-rickshaws in seconds with verified drivers near you.",
    desc: "1-tap booking with real-time GPS tracking and guaranteed zero driver cancellations.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000",
    ctaText: "Book City Ride",
    icon: "Zap"
  },
  {
    id: "f2",
    title: "Pre-Scheduled Airport Transfers",
    badge: "ZERO DELAY GUARANTEE",
    audience: "rider",
    subtitle: "Flight-tracked terminal drop-offs with luggage assistance and pre-scheduled pickup times.",
    desc: "Pre-book up to 7 days in advance with live flight tracking and guaranteed arrival buffers.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
    ctaText: "Schedule Airport Transfer",
    icon: "MapPin"
  },
  {
    id: "f3",
    title: "Upfront Fixed Fares & Zero Surge",
    badge: "NO HIDDEN SURGE",
    audience: "rider",
    subtitle: "Guaranteed fixed fares calculated upfront before trip start with zero post-ride extra fees.",
    desc: "Know your exact ride cost upfront. What you see on screen is the exact price you pay.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1000",
    ctaText: "View Fixed Fare Rides",
    icon: "CreditCard"
  },
  {
    id: "f4",
    title: "24/7 Emergency SOS & Safety Shield",
    badge: "POLICE VERIFIED",
    audience: "rider",
    subtitle: "4-digit OTP trip authentication, live GPS trip sharing, and 1-tap SOS emergency dispatch.",
    desc: "Biometric verified drivers, encrypted trip logs, and 24/7 emergency hotline protection.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
    ctaText: "Explore Safety Shield",
    icon: "ShieldCheck"
  },

  // DRIVER CARDS
  {
    id: "f5",
    title: "0% Commission Driver Subscription",
    badge: "KEEP 100% FARES",
    audience: "driver",
    subtitle: "Earn up to ₹45,000+ monthly with flat 0% commission plans instead of heavy percentage cuts.",
    desc: "Keep 100% of passenger trip fares with simple daily or monthly driver subscriptions.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1000",
    ctaText: "Join as Driver Partner",
    icon: "DollarSign"
  },
  {
    id: "f6",
    title: "24/7 Instant UPI Bank Cashout",
    badge: "5-SECOND TRANSFER",
    audience: "driver",
    subtitle: "Transfer trip earnings directly to any UPI bank account anytime, day or night, in 5 seconds.",
    desc: "No weekly waiting cycles. Withdraw your earnings straight to Google Pay or PhonePe instantly.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1000",
    ctaText: "Explore Instant Cashout",
    icon: "Zap"
  },
  {
    id: "f7",
    title: "Peak Hour Multipliers & Daily Bonus",
    badge: "2.5X FARE BOOST",
    audience: "driver",
    subtitle: "Boost earnings with up to 2.5x fare multipliers during morning and evening rush hours.",
    desc: "Complete daily trip target milestones to unlock extra cash bonuses and priority dispatches.",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1000",
    ctaText: "See Peak Fare Bonuses",
    icon: "TrendingUp"
  },
  {
    id: "f8",
    title: "Fleet Owner & Multi-Vehicle Platform",
    badge: "ATTACH UNLIMITED CABS",
    audience: "driver",
    subtitle: "Attach multiple cars, autos, or bikes to your operator fleet account and track revenue live.",
    desc: "Manage multiple driver partners, monitor trip performance, and automate payout distributions.",
    image: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=1000",
    ctaText: "Register Fleet Vehicles",
    icon: "Car"
  }
];

const DEFAULT_TESTIMONIALS: LandingTestimonial[] = [
  {
    id: "t1",
    name: "Ananya Sharma",
    role: "Daily Airport Commuter",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    comment: "The airport express transfer pre-booking is unbeatable! On-time pickup at 4 AM with zero delay, clean AC sedan, and zero driver cancellations.",
    audience: "rider",
    highlightText: "Completed 35+ Airport Trips"
  },
  {
    id: "t2",
    name: "Rajesh Kumar",
    role: "Partner Driver",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    comment: "Instant UPI payouts after every ride and 0% commission! My monthly income went up 35% after switching to TaxiApp.",
    audience: "driver",
    highlightText: "Earned ₹48,500 Last Month"
  },
  {
    id: "t3",
    name: "Priya Nair",
    role: "Late Night Commuter",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    comment: "The 4-digit OTP trip start and 24/7 SOS safety shield give my family complete peace of mind during late night office return rides.",
    audience: "rider",
    highlightText: "Uses 24/7 SOS Safety Shield"
  },
  {
    id: "t4",
    name: "Suresh Patel",
    role: "Fleet Operator (10 Cabs)",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    comment: "Managing my 10 cabs with zero-commission monthly plans has been seamless. High ride demand and prompt driver support.",
    audience: "driver",
    highlightText: "10 Cabs Fleet Attached"
  }
];

const DEFAULT_FAQS: { id: string; q: string; a: string; category?: 'driver' | 'rider' | 'safety' | 'payment' | 'general' }[] = [
  // RIDER FAQS
  {
    id: "q1",
    q: "How do I book an instant or pre-scheduled ride?",
    a: "Open the app, enter your pickup & drop destination, select your preferred vehicle category (Bike, Auto, Mini, Sedan, SUV), and confirm! You can also toggle 'Schedule Ride' to pick a time up to 7 days ahead.",
    category: "rider"
  },
  {
    id: "q2",
    q: "Are fares fixed upfront without surge pricing surprises?",
    a: "Yes! Fares are calculated upfront based on actual route distance and traffic estimates. What you see on screen before booking is the exact amount you pay—no post-trip hidden surcharges.",
    category: "rider"
  },
  {
    id: "q3",
    q: "What happens if a driver cancels my booking?",
    a: "We maintain a strict zero driver cancellation policy for scheduled rides. If a driver ever experiences a vehicle issue, our automated smart dispatch system immediately reassigns the nearest online driver at zero extra charge.",
    category: "rider"
  },
  {
    id: "q4",
    q: "Can I book a cab for a family member or friend?",
    a: "Yes! Simply tap 'Book for Someone Else' during pickup selection, enter their contact name and phone number, and they will receive SMS trip updates, driver location link, and OTP directly on their phone.",
    category: "rider"
  },
  {
    id: "q5",
    q: "What vehicle options are available on TaxiApp?",
    a: "We offer 5 flexible vehicle choices: Quick Bike Taxis for solo commuters, 3-Wheeler Auto Rickshaws for short trips, Compact Minis for budget travel, Comfort Sedans for corporate travel, and 6-Seater SUVs for group/family trips.",
    category: "rider"
  },

  // SAFETY FAQS
  {
    id: "q6",
    q: "How does the 24/7 Emergency SOS Safety Shield work?",
    a: "Tap the Red SOS button on your active trip screen anytime to instantly trigger a priority call to our 24/7 security dispatch desk and automatically broadcast live GPS coordinates to your saved emergency contacts.",
    category: "safety"
  },
  {
    id: "q7",
    q: "Are all drivers background checked and police verified?",
    a: "100% of drivers undergo mandatory background verification, biometric document checks (Aadhaar/DL/RC), and vehicle physical safety checks before accepting passenger rides.",
    category: "safety"
  },
  {
    id: "q8",
    q: "How does the 4-digit Ride OTP protect passengers?",
    a: "Your driver cannot start the ride meter until you share the unique 4-digit OTP displayed on your app screen. This ensures you step into the exact vehicle assigned to your booking.",
    category: "safety"
  },
  {
    id: "q9",
    q: "Can I share my live trip location with friends or family?",
    a: "Yes! Tap 'Share Trip' during any ongoing ride to generate a secure tracking link that lets loved ones view your live location, driver details, and estimated arrival time in real-time.",
    category: "safety"
  },

  // DRIVER FAQS
  {
    id: "q10",
    q: "How do I register as a Driver Partner?",
    a: "Tap 'Driver' in the top header or login screen, upload your Driving License, RC, Vehicle Insurance, and Aadhaar card. Our verification desk will review and approve your account within 2 hours.",
    category: "driver"
  },
  {
    id: "q11",
    q: "What is the 0% commission subscription plan?",
    a: "Instead of giving away 25%–30% of every fare to traditional platforms, TaxiApp drivers pay a small flat daily or monthly subscription fee and keep 100% of all passenger trip fares.",
    category: "driver"
  },
  {
    id: "q12",
    q: "How fast do I receive money in my bank account?",
    a: "Drivers can cash out their wallet earnings 24/7 directly to any UPI bank account (Google Pay, PhonePe, Paytm, BHIM) within 5 seconds with zero withdrawal delay.",
    category: "driver"
  },
  {
    id: "q13",
    q: "Can I attach multiple vehicles as a Fleet Operator?",
    a: "Yes! Fleet operators can attach multiple cars, autos, or bikes under a single master dashboard, assign drivers, track daily fleet earnings, and manage payouts effortlessly.",
    category: "driver"
  },
  {
    id: "q14",
    q: "Are peak hour fare multipliers available?",
    a: "Yes! During morning and evening rush commute hours, drivers receive up to 2.5x fare multipliers along with daily trip target cash bonuses.",
    category: "driver"
  },

  // PAYMENT FAQS
  {
    id: "q15",
    q: "What payment options are supported on TaxiApp?",
    a: "We support UPI payments (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, Netbanking, Digital In-App Wallet balances, and direct Cash on arrival.",
    category: "payment"
  },
  {
    id: "q16",
    q: "How do toll fees and parking charges work?",
    a: "Highway toll taxes and airport parking fees incurred during the trip are transparently added to your invoice as per official government rates and itemized on your digital receipt.",
    category: "payment"
  },
  {
    id: "q17",
    q: "Can I get digital PDF tax invoices for business expense reimbursement?",
    a: "Yes! A detailed GST-compliant digital invoice receipt with trip route map, toll breakdown, and GST details is automatically sent to your registered email after trip completion.",
    category: "payment"
  }
];

export const PublicLandingPageView: React.FC<PublicLandingPageViewProps> = ({
  onLaunchApp,
  onOpenRiderLogin,
  onOpenDriverLogin
}) => {
  const { config } = useConfig();
  const landingConfig: LandingPageConfig = config.landingPage || {
    enabled: true,
    brandName: "TaxiApp",
    brandLogoEmoji: "🚖",
    heroTitle: "Fast, Reliable & Safe Taxi Rides Whenever You Need",
    heroSubtitle: "Book local rides, instant airport transfers, outstation cab journeys, and executive cars with verified top-rated drivers.",
    ctaText: "Book Your Ride Now",
    heroImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800",
    showBlogs: true,
    showTestimonials: true,
    showFaqs: true,
    showAppDownload: true,
    playStoreUrl: "https://play.google.com",
    appStoreUrl: "https://apple.com/app-store",
    seoKeywords: "taxi app, cab booking, airport transfer, outstation cabs, driver earnings",
    features: DEFAULT_FEATURE_CARDS,
    testimonials: DEFAULT_TESTIMONIALS,
    faqs: DEFAULT_FAQS
  };

  const featureCards = (landingConfig.features && landingConfig.features.length > 0)
    ? landingConfig.features
    : DEFAULT_FEATURE_CARDS;

  const testimonials = (landingConfig.testimonials && landingConfig.testimonials.length > 0)
    ? landingConfig.testimonials
    : DEFAULT_TESTIMONIALS;

  const faqs = (landingConfig.faqs && landingConfig.faqs.length > 0)
    ? landingConfig.faqs
    : DEFAULT_FAQS;

  const blogs: BlogPost[] = config.blogsList || [];

  // Tab Navigation: Home -> Overview -> Reviews -> FAQs -> Blogs
  const [activeTab, setActiveTab] = useState<'home' | 'overview' | 'reviews' | 'faqs' | 'blogs'>('home');
  const [readingBlog, setReadingBlog] = useState<BlogPost | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic SEO Page-by-Page Metadata Synchronization & Rich Schema
  useEffect(() => {
    const brand = landingConfig.brandName || (config as any)?.appName || "TaxiApp";
    let title = `${brand} - Instant Cab Booking, Ride Hailing & Fleet Operations`;
    let desc = landingConfig.heroSubtitle || "Book instant city cabs, airport transfers, and outstation trips with verified drivers.";
    let keywords = landingConfig.seoKeywords || "taxi booking, cab app, ride hailing, driver partner, airport taxi";

    if (readingBlog) {
      title = `${readingBlog.title} | ${brand} Travel Blog`;
      desc = readingBlog.excerpt || readingBlog.title;
      keywords = readingBlog.tags?.join(", ") || keywords;
    } else {
      switch (activeTab) {
        case 'overview':
          title = `Features & Operating Model | ${brand}`;
          desc = `Explore 0% commission driver model, upfront fixed fares, 24/7 SOS safety shield, and fleet solutions on ${brand}.`;
          break;
        case 'reviews':
          title = `Verified Passenger & Driver Reviews | ${brand}`;
          desc = `Read authentic rider testimonials and driver partner earnings reviews on ${brand}.`;
          break;
        case 'faqs':
          title = `Help Center & FAQs | ${brand}`;
          desc = `Frequently asked questions about cab bookings, safety shield, 0% commission driver plans, and payments.`;
          break;
        case 'blogs':
          title = `Travel & Cab Safety Blog | ${brand}`;
          desc = `Safety tips, airport transit advice, city navigation, and driver earnings guides.`;
          break;
        case 'home':
        default:
          title = `${brand} - Fast, Safe & Affordable Taxi Rides`;
          desc = landingConfig.heroSubtitle;
          break;
      }
    }

    document.title = title;

    // Update or create Meta Description
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta');
      metaDescTag.setAttribute('name', 'description');
      document.head.appendChild(metaDescTag);
    }
    metaDescTag.setAttribute('content', desc);

    // Update or create Meta Keywords
    let metaKwTag = document.querySelector('meta[name="keywords"]');
    if (!metaKwTag) {
      metaKwTag = document.createElement('meta');
      metaKwTag.setAttribute('name', 'keywords');
      document.head.appendChild(metaKwTag);
    }
    metaKwTag.setAttribute('content', keywords);

    // Update or create OpenGraph tags
    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (!ogTitleTag) {
      ogTitleTag = document.createElement('meta');
      ogTitleTag.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleTag);
    }
    ogTitleTag.setAttribute('content', title);

    let ogDescTag = document.querySelector('meta[property="og:description"]');
    if (!ogDescTag) {
      ogDescTag = document.createElement('meta');
      ogDescTag.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescTag);
    }
    ogDescTag.setAttribute('content', desc);

    // Inject Rich JSON-LD Structured Data Schema for Googlebot SEO
    const schemaData = readingBlog ? {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": readingBlog.title,
      "description": readingBlog.excerpt,
      "image": readingBlog.coverImage,
      "author": {
        "@type": "Person",
        "name": readingBlog.author || "TaxiApp Team"
      },
      "datePublished": readingBlog.date,
      "publisher": {
        "@type": "Organization",
        "name": brand,
        "url": window.location.origin
      }
    } : activeTab === 'faqs' ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.slice(0, 10).map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    } : {
      "@context": "https://schema.org",
      "@type": "TaxiService",
      "name": brand,
      "description": desc,
      "provider": {
        "@type": "Organization",
        "name": brand,
        "url": window.location.origin
      },
      "serviceType": "Cab Booking, Airport Transfer, Driver Subscriptions",
      "areaServed": "Global / Metropolitan Cities"
    };

    let schemaScript = document.getElementById("seo-dynamic-jsonld") as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "seo-dynamic-jsonld";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schemaData);

  }, [activeTab, readingBlog, landingConfig, (config as any)?.appName, faqs]);

  // Automatically scroll main content container to top when changing tabs or reading blogs
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [activeTab, readingBlog]);
  
  // Home Card Audience Filter ('all' | 'rider' | 'driver')
  const [homeAudienceFilter, setHomeAudienceFilter] = useState<'all' | 'rider' | 'driver'>('all');

  // Carousel Slide State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [overviewAudienceSlide, setOverviewAudienceSlide] = useState<'rider' | 'driver' | 'comparison'>('rider');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({ t1: 142, t2: 98, t3: 115, t4: 87 });
  const [votedMap, setVotedMap] = useState<Record<string, boolean>>({});
  const [reviewFilter, setReviewFilter] = useState<'all' | 'rider' | 'driver'>('all');

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<'all' | 'rider' | 'driver' | 'safety' | 'payment'>('all');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');

  // Filter feature cards for Home tab
  const homeCards = featureCards.filter(card => {
    if (homeAudienceFilter === 'all') return true;
    if (card.audience === 'both') return true;
    return card.audience === homeAudienceFilter;
  });

  const riderCards = featureCards.filter(c => c.audience === 'rider' || c.audience === 'both');
  const driverCards = featureCards.filter(c => c.audience === 'driver' || c.audience === 'both');

  const handleHomeAudienceChange = (filter: 'all' | 'rider' | 'driver') => {
    setHomeAudienceFilter(filter);
    setCurrentSlide(0);
  };

  // Auto-play hero feature slider every 5s
  useEffect(() => {
    if (activeTab !== 'home' || homeCards.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % homeCards.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeTab, homeCards.length]);

  const blogCategories = ['All', ...Array.from(new Set(blogs.map(b => b.category)))];

  const filteredBlogs = blogs.filter(b => {
    if (selectedCategory === 'All') return true;
    return b.category === selectedCategory;
  });

  const filteredFaqs = faqs.filter(f => {
    const matchesCat = faqCategoryFilter === 'all' || (f.category || 'general') === faqCategoryFilter;
    const matchesQuery = !faqSearchQuery.trim() || 
      f.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
      f.a.toLowerCase().includes(faqSearchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const filteredTestimonials = testimonials.filter(t => {
    if (reviewFilter === 'all') return true;
    return t.audience === reviewFilter;
  });

  const handleHelpfulUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (votedMap[id]) return;
    setHelpfulVotes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setVotedMap(prev => ({ ...prev, [id]: true }));
  };

  // Structured Overview Highlights (4 for Riders, 4 for Drivers)
  const riderHighlights = [
    {
      id: "rh1",
      icon: <Zap size={18} className="text-amber-500" />,
      title: "1-Tap Instant & Scheduled Rides",
      desc: "Book city cabs, auto rickshaws & bike taxis in seconds, or schedule rides up to 7 days in advance with zero booking fees."
    },
    {
      id: "rh2",
      icon: <ShieldCheck size={18} className="text-emerald-500" />,
      title: "24/7 Emergency SOS & Live GPS",
      desc: "Biometric verified drivers, mandatory 4-digit OTP trip authentication, and 1-tap emergency security dispatch desk."
    },
    {
      id: "rh3",
      icon: <CreditCard size={18} className="text-sky-500" />,
      title: "Upfront Transparent Fixed Fares",
      desc: "Know your exact fare upfront before trip start. Zero post-ride surcharges or hidden surge pricing tricks."
    },
    {
      id: "rh4",
      icon: <Car size={18} className="text-purple-500" />,
      title: "Multi-Fleet Choice & Airport Express",
      desc: "Choose from Bike Taxis, Autos, Minis, Sedans, SUVs, and dedicated Flight-Tracked Airport Terminal Transfers."
    }
  ];

  const driverHighlights = [
    {
      id: "dh1",
      icon: <DollarSign size={18} className="text-emerald-500" />,
      title: "0% Commission Driver Model",
      desc: "Keep 100% of your passenger trip fares with flat daily or monthly subscription plans instead of giving away 25% cuts."
    },
    {
      id: "dh2",
      icon: <CheckCircle2 size={18} className="text-amber-500" />,
      title: "24/7 Instant UPI Bank Cashouts",
      desc: "Transfer trip earnings directly to any UPI bank account (GPay, PhonePe, Paytm) anytime in 5 seconds."
    },
    {
      id: "dh3",
      icon: <TrendingUp size={18} className="text-sky-500" />,
      title: "Peak Hour 2.5x Multipliers",
      desc: "Earn up to 2.5x higher fare rates during morning and evening rush commute hours plus daily milestone bonuses."
    },
    {
      id: "dh4",
      icon: <Users size={18} className="text-purple-500" />,
      title: "Fleet Operator & Safety Network",
      desc: "24/7 driver hotline support, verified passenger accounts, and multi-vehicle fleet operator management tools."
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto h-screen h-[100dvh] max-h-screen max-h-[100dvh] supports-[height:100dvh]:h-[100dvh] overflow-hidden bg-[#FAF7F2] text-[#12141A] font-sans relative shadow-2xl flex flex-col justify-between border-x border-slate-200/80 antialiased selection:bg-amber-200">
      
      {/* Article Reader View Modal */}
      {readingBlog ? (
        <div ref={scrollContainerRef} className="h-full overflow-y-auto no-scrollbar bg-[#FAF7F2] text-[#12141A] flex flex-col justify-between p-4 space-y-4 animate-in fade-in duration-200 pb-20">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
              <button
                onClick={() => setReadingBlog(null)}
                className="px-3 py-1.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-3xs"
              >
                <ArrowLeft size={16} />
                <span>Back to Articles</span>
              </button>
              <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase shadow-3xs">
                {readingBlog.category}
              </span>
            </div>

            <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200/80 mb-4 shadow-3xs">
              <img src={readingBlog.coverImage} alt={readingBlog.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-bold text-white bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  {readingBlog.readTime} • {readingBlog.date}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h1 className="text-lg font-black text-slate-900 leading-snug">
                {readingBlog.title}
              </h1>

              <div className="flex items-center justify-between text-xs text-slate-500 border-y border-slate-200/80 py-2">
                <div className="flex items-center gap-1.5">
                  <User size={14} className="text-amber-600" />
                  <span className="font-semibold text-slate-800">{readingBlog.author}</span>
                </div>
              </div>

              <p className="text-xs text-amber-950 bg-amber-50 border border-amber-200 p-3 rounded-xl font-medium leading-relaxed">
                {readingBlog.excerpt}
              </p>

              <div className="text-xs text-slate-700 leading-relaxed space-y-3 pt-2 whitespace-pre-line font-normal">
                {readingBlog.content}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-200/80">
                {readingBlog.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-white border border-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-3 pt-2 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-slate-200/80">
            <button
              onClick={onOpenRiderLogin || onLaunchApp}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-300 active:scale-95"
            >
              <Car size={16} />
              <span>{landingConfig.ctaText || "Book Your Ride"}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Main Landing Experience Wrapper */
        <div className="flex flex-col h-full max-h-full overflow-hidden flex-1">
          
          {/* Top Sticky Header - Brand Logo & Quick App Launcher */}
          <header className="shrink-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-slate-200/80 p-3 flex items-center justify-between shadow-3xs">
            <div className="flex items-center gap-2">
              <BrandLogo config={config} section="landing" isDark={false} variant="combined" showTagline={false} height={32} />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenRiderLogin || onLaunchApp}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95 shrink-0 border border-amber-300"
              >
                <span>OPEN APP</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </header>

          {/* Main Scrollable Content Container */}
          <main ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar">

            {/* TAB 1: HOME - Full Card Banner & Cards Experience */}
            {activeTab === 'home' && (
              <div className="p-3.5 flex-1 flex flex-col justify-center animate-in fade-in duration-200">

                {/* Main Full Top-to-Bottom Hero Feature Card Carousel */}
                <div className="relative w-full h-[calc(100dvh-150px)] min-h-[420px] max-h-[620px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-md flex flex-col justify-between p-5 bg-slate-900 text-white transition-all">
                  
                  {/* Background Image Slideshow - Bright & Vibrant without dark overlay */}
                  {homeCards.map((card, idx) => (
                    <div
                      key={card.id || idx}
                      className={cn(
                        "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex items-center justify-center bg-slate-900",
                        idx === currentSlide ? "opacity-100 z-0" : "opacity-0 z-0 pointer-events-none"
                      )}
                    >
                      <img
                        src={card.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000"}
                        alt={card.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Subtle soft gradient at bottom only to keep text readable without darkening the image */}
                      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none" />
                    </div>
                  ))}

                  {/* Empty top container (tags and badges removed per user request) */}
                  <div className="relative z-10" />

                  {/* Bottom Card Info & CTA Button */}
                  <div className="relative z-10 space-y-3.5 text-left pt-6">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                      {homeCards[currentSlide]?.title}
                    </h2>

                    <p className="text-xs font-medium text-slate-100 leading-relaxed bg-black/40 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                      {homeCards[currentSlide]?.subtitle || homeCards[currentSlide]?.desc}
                    </p>

                    {/* Bottom Unified Navigation & CTA Row (Arrows on Left, Book Your Ride on Right for maximum space) */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                      {/* Left Side: Navigation Arrows */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentSlide(prev => (prev - 1 + homeCards.length) % homeCards.length)}
                          className="w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-xl flex items-center justify-center text-xs transition-all cursor-pointer border border-white/20 active:scale-95 shrink-0"
                          aria-label="Previous slide"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <button
                          onClick={() => setCurrentSlide(prev => (prev + 1) % homeCards.length)}
                          className="w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-xl flex items-center justify-center text-xs transition-all cursor-pointer border border-white/20 active:scale-95 shrink-0"
                          aria-label="Next slide"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>

                      {/* Right Side: Action Button */}
                      <button
                        onClick={() => {
                          if (homeCards[currentSlide]?.audience === 'driver' && onOpenDriverLogin) {
                            onOpenDriverLogin();
                          } else if (onOpenRiderLogin) {
                            onOpenRiderLogin();
                          } else {
                            onLaunchApp();
                          }
                        }}
                        className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 border border-amber-300 shrink-0"
                      >
                        <Car size={15} />
                        <span>{homeCards[currentSlide]?.ctaText || (homeCards[currentSlide]?.audience === 'driver' ? "Join as Driver" : "Book Your Ride")}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: OVERVIEW - Refined Key Points & Comparison Matrix */}
            {activeTab === 'overview' && (
              <div className="space-y-5 p-4 animate-in fade-in duration-200">
                
                {/* Header Title */}
                <div className="space-y-1 text-left">
                  <h2 className="text-base font-black uppercase text-slate-900 tracking-wide">Overview & Key Points</h2>
                  <p className="text-xs text-slate-600">Core advantages and operational excellence for riders and driver captains.</p>
                </div>

                {/* STATS BANNER */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-3xl border border-slate-800 space-y-3 shadow-md text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-amber-400 text-slate-950 rounded-xl font-black text-xs">
                        <Award size={16} />
                      </span>
                      <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-wide">Platform Performance</h3>
                        <p className="text-[10px] text-slate-300 font-medium">Real-time city operating metrics</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                      LIVE SYSTEM
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-xs font-black text-amber-400 block">18,500+</span>
                      <span className="text-[8px] text-slate-300 font-bold uppercase">Riders</span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-xs font-black text-emerald-400 block">3,200+</span>
                      <span className="text-[8px] text-slate-300 font-bold uppercase">Drivers</span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-xs font-black text-sky-400 block">21,700+</span>
                      <span className="text-[8px] text-slate-300 font-bold uppercase">Members</span>
                    </div>
                  </div>
                </div>

              {/* Slide Switcher Controls */}
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-3xs">
                <button
                  onClick={() => setOverviewAudienceSlide('rider')}
                  className={cn(
                    "py-2 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1",
                    overviewAudienceSlide === 'rider' ? "bg-amber-400 text-slate-950 shadow-3xs" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <User size={13} />
                  <span>FOR RIDERS</span>
                </button>

                <button
                  onClick={() => setOverviewAudienceSlide('driver')}
                  className={cn(
                    "py-2 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1",
                    overviewAudienceSlide === 'driver' ? "bg-amber-400 text-slate-950 shadow-3xs" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Car size={13} />
                  <span>FOR DRIVERS</span>
                </button>

                <button
                  onClick={() => setOverviewAudienceSlide('comparison')}
                  className={cn(
                    "py-2 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1",
                    overviewAudienceSlide === 'comparison' ? "bg-slate-900 text-white shadow-3xs" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <CheckCircle2 size={13} />
                  <span>WHY US</span>
                </button>
              </div>

              {/* HIGHLIGHT POINTS VIEW */}
              {overviewAudienceSlide !== 'comparison' ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-4 space-y-4 shadow-3xs">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-amber-100 text-amber-900 rounded-xl border border-amber-200">
                        {overviewAudienceSlide === 'rider' ? <User size={16} /> : <Car size={16} />}
                      </span>
                      <div className="text-left">
                        <h3 className="text-xs font-black uppercase text-slate-900 tracking-wide">
                          {overviewAudienceSlide === 'rider' ? "Rider Experience & Safety" : "Driver Revenue & Freedom"}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {overviewAudienceSlide === 'rider' ? "Key benefits for passengers" : "Key benefits for driver partners"}
                        </p>
                      </div>
                    </div>

                    <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full uppercase border border-amber-200">
                      {overviewAudienceSlide === 'rider' ? "RIDERS" : "DRIVERS"}
                    </span>
                  </div>

                  {/* KEY POINT CARDS (Numbers removed) */}
                  <div className="space-y-2.5">
                    {(overviewAudienceSlide === 'rider' ? riderHighlights : driverHighlights).map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 hover:border-amber-300 transition-all flex items-start gap-3 text-left"
                      >
                        <div className="p-2 bg-white rounded-xl border border-slate-200 shrink-0 shadow-3xs">
                          {item.icon}
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                          <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (overviewAudienceSlide === 'driver' && onOpenDriverLogin) {
                        onOpenDriverLogin();
                      } else if (onOpenRiderLogin) {
                        onOpenRiderLogin();
                      } else {
                        onLaunchApp();
                      }
                    }}
                    className="w-full mt-2 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-300"
                  >
                    <Car size={16} />
                    <span>{overviewAudienceSlide === 'driver' ? "Register as Driver Partner" : "Book Your Ride"}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                /* COMPARISON MATRIX TABLE */
                <div className="bg-white rounded-3xl border border-slate-200/80 p-4 space-y-3.5 shadow-3xs text-left">
                  <div className="border-b border-slate-200/80 pb-2">
                    <h3 className="text-xs font-black uppercase text-slate-900 tracking-wide">Why Choose TaxiApp Platform?</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Clear comparison vs traditional ride hailing apps</p>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs font-black text-slate-900">
                        <span>Driver Commission</span>
                        <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono text-[10px]">FLAT 0%</span>
                      </div>
                      <p className="text-[10px] text-slate-600">TaxiApp uses 0% commission plans vs 25%–30% cuts on traditional apps.</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs font-black text-slate-900">
                        <span>Fare Surcharges</span>
                        <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono text-[10px]">ZERO SURGE</span>
                      </div>
                      <p className="text-[10px] text-slate-600">Fixed transparent fares calculated upfront before booking.</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs font-black text-slate-900">
                        <span>Driver Payouts</span>
                        <span className="text-sky-700 bg-sky-100 px-2 py-0.5 rounded font-mono text-[10px]">24/7 INSTANT UPI</span>
                      </div>
                      <p className="text-[10px] text-slate-600">5-second bank cashout vs 7-day delayed weekly payout cycles.</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs font-black text-slate-900">
                        <span>Safety & Emergency</span>
                        <span className="text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-mono text-[10px]">24/7 LIVE DESK</span>
                      </div>
                      <p className="text-[10px] text-slate-600">Biometric verified drivers, OTP authentication, and Red SOS button.</p>
                    </div>
                  </div>

                  <button
                    onClick={onOpenRiderLogin || onLaunchApp}
                    className="w-full pt-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Try TaxiApp Today</span>
                    <ArrowRight size={14} className="text-amber-400" />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: REVIEWS - Ratings & Community Feedback */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 p-4 animate-in fade-in duration-200">
              
              {/* RATING SUMMARY CARD */}
              <div className="bg-white p-4.5 rounded-3xl border border-slate-200/80 space-y-3 shadow-3xs text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-400 text-slate-950 p-2.5 rounded-2xl font-black text-lg flex items-center justify-center shadow-3xs border border-amber-300">
                      4.9
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={13} fill="currentColor" />
                        ))}
                      </div>
                      <h3 className="text-xs font-black text-slate-900">Verified Rating & Reviews</h3>
                      <p className="text-[10px] text-slate-500 font-medium">25,000+ completed city rides</p>
                    </div>
                  </div>

                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
                    ✓ 98.5% POSITIVE
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                    <span className="text-xs font-black text-amber-700 block">25,000+</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase">Trips Done</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                    <span className="text-xs font-black text-emerald-700 block">99.2%</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase">On-Time</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                    <span className="text-xs font-black text-sky-700 block">4.9 / 5.0</span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase">Safety Rating</span>
                  </div>
                </div>
              </div>

              {/* REVIEW CATEGORY FILTERS */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0",
                    reviewFilter === 'all' ? "bg-amber-400 text-slate-950 shadow-3xs" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  )}
                >
                  <Star size={12} fill="currentColor" />
                  <span>ALL REVIEWS ({testimonials.length})</span>
                </button>

                <button
                  onClick={() => setReviewFilter('rider')}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0",
                    reviewFilter === 'rider' ? "bg-sky-500 text-white shadow-3xs" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  )}
                >
                  <User size={12} />
                  <span>RIDERS</span>
                </button>

                <button
                  onClick={() => setReviewFilter('driver')}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0",
                    reviewFilter === 'driver' ? "bg-emerald-600 text-white shadow-3xs" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  )}
                >
                  <Car size={12} />
                  <span>DRIVERS</span>
                </button>
              </div>

              {/* REVIEWS LIST */}
              <div className="space-y-3">
                {filteredTestimonials.map((item, idx) => (
                  <div key={item.id || idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-left hover:border-amber-300 transition-colors shadow-3xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-8 h-8 rounded-full object-cover border border-amber-300 shadow-3xs"
                        />
                        <div>
                          <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                            <span>{item.name}</span>
                            <CheckCircle2 size={12} className="text-emerald-500" />
                          </h4>
                          <span className="text-[9px] font-semibold text-slate-500 block">{item.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} size={11} fill="currentColor" />
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-700 font-normal leading-relaxed">
                      "{item.comment}"
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                      {item.highlightText ? (
                        <span className="font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                          ✓ {item.highlightText}
                        </span>
                      ) : <span />}

                      <button
                        onClick={(e) => handleHelpfulUpvote(item.id, e)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all cursor-pointer",
                          votedMap[item.id] 
                            ? "bg-amber-400 text-slate-950 border-amber-400" 
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                        )}
                      >
                        <ThumbsUp size={10} />
                        <span>({helpfulVotes[item.id] || 45})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: FAQS - Expanded FAQ List with Real-Time Search */}
          {activeTab === 'faqs' && (
            <div className="space-y-4 p-4 animate-in fade-in duration-200">
              <div className="space-y-1 text-left">
                <h2 className="text-base font-black uppercase text-slate-900 tracking-wide">Frequently Asked Questions</h2>
                <p className="text-xs text-slate-600">Comprehensive guide for riders, driver captains, safety shield & payments.</p>
              </div>

              {/* SEARCH BAR FOR FAQS */}
              <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-3xs p-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  placeholder="Search questions or keywords..."
                  className="w-full pl-9 pr-8 py-2 text-xs font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
                />
                {faqSearchQuery && (
                  <button
                    onClick={() => setFaqSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* CATEGORY FILTER PILLS */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setFaqCategoryFilter('all')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1",
                    faqCategoryFilter === 'all' ? "bg-amber-400 text-slate-950 shadow-3xs" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  )}
                >
                  <HelpCircle size={12} />
                  <span>ALL ({faqs.length})</span>
                </button>

                <button
                  onClick={() => setFaqCategoryFilter('rider')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1",
                    faqCategoryFilter === 'rider' ? "bg-sky-500 text-white shadow-3xs" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  )}
                >
                  <User size={12} />
                  <span>RIDERS</span>
                </button>

                <button
                  onClick={() => setFaqCategoryFilter('driver')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1",
                    faqCategoryFilter === 'driver' ? "bg-emerald-600 text-white shadow-3xs" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  )}
                >
                  <Car size={12} />
                  <span>DRIVERS</span>
                </button>

                <button
                  onClick={() => setFaqCategoryFilter('safety')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1",
                    faqCategoryFilter === 'safety' ? "bg-purple-600 text-white shadow-3xs" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  )}
                >
                  <ShieldCheck size={12} />
                  <span>SAFETY & SOS</span>
                </button>

                <button
                  onClick={() => setFaqCategoryFilter('payment')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1",
                    faqCategoryFilter === 'payment' ? "bg-amber-600 text-white shadow-3xs" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  )}
                >
                  <CreditCard size={12} />
                  <span>PAYMENTS</span>
                </button>
              </div>

              {/* FAQ ACCORDION LIST */}
              <div className="space-y-2.5 pt-1">
                {filteredFaqs.length === 0 ? (
                  <div className="p-6 text-center bg-white rounded-2xl border border-slate-200/80 space-y-1">
                    <p className="text-xs font-bold text-slate-600">No matching questions found.</p>
                    <p className="text-[10px] text-slate-400">Try adjusting your search query or category filter.</p>
                  </div>
                ) : (
                  filteredFaqs.map(faq => (
                    <div
                      key={faq.id}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-3xs hover:border-amber-300 transition-colors text-left"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full p-3.5 text-left font-bold text-xs text-slate-900 flex items-center justify-between cursor-pointer gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {faq.category === 'driver' ? (
                            <span className="text-[8px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded uppercase border border-emerald-200 shrink-0">DRIVER</span>
                          ) : faq.category === 'safety' ? (
                            <span className="text-[8px] font-black bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded uppercase border border-purple-200 shrink-0">SAFETY</span>
                          ) : faq.category === 'payment' ? (
                            <span className="text-[8px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded uppercase border border-amber-200 shrink-0">PAYMENT</span>
                          ) : (
                            <span className="text-[8px] font-black bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded uppercase border border-sky-200 shrink-0">RIDER</span>
                          )}
                          <span className="truncate">{faq.q}</span>
                        </div>
                        <ChevronRight size={14} className={cn("transition-transform text-amber-600 shrink-0", expandedFaq === faq.id && "rotate-90")} />
                      </button>

                      {expandedFaq === faq.id && (
                        <div className="p-3.5 pt-2 text-xs text-slate-700 font-medium border-t border-slate-100 leading-relaxed bg-slate-50/80 animate-in fade-in duration-150">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: BLOGS - Travel & Safety Articles */}
          {activeTab === 'blogs' && (
            <div className="space-y-4 p-4 animate-in fade-in duration-200">
              <div className="space-y-1 text-left">
                <h2 className="text-base font-black uppercase text-slate-900 tracking-wide">Travel & Safety Articles</h2>
                <p className="text-xs text-slate-600">Guides on cab safety, airport transfers, city navigation, and driver earnings.</p>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {blogCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer",
                      selectedCategory === cat ? "bg-amber-400 text-slate-950 font-black shadow-3xs" : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredBlogs.length === 0 ? (
                  <div className="text-center p-8 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                    <BookOpen size={28} className="mx-auto text-slate-400" />
                    <p className="text-xs font-bold text-slate-600">No blog articles published yet.</p>
                    <p className="text-[10px] text-slate-400">Check back soon for new travel tips and updates.</p>
                  </div>
                ) : (
                  filteredBlogs.map(b => (
                    <div
                      key={b.id}
                      onClick={() => setReadingBlog(b)}
                      className="bg-white p-3 rounded-2xl border border-slate-200/80 flex items-center gap-3 cursor-pointer hover:border-amber-300 transition-all shadow-3xs group"
                    >
                      <img src={b.coverImage} className="w-20 h-20 rounded-xl object-cover shrink-0" alt={b.title} />
                      <div className="space-y-1 min-w-0 text-left">
                        <span className="text-[9px] font-black text-amber-700 uppercase tracking-wider block">{b.category}</span>
                        <h3 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
                          {b.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                          <span>{b.readTime}</span>
                          <span>•</span>
                          <span>{b.date}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          </main>

          {/* PERSISTENT BOTTOM NAVIGATION TAB BAR */}
          <div className="shrink-0 max-w-md w-full bg-[#FAF7F2]/95 backdrop-blur-md border-t border-slate-200/80 p-2 pb-[calc(0.85rem+env(safe-area-inset-bottom,0px))] z-50 shadow-lg sticky bottom-0">
            <div className="grid grid-cols-5 gap-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-3xs">
              <button
                onClick={() => setActiveTab('home')}
                className={cn(
                  "py-1.5 text-[10px] font-black rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5",
                  activeTab === 'home' ? "bg-amber-400 text-slate-950 shadow-3xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Home size={13} />
                <span>Home</span>
              </button>

              <button
                onClick={() => setActiveTab('overview')}
                className={cn(
                  "py-1.5 text-[10px] font-black rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5",
                  activeTab === 'overview' ? "bg-amber-400 text-slate-950 shadow-3xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Globe size={13} />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={cn(
                  "py-1.5 text-[10px] font-black rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5",
                  activeTab === 'reviews' ? "bg-amber-400 text-slate-950 shadow-3xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Star size={13} />
                <span>Reviews</span>
              </button>

              <button
                onClick={() => setActiveTab('faqs')}
                className={cn(
                  "py-1.5 text-[10px] font-black rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5",
                  activeTab === 'faqs' ? "bg-amber-400 text-slate-950 shadow-3xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <HelpCircle size={13} />
                <span>FAQs</span>
              </button>

              <button
                onClick={() => setActiveTab('blogs')}
                className={cn(
                  "py-1.5 text-[10px] font-black rounded-xl transition-all cursor-pointer flex flex-col items-center gap-0.5",
                  activeTab === 'blogs' ? "bg-amber-400 text-slate-950 shadow-3xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <BookOpen size={13} />
                <span>Blogs</span>
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
