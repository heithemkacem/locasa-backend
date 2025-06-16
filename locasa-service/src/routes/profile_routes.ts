import express from "express";
import {
  addToken,
  changePassword,
  getCategoriesList,
  getProfile,
  getUserProfile,
  updateProfile,
} from "../controllers/profiles-controller";
import { verifyRole, verifyToken } from "../middleware";
import {
  validateAddTokenRequestBody,
  validateChangePassword,
  validateUserId,
} from "../middleware/dto";

const router = express.Router();

//!Profile
router.get(
  "/profile/:id/:device_id",
  verifyToken,
  verifyRole("vendor", "client"),
  getProfile
);
router.get("/user-profile/:id", verifyToken, getUserProfile);
router.patch(
  "/profile/:userId/:device_id",
  verifyToken,
  verifyRole("vendor", "client"),
  validateUserId,
  updateProfile
);
router.post("/add-token", verifyToken, validateAddTokenRequestBody, addToken);
router.put(
  "/change-password",
  verifyToken,
  verifyRole("vendor", "client"),
  validateChangePassword,
  changePassword
);
router.get(
  "/get-categories-list",
  verifyToken,
  verifyRole("vendor", "client"),
  getCategoriesList
);
export default router;
