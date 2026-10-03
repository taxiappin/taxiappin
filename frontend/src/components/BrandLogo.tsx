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

/**
 * Official TaxiApp Pure Vector Ring Logo
 * Renders directly as inline SVG elements to guarantee 100% immediate rendering
 * with zero browser cache latency or stale asset fallback.
 */
export const TaxiAppRingLogo: React.FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 bg-transparent select-none transition-transform active:scale-95 ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, backgroundColor: 'transparent' }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M 256 26 C 383.025 26 486 128.975 486 256 C 486 383.025 383.025 486 256 486 C 128.975 486 26 383.025 26 256 C 26 128.975 128.975 26 256 26 Z M 256 128 C 185.308 128 128 185.308 128 256 C 128 326.692 185.308 384 256 384 C 326.692 384 384 326.692 384 256 C 384 185.308 326.692 128 256 128 Z"
      fill="#EEA51B"
    />
  </svg>
);

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

  // Check if an explicit custom logo was uploaded by admin
  const customLogoUrl = 
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
    '';

  // Only use <img> if it is a truly custom uploaded user image (not default paths)
  const isCustomUserUpload = 
    customLogoUrl && 
    !customLogoUrl.includes('icon.svg') && 
    !customLogoUrl.includes('Asset-14') && 
    !customLogoUrl.includes('autoprofile') && 
    !customLogoUrl.includes('cartop') && 
    !customLogoUrl.includes('carprofile') &&
    (customLogoUrl.startsWith('data:') || customLogoUrl.includes('custom') || customLogoUrl.includes('blob:'));

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

  // Render the logo icon: Uses inline SVG by default to prevent any cache issues
  const renderLogoIcon = (size: number) => {
    if (isCustomUserUpload) {
      return (
        <img
          src={customLogoUrl}
          alt={`${platformName} Logo`}
          style={{ width: `${size}px`, height: `${size}px` }}
          className="object-contain bg-transparent shrink-0"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      );
    }
    return <TaxiAppRingLogo size={size} />;
  };

  // Favicon variant
  if (logoType === 'favicon') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center bg-transparent ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {renderLogoIcon(calcHeight)}
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
          <div
            style={{
              height: `${calcHeight}px`,
              backgroundColor: 'transparent',
            }}
            className="flex items-center gap-2.5 px-1 py-1 shrink-0"
          >
            {renderLogoIcon(Math.round(calcHeight * 0.85))}
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
        </div>
      </div>
    );
  }

  // Icon-only variant
  if (logoType === 'icon' || !renderText) {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col ${isCentered ? 'items-center text-center w-full' : 'items-start'} shrink-0 bg-transparent ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {renderLogoIcon(calcHeight)}
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
  // Perfectly aligned in the horizontal center of the screen with transparent logo
  if (isCentered) {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center text-center w-full select-none bg-transparent ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {/* Centered Logo Icon with transparent background */}
        <div className="flex items-center justify-center mb-2.5 shrink-0 bg-transparent">
          {renderLogoIcon(calcHeight)}
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
      className={`inline-flex items-center gap-2.5 shrink-0 select-none bg-transparent ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {renderLogoIcon(calcHeight)}

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
