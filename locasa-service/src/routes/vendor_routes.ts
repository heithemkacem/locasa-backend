import { Router } from "express";
import { verifyRole, verifyToken } from "../middleware";
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
} from "../controllers/vendor-controller";

const router = Router();

// Brand routes
router.post("/add-brand", verifyToken, verifyRole("vendor"), addBrand);
router.post("/edit-brand/:id", verifyToken, verifyRole("vendor"), editBrand);
router.get("/get-brand/:id", verifyToken, verifyRole("vendor"), getBrand);
router.delete(
  "/delete-brand/:id",
  verifyToken,
  verifyRole("vendor"),
  deleteBrand
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
  updateOrderStatus
);
router.get("/get-order/:id", verifyToken, verifyRole("vendor"), getOrder);

// Product routes
router.post("/add-product", verifyToken, verifyRole("vendor"), addProduct);
router.post(
  "/edit-product/:id",
  verifyToken,
  verifyRole("vendor"),
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

export default router;
