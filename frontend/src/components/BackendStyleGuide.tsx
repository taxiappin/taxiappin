import React, { useState } from 'react';
import { 
  Sparkles, Palette, Layers, Sliders, Type, Grid, Check, RefreshCw, 
  Trash2, SlidersHorizontal, Square, Heart, CheckCircle2, AlertTriangle, 
  XCircle, Info, ChevronRight, Eye, Mail, Star, Phone, ShieldCheck,
  Car, Bike, MapPin, Search, Navigation, Users, User, Shield, ArrowRight, Clock,
  Image, Sun, Moon, Globe, Maximize2, Layout, Monitor, CheckCircle,
  Copy, Lock, FileText, Smartphone, AlertCircle, HelpCircle, Bell, ArrowUpRight,
  ArrowDownRight, CheckSquare, Zap, IndianRupee, Upload, Server
} from 'lucide-react';
import { PlatformConfig, AppBranding } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogo } from './BrandLogo';
import { BackendPageShell, BackendCard, BackendStatusBadge } from './BackendPageShell';

interface BackendStyleGuideProps {
  config: PlatformConfig;
  updateConfig: (newConfig: Partial<PlatformConfig> | ((prev: PlatformConfig) => PlatformConfig)) => void;
  setToast: (toast: { show: boolean; message: string; type: 'success' | 'error' | 'info' }) => void;
}

