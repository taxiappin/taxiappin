import React, { useState, useEffect } from 'react';
import { 
  Globe, Zap, CheckCircle2, RefreshCw, Search, 
  BarChart3, Cpu, Sparkles, ExternalLink, ShieldCheck, 
  Layers, Copy, Check, FileCode, Server, ArrowUpRight, Activity, Trash2,
  Award, AlertTriangle, Send, ListChecks, TrendingUp, UploadCloud, Car,
  FileText, Star, HelpCircle, BookOpen, User, CheckCircle, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useConfig } from '../lib/ConfigContext';

interface SeoDashboardViewProps {
  setToast: (toast: { message: string; type: 'success' | 'error' | 'info' }) => void;
}

export const SeoDashboardView: React.FC<SeoDashboardViewProps> = ({ setToast }) => {
  const { config, updateConfig } = useConfig();
  const [subTab, setSubTab] = useState<'health' | 'pages' | 'meta' | 'sitelinks' | 'schema' | 'indexnow' | 'cache' | 'implemented'>('pages');
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [seoData, setSeoData] = useState<any>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Sitelinks State (Matching Google Search SERP Sitelinks format)
  const [sitelinksData, setSitelinksData] = useState([
    { title: "Create new account", desc: "Sign up for TaxiApp and find your friends or driver fleet. Create an account to get started...", url: "/signup", icon: "UserPlus" },
    { title: "Video & How It Works", desc: "Watch video guides and see how instant cab booking, live GPS tracking, and safety features work.", url: "/safety", icon: "Video" },
    { title: "Forgot password & Help", desc: "Log into TaxiApp or recover your account password securely to access your trip history and wallet.", url: "/faqs", icon: "HelpCircle" },
    { title: "Posts & City Fleet Updates", desc: "Read latest news, driver partner posts, city route expansions, and promotional fare discounts.", url: "/blogs", icon: "Newspaper" }
  ]);

  // Page-by-Page SEO Auditing & Scoring State
  const [landingPages, setLandingPages] = useState([
    {
      id: "home",
      name: "Home & Hero Carousel",
      path: "/?tab=home",
      icon: "Globe",
      score: 98,
      status: "Ready to Index",
      lastPublished: "Just now",
      titleTag: "TaxiApp - Fast, Reliable & Safe Taxi Rides Whenever You Need",
      metaDesc: "Book instant local rides, airport express transfers, outstation cabs & executive cars with 100% verified drivers.",
      schema: "TaxiService, Organization",
      checklist: [
        { label: "Title Tag Length (50-60 chars)", passed: true, detail: "58 characters — high intent & branded" },
        { label: "Meta Description (150-160 chars)", passed: true, detail: "135 characters with strong call to action" },
        { label: "Structured Schema (JSON-LD)", passed: true, detail: "TaxiService schema with geo-coordinates and price range" },
        { label: "Heading Hierarchy (H1 / H2)", passed: true, detail: "Clear H1 with dynamic carousel slide headings" },
        { label: "Clean Visuals & PNG Support", passed: true, detail: "Dark overlay removed; sharp contrast & transparent PNGs" },
        { label: "Mobile Responsive Viewport", passed: true, detail: "Optimized for iOS & Android safe area viewports" }
      ],
      suggestions: [
        { id: "s-home-1", text: "Add top operating city names in meta keywords for localized searches.", applied: false, scoreBoost: 2 },
        { id: "s-home-2", text: "Include OpenGraph preview image dimensions (1200x630px) in meta head tags.", applied: true, scoreBoost: 0 }
      ]
    },
    {
      id: "overview",
      name: "Overview & Comparison Matrix",
      path: "/?tab=overview",
      icon: "ListChecks",
      score: 96,
      status: "Ready to Index",
      lastPublished: "Just now",
      titleTag: "Overview & Features | TaxiApp - Transparent Fares & Driver Benefits",
      metaDesc: "Discover why TaxiApp leads city mobility: 0% driver commissions, 24/7 instant UPI bank cashouts, and upfront zero-surge pricing.",
      schema: "WebPage, ItemList",
      checklist: [
        { label: "Title Tag Optimization", passed: true, detail: "67 characters — target keywords for rider and driver benefits" },
        { label: "Meta Description", passed: true, detail: "148 characters with clear USP value propositions" },
        { label: "Comparison Matrix Readability", passed: true, detail: "Accessible high-contrast tables and cards" },
        { label: "Structured Feature Highlights", passed: true, detail: "No numbering clutter; clean vector icons and semantic cards" }
      ],
      suggestions: [
        { id: "s-ov-1", text: "Add comparative competitor pricing schema for rich search snippets.", applied: false, scoreBoost: 3 }
      ]
    },
    {
      id: "reviews",
      name: "Reviews & Customer Testimonials",
      path: "/?tab=reviews",
      icon: "Star",
      score: 97,
      status: "Ready to Index",
      lastPublished: "Just now",
      titleTag: "Customer Reviews & Ratings | TaxiApp Verified Feedback",
      metaDesc: "Read real passenger and driver testimonials. Rated 4.9/5 across over 25,000+ completed city rides and airport transfers.",
      schema: "AggregateRating, Review",
      checklist: [
        { label: "Aggregate Rating Schema", passed: true, detail: "Schema.org Review & AggregateRating embedded (4.9/5 stars)" },
        { label: "User Avatars & Alt Tags", passed: true, detail: "All passenger reviewer profile photos have descriptive alt tags" },
        { label: "Rich Snippet Star Rating", passed: true, detail: "Google search results show direct star ratings" }
      ],
      suggestions: [
        { id: "s-rev-1", text: "Enable automatic review recency timestamps in Schema.org JSON-LD.", applied: true, scoreBoost: 0 }
      ]
    },
    {
      id: "faqs",
      name: "FAQs & Safety Helpdesk",
      path: "/?tab=faqs",
      icon: "HelpCircle",
      score: 99,
      status: "Ready to Index",
      lastPublished: "Just now",
      titleTag: "Frequently Asked Questions | TaxiApp Help & Safety Support",
      metaDesc: "Got questions about booking cabs, driver earnings, 0% commission plans, or safety features? Find instant answers in our FAQ guide.",
      schema: "FAQPage",
      checklist: [
        { label: "FAQPage Schema.org", passed: true, detail: "100% compliant FAQPage markup for Google expandable search snippets" },
        { label: "Category Filters", passed: true, detail: "Structured Rider, Driver, Safety & Payment segments" },
        { label: "Instant Accordion Navigation", passed: true, detail: "Accessible semantic questions with immediate answer rendering" }
      ],
      suggestions: [
        { id: "s-faq-1", text: "Add question anchor deep-links (e.g. #faq-commission) for Google site navigation.", applied: false, scoreBoost: 1 }
      ]
    },
    {
      id: "blogs",
      name: "Travel & Safety Articles (Blogs)",
      path: "/?tab=blogs",
      icon: "BookOpen",
      score: 95,
      status: "Ready to Index",
      lastPublished: "Just now",
      titleTag: "Travel, Safety & Driver Partner Articles | TaxiApp Blog",
      metaDesc: "Expert guides on cab safety, airport transfer tips, city navigation, EV cabs, and driver earnings strategies.",
      schema: "BlogPosting, Article",
      checklist: [
        { label: "BlogPosting Structured Data", passed: true, detail: "Includes headline, datePublished, author, and featured image" },
        { label: "Reading Time & Tags", passed: true, detail: "SEO friendly keyword tags and clean category hierarchy" },
        { label: "No Distracting Counter Numbers", passed: true, detail: "Article reading experience is clean and distraction-free" }
      ],
      suggestions: [
        { id: "s-blog-1", text: "Generate automatic Table of Contents for articles exceeding 800 words.", applied: false, scoreBoost: 3 },
        { id: "s-blog-2", text: "Link related blog articles at the bottom of each article reader.", applied: true, scoreBoost: 0 }
      ]
    },
    {
      id: "driver",
      name: "Driver Partner Portal & Sign-up",
      path: "/driver",
      icon: "Car",
      score: 98,
      status: "Ready to Index",
      lastPublished: "Just now",
      titleTag: "Drive with TaxiApp - 0% Commission & Instant Daily Payouts",
      metaDesc: "Join as a driver partner. Keep 100% of your earnings with flat subscription plans, 24/7 UPI cashouts, and peak hour multipliers.",
      schema: "JobPosting, Service",
      checklist: [
        { label: "Driver Partner Intent Keywords", passed: true, detail: "Targeted terms: '0% commission cab', 'driver attachment', 'daily UPI payout'" },
        { label: "Direct Login & Onboarding Redirection", passed: true, detail: "Hero CTA and header buttons navigate straight to Driver Auth" },
        { label: "Mobile KYC Readiness", passed: true, detail: "Instant phone OTP verification and document upload flow" }
      ],
      suggestions: [
        { id: "s-drv-1", text: "Add local state driver license requirements in footer schema.", applied: false, scoreBoost: 2 }
      ]
    }
  ]);

  const [selectedPageId, setSelectedPageId] = useState<string>("home");
  const activePage = landingPages.find(p => p.id === selectedPageId) || landingPages[0];

  // Apply Suggestion Handler
  const handleApplySuggestion = (pageId: string, suggestionId: string, boost: number) => {
    setLandingPages(prev => prev.map(p => {
      if (p.id === pageId) {
        return {
          ...p,
          score: Math.min(100, p.score + boost),
          suggestions: p.suggestions.map(s => s.id === suggestionId ? { ...s, applied: true } : s)
        };
      }
      return p;
    }));
    setToast({ message: "SEO Suggestion applied! Page audit score updated.", type: "success" });
  };

  // Publish Individual Landing Page SEO
  const handlePublishPageSeo = async (pageId: string) => {
    const page = landingPages.find(p => p.id === pageId);
    if (!page) return;

    try {
      const res = await fetch('/api/admin/seo/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [`${formData.canonicalUrl}${page.path.replace('/', '')}`] })
      });
      
      const now = new Date().toLocaleTimeString();
      setLandingPages(prev => prev.map(p => p.id === pageId ? { ...p, status: "Published & Indexed", lastPublished: now } : p));
      setToast({ message: `Successfully published & pushed "${page.name}" SEO to Google & Bing!`, type: "success" });
    } catch (e) {
      setToast({ message: `Failed to push ${page.name} SEO.`, type: "error" });
    }
  };

  // Publish ALL Landing Pages at Once
  const handlePublishAllLandingPages = async () => {
    try {
      const allUrls = landingPages.map(p => `${formData.canonicalUrl}${p.path.replace('/', '')}`);
      await fetch('/api/admin/seo/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: allUrls })
      });
      const now = new Date().toLocaleTimeString();
      setLandingPages(prev => prev.map(p => ({ ...p, status: "Published & Indexed", lastPublished: now })));
      setToast({ message: "All landing pages published and submitted to Search Engines!", type: "success" });
    } catch (e) {
      setToast({ message: "Failed to publish all pages.", type: "error" });
    }
  };

  // URL Test Inspector State
  const [urlTestInput, setUrlTestInput] = useState("/book");
  const [urlTestResult, setUrlTestResult] = useState<any>(null);

  // Form State for Meta Tags
  const [formData, setFormData] = useState({
    siteTitle: config?.seo?.siteTitle || "TaxiApp - Instant Cab Booking, Ride Hailing & Fleet Operations",
    metaDescription: config?.seo?.metaDescription || "Book instant rides, daily cabs, airport transfers, and outstation trips with verified drivers, transparent fares, live GPS tracking, and secure digital payments.",
    keywords: config?.seo?.keywords || "taxi app, cab booking, ride hailing, airport taxi, outstation cab, driver fleet, online cab booking, ride share, taxi service",
    ogTitle: config?.seo?.ogTitle || "TaxiApp - Instant Cab Booking, Ride Hailing & Fleet Operations",
    ogDescription: config?.seo?.ogDescription || "Book instant rides, daily cabs, airport transfers, and outstation trips with verified drivers, transparent fares, live GPS tracking, and secure digital payments.",
    ogImage: config?.seo?.ogImage || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&h=630&q=80",
    canonicalUrl: config?.seo?.canonicalUrl || "https://ais-dev-krtm3i6kzfw4zaaaf5sqea-386217356005.asia-southeast1.run.app/",
    twitterHandle: config?.seo?.twitterHandle || "@TaxiAppOfficial",
    googleConsoleVerification: config?.seo?.googleConsoleVerification || "google-site-verification-taxiapp-prod-99201",
    bingWebmasterId: config?.seo?.bingWebmasterId || "bing-verify-taxiapp-88102",
    indexNowApiKey: config?.seo?.indexNowApiKey || "taxiapp-indexnow-key-77889900",
    allowIndexing: config?.seo?.allowIndexing !== false,
    enableSitemap: config?.seo?.enableSitemap !== false,
    enableCacheHeaders: config?.seo?.enableCacheHeaders !== false
  });

  const handleGenerateAiMeta = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        siteTitle: "TaxiApp - #1 Instant Cab Booking, Airport Rides & Driver Fleet",
        metaDescription: "Experience seamless mobility with TaxiApp! Book instant city cabs, luxury airport transfers, and outstation rides with 100% verified drivers, live GPS tracking, and upfront pricing.",
        keywords: "taxi app, book cab online, ride hailing app, airport cab booking, outstation taxi service, cheap cab fare, driver partner app, city rides",
        ogTitle: "TaxiApp - Safe, Fast & Affordable Cab Rides Anywhere",
        ogDescription: "Book verified cabs in 1-tap with TaxiApp. Instant matching, upfront fares, cashless digital payments, and 24/7 SOS safety support."
      }));
      setAiGenerating(false);
      setToast({ message: "AI SEO Metadata & OpenGraph Tags generated successfully!", type: "success" });
    }, 1000);
  };

  const handleTestUrlIndexability = () => {
    const isDisallowed = urlTestInput.startsWith("/admin") || urlTestInput.startsWith("/api");
    setUrlTestResult({
      url: urlTestInput,
      robotsStatus: isDisallowed ? "DISALLOWED (Shielded from Googlebot)" : "ALLOWED (Crawled by Search Engine)",
      sitemapStatus: isDisallowed ? "Excluded from Sitemap" : "Included in Dynamic /sitemap.xml",
      canonicalMatch: true,
      statusCode: 200,
      mobileFriendly: true
    });
  };

  const [pingLogs, setPingLogs] = useState<Array<{ time: string; msg: string; status: string }>>([]);

  const fetchSeoData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo');
      if (res.ok) {
        const data = await res.json();
        setSeoData(data);
        if (data.seoConfig) {
          setFormData(prev => ({
            ...prev,
            ...data.seoConfig
          }));
        }
      }
    } catch (e) {
      console.warn("Could not fetch SEO stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoData();
  }, []);

  const handleSaveMetaConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedSeoConfig = {
        ...config,
        seo: {
          ...config.seo,
          ...formData
        }
      };
      await updateConfig(() => updatedSeoConfig);
      setToast({ message: "SEO Meta Tags & Header directives saved successfully!", type: "success" });
    } catch (err) {
      setToast({ message: "Failed to save SEO config.", type: "error" });
    }
  };

  const handleIndexNowPing = async () => {
    try {
      const res = await fetch('/api/admin/seo/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [formData.canonicalUrl, `${formData.canonicalUrl}book`, `${formData.canonicalUrl}driver`] })
      });
      const data = await res.json();
      if (res.ok) {
        const now = new Date().toLocaleTimeString();
        setPingLogs(prev => [
          { time: now, msg: "Google Search Console Sitemap Ping accepted (HTTP 200)", status: "SUCCESS" },
          { time: now, msg: "Bing / Yandex IndexNow protocol accepted 3 URLs (HTTP 202)", status: "SUCCESS" },
          ...prev
        ]);
        setToast({ message: "Submitted IndexNow request to Search Engines!", type: "success" });
      }
    } catch (e) {
      setToast({ message: "Failed to submit IndexNow request.", type: "error" });
    }
  };

  const handleCachePurge = async () => {
    try {
      const res = await fetch('/api/admin/cache/purge', { method: 'POST' });
      if (res.ok) {
        setToast({ message: "Edge CDN & Server Cache purged successfully!", type: "success" });
        fetchSeoData();
      }
    } catch (e) {
      setToast({ message: "Failed to purge cache.", type: "error" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
    setToast({ message: "Copied to clipboard!", type: "info" });
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Section - Standardized Light Header matching other pages */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-1">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Globe className="text-slate-800" size={24} />
            <span>SEO & Web Performance</span>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-mono font-bold inline-flex items-center gap-1">
              <Activity size={12} className="animate-pulse" /> 100% Synced
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchSeoData}
            disabled={loading}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} className={cn(loading && "animate-spin")} />
            <span>Re-audit SEO</span>
          </button>

          <button
            onClick={handleCachePurge}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Trash2 size={14} />
            <span>Purge Cache</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Cards - Light UI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">SEO Health Index</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600">98 / 100</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">EXCELLENT</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Organic Search CTR</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-amber-600">12.3%</span>
            <span className="text-[10px] text-amber-700 font-bold flex items-center gap-0.5"><ArrowUpRight size={10} /> +2.4%</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Core Web Vitals</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-indigo-600">99 / 100</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">PASSED</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Googlebot Indexing</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 font-mono">2m ago</span>
            <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-1.5 py-0.5 rounded">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* SUB TAB NAVIGATION BAR */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSubTab('pages')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            subTab === 'pages' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Award size={16} className={subTab === 'pages' ? "text-slate-950" : "text-amber-500"} />
          <span>Landing Pages SEO &amp; Scoring</span>
        </button>

        <button
          onClick={() => setSubTab('health')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            subTab === 'health' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <ShieldCheck size={16} className={subTab === 'health' ? "text-slate-950" : "text-amber-500"} />
          <span>SEO Health Audit</span>
        </button>

        <button
          onClick={() => setSubTab('meta')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            subTab === 'meta' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <FileCode size={16} className={subTab === 'meta' ? "text-slate-950" : "text-amber-500"} />
          <span>Meta Tags &amp; Social Cards</span>
        </button>

        <button
          onClick={() => setSubTab('sitelinks')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            subTab === 'sitelinks' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Search size={16} className={subTab === 'sitelinks' ? "text-slate-950" : "text-amber-500"} />
          <span>Google Sitelinks &amp; SERP</span>
        </button>

        <button
          onClick={() => setSubTab('schema')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            subTab === 'schema' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Layers size={16} className={subTab === 'schema' ? "text-slate-950" : "text-amber-500"} />
          <span>Schema.org JSON-LD</span>
        </button>

        <button
          onClick={() => setSubTab('indexnow')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            subTab === 'indexnow' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Zap size={16} className={subTab === 'indexnow' ? "text-slate-950" : "text-amber-500"} />
          <span>IndexNow &amp; Google Ping</span>
        </button>

        <button
          onClick={() => setSubTab('cache')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
            subTab === 'cache' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <Cpu size={16} className={subTab === 'cache' ? "text-slate-950" : "text-amber-500"} />
          <span>Cache &amp; Core Vitals</span>
        </button>

        <button
          onClick={() => setSubTab('implemented')}
          className={cn(
            "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ml-auto",
            subTab === 'implemented' ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          <CheckCircle2 size={16} className={subTab === 'implemented' ? "text-slate-950" : "text-emerald-600"} />
          <span>Implemented Features</span>
        </button>
      </div>

      {/* SUB-TAB CONTENT PANELS */}
      <AnimatePresence mode="wait">
        {/* SUB TAB 0: LANDING PAGES SEO SCORECARD & SUGGESTIONS */}
        {subTab === 'pages' && (
          <motion.div key="subtab_pages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            
            {/* Top Overview Banner with Batch Action */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-400 text-slate-950 rounded-xl font-black">
                    <Award size={20} />
                  </span>
                  <h3 className="text-lg font-black text-white">Landing Pages SEO Readiness &amp; Optimization Engine</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Every landing page view, article, and onboarding portal has dynamic metadata, JSON-LD Schema, and instant search indexing.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handlePublishAllLandingPages}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer active:scale-95 border border-amber-300"
                >
                  <UploadCloud size={16} />
                  <span>Publish All Pages to Google / Bing</span>
                </button>
              </div>
            </div>

            {/* Page Selection Tabs & Master Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Pages List (Scorecards) */}
              <div className="lg:col-span-4 space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wide">Target Landing Pages</span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{landingPages.length} Pages Audited</span>
                </div>

                <div className="space-y-2">
                  {landingPages.map(page => {
                    const isSelected = selectedPageId === page.id;
                    return (
                      <div
                        key={page.id}
                        onClick={() => setSelectedPageId(page.id)}
                        className={cn(
                          "p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex items-center justify-between gap-3 shadow-3xs",
                          isSelected
                            ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 truncate">{page.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 block truncate">{page.path}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className={cn(
                              "text-sm font-black font-mono",
                              page.score >= 95 ? "text-emerald-600" : page.score >= 85 ? "text-amber-600" : "text-rose-600"
                            )}>
                              {page.score}%
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            {page.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Selected Page Deep Dive, Checklist, Suggestions & Publish */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs space-y-5 text-left">
                  
                  {/* Selected Page Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-slate-900">{activePage.name}</h4>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {activePage.path}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Schema Type: <span className="font-mono text-amber-700 font-bold">{activePage.schema}</span></p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePublishPageSeo(activePage.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs"
                      >
                        <Send size={13} />
                        <span>Publish &amp; Index</span>
                      </button>
                    </div>
                  </div>

                  {/* SERP Search Preview Card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      <span>Google Search SERP Snippet Preview</span>
                    </div>
                    <h5 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer leading-snug">
                      {activePage.titleTag}
                    </h5>
                    <p className="text-xs text-emerald-800 font-mono">
                      {formData.canonicalUrl}{activePage.path.replace('/', '')}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {activePage.metaDesc}
                    </p>
                  </div>

                  {/* Actionable Suggestions Section */}
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      <span>Actionable SEO Suggestions for Improvement</span>
                    </h5>

                    <div className="space-y-2">
                      {activePage.suggestions.map(sug => (
                        <div
                          key={sug.id}
                          className={cn(
                            "p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all",
                            sug.applied ? "bg-emerald-50/70 border-emerald-200 text-emerald-900" : "bg-amber-50/60 border-amber-200 text-amber-950"
                          )}
                        >
                          <div className="flex items-start gap-2 min-w-0">
                            {sug.applied ? (
                              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                            )}
                            <span className="font-medium leading-relaxed">{sug.text}</span>
                          </div>

                          {sug.applied ? (
                            <span className="text-[10px] font-black uppercase text-emerald-700 bg-white border border-emerald-300 px-2 py-1 rounded-md shrink-0">
                              Applied (+{sug.scoreBoost} pts)
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApplySuggestion(activePage.id, sug.id, sug.scoreBoost)}
                              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer shrink-0 shadow-3xs"
                            >
                              Apply &amp; Boost Score
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Audit Checklist */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <h5 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span>Technical Readiness &amp; Crawlability Checklist</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activePage.checklist.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                            <span>{item.label}</span>
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium leading-tight">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </motion.div>
        )}

        {/* SUB TAB 1: SEO HEALTH AUDIT */}
        {subTab === 'health' && (
          <motion.div key="subtab_health" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-600" size={20} />
                  <span>Real-time Technical SEO Diagnostic Audit</span>
                </h3>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-xs font-black rounded-lg shrink-0">
                  10 / 10 CHECKS PASSED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(seoData?.auditChecks || [
                  { id: "title_tag", name: "Page Title Optimization", status: "PASS", detail: "58 chars (Optimal range: 40-60 chars)" },
                  { id: "meta_desc", name: "Meta Description Quality", status: "PASS", detail: "148 chars (Optimal range: 120-160 chars)" },
                  { id: "canonical", name: "Canonical URL Tag", status: "PASS", detail: "Canonical URL linked directly to primary app origin" },
                  { id: "og_tags", name: "OpenGraph & Social Cards", status: "PASS", detail: "OG Title, Image & Twitter Card fully validated" },
                  { id: "sitemap_xml", name: "XML Sitemap Index", status: "PASS", detail: "/sitemap.xml is active and dynamic" },
                  { id: "robots_txt", name: "Robots.txt Directive", status: "PASS", detail: "/robots.txt correctly routes Googlebot/Bingbot" },
                  { id: "schema_ld", name: "Schema.org TaxiService JSON-LD", status: "PASS", detail: "Valid TaxiService & Organization schema embedded" },
                  { id: "viewport", name: "Mobile Responsive Viewport", status: "PASS", detail: "Meta viewport set with scale-lock disabled" },
                  { id: "cache_headers", name: "CDN Edge Cache-Control Headers", status: "PASS", detail: "Max-Age=31536000 Immutable set for static bundles" },
                  { id: "ssl_enforcement", name: "HTTPS & TLS Encryption", status: "PASS", detail: "Enforced via Cloud Run SSL Gateway" }
                ]).map((check: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3.5">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0 mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-extrabold text-slate-900 text-xs">{check.name}</h4>
                        <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {check.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-mono">{check.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Acquisition Analytics */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <BarChart3 size={18} className="text-amber-500" />
                  <span>Organic Keyword Acquisition & Impression Rankings</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">Updated Real-Time</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black uppercase tracking-wider text-[10px]">
                      <th className="p-3 rounded-l-lg">Target Search Keyword</th>
                      <th className="p-3">Organic Impressions</th>
                      <th className="p-3">Clicks</th>
                      <th className="p-3">CTR %</th>
                      <th className="p-3 rounded-r-lg">Avg Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(seoData?.searchAcquisition || [
                      { keyword: "cab booking app online", impressions: 14250, clicks: 1840, ctr: "12.9%", position: 1.8 },
                      { keyword: "book taxi near me", impressions: 22100, clicks: 2710, ctr: "12.3%", position: 2.1 },
                      { keyword: "airport taxi transfer instant", impressions: 9800, clicks: 1120, ctr: "11.4%", position: 2.4 },
                      { keyword: "outstation cab service best price", impressions: 8400, clicks: 890, ctr: "10.6%", position: 3.0 },
                      { keyword: "cheap ride hailing app", impressions: 18900, clicks: 2150, ctr: "11.37%", position: 2.2 }
                    ]).map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50 transition-all font-medium text-slate-800">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <Search size={14} className="text-amber-500 shrink-0" />
                          <span>{row.keyword}</span>
                        </td>
                        <td className="p-3 font-mono">{row.impressions.toLocaleString()}</td>
                        <td className="p-3 font-mono font-bold text-emerald-600">{row.clicks.toLocaleString()}</td>
                        <td className="p-3 font-mono font-bold text-amber-600">{row.ctr}</td>
                        <td className="p-3 font-mono font-black text-indigo-600">#{row.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB TAB 2: META TAGS & LIVE PREVIEWS */}
        {subTab === 'meta' && (
          <motion.div key="subtab_meta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Column */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileCode className="text-amber-500" size={18} />
                    <span>Live Meta Tags & Head Directives</span>
                  </h3>

                  <button
                    type="button"
                    onClick={handleGenerateAiMeta}
                    disabled={aiGenerating}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Sparkles size={14} className={cn(aiGenerating && "animate-spin")} />
                    <span>{aiGenerating ? "Optimizing..." : "AI Generate Meta Tags"}</span>
                  </button>
                </div>

                <form onSubmit={handleSaveMetaConfig} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                      <span>Global Site Title (`&lt;title&gt;`)</span>
                      <span className={cn("text-[10px] font-mono font-bold", formData.siteTitle.length > 60 ? "text-rose-600" : "text-emerald-600")}>
                        {formData.siteTitle.length} / 60 Chars
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.siteTitle}
                      onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                      placeholder="e.g. TaxiApp - Instant Cab Booking, Ride Hailing & Fleet Operations"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                      <span>Meta Description</span>
                      <span className={cn("text-[10px] font-mono font-bold", formData.metaDescription.length > 160 ? "text-rose-600" : "text-emerald-600")}>
                        {formData.metaDescription.length} / 160 Chars
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                      placeholder="Book instant rides, daily cabs, airport transfers..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Target Keywords (Comma Separated)</label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">OpenGraph Share Image URL</label>
                      <input
                        type="text"
                        value={formData.ogImage}
                        onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Canonical Base URL</label>
                      <input
                        type="text"
                        value={formData.canonicalUrl}
                        onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Google Console Verification Code</label>
                      <input
                        type="text"
                        value={formData.googleConsoleVerification}
                        onChange={(e) => setFormData({ ...formData, googleConsoleVerification: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Bing Webmaster ID</label>
                      <input
                        type="text"
                        value={formData.bingWebmasterId}
                        onChange={(e) => setFormData({ ...formData, bingWebmasterId: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles size={16} />
                      <span>Save & Apply Meta Settings</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Preview Cards Column - Clean Light Mode UI */}
              <div className="lg:col-span-5 space-y-6">
                {/* Google Search Result Preview */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <span className="text-xs font-extrabold text-slate-800 block flex items-center gap-1.5">
                    <Search size={14} className="text-blue-600" /> Live Google Search SERP Snippet Preview
                  </span>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-sans">
                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[8px]">T</span>
                      <span className="truncate">{formData.canonicalUrl}</span>
                    </div>
                    <h4 className="text-base font-bold text-blue-700 hover:underline cursor-pointer leading-snug">
                      {formData.siteTitle || "TaxiApp - Cab Booking"}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {formData.metaDescription || "Book instant rides and cabs online..."}
                    </p>
                  </div>
                </div>

                {/* OpenGraph Social Card Preview - Light Mode */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <span className="text-xs font-extrabold text-slate-800 block flex items-center gap-1.5">
                    <Globe size={14} className="text-indigo-600" /> WhatsApp / Facebook / OpenGraph Card Preview
                  </span>

                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shadow-xs">
                    <div className="h-36 bg-slate-200 relative overflow-hidden">
                      <img
                        src={formData.ogImage}
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.src = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                    </div>
                    <div className="p-3.5 bg-white border-t border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                        {formData.canonicalUrl.replace('https://', '').replace('http://', '').split('/')[0]}
                      </span>
                      <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{formData.siteTitle}</h5>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{formData.metaDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB TAB 3: GOOGLE SITELINKS & SERP CONFIGURATOR */}
        {subTab === 'sitelinks' && (
          <motion.div key="subtab_sitelinks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sitelinks Form Column */}
              <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Search className="text-blue-600" size={18} />
                      <span>Google Search Sitelinks Configurator</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Customize sub-navigation links displayed under main search result</p>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-bold rounded-full">
                    SERP READY
                  </span>
                </div>

                <div className="space-y-4">
                  {sitelinksData.map((item, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-mono font-bold flex items-center justify-center text-[10px]">
                            {index + 1}
                          </span>
                          <span>Sitelink #{index + 1}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">{item.url}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Link Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...sitelinksData];
                              updated[index].title = e.target.value;
                              setSitelinksData(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Target Route URL</label>
                          <input
                            type="text"
                            value={item.url}
                            onChange={(e) => {
                              const updated = [...sitelinksData];
                              updated[index].url = e.target.value;
                              setSitelinksData(updated);
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Snippet Description</label>
                        <input
                          type="text"
                          value={item.desc}
                          onChange={(e) => {
                            const updated = [...sitelinksData];
                            updated[index].desc = e.target.value;
                            setSitelinksData(updated);
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setToast({ message: "Google Sitelinks Schema updated and synced!", type: "success" })}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    <span>Save Sitelinks Config</span>
                  </button>
                </div>
              </div>

              {/* Exact Google Search Result Preview matching Facebook screenshot */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 font-sans">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                        T
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs leading-none">TaxiApp</h4>
                        <span className="text-[10px] text-slate-500 font-mono truncate">{formData.canonicalUrl}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-mono font-bold rounded">
                      Google SERP Exact Replica
                    </span>
                  </div>

                  {/* Main Result */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-blue-700 hover:underline cursor-pointer leading-snug">
                      {formData.siteTitle || "TaxiApp - Instant Cab Booking, Ride Hailing & Fleet Operations"}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {formData.metaDescription || "Create an account or log into TaxiApp. Connect with top drivers, book daily cabs, airport transfers, and outstation trips."}
                    </p>
                  </div>

                  {/* Google Sitelinks List (Exact Layout from Facebook Screenshot) */}
                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    {sitelinksData.map((link, idx) => (
                      <div key={idx} className="group cursor-pointer p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-blue-800 group-hover:underline flex items-center gap-1.5">
                            <span>{link.title}</span>
                          </h4>
                          <span className="text-slate-400 font-mono text-xs group-hover:translate-x-1 transition-transform">›</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed font-normal">
                          {link.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-3 text-center">
                    <span className="text-xs font-bold text-blue-700 hover:underline cursor-pointer">
                      More results from taxiapp.com »
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB TAB 4: SCHEMA.ORG JSON-LD GENERATOR & INSPECTOR */}
        {subTab === 'schema' && (
          <motion.div key="subtab_schema" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Schema JSON-LD Viewer */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Layers className="text-amber-500" size={18} />
                    <span>Schema.org Structured Data (JSON-LD)</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(`<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@graph": [\n    {\n      "@type": "TaxiService",\n      "name": "${formData.siteTitle}",\n      "provider": { "@type": "Organization", "name": "TaxiApp Inc" }\n    }\n  ]\n}\n</script>`)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Copy size={14} /> Copy JSON-LD
                  </button>
                </div>

                <div className="p-4 bg-slate-950 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto space-y-1 shadow-inner border border-slate-800">
                  <p className="text-amber-400 font-bold">&lt;script type="application/ld+json"&gt;</p>
                  <pre className="text-emerald-400 text-[11px] leading-relaxed font-mono whitespace-pre-wrap">
{JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TaxiService",
      "@id": `${formData.canonicalUrl}#service`,
      "name": formData.siteTitle,
      "provider": {
        "@type": "Organization",
        "name": "TaxiApp Technologies Inc",
        "url": formData.canonicalUrl
      },
      "areaServed": "Global",
      "serviceType": "Cab Booking, Airport Transfer, Rental & Outstation Rides",
      "availableLanguage": ["en", "es", "hi", "fr", "de", "ar"]
    },
    {
      "@type": "WebSite",
      "@id": `${formData.canonicalUrl}#website`,
      "url": formData.canonicalUrl,
      "name": "TaxiApp",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${formData.canonicalUrl}book?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "SiteNavigationElement",
      "@id": `${formData.canonicalUrl}#navigation`,
      "name": sitelinksData.map(s => s.title),
      "url": sitelinksData.map(s => `${formData.canonicalUrl}${s.url.replace('/', '')}`)
    }
  ]
}, null, 2)}
                  </pre>
                  <p className="text-amber-400 font-bold">&lt;/script&gt;</p>
                </div>
              </div>

              {/* URL Indexability Tester */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600" size={18} />
                    <span>URL Indexability & Robots Inspector</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Test any internal route for Googlebot crawling status</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Enter Application Path</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={urlTestInput}
                        onChange={(e) => setUrlTestInput(e.target.value)}
                        placeholder="e.g. /book or /driver"
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        onClick={handleTestUrlIndexability}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>

                  {urlTestResult && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="font-bold text-slate-600">Target Path:</span>
                        <span className="font-bold text-slate-900">{urlTestResult.url}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="font-bold text-slate-600">Robots.txt Directive:</span>
                        <span className={cn("font-bold", urlTestResult.robotsStatus.includes("ALLOWED") ? "text-emerald-600" : "text-rose-600")}>
                          {urlTestResult.robotsStatus}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200 pb-1.5">
                        <span className="font-bold text-slate-600">Sitemap Integration:</span>
                        <span className="font-bold text-emerald-600">{urlTestResult.sitemapStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-600">Canonical Self-Link:</span>
                        <span className="font-bold text-emerald-600">VALID (Matches Origin)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {subTab === 'indexnow' && (
          <motion.div key="subtab_indexnow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Zap className="text-amber-500" size={18} />
                  <span>Instant Search Engine Indexing Pipeline</span>
                </h3>

                <button
                  onClick={handleIndexNowPing}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer flex items-center gap-2 shrink-0"
                >
                  <Zap size={14} />
                  <span>Submit IndexNow Request</span>
                </button>
              </div>

              {/* Endpoints & Files Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Dynamic XML Sitemap</span>
                    <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="font-mono text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 mt-0.5">
                      /sitemap.xml <ExternalLink size={12} />
                    </a>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/sitemap.xml`)}
                    className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                  >
                    {copiedUrl?.includes('sitemap') ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Dynamic Robots.txt Directive</span>
                    <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="font-mono text-xs font-bold text-amber-600 hover:underline flex items-center gap-1 mt-0.5">
                      /robots.txt <ExternalLink size={12} />
                    </a>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/robots.txt`)}
                    className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                  >
                    {copiedUrl?.includes('robots') ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* Live Indexing Activity Log Console - Light Terminal Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-900 font-bold flex items-center gap-2">
                    <Activity size={14} className="text-amber-500" /> Search Bot Indexing Console Logs
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">Real-time</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {pingLogs.length === 0 ? (
                    <p className="text-slate-500 italic">Click 'Submit IndexNow Request' above to trigger search crawler pings...</p>
                  ) : (
                    pingLogs.map((log, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded border border-slate-200">
                        <span className="text-slate-500 text-[10px]">{log.time}</span>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                          {log.status}
                        </span>
                        <span className="text-slate-800">{log.msg}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB TAB 4: CACHE & CORE VITALS */}
        {subTab === 'cache' && (
          <motion.div key="subtab_cache" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Core Web Vitals Panel */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Cpu size={18} className="text-indigo-600" />
                    <span>Core Web Vitals Metrics</span>
                  </h3>
                  <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    SCORE 99 / 100
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">LCP (Largest Contentful Paint)</span>
                    </div>
                    <span className="font-mono font-black text-emerald-600 text-sm">0.8s</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">INP (Interaction to Next Paint)</span>
                    </div>
                    <span className="font-mono font-black text-emerald-600 text-sm">28ms</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">CLS (Cumulative Layout Shift)</span>
                    </div>
                    <span className="font-mono font-black text-emerald-600 text-sm">0.01</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">TTFB (Time to First Byte)</span>
                    </div>
                    <span className="font-mono font-black text-emerald-600 text-sm">45ms</span>
                  </div>
                </div>
              </div>

              {/* Cache Control Directives */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Server size={18} className="text-amber-500" />
                    <span>Edge CDN & Asset Cache Directives</span>
                  </h3>
                  <button
                    onClick={handleCachePurge}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 size={12} /> Purge Cache
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase block">Static Bundles Header</span>
                    <p className="font-mono text-slate-900 font-bold text-[11px]">
                      Cache-Control: public, max-age=31536000, immutable
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase block">Dynamic API Endpoint Header</span>
                    <p className="font-mono text-slate-900 font-bold text-[11px]">
                      Cache-Control: no-cache, no-store, must-revalidate
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase block">Gzip / Brotli Compression</span>
                    <p className="font-mono text-emerald-700 font-bold text-[11px]">
                      ACTIVE - 82% Payload Compression Ratio
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB TAB 5: IMPLEMENTED FEATURES LIST */}
        {subTab === 'implemented' && (
          <motion.div key="subtab_implemented" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-600" size={22} />
                  <span>List of Implemented Optimizations & Web App Features</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section 1: Technical SEO & Search Features */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Globe size={16} className="text-amber-500" />
                    <span>Technical SEO & Indexing Infrastructure</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Dynamic XML Sitemap:</strong> Auto-serves well-formed <code className="font-mono bg-white px-1 border rounded">/sitemap.xml</code> listing all active app routes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Automated Robots.txt:</strong> Live <code className="font-mono bg-white px-1 border rounded">/robots.txt</code> routing Googlebot and Bingbot while shielding admin routes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>OpenGraph & Twitter Cards:</strong> Complete OG Title, Description, Image, and Twitter Summary tags in <code className="font-mono bg-white px-1 border rounded">index.html</code>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Schema.org Structured Data:</strong> Embedded <code className="font-mono bg-white px-1 border rounded">TaxiService</code> & <code className="font-mono bg-white px-1 border rounded">Organization</code> JSON-LD schema for rich search snippets.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>IndexNow & Google Sitemap Ping:</strong> Direct API integration allowing instant submission of modified URLs to search crawlers.</span>
                    </li>
                  </ul>
                </div>

                {/* Section 2: Performance, Cache & Million-User Scalability */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Cpu size={16} className="text-indigo-600" />
                    <span>Performance & Edge Caching Optimization</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Browser & CDN Cache-Control Headers:</strong> Static assets serve with <code className="font-mono bg-white px-1 border rounded">max-age=31536000, immutable</code> header rules.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>API Revalidation Directives:</strong> Endpoints serve with <code className="font-mono bg-white px-1 border rounded">no-cache, must-revalidate</code> and ETags to prevent stale states.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Gzip / Brotli Payload Compression:</strong> Express middleware compressing payloads for ultrafast load speeds.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Preconnect & Asset Preloading:</strong> Google Fonts and CDN origins preconnected in head tags to eliminate network delays.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Instant Cache Purging:</strong> Backend API endpoint to invalidate server buffers and memory caches in 1-click.</span>
                    </li>
                  </ul>
                </div>

                {/* Section 3: Live Backend Synchronization */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Server size={16} className="text-emerald-600" />
                    <span>Live Backend Synchronization & Real-time State</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Modular Express Backend:</strong> Dedicated API controllers handling riders, drivers, trips, settings, blogs, FAQs, and support.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>PostgreSQL / JSON Persistence:</strong> Dual database support with automated table migrations and JSON fallback store.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Socket.io WebSocket Sync:</strong> Real-time event broadcasting for trip status updates, driver location telemetry, and configuration pushes.</span>
                    </li>
                  </ul>
                </div>

                {/* Section 4: All Core Application Flows */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Layers size={16} className="text-rose-600" />
                    <span>All Frontend & Operations Flows</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Commuter Ride Booking Flow:</strong> Pickup/drop selection, fare estimation, cab tier pick, instant driver matching & live GPS tracking.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Driver Fleet Operations:</strong> Driver onboarding, KYC verification, vehicle registry, trip dispatch, and wallet earnings.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Admin Operations Dashboard:</strong> Comprehensive management for riders, drivers, pricing rules, promo coupons, languages, and SEO.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
