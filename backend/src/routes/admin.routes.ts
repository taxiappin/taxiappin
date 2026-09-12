import { Router } from "express";
import { 
  getAdminConfig, 
  saveAdminConfig, 
  uploadVehicleImage,
  freezeVehicles,
  testSmtpSettings,
  getActiveMailOtps,
  getRiders,
  createRider,
  updateRider,
  deleteRider,
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  getAdminTrips,
  updateAdminTrip,
  deleteAdminTrip,
  getAdminStats,
  getAdminAnalytics,
  trackUserSearch,
  getTrackingDrivers,
  getMarketplaceOffers,
  getMarketplaceRequests,
  exportDataDump,
  importDataDump,
  exportMigrationZip,
  importMigrationZip,
  getDbStatus,
  getDbTableRows,
  insertDbRow,
  deleteDbRow,
  executeRawQuery,
  getSupportTickets,
  createSupportTicket,
  updateSupportTicket,
  deleteSupportTicket,
  getSupportChatMessages,
  sendSupportChatMessage,
  getAboutIdsInfo,
  getSubscribers,
  addSubscriber,
  updateSubscriber,
  deleteSubscriber,
  sendPromotionalBroadcast,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getErrors,
  reportError,
  clearErrors,
  getMediaLibrary,
  uploadMedia,
  deleteMedia,
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  markAlertRead,
  getSeoAnalytics,
  pingIndexNow,
  purgeServerCache,
  getPwaTelemetry,
  reportPwaTelemetry,
  getPwaVersionConfig,
  updatePwaVersionConfig,
  triggerPwaUpdateForUsers,
  verifyVpsStep,
  resetAndSeedSystem,
  getBanners,
  saveBanner,
  updateBannersList,
  deleteBanner
} from "../controllers/admin.controller";

const router = Router();

// VPS Setup & System Reset Endpoints
router.post("/vps/verify-step", verifyVpsStep);
router.post("/system/reset", resetAndSeedSystem);

// SEO & Web Performance Endpoints
router.get("/seo", getSeoAnalytics);
router.post("/seo/indexnow", pingIndexNow);
router.post("/cache/purge", purgeServerCache);

router.get("/about-ids", getAboutIdsInfo);

// Live PostgreSQL Control & Console
router.get("/db/status", getDbStatus);
router.get("/db/table/:tableName", getDbTableRows);
router.post("/db/table/:tableName", insertDbRow);
router.delete("/db/table/:tableName/:idKey/:idValue", deleteDbRow);
router.post("/db/query", executeRawQuery);

// Backup & DB Import/Export (JSON & Full Migration ZIP)
router.get("/backup/export", exportDataDump);
router.post("/backup/import", importDataDump);
router.get("/backup/export-zip", exportMigrationZip);
router.post("/backup/import-zip", importMigrationZip);

// Config & Banner Management
router.get("/config", getAdminConfig);
router.post("/config", saveAdminConfig);
router.get("/banners", getBanners);
router.post("/banners", saveBanner);
router.put("/banners/:type", updateBannersList);
router.delete("/banners/:type/:id", deleteBanner);
router.post("/upload", uploadVehicleImage);
router.post("/vehicles/freeze", freezeVehicles);
router.post("/mail/test", testSmtpSettings);
router.get("/mail/otps", getActiveMailOtps);

// Riders Management
router.get("/riders", getRiders);
router.post("/riders", createRider);
router.patch("/riders/:id", updateRider);
router.delete("/riders/:id", deleteRider);

// Drivers Management
router.get("/drivers", getDrivers);
router.post("/drivers", createDriver);
router.patch("/drivers/:id", updateDriver);
router.delete("/drivers/:id", deleteDriver);

// Trip Management
router.get("/trips", getAdminTrips);
router.patch("/trips/:id", updateAdminTrip);
router.delete("/trips/:id", deleteAdminTrip);

// System Stats
router.get("/stats", getAdminStats);
router.get("/analytics", getAdminAnalytics);
router.post("/track-search", trackUserSearch);

// Tracking and Marketplace
router.get("/tracking/drivers", getTrackingDrivers);
router.get("/marketplace/offers", getMarketplaceOffers);
router.get("/marketplace/requests", getMarketplaceRequests);

// Support Management Endpoints
router.get("/support/tickets", getSupportTickets);
router.post("/support/tickets", createSupportTicket);
router.patch("/support/tickets/:id", updateSupportTicket);
router.delete("/support/tickets/:id", deleteSupportTicket);
router.get("/tickets", getSupportTickets);
router.post("/tickets", createSupportTicket);
router.patch("/tickets/:id", updateSupportTicket);
router.delete("/tickets/:id", deleteSupportTicket);
router.get("/support/chat/:driverId", getSupportChatMessages);
router.post("/support/chat", sendSupportChatMessage);

// Subscribers & Email Marketing Endpoints
router.get("/subscribers", getSubscribers);
router.post("/subscribers", addSubscriber);
router.patch("/subscribers/:id", updateSubscriber);
router.delete("/subscribers/:id", deleteSubscriber);
router.post("/subscribers/broadcast", sendPromotionalBroadcast);

// Blogs Endpoints
router.get("/blogs", getBlogs);
router.post("/blogs", createBlog);
router.patch("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

// FAQs Endpoints
router.get("/faqs", getFaqs);
router.post("/faqs", createFaq);
router.patch("/faqs/:id", updateFaq);
router.delete("/faqs/:id", deleteFaq);

// Commuter Reviews Endpoints
router.get("/reviews", getReviews);
router.post("/reviews", createReview);
router.patch("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

// System Error Log Endpoints
router.get("/errors", getErrors);
router.post("/errors", reportError);
router.delete("/errors", clearErrors);

// Media Library Endpoints
router.get("/media", getMediaLibrary);
router.post("/media", uploadMedia);
router.delete("/media/:id", deleteMedia);

// System Alerts Endpoints
router.get("/alerts", getAlerts);
router.post("/alerts", createAlert);
router.patch("/alerts/:id", updateAlert);
router.delete("/alerts/:id", deleteAlert);
router.post("/alerts/mark-read", markAlertRead);

// PWA Telemetry & Version Control Endpoints
router.get("/pwa/telemetry", getPwaTelemetry);
router.post("/pwa/telemetry", reportPwaTelemetry);
router.get("/pwa/version-config", getPwaVersionConfig);
router.post("/pwa/version-config", updatePwaVersionConfig);
router.post("/pwa/trigger-update", triggerPwaUpdateForUsers);

export default router;
