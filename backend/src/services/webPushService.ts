import webpush from "web-push";
import { getPgPool, getIsPgConnected } from "../models/postgres";
import { globalConfig, saveConfig } from "../models/db";

// Global Socket.io instance reference for instant real-time websocket pushes
let globalIo: any = null;

export function setGlobalIo(io: any) {
  globalIo = io;
  console.log("[WEB-PUSH] Global Socket.io instance set for instant real-time push routing.");
}

export function getGlobalIo() {
  return globalIo;
}

// In-memory fallback array for subscriptions when PostgreSQL is not connected
let inMemorySubscriptions: any[] = [];

// Cache keys in memory after initial load
let cachedPublicKey: string | null = null;
let cachedPrivateKey: string | null = null;

/**
 * Initializes and retrieves VAPID keys.
 * If VAPID keys don't exist in config, they are dynamically generated once
 * and persisted in config.json and PostgreSQL.
 */
export function getVapidKeys() {
  if (cachedPublicKey && cachedPrivateKey) {
    return { publicKey: cachedPublicKey, privateKey: cachedPrivateKey };
  }

  // Try to load from globalConfig
  if (globalConfig && globalConfig.vapid_public_key && globalConfig.vapid_private_key) {
    cachedPublicKey = globalConfig.vapid_public_key;
    cachedPrivateKey = globalConfig.vapid_private_key;
    
    // Set details on webpush
    webpush.setVapidDetails(
      "mailto:admin@taxiapp-push.com",
      cachedPublicKey!,
      cachedPrivateKey!
    );
    
    return { publicKey: cachedPublicKey, privateKey: cachedPrivateKey };
  }

  // Otherwise, generate fresh keys (fully self-hosted, self-generated, free!)
  console.log("[WEB-PUSH] VAPID keys not found. Generating fresh keypair...");
  try {
    const keys = webpush.generateVAPIDKeys();
    cachedPublicKey = keys.publicKey;
    cachedPrivateKey = keys.privateKey;

    // Persist keypair in configuration
    if (globalConfig) {
      const updatedConfig = {
        ...globalConfig,
        vapid_public_key: keys.publicKey,
        vapid_private_key: keys.privateKey,
      };
      saveConfig(updatedConfig);
    }

    webpush.setVapidDetails(
      "mailto:admin@taxiapp-push.com",
      cachedPublicKey,
      cachedPrivateKey
    );

    console.log("[WEB-PUSH] VAPID keypair generated and saved successfully!");
    return { publicKey: cachedPublicKey, privateKey: cachedPrivateKey };
  } catch (err: any) {
    console.error("[WEB-PUSH ERROR] Failed to generate/set VAPID details:", err.message);
    // Use fallback hardcoded key for the current session if generation crashes
    const fallbackKeys = {
      publicKey: "BFlD7f-W2eN9F_z_T7oU0NfJ1T087k5M3_7u5pP8b9S_79sN2VfT1Z0F8Y8X8z8f_T9_79oK1S8_Y0NfJ1T087k5M",
      privateKey: "fallback-keys-not-fully-configured"
    };
    return fallbackKeys;
  }
}

/**
 * Ensures VAPID details are set. Should be run before sending any push.
 */
export function ensureVapidConfigured() {
  getVapidKeys();
}

/**
 * Subscribes a client to web push alerts.
 * Saves the subscription payload to PostgreSQL (if connected) or falls back to in-memory array.
 */
