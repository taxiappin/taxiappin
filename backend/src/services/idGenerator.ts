/**
 * Secure ID Generation Service for TaxiApp Platform
 * Generates custom structured IDs according to defined segment schemas.
 */

function getCityCode(city?: string): string {
  if (!city) return "HY"; // Default to Hyderabad
  const c = city.toLowerCase().trim();
  if (c.includes("mumbai") || c.includes("bombay")) return "MU";
  if (c.includes("delhi") || c.includes("ncr") || c.includes("noida")) return "DL";
  if (c.includes("bangalore") || c.includes("bengaluru")) return "BL";
  if (c.includes("pune") || c.includes("poona")) return "PU";
  if (c.includes("hyderabad")) return "HY";
  if (c.includes("chennai") || c.includes("madras")) return "CH";
  if (c.includes("kolkata") || c.includes("calcutta")) return "KO";
  if (c.includes("mancherial")) return "MA";
  
  // Clean special characters and take first 2 letters
  const cleaned = c.replace(/[^a-z]/g, "");
  if (cleaned.length >= 2) return cleaned.substring(0, 2).toUpperCase();
  return "HY";
}

function getCategoryCode(category?: string): string {
  if (!category) return "G";
  const cat = category.toLowerCase().trim();
  if (cat.includes("payment") || cat.includes("refund") || cat.includes("txn") || cat.includes("wallet")) return "P";
  if (cat.includes("safety") || cat.includes("sos") || cat.includes("police") || cat.includes("emergency")) return "S";
  if (cat.includes("driver") || cat.includes("verify") || cat.includes("licence") || cat.includes("license")) return "D";
  if (cat.includes("tech") || cat.includes("bug") || cat.includes("app") || cat.includes("error")) return "T";
  return "G"; // General
}

function generateRandomCode(length: number = 8): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function calculateChecksum(str: string): string {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i) * (i + 1);
  }
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[sum % alphabet.length];
}

export function generateDriverId(city?: string): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const cityCode = getCityCode(city);
  const random = generateRandomCode(8);
  return `DRV${year}${cityCode}${random}`;
}

export function generateRiderId(city?: string): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const cityCode = getCityCode(city);
  const random = generateRandomCode(8);
  return `RID${year}${cityCode}${random}`;
}

export function generateLocalTripId(city?: string): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const cityCode = getCityCode(city);
  const random = generateRandomCode(8);
  return `TRP${year}${cityCode}${random}`;
}

export function generateIntercityTripId(startCity?: string, endCity?: string): string {
  const sc = getCityCode(startCity);
  const ec = getCityCode(endCity || "DL");
  const random = generateRandomCode(8);
  return `TRP${sc}${ec}${random}`;
}

export function generateTransactionId(city?: string): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const cityCode = getCityCode(city);
  const random = generateRandomCode(8);
  return `TXN${year}${cityCode}${random}`;
}

export function generateSupportTicketId(category?: string): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const cat = getCategoryCode(category);
  const random = generateRandomCode(8);
  const base = `TKT${year}${cat}${random}`;
  const chk = calculateChecksum(base);
  return `${base}${chk}`;
}
