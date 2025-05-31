import { RequestHandler } from "express";
import {
  forgetPassword,
  loginValidationSchema,
  registerValidationSchema,
  requestBodyValidationSchema,
  resendOTP,
  resetPasswordValidationSchema,
} from "../validators";

export const validateRegister: RequestHandler = (req, res, next): void => {
  const { error } = registerValidationSchema.validate(req.body, {
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
export const validateLogin: RequestHandler = (req, res, next): void => {
  const { error } = loginValidationSchema.validate(req.body, {
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
export const validateOTPRequestBody: RequestHandler = (
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
export const resendOTPRequestBody: RequestHandler = (req, res, next): void => {
  const { error } = resendOTP.validate(req.body, {
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

export const forgetPasswordRequestBody: RequestHandler = (
  req,
  res,
  next
): void => {
  const { error } = forgetPassword.validate(req.body, {
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
export const validateResetPassword: RequestHandler = (req, res, next): void => {
  const { error } = resetPasswordValidationSchema.validate(req.body, {
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
