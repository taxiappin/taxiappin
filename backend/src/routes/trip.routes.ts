import { Router } from "express";
import { 
  geocodeReverse,
  geocodeSearch,
  login,
  getDrivers,
  updateDriverStatus,
  getDriverLedger,
  saveDriverLedger,
  getTrips,
  createTrip,
  cancelTrip,
  deleteTrip,
  verifyTripOtp,
  updateTrip,
  createMessage,
  getMessages,
  deleteMessages,
  getChatSettings,
  updateChatSettings,
  createPaymentOrder,
  verifyPayment,
  clearTrips,
  getSubscriptionTransactions,
  logSubscriptionTransaction
} from "../controllers/trip.controller";
import {
  getBlogs,
  getFaqs,
  getReviews,
  createReview
} from "../controllers/admin.controller";

const router = Router();

// Geocoding Proxy Routes
router.get("/geocode/reverse", geocodeReverse);
router.get("/geocode/search", geocodeSearch);

// Auth login route
router.post("/login", login);

// Drivers Routes
router.get("/drivers", getDrivers);
router.post("/driver/status", updateDriverStatus);
router.get("/driver/ledger", getDriverLedger);
router.post("/driver/ledger", saveDriverLedger);

// Trip Management Routes
router.get("/trips", getTrips);
router.post("/trips", createTrip);
router.post("/trips/cancel", cancelTrip);
router.delete("/trips/:id", deleteTrip);
router.post("/trips/clear", clearTrips);
router.post("/trips/:id/verify-otp", verifyTripOtp);
router.patch("/trips/:id", updateTrip);

// Messaging & Payments Routes
router.get("/messages", getMessages);
router.post("/messages", createMessage);
router.delete("/messages", deleteMessages);
router.get("/chat-settings", getChatSettings);
router.post("/chat-settings", updateChatSettings);
router.put("/chat-settings", updateChatSettings);
router.post("/payment/create-order", createPaymentOrder);
router.post("/payment/verify-payment", verifyPayment);

// Subscription Transactions Routes
router.get("/subscription/transactions", getSubscriptionTransactions);
router.post("/subscription/transactions", logSubscriptionTransaction);

// Public Content & Feedback Routes
router.get("/blogs", getBlogs);
router.get("/faqs", getFaqs);
router.get("/reviews", getReviews);
router.post("/reviews", createReview);

export default router;
