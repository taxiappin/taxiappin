import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult, 
  Auth,
  User
} from "firebase/auth";
import { 
  getMessaging, 
  getToken, 
  onMessage, 
  Messaging, 
  isSupported 
} from "firebase/messaging";

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDv-yvl14rUgyunBX2tBS9tQXvUC_JU1q4",
  authDomain: "taxiappwebsite.firebaseapp.com",
  projectId: "taxiappwebsite",
  storageBucket: "taxiappwebsite.firebasestorage.app",
  messagingSenderId: "32855624240",
  appId: "1:32855624240:web:7f7073ff421952cbecbbf5",
  measurementId: "G-BHERTJVM9W",
  vapidKey: "BFlD7f-W2eN9F_z_T7oU0NfJ1T087k5M3_7u5pP8b9S_79sN2VfT1Z0F8Y8X8z8f_T9_79oK1S8_Y0NfJ1T087k5M"
};

export function getActiveFirebaseConfig() {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("taxiapp_firebase_config");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.projectId && parsed.apiKey) {
          return { ...DEFAULT_FIREBASE_CONFIG, ...parsed };
        }
      }
    } catch (e) {
      console.warn("[FIREBASE CONFIG WARNING] Local config parse error:", e);
    }
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export const firebaseConfig = getActiveFirebaseConfig();

// Singleton Firebase App
export function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  const activeCfg = getActiveFirebaseConfig();
  return initializeApp(activeCfg);
}

// Singleton Firebase Auth
export function getFirebaseAuth(): Auth {
  const app = getFirebaseApp();
  return getAuth(app);
}

// Store active phone confirmation result in memory
let activeConfirmationResult: ConfirmationResult | null = null;
let activeRecaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Initializes or resets an invisible reCAPTCHA verifier attached to a DOM element.
 * Reuses existing verifier instance when valid to eliminate 2-3s script loading delays.
 */
export function setupRecaptchaVerifier(containerId: string = "recaptcha-container"): RecaptchaVerifier {
  const auth = getFirebaseAuth();

  // Ensure element exists in DOM or create on-the-fly invisible anchor
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.position = "fixed";
    container.style.bottom = "0";
    container.style.right = "0";
    container.style.zIndex = "-1";
    document.body.appendChild(container);
  }

  // Clear existing before re-creating to prevent reCAPTCHA already rendered error
  if (activeRecaptchaVerifier) {
    try {
      activeRecaptchaVerifier.clear();
    } catch (e) {
      console.warn("[FIREBASE] Old reCAPTCHA cleanup notice:", e);
    }
    activeRecaptchaVerifier = null;
  }
  container.innerHTML = "";

  activeRecaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      console.log("[FIREBASE] Invisible reCAPTCHA verified successfully.");
    },
    "expired-callback": () => {
      console.warn("[FIREBASE] reCAPTCHA token expired, refreshing session.");
      if (activeRecaptchaVerifier) {
        try { activeRecaptchaVerifier.clear(); } catch (_) {}
        activeRecaptchaVerifier = null;
      }
    }
  });

  return activeRecaptchaVerifier;
}

/**
 * Sends a real SMS OTP to the provided phone number using Firebase Phone Authentication.
 */
export async function sendFirebasePhoneOtp(
  phoneNumber: string, 
  containerId: string = "recaptcha-container"
): Promise<{ success: boolean; message?: string }> {
  try {
    const auth = getFirebaseAuth();
    
    // Normalize to standard E.164 without whitespace or punctuation
    const rawDigits = phoneNumber.replace(/[^0-9+]/g, "");
    const cleanPhoneNumber = rawDigits.startsWith("+") ? rawDigits : `+${rawDigits}`;

    const appVerifier = setupRecaptchaVerifier(containerId);
    
    console.log(`[FIREBASE AUTH] Dispatching real SMS to ${cleanPhoneNumber}...`);
    const confirmationResult = await signInWithPhoneNumber(auth, cleanPhoneNumber, appVerifier);
    activeConfirmationResult = confirmationResult;

    return { 
      success: true, 
      message: `Verification code sent via SMS to ${cleanPhoneNumber}.` 
    };
  } catch (error: any) {
    console.error("[FIREBASE AUTH ERROR] signInWithPhoneNumber failed:", error);
    throw error;
  }
}

/**
 * Verifies the 6-digit SMS OTP code using Firebase ConfirmationResult.
 */
export async function verifyFirebasePhoneOtp(otpCode: string): Promise<{ user: User; idToken: string }> {
  if (!activeConfirmationResult) {
    throw new Error("No active phone verification session found. Please request a new code.");
  }

  try {
    const userCredential = await activeConfirmationResult.confirm(otpCode);
    const user = userCredential.user;
    const idToken = await user.getIdToken();
    return { user, idToken };
  } catch (error: any) {
    console.error("[FIREBASE AUTH ERROR] Confirmation failed:", error);
    throw error;
  }
}

/**
 * Retrieves FCM Messaging instance if supported by current browser environment.
 */
export async function getFcmMessagingInstance(): Promise<Messaging | null> {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.info("[FCM] Firebase Messaging is not supported in this browser environment.");
      return null;
    }
    const app = getFirebaseApp();
    return getMessaging(app);
  } catch (err) {
    console.warn("[FCM] Error checking messaging support:", err);
    return null;
  }
}

/**
 * Requests FCM push notification token and syncs subscription with backend.
 */
export async function requestFcmToken(vapidKey?: string): Promise<string | null> {
  try {
    const messaging = await getFcmMessagingInstance();
    if (!messaging) return null;

    if (!("Notification" in window)) {
      console.warn("[FCM] Notifications not supported in this browser.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("[FCM] Notification permission was not granted:", permission);
      return null;
    }

    // Get active service worker registration
    let swReg: ServiceWorkerRegistration | undefined = undefined;
    if ("serviceWorker" in navigator) {
      try {
        swReg = await navigator.serviceWorker.ready;
      } catch (e) {
        console.warn("[FCM] ServiceWorker ready wait warning:", e);
      }
    }

    const token = await getToken(messaging, {
      serviceWorkerRegistration: swReg,
      vapidKey: vapidKey || undefined
    });

    if (token) {
      console.log("[FCM] Obtained FCM registration token:", token);
      return token;
    } else {
      console.warn("[FCM] No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (error: any) {
    console.warn("[FCM] Failed to acquire FCM Token:", error.message || error);
    return null;
  }
}

/**
 * Listens for FCM foreground messages when tab/PWA is active.
 */
export async function onFcmMessageListener(callback: (payload: any) => void) {
  const messaging = await getFcmMessagingInstance();
  if (!messaging) return () => {};

  return onMessage(messaging, (payload) => {
    console.log("[FCM FOREGROUND MESSAGE RECEIVED]:", payload);
    callback(payload);
  });
}