export async function saveSubscription(sub: any, role: string, userId?: string) {
  ensureVapidConfigured();
  
  if (!sub || !sub.endpoint) {
    throw new Error("Invalid subscription object");
  }

  const endpoint = sub.endpoint;
  const p256dh = sub.keys?.p256dh || "";
  const auth = sub.keys?.auth || "";
  const cleanedRole = role.toLowerCase(); // 'rider' | 'driver'

  console.log(`[WEB-PUSH] Registering subscription for ${cleanedRole} (userId: ${userId || "Guest"}). Endpoint: ${endpoint.substring(0, 45)}...`);

  const isPg = getIsPgConnected();
  if (isPg) {
    const pool = getPgPool();
    if (pool) {
      try {
        // UPSERT subscription by endpoint
        await pool.query(`
          INSERT INTO push_subscriptions (endpoint, p256dh, auth, role, user_id)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (endpoint) 
          DO UPDATE SET 
            p256dh = EXCLUDED.p256dh,
            auth = EXCLUDED.auth,
            role = EXCLUDED.role,
            user_id = EXCLUDED.user_id,
            created_at = CURRENT_TIMESTAMP
        `, [endpoint, p256dh, auth, cleanedRole, userId || null]);
        return { success: true, mode: "postgres" };
      } catch (err: any) {
        console.error("[WEB-PUSH DB ERROR] Failed to upsert subscription in PostgreSQL:", err.message);
        // Fallback to in-memory on DB error
      }
    }
  }

  // Memory fallback
  // Remove existing with same endpoint
  inMemorySubscriptions = inMemorySubscriptions.filter(s => s.endpoint !== endpoint);
  
  // Add new
  inMemorySubscriptions.push({
    endpoint,
    p256dh,
    auth,
    role: cleanedRole,
    userId: userId || null,
    createdAt: new Date().toISOString()
  });

  return { success: true, mode: "memory" };
}

/**
 * Removes a subscription from PostgreSQL or in-memory list (used when push fails with 404/410).
 */
export async function removeSubscription(endpoint: string) {
  console.log(`[WEB-PUSH] Pruning inactive or expired subscription: ${endpoint.substring(0, 45)}...`);
  
  const isPg = getIsPgConnected();
  if (isPg) {
    const pool = getPgPool();
    if (pool) {
      try {
        await pool.query("DELETE FROM push_subscriptions WHERE endpoint = $1", [endpoint]);
        return;
      } catch (err: any) {
        console.error("[WEB-PUSH DB ERROR] Failed to delete subscription from PostgreSQL:", err.message);
      }
    }
  }

  inMemorySubscriptions = inMemorySubscriptions.filter(s => s.endpoint !== endpoint);
}

/**
 * Fetches all subscriptions, optionally filtered by role ('rider' or 'driver').
 */
export async function getSubscriptions(role?: string) {
  const isPg = getIsPgConnected();
  const filterRole = role ? role.toLowerCase() : null;

  if (isPg) {
    const pool = getPgPool();
    if (pool) {
      try {
        let query = "SELECT * FROM push_subscriptions";
        let params: any[] = [];
        
        if (filterRole) {
          query += " WHERE role = $1";
          params.push(filterRole);
        }
        
        const res = await pool.query(query, params);
        return res.rows.map(row => ({
          endpoint: row.endpoint,
          keys: {
            p256dh: row.p256dh,
            auth: row.auth
          },
          role: row.role,
          userId: row.user_id
        }));
      } catch (err: any) {
        console.error("[WEB-PUSH DB ERROR] Failed to fetch subscriptions from PostgreSQL:", err.message);
        // Fallback to in-memory on DB error
      }
    }
  }

  // Memory fallback filtering
  let filtered = inMemorySubscriptions;
  if (filterRole) {
    filtered = inMemorySubscriptions.filter(s => s.role === filterRole);
  }

  return filtered.map(s => ({
    endpoint: s.endpoint,
    keys: {
      p256dh: s.p256dh,
      auth: s.auth
    },
    role: s.role,
    userId: s.userId
  }));
}

/**
 * Sends a single web push notification payload.
 * If endpoint returns 404 or 410, automatically deletes the expired subscription.
 */
export async function sendNotificationToSubscription(subscription: any, payload: any) {
  ensureVapidConfigured();

  const pushSub = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.keys?.p256dh,
      auth: subscription.keys?.auth
    }
  };

  try {
    const payloadStr = JSON.stringify(payload);
    await webpush.sendNotification(pushSub, payloadStr, {
      TTL: 86400, // 1 day in seconds
      urgency: "high",
      headers: {
        Urgency: "high"
      }
    });
    return { success: true };
  } catch (err: any) {
    // If the browser subscription is expired, inactive or unsubscribed, remove it
    if (err.statusCode === 404 || err.statusCode === 410) {
      await removeSubscription(subscription.endpoint);
      return { success: false, reason: "expired", statusCode: err.statusCode };
    }
    console.error(`[WEB-PUSH ERROR] Push delivery failed for endpoint: ${subscription.endpoint.substring(0, 45)}... Error:`, err.message);
    return { success: false, reason: err.message, statusCode: err.statusCode };
  }
}