export const BackendStyleGuide: React.FC<BackendStyleGuideProps> = ({ config, updateConfig, setToast }) => {
  const branding = config.branding || {
    primaryColor: '#F2B33D',
    secondaryColor: '#12141A',
    accentColor: '#F2B33D',
    bgColor: '#FAF7F2',
    surfaceCardColor: '#ffffff',
    surfaceSoftColor: '#FAF7F2',
    textColor: '#12141A',
    textColorMuted: '#64748b',
    fontFamily: 'Poppins',
    headingFontFamily: 'Poppins',
    borderRadiusMd: 16,
    borderRadiusLg: 24,
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
  };

  const [activeTab, setActiveTab] = useState<
    'logos' | 'elements' | 'foundations' | 'voice' | 'components' | 'domain' | 'layout' | 'a11y'
  >('logos');

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Sample Interactive Component States
  const [demoInput, setDemoInput] = useState('Rahul Sharma');
  const [demoSelect, setDemoSelect] = useState('sedan');
  const [demoToggle, setDemoToggle] = useState(true);
  const [demoCheckbox, setDemoCheckbox] = useState(true);
  const [demoActiveTab, setDemoActiveTab] = useState('active');
  const [demoSearch, setDemoSearch] = useState('Cyber Towers Metro');
  const [demoCheck1, setDemoCheck1] = useState(true);
  const [demoCheck2, setDemoCheck2] = useState(false);
  const [demoCheck3, setDemoCheck3] = useState(true);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setToast({
      show: true,
      message: `Copied ${label} to clipboard!`,
      type: 'success',
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const updateBrandingField = (key: keyof typeof branding, value: any) => {
    updateConfig(prev => {
      const currentBranding = prev.branding || branding;
      return {
        ...prev,
        branding: {
          ...currentBranding,
          [key]: value
        }
      };
    });
    setToast({
      show: true,
      message: `Updated brand token "${String(key)}".`,
      type: 'info'
    });
  };

  const handleLogoUpload = (fieldKey: keyof typeof branding, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      updateBrandingField(fieldKey, dataUrl);
      setToast({
        show: true,
        message: `Uploaded new image for "${String(fieldKey)}"!`,
        type: 'success',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefault = () => {
    updateConfig(prev => ({
      ...prev,
      branding: {
        primaryColor: '#F2B33D',
        secondaryColor: '#12141A',
        accentColor: '#F2B33D',
        bgColor: '#FAF7F2',
        surfaceCardColor: '#ffffff',
        surfaceSoftColor: '#FAF7F2',
        textColor: '#12141A',
        textColorMuted: '#64748b',
        fontFamily: 'Poppins',
        headingFontFamily: 'Poppins',
        borderRadiusMd: 16,
        borderRadiusLg: 24,
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
      }
    }));
    setToast({
      show: true,
      message: 'Design System parameters restored to standard defaults.',
      type: 'success'
    });
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-900 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
                Design System & Style Guide
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider inline-block mt-0.5">
                v2.4 Production Token Standard
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleResetToDefault}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition shadow-xs cursor-pointer shrink-0 self-start md:self-center"
        >
          <Trash2 size={14} className="text-rose-600" />
          Reset Default Tokens
        </button>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'logos', label: '1. Logos & Identity', icon: Image },
          { id: 'elements', label: '2. Elements & Components', icon: Grid },
          { id: 'foundations', label: '3. Foundations & Tokens', icon: Palette },
          { id: 'voice', label: '4. Brand Voice', icon: FileText },
          { id: 'components', label: '5. Form Controls', icon: Sliders },
          { id: 'domain', label: '6. Domain (Taxi/Ride)', icon: Car },
          { id: 'layout', label: '7. Layout Templates', icon: Layout },
          { id: 'a11y', label: '8. Accessibility', icon: ShieldCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-4 text-xs rounded-xl transition-all shrink-0 outline-none flex items-center gap-2 cursor-pointer whitespace-nowrap font-bold ${
                isActive 
                  ? 'bg-amber-400 text-slate-950 font-black border border-amber-500/50 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon size={16} className={isActive ? "text-slate-950" : "text-amber-500"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: ELEMENTS SHOWCASE */}
      {activeTab === 'elements' && (
        <div className="space-y-8">
          {/* 1. Tabs Style Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Grid size={18} className="text-amber-600" /> 1. Tabs Style (Standard Navigation Pills)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Pill-shaped tab bar container with Taxi Amber highlight and high-contrast dark text.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 font-semibold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                p-2 bg-white border border-slate-200 rounded-2xl shadow-sm
              </span>
            </div>

            <div className="space-y-4">
              {/* Interactive Demo Tabs */}
              <div className="inline-flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm gap-1.5 overflow-x-auto no-scrollbar max-w-full">
                {[
                  { id: 'active', label: 'Active Trips' },
                  { id: 'pending', label: 'Pending Approvals' },
                  { id: 'history', label: 'Ride History' },
                  { id: 'cancelled', label: 'Cancelled' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDemoActiveTab(tab.id)}
                    className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all outline-none cursor-pointer shrink-0 whitespace-nowrap ${
                      demoActiveTab === tab.id
                        ? 'bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-1">
                  <span className="font-bold text-amber-900 block">Active Tab Specs:</span>
                  <p className="text-amber-800">Taxi Amber Indicator (<code className="font-mono">#F2B33D</code> / <code className="font-mono">bg-amber-400</code>), High-Contrast Dark Slate Text (<code className="font-mono">#0F172A</code> / <code className="font-mono">text-slate-950</code>), <code className="font-mono">font-bold</code> weight, and soft elevated shadow.</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="font-bold text-slate-900 block">Inactive Tab Specs:</span>
                  <p className="text-slate-600">Muted Slate Text (<code className="font-mono">#64748B</code> / <code className="font-mono">text-slate-600</code>), smooth zero-layout-shift hover transition to dark text (<code className="font-mono">#1E293B</code>).</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Card Style (BackendCard) Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers size={18} className="text-amber-600" /> 2. Card Style (<code className="text-amber-700 font-mono">BackendCard</code>)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Pure Crisp White canvas (#FFFFFF), hairline 1px border, 20px-24px padding hierarchy, ambient depth shadow.
                </p>
              </div>
            </div>

            <BackendCard
              title="Live Fleet Operations Panel"
              subtitle="Real-time telemetry and dispatch queue across Hyderabad city zone"
              action={
                <button className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer">
                  Export Log CSV
                </button>
              }
            >
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-2">
                <p className="font-semibold text-slate-900">
                  Card Design Specifications:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li><strong>Canvas Background:</strong> Pure Crisp White (<code className="font-mono">#FFFFFF</code>)</li>
                  <li><strong>Borders:</strong> Hairline border <code className="font-mono">1px solid rgba(226, 232, 240, 0.8)</code></li>
                  <li><strong>Shadow:</strong> Ambient drop shadow <code className="font-mono">0 10px 30px -10px rgba(0,0,0,0.04)</code></li>
                  <li><strong>Padding:</strong> 20px–24px responsive padding (<code className="font-mono">p-5 md:p-6</code>)</li>
                </ul>
              </div>
            </BackendCard>
          </div>

          {/* 3. Radius System Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-amber-600" /> 3. Corner Radius Curvature System
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Mathematical corner radii scaling for hierarchy & touch clarity.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-2xl bg-amber-400/30 border border-amber-400/50 flex items-center justify-center font-bold text-xs text-amber-900">24</div>
                <h4 className="text-xs font-bold text-slate-900">1.5rem / 24px (rounded-2xl)</h4>
                <p className="text-[11px] text-slate-500">Page Containers, Main Admin Cards & Modals</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/30 border border-amber-400/50 flex items-center justify-center font-bold text-xs text-amber-900">16</div>
                <h4 className="text-xs font-bold text-slate-900">1rem / 16px (rounded-xl)</h4>
                <p className="text-[11px] text-slate-500">Metric Stat Cards, Input Fields & Dropdowns</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400/30 border border-amber-400/50 flex items-center justify-center font-bold text-xs text-amber-900">12</div>
                <h4 className="text-xs font-bold text-slate-900">0.75rem / 12px (rounded-lg)</h4>
                <p className="text-[11px] text-slate-500">Buttons, Nested Tooltips & Icon Containers</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-full border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-400/30 border border-amber-400/50 flex items-center justify-center font-bold text-xs text-amber-900">Full</div>
                <h4 className="text-xs font-bold text-slate-900">Pill Cap (rounded-full)</h4>
                <p className="text-[11px] text-slate-500">Status Badges, Filter Tags & Avatars</p>
              </div>
            </div>
          </div>

          {/* 4. Toggle Style Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders size={18} className="text-amber-600" /> 4. Interactive Toggle Style
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Pill-shaped rounded track with sliding white circular thumb and yellow active state.</p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {/* Yellow Active Toggle */}
              <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-full border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setDemoToggle(!demoToggle)}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                    demoToggle ? 'bg-amber-400' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                      demoToggle ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Taxi Yellow Track</span>
                  <span className="text-[11px] text-slate-500">{demoToggle ? 'ENABLED' : 'DISABLED'}</span>
                </div>
              </div>

              {/* Secondary Active Toggle */}
              <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-full border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setDemoCheckbox(!demoCheckbox)}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                    demoCheckbox ? 'bg-amber-400' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`w-5.5 h-5.5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                      demoCheckbox ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Yellow Active Track</span>
                  <span className="text-[11px] text-slate-500">{demoCheckbox ? 'ACTIVE' : 'PAUSED'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Core Reusable Component Suite Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare size={18} className="text-amber-600" /> 5. Core Elements & Reusable Component Suite
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                BackendPageShell, Metric Stat Cards, Data Tables, Status Badges, Form Controls, and Action Buttons.
              </p>
            </div>

            {/* A. Status Badges */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Badges (BackendStatusBadge)</h4>
              <div className="flex flex-wrap items-center gap-3">
                <BackendStatusBadge status="ACTIVE" variant="green" />
                <BackendStatusBadge status="PENDING REVIEW" variant="amber" />
                <BackendStatusBadge status="SUSPENDED" variant="red" />
                <BackendStatusBadge status="IN TRANSIT" variant="blue" />
                <BackendStatusBadge status="INACTIVE" variant="gray" />
              </div>
            </div>

            {/* B. Data Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Harmonized Data Table Standard</h4>
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      <th>Trip ID</th>
                      <th>Rider Name</th>
                      <th>Vehicle Class</th>
                      <th>Fare Amount</th>
                      <th>Trip Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-mono text-xs font-bold text-slate-900">#TRP-9021</td>
                      <td className="font-semibold text-slate-800">Ananya Sharma</td>
                      <td>Prime Sedan</td>
                      <td className="font-bold text-slate-900">₹ 420.00</td>
                      <td><BackendStatusBadge status="COMPLETED" variant="green" /></td>
                    </tr>
                    <tr>
                      <td className="font-mono text-xs font-bold text-slate-900">#TRP-9022</td>
                      <td className="font-semibold text-slate-800">Vikramaditya Rao</td>
                      <td>Express Bike</td>
                      <td className="font-bold text-slate-900">₹ 110.00</td>
                      <td><BackendStatusBadge status="IN PROGRESS" variant="blue" /></td>
                    </tr>
                    <tr>
                      <td className="font-mono text-xs font-bold text-slate-900">#TRP-9023</td>
                      <td className="font-semibold text-slate-800">Suresh Reddy</td>
                      <td>Premium SUV</td>
                      <td className="font-bold text-slate-900">₹ 850.00</td>
                      <td><BackendStatusBadge status="PENDING" variant="amber" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* C. Form Controls & Buttons */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Form Controls & Action Buttons</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Standard Input</label>
                  <input
                    type="text"
                    defaultValue="sample@taxiapp.com"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Standard Select</label>
                  <select className="w-full">
                    <option>Active Hyderabad Zone</option>
                    <option>Bangalore Central</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <button className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-xs cursor-pointer">
                    Primary Action
                  </button>
                  <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-xs transition cursor-pointer">
                    Secondary
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Stats Cards Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap size={18} className="text-amber-600" /> 6. Metric Stat Cards (Dashboard Overview Widgets)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Key performance metric cards with clean big numbers, label subtitles, icon containers, and trend indicators.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Gross Daily Fare</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-300/40 text-amber-900 flex items-center justify-center shrink-0">
                    <IndianRupee size={18} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">₹ 1,42,850</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-700">
                    <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center gap-0.5">
                      <ArrowUpRight size={12} /> +14.2%
                    </span>
                    <span className="text-slate-400 font-normal">vs last week</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Active Online Drivers</span>
                  <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 flex items-center justify-center shrink-0">
                    <Users size={18} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">384 Drivers</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-700">
                    <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center gap-0.5">
                      <ArrowUpRight size={12} /> +8.1%
                    </span>
                    <span className="text-slate-400 font-normal">vs peak hour</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Completed Trips</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                    <Car size={18} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">1,290 Rides</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-700">
                    <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center gap-0.5">
                      <ArrowUpRight size={12} /> +5.4%
                    </span>
                    <span className="text-slate-400 font-normal">today</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Cancellation Rate</span>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center shrink-0">
                    <AlertTriangle size={18} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">1.8 %</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-700">
                    <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md inline-flex items-center gap-0.5">
                      <ArrowDownRight size={12} /> -0.4%
                    </span>
                    <span className="text-slate-400 font-normal">improved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Checkbox Styles Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare size={18} className="text-amber-600" /> 7. Styled Checkboxes & Multi-Select Controls
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Custom checkboxes with Taxi Amber active fill, rounded corners, and clear checkmark feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setDemoCheck1(!demoCheck1)}
                  className={`w-5 h-5 rounded-md border transition flex items-center justify-center cursor-pointer ${
                    demoCheck1 
                      ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-xs' 
                      : 'bg-white border-slate-300 hover:border-amber-400'
                  }`}
                >
                  {demoCheck1 && <Check size={14} className="stroke-[3]" />}
                </button>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Auto-Dispatch Enabled</span>
                  <span className="text-[11px] text-slate-500">Taxi Amber Active State</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setDemoCheck2(!demoCheck2)}
                  className={`w-5 h-5 rounded-md border transition flex items-center justify-center cursor-pointer ${
                    demoCheck2 
                      ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-xs' 
                      : 'bg-white border-slate-300 hover:border-amber-400'
                  }`}
                >
                  {demoCheck2 && <Check size={14} className="stroke-[3]" />}
                </button>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Surge Pricing Override</span>
                  <span className="text-[11px] text-slate-500">Unchecked State</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-not-allowed select-none opacity-60">
                <div className="w-5 h-5 rounded-md bg-slate-200 border border-slate-300 text-slate-500 flex items-center justify-center">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">System Mandatory GPS</span>
                  <span className="text-[11px] text-slate-500">Disabled Checked State</span>
                </div>
              </label>
            </div>
          </div>

          {/* 8. Search Bar Style Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Search size={18} className="text-amber-600" /> 8. Search Bar & Filter Inputs
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Standardized search field with left magnifying glass icon, clear button, and keyboard shortcut pill.
              </p>
            </div>

            <div className="max-w-xl space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={demoSearch}
                  onChange={(e) => setDemoSearch(e.target.value)}
                  placeholder="Search trips by ID, rider name, or drop-off zone..."
                  className="w-full pl-10 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-none transition shadow-xs font-medium"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {demoSearch && (
                    <button
                      onClick={() => setDemoSearch('')}
                      className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-md transition cursor-pointer"
                    >
                      <XCircle size={14} />
                    </button>
                  )}
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                    ⌘K
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Filter result: <strong className="text-slate-700">"{demoSearch || 'All Results'}"</strong>
              </p>
            </div>
          </div>

          {/* 9. Iconography System Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-600" /> 9. Iconography System (Lucide Icon Containers)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Consistent 2px stroke width icons inside rounded pastel brand containers.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { icon: Car, label: 'Car Tier', color: 'bg-amber-400/15 border-amber-300/40 text-amber-900' },
                { icon: Navigation, label: 'GPS Route', color: 'bg-sky-50 border-sky-200 text-sky-800' },
                { icon: MapPin, label: 'Location', color: 'bg-rose-50 border-rose-200 text-rose-800' },
                { icon: ShieldCheck, label: 'Verified', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                { icon: IndianRupee, label: 'Fare', color: 'bg-amber-50 border-amber-200 text-amber-800' },
                { icon: Users, label: 'Riders', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
                { icon: Clock, label: 'Duration', color: 'bg-slate-100 border-slate-200 text-slate-700' },
                { icon: Phone, label: 'Contact', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                { icon: Star, label: 'Rating', color: 'bg-amber-50 border-amber-200 text-amber-700' },
                { icon: Mail, label: 'Support', color: 'bg-purple-50 border-purple-200 text-purple-800' },
                { icon: Shield, label: 'Safety', color: 'bg-sky-50 border-sky-200 text-sky-800' },
                { icon: Zap, label: 'Surge', color: 'bg-amber-400/20 border-amber-400/50 text-slate-950' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center text-center space-y-2">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 10. Parameter Styles Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-amber-600" /> 10. Parameter Styles & Config Cards
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Key-value parameters, JSON configuration blocks, and copyable token variables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 block">System Key-Value Parameter Table</span>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="p-2.5 bg-slate-50 flex justify-between font-bold text-slate-700">
                    <span>Parameter Key</span>
                    <span>Active Value</span>
                  </div>
                  <div className="p-2.5 flex justify-between items-center">
                    <span className="font-mono text-slate-600 text-[11px]">base_fare_sedan</span>
                    <span className="font-bold text-slate-900">₹ 60.00 / 3km</span>
                  </div>
                  <div className="p-2.5 flex justify-between items-center">
                    <span className="font-mono text-slate-600 text-[11px]">per_km_rate</span>
                    <span className="font-bold text-slate-900">₹ 14.50 / km</span>
                  </div>
                  <div className="p-2.5 flex justify-between items-center">
                    <span className="font-mono text-slate-600 text-[11px]">surge_multiplier_max</span>
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">2.5x</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Code Snippet JSON Parameter</span>
                  <button
                    onClick={() => copyToClipboard('{\n  "dispatch_radius_km": 5.0,\n  "driver_timeout_sec": 30\n}', 'Config JSON')}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy size={12} /> Copy Token
                  </button>
                </div>
                <pre className="p-3.5 bg-slate-900 text-amber-300 font-mono text-[11px] rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
{`{
  "dispatch_radius_km": 5.0,
  "driver_timeout_sec": 30,
  "currency": "INR",
  "live_gps_ping_interval_ms": 3000
}`}
                </pre>
              </div>
            </div>
          </div>

          {/* 11. Map Styles Showcase */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Navigation size={18} className="text-amber-600" /> 11. Map Container & Live GPS Marker Styles
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Grayscale background map styling, pick-up/drop-off pins, live driver radar pulse, and route overlay pills.
              </p>
            </div>

            <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 shadow-md">
              {/* Simulated Map Canvas */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              
              {/* Route Polyline Simulation */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 120 180 Q 250 80 480 140 T 750 90"
                  fill="none"
                  stroke="#F2B33D"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  className="animate-pulse"
                />
              </svg>

              {/* Pickup Pin */}
              <div className="absolute top-[160px] left-[100px] flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 shadow-md">
                <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Pickup Pin</span>
                  <span className="text-xs font-bold text-slate-900">Cyber Towers</span>
                </div>
              </div>

              {/* Driver Live GPS Marker */}
              <div className="absolute top-[100px] left-[320px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative">
                  <span className="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping" />
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-bold border-2 border-white shadow-lg flex items-center justify-center shrink-0">
                    <Car size={20} />
                  </div>
                </div>
                <span className="mt-1 px-2 py-0.5 bg-slate-950 text-amber-300 text-[10px] font-mono font-bold rounded-md shadow-xs border border-slate-800">
                  TS 09 EA 4482
                </span>
              </div>

              {/* Dropoff Pin */}
              <div className="absolute top-[70px] left-[700px] flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 shadow-md">
                <div className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-100" />
                <div>
                  <span className="text-[10px] font-bold text-rose-800 uppercase block">Drop-off Pin</span>
                  <span className="text-xs font-bold text-slate-900">Airport T1</span>
                </div>
              </div>

              {/* Map Floating Meta Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200/80 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">Distance & ETA</span>
                    <span className="text-[11px] text-slate-500 block">18.4 km • 28 mins route optimization</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200">
                    GPS Signal Strong (100%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 1: FOUNDATIONS & DESIGN TOKENS */}
      {activeTab === 'foundations' && (
        <div className="space-y-8">
          {/* Color Palette */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Palette size={18} className="text-amber-600" /> Color Palette & Semantic Tokens
                </h3>
                <p className="text-xs text-slate-500 font-medium">Defined color roles with exact hex values and guidelines.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Taxi Amber (Primary)', hex: '#F2B33D', role: 'Brand buttons, primary highlights, active badges', bg: 'bg-[#F2B33D]', text: 'text-slate-900' },
                { name: 'Deep Ink (Secondary)', hex: '#12141A', role: 'Primary headings, dark accents, high contrast text', bg: 'bg-[#12141A]', text: 'text-white' },
                { name: 'Warm Canvas (Background)', hex: '#FAF7F2', role: 'Page canvas, soft card background tone', bg: 'bg-[#FAF7F2]', text: 'text-slate-900', border: 'border border-slate-300' },
                { name: 'Pure Surface (Card)', hex: '#FFFFFF', role: 'Main card containers, dropdowns, inputs', bg: 'bg-white', text: 'text-slate-900', border: 'border border-slate-200' },
                { name: 'Emerald (Success)', hex: '#3D8B6B', role: 'Verified status, positive financial earnings', bg: 'bg-[#3D8B6B]', text: 'text-white' },
                { name: 'Rose (Danger)', hex: '#C0453A', role: 'Errors, cancellations, suspension badges', bg: 'bg-[#C0453A]', text: 'text-white' },
                { name: 'Amber Glow (Warning)', hex: '#F59E0B', role: 'Pending reviews, attention alerts', bg: 'bg-[#F59E0B]', text: 'text-slate-900' },
                { name: 'Slate Gray (Muted Text)', hex: '#64748B', role: 'Subtitles, secondary labels, disabled text', bg: 'bg-[#64748B]', text: 'text-white' },
              ].map((color, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200/80 space-y-3 hover:border-slate-300 transition">
                  <div className={`h-16 rounded-lg ${color.bg} ${color.border || ''} flex items-end p-2.5 shadow-xs`}>
                    <span className={`text-xs font-mono font-bold ${color.text}`}>{color.hex}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{color.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">{color.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Scale */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Type size={18} className="text-amber-600" /> Typography Scale & Hierarchy
                </h3>
                <p className="text-xs text-slate-500 font-medium">Primary Font: Poppins / Plus Jakarta Sans. Line-height & size scale.</p>
              </div>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              <div className="pt-2 grid grid-cols-1 md:grid-cols-4 items-baseline gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">Heading 1 (24px / 1.5rem)</span>
                <h1 className="md:col-span-3 text-2xl font-bold text-slate-900 font-sans tracking-tight">
                  Driver Fleet Performance Overview
                </h1>
              </div>

              <div className="pt-4 grid grid-cols-1 md:grid-cols-4 items-baseline gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">Heading 2 (20px / 1.25rem)</span>
                <h2 className="md:col-span-3 text-xl font-bold text-slate-900 font-sans tracking-tight">
                  Active Ride Assignments & Fare Breakdown
                </h2>
              </div>

              <div className="pt-4 grid grid-cols-1 md:grid-cols-4 items-baseline gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">Heading 3 (18px / 1.125rem)</span>
                <h3 className="md:col-span-3 text-lg font-semibold text-slate-900 font-sans">
                  Vehicle Verification & License Clearance
                </h3>
              </div>

              <div className="pt-4 grid grid-cols-1 md:grid-cols-4 items-baseline gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">Body Large (15px / 0.9375rem)</span>
                <p className="md:col-span-3 text-sm text-slate-700 font-normal leading-relaxed">
                  All active rides are monitored via automated real-time GPS ping logs. Drivers are matched based on proximity and vehicle class eligibility.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-1 md:grid-cols-4 items-baseline gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">Body Standard (13.5px / 0.84375rem)</span>
                <p className="md:col-span-3 text-xs text-slate-600 font-normal leading-relaxed">
                  Standard table cell values, form labels, and operational descriptions run on 13.5px with comfortable line height to preserve readability.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-1 md:grid-cols-4 items-baseline gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">Caption / Micro (11px / 0.6875rem)</span>
                <span className="md:col-span-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Updated 2 minutes ago • Session ID: #TRP-8849-HYD
                </span>
              </div>
            </div>
          </div>

          {/* Spacing, Corner Radii & Elevation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal size={16} className="text-amber-600" /> Corner Radius Tokens
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
                  <span className="font-semibold text-slate-700">Small (8px)</span>
                  <span className="font-mono text-slate-400">Tooltips, badges</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                  <span className="font-semibold text-slate-700">Medium (14px)</span>
                  <span className="font-mono text-slate-400">Buttons, form inputs</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <span className="font-semibold text-slate-700">Large (24px)</span>
                  <span className="font-mono text-slate-400">Main card containers</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers size={16} className="text-amber-600" /> Elevation & Shadows
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-200">
                  <span className="font-semibold text-slate-800">Shadow Extra Small (shadow-xs)</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl shadow-md border border-slate-100">
                  <span className="font-semibold text-slate-800">Shadow Medium (shadow-md)</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl shadow-xl border border-slate-100">
                  <span className="font-semibold text-slate-800">Shadow Large (shadow-xl)</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Zap size={16} className="text-amber-600" /> Motion & Transitions
              </h4>
              <div className="space-y-2 text-xs text-slate-600 font-medium">
                <p>• Easing: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">cubic-bezier(0.16, 1, 0.3, 1)</code></p>
                <p>• Standard duration: 200ms - 300ms</p>
                <p>• Modal slide-up transition: 250ms easeOut</p>
                <p>• Tab switch fade: 150ms opacity transition</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 2: BRAND VOICE & MICROCOPY RULES */}
      {activeTab === 'voice' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText size={18} className="text-amber-600" /> Brand Voice & Copywriting Directives
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Active voice, plain language, concise labels, helpful action-oriented guidance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Copy Principles</h4>
                
                <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle size={15} /> 1. Active & Direct Verb Construction
                  </span>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    Name actions clearly by what the user controls. Prefer "Approve Driver Registration" over "Driver status can be modified here".
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle size={15} /> 2. Transparent Error Messages
                  </span>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    Explain what happened and how to solve it. Avoid vague codes like "Error 500". Use "Invalid phone number formatting. Include country code +91."
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Microcopy Examples</h4>

                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="p-3 bg-slate-50 flex justify-between font-bold text-slate-700">
                    <span>Scenario</span>
                    <span>Approved Microcopy</span>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <span className="font-medium text-slate-500">Empty List</span>
                    <span className="font-semibold text-slate-900">"No pending driver approvals found."</span>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <span className="font-medium text-slate-500">Delete Action</span>
                    <span className="font-semibold text-slate-900">"Remove Service Tier"</span>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <span className="font-medium text-slate-500">Loading State</span>
                    <span className="font-semibold text-slate-900">"Syncing active GPS pings..."</span>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <span className="font-medium text-slate-500">Success Toast</span>
                    <span className="font-semibold text-slate-900">"Base fare updated successfully."</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 3: CORE COMPONENTS */}
      {activeTab === 'components' && (
        <div className="space-y-8">
          {/* Buttons & Actions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders size={18} className="text-amber-600" /> Buttons & Action Controls
              </h3>
              <p className="text-xs text-slate-500 font-medium">Standardized button variants across primary, secondary, outline, ghost, and danger states.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl transition shadow-xs cursor-pointer inline-flex items-center gap-2">
                Primary Brand Button <ArrowRight size={14} />
              </button>

              <button className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer inline-flex items-center gap-2">
                Secondary Dark Button
              </button>

              <button className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer inline-flex items-center gap-2">
                Outline Standard Button
              </button>

              <button className="px-4 py-2.5 bg-rose-50 border border-rose-200/80 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-2">
                <Trash2 size={14} /> Danger Action
              </button>

              <button disabled className="px-4 py-2.5 bg-slate-100 text-slate-400 text-xs font-semibold rounded-xl cursor-not-allowed">
                Disabled State
              </button>
            </div>
          </div>

          {/* Form Inputs & Selects */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Form Inputs, Toggles & Select Controls</h3>
              <p className="text-xs text-slate-500 font-medium">Standardized form control elements with consistent focus borders.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Driver Name Field</label>
                <input
                  type="text"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Vehicle Category Select</label>
                <select
                  value={demoSelect}
                  onChange={(e) => setDemoSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:border-amber-500 focus:outline-none"
                >
                  <option value="sedan">Prime Sedan</option>
                  <option value="suv">Premium SUV</option>
                  <option value="bike">Express Bike</option>
                  <option value="auto">City Auto Tuk-Tuk</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-slate-700 block">Interactive Switch Toggle</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDemoToggle(!demoToggle)}
                    className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                      demoToggle ? 'bg-amber-400' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`w-5.5 h-5.5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                        demoToggle ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-semibold text-slate-700">
                    {demoToggle ? 'Feature Active' : 'Feature Paused'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Pills & Badges */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Status Pills & Indicator Badges</h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Active / Verified
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Pending Review
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 uppercase tracking-wider inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Suspended
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 uppercase tracking-wider inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600" /> In Transit
              </span>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 4: DOMAIN-SPECIFIC COMPONENTS (TAXI & RIDE) */}
      {activeTab === 'domain' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trip Booking Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-400 font-mono">#TRP-2026-HYD-993</span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
                  Matched Driver
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-xs text-slate-800 font-semibold">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">Hitech City Cyber Towers, Hyderabad</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-800 font-semibold">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <span className="truncate">Rajiv Gandhi Intl Airport (Terminal 1)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculated Fare</span>
                  <span className="text-lg font-bold text-slate-900 flex items-center">
                    <IndianRupee size={16} /> 680.00
                  </span>
                </div>
                <button className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition">
                  Track Live GPS
                </button>
              </div>
            </div>

            {/* Driver Profile Summary Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700 font-bold text-xl">
                VK
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 truncate">Vikram Kumar</h4>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Star size={12} className="fill-amber-500 text-amber-500" /> 4.92
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium truncate">White Toyota Innova Crysta • TS 09 EA 4482</p>
                <p className="text-[11px] text-emerald-700 font-semibold">1,420 Completed Rides • Verified DL & Aadhaar</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 5: LAYOUT PATTERNS */}
      {activeTab === 'layout' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layout size={18} className="text-amber-600" /> Page Shells & Screen Grid Blueprint
            </h3>
            <p className="text-xs text-slate-500 font-medium">Standardized layout container rules across all 49+ admin views.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">1. Admin Table Page Pattern</h4>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="h-6 bg-slate-100 rounded-md flex items-center px-2 text-[10px] font-bold text-slate-500">Page Header + Action Buttons</div>
                <div className="h-12 bg-amber-50 border border-amber-200 rounded-md flex items-center px-2 text-[10px] font-bold text-amber-800">4-Card Stat Counter Grid</div>
                <div className="h-20 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">Data Table Container</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-900">2. Form / Detail View Pattern</h4>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="h-6 bg-slate-100 rounded-md flex items-center px-2 text-[10px] font-bold text-slate-500">Header + Back Navigation</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 h-24 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">Main Form Panel</div>
                  <div className="h-24 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400">Side Meta Info</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAYER 6: ACCESSIBILITY GUIDELINES */}
      {activeTab === 'a11y' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-amber-600" /> Accessibility & Compliance Standards
            </h3>
            <p className="text-xs text-slate-500 font-medium">WCAG AA compliance, high contrast text, and touch target rules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">Contrast Ratios</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                All body text achieves WCAG AA ratio of 4.5:1 against card backgrounds. Primary text uses #12141A or #0F172A over white.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">Tap Target Sizes</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mobile interactive controls have a minimum touch footprint of 44px by 44px to prevent mis-clicks during driver operation.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">Focus State Ringing</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Keyboard navigation is supported across all input controls with a prominent 3px focus ring <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded text-[11px]">rgba(242, 179, 61, 0.3)</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LOGOS & IDENTITY TAB */}
      {activeTab === 'logos' && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="bg-amber-50/80 border border-amber-200/90 text-slate-900 p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Centralized Branding Hub
                </span>
                <span className="text-xs text-amber-800 font-semibold">• Fully Controlled Logo Suite</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">
                Section-Specific Logo & Mode Identity Manager
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Customize separate logo variations for Rider Mode, Driver Mode, Landing Page, App Header, Backend Admin, Signup & Login Screens, Dark Mode themes, and Favicon. All settings sync real-time across frontend and backend components.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw size={14} className="text-amber-600" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Master Typography & Rendering Rules */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Type size={16} className="text-amber-500" /> Brand Typography, Tagline & Display Rules
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Control the text logo, tagline, master height, and display mode.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Brand Display Title</label>
                <input
                  type="text"
                  value={branding.textLogo || 'TaxiApp'}
                  onChange={(e) => updateBrandingField('textLogo', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                  placeholder="e.g. TaxiApp"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Brand Sub-Tagline</label>
                <input
                  type="text"
                  value={branding.tagline || 'PREMIUM MOBILITY ECOSYSTEM'}
                  onChange={(e) => updateBrandingField('tagline', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-amber-500 outline-none"
                  placeholder="e.g. PREMIUM MOBILITY"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Logo Display Type</label>
                <select
                  value={branding.logoType || 'combined'}
                  onChange={(e) => updateBrandingField('logoType', e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-amber-500 outline-none cursor-pointer"
                >
                  <option value="combined">Combined (Icon + Text)</option>
                  <option value="icon">Icon Only</option>
                  <option value="text">Text Only</option>
                  <option value="horizontal">Horizontal Banner Logo</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">Master Logo Height</label>
                  <span className="text-xs font-mono font-extrabold text-amber-600">{branding.logoHeight || 36}px</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={64}
                  value={branding.logoHeight || 36}
                  onChange={(e) => updateBrandingField('logoHeight', parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Master Google Fonts & Typography Control Console */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Type size={16} className="text-amber-500" /> Complete Font Control (Logo, Backend & Frontend)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Customize Google Fonts used across Logo, Frontend App, Headings, and Backend Admin Panel.</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-black uppercase tracking-wider">
                Google Fonts Ready
              </span>
            </div>

            {/* Font Selectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Logo Font */}
              <div className="space-y-1.5 p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
                <label className="text-xs font-extrabold text-slate-800 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Logo Font (Brand Name)
                </label>
                <select
                  value={branding.logoFontFamily || 'Poppins'}
                  onChange={(e) => updateBrandingField('logoFontFamily', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
                >
                  {['Poppins', 'Plus Jakarta Sans', 'Inter', 'Outfit', 'Space Grotesk', 'Playfair Display', 'Syne', 'Montserrat', 'Righteous', 'Cinzel', 'Urbanist', 'Sora', 'IBM Plex Sans', 'JetBrains Mono', 'Anek Latin', 'Roboto'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={branding.logoFontFamily || 'Poppins'}
                  onChange={(e) => updateBrandingField('logoFontFamily', e.target.value)}
                  placeholder="Or custom font family..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:border-amber-500 outline-none"
                />
              </div>

              {/* 2. Frontend Body Font */}
              <div className="space-y-1.5 p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
                <label className="text-xs font-extrabold text-slate-800 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Frontend Body Font
                </label>
                <select
                  value={branding.fontFamily || 'Poppins'}
                  onChange={(e) => updateBrandingField('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
                >
                  {['Poppins', 'Plus Jakarta Sans', 'Inter', 'Outfit', 'Space Grotesk', 'Playfair Display', 'Syne', 'Montserrat', 'Righteous', 'Cinzel', 'Urbanist', 'Sora', 'IBM Plex Sans', 'JetBrains Mono', 'Anek Latin', 'Roboto'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={branding.fontFamily || 'Poppins'}
                  onChange={(e) => updateBrandingField('fontFamily', e.target.value)}
                  placeholder="Or custom font family..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:border-amber-500 outline-none"
                />
              </div>

              {/* 3. Frontend Heading Font */}
              <div className="space-y-1.5 p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
                <label className="text-xs font-extrabold text-slate-800 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Frontend Heading Font
                </label>
                <select
                  value={branding.headingFontFamily || 'Poppins'}
                  onChange={(e) => updateBrandingField('headingFontFamily', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
                >
                  {['Poppins', 'Plus Jakarta Sans', 'Inter', 'Outfit', 'Space Grotesk', 'Playfair Display', 'Syne', 'Montserrat', 'Righteous', 'Cinzel', 'Urbanist', 'Sora', 'IBM Plex Sans', 'JetBrains Mono', 'Anek Latin', 'Roboto'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={branding.headingFontFamily || 'Poppins'}
                  onChange={(e) => updateBrandingField('headingFontFamily', e.target.value)}
                  placeholder="Or custom font family..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:border-amber-500 outline-none"
                />
              </div>

              {/* 4. Backend Admin Font */}
              <div className="space-y-1.5 p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
                <label className="text-xs font-extrabold text-slate-800 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Backend Admin Font
                </label>
                <select
                  value={branding.backendFontFamily || 'Poppins'}
                  onChange={(e) => updateBrandingField('backendFontFamily', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:border-amber-500 outline-none cursor-pointer"
                >
                  {['Poppins', 'Plus Jakarta Sans', 'Inter', 'Outfit', 'Space Grotesk', 'Playfair Display', 'Syne', 'Montserrat', 'Righteous', 'Cinzel', 'Urbanist', 'Sora', 'IBM Plex Sans', 'JetBrains Mono', 'Anek Latin', 'Roboto'].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={branding.backendFontFamily || 'Poppins'}
                  onChange={(e) => updateBrandingField('backendFontFamily', e.target.value)}
                  placeholder="Or custom font family..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Google Font Preset Chips */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Recommended Google Font Presets (Click to Apply All)</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Poppins', style: 'Modern Geometric' },
                  { name: 'Plus Jakarta Sans', style: 'Clean Corporate' },
                  { name: 'Inter', style: 'Ultra Tech' },
                  { name: 'Outfit', style: 'Sleek Display' },
                  { name: 'Space Grotesk', style: 'Futuristic' },
                  { name: 'Playfair Display', style: 'Editorial Serif' },
                  { name: 'Righteous', style: 'Bold Retro Logo' },
                  { name: 'Montserrat', style: 'Versatile' },
                  { name: 'Urbanist', style: 'Minimalist' },
                ].map(preset => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      updateBrandingField('logoFontFamily', preset.name);
                      updateBrandingField('fontFamily', preset.name);
                      updateBrandingField('headingFontFamily', preset.name);
                      updateBrandingField('backendFontFamily', preset.name);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{preset.name}</span>
                    <span className="text-[9px] font-medium opacity-60">({preset.style})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Realtime Font Preview Card */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">Live Typography Render Test</span>
                <span className="text-[10px] text-slate-400">Google Fonts Dynamic Injection Active</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-amber-400 font-mono block">Logo Font:</span>
                  <span style={{ fontFamily: branding.logoFontFamily || 'Poppins' }} className="text-base font-extrabold text-white block truncate">
                    {branding.textLogo || 'TaxiApp'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 font-mono block">Frontend Body:</span>
                  <p style={{ fontFamily: branding.fontFamily || 'Poppins' }} className="text-slate-300 text-xs truncate">
                    Book premium rides instantly.
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-indigo-400 font-mono block">Frontend Headings:</span>
                  <span style={{ fontFamily: branding.headingFontFamily || 'Poppins' }} className="text-sm font-black text-white block truncate">
                    WHERE TO GO NEXT?
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-rose-400 font-mono block">Backend Admin Font:</span>
                  <span style={{ fontFamily: branding.backendFontFamily || 'Poppins' }} className="text-xs font-bold text-slate-200 block truncate">
                    Dashboard & Analytics
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Section Logo Upload Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 1. RIDER MODE BRAND LOGO */}
            <LogoSectionCard
              title="Rider Mode Brand Logo & Sub-Text"
              subtitle="Custom logo image, title, and sub-text displayed on top header and drawer menu when user is in Rider Mode."
              badge="Rider Active Header"
              icon={<User size={16} className="text-amber-500" />}
              lightField="riderLogoUrl"
              lightVal={branding.riderLogoUrl || ''}
              darkField="riderDarkLogoUrl"
              darkVal={branding.riderDarkLogoUrl || ''}
              textLogoField="riderTextLogo"
              textLogoVal={branding.riderTextLogo ?? 'TaxiApp'}
              taglineField="riderTagline"
              taglineVal={branding.riderTagline ?? 'Rider'}
              showTextField="riderShowText"
              showTextVal={branding.riderShowText ?? true}
              showTaglineField="riderShowTagline"
              showTaglineVal={branding.riderShowTagline ?? true}
              modeProp="rider"
              onUpload={handleLogoUpload}
              onTextChange={updateBrandingField}
              config={config}
              section="app"
            />

            {/* 2. DRIVER MODE BRAND LOGO */}
            <LogoSectionCard
              title="Driver Mode Brand Logo & Sub-Text"
              subtitle="Custom logo image, title, and sub-text displayed on top header and drawer menu when user toggles into Driver Mode."
              badge="Driver Active Header"
              icon={<Car size={16} className="text-emerald-500" />}
              lightField="driverLogoUrl"
              lightVal={branding.driverLogoUrl || ''}
              darkField="driverDarkLogoUrl"
              darkVal={branding.driverDarkLogoUrl || ''}
              textLogoField="driverTextLogo"
              textLogoVal={branding.driverTextLogo ?? 'TaxiApp'}
              taglineField="driverTagline"
              taglineVal={branding.driverTagline ?? 'Driver'}
              showTextField="driverShowText"
              showTextVal={branding.driverShowText ?? true}
              showTaglineField="driverShowTagline"
              showTaglineVal={branding.driverShowTagline ?? true}
              modeProp="driver"
              onUpload={handleLogoUpload}
              onTextChange={updateBrandingField}
              config={config}
              section="app"
            />

            {/* 3. MASTER DEFAULT LOGO */}
            <LogoSectionCard
              title="Master Default Logo"
              subtitle="Default logo fallback used across all general views when section logos are unset."
              badge="Global Fallback"
              icon={<Sparkles size={16} className="text-amber-500" />}
              lightField="logoUrl"
              lightVal={branding.logoUrl || branding.lightLogoUrl || ''}
              darkField="darkLogoUrl"
              darkVal={branding.darkLogoUrl || ''}
              onUpload={handleLogoUpload}
              onTextChange={updateBrandingField}
              config={config}
              section="auto"
            />

            {/* 4. LANDING PAGE LOGO */}
            <LogoSectionCard
              title="Landing Page Logo"
              subtitle="Displayed on top sticky header and footer of the public landing view."
              badge="Public Landing"
              icon={<Globe size={16} className="text-amber-500" />}
              lightField="landingLogoUrl"
              lightVal={branding.landingLogoUrl || ''}
              darkField="landingDarkLogoUrl"
              darkVal={branding.landingDarkLogoUrl || ''}
              onUpload={handleLogoUpload}
              onTextChange={updateBrandingField}
              config={config}
              section="landing"
            />

            {/* 5. MAIN APP HEADER LOGO */}
            <LogoSectionCard
              title="Main General App Header Logo"
              subtitle="Displayed on top navigation bar and drawer menu in general app views."
              badge="Commuter App"
              icon={<Smartphone size={16} className="text-amber-500" />}
              lightField="appLogoUrl"
              lightVal={branding.appLogoUrl || ''}
              darkField="appDarkLogoUrl"
              darkVal={branding.appDarkLogoUrl || ''}
              onUpload={handleLogoUpload}
              onTextChange={updateBrandingField}
              config={config}
              section="app"
            />

            {/* 6. BACKEND ADMIN PANEL LOGO */}
            <LogoSectionCard
              title="Backend & Admin Shell Logo"
              subtitle="Displayed on the administrative control panel header bar and sidebar."
              badge="Admin Console"
              icon={<Server size={16} className="text-amber-500" />}
              lightField="backendLogoUrl"
              lightVal={branding.backendLogoUrl || ''}
              darkField="backendDarkLogoUrl"
              darkVal={branding.backendDarkLogoUrl || ''}
              onUpload={handleLogoUpload}
              onTextChange={updateBrandingField}
              config={config}
              section="backend"
            />

            {/* 7. SIGNUP & LOGIN PAGE LOGO */}
            <LogoSectionCard
              title="Signup & Login Screen Logo"
              subtitle="Displayed on authentication screens, OTP modals, and registration flows."
              badge="Authentication"
              icon={<Lock size={16} className="text-amber-500" />}
              lightField="authLogoUrl"
              lightVal={branding.authLogoUrl || ''}
              darkField="authDarkLogoUrl"
              darkVal={branding.authDarkLogoUrl || ''}
              onUpload={handleLogoUpload}
              onTextChange={updateBrandingField}
              config={config}
              section="auth"
            />

            {/* 6. FAVICON & HORIZONTAL LOGO */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Browser Favicon & Banner Logo</h4>
                    <p className="text-[11px] text-slate-500">Browser tab icon and wide horizontal header banners.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 shrink-0">
                  Browser & Banner
                </span>
              </div>

              {/* Favicon Control */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-500" /> Favicon (Browser Icon)
                  </label>
                  {branding.faviconUrl && (
                    <button
                      type="button"
                      onClick={() => updateBrandingField('faviconUrl', '')}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear Favicon
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 border border-amber-500 shadow-3xs">
                    <Upload size={13} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleLogoUpload('faviconUrl', e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    value={branding.faviconUrl || ''}
                    onChange={(e) => updateBrandingField('faviconUrl', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-3xs overflow-hidden">
                    <BrandLogo config={config} variant="favicon" height={20} />
                  </div>
                </div>
              </div>

              {/* Horizontal Logo Control */}
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Image size={13} className="text-amber-500" /> Wide Horizontal Banner Logo (Light)
                  </label>
                  {branding.horizontalLogoUrl && (
                    <button
                      type="button"
                      onClick={() => updateBrandingField('horizontalLogoUrl', '')}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 border border-amber-500 shadow-3xs">
                    <Upload size={13} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleLogoUpload('horizontalLogoUrl', e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    value={branding.horizontalLogoUrl || ''}
                    onChange={(e) => updateBrandingField('horizontalLogoUrl', e.target.value)}
                    placeholder="https://example.com/horizontal-logo.png"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Live Mock UI Context Previews */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Eye size={16} className="text-amber-500" /> Real-time Application Context Previews
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify how your uploaded section logos render live inside actual application headers and screens.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Landing Header Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-mono font-extrabold uppercase text-slate-500 flex items-center gap-1.5">
                  <Globe size={13} className="text-amber-600" /> 1. Public Landing Page Header Bar
                </span>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-slate-200 flex items-center justify-between shadow-3xs">
                  <BrandLogo config={config} section="landing" isDark={false} variant="combined" showTagline={false} height={28} />
                  <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg uppercase">OPEN APP</span>
                </div>
              </div>

              {/* App Navbar Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-mono font-extrabold uppercase text-slate-500 flex items-center gap-1.5">
                  <Smartphone size={13} className="text-amber-600" /> 2. Main Rider / Driver App Navbar
                </span>
                <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 flex items-center justify-between shadow-3xs">
                  <BrandLogo config={config} section="app" isDark={true} variant="combined" showTagline={false} height={26} />
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">VK</div>
                </div>
              </div>

              {/* Backend Header Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-mono font-extrabold uppercase text-slate-500 flex items-center gap-1.5">
                  <Server size={13} className="text-amber-600" /> 3. Backend Admin Console Header
                </span>
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-3xs">
                  <BrandLogo config={config} section="backend" isDark={false} variant="combined" showTagline={true} height={28} />
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-md border border-amber-300">ADMIN</span>
                </div>
              </div>

              {/* Login Card Preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-mono font-extrabold uppercase text-slate-500 flex items-center gap-1.5">
                  <Lock size={13} className="text-amber-600" /> 4. Authentication / Login Card
                </span>
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-3xs space-y-1">
                  <BrandLogo config={config} section="auth" isDark={false} layout="centered" height={36} />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface LogoSectionCardProps {
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
  lightField: keyof AppBranding;
  lightVal: string;
  darkField: keyof AppBranding;
  darkVal: string;
  onUpload: (fieldKey: keyof AppBranding, file: File) => void;
  onTextChange: (fieldKey: keyof AppBranding, value: any) => void;
  config: PlatformConfig;
  section: 'auto' | 'landing' | 'app' | 'backend' | 'auth';
  modeProp?: 'rider' | 'driver' | 'auto';
  textLogoField?: keyof AppBranding;
  textLogoVal?: string;
  taglineField?: keyof AppBranding;
  taglineVal?: string;
  showTextField?: keyof AppBranding;
  showTextVal?: boolean;
  showTaglineField?: keyof AppBranding;
  showTaglineVal?: boolean;
}

const LogoSectionCard: React.FC<LogoSectionCardProps> = ({
  title,
  subtitle,
  badge,
  icon,
  lightField,
  lightVal,
  darkField,
  darkVal,
  onUpload,
  onTextChange,
  config,
  section,
  modeProp,
  textLogoField,
  textLogoVal,
  taglineField,
  taglineVal,
  showTextField,
  showTextVal,
  showTaglineField,
  showTaglineVal,
}) => {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
      <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            {icon}
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">{title}</h4>
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 shrink-0">
          {badge}
        </span>
      </div>

      {/* Optional Mode Logo Text & Tagline Controls */}
      {(textLogoField || taglineField) && (
        <div className="space-y-3 p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
            <span className="text-[11px] font-mono font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Type size={13} className="text-amber-600" /> Mode Logo Text & Sub-Text Settings
            </span>
            {showTextField && (
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-amber-950 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTextVal !== false}
                  onChange={(e) => showTextField && onTextChange(showTextField, e.target.checked)}
                  className="w-3.5 h-3.5 accent-amber-500 rounded cursor-pointer"
                />
                Show Text & Sub-Text
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {textLogoField && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-800 block">Logo Title Text</label>
                  {textLogoVal && (
                    <button
                      type="button"
                      onClick={() => onTextChange(textLogoField, '')}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear Title
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={textLogoVal ?? ''}
                  onChange={(e) => onTextChange(textLogoField, e.target.value)}
                  placeholder="e.g. TaxiApp"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>
            )}

            {taglineField && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-800 block">Sub-Text / Tagline</label>
                  {taglineVal && (
                    <button
                      type="button"
                      onClick={() => onTextChange(taglineField, '')}
                      className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear Sub-Text
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={taglineVal ?? ''}
                  onChange={(e) => onTextChange(taglineField, e.target.value)}
                  placeholder={modeProp === 'driver' ? 'e.g. Driver' : modeProp === 'rider' ? 'e.g. Rider' : 'e.g. Sub-Text'}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Light Mode Control */}
      <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sun size={13} className="text-amber-500" /> Light Mode Logo
          </label>
          {lightVal && (
            <button
              type="button"
              onClick={() => onTextChange(lightField, '')}
              className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="px-3 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 border border-amber-500 shadow-3xs">
            <Upload size={13} /> Upload
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onUpload(lightField, e.target.files[0])}
              className="hidden"
            />
          </label>
          <input
            type="url"
            value={lightVal}
            onChange={(e) => onTextChange(lightField, e.target.value)}
            placeholder="Image URL or upload file..."
            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Dark Mode Control */}
      <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Moon size={13} className="text-indigo-500" /> Dark Mode Logo
          </label>
          {darkVal && (
            <button
              type="button"
              onClick={() => onTextChange(darkField, '')}
              className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 shadow-3xs">
            <Upload size={13} /> Upload
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && onUpload(darkField, e.target.files[0])}
              className="hidden"
            />
          </label>
          <input
            type="url"
            value={darkVal}
            onChange={(e) => onTextChange(darkField, e.target.value)}
            placeholder="Image URL or upload file..."
            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Side-by-Side Previews (Light vs Dark) */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-3xs min-h-[60px]">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">Light Mode Preview</span>
          <BrandLogo config={config} section={section} mode={modeProp || (section === 'app' ? 'auto' : undefined)} isDark={false} height={28} />
        </div>
        <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center shadow-3xs min-h-[60px]">
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1.5">Dark Mode Preview</span>
          <BrandLogo config={config} section={section} mode={modeProp || (section === 'app' ? 'auto' : undefined)} isDark={true} height={28} />
        </div>
      </div>
    </div>
  );
};
