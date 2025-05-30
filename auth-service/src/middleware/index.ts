import { ErrorRequestHandler } from "express";
import { ApiError } from "../utils";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Profile } from "../database";

export const errorConverter: ErrorRequestHandler = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error instanceof Error ? 400 : 500);
    const message =
      error.message ||
      (statusCode === 400
        ? "backend.bad_request"
        : "backend.internal_server_error");
    error = new ApiError(statusCode, message, false, err.stack.toString());
  }
  next(error);
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    statusCode = 500;
    message = "backend.internal_server_error";
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

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        type: "client" | "vendor";
        name: string;
        client_id: string;
      };
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "backend.access_token_missing_or_invalid" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      type: "client" | "vendor";
      name: string;
      client_id: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res
      .status(403)
      .json({ message: "backend.invalid_or_expired_token" });
  }
};

export const verifyRole = (...allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    try {
      if (!req.user) {
        return res
          .status(403)
          .json({ message: "backend.authentication_required" });
      }
      const userRole = req.user.type;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: "backend.insufficient_permissions",
        });
      }
      next();
    } catch (error) {
      console.error("Role verification failed:", error);
      return res
        .status(500)
        .json({
          message: "backend.internal_server_error_during_authorization",
        });
    }
  };
};

export const checkProfileBlocked = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const profile = await Profile.findById(req.user?.id);
    if (!profile) {
      return res.status(404).json({ message: "backend.profile_not_found" });
    }
    if (profile.blocked) {
      return res.status(403).json({ message: "backend.account_blocked" });
    }
    next();
  } catch (error) {
    console.error("Error checking profile status:", error);
    return res.status(500).json({ message: "backend.internal_server_error" });
  }
};
