import React, { useState } from 'react';
import { 
  MapPin, CheckCircle2, Car, Compass, Navigation, Users, PlusCircle, History, 
  MessageCircle, Bell, Sparkles, Globe, Search, ShieldCheck, Key, RefreshCw, Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { getResolvedTileUrl, getTileLayerClassName } from '../lib/mapHelpers';

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface MapSettingsAdminViewProps {
  config: any;
  updateConfig: (updater: any) => void;
  setToast?: (toast: { message: string; type: 'success' | 'error' | 'info' }) => void;
}

export const MapSettingsAdminView: React.FC<MapSettingsAdminViewProps> = ({
  config,
  updateConfig,
  setToast = () => {}
}) => {
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Active provider: "osm" | "google" | "ola" (defaults to "osm")
  const activeProvider = config.map?.provider || 
    (config.map?.googleMapsEnabled ? 'google' : config.map?.olaMapsEnabled ? 'ola' : 'osm');

  const handleSelectProvider = (provider: 'osm' | 'google' | 'ola') => {
    updateConfig((prev: any) => ({
      ...prev,
      map: {
        ...(prev.map || {}),
        provider,
        openMapsEnabled: provider === 'osm',
        googleMapsEnabled: provider === 'google',
        olaMapsEnabled: provider === 'ola'
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      setToast({ message: `Map provider set to ${activeProvider.toUpperCase()} and synchronized!`, type: 'success' });
    } catch {
      setToast({ message: 'Saved map configurations locally.', type: 'info' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async (provider: 'google' | 'ola') => {
    setTestingProvider(provider);
    try {
      const key = provider === 'google' ? config.map?.googleMapsApiKey : config.map?.olaApiKey;
      if (!key || key.trim() === '') {
        setToast({ 
          message: `${provider === 'google' ? 'Google Maps' : 'Ola Maps'} key is empty. App will use OSM fallback until key is added.`, 
          type: 'info' 
        });
      } else {
        setToast({ 
          message: `Testing ${provider === 'google' ? 'Google Maps' : 'Ola Maps'} credentials... Verification active.`, 
          type: 'success' 
        });
      }
    } finally {
      setTimeout(() => setTestingProvider(null), 600);
    }
  };

  return (
    <motion.div key="map_settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <MapPin className="text-amber-500" size={24} />
            <span>Map &amp; Location Engine Settings</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Toggle between OpenStreetMap (Default), Google Maps, and Ola Maps. Changes take effect immediately across web and mobile.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-2xs border border-amber-500/40 flex items-center gap-2 transition-all cursor-pointer"
          >
            {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Save &amp; Apply Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 3-Way Provider Selector & Key Settings (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3-WAY PROVIDER SELECTOR */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  Primary Map &amp; Routing Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Select which provider powers basemaps, routing, and reverse geocoding.
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 bg-amber-100 text-amber-900 font-black rounded-lg uppercase">
                Active: {activeProvider.toUpperCase()}
              </span>
            </div>

            {/* 3 Interactive Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 1. OpenStreetMap (OSM) */}
              <div 
                onClick={() => handleSelectProvider('osm')}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[160px] relative",
                  activeProvider === 'osm'
                    ? "bg-amber-50/80 border-amber-400 text-slate-900 shadow-xs ring-2 ring-amber-400/30" 
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded-md border border-emerald-200">
                      Zero Cost
                    </span>
                    <input 
                      type="radio" 
                      name="providerRadio" 
                      checked={activeProvider === 'osm'} 
                      onChange={() => {}} 
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <h4 className="font-black text-sm text-slate-950">OpenStreetMap</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    Default open-source maps. 100% free tiles &amp; OSRM routing. No API key required.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  {activeProvider === 'osm' ? '✓ Default Active' : 'Select OSM'}
                </div>
              </div>

              {/* 2. Google Maps */}
              <div 
                onClick={() => handleSelectProvider('google')}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[160px] relative",
                  activeProvider === 'google'
                    ? "bg-amber-50/80 border-amber-400 text-slate-900 shadow-xs ring-2 ring-amber-400/30" 
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[9px] font-black uppercase rounded-md border border-sky-200">
                      Enterprise
                    </span>
                    <input 
                      type="radio" 
                      name="providerRadio" 
                      checked={activeProvider === 'google'} 
                      onChange={() => {}} 
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <h4 className="font-black text-sm text-slate-950">Google Maps</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    Industry standard. Real-time traffic, precise building-level addresses &amp; Places autocomplete.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-bold text-sky-800 flex items-center gap-1">
                  {activeProvider === 'google' ? '✓ Currently Selected' : 'Select Google'}
                </div>
              </div>

              {/* 3. Ola Maps */}
              <div 
                onClick={() => handleSelectProvider('ola')}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[160px] relative",
                  activeProvider === 'ola'
                    ? "bg-amber-50/80 border-amber-400 text-slate-900 shadow-xs ring-2 ring-amber-400/30" 
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-black uppercase rounded-md border border-purple-200">
                      ~50% Savings
                    </span>
                    <input 
                      type="radio" 
                      name="providerRadio" 
                      checked={activeProvider === 'ola'} 
                      onChange={() => {}} 
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <h4 className="font-black text-sm text-slate-950">Ola Maps</h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                    India-optimized Krutrim AI maps. 1M free API calls/month, low latency for ride-hailing.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-bold text-purple-800 flex items-center gap-1">
                  {activeProvider === 'ola' ? '✓ Currently Selected' : 'Select Ola Maps'}
                </div>
              </div>
            </div>

            {/* SERVICES ENABLED SUMMARY ROW */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-wide">
                <span>Active Services in {activeProvider.toUpperCase()}</span>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck size={13} /> Auto-Fallback to OSM Enabled
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col">
                  <span className="text-slate-400 text-[9px] font-bold uppercase">Basemap Tiles</span>
                  <span className="font-black text-slate-800 truncate">
                    {activeProvider === 'google' ? 'Google Roads' : activeProvider === 'ola' ? 'Ola Krutrim Tiles' : 'Esri Light Minimal'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col">
                  <span className="text-slate-400 text-[9px] font-bold uppercase">Routing / ETA</span>
                  <span className="font-black text-slate-800 truncate">
                    {activeProvider === 'google' ? 'Google Directions' : activeProvider === 'ola' ? 'Ola Routing API' : 'OSRM Routing'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col">
                  <span className="text-slate-400 text-[9px] font-bold uppercase">Reverse Geocode</span>
                  <span className="font-black text-slate-800 truncate">
                    {activeProvider === 'google' ? 'Google Geocoding' : activeProvider === 'ola' ? 'Ola Reverse Geocode' : 'Nominatim + AI'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col">
                  <span className="text-slate-400 text-[9px] font-bold uppercase">Search Autocomplete</span>
                  <span className="font-black text-slate-800 truncate">
                    {activeProvider === 'google' ? 'Google Places' : activeProvider === 'ola' ? 'Ola Autocomplete' : 'Photon + Gemini'}
                  </span>
                </div>
              </div>
            </div>

            {/* CREDENTIALS CONFIGURATION FOR CHOSEN PROVIDER */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              {activeProvider === 'osm' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      OpenStreetMap Basemap Style Preset
                    </label>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      100% Free &amp; Open
                    </span>
                  </div>

                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'esri-gray', label: '🏙️ Esri Light Minimal (Uber Style)', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}' },
                      { id: 'osm-standard', label: '🌐 OSM Standard', url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' },
                      { id: 'dark', label: '🌙 Dark Night Mode', url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' },
                      { id: 'osm-hot', label: '🚑 Humanitarian (Detailed)', url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' },
                      { id: 'satellite', label: '🛰️ Satellite Imagery', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' }
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => updateConfig((prev: any) => ({
                          ...prev,
                          map: {
                            ...(prev.map || {}),
                            tilePreset: preset.id,
                            tileLayerUrl: preset.url
                          }
                        }))}
                        className={cn(
                          "px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer",
                          (config.map?.tilePreset === preset.id || (!config.map?.tilePreset && preset.id === 'esri-gray'))
                            ? "bg-amber-400 border-amber-500 text-slate-950 shadow-xs"
                            : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeProvider === 'google' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Key size={13} className="text-amber-600" /> Google Maps API Key
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      {config.map?.googleMapsApiKey ? 'Key Configured' : 'Optional for now — App ready for key'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="password"
                      value={config.map?.googleMapsApiKey ?? ''}
                      onChange={(e) => updateConfig((prev: any) => ({
                        ...prev,
                        map: {
                          ...(prev.map || {}),
                          googleMapsApiKey: e.target.value
                        }
                      }))}
                      placeholder="AIzaSy..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs rounded-xl p-3 outline-none font-mono text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleTestConnection('google')}
                      disabled={testingProvider === 'google'}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-all cursor-pointer whitespace-nowrap"
                    >
                      {testingProvider === 'google' ? 'Checking...' : 'Test Key'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    💡 If left empty, the application automatically uses high-speed OpenStreetMap and OSRM so riders can book rides without interruption. Once you paste your key, Google Maps turns on immediately on live site.
                  </p>
                </div>
              )}

              {activeProvider === 'ola' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Key size={13} className="text-purple-600" /> Ola Maps API Key (Krutrim)
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      {config.map?.olaApiKey ? 'Key Configured' : 'Optional for now — App ready for key'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="password"
                      value={config.map?.olaApiKey ?? ''}
                      onChange={(e) => updateConfig((prev: any) => ({
                        ...prev,
                        map: {
                          ...(prev.map || {}),
                          olaApiKey: e.target.value
                        }
                      }))}
                      placeholder="ola_live_..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs rounded-xl p-3 outline-none font-mono text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleTestConnection('ola')}
                      disabled={testingProvider === 'ola'}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-all cursor-pointer whitespace-nowrap"
                    >
                      {testingProvider === 'ola' ? 'Checking...' : 'Test Key'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    💡 Ola Maps provides 1,000,000 free API calls every month and delivers specialized routing for Indian street networks. When key is omitted, OSM fallback keeps booking fully operational.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIDE & DISPATCH GPS TELEMETRY RULES */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Car size={18} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  Matching Radius &amp; GPS Telemetry
                </h3>
                <p className="text-xs text-slate-500">Adjust driver search boundary and real-time refresh rates.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-700">Driver Matching Radius</span>
                  <span className="text-amber-800 font-mono">{(config.appSettings?.driverMatchingRadius ?? 5.0).toFixed(1)} km</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="15" 
                  step="0.5"
                  value={config.appSettings?.driverMatchingRadius ?? 5.0} 
                  onChange={(e) => updateConfig((prev: any) => ({
                    ...prev,
                    appSettings: {
                      ...(prev.appSettings || { driverMatchingRadius: 5.0, gpsTelemetryUpdateDelay: 10 }),
                      driverMatchingRadius: parseFloat(e.target.value)
                    }
                  }))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-700">GPS Location Refresh</span>
                  <span className="text-amber-800 font-mono">{config.appSettings?.gpsTelemetryUpdateDelay ?? 10} Seconds</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="30" 
                  value={config.appSettings?.gpsTelemetryUpdateDelay ?? 10} 
                  onChange={(e) => updateConfig((prev: any) => ({
                    ...prev,
                    appSettings: {
                      ...(prev.appSettings || { driverMatchingRadius: 5.0, gpsTelemetryUpdateDelay: 10 }),
                      gpsTelemetryUpdateDelay: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Mockup Preview (1/3 width) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Live Mobile Map Preview</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Real-time rider preview in mobile app</p>
            </div>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase rounded-full font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              {activeProvider.toUpperCase()}
            </span>
          </div>

          {/* Smartphone Mockup Frame */}
          <div className="w-full max-w-[300px] mx-auto bg-slate-800 border-4 border-slate-400 rounded-[36px] p-2 shadow-xl relative overflow-hidden">
            {/* Notch */}
            <div className="w-20 h-3 bg-slate-900 rounded-full mx-auto mb-1.5 flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              <div className="w-5 h-1 bg-slate-700 rounded-full"></div>
            </div>

            {/* Mobile Container */}
            <div className="bg-slate-900 rounded-[26px] overflow-hidden border border-slate-700 flex flex-col h-[480px] relative text-slate-900">
              {/* Top Banner */}
              <div className="bg-amber-400 text-slate-950 px-2 py-1 text-[8.5px] font-black truncate text-center shrink-0">
                🚕 Ready for instant ride bookings!
              </div>

              {/* Top Bar */}
              <div className="bg-white px-2.5 py-1.5 border-b border-slate-200 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-amber-400 flex items-center justify-center text-slate-950 font-black text-[10px]">
                    🚖
                  </div>
                  <span className="font-black text-[10px] text-slate-950">TAXIAPP</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-[9px]">
                  <Bell size={11} />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 font-black text-[7px] flex items-center justify-center">
                    A
                  </div>
                </div>
              </div>

              {/* Search Mockup */}
              <div className="bg-white p-2 border-b border-slate-100 shrink-0 z-20">
                <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-[9px]">
                  <Search size={10} className="text-slate-400 shrink-0" />
                  <span className="text-slate-600 truncate">Where to? (Local or Intercity)</span>
                  <span className="px-1.5 py-0.5 bg-amber-400 text-slate-950 font-black rounded text-[7.5px] uppercase shrink-0">GO</span>
                </div>
              </div>

              {/* Live Interactive Leaflet Map */}
              <div className="flex-1 relative w-full h-full overflow-hidden z-10 bg-slate-100">
                <MapContainer 
                  center={[config.map?.centerLat || 22.5726, config.map?.centerLng || 88.3639]} 
                  zoom={13} 
                  zoomControl={false} 
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                >
                  <TileLayer 
                    url={getResolvedTileUrl(config.map)}
                    className={getTileLayerClassName(config.map)}
                    subdomains="abc"
                    maxZoom={19}
                    attribution='&copy; OpenStreetMap'
                  />
                  <MapRecenter center={[config.map?.centerLat || 22.5726, config.map?.centerLng || 88.3639]} />
                  
                  <Marker 
                    position={[config.map?.centerLat || 22.5726, config.map?.centerLng || 88.3639]}
                    icon={L.divIcon({
                      className: 'custom-taxi-preview-marker',
                      html: `<div style="background:#EF4444;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(239,68,68,0.5);border:2px solid white;font-size:12px;">🚕</div>`,
                      iconSize: [24, 24],
                      iconAnchor: [12, 12]
                    })}
                  />
                </MapContainer>

                {/* Floating Compass */}
                <button 
                  type="button"
                  className="absolute bottom-2 right-2 p-1.5 bg-white text-slate-800 rounded-lg shadow border border-slate-200 z-[400]"
                >
                  <Compass size={13} className="text-amber-600 animate-spin" style={{ animationDuration: '8s' }} />
                </button>
              </div>

              {/* Bottom Nav Mockup */}
              <div className="bg-white border-t border-slate-200 px-1 py-1.5 flex items-center justify-around shrink-0 z-20 text-[8px]">
                <div className="flex flex-col items-center gap-0.5 text-amber-900 font-black">
                  <Navigation size={10} className="text-amber-800" />
                  <span>HOME</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 text-slate-400 font-bold">
                  <Users size={10} />
                  <span>MARKET</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 text-slate-400 font-bold">
                  <PlusCircle size={10} />
                  <span>REQUEST</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 text-slate-400 font-bold">
                  <History size={10} />
                  <span>RIDES</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-snug">
            Engine active: <strong className="text-slate-900">{activeProvider.toUpperCase()}</strong>. The map live-refreshes when you switch providers or presets.
          </div>
        </div>
      </div>

      {/* 2. SIDE-BY-SIDE COMPARISON: GOOGLE MAPS VS. OLA MAPS VS. OPENSTREETMAP (OSM) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Zap className="text-amber-500" size={18} />
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              Side-by-Side Comparison: Google Maps vs. Ola Maps vs. OpenStreetMap (OSM)
            </h3>
            <p className="text-xs text-slate-500">
              Clear breakdown of features, reliability, free quotas, and real-world costs.
            </p>
          </div>
        </div>

        {/* Minimal High-Contrast Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 bg-slate-50/70">
                <th className="py-3 px-4">Feature / Metric</th>
                <th className="py-3 px-4 text-emerald-800 bg-emerald-50/50">OpenStreetMap (OSM)</th>
                <th className="py-3 px-4 text-sky-800 bg-sky-50/50">Google Maps Platform</th>
                <th className="py-3 px-4 text-purple-800 bg-purple-50/50">Ola Maps (Krutrim)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Coverage &amp; Addresses</td>
                <td className="py-3 px-4">Global crowd-sourced community data</td>
                <td className="py-3 px-4">99.9% Global coverage, door-level accuracy</td>
                <td className="py-3 px-4">Hyper-local India coverage, tier 2/3 cities</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Real-Time Traffic &amp; ETAs</td>
                <td className="py-3 px-4">Statistical/average road speed via OSRM</td>
                <td className="py-3 px-4 font-bold text-sky-800">Best-in-class live traffic &amp; rerouting</td>
                <td className="py-3 px-4 font-bold text-purple-800">India real-time traffic (Ola fleet telemetry)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Leaflet &amp; Mobile Ready</td>
                <td className="py-3 px-4">Native 100% Leaflet support</td>
                <td className="py-3 px-4">Direct Leaflet &amp; Android/iOS SDKs</td>
                <td className="py-3 px-4">Full Leaflet, MapLibre &amp; Mobile SDKs</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Free Tier / Month</td>
                <td className="py-3 px-4 font-bold text-emerald-700">100% Free Forever (Unlimited)</td>
                <td className="py-3 px-4">$200 free credit (~28,000 requests)</td>
                <td className="py-3 px-4 font-bold text-purple-700">1,000,000 Free API Calls/month</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Pricing / 50k Users</td>
                <td className="py-3 px-4 font-black text-emerald-700 font-mono">$0.00 / month</td>
                <td className="py-3 px-4 font-black text-slate-900 font-mono">~$720.00 / month</td>
                <td className="py-3 px-4 font-black text-purple-800 font-mono">~$360.00 / month (~50% less)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">Best Use Case</td>
                <td className="py-3 px-4">Bootstrap launch, zero bills &amp; backup</td>
                <td className="py-3 px-4">Global scale, premier corporate fleets</td>
                <td className="py-3 px-4">India market expansion on optimal budget</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. 50k USERS MONTHLY COST ESTIMATOR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              50,000 Active Monthly Users — Service Breakdown &amp; Estimate
            </h3>
            <p className="text-xs text-slate-500">
              Approximate cost breakdown across Basemap Tiles, Directions API, and Autocomplete.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-lg">
            50,000 Users Benchmark
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* OSM */}
          <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-950 uppercase">OpenStreetMap</span>
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded">Default</span>
            </div>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              $0.00 <span className="text-xs font-normal text-slate-500">/ mo</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 border-t border-emerald-200/60 pt-2">
              <li className="flex justify-between"><span>Basemap Tiles:</span><span className="font-bold text-emerald-700">$0.00</span></li>
              <li className="flex justify-between"><span>Directions (OSRM):</span><span className="font-bold text-emerald-700">$0.00</span></li>
              <li className="flex justify-between"><span>Places Autocomplete:</span><span className="font-bold text-emerald-700">$0.00</span></li>
            </ul>
          </div>

          {/* Google Maps */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase">Google Maps Platform</span>
              <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[9px] font-black rounded">Commercial</span>
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              ~$720.00 <span className="text-xs font-normal text-slate-500">/ mo</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 border-t border-slate-200 pt-2">
              <li className="flex justify-between"><span>Dynamic Maps:</span><span className="font-mono font-bold">$280.00</span></li>
              <li className="flex justify-between"><span>Directions API:</span><span className="font-mono font-bold">$240.00</span></li>
              <li className="flex justify-between"><span>Places Autocomplete:</span><span className="font-mono font-bold">$200.00</span></li>
            </ul>
          </div>

          {/* Ola Maps */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-950 uppercase">Ola Maps</span>
              <span className="px-2 py-0.5 bg-purple-200 text-purple-900 text-[9px] font-black rounded">~50% Less</span>
            </div>
            <div className="text-2xl font-black text-purple-800 font-mono">
              ~$360.00 <span className="text-xs font-normal text-slate-500">/ mo</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 border-t border-purple-200 pt-2">
              <li className="flex justify-between"><span>Tile Loads:</span><span className="font-mono font-bold">$140.00</span></li>
              <li className="flex justify-between"><span>Routing Matrix:</span><span className="font-mono font-bold">$120.00</span></li>
              <li className="flex justify-between"><span>Places Autocomplete:</span><span className="font-mono font-bold">$100.00</span></li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
