# TaxiApp - Capacitor Mobile Hub (Isolated Architecture)

This folder contains the complete, isolated mobile integration for generating:
- **Android APK** (Release Signed & Debug for testing and sideloading)
- **Android AAB** (Android App Bundle for Google Play Store release)
- **iOS Xcode Project Template** (For Apple App Store release)

---

## 🛡️ Zero-Disruption & Safe Removal Guarantee

This mobile architecture is completely decoupled from the web application:
- **100% Isolated**: The React web app, PWA service worker, and WebSocket server do not depend on this directory.
- **Easy Future Removal**: If you ever want to completely remove Capacitor without affecting any web or backend features:
  1. Delete this `mobile-packages` folder.
  2. Remove `backend/src/routes/capacitor.routes.ts` and its single router mount in `backend/app.ts`.
  3. Remove the `Capacitor` tab from `BackendAdmin.tsx`.
  That's it! The core web application, database, and PWA continue running smoothly.

---

## 📱 How to Build or Open Locally

### Android (Android Studio)
1. Download the Standalone Project ZIP from the Backend Admin `Capacitor Mobile Hub` page.
2. Open `mobile-packages/android` in **Android Studio**.
3. Click **Run ▶** to test on an emulator/connected device, or go to **Build > Generate Signed Bundle / APK** to export an `.aab` or `.apk`.

### iOS (Xcode on macOS)
1. Open `mobile-packages/ios/App` in **Xcode**.
2. Select your Apple Developer Team in **Signing & Capabilities**.
3. Choose your iOS simulator or physical iPhone, and press **Run (Cmd + R)**.
