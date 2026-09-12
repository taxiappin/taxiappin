import React from 'react';
import { PlatformConfig, AppBranding } from '../types';
import { Navigation } from 'lucide-react';

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

  let textLogo = branding.textLogo !== undefined ? branding.textLogo : platformName;
  let taglineText = tagline !== undefined ? tagline : (branding.tagline || 'PREMIUM MOBILITY ECOSYSTEM');
  let showText = showTextOverride !== undefined ? showTextOverride : (branding.logoWithText ?? true);
  let showTaglineText = showTagline;

  if (mode === 'rider') {
    if (branding.riderTextLogo !== undefined) {
      textLogo = branding.riderTextLogo;
    }
    if (branding.riderTagline !== undefined) {
      taglineText = branding.riderTagline;
    } else if (tagline === undefined) {
      taglineText = 'Rider';
    }
    if (branding.riderShowText !== undefined) {
      showText = branding.riderShowText;
    }
    if (branding.riderShowTagline !== undefined) {
      showTaglineText = branding.riderShowTagline;
    }
  } else if (mode === 'driver') {
    if (branding.driverTextLogo !== undefined) {
      textLogo = branding.driverTextLogo;
    }
    if (branding.driverTagline !== undefined) {
      taglineText = branding.driverTagline;
    } else if (tagline === undefined) {
      taglineText = 'Driver';
    }
    if (branding.driverShowText !== undefined) {
      showText = branding.driverShowText;
    }
    if (branding.driverShowTagline !== undefined) {
      showTaglineText = branding.driverShowTagline;
    }
  }

  const logoType = variant === 'auto' ? (branding.logoType || 'combined') : variant;
  const calcHeight = height || branding.logoHeight || 36;
  const logoFont = branding.logoFontFamily || branding.headingFontFamily || branding.fontFamily || 'Poppins';

  const hasAnyText = Boolean((textLogo && textLogo.trim()) || (taglineText && taglineText.trim()));
  const renderText = showText && hasAnyText;

  // Determine alignment
  const isCentered = layout === 'centered' || layout === 'stacked' || align === 'center';

  // Determine which image URL to use with mode and section fallback
  let sectionLight = '';
  let sectionDark = '';

  if (mode === 'rider') {
    sectionLight = branding.riderLogoUrl || '';
    sectionDark = branding.riderDarkLogoUrl || '';
  } else if (mode === 'driver') {
    sectionLight = branding.driverLogoUrl || '';
    sectionDark = branding.driverDarkLogoUrl || '';
  }

  if (!sectionLight && section === 'landing') {
    sectionLight = branding.landingLogoUrl || '';
    sectionDark = branding.landingDarkLogoUrl || '';
  } else if (!sectionLight && section === 'app') {
    sectionLight = branding.appLogoUrl || '';
    sectionDark = branding.appDarkLogoUrl || '';
  } else if (!sectionLight && section === 'backend') {
    sectionLight = branding.backendLogoUrl || '';
    sectionDark = branding.backendDarkLogoUrl || '';
  } else if (!sectionLight && section === 'auth') {
    sectionLight = branding.authLogoUrl || '';
    sectionDark = branding.authDarkLogoUrl || '';
  }

  const lightIcon = sectionLight || branding.lightLogoUrl || branding.logoUrl;
  const darkIcon = sectionDark || branding.darkLogoUrl || sectionLight || branding.lightLogoUrl || branding.logoUrl;
  const currentIconUrl = isDark ? (darkIcon || lightIcon) : (lightIcon || darkIcon);

  const lightHorizontal = branding.horizontalLogoUrl || lightIcon;
  const darkHorizontal = branding.horizontalLogoDarkUrl || branding.horizontalLogoUrl || darkIcon;
  const currentHorizontalUrl = isDark ? (darkHorizontal || lightHorizontal) : (lightHorizontal || darkHorizontal);

  const faviconUrl = branding.faviconUrl || currentIconUrl;

  // Fallback default SVG icon
  const renderFallbackIcon = (size: number) => (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: branding.primaryColor || '#FAB818',
        borderRadius: `${Math.min((branding.borderRadiusMd || 8) + 2, size / 2)}px`,
      }}
      className="flex items-center justify-center shrink-0 shadow-md shadow-black/10 transition-transform active:scale-95"
    >
      <Navigation
        style={{
          width: `${Math.round(size * 0.55)}px`,
          height: `${Math.round(size * 0.55)}px`,
          color: '#0d5c56',
        }}
        className="fill-current transform -rotate-12"
      />
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
        className={`inline-flex flex-col ${isCentered ? 'items-center text-center' : 'items-start'} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="flex items-center gap-1.5">
          <span
            style={{
              fontSize: `${Math.max(14, Math.round(calcHeight * 0.55))}px`,
              fontFamily: logoFont,
              color: isDark ? '#ffffff' : (branding.textColor || '#0d5c56'),
            }}
            className="font-black uppercase tracking-tight leading-none"
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
            className="font-mono font-bold tracking-widest uppercase mt-0.5"
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
        className={`inline-flex flex-col ${isCentered ? 'items-center text-center' : 'items-start'} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="inline-flex items-center gap-2.5">
          {currentHorizontalUrl ? (
            <img
              src={currentHorizontalUrl}
              alt={`${textLogo} Horizontal Logo`}
              style={{ height: `${calcHeight}px` }}
              className="object-contain max-w-full shrink-0"
              referrerPolicy="no-referrer"
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
        className={`inline-flex flex-col ${isCentered ? 'items-center text-center' : 'items-start'} shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {currentIconUrl ? (
          <img
            src={currentIconUrl}
            alt={`${platformName} Logo`}
            style={{ width: `${calcHeight}px`, height: `${calcHeight}px` }}
            className="object-contain rounded-xl shadow-xs shrink-0"
            referrerPolicy="no-referrer"
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
            className="font-mono font-bold tracking-widest uppercase mt-1"
          >
            {taglineText}
          </span>
        )}
      </div>
    );
  }

  // Centered or Stacked layout: Top (Icon + Text Logo), Bottom (Subline Tagline)
  if (isCentered) {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center justify-center text-center shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        {/* Top: Icon + Text Logo */}
        <div className="inline-flex items-center justify-center gap-2.5">
          {currentIconUrl ? (
            <img
              src={currentIconUrl}
              alt={`${platformName} Logo`}
              style={{ width: `${calcHeight}px`, height: `${calcHeight}px` }}
              className="object-contain rounded-xl shadow-xs shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            renderFallbackIcon(calcHeight)
          )}
          {renderText && (
            <div className="flex items-center gap-2">
              {textLogo && (
                <span
                  style={{
                    fontSize: `${Math.max(14, Math.round(calcHeight * 0.52))}px`,
                    fontFamily: logoFont,
                    color: isDark ? '#ffffff' : (branding.textColor || '#0d5c56'),
                  }}
                  className="font-black uppercase tracking-tight leading-none"
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
          )}
        </div>

        {/* Subline: Tagline comes below the icon and logo text */}
        {showTaglineText && taglineText && (
          <span
            style={{
              fontSize: `${Math.max(8, Math.round(calcHeight * 0.22))}px`,
              color: isDark ? 'rgba(255,255,255,0.7)' : (branding.textColorMuted || '#64748b'),
            }}
            className="font-mono font-extrabold tracking-widest uppercase mt-1.5 opacity-90 block"
          >
            {taglineText}
          </span>
        )}
      </div>
    );
  }

  // Default Standard Combined (Icon + Text side-by-side with tagline subline)
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {currentIconUrl ? (
        <img
          src={currentIconUrl}
          alt={`${platformName} Logo`}
          style={{ width: `${calcHeight}px`, height: `${calcHeight}px` }}
          className="object-contain rounded-xl shadow-xs shrink-0"
          referrerPolicy="no-referrer"
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
                  color: isDark ? '#ffffff' : (branding.textColor || '#0d5c56'),
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
                color: isDark ? 'rgba(255,255,255,0.6)' : (branding.textColorMuted || '#64748b'),
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
