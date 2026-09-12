import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import authRoutes from "./src/routes/auth.routes";
import adminRoutes from "./src/routes/admin.routes";
import tripRoutes from "./src/routes/trip.routes";
import rideRoutes from "./src/routes/ride.routes";
import walletRoutes from "./src/routes/wallet.routes";
import pushRoutes from "./src/routes/push.routes";

export async function createApp() {
  const app = express();

  // Observability Logger for API endpoints
  app.use((req, res, next) => {
    if (req.url.startsWith("/api/")) {
      console.log(`[API] ${req.method} ${req.url}`);
    }
    next();
  });

  // Body parsers
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ limit: "20mb", extended: true }));
  app.use(cors());

  // Performance & Edge Caching Header Middleware
  app.use((req, res, next) => {
    const url = req.url;
    // Static assets & images: Aggressive 1-year browser & CDN caching
    if (url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?|ttf|eot)(\?.*)?$/) || url.startsWith("/uploads/") || url.startsWith("/assets/")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("X-Content-Type-Options", "nosniff");
    } else if (url.startsWith("/api/")) {
      // Dynamic API responses: prevent stale caching with strict revalidation
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    } else {
      // HTML Page routes: Ensure instantaneous revalidation & zero stale caching across updates
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }
    next();
  });

  // Dynamic SEO Robots.txt route
  app.get("/robots.txt", (req, res) => {
    const host = req.get("host") || "ais-dev-krtm3i6kzfw4zaaaf5sqea-386217356005.asia-southeast1.run.app";
    const protocol = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const sitemapUrl = `${protocol}://${host}/sitemap.xml`;

    const robotsTxt = `# TaxiApp Production Automated Crawling Directive
User-agent: *
Allow: /
Allow: /book
Allow: /driver
Allow: /blogs
Allow: /faqs
Allow: /safety

Disallow: /admin
Disallow: /api/
Disallow: /uploads/private/

# XML Sitemap Index
Sitemap: ${sitemapUrl}
`;
    res.setHeader("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // Dynamic SEO Sitemap.xml route
  app.get("/sitemap.xml", (req, res) => {
    const host = req.get("host") || "ais-dev-krtm3i6kzfw4zaaaf5sqea-386217356005.asia-southeast1.run.app";
    const protocol = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;
    const today = new Date().toISOString().split("T")[0];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/book</loc>
    <lastmod>${today}</lastmod>
    <changefreq>always</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/driver</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/faqs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/safety</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.send(sitemapXml);
  });

  // Static assets configuration (uploads)
  const uploadsDir = path.join(process.cwd(), "frontend", "public", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const distUploadsDir = path.join(process.cwd(), "dist", "uploads");

  app.use("/uploads", express.static(uploadsDir));
  app.use("/uploads", express.static(distUploadsDir));

  // Health endpoint first
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API Routes mount
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/push", pushRoutes);
  app.use("/api/rides", rideRoutes);
  app.use("/api/wallet", walletRoutes);
  app.use("/api", tripRoutes);

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(`[SERVER ERROR] ${err.stack || err}`);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  });

  // Catch unmatched API requests with 404 JSON instead of falling through to SPA HTML
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API route not found", path: req.originalUrl });
  });

  // Vite Single Page Application middleware handling
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: path.resolve(process.cwd(), "frontend"),
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}
