/**
 * Centralized API Service for calling Backend Endpoints
 */

const BASE_URL = "/api";

export const apiService = {
  async health() {
    const res = await fetch(`${BASE_URL}/health`);
    return await res.json();
  },

  // Ride Endpoints
  async getRides() {
    const res = await fetch(`${BASE_URL}/rides`);
    return await res.json();
  },

  async createRide(rideData: any) {
    const res = await fetch(`${BASE_URL}/rides`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rideData)
    });
    return await res.json();
  },

  async cancelRide(tripId: string, reason?: string) {
    const res = await fetch(`${BASE_URL}/rides/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tripId, reason })
    });
    return await res.json();
  },

  async estimateFare(params: { distanceKm: number; durationMinutes: number; category: string }) {
    const res = await fetch(`${BASE_URL}/rides/estimate-fare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    return await res.json();
  },

  // Wallet Endpoints
  async getWalletBalance(userId: string, userType: 'rider' | 'driver' = 'rider') {
    const res = await fetch(`${BASE_URL}/wallet/balance?userId=${encodeURIComponent(userId)}&userType=${userType}`);
    return await res.json();
  },

  async topupWallet(userId: string, amount: number, paymentMethod: string, userType: 'rider' | 'driver' = 'rider') {
    const res = await fetch(`${BASE_URL}/wallet/topup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, amount, paymentMethod, userType })
    });
    return await res.json();
  },

  async deductWallet(userId: string, amount: number, description: string, userType: 'rider' | 'driver' = 'rider') {
    const res = await fetch(`${BASE_URL}/wallet/deduct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, amount, description, userType })
    });
    return await res.json();
  },

  // Admin Config
  async getAdminConfig() {
    const res = await fetch(`${BASE_URL}/admin/config`);
    return await res.json();
  }
};
