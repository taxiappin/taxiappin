import React, { useState } from 'react';
import { LandingPageConfig, LandingTestimonial, LandingFeatureCard } from '../types';
import { useConfig } from '../lib/ConfigContext';
import { 
  Globe, Layout, Sparkles, Plus, Trash2, Edit, Save, CheckCircle2, 
  Smartphone, HelpCircle, Star, MessageSquare, Zap, ShieldCheck, MapPin, 
  ToggleLeft, ToggleRight, ArrowRight, Eye, RefreshCw, X, Image as ImageIcon,
  Wand2, ExternalLink, Sliders, ArrowUp, ArrowDown, Layers, Palette, Car, Shield
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingPageAdminViewProps {
  setToast?: (t: { message: string; type: 'success' | 'error' | 'info' }) => void;
}

const HERO_IMAGE_PRESETS = [
  {
    title: 'Yellow City Taxi',
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Luxury Black Sedan',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Eco Electric Vehicle',
    url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Airport Terminal Transfer',
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Night Highway Cab',
    url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200'
  }
];

const GRADIENT_PRESETS = [
  { label: 'Sky Blue Days', value: 'from-sky-950/90 via-blue-900/80 to-slate-950/95', color: 'bg-gradient-to-r from-sky-600 to-blue-900' },
  { label: 'We All Love Black', value: 'from-slate-950/95 via-zinc-900/85 to-neutral-950/95', color: 'bg-gradient-to-r from-zinc-800 to-black' },
  { label: 'Greenery Eco Days', value: 'from-emerald-950/90 via-teal-900/80 to-slate-950/95', color: 'bg-gradient-to-r from-emerald-600 to-teal-900' },
  { label: 'Perfect Red St.', value: 'from-rose-950/90 via-red-900/80 to-slate-950/95', color: 'bg-gradient-to-r from-rose-600 to-red-900' },
  { label: 'My Fave. Gold', value: 'from-amber-950/90 via-amber-900/80 to-slate-950/95', color: 'bg-gradient-to-r from-amber-500 to-orange-800' },
  { label: 'Deep Purple Safety', value: 'from-purple-950/90 via-indigo-900/80 to-slate-950/95', color: 'bg-gradient-to-r from-purple-600 to-indigo-900' }
];

const DEFAULT_FEATURE_CARDS: LandingFeatureCard[] = [
  {
    id: "f1",
    title: "Sky Blue Days",
    tag: "INSTANT CAB BOOKING",
    badge: "24/7 LIVE GPS",
    subtitle: "Book city rides in seconds with zero cancellation rates and guaranteed top-rated drivers.",
    desc: "Book city rides in seconds with zero cancellation rates and guaranteed top-rated drivers.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000",
    gradientOverlay: "from-sky-950/90 via-blue-900/80 to-slate-950/95",
    ctaText: "Book Sky Blue Cab",
    icon: "Zap"
  },
  {
    id: "f2",
    title: "We All Love Black",
    tag: "LUXURY EXECUTIVE SEDANS",
    badge: "VIP CHAUFFEUR",
    subtitle: "Premium Mercedes & BMW executive fleets for corporate airport arrivals and red-carpet events.",
    desc: "Premium Mercedes & BMW executive fleets for corporate airport arrivals and red-carpet events.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1000",
    gradientOverlay: "from-slate-950/95 via-zinc-900/85 to-neutral-950/95",
    ctaText: "Reserve Executive Sedan",
    icon: "Shield"
  },
  {
    id: "f3",
    title: "Greenery Eco Days",
    tag: "100% ELECTRIC VEHICLES",
    badge: "ZERO EMISSION",
    subtitle: "Quiet, smooth, zero-emission EV rides through city centers at standard cab rates.",
    desc: "Quiet, smooth, zero-emission EV rides through city centers at standard cab rates.",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1000",
    gradientOverlay: "from-emerald-950/90 via-teal-900/80 to-slate-950/95",
    ctaText: "Go Green EV Ride",
    icon: "Sparkles"
  },
  {
    id: "f4",
    title: "Perfect Red St.",
    tag: "AIRPORT EXPRESS TRANSFERS",
    badge: "ZERO DELAY GUARANTEE",
    subtitle: "Flight-tracked terminal drop-offs with luggage assistance and automated flight delay buffer.",
    desc: "Flight-tracked terminal drop-offs with luggage assistance and automated flight delay buffer.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
    gradientOverlay: "from-rose-950/90 via-red-900/80 to-slate-950/95",
    ctaText: "Schedule Airport Transfer",
    icon: "MapPin"
  },
  {
    id: "f5",
    title: "My Fave. Gold",
    tag: "OUTSTATION & HIGHWAY CABS",
    badge: "INTERCITY FLAT RATES",
    subtitle: "Comfortable round-trips and one-way highway travel with experienced long-haul captains.",
    desc: "Comfortable round-trips and one-way highway travel with experienced long-haul captains.",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1000",
    gradientOverlay: "from-amber-950/90 via-amber-900/80 to-slate-950/95",
    ctaText: "Explore Outstation Routes",
    icon: "Car"
  },
  {
    id: "f6",
    title: "Deep Purple Safety",
    tag: "24/7 CRISIS SHIELD & SOS",
    badge: "POLICE VERIFIED",
    subtitle: "Real-time audio monitoring, family tracking links, and instant emergency dispatch buttons.",
    desc: "Real-time audio monitoring, family tracking links, and instant emergency dispatch buttons.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
    gradientOverlay: "from-purple-950/90 via-indigo-900/80 to-slate-950/95",
    ctaText: "Learn Safety Features",
    icon: "ShieldCheck"
  }
];

export const LandingPageAdminView: React.FC<LandingPageAdminViewProps> = ({ setToast }) => {
  const { config, updateConfig } = useConfig();
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
    testimonials: [
      { id: "t1", name: "Ananya Sharma", role: "Frequent Traveler", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", comment: "The airport express transfer pre-booking saved my trip!" }
    ],
    faqs: [
      { id: "q1", q: "How fast will my cab arrive after booking?", a: "Our smart dispatch system connects you to the nearest driver in under 10 seconds." }
    ]
  };

  const [localData, setLocalData] = useState<LandingPageConfig>({
    ...landingConfig,
    features: (landingConfig.features && landingConfig.features.length > 0) ? landingConfig.features : DEFAULT_FEATURE_CARDS
  });

  const [activeTab, setActiveTab] = useState<'cards' | 'hero' | 'testimonials' | 'faqs' | 'download'>('cards');
  const [showFullPreviewModal, setShowFullPreviewModal] = useState(false);

  // Feature Card Modal State
  const [editingCard, setEditingCard] = useState<LandingFeatureCard | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState<Partial<LandingFeatureCard>>({
    title: '',
    tag: 'FEATURE HIGHLIGHT',
    badge: 'LIVE STATUS',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000',
    gradientOverlay: 'from-sky-950/90 via-blue-900/80 to-slate-950/95',
    ctaText: 'Explore Feature',
    icon: 'Zap'
  });

  // Testimonial Modal State
  const [editingTestimonial, setEditingTestimonial] = useState<LandingTestimonial | null>(null);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<Partial<LandingTestimonial>>({
    name: '',
    role: 'Rider',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    comment: ''
  });

  // FAQ Modal State
  const [editingFaq, setEditingFaq] = useState<{ id?: string; q: string; a: string } | null>(null);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [faqForm, setFaqForm] = useState({ q: '', a: '' });

  const handleToggleLandingPage = (enabled: boolean) => {
    const updated = { ...localData, enabled };
    setLocalData(updated);
    updateConfig({ landingPage: updated });
    if (setToast) setToast({ 
      message: enabled ? 'Public Landing Page ENABLED' : 'Public Landing Page DISABLED (Direct App View Active)', 
      type: 'info' 
    });
  };

  const handleSaveConfig = () => {
    updateConfig({ landingPage: localData });
    if (setToast) setToast({ message: 'Landing page content updated & published live!', type: 'success' });
  };

  // AI Headline Generator
  const handleAiHeadlineGenerator = () => {
    const titleOptions = [
      "Your On-Demand Premium Ride Engine for Fast, Safe Travel",
      "Instant City Cabs & Airport Transfers at Fixed Transparent Fares",
      "Book Verified Local & Intercity Rides in 3 Easy Taps",
      "Smarter, Safer, Eco-Friendly Urban Mobility Solutions"
    ];
    const pickedTitle = titleOptions[Math.floor(Math.random() * titleOptions.length)];
    const pickedSubtitle = "Experience 24/7 transparent pricing, real-time GPS tracking, verified driver partners, and instant door-to-door cab dispatches.";

    setLocalData(prev => ({ ...prev, heroTitle: pickedTitle, heroSubtitle: pickedSubtitle }));
    if (setToast) setToast({ message: '✨ High-Converting Headline generated with AI!', type: 'success' });
  };

  // AI Feature Deck Generator
  const handleAiGenerateCardDeck = () => {
    setLocalData(prev => ({ ...prev, features: DEFAULT_FEATURE_CARDS }));
    updateConfig({ landingPage: { ...localData, features: DEFAULT_FEATURE_CARDS } });
    if (setToast) setToast({ message: '✨ Generated 6 Modern Vertical Feature Cards inspired by reference design!', type: 'success' });
  };

  // Feature Card CRUD Handlers
  const handleOpenAddCard = () => {
    setEditingCard(null);
    setCardForm({
      title: 'New Feature Card',
      tag: 'FEATURE HIGHLIGHT',
      badge: '24/7 ACTIVE',
      subtitle: 'Describe the feature benefits and functionality clearly.',
      image: HERO_IMAGE_PRESETS[0].url,
      gradientOverlay: GRADIENT_PRESETS[0].value,
      ctaText: 'Book Now',
      icon: 'Zap'
    });
    setShowCardModal(true);
  };

  const handleOpenEditCard = (card: LandingFeatureCard) => {
    setEditingCard(card);
    setCardForm({ ...card });
    setShowCardModal(true);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.title) return;

    let updatedList: LandingFeatureCard[];
    if (editingCard) {
      updatedList = localData.features.map(f => f.id === editingCard.id ? { ...f, ...cardForm } as LandingFeatureCard : f);
    } else {
      const newCard: LandingFeatureCard = {
        id: `f_${Date.now()}`,
        title: cardForm.title || 'Feature Title',
        tag: cardForm.tag || 'FEATURE',
        badge: cardForm.badge || 'ACTIVE',
        subtitle: cardForm.subtitle || cardForm.desc || '',
        desc: cardForm.subtitle || cardForm.desc || '',
        image: cardForm.image || HERO_IMAGE_PRESETS[0].url,
        gradientOverlay: cardForm.gradientOverlay || GRADIENT_PRESETS[0].value,
        ctaText: cardForm.ctaText || 'Book Ride',
        icon: cardForm.icon || 'Zap'
      };
      updatedList = [...localData.features, newCard];
    }

    const updated = { ...localData, features: updatedList };
    setLocalData(updated);
    updateConfig({ landingPage: updated });
    setShowCardModal(false);
    if (setToast) setToast({ message: 'Feature card saved successfully!', type: 'success' });
  };

  const handleDeleteCard = (id: string) => {
    const updatedList = localData.features.filter(f => f.id !== id);
    const updated = { ...localData, features: updatedList };
    setLocalData(updated);
    updateConfig({ landingPage: updated });
    if (setToast) setToast({ message: 'Feature card removed', type: 'info' });
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= localData.features.length) return;

    const list = [...localData.features];
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;

    const updated = { ...localData, features: list };
    setLocalData(updated);
    updateConfig({ landingPage: updated });
    if (setToast) setToast({ message: 'Card position reordered!', type: 'info' });
  };

  // Testimonial Handlers
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.comment) return;

    let updatedList: LandingTestimonial[];
    if (editingTestimonial) {
      updatedList = localData.testimonials.map(t => t.id === editingTestimonial.id ? { ...t, ...testimonialForm } as LandingTestimonial : t);
    } else {
      const newT: LandingTestimonial = {
        id: `t_${Date.now()}`,
        name: testimonialForm.name || 'User',
        role: testimonialForm.role || 'Rider',
        rating: Number(testimonialForm.rating) || 5,
        avatar: testimonialForm.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        comment: testimonialForm.comment || ''
      };
      updatedList = [...localData.testimonials, newT];
    }

    const updated = { ...localData, testimonials: updatedList };
    setLocalData(updated);
    updateConfig({ landingPage: updated });
    setShowTestimonialModal(false);
    if (setToast) setToast({ message: 'Review saved!', type: 'success' });
  };

  const handleDeleteTestimonial = (id: string) => {
    const updatedList = localData.testimonials.filter(t => t.id !== id);
    const updated = { ...localData, testimonials: updatedList };
    setLocalData(updated);
    updateConfig({ landingPage: updated });
    if (setToast) setToast({ message: 'Review removed', type: 'info' });
  };

  // FAQ Handlers
  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.q || !faqForm.a) return;

    let updatedList: Array<{ id: string; q: string; a: string }>;
    if (editingFaq && editingFaq.id) {
      updatedList = localData.faqs.map(f => f.id === editingFaq.id ? { ...f, ...faqForm } : f);
    } else {
      const newF = {
        id: `q_${Date.now()}`,
        q: faqForm.q,
        a: faqForm.a
      };
      updatedList = [...localData.faqs, newF];
    }

    const updated = { ...localData, faqs: updatedList };
    setLocalData(updated);
    updateConfig({ landingPage: updated });
    setShowFaqModal(false);
    if (setToast) setToast({ message: 'FAQ entry saved!', type: 'success' });
  };

  const handleDeleteFaq = (id: string) => {
    const updatedList = localData.faqs.filter(f => f.id !== id);
    const updated = { ...localData, faqs: updatedList };
    setLocalData(updated);
    updateConfig({ landingPage: updated });
    if (setToast) setToast({ message: 'FAQ removed', type: 'info' });
  };

  return (
    <div className="space-y-6 text-slate-900 pb-12">
      
      {/* Header Banner - Clean Light Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layout className="text-amber-500" size={26} />
            <span>Public Landing Page Builder</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Master Landing Page Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700">Status:</span>
            <button
              onClick={() => handleToggleLandingPage(!localData.enabled)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5",
                localData.enabled ? "bg-emerald-500 text-white shadow-2xs" : "bg-slate-200 text-slate-600"
              )}
            >
              {localData.enabled ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>ONLINE</span>
                </>
              ) : (
                <>
                  <X size={14} />
                  <span>OFFLINE</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => setShowFullPreviewModal(true)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
          >
            <Eye size={16} className="text-amber-500" />
            <span>Live Card Deck Preview</span>
          </button>

          <button
            onClick={handleSaveConfig}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-2"
          >
            <Save size={16} />
            <span>Publish Changes Live</span>
          </button>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-1">
        <button
          onClick={() => setActiveTab('cards')}
          className={cn(
            "flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
            activeTab === 'cards' ? "bg-amber-400 text-slate-950 font-black shadow-xs" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <Layers size={16} className={activeTab === 'cards' ? "text-slate-950" : "text-amber-500"} />
          <span>Feature Cards Deck ({localData.features.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={cn(
            "flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
            activeTab === 'hero' ? "bg-amber-400 text-slate-950 font-black shadow-xs" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <Globe size={16} className={activeTab === 'hero' ? "text-slate-950" : "text-amber-500"} />
          <span>Hero & Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('testimonials')}
          className={cn(
            "flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
            activeTab === 'testimonials' ? "bg-amber-400 text-slate-950 font-black shadow-xs" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <Star size={16} className={activeTab === 'testimonials' ? "text-slate-950" : "text-amber-500"} />
          <span>Reviews ({localData.testimonials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={cn(
            "flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
            activeTab === 'faqs' ? "bg-amber-400 text-slate-950 font-black shadow-xs" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <HelpCircle size={16} className={activeTab === 'faqs' ? "text-slate-950" : "text-amber-500"} />
          <span>FAQs ({localData.faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('download')}
          className={cn(
            "flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2",
            activeTab === 'download' ? "bg-amber-400 text-slate-950 font-black shadow-xs" : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <Smartphone size={16} className={activeTab === 'download' ? "text-slate-950" : "text-amber-500"} />
          <span>App Download Links</span>
        </button>
      </div>

      {/* TAB 1: FEATURE CARDS DECK BUILDER (PRIMARY) */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Layers className="text-amber-500" size={22} />
                  <span>Vertical Feature Cards Story Deck</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Users scroll up through full vertical poster cards to explore features (like the StyleShare reference design).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiGenerateCardDeck}
                  className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Wand2 size={15} />
                  <span>✨ AI Reset Reference Deck</span>
                </button>

                <button
                  onClick={handleOpenAddCard}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>Add Feature Card</span>
                </button>
              </div>
            </div>

            {/* Cards Grid / List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {localData.features.map((card, idx) => (
                <div 
                  key={card.id || idx}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white text-slate-900 shadow-xs flex flex-col justify-between p-5 space-y-4 group"
                >
                  {/* Card Image Preview Banner */}
                  <div className="w-full h-36 rounded-xl overflow-hidden relative bg-slate-100 border border-slate-200/80">
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {card.tag && (
                      <span className="absolute top-2 left-2 text-[9px] font-black tracking-widest text-slate-950 uppercase bg-amber-400 border border-amber-300 px-2 py-0.5 rounded-md shadow-2xs">
                        {card.tag}
                      </span>
                    )}
                  </div>

                  {/* Card Top Meta */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                      Card 0{idx + 1}
                    </span>
                    
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => handleMoveCard(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-slate-200 text-slate-700 rounded disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveCard(idx, 'down')}
                        disabled={idx === localData.features.length - 1}
                        className="p-1 hover:bg-slate-200 text-slate-700 rounded disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Card Center Info */}
                  <div className="space-y-1 text-left">
                    <h3 className="text-base font-black text-slate-900 leading-tight">{card.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 font-medium">{card.subtitle || card.desc}</p>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-800">
                      CTA: "{card.ctaText || 'Book Now'}"
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditCard(card)}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-1.5 bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 rounded-lg transition-colors cursor-pointer"
                        title="Delete Card"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HERO & BRANDING */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Globe className="text-amber-500" size={18} />
                <span>Brand Identity & Main Hero Settings</span>
              </h2>

              <button
                onClick={handleAiHeadlineGenerator}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Wand2 size={14} />
                <span>✨ AI Generate Headline</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Brand Name</label>
                <input
                  type="text"
                  value={localData.brandName || "TaxiApp"}
                  onChange={e => setLocalData({ ...localData, brandName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Brand Logo Emoji</label>
                <input
                  type="text"
                  value={localData.brandLogoEmoji || "🚖"}
                  onChange={e => setLocalData({ ...localData, brandLogoEmoji: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Main Hero Title</label>
                <input
                  type="text"
                  value={localData.heroTitle}
                  onChange={e => setLocalData({ ...localData, heroTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hero Subtitle</label>
                <textarea
                  rows={3}
                  value={localData.heroSubtitle}
                  onChange={e => setLocalData({ ...localData, heroSubtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-3 text-xs font-semibold text-slate-900 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Top CTA Button Label</label>
                  <input
                    type="text"
                    value={localData.ctaText}
                    onChange={e => setLocalData({ ...localData, ctaText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">SEO Target Keywords</label>
                  <input
                    type="text"
                    value={localData.seoKeywords}
                    onChange={e => setLocalData({ ...localData, seoKeywords: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-3 text-xs font-semibold text-slate-900 outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Global Section Toggles */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Bottom Navigation Sections Visibility</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setLocalData({ ...localData, showBlogs: !localData.showBlogs })}
                  className={cn(
                    "p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all",
                    localData.showBlogs ? "bg-amber-50 border-amber-300 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-500"
                  )}
                >
                  <span>Blogs Section</span>
                  <span className="font-mono text-[10px] uppercase font-black">{localData.showBlogs ? "ON" : "OFF"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalData({ ...localData, showTestimonials: !localData.showTestimonials })}
                  className={cn(
                    "p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all",
                    localData.showTestimonials ? "bg-amber-50 border-amber-300 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-500"
                  )}
                >
                  <span>Reviews Section</span>
                  <span className="font-mono text-[10px] uppercase font-black">{localData.showTestimonials ? "ON" : "OFF"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalData({ ...localData, showFaqs: !localData.showFaqs })}
                  className={cn(
                    "p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all",
                    localData.showFaqs ? "bg-amber-50 border-amber-300 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-500"
                  )}
                >
                  <span>FAQs Section</span>
                  <span className="font-mono text-[10px] uppercase font-black">{localData.showFaqs ? "ON" : "OFF"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLocalData({ ...localData, showAppDownload: !localData.showAppDownload })}
                  className={cn(
                    "p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all",
                    localData.showAppDownload ? "bg-amber-50 border-amber-300 text-amber-950" : "bg-slate-50 border-slate-200 text-slate-500"
                  )}
                >
                  <span>App Download Box</span>
                  <span className="font-mono text-[10px] uppercase font-black">{localData.showAppDownload ? "ON" : "OFF"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Star className="text-amber-500" size={18} />
                <span>Verified Customer & Partner Reviews</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage passenger and driver testimonials displayed in the Reviews tab.</p>
            </div>

            <button
              onClick={() => {
                setEditingTestimonial(null);
                setTestimonialForm({ name: '', role: 'Rider', rating: 5, avatar: HERO_IMAGE_PRESETS[0].url, comment: '' });
                setShowTestimonialModal(true);
              }}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>Add Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localData.testimonials.map(item => (
              <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={item.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <span className="text-[10px] font-semibold text-amber-600 block">{item.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTestimonial(item);
                        setTestimonialForm({ ...item });
                        setShowTestimonialModal(true);
                      }}
                      className="p-1 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(item.id)}
                      className="p-1 hover:bg-rose-100 text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-700 italic">"{item.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FAQS */}
      {activeTab === 'faqs' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <HelpCircle className="text-amber-500" size={18} />
                <span>Frequently Asked Questions (FAQs)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage frequently asked questions regarding cab booking, fares, and safety shield.</p>
            </div>

            <button
              onClick={() => {
                setEditingFaq(null);
                setFaqForm({ q: '', a: '' });
                setShowFaqModal(true);
              }}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {localData.faqs.map(faq => (
              <div key={faq.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Q: {faq.q}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingFaq(faq);
                        setFaqForm({ q: faq.q, a: faq.a });
                        setShowFaqModal(true);
                      }}
                      className="p-1 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1 hover:bg-rose-100 text-rose-600 rounded cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-600">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: APP DOWNLOAD */}
      {activeTab === 'download' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Smartphone className="text-amber-500" size={18} />
            <span>Official Mobile App Download Links</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Google Play Store URL</label>
              <input
                type="text"
                value={localData.playStoreUrl}
                onChange={e => setLocalData({ ...localData, playStoreUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl p-3 text-xs font-semibold text-slate-900 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Apple App Store URL</label>
              <input
                type="text"
                value={localData.appStoreUrl}
                onChange={e => setLocalData({ ...localData, appStoreUrl: e.target.value })}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl p-3 text-xs font-semibold text-slate-900 outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: FEATURE CARD EDIT / ADD MODAL */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-left my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-400 text-slate-950 rounded-xl font-bold">
                  <Layers size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingCard ? 'Edit Feature Card' : 'Create New Feature Card'}
                </h3>
              </div>
              <button onClick={() => setShowCardModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Poster Card Title (e.g. "Sky Blue Days")</label>
                <input
                  type="text"
                  required
                  value={cardForm.title || ''}
                  onChange={e => setCardForm({ ...cardForm, title: e.target.value })}
                  placeholder="e.g. Sky Blue Days"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category Tag</label>
                  <input
                    type="text"
                    value={cardForm.tag || ''}
                    onChange={e => setCardForm({ ...cardForm, tag: e.target.value })}
                    placeholder="e.g. INSTANT CAB BOOKING"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Badge Status Pill</label>
                  <input
                    type="text"
                    value={cardForm.badge || ''}
                    onChange={e => setCardForm({ ...cardForm, badge: e.target.value })}
                    placeholder="e.g. 24/7 LIVE GPS"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Card Subtitle / Description</label>
                <textarea
                  rows={3}
                  required
                  value={cardForm.subtitle || cardForm.desc || ''}
                  onChange={e => setCardForm({ ...cardForm, subtitle: e.target.value, desc: e.target.value })}
                  placeholder="Describe the feature clearly for users scrolling through the cards..."
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Action CTA Button Text</label>
                <input
                  type="text"
                  value={cardForm.ctaText || ''}
                  onChange={e => setCardForm({ ...cardForm, ctaText: e.target.value })}
                  placeholder="e.g. Book Sky Blue Cab"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Card Background Image URL</label>
                <input
                  type="text"
                  required
                  value={cardForm.image || ''}
                  onChange={e => setCardForm({ ...cardForm, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-mono text-slate-900 outline-none focus:border-amber-400"
                />
                
                {/* Preset Image Picker */}
                <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-1">
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">Presets:</span>
                  {HERO_IMAGE_PRESETS.map((p, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setCardForm({ ...cardForm, image: p.url })}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg shrink-0 cursor-pointer"
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Gradient Overlay Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {GRADIENT_PRESETS.map((g, gIdx) => (
                    <button
                      key={gIdx}
                      type="button"
                      onClick={() => setCardForm({ ...cardForm, gradientOverlay: g.value })}
                      className={cn(
                        "p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center gap-2",
                        cardForm.gradientOverlay === g.value ? "border-amber-500 ring-2 ring-amber-400/30 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-800"
                      )}
                    >
                      <div className={cn("w-4 h-4 rounded-full shrink-0", g.color)} />
                      <span className="truncate text-[11px]">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                >
                  Save Feature Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TESTIMONIAL MODAL */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingTestimonial ? 'Edit Review' : 'Add Review'}
              </h3>
              <button onClick={() => setShowTestimonialModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Reviewer Name</label>
                <input
                  type="text"
                  required
                  value={testimonialForm.name || ''}
                  onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role/Tag</label>
                  <input
                    type="text"
                    value={testimonialForm.role || ''}
                    onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                    placeholder="e.g. Frequent Traveler"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Star Rating (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={testimonialForm.rating || 5}
                    onChange={e => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Feedback Comment</label>
                <textarea
                  rows={3}
                  required
                  value={testimonialForm.comment || ''}
                  onChange={e => setTestimonialForm({ ...testimonialForm, comment: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: FAQ MODAL */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <button onClick={() => setShowFaqModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={faqForm.q}
                  onChange={e => setFaqForm({ ...faqForm, q: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Answer</label>
                <textarea
                  rows={3}
                  required
                  value={faqForm.a}
                  onChange={e => setFaqForm({ ...faqForm, a: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl p-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: LIVE PREVIEW MODAL */}
      {showFullPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-3xl max-w-sm w-full p-4 shadow-2xl border border-slate-800 space-y-3 text-left relative overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Smartphone size={16} /> Smartphone Live Preview
              </span>
              <button onClick={() => setShowFullPreviewModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 rounded-2xl border border-slate-800 p-2 bg-slate-950 space-y-4">
              <div className="text-center p-2">
                <span className="text-[10px] font-bold text-slate-400 block">Scroll test feature cards:</span>
              </div>

              {localData.features.map((card, idx) => (
                <div key={card.id || idx} className="relative h-96 rounded-2xl overflow-hidden border border-slate-800 p-4 flex flex-col justify-between">
                  <img src={card.image} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className={cn("absolute inset-0 bg-gradient-to-b opacity-90", card.gradientOverlay)} />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded">
                      0{idx + 1} / 0{localData.features.length}
                    </span>
                    <span className="text-[9px] font-bold text-white bg-white/20 px-2 py-0.5 rounded uppercase">
                      {card.badge}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1">
                    <span className="text-[9px] font-black text-amber-300 uppercase block">{card.tag}</span>
                    <h3 className="text-xl font-black text-white">{card.title}</h3>
                    <p className="text-[10px] text-slate-200 line-clamp-2">{card.subtitle}</p>
                    <div className="w-full py-2 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-xl text-center mt-2">
                      {card.ctaText || 'Book Now'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
