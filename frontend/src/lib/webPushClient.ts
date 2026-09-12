/**
 * Client-side helper for native Web Push registration and synchronization.
 */

// Convert base64 VAPID public key to Uint8Array for the browser pushManager
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Checks if Service Worker and Push Notifications are supported in the browser
 */
export function isPushSupported(): boolean {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/**
 * Inspects current subscription status and permission level
 */
export async function getPushSubscriptionState(): Promise<{
  supported: boolean;
  permission: NotificationPermission;
  subscribed: boolean;
}> {
  if (!isPushSupported()) {
    return {
      supported: false,
      permission: "default",
      subscribed: false
    };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return {
      supported: true,
      permission: Notification.permission,
      subscribed: !!subscription
    };
  } catch (err) {
    console.warn("[WEB-PUSH-CLIENT] Error checking subscription state:", err);
    return {
      supported: true,
      permission: Notification.permission,
      subscribed: false
    };
  }
}

/**
 * Requests browser notification permissions and subscribes to push notifications
 * Syncs the subscription payload back to our Express server.
 */
export async function subscribeToPush(
  role: "rider" | "driver",
  userId?: string
): Promise<{ success: boolean; error?: string; subscription?: any }> {
  if (!isPushSupported()) {
    return { success: false, error: "Web Push notifications are not supported on this browser or device." };
  }

  try {
    // 1. Request notification permissions from the user
    console.log("[WEB-PUSH-CLIENT] Requesting notification permissions...");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { success: false, error: "Notification permission was denied by the user." };
    }

    // 2. Wait for Service Worker to be fully active/ready
    const registration = await navigator.serviceWorker.ready;

    // 3. Fetch public VAPID key from backend
    console.log("[WEB-PUSH-CLIENT] Fetching VAPID public key from backend...");
    const vapidRes = await fetch("/api/push/vapid-key");
    if (!vapidRes.ok) {
      throw new Error("Failed to load public VAPID key from the backend.");
    }
    const { publicKey } = await vapidRes.json();
    if (!publicKey) {
      throw new Error("No public VAPID key returned by the server.");
    }

    // Convert VAPID key to proper format
    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    // 4. Register or retrieve push subscription on the browser
    console.log("[WEB-PUSH-CLIENT] Registering/verifying subscription on browser...");
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Try syncing existing subscription to server
      const testSync = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription, role, userId: userId || null })
      });
      if (testSync.ok) {
        console.log("[WEB-PUSH-CLIENT] Existing push subscription verified & synced!");
        return { success: true, subscription };
      }
      // If server sync failed, key might have changed. Unsubscribe old token and re-subscribe.
      console.log("[WEB-PUSH-CLIENT] Stale push subscription detected. Resubscribing with current VAPID key...");
      await subscription.unsubscribe().catch(() => {});
      subscription = null;
    }

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });
    }

    // 5. Send subscription payload to the backend for storage
    console.log("[WEB-PUSH-CLIENT] Sending fresh subscription to server for persistence...");
    const syncRes = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription,
        role,
        userId: userId || null
      })
    });

    if (!syncRes.ok) {
      const errorData = await syncRes.json();
      throw new Error(errorData.error || "Failed to register subscription on the server.");
    }

    console.log("[WEB-PUSH-CLIENT] Native Web Push registered & synced successfully!");
    return { success: true, subscription };
  } catch (err: any) {
    console.error("[WEB-PUSH-CLIENT] Subscription workflow failed:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Silently verifies and synchronizes the active push subscription on app load or user login.
 * This guarantees the server always has the latest valid token even if the device was asleep.
 */
export async function autoSyncPushSubscription(
  role: "rider" | "driver",
  userId?: string
): Promise<void> {
  if (!isPushSupported() || Notification.permission !== "granted") {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription,
        role,
        userId: userId || null
      })
    });
    console.log("[WEB-PUSH-CLIENT] Background push subscription auto-synced with server.");
  } catch (err) {
    console.warn("[WEB-PUSH-CLIENT] Background subscription auto-sync skipped:", err);
  }
}

/**
 * Unsubscribes client from native Web Push notifications
 */
export async function unsubscribeFromPush(): Promise<{ success: boolean; error?: string }> {
  if (!isPushSupported()) {
    return { success: false, error: "Push is not supported." };
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Unsubscribe locally in the browser
      await subscription.unsubscribe();
      console.log("[WEB-PUSH-CLIENT] Unsubscribed browser locally.");
    }

    return { success: true };
  } catch (err: any) {
    console.error("[WEB-PUSH-CLIENT] Unsubscribe failed:", err.message);
    return { success: false, error: err.message };
  }
}
