import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

// Extend Express Request type to include user session
declare global {
  namespace Express {
    interface Request {
      session?: {
        userId: string;
        sessionToken: string;
      };
    }
  }
}

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No session token provided" });
    }

    const sessionToken = authHeader.replace("Bearer ", "");
    if (!sessionToken) {
      return res.status(401).json({ message: "Invalid session token format" });
    }

    const session = await storage.getSessionByToken(sessionToken);
    if (!session) {
      return res.status(401).json({ message: "Session not found" });
    }

    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await storage.deleteSession(sessionToken);
      return res.status(401).json({ message: "Session expired" });
    }

    // Verify user still exists and is active
    const user = await storage.getUser(session.userId);
    if (!user || !user.isActive) {
      // Clean up invalid session
      await storage.deleteSession(sessionToken);
      return res.status(401).json({ message: "User not found or inactive" });
    }

    // Attach session info to request
    req.session = {
      userId: session.userId,
      sessionToken: sessionToken,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Authentication failed" });
  }
}

// Optional authentication middleware (doesn't fail if no token)
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const sessionToken = authHeader.replace("Bearer ", "");
    const session = await storage.getSessionByToken(sessionToken);
    
    if (session && session.expiresAt >= new Date()) {
      const user = await storage.getUser(session.userId);
      if (user && user.isActive) {
        req.session = {
          userId: session.userId,
          sessionToken: sessionToken,
        };
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth error:", error);
    next();
  }
}