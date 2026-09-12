import { Router } from "express";
import { getWalletBalance, topupWallet, deductWallet } from "../controllers/wallet.controller";

const router = Router();

router.get("/balance", getWalletBalance);
router.post("/topup", topupWallet);
router.post("/deduct", deductWallet);

export default router;
