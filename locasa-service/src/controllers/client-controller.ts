import { Request, Response } from "express";
import {
  Client,
  ExpoPushToken,
  OTP,
  Profile,
  Brand,
  Product,
  Location,
  Review,
  Notification,
} from "../database";
import { getPaginationOptions, paginateQuery } from "../utils/pagination";
import { AuthedRequest } from "../types/custom/custom";
import { errorResponse, successResponse } from "../utils";
import { typesense } from "../services/TypeSenseClient";
import mongoose from "mongoose";

export const deleteAccount = async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const client = (await Client.findById(userId)) as any;
    const profile = await Profile.findById(req.user?.id);

    if (!client || !profile) {
      return errorResponse(res, "client_or_profile_not_found", 404);
    }

    await ExpoPushToken.deleteMany({ user_id: profile._id });
    await OTP.deleteMany({ email: profile.email });

    await Promise.all([
      Client.deleteOne({ _id: client._id }),
      Profile.deleteOne({ _id: profile._id }),
    ]);

    return successResponse(res, "account_deleted_successfully");
  } catch (error: any) {
    return errorResponse(res, error.message || "server_error", 500);
  }
};
export const getBrands = async (req: Request, res: Response) => {
  try {
    const paginationOptions = getPaginationOptions(req);

    const query = Brand.find()
      .sort({ createdAt: -1 })
      .select("name description logo");

    const result = await paginateQuery(query, paginationOptions);
    return successResponse(res, "backend.brands_found", result);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return errorResponse(res, "backend.failed_to_fetch_brands", 500);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const paginationOptions = getPaginationOptions(req);
    const query = Product.find()
      .sort({ createdAt: -1 })
      .select("name price images ");

    const result = await paginateQuery(query, paginationOptions);
    return successResponse(res, "backend.products_found", result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return errorResponse(res, "backend.failed_to_fetch_products", 500);
  }
};

export const getBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clientId = req.user?.user_id;

    const [brand, client] = await Promise.all([
      Brand.findById(id)
        .populate("location vendor category")
        .populate({
          path: "reviews",
          populate: { path: "user", select: "name " },
        }),
      clientId ? Client.findById(clientId).select("favorite_brands") : null,
    ]);

    if (!brand) {
      return errorResponse(res, "backend.brand_not_found", 404);
    }

    const isFavorite =
      client && Array.isArray(client.favorite_brands)
        ? client.favorite_brands.some(
            (favId) => favId.toString() === id.toString()
          )
        : false;
    const response = {
      brand,
      isFavorite,
    };

    return successResponse(res, "backend.brand_found", response);
  } catch (error) {
    console.error("Error fetching brand:", error);
    return errorResponse(res, "backend.failed_to_fetch_brand", 500);
  }
};
// Brand & Product Controllers
export const getBrandProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const paginationOptions = getPaginationOptions(req);

    const query = Product.find({ brand: id })
      .populate("brand")
      .sort({ createdAt: -1 });

    const result = await paginateQuery(query, paginationOptions);
    return successResponse(res, "backend.products_found", result);
  } catch (error) {
    console.error("Error fetching brand products:", error);
    return errorResponse(res, "backend.failed_to_fetch_products", 500);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("brand");
    if (!product) {
      return errorResponse(res, "backend.product_not_found", 404);
    }
    return successResponse(res, "backend.product_found", { product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return errorResponse(res, "backend.failed_to_fetch_product", 500);
  }
};

// Wishlist Controllers
export const getBrandsWishlist = async (req: Request, res: Response) => {
  try {
    const clientId = req.user?.user_id;
    const paginationOptions = getPaginationOptions(req);
    const client = await Client.findById(clientId);

    if (!client) {
      return errorResponse(res, "backend.client_not_found", 404);
    }

    // If there are no favorites, return empty result with pagination
    if (!client.favorite_brands?.length) {
      return successResponse(res, "backend.wishlist_found", {
        items: [],
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    }

    const query = Brand.find({ _id: { $in: client.favorite_brands || [] } })
      .sort({ createdAt: -1 })
      .select("logo name description");

    const paginatedBrands = await paginateQuery(query, paginationOptions);

    return successResponse(res, "backend.wishlist_found", paginatedBrands);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return errorResponse(res, "backend.failed_to_fetch_wishlist", 500);
  }
};

// Wishlist Controllers
export const getProductsWishlist = async (req: Request, res: Response) => {
  try {
    const clientId = req.user?.user_id;
    const paginationOptions = getPaginationOptions(req);
    const client = await Client.findById(clientId);

    if (!client) {
      return errorResponse(res, "backend.client_not_found", 404);
    }

    // If there are no favorites, return empty result with pagination
    if (!client.favorite_products?.length) {
      return successResponse(res, "backend.wishlist_found", {
        items: [],
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    }

    const query = Product.find({ _id: { $in: client.favorite_products || [] } })
      .sort({ createdAt: -1 })
      .select("name price images brand ")
      .populate("brand")
      .select("name");

    const paginatedProducts = await paginateQuery(query, paginationOptions);

    return successResponse(res, "backend.wishlist_found", paginatedProducts);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return errorResponse(res, "backend.failed_to_fetch_wishlist", 500);
  }
};
export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const clientId = req.user?.user_id;
    const { type, itemId } = req.body;

    const updateField =
      type === "brand" ? "favorite_brands" : "favorite_products";

    // First check if item already exists in favorites
    const existingClient = await Client.findById(clientId);

    if (!existingClient) {
      return errorResponse(res, "backend.client_not_found", 404);
    }

    const favorites = existingClient[updateField] || [];
    if (favorites.includes(itemId)) {
      return errorResponse(res, "backend.item_already_in_wishlist", 400);
    }

    const client = await Client.findByIdAndUpdate(
      clientId,
      { $addToSet: { [updateField]: itemId } },
      { new: true }
    );

    return successResponse(res, "backend.item_added_to_wishlist");
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return errorResponse(res, "backend.failed_to_add_to_wishlist", 500);
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const clientId = req.user?.user_id;
    const { type, itemId } = req.body;
    console.log(type, itemId);

    const updateField =
      type === "brand" ? "favorite_brands" : "favorite_products";

    // Convert itemId to ObjectId for consistent comparison
    const objectId = new mongoose.Types.ObjectId(itemId);

    // First check if item exists in favorites
    const existingClient = await Client.findById(clientId);
    if (!existingClient) {
      return errorResponse(res, "backend.client_not_found", 404);
    }

    const favorites = existingClient[updateField] || [];
    console.log("Current favorites:", favorites);

    // Check if item exists using ObjectId comparison
    if (!favorites.some((id) => id.toString() === objectId.toString())) {
      return errorResponse(res, "backend.item_not_in_wishlist", 404);
    }

    // Remove the item using ObjectId
    const client = await Client.findByIdAndUpdate(
      clientId,
      { $pull: { [updateField]: objectId } },
      { new: true }
    );

    if (!client) {
      return errorResponse(res, "backend.update_failed", 500);
    }

    // Verify the item was actually removed
    const updatedFavorites = client[updateField] || [];
    console.log("Updated favorites after removal:", updatedFavorites);

    // Use toString() for proper comparison
    if (updatedFavorites.some((id) => id.toString() === objectId.toString())) {
      console.error("Item still exists after removal attempt");
      return errorResponse(res, "backend.failed_to_remove_from_wishlist", 500);
    }

    console.log("Item successfully removed from wishlist");
    return successResponse(res, "backend.item_removed_from_wishlist");
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return errorResponse(res, "backend.failed_to_remove_from_wishlist", 500);
  }
};
// Location Controllers
export const addLocation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const locationData = {
      ...req.body,
      profile: userId,
    };

    const location = await Location.create(locationData);
    return successResponse(res, "backend.location_added", { location });
  } catch (error) {
    console.error("Error adding location:", error);
    return errorResponse(res, "backend.failed_to_add_location", 500);
  }
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const paginationOptions = getPaginationOptions(req);

    const query = Location.find({ profile: userId }).sort({ createdAt: -1 });

    const result = await paginateQuery(query, paginationOptions);
    return successResponse(res, "backend.locations_found", result);
  } catch (error) {
    console.error("Error fetching locations:", error);
    return errorResponse(res, "backend.failed_to_fetch_locations", 500);
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const { locationId } = req.params;
    const userId = req.user?.id;

    const location = await Location.findOneAndUpdate(
      { _id: locationId, profile: userId },
      { $set: req.body },
      { new: true }
    );

    if (!location) {
      return errorResponse(res, "backend.location_not_found", 404);
    }

    return successResponse(res, "backend.location_updated", { location });
  } catch (error) {
    console.error("Error updating location:", error);
    return errorResponse(res, "backend.failed_to_update_location", 500);
  }
};

