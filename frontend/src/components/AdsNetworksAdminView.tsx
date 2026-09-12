import React from 'react';
import { Megaphone, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface AdsNetworksAdminViewProps {
  config: any;
  updateConfig: (updater: any) => void;
  adsEnabled: boolean;
  toggleMasterAdsEnabled: () => void;
  setToast?: (toast: { message: string; type: 'success' | 'error' | 'info' }) => void;
}

export const AdsNetworksAdminView: React.FC<AdsNetworksAdminViewProps> = ({
  config,
  updateConfig,
  adsEnabled,
  toggleMasterAdsEnabled,
  setToast = () => {}
}) => {
  return (
    <motion.div key="ads_networks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
              <Megaphone className="text-slate-800" size={24} />
              <span>Ad Networks &amp; Monetization</span>
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${adsEnabled ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
              {adsEnabled ? 'Module Enabled' : 'Module Disabled'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Master Enable/Disable Switch */}
          <div className="flex items-center gap-2.5 bg-slate-100/90 px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enable Ads Network:</span>
            <button type="button"
              onClick={toggleMasterAdsEnabled}
              className={cn(
                "relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none items-center p-0.5",
                adsEnabled ? "bg-amber-400" : "bg-slate-300"
              )}
            >
              <span className={cn(
                "pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out absolute left-0.5",
                adsEnabled ? "translate-x-5.5" : "translate-x-0"
              )} />
            </button>
          </div>
        </div>
      </div>

      {!adsEnabled && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-900 text-xs font-semibold">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span>Ad Networks and Monetization are currently disabled globally. AdMob banners, interstitial ad triggers, and publisher banners will not be loaded or rendered on the frontend. Toggle "Enable Ads Network" above to re-activate.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Box */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Megaphone size={16} className="text-amber-500" /> Google AdMob &amp; SDK Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                AdMob App ID (Android)
              </label>
              <input
                type="text"
                defaultValue={config?.ads?.appIdAndroid || 'ca-app-pub-3940256099942544~3347511713'}
                onChange={(e) => updateConfig({ ads: { ...(config?.ads || {}), appIdAndroid: e.target.value } })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-800 outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                AdMob App ID (iOS)
              </label>
              <input
                type="text"
                defaultValue={config?.ads?.appIdIos || 'ca-app-pub-3940256099942544~1458602516'}
                onChange={(e) => updateConfig({ ads: { ...(config?.ads || {}), appIdIos: e.target.value } })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-800 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Ad Units &amp; Placements</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Banner Unit ID</span>
                <input
                  type="text"
                  defaultValue={config?.ads?.bannerUnitId || 'ca-app-pub-3940256099942544/6300978111'}
                  onChange={(e) => updateConfig({ ads: { ...(config?.ads || {}), bannerUnitId: e.target.value } })}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Interstitial Unit ID</span>
                <input
                  type="text"
                  defaultValue={config?.ads?.interstitialUnitId || 'ca-app-pub-3940256099942544/1033173712'}
                  onChange={(e) => updateConfig({ ads: { ...(config?.ads || {}), interstitialUnitId: e.target.value } })}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Rewarded Unit ID</span>
                <input
                  type="text"
                  defaultValue={config?.ads?.rewardUnitId || 'ca-app-pub-3940256099942544/5224354917'}
                  onChange={(e) => updateConfig({ ads: { ...(config?.ads || {}), rewardUnitId: e.target.value } })}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" />
            <span>Monetization Status</span>
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            AdMob SDK will automatically serve contextually relevant banner ads at the bottom of the map view and interstitial ads upon trip completion when enabled.
          </p>
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>💡 Integration Note</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Test unit IDs from Google AdMob are active by default for safe simulator testing.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
