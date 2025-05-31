import { RequestHandler } from "express";
import {
  changePasswordValidationSchema,
  requestBodyValidationSchema,
  userIdValidationSchema,
} from "../validators/profile";

export const validateUserId: RequestHandler = (req, res, next): void => {
  const { error } = userIdValidationSchema.validate(req.params, {
    abortEarly: false, // Show all validation errors at once
    allowUnknown: false, // Reject unknown fields
  });

  if (error) {
    console.log("Validation error:", error);
    res.status(400).json({
      status: "Failed",
      message: "backend.validation_error",
    });
    return;
  }

  next(); // Proceed to the next middleware or controller if validation passes
};

export const validateAddTokenRequestBody: RequestHandler = (
  req,
  res,
  next
): void => {
  const { error } = requestBodyValidationSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors at once
    allowUnknown: false, // Reject unknown fields
  });

  if (error) {
    console.log("Validation error:", error);
    res.status(400).json({
      status: "Failed",
      message: "backend.validation_error",
    });
    return;
  }

  next(); // Proceed to the next middleware or controller if validation passes
};
export const validateChangePassword: RequestHandler = (
  req,
  res,
  next
): void => {
  const { error } = changePasswordValidationSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors at once
    allowUnknown: false, // Reject unknown fields
  });

  if (error) {
    console.log("Validation error:", error);
    res.status(400).json({
      status: "Failed",
      message: "backend.validation_error",
    });
    return;
  }

  next(); // Proceed to the next middleware or controller if validation passes
};
