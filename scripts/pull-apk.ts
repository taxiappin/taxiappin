import fs from "fs";
import path from "path";
import https from "https";
import JSZip from "jszip";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "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";
const REPO = "taxiappin/taxiappin";

async function fetchJson(url: string, headers: Record<string, string> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent": "TaxiApp-Builder",
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
            reject(new Error(`Failed to parse JSON response: ${data.slice(0, 200)}`));
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
          "User-Agent": "TaxiApp-Builder",
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/octet-stream",
          ...headers,
        },
      },
      (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Redirect may go to AWS S3 / Azure blob storage without Auth header
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

export async function pullLatestApk(): Promise<string | null> {
  console.log("Checking GitHub Releases & Artifacts for compiled TaxiApp APK...");
  const targetDir = path.join(process.cwd(), "dist", "mobile");
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  const finalApkPath = path.join(targetDir, "taxiapp-release.apk");

  // 1. Try fetching from Releases
  try {
    const releases = await fetchJson(`https://api.github.com/repos/${REPO}/releases`);
    if (Array.isArray(releases) && releases.length > 0) {
      for (const rel of releases) {
        const apkAsset = (rel.assets || []).find((a: any) =>
          a.name && (a.name.endsWith(".apk") || a.name === "taxiapp-release.apk")
        );
        if (apkAsset && apkAsset.url) {
          console.log(`Found release asset: ${apkAsset.name} (${apkAsset.size} bytes). Downloading...`);
          const buf = await downloadBuffer(apkAsset.url);
          if (buf.length > 500 * 1024) {
            fs.writeFileSync(finalApkPath, buf);
            console.log(`Successfully saved APK to ${finalApkPath} (${buf.length} bytes)!`);
            return finalApkPath;
          }
        }
      }
    }
  } catch (err: any) {
    console.warn("Release check failed:", err.message);
  }

  // 2. Try fetching from Artifacts
  try {
    const data = await fetchJson(`https://api.github.com/repos/${REPO}/actions/artifacts`);
    const artifacts = data.artifacts || [];
    const apkArtifact = artifacts.find(
      (a: any) => a.name === "TaxiApp-Release-APK" && !a.expired
    );

    if (apkArtifact && apkArtifact.archive_download_url) {
      console.log(`Found APK Artifact ID ${apkArtifact.id} (${apkArtifact.size_in_bytes} bytes). Downloading zip...`);
      const zipBuf = await downloadBuffer(apkArtifact.archive_download_url);
      const zip = await JSZip.loadAsync(zipBuf);
      const apkEntry = Object.values(zip.files).find((f) => f.name.endsWith(".apk"));
      if (apkEntry) {
        const apkBuf = await apkEntry.async("nodebuffer");
        fs.writeFileSync(finalApkPath, apkBuf);
        console.log(`Successfully extracted and saved APK to ${finalApkPath} (${apkBuf.length} bytes)!`);
        return finalApkPath;
      }
    }
  } catch (err: any) {
    console.warn("Artifact check failed:", err.message);
  }

  return null;
}

pullLatestApk().then((res) => {
  if (res) {
    console.log("APK pull completed successfully:", res);
    process.exit(0);
  } else {
    console.log("No compiled APK artifact/release found yet.");
    process.exit(1);
  }
}).catch((err) => {
  console.error("Error pulling APK:", err);
  process.exit(1);
});
