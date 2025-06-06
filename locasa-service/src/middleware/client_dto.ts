import { RequestHandler } from "express";
import {
  addLocationSchema,
  updateLocationSchema,
  addToWishlistSchema,
  addReviewSchema,
  markNotificationAsReadSchema,
} from "../validators/client";

export const validateAddLocation: RequestHandler = (req, res, next): void => {
  const { error } = addLocationSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    console.log("Validation error:", error);
    res.status(400).json({
      status: "Failed",
      message: "backend.validation_error",
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  next();
};

export const validateUpdateLocation: RequestHandler = (
  req,
  res,
  next
): void => {
  const { error } = updateLocationSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    console.log("Validation error:", error);
    res.status(400).json({
      status: "Failed",
      message: "backend.validation_error",
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  next();
};

export const validateAddToWishlist: RequestHandler = (req, res, next): void => {
  const { error } = addToWishlistSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    console.log("Validation error:", error);
    res.status(400).json({
      status: "Failed",
      message: "backend.validation_error",
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  next();
};

export const validateAddReview: RequestHandler = (req, res, next): void => {
  const { error } = addReviewSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    console.log("Validation error:", error);
    res.status(400).json({
      status: "Failed",
      message: "backend.validation_error",
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  next();
};

export const validateMarkNotificationAsRead: RequestHandler = (
  req,
  res,
  next
): void => {
  const { error } = markNotificationAsReadSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    console.log("Validation error:", error);
    res.status(400).json({
      status: "Failed",
      message: "backend.validation_error",
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  next();
};
