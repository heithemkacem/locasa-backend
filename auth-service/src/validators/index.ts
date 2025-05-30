import Joi from "joi";

// DTO for validating email, password, and name
export const registerValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters long.",
    "any.required": "Password is required.",
  }),
  name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
    "any.required": "Name is required.",
  }),
  type: Joi.string()
    .valid("client", "vendor") // Add more roles as needed
    .messages({
      "any.only": '"type" must be one of ["user", "admin"]',
      "any.required": "Role is required.",
    }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters long.",
    "any.required": "Password is required.",
  }),
  type: Joi.string()
    .valid("client", "vendor") // Add more roles as needed
    .messages({
      "any.only": '"type" must be one of ["user", "admin"]',
      "any.required": "Role is required.",
    }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const requestBodyValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  otp: Joi.string().length(4).required().messages({
    "string.empty": "OTP is required.",
    "string.length": "OTP must be exactly 4 characters long.",
    "any.required": "OTP is required.",
  }),
  type: Joi.string()
    .valid("reset-password", "created-account")
    .required()
    .messages({
      "string.empty": "Type is required.",
      "any.only": 'Type must be either "verification" or "reset"',
      "any.required": "Type is required.",
    }),
  userType: Joi.string()
    .valid("client", "vendor") // Add more roles as needed
    .messages({
      "any.only": '"type" must be one of ["user", "admin"]',
      "any.required": "Role is required.",
    }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const resendOTP = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),

  type: Joi.string()
    .valid("reset-password", "created-account")
    .required()
    .messages({
      "string.empty": "Type is required.",
      "any.only": 'Type must be either "verification" or "reset"',
      "any.required": "Type is required.",
    }),
  userType: Joi.string()
    .valid("client", "vendor") // Add more roles as needed
    .messages({
      "any.only": '"type" must be one of ["user", "admin"]',
      "any.required": "Role is required.",
    }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});

export const forgetPassword = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  type: Joi.string()
    .valid("client", "vendor") // Add more roles as needed
    .messages({
      "any.only": '"type" must be one of ["user", "admin"]',
      "any.required": "Role is required.",
    }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const resetPasswordValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.empty": "New password is required.",
    "string.min": "New password must be at least 8 characters long.",
    "any.required": "New password is required.",
  }),
  type: Joi.string()
    .valid("client", "vendor") // Add more roles as needed
    .messages({
      "any.only": '"type" must be one of ["user", "admin"]',
      "any.required": "Role is required.",
    }),
  otp: Joi.string().length(4).required().messages({
    "string.empty": "OTP is required.",
    "string.length": "OTP must be exactly 4 characters long.",
    "any.required": "OTP is required.",
  }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
