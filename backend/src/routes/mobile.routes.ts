import { Router } from "express";
import path from "path";
import fs from "fs";
import https from "https";
import JSZip from "jszip";

const router = Router();
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "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";
const REPO = "taxiappin/taxiappin";

async function fetchJson(url: string, headers: Record<string, string> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent": "TaxiApp-MobileServer",
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          ...headers,
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchJson(res.headers.location, headers).then(resolve).catch(reject);
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${data.slice(0, 100)}`));
          }
        });
      }
    ).on("error", reject);
  });
}

async function downloadBuffer(url: string, headers: Record<string, string> = {}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent": "TaxiApp-MobileServer",
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/octet-stream",
          ...headers,
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const nextUrl = res.headers.location;
          const nextHeaders = nextUrl.includes("github.com") ? headers : {};
          return downloadBuffer(nextUrl, nextHeaders).then(resolve).catch(reject);
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      }
    ).on("error", reject);
  });
}

async function tryFetchLatestApk(): Promise<string | null> {
  try {
    const targetDir = path.join(process.cwd(), "dist", "mobile");
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    const finalApkPath = path.join(targetDir, "taxiapp-release.apk");

    // 1. Check Releases
    try {
      const releases = await fetchJson(`https://api.github.com/repos/${REPO}/releases`);
      if (Array.isArray(releases) && releases.length > 0) {
        for (const rel of releases) {
          const apkAsset = (rel.assets || []).find((a: any) =>
            a.name && (a.name.endsWith(".apk") || a.name === "taxiapp-release.apk")
          );
          if (apkAsset && apkAsset.url) {
            const buf = await downloadBuffer(apkAsset.url);
            if (buf.length > 500 * 1024) {
              fs.writeFileSync(finalApkPath, buf);
              return finalApkPath;
            }
          }
        }
      }
    } catch (e) {
      console.warn("Auto-fetch release warning:", e);
    }

    // 2. Check Artifacts
    try {
      const data = await fetchJson(`https://api.github.com/repos/${REPO}/actions/artifacts`);
      const artifacts = data.artifacts || [];
      const apkArtifact = artifacts.find(
        (a: any) => a.name === "TaxiApp-Release-APK" && !a.expired
      );
      if (apkArtifact && apkArtifact.archive_download_url) {
        const zipBuf = await downloadBuffer(apkArtifact.archive_download_url);
        const zip = await JSZip.loadAsync(zipBuf);
        const apkEntry = Object.values(zip.files).find((f) => f.name.endsWith(".apk"));
        if (apkEntry) {
          const apkBuf = await apkEntry.async("nodebuffer");
          fs.writeFileSync(finalApkPath, apkBuf);
          return finalApkPath;
        }
      }
    } catch (e) {
      console.warn("Auto-fetch artifact warning:", e);
    }
  } catch (err) {
    console.error("tryFetchLatestApk error:", err);
  }
  return null;
}

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
      // Valid compiled Android APKs are at least 500KB
      if (stats.size > 500 * 1024) {
        finalPath = p;
        break;
      }
    }
  }

  // If not locally cached yet, attempt to fetch compiled APK automatically
  if (!finalPath) {
    const fetched = await tryFetchLatestApk();
    if (fetched && fs.existsSync(fetched)) {
      finalPath = fetched;
    }
  }

  // If APK is available on disk, stream it immediately as a direct download!
  if (finalPath && fs.existsSync(finalPath)) {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="taxiapp-release.apk"`
    );
    res.setHeader("Content-Type", "application/vnd.android.package-archive");
    return res.sendFile(finalPath);
  }

  // If still building, show a clean auto-refreshing downloading status page
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Downloading TaxiApp APK...</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        body { background: #0f172a; color: #f8fafc; padding: 24px 16px; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 24px; max-width: 440px; width: 100%; padding: 36px 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .spinner { width: 56px; height: 56px; border: 4px solid #334155; border-top-color: #f59e0b; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        h1 { font-size: 22px; font-weight: 800; margin-bottom: 12px; color: #ffffff; }
        p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px; }
        .btn-primary { display: block; width: 100%; background: #f59e0b; hover:background: #d97706; color: #000000; font-weight: 700; font-size: 15px; padding: 14px; border-radius: 14px; text-decoration: none; border: none; cursor: pointer; transition: all 0.2s; }
        .hint { font-size: 12px; color: #64748b; margin-top: 16px; }
      </style>
      <script>
        setTimeout(function() {
          window.location.reload();
        }, 5000);
      </script>
    </head>
    <body>
      <div class="card">
        <div class="spinner"></div>
        <h1>Preparing Your Download</h1>
        <p>The latest TaxiApp Android package is being prepared. Your download will start automatically in a moment...</p>
        <button onclick="window.location.reload()" class="btn-primary">Download Now</button>
        <div class="hint">Auto-refreshing in 5 seconds • Fully compatible with Android 8.0+</div>
      </div>
    </body>
    </html>
  `);
});

export default router;
