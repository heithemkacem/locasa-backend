import { ErrorRequestHandler } from "express";
import { ApiError, errorResponse } from "../utils";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ObjectSchema, string } from "joi";
import { Profile } from "../database";
export const errorConverter: ErrorRequestHandler = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ||
      (error instanceof Error
        ? 400 // Bad Request
        : 500); // Internal Server Error
    const message =
      error.message ||
      (statusCode === 400 ? "Bad Request" : "Internal Server Error");
    error = new ApiError(statusCode, message, false, err.stack.toString());
  }
  next(error);
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    statusCode = 500; // Internal Server Error
    message = "Internal Server Error";
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(statusCode).json(response);
  next();
};

// Define an interface for req.user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access token is missing or invalid." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    req.user = { id: decoded.id };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export const verifyRole = (...allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    try {
      // 1. Check if user exists from previous middleware
      if (!req.user) {
        return res.status(403).json({ message: "Authentication required" });
      }

      // 2. Get user role from decoded token
      const userRole = req.user.type;

      // 3. Check if user's role is included in allowed roles
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: `Insufficient permissions. Required roles: ${allowedRoles.join(
            ", "
          )}`,
        });
      }
      console.log("Verify Role Passed");
      next();
    } catch (error) {
      console.log(error);
      console.error("Role verification failed:", error);
      return res
        .status(500)
        .json({ message: "Internal server error during authorization" });
    }
  };
};

export const checkProfileBlocked = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    // Assuming the user ID is in req.user (decoded from the token)
    const profileId = req.user?.profile.id; // This should match the 'id' from your JWT payload
    // Find the profile by ID
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }

    // Check if the profile is blocked
    if (profile.blocked) {
      return res.status(403).json({ message: "Your account is blocked." });
    }

    // Proceed if profile is not blocked
    next();
  } catch (error) {
    console.error("Error checking profile status:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
