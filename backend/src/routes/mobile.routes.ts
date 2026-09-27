import { Router } from "express";
import path from "path";
import fs from "fs";
import JSZip from "jszip";

const router = Router();

router.get("/info", (req, res) => {
  const androidAppPath = path.join(process.cwd(), "capacitor", "android", "app");
  const hasDebugKeystore = fs.existsSync(path.join(androidAppPath, "debug.keystore"));
  const hasReleaseKeystore = fs.existsSync(path.join(androidAppPath, "taxiappuser.jks"));
  
  const debugApkPath = path.join(androidAppPath, "build", "outputs", "apk", "debug", "app-debug.apk");
  const releaseApkPath = path.join(androidAppPath, "build", "outputs", "apk", "release", "app-release.apk");

  res.json({
    appName: "TaxiApp",
    namespace: "com.taxiapp.users",
    applicationId: "com.taxiapp.users",
    versionCode: 1,
    versionName: "2.0.4",
    multiDexEnabled: true,
    platform: "Android (Capacitor 7.x / 8.x)",
    signingConfigs: {
      debug: {
        storeFile: "debug.keystore",
        storePassword: "••••••• (android)",
        keyAlias: "androiddebugkey",
        keyPassword: "••••••• (android)",
        exists: hasDebugKeystore,
      },
      release: {
        storeFile: "taxiappuser.jks",
        storePassword: "•••••••••••• (Taxiapp@1013)",
        keyAlias: "taxiappuser",
        keyPassword: "•••••••••••• (Taxiapp@1013)",
        exists: hasReleaseKeystore,
      },
    },
    apks: {
      debugAvailable: fs.existsSync(debugApkPath),
      releaseAvailable: fs.existsSync(releaseApkPath),
      debugDownloadUrl: "/api/mobile/download-apk/debug",
      releaseDownloadUrl: "/api/mobile/download-apk/release",
      projectZipUrl: "/api/mobile/download-zip",
    },
    googlePlayRequirements: {
      targetSdk: 34,
      compileSdk: 34,
      minSdk: 22,
      appBundleSupported: true,
      googlePlayConsoleReady: true,
    },
  });
});

// Download full Capacitor project as a zip
router.get("/download-zip", async (req, res) => {
  try {
    const zip = new JSZip();
    const capacitorDir = path.join(process.cwd(), "capacitor");

    function addDirectoryToZip(dirPath: string, zipFolder: JSZip) {
      const items = fs.readdirSync(dirPath);
      for (const item of items) {
        // Skip heavy build caches and node_modules
        if (
          item === "node_modules" ||
          item === ".gradle" ||
          item === "build" ||
          item === ".DS_Store"
        ) {
          continue;
        }

        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const subFolder = zipFolder.folder(item);
          if (subFolder) {
            addDirectoryToZip(fullPath, subFolder);
          }
        } else {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(item, content);
        }
      }
    }

    if (fs.existsSync(capacitorDir)) {
      addDirectoryToZip(capacitorDir, zip);
    }

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="taxiapp-capacitor-mobile-v2.0.4.zip"'
    );
    res.send(zipBuffer);
  } catch (error: any) {
    console.error("Error generating mobile project zip:", error);
    res.status(500).json({ error: "Failed to generate zip file", details: error.message });
  }
});

