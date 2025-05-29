import {
  forgetPassword,
  loginValidationSchema,
  registerValidationSchema,
  requestBodyValidationSchema,
  resendOTP,
  resetPasswordValidationSchema,
} from "../validators";

export const validateRegister = (req: any, res: any, next: any) => {
  const { error } = registerValidationSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors at once
    allowUnknown: false, // Reject unknown fields
  });

  if (error) {
    console.log("Validation error:", error);
    return res.status(400).json({
      status: "Failed",
      message: error.details.map((err) => err.message).join(", "),
    });
  }

  next(); // Proceed to the next middleware or controller if validation passes
};
export const validateLogin = (req: any, res: any, next: any) => {
  const { error } = loginValidationSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors at once
    allowUnknown: false, // Reject unknown fields
  });

  if (error) {
    console.log("Validation error:", error);
    return res.status(400).json({
      status: "Failed",
      message: error.details.map((err) => err.message).join(", "),
    });
  }

  next(); // Proceed to the next middleware or controller if validation passes
};
export const validateOTPRequestBody = (req: any, res: any, next: any) => {
  const { error } = requestBodyValidationSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors at once
    allowUnknown: false, // Reject unknown fields
  });

  if (error) {
    console.log("Validation error:", error);
    return res.status(400).json({
      status: "Failed",
      message: error.details.map((err) => err.message).join(", "),
    });
  }

  next(); // Proceed to the next middleware or controller if validation passes
};
export const resendOTPRequestBody = (req: any, res: any, next: any) => {
  const { error } = resendOTP.validate(req.body, {
    abortEarly: false, // Show all validation errors at once
    allowUnknown: false, // Reject unknown fields
  });

  if (error) {
    console.log("Validation error:", error);
    return res.status(400).json({
      status: "Failed",
      message: error.details.map((err) => err.message).join(", "),
    });
  }

  next(); // Proceed to the next middleware or controller if validation passes
};

export const forgetPasswordRequestBody = (req: any, res: any, next: any) => {
  const { error } = forgetPassword.validate(req.body, {
    abortEarly: false, // Show all validation errors at once
    allowUnknown: false, // Reject unknown fields
  });

  if (error) {
    console.log("Validation error:", error);
    return res.status(400).json({
      status: "Failed",
      message: error.details.map((err) => err.message).join(", "),
    });
  }

  next(); // Proceed to the next middleware or controller if validation passes
};
export const validateResetPassword = (req: any, res: any, next: any) => {
  const { error } = resetPasswordValidationSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors at once
    allowUnknown: false, // Reject unknown fields
  });

  if (error) {
    console.log("Validation error:", error);
    return res.status(400).json({
      status: "Failed",
      message: error.details.map((err) => err.message).join(", "),
    });
  }

  next(); // Proceed to the next middleware or controller if validation passes
};