export const removeLocation = async (req: Request, res: Response) => {
  try {
    const { locationId } = req.params;
    const userId = req.user?.id;

    const location = await Location.findOneAndDelete({
      _id: locationId,
      profile: userId,
    });

    if (!location) {
      return errorResponse(res, "backend.location_not_found", 404);
    }

    return successResponse(res, "backend.location_removed");
  } catch (error) {
    console.error("Error removing location:", error);
    return errorResponse(res, "backend.failed_to_remove_location", 500);
  }
};
export const addReview = async (req: Request, res: Response) => {
  try {
    const clientId = req.user?.user_id;
    const { brandId, rating, comment } = req.body;
    const reviewData = {
      brand: brandId,
      rating,
      comment,
      user: clientId,
    };

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create the review
      const review = await Review.create([reviewData], { session });

      // Calculate new average rating
      const reviews = await Review.find({ brand: brandId }, null, { session });
      const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
      const averageRating = totalRating / reviews.length;

      // Update brand with new review and rating
      await Brand.findByIdAndUpdate(
        brandId,
        {
          $push: { reviews: review[0]._id },
          $set: { rating: Number(averageRating.toFixed(1)) },
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      return successResponse(res, "backend.review_added", {
        review: review[0],
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error adding review:", error);
    return errorResponse(res, "backend.failed_to_add_review", 500);
  }
};

export const getReviews = async (req: Request, res: Response) => {
  try {
    const { brand_id } = req.params;
    const paginationOptions = getPaginationOptions(req);

    const query = Review.find({ brandId: brand_id })
      .populate("user", "name ")
      .sort({ createdAt: -1 });

    const result = await paginateQuery(query, paginationOptions);
    return successResponse(res, "backend.reviews_found", result);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return errorResponse(res, "backend.failed_to_fetch_reviews", 500);
  }
};

// Notification Controllers
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const paginationOptions = getPaginationOptions(req);

    const query = Notification.find({ profile: userId }).sort({
      createdAt: -1,
    });

    const result = await paginateQuery(query, paginationOptions);
    return successResponse(res, "backend.notifications_found", result);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return errorResponse(res, "backend.failed_to_fetch_notifications", 500);
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.body;
    const userId = req.user?.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, profile: userId },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return errorResponse(res, "backend.notification_not_found", 404);
    }

    return successResponse(res, "backend.notification_marked_as_read");
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return errorResponse(res, "backend.failed_to_mark_notification", 500);
  }
};
export const smartSearch = async (req: any, res: any) => {
  const { q, type } = req.body;

  if (!q || typeof q !== "string") {
    return res.status(400).json({ error: "Query parameter 'q' is required." });
  }

  try {
    if (type === "brand") {
      const searchResults = await typesense
        .collections("brands")
        .documents()
        .search({
          q,
          query_by: "name",
        });

      return res.json({
        brands: searchResults.hits?.map((hit: any) => hit.document) ?? [],
      });
    } else if (type === "product") {
      const searchResults = await typesense
        .collections("products")
        .documents()
        .search({
          q,
          query_by: "name,category,brand",
        });

      return res.json({
        products: searchResults.hits?.map((hit: any) => hit.document) ?? [],
      });
    } else {
      const [brandResults, productResults] = await Promise.all([
        typesense
          .collections("brands")
          .documents()
          .search({ q, query_by: "name" }),
        typesense
          .collections("products")
          .documents()
          .search({ q, query_by: "name,category,brand" }),
      ]);

      return res.json({
        brands: brandResults.hits?.map((hit: any) => hit.document) ?? [],
        products: productResults.hits?.map((hit: any) => hit.document) ?? [],
      });
    }
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
