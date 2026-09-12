export interface AppErrorLog {
  id: string;
  timestamp: string;
  timeFormatted: string;
  userRole: 'Rider' | 'Driver' | 'Admin' | 'Guest' | 'System';
  userName?: string;
  userId?: string;
  page: string;
  section: string;
  errorName: string;
  errorMessage: string;
  stackTrace?: string;
  url?: string;
  browserInfo: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'Unresolved' | 'Investigating' | 'Resolved';
  source: 'User Submitted Report' | 'Auto Application Capture' | 'System Telemetry';
  userNotes?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

const STORAGE_KEY = 'app_runtime_errors_v1';
export const APP_ERROR_EVENT = 'app_error_logged_event';

// Initial seed errors so the Errors Page is immediately populated for demo/inspection
const INITIAL_SEED_ERRORS: AppErrorLog[] = [
  {
    id: 'ERR-20260808-01',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    timeFormatted: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    userRole: 'Rider',
    userName: 'Ananya Sharma (Rider #1029)',
    userId: 'RIDER-1029',
    page: 'Rider Ride Booking Screen',
    section: 'Fare Estimate Card & Payment Selector',
    errorName: 'TypeError',
    errorMessage: "Cannot read properties of undefined (reading 'fareAmount') during discount coupon application",
    stackTrace: `TypeError: Cannot read properties of undefined (reading 'fareAmount')
    at calculateDiscountedFare (src/components/LoginPage.tsx:1420:31)
    at handleApplyCouponCode (src/components/LoginPage.tsx:1894:12)
    at HTMLButtonElement.dispatch (node_modules/react-dom/cjs/react-dom.development.js:3412)`,
    url: '/rider/booking',
    browserInfo: 'Chrome 122.0.0 (Android 14; Mobile)',
    severity: 'high',
    status: 'Unresolved',
    source: 'User Submitted Report',
    userNotes: 'Rider reported: "Tried applying promo code DISCOUNT50 and screen froze with error message."'
  },
  {
    id: 'ERR-20260808-02',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    timeFormatted: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    userRole: 'Driver',
    userName: 'Vikram Singh (Driver #8841)',
    userId: 'DRIVER-8841',
    page: 'Driver Live GPS Navigation',
    section: 'Map Location Ping Tracker',
    errorName: 'GeolocationPositionError',
    errorMessage: "User denied Geolocation or GPS location service timeout after 10000ms",
    stackTrace: `GeolocationPositionError: User denied Geolocation
    at watchPositionCallback (src/components/LiveJourneyTracker.tsx:312:15)
    at navigator.geolocation.watchPosition (src/lib/geoUtils.ts:89:10)`,
    url: '/driver/navigation',
    browserInfo: 'Safari 17.2 (iOS 17.3; iPhone 15 Pro)',
    severity: 'medium',
    status: 'Unresolved',
    source: 'Auto Application Capture'
  },
  {
    id: 'ERR-20260808-03',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    timeFormatted: new Date(Date.now() - 1000 * 60 * 120).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    userRole: 'Admin',
    userName: 'Super Admin',
    userId: 'ADMIN-001',
    page: 'Backend Admin Panel - Payment Settings',
    section: 'Razorpay Key Sync Modal',
    errorName: 'NetworkError',
    errorMessage: "Failed to fetch Razorpay webhook endpoint health status: HTTP 504 Gateway Timeout",
    stackTrace: `NetworkError: Failed to fetch Razorpay endpoint
    at testRazorpayConnection (src/components/MailSettingsView.tsx:420:18)
    at async onClick (src/components/BackendAdmin.tsx:15420:9)`,
    url: '/admin/settings/razorpay',
    browserInfo: 'Chrome 124.0.0 (macOS 14.4)',
    severity: 'low',
    status: 'Resolved',
    source: 'System Telemetry',
    resolvedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    resolutionNotes: 'Updated timeout parameter from 3000ms to 8000ms in webPushClient.ts.'
  }
];

export function getStoredErrorLogs(): AppErrorLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_ERRORS));
      return INITIAL_SEED_ERRORS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SEED_ERRORS;
  } catch (err) {
    console.error('Error reading error logs from storage:', err);
    return INITIAL_SEED_ERRORS;
  }
}

