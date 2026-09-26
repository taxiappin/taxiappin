# TaxiApp Android Mobile Application (Capacitor)

This folder contains the complete, standalone Capacitor-powered mobile wrapper that turns the TaxiApp web platform into a native Android app (`.apk` and `.aab`).

---

## App Configuration & Metadata

- **Application ID / Namespace:** `com.taxiapp.users`
- **Version Code:** `1`
- **Version Name:** `2.0.4`
- **MultiDex:** `true`
- **Target SDK:** `34` (Android 14)
- **Minimum SDK:** `22` (Android 5.1)
- **Compile SDK:** `34`

---

## Signing Configurations

### Debug Signing
- **Keystore:** `capacitor/android/app/debug.keystore`
- **Store Password:** `android`
- **Key Alias:** `androiddebugkey`
- **Key Password:** `android`

### Release Signing (Google Play Console)
- **Keystore:** `capacitor/android/app/taxiappuser.jks`
- **Store Password:** `Taxiapp@1013`
- **Key Alias:** `taxiappuser`
- **Key Password:** `Taxiapp@1013`

Both keystores are pre-configured in `capacitor/android/app/build.gradle` inside the `signingConfigs` block.

---

## How to Build the Mobile App

### Method 1: Using the Automated Build Script
From the project root directory, simply run:
```bash
./capacitor/build-apk.sh
```
This builds both `taxiapp-v2.0.4-release.apk` and `taxiapp-v2.0.4-debug.apk` and outputs them into `dist/mobile/`.

### Method 2: Using Gradle Wrapper Directly
```bash
# Build Signed Release APK
./capacitor/android/gradlew -p capacitor/android assembleRelease

# Build Google Play Bundle (.aab) for Google Play Console upload
./capacitor/android/gradlew -p capacitor/android bundleRelease

# Build Debug APK
./capacitor/android/gradlew -p capacitor/android assembleDebug
```

### Method 3: In Android Studio
1. Open **Android Studio**.
2. Click **Open** and select the folder: `capacitor/android`.
3. Wait for Gradle to sync.
4. Go to **Build** > **Generate Signed Bundle / APK**.
5. Select **Android App Bundle** (for Google Play Console) or **APK** (for testing).
6. The keystore `taxiappuser.jks` is located in `app/taxiappuser.jks`. Enter password `Taxiapp@1013` and alias `taxiappuser`.

---

## Updating Web Assets in the Android App
Whenever you change the web application code:
1. Build the production web assets: `npm run build`
2. Sync into the Android container: `npx cap copy android`
3. Rebuild the APK / App Bundle.

---

## Google Play Console Upload Checklist
1. Generate the Release Bundle: `./capacitor/android/gradlew -p capacitor/android bundleRelease`
2. Output file will be located at:
   `capacitor/android/app/build/outputs/bundle/release/app-release.aab`
3. Go to [Google Play Console](https://play.google.com/console).
4. Select your app: `com.taxiapp.users`.
5. Under **Production** > **Create new release**, upload `app-release.aab`.
6. Enter release notes for version `2.0.4` and roll out!
