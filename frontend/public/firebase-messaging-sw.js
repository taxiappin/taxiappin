// Scripts for Firebase and Firebase Messaging
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// Initialize Firebase app in the Service Worker using the provided config
firebase.initializeApp({
  apiKey: "AIzaSyDv-yvl14rUgyunBX2tBS9tQXvUC_JU1q4",
  authDomain: "taxiappwebsite.firebaseapp.com",
  projectId: "taxiappwebsite",
  storageBucket: "taxiappwebsite.firebasestorage.app",
  messagingSenderId: "32855624240",
  appId: "1:32855624240:web:7f7073ff421952cbecbbf5",
  measurementId: "G-BHERTJVM9W"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("[firebase-messaging-sw.js] Received background message: ", payload);

  const title = payload.notification?.title || payload.data?.title || "TaxiApp Update 🚀";
  const body = payload.notification?.body || payload.data?.body || "You have a new update.";
  const icon = payload.notification?.icon || payload.data?.icon || "/pwa_icon_192.png";
  const badge = "/pwa_icon_192.png";

  const notificationOptions = {
    body: body,
    icon: icon,
    badge: badge,
    vibrate: [300, 100, 300, 100, 300],
    tag: payload.data?.tag || `taxiapp-fcm-${Date.now()}`,
    renotify: true,
    requireInteraction: true,
    data: {
      url: payload.data?.url || payload.data?.actionUrl || "/",
      ...payload.data
    }
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(windowClients) {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
