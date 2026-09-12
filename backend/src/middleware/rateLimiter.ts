import { Request, Response, NextFunction } from "express";

const ipRequestMap = new Map<string, { count: number; resetTime: number }>();

/**
 * In-memory sliding window rate limiter
 */
export function rateLimiter(limit: number = 100, windowMs: number = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers["x-forwarded-for"]?.toString() || "127.0.0.1";
    const now = Date.now();
    const entry = ipRequestMap.get(ip);

    if (!entry || now > entry.resetTime) {
      ipRequestMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      return res.status(429).json({
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please retry shortly.",
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      });
    }

    entry.count++;
    next();
  };
}
