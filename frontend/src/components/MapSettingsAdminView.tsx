import React from 'react';
import { 
  MapPin, CheckCircle2, Car, Compass, Navigation, Users, PlusCircle, History, 
  MessageCircle, Bell, Sparkles, Globe, Search 
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
  return (
    <motion.div key="map_settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <MapPin className="text-slate-800" size={24} />
            <span>Map &amp; Routing Engine Configuration</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Config Panel (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">
              Primary Map Provider Selection
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* OpenStreetMap Card */}
              <div 
                onClick={() => updateConfig((prev: any) => ({
                  ...prev,
                  map: {
                    ...(prev.map || {}),
                    openMapsEnabled: true,
                    googleMapsEnabled: false
                  }
                }))}
                className={cn(
                  "p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] relative overflow-hidden",
                  !config.map?.googleMapsEnabled 
                    ? "bg-amber-50/70 border-amber-400 text-slate-900 shadow-xs ring-2 ring-amber-400/30" 
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">OpenStreetMap (OSM)</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded-md border border-emerald-200">
                      Zero Cost
                    </span>
                  </div>
                  <input type="radio"
                    name="mapProviderRadio"
                    checked={!config.map?.googleMapsEnabled}
                    onChange={() => {}}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
                <p className="text-xs leading-relaxed mt-2 font-medium text-slate-600">
                  Zero API cost, open-source tile rendering, reliable global coverage. Recommended for baseline operations.
                </p>
                {!config.map?.googleMapsEnabled && (
                  <div className="mt-2 text-[10px] font-mono font-bold text-amber-800 flex items-center gap-1">
                    ✓ Currently Active Engine
                  </div>
                )}
              </div>

              {/* Google Maps Card */}
              <div 
                onClick={() => updateConfig((prev: any) => ({
                  ...prev,
                  map: {
                    ...(prev.map || {}),
                    googleMapsEnabled: true,
                    openMapsEnabled: false
                  }
                }))}
                className={cn(
                  "p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[140px] relative overflow-hidden",
                  config.map?.googleMapsEnabled 
                    ? "bg-amber-50/70 border-amber-400 text-slate-900 shadow-xs ring-2 ring-amber-400/30" 
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">Google Maps Platform</span>
                    <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[9px] font-black uppercase rounded-md border border-sky-200">
                      Enterprise API
                    </span>
                  </div>
                  <input type="radio"
                    name="mapProviderRadio"
                    checked={!!config.map?.googleMapsEnabled}
                    onChange={() => {}}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
                <p className="text-xs leading-relaxed mt-2 font-medium text-slate-600">
                  Enterprise directions API, highly precise street geocoding, real-time traffic routing, and Places autocomplete.
                </p>
                {config.map?.googleMapsEnabled && (
                  <div className="mt-2 text-[10px] font-mono font-bold text-amber-800 flex items-center gap-1">
                    ✓ Currently Active Engine
                  </div>
                )}
              </div>
            </div>

            {/* Engine-Specific Credentials Panel */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                <div className="text-xs font-black text-slate-800 px-3 uppercase tracking-wide">
                  {!config.map?.googleMapsEnabled ? 'OpenStreetMap Credentials & Settings' : 'Google Maps Credentials & SDK Settings'}
                </div>
                <span className="text-[10px] px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black rounded-lg uppercase">
                  {!config.map?.googleMapsEnabled ? 'OSM Mode' : 'Google Cloud Mode'}
                </span>
              </div>

              {!config.map?.googleMapsEnabled ? (
                /* OpenStreetMap Specific Fields */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Free Map Tile Host URL (100% Free Forever - No API Key)</label>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">100% Free & No Watermark</span>
                    </div>
                    <input type="text"
                      value={config.map?.tileLayerUrl ?? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'}
                      onChange={(e) => updateConfig((prev: any) => ({
                        ...prev,
                        map: {
                          ...(prev.map || {}),
                          tileLayerUrl: e.target.value
                        }
                      }))}
                      placeholder="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs rounded-xl p-3 outline-none font-mono text-slate-800"
                    />
                    
                    {/* Quick Style Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Free Presets:</span>
                      <button
                        type="button"
                        onClick={() => updateConfig((prev: any) => ({
                          ...prev,
                          map: {
                            ...(prev.map || {}),
                            tileLayerUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                            tilePreset: 'esri-gray'
                          }
                        }))}
                        className={cn(
                          "px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer",
                          (!config.map?.tilePreset || config.map?.tilePreset === 'esri-gray' || config.map?.tileLayerUrl?.includes('World_Light_Gray_Base'))
                            ? "bg-amber-400 border-amber-500 text-slate-950 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        🏙️ Esri Light Gray Canvas (Uncluttered - Recommended)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig((prev: any) => ({
                          ...prev,
                          map: {
                            ...(prev.map || {}),
                            tileLayerUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                            tilePreset: 'osm-standard'
                          }
                        }))}
                        className={cn(
                          "px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer",
                          config.map?.tilePreset === 'osm-standard' || config.map?.tileLayerUrl === 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                            ? "bg-amber-400 border-amber-500 text-slate-950 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        🌐 OpenStreetMap Standard
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig((prev: any) => ({
                          ...prev,
                          map: {
                            ...(prev.map || {}),
                            tileLayerUrl: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                            tilePreset: 'dark'
                          }
                        }))}
                        className={cn(
                          "px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer",
                          config.map?.tilePreset === 'dark'
                            ? "bg-amber-400 border-amber-500 text-slate-950 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        🌙 Dark Night Mode
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig((prev: any) => ({
                          ...prev,
                          map: {
                            ...(prev.map || {}),
                            tileLayerUrl: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                            tilePreset: 'osm-hot'
                          }
                        }))}
                        className={cn(
                          "px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer",
                          config.map?.tilePreset === 'osm-hot' || config.map?.tilePreset === 'uber-minimal'
                            ? "bg-amber-400 border-amber-500 text-slate-950 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        🚑 Humanitarian OSM (Dense Emergency)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig((prev: any) => ({
                          ...prev,
                          map: {
                            ...(prev.map || {}),
                            tileLayerUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
                            tilePreset: 'fullcolor'
                          }
                        }))}
                        className={cn(
                          "px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer",
                          config.map?.tilePreset === 'fullcolor' || (config.map?.tileLayerUrl?.includes('World_Street_Map') && config.map?.tilePreset !== 'satellite')
                            ? "bg-amber-400 border-amber-500 text-slate-950 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        🗺️ Esri World Street (Full Color)
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig((prev: any) => ({
                          ...prev,
                          map: {
                            ...(prev.map || {}),
                            tileLayerUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                            tilePreset: 'osm-standard'
                          }
                        }))}
                        className={cn(
                          "px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer",
                          config.map?.tilePreset === 'osm-standard' || config.map?.tileLayerUrl === 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                            ? "bg-amber-400 border-amber-500 text-slate-950 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        🌐 OpenStreetMap Standard
                      </button>
                      <button
                        type="button"
                        onClick={() => updateConfig((prev: any) => ({
                          ...prev,
                          map: {
                            ...(prev.map || {}),
                            tileLayerUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                            tilePreset: 'satellite'
                          }
                        }))}
                        className={cn(
                          "px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer",
                          config.map?.tilePreset === 'satellite' || config.map?.tileLayerUrl?.includes('World_Imagery')
                            ? "bg-amber-400 border-amber-500 text-slate-950 shadow-xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        🛰️ Satellite Imagery
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Default Center Latitude</label>
                    <input type="text"
                      value={config.map?.centerLat ?? '22.5726'}
                      onChange={(e) => updateConfig((prev: any) => ({
                        ...prev,
                        map: {
                          ...(prev.map || {}),
                          centerLat: parseFloat(e.target.value) || 22.5726
                        }
                      }))}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs rounded-xl p-3 outline-none font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Default Center Longitude</label>
                    <input type="text"
                      value={config.map?.centerLng ?? '88.3639'}
                      onChange={(e) => updateConfig((prev: any) => ({
                        ...prev,
                        map: {
                          ...(prev.map || {}),
                          centerLng: parseFloat(e.target.value) || 88.3639
                        }
                      }))}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs rounded-xl p-3 outline-none font-bold text-slate-800"
                    />
                  </div>
                </div>
              ) : (
                /* Google Maps Platform Specific Fields */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Google Maps Web API Key</label>
                    <input type="password"
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
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Default Center Latitude</label>
                    <input type="text"
                      value={config.map?.centerLat ?? '22.5726'}
                      onChange={(e) => updateConfig((prev: any) => ({
                        ...prev,
                        map: {
                          ...(prev.map || {}),
                          centerLat: parseFloat(e.target.value) || 22.5726
                        }
                      }))}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs rounded-xl p-3 outline-none font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Default Center Longitude</label>
                    <input type="text"
                      value={config.map?.centerLng ?? '88.3639'}
                      onChange={(e) => updateConfig((prev: any) => ({
                        ...prev,
                        map: {
                          ...(prev.map || {}),
                          centerLng: parseFloat(e.target.value) || 88.3639
                        }
                      }))}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 text-xs rounded-xl p-3 outline-none font-bold text-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="button"
                onClick={async () => {
                  try {
                    await fetch('/api/admin/config', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(config)
                    });
                  } catch (e) {}
                  setToast({ message: 'Map engine configurations stored & synchronized successfully!', type: 'success' });
                }} 
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-2xs border border-amber-500/40 flex items-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 size={14} /> Save Map Engine Settings
              </button>
            </div>
          </div>

          {/* Ride & Dispatch Settings Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Car size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Ride &amp; Dispatch Matching Rules</h3>
                <p className="text-xs text-slate-500">Configure matching radius, telemetry frequencies, and emergency parameters.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-700">Driver Matching Lookup Radius</span>
                  <span className="text-amber-800 font-mono">{(config.appSettings?.driverMatchingRadius ?? 5.0).toFixed(1)} km</span>
                </div>
                <input type="range" 
                  min="1" 
                  max="15" 
                  step="0.5"
                  value={config.appSettings?.driverMatchingRadius ?? 5.0} 
                  onChange={(e) => updateConfig((prev: any) => ({
                    ...prev,
                    appSettings: {
                      ...(prev.appSettings || { driverMatchingRadius: 5.0, gpsTelemetryUpdateDelay: 10, autoCancelBookingExpiration: 45 }),
                      driverMatchingRadius: parseFloat(e.target.value)
                    }
                  }))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer" 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-700">GPS Telemetry Updates Delay</span>
                  <span className="text-amber-800 font-mono">{config.appSettings?.gpsTelemetryUpdateDelay ?? 10} Seconds</span>
                </div>
                <input type="range" 
                  min="3" 
                  max="30" 
                  value={config.appSettings?.gpsTelemetryUpdateDelay ?? 10} 
                  onChange={(e) => updateConfig((prev: any) => ({
                    ...prev,
                    appSettings: {
                      ...(prev.appSettings || { driverMatchingRadius: 5.0, gpsTelemetryUpdateDelay: 10, autoCancelBookingExpiration: 45 }),
                      gpsTelemetryUpdateDelay: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Mobile Device Map Preview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Mobile Device Map Preview</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Real-time rider view in mobile app</p>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase rounded-full font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              {config.map?.googleMapsEnabled ? 'Google SDK' : 'OSM Map'}
            </span>
          </div>

          {/* Smartphone Mockup Frame */}
          <div className="w-full max-w-[320px] mx-auto bg-slate-800 border-4 border-slate-400 rounded-[38px] p-2 shadow-2xl relative overflow-hidden">
            {/* Notch */}
            <div className="w-24 h-3.5 bg-slate-900 rounded-full mx-auto mb-1.5 flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
              <div className="w-6 h-1 bg-slate-700 rounded-full"></div>
            </div>

            {/* Mobile App View Container */}
            <div className="bg-slate-900 rounded-[28px] overflow-hidden border border-slate-700 flex flex-col h-[520px] relative shadow-2xl text-slate-900">
              {/* Top Yellow Notice Banner */}
              <div className="bg-amber-400 text-slate-950 px-2 py-1 text-[9px] font-black truncate text-center shrink-0 border-b border-amber-500/40">
                🚕 Travel safe with our premium certified hatchback and sedan partners!
              </div>

              {/* Top Header App Bar */}
              <div className="bg-white px-2.5 py-1.5 border-b border-slate-200 flex items-center justify-between shrink-0 shadow-2xs z-20">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-amber-400 flex items-center justify-center text-slate-950 font-black text-[10px]">
                    🚖
                  </div>
                  <span className="font-black text-[11px] tracking-tight text-slate-950">TAXIAPP</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600">
                  <div className="relative">
                    <Bell size={12} />
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  </div>
                  <Car size={12} />
                  <Sparkles size={12} />
                  <Globe size={12} />
                  <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-black text-[8px] flex items-center justify-center">
                    A
                  </div>
                </div>
              </div>

              {/* Search Inputs Header */}
              <div className="bg-white p-2 border-b border-slate-100 shrink-0 z-20 space-y-1">
                <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-[9.5px]">
                  <Search size={11} className="text-slate-400 shrink-0" />
                  <input 
                    type="text" 
                    readOnly 
                    value="Search Local or intercity?" 
                    className="bg-transparent text-slate-700 font-medium outline-none w-full text-[9.5px]" 
                  />
                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded font-bold text-[8.5px] shrink-0">Now ▾</span>
                  <button className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black rounded text-[8.5px] uppercase shrink-0">FIND</button>
                </div>
              </div>

              {/* Airport Promotion Card Overlay Banner */}
              <div className="bg-slate-900 text-white p-2 shrink-0 border-b border-slate-800 flex items-center justify-between text-[9px] relative z-20">
                <div>
                  <span className="text-[7.5px] font-bold text-amber-400 uppercase tracking-wider block">AIRPORT LUXURY TRANSFER PROMOTION</span>
                  <p className="font-black text-[9px]">Flat 20% Off Airport Cabs • Code: FLY20</p>
                </div>
                <div className="w-8 h-6 bg-amber-400/20 rounded border border-amber-400/40 flex items-center justify-center text-[11px] shrink-0">
                  ✈️
                </div>
              </div>

              {/* Live Interactive Leaflet Map Container */}
              <div className="flex-1 relative w-full h-full min-h-[220px] overflow-hidden z-10 bg-slate-100">
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
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapRecenter center={[config.map?.centerLat || 22.5726, config.map?.centerLng || 88.3639]} />
                  
                  {/* Red Taxi DivIcon Marker */}
                  <Marker 
                    position={[config.map?.centerLat || 22.5726, config.map?.centerLng || 88.3639]}
                    icon={L.divIcon({
                      className: 'custom-taxi-preview-marker',
                      html: `<div style="background:#EF4444;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(239,68,68,0.5);border:2px solid white;font-size:13px;">🚕</div>`,
                      iconSize: [26, 26],
                      iconAnchor: [13, 13]
                    })}
                  />
                </MapContainer>

                {/* Floating Re-center Compass Button */}
                <button 
                  type="button"
                  className="absolute bottom-2 right-2 p-1.5 bg-white text-slate-800 rounded-lg shadow-md border border-slate-200 z-[400] hover:bg-slate-50 active:scale-95 transition-all"
                  title="Re-center Map"
                >
                  <Compass size={14} className="text-amber-600 animate-spin" style={{ animationDuration: '8s' }} />
                </button>
              </div>

              {/* Bottom Mobile Navigation Bar (5 Tabs) */}
              <div className="bg-white border-t border-slate-200 px-1 py-1.5 flex items-center justify-around shrink-0 z-20 text-[8.5px]">
                {/* HOME (Active) */}
                <div className="flex flex-col items-center gap-0.5 text-amber-900 font-black relative px-2 py-0.5 rounded-lg bg-amber-100/80 border border-amber-300/50">
                  <Navigation size={11} className="text-amber-800" />
                  <span>HOME</span>
                  <span className="w-3 h-0.5 bg-amber-500 rounded-full"></span>
                </div>

                {/* MARKET */}
                <div className="flex flex-col items-center gap-0.5 text-slate-500 font-bold px-1.5">
                  <Users size={11} />
                  <span>MARKET</span>
                </div>

                {/* REQUEST */}
                <div className="flex flex-col items-center gap-0.5 text-slate-500 font-bold px-1.5">
                  <PlusCircle size={11} />
                  <span>REQUEST</span>
                </div>

                {/* RIDES */}
                <div className="flex flex-col items-center gap-0.5 text-slate-500 font-bold px-1.5">
                  <History size={11} />
                  <span>RIDES</span>
                </div>

                {/* CHAT */}
                <div className="flex flex-col items-center gap-0.5 text-slate-500 font-bold px-1.5">
                  <MessageCircle size={11} />
                  <span>CHAT</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-normal">
            Real-time interactive Leaflet map canvas rendering live tiles and rider navigation controls.
          </div>
        </div>
      </div>

      {/* 50k USERS COST ESTIMATOR & PRICING CALCULATOR */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
                Map Infrastructure Price Estimator
              </h3>
              <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full">
                50,000 Active Users Benchmark
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Detailed cost analysis comparing OpenStreetMap vs. Google Maps Platform vs. Mapbox for scaling your ride-hailing fleet.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <span className="text-xs font-extrabold text-slate-700">Scale Users:</span>
            <span className="text-sm font-black text-amber-800 font-mono">50,000 Users / month</span>
          </div>
        </div>

        {/* Pricing Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1: OpenStreetMap (OSM) */}
          <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50/30 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-950">OpenStreetMap + Leaflet</span>
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-md">
                Recommended
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-black text-emerald-700 font-mono">$0.00 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
              <p className="text-[11px] text-slate-500 font-medium">(100% Free &amp; Open Source Tiles)</p>
            </div>

            <ul className="text-xs text-slate-600 space-y-2 border-t border-emerald-200/60 pt-3">
              <li className="flex items-center justify-between">
                <span>Tile API Requests:</span>
                <span className="font-mono font-bold text-emerald-700">Free</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Routing Matrix:</span>
                <span className="font-mono font-bold text-emerald-700">Free (OSRM)</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Geocoding:</span>
                <span className="font-mono font-bold text-emerald-700">Free (Nominatim)</span>
              </li>
            </ul>
          </div>

          {/* Option 2: Google Maps Platform */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">Google Maps Platform</span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-black uppercase rounded-md">
                Commercial
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-black text-slate-900 font-mono">~$720.00 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
              <p className="text-[11px] text-slate-500 font-medium">(Standard dynamic maps + Routes API)</p>
            </div>

            <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-200 pt-3">
              <li className="flex items-center justify-between">
                <span>Dynamic Maps (JS):</span>
                <span className="font-mono font-bold">$280.00</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Directions API:</span>
                <span className="font-mono font-bold">$240.00</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Places Autocomplete:</span>
                <span className="font-mono font-bold">$200.00</span>
              </li>
            </ul>
          </div>

          {/* Option 3: Mapbox */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">Mapbox Vector Tiles</span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-black uppercase rounded-md">
                Hybrid Vector
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-black text-slate-900 font-mono">~$480.00 <span className="text-xs text-slate-500 font-normal">/ month</span></div>
              <p className="text-[11px] text-slate-500 font-medium">(Includes 50,000 free monthly active users)</p>
            </div>

            <ul className="text-xs text-slate-600 space-y-2 border-t border-slate-200 pt-3">
              <li className="flex items-center justify-between">
                <span>Vector Tile Loads:</span>
                <span className="font-mono font-bold">$120.00</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Navigation Matrix:</span>
                <span className="font-mono font-bold">$210.00</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Search Geocoding:</span>
                <span className="font-mono font-bold">$150.00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
