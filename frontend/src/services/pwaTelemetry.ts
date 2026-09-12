/**
 * PWA Telemetry Client Service
 * Detects whether the app is running as an installed standalone PWA or standard Web browser,
 * device platform (Android, iOS, Windows, Mac, Linux), browser name, app version, and session usage.
 */

export interface PwaTelemetryPing {
  userId?: string;
  userName?: string;
  role?: string;
  isPwa: boolean;
  displayMode: 'standalone' | 'browser' | 'twa' | 'minimal-ui';
  platform: 'Android' | 'iOS' | 'Windows' | 'macOS' | 'Linux' | 'Chrome OS' | 'Unknown';
  osVersion: string;
  browser: string;
  appVersion: string;
  pushStatus: NotificationPermission;
  sessionMinutes: number;
  errorsCount: number;
  swState?: string;
}

export const CURRENT_APP_VERSION = "2.5.0-PROD";

let sessionStartTime = Date.now();
let sessionErrorCount = 0;

// Listen to uncaught JS errors to include in telemetry ping
if (typeof window !== 'undefined') {
  window.addEventListener('error', () => {
    sessionErrorCount++;
  });
  window.addEventListener('unhandledrejection', () => {
    sessionErrorCount++;
  });
}

/**
 * Detects display mode: standalone PWA vs Web browser
 */
export function getDisplayMode(): 'standalone' | 'browser' | 'twa' | 'minimal-ui' {
  if (typeof window === 'undefined') return 'browser';

  // iOS Safari standalone property
  if ((window.navigator as any).standalone) {
    return 'standalone';
  }

  // Display mode media query
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'standalone';
  }
  if (window.matchMedia('(display-mode: twa)').matches) {
    return 'twa';
  }
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    return 'minimal-ui';
  }

  return 'browser';
}

/**
 * Detects user OS platform
 */
export function getPlatform(): 'Android' | 'iOS' | 'Windows' | 'macOS' | 'Linux' | 'Chrome OS' | 'Unknown' {
  if (typeof window === 'undefined') return 'Unknown';

  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'Android';
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'iOS';
  if (/Win/i.test(ua)) return 'Windows';
  if (/Mac/i.test(ua)) return 'macOS';
  if (/CrOS/i.test(ua)) return 'Chrome OS';
  if (/Linux/i.test(ua)) return 'Linux';

  return 'Unknown';
}

/**
 * Detects browser name and version string
 */
export function getBrowserInfo(): string {
  if (typeof window === 'undefined') return 'Browser';

  const ua = navigator.userAgent;
  if (ua.includes('Edg/')) return 'Microsoft Edge';
  if (ua.includes('Chrome/')) {
    const match = ua.match(/Chrome\/([0-9.]+)/);
    return `Chrome ${match ? match[1] : ''}`.trim();
  }
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    return 'Safari';
  }
  if (ua.includes('Firefox/')) return 'Firefox';

  return 'Standard Browser';
}

/**
 * Reports telemetry ping to backend
 */
export async function sendPwaTelemetryPing(userInfo?: { userId?: string; userName?: string; role?: string }) {
  if (typeof window === 'undefined') return;

  const displayMode = getDisplayMode();
  const isPwa = displayMode === 'standalone' || displayMode === 'twa';
  const platform = getPlatform();
  const browser = getBrowserInfo();
  const pushStatus = typeof Notification !== 'undefined' ? Notification.permission : 'default';
  
  const elapsedMinutes = Math.max(1, Math.round((Date.now() - sessionStartTime) / 60000));

  let swState = 'none';
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    swState = navigator.serviceWorker.controller.state || 'activated';
  }

  const payload: PwaTelemetryPing = {
    userId: userInfo?.userId || localStorage.getItem('taxi_user_id') || undefined,
    userName: userInfo?.userName || localStorage.getItem('taxi_user_name') || undefined,
    role: userInfo?.role || localStorage.getItem('taxi_user_role') || 'Rider',
    isPwa,
    displayMode,
    platform,
    osVersion: `${platform} (${navigator.platform})`,
    browser,
    appVersion: CURRENT_APP_VERSION,
    pushStatus,
    sessionMinutes: elapsedMinutes,
    errorsCount: sessionErrorCount,
    swState
  };

  try {
    const res = await fetch('/api/admin/pwa/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // Silent catch if offline or dev mode
  }
  return null;
}

/**
 * Starts automatic background pinging every 10 minutes and on page unload
 */
export function initPwaTelemetry(userInfo?: { userId?: string; userName?: string; role?: string }) {
  if (typeof window === 'undefined') return;

  // Initial ping
  sendPwaTelemetryPing(userInfo);

  // Ping every 10 mins
  const intervalId = setInterval(() => {
    sendPwaTelemetryPing(userInfo);
  }, 10 * 60 * 1000);

  // Ping on visibility change or page hide
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendPwaTelemetryPing(userInfo);
    }
  });

  return () => clearInterval(intervalId);
}
