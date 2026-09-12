import { Request, Response, NextFunction } from "express";

/**
 * Standardized Global Error Handler Middleware
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[API ERROR] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);
  if (err.stack && process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
}
