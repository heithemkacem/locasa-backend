import Joi from "joi";

// Register DTO
export const registerValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "backend.email_required",
    "string.email": "backend.email_invalid",
    "any.required": "backend.email_required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "backend.password_required",
    "string.min": "backend.password_min_length",
    "any.required": "backend.password_required",
  }),
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "backend.name_required",
    "string.min": "backend.name_min_length",
    "string.max": "backend.name_max_length",
    "any.required": "backend.name_required",
  }),
  type: Joi.string().valid("client", "vendor").required().messages({
    "any.only": "backend.type_invalid",
    "any.required": "backend.type_required",
  }),
}).messages({
  "object.unknown": "backend.unexpected_field_detectted_in_request_body",
});

// Login DTO
export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "backend.email_required",
    "string.email": "backend.email_invalid",
    "any.required": "backend.email_required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "backend.password_required",
    "string.min": "backend.password_min_length",
    "any.required": "backend.password_required",
  }),
  type: Joi.string().valid("client", "vendor").required().messages({
    "any.only": "backend.type_invalid",
    "any.required": "backend.type_required",
  }),
}).messages({
  "object.unknown": "backend.unexpected_field_detectted_in_request_body",
});

// OTP Request Validation
export const requestBodyValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "backend.email_required",
    "string.email": "backend.email_invalid",
    "any.required": "backend.email_required",
  }),
  otp: Joi.string().length(4).required().messages({
    "string.empty": "backend.otp_required",
    "string.length": "backend.otp_invalid_length",
    "any.required": "backend.otp_required",
  }),
  type: Joi.string()
    .valid("reset-password", "created-account")
    .required()
    .messages({
      "string.empty": "backend.otp_type_required",
      "any.only": "backend.otp_type_invalid",
      "any.required": "backend.otp_type_required",
    }),
  userType: Joi.string().valid("client", "vendor").required().messages({
    "any.only": "backend.type_invalid",
    "any.required": "backend.type_required",
  }),
}).messages({
  "object.unknown": "backend.unexpected_field_detectted_in_request_body",
});

// Resend OTP
export const resendOTP = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "backend.email_required",
    "string.email": "backend.email_invalid",
    "any.required": "backend.email_required",
  }),
  type: Joi.string()
    .valid("reset-password", "created-account")
    .required()
    .messages({
      "string.empty": "backend.otp_type_required",
      "any.only": "backend.otp_type_invalid",
      "any.required": "backend.otp_type_required",
    }),
  userType: Joi.string().valid("client", "vendor").required().messages({
    "any.only": "backend.type_invalid",
    "any.required": "backend.type_required",
  }),
}).messages({
  "object.unknown": "backend.unexpected_field_detectted_in_request_body",
});

// Forget Password
export const forgetPassword = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "backend.email_required",
    "string.email": "backend.email_invalid",
    "any.required": "backend.email_required",
  }),
  type: Joi.string().valid("client", "vendor").required().messages({
    "any.only": "backend.type_invalid",
    "any.required": "backend.type_required",
  }),
}).messages({
  "object.unknown": "backend.unexpected_field_detectted_in_request_body",
});

// Reset Password
export const resetPasswordValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "backend.email_required",
    "string.email": "backend.email_invalid",
    "any.required": "backend.email_required",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.empty": "backend.new_password_required",
    "string.min": "backend.new_password_min_length",
    "any.required": "backend.new_password_required",
  }),
  type: Joi.string().valid("client", "vendor").required().messages({
    "any.only": "backend.type_invalid",
    "any.required": "backend.type_required",
  }),
  otp: Joi.string().length(4).required().messages({
    "string.empty": "backend.otp_required",
    "string.length": "backend.otp_invalid_length",
    "any.required": "backend.otp_required",
  }),
}).messages({
  "object.unknown": "backend.unexpected_field_detectted_in_request_body",
});
