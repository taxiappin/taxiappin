/**
 * Ultra-Resilient Auth & Session Persistence with 24-Hour Expiry
 * 
 * iOS Safari in standalone/PWA bookmark mode frequently recycles transient localStorage
 * or creates a separate storage partition on app relaunch.
 * 
 * This module uses a Triple-Layer Storage Engine with strict 24-hour session lifecycle:
 * 1. LocalStorage (Primary fast access with expiry timestamp)
 * 2. Persistent Document Cookies (24-hour Max-Age)
 * 3. Fallback validation to ensure fresh visitors always see the Landing Page
 */

const AUTH_COOKIE_NAME = "taxiapp_session_profile";
const AUTH_FLAG_COOKIE = "taxiapp_is_authenticated";
const AUTH_USER_ID_COOKIE = "taxiapp_session_uid";
const AUTH_EXPIRY_COOKIE = "taxiapp_session_expiry";
export const SESSION_DURATION_HOURS = 24;
export const SESSION_DURATION_MS = SESSION_DURATION_HOURS * 60 * 60 * 1000; // 24 hours in ms

function setCookie(name: string, value: string, maxAgeSeconds = 86400) {
  try {
    if (typeof document === "undefined") return;
    const encoded = encodeURIComponent(value);
    document.cookie = `${name}=${encoded}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax; Secure`;
  } catch (e) {
    console.warn("[SESSION] Failed setting cookie:", e);
  }
}

function getCookie(name: string): string | null {
  try {
    if (typeof document === "undefined") return null;
    const nameEq = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEq) === 0) {
        return decodeURIComponent(c.substring(nameEq.length, c.length));
      }
    }
  } catch (e) {
    console.warn("[SESSION] Failed reading cookie:", e);
  }
  return null;
}

function removeCookie(name: string) {
  try {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
  } catch (e) {}
}

export function saveUserSession(profile: any, userId?: string) {
  if (!profile && !userId) return;
  const uid = userId || profile?.id;
  const profileStr = typeof profile === "string" ? profile : JSON.stringify(profile);
  const now = Date.now();
  let expiresAt = now + SESSION_DURATION_MS;
  try {
    const existingExpiry = localStorage.getItem("ride-buddy-session-expires-at");
    if (existingExpiry && Number(existingExpiry) > now) {
      expiresAt = Number(existingExpiry);
    }
  } catch (e) {}
  const maxAgeSeconds = Math.max(60, Math.round((expiresAt - now) / 1000)); // Remaining seconds for cookie

  // 1. LocalStorage
  try {
    localStorage.setItem("ride-buddy-is-logged-in", "true");
    localStorage.setItem("ride-buddy-session-expires-at", String(expiresAt));
    if (uid) localStorage.setItem("ride-buddy-user-id", uid);
    if (profile) localStorage.setItem("ride-buddy-user-profile", profileStr);
  } catch (e) {
    console.warn("[SESSION] LocalStorage set error:", e);
  }

  // 2. Persistent Cookie (24 hours max-age)
  setCookie(AUTH_FLAG_COOKIE, "true", maxAgeSeconds);
  setCookie(AUTH_EXPIRY_COOKIE, String(expiresAt), maxAgeSeconds);
  if (uid) setCookie(AUTH_USER_ID_COOKIE, uid, maxAgeSeconds);
  if (profile) setCookie(AUTH_COOKIE_NAME, profileStr, maxAgeSeconds);
}

export function loadUserSession(): { isLoggedIn: boolean; userId: string | null; profile: any | null } {
  if (typeof window === "undefined") {
    return { isLoggedIn: false, userId: null, profile: null };
  }

  const now = Date.now();
  let isLogged = false;
  let uid: string | null = null;
  let profile: any = null;
  let expiresAt: number | null = null;

  // Attempt 1: LocalStorage
  try {
    const lsFlag = localStorage.getItem("ride-buddy-is-logged-in");
    const lsExpiry = localStorage.getItem("ride-buddy-session-expires-at");
    const lsUid = localStorage.getItem("ride-buddy-user-id");
    const lsProfile = localStorage.getItem("ride-buddy-user-profile");

    if (lsExpiry) {
      expiresAt = Number(lsExpiry);
    }

    if (lsFlag === "true" && (lsUid || lsProfile)) {
      isLogged = true;
      uid = lsUid;
      if (lsProfile) profile = JSON.parse(lsProfile);
    }
  } catch (e) {}

  // Attempt 2: Fallback to Cookies
  if (!isLogged || !profile) {
    try {
      const cFlag = getCookie(AUTH_FLAG_COOKIE);
      const cExpiry = getCookie(AUTH_EXPIRY_COOKIE);
      const cUid = getCookie(AUTH_USER_ID_COOKIE);
      const cProfile = getCookie(AUTH_COOKIE_NAME);

      if (cExpiry && !expiresAt) {
        expiresAt = Number(cExpiry);
      }

      if (cFlag === "true" && (cUid || cProfile)) {
        isLogged = true;
        if (!uid && cUid) uid = cUid;
        if (!profile && cProfile) {
          try {
            profile = JSON.parse(cProfile);
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  // 24-Hour Expiration Check:
  // If no explicit expiration timestamp or session has passed the 24-hour mark, invalidate and clear
  if (isLogged) {
    if (!expiresAt || isNaN(expiresAt) || now > expiresAt) {
      console.log("[SESSION] Session expired or invalid (24h limit reached). Clearing session.");
      clearUserSession();
      return { isLoggedIn: false, userId: null, profile: null };
    }

    // Session is valid within 24 hours; ensure synchronized state
    try {
      localStorage.setItem("ride-buddy-is-logged-in", "true");
      localStorage.setItem("ride-buddy-session-expires-at", String(expiresAt));
      if (uid) localStorage.setItem("ride-buddy-user-id", uid);
      if (profile) localStorage.setItem("ride-buddy-user-profile", JSON.stringify(profile));
    } catch (e) {}
  }

  return { isLoggedIn: isLogged, userId: uid, profile };
}

export function clearUserSession() {
  try {
    localStorage.removeItem("ride-buddy-is-logged-in");
    localStorage.removeItem("ride-buddy-session-expires-at");
    localStorage.removeItem("ride-buddy-user-id");
    localStorage.removeItem("ride-buddy-user-profile");
  } catch (e) {}

  removeCookie(AUTH_FLAG_COOKIE);
  removeCookie(AUTH_EXPIRY_COOKIE);
  removeCookie(AUTH_USER_ID_COOKIE);
  removeCookie(AUTH_COOKIE_NAME);
}

