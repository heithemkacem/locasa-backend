import { Router } from "express";
import { verifyRole, verifyToken } from "../middleware";
import { upload } from "../config/aws";
import {
  validateAddBrand,
  validateEditBrand,
  validateAddProduct,
  validateEditProduct,
  validateUpdateOrderStatus,
} from "../middleware/vendor_dto";
import {
  addBrand,
  editBrand,
  getBrand,
  deleteBrand,
  addProduct,
  editProduct,
  getProducts,
  getProductsByBrand,
  getProduct,
  deleteProduct,
  getOrders,
  getOrdersByBrand,
  updateOrderStatus,
  getOrder,
  getBrands,
  getCategories,
  getCategoriesList,
} from "../controllers/vendor-controller";

const router = Router();

// Brand routes
router.post(
  "/add-brand",
  verifyToken,
  verifyRole("vendor"),
  upload.single("logo"),
  validateAddBrand,
  addBrand
);
router.post(
  "/edit-brand/:id",
  verifyToken,
  verifyRole("vendor"),
  upload.single("logo"),
  validateEditBrand,
  editBrand
);
router.get("/get-brands", verifyToken, verifyRole("vendor"), getBrands);
router.get("/get-brand/:id", verifyToken, verifyRole("vendor"), getBrand);
router.delete(
  "/delete-brand/:id",
  verifyToken,
  verifyRole("vendor"),
  deleteBrand
);

//Product routers

// Product routes
router.post(
  "/add-product",
  verifyToken,
  verifyRole("vendor"),
  validateAddProduct,
  addProduct
);
router.post(
  "/edit-product/:id",
  verifyToken,
  verifyRole("vendor"),
  validateEditProduct,
  editProduct
);
router.get("/get-products", verifyToken, verifyRole("vendor"), getProducts);
router.get(
  "/get-products/:brand_id",
  verifyToken,
  verifyRole("vendor"),
  getProductsByBrand
);
router.get("/get-product/:id", verifyToken, verifyRole("vendor"), getProduct);
router.delete(
  "/delete-product/:id",
  verifyToken,
  verifyRole("vendor"),
  deleteProduct
);
// Order routes
router.get("/get-orders", verifyToken, verifyRole("vendor"), getOrders);
router.get(
  "/get-orders/:brand_id",
  verifyToken,
  verifyRole("vendor"),
  getOrdersByBrand
);
router.post(
  "/update-order-status/:id",
  verifyToken,
  verifyRole("vendor"),
  validateUpdateOrderStatus,
  updateOrderStatus
);
router.get("/get-order/:id", verifyToken, verifyRole("vendor"), getOrder);

// Product routes
router.post(
  "/add-product",
  verifyToken,
  verifyRole("vendor"),
  validateAddProduct,
  addProduct
);
router.post(
  "/edit-product/:id",
  verifyToken,
  verifyRole("vendor"),
  validateEditProduct,
  editProduct
);
router.get("/get-products", verifyToken, verifyRole("vendor"), getProducts);
router.get(
  "/get-products/:brand_id",
  verifyToken,
  verifyRole("vendor"),
  getProductsByBrand
);
router.get("/get-product/:id", verifyToken, verifyRole("vendor"), getProduct);
router.delete(
  "/delete-product/:id",
  verifyToken,
  verifyRole("vendor"),
  deleteProduct
);
// Category routes
router.get("/get-categories", verifyToken, verifyRole("vendor"), getCategories);
router.get(
  "/get-categories-list",
  verifyToken,
  verifyRole("vendor"),
  getCategoriesList
);
export default router;
