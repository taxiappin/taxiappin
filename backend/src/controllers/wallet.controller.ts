import { Request, Response } from "express";
import { WalletModelRepository } from "../models/Wallet.model";

export async function getWalletBalance(req: Request, res: Response) {
  try {
    const userId = (req.query.userId as string) || "GUEST";
    const userType = (req.query.userType as 'rider' | 'driver') || 'rider';
    const wallet = WalletModelRepository.getWallet(userId, userType);
    return res.json({ success: true, wallet });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function topupWallet(req: Request, res: Response) {
  try {
    const { userId, amount, paymentMethod, userType } = req.body;
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid userId or amount" });
    }
    const updated = await WalletModelRepository.credit(
      userId,
      Number(amount),
      `Wallet top-up via ${paymentMethod || 'Online Payment'}`,
      userType || 'rider'
    );
    return res.json({ success: true, wallet: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function deductWallet(req: Request, res: Response) {
  try {
    const { userId, amount, description, userType, referenceId } = req.body;
    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid userId or amount" });
    }
    const updated = await WalletModelRepository.debit(
      userId,
      Number(amount),
      description || "Trip payment deduction",
      userType || 'rider',
      referenceId
    );
    return res.json({ success: true, wallet: updated });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}
