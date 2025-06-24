import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const checkDatabaseConnection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Check if mongoose is connected
  if (mongoose.connection.readyState !== 1) {
    console.error(
      "❌ Database not connected. Connection state:",
      mongoose.connection.readyState
    );
    res.status(503).json({
      error: "Database connection not available. Please try again later.",
      code: "DATABASE_UNAVAILABLE",
    });
    return;
  }

  next();
};

// Health check endpoint
export const healthCheck = (req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const health = {
    service: "auth-service",
    status: dbState === 1 ? "healthy" : "unhealthy",
    database: {
      state: dbStates[dbState as keyof typeof dbStates] || "unknown",
      readyState: dbState,
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  const statusCode = dbState === 1 ? 200 : 503;
  res.status(statusCode).json(health);
};
