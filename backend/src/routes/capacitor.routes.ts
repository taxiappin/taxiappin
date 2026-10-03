import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

export const capacitorRouter = Router();

const ROOT_DIR = process.cwd();
const MOBILE_DIR = path.join(ROOT_DIR, 'mobile-packages');
const BINARIES_DIR = path.join(MOBILE_DIR, 'generated-binaries');
const METADATA_FILE = path.join(BINARIES_DIR, 'metadata.json');

/**
 * Helper to recursively add a directory to a JSZip instance
 */
function addDirectoryToZip(zip: JSZip, localDir: string, zipPrefix: string = '') {
  if (!fs.existsSync(localDir)) return;
  const items = fs.readdirSync(localDir);
  for (const item of items) {
    const fullPath = path.join(localDir, item);
    const stat = fs.statSync(fullPath);
    const zipPath = zipPrefix ? `${zipPrefix}/${item}` : item;

    // Skip huge generated binaries from source zip to keep project zip download fast and light (~1-2MB)
    if (item === 'generated-binaries' || item === 'node_modules' || item.endsWith('.apk') || item.endsWith('.aab')) {
      continue;
    }

    if (stat.isDirectory()) {
      addDirectoryToZip(zip, fullPath, zipPath);
    } else {
      zip.file(zipPath, fs.readFileSync(fullPath));
    }
  }
}

/**
 * GET /api/capacitor/status
 * Returns mobile packages metadata, generated APK/AAB details, and environment capabilities
 */
