import { requestFcmToken, onFcmMessageListener } from "./firebase";
import { notificationService, soundService } from "./systemService";

export interface PushInitOptions {
  userId?: string;
  role?: "rider" | "driver" | "admin";
  onNotificationReceived?: (data: any) => void;
}

/**
 * Initializes FCM and standard Web Push notification subscribers.
 */
export async function initializePushNotifications(options: PushInitOptions = {}) {
  const { userId, role = "rider", onNotificationReceived } = options;

  try {
    // 1. Request notification permission if not yet decided
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }

    // 2. Fetch server VAPID key to ensure standard Web Push is enabled
    let vapidKey = "";
    try {
      const res = await fetch("/api/push/vapid-key");
      if (res.ok) {
        const data = await res.json();
        vapidKey = data.publicKey;
      }
    } catch (e) {
      console.warn("[PUSH INIT] Could not fetch server vapid key:", e);
    }

    // 3. Register service workers
    if ("serviceWorker" in navigator) {
      try {
        // Register standard PWA service worker
        await navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
        // Register firebase messaging service worker for FCM background delivery
        await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" }).catch(() => {});
      } catch (e) {
        console.warn("[SW REGISTRATION NOTICE]", e);
      }
    }

    // 4. Request FCM token
    const fcmToken = await requestFcmToken(vapidKey);
    if (fcmToken) {
      // Sync FCM token with backend
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: {
            endpoint: `https://fcm.googleapis.com/fcm/send/${fcmToken}`,
            keys: {
              p256dh: "fcm-device-token",
              auth: fcmToken
            }
          },
          role,
          userId: userId || localStorage.getItem("ride-buddy-user-id") || "anonymous",
          fcmToken
        })
      }).catch((err) => console.warn("[PUSH SYNC NOTICE]", err));
    }

    // 5. Setup foreground FCM listener
    onFcmMessageListener((payload) => {
      const title = payload.notification?.title || payload.data?.title || "TaxiApp Notification 🚀";
      const body = payload.notification?.body || payload.data?.body || "You have a new update.";
      
      soundService.playNotification();
      notificationService.show(title, body, payload.notification?.icon || "/pwa_icon_192.png");

      if (onNotificationReceived) {
        onNotificationReceived(payload);
      }
    });

    return { success: true, fcmToken };
  } catch (error: any) {
    console.warn("[PUSH NOTIFICATION INIT ERROR]", error);
    return { success: false, error: error.message };
  }
}
