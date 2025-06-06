import Joi from "joi";

// Brand DTOs
export const addBrandSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "backend.brand_name_required",
    "any.required": "backend.brand_name_required",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "backend.brand_description_must_be_string",
  }),
  logo: Joi.string().optional().allow("").messages({
    "string.base": "backend.brand_logo_must_be_string",
  }),
  website: Joi.string().optional().allow("").messages({
    "string.base": "backend.brand_website_must_be_string",
  }),
  email: Joi.string().email().optional().allow("").messages({
    "string.email": "backend.brand_email_invalid",
  }),
  phone: Joi.string().optional().allow("").messages({
    "string.base": "backend.brand_phone_must_be_string",
  }),
  location: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "backend.brand_location_invalid",
      "any.required": "backend.brand_location_required",
    }),
  category: Joi.string().required().messages({
    "string.empty": "backend.brand_category_required",
    "any.required": "backend.brand_category_required",
  }),
}).messages({
  "object.unknown": "backend.unexpected_field_detected",
});

export const editBrandSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "backend.brand_name_must_be_string",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "backend.brand_description_must_be_string",
  }),
  logo: Joi.string().optional().allow("").messages({
    "string.base": "backend.brand_logo_must_be_string",
  }),
  website: Joi.string().optional().allow("").messages({
    "string.base": "backend.brand_website_must_be_string",
  }),
  email: Joi.string().email().optional().allow("").messages({
    "string.email": "backend.brand_email_invalid",
  }),
  phone: Joi.string().optional().allow("").messages({
    "string.base": "backend.brand_phone_must_be_string",
  }),
  location: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "backend.brand_location_invalid",
    }),
  category: Joi.string().optional().messages({
    "string.base": "backend.brand_category_must_be_string",
  }),
}).messages({
  "object.unknown": "backend.unexpected_field_detected",
});

// Product DTOs
export const addProductSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "backend.product_name_required",
    "any.required": "backend.product_name_required",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "backend.product_description_must_be_string",
  }),
  category: Joi.string().required().messages({
    "string.empty": "backend.product_category_required",
    "any.required": "backend.product_category_required",
  }),
  price: Joi.number().required().min(0).messages({
    "number.base": "backend.product_price_must_be_number",
    "number.min": "backend.product_price_must_be_positive",
    "any.required": "backend.product_price_required",
  }),
  promotionPrice: Joi.number().optional().min(0).messages({
    "number.base": "backend.product_promotion_price_must_be_number",
    "number.min": "backend.product_promotion_price_must_be_positive",
  }),
  brand: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "backend.product_brand_invalid",
      "any.required": "backend.product_brand_required",
    }),
  images: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "backend.product_images_must_be_array",
  }),
  colors: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "backend.product_colors_must_be_array",
  }),
  sizes: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "backend.product_sizes_must_be_array",
  }),
  details: Joi.object().optional().messages({
    "object.base": "backend.product_details_must_be_object",
  }),
}).messages({
  "object.unknown": "backend.unexpected_field_detected",
});

export const editProductSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "backend.product_name_must_be_string",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "backend.product_description_must_be_string",
  }),
  category: Joi.string().optional().messages({
    "string.base": "backend.product_category_must_be_string",
  }),
  price: Joi.number().optional().min(0).messages({
    "number.base": "backend.product_price_must_be_number",
    "number.min": "backend.product_price_must_be_positive",
  }),
  promotionPrice: Joi.number().optional().min(0).messages({
    "number.base": "backend.product_promotion_price_must_be_number",
    "number.min": "backend.product_promotion_price_must_be_positive",
  }),
  brand: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "backend.product_brand_invalid",
    }),
  images: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "backend.product_images_must_be_array",
  }),
  colors: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "backend.product_colors_must_be_array",
  }),
  sizes: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "backend.product_sizes_must_be_array",
  }),
  details: Joi.object().optional().messages({
    "object.base": "backend.product_details_must_be_object",
  }),
}).messages({
  "object.unknown": "backend.unexpected_field_detected",
});

// Order DTO
export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("Pending", "Shipped", "Delivered", "Cancelled")
    .required()
    .messages({
      "any.only": "backend.order_status_invalid",
      "any.required": "backend.order_status_required",
    }),
}).messages({
  "object.unknown": "backend.unexpected_field_detected",
});
