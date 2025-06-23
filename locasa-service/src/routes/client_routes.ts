import { Router } from "express";
import { verifyRole, verifyToken } from "../middleware";
import {
  validateAddLocation,
  validateUpdateLocation,
  validateAddToWishlist,
  validateAddReview,
  validateMarkNotificationAsRead,
} from "../middleware/client_dto";
import {
  deleteAccount,
  getBrands,
  getProducts,
  getBrand,
  getBrandProducts,
  getProduct,
  addToWishlist,
  getNotifications,
  markNotificationAsRead,
  addLocation,
  getLocations,
  removeLocation,
  updateLocation,
  addReview,
  getReviews,
  smartSearch,
  getBrandsWishlist,
  getProductsWishlist,
  removeFromWishlist,
} from "../controllers/client-controller";

const router = Router();

// Account Management
router.post(
  "/delete-account",
  verifyToken,
  verifyRole("client"),
  deleteAccount
);

// Brand & Product Routes
router.get("/get-brands", verifyToken, verifyRole("client"), getBrands);
router.get("/get-products", verifyToken, verifyRole("client"), getProducts);
router.get("/get-brand/:id", verifyToken, verifyRole("client"), getBrand);
router.get(
  "/get-brand-products/:id",
  verifyToken,
  verifyRole("client"),
  getBrandProducts
);
router.get("/get-product/:id", verifyToken, verifyRole("client"), getProduct);

// Wishlist Routes
router.get(
  "/get-brands-wishlist",
  verifyToken,
  verifyRole("client"),
  getBrandsWishlist
);
router.get(
  "/get-products-wishlist",
  verifyToken,
  verifyRole("client"),
  getProductsWishlist
);
router.post(
  "/add-to-wishlist",
  verifyToken,
  verifyRole("client"),
  validateAddToWishlist,
  addToWishlist
);
router.post(
  "/remove-from-wishlist",
  verifyToken,
  verifyRole("client"),
  validateAddToWishlist,
  removeFromWishlist
);

// Notification Routes
router.get(
  "/get-notifications",
  verifyToken,
  verifyRole("client"),
  getNotifications
);
router.post(
  "/mark-notification-as-read",
  verifyToken,
  verifyRole("client"),
  validateMarkNotificationAsRead,
  markNotificationAsRead
);

// Location Routes
router.post(
  "/add-location",
  verifyToken,
  verifyRole("client"),
  validateAddLocation,
  addLocation
);
router.get("/get-locations", verifyToken, verifyRole("client"), getLocations);
router.delete(
  "/remove-location/:locationId",
  verifyToken,
  verifyRole("client"),
  removeLocation
);
router.put(
  "/update-location/:locationId",
  verifyToken,
  verifyRole("client"),
  validateUpdateLocation,
  updateLocation
);

// Review Routes
router.post(
  "/add-review",
  verifyToken,
  verifyRole("client"),
  validateAddReview,
  addReview
);
router.get(
  "/get-reviews/:brand_id",
  verifyToken,
  verifyRole("client"),
  getReviews
);
router.get("/smart-search", verifyToken, verifyRole("client"), smartSearch);
export default router;
