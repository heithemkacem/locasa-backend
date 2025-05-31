import Joi from "joi";
const objectIdPattern = /^[a-fA-F0-9]{24}$/;
// DTO for creating a hotel
export const createHotelSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Hotel name is required.",
    "any.required": "Hotel name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Valid email is required.",
    "any.required": "Email is required.",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required.",
    "any.required": "Description is required.",
  }),
  phone: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)
    .required()
    .messages({
      "string.empty": "Phone number is required.",
      "string.pattern.base": "Valid phone number required.",
      "any.required": "Phone number is required.",
    }),
  website: Joi.string().uri().required().messages({
    "string.empty": "Website URL is required.",
    "string.uri": "Valid website URL required.",
    "any.required": "Website URL is required.",
  }),
  rating: Joi.number().min(0).max(5).precision(1).required().messages({
    "number.base": "Rating must be a number.",
    "number.min": "Rating must be at least 0.",
    "number.max": "Rating cannot exceed 5.",
    "any.required": "Rating is required.",
  }),
  location: Joi.string().required().messages({
    "string.empty": "Address is required.",
  }),
  position: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
  })
    .required()
    .messages({
      "object.base": "Position object is required.",
      "any.required": "Position is required.",
    }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const editHotelSchema = Joi.object({
  name: Joi.string().min(1).optional().messages({
    "string.empty": "Hotel name is required.",
    "string.min": "Hotel name must be at least 1 character.",
    "string.base": "Hotel name must be a string.",
  }),
  email: Joi.string().email().optional().messages({
    "string.empty": "Email is required.",
    "string.email": "Valid email is required.",
    "string.base": "Email must be a string.",
  }),
  description: Joi.string().min(1).optional().messages({
    "string.empty": "Description is required.",
    "string.min": "Description must be at least 1 character.",
    "string.base": "Description must be a string.",
  }),
  phone: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/)
    .optional()
    .messages({
      "string.empty": "Phone number is required.",
      "string.pattern.base": "Valid phone number required.",
      "string.base": "Phone number must be a string.",
    }),
  website: Joi.string().uri().optional().messages({
    "string.empty": "Website URL is required.",
    "string.uri": "Valid website URL required.",
    "string.base": "Website URL must be a string.",
  }),
  rating: Joi.number().min(0).max(5).precision(1).optional().messages({
    "number.base": "Rating must be a number.",
    "number.min": "Rating must be at least 0.",
    "number.max": "Rating cannot exceed 5.",
    "number.precision": "Rating can have up to 1 decimal place.",
  }),
  location: Joi.string().min(1).optional().messages({
    "string.empty": "Address is required.",
    "string.base": "Address must be a string.",
    "string.min": "Address must be at least 1 character.",
  }),
  position: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
  })
    .optional()
    .messages({
      "object.base": "Position must be an object.",
      "object.missing": "Position requires both latitude and longitude.",
    }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const keyValidationSchema = Joi.object({
  id: Joi.string().pattern(objectIdPattern).required().messages({
    "string.empty": "Hotel ID is required.",
    "string.pattern.base": "Hotel ID must be a valid Mongoose ObjectId.",
    "any.required": "Hotel ID is required.",
  }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const hotelIdValidationSchema = Joi.object({
  hotelId: Joi.string().pattern(objectIdPattern).required().messages({
    "string.empty": "Hotel ID is required.",
    "string.pattern.base": "Hotel ID must be a valid Mongoose ObjectId.",
    "any.required": "Hotel ID is required.",
  }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const profileActionValidationSchema = Joi.object({
  profileId: Joi.string().pattern(objectIdPattern).required().messages({
    "string.empty": "Profile ID is required.",
    "string.pattern.base": "Profile ID must be a valid Mongoose ObjectId.",
    "any.required": "Profile ID is required.",
  }),
  action: Joi.string().valid("block", "unblock").required().messages({
    "string.empty": "Action is required.",
    "any.only": 'Action must be either "block" or "unblock".',
    "any.required": "Action is required.",
  }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const clientIdValidationSchema = Joi.object({
  clientId: Joi.string().pattern(objectIdPattern).required().messages({
    "string.empty": "Client ID is required.",
    "string.pattern.base": "Client ID must be a valid Mongoose ObjectId.",
    "any.required": "Client ID is required.",
  }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const createServiceBodyValidationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 100 characters.",
    "any.required": "Name is required.",
  }),
  icon: Joi.string().required().messages({
    "string.empty": "Icon is required.",
    "any.required": "Icon is required.",
  }),
  description: Joi.string().min(10).max(500).required().messages({
    "string.empty": "Description is required.",
    "string.min": "Description must be at least 10 characters long.",
    "string.max": "Description cannot exceed 500 characters.",
    "any.required": "Description is required.",
  }),
  key: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Key is required.",
    "string.min": "Key must be at least 5 characters long.",
    "string.max": "Key cannot exceed 50 characters.",
    "any.required": "Key is required.",
  }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});

export const editServiceBodyValidationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 100 characters.",
    "any.required": "Name is required.",
  }),
  description: Joi.string().min(10).max(500).required().messages({
    "string.empty": "Description is required.",
    "string.min": "Description must be at least 10 characters long.",
    "string.max": "Description cannot exceed 500 characters.",
    "any.required": "Description is required.",
  }),
  serviceId: Joi.string().pattern(objectIdPattern).required().messages({
    "string.empty": "Service ID is required.",
    "string.pattern.base": "Service ID must be a valid Mongoose ObjectId.",
    "any.required": "Service ID is required.",
  }),
  key: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Key is required.",
    "string.min": "Key must be at least 3 characters long.",
    "string.max": "Key cannot exceed 50 characters.",
    "any.required": "Key is required.",
  }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const serviceIdValidationSchema = Joi.object({
  serviceId: Joi.string().pattern(objectIdPattern).required().messages({
    "string.empty": "Service ID is required.",
    "string.pattern.base": "Service ID must be a valid Mongoose ObjectId.",
    "any.required": "Service ID is required.",
  }),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});
export const partnerValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required.",
    "any.required": "Description is required.",
  }),
  type: Joi.string()
    .valid("guide", "hotel", "restaurant", "transport", "activities")
    .required()
    .messages({
      "any.only":
        "Type must be one of guide, hotel, restaurant, transport, or activities.",
      "any.required": "Type is required.",
    }),
  coordinates: Joi.object({
    latitude: Joi.number().required().messages({
      "number.base": "Latitude must be a number.",
      "any.required": "Latitude is required.",
    }),
    longitude: Joi.number().required().messages({
      "number.base": "Longitude must be a number.",
      "any.required": "Longitude is required.",
    }),
  })
    .required()
    .messages({
      "any.required": "Position is required.",
    }),
  image: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URI.",
  }),
  location: Joi.string().optional(),
  phone: Joi.string().optional(),
}).messages({
  "object.unknown": "Unexpected field detected in request body.",
});

export const updatePartnerSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),
  description: Joi.string().required().messages({
    "string.empty": "Description is required.",
    "any.required": "Description is required.",
  }),
  type: Joi.string()
    .valid("guide", "hotel", "restaurant", "transport", "activities")
    .required()
    .messages({
      "any.only":
        "Type must be one of guide, hotel, restaurant, transport, or activities.",
      "any.required": "Type is required.",
    }),
  coordinates: Joi.object({
    latitude: Joi.number().required().messages({
      "number.base": "Latitude must be a number.",
      "any.required": "Latitude is required.",
    }),
    longitude: Joi.number().required().messages({
      "number.base": "Longitude must be a number.",
      "any.required": "Longitude is required.",
    }),
  })
    .required()
    .messages({
      "any.required": "Position is required.",
    }),
  image: Joi.string().uri().optional().messages({
    "string.uri": "Image must be a valid URI.",
  }),
  location: Joi.string().optional(),
  phone: Joi.string().optional(),
});
export const deletePartnerSchema = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    "string.length": "Partner ID must be a 24-character hex string",
    "string.hex": "Partner ID must be a valid Mongo ObjectId",
  }),
});
