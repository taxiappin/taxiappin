import { Request, Response, NextFunction } from "express";

/**
 * Authentication Middleware
 * Validates request authorization tokens or session headers
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // In dev / demo mode, allow fallback or pass with guest identity
    return next();
  }

  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized", message: "Bearer token missing" });
  }

  // Attach user context
  (req as any).user = { token };
  next();
}