capacitorRouter.get('/status', (req: Request, res: Response) => {
  try {
    let metadata: any = {
      appId: "com.taxiapp.users",
      appName: "TaxiApp",
      version: "2.5.0",
      versionCode: 25,
      targetSdk: 34,
      minSdk: 23,
      iosDeploymentTarget: "15.0",
      binaries: []
    };

    if (fs.existsSync(METADATA_FILE)) {
      try {
        metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf-8'));
      } catch (err) {
        console.error("Failed to parse mobile metadata.json:", err);
      }
    }

    // Check actual files on disk
    const filesOnDisk = fs.existsSync(BINARIES_DIR) ? fs.readdirSync(BINARIES_DIR) : [];
    const enrichedBinaries = (metadata.binaries || []).map((b: any) => {
      const filePath = path.join(BINARIES_DIR, b.fileName);
      const exists = fs.existsSync(filePath);
      let sizeBytes = b.sizeBytes || 0;
      let mtime = null;

      if (exists) {
        const stat = fs.statSync(filePath);
        sizeBytes = stat.size;
        mtime = stat.mtime;
      }

      return {
        ...b,
        exists,
        sizeBytes,
        sizeMb: (sizeBytes / (1024 * 1024)).toFixed(2),
        lastModified: mtime ? mtime.toISOString() : null,
        downloadUrl: `/api/capacitor/download/${b.id}`
      };
    });

    res.json({
      success: true,
      appId: metadata.appId || "com.taxiapp.users",
      appName: metadata.appName || "TaxiApp",
      version: metadata.version || "2.5.0",
      versionCode: metadata.versionCode || 25,
      targetSdk: metadata.targetSdk || 34,
      minSdk: metadata.minSdk || 23,
      iosDeploymentTarget: metadata.iosDeploymentTarget || "15.0",
      generatedAt: metadata.generatedAt || new Date().toISOString(),
      binaries: enrichedBinaries,
      isolation: {
        isSeparated: true,
        isolatedDirectory: "mobile-packages/",
        generatedBinariesDirectory: "mobile-packages/generated-binaries/",
        safeRemovalNote: "This module is completely isolated. Deleting mobile-packages/ and unmounting /api/capacitor leaves web & PWA 100% unaffected."
      },
      platforms: {
        android: {
          configured: fs.existsSync(path.join(MOBILE_DIR, 'android')),
          manifestExists: fs.existsSync(path.join(MOBILE_DIR, 'android', 'app', 'src', 'main', 'AndroidManifest.xml')),
          targetSdk: "34 (Android 14)",
          packageId: "com.taxiapp.users"
        },
        ios: {
          configured: fs.existsSync(path.join(MOBILE_DIR, 'ios')),
          plistExists: fs.existsSync(path.join(MOBILE_DIR, 'ios', 'App', 'App', 'Info.plist')),
          deploymentTarget: "iOS 15.0+",
          bundleId: "com.taxiapp.users"
        }
      }
    });
  } catch (error: any) {
    console.error("Error fetching capacitor status:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/capacitor/download/:binaryId
 * Downloads APK, AAB, or the full source project ZIP
 */
capacitorRouter.get('/download/:binaryId', async (req: Request, res: Response) => {
  try {
    const { binaryId } = req.params;

    // Handle full project source ZIP download
    if (binaryId === 'project-zip' || binaryId === 'source-zip') {
      const zip = new JSZip();
      
      // Add README and configuration
      if (fs.existsSync(MOBILE_DIR)) {
        addDirectoryToZip(zip, MOBILE_DIR, 'taxiapp-mobile');
      }

      // Add web manifest and icons for convenience
      const manifestPath = path.join(ROOT_DIR, 'frontend', 'public', 'manifest.webmanifest');
      if (fs.existsSync(manifestPath)) {
        zip.file('taxiapp-mobile/manifest.webmanifest', fs.readFileSync(manifestPath));
      }

      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="taxiapp-capacitor-mobile-v2.5.0.zip"');
      res.setHeader('Content-Length', zipBuffer.length);
      return res.end(zipBuffer);
    }

    // Determine target binary filename
    let targetFileName = '';
    let contentType = 'application/octet-stream';

    if (binaryId === 'release-apk') {
      targetFileName = 'taxiapp-v2.5.0-release.apk';
      contentType = 'application/vnd.android.package-archive';
    } else if (binaryId === 'debug-apk') {
      targetFileName = 'taxiapp-v2.5.0-debug.apk';
      contentType = 'application/vnd.android.package-archive';
    } else if (binaryId === 'release-aab') {
      targetFileName = 'taxiapp-v2.5.0-release.aab';
      contentType = 'application/octet-stream';
    } else {
      return res.status(404).json({ error: `Unknown binary identifier: ${binaryId}` });
    }

    const filePath = path.join(BINARIES_DIR, targetFileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `Binary file ${targetFileName} was not found in ${BINARIES_DIR}` });
    }

    const stat = fs.statSync(filePath);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${targetFileName}"`);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } catch (error: any) {
    console.error("Error downloading capacitor binary:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/capacitor/preview-file
 * Returns raw content of mobile configuration files for live inspection in admin desk
 */
capacitorRouter.get('/preview-file', (req: Request, res: Response) => {
  try {
    const fileKey = String(req.query.file || 'manifest');
    let targetPath = '';

    if (fileKey === 'manifest') {
      targetPath = path.join(MOBILE_DIR, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
    } else if (fileKey === 'config') {
      targetPath = path.join(MOBILE_DIR, 'capacitor.config.json');
    } else if (fileKey === 'ios-plist') {
      targetPath = path.join(MOBILE_DIR, 'ios', 'App', 'App', 'Info.plist');
    } else if (fileKey === 'gradle') {
      targetPath = path.join(MOBILE_DIR, 'android', 'app', 'build.gradle');
    } else if (fileKey === 'readme') {
      targetPath = path.join(MOBILE_DIR, 'README.md');
    }

    if (!targetPath || !fs.existsSync(targetPath)) {
      return res.status(404).json({ error: `File not found for key: ${fileKey}` });
    }

    const content = fs.readFileSync(targetPath, 'utf-8');
    res.json({ success: true, fileKey, content, path: path.relative(ROOT_DIR, targetPath) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
