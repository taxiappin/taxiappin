/**
 * Backend Environment Configuration
 */
import "dotenv/config";

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  APP_URL: process.env.APP_URL || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  DATABASE_URL: process.env.DATABASE_URL || "",
  PGHOST: process.env.PGHOST || "",
  PGPORT: Number(process.env.PGPORT) || 5432,
  PGUSER: process.env.PGUSER || "",
  PGPASSWORD: process.env.PGPASSWORD || "",
  PGDATABASE: process.env.PGDATABASE || "",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  isProduction: process.env.NODE_ENV === "production",
};
