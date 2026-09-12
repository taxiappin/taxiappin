import { useState, useCallback } from "react";

export interface Transaction {
  id: string;
  amount: number;
  type: "deposit" | "withdrawal" | "payment" | "refund";
  description: string;
  timestamp: string;
}

export function useWalletManager(initialBalance: number = 0) {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const depositFunds = useCallback((amount: number): boolean => {
    if (amount <= 0 || isNaN(amount)) {
      console.warn("[Wallet Warning]: Cannot deposit non-positive or NaN amount:", amount);
      return false;
    }
    setBalance((prev) => parseFloat((prev + amount).toFixed(2)));
    return true;
  }, []);

  const withdrawFunds = useCallback((amount: number): boolean => {
    if (amount <= 0 || isNaN(amount)) {
      console.warn("[Wallet Warning]: Cannot withdraw non-positive or NaN amount:", amount);
      return false;
    }
    let success = false;
    setBalance((prev) => {
      if (prev >= amount) {
        success = true;
        return parseFloat((prev - amount).toFixed(2));
      }
      return prev;
    });
    return success;
  }, []);

  const deductPayment = useCallback((amount: number): boolean => {
    if (amount <= 0 || isNaN(amount)) {
      console.warn("[Wallet Warning]: Cannot deduct non-positive or NaN amount:", amount);
      return false;
    }
    let success = false;
    setBalance((prev) => {
      if (prev >= amount) {
        success = true;
        return parseFloat((prev - amount).toFixed(2));
      }
      return prev;
    });
    return success;
  }, []);

  return {
    balance,
    setBalance,
    transactions,
    setTransactions,
    depositFunds,
    withdrawFunds,
    deductPayment,
  };
}
