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
router.get("/download-apk/:type", (req, res) => {
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
  const distApkPath = path.join(
    process.cwd(),
    "dist",
    "mobile",
    `taxiapp-v2.0.4-${type}.apk`
  );

  const finalPath = fs.existsSync(apkPath) ? apkPath : fs.existsSync(distApkPath) ? distApkPath : null;

  if (!finalPath) {
    return res.status(404).json({
      error: `APK for ${type} is not yet built. Please build it first using the Mobile App Build tool or download the full project zip.`,
    });
  }

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="taxiapp-${type}-v2.0.4.apk"`
  );
  res.setHeader("Content-Type", "application/vnd.android.package-archive");
  res.sendFile(finalPath);
});

export default router;
