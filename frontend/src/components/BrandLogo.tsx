import React from 'react';
import { PlatformConfig, AppBranding } from '../types';

interface BrandLogoProps {
  config?: PlatformConfig;
  isDark?: boolean;
  variant?: 'auto' | 'icon' | 'text' | 'combined' | 'horizontal' | 'favicon';
  section?: 'auto' | 'landing' | 'app' | 'backend' | 'auth';
  mode?: 'rider' | 'driver' | 'auto';
  className?: string;
  height?: number;
  onClick?: () => void;
  showTextOverride?: boolean;
  layout?: 'row' | 'stacked' | 'centered';
  tagline?: string;
  showTagline?: boolean;
  align?: 'left' | 'center' | 'right';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  config,
  isDark = false,
  variant = 'auto',
  section = 'auto',
  mode = 'auto',
  className = '',
  height,
  onClick,
  showTextOverride,
  layout = 'row',
  tagline,
  showTagline = true,
  align,
}) => {
  const branding: AppBranding = config?.branding || {
    primaryColor: '#FAB818',
    secondaryColor: '#0d5c56',
    accentColor: '#FAB818',
    bgColor: '#ffffff',
    surfaceCardColor: '#ffffff',
    surfaceSoftColor: '#f8fafc',
    textColor: '#0d5c56',
    textColorMuted: '#64748b',
    fontFamily: 'Inter',
    headingFontFamily: 'Inter',
    borderRadiusMd: 12,
    borderRadiusLg: 16,
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
    tagline: 'PREMIUM MOBILITY ECOSYSTEM',
  };

  const platformName = config?.general?.platformName || 'TaxiApp';

  // 1. UNIFIED SINGLE LOGO RESOLUTION ACROSS THE ENTIRE APPLICATION:
  // Whatever is set in branding, app settings, or login settings reflects uniformly everywhere.
  // If not set, falls back to the canonical /icon.svg.
  const singleUnifiedLogo = 
    branding.logoUrl ||
    branding.lightLogoUrl ||
    branding.appLogoUrl ||
    branding.authLogoUrl ||
    branding.landingLogoUrl ||
    branding.backendLogoUrl ||
    branding.riderLogoUrl ||
    branding.driverLogoUrl ||
    (config as any)?.loginSettings?.logoUrl ||
    (config as any)?.appLogo ||
    '/icon.svg';

  const currentIconUrl = singleUnifiedLogo;
  const currentHorizontalUrl = branding.horizontalLogoUrl || singleUnifiedLogo;
  const faviconUrl = branding.faviconUrl || singleUnifiedLogo;

  let textLogo = branding.textLogo !== undefined && branding.textLogo.trim() !== '' 
    ? branding.textLogo 
    : platformName;
  let taglineText = tagline !== undefined 
    ? tagline 
    : (branding.tagline || 'PREMIUM MOBILITY ECOSYSTEM');
  let showText = showTextOverride !== undefined ? showTextOverride : (branding.logoWithText ?? true);
  let showTaglineText = showTagline;

  if (mode === 'rider') {
    if (branding.riderTextLogo !== undefined && branding.riderTextLogo.trim() !== '') {
      textLogo = branding.riderTextLogo;
    }
    if (branding.riderTagline !== undefined && branding.riderTagline.trim() !== '') {
      taglineText = branding.riderTagline;
    }
  } else if (mode === 'driver') {
    if (branding.driverTextLogo !== undefined && branding.driverTextLogo.trim() !== '') {
      textLogo = branding.driverTextLogo;
    }
    if (branding.driverTagline !== undefined && branding.driverTagline.trim() !== '') {
      taglineText = branding.driverTagline;
    }
  }

  const logoType = variant === 'auto' ? (branding.logoType || 'combined') : variant;
  const calcHeight = height || branding.logoHeight || 36;
  const logoFont = branding.logoFontFamily || branding.headingFontFamily || branding.fontFamily || 'Poppins';

  const hasAnyText = Boolean((textLogo && textLogo.trim()) || (taglineText && taglineText.trim()));
  const renderText = showText && hasAnyText;

  // Determine alignment
  const isCentered = layout === 'centered' || layout === 'stacked' || align === 'center';

  // Authentic TaxiApp vector brand mark fallback (identical to /icon.svg)
  const renderFallbackIcon = (size: number) => (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
        borderRadius: `${Math.min(size * 0.28, 20)}px`,
      }}
      className="flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25 border border-amber-300/40 transition-transform active:scale-95 overflow-hidden"
    >
      <svg 
        style={{ width: `${Math.round(size * 0.62)}px`, height: `${Math.round(size * 0.62)}px` }} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#0F172A" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" fill="#0F172A" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" fill="#0F172A" />
      </svg>
    </div>
  );

  // Favicon variant
  if (logoType === 'favicon') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {faviconUrl ? (
          <img
            src={faviconUrl}
            alt={`${platformName} Favicon`}
            style={{ width: `${calcHeight}px`, height: `${calcHeight}px` }}
            className="object-contain rounded-md shrink-0"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          renderFallbackIcon(calcHeight)
        )}
      </div>
    );
  }

  // Text-only variant
  if (logoType === 'text') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col ${isCentered ? 'items-center text-center w-full' : 'items-start'} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className={`flex items-center gap-1.5 ${isCentered ? 'justify-center w-full' : ''}`}>
          <span
            style={{
              fontSize: `${Math.max(14, Math.round(calcHeight * 0.55))}px`,
              fontFamily: logoFont,
              color: isDark ? '#ffffff' : (branding.textColor || '#0d5c56'),
            }}
            className="font-black uppercase tracking-tight leading-none text-center"
          >
            {textLogo}
          </span>
          <span
            style={{ backgroundColor: branding.primaryColor || '#FAB818' }}
            className="w-2 h-2 rounded-full inline-block shrink-0"
          />
        </div>
        {showTagline && taglineText && (
          <span
            style={{
              fontSize: `${Math.max(8, Math.round(calcHeight * 0.22))}px`,
              color: isDark ? 'rgba(255,255,255,0.6)' : (branding.textColorMuted || '#64748b'),
            }}
            className={`font-mono font-bold tracking-widest uppercase mt-0.5 ${isCentered ? 'text-center w-full' : ''}`}
          >
            {taglineText}
          </span>
        )}
      </div>
    );
  }

  // Horizontal variant
  if (logoType === 'horizontal') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col ${isCentered ? 'items-center text-center w-full' : 'items-start'} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className={`inline-flex items-center gap-2.5 ${isCentered ? 'justify-center w-full' : ''}`}>
          {currentHorizontalUrl ? (
            <img
              src={currentHorizontalUrl}
              alt={`${textLogo} Logo`}
              style={{ height: `${calcHeight}px` }}
              className="object-contain max-w-full shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
          ) : (
            <div
              style={{
                height: `${calcHeight}px`,
                borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderRadius: `${branding.borderRadiusMd || 8}px`,
              }}
              className="flex items-center gap-2.5 px-3 py-1 border shadow-2xs shrink-0"
            >
              {renderFallbackIcon(Math.round(calcHeight * 0.75))}
              <div className="flex flex-col leading-none">
                <span
                  style={{
                    fontSize: `${Math.max(12, Math.round(calcHeight * 0.42))}px`,
                    fontFamily: logoFont,
                    color: isDark ? '#ffffff' : (branding.textColor || '#0d5c56'),
                  }}
                  className="font-black uppercase tracking-tight"
                >
                  {textLogo}
                </span>
                {showTagline && taglineText && (
                  <span
                    style={{
                      fontSize: `${Math.max(8, Math.round(calcHeight * 0.22))}px`,
                      color: isDark ? 'rgba(255,255,255,0.6)' : (branding.textColorMuted || '#64748b'),
                    }}
                    className="font-mono font-bold tracking-widest uppercase mt-0.5"
                  >
                    {taglineText}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Icon-only variant
  if (logoType === 'icon' || !renderText) {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col ${isCentered ? 'items-center text-center w-full' : 'items-start'} shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {currentIconUrl ? (
          <img
            src={currentIconUrl}
            alt={`${platformName} Logo`}
            style={{ width: `${calcHeight}px`, height: `${calcHeight}px` }}
            className="object-contain rounded-xl shadow-xs shrink-0"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/icon.svg';
            }}
          />
        ) : (
          renderFallbackIcon(calcHeight)
        )}
        {showTaglineText && taglineText && isCentered && (
          <span
            style={{
              fontSize: `${Math.max(8, Math.round(calcHeight * 0.22))}px`,
              color: isDark ? 'rgba(255,255,255,0.6)' : (branding.textColorMuted || '#64748b'),
            }}
            className="font-mono font-bold tracking-widest uppercase mt-1 text-center w-full"
          >
            {taglineText}
          </span>
        )}
      </div>
    );
  }

  // Centered or Stacked layout: Top (Centered Icon), Bottom (Centered Text & Tagline)
  // Perfectly aligned in the horizontal center of the screen
  if (isCentered) {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center w-full select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {/* Centered Logo Icon */}
        <div className="flex items-center justify-center mb-2.5 shrink-0">
          {currentIconUrl ? (
            <img
              src={currentIconUrl}
              alt={`${platformName} Logo`}
              style={{ width: `${calcHeight}px`, height: `${calcHeight}px` }}
              className="object-contain rounded-2xl shadow-sm shrink-0"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
          ) : (
            renderFallbackIcon(calcHeight)
          )}
        </div>

        {/* Centered Text & Subline Tagline */}
        {renderText && (
          <div className="flex flex-col items-center justify-center text-center w-full space-y-0.5">
            <div className="flex items-center justify-center gap-2 text-center w-full">
              {textLogo && (
                <span
                  style={{
                    fontSize: `${Math.max(16, Math.round(calcHeight * 0.52))}px`,
                    fontFamily: logoFont,
                    color: isDark ? '#ffffff' : (branding.textColor || '#0F172A'),
                  }}
                  className="font-black uppercase tracking-tight leading-none text-center"
                >
                  {textLogo}
                </span>
              )}
              {mode === 'rider' && (!taglineText || taglineText.toLowerCase() !== 'rider') && (
                <span className="px-2 py-0.5 bg-amber-400 text-slate-950 border border-amber-500/60 rounded-full text-[9px] font-black uppercase tracking-wider shadow-2xs">
                  RIDER
                </span>
              )}
              {mode === 'driver' && (!taglineText || taglineText.toLowerCase() !== 'driver') && (
                <span className="px-2 py-0.5 bg-emerald-500 text-white border border-emerald-600 rounded-full text-[9px] font-black uppercase tracking-wider shadow-2xs">
                  DRIVER
                </span>
              )}
            </div>

            {showTaglineText && taglineText && (
              <span
                style={{
                  fontSize: `${Math.max(9, Math.round(calcHeight * 0.22))}px`,
                  color: isDark ? 'rgba(255,255,255,0.7)' : (branding.textColorMuted || '#78716C'),
                }}
                className="font-mono font-extrabold tracking-widest uppercase mt-1 opacity-90 block text-center w-full"
              >
                {taglineText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default Standard Combined (Icon + Text side-by-side with tagline subline)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 shrink-0 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {currentIconUrl ? (
        <img
          src={currentIconUrl}
          alt={`${platformName} Logo`}
          style={{ width: `${calcHeight}px`, height: `${calcHeight}px` }}
          className="object-contain rounded-xl shadow-xs shrink-0"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/icon.svg';
          }}
        />
      ) : (
        renderFallbackIcon(calcHeight)
      )}

      {renderText && (
        <div className="flex flex-col leading-none min-w-0">
          <div className="flex items-center gap-2">
            {textLogo && (
              <span
                style={{
                  fontSize: `${Math.max(13, Math.round(calcHeight * 0.48))}px`,
                  fontFamily: logoFont,
                  color: isDark ? '#ffffff' : (branding.textColor || '#0F172A'),
                }}
                className="font-black uppercase tracking-tight truncate"
              >
                {textLogo}
              </span>
            )}
            {mode === 'rider' && (!taglineText || taglineText.toLowerCase() !== 'rider') && (
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 border border-amber-500/60 rounded-full text-[9px] font-black uppercase tracking-wider shadow-2xs shrink-0">
                RIDER
              </span>
            )}
            {mode === 'driver' && (!taglineText || taglineText.toLowerCase() !== 'driver') && (
              <span className="px-2 py-0.5 bg-emerald-500 text-white border border-emerald-600 rounded-full text-[9px] font-black uppercase tracking-wider shadow-2xs shrink-0">
                DRIVER
              </span>
            )}
          </div>
          {showTaglineText && taglineText && (
            <span
              style={{
                fontSize: `${Math.max(8, Math.round(calcHeight * 0.22))}px`,
                color: isDark ? 'rgba(255,255,255,0.6)' : (branding.textColorMuted || '#78716C'),
              }}
              className="font-mono font-extrabold tracking-wider uppercase mt-0.5 truncate"
            >
              {taglineText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
