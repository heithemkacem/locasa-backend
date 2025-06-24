import Joi from "joi";

// Custom validation for Mongoose ObjectId
const objectIdPattern = /^[a-fA-F0-9]{24}$/;

// DTO for validating userId
export const userIdValidationSchema = Joi.object({
  userId: Joi.string().pattern(objectIdPattern).required().messages({
    "string.empty": "User ID is required.",
    "string.pattern.base": "User ID must be a valid Mongoose ObjectId.",
    "any.required": "User ID is required.",
  }),
  device_id: Joi.string().required().messages({
    "string.empty": "Device ID is required.",
    "any.required": "Device ID is required.",
  }),
});
export const requestBodyValidationSchema = Joi.object({
  expoPushToken: Joi.string().allow(null).required().messages({
    "string.empty": "Expo Push Token is required.",
    "any.required": "Expo Push Token is required.",
  }),
  type: Joi.string().valid("vendor", "client").required().messages({
    "string.empty": "Type is required.",
    "any.only": 'Type must be either "vendor" or "client".',
    "any.required": "Type is required.",
  }),
  device_id: Joi.string().required().messages({
    "string.empty": "Device ID is required.",
    "any.required": "Device ID is required.",
  }),
  device_type: Joi.string().required().messages({
    "string.empty": "Device Type is required.",
    "any.required": "Device Type is required.",
  }),
  status: Joi.boolean().required().messages({
    "any.required": "Status is required.",
  }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});

// DTO for validating oldPassword, newPassword, and confirmNewPassword
export const changePasswordValidationSchema = Joi.object({
  oldPassword: Joi.string().min(8).required().messages({
    "string.empty": "Old password is required.",
    "string.min": "Old password must be at least 8 characters long.",
    "any.required": "Old password is required.",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.empty": "New password is required.",
    "string.min": "New password must be at least 8 characters long.",
    "any.required": "New password is required.",
  }),
  confirmNewPassword: Joi.string()
    .required()
    .valid(Joi.ref("newPassword"))
    .messages({
      "string.empty": "Confirm new password is required.",
      "any.required": "Confirm new password is required.",
      "any.only": "Confirm new password must match the new password.",
    }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
