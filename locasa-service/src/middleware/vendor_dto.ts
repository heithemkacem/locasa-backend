import { RequestHandler } from "express";
import {
  addBrandSchema,
  editBrandSchema,
  addProductSchema,
  editProductSchema,
  updateOrderStatusSchema,
} from "../validators/vendor";

export const validateAddBrand: RequestHandler = (req, res, next): void => {
  const { error } = addBrandSchema.validate(req.body, {
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

export const validateEditBrand: RequestHandler = (req, res, next): void => {
  const { error } = editBrandSchema.validate(req.body, {
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

export const validateAddProduct: RequestHandler = (req, res, next): void => {
  const { error } = addProductSchema.validate(req.body, {
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

export const validateEditProduct: RequestHandler = (req, res, next): void => {
  const { error } = editProductSchema.validate(req.body, {
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

export const validateUpdateOrderStatus: RequestHandler = (
  req,
  res,
  next
): void => {
  const { error } = updateOrderStatusSchema.validate(req.body, {
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
