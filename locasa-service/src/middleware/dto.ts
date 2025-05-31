import {
  clientIdValidationSchema,
  createHotelSchema,
  createServiceBodyValidationSchema,
  deletePartnerSchema,
  editHotelSchema,
  editServiceBodyValidationSchema,
  hotelIdValidationSchema,
  keyValidationSchema,
  partnerValidationSchema,
  profileActionValidationSchema,
  serviceIdValidationSchema,
  updatePartnerSchema,
} from "../validators/admin";
import {
  connectedValidationSchema,
  hotelKeyValidationSchema,
  requestServiceValidationSchema,
} from "../validators/client";
import {
  changePasswordValidationSchema,
  requestBodyValidationSchema,
  userIdValidationSchema,
} from "../validators/profile";

export const validateHotelCreation = (req: any, res: any, next: any) => {
  const { error } = createHotelSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors at once
    allowUnknown: false, // Reject unknown fields
  });

  if (error) {
    console.log("error", error);
    return res.status(400).json({
      status: "Failed",

      message: error.details[0].message,
    });
  }

  next(); // Proceed to controller if validation passes
};
export const validateHotelEdit = (req: any, res: any, next: any) => {
  const { error } = editHotelSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors at once
    allowUnknown: false, // Reject unknown fields
  });

  if (error) {
    console.log("error", error);
    return res.status(400).json({
      status: "Failed",

      message: error.details[0].message,
    });
  }

  next(); // Proceed to controller if validation passes
};
export const validateKey = (req: any, res: any, next: any) => {
  const { error } = keyValidationSchema.validate(req.params, {
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
export const validateHotelId = (req: any, res: any, next: any) => {
  const { error } = hotelIdValidationSchema.validate(req.body, {
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
export const validateProfileAction = (req: any, res: any, next: any) => {
  const { error } = profileActionValidationSchema.validate(req.body, {
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
export const validateClientId = (req: any, res: any, next: any) => {
  const { error } = clientIdValidationSchema.validate(req.body, {
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
export const validateCreateService = (req: any, res: any, next: any) => {
  const { error } = createServiceBodyValidationSchema.validate(req.body, {
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

export const validateEditService = (req: any, res: any, next: any) => {
  const { error } = editServiceBodyValidationSchema.validate(req.body, {
    abortEarly: false, // Show all validation errors at once
    allowUnknown: false, // Reject unknown fields
  });
  console.log(req.body);
  if (error) {
    console.log("Validation error:", error);
    return res.status(400).json({
      status: "Failed",
      message: error.details.map((err) => err.message).join(", "),
    });
  }

  next(); // Proceed to the next middleware or controller if validation passes
};
export const validateServiceId = (req: any, res: any, next: any) => {
  const { error } = serviceIdValidationSchema.validate(req.body, {
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

export const validatePartnerCreation = (req: any, res: any, next: any) => {
  const { error } = partnerValidationSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    console.log("Validation error:", error);
    return res.status(400).json({
      status: "Failed",
      message: error.details.map((err) => err.message).join(", "),
    });
  }

  next();
};
export const validateHotelKey = (req: any, res: any, next: any) => {
  const { error } = hotelKeyValidationSchema.validate(req.body, {
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

export const validateConnected = (req: any, res: any, next: any) => {
  const { error } = connectedValidationSchema.validate(req.body, {
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
export const validateRequestService = (req: any, res: any, next: any) => {
  const { error } = requestServiceValidationSchema.validate(req.body, {
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
export const validateUserId = (req: any, res: any, next: any) => {
  const { error } = userIdValidationSchema.validate(req.params, {
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
export const validateAddTokenRequestBody = (req: any, res: any, next: any) => {
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
export const validateChangePassword = (req: any, res: any, next: any) => {
  const { error } = changePasswordValidationSchema.validate(req.body, {
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

export const validatePartnerUpdate = (req: any, res: any, next: any) => {
  const { error } = updatePartnerSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    console.log("Validation error:", error);
    return res.status(400).json({
      status: "Failed",
      message: error.details.map((err) => err.message).join(", "),
    });
  }

  next();
};
export const validatePartnerId = (req: any, res: any, next: any) => {
  const { error } = deletePartnerSchema.validate(req.body);

  if (error) {
    console.log("Validation error:", error);
    return res.status(400).json({
      status: "Failed",
      message: error.details.map((err) => err.message).join(", "),
    });
  }

  next();
};
