import { Router } from "express";
import { verifyRole, verifyToken } from "../middleware";

import { deleteAccount } from "../controllers/client-controller";

const router = Router();

router.post(
  "/delete-account",
  verifyToken,
  verifyRole("client"),
  deleteAccount
);

router.get("get-brands");
router.get("/get-products");
router.get("/get-brand/:id");
router.get("/get-brand-products/:id");
router.get("/get-product/:id");
router.get("/get-wishlist"); // return the favorites brands and products
router.post("/add-to-wishlist"); // add a brand or a product to wishlist
router.get("get-notifications"); // get all notifications for user
router.post("mark-notification-as-read"); // mark notification as read
router.post("add-location"); // add new location
router.get("get-locations"); // get all locations for that user
router.delete("remove-location/:locationId"); // remove location by id
router.put("update-location/:locationId"); // update location by id
router.post("add-review"); // add review to brand
router.get("get-reviews/:brand_id"); // get reviews for brand

export default router;
