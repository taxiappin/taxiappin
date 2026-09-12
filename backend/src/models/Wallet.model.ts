import { globalRiders, globalDrivers, syncRider, syncDriver } from "./db";

export interface WalletRecord {
  userId: string;
  userType: 'rider' | 'driver';
  balance: number;
  transactions: Array<{
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    timestamp: number;
    referenceId?: string;
  }>;
}

const memoryLedger: Record<string, WalletRecord> = {};

export class WalletModelRepository {
  static getWallet(userId: string, userType: 'rider' | 'driver' = 'rider'): WalletRecord {
    if (!memoryLedger[userId]) {
      const user = userType === 'rider' ? globalRiders[userId] : globalDrivers[userId];
      const initialBalance = user ? (Number(user.wallet) || 0) : 1000;
      memoryLedger[userId] = {
        userId,
        userType,
        balance: initialBalance,
        transactions: [
          {
            id: `TXN_INIT_${Date.now()}`,
            amount: initialBalance,
            type: 'credit',
            description: 'Welcome promotional credit',
            timestamp: Date.now()
          }
        ]
      };
    }
    return memoryLedger[userId];
  }

  static async credit(userId: string, amount: number, description: string, userType: 'rider' | 'driver' = 'rider', refId?: string) {
    const wallet = this.getWallet(userId, userType);
    wallet.balance += amount;
    wallet.transactions.unshift({
      id: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount,
      type: 'credit',
      description,
      timestamp: Date.now(),
      referenceId: refId
    });

    if (userType === 'rider' && globalRiders[userId]) {
      globalRiders[userId].wallet = wallet.balance;
      await syncRider(globalRiders[userId]);
    } else if (userType === 'driver' && globalDrivers[userId]) {
      globalDrivers[userId].wallet = wallet.balance;
      await syncDriver(globalDrivers[userId]);
    }

    return wallet;
  }

  static async debit(userId: string, amount: number, description: string, userType: 'rider' | 'driver' = 'rider', refId?: string) {
    const wallet = this.getWallet(userId, userType);
    if (wallet.balance < amount) {
      throw new Error("Insufficient wallet balance");
    }
    wallet.balance -= amount;
    wallet.transactions.unshift({
      id: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount,
      type: 'debit',
      description,
      timestamp: Date.now(),
      referenceId: refId
    });

    if (userType === 'rider' && globalRiders[userId]) {
      globalRiders[userId].wallet = wallet.balance;
      await syncRider(globalRiders[userId]);
    } else if (userType === 'driver' && globalDrivers[userId]) {
      globalDrivers[userId].wallet = wallet.balance;
      await syncDriver(globalDrivers[userId]);
    }

    return wallet;
  }
}
