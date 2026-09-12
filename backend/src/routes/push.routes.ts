import { Router } from "express";
import { 
  getVapidKeyHandler, 
  subscribeHandler, 
  sendNotificationHandler,
  testSingleHandler,
  getPushSettingsHandler,
  savePushSettingsHandler
} from "../controllers/push.controller";

const router = Router();

router.get("/vapid-key", getVapidKeyHandler);
router.get("/settings", getPushSettingsHandler);
router.post("/settings", savePushSettingsHandler);
router.post("/subscribe", subscribeHandler);
router.post("/send", sendNotificationHandler);
router.post("/test-single", testSingleHandler);

export default router;
