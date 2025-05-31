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
