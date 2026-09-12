import { Router } from "express";
import {
  requestOtp,
  verifyOtp,
  signup,
  login,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  updateDriverProfile,
  updateRiderProfile,
  checkExists,
  getSessionConfig,
  validateSession,
  logoutUser
} from "../controllers/auth.controller";

const router = Router();

router.post("/check-exists", checkExists);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/driver/update", updateDriverProfile);
router.post("/rider/update", updateRiderProfile);
router.get("/session-config", getSessionConfig);
router.post("/validate-session", validateSession);
router.post("/logout", logoutUser);

export default router;
