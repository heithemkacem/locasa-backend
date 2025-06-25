import Joi from "joi";

// Location DTOs
export const addLocationSchema = Joi.object({
  address: Joi.string().required().messages({
    "string.empty": "backend.location_address_required",
    "any.required": "backend.location_address_required",
  }),
  latitude: Joi.number().optional().messages({
    "number.base": "backend.location_latitude_must_be_number",
  }),
  longitude: Joi.number().optional().messages({
    "number.base": "backend.location_longitude_must_be_number",
  }),
  city: Joi.string().required().messages({
    "string.empty": "backend.location_city_required",
    "any.required": "backend.location_city_required",
  }),
  state: Joi.string().required().messages({
    "string.empty": "backend.location_state_required",
    "any.required": "backend.location_state_required",
  }),
  country: Joi.string().required().messages({
    "string.empty": "backend.location_country_required",
    "any.required": "backend.location_country_required",
  }),
  zipCode: Joi.string().required().messages({
    "string.empty": "backend.location_zipcode_required",
    "any.required": "backend.location_zipcode_required",
  }),
  type: Joi.string().valid("home", "workplace", "other").required().messages({
    "any.only": "backend.location_type_invalid",
    "any.required": "backend.location_type_required",
  }),
  isDefault: Joi.boolean().optional().default(false),
}).messages({
  "object.unknown": "backend.unexpected_field_detected",
});

export const updateLocationSchema = Joi.object({
  address: Joi.string().optional().messages({
    "string.empty": "backend.location_address_required",
  }),
  latitude: Joi.number().optional().messages({
    "number.base": "backend.location_latitude_must_be_number",
  }),
  longitude: Joi.number().optional().messages({
    "number.base": "backend.location_longitude_must_be_number",
  }),
  city: Joi.string().optional().messages({
    "string.empty": "backend.location_city_required",
  }),
  state: Joi.string().optional().messages({
    "string.empty": "backend.location_state_required",
  }),
  country: Joi.string().optional().messages({
    "string.empty": "backend.location_country_required",
  }),
  zipCode: Joi.string().optional().messages({
    "string.empty": "backend.location_zipcode_required",
  }),
  type: Joi.string().valid("home", "workplace", "other").optional().messages({
    "any.only": "backend.location_type_invalid",
  }),
  isDefault: Joi.boolean().optional(),
}).messages({
  "object.unknown": "backend.unexpected_field_detected",
});

// Wishlist DTOs
export const addToWishlistSchema = Joi.object({
  type: Joi.string().valid("brand", "product").required().messages({
    "any.only": "backend.wishlist_type_invalid",
    "any.required": "backend.wishlist_type_required",
  }),
  itemId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "backend.wishlist_item_id_invalid",
      "any.required": "backend.wishlist_item_id_required",
    }),
}).messages({
  "object.unknown": "backend.unexpected_field_detected",
});

// Review DTOs
export const addReviewSchema = Joi.object({
  brandId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "backend.review_brand_id_invalid",
      "any.required": "backend.review_brand_id_required",
    }),
  rating: Joi.number().min(1).max(5).required().messages({
    "number.base": "backend.review_rating_must_be_number",
    "number.min": "backend.review_rating_min",
    "number.max": "backend.review_rating_max",
    "any.required": "backend.review_rating_required",
  }),
  comment: Joi.string().required().messages({
    "string.empty": "backend.review_comment_required",
    "any.required": "backend.review_comment_required",
  }),
}).messages({
  "object.unknown": "backend.unexpected_field_detected",
});

// Notification DTOs
export const markNotificationAsReadSchema = Joi.object({
  notificationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "backend.notification_id_invalid",
      "any.required": "backend.notification_id_required",
    }),
}).messages({
  "object.unknown": "backend.unexpected_field_detected",
});

// Order DTOs
export const createOrderSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required()
          .messages({
            "string.pattern.base": "backend.product_id_invalid",
            "any.required": "backend.product_id_required",
          }),
        quantity: Joi.number().integer().min(1).max(999).required().messages({
          "number.base": "backend.quantity_must_be_number",
          "number.integer": "backend.quantity_must_be_integer",
          "number.min": "backend.quantity_min",
          "number.max": "backend.quantity_max",
          "any.required": "backend.quantity_required",
        }),
      }).messages({
        "object.unknown": "backend.unexpected_field_in_product",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "backend.order_products_must_be_array",
      "array.min": "backend.order_products_required",
      "any.required": "backend.order_products_required",
    }),
  brandId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "backend.brand_id_invalid",
      "any.required": "backend.brand_id_required",
    }),
  locationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "backend.location_id_invalid",
      "any.required": "backend.location_id_required",
    }),
  totalPrice: Joi.number().min(0).optional().messages({
    "number.base": "backend.total_price_must_be_number",
    "number.min": "backend.total_price_must_be_positive",
  }),
}).messages({
  "object.unknown": "backend.unexpected_field_detected",
});
