import { Request, Response } from "express";
import { 
  getVapidKeys, 
  saveSubscription, 
  broadcastNotification 
} from "../services/webPushService";
import { globalConfig, saveConfig } from "../models/db";

/**
 * Retrieves current push notification settings and engine status.
 */
export function getPushSettingsHandler(req: Request, res: Response) {
  try {
    const pushSettings = globalConfig?.pushSettings || {};

    const settings = {
      vapidEnabled: pushSettings.vapidEnabled !== false,
      publicKey: getVapidKeys().publicKey
    };

    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to load push settings", details: err.message });
  }
}

/**
 * Saves push notification configuration and engine toggles.
 */
export function savePushSettingsHandler(req: Request, res: Response) {
  try {
    const { 
      vapidEnabled
    } = req.body;

    const updatedPushSettings = {
      vapidEnabled: vapidEnabled !== false
    };

    const updatedConfig = {
      ...globalConfig,
      pushSettings: updatedPushSettings
    };

    saveConfig(updatedConfig);

    res.json({
      success: true,
      message: "Push Notification Settings updated successfully!",
      settings: updatedPushSettings
    });
  } catch (err: any) {
    console.error("[PUSH SETTINGS ERROR] Failed to save push settings:", err.message);
    res.status(500).json({ error: "Failed to save push settings", details: err.message });
  }
}

/**
 * Retrieves the public VAPID key to let browser clients subscribe to push events.
 */
export function getVapidKeyHandler(req: Request, res: Response) {
  try {
    const keys = getVapidKeys();
    res.json({ publicKey: keys.publicKey });
  } catch (err: any) {
    console.error("[PUSH CONTROLLER ERROR] Failed to retrieve VAPID key:", err.message);
    res.status(500).json({ error: "Failed to load VAPID keys", details: err.message });
  }
}

/**
 * Subscribes a user's browser/device to Web Push notifications.
 */
export async function subscribeHandler(req: Request, res: Response) {
  const { subscription, role, userId } = req.body;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: "A valid push subscription object is required." });
  }

  if (!role || !["rider", "driver"].includes(role.toLowerCase())) {
    return res.status(400).json({ error: "A valid role ('rider' or 'driver') is required." });
  }

  try {
    const result = await saveSubscription(subscription, role, userId);
    res.status(201).json({ 
      success: true, 
      message: "Subscription stored successfully.", 
      mode: result.mode
    });
  } catch (err: any) {
    console.error("[PUSH CONTROLLER ERROR] Subscription save failed:", err.message);
    res.status(500).json({ error: "Failed to store push subscription.", details: err.message });
  }
}

/**
 * Broadcasts a custom web push notification to a segment of subscribers.
 */
export async function sendNotificationHandler(req: Request, res: Response) {
  const { target, title, body, url, image, actionLabel, actionUrl, isPopupModal, isInstallPrompt, includeSenderTag, customSenderTag } = req.body;

  if (!target || !["Riders", "Drivers", "All", "OutdatedPwa"].includes(target)) {
    return res.status(400).json({ error: "A valid target segment ('Riders', 'Drivers', 'All', or 'OutdatedPwa') is required." });
  }

  if (!title || !body) {
    return res.status(400).json({ error: "Notification title and body are required." });
  }

  try {
    console.log(`[PUSH BROADCAST] Target: ${target} | Title: "${title}"`);

    const stats = await broadcastNotification(target === "OutdatedPwa" ? "All" : target, {
      title,
      body,
      url,
      image,
      actionLabel,
      actionUrl,
      isPopupModal,
      isInstallPrompt,
      includeSenderTag,
      customSenderTag
    });

    res.json({
      success: true,
      message: `Successfully sent push notification to segment ${target}.`,
      stats
    });
  } catch (err: any) {
    console.error("[PUSH CONTROLLER ERROR] Notification broadcast failed:", err.message);
    res.status(500).json({ error: "Failed to broadcast notifications.", details: err.message });
  }
}

/**
 * Sends a push notification directly to a single device subscription for debugging.
 */
export async function testSingleHandler(req: Request, res: Response) {
  const { subscription, title, body, url, image, actionLabel, actionUrl } = req.body;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: "A valid subscription object is required." });
  }

  try {
    const { sendNotificationToSubscription } = await import("../services/webPushService");
    
    const payload = {
      notification: {
        title: title || "Test Alert 🚀",
        body: body || "Your single-device real-time push test is successful!",
        icon: "https://cdn-icons-png.flaticon.com/512/3082/3082331.png",
        badge: "https://cdn-icons-png.flaticon.com/512/3082/3082331.png",
        image: image || undefined,
        vibrate: [100, 50, 100],
        data: {
          url: url || "/",
          actionUrl: actionUrl || url || "/"
        },
        actions: actionLabel ? [
          {
            action: "primary_action",
            title: actionLabel,
            icon: "https://cdn-icons-png.flaticon.com/512/3106/3106857.png"
          }
        ] : undefined
      }
    };

    console.log("[WEB-PUSH] Triggering single-device direct test push...");
    const result = await sendNotificationToSubscription(subscription, payload);
    
    const io = req.app.get("io");
    if (io) {
      io.emit("push_notification_event", {
        id: `test-single-${Date.now()}`,
        target: "All",
        title: title || "Test Alert 🚀",
        body: body || "Your single-device real-time push test is successful!",
        url: url || "/",
        image,
        actionLabel,
        actionUrl,
        sentAt: new Date().toISOString()
      });
    }

    res.json({
      success: result.success,
      result
    });
  } catch (err: any) {
    console.error("[PUSH CONTROLLER ERROR] Direct single test push failed:", err.message);
    res.status(500).json({ error: "Failed to send single test notification.", details: err.message });
  }
}