export function saveErrorLogs(logs: AppErrorLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    window.dispatchEvent(new CustomEvent(APP_ERROR_EVENT, { detail: logs }));
  } catch (err) {
    console.error('Error saving error logs to storage:', err);
  }
}

export function logAppError(entry: {
  page?: string;
  section?: string;
  errorName?: string;
  errorMessage: string;
  stackTrace?: string;
  userRole?: 'Rider' | 'Driver' | 'Admin' | 'Guest' | 'System';
  userName?: string;
  userId?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  source?: 'User Submitted Report' | 'Auto Application Capture' | 'System Telemetry';
  userNotes?: string;
  url?: string;
}): AppErrorLog {
  const existing = getStoredErrorLogs();
  const now = new Date();
  
  const newLog: AppErrorLog = {
    id: `ERR-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: now.toISOString(),
    timeFormatted: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    userRole: entry.userRole || detectCurrentRole(),
    userName: entry.userName || (entry.userRole === 'Driver' ? 'Driver User' : entry.userRole === 'Rider' ? 'Rider User' : 'Guest / System'),
    userId: entry.userId,
    page: entry.page || detectCurrentPage(),
    section: entry.section || 'General Application Module',
    errorName: entry.errorName || 'Runtime Error',
    errorMessage: entry.errorMessage,
    stackTrace: entry.stackTrace || new Error().stack || '',
    url: entry.url || window.location.pathname,
    browserInfo: `${navigator.userAgent.substring(0, 60)}... (${window.innerWidth}x${window.innerHeight})`,
    severity: entry.severity || 'high',
    status: 'Unresolved',
    source: entry.source || 'Auto Application Capture',
    userNotes: entry.userNotes
  };

  const updated = [newLog, ...existing];
  saveErrorLogs(updated);
  return newLog;
}

export function toggleErrorStatus(id: string, notes?: string): void {
  const existing = getStoredErrorLogs();
  const updated = existing.map(log => {
    if (log.id === id) {
      const nextStatus: AppErrorLog['status'] = log.status === 'Resolved' ? 'Unresolved' : 'Resolved';
      return {
        ...log,
        status: nextStatus,
        resolvedAt: nextStatus === 'Resolved' ? new Date().toISOString() : undefined,
        resolutionNotes: nextStatus === 'Resolved' ? (notes || 'Marked as resolved by Admin') : undefined
      };
    }
    return log;
  });
  saveErrorLogs(updated);
}

export function updateErrorLog(updatedLog: AppErrorLog): void {
  const existing = getStoredErrorLogs();
  const updated = existing.map(log => log.id === updatedLog.id ? updatedLog : log);
  saveErrorLogs(updated);
}

export function deleteErrorLog(id: string): void {
  const existing = getStoredErrorLogs();
  const updated = existing.filter(log => log.id !== id);
  saveErrorLogs(updated);
}

export function deleteMultipleErrorLogs(ids: string[]): void {
  const idSet = new Set(ids);
  const existing = getStoredErrorLogs();
  const updated = existing.filter(log => !idSet.has(log.id));
  saveErrorLogs(updated);
}

export function toggleMultipleErrorStatus(ids: string[], targetStatus?: 'Resolved' | 'Unresolved'): void {
  const idSet = new Set(ids);
  const existing = getStoredErrorLogs();
  const updated = existing.map(log => {
    if (idSet.has(log.id)) {
      const nextStatus = targetStatus || (log.status === 'Resolved' ? 'Unresolved' : 'Resolved');
      return {
        ...log,
        status: nextStatus,
        resolvedAt: nextStatus === 'Resolved' ? new Date().toISOString() : undefined,
        resolutionNotes: nextStatus === 'Resolved' ? 'Updated in batch by Admin' : undefined
      };
    }
    return log;
  });
  saveErrorLogs(updated);
}

export function clearAllErrorLogs(): void {
  saveErrorLogs([]);
}

export function generateAIFixPrompt(error: AppErrorLog): string {
  return `[BUG FIXING REQUEST FOR AI ASSISTANT]
An application error occurred on a user screen and needs your help to resolve.

--- ERROR DETAILS ---
Error ID: ${error.id}
Time: ${error.timestamp}
User Role: ${error.userRole} (${error.userName || 'Unknown User'})
Page: ${error.page}
Section / Component: ${error.section}
Error Type: ${error.errorName}
Severity: ${error.severity.toUpperCase()}
URL / Path: ${error.url || 'N/A'}
Browser / Device: ${error.browserInfo}

--- ERROR MESSAGE ---
${error.errorMessage}

--- STACK TRACE ---
${error.stackTrace || 'No stack trace available.'}

${error.userNotes ? `--- USER FEEDBACK / NOTES ---\n"${error.userNotes}"\n` : ''}
--- INSTRUCTIONS FOR AI ---
1. Analyze the root cause of this error in the corresponding component/page (${error.page} / ${error.section}).
2. Provide a clean, robust, and bug-free code fix so this error is safely caught and prevented.
3. Make sure to update state and props safely without breaking existing features.`;
}

export function generateCombinedAIFixPrompt(errors: AppErrorLog[]): string {
  if (errors.length === 1) return generateAIFixPrompt(errors[0]);

  const errorBlocks = errors.map((error, idx) => `
=== BUG REPORT #${idx + 1} (${error.id}) ===
- Severity: ${error.severity.toUpperCase()} | Role: ${error.userRole} | Status: ${error.status}
- Location: ${error.page} > ${error.section}
- Error Type: ${error.errorName}
- Message: ${error.errorMessage}
${error.userNotes ? `- User Notes: "${error.userNotes}"\n` : ''}- Stack Trace:
${error.stackTrace || 'No stack trace captured.'}
`).join('\n');

  return `[MULTI-BUG FIXING REQUEST FOR AI ASSISTANT]
The following ${errors.length} application errors were captured and selected by the Admin to resolve simultaneously.

${errorBlocks}

--- INSTRUCTIONS FOR AI ASSISTANT ---
1. Review all ${errors.length} error reports listed above.
2. Identify common root causes or component vulnerabilities across these files.
3. Provide step-by-step code edits or fixes to prevent these errors completely.
4. Ensure all fixes maintain backward compatibility and clean error handling.`;
}

function detectCurrentRole(): 'Rider' | 'Driver' | 'Admin' | 'Guest' {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('admin')) return 'Admin';
  if (path.includes('driver')) return 'Driver';
  if (path.includes('rider')) return 'Rider';
  return 'Guest';
}

function detectCurrentPage(): string {
  const path = window.location.pathname;
  if (path.includes('admin')) return 'Backend Admin Panel';
  if (path.includes('driver')) return 'Driver Screen / App';
  if (path.includes('rider')) return 'Rider Screen / App';
  return 'Main Application View';
}

// Global auto-listener initializer
export function initGlobalErrorListeners(): () => void {
  const handleWindowError = (event: ErrorEvent) => {
    const msg = event.message || '';
    // Filter benign browser noise and harmless observer events
    if (
      msg.includes('ResizeObserver') ||
      msg.includes('Script error') ||
      msg.includes('websocket') ||
      msg.includes('connection refused')
    ) {
      return;
    }

    logAppError({
      errorName: event.error?.name || 'Uncaught Error',
      errorMessage: msg || 'An unexpected runtime error occurred',
      stackTrace: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
      severity: 'critical'
    });
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const msg = typeof reason === 'string' ? reason : reason?.message || '';
    // Filter benign promise rejections
    if (
      msg.includes('ResizeObserver') ||
      msg.includes('websocket') ||
      msg.includes('canceled') ||
      msg.includes('aborted')
    ) {
      return;
    }

    logAppError({
      errorName: 'UnhandledPromiseRejection',
      errorMessage: msg || 'Unhandled Promise Rejection',
      stackTrace: reason?.stack || 'Promise rejection stack uncaptured',
      severity: 'high'
    });
  };

  window.addEventListener('error', handleWindowError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  return () => {
    window.removeEventListener('error', handleWindowError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
}
