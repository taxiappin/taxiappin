import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download } from 'lucide-react';
import { AppBanner } from '../types';
import { cn } from '../lib/utils';
import { useConfig } from '../lib/ConfigContext';

interface BannerCarouselProps {
  banners: AppBanner[];
  className?: string;
  onDownloadApk?: () => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ 
  banners, 
  className,
  onDownloadApk
}) => {
  const { config } = useConfig();

  if (config.bannersEnabled === false || config.enabledFeatures?.banners === false) {
    return null;
  }

  const activeBanners = banners.filter(b => b.active);
  const activeCount = activeBanners.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Keep latest activeBanners in ref for callback
  const activeBannersRef = useRef(activeBanners);
  activeBannersRef.current = activeBanners;

  // Safe current index and active banner item
  const safeIndex = activeCount > 0 ? currentIndex % activeCount : 0;
  const currentBanner = activeBanners[safeIndex];

  useEffect(() => {
    if (activeCount <= 1) return;

    const banner = activeBannersRef.current[safeIndex] || activeBannersRef.current[0];
    const speedSec = (banner?.scrollingSpeed && banner.scrollingSpeed > 0 ? banner.scrollingSpeed : 3.5);

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeCount);
    }, speedSec * 1000);

    return () => clearTimeout(timer);
  }, [safeIndex, activeCount]);

  if (activeBanners.length === 0 || !currentBanner) return null;

  const triggerDirectApkDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = '/api/mobile/download-apk/release';
      link.setAttribute('download', 'taxiapp-v2.0.4-release.apk');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn("Direct link click failed, falling back to window.location", err);
      window.location.href = '/api/mobile/download-apk/release';
    }

    if (onDownloadApk) {
      onDownloadApk();
    }
  };

  const handleBannerClick = (banner: AppBanner) => {
    if (
      banner.url === 'download-apk' || 
      banner.url === '/api/mobile/download-apk/release' || 
      banner.url?.includes('download-apk') ||
      banner.title?.toLowerCase().includes('download apk') ||
      banner.title?.toLowerCase().includes('download the app') ||
      banner.buttonText?.toLowerCase().includes('download')
    ) {
      triggerDirectApkDownload();
      return;
    }

    if (banner.url && banner.url !== 'https://' && banner.url !== 'http://') {
      try {
        let targetUrl = banner.url;
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
          targetUrl = `https://${targetUrl}`;
        }
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.error('Failed to open banner url:', err);
      }
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900 group select-none", className)}>
      <div 
        onClick={() => handleBannerClick(currentBanner)}
        className={cn(
          "w-full aspect-[3/1] relative overflow-hidden flex items-center justify-center bg-transparent",
          currentBanner.url ? "cursor-pointer" : ""
        )}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentBanner.id}
            src={currentBanner.image}
            alt={currentBanner.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Clean Light-Protected Floating Overlay for Banner Action & Info */}
        {(currentBanner.title || currentBanner.buttonText) && (
          <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3.5 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex items-end justify-between gap-3 pointer-events-none">
            <div className="min-w-0 flex-1 pointer-events-none">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[7px] font-black uppercase text-amber-300 tracking-[0.25em] leading-none bg-black/60 px-1.5 py-0.5 rounded">
                  {currentBanner.targetAudience === 'driver' || currentBanner.audience === 'driver' ? 'CAPTAIN PERK' :
                   currentBanner.targetAudience === 'both' || currentBanner.audience === 'both' ? 'ALL RIDERS & CAPTAINS' :
                   currentBanner.targetAudience === 'rider' || currentBanner.audience === 'rider' ? 'RIDER PROMO' :
                   'FEATURED'}
                </span>
              </div>
              <h4 className="text-[11px] sm:text-xs md:text-sm font-black text-white uppercase italic tracking-tight leading-tight drop-shadow line-clamp-2">
                {currentBanner.title}
              </h4>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pointer-events-auto">
              {/* Custom CTA Button if configured */}
              {currentBanner.buttonText && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      currentBanner.url?.includes('apk') || 
                      currentBanner.buttonText?.toLowerCase().includes('apk') || 
                      currentBanner.buttonText?.toLowerCase().includes('download')
                    ) {
                      triggerDirectApkDownload();
                    } else {
                      handleBannerClick(currentBanner);
                    }
                  }}
                  className={cn(
                    "font-black uppercase tracking-wider rounded-xl transition-all shadow-sm text-center flex items-center justify-center whitespace-nowrap cursor-pointer hover:opacity-90 active:scale-95",
                    currentBanner.buttonSize === 'xs' ? "px-2 py-1 text-[8px]" :
                    currentBanner.buttonSize === 'sm' ? "px-3 py-1.5 text-[10px]" :
                    currentBanner.buttonSize === 'lg' ? "px-4 py-2.5 text-xs" :
                    "px-3 py-1.5 text-[10px]",
                    currentBanner.buttonBgColor || "bg-amber-400 text-slate-950"
                  )}
                  style={{
                    backgroundColor: currentBanner.buttonBgColor?.startsWith('#') ? currentBanner.buttonBgColor : undefined,
                    color: currentBanner.buttonTextColor?.startsWith('#') ? currentBanner.buttonTextColor : undefined
                  }}
                >
                  {currentBanner.buttonText}
                </button>
              )}

              {/* Direct Download the App button in banner bar */}
              {!currentBanner.buttonText?.toLowerCase().includes('app') && !currentBanner.buttonText?.toLowerCase().includes('apk') && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerDirectApkDownload();
                  }}
                  className="px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  title="Direct Download the App"
                >
                  <Download className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
                  <span>Download the App</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
