import { globalRiders, globalDrivers, syncRider, syncDriver } from "./db";
import { getPgPool, getIsPgConnected } from "./postgres";

export interface UserModel {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'rider' | 'driver' | 'admin';
  status: string;
  rating?: number;
  wallet?: number;
  createdAt?: string;
}

export class UserModelRepository {
  static async findRiderById(id: string) {
    if (globalRiders[id]) return globalRiders[id];
    const pool = getPgPool();
    if (pool && getIsPgConnected()) {
      const res = await pool.query("SELECT * FROM riders WHERE id = $1 LIMIT 1", [id]);
      if (res.rows.length > 0) return res.rows[0];
    }
    return null;
  }

  static async findDriverById(id: string) {
    if (globalDrivers[id]) return globalDrivers[id];
    const pool = getPgPool();
    if (pool && getIsPgConnected()) {
      const res = await pool.query("SELECT * FROM drivers WHERE id = $1 LIMIT 1", [id]);
      if (res.rows.length > 0) return res.rows[0];
    }
    return null;
  }

  static async saveRider(rider: any) {
    globalRiders[rider.id] = { ...globalRiders[rider.id], ...rider };
    await syncRider(globalRiders[rider.id]);
    return globalRiders[rider.id];
  }

  static async saveDriver(driver: any) {
    globalDrivers[driver.id] = { ...globalDrivers[driver.id], ...driver };
    await syncDriver(globalDrivers[driver.id]);
    return globalDrivers[driver.id];
  }
}
