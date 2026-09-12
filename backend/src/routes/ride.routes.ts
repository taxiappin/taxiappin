import { Router } from "express";
import {
  getRides,
  createRide,
  cancelRide,
  deleteRide,
  verifyRideOtp,
  updateRide,
  estimateFare,
  getDrivers,
  updateDriverStatus
} from "../controllers/ride.controller";

const router = Router();

// Ride / Trip endpoints
router.get("/", getRides);
router.post("/", createRide);
router.post("/estimate-fare", estimateFare);
router.post("/cancel", cancelRide);
router.delete("/:id", deleteRide);
router.post("/:id/verify-otp", verifyRideOtp);
router.patch("/:id", updateRide);

// Driver endpoints under rides namespace
router.get("/drivers", getDrivers);
router.post("/driver/status", updateDriverStatus);

export default router;
