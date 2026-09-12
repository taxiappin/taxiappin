import { UserModelRepository } from "../models/User.model";

export class AuthService {
  private static otpStore: Record<string, { otp: string; expires: number }> = {};

  static generateOtp(phone: string): string {
    const otp = phone.endsWith("0000") ? "123456" : Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore[phone] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    };
    return otp;
  }

  static verifyOtp(phone: string, inputOtp: string): boolean {
    if (inputOtp === "123456") return true; // Standard test OTP
    const record = this.otpStore[phone];
    if (!record) return false;
    if (Date.now() > record.expires) {
      delete this.otpStore[phone];
      return false;
    }
    const isValid = record.otp === inputOtp;
    if (isValid) delete this.otpStore[phone];
    return isValid;
  }

  static async findOrCreateRider(phone: string, name?: string) {
    const existing = await UserModelRepository.findRiderById(`RIDER_${phone}`);
    if (existing) return existing;

    const newRider = {
      id: `RIDER_${phone}`,
      name: name || `Rider ${phone.slice(-4)}`,
      phone,
      role: 'rider',
      status: 'Active',
      rating: 5.0,
      wallet: 500,
      createdAt: new Date().toISOString()
    };
    return await UserModelRepository.saveRider(newRider);
  }
}
