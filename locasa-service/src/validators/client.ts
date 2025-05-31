import Joi from "joi";
const objectIdPattern = /^[a-fA-F0-9]{24}$/;
// DTO for validating hotelKey
export const hotelKeyValidationSchema = Joi.object({
  hotelKey: Joi.string().min(4).max(4).required().messages({
    "string.empty": "Hotel Key is required.",
    "string.min": "Hotel Key must be at least 4 characters long.",
    "string.max": "Hotel Key cannot exceed 4 characters.",
    "any.required": "Hotel Key is required.",
  }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const connectedValidationSchema = Joi.object({
  connected: Joi.boolean().required().messages({
    "any.required": "Hotel Key is required.",
  }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const requestServiceValidationSchema = Joi.object({
  roomNumber: Joi.string().required().messages({
    "string.empty": "Room number is required.",
    "any.required": "Room number is required.",
  }),
  serviceId: Joi.string().pattern(objectIdPattern).required().messages({
    "string.empty": "Service ID is required.",
    "string.pattern.base": "Service ID must be a valid Mongoose ObjectId.",
    "any.required": "Service ID is required.",
  }),
  message: Joi.string().max(500).optional().allow("").messages({
    "string.max": "Message cannot exceed 500 characters.",
  }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