// Download compiled APK
router.get("/download-apk/:type", async (req, res) => {
  const type = req.params.type === "release" ? "release" : "debug";
  const androidAppPath = path.join(process.cwd(), "capacitor", "android", "app");
  const apkPath = path.join(
    androidAppPath,
    "build",
    "outputs",
    "apk",
    type,
    `app-${type}.apk`
  );
  const permanentApkPath = path.join(
    process.cwd(),
    "capacitor",
    "apks",
    `taxiapp-v2.0.4-${type}.apk`
  );
  const publicApkPath = path.join(
    process.cwd(),
    "frontend",
    "public",
    "downloads",
    `taxiapp-v2.0.4-${type}.apk`
  );

  // Check if an external direct download URL was configured by admin
  try {
    const configPath = path.join(process.cwd(), "config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      const customApkUrl = config.general?.apkDownloadUrl || config.pwa?.apkDownloadUrl || config.pwa?.apkUrl;
      if (customApkUrl && typeof customApkUrl === "string" && customApkUrl.startsWith("http")) {
        return res.redirect(customApkUrl);
      }
    }
  } catch (err) {
    console.warn("Failed to check custom APK URL from config:", err);
  }

  // Possible valid APK paths on disk
  const candidatePaths = [
    apkPath,
    permanentApkPath,
    publicApkPath,
    path.join(process.cwd(), "dist", "mobile", `taxiapp-v2.0.4-${type}.apk`),
    path.join(process.cwd(), "dist", "mobile", "taxiapp-release.apk")
  ];

  let finalPath: string | null = null;
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      const stats = fs.statSync(p);
      // Valid compiled Android APKs are at least 1MB
      if (stats.size > 500 * 1024) {
        finalPath = p;
        break;
      }
    }
  }

  // If no valid compiled APK exists yet on the server
  if (!finalPath) {
    // Return a clean, mobile-responsive guidance page instead of a corrupt 7KB file that causes parse errors
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Install TaxiApp on Android</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
          body { background: #0f172a; color: #f8fafc; padding: 24px 16px; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; max-width: 480px; width: 100%; padding: 28px 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
          .badge { display: inline-block; background: #f59e0b; color: #000; font-weight: 800; font-size: 11px; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; margin-bottom: 16px; letter-spacing: 0.05em; }
          h1 { font-size: 22px; font-weight: 800; margin-bottom: 8px; color: #ffffff; }
          p { font-size: 14px; color: #94a3b8; line-height: 1.5; margin-bottom: 20px; }
          .step-box { background: #0f172a; border: 1px solid #334155; border-radius: 14px; padding: 16px; margin-bottom: 16px; }
          .step-title { font-weight: 700; font-size: 14px; color: #38bdf8; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
          .step-desc { font-size: 13px; color: #cbd5e1; line-height: 1.4; }
          .btn-primary { display: block; width: 100%; text-align: center; background: #10b981; hover:background: #059669; color: #ffffff; font-weight: 700; font-size: 15px; padding: 14px; border-radius: 12px; text-decoration: none; margin-top: 20px; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3); }
          .btn-secondary { display: block; width: 100%; text-align: center; background: transparent; border: 1px solid #475569; color: #cbd5e1; font-weight: 600; font-size: 13px; padding: 12px; border-radius: 12px; text-decoration: none; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">Official Android Setup</span>
          <h1>Install TaxiApp</h1>
          <p>You can run TaxiApp directly on your Android phone as a native app in two ways:</p>
          
          <div class="step-box">
            <div class="step-title">⚡ Instant Method: Install as PWA (Recommended)</div>
            <div class="step-desc">
              1. Tap the three dots (<strong>⋮</strong>) in the top-right corner of Chrome.<br>
              2. Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.<br>
              3. The official TaxiApp icon will be added to your phone's home screen with zero APK signing errors!
            </div>
          </div>

          <div class="step-box">
            <div class="step-title">📦 Compiled APK via GitHub Actions</div>
            <div class="step-desc">
              The automated build pipeline compiles the signed release APK using Android SDK & Gradle. You can download the latest compiled APK directly from GitHub Actions artifacts or releases.
            </div>
          </div>

          <a href="/" class="btn-primary">Open TaxiApp Web App</a>
          <a href="https://github.com/taxiappin/taxiappin/actions" target="_blank" class="btn-secondary">View GitHub Actions APK Builds</a>
        </div>
      </body>
      </html>
    `);
  }

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="taxiapp-${type}-v2.0.4.apk"`
  );
  res.setHeader("Content-Type", "application/vnd.android.package-archive");
  res.sendFile(finalPath);
});

export default router;