/**
 * Sends a native push notification to a specific user by their user ID.
 * This is perfect for ride status updates like "Ride Accepted" or "Driver Arrived"
 * and will display on the lock screen even if the PWA app is closed.
 */
export async function sendNotificationToUser(
  userId: string,
  payload: {
    title: string;
    body: string;
    url?: string;
    image?: string;
    actionLabel?: string;
    actionUrl?: string;
  }
) {
  ensureVapidConfigured();
  
  // Find subscriptions matching this userId
  const isPg = getIsPgConnected();
  let userSubscriptions: any[] = [];
  
  if (isPg) {
    const pool = getPgPool();
    if (pool) {
      try {
        const res = await pool.query(
          "SELECT * FROM push_subscriptions WHERE user_id = $1", 
          [userId]
        );
        userSubscriptions = res.rows.map(row => ({
          endpoint: row.endpoint,
          keys: {
            p256dh: row.p256dh,
            auth: row.auth
          },
          role: row.role,
          userId: row.user_id
        }));
      } catch (err: any) {
        console.error("[WEB-PUSH DB ERROR] Failed to fetch user subscriptions:", err.message);
      }
    }
  }
  
  // If no direct matching subscription found, fallback to role-based matching
  if (userSubscriptions.length === 0) {
    const isDriverTarget = userId.toLowerCase().includes("driver") || userId.startsWith("DRV") || userId === "guest_driver";
    const isRiderTarget = userId.toLowerCase().includes("rider") || userId.startsWith("RID") || userId === "guest_rider";

    userSubscriptions = inMemorySubscriptions
      .filter(s => {
        if (s.userId === userId) return true;
        if (isDriverTarget && (s.role === "Drivers" || s.userId === "guest_driver" || s.userId?.includes("driver"))) return true;
        if (isRiderTarget && (s.role === "Riders" || s.userId === "guest_rider" || s.userId?.includes("rider"))) return true;
        return false;
      })
      .map(s => ({
        endpoint: s.endpoint,
        keys: {
          p256dh: s.p256dh,
          auth: s.auth
        },
        role: s.role,
        userId: s.userId
      }));
  }

  console.log(`[WEB-PUSH] Sending direct user push to ${userId} (${userSubscriptions.length} subscriptions)...`);

  // Check engine toggles
  const pushSettings = globalConfig?.pushSettings || {};
  const vapidEnabled = pushSettings.vapidEnabled !== false;

  // ALWAYS emit real-time WebSocket event so open browser tabs and PWAs receive instant live notifications (< 20ms)
  const notifId = `push-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  if (globalIo) {
    console.log(`[WEB-PUSH SOCKET] Emitting real-time direct user notification to user_${userId}`);
    const socketEventData = {
      id: notifId,
      userId,
      target: "Direct",
      title: payload.title,
      body: payload.body,
      url: payload.url || "/",
      image: payload.image,
      actionLabel: payload.actionLabel,
      actionUrl: payload.actionUrl,
      sentAt: new Date().toISOString()
    };
    globalIo.to(`user_${userId}`).emit("push_notification_event", socketEventData);
  }

  let sent = 0;

  // Send via Standard VAPID Web Push if enabled
  if (vapidEnabled && userSubscriptions.length > 0) {
    console.log(`[PUSH ENGINE] Dispatching direct push via Standard VAPID Web Push Engine (${userSubscriptions.length} endpoints)...`);
    const pushPayload = {
      notification: {
        id: notifId,
        tag: notifId,
        title: payload.title,
        body: payload.body,
        icon: "/uploads/pwa_icon_192.png",
        badge: "/uploads/pwa_icon_192.png",
        image: payload.image || undefined,
        vibrate: [100, 50, 100],
        data: {
          id: notifId,
          url: payload.url || "/",
          actionUrl: payload.actionUrl || payload.url || "/"
        },
        actions: payload.actionLabel ? [
          {
            action: "primary_action",
            title: payload.actionLabel,
            icon: "/uploads/pwa_icon_192.png"
          }
        ] : undefined
      }
    };

    for (const sub of userSubscriptions) {
      const res = await sendNotificationToSubscription(sub, pushPayload);
      if (res.success) sent++;
    }
  }

  return { success: sent > 0, totalSent: sent };
}

/**
 * Broadcasts a custom native push notification payload to targeted user segments.
 * Payload includes title, body, action buttons, image, etc.
 */
export async function broadcastNotification(
  target: "Riders" | "Drivers" | "All", 
  payload: {
    title: string;
    body: string;
    url?: string;
    image?: string;
    actionLabel?: string;
    actionUrl?: string;
    isPopupModal?: boolean;
    isInstallPrompt?: boolean;
    includeSenderTag?: boolean;
    customSenderTag?: string;
  }
) {
  ensureVapidConfigured();

  let targetRole: string | undefined;
  if (target === "Riders") targetRole = "rider";
  else if (target === "Drivers") targetRole = "driver";

  const subscriptions = await getSubscriptions(targetRole);
  console.log(`[WEB-PUSH] Broadcasting to segment "${target}" (${subscriptions.length} active browser/PWA subscriptions)...`);

  const pushSettings = globalConfig?.pushSettings || {};
  const vapidEnabled = pushSettings.vapidEnabled !== false;

  const broadcastNotifId = `push-bc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // ALWAYS emit real-time WebSocket event so open web browser tabs & PWAs receive instant live notifications (< 20ms)
  if (globalIo) {
    console.log(`[WEB-PUSH SOCKET] Emitting real-time broadcast notification to segment ${target}`);
    globalIo.emit("push_notification_event", {
      id: broadcastNotifId,
      target,
      title: payload.title,
      body: payload.body,
      url: payload.url || "/",
      image: payload.image,
      actionLabel: payload.actionLabel,
      actionUrl: payload.actionUrl,
      isPopupModal: payload.isPopupModal,
      isInstallPrompt: payload.isInstallPrompt,
      sentAt: new Date().toISOString()
    });
  }

  let totalSent = 0;
  let totalFailed = 0;

  // Dispatch via Standard VAPID Web Push Engine if active
  if (vapidEnabled && subscriptions.length > 0) {
    console.log(`[PUSH BROADCAST VAPID] Sending via Standard VAPID Web Push Engine to ${subscriptions.length} endpoints...`);
    const pushPayload = {
      notification: {
        id: broadcastNotifId,
        tag: broadcastNotifId,
        title: payload.title,
        body: payload.body,
        icon: "/uploads/pwa_icon_192.png", // app icon
        badge: "/uploads/pwa_icon_192.png",
        image: payload.image || undefined, // large campaign/promotion image
        vibrate: [100, 50, 100],
        data: {
          id: broadcastNotifId,
          url: payload.url || "/", // Default navigation URL
          click_action: payload.url || "/",
          actionUrl: payload.actionUrl || payload.url || "/",
        },
        actions: payload.actionLabel ? [
          {
            action: "primary_action",
            title: payload.actionLabel,
            icon: "/uploads/pwa_icon_192.png" // launch/explore icon
          }
        ] : undefined
      }
    };

    const results = await Promise.allSettled(
      subscriptions.map(sub => sendNotificationToSubscription(sub, pushPayload))
    );

    results.forEach(res => {
      if (res.status === "fulfilled" && res.value.success) {
        totalSent++;
      } else {
        totalFailed++;
      }
    });
  }

  console.log(`[WEB-PUSH] Broadcast finished. Total Delivered: ${totalSent}, Failed: ${totalFailed}.`);
  return { totalSent, totalFailed, vapidEnabled };
}
